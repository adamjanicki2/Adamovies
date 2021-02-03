const mongoose = require("mongoose");

const banned = new mongoose.Schema({
  name: String,
  googleid: String,
});

module.exports = mongoose.model("banneduser", banned);
