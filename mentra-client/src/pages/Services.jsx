import { motion } from 'framer-motion';
import Card from '../components/ui/Card';

const Services = () => {
  const services = [
    {
      icon: '🧠',
      title: 'Mental Health Assessment',
      description: 'Take a comprehensive mental health assessment to understand your current state and get personalized recommendations.',
      features: ['Professional questionnaires', 'Instant results', 'Personalized insights'],
    },
    {
      icon: '💬',
      title: 'AI Chatbot Support',
      description: 'Chat with FeelTalk, our AI companion trained to provide emotional support and guidance 24/7.',
      features: ['24/7 availability', 'Confidential conversations', 'Empathetic responses'],
    },
    {
      icon: '📚',
      title: 'Resource Library',
      description: 'Access a curated collection of articles, videos, and tools for mental wellness.',
      features: ['Expert-curated content', 'Multiple formats', 'Regular updates'],
    },
    {
      icon: '🎯',
      title: 'Stress Management',
      description: 'Learn and practice evidence-based techniques for managing stress and anxiety.',
      features: ['Breathing exercises', 'Meditation guides', 'Progress tracking'],
    },
    {
      icon: '👥',
      title: 'Community Support',
      description: 'Connect with others in a safe, moderated community of people on similar journeys.',
      features: ['Peer support', 'Anonymous sharing', 'Moderated forums'],
    },
    {
      icon: '🆘',
      title: 'Crisis Support',
      description: 'Immediate access to crisis helplines and emergency mental health resources.',
      features: ['24/7 helpline access', 'Professional referrals', 'Emergency contacts'],
    },
  ];

  return (
    <div className="min-h-screen py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Our Services
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Comprehensive mental health support designed to help you thrive
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full">
                <div className="text-6xl mb-4">{service.icon}</div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                  {service.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {service.description}
                </p>
                <ul className="space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <span className="text-green-500">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
