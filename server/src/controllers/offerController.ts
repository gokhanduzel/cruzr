import { Request, Response } from "express";
import Car from "../models/car";
import Offer from "../models/offer";

// Create an offer
export const createOffer = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(403).json({ message: "Not authorized" });
  }

  const { carId, offerAmount } = req.body;
  const offererUserId = req.user.id;

  // Fetch car to get the owner's ID
  const car = await Car.findById(carId);
  if (!car) {
    return res.status(404).json({ message: "Car not found" });
  }

  try {
    const newOffer = new Offer({
      carId,
      offererUserId,
      receiverUserId: car.user, // Assuming 'user' is the field in Car schema holding the owner's ID
      offerAmount,
      status: "pending",
    });

    await newOffer.save();
    res
      .status(201)
      .json({ message: "Offer created successfully", offer: newOffer });
  } catch (error) {
    res.status(400).json({ message: "Failed to create offer", error });
  }
};
