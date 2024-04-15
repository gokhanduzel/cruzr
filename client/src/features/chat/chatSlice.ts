// src/features/chat/chatSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

interface ChatState {
    messages: any[];
    roomId: string | null;
}

const initialState: ChatState = {
    messages: [],
    roomId: null,
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setRoomId(state, action: PayloadAction<string | null>) {
            state.roomId = action.payload;
        },
        addMessage(state, action: PayloadAction<any>) {
            state.messages.push(action.payload);
        },
        clearMessages(state) {
            state.messages = [];
        },
    },
});

export const { setRoomId, addMessage, clearMessages } = chatSlice.actions;

export const selectChat = (state: RootState) => state.chat;

export default chatSlice.reducer;
