import { Request, Response } from "express";
import Car from "../models/car";
import mongoose from "mongoose";

export const getAllCars = async (req: Request, res: Response) => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (err) {
    console.error((err as Error).message); // Cast err as an Error object
    res.status(500).send("Server Error");
  }
};

export const getCarById = async (req: Request, res: Response) => {
  const { id } = req.params;

  // Check if the ID is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  try {
    const car = await Car.findById(id);

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    res.json(car);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
