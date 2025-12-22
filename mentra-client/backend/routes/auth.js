import express from 'express';
import admin from 'firebase-admin';
import User from '../models/User.js';

const router = express.Router();

// Firebase Auth Middleware
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided' 
      });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid or expired token' 
    });
  }
};

// POST /api/auth/firebase-sync - Sync Firebase user with backend
router.post('/firebase-sync', authenticateToken, async (req, res) => {
  try {
    const { uid, email, name, avatar, emailVerified, gender } = req.body;

    // Find existing user or create new one
    let user = await User.findOne({ firebaseUID: uid });

    if (!user) {
      // Create new user
      user = new User({
        firebaseUID: uid,
        name: name || email.split('@')[0],
        email,
        gender: gender || 'Male', // Default to Male if not provided (for existing Google users)
        avatar,
        isEmailVerified: emailVerified,
        profileCompleted: false,
        needsSurvey: true,
        createdAt: new Date(),
        lastLoginAt: new Date()
      });
    } else {
      // Update existing user
      user.name = name || user.name;
      user.email = email;
      if (gender) user.gender = gender; // Only update if provided
      user.avatar = avatar || user.avatar;
      user.isEmailVerified = emailVerified;
      user.lastLoginAt = new Date();
    }

    await user.save();

    res.json({
      success: true,
      message: 'User synced successfully',
      data: { user }
    });
  } catch (error) {
    console.error('Firebase sync error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to sync user with backend',
      error: error.message
    });
  }
});

// GET /api/auth/verify - Verify current user token
router.get('/verify', authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUID: req.user.uid });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found in database'
      });
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify user',
      error: error.message
    });
  }
});

export default router;