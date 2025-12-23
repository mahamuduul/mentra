import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
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
      <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <FaUserSecret className="text-6xl text-purple-600 mx-auto mb-4" />
          <p className="text-xl text-gray-600">Please log in to join the live chat</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-20 relative">
      <Helmet>
        <title>Live Chat - Mentra</title>
        <meta name="description" content="Connect with others in real-time through our anonymous live chat. Share, support, and find community in a safe space." />
      </Helmet>
      {/* Header */}
      <div className="bg-white border-b border-2 border-purple-200 text-gray-900 py-8 relative z-10 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-4">
            <BackButton className="text-gray-900 hover:text-purple-600 hover:bg-gray-100" />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white rounded-xl border-2 border-purple-200 shadow-xl">
                <FaComments className="text-3xl text-purple-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-3">
                  Anonymous Live Chat
                  <span className="flex items-center gap-2 text-sm bg-white px-3 py-1 rounded-full border-2 border-purple-200 shadow-xl">
                    <FaCircle className={`text-xs ${isConnected ? 'text-green-400 animate-pulse' : 'text-red-400'}`} />
                    {isConnected ? 'Connected' : 'Connecting...'}
                  </span>
                </h1>
                <p className="text-gray-600 mt-1">Real-time support from peers who understand</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="flex items-center gap-2 text-2xl font-bold">
                  <FaUsers />
                  {activeCount}
                </div>
                <p className="text-xs text-gray-600">Active Now</p>
              </div>
            </div>
          </div>

          {/* Safety Notice */}
          <div className="mt-4 flex items-start gap-3 bg-white rounded-lg p-3 text-sm border-2 border-purple-200 shadow-xl">
            <FaShieldAlt className="text-purple-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Safe Space Guidelines:</p>
              <p className="text-gray-600 text-xs mt-1">
                Be kind, respectful, and supportive. All messages are anonymous. Report any inappropriate behavior.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid lg:grid-cols-4 gap-6">
          
          {/* Sidebar - Active Users */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-xl border-2 border-purple-200 p-6 sticky top-24">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-900">
                <MdGroups className="text-purple-600" />
                Active Users ({activeCount})
              </h3>
              
              {anonymousName && (
                <div className="mb-4 p-3 bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg border-2 border-purple-200 shadow-xl">
                  <p className="text-xs text-white font-medium mb-1">You are chatting as:</p>
                  <p className="font-bold text-white flex items-center gap-2">
                    <FaUserSecret /> {anonymousName}
                  </p>
                </div>
              )}

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {activeUsers.length > 0 ? (
                  activeUsers.map((name, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm p-2 bg-white rounded-lg border-2 border-purple-200 shadow-xl hover:border-purple-500">
                      <FaCircle className="text-green-400 text-xs animate-pulse" />
                      <span className={name === anonymousName ? 'font-bold text-gray-900' : 'text-gray-600'}>
                        {name} {name === anonymousName && '(You)'}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-purple-600 text-sm">Waiting for users...</p>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-2 border-purple-200">
                <div className="text-xs text-gray-600 space-y-2">
                  <p>All messages are anonymous</p>
                  <p>Your identity is protected</p>
                  <p>Be supportive and kind</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-xl border-2 border-purple-200 flex flex-col" style={{ height: 'calc(100vh - 250px)' }}>
              
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center py-12">
                    <FaComments className="text-6xl text-purple-600 mx-auto mb-4 opacity-50" />
                    <p className="text-gray-600">No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((msg, index) => {
                    const isSystemMessage = msg.type === 'join' || msg.type === 'leave' || msg.type === 'system';
                    const isMyMessage = msg.sender?.anonymousName === anonymousName && msg.type === 'message';

                    if (isSystemMessage) {
                      return (
                        <div key={index} className="text-center">
                          <span className="text-xs text-purple-600 bg-white px-3 py-1 rounded-full border-2 border-purple-200 shadow-xl">
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
                              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center text-white text-xs font-bold shadow-xl">
                                {msg.sender?.anonymousName?.charAt(0)}
                              </div>
                            )}
                            <span className="text-xs font-semibold text-gray-600">
                              {msg.sender?.anonymousName}
                            </span>
                            <span className="text-xs text-purple-600">
                              {formatTime(msg.createdAt)}
                            </span>
                          </div>
                          <div className={`rounded-2xl px-4 py-2 ${
                            isMyMessage 
                              ? 'bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-br-none shadow-xl' 
                              : 'bg-white text-gray-900 rounded-bl-none border-2 border-purple-200 shadow-xl hover:border-purple-500'
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
                  <div className="flex items-center gap-2 text-sm text-purple-600 italic">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                    <span>{typingUsers[0]} is typing...</span>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t border-2 border-purple-200 p-4 bg-white rounded-b-xl shadow-xl">
                <form onSubmit={handleSendMessage} className="flex gap-3">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={handleTyping}
                    placeholder="Type your message..."
                    maxLength={500}
                    disabled={!isConnected}
                    className="flex-1 px-4 py-3 border-2 border-purple-200 bg-white text-gray-900 placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:border-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed shadow-xl"
                  />
                  <button
                    type="submit"
                    disabled={!inputMessage.trim() || !isConnected}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-semibold shadow-xl"
                  >
                    <FaPaperPlane /> Send
                  </button>
                </form>
                <p className="text-xs text-purple-600 mt-2">
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
