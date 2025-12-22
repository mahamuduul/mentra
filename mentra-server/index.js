const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const admin = require('firebase-admin');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

// Initialize Firebase Admin (for production, use service account key)
// For development, we'll use a simplified approach
try {
  admin.initializeApp({
    projectId: 'mentra-a0815', // Your Firebase project ID
  });
  console.log('🔥 Firebase Admin initialized successfully');
} catch (error) {
  console.warn('⚠️  Firebase Admin initialization failed:', error.message);
  console.log('💡 Continuing without Firebase Admin - token verification will be skipped');
}

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: [
      process.env.CLIENT_URL || 'http://localhost:5173',
      'http://localhost:5174'
    ],
    methods: ['GET', 'POST']
  }
});
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
});
app.use('/api/', limiter);

// CORS Configuration
app.use(cors({
  origin: [
    process.env.CLIENT_URL || 'http://localhost:5173',
    'http://localhost:5174', // Alternative port
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body Parser Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
  console.log('✅ Connected to MongoDB successfully');
  console.log(`📊 Database: ${process.env.DB_NAME}`);
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error.message);
  console.log('⚠️  Server will continue running without database connection');
  console.log('💡 Please check your MongoDB credentials in .env file');
  // Don't exit in development mode
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
});

// Mentra User Schema (stored in mentra-users collection)
const mentraUserSchema = new mongoose.Schema({
  // Firebase Authentication
  firebaseUID: {
    type: String,
    required: [true, 'Firebase UID is required'],
    unique: true,
  },
  
  // Basic Information
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
  },
  avatar: {
    type: String,
    default: '',
  },
  
  // Authentication Info
  loginMethod: {
    type: String,
    enum: ['email', 'google'],
    default: 'email',
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  lastLogin: {
    type: Date,
    default: Date.now,
  },
  
  // Profile Completion
  needsSurvey: {
    type: Boolean,
    default: true,
  },
  profileCompleted: {
    type: Boolean,
    default: false,
  },
  
  // Survey/Profile Data
  profile: {
    age: { type: Number, min: 13, max: 120 },
    gender: { type: String, enum: ['male', 'female', 'other', 'prefer-not-to-say'] },
    mentalHealthGoals: [{ type: String }],
    currentMentalState: { type: String, enum: ['excellent', 'good', 'fair', 'poor', 'very-poor'] },
    stressLevel: { type: Number, min: 1, max: 10 },
    anxietyLevel: { type: Number, min: 1, max: 10 },
    sleepQuality: { type: String, enum: ['excellent', 'good', 'fair', 'poor', 'very-poor'] },
    exerciseFrequency: { type: String, enum: ['daily', 'weekly', 'monthly', 'rarely', 'never'] },
    supportSystem: { type: String, enum: ['strong', 'moderate', 'weak', 'none'] },
    previousTherapy: { type: Boolean, default: false },
    medications: { type: Boolean, default: false },
    personalityType: { type: String },
    interests: [{ type: String }],
    triggers: [{ type: String }],
    copingMechanisms: [{ type: String }],
    preferredActivities: [{ type: String }],
  },
  
  // Account Status
  accountStatus: {
    type: String,
    enum: ['active', 'suspended', 'deleted'],
    default: 'active',
  },
  
  // Privacy Settings
  privacySettings: {
    shareProgress: { type: Boolean, default: false },
    shareStories: { type: Boolean, default: false },
    matchWithOthers: { type: Boolean, default: false },
  },
}, {
  timestamps: true,
  collection: 'mentra_users', // Explicitly set collection name
});

// Note: Firebase authentication handles password hashing, so we don't need password middleware for this schema

// Generate JWT token method (keeping for potential future use)
mentraUserSchema.methods.generateAuthToken = function() {
  const payload = {
    userId: this._id,
    email: this.email,
    name: this.name,
  };
  
  return jwt.sign(payload, process.env.JWT_SECRET || 'fallback-secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

const MentraUser = mongoose.model('MentraUser', mentraUserSchema);

// Mood Entry Schema
const moodEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MentraUser',
    required: true,
  },
  mood: {
    type: String,
    required: [true, 'Mood is required'],
    enum: ['very-sad', 'sad', 'neutral', 'happy', 'very-happy'],
  },
  energy: {
    type: Number,
    required: [true, 'Energy level is required'],
    min: [1, 'Energy must be between 1 and 5'],
    max: [5, 'Energy must be between 1 and 5'],
  },
  stress: {
    type: Number,
    required: [true, 'Stress level is required'],
    min: [1, 'Stress must be between 1 and 5'],
    max: [5, 'Stress must be between 1 and 5'],
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters'],
    trim: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

const MoodEntry = mongoose.model('MoodEntry', moodEntrySchema);

// Journal Entry Schema
const journalEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MentraUser',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters'],
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    trim: true,
    maxlength: [5000, 'Content cannot exceed 5000 characters'],
  },
  mood: {
    type: String,
    enum: ['very-sad', 'sad', 'neutral', 'happy', 'very-happy'],
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot exceed 30 characters'],
  }],
  isPrivate: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

