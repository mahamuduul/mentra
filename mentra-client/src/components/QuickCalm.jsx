import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GiMeditation } from 'react-icons/gi';
import { useLanguage } from '../context/LanguageContext';

const QuickCalm = () => {
  const { t } = useLanguage();
  const [isBreathingIn, setIsBreathingIn] = useState(true);
  const [count, setCount] = useState(4);

  useEffect(() => {
    const breathingCycle = setInterval(() => {
      setCount((prev) => {
        if (prev === 1) {
          setIsBreathingIn((current) => !current);
          return 4;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(breathingCycle);
  }, []);

  return (
    <section className="py-20 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-block mb-4">
            <div className="flex items-center justify-center space-x-2 bg-purple-700/50 text-purple-100 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
              <span className="text-2xl">🧘</span>
              <span>Relaxation Exercise</span>
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            <span className="text-purple-300">
              Quick Calm
            </span>
          </h2>
          <p className="text-xl text-purple-200">
            Take a moment to breathe and center yourself
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-md rounded-3xl border border-purple-400/30 hover:border-purple-300 transition-all duration-300 shadow-2xl shadow-purple-500/50">
          <div className="flex flex-col items-center justify-center space-y-8 py-12 px-8">
            {/* Breathing Circle */}
            <div className="relative w-64 h-64 flex items-center justify-center">
              <motion.div
                animate={{
                  scale: isBreathingIn ? [1, 1.5] : [1.5, 1],
                  opacity: isBreathingIn ? [0.5, 1] : [1, 0.5],
                }}
                transition={{
                  duration: 4,
                  ease: "easeInOut",
                }}
                className="absolute w-48 h-48 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 blur-xl"
              />
              
              <motion.div
                animate={{
                  scale: isBreathingIn ? [1, 1.3] : [1.3, 1],
                }}
                transition={{
                  duration: 4,
                  ease: "easeInOut",
                }}
                className="relative z-10 w-40 h-40 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-2xl"
              >
                <GiMeditation className="text-6xl text-white" />
              </motion.div>

              {/* Pulse Rings */}
              <motion.div
                animate={{
                  scale: [1, 2, 2],
                  opacity: [0.5, 0.2, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
                className="absolute w-40 h-40 rounded-full border-4 border-purple-400"
              />
            </div>

            {/* Breathing Instructions */}
            <AnimatePresence mode="wait">
              <motion.div
                key={isBreathingIn ? 'in' : 'out'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center space-y-4"
              >
                <h3 className="text-3xl font-bold text-white">
                  {isBreathingIn ? t('breathe_in') : t('breathe_out')}
                </h3>
                <div className="text-6xl font-bold text-purple-300">
                  {count}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Progress Bar */}
            <div className="w-full max-w-xs bg-purple-900/50 rounded-full h-2 overflow-hidden border border-purple-400/30">
              <motion.div
                animate={{
                  width: isBreathingIn ? ['0%', '100%'] : ['100%', '0%'],
                }}
                transition={{
                  duration: 4,
                  ease: "linear",
                }}
                className="h-full bg-gradient-to-r from-purple-400 to-purple-600"
              />
            </div>

            <p className="text-center text-purple-200 max-w-md">
              Follow the breathing pattern to reduce stress and anxiety. Inhale deeply for 4 seconds, then exhale slowly for 4 seconds.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuickCalm;
