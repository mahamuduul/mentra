import { motion } from 'framer-motion';
import { FaPhoneAlt, FaComments, FaExclamationTriangle } from 'react-icons/fa';

const CrisisSupport = () => {

  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <div className="flex items-center justify-center space-x-2 bg-purple-700/50 text-purple-100 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
              <span className="text-2xl">🆘</span>
              <span>Crisis Support</span>
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Need Help?
            <span className="block text-purple-300">You're Not Alone</span>
          </h2>
          <p className="text-xl text-purple-200 max-w-3xl mx-auto">
            If you're experiencing a mental health crisis or need immediate support, 
            professional help is available 24/7.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-3xl overflow-hidden border border-purple-400/30 hover:border-purple-300 transition-all duration-300 shadow-2xl shadow-purple-500/50"
        >
          {/* Top Decorative Section */}
          <div className="relative h-40 bg-gradient-to-br from-purple-600/80 to-purple-800/80 overflow-hidden">
            {/* Decorative Pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full translate-x-20 translate-y-20"></div>
            </div>
          </div>

          {/* Icon - Positioned between sections */}
          <div className="flex justify-center -mt-16 mb-8 z-10">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="relative"
            >
              <div className="w-32 h-32 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center">
                <FaExclamationTriangle className="text-6xl text-white" />
              </div>
            </motion.div>
          </div>

          {/* Content Section */}
          <div className="px-8 pb-8 text-center">
            <p className="text-lg text-purple-100 mb-8 max-w-2xl mx-auto">
              You don't have to face this alone. Our crisis support team and professional counselors are here to help you right now.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button className="px-8 py-4 bg-gradient-to-r from-purple-500 to-purple-700 text-white font-bold rounded-xl hover:from-purple-600 hover:to-purple-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/50 flex items-center justify-center space-x-2">
                <FaPhoneAlt className="text-xl" /> 
                <span>Call Crisis Helpline</span>
              </button>
              <button className="px-8 py-4 bg-purple-700/30 border-2 border-purple-400/50 text-white font-bold rounded-xl hover:bg-purple-700/40 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 backdrop-blur-sm">
                <FaComments className="text-xl" /> 
                <span>Chat with Support</span>
              </button>
            </div>

            <div className="pt-6 border-t border-purple-400/30">
              <p className="text-purple-200">
                National Crisis Helpline: <strong className="font-bold text-white">1-800-273-8255</strong>
              </p>
              <p className="text-sm text-purple-300 mt-2">
                Available 24/7 • Free & Confidential
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CrisisSupport;
