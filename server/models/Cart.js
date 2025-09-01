const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
  {
    userId: {  // an ObjectId
      type: mongoose.Schema.Types.ObjectId,  // This tells Mongoose that the field will store a MongoDB ObjectId. MongoDB generates a 12-byte ObjectId like 64f1a23b456c7890de123456
      ref: "User", //  it is not a random name ye usermodel ko refer kr rha h, so the mongose know the all details of user from usermodel      ref: "User" tells Mongoose: when I populate this field, go look into the User model
      required: true,  // // must be present
    },
    items: [  // items: an array
      {
        productId: { // productId: ObjectId
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",   // references the "Product" model
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,   // quantity must be >= 1
        },
      },
    ],
  },
  {
    timestamps: true,   // adds createdAt and updatedAt automatically  
  } 
);

module.exports = mongoose.model("Cart", CartSchema);
