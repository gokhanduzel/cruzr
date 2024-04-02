import axios from "axios";

const API_URL = "http://localhost:3000/api/users";

export const login = async (email: string, password: string) => {
  const response = await axios.post(
    `${API_URL}/login`,
    { email, password },
    { withCredentials: true }
  );
  return response.data;
};


export const logout = async () => {
  await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
};
