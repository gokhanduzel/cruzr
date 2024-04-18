import Message from "../models/message";
import MessageThread from "../models/messageThread";
import Car from "../models/car";
import { Request, Response } from "express";
import { generateRoomId } from "../utils/generateRoomId";

// Send a message
export const sendMessage = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).send("Unauthorized - user not found in request");
  }

  const { carId, content } = req.body;
  const senderId = req.user.id;
  const io = req.app.get("io"); // Accessing io from the app object

  try {
    const car = await Car.findById(carId);
    if (!car) return res.status(404).json({ message: "Car not found" });

    let thread = await MessageThread.findOne({
      carId,
      $or: [{ buyerId: senderId }, { sellerId: senderId }],
    });

    if (!thread) {
      thread = new MessageThread({
        carId,
        buyerId: senderId,
        sellerId: car.user,
        messages: [],
      });
      await thread.save();
    }

    const message = new Message({
      senderId,
      content,
      threadId: thread._id,
    });

    await message.save();
    thread.messages.push(message._id);
    await thread.save();

    // Emit the message to the specific room (thread._id)
    io.to(thread._id.toString()).emit("newMessage", {
      senderId,
      content,
      createdAt: message.createdAt,
      messageId: message._id, // Include message ID if clients need to reference it
      threadId: thread._id, // Useful if clients handle multiple threads
    });

    res
      .status(201)
      .json({ message: "Message sent successfully", data: message });
  } catch (error) {
    res.status(400).json({ message: "Failed to send message", error });
  }
};

// Get Chat Messages
export const getChatMessages = async (req: Request, res: Response) => {
  const { roomId } = req.params;
  try {
    const thread = await MessageThread.findOne({ roomId }).populate("messages");
    if (!thread) {
      return res
        .status(404)
        .json({ message: "No messages found for this room." });
    }
    res.json(thread.messages); // Send back the messages.
  } catch (error) {
    console.error("Failed to retrieve messages:", error);
    res.status(500).json({ message: "Error retrieving messages." });
  }
};

// Get all chat sessions for user
export const getAllChatsByUserId = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).send("Unauthorized - user not found in request");
  }

  const userId = req.user.id;
  try {
    const chatSessions = await MessageThread.find({
      $or: [{ buyerId: userId }, { sellerId: userId }],
    }).populate("messages");
    console.log('CHAT SESSIONSSSS:', chatSessions)
    res.json(chatSessions);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving user's chat sessions", error });
  }
};

export const getOrCreateChatRoom = async (req: Request, res: Response) => {
  const { carId, userId } = req.params;

  try {
    const car = await Car.findById(carId).populate('user').lean(); 
    if (!car) {
      return res.status(404).send('Car not found');
    }

    // Determine roles based on who is the owner
    const carOwnerId = car.user.toString(); 
    const isCurrentUserSeller = carOwnerId === userId;
    const buyerId = isCurrentUserSeller ? undefined : userId;
    const sellerId = isCurrentUserSeller ? userId : carOwnerId;

    let chatSession = await MessageThread.findOne({
      carId,
      $or: [
        { buyerId: buyerId, sellerId: sellerId },
        { buyerId: sellerId, sellerId: buyerId } // In case roles got reversed in records
      ]
    });

    // If no session exists, create a new one
    if (!chatSession) {
      chatSession = new MessageThread({
        roomId: generateRoomId(carId, buyerId, sellerId),
        carId,
        buyerId,
        sellerId
      });
      await chatSession.save();
    }

    res.json({ roomId: chatSession.roomId });
  } catch (error) {
    console.error("Error in fetching/creating chat room:", error);
    res.status(500).send('Error fetching or creating chat room');
  }
};

// Retrieve all messages related to a specific car listing
// export const getMessagesForCar = async (req: Request, res: Response) => {
//   if (!req.user) {
//     return res.status(401).send("Unauthorized - user not found in request");
//   }

//   const { carId } = req.params;

//   try {
//     // Find all threads related to the car and populate messages within each thread
//     const threads = await MessageThread.find({ carId })
//       .populate({
//         path: "messages",
//         populate: { path: "senderId", select: "username email" }, // Optionally populate sender details
//       })
//       .exec();

//     if (!threads.length) {
//       return res
//         .status(404)
//         .json({ message: "No message threads found for this car" });
//     }

//     res.status(200).json(threads);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to retrieve messages", error });
//   }
// };
