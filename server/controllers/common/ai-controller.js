const Product = require("../../models/Product");

// =========================
// Helper: whole-word match
// Fixes:
// "women" should NOT match "men"
// "ring" should NOT match "earring"
// =========================

const hasWord = (text, word) => {
  // Escape regex special characters in the word
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const regex = new RegExp(`\\b${escaped}\\b`, "i");

  return regex.test(text);
};

const hasAnyWord = (text, words) =>
  words.some((w) => hasWord(text, w));

const getAIJewelryRecommendation = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Please enter a message",
      });
    }

    const userMessage = message.toLowerCase();

    let filters = {};

    // =========================
    // CATEGORY DETECTION
    // =========================
    // Order matters:
    // Check specific categories first.
    // Whole-word matching prevents:
    // "women" from matching "men".
    // =========================

    if (
      userMessage.includes("kid") ||
      hasAnyWord(userMessage, ["kids", "child", "children"])
    ) {
      filters.category = "kids";
    } else if (
      hasAnyWord(userMessage, [
        "women",
        "woman",
        "ladies",
        "lady",
        "female",
        "womens",
        "women's",
      ])
    ) {
      filters.category = "women";
    } else if (
      hasAnyWord(userMessage, [
        "men",
        "male",
        "man",
        "mens",
        "man's",
        "men's",
      ])
    ) {
      filters.category = "men";
    } else if (
      hasAnyWord(userMessage, [
        "coin",
        "coins",
        "bar",
        "gold coin",
      ])
    ) {
      filters.category = "coins";
    } else if (
      hasAnyWord(userMessage, ["anklet", "anklets"])
    ) {
      filters.category = "anklets";
    } else if (
      hasAnyWord(userMessage, [
        "toe ring",
        "toe rings",
        "toering",
        "toerings",
      ])
    ) {
      filters.category = "toerings";
    }

    // =========================
    // JEWELRY TYPE DETECTION
    // =========================
    // IMPORTANT:
    //
    // We need to detect BOTH singular and plural:
    //
    // ring   → ring
    // rings  → rings
    //
    // earring  → earring
    // earrings → earrings
    //
    // Without this, "women rings" would detect
    // only the category "women" and return random
    // women's products.
    // =========================

    const jewelryTypes = [
      "ring",
      "necklace",
      "pendant",
      "bracelet",
      "earring",
      "choker",
      "chain",
      "watch",
    ];

    // Check singular OR plural form
    const detectedType = jewelryTypes.find(
      (type) =>
        hasWord(userMessage, type) ||
        hasWord(userMessage, `${type}s`)
    );

    if (detectedType) {
      // =========================
      // Search product TITLE only
      // =========================
      //
      // This prevents products from appearing
      // just because their description contains
      // the word "ring".
      //
      // Example:
      // Gold Coin
      // Description: "ring inspired design"
      //
      // → Coin will NOT appear in ring search.
      // =========================

      const escapedType = detectedType.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

      filters.title = {
        $regex: `\\b${escapedType}s?\\b`,
        $options: "i",
      };
    }

    // =========================
    // CARAT DETECTION
    // =========================

    if (
      hasAnyWord(userMessage, [
        "18k",
        "18 k",
        "18kt",
      ])
    ) {
      filters.carat = "k18";
    } else if (
      hasAnyWord(userMessage, [
        "20k",
        "20 k",
        "20kt",
      ])
    ) {
      filters.carat = "k20";
    } else if (
      hasAnyWord(userMessage, [
        "22k",
        "22 k",
        "22kt",
      ])
    ) {
      filters.carat = "k22";
    } else if (
      hasAnyWord(userMessage, [
        "24k",
        "24 k",
        "24kt",
      ])
    ) {
      filters.carat = "k24";
    } else if (
      hasAnyWord(userMessage, ["silver"]) ||
      userMessage.includes("92.5")
    ) {
      filters.carat = "silver";
    }

    // =========================
    // PRICE DETECTION
    // =========================

    const priceRegex =
      /\b(?:under|below|less than|upto|up to)\s*₹?\s*([\d,]+)/i;

    const priceMatch = userMessage.match(priceRegex);

    if (priceMatch) {
      const maxPrice = Number(
        priceMatch[1].replace(/,/g, "")
      );

      filters.$and = [
        {
          $or: [
            {
              salePrice: {
                $gt: 0,
                $lte: maxPrice,
              },
            },
            {
              salePrice: 0,
              price: {
                $lte: maxPrice,
              },
            },
          ],
        },
      ];
    }

    // =========================
    // GUARD: NO REAL FILTERS DETECTED
    // =========================
    //
    // Example:
    // "hi"
    // "hello"
    // "how are you"
    //
    // Without this guard:
    // Product.find({})
    //
    // would return random products.
    // =========================

    const hasAnyFilter = Object.keys(filters).length > 0;

    if (!hasAnyFilter) {
      return res.status(200).json({
        success: true,
        reply:
          'Hi! 👋 I can help you find jewelry. Try telling me things like category (men/women/kids), type (ring/necklace/earrings), carat (18K/22K/24K/silver), and your budget — e.g. "22K gold ring for women under ₹50,000".',
        products: [],
        filtersUsed: filters,
      });
    }

    // =========================
    // SEARCH PRODUCTS
    // =========================

    const products = await Product.find(filters).limit(6);

    // =========================
    // RESPONSE
    // =========================

    let reply = "";

    if (products.length === 0) {
      reply =
        "Sorry, I couldn't find any jewelry matching your exact preferences. Try changing the budget, carat, or category.";
    } else {
      reply = `I found ${products.length} jewelry piece${
        products.length > 1 ? "s" : ""
      } matching your preferences ✨`;
    }

    res.status(200).json({
      success: true,
      reply,
      products,
      filtersUsed: filters, // helpful for debugging, remove in prod if not needed
    });
  } catch (error) {
    console.error("AI recommendation error:", error);

    res.status(500).json({
      success: false,
      message:
        "Something went wrong while getting AI recommendations",
    });
  }
};

module.exports = {
  getAIJewelryRecommendation,
};