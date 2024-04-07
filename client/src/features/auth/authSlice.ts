// src/features/auth/authSlice.ts

import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import * as authService from './authService';
import { RootState } from '../../app/store';
import { UserDetails } from '../../types/userDetails';

interface AuthState {
  isLoggedIn: boolean;
  userDetails: UserDetails | null;
  isLoadingUserDetails: boolean;
  errorUserDetails: string | null;
}

const initialState: AuthState = {
  isLoggedIn: false,
  userDetails: null,
  isLoadingUserDetails: false,
  errorUserDetails: null,
};

// Async thunk for fetching user details
export const fetchUserDetails = createAsyncThunk(
  'auth/fetchUserDetails',
  async (_, thunkAPI) => {
    try {
      const data = await authService.fetchUserById();
      return data;
    } catch (error: unknown) {
      const message =
        (error as any)?.response?.data?.message ?? 'An unknown error occurred';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoggedIn(state, action: PayloadAction<boolean>) {
      state.isLoggedIn = action.payload;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.userDetails = null; // Clear user details on logout
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserDetails.pending, (state) => {
        state.isLoadingUserDetails = true;
        state.errorUserDetails = null;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.isLoadingUserDetails = false;
        state.userDetails = action.payload;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.isLoadingUserDetails = false;
        state.errorUserDetails = action.payload as string;
      });
  },
});

export const { setLoggedIn, logout } = authSlice.actions;

// Selectors
export const selectIsLoggedIn = (state: RootState) => state.auth.isLoggedIn;
export const selectCurrentUserDetails = (state: RootState) => state.auth.userDetails;
export const selectUserDetailsLoading = (state: RootState) => state.auth.isLoadingUserDetails;
export const selectUserDetailsError = (state: RootState) => state.auth.errorUserDetails;

export default authSlice.reducer;
