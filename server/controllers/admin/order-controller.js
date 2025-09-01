const Order = require("../../models/Order");

const getAllOrdersOfAllUsers = async (req, res) => {
  try {
    const orders = await Order.find({}); // no need of id bcz we get all the order

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
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

// yha se hum jab ksi card pr click krege to wo uski details dikahega 
const getOrderDetailsForAdmin = async (req, res) => {
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
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const updateOrderStatus = async (req, res) => { // req and res both are object 
  try {
    const { id } = req.params; // comes from the URL parameter, e.g., /api/orders/:id
    const { orderStatus } = req.body;  // comes from the client sending JSON in the request body:{ "orderStatus": "Shipped" }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    await Order.findByIdAndUpdate(id, { orderStatus }); // Mongoose updates the order’s orderStatus field with the new value.
// Mongoose expects the first argument of findByIdAndUpdate to be the ID of the document you want to update.id is not object 
// while The second argument to findByIdAndUpdate must be an object containing the fields to update.{ orderStatus }=={ orderStatus: orderStatus }
    res.status(200).json({
      success: true,
      message: "Order status is updated successfully!",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

module.exports = {
  getAllOrdersOfAllUsers,
  getOrderDetailsForAdmin,
  updateOrderStatus,
};
