import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { FaBrain, FaGamepad, FaPuzzlePiece } from 'react-icons/fa';
import { GiMeditation } from 'react-icons/gi';
import { useNavigate } from 'react-router-dom';

const Games = () => {
  const navigate = useNavigate();

  const games = [
    {
      id: 'memory',
      title: 'Memory Challenge',
      description: 'Improve your cognitive skills and concentration with this fun memory matching game',
      icon: FaBrain,
      color: 'from-purple-600 to-purple-800',
      benefits: ['Enhances memory', 'Improves focus', 'Reduces stress'],
      route: '/games/memory',
    },
    {
      id: 'breathing',
      title: 'Breathing Exercise',
      description: 'Practice guided breathing techniques to calm your mind and reduce anxiety',
      icon: GiMeditation,
      color: 'from-purple-600 to-purple-800',
      benefits: ['Reduces anxiety', 'Calms mind', 'Improves focus'],
      route: '/quick-calm',
    },
    {
      id: 'puzzle',
      title: 'Relaxation Puzzle',
      description: 'Complete beautiful puzzles to relax and practice mindfulness',
      icon: FaPuzzlePiece,
      color: 'from-purple-600 to-purple-800',
      benefits: ['Promotes relaxation', 'Mindful activity', 'Creative outlet'],
      route: '/games/puzzle',
    },
  ];

  return (
    <div className="min-h-screen py-12 bg-white relative">
      <Helmet>
        <title>Games - Mentra</title>
        <meta name="description" content="Improve your mental wellness through interactive games. Enhance memory, practice mindfulness, and reduce stress through play." />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <FaGamepad className="text-6xl text-gray-900 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Mental Wellness Games
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Engage your mind with therapeutic games designed to reduce stress and improve mental well-being
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {games.map((game, index) => {
            const Icon = game.icon;
            return (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="bg-white rounded-2xl p-6 border-2 border-purple-200 hover:border-purple-500 hover:shadow-xl transition-all h-full flex flex-col">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${game.color} flex items-center justify-center mb-4 shadow-xl`}>
                    <Icon className="text-4xl text-white" />
                  </div>

                  <h3 className="text-2xl font-bold mb-3 text-gray-900">
                    {game.title}
                  </h3>

                  <p className="text-gray-600 mb-4 flex-grow">
                    {game.description}
                  </p>

                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-600 mb-2">
                      Benefits:
                    </h4>
                    <ul className="space-y-1">
                      {game.benefits.map((benefit, i) => (
                        <li key={i} className="text-sm text-purple-600 flex items-center gap-2">
                          <span className="text-purple-600">✓</span>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => navigate(game.route)}
                    className="w-full bg-gradient-to-r from-purple-500 to-purple-700 text-white px-6 py-3 rounded-xl font-bold hover:scale-105 transition-all shadow-xl"
                  >
                    Play Now
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Why Play Games Section */}
        <div className="mt-12 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-2xl p-8 shadow-xl">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Why Mental Wellness Games?</h2>
            <p className="text-lg opacity-90 mb-6">
              Research shows that engaging in therapeutic games and activities can significantly improve mental health by:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold mb-1">Cognitive Benefits</h3>
                <p className="text-sm opacity-80">Enhances memory, focus, and problem-solving skills</p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Stress Reduction</h3>
                <p className="text-sm opacity-80">Promotes relaxation and mindfulness</p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Emotional Resilience</h3>
                <p className="text-sm opacity-80">Builds coping mechanisms and emotional strength</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Games;
