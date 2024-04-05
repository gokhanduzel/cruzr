import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { createCarListing as createCarListingService } from './carServices';

interface CarState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  message: string | null;
}

const initialState: CarState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: null,
};

// Async thunk for creating a car listing
export const createCarListing = createAsyncThunk(
  'cars/createCarListing',
  async (carData: any, { rejectWithValue }) => {
    try {
      // Call the service function to create a car listing
      const data = await createCarListingService(carData);
      return data;
    } catch (error: any) {
      // Extract and return error message; adjust according to your error handling structure
      let message = error.toString();
      if (error.response && error.response.data && error.response.data.message) {
        message = error.response.data.message;
      }
      return rejectWithValue(message);
    }
  }
);

const carSlice = createSlice({
  name: 'car',
  initialState,
  reducers: {
    resetCarState: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCarListing.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createCarListing.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = "Car listing created successfully.";
      })
      .addCase(createCarListing.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      });
  },
});

export const { resetCarState } = carSlice.actions;

// Selector to access the car slice state
export const selectCarState = (state: RootState) => state.car;

export default carSlice.reducer;
