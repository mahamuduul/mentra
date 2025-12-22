const express = require('express');
const Counselor = require('../models/Counselor');
const Booking = require('../models/Booking');
const User = require('../models/User');
const { authenticateToken } = require('./auth');

const router = express.Router();

// GET /api/counselors/matched - Get gender-matched counselors for current user
router.get('/matched', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    
    // Get user from database to check gender
    const user = await User.findOne({ firebaseUID: userId });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    if (!user.gender) {
      return res.status(400).json({
        success: false,
        message: 'User gender not set. Please complete your profile.'
      });
    }
    
    // Find counselors with matching gender
    const counselors = await Counselor.findByGenderAndSpecialization(user.gender);
    
    res.json({
      success: true,
      message: `Found ${counselors.length} ${user.gender.toLowerCase()} counselors`,
      data: {
        userGender: user.gender,
        counselors,
        matchingPolicy: 'Gender-based matching ensures privacy and comfort'
      }
    });
  } catch (error) {
    console.error('Error fetching matched counselors:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch counselors',
      error: error.message
    });
  }
});

// GET /api/counselors/matched/:specialization - Get gender-matched counselors by specialization
router.get('/matched/:specialization', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const { specialization } = req.params;
    
    const user = await User.findOne({ firebaseUID: userId });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    if (!user.gender) {
      return res.status(400).json({
        success: false,
        message: 'User gender not set'
      });
    }
    
    const counselors = await Counselor.findByGenderAndSpecialization(user.gender, specialization);
    
    res.json({
      success: true,
      data: {
        userGender: user.gender,
        specialization,
        counselors
      }
    });
  } catch (error) {
    console.error('Error fetching specialized counselors:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch counselors',
      error: error.message
    });
  }
});

// GET /api/counselors/:counselorId - Get specific counselor details (with gender check)
router.get('/:counselorId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const { counselorId } = req.params;
    
    const user = await User.findOne({ firebaseUID: userId });
    const counselor = await Counselor.findById(counselorId)
      .select('-assignedPatients -reviews.userId');
    
    if (!counselor) {
      return res.status(404).json({
        success: false,
        message: 'Counselor not found'
      });
    }
    
    // Check gender matching
    if (counselor.personalInfo.gender !== user.gender) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Gender mismatch - you can only view counselors of your gender',
        userGender: user.gender,
        counselorGender: counselor.personalInfo.gender
      });
    }
    
    res.json({
      success: true,
      data: { counselor }
    });
  } catch (error) {
    console.error('Error fetching counselor details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch counselor details',
      error: error.message
    });
  }
});

