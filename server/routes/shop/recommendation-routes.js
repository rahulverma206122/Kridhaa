const express = require("express");

const {
  getRecommendations,
} = require("../../controllers/shop/recommendation-controller");

const router = express.Router();

router.post(
  "/get",
  getRecommendations
);

module.exports = router;