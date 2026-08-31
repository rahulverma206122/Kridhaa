import axios from "axios";  // Axios ek library hai jo frontend se backend ko request bhejne ke liye use hoti hai Server se data lena ya bhejna
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
  isLoading: false,
};

//({ userId, productId, quantity }) This is object destructuring in the function parameter.It means: "I expect the argument to be an object, and I will directly extract its userId, productId, and quantity fields."
// when you dispatch the thunk, you pass an object: dispatch(addToCart({ userId: "u1", productId: "p42", quantity: 2 }));
export const addToCart = createAsyncThunk( // Exports the thunk so you can dispatch it from components:
                                           //dispatch(addToCart({ userId, productId, quantity }))
  "cart/addToCart",  // redux ko btata h kaunsa async action chal raha hai  structure is "sliceName/actionName" yha slice ka name cart h aur action ka name addToCart h  kya ye apne man se likhte h YES ✅ (apne man se likhte ho) but meaningful hona chahiye taki debugging me help mile      ye use hota h -> to identify the action in Redux DevTools and in reducers.
  async ({ userId, productId, quantity }) => {    // Pehle → tumne values receive ki (from dispatch) // add to cart me ye teno use kiye gai h cartcontroller.js , async function that runs when you dispatch the thunk.    Mujhe ek object milega, usme se directly ye 3 values nikaal lo userId, productId, quantity.  Ye values aapko component se milengi jab aap dispatch karoge addToCart ko.  yha pr hum async ({data}) => { bhi likh sakte the, but isse hum directly data ke andar se userId, productId, quantity nikal sakte hain. this is called object destructuring in JavaScript.
    const response = await axios.post(  // Sends a POST request to your backend at http://localhost:5000/api/shop/cart/add
      `${import.meta.env.VITE_API_URL}/api/shop/cart/add`, // ye krne se cart-route me req jaegi
      {
        userId, // Ab → tum unhe backend ko send kar rahe ho // or userId:userId   This is the request body object. (backend ko bhej rahe ho)
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
    // "/api/shop/cart" ise server.js me likha h to yaha se request jaayegi server.js me aur server.js me is route par request aayegi to cart-routes.js me is route par jo code hoga wo execute hoga aur uske baad backend se response aayega aur us response ko hum apne frontend me use karenge
// "/get/:userId" ye router.js me h 
    //   /api/shop/cart/get/${userId}  Ye backend API route ka full path hai
    // ${import.meta.env.VITE_API_URL}(Ye environment variable hai (frontend ka)) is the base URL of your backend API, which you have defined in your .env file. It usually looks like http://localhost:5000 or https://yourdomain.com. By using this environment variable, you can easily switch between development and production backends without changing your code.
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

const shoppingCartSlice = createSlice({   // shoppingCartSlice -> Ye ek Redux slice object hai. Ye createSlice function se bana hai. createSlice ek function hai jo Redux state ka part banata hai + reducers automatically generate karta hai. createSlice ko ek object pass karte hain jisme hum slice ka name, initial state, reducers, aur extraReducers define karte hain.
  name: "shoppingCart", // "shoppingCart" 👉 Ye hai slice ka name (Redux name) 👉 Redux internally use karta hai  jbki shoppingCartSlice 👉 Ye hai variable name (tumne khud rakha hai) 👉 Isme pura slice object store hota hai
  initialState,
  reducers: {},   // extraReducers = “bahar ke actions ko handle karna”

// Pehle ye samajh:
// 🔹 reducers kya hota hai?
// reducers: {
//   increment: (state) => { ... }
// }

// 👉 Ye apne khud ke actions handle karta hai 
// “Jo actions bahar se aa rahe hain (like async thunk), unko yaha handle karo”
// 👉 reducers → “maine banaya action”
//👉 extraReducers → “bahar se aaya action” -> slice ke andar define nahi hue actions
// “extraReducers is used to handle async thunk actions.”


  extraReducers: (builder) => {  // builder -> Ye ek helper object hai “Kaunsa action aaye to kya karna hai” define karne ke liye. Ye createAsyncThunk ke actions ko handle karne ke liye use hota hai. Jab aap createAsyncThunk se koi async action banate hain, to uske pending, fulfilled, aur rejected states ko handle karne ke liye extraReducers me builder ka use karte hain.
    builder
      .addCase(addToCart.pending, (state) => {  // .addcase -> “Jab ye action aaye → ye function chalao” define karta hai. addToCart.pending ka matlab hai “Jab addToCart action chal raha ho (pending state) to ye function chalao”. Ye function state ko update karega jab addToCart action pending state me hoga. yha pr hum isse isliye use kr rhe h taki jab bhi addtocart action chal raha ho to hum isLoading ko true kr de taki user ko pata chale ki kuch ho rha h
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
