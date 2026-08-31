const express = require("express"); // yha express ek framework hai jisse hum apne server ke routes create karte hai, is file me hum search se related routes banayenge jisse frontend se search request aayegi aur uska response jayega

const { searchProducts } = require("../../controllers/shop/search-controller");

const router = express.Router();  // router ek object hai jisme hum apne routes define karte hai, is file me hum search se related route define kareng
// express.Router() ek function hai jo ek naya router object banata hai, jisme hum routes (GET, POST, etc.) define kar sakte hain.
router.get("/:keyword", searchProducts);

module.exports = router;


 // :keyword kiya h kyu ki controller me hum use params se le rhe h mtlb yha use url me dynmic bnna pdega jisse ise le ske