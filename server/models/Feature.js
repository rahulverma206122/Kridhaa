const mongoose = require("mongoose");

const FeatureSchema = new mongoose.Schema(
  {
    image: String,   // image: string (URL of the feature image comes form the cloudnary)
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feature", FeatureSchema);