// POST /api/counselors/book - Book a session with a counselor
router.post('/book', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const {
      counselorId,
      sessionType,
      scheduledDate,
      duration,
      topic,
      specialNeeds
    } = req.body;
    
    // Validate required fields
    if (!counselorId || !sessionType || !scheduledDate) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: counselorId, sessionType, scheduledDate'
      });
    }
    
    // Get user and counselor
    const user = await User.findOne({ firebaseUID: userId });
    const counselor = await Counselor.findById(counselorId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    if (!counselor) {
      return res.status(404).json({
        success: false,
        message: 'Counselor not found'
      });
    }
    
    // Verify gender matching
    if (user.gender !== counselor.personalInfo.gender) {
      return res.status(403).json({
        success: false,
        message: 'Gender mismatch: You can only book with counselors of your gender',
        userGender: user.gender,
        counselorGender: counselor.personalInfo.gender
      });
    }
    
    // Check if counselor can accept new patients
    if (!counselor.canAcceptNewPatient()) {
      return res.status(400).json({
        success: false,
        message: 'Counselor is not accepting new patients at this time'
      });
    }
    
    // Check if counselor supports requested session type
    if (!counselor.sessionInfo.sessionTypes.includes(sessionType)) {
      return res.status(400).json({
        success: false,
        message: `Counselor does not support ${sessionType} sessions`,
        supportedTypes: counselor.sessionInfo.sessionTypes
      });
    }
    
    // Generate booking ID
    const bookingId = `BK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Create booking
    const booking = new Booking({
      bookingId,
      userId: user._id,
      counselorId: counselor._id,
      sessionDetails: {
        sessionType,
        scheduledDate: new Date(scheduledDate),
        duration: duration || counselor.sessionInfo.sessionDuration,
        topic,
        specialNeeds,
        isFirstSession: !await Booking.exists({ 
          userId: user._id, 
          status: 'Completed' 
        })
      },
      genderMatch: {
        userGender: user.gender,
        counselorGender: counselor.personalInfo.gender,
        isMatched: true
      },
      payment: {
        amount: counselor.sessionInfo.pricing?.standardRate || 0,
        currency: counselor.sessionInfo.pricing?.currency || 'USD'
      },
      status: counselor.settings.requiresApproval ? 'Pending' : 'Confirmed'
    });
    
    await booking.save();
    
    // Update counselor statistics
    counselor.statistics.totalSessions += 1;
    await counselor.save();
    
    // Add to assigned patients if not already assigned
    const isAssigned = counselor.assignedPatients.some(
      p => p.userId.toString() === user._id.toString()
    );
    
    if (!isAssigned) {
      counselor.assignedPatients.push({
        userId: user._id,
        status: 'Active'
      });
      await counselor.save();
    }
    
    res.status(201).json({
      success: true,
      message: 'Session booked successfully',
      data: {
        booking: await Booking.findById(booking._id)
          .populate('counselorId', 'personalInfo professionalInfo')
      }
    });
  } catch (error) {
    console.error('Error booking session:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to book session',
      error: error.message
    });
  }
});

// GET /api/counselors/bookings/my-sessions - Get user's bookings
router.get('/bookings/my-sessions', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const user = await User.findOne({ firebaseUID: userId });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const bookings = await Booking.find({ userId: user._id })
      .populate('counselorId', 'personalInfo professionalInfo statistics')
      .sort({ 'sessionDetails.scheduledDate': -1 });
    
    // Separate upcoming and past sessions
    const now = new Date();
    const upcoming = bookings.filter(
      b => new Date(b.sessionDetails.scheduledDate) >= now && 
           ['Pending', 'Confirmed'].includes(b.status)
    );
    const past = bookings.filter(
      b => new Date(b.sessionDetails.scheduledDate) < now || 
           ['Completed', 'Cancelled', 'No Show'].includes(b.status)
    );
    
    res.json({
      success: true,
      data: {
        upcoming,
        past,
        total: bookings.length
      }
    });
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings',
      error: error.message
    });
  }
});

// PUT /api/counselors/bookings/:bookingId/cancel - Cancel a booking
router.put('/bookings/:bookingId/cancel', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const { bookingId } = req.params;
    const { reason } = req.body;
    
    const user = await User.findOne({ firebaseUID: userId });
    const booking = await Booking.findOne({ bookingId })
      .populate('counselorId', 'personalInfo');
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    // Verify booking belongs to user
    if (booking.userId.toString() !== user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: This booking does not belong to you'
      });
    }
    
    // Check if booking can be cancelled
    if (!booking.canBeCancelled()) {
      return res.status(400).json({
        success: false,
        message: 'Booking cannot be cancelled (less than 24 hours before session or already completed)'
      });
    }
    
    // Cancel the booking
    booking.cancelBooking('User', reason || 'User requested cancellation');
    await booking.save();
    
    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: {
        booking,
        refundIssued: booking.cancellation.refundIssued
      }
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel booking',
      error: error.message
    });
  }
});

// POST /api/counselors/bookings/:bookingId/complete - Complete and rate a session
router.post('/bookings/:bookingId/complete', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const { bookingId } = req.params;
    const { rating, feedback } = req.body;
    
    const user = await User.findOne({ firebaseUID: userId });
    const booking = await Booking.findOne({ bookingId })
      .populate('counselorId');
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    // Verify booking belongs to user
    if (booking.userId.toString() !== user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    // Complete the booking
    booking.completeBooking(rating, feedback);
    await booking.save();
    
    // Add review to counselor if rating provided
    if (rating) {
      const counselor = await Counselor.findById(booking.counselorId);
      counselor.reviews.push({
        userId: user._id,
        rating,
        comment: feedback,
        isVerified: true
      });
      counselor.updateRating();
      counselor.statistics.completedSessions += 1;
      await counselor.save();
    }
    
    res.json({
      success: true,
      message: 'Session completed successfully',
      data: { booking }
    });
  } catch (error) {
    console.error('Error completing session:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete session',
      error: error.message
    });
  }
});

// GET /api/counselors/statistics - Get counselor system statistics
router.get('/statistics/overview', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const user = await User.findOne({ firebaseUID: userId });
    
    const totalCounselors = await Counselor.countDocuments({
      'account.isActive': true,
      'account.isVerified': true
    });
    
    const genderMatchedCount = await Counselor.countDocuments({
      'personalInfo.gender': user.gender,
      'account.isActive': true,
      'account.isVerified': true
    });
    
    const userBookings = await Booking.countDocuments({
      userId: user._id
    });
    
    res.json({
      success: true,
      data: {
        totalCounselors,
        matchedCounselors: genderMatchedCount,
        userGender: user.gender,
        yourBookings: userBookings,
        matchingPolicy: 'Gender-based matching for privacy and comfort'
      }
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
});

module.exports = router;
