import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";  // here creteslice comes from redux toolkit and createasyncthunk also come from redux toolkit and we use this to make api call in redux and handle the state of that api call in redux and axios is used to make api call to backend and get the response from backend and then we can use that response in our frontend to show the data to user or do some action based on that response
import axios from "axios"; // here we import axios to make api call to backend and get the response from backend and then we can use that response in our frontend to show the data to user 

const initialState = { 
  isLoading: false,  // is line ka use hum isliye kr rhe h kyuki jab bhi hum api call krenge to hume pata chalega ki api call ho rhi h ya nhi aur jab api call ho rhi h to hum user ko loading dikhayenge taki user ko pata chale ki data aa rha h ya nhi aur jab data aa jaye to hum loading ko false kr denge taki user ko pata chale ki data aa gya h
  addressList: [], // addressList me hum user ke sare address ko store krenge taki jab user apne address ko dekhe to usko sare address dikh jaye aur jab user apne address ko update kare to usko updated address dikh jaye aur jab user apne address ko delete kare to usko deleted address dikh jaye
// This is the array where we store all user addresses.
};

export const addNewAddress = createAsyncThunk( // export const addNewAddress isliye kr rhe h kyuki hum is function ko apne component me use krenge aur createAsyncThunk ka use kr rhe h kyuki hum is function me api call krenge aur api call ke response ko handle krne ke liye createAsyncThunk ka use kr rhe h
  "/addresses/addNewAddress",  // ye ek name h jo redux ko bta rha h konsa async action chl rha h (name/identifier)

// 🔹 Behind the scenes (VERY IMPORTANT 🔥)

// Redux automatically 3 actions banata hai:

// /addresses/addNewAddress/pending
// /addresses/addNewAddress/fulfilled
// /addresses/addNewAddress/rejected

  async (formData) => {   // formdata we recieve from frontend 
    const response = await axios.post(   // axios.post ka mtlb h ki hum backend me post request bhejenge aur post request ka mtlb h ki hum backend me data bhejenge taki backend me wo data save ho jaye aur jab data save ho jaye to backend se response aayega aur us response ko hum apne frontend me use karege
      `${import.meta.env.VITE_API_URL}/api/shop/address/add`,  // isme import.meta.env.VITE_API_URL ka mtlb h ki hum apne .env file me VITE_API_URL variable me jo url store kiya h wo yaha use karenge taki jab bhi hum apne frontend me api call krenge to wo url use hoga aur us url ke sath /api/shop/address/add route bhi add hoga taki backend me is route par request aayegi to backend me is route par jo code hoga wo execute hoga aur uske baad backend se response aayega aur us response ko hum apne frontend me use karenge 
      formData // yaha formdata ko post request ke body me bhejenge taki backend me wo data receive ho jaye aur us data ko backend me save kar sake aur jab data save ho jaye to backend se response aayega aur us response ko hum apne frontend me use karenge taki user ko pata chale ki address add ho gya h ya nhi
    );

    return response.data;
  }
);

export const fetchAllAddresses = createAsyncThunk(
  "/addresses/fetchAllAddresses",
  async (userId) => {  // to fetch we need userid u can see this in controller also
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/shop/address/get/${userId}`
    );

    return response.data;
  }
);

export const editaAddress = createAsyncThunk(
  "/addresses/editaAddress",
  async ({ userId, addressId, formData }) => { // we need these three to update
    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}/api/shop/address/update/${userId}/${addressId}`,  // userid and addressid used in routes so we use this here
      formData
    );

    return response.data;
  }
);

