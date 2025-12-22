import { motion } from 'framer-motion';
import { FaChartLine, FaClock, FaHeart } from 'react-icons/fa';
import { GiMeditation } from 'react-icons/gi';
import { MdFavorite, MdStars, MdSpa, MdLightbulb } from 'react-icons/md';
import { useLanguage } from '../context/LanguageContext';
import Button from './ui/Button';

const Hero = () => {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200/30 dark:bg-blue-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-200/30 dark:bg-purple-500/10 rounded-full blur-3xl"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left space-y-8"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
            >
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                {t('hero_title')}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-300"
            >
              {t('hero_desc')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button variant="primary" size="lg">
                {t('quick_assessment')}
              </Button>
              <Button variant="secondary" size="lg">
                {t('chat_feeltalk')}
              </Button>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap gap-8 justify-center lg:justify-start pt-8"
            >
              <StatItem number="10k+" label="Active Users" icon={FaHeart} />
              <StatItem number="24/7" label="Support Available" icon={FaClock} />
              <StatItem number="95%" label="Satisfaction Rate" icon={FaChartLine} />
            </motion.div>
          </motion.div>

          {/* Right Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Floating Elements */}
            <div className="relative w-full h-96 lg:h-[500px]">
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-20 blur-2xl"
              />
              
              <motion.div
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 8, 
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              >
                <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <GiMeditation className="text-6xl text-white" />
                </div>
              </motion.div>

              {/* Orbiting Elements */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80"
              >
                <motion.div 
                  whileHover={{ scale: 1.2 }}
                  className="absolute top-0 left-1/2 -translate-x-1/2 bg-green-100 dark:bg-green-900/30 p-4 rounded-full"
                >
                  <MdFavorite className="text-3xl text-green-500" />
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.2 }}
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-yellow-100 dark:bg-yellow-900/30 p-4 rounded-full"
                >
                  <MdStars className="text-3xl text-yellow-500" />
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.2 }}
                  className="absolute left-0 top-1/2 -translate-y-1/2 bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full"
                >
                  <MdSpa className="text-3xl text-blue-500" />
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.2 }}
                  className="absolute right-0 top-1/2 -translate-y-1/2 bg-purple-100 dark:bg-purple-900/30 p-4 rounded-full"
                >
                  <MdLightbulb className="text-3xl text-purple-500" />
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2 text-gray-500 dark:text-gray-400">
          <span className="text-sm">Scroll to explore</span>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </motion.div>
    </section>
  );
};

const StatItem = ({ number, label, icon: Icon }) => (
  <div className="text-center">
    <div className="flex items-center justify-center gap-2 mb-1">
      {Icon && <Icon className="text-2xl text-blue-600 dark:text-blue-400" />}
      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{number}</div>
    </div>
    <div className="text-sm text-gray-600 dark:text-gray-400">{label}</div>
  </div>
);

export default Hero;
