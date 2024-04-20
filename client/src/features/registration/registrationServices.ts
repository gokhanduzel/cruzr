import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/users`;

export const register = async (formData: any) => {
  const response = await axios.post(`${API_URL}/register`, formData);
  return response.data;
};

