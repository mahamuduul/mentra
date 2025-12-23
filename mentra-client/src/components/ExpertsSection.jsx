import { useState } from 'react';
import { FaUserMd, FaBrain, FaHeart, FaCalendarCheck, FaStar, FaMars, FaVenus } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import GenderProtectedSection from './GenderProtectedSection';
import { Link } from 'react-router-dom';
import BookingModal from './BookingModal';

const ExpertsSection = () => {
  const { user, isAuthenticated } = useAuth();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState(null);

  // Get gender from either user.gender or user.profile.gender
  const userGender = user?.gender || user?.profile?.gender;
  const normalizedGender = userGender ? userGender.charAt(0).toUpperCase() + userGender.slice(1).toLowerCase() : null;

  // Force refresh user data
  const handleForceRefresh = () => {
    localStorage.removeItem('mentra_user');
    window.location.reload();
  };

  // Male Support Experts
  const maleExperts = [
    {
      id: 1,
      name: 'Dr. James Anderson',
      designation: 'Men\'s Mental Health Specialist',
      specialization: 'Men\'s Stress & Performance',
      experience: '20+ years',
      patientsHelped: 3200,
      rating: 4.8,
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      availability: 'Available',
      expertise: ['Performance Anxiety', 'Work Stress', 'Men\'s Health'],
      gender: 'Male',
    },
    {
      id: 2,
      name: 'Dr. Michael Roberts',
      designation: 'Psychiatrist',
      specialization: 'Depression & Anxiety in Men',
      experience: '18+ years',
      patientsHelped: 2900,
      rating: 5.0,
      image: 'https://randomuser.me/api/portraits/men/52.jpg',
      availability: 'Available',
      expertise: ['Depression', 'Anxiety', 'Emotional Health'],
      gender: 'Male',
    },
    {
      id: 3,
      name: 'Dr. David Lee',
      designation: 'Addiction & Recovery Specialist',
      specialization: 'Substance Abuse & Men\'s Recovery',
      experience: '16+ years',
      patientsHelped: 2100,
      rating: 4.8,
      image: 'https://randomuser.me/api/portraits/men/75.jpg',
      availability: 'Available',
      expertise: ['Addiction', 'Recovery', 'Relapse Prevention'],
      gender: 'Male',
    },
  ];

  // Female Support Experts
  const femaleExperts = [
    {
      id: 4,
      name: 'Dr. Sarah Mitchell',
      designation: 'Women\'s Mental Health Specialist',
      specialization: 'Women\'s Anxiety & Depression',
      experience: '15+ years',
      patientsHelped: 2400,
      rating: 4.9,
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
      availability: 'Available',
      expertise: ['Hormonal Changes', 'Life Transitions', 'Self-Care'],
      gender: 'Female',
    },
    {
      id: 5,
      name: 'Dr. Emily Chen',
      designation: 'Women\'s Wellness Therapist',
      specialization: 'Postpartum & Family Support',
      experience: '12+ years',
      patientsHelped: 1800,
      rating: 4.9,
      image: 'https://randomuser.me/api/portraits/women/68.jpg',
      availability: 'Available',
      expertise: ['Postpartum Care', 'Family Balance', 'Emotional Support'],
      gender: 'Female',
    },
    {
      id: 6,
      name: 'Dr. Priya Sharma',
      designation: 'Women\'s Mental Health Counselor',
      specialization: 'Stress & Self-Esteem',
      experience: '10+ years',
      patientsHelped: 1500,
      rating: 4.7,
      image: 'https://randomuser.me/api/portraits/women/90.jpg',
      availability: 'Available',
      expertise: ['Self-Esteem', 'Work-Life Balance', 'Confidence Building'],
      gender: 'Female',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const handleBookSession = (expert) => {
    setSelectedExpert(expert);
    setIsBookingModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsBookingModalOpen(false);
    setSelectedExpert(null);
  };

  // Render expert card
  const renderExpertCard = (expert) => (
    <motion.div
      key={expert.id}
      variants={cardVariants}
      className="relative group"
    >
      {/* Unique Card Design with Hexagonal Top */}
      <div className="bg-white rounded-3xl overflow-hidden border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 hover:shadow-xl hover:shadow-purple-200 flex flex-col h-full">
        
        {/* Top Section - Image with Decorative Shape */}
        <div className="relative h-40 overflow-hidden bg-gradient-to-br from-purple-600 to-purple-800">
          {/* Decorative Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full translate-x-20 translate-y-20"></div>
          </div>
          {/* Gender Icon */}
          <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            {expert.gender === 'Male' ? (
              <FaMars className="text-white text-xl" />
            ) : (
              <FaVenus className="text-white text-xl" />
            )}
          </div>
        </div>
        
        {/* Doctor Image - Positioned between sections */}
        <div className="flex justify-center -mt-16 mb-4 z-10">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-white shadow-2xl overflow-hidden group-hover:scale-110 transition-transform duration-300 bg-white">
              <img
                src={expert.image}
                alt={expert.name}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Availability Badge on Image */}
            <div className="absolute -top-2 -right-2">
              <span
                className={`flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold shadow-lg ${
                  expert.availability === 'Available'
                    ? 'bg-green-500 text-white'
                    : 'bg-amber-500 text-white'
                }`}
              >
                {expert.availability}
              </span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 flex flex-col px-6 pb-6">
          {/* Name & Title */}
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {expert.name}
            </h3>
            <p className="text-purple-600 font-semibold text-sm mb-1">
              {expert.designation}
            </p>
            <p className="text-gray-600 text-sm">
              {expert.specialization}
            </p>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-purple-50 rounded-xl p-3 text-center border border-purple-200">
              <div className="flex items-center justify-center text-yellow-500 mb-1">
                <FaStar className="text-sm" />
              </div>
              <p className="text-gray-900 font-bold text-lg">{expert.rating}</p>
              <p className="text-gray-600 text-xs">Rating</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-3 text-center border border-purple-200">
              <div className="flex items-center justify-center text-purple-600 mb-1">
                <FaHeart className="text-sm" />
              </div>
              <p className="text-gray-900 font-bold text-lg">{expert.patientsHelped}+</p>
              <p className="text-gray-600 text-xs">Patients</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-3 text-center border border-purple-200">
              <div className="flex items-center justify-center text-purple-600 mb-1">
                <FaBrain className="text-sm" />
              </div>
              <p className="text-gray-900 font-bold text-sm">{expert.experience.replace('+ years', '+')}</p>
              <p className="text-gray-600 text-xs">Years</p>
            </div>
          </div>

          {/* Expertise Tags */}
          <div className="flex flex-wrap gap-2 mb-4 justify-center">
            {expert.expertise.slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium border border-purple-300"
              >
                {skill}
              </span>
            ))}
          </div>

          {/* Spacer to push button to bottom */}
          <div className="flex-1"></div>

          {/* Book Session Button - Always at bottom */}
          <button 
            onClick={() => handleBookSession(expert)}
            className="w-full py-3.5 font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2 mt-auto bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white hover:shadow-purple-500/50"
          >
            <FaCalendarCheck className="text-lg" />
            <span>Book Live Session</span>
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <section className="py-12 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Show login prompt if not authenticated */}
        {!isAuthenticated ? (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-block mb-4">
              <div className="flex items-center justify-center space-x-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium">
                <FaUserMd className="text-lg" />
                <span>Licensed Professionals</span>
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Meet Our Mental Health
              <span className="block text-purple-600">
                Experts
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Book a live session with our experienced doctors and therapists. 
              Get personalized care from certified professionals who truly understand.
            </p>
            <div className="bg-purple-50 border-2 border-purple-300 rounded-2xl p-8 max-w-2xl mx-auto">
              <p className="text-gray-900 text-lg font-medium mb-4">
                Please login to access personalized mental health support
              </p>
              <p className="text-gray-700">
                Our experts provide specialized care tailored to your needs
              </p>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Show message if gender not set */}
            {!normalizedGender ? (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl mx-auto mb-16"
              >
                <div className="bg-yellow-500/20 border-2 border-yellow-400/50 rounded-2xl p-8 backdrop-blur-sm text-center">
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Profile Incomplete
                  </h3>
                  <p className="text-yellow-200 text-lg mb-6">
                    Please update your profile with gender information to access personalized mental health support sections.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link 
                      to="/profile" 
                      className="inline-block px-8 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
                    >
                      Update Profile
                    </Link>
                    <button
                      onClick={handleForceRefresh}
                      className="inline-block px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
                    >
                      Refresh Data
                    </button>
                  </div>
                  <p className="text-yellow-300 text-sm mt-4">
                    Already updated? Click "Refresh Data" to reload your profile.
                  </p>
                </div>
              </motion.div>
            ) : (
              <>
            {/* Male Support Section */}
            <GenderProtectedSection 
              allowedGenders={['Male']}
              showFallback={false}
            >
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-16"
              >
                <div className="text-center mb-12">
                  <div className="inline-block mb-4">
                    <div className="flex items-center justify-center space-x-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium">
                      <FaUserMd className="text-lg" />
                      <span>Men&apos;s Mental Health Support</span>
                    </div>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
                    Your Dedicated
                    <span className="block text-purple-600">
                      Male Support Experts
                    </span>
                  </h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Specialized mental health professionals who understand men&apos;s unique challenges and provide tailored support.
                  </p>
                </div>

                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  {maleExperts.map((expert) => renderExpertCard(expert))}
                </motion.div>

                {/* Male-specific CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="text-center mt-12"
                >
                  <div className="bg-purple-50 rounded-2xl p-8 border-2 border-purple-200">
                    <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">
                      Explore Men's Mental Health Tools
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                      Access specialized resources, assessment tools, and guidance designed specifically for men's mental health needs.
                    </p>
                    <Link to="/male-mental-health-tools">
                      <button className="px-8 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                        View Men's Tools
                      </button>
                    </Link>
                  </div>
                </motion.div>
              </motion.div>
            </GenderProtectedSection>

            {/* Female Support Section */}
            <GenderProtectedSection 
              allowedGenders={['Female']}
              showFallback={false}
            >
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-16"
              >
                <div className="text-center mb-12">
                  <div className="inline-block mb-4">
                    <div className="flex items-center justify-center space-x-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium">
                      <FaUserMd className="text-lg" />
                      <span>Women&apos;s Mental Health Support</span>
                    </div>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
                    Your Dedicated
                    <span className="block text-purple-600">
                      Female Support Experts
                    </span>
                  </h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Specialized mental health professionals who understand women&apos;s unique challenges and provide compassionate care.
                  </p>
                </div>

                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  {femaleExperts.map((expert) => renderExpertCard(expert))}
                </motion.div>

                {/* Female-specific CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="text-center mt-12"
                >
                  <div className="bg-purple-50 rounded-2xl p-8 border-2 border-purple-200">
                    <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">
                      Explore Women's Mental Health Tools
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                      Access specialized resources, assessment tools, and guidance designed specifically for women's mental health needs.
                    </p>
                    <Link to="/female-tools">
                      <button className="px-8 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                        View Women's Tools
                      </button>
                    </Link>
                  </div>
                </motion.div>
              </motion.div>
            </GenderProtectedSection>
              </>
            )}
          </>
        )}
      </div>

      {/* Booking Modal */}
      <BookingModal 
        isOpen={isBookingModalOpen}
        onClose={handleCloseModal}
        expert={selectedExpert}
      />
    </section>
  );
};

export default ExpertsSection;
