import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import {
  createCarListing as createCarListingService,
  fetchCarsByUserId,
  fetchAllCars,
  deleteCarListingById,
  fetchUserByCarId as fetchUserByCarIdService
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
  carOwner: string | null;
}

const initialState: CarState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: null,
  userCars: [],
  allCars: [], // Initialize the new state property
  carOwner: null,
};

export const createCarListing = createAsyncThunk(
  "cars/createCarListing",
  async (carData: any, { rejectWithValue }) => {
    try {
      const data = await createCarListingService(carData);
      return data;
    } catch (error: any) {
      let message = error.toString();
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        message = error.response.data.message;
      }
      return rejectWithValue(message);
    }
  }
);

export const deleteCarListing = createAsyncThunk(
  "cars/deleteCarListing",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await deleteCarListingById(id);
      return response;
    } catch (error: any) {
      let message = error.toString();
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
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
      console.log(data);
      return data;
    } catch (error: any) {
      const message =
        (error as any)?.response?.data?.message ?? "An unknown error occurred";
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
      const message =
        error.response?.data?.message ?? "An unknown error occurred";
      return rejectWithValue(message);
    }
  }
);

// Async thunk to fetch the user by car ID
export const fetchUserByCarId = createAsyncThunk(
  "cars/fetchUserByCarId",
  async (carId: string, { rejectWithValue }) => {
    try {
      const userId = await fetchUserByCarIdService(carId);
      console.log(`THE FETCHED USER ID: ${userId}`);
      return userId;
    } catch (error: any) {
      const message =
        (error as any)?.response?.data?.message ?? "An unknown error occurred";
      return rejectWithValue(message);
    }
  }
);

const carSlice = createSlice({
  name: "car",
  initialState,
  reducers: {
    resetCarState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
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
      })
      .addCase(fetchUserCars.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserCars.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.userCars = action.payload;
      })
      .addCase(fetchUserCars.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(deleteCarListing.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCarListing.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // Remove the deleted car from the userCars array
        state.userCars = state.userCars.filter(
          (car) => car._id !== action.meta.arg
        ); // use the id passed to the deleteCarListing thunk as action.meta.arg
      })
      .addCase(deleteCarListing.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(fetchUserByCarId.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserByCarId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.carOwner = action.payload; // Store the fetched user ID in the state
      })
      .addCase(fetchUserByCarId.rejected, (state, action) => {
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

// Selector to access car's owner id
export const selectCarOwner = (state: RootState) => state.car.carOwner;

export default carSlice.reducer;
