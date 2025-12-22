import { motion } from 'framer-motion';
import Card from './ui/Card';

const ResourcesGrid = () => {
  const resources = [
    {
      icon: '🧘‍♀️',
      title: 'Meditation Guide',
      description: 'Learn mindfulness techniques to calm your mind and reduce stress',
      color: 'from-green-400 to-emerald-500',
    },
    {
      icon: '🎯',
      title: 'Focus Tips',
      description: 'Improve concentration and productivity with proven strategies',
      color: 'from-blue-400 to-cyan-500',
    },
    {
      icon: '😴',
      title: 'Sleep Guide',
      description: 'Develop healthy sleep habits for better mental and physical health',
      color: 'from-purple-400 to-pink-500',
    },
    {
      icon: '💪',
      title: 'Stress Management',
      description: 'Effective techniques to handle stress and anxiety in daily life',
      color: 'from-orange-400 to-red-500',
    },
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
              Motivational Resources
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Explore our curated collection of mental wellness resources
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {resources.map((resource, index) => (
            <motion.div
              key={resource.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full group cursor-pointer">
                <div className="text-center space-y-4">
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className={`mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br ${resource.color} flex items-center justify-center text-4xl shadow-lg`}
                  >
                    {resource.icon}
                  </motion.div>
                  
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {resource.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-400">
                    {resource.description}
                  </p>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-4 text-blue-600 dark:text-blue-400 font-semibold group-hover:underline"
                  >
                    Learn More →
                  </motion.button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResourcesGrid;
