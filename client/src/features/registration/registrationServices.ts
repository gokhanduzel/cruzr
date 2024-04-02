import axios from "axios";

const API_URL = "http://localhost:3000/api/users";

export const register = async (formData: any) => {
  const response = await axios.post(`${API_URL}/register`, formData);
  return response.data;
};

