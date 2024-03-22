import { Request, Response } from 'express';
import Car from '../models/car';

export const getAllCars = async (req: Request, res: Response) => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (err) {
    console.error((err as Error).message); // Cast err as an Error object
    res.status(500).send('Server Error');
  }
}