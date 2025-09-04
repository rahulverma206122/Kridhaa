const Product = require("../../models/Product");

//This function fetches products from MongoDB based on:
//Category filter
//carat filter
//Sorting option (price/title ascending/descending)
//It then sends the filtered + sorted products back as JSON.

const getFilteredProducts = async (req, res) => {
  try {
    const { category = [], carat = [], sortBy = "price-lowtohigh" } = req.query;  // query se cat carat sortby liya  // From the request URL, we get category, carat, and sortBy.

    let filters = {};

    if (category.length) { // MongoDB’s $in operator is used to match multiple values. If query string is category=Mobile,Laptop  filters.category = { $in: ["Mobile", "Laptop"] };  This means → fetch products whose category is either Mobile OR Laptop.
      filters.category = { $in: category.split(",") };
    }

    if (carat.length) {
      filters.carat = { $in: carat.split(",") }; 
    }

  let sort = {};
 //MongoDB sorting:
 //1 = ascending order
 //-1 = descending order

    switch (sortBy) {
      case "price-lowtohigh":
        sort.price = 1;  // Ascending  // here we fill the sort variable based on sort

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
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

const getProductDetails = async (req, res) => {
  try {
    const { id } = req.params;
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
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

module.exports = { getFilteredProducts, getProductDetails };
