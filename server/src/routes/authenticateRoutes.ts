// src/routes/authRoutes.js
import express from 'express';
import { checkAuthStatus, getToken } from '../controllers/authenticateController'; 
import authenticate from "../middlewares/authenticate";

const router = express.Router();

// Routes
router.get('/status', authenticate, checkAuthStatus);
router.get('/token', authenticate, getToken); 

export default router;
