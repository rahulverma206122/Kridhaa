const Feature = require("../../models/Feature");

const addFeatureImage = async (req, res) => {
  try { // Client (frontend) se image URL aa raha hai
    const { image } = req.body;   // ye image URL hoga jo client se aayega, aur hum ise database me save karenge. req.body se hum client se bheje gaye data ko access karte hain, aur yaha hum image URL ko extract kar rahe hain jo client ne request body me bheja hai.
 // Aur backend usse database me save karne ki preparation kar raha hai. Jab hum new Feature({ image }) karte hain, to hum ek naya document create kar rahe hain jisme image field me client se aaya hua image URL store hoga. Phir hum us document ko save karenge database me, taki wo future me retrieve kiya ja sake aur frontend me dikhaya ja sake.
    const featureImages = new Feature({       // New document banana  // Feature = Mongoose model (MongoDB collection), aur hum usme image field set kar rahe hain jo client se aaya hai. Jab hum new Feature({ image }) karte hain, to hum ek naya document create kar rahe hain jisme image field me client se aaya hua image URL store hoga. Phir hum us document ko save karenge database me, taki wo future me retrieve kiya ja sake aur frontend me dikhaya ja sake.
      image,
    });

    await featureImages.save();

    res.status(201).json({  // 201 status code ka matlab hai "Created", yani ki naya resource successfully create ho gaya hai. Jab hum res.status(201).json(...) bhejte hain, to hum client ko ye bata rahe hain ki naya feature image successfully create ho gaya hai, aur saath hi hum us image ka data bhi client ko bhej rahe hain taki frontend me wo image dikhaya ja sake.
      success: true,
      data: featureImages,
    });
  } catch (e) {
    // console.log(e); // jo actual error aya hai usko backend ke console me (mtlb terminal pr)print karna (server terminal pe).network tab me nahi.Network tab me tumhe sirf res.status(...).json(...) ka response dikhai dega, jo tum client ko bhej rahe ho.Browser me jab API call fail hoti hai aur tum res.status(500).json(...) ko networl tab me dekhte ho 
    res.status(500).json({  // 500 status code ka matlab hai "Internal Server Error", yani ki server ke andar kuch error ho gaya hai. Jab hum res.status(500).json(...) bhejte hain, to hum client ko ye bata rahe hain ki server ke andar kuch error ho gaya hai, aur saath hi hum ek error message bhi client ko bhej rahe hain taki frontend me user ko pata chale ki kuch galat ho gaya hai.
      success: false,
      message: "Some error occured!",
    });
  }
};

const getFeatureImages = async (req, res) => {
  try {
    const images = await Feature.find({});  // yha feature model se database me se sare feature images ko find kar ke la rahe hain. Feature.find({}) ka matlab hai "Mujhe Feature collection me se sare documents do". Ye query database me se sare feature images ko retrieve karegi, aur unhe images variable me store karegi. Phir hum us images variable ko client ko bhejenge taki frontend me wo images dikhaya ja sake.
  // find({}) me hum filter criteria de sakte hain, jaise ki find({ category: "electronics" }) to get only electronics category ke feature images. Lekin yaha humne empty object {} pass kiya hai, iska matlab hai ki hum kisi bhi filter criteria ka use nahi kar rahe hain, aur hume database me se sare feature images chahiye.
    res.status(200).json({  // 200 status code ka matlab hai "OK", yani ki request successfully process ho gayi hai. Jab hum res.status(200).json(...) bhejte hain, to hum client ko ye bata rahe hain ki request successfully process ho gayi hai, aur saath hi hum images ka data bhi client ko bhej rahe hain taki frontend me wo images dikhaya ja sake.
      success: true,
      data: images,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const deleteFeatureImage = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedImage = await Feature.findByIdAndDelete(id);

    if (!deletedImage) {
      return res.status(404).json({  // 404 status code ka matlab hai "Not Found", yani ki jo resource tum delete karne ki koshish kar rahe ho wo database me nahi mila. Jab hum res.status(404).json(...) bhejte hain, to hum client ko ye bata rahe hain ki jo feature image tum delete karne ki koshish kar rahe ho wo database me nahi mila, aur saath hi hum ek error message bhi client ko bhej rahe hain taki frontend me user ko pata chale ki wo image delete nahi ho paya hai kyunki wo image database me exist hi nahi karta.
        success: false,
        message: "Image not found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Image deleted successfully!",
    });
  } catch (e) {
   // console.log("Error in deleteFeatureImage:", e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};


module.exports = { addFeatureImage, getFeatureImages, deleteFeatureImage };
