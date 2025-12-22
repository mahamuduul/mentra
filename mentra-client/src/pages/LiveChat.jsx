import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import BackButton from '../components/BackButton';
import io from 'socket.io-client';
import { 
  FaPaperPlane, 
  FaUsers, 
  FaCircle,
  FaComments,
  FaUserSecret,
  FaShieldAlt
} from 'react-icons/fa';
import { MdGroups } from 'react-icons/md';

const SOCKET_URL = 'http://localhost:5000';

const LiveChat = () => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [anonymousName, setAnonymousName] = useState('');
  const [activeUsers, setActiveUsers] = useState([]);
  const [activeCount, setActiveCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize Socket.IO
  useEffect(() => {
    if (!user) return;

    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling']
    });

    setSocket(newSocket);

    // Connection events
    newSocket.on('connect', () => {
      console.log('✅ Connected to chat server');
      setIsConnected(true);
      newSocket.emit('join_chat', { userId: user.firebaseUID });
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Disconnected from chat server');
      setIsConnected(false);
    });

    // Chat history
    newSocket.on('chat_history', (history) => {
      setMessages(history);
    });

    // User events
    newSocket.on('user_joined', ({ message, activeCount }) => {
      setMessages(prev => [...prev, message]);
      setActiveCount(activeCount);
    });

    newSocket.on('user_left', ({ message, activeCount }) => {
      setMessages(prev => [...prev, message]);
      setActiveCount(activeCount);
    });

    newSocket.on('active_users_update', ({ count, users }) => {
      setActiveCount(count);
      setActiveUsers(users);
    });

    // New message
    newSocket.on('new_message', (message) => {
      setMessages(prev => [...prev, message]);
      
      // Store my anonymous name
      if (message.sender.userId === user.firebaseUID) {
        setAnonymousName(message.sender.anonymousName);
      }
    });

    // Typing indicators
    newSocket.on('user_typing', ({ anonymousName }) => {
      setTypingUsers(prev => [...new Set([...prev, anonymousName])]);
    });

    newSocket.on('user_stop_typing', ({ anonymousName }) => {
      setTypingUsers(prev => prev.filter(name => name !== anonymousName));
    });

    // Error handling
    newSocket.on('error', ({ message: errorMsg }) => {
      alert(errorMsg);
    });

    return () => {
      newSocket.close();
    };
  }, [user]);

  // Handle send message
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || !socket || !user) return;

    socket.emit('send_message', {
      content: inputMessage.trim(),
      userId: user.firebaseUID
    });

    setInputMessage('');
    
    // Stop typing indicator
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    socket.emit('stop_typing', { userId: user.firebaseUID });
  };

  // Handle typing
  const handleTyping = (e) => {
    setInputMessage(e.target.value);

    if (!socket || !user) return;

    // Emit typing event
    socket.emit('typing', { userId: user.firebaseUID });

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 1 second of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stop_typing', { userId: user.firebaseUID });
    }, 1000);
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 pt-20 flex items-center justify-center">
        <div className="text-center">
          <FaUserSecret className="text-6xl text-purple-300 mx-auto mb-4" />
          <p className="text-xl text-purple-200">Please log in to join the live chat</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 pt-20 relative">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full blur-3xl"></div>
        <div className="absolute top-96 right-20 w-96 h-96 bg-purple-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-purple-300 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-purple-400/30 text-white py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-4">
            <BackButton className="text-white hover:text-purple-200 hover:bg-white/10" />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl border border-purple-400/30">
                <FaComments className="text-3xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-3">
                  Anonymous Live Chat
                  <span className="flex items-center gap-2 text-sm bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full border border-purple-400/30">
                    <FaCircle className={`text-xs ${isConnected ? 'text-green-400 animate-pulse' : 'text-red-400'}`} />
                    {isConnected ? 'Connected' : 'Connecting...'}
                  </span>
                </h1>
                <p className="text-purple-200 mt-1">Real-time support from peers who understand</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="flex items-center gap-2 text-2xl font-bold">
                  <FaUsers />
                  {activeCount}
                </div>
                <p className="text-xs text-purple-200">Active Now</p>
              </div>
            </div>
          </div>

          {/* Safety Notice */}
          <div className="mt-4 flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-3 text-sm border border-purple-400/20">
            <FaShieldAlt className="text-purple-300 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Safe Space Guidelines:</p>
              <p className="text-purple-200 text-xs mt-1">
                Be kind, respectful, and supportive. All messages are anonymous. Report any inappropriate behavior.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        <div className="grid lg:grid-cols-4 gap-6">
          
          {/* Sidebar - Active Users */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg border border-purple-400/30 p-6 sticky top-24">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-white">
                <MdGroups className="text-purple-300" />
                Active Users ({activeCount})
              </h3>
              
              {anonymousName && (
                <div className="mb-4 p-3 bg-purple-700/50 rounded-lg border-2 border-purple-400/50 backdrop-blur-sm">
                  <p className="text-xs text-purple-200 font-medium mb-1">You are chatting as:</p>
                  <p className="font-bold text-white flex items-center gap-2">
                    <FaUserSecret /> {anonymousName}
                  </p>
                </div>
              )}

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {activeUsers.length > 0 ? (
                  activeUsers.map((name, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm p-2 bg-purple-700/30 rounded-lg border border-purple-400/20">
                      <FaCircle className="text-green-400 text-xs animate-pulse" />
                      <span className={name === anonymousName ? 'font-bold text-white' : 'text-purple-200'}>
                        {name} {name === anonymousName && '(You)'}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-purple-300 text-sm">Waiting for users...</p>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-purple-400/30">
                <div className="text-xs text-purple-200 space-y-2">
                  <p>💬 All messages are anonymous</p>
                  <p>🔒 Your identity is protected</p>
                  <p>🤝 Be supportive and kind</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-3">
            <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg border border-purple-400/30 flex flex-col" style={{ height: 'calc(100vh - 250px)' }}>
              
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center py-12">
                    <FaComments className="text-6xl text-purple-300 mx-auto mb-4 opacity-50" />
                    <p className="text-purple-200">No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((msg, index) => {
                    const isSystemMessage = msg.type === 'join' || msg.type === 'leave' || msg.type === 'system';
                    const isMyMessage = msg.sender?.anonymousName === anonymousName && msg.type === 'message';

                    if (isSystemMessage) {
                      return (
                        <div key={index} className="text-center">
                          <span className="text-xs text-purple-300 bg-purple-700/30 px-3 py-1 rounded-full backdrop-blur-sm">
                            {msg.content}
                          </span>
                        </div>
                      );
                    }

                    return (
                      <div key={index} className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-md ${isMyMessage ? 'items-end' : 'items-start'} flex flex-col`}>
                          <div className="flex items-center gap-2 mb-1">
                            {!isMyMessage && (
                              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-lg">
                                {msg.sender?.anonymousName?.charAt(0)}
                              </div>
                            )}
                            <span className="text-xs font-semibold text-purple-200">
                              {msg.sender?.anonymousName}
                            </span>
                            <span className="text-xs text-purple-300">
                              {formatTime(msg.createdAt)}
                            </span>
                          </div>
                          <div className={`rounded-2xl px-4 py-2 ${
                            isMyMessage 
                              ? 'bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-br-none shadow-lg shadow-purple-500/50' 
                              : 'bg-white/20 backdrop-blur-sm text-white rounded-bl-none border border-purple-400/30'
                          }`}>
                            <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                
                {/* Typing Indicator */}
                {typingUsers.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-purple-300 italic">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                    <span>{typingUsers[0]} is typing...</span>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t border-purple-400/30 p-4 bg-white/5 backdrop-blur-sm rounded-b-xl">
                <form onSubmit={handleSendMessage} className="flex gap-3">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={handleTyping}
                    placeholder="Type your message..."
                    maxLength={500}
                    disabled={!isConnected}
                    className="flex-1 px-4 py-3 border border-purple-400/30 bg-purple-700/30 text-white placeholder-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-purple-900/30 disabled:cursor-not-allowed"
                  />
                  <button
                    type="submit"
                    disabled={!inputMessage.trim() || !isConnected}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-semibold shadow-lg shadow-purple-500/50"
                  >
                    <FaPaperPlane /> Send
                  </button>
                </form>
                <p className="text-xs text-purple-300 mt-2">
                  {inputMessage.length}/500 characters
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LiveChat;
