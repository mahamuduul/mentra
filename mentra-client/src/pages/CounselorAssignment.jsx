import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { 
  FaUserMd, 
  FaCalendarAlt, 
  FaStar, 
  FaShieldAlt, 
  FaMars, 
  FaVenus,
  FaClock,
  FaVideo,
  FaComments,
  FaPhone,
  FaCheckCircle
} from 'react-icons/fa';
import GenderProtectedSection from '../components/GenderProtectedSection';

const CounselorAssignment = () => {
  const { user, isAuthenticated } = useAuth();
  const [selectedCounselor, setSelectedCounselor] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Male Counselors - Only accessible to male users
  const maleCounselors = [
    {
      id: 'M1',
      name: 'Dr. Robert Thompson',
      title: 'Licensed Clinical Psychologist',
      gender: 'Male',
      specializations: ['Men\'s Mental Health', 'Career Stress', 'Relationship Issues'],
      experience: 15,
      rating: 4.9,
      totalSessions: 2500,
      availability: 'Available Today',
      image: 'https://randomuser.me/api/portraits/men/45.jpg',
      languages: ['English', 'Spanish'],
      sessionTypes: ['Video Call', 'Audio Call', 'Chat'],
      nextAvailable: 'Today at 2:00 PM',
      bio: 'Specialized in helping men navigate stress, career challenges, and emotional wellness with practical strategies.',
      credentials: ['PhD in Clinical Psychology', 'Licensed Therapist (15 years)', 'Certified in CBT'],
    },
    {
      id: 'M2',
      name: 'Dr. Marcus Johnson',
      title: 'Men\'s Behavioral Health Specialist',
      gender: 'Male',
      specializations: ['Depression', 'Anxiety', 'Anger Management'],
      experience: 12,
      rating: 4.8,
      totalSessions: 1800,
      availability: 'Available Tomorrow',
      image: 'https://randomuser.me/api/portraits/men/67.jpg',
      languages: ['English'],
      sessionTypes: ['Video Call', 'Audio Call'],
      nextAvailable: 'Tomorrow at 10:00 AM',
      bio: 'Focused on evidence-based approaches to help men overcome depression, anxiety, and behavioral challenges.',
      credentials: ['MD in Psychiatry', 'Board Certified', 'Trauma-Informed Care'],
    },
    {
      id: 'M3',
      name: 'Dr. David Martinez',
      title: 'Men\'s Wellness Counselor',
      gender: 'Male',
      specializations: ['Work-Life Balance', 'Performance Anxiety', 'Self-Esteem'],
      experience: 10,
      rating: 4.9,
      totalSessions: 1500,
      availability: 'Available Today',
      image: 'https://randomuser.me/api/portraits/men/23.jpg',
      languages: ['English', 'French'],
      sessionTypes: ['Video Call', 'Chat'],
      nextAvailable: 'Today at 4:00 PM',
      bio: 'Helping men achieve better work-life balance and overcome performance-related stress.',
      credentials: ['Masters in Counseling', 'Licensed Professional Counselor', 'Mindfulness Certified'],
    },
    {
      id: 'M4',
      name: 'Dr. James Wilson',
      title: 'Addiction & Recovery Specialist',
      gender: 'Male',
      specializations: ['Substance Abuse', 'Recovery Support', 'Relapse Prevention'],
      experience: 18,
      rating: 5.0,
      totalSessions: 3200,
      availability: 'Available This Week',
      image: 'https://randomuser.me/api/portraits/men/89.jpg',
      languages: ['English'],
      sessionTypes: ['Video Call', 'Audio Call', 'Chat'],
      nextAvailable: 'Wednesday at 11:00 AM',
      bio: 'Specialized in addiction recovery with compassionate, non-judgmental support for men in recovery.',
      credentials: ['PhD in Clinical Psychology', 'Addiction Specialist', 'Recovery Coach'],
    },
  ];

  // Female Counselors - Only accessible to female users
  const femaleCounselors = [
    {
      id: 'F1',
      name: 'Dr. Sarah Mitchell',
      title: 'Women\'s Mental Health Specialist',
      gender: 'Female',
      specializations: ['Women\'s Health', 'Hormonal Changes', 'Life Transitions'],
      experience: 14,
      rating: 4.9,
      totalSessions: 2200,
      availability: 'Available Today',
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
      languages: ['English', 'German'],
      sessionTypes: ['Video Call', 'Audio Call', 'Chat'],
      nextAvailable: 'Today at 1:00 PM',
      bio: 'Compassionate support for women through all life stages, from hormonal changes to major life transitions.',
      credentials: ['PhD in Psychology', 'Women\'s Health Specialist', 'Certified Therapist'],
    },
    {
      id: 'F2',
      name: 'Dr. Emily Chen',
      title: 'Maternal Mental Health Counselor',
      gender: 'Female',
      specializations: ['Postpartum Depression', 'Pregnancy Anxiety', 'Family Planning'],
      experience: 11,
      rating: 5.0,
      totalSessions: 1900,
      availability: 'Available Today',
      image: 'https://randomuser.me/api/portraits/women/68.jpg',
      languages: ['English', 'Mandarin'],
      sessionTypes: ['Video Call', 'Chat'],
      nextAvailable: 'Today at 3:00 PM',
      bio: 'Specialized in supporting mothers through pregnancy, postpartum, and parenting challenges.',
      credentials: ['Masters in Clinical Psychology', 'Perinatal Mental Health Certified', 'Licensed Therapist'],
    },
    {
      id: 'F3',
      name: 'Dr. Priya Sharma',
      title: 'Women\'s Wellness & Self-Esteem Coach',
      gender: 'Female',
      specializations: ['Self-Esteem', 'Body Image', 'Confidence Building'],
      experience: 9,
      rating: 4.8,
      totalSessions: 1400,
      availability: 'Available Tomorrow',
      image: 'https://randomuser.me/api/portraits/women/90.jpg',
      languages: ['English', 'Hindi'],
      sessionTypes: ['Video Call', 'Audio Call', 'Chat'],
      nextAvailable: 'Tomorrow at 9:00 AM',
      bio: 'Empowering women to build confidence, positive body image, and strong self-worth.',
      credentials: ['Masters in Counseling Psychology', 'Body Positive Therapist', 'Certified Life Coach'],
    },
    {
      id: 'F4',
      name: 'Dr. Amanda Rodriguez',
      title: 'Relationship & Family Therapist',
      gender: 'Female',
      specializations: ['Relationship Issues', 'Family Dynamics', 'Communication'],
      experience: 16,
      rating: 4.9,
      totalSessions: 2800,
      availability: 'Available This Week',
      image: 'https://randomuser.me/api/portraits/women/32.jpg',
      languages: ['English', 'Spanish'],
      sessionTypes: ['Video Call', 'Audio Call'],
      nextAvailable: 'Thursday at 2:00 PM',
      bio: 'Helping women navigate complex relationship dynamics and strengthen family connections.',
      credentials: ['PhD in Family Therapy', 'Licensed Marriage Counselor', 'Certified Mediator'],
    },
  ];

  const handleBookSession = (counselor) => {
    setSelectedCounselor(counselor);
    setShowBookingModal(true);
  };

  const CounselorCard = ({ counselor }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-400 transition-all duration-300 hover:shadow-2xl"
    >
      {/* Header with Gender Indicator */}
      <div className={`h-32 relative ${
        counselor.gender === 'Male' 
          ? 'bg-gradient-to-br from-blue-500 to-blue-700' 
          : 'bg-gradient-to-br from-pink-500 to-pink-700'
      }`}>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full transform translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full transform -translate-x-12 translate-y-12"></div>
        </div>
        
        {/* Gender Badge */}
        <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2">
          {counselor.gender === 'Male' ? (
            <><FaMars className="text-white" /> <span className="text-white text-sm font-semibold">Male Counselor</span></>
          ) : (
            <><FaVenus className="text-white" /> <span className="text-white text-sm font-semibold">Female Counselor</span></>
          )}
        </div>

        {/* Availability Badge */}
        <div className="absolute bottom-4 left-4 bg-green-500 text-white px-4 py-1 rounded-full text-xs font-semibold flex items-center gap-2">
          <FaClock className="text-xs" />
          {counselor.availability}
        </div>
      </div>

      {/* Profile Image */}
      <div className="flex justify-center -mt-16 px-6">
        <div className="relative">
          <img
            src={counselor.image}
            alt={counselor.name}
            className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-xl object-cover"
          />
          <div className="absolute bottom-0 right-0 bg-yellow-400 rounded-full p-2 border-2 border-white dark:border-gray-800">
            <FaStar className="text-yellow-900 text-sm" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-4 space-y-4">
        {/* Name & Title */}
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{counselor.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{counselor.title}</p>
          <div className="flex items-center justify-center gap-4 mt-2">
            <div className="flex items-center gap-1 text-yellow-500">
              <FaStar className="text-sm" />
              <span className="text-sm font-semibold">{counselor.rating}</span>
            </div>
            <span className="text-gray-400">•</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">{counselor.experience} years exp.</span>
            <span className="text-gray-400">•</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">{counselor.totalSessions}+ sessions</span>
          </div>
        </div>

        {/* Bio */}
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center line-clamp-2">
          {counselor.bio}
        </p>

        {/* Specializations */}
        <div>
          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Specializations:</p>
          <div className="flex flex-wrap gap-2">
            {counselor.specializations.map((spec, idx) => (
              <span
                key={idx}
                className={`text-xs px-3 py-1 rounded-full font-medium ${
                  counselor.gender === 'Male'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                    : 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300'
                }`}
              >
                {spec}
              </span>
            ))}
          </div>
        </div>

        {/* Session Types */}
        <div className="flex items-center justify-center gap-4 py-2">
          {counselor.sessionTypes.includes('Video Call') && (
            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
              <FaVideo className="text-sm" />
              <span className="text-xs">Video</span>
            </div>
          )}
          {counselor.sessionTypes.includes('Audio Call') && (
            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
              <FaPhone className="text-sm" />
              <span className="text-xs">Audio</span>
            </div>
          )}
          {counselor.sessionTypes.includes('Chat') && (
            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
              <FaComments className="text-sm" />
              <span className="text-xs">Chat</span>
            </div>
          )}
        </div>

        {/* Next Available */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-600 dark:text-gray-400">Next Available:</p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">{counselor.nextAvailable}</p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={() => handleBookSession(counselor)}
            className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 ${
              counselor.gender === 'Male'
                ? 'bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800'
                : 'bg-gradient-to-r from-pink-500 to-pink-700 hover:from-pink-600 hover:to-pink-800'
            }`}
          >
            <FaCalendarAlt />
            Book Session
          </button>
          <button className="w-full py-2 border-2 border-gray-300 dark:border-gray-600 rounded-xl font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300">
            View Full Profile
          </button>
        </div>
      </div>
    </motion.div>
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 border-2 border-gray-200 dark:border-gray-700"
          >
            <FaShieldAlt className="text-6xl text-purple-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Counselor Assignment System
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              Our secure, gender-matched counselor system ensures you&apos;re connected with the right professional for your needs.
            </p>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-400 dark:border-yellow-600 rounded-xl p-6 mb-6">
              <p className="text-yellow-800 dark:text-yellow-300 font-medium">
                🔒 Please log in to access gender-matched counselor assignments
              </p>
            </div>
            <ul className="text-left space-y-3 mb-6">
              <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <FaCheckCircle className="text-green-500" />
                <span>Gender-matched counselor pairing for comfort and privacy</span>
              </li>
              <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <FaCheckCircle className="text-green-500" />
                <span>Licensed professionals with specialized expertise</span>
              </li>
              <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <FaCheckCircle className="text-green-500" />
                <span>Flexible session formats: Video, Audio, or Chat</span>
              </li>
              <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <FaCheckCircle className="text-green-500" />
                <span>100% confidential and secure platform</span>
              </li>
            </ul>
            <button className="px-8 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
              Login to Get Matched
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-block mb-4">
            <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-medium">
              <FaUserMd />
              <span>Gender-Matched Counselor Assignment</span>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Your Assigned Counselors
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            We&apos;ve carefully matched you with licensed counselors of your gender to ensure comfort, 
            privacy, and the best therapeutic relationship.
          </p>
        </motion.div>

        {/* Privacy Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-700 rounded-xl p-6 mb-12 max-w-4xl mx-auto"
        >
          <div className="flex items-start gap-4">
            <FaShieldAlt className="text-blue-600 dark:text-blue-400 text-2xl flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Privacy & Gender-Based Matching
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Based on your profile, you have access to {user?.gender === 'Male' ? 'male' : 'female'} counselors only. 
                This ensures a comfortable and safe therapeutic environment. All sessions are 100% confidential and HIPAA-compliant.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Male Counselors Section */}
        <GenderProtectedSection
          allowedGenders={['Male']}
          fallbackMessage="Access to male counselors is restricted. Your assigned female counselors are available above."
          showFallback={false}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-16"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full">
                <FaMars className="text-lg" />
                <span className="font-semibold">Your Male Counselors</span>
              </div>
              <div className="h-0.5 flex-1 bg-gradient-to-r from-blue-300 to-transparent"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {maleCounselors.map((counselor) => (
                <CounselorCard key={counselor.id} counselor={counselor} />
              ))}
            </div>
          </motion.div>
        </GenderProtectedSection>

        {/* Female Counselors Section */}
        <GenderProtectedSection
          allowedGenders={['Female']}
          fallbackMessage="Access to female counselors is restricted. Your assigned male counselors are available above."
          showFallback={false}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-16"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="flex items-center gap-2 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 px-4 py-2 rounded-full">
                <FaVenus className="text-lg" />
                <span className="font-semibold">Your Female Counselors</span>
              </div>
              <div className="h-0.5 flex-1 bg-gradient-to-r from-pink-300 to-transparent"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {femaleCounselors.map((counselor) => (
                <CounselorCard key={counselor.id} counselor={counselor} />
              ))}
            </div>
          </motion.div>
        </GenderProtectedSection>

        {/* How It Works Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border-2 border-gray-200 dark:border-gray-700"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            How Our Counselor Assignment Works
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Gender Matching</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                You&apos;re automatically matched with counselors of your registered gender for comfort and privacy.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Choose Your Counselor</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Browse profiles, specializations, and availability to find the perfect match for your needs.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Book & Connect</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Schedule your session with your preferred format: video, audio, or chat. All sessions are confidential.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Booking Modal (Simplified) */}
      {showBookingModal && selectedCounselor && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full p-8"
          >
            <div className="text-center mb-6">
              <img
                src={selectedCounselor.image}
                alt={selectedCounselor.name}
                className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-purple-500"
              />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Book Session with {selectedCounselor.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{selectedCounselor.title}</p>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Next Available:</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedCounselor.nextAvailable}</p>
              </div>
              
              <div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Select Session Type:</p>
                <div className="grid grid-cols-3 gap-3">
                  {selectedCounselor.sessionTypes.map((type) => (
                    <button
                      key={type}
                      className="py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:border-purple-500 dark:hover:border-purple-400 transition-all"
                    >
                      <div className="flex flex-col items-center gap-2">
                        {type === 'Video Call' && <FaVideo className="text-xl" />}
                        {type === 'Audio Call' && <FaPhone className="text-xl" />}
                        {type === 'Chat' && <FaComments className="text-xl" />}
                        <span className="text-sm font-medium">{type}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={() => setShowBookingModal(false)}
                className="flex-1 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
              >
                Cancel
              </button>
              <button
                className={`flex-1 py-3 rounded-xl font-semibold text-white transition-all ${
                  selectedCounselor.gender === 'Male'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800'
                    : 'bg-gradient-to-r from-pink-500 to-pink-700 hover:from-pink-600 hover:to-pink-800'
                }`}
              >
                Confirm Booking
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CounselorAssignment;
