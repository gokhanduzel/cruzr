import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { fetchChatMessages, fetchUserChats } from "./chatService";

interface ChatSession {
  carId: string;
  roomId: string;
  lastMessage: string;
  lastMessageTime: Date;
  otherParticipant: string;
}

interface ChatState {
  messages: any[];
  roomId: string | null;
  chatSessions: ChatSession[];
}

const initialState: ChatState = {
  messages: [],
  roomId: null,
  chatSessions: [],
};

export const fetchMessages = createAsyncThunk(
  "chat/fetchMessages",
  async (roomId: string, { rejectWithValue }) => {
    try {
      const messages = await fetchChatMessages(roomId);
      return messages;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchUserChatSessions = createAsyncThunk(
  "chat/fetchUserChatSessions",
  async (_, { rejectWithValue }) => {
    try {
      const chatSessions = await fetchUserChats();
      return chatSessions;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
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
      })
      .addCase(fetchUserChatSessions.fulfilled, (state, action) => {
        state.chatSessions = action.payload;
      });
  },
});

export const { setRoomId, addMessage, clearMessages } = chatSlice.actions;

export const selectChat = (state: RootState) => state.chat;
export const selectChatSessions = (state: RootState) => state.chat.chatSessions;

export default chatSlice.reducer;
