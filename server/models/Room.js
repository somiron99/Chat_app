const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  members: [{ type: String }], // store usernames or user IDs
});

module.exports = mongoose.model('Room', RoomSchema); 