const JournalEntry = mongoose.model('JournalEntry', journalEntrySchema);

// Quiz Result Schema
const quizResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MentraUser',
    required: true,
  },
  quizType: {
    type: String,
    required: [true, 'Quiz type is required'],
    enum: ['mental-health', 'anxiety', 'depression', 'stress'],
    default: 'mental-health',
  },
  answers: [{
    questionId: {
      type: Number,
      required: true,
    },  
    answer: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
  }],
  totalScore: {
    type: Number,
    required: [true, 'Total score is required'],
  },
  maxScore: {
    type: Number,
    required: [true, 'Max score is required'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['excellent', 'good', 'fair', 'concerning', 'needs-attention'],
  },
  recommendations: [{
    type: String,
    trim: true,
  }],
}, {
  timestamps: true,
});

const QuizResult = mongoose.model('QuizResult', quizResultSchema);

// Database Connection Check Middleware
const checkDatabaseConnection = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: 'Database connection not available',
      error: 'Please check MongoDB connection',
    });
  }
  next();
};

// Firebase Authentication Middleware
const authenticateFirebaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required',
      });
    }

    let decodedToken;
    try {
      // Verify Firebase token
      decodedToken = await admin.auth().verifyIdToken(token);
    } catch (firebaseError) {
      console.warn('Firebase token verification failed:', firebaseError.message);
      // Fallback: Skip verification in development
      if (process.env.NODE_ENV === 'development') {
        console.log('⚠️  Development mode: Skipping Firebase token verification');
        // Extract user info from token payload (unsafe - only for development)
        try {
          const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
          decodedToken = {
            uid: payload.uid || 'dev-user',
            email: payload.email || 'dev@example.com',
            name: payload.name || 'Dev User',
          };
        } catch (e) {
          return res.status(401).json({
            success: false,
            message: 'Invalid token format',
          });
        }
      } else {
        throw firebaseError;
      }
    }

    // Find user in database
    const user = await MentraUser.findOne({ firebaseUID: decodedToken.uid });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found in database',
      });
    }

    if (user.accountStatus !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'Account is not active',
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    req.user = {
      uid: decodedToken.uid,
      firebaseUID: decodedToken.uid,
      email: user.email,
      name: user.name,
      _id: user._id,
      fullUser: user
    };
    req.firebaseUser = decodedToken;
    next();
  } catch (error) {
    console.error('Firebase auth middleware error:', error);
    res.status(401).json({
      success: false,
      message: 'Authentication failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
  }
  next();
};

// API Routes

// Firebase User Sync - CREATE USER ON LOGIN
app.post('/api/auth/firebase-sync', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required',
      });
    }

    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(token);
    } catch (firebaseError) {
      // Development fallback
      if (process.env.NODE_ENV === 'development') {
        try {
          const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
          decodedToken = {
            uid: payload.uid || `dev-${Date.now()}`,
            email: payload.email || req.body.email,
            email_verified: payload.email_verified || false,
          };
        } catch (e) {
          return res.status(401).json({
            success: false,
            message: 'Invalid token format',
          });
        }
      } else {
        throw firebaseError;
      }
    }

    const { uid, email, name, avatar, emailVerified } = req.body;
    const firebaseUID = decodedToken.uid;

    console.log('🔐 Firebase Sync - Creating/Updating user:', { firebaseUID, email, name });

    // Check if user already exists
    let user = await MentraUser.findOne({ firebaseUID });
    
    if (user) {
      // Update existing user
      console.log('✅ User exists - Updating...');
      user.lastLogin = new Date();
      user.avatar = avatar || user.avatar;
      user.name = name || user.name;
      user.isEmailVerified = emailVerified || user.isEmailVerified;
      await user.save();
      console.log('✅ User updated successfully');
    } else {
      // Create new user - THIS HAPPENS ON FIRST LOGIN
      console.log('🆕 Creating new user in database...');
      user = new MentraUser({
        firebaseUID,
        email: email || decodedToken.email,
        name: name || email.split('@')[0],
        avatar: avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name || email.split('@')[0])}&background=6366f1&color=fff&size=200`,
        loginMethod: avatar && avatar.includes('googleusercontent') ? 'google' : 'email',
        isEmailVerified: emailVerified || decodedToken.email_verified || false,
        needsSurvey: true,
        profileCompleted: false,
      });
      
      await user.save();
      console.log('✅ New user created successfully in mentra_db.mentra_users');
    }

    res.json({
      success: true,
      message: user.isNew ? 'User created successfully' : 'User synced successfully',
      data: {
        user: {
          id: user._id,
          firebaseUID: user.firebaseUID,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          loginMethod: user.loginMethod,
          isEmailVerified: user.isEmailVerified,
          needsSurvey: user.needsSurvey,
          profileCompleted: user.profileCompleted,
          profile: user.profile || {},
          gender: user.gender,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error) {
    console.error('❌ Firebase sync error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to sync user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// Health Check
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const dbStatusText = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  res.json({
    success: true,  
    message: 'Mentra API is running successfully!',
    timestamp: new Date().toISOString(),
    version: process.env.API_VERSION || 'v1',
    database: {
      status: dbStatusText[dbStatus] || 'unknown',
      connected: dbStatus === 1,
    },
    environment: process.env.NODE_ENV || 'development',
  });
});

// TEST API - Insert Fake Data
app.post('/api/test/insert-fake-data', async (req, res) => {
  try {
    console.log('🧪 TEST: Creating fake users...');
    
    const fakeUsers = [
      {
        firebaseUID: 'test-uid-001',
        name: 'John Doe',
        email: 'john.doe@test.com',
        avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=6366f1&color=fff&size=200',
        loginMethod: 'email',
        isEmailVerified: true,
        needsSurvey: false,
        profileCompleted: true,
        profile: {
          age: 25,
          gender: 'male',
          currentMentalState: 'good',
          stressLevel: 6,
          anxietyLevel: 5,
          sleepQuality: 'fair',
          exerciseFrequency: 'weekly',
          supportSystem: 'moderate',
          mentalHealthGoals: ['Reduce anxiety', 'Better sleep', 'Stress management'],
          interests: ['Reading', 'Music', 'Sports'],
          triggers: ['Work stress', 'Academic pressure'],
          copingMechanisms: ['Exercise', 'Deep breathing', 'Meditation'],
          preferredActivities: ['Guided meditation', 'Mood tracking', 'Journaling prompts'],
        },
        accountStatus: 'active',
        privacySettings: {
          shareProgress: true,
          shareStories: false,
          matchWithOthers: true,
        },
      },
      {
        firebaseUID: 'test-uid-002',
        name: 'Jane Smith',
        email: 'jane.smith@test.com',
        avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=10b981&color=fff&size=200',
        loginMethod: 'google',
        isEmailVerified: true,
        needsSurvey: false,
        profileCompleted: true,
        profile: {
          age: 28,
          gender: 'female',
          currentMentalState: 'excellent',
          stressLevel: 3,
          anxietyLevel: 2,
          sleepQuality: 'good',
          exerciseFrequency: 'daily',
          supportSystem: 'strong',
          mentalHealthGoals: ['Build confidence', 'Improve relationships', 'Increase mindfulness'],
          interests: ['Art & Creativity', 'Nature & Outdoors', 'Meditation'],
          triggers: ['Social situations', 'Change/uncertainty'],
          copingMechanisms: ['Talking to friends', 'Journaling', 'Time in nature'],
          preferredActivities: ['Breathing exercises', 'Mindfulness exercises', 'Sleep stories'],
        },
        accountStatus: 'active',
        privacySettings: {
          shareProgress: true,
          shareStories: true,
          matchWithOthers: true,
        },
      },
      {
        firebaseUID: 'test-uid-003',
        name: 'Test User',
        email: 'test.user@test.com',
        avatar: 'https://ui-avatars.com/api/?name=Test+User&background=f59e0b&color=fff&size=200',
        loginMethod: 'email',
        isEmailVerified: false,
        needsSurvey: true,
        profileCompleted: false,
        profile: {},
        accountStatus: 'active',
        privacySettings: {
          shareProgress: false,
          shareStories: false,
          matchWithOthers: false,
        },
      },
    ];

    // Clear existing test users
    await MentraUser.deleteMany({ firebaseUID: { $in: ['test-uid-001', 'test-uid-002', 'test-uid-003'] } });
    console.log('🗑️  Cleared existing test users');

    // Insert fake users
    const insertedUsers = await MentraUser.insertMany(fakeUsers);
    console.log(`✅ Inserted ${insertedUsers.length} fake users into mentra_db.mentra_users`);

    // Also create some fake mood entries
    const fakeMoodEntries = [];
    for (let i = 0; i < 10; i++) {
      fakeMoodEntries.push({
        userId: insertedUsers[0]._id,
        mood: ['very-sad', 'sad', 'neutral', 'happy', 'very-happy'][Math.floor(Math.random() * 5)],
        energy: Math.floor(Math.random() * 5) + 1,
        stress: Math.floor(Math.random() * 5) + 1,
        notes: `Test mood entry ${i + 1}`,
        date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date in last 30 days
      });
    }

    const insertedMoodEntries = await MoodEntry.insertMany(fakeMoodEntries);
    console.log(`✅ Inserted ${insertedMoodEntries.length} fake mood entries`);

    // Create fake journal entries
    const fakeJournalEntries = [
      {
        userId: insertedUsers[0]._id,
        title: 'My First Journal Entry',
        content: 'Today was a good day. I practiced meditation and felt more calm.',
        mood: 'happy',
        tags: ['meditation', 'calm', 'progress'],
        isPrivate: true,
      },
      {
        userId: insertedUsers[0]._id,
        title: 'Feeling Stressed',
        content: 'Work has been overwhelming lately. Need to find better coping mechanisms.',
        mood: 'sad',
        tags: ['work', 'stress', 'overwhelmed'],
        isPrivate: true,
      },
    ];

    const insertedJournalEntries = await JournalEntry.insertMany(fakeJournalEntries);
    console.log(`✅ Inserted ${insertedJournalEntries.length} fake journal entries`);

    res.json({
      success: true,
      message: 'Fake data inserted successfully!',
      data: {
        users: insertedUsers.length,
        moodEntries: insertedMoodEntries.length,
        journalEntries: insertedJournalEntries.length,
        userIds: insertedUsers.map(u => u._id),
      },
    });
  } catch (error) {
    console.error('❌ Test data insertion error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to insert fake data',
      error: error.message,
    });
  }
});

// TEST API - Get All Data
app.get('/api/test/get-all-data', async (req, res) => {
  try {
    const users = await MentraUser.find().sort({ createdAt: -1 });
    const moodEntries = await MoodEntry.find().sort({ date: -1 }).limit(20);
    const journalEntries = await JournalEntry.find().sort({ createdAt: -1 }).limit(20);
    const quizResults = await QuizResult.find().sort({ createdAt: -1 }).limit(20);

    res.json({
      success: true,
      data: {
        users,
        moodEntries,
        journalEntries,
        quizResults,
        counts: {
          totalUsers: users.length,
          totalMoodEntries: await MoodEntry.countDocuments(),
          totalJournalEntries: await JournalEntry.countDocuments(),
          totalQuizResults: await QuizResult.countDocuments(),
        },
      },
    });
  } catch (error) {
    console.error('❌ Get data error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get data',
      error: error.message,
    });
  }
});

// TEST API - Clear All Data
app.delete('/api/test/clear-all-data', async (req, res) => {
  try {
    console.log('🗑️  Clearing all data from database...');
    
    await MentraUser.deleteMany({});
    await MoodEntry.deleteMany({});
    await JournalEntry.deleteMany({});
    await QuizResult.deleteMany({});
    
    console.log('✅ All data cleared successfully');

    res.json({
      success: true,
      message: 'All data cleared successfully!',
    });
  } catch (error) {
    console.error('❌ Clear data error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear data',
      error: error.message,
    });
  }
});

// User Registration
app.post('/api/auth/register',
  checkDatabaseConnection,
  [
    body('name')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters'),
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please enter a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain uppercase, lowercase and number'),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { name, email, password } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'User with this email already exists',
        });
      }

      // Generate avatar URL
      const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=10b981&color=fff&size=200`;

      // Create new user
      const user = new User({
        name,
        email,
        password,
        avatar,
        loginMethod: 'email',
      });

      await user.save();

      // Generate token
      const token = user.generateAuthToken();

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            loginMethod: user.loginMethod,
            createdAt: user.createdAt,
          },
          token,
        },
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        message: 'Registration failed',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }
);

