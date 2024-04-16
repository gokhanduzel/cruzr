import express from 'express';
import { sendMessage, getChatMessages, getAllChatsByUserId } from '../controllers/messageController';
import authenticate from '../middlewares/authenticate';

const router = express.Router();

// Route to send a new message
router.post('/send', authenticate, sendMessage);

router.get('/chat/:roomId', authenticate, getChatMessages)
// Route to get messages for a specific car listing
router.get('/chats/user', authenticate, getAllChatsByUserId);

export default router;
