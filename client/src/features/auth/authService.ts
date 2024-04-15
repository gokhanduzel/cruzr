import axios from "axios";

const API_USER_URL = "http://localhost:3000/api/users";
const API_AUTH_URL = 'http://localhost:3000/api/auth/';

export const login = async (email: string, password: string) => {
  const response = await axios.post(
    `${API_USER_URL}/login`,
    { email, password },
    { withCredentials: true }
  );
  return response.data;
};

export const logout = async () => {
  await axios.post(`${API_USER_URL}/logout`, {}, { withCredentials: true });
};

export const fetchUserById = async () => {
  const response = await axios.get(`${API_USER_URL}/me`, { withCredentials: true });
  return response.data;
};

export const checkAuthStatus = async () => {
  return axios.get(`${API_AUTH_URL}/status`, { withCredentials: true });
};

export const fetchToken = async () => {
  const response = await axios.get(`${API_AUTH_URL}/token`, { withCredentials: true });
  return response.data.token; 
};

