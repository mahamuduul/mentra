const admin = require('firebase-admin');
const User = require('../models/User');

// Firebase Authentication Middleware
const authenticateToken = async (req, res, next) => {
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
            uid: payload.uid || payload.user_id || 'dev-user',
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
    const user = await User.findOne({ firebaseUID: decodedToken.uid });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found in database. Please complete registration.',
      });
    }

    // Attach user and firebase info to request
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: user.name,
      gender: user.gender,
      dbUser: user
    };
    req.firebaseUser = decodedToken;
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({
      success: false,
      message: 'Authentication failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

module.exports = {
  authenticateToken
};
