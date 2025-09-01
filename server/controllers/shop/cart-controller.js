const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body; // ye teno cartmodel.js se aai h // 👈 body se milega
// ab DB me insert ya update karo
    if (!userId || !productId || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
// Look in the Cart collection for a document where userId matches the given user’s ID.
    let cart = await Cart.findOne({ userId });  //  or ({ userId: userId }); Cart.findOne() expects an object as a filter so dont pass as (userId)

    if (!cart) { // agar is userka cart ni bna h to naya cart bna do ab
      cart = new Cart({ userId, items: [] }); 
    }

    const findCurrentProductIndex = cart.items.findIndex(  // cart ke andar items array pr jaega item pointer and find krega first product ko by productid jo ki objectid hogi use fir string me bdl dega
      (item) => item.productId.toString() === productId   // Compare it with the productId you are looking for. see notes
    );

    if (findCurrentProductIndex === -1) {  // cart me item nhi h
      cart.items.push({ productId, quantity });  // so item ko push krdo cart me
    } else {
      cart.items[findCurrentProductIndex].quantity += quantity; // agar cart me is product ki id h to iski quantity++ krdo
    }

    await cart.save();
    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};
  // This is an Express route handler
const fetchCartItems = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({  // If missing, respond with HTTP 400 (Bad Request) and a JSON message.
        success: false,
        message: "User id is manadatory!",
      });
    }

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",  // tells Mongoose which field to populate, items ke andr productId ko jha pr ref h product so go to product 
      select: "image title price salePrice",  // only include these fields from the product model. Other fields (like description, stock) are ignored.
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    }

    const validItems = cart.items.filter( // is function se hum dekh rhe h ki admin ne agr koi product del kr diya h to wo cart se bhi hat jae
      (productItem) => productItem.productId // .filter(...) → JavaScript array method that keeps only the items where the condition is true.
    );  // jis jis product ki id match kr rhi h usko validitem me rkh lo 

    if (validItems.length < cart.items.length) { 
      cart.items = validItems;
      await cart.save();
    }

    const populateCartItems = validItems.map((item) => ({ //productId cartmodel ke andr bna h 
      productId: item.productId._id,//  because in the Cart schema you only stored an ObjectId, but after populate it became an object.So you pick the actual _id.
      image: item.productId.image,
      title: item.productId.title, // these come from the populated Product document.
      price: item.productId.price,
      salePrice: item.productId.salePrice,
      quantity: item.quantity, // quantity prioductid ka nhi h
    }));

    res.status(200).json({ // Means: request was successful. Sends a JSON response to the client (frontend).
      success: true,  // success is the flag for frontend
      data: { // actual response body.
        ...cart._doc,
        items: populateCartItems,  // Inside data, we spread the cart document and then override items. mtlb cart ko faila diya fir uske items array me populateditems dal diye
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

const updateCartItemQty = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    }

    const findCurrentProductIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (findCurrentProductIndex === -1) { // the item is not in cart
      return res.status(404).json({
        success: false,
        message: "Item not present in cart !",
      });
    }

    cart.items[findCurrentProductIndex].quantity = quantity;
    await cart.save();

    await cart.populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    const populateCartItems = cart.items.map((item) => ({
      productId: item.productId ? item.productId._id : null,
      image: item.productId ? item.productId.image : null,
      title: item.productId ? item.productId.title : "Product not found",
      price: item.productId ? item.productId.price : null,
      salePrice: item.productId ? item.productId.salePrice : null,
      quantity: item.quantity,
    }));

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

const deleteCartItem = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    }

    cart.items = cart.items.filter(  // hum yh pr cart ke andr un items ko rkh rhe h jiski productId delete wale ki id se match n kr rhi ho
      (item) => item.productId._id.toString() !== productId
    );

    await cart.save();

    await cart.populate({  
      path: "items.productId",
      select: "image title price salePrice",
    });

    const populateCartItems = cart.items.map((item) => ({
      productId: item.productId ? item.productId._id : null,
      image: item.productId ? item.productId.image : null,
      title: item.productId ? item.productId.title : "Product not found",
      price: item.productId ? item.productId.price : null,
      salePrice: item.productId ? item.productId.salePrice : null,
      quantity: item.quantity,
    }));

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

module.exports = {
  addToCart,
  updateCartItemQty,
  deleteCartItem,
  fetchCartItems,
};
