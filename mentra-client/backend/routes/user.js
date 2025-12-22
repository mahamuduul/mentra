import express from 'express';
import User from '../models/User.js';
import { authenticateToken } from './auth.js';

const router = express.Router();

// POST /api/user/survey - Submit user survey
router.post('/survey', authenticateToken, async (req, res) => {
  try {
    const { uid } = req.user;
    const surveyData = req.body;

    console.log('Received survey data for user:', uid);
    console.log('Survey data:', surveyData);

    // Find user by Firebase UID
    let user = await User.findOne({ firebaseUID: uid });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update user with survey data
    user.surveyData = surveyData;
    user.profileCompleted = true;
    user.needsSurvey = false;
    user.updatedAt = new Date();

    await user.save();

    console.log('Survey data saved successfully for user:', uid);

    res.json({
      success: true,
      message: 'Survey completed successfully',
      data: { user }
    });
  } catch (error) {
    console.error('Survey submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save survey data',
      error: error.message
    });
  }
});

// GET /api/user/profile - Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const { uid } = req.user;
    
    const user = await User.findOne({ firebaseUID: uid });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user profile',
      error: error.message
    });
  }
});

// PUT /api/user/profile - Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { uid } = req.user;
    const updateData = req.body;

    const user = await User.findOneAndUpdate(
      { firebaseUID: uid },
      { 
        ...updateData,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
});

export default router;