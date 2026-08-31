const mongoose = require("mongoose");

const ProductReviewSchema = new mongoose.Schema(
  {
    productId: String,  // kisko review de rhe h
    userId: String,     // kon user h 
    userName: String,
    reviewMessage: String,
    reviewValue: Number, // 1 to 5
  },
  { timestamps: true }  // mtlb createdAt aur updatedAt fields automatically add ho jate h har review document me
);

//  "createdAt": "2026-04-27T10:00:00Z",
//   "updatedAt": "2026-04-27T10:00:00Z"

module.exports = mongoose.model("ProductReview", ProductReviewSchema);
