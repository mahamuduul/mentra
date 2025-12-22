const mongoose = require('mongoose');

const sessionBookingSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  expertId: {
    type: Number,
    required: true,
  },
  expertName: {
    type: String,
    required: true,
  },
  expertSpecialization: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  concernType: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    maxlength: 500,
  },
  urgency: {
    type: String,
    enum: ['normal', 'moderate', 'urgent'],
    default: 'normal',
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending',
  },
  bookingNumber: {
    type: String,
    unique: true,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update timestamp on save
sessionBookingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create indexes for efficient querying
sessionBookingSchema.index({ userId: 1, createdAt: -1 });
sessionBookingSchema.index({ expertId: 1, date: 1, time: 1 });
sessionBookingSchema.index({ bookingNumber: 1 });

const SessionBooking = mongoose.model('SessionBooking', sessionBookingSchema);

module.exports = SessionBooking;
