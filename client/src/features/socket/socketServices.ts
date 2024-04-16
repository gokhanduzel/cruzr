import { io, Socket } from "socket.io-client";
import { MessageData } from "../../types/message";

let socket: Socket; // Use Socket type from socket.io-client

export const initiateSocketConnection = (token: string) => {
  socket = io("http://localhost:3000", {
    query: { token },
    transports: ["websocket"],
  });

  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
  });

  socket.on("connect_error", (err) => {
    console.error("Connection Error:", err);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) socket.disconnect();
};

export const joinRoom = (roomId: string) => {
  if (socket) socket.emit("joinRoom", roomId);
};

export const leaveRoom = (roomId: string) => {
  if (socket) socket.emit("leaveRoom", roomId);
};

// Use the interface to type the function parameters
export const sendMessage = (data: MessageData) => {
  if (socket && data.roomId && data.message && data.senderId && data.carId) {
    console.log("Sending message", data);
    socket.emit("sendMessage", data);
  }
};

export const subscribeToMessages = (callback: (message: any) => void) => {
  if (!socket) return;

  // Remove existing listener before adding a new one to prevent duplicates
  socket.off("newMessage", callback);
  socket.on("newMessage", callback);
};

export const unsubscribeFromMessages = (callback: (message: any) => void) => {
  if (socket) {
    socket.off("newMessage", callback);
  }
};
