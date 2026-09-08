const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({

  userName: {

    type: String,

    required: true,

    unique: true,

  },

  email: {

    type: String,

    required: true,

    unique: true,

  },

  password: {

    type: String,

    required: true,

  },

  role: {

    type: String,

    default: "user",

  },

});

const User = mongoose.model("User", UserSchema);

module.exports = User;

// or short me 

// module.exports = mongoose.model("User", UserSchema);




// 🚀 Advanced Fields (IMPORTANT for interviews)

// 5️⃣ enum (limited values)

// role: {

//   type: String,

//   enum: ["user", "admin"]

// }

// 👉 Sirf ye values allowed

// 6️⃣ minlength / maxlength

// password: {

//   type: String,

//   minlength: 6

// }

// 👉 Validation

// 7️⃣ match (regex validation)

// email: {

//   type: String,

//   match: /.+\@.+\..+/

// }

// 👉 Email format check

// 8️⃣ trim

// name: {

//   type: String,

//   trim: true

// }

// 👉 Extra spaces remove

// 9️⃣ lowercase

// email: {

//   type: String,

//   lowercase: true

// }

// 👉 Auto lowercase

// 🔟 ref (IMPORTANT 🔥)

// userId: {

//   type: mongoose.Schema.Types.ObjectId,

//   ref: "User"

// }

// 👉 Relation banata hai (like foreign key)