import Message from "../models/message";
import MessageThread from "../models/messageThread";
import Car from "../models/car";
import { Request, Response } from "express";

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
      threadId: thread._id // Useful if clients handle multiple threads
    });

    res.status(201).json({ message: "Message sent successfully", data: message });
  } catch (error) {
    res.status(400).json({ message: "Failed to send message", error });
  }
};

// Retrieve all messages related to a specific car listing
export const getMessagesForCar = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).send("Unauthorized - user not found in request");
  }

  const { carId } = req.params;

  try {
    // Find all threads related to the car and populate messages within each thread
    const threads = await MessageThread.find({ carId })
      .populate({
        path: "messages",
        populate: { path: "senderId", select: "username email" }, // Optionally populate sender details
      })
      .exec();

    if (!threads.length) {
      return res
        .status(404)
        .json({ message: "No message threads found for this car" });
    }

    res.status(200).json(threads);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve messages", error });
  }
};
