import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,  // thse names choose random not comes from somewhere isloading comes from you only. It is just a boolean variable to show loading state in frontend. When you are making an API call, you can set isLoading to true, and when the API call is finished (either success or failure), you can set isLoading to false. This way, you can show a loading spinner or some indication to the user that something is happening in the background while the API call is in progress.
  featureImageList: [],
};

export const getFeatureImages = createAsyncThunk(
  "/order/getFeatureImages",
  async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/common/feature/get`
    );

    return response.data;
  }
);

export const addFeatureImage = createAsyncThunk(
  "/order/addFeatureImage",
  async (image) => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/common/feature/add`,
      { image }  // object   
    );

    return response.data;
  }
);

export const deleteFeatureImage = createAsyncThunk(
  "/order/deleteFeatureImage",
  async (id) => {
    const response = await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/common/feature/delete/${id}`
    );
    return { id, ...response.data }; // return id so we can filter state
  }
);

// 🔹 Problem samjho

// 👉 Backend se usually response aata hai:

// {
//   "success": true
// }

// 👉 ❌ Isme id nahi hota

// 👉 Redux ko kaise pata chale:

// “Kaunsa image list se remove karna hai?”

// manually we are saying 
// return { id, ...response.data };

// Final payload banega:

// {
//   "id": "123",
//   "success": true
// }

 // ...res.data
// “response.data ke andar jo bhi fields hain, unko alag-alag copy kar do” 🧠

// 🔹 Example samjho
// response.data = {
//   success: true,
//   message: "Deleted successfully"
// };

// Without spread ❌
// return { id, response.data };

// 👉 Output:

// {
//   "id": "123",
//   "response": {
//     "success": true,
//     "message": "Deleted successfully"
//   }
// }
// With spread ✅
// return { id, ...response.data };

// 👉 Output:

// {
//   "id": "123",
//   "success": true,
//   "message": "Deleted successfully"
// }


const commonSlice = createSlice({
  name: "commonSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeatureImages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFeatureImages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.featureImageList = action.payload.data;
      })
      .addCase(getFeatureImages.rejected, (state) => {
        state.isLoading = false;
        state.featureImageList = [];
      })

      .addCase(deleteFeatureImage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteFeatureImage.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteFeatureImage.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default commonSlice.reducer;
