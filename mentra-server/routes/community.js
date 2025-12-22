const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const { body, validationResult, param } = require('express-validator');

// Content moderation function (simple keyword filter)
const moderateContent = (text) => {
  const bannedWords = ['abuse', 'suicide', 'harm', 'kill', 'death']; // Extend this list
  const lowerText = text.toLowerCase();
  
  for (const word of bannedWords) {
    if (lowerText.includes(word)) {
      return {
        safe: false,
        message: 'Your message contains sensitive content. If you\'re in crisis, please contact a crisis helpline immediately. See our Crisis Support page.'
      };
    }
  }
  
  return { safe: true };
};

// GET all posts (with filters)
router.get('/', async (req, res) => {
  try {
    const { category, sort = 'recent', page = 1, limit = 20 } = req.query;
    
    const filter = { isHidden: false };
    if (category && category !== 'all') {
      filter.category = category;
    }

    let sortOption = {};
    switch (sort) {
      case 'popular':
        sortOption = { likes: -1, createdAt: -1 };
        break;
      case 'discussed':
        sortOption = { 'replies.length': -1, createdAt: -1 };
        break;
      default: // recent
        sortOption = { isPinned: -1, createdAt: -1 };
    }

    const posts = await Post.find(filter)
      .sort(sortOption)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-author.userId -replies.author.userId') // Hide user IDs
      .lean();

    const count = await Post.countDocuments(filter);

    res.json({
      posts: posts.map(post => ({
        ...post,
        likesCount: post.likes?.length || 0,
        hugsCount: post.hugs?.length || 0,
        repliesCount: post.replies?.length || 0,
        likes: undefined,
        hugs: undefined
      })),
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// GET single post
router.get('/:id', [
  param('id').isMongoId()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const post = await Post.findById(req.params.id)
      .select('-author.userId -replies.author.userId')
      .lean();

    if (!post || post.isHidden) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Increment views
    await Post.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

    res.json({
      ...post,
      likesCount: post.likes?.length || 0,
      hugsCount: post.hugs?.length || 0,
      likes: undefined,
      hugs: undefined,
      replies: post.replies?.map(reply => ({
        ...reply,
        likesCount: reply.likes?.length || 0,
        likes: undefined
      }))
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

// CREATE new post
router.post('/', [
  body('title').trim().notEmpty().isLength({ max: 200 }),
  body('content').trim().notEmpty().isLength({ max: 5000 }),
  body('category').isIn(['general', 'vent', 'support', 'success', 'anxiety', 'depression', 'relationships', 'work-stress', 'other']),
  body('isVent').optional().isBoolean(),
  body('userId').notEmpty(),
  body('tags').optional().isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, category, isVent, userId, tags } = req.body;

    // Content moderation
    const titleCheck = moderateContent(title);
    if (!titleCheck.safe) {
      return res.status(400).json({ error: titleCheck.message });
    }

    const contentCheck = moderateContent(content);
    if (!contentCheck.safe) {
      return res.status(400).json({ error: contentCheck.message });
    }

    const post = new Post({
      title,
      content,
      category,
      isVent: isVent || category === 'vent',
      author: {
        userId
      },
      tags: tags || []
    });

    await post.save();

    // Remove sensitive data before sending response
    const responsePost = post.toObject();
    delete responsePost.author.userId;
    delete responsePost.likes;
    delete responsePost.hugs;

    res.status(201).json({
      ...responsePost,
      likesCount: 0,
      hugsCount: 0,
      repliesCount: 0
    });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// ADD reply to post
router.post('/:id/reply', [
  param('id').isMongoId(),
  body('content').trim().notEmpty().isLength({ max: 1000 }),
  body('userId').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { content, userId } = req.body;

    // Content moderation
    const contentCheck = moderateContent(content);
    if (!contentCheck.safe) {
      return res.status(400).json({ error: contentCheck.message });
    }

    const post = await Post.findById(req.params.id);
    if (!post || post.isHidden) {
      return res.status(404).json({ error: 'Post not found' });
    }

    post.replies.push({
      content,
      author: {
        userId
      }
    });

    await post.save();

    const newReply = post.replies[post.replies.length - 1].toObject();
    delete newReply.author.userId;
    delete newReply.likes;

    res.status(201).json({
      ...newReply,
      likesCount: 0
    });
  } catch (error) {
    console.error('Error adding reply:', error);
    res.status(500).json({ error: 'Failed to add reply' });
  }
});

// LIKE post
router.post('/:id/like', [
  param('id').isMongoId(),
  body('userId').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post || post.isHidden) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const likeIndex = post.likes.indexOf(userId);
    if (likeIndex > -1) {
      // Unlike
      post.likes.splice(likeIndex, 1);
    } else {
      // Like
      post.likes.push(userId);
    }

    await post.save();

    res.json({ likesCount: post.likes.length, liked: likeIndex === -1 });
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).json({ error: 'Failed to like post' });
  }
});

// SEND HUG to post
router.post('/:id/hug', [
  param('id').isMongoId(),
  body('userId').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post || post.isHidden) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const hugIndex = post.hugs.indexOf(userId);
    if (hugIndex === -1) {
      post.hugs.push(userId);
      await post.save();
    }

    res.json({ hugsCount: post.hugs.length });
  } catch (error) {
    console.error('Error sending hug:', error);
    res.status(500).json({ error: 'Failed to send hug' });
  }
});

// REPORT post
router.post('/:id/report', [
  param('id').isMongoId(),
  body('userId').notEmpty(),
  body('reason').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    post.reportCount += 1;
    post.reported = true;

    // Auto-hide if too many reports
    if (post.reportCount >= 3) {
      post.isHidden = true;
    }

    await post.save();

    res.json({ message: 'Post reported. Thank you for keeping our community safe.' });
  } catch (error) {
    console.error('Error reporting post:', error);
    res.status(500).json({ error: 'Failed to report post' });
  }
});

// GET user's posts (for profile)
router.get('/user/:userId', async (req, res) => {
  try {
    const posts = await Post.find({
      'author.userId': req.params.userId,
      isHidden: false
    })
      .sort({ createdAt: -1 })
      .limit(50)
      .select('-author.userId')
      .lean();

    res.json(posts.map(post => ({
      ...post,
      likesCount: post.likes?.length || 0,
      hugsCount: post.hugs?.length || 0,
      repliesCount: post.replies?.length || 0,
      likes: undefined,
      hugs: undefined
    })));
  } catch (error) {
    console.error('Error fetching user posts:', error);
    res.status(500).json({ error: 'Failed to fetch user posts' });
  }
});

module.exports = router;
