import { Request, Response } from "express";
import User from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";
import mongoose from "mongoose";

// Get all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).send("Server Error");
  }
};

export const getCurrentUserById = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).send("Unauthorized - user not found in request");
  }

  const userId = req.user.id;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }
  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId, "username");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ username: user.username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// User Registration
export const registerUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const user = await User.create({ username, email, password });
    res
      .status(201)
      .json({ message: "User created successfully", userId: user._id });
  } catch (error) {
    res.status(500).json({
      message: "Error registering user",
      error: (error as Error).message,
    });
  }
};

const isSafari = (userAgent: string): boolean => {
  return userAgent.includes("Safari") && !userAgent.includes("Chrome");
};

// User Login
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const userAgent = req.headers["user-agent"] || "";
  const useSecure =
    process.env.NODE_ENV === "production" || !isSafari(userAgent);

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "60m" }
    );
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN_SECRET as string,
      { expiresIn: "7d" }
    );

    // Update the user document with the new refresh token
    await User.findByIdAndUpdate(user._id, { refreshToken });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: useSecure,
      sameSite: isSafari(userAgent) ? 'lax' : 'none',
      path: "/",
      maxAge: 1800000, // 30 minutes
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: useSecure,
      sameSite: isSafari(userAgent) ? 'lax' : 'none',
      path: "/",
      maxAge: 604800000, // 7 days
    });

    console.log("accessToken:", accessToken);
    console.log("refreshToken:", refreshToken);

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// User logout
export const logoutUser = async (req: Request, res: Response) => {
  const userAgent = req.headers['user-agent'] || '';
  const useSecure = process.env.NODE_ENV === "production" || !isSafari(userAgent);

  // Clear the accessToken cookie
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: useSecure,
    sameSite: isSafari(userAgent) ? 'lax' : 'none',
    path: "/",
    maxAge: 0  // Expire immediately
  });
  // If using refresh tokens, clear that cookie as well
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: useSecure,
    sameSite: isSafari(userAgent) ? 'lax' : 'none',
    path: "/",
    maxAge: 0  // Expire immediately
  });

  res.json({ message: "Logout successful" });
};
