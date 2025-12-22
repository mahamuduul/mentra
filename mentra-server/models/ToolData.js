const mongoose = require('mongoose');

const toolDataSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  toolType: {
    type: String,
    required: true,
    enum: [
      // Male tools
      'goal-breakdown',
      'burnout-checkin',
      'time-management',
      'cbt-reframing',
      'financial-journal',
      'problem-solving',
      'budget-awareness',
      'trigger-tracker',
      'cooling-timer',
      'anger-cbt',
      'conflict-resolution',
      // Female tools - Harassment Issues
      'harassment-report',
      'safety-plan',
      'counselor-ticket',
      'grounding-exercise',
      // Female tools - Social/Personal Pressure
      'cbt-thought-record',
      'goal-boundary',
      'peer-support',
      'daily-checkin',
      // Female tools - Safety Issues
      'emergency-resources',
      'trusted-contact',
      'risk-assessment',
      'safety-education',
      // Female tools - Mental Stress
      'breathing-meditation',
      'mood-tracker',
      'stress-assessment',
      'exercise-library'
    ],
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
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

toolDataSchema.index({ userId: 1, toolType: 1, createdAt: -1 });

toolDataSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const ToolData = mongoose.model('ToolData', toolDataSchema);

module.exports = ToolData;
