require("dotenv").config(); // it automatically reads all the environment variables that we created
// Ye .env file ko load karta hai aur uske variables ko process.env me daal deta hai
// npm i dotenv - Ye package install karna hota hai taaki hum .env file ka use kar sake

const express = require("express");

const mongoose = require("mongoose"); 
// Ye MongoDB ke saath interact karne ke liye library hai,
// isse hum apne Node.js server se MongoDB database me data store aur retrieve kar sakte hai

const cookieParser = require("cookie-parser"); 
// “cookie-parser is a middleware used to parse cookies from incoming requests
// and make them available in req.cookies.”

const cors = require("cors"); 
// CORS (Cross-Origin Resource Sharing) ek security feature hai jo web browsers me implement hota hai,
// iska purpose hai ki ye control karta hai ki kaunse domains tumhare server ke resources ko access kar sake

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));  
// 👉 To use node-fetch in a CommonJS (require-based) project

const xml2js = require("xml2js"); 
// ✅ for XML parsing
// Ye xml2js library ko import kar raha hai jo XML data ko JavaScript object (JSON jaisa) me convert karti hai

// 🔥 Use kaha hota hai?
// 👉 Jab API XML me data deti hai (old systems, SOAP, etc.)
// ➡️ Tum usko JS object me convert karte ho


// ==========================================
// ROUTES IMPORT
// ==========================================

const authRouter = require("./routes/auth/auth-routes");

const adminProductsRouter = require(
  "./routes/admin/products-routes"
);

const adminOrderRouter = require(
  "./routes/admin/order-routes"
);

const aiRoutes = require(
  "./routes/common/ai-routes"
);

const recommendationRouter = require(
  "./routes/shop/recommendation-routes"
);

const visualSearchRoutes = require(
  "./routes/shop/visual-search-routes"
);

const shopProductsRouter = require(
  "./routes/shop/products-routes"
);

const shopCartRouter = require(
  "./routes/shop/cart-routes"
);

const shopAddressRouter = require(
  "./routes/shop/address-routes"
);


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

// Now Node will search outside project, which is wrong.


const shopOrderRouter = require(
  "./routes/shop/order-routes"
);

const shopSearchRouter = require(
  "./routes/shop/search-routes"
);

const shopReviewRouter = require(
  "./routes/shop/review-routes"
);

const commonFeatureRouter = require(
  "./routes/common/feature-routes"
);


// ==========================================
// MONGODB CONNECTION
// ==========================================

// MongoDB Connection
mongoose
  // Ye MongoDB database se connect karta hai aur success ya error handle karta hai

  .connect(process.env.MONGO_URL)
  // .connect() ek Promise return karta hai

  .then(() =>
    console.log("MongoDB connected")
  )

  .catch((error) =>
    console.log(error)
  );


const app = express();  

// yha express ek function hai jo ek naya Express application create karta hai, 
// is application object (app) ke through hum apne server ke routes, middleware, configuration, etc. define karte hai,
// to jab bhi hum app.use(), app.get(), app.post() etc. likhte hai to hum is Express application object ke methods ko call kar rahe hote hai taaki hum apne server ka behavior define kar sake

const PORT =
  process.env.PORT || 5000;


// ==========================================
// CORS
// ==========================================

// Backend allow kar raha hai ki specific frontend (origin) usse request bhej sake — with controlled methods, headers, and cookies

app.use(
  // Middleware apply kar rahe ho

  cors({
    origin: process.env.CLIENT_BASE_URL,
    // Kaun request bhej sakta hai?

    methods: [
      "GET",
      "POST",
      "DELETE",
      "PUT",
    ],
    // Kaunse HTTP methods allowed hain

    allowedHeaders: [
      // Kaunse headers allow hain
      // Agar header allowed nahi hoga → request block ho sakti hai

      "Content-Type",
      // Ye header specify karta hai ki request body kis format me hai

      "Authorization",
      // Ye header usually JWT token ya authentication token ko bhejne ke liye use hota hai

      "Cache-Control",
      // Ye caching behavior ko control karta hai

      "Expires",
      // Ye response ke expire hone ka time specify karta hai

      "Pragma",
    ],

    credentials: true,
    // Tabhi cookie backend tak jayegi
  })
);


// app.use() = use karne ka tarika
// jo andar pass karte ho = middleware


app.use(cookieParser());  
// Ye middleware ko use kar raha hai taaki hum apne routes me cookies ko easily access kar sake

app.use(express.json()); 
// Ye middleware JSON data ko parse karke req.body me available kar deta hai


// ======================================================
// LIVE GOLD / SILVER RATE SYSTEM
// ======================================================
//
// Yaha hum latest rates ko memory me temporarily store karenge.
//
// Iska fayda:
//
// Frontend → /api/rates
//             ↓
//        Cache available?
//             ↓
//       YES → cached data
//       NO  → PankajChain API
//
// Isse har frontend request par external API call nahi hogi.
//
// ======================================================


// ==========================================
// RATE CACHE
// ==========================================

let cachedRates = [];

// Last time jab successful API request hui thi
let lastRatesFetchTime = 0;


