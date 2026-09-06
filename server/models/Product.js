// const mongoose = require("mongoose");

// const ProductSchema = new mongoose.Schema(
//   {
//     image: String,  // isme image string h jo image ka URL hoga
//     title: String,
//     description: String,
//     category: String,
//     carat: String,
//     price: Number,
//     salePrice: Number,
//     totalStock: Number,
//     averageReview: Number,
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Product", ProductSchema);



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

    // ========================================
    // AI Visual Jewelry Search
    // ========================================
    // This stores the numerical vector
    // generated from the product image.
    // MongoDB Vector Search will use this
    // to find visually similar jewelry.
    imageEmbedding: {
      type: [Number],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);