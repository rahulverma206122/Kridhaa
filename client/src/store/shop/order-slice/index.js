import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  approvalURL: null,
  isLoading: false,
  orderId: null,
  orderList: [],
  orderDetails: null,
};

export const createNewOrder = createAsyncThunk( // why we create asyncthunk wht is the use
  "/order/createNewOrder",
  async (orderData) => {  // yha orderdata tumne khud naam diya hai (custom variable) orderdata me cartItems, shippingAddress, totalAmount hoga, jo hum checkout page se bhejenge jab user place order karega
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/shop/order/create`,
      orderData   // yha ye orderdata backend me jaega aur waha pe hum usse req.body se access karenge, aur usme se cartItems, shippingAddress, totalAmount ko nikal ke order create karenge
    );

    return response.data;
  }
);

export const capturePayment = createAsyncThunk(
  "/order/capturePayment",
  async ({ paymentId, payerId, orderId }) => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/shop/order/capture`,
      {
        paymentId,
        payerId,
        orderId,
      }
    );

    return response.data;
  }
);

export const getAllOrdersByUserId = createAsyncThunk(
  "/order/getAllOrdersByUserId",
  async (userId) => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/shop/order/list/${userId}`
    );

    return response.data;
  }
);

export const getOrderDetails = createAsyncThunk(
  "/order/getOrderDetails",
  async (id) => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/shop/order/details/${id}`
    );

    return response.data;
  }
);
{/* why we make this reducer 
Here, orderDetails holds data of the last order you opened.
Suppose you open one order → data gets saved in orderDetails.
Then you leave that page → orderDetails is still in Redux memory.
When you come back → it will show the old order automatically (not what you want).
👉 To fix this, we add a resetOrderDetails reducer.
When you leave the page, you dispatch(resetOrderDetails()).
That sets orderDetails = null.
Next time you open orders → fresh API call happens, no stale data. */}
const shoppingOrderSlice = createSlice({
  name: "shoppingOrderSlice",
  initialState,
  // State ko manually reset/clear karne ke liye reducer banate hain

//   👉 Redux me:

// state automatically reset nahi hoti ❌
// jab tak tum khud change na karo

// ➡️ Isliye reducer likhna padta hai

// 🔥 Tumhara use case (perfect example)

// 👉 Scenario:

// User order details open karta hai
//    ↓
// state.orderDetails = data
//    ↓
// User dusre page pe chala gaya
//    ↓
// wapas aaya

// 👉 ❗ Problem:
// ➡️ old data still present
// ➡️ UI automatically open ho jayega

// ✅ Solution
// resetOrderDetails()

// 👉 Isse:

// state.orderDetails = null

// ➡️ UI fresh state se start karega

  reducers: {  // why we make this in reducer: reducers define how the state should change. If you want to reset / clear some part of the state, you need to write that logic inside a reducer.
    resetOrderDetails: (state) => {  // ise nhi bnaege to jaise hi orderdetails ko open krege or khi or jaege or agr fir se oreder pr aaege to ye orderdetails automaticaly khula hua aaega isiliye ise null krna jaruri h
      state.orderDetails = null;
    },    
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNewOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createNewOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.approvalURL = action.payload.approvalURL;
        state.orderId = action.payload.orderId;
        sessionStorage.setItem(  // OrderId ko temporarily browser me save kar rahe ho taaki payment ke baad use kar sako
          "currentOrderId",  // It is just a key (name) in sessionStorage
          JSON.stringify(action.payload.orderId)
        );

// 🧠 Problem samjho (kyun zaroori hai)

// 👉 Flow kya hai:

// Order create
//    ↓
// approvalURL milta hai
//    ↓
// User PayPal pe redirect
//    ↓
// User wapas aata hai (return_url)

// 👉 ❗ Issue:
// ➡️ Page reload ho gaya
// ➡️ Redux state reset ho sakti hai

// 🔥 Solution

// 👉 Isliye:

// sessionStorage.setItem("currentOrderId", ...)

// ➡️ OrderId safe ho gaya browser me


// Wapas kaise use hota hai?
// const orderId = JSON.parse(
//   sessionStorage.getItem("currentOrderId")
// );

// 👉 Jab user PayPal se wapas aata hai:
// ➡️ isi orderId se payment capture karte ho

// nhi kiya to ❌ OrderId lost ho jayega

      })
      .addCase(createNewOrder.rejected, (state) => {
        state.isLoading = false;
        state.approvalURL = null;
        state.orderId = null;
      })
      .addCase(getAllOrdersByUserId.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrdersByUserId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload.data;
      })
      .addCase(getAllOrdersByUserId.rejected, (state) => {
        state.isLoading = false;
        state.orderList = [];
      })
      .addCase(getOrderDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload.data;
      })
      .addCase(getOrderDetails.rejected, (state) => {
        state.isLoading = false;
        state.orderDetails = null;
      });
  },
});

export const { resetOrderDetails } = shoppingOrderSlice.actions;

export default shoppingOrderSlice.reducer;
