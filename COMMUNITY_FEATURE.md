# Anonymous Community Forum - Feature Documentation

## Overview
A safe, moderated community support system where users can share experiences, offer support, and connect anonymously.

## Features Implemented

### ✅ 1. Anonymous Posting System
- **Random Anonymous Names**: Each user gets a unique name like "Purple Butterfly", "Blue Dove", etc.
- **No Personal Details**: User IDs are hidden from responses
- **Full Anonymity**: Posts and replies are completely anonymous

### ✅ 2. Discussion Categories
- **All Posts** (🌟)
- **Vent Space** (💭) - Just need to express feelings
- **Need Support** (🤝) - Asking for help
- **Success Stories** (🎉) - Sharing wins
- **Anxiety** (😰) - Anxiety-specific discussions
- **Depression** (😔) - Depression support
- **Relationships** (💕) - Relationship topics
- **Work Stress** (💼) - Work-related stress
- **Other** (💬) - General topics

### ✅ 3. Vent Posts Feature
- Special "Vent Space" badge
- Warning message: "This person is just venting and may not need advice"
- Encourages supportive listening over advice-giving

### ✅ 4. Safety & Moderation Features

#### Content Moderation
- **Keyword Filter**: Automatically blocks harmful content
- **Crisis Detection**: Flags concerning keywords and shows crisis support message
- **User Reporting**: Any post can be reported
- **Auto-Hide**: Posts with 3+ reports are automatically hidden
- **Report Tracking**: Counts reports for moderator review

#### Banned Keywords (Current List)
- abuse, suicide, harm, kill, death
- **Note**: Extend this list in `/routes/community.js`

### ✅ 5. Community Engagement

#### Reactions
- **Likes** (❤️): Show agreement/support
- **Hugs** (🤗): Send virtual hugs (one per user)
- **Replies**: Supportive comments and discussions

#### Sorting Options
- **Recent**: Latest posts first (default)
- **Popular**: Most liked posts
- **Most Discussed**: Posts with most replies

### ✅ 6. Post Detail Page
- Full post view with all replies
- Reply directly to posts
- Like/Unlike functionality
- Send hugs to show support
- Report inappropriate content
- View counts tracking

## API Endpoints

### Community Routes (`/api/community`)

#### GET `/api/community`
Get all posts with filters
```
Query Parameters:
- category: string (all, vent, support, etc.)
- sort: string (recent, popular, discussed)
- page: number (default: 1)
- limit: number (default: 20)

Response: { posts: [], totalPages: number, currentPage: number }
```

#### GET `/api/community/:id`
Get single post with replies
```
Response: { _id, title, content, author, replies, stats, ... }
```

#### POST `/api/community`
Create new post
```
Body: {
  title: string (max 200 chars),
  content: string (max 5000 chars),
  category: string,
  isVent: boolean,
  userId: string,
  tags: string[] (optional)
}
```

#### POST `/api/community/:id/reply`
Add reply to post
```
Body: {
  content: string (max 1000 chars),
  userId: string
}
```

#### POST `/api/community/:id/like`
Like/unlike a post
```
Body: { userId: string }
Response: { likesCount: number, liked: boolean }
```

#### POST `/api/community/:id/hug`
Send a hug to post
```
Body: { userId: string }
Response: { hugsCount: number }
```

#### POST `/api/community/:id/report`
Report inappropriate content
```
Body: { userId: string, reason: string (optional) }
```

#### GET `/api/community/user/:userId`
Get user's posts (for profile)

## Database Schema

### Post Model (`models/Post.js`)
```javascript
{
  title: String (required, max 200),
  content: String (required, max 5000),
  category: Enum,
  isVent: Boolean,
  author: {
    userId: ObjectId (ref: User),
    anonymousName: String (auto-generated)
  },
  replies: [ReplySchema],
  likes: [ObjectId],
  hugs: [ObjectId],
  reported: Boolean,
  reportCount: Number,
  isHidden: Boolean,
  isPinned: Boolean,
  views: Number,
  tags: [String],
  timestamps: true
}
```

