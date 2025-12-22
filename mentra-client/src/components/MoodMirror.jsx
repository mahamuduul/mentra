import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from './ui/Card';

const MoodMirror = () => {
  const [selectedMood, setSelectedMood] = useState(null);

  const moods = [
    { 
      emoji: '😄', 
      label: 'Great', 
      color: 'from-green-400 to-emerald-500',
      quote: 'Your positive energy is contagious! Keep spreading joy! 🌟'
    },
    { 
      emoji: '😊', 
      label: 'Good', 
      color: 'from-blue-400 to-cyan-500',
      quote: 'You\'re doing amazing! Every step forward counts. 💙'
    },
    { 
      emoji: '😐', 
      label: 'Okay', 
      color: 'from-yellow-400 to-orange-400',
      quote: 'It\'s okay to have neutral days. Tomorrow is a new opportunity. 🌤️'
    },
    { 
      emoji: '😔', 
      label: 'Down', 
      color: 'from-purple-400 to-pink-500',
      quote: 'Remember: storms don\'t last forever. You\'re stronger than you think. 💪'
    },
    { 
      emoji: '😢', 
      label: 'Sad', 
      color: 'from-indigo-400 to-purple-500',
      quote: 'It\'s okay to not be okay. Reach out - you\'re not alone. 🫂'
    },
  ];

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Mood Mirror
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            How are you feeling today?
          </p>
        </motion.div>

        <Card className="max-w-4xl mx-auto">
          {/* Mood Selection */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            {moods.map((mood, index) => (
              <motion.button
                key={mood.label}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedMood(mood)}
                className={`group relative flex flex-col items-center p-4 rounded-2xl transition-all ${
                  selectedMood?.label === mood.label
                    ? `bg-gradient-to-br ${mood.color} shadow-lg`
                    : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <span className="text-5xl mb-2 transition-transform group-hover:scale-125">
                  {mood.emoji}
                </span>
                <span className={`text-sm font-medium ${
                  selectedMood?.label === mood.label
                    ? 'text-white'
                    : 'text-gray-700 dark:text-gray-300'
                }`}>
                  {mood.label}
                </span>
                
                {/* Selection Ring */}
                {selectedMood?.label === mood.label && (
                  <motion.div
                    layoutId="mood-ring"
                    className="absolute -inset-1 rounded-2xl border-4 border-white dark:border-gray-900"
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Motivational Quote Display */}
          <AnimatePresence mode="wait">
            {selectedMood && (
              <motion.div
                key={selectedMood.label}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className={`p-8 rounded-2xl bg-gradient-to-br ${selectedMood.color} text-white text-center`}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="text-6xl mb-4"
                >
                  {selectedMood.emoji}
                </motion.div>
                <p className="text-2xl font-semibold mb-2">
                  Feeling {selectedMood.label}
                </p>
                <p className="text-lg opacity-90">
                  {selectedMood.quote}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {!selectedMood && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center p-8 text-gray-500 dark:text-gray-400"
            >
              <p className="text-lg">Select a mood to receive a personalized message 💭</p>
            </motion.div>
          )}
        </Card>
      </div>
    </section>
  );
};

export default MoodMirror;
