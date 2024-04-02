import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

interface RegistrationFormData {
  username: string;
  email: string;
  password: string;
}

interface RegistrationState {
  formData: RegistrationFormData;
  isRegistering: boolean;
  registrationSuccess: boolean;
  errors: { [fieldName: string]: string }; // Store errors per field
}

const initialState: RegistrationState = {
  formData: {
    username: "",
    email: "",
    password: "",
  },
  isRegistering: false,
  registrationSuccess: false,
  errors: {},
};

const registrationSlice = createSlice({
  name: "registration",
  initialState,
  reducers: {
    updateField(state, action: PayloadAction<{ field: keyof RegistrationFormData; value: string }>) {
        state.formData[action.payload.field] = action.payload.value;
      },
    setRegistering(state, action: PayloadAction<boolean>) {
      state.isRegistering = action.payload;
    },
    setRegistrationSuccess(state, action: PayloadAction<boolean>) {
      state.registrationSuccess = action.payload;
    },
    setErrors(state, action: PayloadAction<{ [fieldName: string]: string }>) {
      state.errors = action.payload;
    },
  },
});

export const {
  updateField,
  setRegistering,
  setRegistrationSuccess,
  setErrors,
} = registrationSlice.actions;

export const selectRegistrationState = (state: RootState) => state.registration;

export default registrationSlice.reducer;
