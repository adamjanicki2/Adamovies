const mongoose = require("mongoose");

const review = new mongoose.Schema({
  admin_name: String,
  admin_id: String,
  admin_googleid: String,
  admin_username: String,
  type: String,
  title: String,
  season: Number, 
  episode: Number,
  release_year: Number,
  rating: Number,
  content: String,
  trailer_link: String,
  timestamp: Number,
  img_url: String,
  director: String,
  runtime: Number, //in minutes
});
module.exports = mongoose.model("review", review);
