// src/features/modal/modalSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ModalState {
  isOpen: boolean;
  content: string | null;  // Store a string identifier or similar
  carId: string | null;    // Additional data needed to render the modal content
}

const initialState: ModalState = {
  isOpen: false,
  content: null,
  carId: null,
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal(state, action: PayloadAction<{ content: string, carId: string }>) {
      state.isOpen = true;
      state.content = action.payload.content;
      state.carId = action.payload.carId;
    },
    closeModal(state) {
      state.isOpen = false;
      state.content = null;
      state.carId = null;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