// User Login
app.post('/api/auth/login',
  checkDatabaseConnection,
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please enter a valid email'),
    body('password')
      .notEmpty()
      .withMessage('Password is required'),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
      }

      // Check account status
      if (user.accountStatus !== 'active') {
        return res.status(403).json({
          success: false,
          message: 'Account is not active',
        });
      }

      // Verify password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
      }

      // Generate token
      const token = user.generateAuthToken();

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            loginMethod: user.loginMethod,
            lastLogin: user.lastLogin,
          },
          token,
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Login failed',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }
);

// Get User Profile
app.get('/api/auth/profile', authenticateFirebaseToken, async (req, res) => {
  try {
    const user = req.user;
    
    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          firebaseUID: user.firebaseUID,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          loginMethod: user.loginMethod,
          isEmailVerified: user.isEmailVerified,
          needsSurvey: user.needsSurvey,
          profileCompleted: user.profileCompleted,
          profile: user.profile,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
    });
  }
});

// Submit User Survey - UPDATE USER WITH SURVEY DATA
app.post('/api/user/survey',
  authenticateFirebaseToken,
  [
    body('age').optional().isInt({ min: 13, max: 120 }).withMessage('Age must be between 13 and 120'),
    body('gender').optional().isIn(['male', 'female', 'other', 'prefer-not-to-say']).withMessage('Invalid gender'),
    body('currentMentalState').optional().isIn(['excellent', 'good', 'fair', 'poor', 'very-poor']).withMessage('Invalid mental state'),
    body('stressLevel').optional().isInt({ min: 1, max: 10 }).withMessage('Stress level must be between 1 and 10'),
    body('anxietyLevel').optional().isInt({ min: 1, max: 10 }).withMessage('Anxiety level must be between 1 and 10'),
    body('sleepQuality').optional().isIn(['excellent', 'good', 'fair', 'poor', 'very-poor']).withMessage('Invalid sleep quality'),
    body('exerciseFrequency').optional().isIn(['daily', 'weekly', 'monthly', 'rarely', 'never']).withMessage('Invalid exercise frequency'),
    body('supportSystem').optional().isIn(['strong', 'moderate', 'weak', 'none']).withMessage('Invalid support system'),
    body('mentalHealthGoals').optional().isArray().withMessage('Mental health goals must be an array'),
    body('mentalHealthProblems').optional().isArray().withMessage('Mental health problems must be an array'),
    body('interests').optional().isArray().withMessage('Interests must be an array'),
    body('triggers').optional().isArray().withMessage('Triggers must be an array'),
    body('copingMechanisms').optional().isArray().withMessage('Coping mechanisms must be an array'),
    body('preferredActivities').optional().isArray().withMessage('Preferred activities must be an array'),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      // Get the full Mongoose user document
      const user = req.user.fullUser || req.user;
      const surveyData = req.body;

      console.log('📝 Updating user profile with survey data:', {
        userId: user._id,
        surveyData
      });

      // Update user profile with survey data
      user.profile = {
        ...user.profile,
        ...surveyData,
      };
      
      user.needsSurvey = false;
      user.profileCompleted = true;
      
      await user.save();

      console.log('✅ User profile updated successfully in mentra_db.mentra_users');

      res.json({
        success: true,
        message: 'Survey completed successfully',
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            needsSurvey: user.needsSurvey,
            profileCompleted: user.profileCompleted,
            profile: user.profile,
          },
        },
      });
    } catch (error) {
      console.error('❌ Survey submission error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to submit survey',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }
);

