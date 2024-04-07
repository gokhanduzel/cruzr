import { Request, Response } from 'express';
import User from '../models/user'; // Adjust based on your file structure

export const checkAuthStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    // Assuming the authenticate middleware sets `req.user`
    const userId = req.user!.id;
    const user = await User.findById(userId).select('-password');

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({
      message: "User is authenticated",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        // Add any other user details you wish to return
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while verifying authentication status" });
  }
};
