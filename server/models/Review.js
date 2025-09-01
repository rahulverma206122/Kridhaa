const mongoose = require("mongoose");

const ProductReviewSchema = new mongoose.Schema(
  {
    productId: String,  // kisko review de rhe h
    userId: String,     // kon user h 
    userName: String,
    reviewMessage: String,
    reviewValue: Number, // 1 to 5
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProductReview", ProductReviewSchema);
