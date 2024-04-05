import axios from "axios";
import { CarData } from "../../types/car";

const API_URL = "http://localhost:3000/api/cars";

//create a car listing
export const createCarListing = async (carData: CarData) => {
  const response = await axios.post(`${API_URL}/createcar`, carData, { withCredentials: true });
  return response.data;
};

