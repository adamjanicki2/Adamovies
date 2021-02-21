const mongoose = require("mongoose");

const mention = new mongoose.Schema({
  recipient_username: String,
  recipient_username_lower: String,
  recipient_id: String,
  comment_id: String,
  sender_id: String,
  sender_picture: String,
  sender_username: String,
  timestamp: Number,
  review_id: String,
  title: String,
  comment_content: String,
});

module.exports = mongoose.model("mention", mention);
