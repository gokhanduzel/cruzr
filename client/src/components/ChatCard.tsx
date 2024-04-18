import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { openModal } from '../features/modal/modalSlice';
import { fetchUserDetailsById, selectUserDetailsById } from '../features/auth/authSlice';
import { AppDispatch, RootState } from '../app/store';

interface Message {
  senderId: string;
  content: string;
  threadId: string;
}

interface ChatCardProps {
  chatSession: {
    roomId: string;
    carId: string;
    messages: Message[];
  };
}

const ChatCard: React.FC<ChatCardProps> = ({ chatSession }) => {
  const dispatch = useDispatch<AppDispatch>();
  const lastMessage = chatSession.messages[chatSession.messages.length - 1];
  const senderId = lastMessage?.senderId;

  useEffect(() => {
    if (senderId) {
      dispatch(fetchUserDetailsById(senderId));
    }
  }, [dispatch, senderId]);

  const senderUsername = useSelector((state: RootState) => selectUserDetailsById(state, senderId));
  const isLoading = useSelector((state: RootState) => state.auth.isLoadingUserDetailsById[senderId]);
  const error = useSelector((state: RootState) => state.auth.userDetailsErrorsById[senderId]);

  const handleOpenChat = () => {
    dispatch(openModal({
      content: 'chat',
      carId: chatSession.carId,
    }));
  };

  if (isLoading) {
    return <div>Loading user details...</div>;
  }

  if (error) {
    return <div>Error fetching user details: {error}</div>;
  }

  return (
    <div className="p-4 border-2 cursor-pointer" onClick={handleOpenChat}>
      <div className="flex justify-between">
        <div>
          <h4 className="font-bold text-gray-800">Chat Details</h4>
          <p>Last message: {lastMessage?.content}</p>
          <p>From: {senderUsername ? senderUsername.username : 'User not found'}</p>
        </div>
        <span className="text-gray-500 text-sm">Open Chat</span>
      </div>
    </div>
  );
};

export default ChatCard;
