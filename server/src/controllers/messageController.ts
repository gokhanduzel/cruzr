import MessageThread from "../models/messageThread";
import { Request, Response } from "express";

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
      $or: [
        { buyerIds: userId }, 
        { sellerId: userId }
      ]
    }).populate("messages");
    console.log('CHAT SESSIONSSSS:', chatSessions)
    res.json(chatSessions);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving user's chat sessions", error });
  }
};

// Send a message
// export const sendMessage = async (req: Request, res: Response) => {
//   if (!req.user) {
//     return res.status(401).send("Unauthorized - user not found in request");
//   }

//   const { carId, content } = req.body;
//   const senderId = req.user.id;
//   const io = req.app.get("io"); // Accessing io from the app object

//   try {
//     const car = await Car.findById(carId);
//     if (!car) return res.status(404).json({ message: "Car not found" });

//     let thread = await MessageThread.findOne({
//       carId,
//       $or: [{ buyerId: senderId }, { sellerId: senderId }],
//     });

//     if (!thread) {
//       thread = new MessageThread({
//         carId,
//         buyerId: senderId,
//         sellerId: car.user,
//         messages: [],
//       });
//       await thread.save();
//     }

//     const message = new Message({
//       senderId,
//       content,
//       threadId: thread._id,
//     });

//     await message.save();
//     thread.messages.push(message._id);
//     await thread.save();

//     // Emit the message to the specific room (thread._id)
//     io.to(thread._id.toString()).emit("newMessage", {
//       senderId,
//       content,
//       createdAt: message.createdAt,
//       messageId: message._id, // Include message ID if clients need to reference it
//       threadId: thread._id, // Useful if clients handle multiple threads
//     });

//     res
//       .status(201)
//       .json({ message: "Message sent successfully", data: message });
//   } catch (error) {
//     res.status(400).json({ message: "Failed to send message", error });
//   }
// };