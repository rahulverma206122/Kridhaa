const Address = require("../../models/Address"); //const means we are creating a constant variable named Address.

// This variable will hold the Mongoose model that we exported earlier.
// So now we can use Address to perform database operations. like creating a new address, finding addresses, updating them, etc. 
// require() is used in Node.js to import a file or module.
// ../../ ka matlab hai current file se 2 folders piche (upar) jaana. mtlb server/controllers/shop/address-controller.js se server/models/Address.js tak jane ke liye 2 baar ../ use karna padta hai. pehla ../ se hum server folder me aate hai, dusra ../ se hum models folder me aate hai, aur fir Address.js file ko import kar lete hai.
// so iska ../../models/Address mtlb h ki hum server/controllers/shop/address-controller.js se server/models/Address.js file ko import kar rhe h. but yha models likha kyu ki models folder ke andar Address.js file hai. agar models folder ke andar aur koi folder hota jisme Address.js file hoti to uska naam bhi yha include karna padta. for example, agar models folder ke andar ek aur folder hai jiska naam "user" hai aur uske andar Address.js file hai to hum is tarah se import karte: ../../models/user/Address. but yaha models ke andar direct Address.js file hai isliye ../../models/Address likha h.

// Step 1 —  .. (first)
// Go one folder up:
// server/controllers tak 

// Step 2 —  .. (second)
// Go one more folder up:
// server tak

// Step 3 —  models/Address
// Now go into the models folder and import the Address.js file. 

const addAddress = async (req, res) => {                              // async means this function will perform asynchronous operations, such as database queries, and we can use await inside it to wait for those operations to complete before moving on to the next line of code.
  try {                                                          // try block is used to wrap code that may throw an error. If any error occurs in the try block, it will be caught by the catch block, allowing us to handle the error gracefully instead of crashing the application.
    const { userId, address, city, state, pincode, phone, notes } = req.body; // is line ka mtlb h ki hum req.body se userId, address, city, state, pincode, phone, notes ko extract kar rhe h.
                                                                        // req.body me wo data hota hai jo client se server ko bheja jata hai, usually form data ya JSON data ke roop me. is line me hum destructuring assignment ka use kar rhe h jisse hum directly req.body se in variables ko nikal sakte hai.

    if (!userId || !address || !city || !state || !pincode || !phone || !notes) { // || operator ka matlab hai "logical OR". is condition me hum check kar rhe h ki userId, address, city, state, pincode, phone, notes me se koi bhi field missing to nahi hai. agar koi bhi field missing hai to ye condition true ho jayegi aur hum 400 status code ke sath ek JSON response bhejenge jisme success: false aur message: "Invalid data provided!" hoga.
      return res.status(400).json({                                                 // 400 status code ka matlab hai "Bad Request", yani client ne server ko galat ya incomplete data bheja hai. is case me hum check kar rhe h ki userId, address, city, state, pincode, phone, notes me se koi bhi field missing to nahi hai. agar koi bhi field missing hai to hum 400 status code ke sath ek JSON response bhejte hai jisme success: false aur message: "Invalid data provided!" hota hai.
                                                                               // return ka matlab hai ki agar ye condition true ho jati hai to hum function se bahar aa jayenge aur aage ka code execute nahi hoga.
        success: false,
        message: "Invalid data provided!", // ye msg dikhega client ko jab wo address add karne ki koshish karega aur koi required field missing hoga. is message se client ko pata chalega ki unhone galat ya incomplete data provide kiya hai.
      });
    }

    const newlyCreatedAddress = new Address({ // is line me hum ek naya Address document create kar rhe h using the Mongoose model. new Address() ka matlab hai ki hum Address model ka ek naya instance create kar rhe h, jisme hum userId, address, city, state, pincode, notes, phone ko set kar rhe h. ye data humne req.body se extract kiya tha.
      userId,  // if we want then we cant take userid here and set it to some value like userId: userId, but since the key and value ka naam same hai to hum sirf userId likh ke bhi use kar sakte hai. is tarah se hum address, city, state, pincode, notes, phone ke liye bhi kar sakte hai.
      address,  // address na bhi le to koi dikkt nhi hogi kyunki address field ko required nahi banaya gaya hai schema me. but agar aap address field ko required banate to is line me address ko lena zaruri ho jata. but yaha humne address field ko required nahi banaya isliye agar client address field ko provide nahi karta to bhi ye code sahi se execute ho jayega.
      city,     // yha hme wo sari cheze leni jo model me define ki hai. agar model me koi field define nahi hai to usko lena zaruri nahi hai. but agar model me koi field define hai to usko lena zaruri hai warna jab hum save karenge to wo field database me save nahi hogi.
      state,
      pincode,
      notes,
      phone,
    });

    await newlyCreatedAddress.save();

    {/**When you create a document like this:

      const newlyCreatedAddress = new Address({
      street: "gt Road",
      city: "Delhi",
      userId: "123"
    });

    At this point, newlyCreatedAddress is just a JavaScript object in memory. It is not yet saved in the database.
    So when you call:  await newlyCreatedAddress.save();

    Mongoose sends an insert query to MongoDB.
    The document is written into the collection.
    The await ensures you don’t move ahead until Mongo confirms the save.

      but if u do like this:
      const newlyCreatedAddress = await Address.create({
      street: "MG Road",
      city: "Delhi",
      userId: "123"
    });
    u dont need to save manually

      */}

    res.status(201).json({
      success: true,
      data: newlyCreatedAddress,
    });
  } catch (e) { // yha pr e ka mtlb h error
   // console.log(e);  // ye hme console me error ko print karne ke liye use karte hai taki hme pata chale ki error kya hai. isse hme debugging me madad milegi.
    res.status(500).json({ // 500 status code ka matlab hai "Internal Server Error", yani server me koi unexpected error hua hai. 
      success: false,
      message: "Error",  // ye message client ko bheja jayega jab server me koi unexpected error hoga. is message se client ko pata chalega ki server me koi error hua hai, lekin is message se hme exact error ka pata nahi chalega. isliye hme console.log(e) karna zaruri hai taki hme pata chale ki error kya hai.
    });
  }
};

