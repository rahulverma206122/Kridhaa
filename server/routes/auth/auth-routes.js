const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  authMiddleware,
} = require("../../controllers/auth/auth-controller");

const router = express.Router();

router.post("/register", registerUser); //"/register" - ye endpoint h jaha se frontend se registration request aayegi, jab user apne aap ko register karega to wo is endpoint pe POST request bhejega jisme user ke details (name, email, password) honge, ye request auth controller ke registerUser function ko handle karegi jo ki user ko register karne ka logic implement karega
router.post("/login", loginUser);
router.post("/logout", logoutUser);  // ye logout user auth controler.js se aaya h

// 🔥 Flow yaha kya hota hai?
// Request aayi
//    ↓
// authMiddleware chalega
//    ↓
// Token verify hoga
//    ↓
// Valid → next() → neeche wala function chalega
// Invalid → error return (yaha tak nahi aayega)

router.get("/check-auth", authMiddleware, (req, res) => {  // normal kyu ni likha - Kyuki ye protected route hai — pehle verify karna hai user login hai ya nahi
  const user = req.user; // req.user → middleware ne set kiya hai JWT decode karke user info yaha store hoti hai
  
//   req.user = {
//   id: "123",
//   email: "rahul@gmail.com"
// }

  res.status(200).json({  // .json() method ka use karke hum response me JSON format me data bhej rahe hai, yaha hum success: true aur user info bhej rahe hai jisse frontend ko pata chal jayega ki user authenticated hai aur uske details kya hai
    success: true,
    message: "Authenticated user!",
    user, // User ka data bhej rahe ho frontend ko taki wo uske hisab se UI render kar sake, jaise ki user ka naam dikhana ya uske role ke hisab se options dikhana, etc.
  });
});

module.exports = router;


// 🧠 Agar normal likhte
// router.get("/check-auth", (req, res) => {
//   res.json({ success: true });
// });

// 👉 ❌ Problem:

// koi bhi call kar sakta hai
// bina login ke bhi access mil jayega

// 🔐 Middleware wala flow
// router.get("/check-auth", authMiddleware, handler)