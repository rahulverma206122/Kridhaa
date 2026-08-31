const mongoose = require("mongoose"); //This line imports the Mongoose library.used to interact with MongoDB in Node.js.

const AddressSchema = new mongoose.Schema(
  {
    userId: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
    phone: String,
    notes: String,
  },
  { timestamps: true }  // This option adds createdAt and updatedAt fields to the schema, which automatically store the timestamps of when a document is created and last updated.
);

module.exports = mongoose.model("Address", AddressSchema); // here address is the name of the collection/model in the database. Mongoose will automatically pluralize it to "addresses". The second argument is the schema we defined above. This line exports the model, allowing us to use it in other parts of our application to interact with the "addresses" collection in MongoDB.