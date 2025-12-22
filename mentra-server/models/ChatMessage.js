const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    maxLength: 500
  },
  sender: {
    userId: {
      type: String, // Firebase UID
      required: true
    },
    anonymousName: {
      type: String,
      required: true
    }
  },
  type: {
    type: String,
    enum: ['message', 'join', 'leave', 'system'],
    default: 'message'
  },
  reported: {
    type: Boolean,
    default: false
  },
  isHidden: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Keep only last 200 messages (auto-cleanup old messages)
chatMessageSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 }); // 24 hours

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

module.exports = ChatMessage;
