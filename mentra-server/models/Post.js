const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    maxLength: 1000
  },
  author: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    anonymousName: {
      type: String,
      default: function() {
        const colors = ['Blue', 'Green', 'Purple', 'Pink', 'Orange', 'Teal', 'Coral', 'Lavender'];
        const animals = ['Butterfly', 'Dove', 'Owl', 'Swan', 'Phoenix', 'Robin', 'Sparrow', 'Hummingbird'];
        return `${colors[Math.floor(Math.random() * colors.length)]} ${animals[Math.floor(Math.random() * animals.length)]}`;
      }
    }
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  reported: {
    type: Boolean,
    default: false
  },
  reportCount: {
    type: Number,
    default: 0
  },
  isHidden: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxLength: 200
  },
  content: {
    type: String,
    required: true,
    maxLength: 5000
  },
  category: {
    type: String,
    enum: ['general', 'vent', 'support', 'success', 'anxiety', 'depression', 'relationships', 'work-stress', 'other'],
    default: 'general'
  },
  isVent: {
    type: Boolean,
    default: false
  },
  author: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    anonymousName: {
      type: String,
      default: function() {
        const colors = ['Blue', 'Green', 'Purple', 'Pink', 'Orange', 'Teal', 'Coral', 'Lavender'];
        const animals = ['Butterfly', 'Dove', 'Owl', 'Swan', 'Phoenix', 'Robin', 'Sparrow', 'Hummingbird'];
        return `${colors[Math.floor(Math.random() * colors.length)]} ${animals[Math.floor(Math.random() * animals.length)]}`;
      }
    }
  },
  replies: [replySchema],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  hugs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  reported: {
    type: Boolean,
    default: false
  },
  reportCount: {
    type: Number,
    default: 0
  },
  isHidden: {
    type: Boolean,
    default: false
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    maxLength: 20
  }]
}, {
  timestamps: true
});

// Index for better query performance
postSchema.index({ category: 1, createdAt: -1 });
postSchema.index({ isHidden: 1, isPinned: -1, createdAt: -1 });

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
