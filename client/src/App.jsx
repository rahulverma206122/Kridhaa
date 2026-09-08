import { Route, Routes } from "react-router-dom";

// 🔥 Routes kya hai?
// 👉 Ye ek container hai
// 👉 Iske andar tum saare routes define karte ho

// 🔥 Route kya hai?
// 👉 Ye ek mapping hai
// <Route path="/login" element={<Login />} />

import AuthLayout from "./components/auth/layout";
import AuthLogin from "./pages/auth/login";
import AuthRegister from "./pages/auth/register";
import AdminLayout from "./components/admin-view/layout";
import AdminDashboard from "./pages/admin-view/dashboard";
import AdminProducts from "./pages/admin-view/products";
import AdminOrders from "./pages/admin-view/orders";
import AdminFeatures from "./pages/admin-view/features";
import ShoppingLayout from "./components/shopping-view/layout";
import NotFound from "./pages/not-found";
import ShoppingHome from "./pages/shopping-view/home";
import ShoppingListing from "./pages/shopping-view/listing";
import ShoppingCheckout from "./pages/shopping-view/checkout";
import ShoppingAccount from "./pages/shopping-view/account";
import CheckAuth from "./components/common/check-auth";
import UnauthPage from "./pages/unauth-page";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "./store/auth-slice";
import { Skeleton } from "@/components/ui/skeleton";
import PaypalReturnPage from "./pages/shopping-view/paypal-return";
import PaymentSuccessPage from "./pages/shopping-view/payment-success";
import SearchProducts from "./pages/shopping-view/search";
import VisualSearchPage from "./pages/shopping-view/visual-search"; // NEW: standalone AI visual search page

function App() {
  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  );

  const dispatch = useDispatch();

  // 👉 Page load hote hi user login hai ya nahi check kar raha hai
  useEffect(() => {
    const storedToken = sessionStorage.getItem("token");

    // 🔥 IMPORTANT:
    // Agar sessionStorage me token nahi hai,
    // to /check-auth API call nahi karni.
    //
    // Pehle hum null token ke saath bhi checkAuth()
    // call kar rahe the, jiski wajah se:
    //
    // GET /api/auth/check-auth
    // Authorization: Bearer null
    //
    // aur backend 401 Unauthorized return kar raha tha.
    if (!storedToken) {
      return;
    }

    // 👉 Storage me token string ke form me stored hai
    // 👉 JSON.parse() usse original string me convert karta hai
    const token = JSON.parse(storedToken);

    // 👉 Sirf valid token hone par backend se auth check karo
    if (token) {
      dispatch(checkAuth(token));
    }
  }, [dispatch]);

  // 🔥 IMPORTANT:
  // Agar user ke paas token hai aur auth check chal raha hai,
  // tab loading screen dikhao.
  //
  // Agar user logged out hai aur token hi nahi hai,
  // to isLoading initially true hone ke bawajood
  // app ko block mat karo.
  const hasStoredToken = !!sessionStorage.getItem("token");

  if (isLoading && hasStoredToken) {
    return <Skeleton className="w-[800] bg-black h-[600px]" />;
  }

  //console.log(isLoading, user);

  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <Routes>
        {/* 
        👉 Yaha sirf CheckAuth hai
        👉 Koi UI (page/layout) nahi hai

        Matlab:
        👉 Ye sirf decide karega:
        kidhar bhejna hai user ko

        👉 Example:
        login nahi → /auth/login
        login hai → /shop/home

        👉 Ye khud kuch dikhata nahi hai ❌
        👉 Sirf redirect karta hai 🔄
        */}

        <Route
          path="/"  // 👉 Ye root route hai 👉 Isko generally homepage bolte hain but yha 👉 Pehle auth check ho raha hai
          element={
            <CheckAuth
              isAuthenticated={isAuthenticated}
              user={user}
            ></CheckAuth>
          }
        />

        {/* 
        CheckAuth bhi hai
        AuthLayout bhi hai
        andar login/register pages bhi hain
        */}

        <Route
          path="/auth"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AuthLayout />
            </CheckAuth>
          }
        >
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
        </Route>

        <Route
          path="/admin"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AdminLayout />
            </CheckAuth>
          }
        >
          {/* / kyu nhi lgaya 👉 Ye parent route ke andar likha hai
          mtlb /admin + dashboard = /admin/dashboard */}

          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="features" element={<AdminFeatures />} />
        </Route>

        <Route
          path="/shop"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <ShoppingLayout />
            </CheckAuth>
          }
        >
          <Route
            path="home"
            element={<ShoppingHome />}
          />
          {/* 
          When a user visits:
          http://yourdomain.com/shop/home

          React will render ShoppingHome because this route
          is defined inside the /shop parent route.
          */}

          <Route path="listing" element={<ShoppingListing />} />
          <Route path="checkout" element={<ShoppingCheckout />} />
          <Route path="account" element={<ShoppingAccount />} />
          <Route path="paypal-return" element={<PaypalReturnPage />} />
          <Route path="payment-success" element={<PaymentSuccessPage />} />
          <Route path="search" element={<SearchProducts />} />
          <Route path="visual-search" element={<VisualSearchPage />} /> {/* NEW */}
        </Route>

        <Route path="/unauth-page" element={<UnauthPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;


// 🔥 Interview Questions (must know)

// ❓ Q1: What does App.jsx do?
//
// 👉
// It handles routing and authentication logic of the application

// ❓ Q2: What is CheckAuth?
//
// 👉
// A wrapper component that protects routes based on authentication

// ❓ Q3: What is nested routing?
//
// 👉
// Routes inside routes using Outlet and layouts

// ❓ Q4: Why use useEffect here?
//
// 👉
// To check authentication when app loads

// ❓ Q5: What happens if route not found?
//
// 👉
// It goes to "*" route → NotFound page

// ❓ Q6: Why layouts?
//
// 👉
// To reuse common UI (header/sidebar)

// 🔥 Why we make routes in App.js?
//
// 👉 Simple:
//
// User kis URL pe kya dekhe — ye decide karne ke liye

// 🔹 Without routes kya hota?
//
// 👉 Agar routing na ho:
//
// Har URL pe same page dikhega 😵
//
// 👉 /login, /shop, /admin sab same UI

// 🔥 One-line yaad rakh
//
// 👉 Routes banate hain taaki different URLs pe different pages dikhe without page reload