// Update User Gender
app.put('/api/user/update-gender',
  authenticateFirebaseToken,
  [
    body('gender').isIn(['Male', 'Female']).withMessage('Gender must be either Male or Female'),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      // Get the full Mongoose user document
      const user = req.user.fullUser || req.user;
      const { gender } = req.body;

      console.log('🔄 Updating user gender:', {
        userId: user._id,
        email: user.email,
        newGender: gender
      });

      // Update user gender
      user.gender = gender;
      user.profileCompleted = true;
      
      await user.save();

      console.log('✅ User gender updated successfully');

      res.json({
        success: true,
        message: 'Gender updated successfully',
        data: {
          user: {
            id: user._id,
            firebaseUID: user.firebaseUID,
            name: user.name,
            email: user.email,
            gender: user.gender,
            avatar: user.avatar,
            isEmailVerified: user.isEmailVerified,
            needsSurvey: user.needsSurvey,
            profileCompleted: user.profileCompleted,
            lastLogin: user.lastLogin,
            createdAt: user.createdAt,
          },
        },
      });
    } catch (error) {
      console.error('❌ Gender update error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update gender',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }
);

// Mood Tracking APIs

// Create Mood Entry
app.post('/api/mood',
  authenticateFirebaseToken,
  [
    body('mood')
      .isIn(['very-sad', 'sad', 'neutral', 'happy', 'very-happy'])
      .withMessage('Invalid mood value'),
    body('energy')
      .isInt({ min: 1, max: 5 })
      .withMessage('Energy must be between 1 and 5'),
    body('stress')
      .isInt({ min: 1, max: 5 })
      .withMessage('Stress must be between 1 and 5'),
    body('notes')
      .optional()
      .isLength({ max: 500 })
      .withMessage('Notes cannot exceed 500 characters'),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { mood, energy, stress, notes } = req.body;

      const moodEntry = new MoodEntry({
        userId: req.user._id,
        mood,
        energy,
        stress,
        notes: notes || '',
      });

      await moodEntry.save();

      res.status(201).json({
        success: true,
        message: 'Mood entry created successfully',
        data: { moodEntry },
      });
    } catch (error) {
      console.error('Mood entry creation error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create mood entry',
      });
    }
  }
);

