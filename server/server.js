require("dotenv").config(); // it automatically reads all the environment variables that we created
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));
const xml2js = require("xml2js"); // ✅ for XML parsing

const authRouter = require("./routes/auth/auth-routes");
const adminProductsRouter = require("./routes/admin/products-routes");
const adminOrderRouter = require("./routes/admin/order-routes");

const shopProductsRouter = require("./routes/shop/products-routes");
const shopCartRouter = require("./routes/shop/cart-routes");
const shopAddressRouter = require("./routes/shop/address-routes");
const shopOrderRouter = require("./routes/shop/order-routes");
const shopSearchRouter = require("./routes/shop/search-routes");
const shopReviewRouter = require("./routes/shop/review-routes");

const commonFeatureRouter = require("./routes/common/feature-routes");

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log(error));

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_BASE_URL,
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

/**
 * ✅ Proxy Route for PankajChain API (Live Gold/Silver rates)
 */
app.get("/api/rates", async (req, res) => {
  try {
    const response = await fetch(
      "https://bcast.pankajchain.com:7768/VOTSBroadcastStreaming/Services/xml/GetLiveRateByTemplateID/pankajchain"
    );

    const rawData = await response.text();

    // Split rows by newline
    const rows = rawData.split("\n").map(r => r.trim()).filter(r => r);

    let rates = [];

    rows.forEach(row => {
      const cols = row.split(/\s+/);

      if (cols.includes("GOLD") && cols.includes("99.50")) {
        rates.push({ label: "GOLD 99.50 HAJIR BHAV", price: cols[6] });
      }
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

    res.json({ rates });
  } catch (err) {
    console.error("Error fetching rates:", err);
    res.status(500).json({ error: "Failed to fetch rates" });
  }
});

// Routes
app.use("/api/auth", authRouter);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/admin/orders", adminOrderRouter);

app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", shopAddressRouter);
app.use("/api/shop/order", shopOrderRouter);
app.use("/api/shop/search", shopSearchRouter);
app.use("/api/shop/review", shopReviewRouter);

app.use("/api/common/feature", commonFeatureRouter);

app.listen(PORT, () => console.log(`Server is now running on port ${PORT}`));