### Reply Schema
```javascript
{
  content: String (required, max 1000),
  author: {
    userId: ObjectId,
    anonymousName: String (auto-generated)
  },
  likes: [ObjectId],
  reported: Boolean,
  reportCount: Number,
  isHidden: Boolean,
  createdAt: Date
}
```

## Frontend Pages

### `/community` - Main Community Page
- Category sidebar with filters
- Post list view
- Sort options (recent, popular, discussed)
- Create new post modal
- Loading states and empty states

### `/community/:postId` - Post Detail Page
- Full post content
- All replies
- Reply form
- Like/Hug actions
- Report button
- Back to community navigation

## Safety Guidelines

### For Users
1. **Be Kind**: Treat others with respect and empathy
2. **No Personal Info**: Never share personal details
3. **Report Abuse**: Use the report button for harmful content
4. **Crisis Support**: If in crisis, contact helpline (link in Crisis Support page)

### For Moderators (Future Enhancement)
- Review reported posts
- Manual content moderation
- Ban users if necessary
- Pin important posts
- Manage categories

## Future Enhancements

### Suggested Features
- [ ] Real-time chat (WebSocket implementation)
- [ ] Direct messaging between users (still anonymous)
- [ ] Upvote/downvote system for replies
- [ ] Trending topics
- [ ] Search functionality
- [ ] User reputation system (anonymous karma)
- [ ] Moderator dashboard
- [ ] Advanced AI moderation (Perspective API)
- [ ] Email notifications for replies
- [ ] Bookmarks/save posts
- [ ] Follow topics
- [ ] Weekly digest
- [ ] Community guidelines page
- [ ] Anonymous polls
- [ ] Crisis helpline integration
- [ ] Professional support matching

## Security Considerations

### Current Implementation
✅ Anonymous names auto-generated
✅ User IDs hidden from responses
✅ Content length limits
✅ Basic keyword filtering
✅ User reporting system
✅ Auto-hide after multiple reports

### Recommended Additions
- [ ] Rate limiting on post creation
- [ ] CAPTCHA for form submissions
- [ ] IP tracking (for abuse prevention)
- [ ] Advanced AI content moderation
- [ ] Shadow banning for repeat offenders
- [ ] Image upload moderation
- [ ] Link validation and safety checks

## Usage

### Create a Post
1. Navigate to `/community`
2. Click "New Post" button
3. Fill in title, select category, write content
4. Optionally mark as "Vent Post"
5. Click "Post Anonymously"

### Reply to Post
1. Click on any post to view details
2. Scroll to reply form
3. Write supportive message
4. Click "Post Reply"

### React to Content
- Click ❤️ to like/unlike
- Click 🤗 to send a hug
- Click 🚩 to report

## Testing

### Test Scenarios
1. Create post with different categories
2. Create vent post and verify badge shows
3. Reply to posts
4. Like/unlike posts
5. Send hugs
6. Report post (verify auto-hide after 3 reports)
7. Test content moderation (try banned words)
8. Test sorting options
9. Test category filters
10. Test anonymous name generation

## Deployment Considerations

### Environment Variables
```
MONGODB_URI=your_mongodb_connection_string
PORT=5000
CLIENT_URL=https://your-frontend-url.com
```

### Production Checklist
- [ ] Update banned words list
- [ ] Set up professional moderation tools
- [ ] Configure email notifications
- [ ] Implement advanced analytics
- [ ] Add community guidelines page
- [ ] Set up monitoring and alerts
- [ ] Implement backup strategy
- [ ] Add crisis helpline integration
- [ ] Legal review (terms of service, privacy policy)
- [ ] GDPR compliance (data deletion, exports)

## Support

For issues or questions:
- Check backend logs in terminal
- Verify MongoDB connection
- Check browser console for frontend errors
- Ensure both frontend (5174) and backend (5000) are running

---

**Built with ❤️ for Mental Health Support**
