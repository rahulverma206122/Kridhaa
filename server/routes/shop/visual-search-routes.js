const express = require("express");

const {
  visualSearch,
} = require("../../controllers/shop/visual-search-controller");

const upload = require("../../middleware/upload");

const router = express.Router();

// ========================================
// AI Visual Jewelry Search
// ========================================
// POST /api/shop/visual-search/search
//
// Flow:
//
// Frontend
//    ↓
// Upload image
//    ↓
// Multer receives image
//    ↓
// visualSearch controller
//    ↓
// AI image analysis
//    ↓
// Similar jewelry products
// ========================================

router.post(
  "/search",
  upload.single("image"),
  visualSearch
);

module.exports = router;