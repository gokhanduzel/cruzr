import express from 'express';
import { getAllCars } from '../controllers/carController';

const router = express.Router();

router.get('/', getAllCars); 

export default router;
