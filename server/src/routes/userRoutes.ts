import express from 'express';
import { registerUser, loginUser, getAllUsers, getUserById, logoutUser } from '../controllers/userController';

const router = express.Router();

// Routes
router.get('/', getAllUsers);
router.get('/id/:id', getUserById);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

export default router;
