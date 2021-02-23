const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  googleid: String,
  picture: String,
  admin: Boolean,
  root: Boolean,
  currently_watching: String,
  favorite_movie: String,
  favorite_show: String,
  last_login: Number,
  username: String,
  username_lower: String,
  bio: String,
  locked: Boolean,
  can_comment: Boolean,
  email: String,
  email_on: Boolean,
});

module.exports = mongoose.model("user", UserSchema);
