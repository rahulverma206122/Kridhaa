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

const store = configureStore({  // see notes
  reducer: {
    
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
  },
});

export default store;
