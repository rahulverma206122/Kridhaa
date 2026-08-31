const express = require("express");

const {
  addAddress,
  fetchAllAddress,
  editAddress,
  deleteAddress,
} = require("../../controllers/shop/address-controller");  // Step-by-step path resolution

// 1️⃣ First ..

// server/routes/shop
//         ↑
//         ..
// server/routes

// So after first .. you reach routes, not shop.

// 2️⃣ Second ..

// server/routes
//         ↑
//         ..
// server

// Now you reach the server folder.

const router = express.Router(); // iska mtlb h ki hum express.router() function ko call krke ek naya route bna rhe h. express.Router() function ek router object return karta hai jisme hum apne routes define kar sakte hai. is router object ko hum module.exports ke through export karenge taki hum isko apne main server file me import karke use kar sake.

router.post("/add", addAddress);  // // yha /add ka mtlb h ki jab client /add endpoint pe POST request bhejega to ye route match karega aur addAddress controller function ko call karega. 
router.get("/get/:userId", fetchAllAddress);  // yha /get/:userId ka mtlb h ki jab client /get/someUserId jaisa URL pe GET request bhejega to ye route match karega aur fetchAllAddress controller function ko call karega. :userId ka mtlb h ki ye ek dynamic parameter hai jisme someUserId ki jagah koi bhi userId aa sakta hai. is tarah se hum specific user ke addresses ko fetch kar sakte hai.
router.delete("/delete/:userId/:addressId", deleteAddress);
router.put("/update/:userId/:addressId", editAddress);

module.exports = router;
