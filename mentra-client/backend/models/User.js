import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firebaseUID: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female'],
    required: true
  },
  avatar: {
    type: String,
    default: null
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  profileCompleted: {
    type: Boolean,
    default: false
  },
  needsSurvey: {
    type: Boolean,
    default: true
  },
  surveyData: {
    age: String,
    gender: String,
    currentMentalState: String,
    stressLevel: Number,
    anxietyLevel: Number,
    sleepQuality: String,
    exerciseFrequency: String,
    supportSystem: String,
    mentalHealthGoals: [String],
    interests: [String],
    triggers: [String],
    copingMechanisms: [String],
    preferredActivities: [String],
    completedAt: {
      type: Date,
      default: Date.now
    }
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system'
    },
    language: {
      type: String,
      default: 'en'
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      reminders: {
        type: Boolean,
        default: true
      },
      updates: {
        type: Boolean,
        default: true
      }
    }
  },
  mentalHealthProfile: {
    primaryGoals: [String],
    currentChallenges: [String],
    preferredTherapyTypes: [String],
    riskLevel: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'low'
    },
    lastAssessment: Date
  },
  activityData: {
    journalEntries: [{
      title: String,
      content: String,
      mood: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    moodTracking: [{
      mood: String,
      intensity: Number,
      notes: String,
      date: {
        type: Date,
        default: Date.now
      }
    }],
    gameProgress: {
      memoryGame: {
        highScore: {
          type: Number,
          default: 0
        },
        gamesPlayed: {
          type: Number,
          default: 0
        }
      },
      breathingExercises: {
        sessionsCompleted: {
          type: Number,
          default: 0
        },
        totalMinutes: {
          type: Number,
          default: 0
        }
      }
    }
  },
  lastLoginAt: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'mentra-users'
});

// Indexes for better query performance
userSchema.index({ firebaseUID: 1 });
userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ lastLoginAt: -1 });

// Pre-save middleware
userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Methods
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  // Remove sensitive data if needed
  return userObject;
};

userSchema.methods.updateLastLogin = function() {
  this.lastLoginAt = new Date();
  return this.save();
};

userSchema.methods.completeSurvey = function(surveyData) {
  this.surveyData = {
    ...surveyData,
    completedAt: new Date()
  };
  this.profileCompleted = true;
  this.needsSurvey = false;
  return this.save();
};

// Static methods
userSchema.statics.findByFirebaseUID = function(uid) {
  return this.findOne({ firebaseUID: uid });
};

userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

const User = mongoose.model('User', userSchema);

export default User;