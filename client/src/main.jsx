import { createRoot } from "react-dom/client"; // 👉 pure app ko DOM me render karne ke liye
import App from "./App.jsx";  // 👉 Pure app ka root UI
import "./index.css";  // 👉 Puri app pe apply hoti hai
import { BrowserRouter } from "react-router-dom";  // 👉 Routing enable karta hai
import { Provider } from "react-redux"; // 👉 Redux ko connect karta hai React app se
import store from "./store/store.js";
import { Toaster } from "./components/ui/toaster.jsx";  // 👉 Toast notifications ke liye

createRoot(document.getElementById("root")).render(

  // Wrapper structure
  <BrowserRouter>
    <Provider store={store}>
      <App />
      <Toaster />
    </Provider>
  </BrowserRouter>
);
   

// // 🔥 1. Kya ye entry point hai?
// // 👉 YES ✅
// // 👉 Ye hi file React app ka entry point hai
// // 👉 Yahi se pura app start hota hai

// // 🔥 2. Why we make this file?
// // 👉 Purpose:
// // •	React app ko DOM me mount karna

// // 🔹 Provider
// // 👉 Redux store ko pure app me available banata hai

// // 👉 Without this:
// // ❌ useSelector / dispatch kaam nahi karega


// 🔥 6. Interview Questions (IMPORTANT)
// ❓ Q1: Is this entry point?

// 👉 ✅ Yes
// This is the entry point where React app is mounted to the DOM

// ❓ Q2: Why BrowserRouter?

// 👉
// To enable client-side routing without page reload

// ❓ Q3: Why Provider?

// 👉
// To give access of Redux store to entire application

// ❓ Q4: What is store?

// 👉
// Central place where global state is stored

// ❓ Q5: What does createRoot do?

// 👉
// Creates root and renders React app into DOM

// ❓ Q6: Why Toaster outside App?

// 👉
// So it can be used globally from anywhere

// ❓ Q7: What happens if Provider is removed?

// 👉
// ❌ Redux hooks won’t work
// ❌ App will crash

// ❓ Q8: What happens if BrowserRouter is removed?

// 👉
// ❌ Routing break ho jayegi
// ❌ Link/navigation kaam nahi karega