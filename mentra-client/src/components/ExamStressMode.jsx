import { useState } from 'react';
import { motion } from 'framer-motion';
import Card from './ui/Card';

const ExamStressMode = () => {
  const [isActive, setIsActive] = useState(false);

  return (
    <section className={`py-16 transition-all duration-500 ${
      isActive 
        ? 'bg-gradient-to-r from-blue-500 to-indigo-600' 
        : 'bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card glass={isActive} className={isActive ? 'border-2 border-white/30' : ''}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-4xl">📚</span>
                <h3 className={`text-2xl md:text-3xl font-bold ${
                  isActive ? 'text-white' : 'text-gray-900 dark:text-white'
                }`}>
                  Exam Stress Mode
                </h3>
              </div>
              <p className={`text-lg ${
                isActive ? 'text-white/90' : 'text-gray-600 dark:text-gray-400'
              }`}>
                {isActive 
                  ? '🎯 Focus Mode Activated! You\'ve got this! Stay calm and confident.' 
                  : 'Activate focus theme with calming colors and motivational reminders'
                }
              </p>
            </div>

            {/* Toggle Switch */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsActive(!isActive)}
              className={`relative w-20 h-10 rounded-full transition-colors duration-300 ${
                isActive ? 'bg-white/30' : 'bg-gray-300 dark:bg-gray-700'
              }`}
            >
              <motion.div
                animate={{ x: isActive ? 40 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className={`absolute top-1 left-1 w-8 h-8 rounded-full shadow-lg ${
                  isActive 
                    ? 'bg-white' 
                    : 'bg-gray-500 dark:bg-gray-400'
                }`}
              />
            </motion.button>
          </div>

          {/* Active State Tips */}
          {isActive && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 pt-6 border-t border-white/20"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <TipCard icon="🧘" text="Take deep breaths" />
                <TipCard icon="💧" text="Stay hydrated" />
                <TipCard icon="⏰" text="Take short breaks" />
              </div>
            </motion.div>
          )}
        </Card>
      </div>
    </section>
  );
};

const TipCard = ({ icon, text }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-lg p-3"
  >
    <span className="text-2xl">{icon}</span>
    <span className="text-white font-medium">{text}</span>
  </motion.div>
);

export default ExamStressMode;
