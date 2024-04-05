// src/app/store.ts

import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import registrationReducer from '../features/registration/registrationSlice';
import carReducer from '../features/cars/carSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    registration: registrationReducer,
    car: carReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
