const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    image: String,  // isme image string h jo image ka URL hoga
    title: String,
    description: String,
    category: String,
    carat: String,
    price: Number,
    salePrice: Number,
    totalStock: Number,
    averageReview: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);