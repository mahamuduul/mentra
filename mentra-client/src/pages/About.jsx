import { motion } from 'framer-motion';

const About = () => {
  const team = [
    { name: 'Mental Health Experts', icon: '👨‍⚕️', role: 'Clinical Advisors' },
    { name: 'AI Engineers', icon: '🤖', role: 'Technology Team' },
    { name: 'Counselors', icon: '🧑‍🏫', role: 'Support Staff' },
    { name: 'Researchers', icon: '🔬', role: 'Research Team' },
  ];

  const values = [
    { title: 'Accessibility', description: 'Mental health support should be available to everyone, anytime.', icon: '🌍' },
    { title: 'Privacy', description: 'Your mental health journey is personal and confidential.', icon: '🔒' },
    { title: 'Compassion', description: 'We approach every interaction with empathy and understanding.', icon: '💙' },
    { title: 'Innovation', description: 'Using cutting-edge technology to improve mental wellness.', icon: '🚀' },
  ];

  return (
    <div className="min-h-screen py-20 bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 relative">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full blur-3xl"></div>
        <div className="absolute top-96 right-20 w-96 h-96 bg-purple-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-purple-300 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            About Mentra
          </h1>
          <p className="text-xl text-purple-200 max-w-3xl mx-auto">
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
          <div className="bg-gradient-to-br from-purple-500 to-purple-700 text-white rounded-2xl p-8 shadow-2xl shadow-purple-500/50 border border-purple-400/30">
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
          <h2 className="text-4xl font-bold text-center mb-12 text-white">
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
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-purple-400/30 hover:border-purple-300 hover:shadow-2xl hover:shadow-purple-500/50 transition-all text-center h-full">
                  <div className="text-5xl mb-4">{value.icon}</div>
                  <h3 className="text-xl font-bold mb-3 text-white">
                    {value.title}
                  </h3>
                  <p className="text-purple-200">
                    {value.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div>
          <h2 className="text-4xl font-bold text-center mb-12 text-white">
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
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-purple-400/30 hover:border-purple-300 hover:shadow-2xl hover:shadow-purple-500/50 transition-all text-center">
                  <div className="text-6xl mb-4">{member.icon}</div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    {member.name}
                  </h3>
                  <p className="text-sm text-purple-200">
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
            <div className="bg-gradient-to-br from-green-400 to-emerald-500 text-white rounded-2xl p-6 shadow-2xl shadow-green-500/50 border border-green-400/30 text-center">
              <h3 className="text-5xl font-bold mb-2">10,000+</h3>
              <p className="text-xl">Active Users</p>
            </div>
            <div className="bg-gradient-to-br from-purple-400 to-purple-600 text-white rounded-2xl p-6 shadow-2xl shadow-purple-500/50 border border-purple-400/30 text-center">
              <h3 className="text-5xl font-bold mb-2">50,000+</h3>
              <p className="text-xl">Conversations</p>
            </div>
            <div className="bg-gradient-to-br from-pink-400 to-pink-600 text-white rounded-2xl p-6 shadow-2xl shadow-pink-500/50 border border-pink-400/30 text-center">
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
