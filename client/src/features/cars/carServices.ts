import axios from "axios";
import { CarData } from "../../types/car";

const API_URL = `${import.meta.env.VITE_API_URL}/api/cars`;

// Fetch all cars with optional filters
export const fetchAllCars = async (filters = {}) => {
  const query = new URLSearchParams(filters).toString();
  try {
    const response = await axios.get(`${API_URL}?${query}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching cars with filters:", error);
    throw error; // Re-throw the error to be handled by the calling function
  }
};

// Create a car listing with error handling
export const createCarListing = async (carData: CarData) => {
  try {
    const response = await axios.post(`${API_URL}/createcar`, carData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating car listing:", error);
    throw error; // Re-throw the error to be handled by the calling function
  }
};

// Delete a car listing by id
export const deleteCarListingById = async (id: string) => {
  try {
    const response = await axios.delete(`${API_URL}/deletecar/${id}`, {
      withCredentials: true,
    });
    return response.data; // or return a custom message or object if needed
  } catch (error) {
    console.error("Error deleting car listing:", error);
    throw error; // Re-throw the error to be handled by the calling function
  }
};

// Fetch cars by user ID with error handling
export const fetchCarsByUserId = async () => {
  try {
    const response = await axios.get(`${API_URL}/mycars`, {
      withCredentials: true,
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching user's cars:", error);
    throw error; // Re-throw the error to be handled by the calling function
  }
};

export const fetchUserByCarId = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/${id}/user`, {
      withCredentials: true,
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching userId by carId:", error);
    throw error; // Re-throw the error to be handled by the calling function
  }
};
