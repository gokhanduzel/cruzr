import axios from "axios";
import { CarData } from "../../types/car";

const API_URL = "http://localhost:3000/api/cars";

// Create a car listing with error handling
export const createCarListing = async (carData: CarData) => {
  try {
    const response = await axios.post(`${API_URL}/createcar`, carData, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("Error creating car listing:", error);
    throw error; // Re-throw the error to be handled by the calling function
  }
};

// Fetch cars by user ID with error handling
export const fetchCarsByUserId = async () => {
  try {
    const response = await axios.get(`${API_URL}/mycars`, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("Error fetching user's cars:", error);
    throw error; // Re-throw the error to be handled by the calling function
  }
};
