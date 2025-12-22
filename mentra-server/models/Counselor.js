const mongoose = require('mongoose');

const counselorSchema = new mongoose.Schema({
  counselorId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  personalInfo: {
    name: {
      type: String,
      required: true
    },
    gender: {
      type: String,
      enum: ['Male', 'Female'],
      required: true,
      index: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    phone: String,
    profileImage: String,
    languages: [String],
    dateOfBirth: Date,
  },
  professionalInfo: {
    title: {
      type: String,
      required: true
    },
    licenseNumber: {
      type: String,
      required: true,
      unique: true
    },
    specializations: [String],
    credentials: [String],
    experience: {
      type: Number,
      required: true,
      min: 0
    },
    bio: String,
    education: [{
      degree: String,
      institution: String,
      year: Number
    }],
    certifications: [{
      name: String,
      issuingOrganization: String,
      year: Number
    }]
  },
  availability: {
    status: {
      type: String,
      enum: ['Available', 'Busy', 'Away', 'Offline'],
      default: 'Available'
    },
    schedule: [{
      dayOfWeek: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      },
      timeSlots: [{
        startTime: String,
        endTime: String,
        isBooked: {
          type: Boolean,
          default: false
        }
      }]
    }],
    nextAvailableSlot: Date,
    timezone: {
      type: String,
      default: 'UTC'
    }
  },
  sessionInfo: {
    sessionTypes: [{
      type: String,
      enum: ['Video Call', 'Audio Call', 'Chat', 'In-Person']
    }],
    sessionDuration: {
      type: Number,
      default: 60,
      min: 30
    },
    pricing: {
      standardRate: Number,
      currency: {
        type: String,
        default: 'USD'
      },
      acceptsInsurance: Boolean,
      insuranceProviders: [String]
    }
  },
  statistics: {
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    totalSessions: {
      type: Number,
      default: 0
    },
    completedSessions: {
      type: Number,
      default: 0
    },
    cancelledSessions: {
      type: Number,
      default: 0
    },
    totalReviews: {
      type: Number,
      default: 0
    },
    averageResponseTime: Number,
    patientSatisfaction: {
      type: Number,
      min: 0,
      max: 100
    }
  },
  assignedPatients: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    assignedDate: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Completed'],
      default: 'Active'
    }
  }],
  reviews: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    },
    isVerified: {
      type: Boolean,
      default: false
    }
  }],
  settings: {
    maxPatientsPerDay: {
      type: Number,
      default: 8
    },
    autoAcceptBookings: {
      type: Boolean,
      default: true
    },
    requiresApproval: {
      type: Boolean,
      default: false
    },
    allowsNewPatients: {
      type: Boolean,
      default: true
    }
  },
  account: {
    isActive: {
      type: Boolean,
      default: true
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    verificationDate: Date,
    backgroundCheckDate: Date,
    lastActiveAt: Date,
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
counselorSchema.index({ 'personalInfo.gender': 1, 'availability.status': 1 });
counselorSchema.index({ 'professionalInfo.specializations': 1 });
counselorSchema.index({ 'statistics.rating': -1 });
counselorSchema.index({ 'account.isActive': 1, 'account.isVerified': 1 });

// Method to check if counselor can accept new patients
counselorSchema.methods.canAcceptNewPatient = function() {
  return this.account.isActive && 
         this.account.isVerified && 
         this.settings.allowsNewPatients &&
         this.assignedPatients.filter(p => p.status === 'Active').length < this.settings.maxPatientsPerDay * 5;
};

// Method to get available slots for a specific date
counselorSchema.methods.getAvailableSlots = function(date) {
  const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()];
  const daySchedule = this.availability.schedule.find(s => s.dayOfWeek === dayOfWeek);
  
  if (!daySchedule) return [];
  
  return daySchedule.timeSlots.filter(slot => !slot.isBooked);
};

// Static method to find counselors by gender and specialization
counselorSchema.statics.findByGenderAndSpecialization = function(gender, specialization) {
  const query = {
    'personalInfo.gender': gender,
    'account.isActive': true,
    'account.isVerified': true
  };
  
  if (specialization) {
    query['professionalInfo.specializations'] = specialization;
  }
  
  return this.find(query)
    .sort({ 'statistics.rating': -1, 'statistics.totalSessions': -1 })
    .select('-reviews -assignedPatients');
};

// Update rating after new review
counselorSchema.methods.updateRating = function() {
  if (this.reviews.length === 0) {
    this.statistics.rating = 0;
    this.statistics.totalReviews = 0;
    return;
  }
  
  const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
  this.statistics.rating = parseFloat((totalRating / this.reviews.length).toFixed(1));
  this.statistics.totalReviews = this.reviews.length;
};

// Pre-save hook to update timestamps
counselorSchema.pre('save', function(next) {
  this.account.updatedAt = new Date();
  next();
});

const Counselor = mongoose.model('Counselor', counselorSchema);

module.exports = Counselor;
