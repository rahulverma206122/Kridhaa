const express = require("express");

const {
  handleImageUpload,
  addProduct,
  editProduct,
  fetchAllProducts,
  deleteProduct,
} = require("../../controllers/admin/products-controller");

const { upload } = require("../../helpers/cloudinary");

const router = express.Router();

router.post("/upload-image", upload.single("my_file"), handleImageUpload); // “Image upload request aayegi → multer file handle karega → phir controller run hoga” 
// upload.single("my_file") 👉 Ye multer middleware hai 🔥
// single matlab ek hi file upload hogi Agar multiple file bheji → ignore / error
// my_file 👉 Ye field name hai jisme frontend se file aayegi, frontend me jab form banega to usme file input ka name attribute "my_file" hoga, jisse multer samajh jayega ki ye file field hai aur isme jo file aayegi usko handle karega
router.post("/add", addProduct);
router.put("/edit/:id", editProduct);
router.delete("/delete/:id", deleteProduct);
router.get("/get", fetchAllProducts);

module.exports = router;
