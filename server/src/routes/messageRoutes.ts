import express from 'express';
import { sendMessage, getMessagesForCar } from '../controllers/messageController';
import authenticate from '../middlewares/authenticate';

const router = express.Router();

// Route to send a new message
router.post('/send', authenticate, sendMessage);

// Route to get messages for a specific car listing
router.get('/messages/:carId', authenticate, getMessagesForCar);

export default router;
