const express = require("express");

const { searchProducts } = require("../../controllers/shop/search-controller");

const router = express.Router();

router.get("/:keyword", searchProducts);

module.exports = router;


 // :keyword kiya h kyu ki controller me hum use params se le rhe h mtlb yha use url me dynmic bnna pdega jisse ise le ske