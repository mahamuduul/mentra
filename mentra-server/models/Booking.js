const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  counselorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Counselor',
    required: true,
    index: true
  },
  sessionDetails: {
    sessionType: {
      type: String,
      enum: ['Video Call', 'Audio Call', 'Chat', 'In-Person'],
      required: true
    },
    scheduledDate: {
      type: Date,
      required: true,
      index: true
    },
    duration: {
      type: Number,
      required: true,
      default: 60
    },
    topic: String,
    specialNeeds: String,
    isFirstSession: {
      type: Boolean,
      default: false
    }
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled', 'No Show'],
    default: 'Pending',
    index: true
  },
  genderMatch: {
    userGender: {
      type: String,
      enum: ['Male', 'Female'],
      required: true
    },
    counselorGender: {
      type: String,
      enum: ['Male', 'Female'],
      required: true
    },
    isMatched: {
      type: Boolean,
      required: true,
      default: true
    }
  },
  payment: {
    amount: Number,
    currency: {
      type: String,
      default: 'USD'
    },
    status: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
      default: 'Pending'
    },
    paymentMethod: String,
    transactionId: String,
    paidAt: Date
  },
  sessionNotes: {
    counselorNotes: {
      type: String,
      select: false
    },
    userFeedback: String,
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    issues: [String]
  },
  communication: {
    confirmationSent: {
      type: Boolean,
      default: false
    },
    reminderSent: {
      type: Boolean,
      default: false
    },
    meetingLink: String,
    chatRoomId: String
  },
  cancellation: {
    cancelledBy: {
      type: String,
      enum: ['User', 'Counselor', 'System']
    },
    cancelledAt: Date,
    reason: String,
    refundIssued: {
      type: Boolean,
      default: false
    }
  },
  timestamps: {
    createdAt: {
      type: Date,
      default: Date.now,
      index: true
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
    confirmedAt: Date,
    startedAt: Date,
    completedAt: Date
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
bookingSchema.index({ userId: 1, status: 1 });
bookingSchema.index({ counselorId: 1, 'sessionDetails.scheduledDate': 1 });
bookingSchema.index({ 'genderMatch.isMatched': 1 });
bookingSchema.index({ 'payment.status': 1 });

// Validate gender matching before save
bookingSchema.pre('save', function(next) {
  if (this.genderMatch.userGender !== this.genderMatch.counselorGender) {
    this.genderMatch.isMatched = false;
    const error = new Error('Gender mismatch: User and counselor genders must match');
    return next(error);
  }
  next();
});

// Static method to find upcoming bookings for a user
bookingSchema.statics.findUpcomingByUser = function(userId) {
  const now = new Date();
  return this.find({
    userId,
    'sessionDetails.scheduledDate': { $gte: now },
    status: { $in: ['Pending', 'Confirmed'] }
  })
  .populate('counselorId', 'personalInfo professionalInfo statistics')
  .sort({ 'sessionDetails.scheduledDate': 1 });
};

// Static method to find bookings by counselor and date range
bookingSchema.statics.findByCounselorAndDateRange = function(counselorId, startDate, endDate) {
  return this.find({
    counselorId,
    'sessionDetails.scheduledDate': {
      $gte: startDate,
      $lte: endDate
    }
  })
  .populate('userId', 'name email gender')
  .sort({ 'sessionDetails.scheduledDate': 1 });
};

// Method to check if booking can be cancelled
bookingSchema.methods.canBeCancelled = function() {
  const now = new Date();
  const scheduledDate = new Date(this.sessionDetails.scheduledDate);
  const hoursDifference = (scheduledDate - now) / (1000 * 60 * 60);
  
  // Can cancel if more than 24 hours before scheduled time
  return hoursDifference > 24 && this.status === 'Confirmed';
};

// Method to cancel booking
bookingSchema.methods.cancelBooking = function(cancelledBy, reason) {
  this.status = 'Cancelled';
  this.cancellation = {
    cancelledBy,
    cancelledAt: new Date(),
    reason,
    refundIssued: this.canBeCancelled()
  };
  
  if (this.cancellation.refundIssued && this.payment.status === 'Paid') {
    this.payment.status = 'Refunded';
  }
};

// Method to complete booking
bookingSchema.methods.completeBooking = function(rating, feedback) {
  this.status = 'Completed';
  this.timestamps.completedAt = new Date();
  
  if (rating) {
    this.sessionNotes.rating = rating;
  }
  
  if (feedback) {
    this.sessionNotes.userFeedback = feedback;
  }
};

// Virtual for time until session
bookingSchema.virtual('timeUntilSession').get(function() {
  if (!this.sessionDetails.scheduledDate) return null;
  
  const now = new Date();
  const scheduled = new Date(this.sessionDetails.scheduledDate);
  const diff = scheduled - now;
  
  if (diff < 0) return 'Past';
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours < 1) return `${minutes} minutes`;
  if (hours < 24) return `${hours} hours`;
  
  const days = Math.floor(hours / 24);
  return `${days} days`;
});

// Ensure virtuals are included in JSON
bookingSchema.set('toJSON', { virtuals: true });
bookingSchema.set('toObject', { virtuals: true });

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
