import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios from "axios";


export const fetchRecommendations =
  createAsyncThunk(
    "recommendations/fetch",
    async () => {

      const recentlyViewed = JSON.parse(
        localStorage.getItem("recentlyViewed")
      ) || [];

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/shop/recommendations/get`,
        {
          viewedProducts: recentlyViewed,
        }
      );

      return response.data;
    }
  );


const recommendationSlice = createSlice({

  name: "recommendations",

  initialState: {

    products: [],

    isLoading: false,

  },

  reducers: {},

  extraReducers: (builder) => {

    builder

      .addCase(
        fetchRecommendations.pending,
        (state) => {

          state.isLoading = true;

        }
      )

      .addCase(
        fetchRecommendations.fulfilled,
        (state, action) => {

          state.isLoading = false;

          state.products =
            action.payload.products;

        }
      )

      .addCase(
        fetchRecommendations.rejected,
        (state) => {

          state.isLoading = false;

        }
      );

  },

});


export default recommendationSlice.reducer;