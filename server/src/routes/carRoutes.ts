import express from 'express';
import { getAllCars, getCarById } from '../controllers/carController';
import authenticate from '../middlewares/authenticate';

const router = express.Router();

// Routes
router.get('/', getAllCars);
router.get('/:id', getCarById);  
// router.post('/cars', authenticate, createCarListing);
// router.get('/cars', authenticate, getCarListings);

export default router;
