import express from "express";
import authenticate from "../middlewares/authenticate";
import { createOffer } from "../controllers/offerController";

const router = express.Router();

// Routes
router.post("/createoffer", authenticate, createOffer);

export default router;
