import React from 'react';
import ChatComponent from './Chat';
import { FaCar } from "react-icons/fa";

interface ChatModalProps {
  carId: string;
  roomId: string;
  handleClose: () => void;
}

const ChatModal: React.FC<ChatModalProps> = ({ roomId, carId, handleClose}) => {

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black opacity-80"></div>
      
      <div className="relative bg-white rounded-lg shadow-xl p-6 z-10 max-w-xl w-full">
        <p className='flex flex-row justify-center items-center'><FaCar />: Car owner</p>
        <button onClick={handleClose} className="absolute top-2 right-2 text-lg">
          &times;
        </button>
        <ChatComponent roomId={roomId} carId={carId} />
      </div>
    </div>
  );
};

export default ChatModal;
