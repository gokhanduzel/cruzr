import { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import express from 'express';
import dotenv from 'dotenv';
import cors from "cors";
import connectDB from './database';
import carRoutes from './routes/carRoutes';
import userRoutes from './routes/userRoutes';
dotenv.config(); // Load environment variables from .env file

class AppError extends Error {
    constructor(message: string, public statusCode: number = 500) { // Default to 500
        super(message); 
    }
}

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to database
connectDB(); 

// Basic Middleware
app.use(express.json());

// Use cookie-parser middleware
app.use(cookieParser());

const frontendOrigin = 'http://localhost:5173';

app.use(cors({
    origin: frontendOrigin, // Allow your frontend domain
    credentials: true, // Allow cookies to be sent
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify which HTTP methods are allowed
    allowedHeaders: ['Content-Type', 'Authorization'], // Specify which headers are allowed
  }));

// Routes
app.use('/api/cars', carRoutes); 
app.use('/api/users', userRoutes);

// Error Handling (Basic Example)
app.use((err: AppError, req: Request, res: Response, next: NextFunction) => { 
    console.error(err.stack); // Error stack is now accessible 
    res.status(err.statusCode).send(err.message); // Use AppError's statusCode
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
