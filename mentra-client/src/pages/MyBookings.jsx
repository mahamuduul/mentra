import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaClock, FaUser, FaCheckCircle, FaClock as FaPending, FaTimesCircle, FaSpinner, FaEye } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { showSuccessToast, showErrorToast } from '../utils/toast';

const MyBookings = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancellingBookingId, setCancellingBookingId] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const token = await currentUser.getIdToken();
      
      const response = await fetch('http://localhost:5000/api/bookings/my-bookings', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setBookings(data.data.bookings);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      showErrorToast('Failed to load bookings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelBooking = async (bookingNumber) => {
    if (!window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
      return;
    }

    try {
      setCancellingBookingId(bookingNumber);
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
        fetchBookings(); // Refresh bookings
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      showErrorToast(error.message || 'Failed to cancel booking');
    } finally {
      setCancellingBookingId(null);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <FaCheckCircle className="text-green-500" />;
      case 'pending':
        return <FaPending className="text-yellow-500" />;
      case 'cancelled':
        return <FaTimesCircle className="text-red-500" />;
      case 'completed':
        return <FaCheckCircle className="text-blue-500" />;
      default:
        return <FaPending className="text-gray-500" />;
    }
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

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'urgent':
        return 'text-red-600 font-semibold';
      case 'moderate':
        return 'text-yellow-600 font-semibold';
      default:
        return 'text-green-600';
    }
  };

  const canCancelBooking = (booking) => {
    if (booking.status !== 'pending' && booking.status !== 'confirmed') {
      return false;
    }
    
    const bookingDate = new Date(booking.date);
    const now = new Date();
    const hoursDifference = (bookingDate - now) / (1000 * 60 * 60);
    
    return hoursDifference >= 24;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="text-5xl text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-900">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            My Bookings
          </h1>
          <p className="text-lg text-gray-600">
            View and manage your counseling session bookings
          </p>
        </motion.div>

        {/* Bookings List */}
        {bookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl p-12 text-center"
          >
            <FaCalendarAlt className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              No Bookings Yet
            </h3>
            <p className="text-gray-600 mb-6">
              You haven't booked any sessions yet. Start your mental health journey today!
            </p>
            <a
              href="/"
              className="inline-block px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-purple-800 transition-all transform hover:scale-105 shadow-xl"
            >
              Browse Experts
            </a>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking, index) => (
              <motion.div
                key={booking._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="p-6">
                  {/* Header Row */}
                  <div className="flex flex-wrap items-start justify-between mb-4">
                    <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                      {getStatusIcon(booking.status)}
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {booking.expertName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {booking.expertSpecialization}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(booking.status)}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full bg-gray-100 ${getUrgencyColor(booking.urgency)}`}>
                        {booking.urgency.charAt(0).toUpperCase() + booking.urgency.slice(1)}
                      </span>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center space-x-2 text-gray-900">
                      <FaCalendarAlt className="text-purple-600" />
                      <div>
                        <p className="text-xs text-gray-600">Date</p>
                        <p className="font-semibold">
                          {new Date(booking.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-900">
                      <FaClock className="text-purple-600" />
                      <div>
                        <p className="text-xs text-gray-600">Time</p>
                        <p className="font-semibold">{booking.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-900">
                      <FaUser className="text-purple-600" />
                      <div>
                        <p className="text-xs text-gray-600">Concern</p>
                        <p className="font-semibold">{booking.concernType}</p>
                      </div>
                    </div>
                  </div>

                  {/* Booking Number */}
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <p className="text-xs text-gray-600 mb-1">Booking Number</p>
                    <p className="font-mono font-semibold text-gray-900">
                      {booking.bookingNumber}
                    </p>
                  </div>

                  {/* Message if exists */}
                  {booking.message && (
                    <div className="bg-purple-50 border-l-4 border-purple-600 p-3 mb-4 rounded-r-lg">
                      <p className="text-xs text-purple-600 font-semibold mb-1">Additional Information:</p>
                      <p className="text-sm text-gray-900">{booking.message}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-600">
                      Booked on {new Date(booking.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => navigate(`/booking/${booking.bookingNumber}`)}
                        className="px-4 py-2 bg-purple-500 text-white text-sm font-semibold rounded-lg hover:bg-purple-600 transition-colors flex items-center space-x-2"
                      >
                        <FaEye />
                        <span>View Details</span>
                      </button>
                      {canCancelBooking(booking) && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCancelBooking(booking.bookingNumber);
                          }}
                          disabled={cancellingBookingId === booking.bookingNumber}
                          className="px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {cancellingBookingId === booking.bookingNumber ? (
                            <span className="flex items-center">
                              <FaSpinner className="animate-spin mr-2" />
                              Cancelling...
                            </span>
                          ) : (
                            'Cancel'
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
