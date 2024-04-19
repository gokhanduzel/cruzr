import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { fetchChatMessages, fetchUserChats } from "./chatService";

// Adjusted to fit your mongoose schema.
interface Message {
  _id: string;
  senderId: string; // Assuming you handle the conversion of ObjectId to string in the API layer
  content: string;
  threadId: string;
  createdAt: Date;
}

// Represents a simplified view of a chat session.
interface ChatSession {
  roomId: string;
  carId: string;
  buyerIds: string[];
  sellerId: string;
  messages: Message[];
}

// Updating state to hold messages according to the Message interface
interface ChatState {
  messages: Message[];
  roomId: string | null;
  chatSessions: ChatSession[];
}

const initialState: ChatState = {
  roomId: null,
  chatSessions: [],
  messages: [],
};

export const fetchMessages = createAsyncThunk(
  "chat/fetchMessages",
  async (roomId: string, { rejectWithValue }) => {
    try {
      const messages = await fetchChatMessages(roomId);
      return messages.map(
        (msg: { senderId: string; content: string; threadId: string, createdAt: Date }) => ({
          senderId: msg.senderId,
          content: msg.content,
          threadId: msg.threadId,
          createdAt: msg.createdAt
        })
      );
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
      return chatSessions.map((session: any) => ({
        roomId: session.roomId,
        carId: session.carId,
        buyerIds: session.buyerIds,
        sellerId: session.sellerId,
        messages: session.messages,
      }));
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
      if (!state.messages.find((m) => m._id === action.payload._id)) {
        state.messages.push(action.payload);
      }
    },
    clearMessages(state) {
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.fulfilled, (state, action) => {
        // Concatenate the new messages to the existing ones without duplicates
        const fetchedMessageIds = action.payload.map(
          (m: { _id: string }) => m._id
        );
        state.messages = [
          ...state.messages.filter((m) => !fetchedMessageIds.includes(m._id)),
          ...action.payload,
        ];
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
