import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import adminProductsSlice from "./admin/products-slice";
import adminOrderSlice from "./admin/order-slice";

import shopProductsSlice from "./shop/products-slice";
import shopCartSlice from "./shop/cart-slice"; // 👉 shopCartSlice here is just a variable name you choose for the default export of "./shop/cart-slice".
import shopAddressSlice from "./shop/address-slice";
import shopOrderSlice from "./shop/order-slice";  
import shopSearchSlice from "./shop/search-slice";
import shopReviewSlice from "./shop/review-slice"; // You are just naming it shopReviewSlice when importing (this is an alias, you can name it anything).That default export is actually reviewSlice.reducer.You are importing the default export from review-slice.js.You only export the reducer (not the whole slice).That’s why when importing, you don’t need to use the same name.
import commonFeatureSlice from "./common-slice";

import aiReducer from "./shop/ai-slice";

import recommendationReducer from "./shop/recommendation-slice";

import visualSearchReducer from "./shop/visual-search-slice";

const store = configureStore({  // see notes configureStore is a function from Redux Toolkit that helps us create a Redux store easily. It automatically sets up the store with good defaults
  reducer: {  // A reducer is a function that changes the state when an action happens.
    
    auth: authReducer,  

    adminProducts: adminProductsSlice,
    adminOrder: adminOrderSlice,

    shopProducts: shopProductsSlice,
    shopCart: shopCartSlice,
    shopAddress: shopAddressSlice,
    shopOrder: shopOrderSlice,
    shopSearch: shopSearchSlice,
    shopReview: shopReviewSlice, // yha pr bhi shopreviewslice ko shopreview name diya h   Yaha left side (shopReview) aap jo bhi naam doge wo global state me key ban jayega.
// Right side (shopReviewSlice) wo actual reducer hai jo aapne review-slice.js se import kiya hai.
    commonFeature: commonFeatureSlice,

    ai: aiReducer,

    recommendations: recommendationReducer,

    visualSearch: visualSearchReducer,
  },

  // 🔥 Redux development warning configuration
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        warnAfter: 100,
      },
    }),
});

export default store;