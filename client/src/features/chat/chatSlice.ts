import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { fetchChatMessages } from './chatService';

interface ChatState {
    messages: any[];
    roomId: string | null;
}

const initialState: ChatState = {
    messages: [],
    roomId: null,
};

export const fetchMessages = createAsyncThunk(
    'chat/fetchMessages',
    async (roomId: string, { rejectWithValue }) => {
        try {
            const messages = await fetchChatMessages(roomId);
            return messages;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setRoomId(state, action) {
            state.roomId = action.payload;
        },
        addMessage(state, action) {
            state.messages.push(action.payload);
        },
        clearMessages(state) {
            state.messages = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMessages.fulfilled, (state, action) => {
                state.messages = action.payload;
            });
    }
});

export const { setRoomId, addMessage, clearMessages } = chatSlice.actions;

export const selectChat = (state: RootState) => state.chat;

export default chatSlice.reducer;
