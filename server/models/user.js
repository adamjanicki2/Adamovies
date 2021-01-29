const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  googleid: String,
  picture: String,
  admin: Boolean,
});

module.exports = mongoose.model("user", UserSchema);
