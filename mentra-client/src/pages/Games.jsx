import { motion } from 'framer-motion';
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
      color: 'from-purple-500 to-pink-500',
      benefits: ['Enhances memory', 'Improves focus', 'Reduces stress'],
      route: '/games/memory',
    },
    {
      id: 'breathing',
      title: 'Breathing Exercise',
      description: 'Practice guided breathing techniques to calm your mind and reduce anxiety',
      icon: GiMeditation,
      color: 'from-blue-500 to-cyan-500',
      benefits: ['Reduces anxiety', 'Calms mind', 'Improves focus'],
      route: '/quick-calm',
    },
    {
      id: 'puzzle',
      title: 'Relaxation Puzzle',
      description: 'Complete beautiful puzzles to relax and practice mindfulness',
      icon: FaPuzzlePiece,
      color: 'from-green-500 to-emerald-500',
      benefits: ['Promotes relaxation', 'Mindful activity', 'Creative outlet'],
      route: '/games/puzzle',
    },
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <FaGamepad className="text-6xl text-white mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Mental Wellness Games
          </h1>
          <p className="text-xl text-purple-200 max-w-3xl mx-auto">
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
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-purple-400/30 hover:border-purple-300 hover:shadow-2xl hover:shadow-purple-500/50 transition-all h-full flex flex-col">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${game.color} flex items-center justify-center mb-4 shadow-lg`}>
                    <Icon className="text-4xl text-white" />
                  </div>

                  <h3 className="text-2xl font-bold mb-3 text-white">
                    {game.title}
                  </h3>

                  <p className="text-purple-200 mb-4 flex-grow">
                    {game.description}
                  </p>

                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-purple-200 mb-2">
                      Benefits:
                    </h4>
                    <ul className="space-y-1">
                      {game.benefits.map((benefit, i) => (
                        <li key={i} className="text-sm text-purple-300 flex items-center gap-2">
                          <span className="text-green-400">✓</span>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => navigate(game.route)}
                    className="w-full bg-gradient-to-r from-purple-500 to-purple-700 text-white px-6 py-3 rounded-xl font-bold hover:scale-105 transition-all shadow-lg shadow-purple-500/50"
                  >
                    Play Now
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Why Play Games Section */}
        <div className="mt-12 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-2xl p-8 shadow-2xl shadow-purple-500/50 border border-purple-400/30">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Why Mental Wellness Games?</h2>
            <p className="text-lg opacity-90 mb-6">
              Research shows that engaging in therapeutic games and activities can significantly improve mental health by:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-4xl mb-2">🧠</div>
                <h3 className="font-semibold mb-1">Cognitive Benefits</h3>
                <p className="text-sm opacity-80">Enhances memory, focus, and problem-solving skills</p>
              </div>
              <div>
                <div className="text-4xl mb-2">😌</div>
                <h3 className="font-semibold mb-1">Stress Reduction</h3>
                <p className="text-sm opacity-80">Promotes relaxation and mindfulness</p>
              </div>
              <div>
                <div className="text-4xl mb-2">💪</div>
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
