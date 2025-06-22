const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  username: { type: String, required: true },
  message: { type: String },
  fileUrl: { type: String },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', MessageSchema); 