import { motion } from 'framer-motion';
import { FaUserMd, FaRobot, FaChalkboardTeacher, FaMicroscope, FaGlobe, FaLock, FaHeart, FaRocket } from 'react-icons/fa';

const About = () => {
  const team = [
    { name: 'Mental Health Experts', icon: FaUserMd, role: 'Clinical Advisors' },
    { name: 'AI Engineers', icon: FaRobot, role: 'Technology Team' },
    { name: 'Counselors', icon: FaChalkboardTeacher, role: 'Support Staff' },
    { name: 'Researchers', icon: FaMicroscope, role: 'Research Team' },
  ];

  const values = [
    { title: 'Accessibility', description: 'Mental health support should be available to everyone, anytime.', icon: FaGlobe },
    { title: 'Privacy', description: 'Your mental health journey is personal and confidential.', icon: FaLock },
    { title: 'Compassion', description: 'We approach every interaction with empathy and understanding.', icon: FaHeart },
    { title: 'Innovation', description: 'Using cutting-edge technology to improve mental wellness.', icon: FaRocket },
  ];

  return (
    <div className="min-h-screen py-12 bg-white relative">      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
            About Mentra
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Empowering minds, one conversation at a time
          </p>
        </motion.div>

        {/* Mission */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-20"
        >
          <div className="bg-gradient-to-br from-purple-600 to-purple-800 text-white rounded-2xl p-8 shadow-xl border-2 border-purple-200">
            <div className="text-center space-y-6 py-8">
              <h2 className="text-4xl font-bold">Our Mission</h2>
              <p className="text-xl max-w-3xl mx-auto opacity-90">
                At Mentra, we believe that mental health support should be accessible, 
                affordable, and available whenever you need it. We combine cutting-edge 
                AI technology with evidence-based mental health practices to provide 
                compassionate support to everyone, everywhere.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Values */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <div className="bg-white rounded-2xl p-6 border-2 border-purple-200 hover:border-purple-500 hover:shadow-xl transition-all text-center h-full">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center">
                    <value.icon className="text-3xl text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">
                    {value.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div>
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <div className="bg-white rounded-2xl p-6 border-2 border-purple-200 hover:border-purple-500 hover:shadow-xl transition-all text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-xl bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center">
                    <member.icon className="text-4xl text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {member.role}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-20"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-purple-600 to-purple-800 text-white rounded-2xl p-6 shadow-xl border-2 border-purple-200 text-center">
              <h3 className="text-5xl font-bold mb-2">10,000+</h3>
              <p className="text-xl">Active Users</p>
            </div>
            <div className="bg-gradient-to-br from-purple-600 to-purple-800 text-white rounded-2xl p-6 shadow-xl border-2 border-purple-200 text-center">
              <h3 className="text-5xl font-bold mb-2">50,000+</h3>
              <p className="text-xl">Conversations</p>
            </div>
            <div className="bg-gradient-to-br from-purple-600 to-purple-800 text-white rounded-2xl p-6 shadow-xl border-2 border-purple-200 text-center">
              <h3 className="text-5xl font-bold mb-2">95%</h3>
              <p className="text-xl">Satisfaction Rate</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
