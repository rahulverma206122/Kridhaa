const mongoose = require("mongoose");  // mongoose ek library hai jo MongoDB ke saath interact karne ke liye use hoti hai. Ye hume schema define karne aur database operations perform karne me madad karti hai.

const OrderSchema = new mongoose.Schema({
  userId: String,
  cartId: String,
  cartItems: [   // cartItems array hai kyunki ek order me multiple products ho sakte hain
    {
      productId: String,
      title: String,
      image: String,
      price: String,
      quantity: Number,
    },
  ],
  addressInfo: {   // addressInfo object hai kyunki ek order ka ek hi address hota hai
    addressId: String,
    address: String,
    city: String,
    pincode: String,
    phone: String,
    notes: String,
  },
  orderStatus: String,
  paymentMethod: String,
  paymentStatus: String,
  totalAmount: Number,
  orderDate: Date,
  orderUpdateDate: Date,
  paymentId: String,
  payerId: String,
});

module.exports = mongoose.model("Order", OrderSchema); // "Order" = collection name (MongoDB me) 
// Node.js me har file ek module hoti hai
// module.exports = ... → Ye syntax use karke hum apne Order model ko export kar rahe hain, taaki hum is model ko apne controllers me import karke use kar sakein.
// model = database se baat karne ka object
// 👉 Haan, yaha Order hi model hai ✅
// Collection = MongoDB me data store hone ki jagah (table jaisa)
// Schema = Data ka structure define karta hai (columns jaisa)
// ✔️ Order model banta hai (code me)
// ✔️ orders collection banti hai (database me)
// Document = collection ke andar ek single data record (row jaisa)

// document 
// {
//   "_id": "2",
//   "userId": "u2",
//   "amount": 1000
// }