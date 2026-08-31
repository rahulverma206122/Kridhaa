const cloudinary = require("cloudinary").v2;  // .v2 se cloudnary ka version 2 use kr rhe h 
const multer = require("multer");

cloudinary.config({
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME,                     //"dtnh2xiiz",                      //process.env.CLOUDINARY_CLOUD_NAME,
  api_key:process.env.CLOUDINARY_API_KEY,                      // "818319356185128",                         //process.env.CLOUDINARY_API_KEY,
  api_secret:process.env.CLOUDINARY_API_SECRET,                   //"lvBfjOZ_tFa7uHFFzBc6nN50Fks",                         // process.env.CLOUDINARY_API_SECRET,
});

const storage = new multer.memoryStorage();  // multer.memoryStorage() ka use karke hum multer ko batate hai ki uploaded files ko memory(ram) me store kare, iska mtlb h ki jab bhi koi file upload hogi to wo server ke memory me temporarily store hogi,
// isse hum easily us file ko cloudinary me upload kar sakte hai bina kisi disk space ke use ke, ye approach efficient hoti hai jab hume file ko directly cloudinary me upload karna hota hai without saving it on our server's disk

async function imageUploadUtil(file) {
  const result = await cloudinary.uploader.upload(file, {  // cloudinary.uploader.upload() method ka use karke hum file ko cloudinary pe upload karte hai, is method me hum file (jo ki base64 string format me hoti hai) aur ek options object pass karte hai jisme hum resource_type: "auto" specify karte hai taki cloudinary khud se file type detect kar sake aur uske accordingly handle kare
    resource_type: "auto",  // resource_type: "auto" ka mtlb h ki cloudinary ko khud se detect karne do ki ye file kis type ki hai (image, video, etc.), isse hum apne upload logic ko aur flexible bana sakte hai kyunki hume manually file type specify karne ki zarurat nahi padegi, cloudinary khud se file type detect karke uske accordingly handle karega
  });

  return result;
}

const upload = multer({ storage });  // storage define kr chuke h upar, ab is storage ko multer ke config me use kr rhe h taki jab bhi koi file upload ho to wo memory me store ho, isse hum apne image upload flow ko efficient bana sakte hai kyunki hume file ko pehle disk pe save karne ki zarurat nahi padegi, hum directly memory se file ko cloudinary me upload kar sakte hai

module.exports = { upload, imageUploadUtil };


// 1️⃣ Ye file kya kar rahi hai?

// 👉 Cloudinary setup + image upload helper + multer config

// npm i cloudinary - Cloudinary SDK (Node.js library)
// npm i multer - Middleware for handling multipart/form-data (file uploads)