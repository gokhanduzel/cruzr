// ChatComponent.tsx
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addMessage,
  clearMessages,
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
import { selectCurrentUserDetails } from "../features/auth/authSlice";
import { MessageData } from "../types/message";

interface ChatComponentProps {
  roomId: string;
}

const ChatComponent: React.FC<ChatComponentProps> = ({ roomId }) => {
  const { messages } = useSelector(selectChat);
  const currentUser = useSelector(selectCurrentUserDetails);
  const dispatch = useDispatch();
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

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

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newMessage.trim() && currentUser && currentUser._id) {
      const messageData: MessageData = {
        roomId,
        message: newMessage,
        senderId: currentUser._id,
        carId: roomId,
      };

      sendSocketMessage(messageData);
      setNewMessage("");
    }
  };

  return (
    <div className="flex flex-col h-full max-w-md mx-auto bg-white rounded-lg shadow">
      <ul className="flex-grow overflow-auto p-4">
        {messages.map((msg, index) => (
          <li
            key={index}
            className={`p-2 my-1 text-sm rounded-lg ${
              msg.senderId === currentUser?._id
                ? "bg-blue-500 text-white self-end"
                : "bg-gray-200 self-start"
            }`}
          >
            {msg.content}
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
          className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 focus:outline-none"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatComponent;
