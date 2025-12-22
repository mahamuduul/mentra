import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaCalendarAlt, 
  FaClock, 
  FaUser, 
  FaVideo,
  FaCheckCircle, 
  FaTimesCircle, 
  FaSpinner,
  FaArrowLeft,
  FaComments,
  FaInfoCircle
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { showSuccessToast, showErrorToast } from '../utils/toast';
import ChatBot from '../components/ChatBot';

const BookingDetails = () => {
  const { bookingNumber } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [meetingLink, setMeetingLink] = useState(null);
  const [showChatBot, setShowChatBot] = useState(false);

  useEffect(() => {
    fetchBookingDetails();
  }, [bookingNumber]);

  useEffect(() => {
    if (booking && booking.status !== 'cancelled' && booking.status !== 'completed') {
      const timer = setInterval(() => {
        calculateCountdown();
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [booking]);

  const fetchBookingDetails = async () => {
    try {
      setIsLoading(true);
      const token = await currentUser.getIdToken();
      
      const response = await fetch(`http://localhost:5000/api/bookings/${bookingNumber}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setBooking(data.data.booking);
        // Generate meeting link if session is within 30 minutes
        checkAndGenerateMeetingLink(data.data.booking);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error fetching booking:', error);
      showErrorToast('Failed to load booking details');
      navigate('/my-bookings');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateCountdown = () => {
    if (!booking) return;

    const sessionDateTime = new Date(`${booking.date} ${booking.time}`);
    const now = new Date();
    const difference = sessionDateTime - now;

    if (difference <= 0) {
      setCountdown({ expired: true });
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    setCountdown({ days, hours, minutes, seconds, expired: false });
  };

  const checkAndGenerateMeetingLink = (bookingData) => {
    const sessionDateTime = new Date(`${bookingData.date} ${bookingData.time}`);
    const now = new Date();
    const minutesUntilSession = (sessionDateTime - now) / (1000 * 60);

    // Generate meeting link if within 30 minutes and session not completed/cancelled
    if (minutesUntilSession <= 30 && minutesUntilSession > 0 && 
        (bookingData.status === 'pending' || bookingData.status === 'confirmed')) {
      const link = generateMeetingLink(bookingData);
      setMeetingLink(link);
    }
  };

  const generateMeetingLink = (bookingData) => {
    // Generate a unique meeting link
    const meetingId = `${bookingData.bookingNumber}-${Date.now()}`;
    return `https://meet.mentra.app/session/${meetingId}`;
  };

  const handleCancelBooking = async () => {
    if (!window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
      return;
    }

    try {
      setIsCancelling(true);
      const token = await currentUser.getIdToken();
      
      const response = await fetch(`http://localhost:5000/api/bookings/${bookingNumber}/cancel`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        showSuccessToast('Booking cancelled successfully');
        setBooking(data.data.booking);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      showErrorToast(error.message || 'Failed to cancel booking');
    } finally {
      setIsCancelling(false);
    }
  };

  const canCancelBooking = () => {
    if (!booking || (booking.status !== 'pending' && booking.status !== 'confirmed')) {
      return false;
    }
    
    const bookingDate = new Date(`${booking.date} ${booking.time}`);
    const now = new Date();
    const hoursDifference = (bookingDate - now) / (1000 * 60 * 60);
    
    return hoursDifference >= 24;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
      case 'completed':
        return <FaCheckCircle className="text-2xl" />;
      case 'cancelled':
        return <FaTimesCircle className="text-2xl" />;
      default:
        return <FaClock className="text-2xl" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="text-5xl text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-700">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-700">Booking not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/my-bookings')}
          className="mb-6 flex items-center space-x-2 text-purple-600 hover:text-purple-700 font-semibold transition-colors"
        >
          <FaArrowLeft />
          <span>Back to My Bookings</span>
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Booking Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <div className={`p-6 bg-gradient-to-r ${
                booking.status === 'confirmed' ? 'from-green-500 to-green-700' :
                booking.status === 'cancelled' ? 'from-red-500 to-red-700' :
                booking.status === 'completed' ? 'from-blue-500 to-blue-700' :
                'from-yellow-500 to-yellow-700'
              }`}>
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(booking.status)}
                    <div>
                      <h1 className="text-2xl font-bold mb-1">
                        {booking.expertName}
                      </h1>
                      <p className="text-white/90">{booking.expertSpecialization}</p>
                    </div>
                  </div>
                  <div className={`px-4 py-2 rounded-full border-2 border-white font-semibold`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </div>
                </div>
              </div>

              {/* Booking Details */}
              <div className="p-6 space-y-6">
                {/* Countdown Timer */}
                {countdown && !countdown.expired && booking.status !== 'cancelled' && booking.status !== 'completed' && (
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                      Time Until Your Session
                    </h3>
                    <div className="grid grid-cols-4 gap-3">
                      <div className="text-center">
                        <div className="bg-white rounded-lg p-3 shadow-md">
                          <div className="text-3xl font-bold text-purple-600">{countdown.days}</div>
                          <div className="text-xs text-gray-600 mt-1">Days</div>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="bg-white rounded-lg p-3 shadow-md">
                          <div className="text-3xl font-bold text-purple-600">{countdown.hours}</div>
                          <div className="text-xs text-gray-600 mt-1">Hours</div>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="bg-white rounded-lg p-3 shadow-md">
                          <div className="text-3xl font-bold text-purple-600">{countdown.minutes}</div>
                          <div className="text-xs text-gray-600 mt-1">Minutes</div>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="bg-white rounded-lg p-3 shadow-md">
                          <div className="text-3xl font-bold text-purple-600">{countdown.seconds}</div>
                          <div className="text-xs text-gray-600 mt-1">Seconds</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Meeting Link */}
                {meetingLink && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border-2 border-green-300"
                  >
                    <div className="flex items-start space-x-3">
                      <FaVideo className="text-2xl text-green-600 mt-1" />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          Your Session is Starting Soon!
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                          Join your video session using the link below. The meeting room will be available 5 minutes before your scheduled time.
                        </p>
                        <a
                          href={meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold rounded-xl hover:from-green-600 hover:to-green-800 transition-all transform hover:scale-105 shadow-lg"
                        >
                          <FaVideo />
                          <span>Join Video Session</span>
                        </a>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Session Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                    <div className="flex items-center space-x-3 mb-2">
                      <FaCalendarAlt className="text-purple-600 text-xl" />
                      <h4 className="font-semibold text-gray-800">Date</h4>
                    </div>
                    <p className="text-gray-700 font-medium">
                      {new Date(booking.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>

                  <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                    <div className="flex items-center space-x-3 mb-2">
                      <FaClock className="text-purple-600 text-xl" />
                      <h4 className="font-semibold text-gray-800">Time</h4>
                    </div>
                    <p className="text-gray-700 font-medium">{booking.time}</p>
                  </div>

                  <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                    <div className="flex items-center space-x-3 mb-2">
                      <FaUser className="text-purple-600 text-xl" />
                      <h4 className="font-semibold text-gray-800">Concern Type</h4>
                    </div>
                    <p className="text-gray-700 font-medium">{booking.concernType}</p>
                  </div>

                  <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                    <div className="flex items-center space-x-3 mb-2">
                      <FaInfoCircle className="text-purple-600 text-xl" />
                      <h4 className="font-semibold text-gray-800">Urgency</h4>
                    </div>
                    <p className={`font-semibold capitalize ${
                      booking.urgency === 'urgent' ? 'text-red-600' :
                      booking.urgency === 'moderate' ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>
                      {booking.urgency}
                    </p>
                  </div>
                </div>

                {/* Additional Message */}
                {booking.message && (
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-xl">
                    <h4 className="font-semibold text-blue-900 mb-2">Additional Information</h4>
                    <p className="text-blue-800">{booking.message}</p>
                  </div>
                )}

                {/* Booking Number */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <h4 className="font-semibold text-gray-700 mb-2">Booking Reference</h4>
                  <p className="font-mono text-lg font-bold text-gray-900">{booking.bookingNumber}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Please keep this reference number for your records
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4 border-t border-gray-200">
                  {canCancelBooking() && (
                    <button
                      onClick={handleCancelBooking}
                      disabled={isCancelling}
                      className="flex-1 px-6 py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isCancelling ? (
                        <span className="flex items-center justify-center">
                          <FaSpinner className="animate-spin mr-2" />
                          Cancelling...
                        </span>
                      ) : (
                        'Cancel Booking'
                      )}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* ChatBot Toggle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center space-x-3 mb-4">
                <FaComments className="text-3xl text-purple-600" />
                <div>
                  <h3 className="font-bold text-gray-800">Need Help?</h3>
                  <p className="text-sm text-gray-600">Chat with our AI assistant</p>
                </div>
              </div>
              <button
                onClick={() => setShowChatBot(!showChatBot)}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-700 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-purple-800 transition-all transform hover:scale-105 shadow-lg"
              >
                {showChatBot ? 'Close Chat' : 'Start Chat'}
              </button>
            </motion.div>

            {/* Important Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h3 className="font-bold text-gray-800 mb-4">Session Guidelines</h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start space-x-2">
                  <span className="text-purple-600 mt-1">•</span>
                  <span>Join 5 minutes before your scheduled time</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-purple-600 mt-1">•</span>
                  <span>Ensure you have a stable internet connection</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-purple-600 mt-1">•</span>
                  <span>Find a quiet, private space for the session</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-purple-600 mt-1">•</span>
                  <span>Keep your camera and microphone ready</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-purple-600 mt-1">•</span>
                  <span>Cancellations must be made 24 hours in advance</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ChatBot Component */}
      {showChatBot && (
        <ChatBot 
          isOpen={showChatBot}
          onClose={() => setShowChatBot(false)}
          booking={booking}
        />
      )}
    </div>
  );
};

export default BookingDetails;
