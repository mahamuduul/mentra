import { motion } from 'framer-motion';

const Resources = () => {
  const resourceCategories = [
    {
      title: 'Meditation & Mindfulness',
      icon: '🧘',
      resources: [
        'Beginner\'s Guide to Meditation',
        '10-Minute Daily Mindfulness Practice',
        'Guided Meditation Audio Library',
        'Mindful Breathing Techniques',
      ],
    },
    {
      title: 'Sleep & Rest',
      icon: '😴',
      resources: [
        'Sleep Hygiene Best Practices',
        'Bedtime Relaxation Routines',
        'Understanding Sleep Cycles',
        'Sleep Meditation Guides',
      ],
    },
    {
      title: 'Stress & Anxiety',
      icon: '💪',
      resources: [
        'Understanding Anxiety Disorders',
        'Cognitive Behavioral Techniques',
        'Stress Management Strategies',
        'Grounding Exercises',
      ],
    },
    {
      title: 'Self-Care',
      icon: '💚',
      resources: [
        'Daily Self-Care Checklist',
        'Building Healthy Habits',
        'Work-Life Balance Tips',
        'Self-Compassion Practices',
      ],
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
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            Resources
          </h1>
          <p className="text-xl text-purple-200 max-w-3xl mx-auto">
            Explore our comprehensive library of mental wellness resources
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {resourceCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-purple-400/30 hover:border-purple-300 hover:shadow-2xl hover:shadow-purple-500/50 transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-5xl">{category.icon}</span>
                  <h3 className="text-2xl font-bold text-white">
                    {category.title}
                  </h3>
                </div>
                <ul className="space-y-3">
                  {category.resources.map((resource) => (
                    <li key={resource} className="flex items-center gap-3 group cursor-pointer">
                      <span className="text-purple-300">📄</span>
                      <span className="text-purple-200 group-hover:text-white transition-colors">
                        {resource}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Featured Videos Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-center mb-8 text-white">
            Featured Videos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gradient-to-br from-purple-500 to-purple-700 text-white rounded-2xl p-6 shadow-2xl shadow-purple-500/50 border border-purple-400/30">
                <div className="aspect-video bg-white/10 backdrop-blur-sm rounded-lg mb-4 flex items-center justify-center border border-purple-400/30">
                  <span className="text-6xl">▶️</span>
                </div>
                <h4 className="font-bold text-lg mb-2">Mental Health Tips #{i}</h4>
                <p className="text-sm opacity-90">Learn essential strategies for maintaining mental wellness</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Resources;
