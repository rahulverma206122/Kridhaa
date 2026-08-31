const { imageUploadUtil } = require("../../helpers/cloudinary"); // imageUploadUtil → helper function (Cloudinary pe image upload karta hai)
const Product = require("../../models/Product");

const handleImageUpload = async (req, res) => {  // Ek API controller function jo image upload handle karega, ye function tab call hoga jab admin product add/edit karta hai aur wo image upload karta hai, is function me hum Cloudinary pe image upload karenge aur uska URL return karenge taki us URL ko hum apne product ke image field me save kar sake
  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
//👉 Buffer.from(...) - binary ko readable format me convert karta hai
// req.file.buffer = uploaded image (binary data)
    //👉 .toString("base64") - image ko base64 string me convert karta hai

// 4. Final output kya?

// “Cloudinary URL jo DB me store hota hai”

// 3. Base64 conversion kyun?

// “Cloudinary ko compatible format me bhejne ke liye”

    const url = "data:" + req.file.mimetype + ";base64," + b64;  // “Image file ko string (text) format me convert karke ek URL bana rahe ho” 🧠
    const result = await imageUploadUtil(url);

// Step-by-step simple flow:

// Image (file) 
//    ↓
// Binary data (req.file.buffer)
//    ↓
// Base64 me convert
//    ↓
// Data URL banaya
//    ↓
// Cloudinary pe upload
//    ↓
// Final hosted image URL mila

    res.json({
      success: true,
      result,
    });
  } catch (error) {
    //console.log(error);
    res.json({
      success: false,
      message: "Error occured",
    });
  }
};

//add a new product
const addProduct = async (req, res) => {
  try {
    const {
      image,
      title,
      description,
      category,
      carat,
      price,
      salePrice,
      totalStock,
      averageReview,
    } = req.body;

   // console.log(averageReview, "averageReview");

    const newlyCreatedProduct = new Product({ // ye ek document create karega Product collection me jisme humne jo schema banaya h uske according fields honge
      image, // we cn write image: image but in ES6 if key and value both are same 
            // then we can write only one time this is called object destructuring
      title,
      description,
      category,
      carat,
      price,
      salePrice,
      totalStock,
      averageReview,
    });

    await newlyCreatedProduct.save();

    res.status(201).json({  // 201 means created
      success: true,
      data: newlyCreatedProduct,
    });
  } catch (e) {
    // console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

//fetch all products

const fetchAllProducts = async (req, res) => {
  try {
    const listOfProducts = await Product.find({});
    res.status(200).json({
      success: true,
      data: listOfProducts,
    });
  } catch (e) {
   // console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

//edit a product
const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      image,
      title,
      description,
      category,
      carat,
      price,
      salePrice,
      totalStock,
      averageReview,
    } = req.body;

    let findProduct = await Product.findById(id);
    if (!findProduct)
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });

    findProduct.title = title || findProduct.title; // agar title empty hoga to findProduct.title hi rhega otherwise title update ho jayega, same for all fields
    findProduct.description = description || findProduct.description;
    findProduct.category = category || findProduct.category;
    findProduct.carat = carat || findProduct.carat;
    findProduct.price = price === "" ? 0 : price || findProduct.price;
    findProduct.salePrice = salePrice === "" ? 0 : salePrice || findProduct.salePrice;
    findProduct.totalStock = totalStock || findProduct.totalStock;
    findProduct.image = image || findProduct.image;
    findProduct.averageReview = averageReview || findProduct.averageReview;

    await findProduct.save();

    res.status(200).json({
      success: true,
      data: findProduct,
    });
  } catch (e) {
   // console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

//delete a product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product)
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });

    res.status(200).json({
      success: true,
      message: "Product delete successfully",
    });
  } catch (e) {
   // console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

module.exports = {
  handleImageUpload,
  addProduct,
  fetchAllProducts,
  editProduct,
  deleteProduct,
};