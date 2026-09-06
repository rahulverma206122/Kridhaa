const Product = require("../../models/Product");

// Get personalized recommendations
const getRecommendations = async (req, res) => {
  try {
    // For now we will use viewed product IDs
    const { viewedProducts = [] } = req.body;

    if (viewedProducts.length === 0) {
      const products = await Product.find()
        .sort({ createdAt: -1 })
        .limit(12);

      return res.status(200).json({
        success: true,
        products,
      });
    }

    // Get recently viewed products
    const viewedItems = await Product.find({
      _id: { $in: viewedProducts },
    });

    // Extract categories and carats
    const categories = viewedItems
      .map((item) => item.category)
      .filter(Boolean);

    const carats = viewedItems
      .map((item) => item.carat)
      .filter(Boolean);

    // Find similar products
    const products = await Product.find({
      _id: { $nin: viewedProducts },

      $or: [
        {
          category: { $in: categories },
        },
        {
          carat: { $in: carats },
        },
      ],
    }).limit(12);

    return res.status(200).json({
      success: true,
      products,
    });

  } catch (error) {
    console.error("Recommendation error:", error);

    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

module.exports = {
  getRecommendations,
};