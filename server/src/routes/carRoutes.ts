import express from "express";
import {
  createCarListing,
  deleteCarListing,
  getAllCars,
  getCarById,
  getCarsByUser,
  getUserByCarId,
  searchCars
} from "../controllers/carController";
import authenticate from "../middlewares/authenticate";

const router = express.Router();

// Routes
router.get("/mycars", authenticate, getCarsByUser);
router.get("/", getAllCars);
router.get("/id/:id", getCarById);
router.get("/:carId/user", authenticate, getUserByCarId);
router.get("/search/", searchCars);
router.post("/createcar", authenticate, createCarListing);
router.delete("/deletecar/:id", authenticate, deleteCarListing);


export default router;
