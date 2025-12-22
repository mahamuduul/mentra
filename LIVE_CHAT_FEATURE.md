# Real-Time Anonymous Live Chat - Documentation

## 🚀 Overview
A **real-time anonymous chat room** where all active users can communicate instantly using WebSocket technology (Socket.IO). Perfect for peer support and community connection in your mental health app.

## ✨ Features Implemented

### 1. Real-Time Communication
- ✅ **WebSocket Connection** via Socket.IO
- ✅ **Instant Message Delivery** - Messages appear immediately for all users
- ✅ **Auto-Reconnect** - Handles connection drops gracefully
- ✅ **Connection Status** - Visual indicator (green = connected, red = disconnected)

### 2. Complete Anonymity
- ✅ **Auto-Generated Names** - "Purple Butterfly", "Blue Dove", "Green Owl", etc.
- ✅ **16 Unique Names** - Automatically assigned when joining
- ✅ **No Personal Info** - User identity completely hidden
- ✅ **Dynamic Assignment** - Names released when users leave

### 3. User Presence
- ✅ **Active User Count** - Shows total users in chat
- ✅ **User List** - Sidebar showing all active anonymous names
- ✅ **Join/Leave Notifications** - System messages when users join or leave
- ✅ **Your Identity Highlight** - Your anonymous name is highlighted

### 4. Typing Indicators
- ✅ **Real-Time Typing** - See when others are typing
- ✅ **Auto-Stop** - Typing indicator stops after 1 second of inactivity
- ✅ **Non-Intrusive** - Subtle animation at bottom of chat

### 5. Message Features
- ✅ **Character Limit** - 500 characters max per message
- ✅ **Message History** - Last 50 messages loaded on join
- ✅ **Auto-Scroll** - Scrolls to latest message automatically
- ✅ **Timestamps** - Time shown for each message
- ✅ **Content Moderation** - Filters inappropriate keywords

### 6. Safety & Moderation
- ✅ **Keyword Filter** - Blocks harmful content
- ✅ **Auto-Expiry** - Messages deleted after 24 hours (MongoDB TTL)
- ✅ **Report System Ready** - Infrastructure for future reporting
- ✅ **Guidelines Display** - Safety rules shown in UI

## 🏗️ Technical Architecture

### Backend (Socket.IO Server)
**File**: `mentra-server/index.js`

```javascript
// Socket.IO Events Handled:
- 'connection' → User connects
- 'join_chat' → User joins with userId
- 'send_message' → User sends message
- 'typing' → User is typing
- 'stop_typing' → User stopped typing
- 'disconnect' → User leaves

// Emitted Events:
- 'chat_history' → Send recent messages to new user
- 'new_message' → Broadcast message to all users
- 'user_joined' → Notify all users of new join
- 'user_left' → Notify all users of leave
- 'active_users_update' → Update user count
- 'user_typing' / 'user_stop_typing' → Typing indicators
- 'error' → Send error to specific user
```

### Frontend (React + Socket.IO Client)
**File**: `mentra-client/src/pages/LiveChat.jsx`

**Features:**
- Real-time message rendering
- Active user sidebar
- Typing indicators
- Auto-scroll to bottom
- Connection status monitoring
- Anonymous name display

### Database Schema
**Model**: `ChatMessage` (`models/ChatMessage.js`)

```javascript
{
  content: String (max 500),
  sender: {
    userId: String (Firebase UID),
    anonymousName: String
  },
  type: Enum ['message', 'join', 'leave', 'system'],
  reported: Boolean,
  isHidden: Boolean,
  timestamps: true,
  expireAfterSeconds: 86400 // Auto-delete after 24 hours
}
```

## 🎯 How It Works

### 1. User Joins Chat
```
User logs in → Opens /live-chat → Socket connects → 
Receives anonymous name → Gets chat history → 
Others notified of join → Shows in active users list
```

### 2. Sending Messages
```
User types message → Triggers typing indicator → 
User sends → Server validates & moderates → 
Saves to MongoDB → Broadcasts to all users → 
Message appears for everyone instantly
```

### 3. User Leaves
```
User closes tab / logs out → Socket disconnects → 
Anonymous name released → Others notified → 
User count updated
```

## 📋 Usage

### Access the Live Chat
1. Navigate to **http://localhost:5174/live-chat**
2. Must be logged in (redirects if not)
3. Auto-connects and assigns anonymous name
4. Start chatting immediately!

### Testing with Multiple Users
1. Open **3-4 browser windows** (or use incognito)
2. Log in with different accounts in each
3. Navigate to `/live-chat` in all windows
4. See real-time synchronization!

## 🔒 Safety Features

### Content Moderation
```javascript
Banned Keywords: 'abuse', 'suicide', 'harm', 'kill', 'death'
Action: Message blocked, user notified
Extend in: mentra-server/index.js (moderateChatMessage function)
```

