require("dotenv").config(); // it automatically reads all the environment variables that we created
// Ye .env file ko load karta hai aur uske variables ko process.env me daal deta hai
// npm i dotenv - Ye package install karna hota hai taaki hum .env file ka use kar sake
const express = require("express");
const mongoose = require("mongoose"); // Ye MongoDB ke saath interact karne ke liye library hai, isse hum apne Node.js server se MongoDB database me data store aur retrieve kar sakte hai
const cookieParser = require("cookie-parser"); // “cookie-parser is a middleware used to parse cookies from incoming requests and make them available in req.cookies.”
const cors = require("cors"); // CORS (Cross-Origin Resource Sharing) ek security feature hai jo web browsers me implement hota hai, iska purpose hai ki ye control karta hai ki kaunse domains tumhare server ke resources ko access kar sakte hai, isse tum apne server ko secure bana sakte ho aur unwanted cross-origin requests ko block kar sakte ho
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));  // 👉 To use node-fetch in a CommonJS (require-based) project
const xml2js = require("xml2js"); // ✅ for XML parsing  Ye xml2js library ko import kar raha hai jo XML data ko JavaScript object (JSON jaisa) me convert karti hai

// 🔥 Use kaha hota hai?
// 👉 Jab API XML me data deti hai (old systems, SOAP, etc.)
// ➡️ Tum usko JS object me convert karte ho

const authRouter = require("./routes/auth/auth-routes");
const adminProductsRouter = require("./routes/admin/products-routes");
const adminOrderRouter = require("./routes/admin/order-routes");  //

const shopProductsRouter = require("./routes/shop/products-routes");
const shopCartRouter = require("./routes/shop/cart-routes");
const shopAddressRouter = require("./routes/shop/address-routes"); 

// ./ ka matlab:

// 👉 current folder se start karo (server)

// Agar ye line server.js me likhi hai, to path aise chalega:

// server
//    ↓
// routes
//    ↓
// shop
//    ↓
// address-routes.js

// To Node.js yeh file load karega:

// server/routes/shop/address-routes.js


// Why NOT ../

// .. means go one folder up.

// If you write:

// require("../routes/shop/address-routes")

// Then Node will go:

// server/server.js
//       ↑
//       ..
// project root

// Then it will search:

// project/routes/shop/address-routes

// But routes folder is inside server, not outside.

// So it will give error.

// Why NOT ../../

// ../../ means two folders up.

// Example:

// server/server.js
//       ↑
//       ..
// project root
//       ↑
//       ..
// outside project

// Now Node will search outside your project, which is wrong.

const shopOrderRouter = require("./routes/shop/order-routes");
const shopSearchRouter = require("./routes/shop/search-routes");
const shopReviewRouter = require("./routes/shop/review-routes");
const commonFeatureRouter = require("./routes/common/feature-routes");

// MongoDB Connection
mongoose  // Ye MongoDB database se connect karta hai aur success ya error handle karta hai
  .connect(process.env.MONGO_URL)  // .connect() ek Promise return karta hai
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log(error));

const app = express();  // yha express ek function hai jo ek naya Express application create karta hai, 
// is application object (app) ke through hum apne server ke routes, middleware, configuration, etc. define karte hai,
// to jab bhi hum app.use(), app.get(), app.post() etc. likhte hai to hum is Express application object ke methods ko call kar rahe hote hai taaki hum apne server ka behavior define kar sake
const PORT = process.env.PORT || 5000;


// Backend allow kar raha hai ki specific frontend (origin) usse request bhej sake — with controlled methods, headers, and cookies

