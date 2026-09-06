// import { Navigate, useLocation } from "react-router-dom";

// function CheckAuth({ isAuthenticated, user, children }) {
//   const location = useLocation();

//  // console.log(location.pathname, isAuthenticated);
// // location.pathname 👉 Current URL ka path deta hai
// //  "/" 👉 mtlb home page
//   if (location.pathname === "/") {  // mtlb jab bhi koi user site khole to ye check kro ki wo authenticated h ya nhi, agr nhi h to login page pr bhej do, agr h to uske role ke hisab se usko dashboard pr bhej do
//     if (!isAuthenticated) { 
//       return <Navigate to="/auth/login" />;
//     } else {
//       if (user?.role === "admin") {
//         return <Navigate to="/admin/dashboard" />;
//       } else {
//         return <Navigate to="/shop/home" />;
//       }
//     }
//   }

//   if (
//     !isAuthenticated &&
//     !(
//       location.pathname.includes("/login") ||
//       location.pathname.includes("/register") // check kr rhe h ki current URL me /register part hai ya nahi.
//     )
//   ) {
//     return <Navigate to="/auth/login" />;
//   }

//   if (
//     isAuthenticated &&
//     (location.pathname.includes("/login") ||   // || ka mtlb h ki ya to login page pr h ya register page pr h, agr aisa h to usko home page pr bhej do kyuki wo already authenticated h)
//       location.pathname.includes("/register"))
//   ) {
//     if (user?.role === "admin") {  // yha pr === ka mtlb h strictly check if we use ==  Agar user.role "admin" (string) hai → ✅ dono me same result type conversion
//       return <Navigate to="/admin/dashboard" />;
//     } else {
//       return <Navigate to="/shop/home" />;
//     }
//   }

//   if (
//     isAuthenticated &&
//     user?.role !== "admin" &&
//     location.pathname.includes("admin")
//   ) {
//     return <Navigate to="/unauth-page" />;
//   }

//   if (
//     isAuthenticated &&
//     user?.role === "admin" &&
//     location.pathname.includes("shop")
//   ) {
//     return <Navigate to="/admin/dashboard" />;
//   }
// // <> </> fregment h nad children upar defined h 
//   return <>{children}</>;  
// }

// export default CheckAuth;


import { Navigate, useLocation } from "react-router-dom";

function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();

  // Allow everyone to access the home page
  if (location.pathname === "/") {
    return <Navigate to="/shop/home" />;
  }

  // Public shopping pages
  // Guests can browse products, search, use visual search, etc.
  const publicShoppingRoutes = [
    "/shop/home",
    "/shop/listing",
    "/shop/search",
    "/shop/visual-search",
  ];

  const isPublicShoppingRoute = publicShoppingRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  if (isPublicShoppingRoute) {
    return <>{children}</>;
  }

  // Login/Register pages
  if (
    location.pathname.includes("/login") ||
    location.pathname.includes("/register")
  ) {
    if (isAuthenticated) {
      if (user?.role === "admin") {
        return <Navigate to="/admin/dashboard" />;
      } else {
        return <Navigate to="/shop/home" />;
      }
    }

    return <>{children}</>;
  }

  // Everything below this point requires authentication
  if (!isAuthenticated) {
    return (
  <Navigate
    to="/auth/login"
    state={{ from: location.pathname }}
    replace
  />
);
  }

  // Normal users cannot access admin pages
  if (
    isAuthenticated &&
    user?.role !== "admin" &&
    location.pathname.includes("admin")
  ) {
    return <Navigate to="/unauth-page" />;
  }

  // Admin users cannot access shopping pages that require a customer account
  if (
    isAuthenticated &&
    user?.role === "admin" &&
    location.pathname.includes("shop/checkout")
  ) {
    return <Navigate to="/admin/dashboard" />;
  }

  return <>{children}</>;
}

export default CheckAuth;