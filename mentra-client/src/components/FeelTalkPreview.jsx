import { motion } from 'framer-motion';
import Card from './ui/Card';
import Button from './ui/Button';

const FeelTalkPreview = () => {
  const demoMessages = [
    { type: 'bot', text: 'Hi! I\'m FeelTalk, your mental health companion. How are you feeling today?' },
    { type: 'user', text: 'I\'m feeling a bit anxious about my exams.' },
    { type: 'bot', text: 'I understand. It\'s completely normal to feel anxious before exams. Would you like some tips to help manage this anxiety?' },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-purple-50 dark:from-gray-900 dark:to-purple-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Meet FeelTalk
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Your 24/7 AI-powered mental health companion
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Chat Preview */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="bg-white dark:bg-gray-800 shadow-2xl">
              {/* Chat Header */}
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-2xl">
                  🤖
                </div>
                <div>
                  <h3 className="font-bold text-lg">FeelTalk AI</h3>
                  <span className="text-sm text-green-500 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Online
                  </span>
                </div>
              </div>

              {/* Messages */}
              <div className="space-y-4 py-6 min-h-[300px]">
                {demoMessages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.3 }}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] p-4 rounded-2xl ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    }`}>
                      {message.text}
                    </div>
                  </motion.div>
                ))}
                
                {/* Typing Indicator */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="flex gap-1"
                >
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </motion.div>
              </div>

              {/* Input Area */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-3 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    disabled
                  />
                  <button className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white">
                    ➤
                  </button>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <FeatureItem 
              icon="🤝"
              title="Empathetic Conversations"
              description="FeelTalk understands your feelings and provides compassionate responses"
            />
            <FeatureItem 
              icon="🔒"
              title="Private & Secure"
              description="Your conversations are completely confidential and encrypted"
            />
            <FeatureItem 
              icon="🌟"
              title="24/7 Availability"
              description="Get support anytime, anywhere, whenever you need it"
            />
            <FeatureItem 
              icon="🎯"
              title="Personalized Guidance"
              description="Receive tailored advice based on your unique situation"
            />

            <Button variant="primary" size="lg" className="w-full mt-8">
              Start Chatting with FeelTalk
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const FeatureItem = ({ icon, title, description }) => (
  <motion.div
    whileHover={{ x: 10 }}
    className="flex gap-4"
  >
    <div className="text-4xl flex-shrink-0">{icon}</div>
    <div>
      <h4 className="font-bold text-lg mb-1 text-gray-900 dark:text-white">{title}</h4>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  </motion.div>
);

export default FeelTalkPreview;
