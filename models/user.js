const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  discordId: String,
  username: String,
  ephemeralMode: Boolean,
  color: String,
  rank: String,
  chatting: {
    exp: Number,
    expTowardsNextLevel: Number,
    lastMessageTime: Number,
    level: Number,
    messageCount: Number,
  },
  bankAccount: {
    balance: Number,
  },
});

module.exports = mongoose.model('User', userSchema);