const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minLength: 6},
  googoleID: { type: String },
  date: { type: Date, default: Date.now },
  thumbnail: { type: String },

  //local login
  email: { type: String },
  password: { type: String, maxLength: 1024}, //因為一陣要set 佢做hash，所以一定要夠長
});

const User = mongoose.model("User", userSchema);
module.exports = User;