app.use( // Middleware apply kar rahe ho
  cors({
    origin: process.env.CLIENT_BASE_URL,  // Kaun request bhej sakta hai?
    methods: ["GET", "POST", "DELETE", "PUT"],  // Kaunse HTTP methods allowed hain
    allowedHeaders: [   // Kaunse headers allow hain  Agar header allowed nahi hoga → request block ho sakti hai
      "Content-Type",  // Ye header specify karta hai ki request body kis format me hai (JSON, form-data, etc.)
      "Authorization",  // Ye header usually JWT token ya kisi bhi authentication token ko bhejne ke liye use hota hai, agar tumhara frontend JWT token ke through authenticate karta hai to is header ko allow karna zaruri hai taaki token backend tak pahunch sake
      "Cache-Control",  // Ye header caching behavior ko control karta hai, agar tum apne API responses ko cache karna chahte ho ya nahi karna chahte ho to is header ko allow karna zaruri hai
      "Expires",  // Ye header response ke expire hone ka time specify karta hai, agar tum apne API responses ke expire hone ka time set karna chahte ho to is header ko allow karna zaruri hai
      "Pragma",  
    ],
    credentials: true,   // Tabhi cookie backend tak jayegi Agar credentials: true nahi hoga to browser cookies ko backend tak nahi bhejega, isse authentication me problem ho sakti hai kyunki cookies ke through hi user ka session manage hota hai, to agar tum apne frontend se backend ko cookies bhejna chahte ho (jaise ki login ke baad session maintain karne ke liye) to is option ko true set karna zaruri hai
  })
);

// app.use() = use karne ka tarika
// jo andar pass karte ho = middleware

app.use(cookieParser());  // Ye middleware ko use kar raha hai taaki hum apne routes me cookies ko easily access kar sake, isse hum req.cookies ke through cookies ko read kar sakte hai aur res.cookie ke through cookies set kar sakte hai, ye authentication, session management, user preferences etc. ke liye useful hota hai
app.use(express.json()); //  Ye middleware JSON data ko parse karke req.body me available kar deta hai

/**
 * ✅ Proxy Route for PankajChain API (Live Gold/Silver rates)
 */
app.get("/api/rates", async (req, res) => {  // Route define kar rahe ho
  try {
    const response = await fetch(
      "https://bcast.pankajchain.com:7768/VOTSBroadcastStreaming/Services/xml/GetLiveRateByTemplateID/pankajchain"
    );  // Tum dusre server se data le rahe ho  fetch - http req hoti h 

    const rawData = await response.text(); 
//     👉 API JSON nahi de rahi
// 👉 Plain text format me data aa raha hai

    // Split rows by newline
    const rows = rawData.split("\n").map(r => r.trim()).filter(r => r);

//     .split("\n") → line by line tod diya
// .map(r => r.trim()) → extra spaces hata diye
// .filter(r => r) → empty lines hata di

// 👉 Result:

// ["line1", "line2", "line3"]
 
    let rates = [];  // Final result yaha store hoga

    rows.forEach(row => {
      const cols = row.split(/\s+/);

//       👉 Row ko words me split kiya (space ke basis pe)

// 👉 Example: "GOLD 99.50 ..." → ["GOLD", "99.50", ...]

      if (cols.includes("GOLD") && cols.includes("99.50")) {
        rates.push({ label: "GOLD 99.50 HAJIR BHAV", price: cols[6] });
      }
 
//👉 Agar row me:

// GOLD hai
// 99.50 hai

// 👉 Then:

// rates.push({ label: "GOLD 99.50 HAJIR BHAV", price: cols[6] });

// 👉 Price uthaya index 6 se


      if (cols.includes("SILVER") && cols.includes("REFINERY")) {
        rates.push({ label: "SILVER REFINERY 99 PLUS", price: cols[6] });
      }
      if (cols[1] === "22" && cols[2] === "K") {
        rates.push({ label: "22K GOLD PRICE WITHOUT MAKING & GST", price: cols[10] });
      }
      if (cols[1] === "20" && cols[2] === "K") {
        rates.push({ label: "20K GOLD PRICE WITHOUT MAKING & GST", price: cols[10] });
      }
      if (cols[1] === "18" && cols[2] === "K") {
        rates.push({ label: "18K GOLD PRICE WITHOUT MAKING & GST", price: cols[10] });
      }
    });

    res.json({ rates }); // 👉 Final output frontend ko json me 
  } catch (err) {
    console.error("Error fetching rates:", err);
    res.status(500).json({ error: "Failed to fetch rates" });
  }
});


// 🔹 How you decide cols[10]?

