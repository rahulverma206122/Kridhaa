import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  reviews: [],
};

export const addReview = createAsyncThunk(
  "/order/addReview",
  async (formdata) => {  // formdata tumne khud naam diya hai (custom variable) formdata me productId, reviewMessage, reviewValue hoga, jo hum product details page se bhejenge jab user review submit karega
//     👉 Jab dispatch(addReview(...)) karoge, jo object pass karoge wahi formdata ban jayega
// 👉 Fir wo backend me req.body me milta hai
    
    const response = await axios.post(

// Frontend URL:
// http://localhost:5000/api/shop/review/add

// Backend flow:
// server.js → "/api/shop/review"
//         +
// reviewRoutes → "/add"

      `${import.meta.env.VITE_API_URL}/api/shop/review/add`,
      formdata  // ye formdata backend me jaega aur waha pe hum usse req.body se access karenge, aur usme se productId, reviewMessage, reviewValue ko nikal ke review create karenge
    );

    return response.data;
  }
);

export const getReviews = createAsyncThunk(
  "/order/getReviews", 
  async (id) => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/shop/review/${id}`
  );

  return response.data;
});

const reviewSlice = createSlice({  // reviewSlice is wale ko hmne import and export me use kiya h
  name: "reviewSlice",  // "name": "shopReview" likha hai, wo slice ka naam hai (sirf identification ke liye).
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getReviews.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = action.payload.data;
      })
      .addCase(getReviews.rejected, (state) => {
        state.isLoading = false;
        state.reviews = [];
      });  // yha pr addreview ke liye case add krne ki need nhi h kyu ki jab add ho jaega tabhi getreview kr paege
  },
});

export default reviewSlice.reducer;
 
// why we add cases only for getreview not for addreview

// 🔥 Short Answer

// 👉 Tumne getReviews ke cases isliye add kiye
// ➡️ kyunki UI ko reviews dikhane hain

// 👉 addReview ke cases skip kiye
// ➡️ kyunki add hone ke baad tum phir se getReviews call kar rahe ho

// 🧠 Deep samajh
// 1️⃣ getReviews kya karta hai?

// 👉 Backend se latest reviews laata hai

// state.reviews = action.payload.data;

// ➡️ UI update ho jata hai

// 2️⃣ addReview kya karta hai?

// 👉 Sirf new review add karta hai DB me





// slice hi wo file hoti h jo frontend and backend ko connect krti h hai na ?
// galat ni krti h 

// Toh connect kaun karta hai?

// 👉 Thunk + Axios (API call)

// 🔥 Short Answer

// 👉 Thunk slice file me likh sakte ho ✅
// 👉 But thunk ≠ slice (alag cheez hai)

// 🧠 Difference clear karo
// 1️⃣ Slice kya hai?
// createSlice({...})

// 👉 Kaam:

// state store karna
// reducers handle karna
// 2️⃣ Thunk kya hai?
// createAsyncThunk(...)

// 👉 Kaam:

// API call karna
// backend se data lana/bhejna
// 🔥 Tumhare case me kya ho raha hai?

// 👉 Tumne dono ek hi file me likh diya:

// export const addReview = createAsyncThunk(...);

// const reviewSlice = createSlice({...});

// 👉 Ye common practice hai ✅