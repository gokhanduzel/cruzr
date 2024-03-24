import express from "express";
import {
  createCarListing,
  getAllCars,
  getCarById,
} from "../controllers/carController";
import authenticate from "../middlewares/authenticate";

const router = express.Router();

// Routes
router.get("/", getAllCars);
router.get("/:id", getCarById);
router.post("/cars", authenticate, createCarListing);


export default router;
