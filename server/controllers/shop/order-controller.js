const crypto = require("crypto"); // NEW: Razorpay payment verify karne ke liye signature check karna padta hai — crypto Node ka built-in module hai isके liye
const razorpayInstance = require("../../helpers/razorpay"); // NEW: paypal helper ki jagah razorpay instance
const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      cartId,
    } = req.body;  // ye sbhi ordermodel se aai h
    // NOTE: paymentId/payerId ab yaha se hata diye hain — Razorpay flow me
    // ye cheezein (razorpay_payment_id, razorpay_signature) tabhi milti hain
    // jab user payment complete karta hai, isliye create step par inki
    // zaroorat nahi (capturePayment me aayenge).

    // NEW (Razorpay migration):
    // PayPal me humne `paypal.payment.create()` call karke ek "approval_url"
    // liya tha, jispe user ko redirect karte the. Razorpay ka flow ALAG hai —
    // yaha koi redirect nahi hota. Iski jagah hum:
    // 1. Razorpay ka apna ek "order" banate hain (razorpayInstance.orders.create)
    // 2. Us order ki id + amount frontend ko bhejte hain
    // 3. Frontend Razorpay ka checkout.js MODAL (popup) kholta hai isi id ke sath
    // 4. User modal ke andar hi payment karta hai (koi naya page/redirect nahi)
    // 5. Success hone par Razorpay khud ek "handler" callback deta hai
    //    (JS function), jisme humein razorpay_payment_id, razorpay_order_id,
    //    aur razorpay_signature milte hain — ye teeno cheezein hum
    //    capturePayment (neeche) ko bhejte hain taaki verify + confirm kar sakein.

    // Razorpay amount hamesha "smallest currency unit" me leta hai — INR ke
    // liye paise. Isliye totalAmount (rupees) ko 100 se multiply karna zaroori
    // hai, warna Razorpay 100x kam amount charge kar dega.
    const razorpayOrder = await razorpayInstance.orders.create({
      amount: Math.round(totalAmount * 100), // paise me convert
      currency: "INR",
      receipt: `receipt_${Date.now()}`, // apna internal reference; Order._id abhi tak bana nahi hai isliye timestamp use kiya
    });

    const newlyCreatedOrder = new Order({
      userId,
      cartId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod, // ab ye "razorpay" hoga (checkout.jsx se aayega)
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      razorpayOrderId: razorpayOrder.id, // NEW: Razorpay ka apna order id store kar rahe hain
    });

    await newlyCreatedOrder.save();

    res.status(201).json({  // 201 means created
      success: true,
      razorpayOrderId: razorpayOrder.id, // NEW: frontend isi id se checkout modal kholega
      amount: razorpayOrder.amount, // paise me (Razorpay checkout ko yehi chahiye)
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID, // NEW: checkout.js ko public key chahiye hoti hai frontend par
      orderId: newlyCreatedOrder._id, // hamara apna Mongo order id (jaise pehle tha)
    });
  } catch (e) {
   // console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

// the uppar code only create the order not make it successfull
// User order place kar raha hai → tum Razorpay order create kar rahe ho → order DB me save kar rahe ho → frontend Razorpay ka checkout modal kholta hai

const capturePayment = async (req, res) => {
  try {
    // NEW (Razorpay migration): PayPal me paymentId/payerId aate the.
    // Razorpay me teen cheezein aati hain: razorpay_order_id,
    // razorpay_payment_id, aur razorpay_signature — ye signature hi security
    // ka core hai, isse hum verify karte hain ki payment genuinely Razorpay
    // se aayi hai, tampered nahi hai.
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId, // hamara apna Mongo order id (jaise pehle tha)
    } = req.body;

    // NEW: Signature verify karna — ye Razorpay ka official recommended
    // security step hai. Hum apni Key Secret se ek HMAC SHA256 signature
    // generate karte hain (order_id + "|" + payment_id se), aur usko
    // Razorpay ne jo signature bheja hai usse compare karte hain. Agar match
    // nahi hua, matlab request fake/tampered ho sakti hai — reject kar do.
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed. Signature mismatch.",
      });
    }

    let order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order can not be found",
      });
    }

    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.razorpayPaymentId = razorpay_payment_id; // NEW: paymentId/payerId ki jagah
    order.razorpaySignature = razorpay_signature; // NEW: aage verification/refund ke liye record rakhna acha practice hai

// 🔹 Real purpose of this whole loop

// 👉 3 main kaam:

// Har product ko process karna
// DB se product lana
// Stock update karna

    for (let item of order.cartItems) { //Loop through all items in the order  order.cartItems is an array of products the user bought.
      let product = await Product.findById(item.productId);

      if (!product) {  // the product doesn’t exist. in product model
        return res.status(404).json({  // 404 means not found
          success: false,
          message: `Not enough stock for this product ${product.title}`,   // Backend message bhejta hai response me → frontend decide karta hai usko kaise use/show karna hai
        });
      }

      product.totalStock -= item.quantity;

      await product.save();
    }

    const getCartId = order.cartId;
    await Cart.findByIdAndDelete(getCartId);  // payment hone ke bad cart ko delete krdo

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order confirmed",
      data: order,
    });
  } catch (e) {
   // console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId });

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found!",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
   // console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
   // console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

module.exports = {
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
};