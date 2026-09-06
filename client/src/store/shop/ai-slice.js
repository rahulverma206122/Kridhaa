import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  messages: [],
  recommendedProducts: [],
};

export const askAIJewelryAssistant = createAsyncThunk(
  "ai/askAIJewelryAssistant",
  async (message) => {
    const result = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/common/ai/recommend`,
      {
        message,
      }
    );

    return result.data;
  }
);

const aiSlice = createSlice({
  name: "ai",
  initialState,

  reducers: {
    addUserMessage: (state, action) => {
      state.messages.push({
        role: "user",
        text: action.payload,
      });
    },

    clearAIMessages: (state) => {
      state.messages = [];
      state.recommendedProducts = [];
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(
        askAIJewelryAssistant.pending,
        (state) => {
          state.isLoading = true;
        }
      )

      .addCase(
        askAIJewelryAssistant.fulfilled,
        (state, action) => {
          state.isLoading = false;

          state.messages.push({
            role: "assistant",
            text: action.payload.reply,
          });

          state.recommendedProducts =
            action.payload.products;
        }
      )

      .addCase(
        askAIJewelryAssistant.rejected,
        (state) => {
          state.isLoading = false;

          state.messages.push({
            role: "assistant",
            text: "Sorry, something went wrong. Please try again.",
          });
        }
      );
  },
});

export const {
  addUserMessage,
  clearAIMessages,
} = aiSlice.actions;

export default aiSlice.reducer;