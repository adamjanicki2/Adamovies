const mongoose = require("mongoose");

const email = new mongoose.Schema({
  last_sent: Number,
});

module.exports = mongoose.model("email", email);
