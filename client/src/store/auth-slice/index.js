import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";  // ye ek library h axios is used to make HTTP requests to the backend API. It simplifies the process of sending requests and handling responses. 

const initialState = {//
  isAuthenticated: false,
  isLoading: true,
  user: null,
  token: null,
};

export const registerUser = createAsyncThunk(
  "/auth/register",

  async (formData) => {
    const response = await axios.post(  // Calls POST   /api/auth/register with formData (name, email, password).
      `${import.meta.env.VITE_API_URL}/api/auth/register`,  // jo server.js me hota h wo phle lgta h jaise phle/api/auth fir /register kyu ki ye routes wali file me h 
      formData,
      {
        withCredentials: true,  // withCredentials: true → Sends cookies  
        // Frontend jab request bhejta hai, tab uske saath browser automatically cookie bhi server ko bhejta hai (agar withCredentials: true ho)
      }
    );

    return response.data;   // Returns response.data → Example: {success: true, message: "User registered"}.
  }
);

export const loginUser = createAsyncThunk(
  "/auth/login",

  async (formData) => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/auth/login`,
      formData,
      {
        withCredentials: true,
      }
    );

    return response.data;
  }
);


// 🔥 Google OAuth Login
// Frontend Google se credential (ID token) lega
// ↓
// Backend ko credential bhejega
// ↓
// Backend Google token verify karega
// ↓
// User mil gaya → Login
// User nahi mila → New account create
export const googleLoginUser = createAsyncThunk(
  "/auth/google-login",

  async (credential) => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/auth/google-login`,
      {
        credential,
      },
      {
        withCredentials: true,
      }
    );

    return response.data;
  }
);


export const logoutUser = createAsyncThunk(
  "/auth/logout",

  async () => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/auth/logout`,
      {},
      {
        withCredentials: true,
      }
    );

    return response.data;
  }
);

// export const checkAuth = createAsyncThunk(
//   "/auth/checkauth",

//   async () => {
//     const response = await axios.get(
//       `${import.meta.env.VITE_API_URL}/api/auth/check-auth`,
//       {
//         withCredentials: true,
//         headers: {
//           "Cache-Control":
//             "no-store, no-cache, must-revalidate, proxy-revalidate",
//         },
//       }
//     );

//     return response.data;
//   }
// );


export const checkAuth = createAsyncThunk(
  "/auth/checkauth",

  async (token) => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/auth/check-auth`,
      {
        headers: {  // Bearer ek keyword hai jo batata hai ki token kis type ka hai
          Authorization : `Bearer ${token}`,  // 👉 Server ko bol rahe: “Ye user authenticated hai — ye uska token hai”    Backend me kaise milta hai? - req.headers.authorization fir authHeader.split(" ")[1]
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",  // browser ko bol rahe: “Is response ko cache mat karo”    kyunki auth status change ho sakta hai, aur hume hamesha latest status chahiye hota hai. Agar browser cache karega, toh purana auth status mil sakta hai, jo galat hoga.
        },// no-store - bilkul store mat karo, no-cache - reuse mat karo, must-revalidate - har baar server check karo, proxy server bhi har baar server check kare

// headers kya hote hain?

// 👉 HTTP request ke saath extra info bhejte hain
// ➡️ Server ko batane ke liye “request ka context kya hai”

      }
    );

    return response.data;
  }
);

const authSlice = createSlice({//
  name: "auth", // name of slice
  initialState,  // ye upar defined h
  reducers: {
    setUser: (state, action) => {},  // empty now
    resetTokenAndCredentials : (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
    }
  },

  // reducer kab chlega 
// dispatch(resetTokenAndCredentials());

// 👉 Tab ye reducer chalega ✔
// 👉 State update ho jayega:

  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;  
        state.user = null;  // Registration ke baad user ko null set karna hai, kyunki abhi wo login nahi hua hai. Registration successful hone ke baad bhi user ko login karna padta hai.
        state.isAuthenticated = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })

      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        // console.log(action);

        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;
        state.token = action.payload.token;
        sessionStorage.setItem('token', JSON.stringify(action.payload.token));

// 1️⃣ sessionStorage

// 👉 Browser ka storage hai (temporary)
// Tab close → data delete
// Same tab me available

// setItem(key, value)
// 👉 Data store karne ka method
// sessionStorage.setItem("token", value);
// "token" → key
// value → actual data

// 🔥 JSON.stringify() kya karta hai?

// JavaScript object (ya data) ko string me convert karta hai
//
// 🧠 Example
// 🟢 Without stringify (object)
// const user = {
//   name: "Rahul",
//   age: 22
// };
//
// 🔴 Storage me directly nahi ja sakta
// sessionStorage.setItem("user", user); ❌
// ✅ With stringify
// sessionStorage.setItem("user", JSON.stringify(user));
//
// 👉 Store hoga:
//
// "{\"name\":\"Rahul\",\"age\":22}"

      })

      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.token = null;
      })


      // 🔥 Google OAuth states
      .addCase(googleLoginUser.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(googleLoginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;
        state.token = action.payload.token;

        // Google login ke baad JWT token ko
        // existing normal login ki tarah sessionStorage me save karna
        if (action.payload.success && action.payload.token) {
          sessionStorage.setItem(
            "token",
            JSON.stringify(action.payload.token)
          );
        }
      })

      .addCase(googleLoginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.token = null;
      })


      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })

      .addCase(logoutUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { setUser,resetTokenAndCredentials } = authSlice.actions; //resetTokenAndCredentials
export default authSlice.reducer;