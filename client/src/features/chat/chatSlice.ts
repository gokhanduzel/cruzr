import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { fetchChatMessages, fetchUserChats } from "./chatService";

// Adjusted to fit your mongoose schema.
interface Message {
  _id: string;
  senderId: string; // Assuming you handle the conversion of ObjectId to string in the API layer
  content: string;
  threadId: string;
}

// Represents a simplified view of a chat session.
interface ChatSession {
  roomId: string;
  carId: string;
  buyerId: string;
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
      // This needs to align with how messages are retrieved and structured from your API
      const messages = await fetchChatMessages(roomId);
      return messages.map(
        (msg: { senderId: any; content: any; threadId: any }) => ({
          senderId: msg.senderId,
          content: msg.content,
          threadId: msg.threadId, // Assuming the API sends this; adjust as needed
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
      return chatSessions;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchOrGetRoomId = createAsyncThunk(
  "chat/fetchOrGetRoomId",
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
        const fetchedMessageIds = action.payload.map((m: { _id: string; }) => m._id);
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
