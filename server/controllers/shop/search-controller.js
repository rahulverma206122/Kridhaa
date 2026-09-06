// const Product = require("../../models/Product");

// const searchProducts = async (req, res) => {
//   try {
//     const { keyword } = req.params;  
//     if (!keyword || typeof keyword !== "string") {  // || ka mtlb h dono conditions me se koi bhi true h to ye condition true ho jayegi, yha hum check kar rhe h ki keyword exist karta h ya nhi aur wo string format me h ya nhi, agar keyword nhi h ya wo string nhi h to hum error response bhejenge
//       return res.status(400).json({  // 400 status code ka mtlb h bad request, iska use tab hota h jab client se aayi hui request me kuch galat ho, yha hum isliye 400 status code bhej rhe h kyunki client se aayi hui request me keyword ya to missing h ya wo string format me nhi h, isliye hum client ko batana chahte h ki unki request me kuch galat hai
//         success: false,
//         message: "Keyword is required and must be in string format",
//       });
//     }

//     const regEx = new RegExp(keyword, "i");  // RegExp constructor ka use karke hum ek regular expression bana rhe h jisme keyword ko case-insensitive (i flag) search ke liye use kar rhe h, iska mtlb h ki agar user ne "gold" search kiya to wo "Gold", "GOLD", "goLD" etc. sabko match karega, isse hum apne search ko aur flexible bana sakte h

//     const createSearchQuery = {
//       $or: [ // $or operator ka use karke hum multiple conditions me se kisi ek condition ke true hone par document ko match kar sakte h, yha hum $or operator ka use karke title, description, category aur carat fields me keyword ke match hone par product ko search results me include kar rhe h
//         //{ title: { $regex: new RegExp(`\\b${keyword}\\b`, "i") } },
//         //{ description: { $regex: new RegExp(`\\b${keyword}\\b`, "i") } },

//         { title: regEx },
//         { description: regEx },
//         //{ category: { $regex: new RegExp(`^${keyword}$`, "i") } }, // exact match
//         //{ carat: { $regex: new RegExp(`^${keyword}$`, "i") } },   // exact match
//         { category: regEx },
//         { carat: regEx },
//       ],
//     };

//     const searchResults = await Product.find(createSearchQuery);  // searchResults = ARRAY of objects (documents) ✅ array hai ✔️ andar objects hain ✔️

//     res.status(200).json({
//       success: true,
//       data: searchResults,
//     });
//   } catch (error) {
//    // console.log(error);
//     res.status(500).json({
//       success: false,
//       message: "Error",
//     });
//   }
// };

// module.exports = { searchProducts };



const Product = require("../../models/Product");

const searchProducts = async (req, res) => {
  try {
    // ==========================================
    // GET KEYWORD
    // ==========================================

    const { keyword } = req.params;

    if (!keyword || typeof keyword !== "string") {
      return res.status(400).json({
        success: false,
        message: "Keyword is required and must be in string format",
      });
    }

    // Remove unnecessary spaces
    // Convert to lowercase for easier matching
    const searchKeyword = keyword.trim().toLowerCase();

    // If user searches only spaces
    if (!searchKeyword) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

    // ==========================================
    // ESCAPE REGEX SPECIAL CHARACTERS
    // ==========================================

    const escapedKeyword = searchKeyword.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

    const regEx = new RegExp(escapedKeyword, "i");

    // ==========================================
    // ACTUAL CATEGORY VALUES
    // ==========================================
    //
    // Your category field contains:
    //
    // men
    // women
    // kids
    //
    // ==========================================

    const categoryAliases = {
      men: ["men"],
      women: ["women"],
      kids: ["kids"],
    };

    // ==========================================
    // JEWELRY TYPE ALIASES
    // ==========================================
    //
    // These are searched in the PRODUCT TITLE
    // because your current Product schema does
    // not have a separate jewelryType field.
    //
    // ==========================================

    const jewelryAliases = {
      ring: ["ring", "rings"],

      bangle: ["bangle", "bangles"],

      bracelet: ["bracelet", "bracelets"],

      necklace: ["necklace", "necklaces"],

      earring: ["earring", "earings", "earrings"],

      pendant: ["pendant", "pendants"],

      anklet: ["anklet", "anklets"],

      toerings: [
        "toering",
        "toerings",
        "toe ring",
        "toe rings",
      ],

      coin: ["coin", "coins"],
    };

    // ==========================================
    // CHECK CATEGORY
    // ==========================================

    const matchedCategory = Object.keys(
      categoryAliases
    ).find(
      (category) =>
        category === searchKeyword
    );

    // ==========================================
    // CHECK JEWELRY TYPE
    // ==========================================

    const matchedJewelryType = Object.keys(
      jewelryAliases
    ).find((type) =>
      jewelryAliases[type].includes(searchKeyword)
    );

    let createSearchQuery;

    // ==========================================
    // CASE 1:
    // CATEGORY SEARCH
    // ==========================================
    //
    // Example:
    //
    // men
    // women
    // kids
    //
    // We search the CATEGORY field exactly.
    //
    // This prevents:
    //
    // men -> women
    //
    // ==========================================

    if (matchedCategory) {
      createSearchQuery = {
        category: new RegExp(
          `^${matchedCategory}$`,
          "i"
        ),
      };
    }

    // ==========================================
    // CASE 2:
    // JEWELRY TYPE SEARCH
    // ==========================================
    //
    // Example:
    //
    // ring
    // rings
    // bangle
    // bangles
    // necklace
    // etc.
    //
    // We search the TITLE because your current
    // category field is being used for Men/Women/Kids.
    //
    // ==========================================

    else if (matchedJewelryType) {
      const aliases =
        jewelryAliases[matchedJewelryType];

      // Escape aliases before creating regex
      const escapedAliases = aliases.map(
        (alias) =>
          alias.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
          )
      );

      // Match complete words
      //
      // Example:
      // ring matches "Gold Ring"
      // rings matches "Gold Rings"
      //
      const titleRegex = new RegExp(
        `\\b(${escapedAliases.join("|")})\\b`,
        "i"
      );

      createSearchQuery = {
        title: titleRegex,
      };

      // ==========================================
      // SPECIAL CASE:
      // RING
      // ==========================================
      //
      // "Toe Ring" contains the word "Ring".
      //
      // When searching normal rings, we don't
      // want Toe Rings in the results.
      //
      // ==========================================

      if (matchedJewelryType === "ring") {
        createSearchQuery = {
          title: titleRegex,

          $nor: [
            {
              title: /\btoe\s*rings?\b/i,
            },
          ],
        };
      }
    }

    // ==========================================
    // CASE 3:
    // NORMAL SEARCH
    // ==========================================
    //
    // Example:
    //
    // gold
    // diamond
    // 18k
    // pearl
    // ban
    // rin
    // etc.
    //
    // Search in title and carat.
    //
    // ==========================================

    else {
      createSearchQuery = {
        $or: [
          {
            title: regEx,
          },
          {
            carat: regEx,
          },
        ],
      };
    }

    // ==========================================
    // SEARCH DATABASE
    // ==========================================

    const searchResults = await Product.find(
      createSearchQuery
    );

    // ==========================================
    // SEND RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,
      data: searchResults,
    });
  } catch (error) {
    console.error(
      "Search Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Error while searching products",
    });
  }
};

module.exports = {
  searchProducts,
};