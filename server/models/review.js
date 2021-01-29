const mongoose = require("mongoose");

const review = new mongoose.Schema({
  admin_name: String,
  admin_id: String,
  admin_googleid: String,
  type: String,
  title: String,
  release_year: Number,
  rating: Number,
  content: String,
  trailer_link: String,
  timestamp: Number,
  img_url: String,
  director: String,
});
module.exports = mongoose.model("review", review);
