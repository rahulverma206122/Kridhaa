const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");

//register
const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;

  try {
    const checkUser = await User.findOne({ email });
    if (checkUser)
      return res.json({
        success: false,
        message: "User Already exists with the same email! Please try again",
      });

    const hashPassword = await bcrypt.hash(password, 12); // 12 is salt no
    const newUser = new User({
      userName,
      email,
      password: hashPassword, // password ko haspassword diya 
    });

    await newUser.save();

    res.status(200).json({
      success: true,
      message: "Registration successful",
    });
  } catch (e) {
    res.status(500).json({  // 500 means server error and 505 means client error
      success: false,
      message: "Some error occured",
    });
  }
};

//login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const checkUser = await User.findOne({ email });
    if (!checkUser)
      return res.json({
        success: false,
        message: "User doesn't exists! Please register first",  // ye msg frontend me jayega jab user login krne k liye email dalega aur wo email database me nhi hoga to ye msg aayega 
      }); // 👉 Yaha (backend me) ye message na console me dikhega, na UI me automatically ❌  if agar ui pr dikhana h to toast.error(res.data.message); and console pr to console.log(res.data.message);

//jab khi dikhega nhi to iska ky mtlb h kyu likha aisa msg kuch bhi likh dete
 // see at last 

    const checkPasswordMatch = await bcrypt.compare(
      password,  // password jo user ne abhi typ kiya h
      checkUser.password // password jo user ka asli h
    );
    if (!checkPasswordMatch)
      return res.json({
        success: false,
        message: "Incorrect password! Please try again",
      });

    const token = jwt.sign(
      {   // ye payload h 👉 Ye data token ke andar store hota hai, Sensitive data (password, OTP) kabhi mat daalna
        id: checkUser._id,
        role: checkUser.role,
        email: checkUser.email,
        userName: checkUser.userName,
      },
      "CLIENT_SECRET_KEY",   // 👉 Isse signature generate hota hai, Token ko tamper-proof banana, Verify karna ki token original hai
      { expiresIn: "60m" }  // ye token 60 min tak rhega   1h bhi likh sakte h 60s bhi likh sakte h
    );

//     "token" → cookie ka naam
// token → JWT value
// {...} → settings/options


// 🔐 secure: false

// 👉 HTTP pe bhi chalega (development)

// 👉 Production me:

// secure: true

// ➡️ sirf HTTPS pe chalega


    // res.cookie("token", token, { httpOnly: true, secure: false }).json({   // tum token ko cookie me store karna chahte ho instead of frontend storage
    //   success: true,
    //   message: "Logged in successfully",
    //   user: {
    //     email: checkUser.email,
    //     role: checkUser.role,
    //     id: checkUser._id,
    //     userName: checkUser.userName,
    //   },
    // });

    res.status(200).json({
      success : true,
      message : 'Logged in successfully',
      token,
      user: {  // user ka data ek object ke andar structured form me bhejne ke liye 👉 Ye frontend ko bheja jaata hai Jab user login karta hai
        email: checkUser.email,
         role: checkUser.role,
         id: checkUser._id,
         userName: checkUser.userName,
       },
     });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

//logout

const logoutUser = (req, res) => {  // await ni lagaya kyunki clearCookie() async operation nahi hai
  res.clearCookie("token").json({  // token jo as a cookie set kiya tha usko clear kar diya
    success: true,
    message: "Logged out successfully!",
  });
};

//auth middleware  // iska kam h jab bhi user refresh krega ye check krega authantic h ya nhi
// token hai ya nahi
// token valid hai ya nahi
// Ye login/register ke baad use hota hai
// ❌ Login route (NO middleware) bcz no token needed  router.post("/login", loginUser);
// with middleware router.get("/cart", authMiddleware, getCart);
//user login ho chuka hai
// token send karega
// middleware verify karega

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers['authorization'];  // 👉 req.headers = request ke headers (frontend se aate hain)
  // authorization header me usually token hota hai
  const token = authHeader && authHeader.split(' ')[1];  //  authHeader = "Bearer eyJhbGciOiJIUzI1Ni..." then ["Bearer", "eyJhbGciOiJIUzI1Ni..."] then token = "eyJhbGciOiJIUzI1Ni..."
  if (!token)
    return res.status(401).json({  // 401 means unauthorized
      success: false,
      message: "Unauthorised user!",
    });

  try {
    const decoded = jwt.verify(token, "CLIENT_SECRET_KEY"); // 👉 Agar valid hai → uske andar ka data (payload) milta hai
    req.user = decoded;  // or is payload ko req me bhej deta h 
    next();  // mtlb agle middleware ya controller function ko call karna
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Unauthorised user!",
    });
  }
};


