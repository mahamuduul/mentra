import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaCalendarAlt, FaClock, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { showSuccessToast, showErrorToast } from '../utils/toast';
import { useAuth } from '../context/AuthContext';

const BookingModal = ({ isOpen, onClose, expert }) => {
  const { currentUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    concernType: '',
    message: '',
    urgency: 'normal',
  });

  // Generate available dates (next 14 days)
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  // Available time slots
  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
    '06:00 PM', '07:00 PM'
  ];

  // Concern types based on expert specialization
  const concernTypes = [
    'Initial Consultation',
    'Follow-up Session',
    'Crisis Support',
    'Stress Management',
    'Anxiety & Depression',
    'Relationship Issues',
    'Career Guidance',
    'Other'
  ];

  const handleInputChange = (field, value) => {
    setBookingData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!bookingData.date) {
      showErrorToast('Please select a date');
      return false;
    }
    if (!bookingData.time) {
      showErrorToast('Please select a time slot');
      return false;
    }
    if (!bookingData.concernType) {
      showErrorToast('Please select a concern type');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const token = await currentUser.getIdToken();
      
      const response = await fetch('http://localhost:5000/api/bookings/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          expertId: expert.id,
          expertName: expert.name,
          expertSpecialization: expert.specialization,
          date: bookingData.date,
          time: bookingData.time,
          concernType: bookingData.concernType,
          message: bookingData.message,
          urgency: bookingData.urgency,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setBookingSuccess(true);
        showSuccessToast('Session booked successfully! 🎉');
        
        // Reset form after 2 seconds and close modal
        setTimeout(() => {
          setBookingSuccess(false);
          setBookingData({
            date: '',
            time: '',
            concernType: '',
            message: '',
            urgency: 'normal',
          });
          onClose();
        }, 2500);
      } else {
        throw new Error(data.message || 'Failed to book session');
      }
    } catch (error) {
      console.error('Booking error:', error);
      showErrorToast(error.message || 'Failed to book session. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setBookingData({
        date: '',
        time: '',
        concernType: '',
        message: '',
        urgency: 'normal',
      });
      setBookingSuccess(false);
      onClose();
    }
  };

  if (!expert) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {bookingSuccess ? (
              // Success Screen
              <div className="p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                  className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6"
                >
                  <FaCheckCircle className="text-5xl text-green-500" />
                </motion.div>
                <h3 className="text-3xl font-bold text-gray-800 mb-3">
                  Booking Confirmed! 🎉
                </h3>
                <p className="text-lg text-gray-600 mb-4">
                  Your session with <span className="font-semibold text-purple-600">{expert.name}</span> has been successfully booked.
                </p>
                <div className="bg-purple-50 rounded-xl p-6 mb-6">
                  <div className="grid grid-cols-2 gap-4 text-left">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Date</p>
                      <p className="font-semibold text-gray-800">
                        {new Date(bookingData.date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Time</p>
                      <p className="font-semibold text-gray-800">{bookingData.time}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-gray-600 mb-1">Concern Type</p>
                      <p className="font-semibold text-gray-800">{bookingData.concernType}</p>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  A confirmation email has been sent to your registered email address.
                  You'll receive a reminder 24 hours before your session.
                </p>
              </div>
            ) : (
              // Booking Form
              <>
                {/* Header */}
                <div className={`p-6 border-b border-gray-200 bg-gradient-to-r ${
                  expert.gender === 'Male' 
                    ? 'from-blue-500 to-blue-700' 
                    : 'from-pink-500 to-pink-700'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-white mb-2">
                        Book a Session
                      </h2>
                      <div className="flex items-center space-x-3">
                        <img
                          src={expert.image}
                          alt={expert.name}
                          className="w-12 h-12 rounded-full border-2 border-white shadow-lg"
                        />
                        <div>
                          <p className="font-semibold text-white">{expert.name}</p>
                          <p className="text-sm text-white/80">{expert.specialization}</p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleClose}
                      disabled={isSubmitting}
                      className="text-white hover:text-gray-200 transition-colors p-2 hover:bg-white/10 rounded-lg"
                    >
                      <FaTimes className="text-xl" />
                    </button>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  {/* Date Selection */}
                  <div>
                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                      <FaCalendarAlt className="mr-2 text-purple-600" />
                      Select Date <span className="text-red-500 ml-1">*</span>
                    </label>
                    <select
                      value={bookingData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                      required
                    >
                      <option value="">Choose a date</option>
                      {getAvailableDates().map((date) => (
                        <option key={date} value={date}>
                          {new Date(date).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Time Selection */}
                  <div>
                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                      <FaClock className="mr-2 text-purple-600" />
                      Select Time Slot <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => handleInputChange('time', slot)}
                          disabled={isSubmitting}
                          className={`py-2 px-3 rounded-lg text-sm font-medium transition-all border-2 ${
                            bookingData.time === slot
                              ? expert.gender === 'Male'
                                ? 'bg-blue-500 text-white border-blue-500'
                                : 'bg-pink-500 text-white border-pink-500'
                              : 'bg-white text-gray-700 border-gray-300 hover:border-purple-400 hover:bg-purple-50'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Concern Type */}
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">
                      Type of Concern <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={bookingData.concernType}
                      onChange={(e) => handleInputChange('concernType', e.target.value)}
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                      required
                    >
                      <option value="">Select concern type</option>
                      {concernTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  {/* Urgency Level */}
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">
                      Urgency Level
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {['normal', 'moderate', 'urgent'].map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => handleInputChange('urgency', level)}
                          disabled={isSubmitting}
                          className={`py-2.5 px-4 rounded-xl text-sm font-medium transition-all border-2 capitalize ${
                            bookingData.urgency === level
                              ? level === 'urgent'
                                ? 'bg-red-500 text-white border-red-500'
                                : level === 'moderate'
                                ? 'bg-yellow-500 text-white border-yellow-500'
                                : 'bg-green-500 text-white border-green-500'
                              : 'bg-white text-gray-700 border-gray-300 hover:border-purple-400 hover:bg-purple-50'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Additional Message */}
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">
                      Additional Information (Optional)
                    </label>
                    <textarea
                      value={bookingData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      disabled={isSubmitting}
                      placeholder="Share any specific concerns or information that would help the doctor prepare for your session..."
                      rows="4"
                      maxLength="500"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {bookingData.message.length}/500 characters
                    </p>
                  </div>

                  {/* Important Notice */}
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                    <div className="flex items-start">
                      <FaExclamationCircle className="text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                      <div className="text-sm text-blue-800">
                        <p className="font-semibold mb-1">Important Information:</p>
                        <ul className="list-disc list-inside space-y-1 text-blue-700">
                          <li>Session duration: 45-60 minutes</li>
                          <li>Please join 5 minutes before your scheduled time</li>
                          <li>Cancellations must be made at least 24 hours in advance</li>
                          <li>All sessions are confidential and secure</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={handleClose}
                      disabled={isSubmitting}
                      className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`flex-1 px-6 py-3 font-bold rounded-xl text-white transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                        expert.gender === 'Male'
                          ? 'bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800'
                          : 'bg-gradient-to-r from-pink-500 to-pink-700 hover:from-pink-600 hover:to-pink-800'
                      }`}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        'Confirm Booking'
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BookingModal;
