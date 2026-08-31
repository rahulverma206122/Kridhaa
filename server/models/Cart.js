const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
  {
    userId: {  // an ObjectId
      type: mongoose.Schema.Types.ObjectId,  // “Ye field kisi aur document ki ID store karegi” use this To connect two collections (tables) cart → User se connected hai  MongoDB me har document ka ek unique id hota hai: ObjectId. Ye id automatically generate hota hai jab hum document create karte hain. ObjectId 12 bytes ka hota hai aur usme timestamp, machine id, process id, aur counter hota hai. Iska format kuch is tarah hota hai: 64f1a23b456c7890de123456
      ref: "User", //  it is not a random name ye usermodel(jo hum bna chuke h) ko refer kr rha h, so the mongose know the all details of user from usermodel      ref: "User" tells Mongoose: when I populate this field, go look into the User model
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

module.exports = mongoose.model("Cart", CartSchema);   // “Create a Cart model using CartSchema, and MongoDB will store data in a collection called cart.”
