const express = require("express");

const {
  getAIJewelryRecommendation,
} = require("../../controllers/common/ai-controller");

const router = express.Router();

router.post(
  "/recommend",
  getAIJewelryRecommendation
);

module.exports = router;