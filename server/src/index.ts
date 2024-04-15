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
import offerRoutes from "./routes/offerRoutes";
import messageRoutes from "./routes/messageRoutes";
import Message from "./models/message";
import MessageThread from "./models/messageThread";
import Car from "./models/car";

dotenv.config(); // Load environment variables from .env file

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

const frontendOrigin = "http://localhost:5173";
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

// Attach io to the app to make it accessible in controllers
app.set("io", io);

// Inside your existing 'connection' event setup in index.ts
io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("joinRoom", (roomId) => {
    console.log(`Socket ${socket.id} is joining room ${roomId}`);
    socket.join(roomId);
  });

  socket.on("sendMessage", async ({ roomId, message, senderId, carId }) => {
  console.log("Received message for room:", roomId, "Message:", message);

  try {
    let thread = await MessageThread.findById(roomId);
    if (!thread) {
      const car = await Car.findById(carId); // Attempt to find the car.
      if (!car) {
        console.error(`Car with ID ${carId} not found.`);
        socket.emit("error", `Car with ID ${carId} not found.`);
        return; // Exit the function if no car is found.
      }

      console.log(`No existing thread found for room ID ${roomId}, creating a new one.`);
      thread = new MessageThread({
        _id: roomId,
        carId: carId,
        buyerId: senderId, // Sender is assumed to be the buyer when creating a new thread.
        sellerId: car.user, // The car's owner is the seller.
        messages: [],
      });
      await thread.save();
    }

    const newMessage = new Message({
      content: message,
      threadId: thread._id,
      senderId: senderId, // Sender could be either the buyer or the seller, depending on who is responding.
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
app.use("/api/offers", offerRoutes);
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
