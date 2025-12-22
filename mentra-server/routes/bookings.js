const express = require('express');
const router = express.Router();
const SessionBooking = require('../models/SessionBooking');
const { body, validationResult } = require('express-validator');

// Utility function to generate unique booking number
const generateBookingNumber = () => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `BK-${timestamp}-${random}`;
};

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errors.array(),
    });
  }
  next();
};

// @route   POST /api/bookings/create
// @desc    Create a new booking
// @access  Private
router.post('/create',
  [
    body('expertId').isInt().withMessage('Expert ID is required'),
    body('expertName').notEmpty().withMessage('Expert name is required'),
    body('expertSpecialization').notEmpty().withMessage('Expert specialization is required'),
    body('date').notEmpty().withMessage('Date is required'),
    body('time').notEmpty().withMessage('Time is required'),
    body('concernType').notEmpty().withMessage('Concern type is required'),
    body('urgency').optional().isIn(['normal', 'moderate', 'urgent']).withMessage('Invalid urgency level'),
    body('message').optional().isLength({ max: 500 }).withMessage('Message must be less than 500 characters'),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const user = req.user;
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated',
        });
      }

      const { expertId, expertName, expertSpecialization, date, time, concernType, message, urgency } = req.body;

      console.log('📅 Creating new booking:', {
        userId: user._id,
        expertId,
        date,
        time,
        concernType,
      });

      // Check if the time slot is already booked
      const existingBooking = await SessionBooking.findOne({
        expertId,
        date,
        time,
        status: { $in: ['pending', 'confirmed'] }
      });

      if (existingBooking) {
        return res.status(400).json({
          success: false,
          message: 'This time slot is already booked. Please choose another time.',
        });
      }

      // Generate unique booking number
      const bookingNumber = generateBookingNumber();

      // Create new booking
      const newBooking = new SessionBooking({
        userId: user._id.toString(),
        userEmail: user.email,
        userName: user.name,
        expertId,
        expertName,
        expertSpecialization,
        date,
        time,
        concernType,
        message: message || '',
        urgency: urgency || 'normal',
        bookingNumber,
        status: 'pending',
      });

      await newBooking.save();

      console.log('✅ Booking created successfully:', bookingNumber);

      res.status(201).json({
        success: true,
        message: 'Booking created successfully',
        data: {
          booking: {
            bookingNumber,
            expertName,
            date,
            time,
            concernType,
            status: 'pending',
            createdAt: newBooking.createdAt,
          },
        },
      });
    } catch (error) {
      console.error('❌ Booking creation error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create booking',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }
);

// @route   GET /api/bookings/my-bookings
// @desc    Get user's bookings
// @access  Private
router.get('/my-bookings', async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    const bookings = await SessionBooking.find({ userId: user._id.toString() })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      data: {
        bookings,
        count: bookings.length,
      },
    });
  } catch (error) {
    console.error('❌ Error fetching bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// @route   GET /api/bookings/:bookingNumber
// @desc    Get booking details by booking number
// @access  Private
router.get('/:bookingNumber', async (req, res) => {
  try {
    const user = req.user;
    const { bookingNumber } = req.params;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    const booking = await SessionBooking.findOne({
      bookingNumber,
      userId: user._id.toString(),
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    res.json({
      success: true,
      data: { booking },
    });
  } catch (error) {
    console.error('❌ Error fetching booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch booking',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// @route   PUT /api/bookings/:bookingNumber/cancel
// @desc    Cancel a booking
// @access  Private
router.put('/:bookingNumber/cancel', async (req, res) => {
  try {
    const user = req.user;
    const { bookingNumber } = req.params;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    const booking = await SessionBooking.findOne({
      bookingNumber,
      userId: user._id.toString(),
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled',
      });
    }

    if (booking.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel a completed booking',
      });
    }

    // Check if cancellation is at least 24 hours before scheduled time
    const bookingDate = new Date(booking.date);
    const now = new Date();
    const hoursDifference = (bookingDate - now) / (1000 * 60 * 60);

    if (hoursDifference < 24) {
      return res.status(400).json({
        success: false,
        message: 'Cancellations must be made at least 24 hours in advance',
      });
    }

    booking.status = 'cancelled';
    await booking.save();

    console.log('✅ Booking cancelled:', bookingNumber);

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: { booking },
    });
  } catch (error) {
    console.error('❌ Error cancelling booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel booking',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// @route   GET /api/bookings/expert/:expertId/availability
// @desc    Get available time slots for an expert on a specific date
// @access  Private
router.get('/expert/:expertId/availability', async (req, res) => {
  try {
    const { expertId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Date is required',
      });
    }

    // Get all bookings for this expert on this date
    const bookedSlots = await SessionBooking.find({
      expertId: parseInt(expertId),
      date,
      status: { $in: ['pending', 'confirmed'] }
    }).select('time');

    const bookedTimes = bookedSlots.map(booking => booking.time);

    res.json({
      success: true,
      data: {
        bookedTimes,
        date,
        expertId,
      },
    });
  } catch (error) {
    console.error('❌ Error fetching availability:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch availability',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

module.exports = router;
