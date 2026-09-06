// ========================================
// AI Visual Jewelry Search Redux Slice
// ========================================

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// ========================================
// Initial State
// ========================================

const initialState = {
  isLoading: false,
  products: [],
  error: null,
};

// ========================================
// Search Visual Jewelry
// ========================================
// Sends the uploaded image to backend.
//
// Frontend
//    ↓
// FormData
//    ↓
// POST /api/shop/visual-search/search
// ========================================

export const searchVisualJewelry = createAsyncThunk(
  "/visualSearch/searchVisualJewelry",

  async (imageFile, { rejectWithValue }) => {
    try {
      // ========================================
      // FormData
      // ========================================

      const formData = new FormData();

      formData.append("image", imageFile);

      // ========================================
      // Send Image To Backend
      // ========================================

      const result = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/shop/visual-search/search`,
        formData
      );

      return result.data;

    } catch (error) {

      console.error(
        "Visual Search API Error:",
        error
      );

      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to search similar jewelry"
      );
    }
  }
);

// ========================================
// Slice
// ========================================

const visualSearchSlice = createSlice({
  name: "visualSearch",

  initialState,

  reducers: {

    // ========================================
    // Clear Search
    // ========================================

    clearVisualSearch: (state) => {
      state.products = [];
      state.error = null;
      state.isLoading = false;
    },

  },

  extraReducers: (builder) => {

    // ========================================
    // Search Pending
    // ========================================

    builder.addCase(
      searchVisualJewelry.pending,
      (state) => {
        state.isLoading = true;
        state.error = null;
        state.products = [];
      }
    );

    // ========================================
    // Search Successful
    // ========================================

    builder.addCase(
      searchVisualJewelry.fulfilled,
      (state, action) => {

        state.isLoading = false;

        state.products =
          action.payload?.products || [];

        state.error = null;
      }
    );

    // ========================================
    // Search Failed
    // ========================================

    builder.addCase(
      searchVisualJewelry.rejected,
      (state, action) => {

        state.isLoading = false;

        state.products = [];

        state.error =
          action.payload ||
          "Something went wrong";
      }
    );

  },
});

// ========================================
// Export Actions
// ========================================

export const {
  clearVisualSearch,
} = visualSearchSlice.actions;

// ========================================
// Export Reducer
// ========================================

export default visualSearchSlice.reducer;