// Get Mood Entries
app.get('/api/mood', authenticateFirebaseToken, async (req, res) => {
  try {
    const { page = 1, limit = 30, startDate, endDate } = req.query;
    
    const query = { userId: req.user._id };
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const moodEntries = await MoodEntry.find(query)
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await MoodEntry.countDocuments(query);

    res.json({
      success: true,
      data: {
        moodEntries,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalEntries: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error('Mood entries fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch mood entries',
    });
  }
});

// Journal APIs

// Create Journal Entry
app.post('/api/journal',
  authenticateFirebaseToken,
  [
    body('title')
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Title must be between 1 and 100 characters'),
    body('content')
      .trim()
      .isLength({ min: 1, max: 5000 })
      .withMessage('Content must be between 1 and 5000 characters'),
    body('mood')
      .optional()
      .isIn(['very-sad', 'sad', 'neutral', 'happy', 'very-happy'])
      .withMessage('Invalid mood value'),
    body('tags')
      .optional()
      .isArray()
      .withMessage('Tags must be an array'),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { title, content, mood, tags, isPrivate } = req.body;

      const journalEntry = new JournalEntry({
        userId: req.user._id,
        title,
        content,
        mood,
        tags: tags || [],
        isPrivate: isPrivate !== false, // Default to true
      });

      await journalEntry.save();

      res.status(201).json({
        success: true,
        message: 'Journal entry created successfully',
        data: { journalEntry },
      });
    } catch (error) {
      console.error('Journal entry creation error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create journal entry',
      });
    }
  }
);

