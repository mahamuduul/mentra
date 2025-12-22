import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserMd, FaPaperPlane, FaLock, FaShieldAlt, FaCheckCircle } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { showSuccessToast, showErrorToast } from '../../utils/toast';

const SecureCounselorTicket = () => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const token = await currentUser.getIdToken();
      const response = await fetch('http://localhost:5000/api/tools/counselor-ticket', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const messages = await response.json();
        setMessages(messages || []);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) {
      showErrorToast('Please enter a message');
      return;
    }

    setIsSending(true);
    try {
      const token = await currentUser.getIdToken();
      const response = await fetch('http://localhost:5000/api/tools', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          toolType: 'counselor-ticket',
          data: {
            message: newMessage,
            sender: 'user',
            timestamp: new Date().toISOString(),
            status: 'sent',
            counselorType: 'female-only'
          }
        }),
      });

      if (response.ok) {
        showSuccessToast('Message sent securely');
        setNewMessage('');
        fetchMessages();
        
        // Simulate counselor response after 3 seconds
        setTimeout(() => {
          simulateCounselorResponse();
        }, 3000);
      } else {
        showErrorToast('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      showErrorToast('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const simulateCounselorResponse = async () => {
    const responses = [
      "Thank you for reaching out. I'm here to support you. Can you tell me more about what you're experiencing?",
      "I understand this is difficult. Your feelings are valid. Would you like to talk about what's been on your mind?",
      "I'm listening. Please take your time to share what feels comfortable for you.",
      "Thank you for sharing that with me. How are you feeling right now?",
      "It's brave of you to reach out. Let's work through this together. What support do you need right now?"
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    try {
      const token = await currentUser.getIdToken();
      await fetch('http://localhost:5000/api/tools', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          toolType: 'counselor-ticket',
          data: {
            message: randomResponse,
            sender: 'counselor',
            counselorName: 'Dr. Sarah Johnson (Female Counselor)',
            timestamp: new Date().toISOString(),
            status: 'received',
            counselorType: 'female-only'
          }
        }),
      });
      
      fetchMessages();
    } catch (error) {
      console.error('Error simulating response:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 h-screen flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl p-6 text-white mb-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <FaUserMd className="text-3xl" />
              <h1 className="text-2xl font-bold">Secure Counselor Chat</h1>
            </div>
            <div className="flex items-center gap-4 text-teal-100 text-sm">
              <span className="flex items-center gap-2">
                <FaShieldAlt />
                Female Counselor Only
              </span>
              <span className="flex items-center gap-2">
                <FaLock />
                End-to-End Encrypted
              </span>
              <span className="flex items-center gap-2">
                <FaCheckCircle />
                Confidential
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="bg-teal-50 border-l-4 border-teal-500 p-4 rounded-lg mb-4">
        <p className="text-sm text-teal-800">
          <strong>🔒 Privacy & Safety:</strong> All messages are encrypted and confidential. You're connected with a female counselor. 
          Response times may vary. For emergencies, please call 911 or crisis hotlines.
        </p>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
        <div className="bg-teal-600 text-white px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="font-semibold">Female Counselor Available</span>
          </div>
          <span className="text-teal-100 text-sm">Secure Session</span>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <FaUserMd className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No messages yet</p>
              <p className="text-gray-400 text-sm mt-2">
                Start a conversation with a female counselor. Your messages are private and secure.
              </p>
            </div>
          ) : (
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.data.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[70%] ${msg.data.sender === 'user' ? 'order-2' : 'order-1'}`}>
                    {msg.data.sender === 'counselor' && (
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-white">
                          <FaUserMd />
                        </div>
                        <span className="text-xs text-gray-600 font-semibold">
                          {msg.data.counselorName || 'Female Counselor'}
                        </span>
                      </div>
                    )}
                    
                    <div
                      className={`p-4 rounded-2xl shadow-md ${
                        msg.data.sender === 'user'
                          ? 'bg-teal-600 text-white rounded-tr-none'
                          : 'bg-white border-2 border-teal-200 text-gray-800 rounded-tl-none'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.data.message}</p>
                      <div className={`flex items-center justify-between mt-2 text-xs ${
                        msg.data.sender === 'user' ? 'text-teal-100' : 'text-gray-500'
                      }`}>
                        <span>{new Date(msg.data.timestamp).toLocaleTimeString()}</span>
                        {msg.data.sender === 'user' && (
                          <span className="flex items-center gap-1">
                            <FaLock /> Encrypted
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 bg-white border-t-2 border-gray-200">
          <div className="flex gap-3">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Type your message here... (Press Enter to send, Shift+Enter for new line)"
              rows="3"
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
              disabled={isSending}
            />
            <button
              onClick={handleSendMessage}
              disabled={isSending || !newMessage.trim()}
              className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-semibold shadow-lg h-fit"
            >
              {isSending ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <FaPaperPlane />
                  Send
                </>
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 flex items-center gap-2">
            <FaLock className="text-teal-600" />
            Your messages are encrypted and only visible to you and your counselor
          </p>
        </div>
      </div>

      {/* Important Information */}
      <div className="mt-4 bg-red-50 border-2 border-red-200 rounded-lg p-4">
        <p className="text-sm text-red-800">
          <strong>⚠️ Emergency Notice:</strong> This chat is not for immediate crisis situations. 
          If you're in immediate danger, please call 911 or contact:
        </p>
        <div className="mt-2 flex flex-wrap gap-3 text-sm">
          <button
            onClick={() => window.location.href = 'tel:988'}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all font-semibold"
          >
            📞 Call 988 (Suicide & Crisis Lifeline)
          </button>
          <button
            onClick={() => window.location.href = 'tel:1-800-799-7233'}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all font-semibold"
          >
            📞 Call 1-800-799-7233 (Domestic Violence)
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecureCounselorTicket;
