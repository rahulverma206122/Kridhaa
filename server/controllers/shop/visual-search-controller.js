const Product = require("../../models/Product");

const {
  generateImageEmbedding,
} = require("../../utils/visual-search/gemini-embedding");

const visualSearch = async (req, res) => {
  try {
    // 1. Check uploaded image
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a jewelry image",
      });
    }

    const imageBuffer = req.file.buffer;
    const imageMimeType = req.file.mimetype;

    console.log("========================================");
    console.log("Visual Search Image Received");
    console.log("Image size:", imageBuffer.length, "bytes");
    console.log("Mime type:", imageMimeType);
    console.log("========================================");

    // 2. Generate embedding for uploaded image
    console.log("Generating Gemini image embedding...");

    const imageEmbedding = await generateImageEmbedding(
      imageBuffer,
      imageMimeType
    );

    console.log(
      "Query embedding dimensions:",
      imageEmbedding.length
    );

    // 3. Search MongoDB Vector Search index
    console.log("Searching MongoDB Vector Search...");

    const products = await Product.aggregate([
      {
        $vectorSearch: {
          index: "vector_index",
          path: "imageEmbedding",
          queryVector: imageEmbedding,
          numCandidates: 40,
          limit: 6,  // mtlb keval 6 top matched items hi show karna hai
        },
      },
      {
        $project: {
          title: 1,
          description: 1,
          category: 1,
          carat: 1,
          price: 1,
          salePrice: 1,
          totalStock: 1,
          averageReview: 1,
          image: 1,

          score: {
            $meta: "vectorSearchScore",
          },
        },
      },
    ]);

    console.log("========================================");
    console.log(
      "Similar products found:",
      products.length
    );
    console.log("========================================");

    // 4. Return products to frontend
    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("========================================");
    console.error("AI Visual Search Error:", error);
    console.error("========================================");

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Something went wrong while searching for similar jewelry",
    });
  }
};

module.exports = {
  visualSearch,
};