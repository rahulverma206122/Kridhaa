const paypal = require("paypal-rest-sdk"); // Loads the official PayPal REST SDK(Software Development Kit) for Node.js.This SDK provides methods to create, execute, and manage payments.

console.log("Mode:", process.env.PAYPAL_MODE);
console.log("Client ID starts with:", process.env.PAYPAL_CLIENT_ID?.slice(0,10));

paypal.configure({
  // mode: process.env.PAYPAL_MODE, // "sandbox" or "live"
  // client_id: process.env.PAYPAL_CLIENT_ID,
  // client_secret: process.env.PAYPAL_CLIENT_SECRET
  mode:"sandbox", // mode – Determines environment:mode – Determines environment:"live" → real PayPal transactions.
  client_id:  process.env.PAYPAL_CLIENT_ID, // Credentials from your PayPal app.
  client_secret:  process.env.PAYPAL_CLIENT_SECRET,
});

module.exports = paypal;