// Get Journal Entries
app.get('/api/journal', authenticateFirebaseToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    
    const query = { userId: req.user._id };
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    const journalEntries = await JournalEntry.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await JournalEntry.countDocuments(query);

    res.json({
      success: true,
      data: {
        journalEntries,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalEntries: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error('Journal entries fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch journal entries',
    });
  }
});

// Update Journal Entry
app.put('/api/journal/:id',
  authenticateFirebaseToken,
  [
    body('title')
      .optional()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Title must be between 1 and 100 characters'),
    body('content')
      .optional()
      .trim()
      .isLength({ min: 1, max: 5000 })
      .withMessage('Content must be between 1 and 5000 characters'),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const journalEntry = await JournalEntry.findOneAndUpdate(
        { _id: id, userId: req.user._id },
        updateData,
        { new: true, runValidators: true }
      );

      if (!journalEntry) {
        return res.status(404).json({
          success: false,
          message: 'Journal entry not found',
        });
      }

      res.json({
        success: true,
        message: 'Journal entry updated successfully',
        data: { journalEntry },
      });
    } catch (error) {
      console.error('Journal entry update error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update journal entry',
      });
    }
  }
);

// Delete Journal Entry
app.delete('/api/journal/:id', authenticateFirebaseToken, async (req, res) => {
  try {
    const { id } = req.params;

    const journalEntry = await JournalEntry.findOneAndDelete({
      _id: id,
      userId: req.user._id,
    });

    if (!journalEntry) {
      return res.status(404).json({
        success: false,
        message: 'Journal entry not found',
      });
    }

    res.json({
      success: true,
      message: 'Journal entry deleted successfully',
    });
  } catch (error) {
    console.error('Journal entry deletion error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete journal entry',
    });
  }
});

// Quiz Result APIs

