import axios from "axios";

const API_URL = "http://localhost:3000/api/messages";

// Function to fetch messages for a chat room
export const fetchChatMessages = async (roomId: string) => {
  const response = await axios.get(`${API_URL}/chat/${roomId}`, {
    withCredentials: true,
  });
  return response.data;
};
