// ChatComponent.tsx
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addMessage,
  clearMessages,
  fetchMessages,
  selectChat,
  setRoomId,
} from "../features/chat/chatSlice";
import {
  joinRoom,
  leaveRoom,
  sendMessage as sendSocketMessage,
  subscribeToMessages,
  unsubscribeFromMessages, // Make sure you have this function implemented
} from "../features/socket/socketServices";
import {
  fetchUserDetailsById,
  selectCurrentUserDetails,
  selectUserDetailsById,
} from "../features/auth/authSlice";
import { MessageData } from "../types/message";
import { AppDispatch, RootState } from "../app/store";
import { fetchUserByCarId, selectCarOwner } from "../features/cars/carSlice";
import { FaCar } from "react-icons/fa";

interface ChatComponentProps {
  roomId: string;
  carId: string;
}

const ChatComponent: React.FC<ChatComponentProps> = ({ roomId, carId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { messages } = useSelector(selectChat);
  const currentUser = useSelector(selectCurrentUserDetails);
  const ownerId = useSelector(selectCarOwner);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const usernames = useSelector((state: RootState) =>
    messages.reduce((acc, msg) => {
      acc[msg.senderId] =
        selectUserDetailsById(state, msg.senderId)?.username || "Loading...";
      return acc;
    }, {} as { [key: string]: string })
  );

  useEffect(() => {
    const userIds = new Set(messages.map((msg) => msg.senderId));
    userIds.forEach((userId) => {
      dispatch(fetchUserDetailsById(userId));
    });
  }, [dispatch, messages]);

  useEffect(() => {
    if (roomId) {
      dispatch(fetchMessages(roomId));
    }
  }, [roomId, dispatch]);

  useEffect(() => {
    dispatch(setRoomId(roomId));
    joinRoom(roomId);

    const messageSubscription = (message: any) => {
      dispatch(addMessage(message));
    };

    subscribeToMessages(messageSubscription);

    return () => {
      leaveRoom(roomId);
      unsubscribeFromMessages(messageSubscription); // Unsubscribe to clean up
      dispatch(clearMessages());
    };
  }, [dispatch, roomId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    dispatch(fetchUserByCarId(carId)); // Fetch the car owner's ID
  }, [carId, dispatch]);

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newMessage.trim() && currentUser && currentUser._id) {
      const messageData: MessageData = {
        roomId: roomId,
        message: newMessage,
        senderId: currentUser._id,
        carId: carId,
      };

      sendSocketMessage(messageData);
      setNewMessage("");
    }
  };

  const formatDate = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    return `${date.getHours()}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")} - ${date.toDateString()}`;
  };

  return (
    <div className="flex flex-col h-full max-w-md mx-auto bg-white rounded-lg shadow">
      <ul className="flex-grow overflow-auto p-4">
        {messages.map((msg, index) => (
          <li
            key={index}
            className={`p-2 my-1 text-sm rounded-lg max-w-[80%] ${
              msg.senderId === currentUser?._id
                ? "bg-indigo-500 text-white ml-auto" // Current user's messages on the right
                : msg.senderId === ownerId
                ? "bg-orange-500 text-black mr-auto" // Car owner's messages on the left if not the current user
                : "bg-gray-200 mr-auto" // Other users' messages on the left
            }`}
          >
            <div className="flex flex-row items-center">
              {msg.senderId === ownerId ? <FaCar className="mr-1" /> : null}
              <strong>{usernames[msg.senderId]}:</strong> {msg.content}
            </div>
            <div className="text-xs text-black-500 text-right mt-1">
              {formatDate(msg.createdAt)}
            </div>
          </li>
        ))}
        <div ref={messagesEndRef} />
      </ul>
      <form
        onSubmit={handleSendMessage}
        className="p-4 border-t border-gray-200 flex"
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          className="bg-indigo-500 text-white px-4 py-2 rounded-r-lg hover:bg-indigo-700 transition duration-300 focus:outline-none"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatComponent;
