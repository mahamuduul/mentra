import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

const Resources = () => {
  const resourceCategories = [
    {
      title: 'Meditation & Mindfulness',
      resources: [
        'Beginner\'s Guide to Meditation',
        '10-Minute Daily Mindfulness Practice',
        'Guided Meditation Audio Library',
        'Mindful Breathing Techniques',
      ],
    },
    {
      title: 'Sleep & Rest',
      resources: [
        'Sleep Hygiene Best Practices',
        'Bedtime Relaxation Routines',
        'Understanding Sleep Cycles',
        'Sleep Meditation Guides',
      ],
    },
    {
      title: 'Stress & Anxiety',
      resources: [
        'Understanding Anxiety Disorders',
        'Cognitive Behavioral Techniques',
        'Stress Management Strategies',
        'Grounding Exercises',
      ],
    },
    {
      title: 'Self-Care',
      resources: [
        'Daily Self-Care Checklist',
        'Building Healthy Habits',
        'Work-Life Balance Tips',
        'Self-Compassion Practices',
      ],
    },
  ];

  return (
    <div className="min-h-screen py-12 bg-white relative">
      <Helmet>
        <title>Resources - Mentra</title>
        <meta name="description" content="Access comprehensive mental health resources including meditation guides, sleep tips, stress management strategies, and self-care practices." />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
            Resources
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
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
              <div className="bg-white rounded-2xl p-6 border-2 border-purple-200 hover:border-purple-500 hover:shadow-xl transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {category.title}
                  </h3>
                </div>
                <ul className="space-y-3">
                  {category.resources.map((resource) => (
                    <li key={resource} className="flex items-center gap-3 group cursor-pointer">
                      <span className="text-purple-600 group-hover:text-gray-900 transition-colors">
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
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
            Featured Videos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gradient-to-br from-purple-600 to-purple-800 text-white rounded-2xl p-6 shadow-xl border-2 border-purple-200">
                <div className="aspect-video bg-white rounded-lg mb-4 flex items-center justify-center border-2 border-purple-200">
                  <span className="text-6xl">Play</span>
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
