const mongoose = require("mongoose");
const announcement = new mongoose.Schema({
    admin_name: String,
    admin_id: String,
    admin_username: String,
    admin_picture: String,
    title: String,
    content: String,
    timestamp: Number,
});
module.exports = mongoose.model("announcement", announcement);
