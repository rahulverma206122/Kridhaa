const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body; // ye teno cartmodel.js se aai h // 👈 body se milega
// ab DB me insert ya update karo
    if (!userId || !productId || quantity <= 0) {
      return res.status(400).json({ //  400 means Bad Request. It indicates that the server cannot process the request due to client error (like missing fields or invalid data).
        success: false,  
        message: "Invalid data provided!",
      });
    }

    const product = await Product.findById(productId); // productId se product collection me jao aur dekho ki aisa product hai ya nahi, findById is a Mongoose method that finds a document by its _id field. It returns the document if found, or null if not found.

    if (!product) {
      return res.status(404).json({ // 404 means Not Found. It indicates that the requested resource (like a product) was not found on the server.
        success: false,
        message: "Product not found",
      });
    }
// Look in the Cart collection for a document where userId matches the given user’s ID.
    let cart = await Cart.findOne({ userId });  //  or ({ userId: userId }); Cart.findOne() expects an object as a filter so dont pass as (userId)
  // findOne is a Mongoose method that finds the first document that matches the filter. It returns the document if found, or null if not found.
    if (!cart) { // agar is userka cart ni bna h to naya cart bna do ab
      cart = new Cart({ userId, items: [] }); 
    }

    const findCurrentProductIndex = cart.items.findIndex(  // cart ke andar items array pr jaega item pointer and find krega first product ko by productid jo ki objectid hogi use fir string me bdl dega
      (item) => item.productId.toString() === productId   // Compare it with the productId you are looking for. see notes
    ); // findIndex() → JavaScript array method that returns the index of the first item that matches the condition. If no item matches, it returns -1.

    if (findCurrentProductIndex === -1) {  // cart me item nhi h
      cart.items.push({ productId, quantity });  // so item ko push krdo cart me
    } else {
      cart.items[findCurrentProductIndex].quantity += quantity; // agar cart me is product ki id h to iski quantity++ krdo
    }
    // at this point Data is only in memory (RAM) ❌ Not saved in database  await -> “Wait until data is saved, then move ahead”
    await cart.save();   // save the cart document to the database. If it’s a new cart, it will be inserted. If it’s an existing cart, it will be updated. without this Nothing goes to DB ❌
    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    res.status(500).json({ // 500 means Internal Server Error. It indicates that something went wrong on the server while processing the request.
      success: false,
      message: "Error",
    });
  }
};
  // This is an Express route handler
const fetchCartItems = async (req, res) => {
  try {
    const { userId } = req.params; // Because userId is coming from the URL, we use req.params to access it. req.body is used for data sent in the request body (like in POST or PUT requests), while req.params is used for URL parameters (like /cart/:userId).

    if (!userId) {
      return res.status(400).json({  // If missing, respond with HTTP 400 (Bad Request) and a JSON message.
        success: false,
        message: "User id is manadatory!",
      });
    }

    const cart = await Cart.findOne({ userId }).populate({ // populate is a Mongoose method that replaces the specified field (which contains an ObjectId) with the actual document from the referenced collection. Here, we want to replace productId in items with the actual product details.     MongoDB stores reference (ObjectId) populate() gives you full details instead of just ID
      path: "items.productId",  // tells Mongoose which field to populate, items ke andr productId ko jha pr ref h product so go to product 
      select: "image title price salePrice",  // only include these fields from the product model. Other fields (like description, stock) are ignored.
    });


// 2. Without populate ❌
// const cart = await Cart.find();

// Result:

// {
//   userId: "65abc123xyz"  // only ID
// }
// 3. With populate ✅
// const cart = await Cart.find().populate("userId");

// Result:

// {
//   userId: {
//     _id: "65abc123xyz",
//     name: "Rahul",
//     email: "rahul@gmail.com"
//   }
// }

// 👉 🔥 Now you get full user data!

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


//     🔍 Why we do this?

// 👉 After using populate(), each item looks like this:

// {
//   productId: {
//     _id: "p1",
//     title: "Shirt",
//     price: 1000,
//     image: "img.jpg"
//   },
//   quantity: 2
// }

// 👉 But frontend doesn’t need full nested object
// 👉 It needs clean + flat data

// 🔥 So map() is used to:
// ✅ 1. Flatten the structure

// Convert:

// item.productId.title

// ➡️ into:

// title
// ✅ 2. Send only required fields

// 👉 Remove unnecessary DB fields (like __v, timestamps, etc.)

// ✅ 3. Make frontend easy

// Frontend gets:

// {
//   productId: "p1",
//   title: "Shirt",
//   price: 1000,
//   quantity: 2
// }

// 👉 Much easier to render in UI 💯

// ✅ 4. Combine data from 2 sources
// productId → comes from Product collection (populate)
// quantity → comes from Cart schema

// 👉 You merge both into one object

// Sends a successful response (200) to frontend

// cart._doc = {  Direct bhejna messy ho sakta hai ❌
//   _id: "c1",
//   userId: "u1",
//   items: [...],
//   createdAt: ...
// }

// ...cart._doc means:

// _id: "c1",
// userId: "u1",
// items: [...],
// createdAt: ...

// data: {
//   ...cart._doc,
//   items: populateCartItems
// }

// Poora cart data le lo
// BUT
// items ko replace kar do with cleaned data


    res.status(200).json({ // Means: request was successful. Sends data in JSON format (frontend understands this)
      success: true,  // success is the flag for frontend
      data: { // actual response body.
        ...cart._doc,  // This is spread operator, “cart ke andar jo _doc (actual data) hai, usko spread kar rahe”
        items: populateCartItems,  // Inside data, we spread the cart document and then override items. mtlb cart ko faila diya fir uske items array me populateditems dal diye
      },
    });

// 🔹 Step-by-step samjho
// 🔸 1. ...cart._doc

// 👉 Cart ke saare fields copy ho rahe:

// {
//   "userId": "123",
//   "items": [...],
//   "createdAt": "...",
// }

// 🔸 2. items: populateCartItems

// 👉 Ab tum items ko override kar rahe ho

// 👉 Matlab:

// Original items ❌
// New populated items ✔
// 🔹 Final result kya banega?

// {
//   "userId": "123",
//   "createdAt": "...",
//   "items": [ /* populated items with product details */ ]
// }

    
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

    // item.productId → ObjectId (MongoDB type)
// productId → String (from frontend / params)

    if (findCurrentProductIndex === -1) { // the item is not in cart
      return res.status(404).json({
        success: false,
        message: "Item not present in cart !",
      });
    }

    cart.items[findCurrentProductIndex].quantity = quantity;
    await cart.save();

    // in this code till here, we have only updated the quantity in the database but we have not sent the updated cart data to the frontend. So we need to fetch the updated cart data and send it to the frontend.
      // now we do this to send the updated cart data to the frontend after updating the quantity

// Problem after save()

// After saving, your cart looks like this:

// {
//   items: [
//     {
//       productId: "abc123",   // ❌ only ID
//       quantity: 3
//     }
//   ]
// }

// 👉 Frontend can’t show:

// image ❌
// title ❌
// price ❌

    await cart.populate({  // This converts: productId: "abc123" into: productId: { _id: "abc123", image: "img.jpg", title: "Shirt", price: 1000 }
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
      data: {  // Replace old items with clean ones
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


//👉 Populate use kiya taaki sirf ID nahi, product ki full details mil sake