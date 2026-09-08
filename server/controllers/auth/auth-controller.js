const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");
const User = require("../../models/User");

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID
);

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
      password: hashPassword, // password ko hashpassword diya
    });

    await newUser.save();

    res.status(200).json({
      success: true,
      message: "Registration successful",
    });
  } catch (e) {
    res.status(500).json({
      // 500 means server error and 505 means client error
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
        message: "User doesn't exists! Please register first",
        // ye msg frontend me jayega jab user login krne ke liye
        // email dalega aur wo email database me nhi hoga
      });

    const checkPasswordMatch = await bcrypt.compare(
      password, // password jo user ne abhi typ kiya h
      checkUser.password // password jo user ka asli h
    );

    if (!checkPasswordMatch)
      return res.json({
        success: false,
        message: "Incorrect password! Please try again",
      });

    const token = jwt.sign(
      {
        // ye payload h
        // Ye data token ke andar store hota hai
        // Sensitive data (password, OTP) kabhi mat daalna
        id: checkUser._id,
        role: checkUser.role,
        email: checkUser.email,
        userName: checkUser.userName,
      },
      "CLIENT_SECRET_KEY",
      // 👉 Isse signature generate hota h
      // Token ko tamper-proof banana
      // Verify karna ki token original hai

      { expiresIn: "60m" } // ye token 60 min tak rhega
    );

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token,

      user: {
        // user ka data ek object ke andar structured form me bhejne ke liye
        // Ye frontend ko bheja jaata h Jab user login karta h

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


// ============================================================
// GOOGLE LOGIN
// ============================================================
// Google Identity Services frontend se ek ID token bhejega.
// Backend us token ko verify karega.
//
// Flow:
//
// Google
//   ↓
// Frontend gets credential
//   ↓
// POST /google-login
//   ↓
// Backend verifies Google ID token
//   ↓
// Find user by email
//   ↓
// Existing user → login
// New user → create account
//   ↓
// Our normal JWT
//   ↓
// Frontend stores token
// ============================================================

const googleLoginUser = async (req, res) => {
  const { credential } = req.body;

  if (!credential) {
    return res.status(400).json({
      success: false,
      message: "Google credential is required",
    });
  }

  if (!process.env.GOOGLE_CLIENT_ID) {
    console.error("GOOGLE_CLIENT_ID is missing in server environment");

    return res.status(500).json({
      success: false,
      message: "Google authentication is not configured",
    });
  }

  try {
    // Verify the ID token received from Google
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(401).json({
        success: false,
        message: "Invalid Google credential",
      });
    }

    const {
      sub: googleId,
      email,
      email_verified,
      name,
    } = payload;

    // Google email verification check
    if (!email || !email_verified) {
      return res.status(401).json({
        success: false,
        message: "Google email could not be verified",
      });
    }

    // ========================================================
    // Find existing user
    // ========================================================

    let checkUser = await User.findOne({ email });

    // ========================================================
    // If user doesn't exist:
    // Create a new account automatically
    // ========================================================

    if (!checkUser) {
      let userName =
        name?.trim() ||
        email.split("@")[0];

      // userName is unique in your current User schema.
      // To avoid duplicate username errors, create a unique
      // username if necessary.

      const existingUserName = await User.findOne({
        userName,
      });

      if (existingUserName) {
        userName = `${userName}_${crypto
          .randomBytes(3)
          .toString("hex")}`;
      }

      // Your current User schema requires password.
      // Google users don't provide our app password,
      // so we create a random hashed password.
      //
      // This password is never shown to the user and
      // cannot be used through the normal Google login flow.

      const randomPassword = crypto.randomBytes(32).toString("hex");

      const hashPassword = await bcrypt.hash(
        randomPassword,
        12
      );

      checkUser = new User({
        userName,
        email,
        password: hashPassword,
      });

      await checkUser.save();
    }

    // ========================================================
    // Create OUR application's JWT
    //
    // Same JWT structure as normal email/password login.
    // This means the rest of your application doesn't need
    // a separate authentication system.
    // ========================================================

    const token = jwt.sign(
      {
        id: checkUser._id,
        role: checkUser.role,
        email: checkUser.email,
        userName: checkUser.userName,
      },
      "CLIENT_SECRET_KEY",
      { expiresIn: "60m" }
    );

    // ========================================================
    // Send same response structure as normal login
    //
    // This is important because your existing Redux
    // login/check-auth flow expects token + user.
    // ========================================================

    return res.status(200).json({
      success: true,
      message: "Google login successful",
      token,

      user: {
        email: checkUser.email,
        role: checkUser.role,
        id: checkUser._id,
        userName: checkUser.userName,
      },

      googleId,
    });
  } catch (error) {
    console.error("Google Login Error:", error);

    return res.status(401).json({
      success: false,
      message: "Google authentication failed",
    });
  }
};


//logout

const logoutUser = (req, res) => {
  // await ni lagaya kyunki clearCookie()
  // async operation nahi hai

  res.clearCookie("token").json({
    success: true,
    message: "Logged out successfully!",
  });
};


//auth middleware
// iska kam h jab bhi user refresh krega ye check krega authantic h ya nhi

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  // req.headers = request ke headers
  // frontend se aate hain

  const token =
    authHeader && authHeader.split(" ")[1];

  // authHeader =
  // "Bearer eyJhbGciOiJIUzI1Ni..."
  //
  // ["Bearer", "eyJhbGciOiJIUzI1Ni..."]
  //
  // token =
  // "eyJhbGciOiJIUzI1Ni..."

  if (!token)
    return res.status(401).json({
      success: false,
      message: "Unauthorised user!",
    });

  try {
    const decoded = jwt.verify(
      token,
      "CLIENT_SECRET_KEY"
    );

    req.user = decoded;

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Unauthorised user!",
    });
  }
};


module.exports = {
  registerUser,
  loginUser,
  googleLoginUser,
  logoutUser,
  authMiddleware,
};