// Save Quiz Result
app.post('/api/quiz/result',
  authenticateFirebaseToken,
  [
    body('quizType')
      .isIn(['mental-health', 'anxiety', 'depression', 'stress'])
      .withMessage('Invalid quiz type'),
    body('answers')
      .isArray({ min: 1 })
      .withMessage('Answers must be a non-empty array'),
    body('totalScore')
      .isInt({ min: 0 })
      .withMessage('Total score must be a positive integer'),
    body('maxScore')
      .isInt({ min: 1 })
      .withMessage('Max score must be a positive integer'),
    body('category')
      .isIn(['excellent', 'good', 'fair', 'concerning', 'needs-attention'])
      .withMessage('Invalid category'),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { quizType, answers, totalScore, maxScore, category, recommendations } = req.body;

      const quizResult = new QuizResult({
        userId: req.user._id,
        quizType,
        answers,
        totalScore,
        maxScore,
        category,
        recommendations: recommendations || [],
      });

      await quizResult.save();

      res.status(201).json({
        success: true,
        message: 'Quiz result saved successfully',
        data: { quizResult },
      });
    } catch (error) {
      console.error('Quiz result save error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to save quiz result',
      });
    }
  }
);

// Get Quiz Results
app.get('/api/quiz/results', authenticateFirebaseToken, async (req, res) => {
  try {
    const { quizType, page = 1, limit = 10 } = req.query;
    
    const query = { userId: req.user._id };
    if (quizType) query.quizType = quizType;

    const quizResults = await QuizResult.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await QuizResult.countDocuments(query);

    res.json({
      success: true,
      data: {
        quizResults,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalResults: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error('Quiz results fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quiz results',
    });
  }
});

// Statistics API
app.get('/api/stats', authenticateFirebaseToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // Get counts
    const totalMoodEntries = await MoodEntry.countDocuments({ userId });
    const totalJournalEntries = await JournalEntry.countDocuments({ userId });
    const totalQuizResults = await QuizResult.countDocuments({ userId });
    
    // Recent entries
    const recentMoodEntries = await MoodEntry.countDocuments({
      userId,
      createdAt: { $gte: thirtyDaysAgo },
    });
    
    const recentJournalEntries = await JournalEntry.countDocuments({
      userId,
      createdAt: { $gte: thirtyDaysAgo },
    });

    // Latest mood trend
    const latestMoodEntries = await MoodEntry.find({ userId })
      .sort({ createdAt: -1 })
      .limit(7)
      .select('mood energy stress createdAt');

    // Latest quiz result
    const latestQuizResult = await QuizResult.findOne({ userId })
      .sort({ createdAt: -1 })
      .select('quizType category totalScore maxScore createdAt');

    res.json({
      success: true,
      data: {
        overview: {
          totalMoodEntries,
          totalJournalEntries,
          totalQuizResults,
          recentMoodEntries,
          recentJournalEntries,
        },
        trends: {
          moodTrend: latestMoodEntries,
          latestQuizResult,
        },
      },
    });
  } catch (error) {
    console.error('Stats fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
    });
  }
});

// Community Routes
const communityRoutes = require('./routes/community');
app.use('/api/community', communityRoutes);

// Counselor Routes
const counselorRoutes = require('./routes/counselors');
app.use('/api/counselors', counselorRoutes);

// Booking Routes
const bookingRoutes = require('./routes/bookings');
app.use('/api/bookings', authenticateFirebaseToken, bookingRoutes);

