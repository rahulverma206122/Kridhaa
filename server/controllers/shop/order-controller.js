const paypal = require("../../helpers/paypal");
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
      paymentId,
      payerId,
      cartId,
    } = req.body;  // ye sbhi ordermodel se aai h 

    const create_payment_json = {  // This is typically used with the PayPal REST API to create a payment.  Ye object PayPal ko batata hai payment ka structure kya hai
      intent: "sale", 

// "sale" → instant payment ✅
// "authorize" → hold amount
// "order" → confirm later
      
      payer: {
        payment_method: "paypal",  // User PayPal se pay karega
      },
      redirect_urls: {
        return_url: `${process.env.CLIENT_BASE_URL}/shop/paypal-return`,     //"http://localhost:5173/shop/paypal-return",  success hone ke baad user ko ye url pe bhejna hai
        cancel_url: `${process.env.CLIENT_BASE_URL}/shop/paypal-cancel`,      // same for this 
      },
      transactions: [
        {
          item_list: {
            items: cartItems.map((item) => ({
              name: item.title,
              sku: item.productId, // sku – a unique identifier, tracking ke liye use hota hai, productId ko sku ke roop me use karna ek common practice hai
              price: item.price.toFixed(2),
              currency: "USD",  //  paypal sendbox only accpet the usd payment latter on in live mode it automatically convert the usd in inr
              quantity: item.quantity,
            })),
          },
          amount: {
            currency: "USD",
            total: totalAmount.toFixed(2),  // limit the decimal places - 123.4632 -> 123.46
          },
          description: "description",
        },
      ],
    };

    paypal.payment.create(create_payment_json, async (error, paymentInfo) => {

// paypal.payment.create(...)
// 👉 Ye PayPal SDK ka function hai

// 👉 Kaam:
// PayPal server ko request bhejna (payment create karne ke liye)

      if (error) {
       // console.log(error);

        return res.status(500).json({
          success: false,
          message: "Error while creating paypal payment",
        });
      } else {
        const newlyCreatedOrder = new Order({
          userId,
          cartId,
          cartItems,
          addressInfo,
          orderStatus,
          paymentMethod,
          paymentStatus,
          totalAmount,
          orderDate,
          orderUpdateDate,
          paymentId,
          payerId,
        });

        await newlyCreatedOrder.save();

        const approvalURL = paymentInfo.links.find(
          (link) => link.rel === "approval_url"
        ).href;


//         Pehle samjho paymentInfo.links kya hai

// 👉 PayPal response me ek array aata hai:

// paymentInfo.links = [
//   { rel: "self", href: "..." },
//   { rel: "approval_url", href: "https://paypal.com/approve" },
//   { rel: "execute", href: "..." }
// ];

// 👉 Har object me:

// rel → link ka type
// href → actual URL

        res.status(201).json({  // 201 means created
          success: true,
          approvalURL,
          orderId: newlyCreatedOrder._id,
        });
      }
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
// User order place kar raha hai → tum PayPal payment create kar rahe ho → order DB me save kar rahe ho → user ko PayPal pe bhej rahe ho

const capturePayment = async (req, res) => {
  try {
    const { paymentId, payerId, orderId } = req.body;

    let order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order can not be found",
      });
    }

    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.paymentId = paymentId;
    order.payerId = payerId;

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