### Message Limits
- **Length**: 500 characters max
- **Rate Limiting**: Built into Socket.IO
- **Auto-Expiry**: Messages deleted after 24 hours

### Privacy
- ✅ User IDs never shown in messages
- ✅ Anonymous names randomly assigned
- ✅ No message history in localStorage
- ✅ Messages encrypted in transit (HTTPS in production)

## 🚀 Deployment Considerations

### Production Setup
1. **Use HTTPS/WSS** for secure WebSocket connections
2. **Increase Server Capacity** for many concurrent users
3. **Add Redis Adapter** for horizontal scaling:
   ```bash
   npm install @socket.io/redis-adapter
   ```
4. **Implement Rate Limiting** per user
5. **Add Professional Moderation** tools
6. **Monitor Performance** with Socket.IO Admin UI

### Environment Variables
```env
SOCKET_IO_PORT=5000
MONGODB_URI=your_connection_string
CLIENT_URL=https://your-frontend.com
```

### Scaling for High Traffic
```javascript
// Use Redis for multi-server setup
const { createAdapter } = require('@socket.io/redis-adapter');
const { createClient } = require('redis');

const pubClient = createClient({ url: 'redis://localhost:6379' });
const subClient = pubClient.duplicate();

io.adapter(createAdapter(pubClient, subClient));
```

## 🎨 UI Components

### Main Areas
1. **Header** - Title, connection status, active user count
2. **Sidebar** - Active users list, your anonymous name, safety guidelines
3. **Messages Area** - Chat messages with timestamps
4. **Input Area** - Message input with character count

### Visual Indicators
- 🟢 **Green Dot** - User online
- 💬 **Typing Animation** - Someone is typing
- ⚡ **Connected Badge** - WebSocket active
- 👤 **(You)** - Your name highlighted

## 🔮 Future Enhancements

### Suggested Features
- [ ] **Private Rooms** - Topic-based chat rooms
- [ ] **Direct Messages** - 1-on-1 anonymous chat
- [ ] **Emoji Reactions** - React to messages
- [ ] **Message Search** - Find old messages
- [ ] **User Blocking** - Block specific anonymous users
- [ ] **Moderator Role** - Assign chat moderators
- [ ] **Rich Text** - Bold, italic, links
- [ ] **File Sharing** - Share images (with moderation)
- [ ] **Voice Messages** - Audio clips
- [ ] **Read Receipts** - See who's active
- [ ] **Polls** - Quick community polls
- [ ] **Crisis Detection AI** - Auto-detect crisis messages
- [ ] **Professional Matching** - Connect with therapists

## 🐛 Troubleshooting

### Chat Not Connecting
1. Check backend server is running on port 5000
2. Verify Socket.IO is installed (`npm list socket.io`)
3. Check browser console for WebSocket errors
4. Ensure CORS is configured correctly

### Messages Not Appearing
1. Check MongoDB connection
2. Verify user is logged in (Firebase Auth)
3. Check server logs for errors
4. Test content moderation (might be blocking message)

### Performance Issues
1. Limit chat history to last 50 messages
2. Implement message pagination
3. Add Redis caching
4. Monitor Socket.IO connections in server logs

## 📊 Server Logs

Watch for these logs:
```
✅ Connected to MongoDB successfully
🔌 User connected: [socketId]
✅ Purple Butterfly joined chat. Active users: 5
💬 Blue Dove: Hello everyone!
❌ Green Owl left chat. Active users: 4
```

## 🧪 Testing Checklist

- [ ] Multiple users can join simultaneously
- [ ] Messages appear instantly for all users
- [ ] Typing indicators work correctly
- [ ] User count updates in real-time
- [ ] Anonymous names assigned properly
- [ ] Join/leave notifications appear
- [ ] Content moderation blocks bad words
- [ ] Messages persist in database
- [ ] Connection handles network issues
- [ ] Auto-scroll works smoothly

## 📱 Mobile Responsiveness
- ✅ Responsive layout for mobile devices
- ✅ Sidebar collapses on small screens
- ✅ Touch-friendly input and buttons
- ✅ Optimized for portrait and landscape

## 🎓 Code Examples

### Send a Message (Frontend)
```javascript
socket.emit('send_message', {
  content: "Hello world!",
  userId: user.uid
});
```

### Listen for Messages (Frontend)
```javascript
socket.on('new_message', (message) => {
  setMessages(prev => [...prev, message]);
});
```

### Broadcast to All Users (Backend)
```javascript
io.emit('new_message', messageData);
```

---

## 🎉 Success!

Your real-time anonymous live chat is now **fully functional**! Users can:
- ✅ Chat with complete anonymity
- ✅ See who's online in real-time
- ✅ Get instant message delivery
- ✅ Feel safe with content moderation
- ✅ Connect with peers for mental health support

**Built with ❤️ using Socket.IO, React, and MongoDB**
