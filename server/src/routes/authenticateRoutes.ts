// src/routes/authRoutes.js
import express from 'express';
import { checkAuthStatus } from '../controllers/authenticateController'; 
import authenticate from "../middlewares/authenticate";

const router = express.Router();

router.get('/status', authenticate, checkAuthStatus);

export default router;
