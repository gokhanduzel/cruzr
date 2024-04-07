import { Request, Response } from "express";
import Car from "../models/car";
import CarMakeModel from "../models/carMakeModel";
import { ICar } from "../models/car";
import mongoose from "mongoose";

// Function to transform car document for response
const transformCarDocument = (car: ICar): any => {
  const transformedCar = car.toObject({ virtuals: true });

  if (transformedCar.make && typeof transformedCar.make === 'object') {
    // Safely transform the make object to string if populated
    transformedCar.make = transformedCar.make.make;
  }

  return transformedCar;
};

// Use this function in your controller when preparing cars for response
export const getAllCars = async (req: Request, res: Response): Promise<void> => {
  try {
    const cars = await Car.find().populate('make', 'make -_id');
    const transformedCars = cars.map(transformCarDocument);
    res.json(transformedCars);
  } catch (err) {
    console.error("Error fetching cars:", err);
    res.status(500).send("Server Error");
  }
};

// Get a single car by id
export const getCarById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  try {
    const car = await Car.findById(id).populate('make', 'make -_id'); // Populate the make name
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
  const { make, carModel, year, mileage, price, description, images } = req.body;

  if (!req.user) {
    return res.status(401).send("Unauthorized - user not found in request");
  }
  const userId = req.user.id; // Assuming the authenticate middleware has already added `user` to `req`

  try {
    // Validate the make
    const carMakeModelDoc = await CarMakeModel.findById(make);
    if (!carMakeModelDoc) {
      return res.status(400).json({ message: "Invalid car make." });
    }

    // Optionally, validate the model (now carModel) against the models array in CarMakeModel if necessary
    if (!carMakeModelDoc.models.includes(carModel)) {
      return res.status(400).json({ message: "Invalid model for the given make." });
    }

    const newCar = new Car({
      make, // This is now an ObjectId referencing a CarMakeModel document
      carModel, // Ensure this matches the property name in your Car schema
      year,
      mileage,
      price,
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

// Delete a car listing
export const deleteCarListing = async (req: Request, res: Response) => {
  const { id } = req.params; // Assuming the car ID is passed as a URL parameter

  if (!req.user) {
    return res.status(401).send("Unauthorized - user not found in request");
  }

  try {
    const car = await Car.findById(id);
    if (!car) {
      return res.status(404).json({ message: "Car listing not found" });
    }

    // Ensure both IDs are compared as strings
    if (car.user.toString() !== req.user.id.toString()) {
      return res
        .status(403)
        .json({ message: "User not authorized to delete this car listing" });
    }

    await Car.deleteOne({ _id: id });
    res.status(200).json({ message: "Car listing deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete car listing" });
  }
};

// Get cars by user
export const getCarsByUser = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).send("Unauthorized - User not recognized");
  }
  const userId = req.user.id;

  try {
    const userCars = await Car.find({ user: userId }).populate('make', 'make -_id'); // Populate the make name
    if (userCars.length === 0) {
      return res.status(404).json({ message: "No car listings found for this user" });
    }
    res.json(userCars);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

