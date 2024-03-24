import { Request, Response } from "express";
import Car from "../models/car";
import mongoose from "mongoose";

// Get all cars
export const getAllCars = async (req: Request, res: Response) => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (err) {
    console.error((err as Error).message); // Cast err as an Error object
    res.status(500).send("Server Error");
  }
};

// Get a single car by id
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Create a car listing
export const createCarListing = async (req: Request, res: Response) => {
  const { make, model, year, mileage, price, condition, description, images } =
    req.body;
  console.log(req);
  if (!req.user) {
    return res.status(401).send("Unauthorized - user not found in request");
  }
  const userId = req.user.id; // Assuming the authenticate middleware has already added `user` to `req`

  try {
    const newCar = new Car({
      make,
      model,
      year,
      mileage,
      price,
      condition,
      description,
      images,
      user: userId, // Link the car to the user who is creating it
    });

    const savedCar = await newCar.save();
    res.status(201).json(savedCar);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create car listing" });
  }
};