// 👉 Step-by-step samjho 👇

// 🔸 Step 1: Raw data print karo
// console.log(row);

// 👉 Example output:

// GOLD 22 K ... ... ... 58500 ...
// 🔸 Step 2: Split karke dekho
// console.log(cols);

// 👉 Output:

// ["GOLD", "22", "K", "...", "...", "...", "58500", "..."]
// 🔸 Step 3: Index identify karo

// 👉 Ab manually check karo:

// Index:   0      1    2    3    4    5    6    7   8   9   10
// Value: GOLD   22    K   ...  ...  ...  ...  ... ... ... 58500

// 👉 Tum dekhoge:

// Price kis index pe hai → wahi use karna

// 🔹 Important Point ⚠️

// 👉 cols[10] is hardcoded based on current format

// 👉 Agar API change ho gaya ❌
// 👉 Index bhi change ho jayega


// Routes
app.use("/api/auth", authRouter);  // isme app ka matlab express app hai, /api/auth is the base route, aur authRouter is the router jo humne create kiya hai auth ke liye. To jab bhi koi request aayegi /api/auth se start hone wali, to wo authRouter me jayegi handle hone ke liye.
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/admin/orders", adminOrderRouter);

app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart", shopCartRouter);   // isme /api/shop/cart khi se aaya h ya apne man se likha h ya kuch or bhi likh skte h -> apne man se aaya h Tum kuch bhi likh sakte ho  but writting like this is a good practise 
//  mtlb Jo bhi routes shopCartRouter me hain, unke aage /api/shop/cart lag jayega

// Example:

// Agar router me likha hai:

// router.get("/get/:userId", fetchCartItems);

// 👉 Final route banega:

// GET /api/shop/cart/get/123

// "/api/shop/cart" ise humne slice me use kiya h  

app.use("/api/shop/address", shopAddressRouter);
app.use("/api/shop/order", shopOrderRouter);  // ye bol rha h “Jo bhi request /api/shop/order se start hogi, usko shopOrderRouter handle karega”

// Combine karke dekho

// Tumne router me likha:

// router.post("/create", createOrder);

// 👉 Aur server.js me:

// app.use("/api/shop/order", shopOrderRouter);
// 🔥 Final API ban gaya:
// POST /api/shop/order/create


// 🧠 3 cheezein jo tumne likhi
// 1️⃣
// router.post("/create", createOrder);

// 👉 ❌ Ye poori API nahi hai
// 👉 Ye sirf route definition (partial) hai

// 2️⃣
// app.use("/api/shop/order", shopOrderRouter);

// 👉 ❌ Ye bhi API nahi hai
// 👉 Ye sirf base path attach kar raha hai

// 3️⃣ ✅ REAL API
// POST /api/shop/order/create

// 👉 ✔️ Ye actual API endpoint hai

// 🔥 Combine samjho
// app.use("/api/shop/order")  +  router.post("/create")
//                   ↓
//         FINAL API:
// POST /api/shop/order/create

// 🔍 1️⃣
// router.post("/create", createOrder);

// 👉 Isko bolte hain:

// Route (Route Handler / Endpoint Definition)

// Meaning:
// HTTP method define ho raha hai (POST)
// path define ho raha hai (/create)
// controller attach ho raha hai (createOrder)

// 🔍 2️⃣
// app.use("/api/shop/order", shopOrderRouter);

// 👉 Isko bolte hain:

// Mounting a Router / Middleware  mtlb router ko base path pe attach kar rahe ho


app.use("/api/shop/search", shopSearchRouter);
app.use("/api/shop/review", shopReviewRouter);

app.use("/api/common/feature", commonFeatureRouter);

app.listen(PORT, () => console.log(`Server is now running on port ${PORT}`));

// Ye server ko start karta hai aur batata hai ki wo kis port par requests sun raha hai

// app.listen(PORT, ...)

// 👉 Server start hota hai
// 👉 PORT (e.g. 5000) par listen karta hai


// Callback function
// () => console.log(...)

// 👉 Jab server successfully start ho jata hai
// ➡️ ye function run hota hai