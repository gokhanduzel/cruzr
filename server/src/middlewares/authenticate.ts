import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

interface DecodedToken {
  id: string;
}

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies['accessToken'];

  if (!token) {
    return res.sendStatus(401); // No token provided
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err: any, decoded: any) => {
    if (err) {
      console.log('Token verification error:', err);
      return res.sendStatus(403); // Invalid token
    }

    const decodedToken = decoded as DecodedToken;

    // Convert string ID to MongoDB ObjectId
    const userId = new mongoose.Types.ObjectId(decodedToken.id);
    
    // Assigning the user information to `req.user`. Note that you're now storing an ObjectId
    // instead of a string. Adjust your usage accordingly, or store it as a string if that fits your use case better.
    req.user = { id: userId };

    next();
  });
};

export default authenticate;
