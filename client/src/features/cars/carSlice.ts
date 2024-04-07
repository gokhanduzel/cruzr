import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import {
  createCarListing as createCarListingService,
  fetchCarsByUserId,
} from "./carServices";
import { CarData } from "../../types/car";

interface CarState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  message: string | null;
  userCars: CarData[];
}

const initialState: CarState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: null,
  userCars: [],
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

const carSlice = createSlice({
  name: "car",
  initialState,
  reducers: {
    resetCarState: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCarListing.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createCarListing.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = "Car listing created successfully.";
      })
      .addCase(createCarListing.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      // Handling fetchUserCars actions
      .addCase(fetchUserCars.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserCars.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.userCars = action.payload; // Assuming the payload is the array of user cars
      })
      .addCase(fetchUserCars.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string; // Assuming the payload is an error message
      });
  },
});

export const { resetCarState } = carSlice.actions;

// Selector to access the car slice state
export const selectCarState = (state: RootState) => state.car;

// Selector to access the user's cars
export const selectUserCars = (state: RootState) => state.car.userCars;

export default carSlice.reducer;
