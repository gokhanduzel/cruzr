import axios, { AxiosError } from "axios";

const API_USER_URL = `${import.meta.env.VITE_API_URL}/api/users`;
const API_AUTH_URL = `${import.meta.env.VITE_API_URL}/api/auth/`;

interface ApiErrorResponse {
  message: string; // Assuming your server error responses include a message field
}

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

export const fetchCurrentUserById = async () => {
  const response = await axios.get(`${API_USER_URL}/me`, {
    withCredentials: true,
  });
  return response.data;
};

export const fetchUserById = async (userId: string) => {
  try {
    const response = await axios.get(`${API_USER_URL}/user/${userId}`);

    if (response.status === 200 && response.data) {
      return response.data;
    } else {
      throw new Error("Unexpected response structure or status code");
    }
  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;

    if (axiosError.response) {
      console.error(
        "Error fetching user by ID:",
        axiosError.response.data?.message
      );
      throw new Error(
        axiosError.response.data?.message || "Failed to fetch user details"
      );
    } else {
      // This handles cases where the error might not be an AxiosError
      console.error("Error fetching user details:", axiosError.message);
      throw new Error("An error occurred while fetching user details");
    }
  }
};

export const checkAuthStatus = async () => {
  return axios.get(`${API_AUTH_URL}/status`, { withCredentials: true });
};

export const fetchToken = async () => {
  const response = await axios.get(`${API_AUTH_URL}/token`, {
    withCredentials: true,
  });
  return response.data.token;
};
