import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaPaperPlane, FaRobot, FaUser, FaVideo, FaCalendarAlt, FaClock } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const ChatBot = ({ isOpen, onClose, booking }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Welcome message
      const welcomeMessage = {
        id: Date.now(),
        type: 'bot',
        content: `Hi ${user?.name || 'there'}! 👋 I'm your Mentra AI assistant. I'm here to help you with your booking and answer any questions about your upcoming session with ${booking?.expertName || 'your counselor'}. How can I assist you today?`,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
      
      // Suggest quick actions
      setTimeout(() => {
        const suggestionsMessage = {
          id: Date.now() + 1,
          type: 'bot',
          content: 'Here are some things I can help you with:',
          suggestions: [
            'Session details',
            'How to prepare',
            'Reschedule booking',
            'Technical support',
            'Meeting link',
            'Cancel booking',
          ],
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, suggestionsMessage]);
      }, 1000);
    }
  }, [isOpen]);

  const generateBotResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Session details
    if (lowerMessage.includes('session') || lowerMessage.includes('detail') || lowerMessage.includes('time') || lowerMessage.includes('date')) {
      return {
        content: `Your session details:\n\n📅 Date: ${new Date(booking.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}\n⏰ Time: ${booking.time}\n👨‍⚕️ Expert: ${booking.expertName}\n📋 Type: ${booking.concernType}\n\nYour booking reference is: ${booking.bookingNumber}`,
      };
    }
    
    // Meeting link
    if (lowerMessage.includes('link') || lowerMessage.includes('join') || lowerMessage.includes('meeting') || lowerMessage.includes('video')) {
      const sessionDateTime = new Date(`${booking.date} ${booking.time}`);
      const now = new Date();
      const minutesUntilSession = (sessionDateTime - now) / (1000 * 60);
      
      if (minutesUntilSession <= 30 && minutesUntilSession > 0) {
        return {
          content: `Your session is starting soon! 🎉\n\nYou can join the video session now. The meeting link is available on your booking details page. Please join 5 minutes before your scheduled time to ensure a smooth start.\n\n✨ The meeting room is ready for you!`,
          actionButton: {
            text: 'View Meeting Link',
            action: 'meeting-link'
          }
        };
      } else if (minutesUntilSession > 30) {
        const hours = Math.floor(minutesUntilSession / 60);
        const minutes = Math.floor(minutesUntilSession % 60);
        return {
          content: `Your session is in ${hours > 0 ? `${hours} hour${hours > 1 ? 's' : ''} and ` : ''}${minutes} minute${minutes !== 1 ? 's' : ''}.\n\nThe meeting link will be available 30 minutes before your scheduled time. I'll send you a notification when it's ready! 📧`,
        };
      } else {
        return {
          content: `Your session time has passed. If you missed your session, please contact support or book a new session.`,
        };
      }
    }
    
    // Preparation tips
    if (lowerMessage.includes('prepare') || lowerMessage.includes('ready') || lowerMessage.includes('what to') || lowerMessage.includes('how to')) {
      return {
        content: `Great question! Here's how to prepare for your session:\n\n✅ Find a quiet, private space\n✅ Test your camera and microphone\n✅ Ensure stable internet connection\n✅ Have a notebook ready for notes\n✅ Prepare any questions or topics\n✅ Join 5 minutes early\n✅ Keep water nearby\n\n💡 Tip: Being in a comfortable, distraction-free environment helps you get the most from your session!`,
      };
    }
    
    // Reschedule
    if (lowerMessage.includes('reschedule') || lowerMessage.includes('change') || lowerMessage.includes('different time')) {
      const sessionDateTime = new Date(`${booking.date} ${booking.time}`);
      const now = new Date();
      const hoursDifference = (sessionDateTime - now) / (1000 * 60 * 60);
      
      if (hoursDifference >= 24) {
        return {
          content: `I understand you'd like to reschedule. You can cancel this booking and create a new one for a time that works better for you.\n\n⚠️ Please note: Cancellations must be made at least 24 hours before your scheduled time.\n\nWould you like to proceed with cancellation?`,
          suggestions: ['Yes, cancel booking', 'No, keep booking'],
        };
      } else {
        return {
          content: `I'm sorry, but your session is less than 24 hours away. Per our policy, rescheduling is not available at this time.\n\nIf you have an emergency, please contact our support team directly. They may be able to help:\n📧 support@mentra.app\n📞 1-800-MENTRA`,
        };
      }
    }
    
    // Cancel booking
    if (lowerMessage.includes('cancel') && (lowerMessage.includes('yes') || lowerMessage.includes('booking'))) {
      const sessionDateTime = new Date(`${booking.date} ${booking.time}`);
      const now = new Date();
      const hoursDifference = (sessionDateTime - now) / (1000 * 60 * 60);
      
      if (hoursDifference >= 24) {
        return {
          content: `To cancel your booking, please use the "Cancel Booking" button on the booking details page.\n\n⚠️ Important: Cancellation is permanent and cannot be undone. You'll need to create a new booking if you change your mind.\n\nIs there anything else I can help you with?`,
        };
      } else {
        return {
          content: `I'm sorry, but your session is less than 24 hours away. Cancellation is no longer available.\n\nIf you have an emergency, please contact support:\n📧 support@mentra.app`,
        };
      }
    }
    
    // Technical support
    if (lowerMessage.includes('technical') || lowerMessage.includes('problem') || lowerMessage.includes('issue') || lowerMessage.includes('not working') || lowerMessage.includes('help')) {
      return {
        content: `I'm here to help with technical issues! Common solutions:\n\n🎥 Camera/Mic Issues:\n- Check browser permissions\n- Try a different browser (Chrome recommended)\n- Test on https://mentra.app/test-call\n\n🌐 Connection Issues:\n- Restart your router\n- Close other apps\n- Use wired connection if possible\n\n💻 Can't Join Meeting:\n- Clear browser cache\n- Disable VPN\n- Update your browser\n\nStill having trouble? Contact support:\n📧 support@mentra.app\n💬 Live chat available 24/7`,
      };
    }
    
    // Expert information
    if (lowerMessage.includes('expert') || lowerMessage.includes('doctor') || lowerMessage.includes('counselor') || lowerMessage.includes('therapist')) {
      return {
        content: `Your session is with ${booking.expertName}, specializing in ${booking.expertSpecialization}.\n\n${booking.expertName} has extensive experience and is ready to help you with your ${booking.concernType.toLowerCase()}.\n\n💙 All our experts are licensed professionals committed to providing you with the best care possible.`,
      };
    }
    
    // Privacy and confidentiality
    if (lowerMessage.includes('privacy') || lowerMessage.includes('confidential') || lowerMessage.includes('private') || lowerMessage.includes('secure')) {
      return {
        content: `Your privacy is our top priority! 🔒\n\n✅ All sessions are end-to-end encrypted\n✅ Your data is HIPAA compliant\n✅ Sessions are not recorded (unless you request)\n✅ Your information is never shared\n✅ Confidentiality is maintained\n\nYou can trust that your sessions are completely private and secure. Your counselor is bound by professional ethics to maintain confidentiality.`,
      };
    }
    
    // Greeting responses
    if (lowerMessage.includes('hi') || lowerMessage.includes('hello') || lowerMessage.includes('hey')) {
      return {
        content: `Hello! 👋 How can I assist you with your booking today? Feel free to ask me anything about your session, technical support, or general questions!`,
      };
    }
    
    // Thank you
    if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
      return {
        content: `You're very welcome! 😊 I'm always here to help. Is there anything else you'd like to know about your session?`,
      };
    }
    
    // Anxiety or nervousness
    if (lowerMessage.includes('nervous') || lowerMessage.includes('anxious') || lowerMessage.includes('worried') || lowerMessage.includes('scared')) {
      return {
        content: `It's completely normal to feel nervous before your first session! 💙\n\nHere are some tips:\n\n🌟 Remember: Your counselor is there to help, not judge\n🌟 You can share as much or as little as you're comfortable with\n🌟 There are no "right" or "wrong" things to say\n🌟 It's okay to take breaks or ask questions\n🌟 You're taking a brave step toward better mental health\n\nYou've got this! Your counselor will guide you through the process. 💪`,
      };
    }
    
    // Default response with contextual understanding
    return {
      content: `I understand you're asking about "${userMessage}". While I'm here to help with booking-related questions, I want to make sure I give you accurate information.\n\nI can help you with:\n• Session details and timing\n• Meeting links and joining instructions\n• Technical support\n• Rescheduling or cancellation\n• Preparation tips\n• Privacy and security questions\n\nWhat would you like to know more about?`,
      suggestions: ['Session details', 'Meeting link', 'How to prepare', 'Technical help'],
    };
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate bot thinking time
    setTimeout(() => {
      const botResponse = generateBotResponse(input);
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        ...botResponse,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
    handleSendMessage();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-4 right-4 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 border border-purple-200"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-500 to-purple-700 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <FaRobot className="text-purple-600 text-xl" />
              </div>
              <div>
                <h3 className="font-bold">Mentra AI Assistant</h3>
                <p className="text-xs text-purple-100">Always here to help</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-purple-600 p-2 rounded-lg transition-colors"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  {/* Avatar */}
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === 'user' ? 'bg-purple-500' : 'bg-gradient-to-br from-purple-400 to-pink-400'
                  }`}>
                    {message.type === 'user' ? (
                      <FaUser className="text-white text-sm" />
                    ) : (
                      <FaRobot className="text-white text-sm" />
                    )}
                  </div>

                  {/* Message Content */}
                  <div className={`flex flex-col ${message.type === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`rounded-2xl px-4 py-2 ${
                      message.type === 'user'
                        ? 'bg-purple-500 text-white'
                        : 'bg-white text-gray-800 shadow-md border border-gray-200'
                    }`}>
                      <p className="text-sm whitespace-pre-line">{message.content}</p>
                    </div>

                    {/* Action Button */}
                    {message.actionButton && (
                      <button className="mt-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-700 text-white text-sm font-semibold rounded-lg hover:from-green-600 hover:to-green-800 transition-all">
                        {message.actionButton.text}
                      </button>
                    )}

                    {/* Suggestions */}
                    {message.suggestions && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {message.suggestions.map((suggestion, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full hover:bg-purple-200 transition-colors border border-purple-300"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Timestamp */}
                    <span className="text-xs text-gray-400 mt-1">
                      {message.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start space-x-2"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                  <FaRobot className="text-white text-sm" />
                </div>
                <div className="bg-white rounded-2xl px-4 py-3 shadow-md border border-gray-200">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              />
              <button
                onClick={handleSendMessage}
                disabled={!input.trim()}
                className="p-3 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-full hover:from-purple-600 hover:to-purple-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaPaperPlane />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatBot;
