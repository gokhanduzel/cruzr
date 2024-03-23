import express from 'express';
import { registerUser, loginUser, getAllUsers, getUserById } from '../controllers/userController';

const router = express.Router();

// Routes
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;
