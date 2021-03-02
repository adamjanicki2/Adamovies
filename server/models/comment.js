const mongoose = require("mongoose");

const comment = new mongoose.Schema({
  user_name: String,
  user_id: String,
  user_googleid: String,
  review_id: String,
  title: String,
  content: String,
  picture: String,
  timestamp: Number,
  username: String,
  is_admin: Boolean,
});
module.exports = mongoose.model("comment", comment);