// ==========================================
// CACHE DURATION
// ==========================================

// Cache ko 45 seconds tak valid rakhenge
const RATE_CACHE_DURATION = 45 * 1000;


// ==========================================
// PANKAJCHAIN API URL
// ==========================================

const PANKAJCHAIN_RATE_API =
  "https://bcast.pankajchain.com:7768/VOTSBroadcastStreaming/Services/xml/GetLiveRateByTemplateID/pankajchain";


// ==========================================
// GET LIVE RATES
// ==========================================

app.get(
  "/api/rates",
  async (req, res) => {

    try {

      const now = Date.now();


      // ==========================================
      // CHECK CACHE
      // ==========================================
      //
      // Agar cache available hai aur 45 seconds
      // ke andar update hua hai to external API
      // ko dobara call nahi karenge.
      //
      // ==========================================

      if (
        cachedRates.length > 0 &&
        now - lastRatesFetchTime <
          RATE_CACHE_DURATION
      ) {

        // console.log(
        //   "Returning cached gold/silver rates"
        // );

        return res.json({
          success: true,
          rates: cachedRates,
          cached: true,
        });
      }


      // ==========================================
      // FETCH FROM PANKAJCHAIN
      // ==========================================

      // console.log(
      //   "Fetching fresh rates from PankajChain..."
      // );


      const response = await fetch(
        PANKAJCHAIN_RATE_API
      );


      // ==========================================
      // CHECK RESPONSE
      // ==========================================

      if (!response.ok) {

        throw new Error(
          `PankajChain API returned ${response.status}`
        );
      }


      // ==========================================
      // GET RAW RESPONSE
      // ==========================================

      const rawData =
        await response.text();


      // ==========================================
      // CHECK EMPTY RESPONSE
      // ==========================================

      if (
        !rawData ||
        !rawData.trim()
      ) {

        throw new Error(
          "PankajChain returned an empty response"
        );
      }


      // ==========================================
      // SPLIT ROWS
      // ==========================================

      const rows =
        rawData
          .split("\n")
          .map(
            (row) =>
              row.trim()
          )
          .filter(
            (row) => row
          );


      // ==========================================
      // FINAL RATES ARRAY
      // ==========================================

      const rates = [];


      // ==========================================
      // PROCESS EACH ROW
      // ==========================================

      rows.forEach(
        (row) => {

          const cols =
            row.split(/\s+/);


          // ==========================================
          // GOLD 99.50
          // ==========================================

          if (
            row.includes("GOLD 99.50 CASH BHAV")
          ) {

            // Last 4 values are the actual rates
            // Example:
            // 147699 149199 151100 148590

            const prices =
              cols.slice(-4);

            // Use the second rate
            // Example:
            // 149199

            const price =
              prices[1];


            if (
              price &&
              !isNaN(
                Number(price)
              )
            ) {

              rates.push({
                label:
                  "GOLD 99.50 HAJIR BHAV",

                price:
                  price,
              });
            }
          }


          // ==========================================
          // SILVER REFINERY
          // ==========================================

          if (
            row.includes(
              "SILVER REFINERY 99 PLUS"
            )
          ) {

            // Last 4 values are the actual rates
            // Example:
            // 232698 237198 242434 236003

            const prices =
              cols.slice(-4);

            // Use the second rate
            // Example:
            // 237198

            const price =
              prices[1];


            if (
              price &&
              !isNaN(
                Number(price)
              )
            ) {

              rates.push({
                label:
                  "SILVER REFINERY 99 PLUS",

                price:
                  price,
              });
            }
          }


          // ==========================================
          // GOLD 99.50 RTGS
          // ==========================================

          if (
            row.includes(
              "GOLD 99.50 RTGS"
            )
          ) {

            // Last 4 values are the actual rates
            // Example:
            // - 156959 158000 155549

            const prices =
              cols.slice(-4);

            // First value is "-" so use the second value
            // Example:
            // 156959

            const price =
              prices[1];


            if (
              price &&
              !isNaN(
                Number(price)
              )
            ) {

              rates.push({
                label:
                  "GOLD 99.50 RTGS",

                price:
                  price,
              });
            }
          }


          // ==========================================
          // 22K GOLD
          // ==========================================

          if (
            cols[1] === "22" &&
            cols[2] === "K"
          ) {

            const price =
              cols[10];


            if (
              price &&
              !isNaN(
                Number(price)
              )
            ) {

              rates.push({
                label:
                  "22K GOLD PRICE WITHOUT MAKING & GST",

                price:
                  price,
              });
            }
          }


          // ==========================================
          // 20K GOLD
          // ==========================================

          if (
            cols[1] === "20" &&
            cols[2] === "K"
          ) {

            const price =
              cols[10];


            if (
              price &&
              !isNaN(
                Number(price)
              )
            ) {

              rates.push({
                label:
                  "20K GOLD PRICE WITHOUT MAKING & GST",

                price:
                  price,
              });
            }
          }


          // ==========================================
          // 18K GOLD
          // ==========================================

          if (
            cols[1] === "18" &&
            cols[2] === "K"
          ) {

            const price =
              cols[10];


            if (
              price &&
              !isNaN(
                Number(price)
              )
            ) {

              rates.push({
                label:
                  "18K GOLD PRICE WITHOUT MAKING & GST",

                price:
                  price,
              });
            }
          }

        }
      );


      // ==========================================
      // CHECK WHETHER WE GOT VALID DATA
      // ==========================================

      if (
        rates.length === 0
      ) {

        throw new Error(
          "No valid gold/silver rates found in PankajChain response"
        );
      }


      // ==========================================
      // UPDATE CACHE
      // ==========================================

      cachedRates =
        rates;

      lastRatesFetchTime =
        now;


      // ==========================================
      // LOG UPDATED RATES
      // ==========================================

      // console.log(
      //   "=========================================="
      // );

      // console.log(
      //   "Rates successfully updated:"
      // );

      // console.log(
      //   cachedRates
      // );

      // console.log(
      //   "=========================================="
      // );


      // ==========================================
      // SEND RESPONSE
      // ==========================================

      return res.json({

        success: true,

        rates:
          cachedRates,

        cached: false,

      });

    } catch (error) {

      // ==========================================
      // ERROR
      // ==========================================

      console.error(
        "Error fetching live rates:",
        error
      );


      // ==========================================
      // FALLBACK
      // ==========================================
      //
      // Agar PankajChain fail ho jata hai
      // lekin hamare paas previous successful
      // rates hain, to wahi rates return karenge.
      //
      // Isse website blank nahi hogi.
      //
      // ==========================================

      if (
        cachedRates.length > 0
      ) {

        // console.log(
        //   "PankajChain failed."
        // );

        // console.log(
        //   "Returning last successful cached rates."
        // );


        return res.json({

          success: true,

          rates:
            cachedRates,

          cached: true,

          fallback: true,

        });
      }


      // ==========================================
      // NO CACHE AVAILABLE
      // ==========================================

      return res.status(503).json({

        success: false,

        message:
          "Live rates are temporarily unavailable",

        rates: [],

      });

    }
  }
);


