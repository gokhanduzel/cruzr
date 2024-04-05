import { Request, Response } from 'express';
import CarMakeModel from '../models/carMakeModel'; // Ensure this model is correctly typed


// Get all car makes and models
export const getAllCarMakesModels = async (req: Request, res: Response): Promise<void> => {
  try {
    const carMakeModels = await CarMakeModel.find({});
    res.json(carMakeModels);
  } catch (error) {
    console.error('Failed to fetch car makes and models:', error);
    res.status(500).json({ message: 'Server error' });
  }
};