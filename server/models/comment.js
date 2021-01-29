const mongoose = require("mongoose");

const comment = new mongoose.Schema({
  user_name: String,
  user_id: String,
  user_googleid: String,
  review_id: String,
  content: String,
});
module.exports = mongoose.model("comment", comment);