export const deleteAddress = createAsyncThunk(
  "/addresses/deleteAddress",
  async ({ userId, addressId }) => {
    const response = await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/shop/address/delete/${userId}/${addressId}`
    );

    return response.data;
  }
);

// createSlice Redux Toolkit ka function hai.

// It comes from:

// import { createSlice } from "@reduxjs/toolkit";

// Why we use it?

// createSlice ek Redux state ka part banata hai + reducers automatically generate karta hai.

// Without Redux Toolkit we had to write:

// action
// action type
// reducer
// dispatch

// But createSlice sab automatically manage kar deta hai.

// So here we are creating address state manager.

const addressSlice = createSlice({ // yha createslice ka mtlb h ki hum ek slice bana rhe h jiska naam address h aur usme hum initial state de rhe h aur usme hum reducers de rhe h aur usme hum extra reducers de rhe h 
// taki jab bhi hum addNewAddress ya fetchAllAddresses ya editaAddress ya deleteAddress function ko call krenge to uske corresponding state change ho jaye aur user ko pata chale ki api call ho rhi h ya nhi 
// aur jab api call ho rhi h to user ko loading dikhayenge taki user ko pata chale ki data aa rha h ya nhi aur jab data aa jaye to user ko updated address list dikhayenge taki user ko pata chale ki address add ho gya h ya update ho gya h ya delete ho gya h
  name: "address",
  initialState,  // upar use kiya h we use - Redux ko pata hona chahiye initial data kya hai. 
  reducers: {},  // reducers me hum wo functions define karte hain jo state ko update karte hain. Jaise ki addAddress, updateAddress, deleteAddress etc. Lekin kyuki hum API call kar rahe hain aur API call asynchronous hoti hai, isliye hum reducers me nahi likh sakte. Isliye hum extraReducers ka use karte hain.
                // Developers keep it for future usewe can remove it also since it is empty.
 
//  What is extraReducers?

// extraReducers is used to handle async actions.

// Your async actions are:

// addNewAddress
// fetchAllAddresses
// deleteAddress
// editAddress

// So extraReducers listens to their states:

// pending
// fulfilled
// rejected


// builder is just a helper object provided by Redux Toolkit.

// It helps us write reducers like this:

// builder.addCase(...)

// Instead of writing large switch statements.

// What is .pending?

// Every async thunk has 3 states:

// pending   → API call started
// fulfilled → API success
// rejected  → API failed

// Flow:

// User clicks button
//        ↓
// API call starts
//        ↓
// pending
//        ↓
// isLoading = true
//        ↓
// Show loading spinner

  extraReducers: (builder) => {
    builder
      .addCase(addNewAddress.pending, (state) => {
        state.isLoading = true; // When API starts we show loading indicator. Example in UI: Loading...
      })
      .addCase(addNewAddress.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(addNewAddress.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchAllAddresses.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllAddresses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addressList = action.payload.data;   // action is the object Redux sends when an API finishes. payload contains the data returned from backend API.
      })

// data

// Your backend probably returns something like:

// {
//   "success": true,
//   "data": [
//     { "city": "Delhi", "address": "Sector 10" },
//     { "city": "Noida", "address": "Sector 15" }
//   ]
// }

// So:

// action.payload.data

      .addCase(fetchAllAddresses.rejected, (state) => {
        state.isLoading = false;
        state.addressList = [];
      });
  },
});

export default addressSlice.reducer;



// What is Address Slice?

// In Redux Toolkit, a slice means:

// Ek state ka part + usko update karne ka logic.

// This slice manages all address related state in Redux.

// Why we create Address Slice?

// Hum address slice isliye banate hain taki:

// user ke saare addresses store ho sake
// address add / update / delete / fetch kar sake
// API call ka loading state manage ho sake

// isLoading	           API call chal rahi hai ya nahi
// addressList        	user ke saare addresses store


// export const deleteAddress = createAsyncThunk(
//   "/addresses/deleteAddress",
//   async ({ userId, addressId }) => {
//     const response = await axios.delete(
//       `${import.meta.env.VITE_API_URL}/api/shop/address/delete/${userId}/${addressId}`
//     );

//     return response.data;
//   }
// );
// This is not the actual API.
// This is a function that calls the API.