import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  productList: [],
  productDetails: null,
};

export const fetchAllFilteredProducts = createAsyncThunk(
  "/products/fetchAllProducts",

//   Ye "/products/fetchAllProducts" kya hai?

// 👉 Ye action type string hai (Redux Toolkit ka)

// 👉 API route nahi hai ❌
// 👉 Backend URL nahi hai ❌

// 👉 Ye sirf Redux ko batata hai:

// “Kaunsa async action chal raha hai”


// Format hota hai:

// "feature/actionName"

// 👉 Yaha:

// "/products/fetchAllProducts"
// products → feature / slice
// fetchAllProducts → action

// Tum ye khud likhte ho?

// 👉 YES ✅ (apne man se likhte ho)
// 👉 But meaningful hona chahiye

  async ({ filterParams, sortParams }) => {  // Ye bahar se pass kiye ja rahe hain (argument me) // filterParams aur sortParams ko hum component se pass karenge jab hum is async thunk ko call karenge. Jaise ki jab user filter ya sort options select karega, to hum un parameters ko is async thunk me pass karenge taki ye API call me use ho sake.
    
//     filterParams = {
//   category: ["ring", "necklace"],
//   carat: ["18", "22"]
// }

// sortParams = "price-lowtohigh"

    const query = new URLSearchParams();  // “Ye ek helper hai jo URL ke ?key=value part ko handle karta hai”
// /products?category=ring&carat=18 👉 Ye jo ?category=... part hai → usko ye manage karta hai

    // loop through filters
    Object.entries(filterParams).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => query.append(key, v)); // multiple values => ?carat=k18&category=men
      } else {
        query.append(key, value);
      }
    });

    // add sorting
    if (sortParams) {
      query.append("sortBy", sortParams);
    }

    const result = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/shop/products/get?${query.toString()}`
    );

    //console.log("Final API Request URL:", result.config.url); // ✅ see what we send
    return result?.data;
  }
);


export const fetchProductDetails = createAsyncThunk(
  "/products/fetchProductDetails",
  async (id) => {
    const result = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/shop/products/get/${id}`
    );

    return result?.data;  // optional chaining we do this because if result is undefined or null, then result.data will throw an error. By using result?.data, we are saying that if result is undefined or null, then return undefined instead of trying to access data property and throwing an error. This way we can avoid runtime errors in case the API call fails and result is not available.
  }
);

const shoppingProductSlice = createSlice({
  name: "shoppingProducts",
  initialState,
  reducers: {
    setProductDetails: (state) => {
      state.productDetails = null; // mtlb jab khi or click krege productdetails card band ho jaega
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllFilteredProducts.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload.data;
      })
      .addCase(fetchAllFilteredProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.productList = [];
      })
      .addCase(fetchProductDetails.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productDetails = action.payload.data;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.productDetails = null;
      });
  },
});

export const { setProductDetails } = shoppingProductSlice.actions;

export default shoppingProductSlice.reducer;