// const authMiddleware = async (req, res, next) => {
//   const token = req.cookies.token;
//   if (!token)
//     return res.status(401).json({
//       success: false,
//       message: "Unauthorised user!",
//     });

//   try {
//     const decoded = jwt.verify(token, "CLIENT_SECRET_KEY");
//     req.user = decoded;
//     next();
//   } catch (error) {
//     res.status(401).json({
//       success: false,
//       message: "Unauthorised user!",
//     });
//   }
// };

module.exports = { registerUser, loginUser, logoutUser, authMiddleware };



// Bhai solid question 👏 — yahi real understanding hai backend-frontend ki.

// ---

// # 🔥 Short answer:

// 👉 **Ye message bekaar nahi hai**
// 👉 Ye **frontend ke liye instruction / data hai**

// ---

// # 🧠 Core concept samajh:

// 👉 Backend ka kaam:

// > “Result + message bhejna”

// 👉 Frontend ka kaam:

// > “Us message ko user ko dikhana”

// ---

// # 🔥 Matlab ye line:

// ```js
// message: "User doesn't exists! Please register first"
// ```

// 👉 Ye actually:
// ➡️ **frontend ko bheja gaya feedback hai**

// ---

// # 🧠 Real flow dekho:

// ## 🟢 Step 1: User login karta hai

// * Email enter karta hai

// ---

// ## 🟢 Step 2: Backend check karta hai

// ```js
// if (!checkUser)
// ```

// 👉 User nahi mila

// ---

// ## 🟢 Step 3: Backend bolta hai:

// ```js
// {
//   success: false,
//   message: "User doesn't exists!"
// }
// ```

// 👉 Ye frontend ko bhej diya

// ---

// ## 🟢 Step 4: Frontend decide karta hai:

// ### Option 1:

// ```js
// toast.error(res.data.message);
// ```

// 👉 UI me error dikh gaya ✅

// ---

// ### Option 2:

// ```js
// console.log(res.data.message);
// ```

// 👉 console me dikh gaya ✅

// ---

// ### Option 3:

// 👉 kuch nahi kiya
// 👉 ❌ kuch bhi nahi dikhega

// ---

// # 🔥 To fir kyu likhte hain message?

// 👉 3 main reasons:

// ---

// ## ✅ 1. User feedback

// 👉 User ko pata chale:

// > “Kyu login fail hua?”

// ---

// ## ✅ 2. Debugging

// 👉 Dev ko samajh aaye:

// > “Issue kya hai?”

// ---

// ## ✅ 3. Standard API design

// 👉 Har response me:

// ```js
// {
//   success,
//   message,
//   data
// }
// ```

// 👉 Clean + consistent structure ✔️

// ---

// # 🧠 Important understanding:

// 👉 Backend bina message ke bhi kaam kar sakta hai ❌
// 👉 But **user experience kharab ho jayega**

// ---

// # ⚡ Wrong approach:

// ```js
// return res.json({ success: false });
// ```

// 👉 User: “kya hua?? 🤯”

// ---

// # ✅ Correct:

// ```js
// return res.json({
//   success: false,
//   message: "User doesn't exists!"
// });
// ```

// 👉 User: “ohh account hi nahi hai 👍”

// ---

// # 🧠 Simple analogy:

// 👉 Backend = doctor report
// 👉 Frontend = doctor jo explain karta hai

// 👉 Report me likha hona zaroori hai 😄

// ---

// # ⚡ Interview one-liner:

// 👉 **“Messages are sent from backend to inform the frontend about the result of an operation, improving user experience and debugging.”**

// ---

// # 🔥 Final clarity:

// 👉 Message likhna = **communication**
// 👉 Dikhana = **frontend responsibility**


