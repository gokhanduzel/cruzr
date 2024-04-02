import mongoose from 'mongoose';
import 'dotenv/config'; // Load environment variables
console.log(process.env.MONGO_URI)
const connectDB = async (): Promise<void> => {
  console.log(process.env.MONGO_URI)
  try {
    console.log(process.env.MONGO_URI)
    const conn = await mongoose.connect(process.env.MONGO_URI!);
    console.log(process.env.MONGO_URI)
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export default connectDB;
