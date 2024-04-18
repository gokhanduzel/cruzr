// src/features/auth/authSlice.ts

import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import * as authService from "./authService";
import { RootState } from "../../app/store";
import { UserDetails } from "../../types/userDetails";
import { AxiosError } from "axios";

interface ApiErrorResponse {
  message: string; // Assuming your server error responses include a message field
}

interface AuthState {
  isLoggedIn: boolean;
  currentUserDetails: UserDetails | null;
  userDetailsById: { [userId: string]: UserDetails | undefined };
  accessToken: string | null;
  isLoadingCurrentUserDetails: boolean;
  errorCurrentUserDetails: string | null;
  isLoadingUserDetailsById: { [userId: string]: boolean };  // Track loading state by user ID
  userDetailsErrorsById: { [userId: string]: string | null };  // Track errors by user ID
  isLoadingAuthStatus: boolean;
  errorAuthStatus: string | null;
}

const initialState: AuthState = {
  isLoggedIn: false,
  currentUserDetails: null,
  userDetailsById: {},
  accessToken: null,
  isLoadingCurrentUserDetails: false,
  errorCurrentUserDetails: null,
  isLoadingUserDetailsById: {},
  userDetailsErrorsById: {},
  isLoadingAuthStatus: false,
  errorAuthStatus: null,
};

// Async thunk for fetching user details
export const fetchCurrentUserDetails = createAsyncThunk(
  "auth/fetchCurrentUserDetails",
  async (_, thunkAPI) => {
    try {
      const data = await authService.fetchCurrentUserById();
      return data;
    } catch (error: unknown) {
      const message =
        (error as any)?.response?.data?.message ?? "An unknown error occurred";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchUserDetailsById = createAsyncThunk(
  "auth/fetchUserDetailsById",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await authService.fetchUserById(userId);
      return response; // Ensure proper parsing of the JSON response
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      console.error("Error fetching user details:", axiosError.response?.data?.message || axiosError.message);
      return rejectWithValue(axiosError.response?.data?.message || "Failed to fetch user details");
    }
  }
);



// Async thunk for verifying authentication status
export const verifyAuth = createAsyncThunk(
  "auth/verifyStatus",
  async (_, thunkAPI) => {
    try {
      const response = await authService.checkAuthStatus();
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("User not authenticated");
    }
  }
);

export const fetchToken = createAsyncThunk(
  "auth/fetchToken",
  async (_, thunkAPI) => {
    try {
      const token = await authService.fetchToken();
      return token;
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch token");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoggedIn(state, action: PayloadAction<boolean>) {
      state.isLoggedIn = action.payload;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.currentUserDetails = null; // Clear user details on logout
    },
    setToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetching user details
      .addCase(fetchCurrentUserDetails.pending, (state) => {
        state.isLoadingCurrentUserDetails = true;
        state.errorCurrentUserDetails = null;
      })
      .addCase(fetchCurrentUserDetails.fulfilled, (state, action) => {
        state.isLoadingCurrentUserDetails = false;
        state.currentUserDetails = action.payload;
        state.isLoggedIn = true; // Assume user is logged in if details are successfully fetched
      })
      .addCase(fetchCurrentUserDetails.rejected, (state, action) => {
        state.isLoadingCurrentUserDetails = false;
        state.errorCurrentUserDetails = action.payload as string;
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
      })
      // Handle token fetching
      .addCase(fetchToken.pending, (state) => {
        state.accessToken = null; // Reset token on attempt
      })
      .addCase(fetchToken.fulfilled, (state, action) => {
        state.accessToken = action.payload;
      })
      .addCase(fetchToken.rejected, (state) => {
        state.accessToken = null; // Clear token on error
      })
      .addCase(fetchUserDetailsById.pending, (state, action) => {
        const userId = action.meta.arg;
        state.isLoadingUserDetailsById[userId] = true;
        state.userDetailsErrorsById[userId] = null;
      })
      .addCase(fetchUserDetailsById.fulfilled, (state, action) => {
        const userId = action.meta.arg;
        state.userDetailsById[userId] = action.payload;
        state.isLoadingUserDetailsById[userId] = false;
      })
      .addCase(fetchUserDetailsById.rejected, (state, action) => {
        const userId = action.meta.arg;
        state.userDetailsErrorsById[userId] = action.error.message || 'Failed to fetch user details';
        state.isLoadingUserDetailsById[userId] = false;
      });
  },
});

export const { setLoggedIn, logout, setToken } = authSlice.actions;

// Selectors
export const selectIsLoggedIn = (state: RootState) => state.auth.isLoggedIn;
export const selectCurrentUserDetails = (state: RootState) =>
  state.auth.currentUserDetails;
export const selectUserDetailsLoading = (state: RootState) =>
  state.auth.isLoadingCurrentUserDetails;
export const selectUserDetailsError = (state: RootState) =>
  state.auth.errorCurrentUserDetails;
export const selectIsAuthStatusLoading = (state: RootState) =>
  state.auth.isLoadingAuthStatus; // New selector for auth status loading
export const selectAuthStatusError = (state: RootState) =>
  state.auth.errorAuthStatus; // New selector for auth status error
export const selectAccessToken = (state: RootState) => state.auth.accessToken;

export const selectUserDetailsById = (state: RootState, userId: string) => state.auth.userDetailsById[userId];

export default authSlice.reducer;
