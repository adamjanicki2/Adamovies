const mongoose = require("mongoose");

const review = new mongoose.Schema({
  admin_name: String,
  admin_id: String,
  admin_googleid: String,
  admin_username: String,
  admin_picture: String,
  type: String,
  title: String,
  season: Number, 
  episode: Number,
  release_year: Number,
  rating: Number,
  content: String,
  trailer_link: String,
  img_url: String,
  director: String,
  runtime: Number, //in minutes
  mpa_rating: String,
  genre: String,
});
module.exports = mongoose.model("draft", review);