// Tools Routes (Male Mental Health Tools)
const toolsRoutes = require('./routes/tools');
app.use('/api/tools', authenticateFirebaseToken, toolsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// ============================================
// SOCKET.IO - REAL-TIME ANONYMOUS CHAT
// ============================================
const ChatMessage = require('./models/ChatMessage');

// Store active users
const activeUsers = new Map(); // userId -> { anonymousName, socketId }
const anonymousNames = [
  'Purple Butterfly', 'Blue Dove', 'Green Owl', 'Pink Swan', 
  'Orange Phoenix', 'Teal Robin', 'Coral Sparrow', 'Lavender Hummingbird',
  'Silver Hawk', 'Golden Eagle', 'Ruby Finch', 'Emerald Parrot',
  'Amber Crow', 'Jade Peacock', 'Pearl Crane', 'Sapphire Raven'
];

const getAnonymousName = () => {
  const usedNames = Array.from(activeUsers.values()).map(u => u.anonymousName);
  const availableNames = anonymousNames.filter(name => !usedNames.includes(name));
  
  if (availableNames.length > 0) {
    return availableNames[Math.floor(Math.random() * availableNames.length)];
  }
  
  // If all names taken, add number suffix
  const colors = ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Pink', 'Orange', 'Teal'];
  const animals = ['Cat', 'Dog', 'Fox', 'Wolf', 'Bear', 'Deer', 'Lion', 'Tiger'];
  return `${colors[Math.floor(Math.random() * colors.length)]} ${animals[Math.floor(Math.random() * animals.length)]} ${Math.floor(Math.random() * 100)}`;
};

// Content moderation for chat
const moderateChatMessage = (text) => {
  const bannedWords = ['abuse', 'suicide', 'harm', 'kill', 'death'];
  const lowerText = text.toLowerCase();
  
  for (const word of bannedWords) {
    if (lowerText.includes(word)) {
      return {
        safe: false,
        message: 'Message contains inappropriate content'
      };
    }
  }
  
  return { safe: true };
};

io.on('connection', (socket) => {
  console.log('🔌 User connected:', socket.id);

  // User joins chat
  socket.on('join_chat', async ({ userId }) => {
    try {
      // Generate anonymous name
      const anonymousName = getAnonymousName();
      
      // Store user
      activeUsers.set(userId, {
        anonymousName,
        socketId: socket.id
      });

      socket.userId = userId;
      socket.anonymousName = anonymousName;

      // Send recent chat history
      const recentMessages = await ChatMessage.find({ isHidden: false })
        .sort({ createdAt: -1 })
        .limit(50)
        .lean();

      socket.emit('chat_history', recentMessages.reverse());

      // Broadcast user joined
      const joinMessage = {
        type: 'join',
        content: `${anonymousName} joined the chat`,
        sender: { anonymousName: 'System' },
        timestamp: new Date()
      };

      io.emit('user_joined', {
        anonymousName,
        message: joinMessage,
        activeCount: activeUsers.size
      });

      // Send active users count
      io.emit('active_users_update', {
        count: activeUsers.size,
        users: Array.from(activeUsers.values()).map(u => u.anonymousName)
      });

      console.log(`✅ ${anonymousName} joined chat. Active users: ${activeUsers.size}`);
    } catch (error) {
      console.error('Error joining chat:', error);
      socket.emit('error', { message: 'Failed to join chat' });
    }
  });

  // User sends message
  socket.on('send_message', async ({ content, userId }) => {
    try {
      if (!content || content.trim().length === 0) return;
      if (content.length > 500) {
        socket.emit('error', { message: 'Message too long (max 500 characters)' });
        return;
      }

      // Content moderation
      const moderation = moderateChatMessage(content);
      if (!moderation.safe) {
        socket.emit('error', { message: moderation.message });
        return;
      }

      const user = activeUsers.get(userId);
      if (!user) {
        socket.emit('error', { message: 'User not found in active users' });
        return;
      }

      // Save to database
      const chatMessage = new ChatMessage({
        content: content.trim(),
        sender: {
          userId,
          anonymousName: user.anonymousName
        },
        type: 'message'
      });

      await chatMessage.save();

      // Broadcast to all users
      const messageData = {
        _id: chatMessage._id,
        content: chatMessage.content,
        sender: {
          anonymousName: user.anonymousName
        },
        type: 'message',
        createdAt: chatMessage.createdAt
      };

      io.emit('new_message', messageData);

      console.log(`💬 ${user.anonymousName}: ${content.substring(0, 50)}`);
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  // User typing indicator
  socket.on('typing', ({ userId }) => {
    const user = activeUsers.get(userId);
    if (user) {
      socket.broadcast.emit('user_typing', { anonymousName: user.anonymousName });
    }
  });

  socket.on('stop_typing', ({ userId }) => {
    const user = activeUsers.get(userId);
    if (user) {
      socket.broadcast.emit('user_stop_typing', { anonymousName: user.anonymousName });
    }
  });

  // User disconnects
  socket.on('disconnect', () => {
    if (socket.userId) {
      const user = activeUsers.get(socket.userId);
      if (user) {
        activeUsers.delete(socket.userId);

        // Broadcast user left
        const leaveMessage = {
          type: 'leave',
          content: `${user.anonymousName} left the chat`,
          sender: { anonymousName: 'System' },
          timestamp: new Date()
        };

        io.emit('user_left', {
          anonymousName: user.anonymousName,
          message: leaveMessage,
          activeCount: activeUsers.size
        });

        // Update active users count
        io.emit('active_users_update', {
          count: activeUsers.size,
          users: Array.from(activeUsers.values()).map(u => u.anonymousName)
        });

        console.log(`❌ ${user.anonymousName} left chat. Active users: ${activeUsers.size}`);
      }
    }
  });
});

// Start server with Socket.IO
httpServer.listen(PORT, () => {
  console.log(`\n🚀 Mentra Server is running!`);
  console.log(`📍 Server URL: http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 API Version: ${process.env.API_VERSION || 'v1'}`);
  console.log(`⏰ Started at: ${new Date().toLocaleString()}\n`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM received. Shutting down gracefully...');
  await mongoose.connection.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('\n🛑 SIGINT received. Shutting down gracefully...');
  await mongoose.connection.close();
  process.exit(0);
});

module.exports = app;