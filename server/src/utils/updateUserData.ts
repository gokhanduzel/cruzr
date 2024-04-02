import mongoose from 'mongoose';
import User from "../models/user";
import connectDB from '../database'; // Your database connection function
import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file


// Connect to the database
connectDB()
  .then(async () => {
    // Find the user you want to update by some identifier, such as email
    const user = await User.findOne({ email: 'newemail@example.com' });

    if (!user) {
      console.log('User not found');
      return;
    }

    // Update the user data
    user.username = 'test';
    user.email = 'test@example.com';

    // Save the updated user
    await user.save();

    console.log('User updated successfully');
  })
  .catch((error: any) => {
    console.error('Error connecting to the database:', error);
    process.exit(1);
  });