// 🔹 How you decide cols[10]?

// 👉 Step-by-step samamjho 👇

// 🔸 Step 1: Raw data print karo
// console.log(row);

// 👉 Example output:

// GOLD 22 K ... ... ... 58500 ...

// 🔸 Step 2: Split karke dekho
// console.log(cols);

// 👉 Output:

// ["GOLD", "22", "K", "...", "...", "...", "58500", "..."]

// 🔸 Step 3: Index identify karo

// Index:   0      1    2    3    4    5    6    7   8   9   10
// Value: GOLD   22    K   ...  ...  ...  ...  ... ... ... 58500

// 👉 Tum dekhoge:

// Price kis index pe hai → wahi use karna


// 🔹 Important Point ⚠️

// 👉 cols[10] is hardcoded based on current format

// 👉 Agar API change ho gaya ❌
// 👉 Index bhi change ho jayega


// ==========================================
// ROUTES
// ==========================================


app.use(
  "/api/auth",
  authRouter
);
// isme app ka matlab express app hai,
// /api/auth is the base route,
// aur authRouter is the router jo humne create kiya hai auth ke liye.


app.use(
  "/api/admin/products",
  adminProductsRouter
);


app.use(
  "/api/admin/orders",
  adminOrderRouter
);


app.use(
  "/api/shop/products",
  shopProductsRouter
);


app.use(
  "/api/shop/cart",
  shopCartRouter
);
// isme /api/shop/cart kahi se aaya h ya apne man se likha h
// apne man se aaya h
// Tum kuch bhi likh sakte ho
// but writing like this is a good practise
//
// mtlb Jo bhi routes shopCartRouter me hain,
// unke aage /api/shop/cart lag jayega


// Example:

// Agar router me likha hai:

// router.get("/get/:userId", fetchCartItems);

// 👉 Final route banega:

// GET /api/shop/cart/get/123


// "/api/shop/cart" ise humne slice me use kiya h


app.use(
  "/api/shop/address",
  shopAddressRouter
);


app.use(
  "/api/shop/order",
  shopOrderRouter
);
// ye bol rha h
// “Jo bhi request /api/shop/order se start hogi,
// usko shopOrderRouter handle karega”


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

// Mounting a Router / Middleware
// mtlb router ko base path pe attach kar rahe ho


app.use(
  "/api/shop/search",
  shopSearchRouter
);


app.use(
  "/api/shop/review",
  shopReviewRouter
);


app.use(
  "/api/common/feature",
  commonFeatureRouter
);


app.use(
  "/api/common/ai",
  aiRoutes
);


app.use(
  "/api/shop/recommendations",
  recommendationRouter
);


app.use(
  "/api/shop/visual-search",
  visualSearchRoutes
);


// ==========================================
// START SERVER
// ==========================================

app.listen(
  PORT,
  () =>
    console.log(
      `Server is now running on port ${PORT}`
    )
);

// Ye server ko start karta hai aur batata hai ki wo kis port par requests sun raha hai

// app.listen(PORT, ...)

// Callback function
// () => console.log(...)

// Jab server successfully start ho jata hai
// ➡️ ye function run karta hai