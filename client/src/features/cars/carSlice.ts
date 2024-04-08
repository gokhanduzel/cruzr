import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import {
  createCarListing as createCarListingService,
  fetchCarsByUserId,
  fetchAllCars,
} from "./carServices";
import { CarData } from "../../types/car";

// Extending the state to handle the fetched cars
interface CarState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  message: string | null;
  userCars: CarData[];
  allCars: CarData[]; // New state property for all cars
}

const initialState: CarState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: null,
  userCars: [],
  allCars: [], // Initialize the new state property
};

export const createCarListing = createAsyncThunk(
  "cars/createCarListing",
  async (carData: any, { rejectWithValue }) => {
    try {
      const data = await createCarListingService(carData);
      return data;
    } catch (error: any) {
      let message = error.toString();
      if (error.response && error.response.data && error.response.data.message) {
        message = error.response.data.message;
      }
      return rejectWithValue(message);
    }
  }
);

export const fetchUserCars = createAsyncThunk(
  "cars/fetchUserCars",
  async (_, thunkAPI) => {
    try {
      const data = await fetchCarsByUserId();
      return data;
    } catch (error: any) {
      const message = (error as any)?.response?.data?.message ?? "An unknown error occurred";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchCarsWithFilters = createAsyncThunk(
  "cars/fetchCarsWithFilters",
  async (filters: Record<string, any>, { rejectWithValue }) => {
    try {
      const cars = await fetchAllCars(filters);
      return cars;
    } catch (error: any) {
      const message = error.response?.data?.message ?? "An unknown error occurred";
      return rejectWithValue(message);
    }
  }
);

const carSlice = createSlice({
  name: "car",
  initialState,
  reducers: {
    resetCarState: (state) => initialState,
  },
  extraReducers: (builder) => {
    // Handling existing actions...
    builder
      // Handling fetchCarsWithFilters actions
      .addCase(fetchCarsWithFilters.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCarsWithFilters.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.allCars = action.payload;
      })
      .addCase(fetchCarsWithFilters.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      });
  },
});

export const { resetCarState } = carSlice.actions;

// Selector to access the car slice state
export const selectCarState = (state: RootState) => state.car;

// Selector to access the user's cars
export const selectUserCars = (state: RootState) => state.car.userCars;

// Selector to access all cars
export const selectAllCars = (state: RootState) => state.car.allCars;

export default carSlice.reducer;