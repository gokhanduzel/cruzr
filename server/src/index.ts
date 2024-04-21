import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import express, { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./database";
import carRoutes from "./routes/carRoutes";
import userRoutes from "./routes/userRoutes";
import carMakeModelRoutes from "./routes/carMakeModelRoutes";
import authenticateRoutes from "./routes/authenticateRoutes";
import messageRoutes from "./routes/messageRoutes";
import Message from "./models/message";
import MessageThread from "./models/messageThread";
import Car from "./models/car";
import path = require("path");

dotenv.config(); //environment variables from .env file

class AppError extends Error {
  constructor(message: string, public statusCode: number = 500) {
    super(message);
  }
}

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 3000;

// Connect to database
connectDB();

// Middleware
app.use(express.json());
app.use(cookieParser());

const frontendOrigin = process.env.FRONTEND_ORIGIN || "http://localhost:5173";
app.use(
  cors({
    origin: frontendOrigin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const io = new SocketIOServer(httpServer, {
  cors: {
    origin: frontendOrigin,
    methods: ["GET", "POST"],
  },
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("joinRoom", (roomId) => {
    console.log(`Socket ${socket.id} is joining room ${roomId}`);
    socket.join(roomId);
  });

  socket.on("sendMessage", async ({ roomId, message, senderId, carId }) => {
  console.log("Received message for room:", roomId, "Message:", message);

  try {
    let thread = await MessageThread.findOne({ roomId: roomId });
    if (!thread) {
      const car = await Car.findById(carId); // Attempt to find the car.
      if (!car) {
        console.error(`Car with ID ${carId} not found.`);
        socket.emit("error", `Car with ID ${carId} not found.`);
        return; // Exit the function if no car is found.
      }

      console.log(`No existing thread found for room ID ${roomId}, creating a new one.`);
      thread = new MessageThread({
        roomId: roomId,
        carId: carId,
        buyerIds: [senderId], // Sender is assumed to be the buyer when creating a new thread.
        sellerId: car.user, // The car's owner is the seller.
        messages: [],
      });
      await thread.save();
    } else {
      // Check if sender is already a buyer or the seller
      if (!thread.buyerIds.includes(senderId) && thread.sellerId.toString() !== senderId) {
        thread.buyerIds.push(senderId); // Add new buyer if not already included
        await thread.save();
        console.log(`Added new buyer ${senderId} to room ${roomId}`);
      }
    }

    const newMessage = new Message({
      content: message,
      threadId: thread._id,
      senderId: senderId,
    });
    await newMessage.save();
    thread.messages.push(newMessage._id);
    await thread.save();

    // Emit the message to all clients in the same room
    io.to(roomId).emit("newMessage", {
      content: message,
      senderId: senderId,
      createdAt: newMessage.createdAt,
      _id: newMessage._id,
    });
  } catch (error) {
    console.error("Error handling sendMessage:", error);
    socket.emit("error", "Message processing failed.");
  }
});

  socket.on("messageCreationSuccess", (message) => {
    console.log("Message was created successfully:", message);
  });

  socket.on("messageCreationError", (error) => {
    console.error("Failed to create message:", error);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

// Routes
app.use("/api/cars", carRoutes);
app.use("/api/users", userRoutes);
app.use("/api/makemodel", carMakeModelRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/auth", authenticateRoutes);

// Error Handling
app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  const responseMessage =
    process.env.NODE_ENV === "production"
      ? "An error occurred, please try again later."
      : err.message;
  res.status(err.statusCode).send(responseMessage);
});

// Start Server
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
