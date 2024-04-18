import express from "express";
import {
  registerUser,
  loginUser,
  getAllUsers,
  getCurrentUserById,
  logoutUser,
  getUserById,
} from "../controllers/userController";
import authenticate from "../middlewares/authenticate";

const router = express.Router();

// Routes
router.get("/", getAllUsers);
router.get("/me", authenticate, getCurrentUserById);
router.get("/user/:userId", getUserById);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

export default router;
