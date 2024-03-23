import mongoose from "mongoose";
import Car from "../models/car";
import User from "../models/user";
import connectDB from "../database";

const updateCarPosters = async () => {
  await connectDB(); // Connect to MongoDB

  // Find your test user by username or email
  const testUser = await User.findOne({ email: "test@example.com" });

  if (!testUser) {
    console.log("Test user not found");
    // Close database connection
    await mongoose.disconnect();
    // Any other cleanup here
    process.exit(1);
  }

  // Update all car listings to reference the test user's ID
  const result = await Car.updateMany({}, { $set: { user: testUser._id } });

  console.log(`Updated ${result.modifiedCount} car listings.`);
  process.exit();
};

updateCarPosters().catch(console.error);
