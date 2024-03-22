import { Request, Response, NextFunction } from 'express';

class AppError extends Error {
    constructor(message: string, public statusCode: number = 500) { // Default to 500
        super(message); 
    }
}

import express from 'express';
import dotenv from 'dotenv';
import connectDB from './database';
import carRoutes from './routes/carRoutes';
dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to database
connectDB(); 

// Basic Middleware
app.use(express.json()); 

// Routes
app.use('/api/cars', carRoutes); 

// Error Handling (Basic Example)
app.use((err: AppError, req: Request, res: Response, next: NextFunction) => { 
    console.error(err.stack); // Error stack is now accessible 
    res.status(err.statusCode).send(err.message); // Use AppError's statusCode
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
