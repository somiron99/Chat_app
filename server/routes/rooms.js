const express = require('express');
const router = express.Router();
const Room = require('../models/Room');

// Helper to generate a random room code
function generateRoomCode(length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Create a new room
router.post('/create', async (req, res) => {
  const { name, username } = req.body;
  if (!name || !username) {
    return res.status(400).json({ error: 'Room name and username are required' });
  }
  let code;
  let exists = true;
  while (exists) {
    code = generateRoomCode();
    exists = await Room.findOne({ code });
  }
  const room = new Room({ name, code, members: [username] });
  await room.save();
  res.status(201).json(room);
});

// Join a room by code
router.post('/join', async (req, res) => {
  const { code, username } = req.body;
  if (!code || !username) {
    return res.status(400).json({ error: 'Room code and username are required' });
  }
  const room = await Room.findOne({ code });
  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }
  if (!room.members.includes(username)) {
    room.members.push(username);
    await room.save();
  }
  res.json(room);
});

module.exports = router; 