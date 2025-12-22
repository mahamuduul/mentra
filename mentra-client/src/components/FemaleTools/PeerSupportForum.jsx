import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaPlus, FaFlag, FaBan, FaComment, FaHeart, FaExclamationTriangle } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { showSuccessToast, showErrorToast } from '../../utils/toast';

const PeerSupportForum = () => {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewPost, setShowNewPost] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const [newPost, setNewPost] = useState({
    category: '',
    title: '',
    content: '',
    anonymous: false
  });

  const categories = [
    { id: 'relationship', name: 'Relationships', color: 'pink', icon: '💕' },
    { id: 'work', name: 'Work/Career', color: 'blue', icon: '💼' },
    { id: 'family', name: 'Family', color: 'purple', icon: '👨‍👩‍👧‍👦' },
    { id: 'self-care', name: 'Self-Care', color: 'green', icon: '🧘‍♀️' },
    { id: 'mental-health', name: 'Mental Health', color: 'teal', icon: '🧠' },
    { id: 'other', name: 'Other', color: 'gray', icon: '💬' },
  ];

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const token = await currentUser.getIdToken();
      const response = await fetch('http://localhost:5000/api/tools/peer-support', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const posts = await response.json();
        setPosts(posts || []);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitPost = async () => {
    if (!newPost.category || !newPost.title || !newPost.content) {
      showErrorToast('Please fill in all fields');
      return;
    }

    try {
      const token = await currentUser.getIdToken();
      const response = await fetch('http://localhost:5000/api/tools', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          toolType: 'peer-support',
          data: {
            ...newPost,
            createdAt: new Date().toISOString(),
            likes: 0,
            comments: 0,
            status: 'pending-moderation'
          }
        }),
      });

      if (response.ok) {
        showSuccessToast('Post submitted for moderation');
        setNewPost({ category: '', title: '', content: '', anonymous: false });
        setShowNewPost(false);
        fetchPosts();
      } else {
        showErrorToast('Failed to submit post');
      }
    } catch (error) {
      console.error('Error submitting post:', error);
      showErrorToast('Failed to submit post');
    }
  };

  const handleLikePost = async (postId) => {
    // Simulate like functionality
    setPosts(posts.map(post => 
      post._id === postId 
        ? { ...post, data: { ...post.data, likes: (post.data.likes || 0) + 1 } }
        : post
    ));
    showSuccessToast('Post liked!');
  };

  const handleReportPost = (postId) => {
    if (confirm('Report this post to moderators?')) {
      showSuccessToast('Post reported. Moderators will review it.');
    }
  };

  const getCategoryColor = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.color || 'gray';
  };

  const getCategoryIcon = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.icon || '💬';
  };

  const filteredPosts = selectedCategory === 'all' 
    ? posts 
    : posts.filter(post => post.data.category === selectedCategory);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600 to-rose-600 rounded-2xl p-8 text-white mb-8 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <FaUsers className="text-4xl" />
              <h1 className="text-3xl font-bold">Peer Support Forum</h1>
            </div>
            <p className="text-pink-100 text-lg">
              Connect with others, share experiences, and support each other
            </p>
          </div>
          <button
            onClick={() => setShowNewPost(!showNewPost)}
            className="bg-white text-pink-600 px-6 py-3 rounded-lg font-semibold hover:bg-pink-50 transition-all flex items-center gap-2 shadow-lg"
          >
            <FaPlus /> New Post
          </button>
        </div>
      </div>

      {/* Community Guidelines */}
      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg mb-6">
        <h4 className="font-bold text-yellow-800 mb-2 flex items-center gap-2">
          <FaExclamationTriangle />
          Community Guidelines
        </h4>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>• Be respectful and supportive - we're all here to help each other</li>
          <li>• All posts are moderated before appearing publicly</li>
          <li>• You can report inappropriate content - moderators will review it</li>
          <li>• This is a safe space for sharing experiences and seeking advice</li>
        </ul>
      </div>

      {/* New Post Form */}
      {showNewPost && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-6 border-2 border-pink-200"
        >
          <h3 className="text-xl font-bold mb-4 text-gray-800">Create New Post</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={newPost.category}
                onChange={(e) => setNewPost({...newPost, category: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={newPost.title}
                onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                placeholder="Give your post a clear title..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Message *
              </label>
              <textarea
                value={newPost.content}
                onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                placeholder="Share your thoughts, experiences, or ask for advice..."
                rows="6"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="anonymous"
                checked={newPost.anonymous}
                onChange={(e) => setNewPost({...newPost, anonymous: e.target.checked})}
                className="w-4 h-4 text-pink-600"
              />
              <label htmlFor="anonymous" className="text-sm text-gray-700">
                Post anonymously
              </label>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSubmitPost}
                className="flex-1 bg-pink-600 text-white py-3 rounded-lg font-semibold hover:bg-pink-700 transition-all shadow-lg"
              >
                Submit for Moderation
              </button>
              <button
                onClick={() => setShowNewPost(false)}
                className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
            selectedCategory === 'all'
              ? 'bg-pink-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All Posts ({posts.length})
        </button>
        {categories.map(cat => {
          const count = posts.filter(p => p.data.category === cat.id).length;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                selectedCategory === cat.id
                  ? `bg-${cat.color}-600 text-white`
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {cat.icon} {cat.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="bg-gray-50 rounded-xl p-12 text-center">
            <FaUsers className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">No posts yet in this category</p>
            <p className="text-gray-400 text-sm">Be the first to share your thoughts!</p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <motion.div
              key={post._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className={`bg-${getCategoryColor(post.data.category)}-100 text-${getCategoryColor(post.data.category)}-700 px-3 py-1 rounded-full text-sm font-semibold`}>
                    {getCategoryIcon(post.data.category)} {categories.find(c => c.id === post.data.category)?.name}
                  </span>
                  {post.data.anonymous && (
                    <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs">
                      Anonymous
                    </span>
                  )}
                  {post.data.status === 'pending-moderation' && (
                    <span className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full text-xs">
                      Pending Moderation
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(post.data.createdAt).toLocaleDateString()}
                </span>
              </div>

              <h3 className="text-xl font-bold text-gray-800 mb-3">{post.data.title}</h3>
              <p className="text-gray-700 mb-4 whitespace-pre-wrap">{post.data.content}</p>

              <div className="flex items-center gap-4 pt-4 border-t">
                <button
                  onClick={() => handleLikePost(post._id)}
                  className="flex items-center gap-2 text-pink-600 hover:text-pink-700 font-semibold"
                >
                  <FaHeart /> {post.data.likes || 0} Likes
                </button>
                <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold">
                  <FaComment /> {post.data.comments || 0} Comments
                </button>
                <button
                  onClick={() => handleReportPost(post._id)}
                  className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold ml-auto"
                >
                  <FaFlag /> Report
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default PeerSupportForum;
