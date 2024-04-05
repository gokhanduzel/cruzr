import mongoose from 'mongoose';
import 'dotenv/config'; 
import connectDB from './database'; // Path to your connectDB file
import CarMakeModel from './models/carMakeModel'; // Path to your schema file
import { carMakesModels } from './utils/carMakesModelsData'; 

const seedDatabase = async () => {
    try {
        await connectDB();
        await CarMakeModel.deleteMany({}); // Clear existing data (Optional)
        await CarMakeModel.insertMany(carMakesModels); 
        console.log('Database seeded with car make and model data');
        mongoose.connection.close(); // Close connection
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
