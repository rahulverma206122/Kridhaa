const Order = require("../../models/Order");
const Product = require("../../models/Product");
const ProductReview = require("../../models/Review");

const addProductReview = async (req, res) => {
  try {
    const { productId, userId, userName, reviewMessage, reviewValue } = req.body;

 // findOne = database me ek matching document find karega

    const order = await Order.findOne({  // phle order ko find krege kyu ki usi order ko review de skte h 
      userId,  // “Mujhe wo order chahiye jisme ye userId ho”
      "cartItems.productId": productId,   // “Order ke andar jo cartItems array hai, usme koi item ho jiska productId us product se match kare jisko user review dena chahta hai”
      // orderStatus: "confirmed" || "delivered",
    });

    if (!order) {
      return res.status(403).json({   // 403 → Forbidden (user ke paas permission nahi hai review dene ki)
        success: false,
        message: "You need to purchase product to review it.", // 3 jagah pe dekh sakte ho:Postman / Thunder Client,Browser → DevTools (Network Tab),Frontend UI (agar handle kiya ho) Agar aapne frontend me likha hai toast.error(res.data.message) ya alert lagaya hai
      });
    }

    const checkExistinfReview = await ProductReview.findOne({  // iski wjh se ek bar hi review de skta h
      productId,
      userId,
    });

    if (checkExistinfReview) {
      return res.status(400).json({  // 400 → Bad Request (user ne galat request bheji hai, yaha pe wo review dene ki koshish kar raha hai jabki usne pehle hi review de diya hai)
        success: false,
        message: "You already reviewed this product!",
      });
    }

    const newReview = new ProductReview({  // yha se hum naya review create kr rhe h, aur usme productId, userId, userName, reviewMessage, reviewValue ko set kr rhe h mtlb mongodb me ye fields ke sath ek naya review document create hoga
      productId,
      userId,
      userName,
      reviewMessage,
      reviewValue,
    });

    await newReview.save();

    const reviews = await ProductReview.find({ productId });  // us product ke sare reviews find kr rhe h taki average review calculate kr ske
    const totalReviewsLength = reviews.length;
    const averageReview =
      reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
      totalReviewsLength;

/// “Database me given productId wala product find karo aur uska averageReview update kar do”
      // “ID se document dhoondo aur usko update karo”

//       4️⃣ { averageReview }

// 👉 Ye update object hai

// Matlab:

// averageReview: averageReview

// ➡️ Product me average rating store/update ho raha hai
//  await - “Wait karo jab tak async kaam complete na ho jaye”
    await Product.findByIdAndUpdate(productId, { averageReview });  // yha ab hum prodct ke andar avgreview ko update kr rhe h

    res.status(201).json({  // 201 → Created (naya review successfully create ho gaya hai)
      success: true,
      data: newReview,
    });
  } catch (e) {
    res.status(500).json({  // 500 → Internal Server Error (server me kuch galat ho gaya hai, jaise ki database connection issue ya koi unexpected error)
      success: false,
      message: "Error",
    });
  }
};

const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await ProductReview.find({ productId });
    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

module.exports = { addProductReview, getProductReviews };
