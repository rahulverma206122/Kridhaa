const Product = require("../../models/Product");

//This function fetches products from MongoDB based on:
//Category filter
//carat filter
//Sorting option (price/title ascending/descending)
//It then sends the filtered + sorted products back as JSON.

const getFilteredProducts = async (req, res) => {
  try {  // URL ke ? ke baad jo aata hai usse query string kehte hain. Query string me key-value pairs hote hain, jise & se separate kiya jata hai. Jaise ki /api/products?category=Mobile,Laptop&carat=22,24&sortBy=price-lowtohigh me category, carat, aur sortBy query parameters hain. Hum in query parameters ko req.query se access kar sakte hain. Yaha humne destructuring assignment ka use karke category, carat, aur sortBy ko req.query se extract kiya hai. Agar query string me ye parameters nahi diye gaye hain, to hum default values set kar rahe hain: category ke liye empty array [], carat ke liye empty array [], aur sortBy ke liye "price-lowtohigh". Iska matlab hai ki agar user ne category ya carat filter specify nahi kiya hai, to hum unhe empty array treat karenge, yani ki hum kisi bhi category ya carat ko filter nahi karenge. Aur agar user ne sortBy specify nahi kiya hai, to hum default sorting "price-lowtohigh" apply karenge.
    const { category = [], carat = [], sortBy = "price-lowtohigh" } = req.query;  // query se category, carat, and sortBy liya  // From the request URL, we get category, carat, and sortBy.

// Default values (IMPORTANT 🔥)
// category = []
// carat = []
// sortBy = "price-lowtohigh"
    
    let filters = {};  //  Ye ek empty object hai jisme hum apne filters ko dynamically add karenge based on the query parameters. Jab hum category aur carat filters ko check karenge, to agar wo query parameters me diye gaye hain, to hum unhe filters object me add karenge. Jaise ki agar category query parameter me kuch values hain, to hum filters.category me $in operator ke sath un values ko add karenge taki MongoDB query me ye filter apply ho jaye. Isi tarah carat ke liye bhi. Is tarah se hum dynamically apne filters object ko build karenge based on the query parameters jo user ne URL me diye hain.

    if (category.length) { // MongoDB’s $in operator is used to match multiple values. If query string is category=Mobile,Laptop  filters.category = { $in: ["Mobile", "Laptop"] };  This means → fetch products whose category is either Mobile OR Laptop.
      filters.category = { $in: category.split(",") };
    }

// Step-by-step breakdown
// 🔹 1. category

// 👉 Ye URL se aata hai (string)

// Example:
// ?category=ring,necklace

// 👉 Value:

// category = "ring,necklace"

// 🔹 2. .split(",")

// 👉 String ko array me convert karta hai

// category.split(",")

// 👉 Result:

// };


    if (carat.length) {
      filters.carat = { $in: carat.split(",") }; 
    }

  let sort = {};
 //MongoDB sorting:
 //1 = ascending order
 //-1 = descending order

    switch (sortBy) {  // sortBy kha se aaya - URL se aata hai, jaise ki ?sortBy=price-lowtohigh
      case "price-lowtohigh":
        sort.price = 1;  // Ascending  // here we fill the sort variable based on sort
//  price comes from product model me jo price field h, uske hisab se sort krna h, ascending order me to 1 dena h, descending order me -1 dena h
        break;
      case "price-hightolow":
        sort.price = -1;  // Descending

        break;
      case "title-atoz":
        sort.title = 1;  // A → Z

        break;
      case "title-ztoa":
        sort.title = -1;   // Z → A     

        break;
      default:
        sort.price = 1;
        break;
    }

    const products = await Product.find(filters).sort(sort); // Product.find(filters) → gets only those products matching category & carat filters.  .sort(sort) → applies sorting (price or title).

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

const getProductDetails = async (req, res) => {
  try {
    const { id } = req.params;   // req.params se id li 

    // { id } ka naam route me define hota hai
    // Agar route hota: router.get("/product/:productId", ...) then yaha hum { productId } = req.params karte, taki hume productId mil jaye. Lekin yaha humne route me :id define kiya hai, isliye hum { id } = req.params kar rahe hain taki hume id mil jaye.

    const product = await Product.findById(id);

    if (!product)
      return res.status(404).json({
        success: false,
        message: "Product not found!",
      });

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

module.exports = { getFilteredProducts, getProductDetails };
