import { Request, Response } from "express";
import Car from "../models/car";
import CarMakeModel from "../models/carMakeModel";
import { ICar } from "../models/car";
import mongoose from "mongoose";

// Function to transform car document for response
const transformCarDocument = (car: ICar): any => {
  const transformedCar = car.toObject({ virtuals: true });

  if (transformedCar.make && typeof transformedCar.make === "object") {
    // Safely transform the make object to string if populated
    transformedCar.make = transformedCar.make.make;
  }

  return transformedCar;
};

export const getAllCars = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    let {
      make,
      model,
      yearMin,
      yearMax,
      mileageMin,
      mileageMax,
      priceMin,
      priceMax,
    } = req.query;

    let query: any = {};

    if (typeof make === "string" || make instanceof String) {
      const makeObjects = await CarMakeModel.find({
        make: { $regex: make as string, $options: "i" },
      });
      if (makeObjects.length > 0) {
        query.make = { $in: makeObjects.map((obj) => obj._id) };
      }
    }

    if (model) {
      query.carModel = model;
    }

    if (yearMin || yearMax) {
      query.year = {};
      if (yearMin) query.year.$gte = parseInt(yearMin as string);
      if (yearMax) query.year.$lte = parseInt(yearMax as string);
    }

    if (mileageMin || mileageMax) {
      query.mileage = {};
      if (mileageMin) query.mileage.$gte = parseInt(mileageMin as string);
      if (mileageMax) query.mileage.$lte = parseInt(mileageMax as string);
    }

    if (priceMin || priceMax) {
      query.price = {};
      if (priceMin) query.price.$gte = parseInt(priceMin as string);
      if (priceMax) query.price.$lte = parseInt(priceMax as string);
    }

    const cars = await Car.find(query).populate("make", "make -_id");
    const transformedCars = cars.map(transformCarDocument);
    res.json(transformedCars);
  } catch (err) {
    console.error("Error fetching cars:", err);
    res.status(500).send("Server Error");
  }
};

// Get user by carId
export const getUserByCarId = async (req: Request, res: Response) => {
  try {
    const car = await Car.findById(req.params.carId).select("user"); // Select only the user field

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }
    res.json(car.user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving user" });
  }
};

// Get a single car by id
export const getCarById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  try {
    const car = await Car.findById(id).populate("make", "make -_id"); // Populate the make name
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
  const { make, carModel, year, mileage, price, description, images } =
    req.body;

  if (!req.user) {
    return res.status(401).send("Unauthorized - user not found in request");
  }
  const userId = req.user.id;

  try {
    // Validate the make
    const carMakeModelDoc = await CarMakeModel.findById(make);
    if (!carMakeModelDoc) {
      return res.status(400).json({ message: "Invalid car make." });
    }

    if (!carMakeModelDoc.models.includes(carModel)) {
      return res
        .status(400)
        .json({ message: "Invalid model for the given make." });
    }

    const newCar = new Car({
      make,
      carModel,
      year,
      mileage,
      price,
      description,
      images,
      user: userId, // Linking the car to the user
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
  const { id } = req.params;

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
    const userCars = await Car.find({ user: userId }).populate(
      "make",
      "make -_id"
    );
    if (userCars.length === 0) {
      return res
        .status(404)
        .json({ message: "No car listings found for this user" });
    }

    // Transform each car document for the response
    const transformedCars = userCars.map(transformCarDocument);

    res.json(transformedCars);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const searchCars = async (req: Request, res: Response) => {
  const { keywords } = req.query;

  // Check if keywords is a string and not empty
  if (typeof keywords !== "string" || !keywords.trim()) {
    return res
      .status(400)
      .json({ message: "No search keywords provided or invalid format" });
  }

  try {
    // Create a text search query using the provided keywords
    const searchQuery = { $text: { $search: keywords } };
    const cars = await Car.find(searchQuery).populate({
      path: "make", // Assuming you want to pull in some details from the CarMakeModel, which is referenced in the make field
      select: "make", // Only selecting the 'make' field from the CarMakeModel document
    });

    res.json(cars);
  } catch (error) {
    console.error("Error during car search:", error);
    res.status(500).json({ message: "Error retrieving search results", error });
  }
};
