import express from 'express';
import { getAllCarMakesModels } from '../controllers/carMakeModelController';

const router = express.Router();

router.get('/carmakemodel', getAllCarMakesModels);

export default router;
