const express = require("express");

// jo bhi hmne controller me bnaya h yha pr usske rotes bnege
const {
  addToCart,
  fetchCartItems,
  deleteCartItem,
  updateCartItemQty,
} = require("../../controllers/shop/cart-controller");

const router = express.Router();

router.post("/add", addToCart);
router.get("/get/:userId", fetchCartItems);
router.put("/update-cart", updateCartItemQty);
router.delete("/:userId/:productId", deleteCartItem);

module.exports = router;



 // i have a confusion here /update-cart or /:userId/:productId etc this we do by myself
 // mtlb apne man se ya kisi wjh se ya krna hi pdega ye ya kuch or bhi kr skte h

//  Short answer:
// 👉 You choose these routes yourself (no fixed rule), BUT
// 👉 There are best practices you should follow

// 🔹 Your routes:
// POST   /add
// GET    /get/:userId
// PUT    /update-cart
// DELETE /:userId/:productId

// 👉 These are working, but not very “standard REST style”


//How to think about it?

// There are 2 ways:

// 🔥 1. Your current way (custom naming)

// 👉 You are naming routes like:

// /add
// /get
// /update-cart

// ✔️ Totally valid
// ✔️ Works fine
// ❌ But not clean for big systems

// 🚀 2. Standard REST API way (recommended)

// 👉 Use resource-based URLs + HTTP methods

// 🔹 Better version:
// POST   /cart              // add item
// GET    /cart/:userId      // get cart
// PUT    /cart              // update cart
// DELETE /cart/:userId/:productId  // delete item

// Then why sometimes :userId in URL?

// 👉 When data is part of URL → use params



//i have a confusion when we use req.body and when we use req.params tell me each and everything about this 

// req.body Jab data backend ko send karte ho (hidden)
// req.params Jab data URL me hota hai (visible)

// 👉 Difference is NOT about code
// 👉 It’s about INTENT (tum kya karna chahte ho)

// 🧠 Think like this:
// 🔹 1. Kya tum kisi cheez ko “identify” kar rahe ho?

// 👉 Like:

// kaunsa user?
// kaunsa product?
// kaunsa order?

// 👉 Then use → req.params

// 🔹 2. Kya tum “data bhej rahe ho / change kar rahe ho”?

// 👉 Like:

// quantity update karni hai
// product add karna hai
// form submit karna hai

// 👉 Then use → req.body

// 🔥 Real-world thinking (no code)
// 🟢 Case 1:

// 👉 “Mujhe user 123 ka data chahiye”

// Tum sirf bata rahe ho kaunsa user
// Tum data nahi bhej rahe

// 👉 ✅ params

// 🟢 Case 2:

// 👉 “User 123 ka name change kar do to Rahul”

// Tum change kar rahe ho
// Tum new data bhej rahe ho

// 👉 ✅ body