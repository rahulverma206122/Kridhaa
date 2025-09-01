import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
  isLoading: false,
};

//({ userId, productId, quantity }) This is object destructuring in the function parameter.It means: "I expect the argument to be an object, and I will directly extract its userId, productId, and quantity fields."
// when you dispatch the thunk, you pass an object: dispatch(addToCart({ userId: "u1", productId: "p42", quantity: 2 }));
export const addToCart = createAsyncThunk( // Exports the thunk so you can dispatch it from components:
                                           //dispatch(addToCart({ userId, productId, quantity }))
  "cart/addToCart",  // this used in .addcase
  async ({ userId, productId, quantity }) => {  // add to cart me ye teno use kiye gai h cartcontroller.js , async function that runs when you dispatch the thunk.
    const response = await axios.post(  // Sends a POST request to your backend at http://localhost:5000/api/shop/cart/add
      `${import.meta.env.VITE_API_URL}/api/shop/cart/add`, // ye krne se cart-route me req jaegi
      {
        userId,  // or userId:userId   This is the request body object. It will be sent as JSON in the HTTP body:
        productId,  //{ userId, productId, quantity } is the JSON data you are sending to the backend.Because your backend cartController expects these 3 fields to add an item:If you don’t send them, backend ko data hi nahi milega → DB update nahi hoga.
        quantity,
      }
    ); // the second argument of axios.post(url, body) is the request body.

    return response.data;
  }
);

export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async (userId) => {  // This means the function takes one argument called userId. not an object.
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/shop/cart/get/${userId}` // 👉 iska matlab hai ki Express backend me cart route ke andar get/:userId wali route par request jaayegi.
    ); // yha koi data dene ki need nhi h kyu ki fetch kr rhe h bas

    return response.data;
  }
);

export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async ({ userId, productId }) => {
    const response = await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/shop/cart/${userId}/${productId}`  // ye dono cartroute.js me bhi variables honge tbhi yha h
    );  // DELETE requests usually don’t have a body. that is why we dont pass object after this like addtocart

    return response.data;
  }
);

export const updateCartQuantity = createAsyncThunk(
  "cart/updateCartQuantity",
  async ({ userId, productId, quantity }) => {
    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}/api/shop/cart/update-cart`,
      {
        userId,   // update krne pr deta dena pdega ky update kr rhe h yhi teno hmne cart controller me use kiya h 
        productId,
        quantity,
      }
    );

    return response.data;
  }
);

const shoppingCartSlice = createSlice({
  name: "shoppingCart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data; // data isliye kyu ki cartcontroler.js me data pass kiya h res me 
      })
      .addCase(addToCart.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      })
      .addCase(fetchCartItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(fetchCartItems.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      })
      .addCase(updateCartQuantity.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(updateCartQuantity.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      })
      .addCase(deleteCartItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(deleteCartItem.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      });
  },
});

export default shoppingCartSlice.reducer;