const fetchAllAddress = async (req, res) => {
  try {
    const { userId } = req.params; // fetch address by userId
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User id is required!",
      });
    }

    const addressList = await Address.find({ userId }); // Address address-model ka h jo upar require kiya h, jisme jake hum userid ke liye address ko search kr rhe h 

    res.status(200).json({
      success: true,
      data: addressList, // iska mtlb h ki hum client ko addressList bhej rhe h jisme wo sare addresses honge jo is userId ke liye database me save hai. client is data ko receive karke apne UI me display kar sakta hai.
    });
  } catch (e) {
  //  console.log(e);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

const editAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;  // is line me hum req.params se userId aur addressId ko extract kar rhe h. req.params me wo data hota hai jo URL ke path me hota hai, jaise ki /users/:userId/addresses/:addressId me userId aur addressId ko URL ke path me define kiya jata hai. is line me hum destructuring assignment ka use kar rhe h jisse hum directly req.params se in variables ko nikal sakte hai.
    const formData = req.body;

    if (!userId || !addressId) {
      return res.status(400).json({
        success: false,
        message: "User and address id is required!",
      });
    }

    const address = await Address.findOneAndUpdate(
      {
        _id: addressId, // is line me hum database me address ko search kar rhe h jiska _id addressId ke barabar ho aur userId bhi match kare. is tarah se hum ensure kar rhe h ki user apne hi address ko update kar raha hai, kisi aur ke address ko nahi. agar hum sirf _id: addressId karte to koi bhi user kisi bhi address ko update kar sakta, lekin yaha hum userId bhi check kar rhe h jisse security badh jati hai.
        userId,
      },
      formData, // is line me hum formData ko update ke roop me pass kar rhe h. formData me wo sari fields hoti hai jo client ne update karne ke liye bheji hai. for example, agar client ne address aur city ko update karne ke liye bheja hai to formData me address aur city ki updated values hongi. is tarah se hum sirf unhi fields ko update kar sakte hai jo client ne bheji hai, baki fields unchanged rahengi.
      { new: true }  // Tells Mongoose to return the updated document, not the old one but if we dont do this then It will update correctly, but you’ll get the previous version of the document.
    );

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    res.status(200).json({
      success: true,
      data: address,
    });
  } catch (e) {
   // console.log(e);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

const deleteAddress = async (req, res) => {  // ye hme kaise pata chlega kab req.params use krna h kab req.body use krna h? iska answer ye h ki generally, req.params ka use tab hota hai jab hum URL ke path me data pass karte hai, jaise ki /users/:userId/addresses/:addressId me userId aur addressId ko URL ke path me define kiya jata hai. is case me hum req.params se userId aur addressId ko extract karte hai. on the other hand, req.body ka use tab hota hai jab hum client se data bhejte hai request ke body me, usually form data ya JSON data ke roop me. is case me hum req.body se wo data extract karte hai jo client ne update karne ke liye bheja hai, jaise ki address, city, state, pincode, notes, phone, etc. to summarize, agar data URL ke path me hai to req.params use karte hai, aur agar data request ke body me hai to req.body use karte hai. yha hum req.body use nahi kar rhe h kyunki delete request me hum sirf URL ke path me userId aur addressId pass kar rhe h, aur koi additional data nahi bhej rahe h request ke body me.
  try {
    const { userId, addressId } = req.params; // kya hum yha pe req.body se userId aur addressId le sakte hai? technically to le sakte hai, lekin REST API design principles ke according, delete request me hum usually URL ke path me hi identify karte hai ki kis resource ko delete karna hai. is case me hum /users/:userId/addresses/:addressId jaisa URL design kar sakte hai jisme userId aur addressId URL ke path me hoga. is tarah se hum req.params se userId aur addressId ko extract karenge. agar hum req.body se lete to wo thoda unconventional hota, kyunki delete request me usually body nahi hoti, aur agar body hoti bhi hai to wo additional data ke roop me hoti hai, na ki resource identification ke roop me. isliye yaha hum req.params use kar rhe h.
    if (!userId || !addressId) {
      return res.status(400).json({  // 400 = Bad Request
        success: false,
        message: "User and address id is required!",
      });
    }

    const address = await Address.findOneAndDelete({ _id: addressId, userId });
 // “Aisa document dhoondo jisme _id bhi match kare AND userId bhi match kare”
    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (e) {
   // console.log(e);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

module.exports = { addAddress, editAddress, fetchAllAddress, deleteAddress };
