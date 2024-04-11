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
  isLoadingAuthStatus: boolean; // Add loading state for auth status
  errorAuthStatus: string | null; // Add error state for auth status
}

const initialState: AuthState = {
  isLoggedIn: false,
  userDetails: null,
  isLoadingUserDetails: false,
  errorUserDetails: null,
  isLoadingAuthStatus: false, // Initialize loading state
  errorAuthStatus: null, // Initialize error state
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

// Async thunk for verifying authentication status
export const verifyAuth = createAsyncThunk('auth/verifyStatus', async (_, thunkAPI) => {
  try {
      const response = await authService.checkAuthStatus();
      return response.data; 
  } catch (error) {
      return thunkAPI.rejectWithValue('User not authenticated');
  }
});

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
      // Handle fetching user details
      .addCase(fetchUserDetails.pending, (state) => {
        state.isLoadingUserDetails = true;
        state.errorUserDetails = null;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.isLoadingUserDetails = false;
        state.userDetails = action.payload;
        state.isLoggedIn = true; // Assume user is logged in if details are successfully fetched
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.isLoadingUserDetails = false;
        state.errorUserDetails = action.payload as string;
      })
      // Handle verifying authentication status
      .addCase(verifyAuth.pending, (state) => {
        state.isLoadingAuthStatus = true;
        state.errorAuthStatus = null;
      })
      .addCase(verifyAuth.fulfilled, (state) => {
        state.isLoadingAuthStatus = false;
        state.isLoggedIn = true; // Assume user is logged in if auth status is verified
      })
      .addCase(verifyAuth.rejected, (state, action) => {
        state.isLoadingAuthStatus = false;
        state.isLoggedIn = false; // Set user as not logged in if auth verification fails
        state.errorAuthStatus = action.payload as string;
      });
  },
});

export const { setLoggedIn, logout } = authSlice.actions;

// Selectors
export const selectIsLoggedIn = (state: RootState) => state.auth.isLoggedIn;
export const selectCurrentUserDetails = (state: RootState) => state.auth.userDetails;
export const selectUserDetailsLoading = (state: RootState) => state.auth.isLoadingUserDetails;
export const selectUserDetailsError = (state: RootState) => state.auth.errorUserDetails;
export const selectIsAuthStatusLoading = (state: RootState) => state.auth.isLoadingAuthStatus; // New selector for auth status loading
export const selectAuthStatusError = (state: RootState) => state.auth.errorAuthStatus; // New selector for auth status error

export default authSlice.reducer;
