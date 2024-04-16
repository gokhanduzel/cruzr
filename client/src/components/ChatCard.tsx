import React from 'react';
import { useDispatch } from 'react-redux';
import { openModal } from '../features/modal/modalSlice';  // Ensure you have this action if using a modal system

interface ChatCardProps {
  chatSession: {
    roomId: string;
    carId: string;
    lastMessage: string;
    lastMessageTime: Date;
    otherParticipant: string;  // This should be adapted based on your user model
  };
}

const ChatCard: React.FC<ChatCardProps> = ({ chatSession }) => {
  const dispatch = useDispatch();

  const handleOpenChat = () => {
    // Dispatch action to open the chat modal
    dispatch(openModal({
      content: 'chat',
      carId: chatSession.carId,
    }));
  };

  const isValidDate = chatSession.lastMessageTime instanceof Date && !isNaN(chatSession.lastMessageTime.getTime());

  const displayTime = isValidDate
    ? chatSession.lastMessageTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : "N/A";

  return (
    <div className="p-4 border-2 cursor-pointer" onClick={handleOpenChat}>
      <div className="flex justify-between">
        <div>
          <h4 className="font-bold text-gray-800">{chatSession.otherParticipant}</h4>
          <p className="text-gray-600">{chatSession.lastMessage}</p>
        </div>
        <span className="text-gray-500 text-sm">{displayTime}</span>
      </div>
    </div>
  );
};

export default ChatCard;
