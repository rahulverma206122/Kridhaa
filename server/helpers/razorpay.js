const Razorpay = require("razorpay");

// Razorpay ka instance banate hain, jaise humne PayPal SDK ko configure kiya tha.
// Yaha bhi humein apni API keys (.env se) chahiye taaki Razorpay ke saath
// communicate kar sakein (order create karna, payment verify karna, etc.)

// mode ka concept Razorpay me nahi hota jaise PayPal me tha ("sandbox"/"live") —
// iski jagah Razorpay Test Mode aur Live Mode alag-alag API KEYS se decide hote
// hain. Jab tak tum Test keys (rzp_test_...) use kar rahe ho, sab kuch "sandbox"
// jaisa hi kaam karega — koi real paisa nahi katega.

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

module.exports = razorpayInstance;

// npm i razorpay