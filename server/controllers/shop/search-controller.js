const Product = require("../../models/Product");

const searchProducts = async (req, res) => {
  try {
    const { keyword } = req.params;  
    if (!keyword || typeof keyword !== "string") {  // || ka mtlb h dono conditions me se koi bhi true h to ye condition true ho jayegi, yha hum check kar rhe h ki keyword exist karta h ya nhi aur wo string format me h ya nhi, agar keyword nhi h ya wo string nhi h to hum error response bhejenge
      return res.status(400).json({  // 400 status code ka mtlb h bad request, iska use tab hota h jab client se aayi hui request me kuch galat ho, yha hum isliye 400 status code bhej rhe h kyunki client se aayi hui request me keyword ya to missing h ya wo string format me nhi h, isliye hum client ko batana chahte h ki unki request me kuch galat hai
        succes: false,
        message: "Keyword is required and must be in string format",
      });
    }

    const regEx = new RegExp(keyword, "i");  // RegExp constructor ka use karke hum ek regular expression bana rhe h jisme keyword ko case-insensitive (i flag) search ke liye use kar rhe h, iska mtlb h ki agar user ne "gold" search kiya to wo "Gold", "GOLD", "goLD" etc. sabko match karega, isse hum apne search ko aur flexible bana sakte h

    const createSearchQuery = {
      $or: [ // $or operator ka use karke hum multiple conditions me se kisi ek condition ke true hone par document ko match kar sakte h, yha hum $or operator ka use karke title, description, category aur carat fields me keyword ke match hone par product ko search results me include kar rhe h
        //{ title: { $regex: new RegExp(`\\b${keyword}\\b`, "i") } },
        //{ description: { $regex: new RegExp(`\\b${keyword}\\b`, "i") } },

        { title: regEx },
        { description: regEx },
        //{ category: { $regex: new RegExp(`^${keyword}$`, "i") } }, // exact match
        //{ carat: { $regex: new RegExp(`^${keyword}$`, "i") } },   // exact match
        { category: regEx },
        { carat: regEx },
      ],
    };

    const searchResults = await Product.find(createSearchQuery);  // searchResults = ARRAY of objects (documents) ✅ array hai ✔️ andar objects hain ✔️

    res.status(200).json({
      success: true,
      data: searchResults,
    });
  } catch (error) {
   // console.log(error);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

module.exports = { searchProducts };