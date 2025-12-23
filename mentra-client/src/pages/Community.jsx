import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BackButton from '../components/BackButton';
import { 
  FaComments, 
  FaPlus, 
  FaHeart, 
  FaComment, 
  FaEye, 
  FaClock,
  FaFilter,
  FaFire,
  FaUserSecret
} from 'react-icons/fa';
import { MdGroups } from 'react-icons/md';

const Community = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [showNewPostModal, setShowNewPostModal] = useState(false);

  const categories = [
    { value: 'all', label: 'All Posts', icon: '', color: 'purple' },
    { value: 'vent', label: 'Vent Space', icon: '', color: 'blue' },
    { value: 'support', label: 'Need Support', icon: '', color: 'green' },
    { value: 'success', label: 'Success Stories', icon: '', color: 'yellow' },
    { value: 'anxiety', label: 'Anxiety', icon: '', color: 'orange' },
    { value: 'depression', label: 'Depression', icon: '', color: 'indigo' },
    { value: 'relationships', label: 'Relationships', icon: '', color: 'pink' },
    { value: 'work-stress', label: 'Work Stress', icon: '', color: 'red' },
    { value: 'other', label: 'Other', icon: '', color: 'gray' }
  ];

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/community?category=${selectedCategory}&sort=${sortBy}`
      );
      const data = await response.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, sortBy]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
      }
    }
    return 'Just now';
  };

  return (
    <div className="min-h-screen bg-white pt-20 relative">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 border-b border-2 border-purple-200 text-white py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-4">
            <BackButton className="text-white hover:text-purple-200 hover:bg-white/10" />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-white rounded-xl border-2 border-purple-200">
                  <MdGroups className="text-4xl text-purple-600" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold">Community Support</h1>
                  <p className="text-white mt-1">A safe, anonymous space to connect and share</p>
                </div>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <FaUserSecret className="text-purple-200" />
                  <span>100% Anonymous</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaComments className="text-purple-200" />
                  <span>Peer Support</span>
                </div>
                <div className="flex items-center gap-2">
                  <MdGroups className="text-purple-200" />
                  <span>Safe Community</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowNewPostModal(true)}
              className="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-6 py-3 rounded-full font-semibold flex items-center gap-2 hover:scale-105 transition-all shadow-xl"
            >
              <FaPlus /> New Post
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid lg:grid-cols-4 gap-6">
          
          {/* Sidebar - Categories */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-xl border-2 border-purple-200 p-6 sticky top-24">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-900">
                <FaFilter className="text-purple-600" />
                Categories
              </h3>
              <div className="space-y-2">
                {categories.map(cat => (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 ${
                      selectedCategory === cat.value
                        ? 'bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-xl scale-105'
                        : 'bg-white hover:border-purple-500 text-gray-900 border-2 border-purple-200'
                    }`}
                  >
                    {cat.icon && <span className="text-xl">{cat.icon}</span>}
                    <span className="font-medium text-sm">{cat.label}</span>
                  </button>
                ))}
              </div>

              {/* Sort Options */}
              <div className="mt-6 pt-6 border-t border-2 border-purple-200">
                <h4 className="font-semibold text-sm mb-3 text-gray-600">Sort By</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => setSortBy('recent')}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${
                      sortBy === 'recent' ? 'bg-gradient-to-r from-purple-600 to-purple-800 text-white' : 'hover:bg-purple-50 text-gray-600'
                    }`}
                  >
                    <FaClock className="text-xs" /> Recent
                  </button>
                  <button
                    onClick={() => setSortBy('popular')}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${
                      sortBy === 'popular' ? 'bg-gradient-to-r from-purple-600 to-purple-800 text-white' : 'hover:bg-purple-50 text-gray-600'
                    }`}
                  >
                    <FaFire className="text-xs" /> Popular
                  </button>
                  <button
                    onClick={() => setSortBy('discussed')}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${
                      sortBy === 'discussed' ? 'bg-gradient-to-r from-purple-600 to-purple-800 text-white' : 'hover:bg-purple-50 text-gray-600'
                    }`}
                  >
                    <FaComment className="text-xs" /> Most Discussed
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Posts */}
          <div className="lg:col-span-3 space-y-4">
            {loading ? (
              // Loading skeletons
              [...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-xl border-2 border-purple-200 animate-pulse">
                  <div className="h-6 bg-purple-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-purple-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-purple-200 rounded w-5/6"></div>
                </div>
              ))
            ) : posts.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center shadow-xl border-2 border-purple-200">
                <h3 className="text-xl font-bold text-gray-900 mb-2">No posts yet</h3>
                <p className="text-gray-600 mb-4">Be the first to share in this category!</p>
                <button
                  onClick={() => setShowNewPostModal(true)}
                  className="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-6 py-2 rounded-full hover:scale-105 transition-all shadow-xl"
                >
                  Create Post
                </button>
              </div>
            ) : (
              posts.map(post => (
                <div
                  key={post._id}
                  onClick={() => navigate(`/community/${post._id}`)}
                  className="bg-white rounded-xl p-6 shadow-xl border-2 border-purple-200 hover:border-purple-500 hover:shadow-2xl transition-all cursor-pointer"
                >
                  {/* Post Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center text-white font-bold">
                        {post.author.anonymousName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{post.author.anonymousName}</p>
                        <p className="text-xs text-purple-600 flex items-center gap-2">
                          <FaClock className="text-[10px]" />
                          {formatTimeAgo(post.createdAt)}
                        </p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-600 to-purple-800 text-white">
                      {categories.find(c => c.value === post.category)?.icon} {categories.find(c => c.value === post.category)?.label}
                    </span>
                  </div>

                  {/* Post Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h3>
                  <p className="text-gray-600 line-clamp-3 mb-4">{post.content}</p>

                  {/* Post Stats */}
                  <div className="flex items-center gap-6 text-sm text-purple-600 pt-4 border-t border-2 border-purple-200">
                    <div className="flex items-center gap-2">
                      <FaHeart className="text-pink-400" />
                      <span>{post.likesCount || 0}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaComment className="text-purple-400" />
                      <span>{post.repliesCount || 0} replies</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaEye className="text-purple-400" />
                      <span>{post.views || 0} views</span>
                    </div>
                    {post.isVent && (
                      <span className="ml-auto px-3 py-1 bg-blue-500 text-white rounded-full text-xs font-medium">
                        Vent Space
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>

      {/* New Post Modal - We'll create this next */}
      {showNewPostModal && (
        <NewPostModal 
          onClose={() => setShowNewPostModal(false)}
          onPostCreated={() => {
            setShowNewPostModal(false);
            fetchPosts();
          }}
          categories={categories}
        />
      )}
    </div>
  );
};

// New Post Modal Component (placeholder - will implement next)
const NewPostModal = ({ onClose, onPostCreated, categories }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general',
    isVent: false
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setError('');
    setSubmitting(true);

    try {
      const response = await fetch('http://localhost:5000/api/community', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          userId: user.uid
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create post');
      }

      onPostCreated();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white border-2 border-purple-200 rounded-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Create New Post</h2>
          <button onClick={onClose} className="text-purple-600 hover:text-purple-800 text-2xl transition-colors">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Title</label>
            <input
              type="text"
              required
              maxLength={200}
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 bg-white border-2 border-purple-200 text-gray-900 placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Give your post a title..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 bg-white border-2 border-purple-200 text-gray-900 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {categories.filter(c => c.value !== 'all').map(cat => (
                <option key={cat.value} value={cat.value} className="bg-white">
                  {cat.icon} {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Your Message</label>
            <textarea
              required
              maxLength={5000}
              rows={8}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-4 py-3 bg-white border-2 border-purple-200 text-gray-900 placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Share your thoughts, feelings, or ask for support..."
            />
            <p className="text-xs text-purple-600 mt-1">{formData.content.length}/5000 characters</p>
          </div>

          <div className="flex items-center gap-2 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
            <input
              type="checkbox"
              id="isVent"
              checked={formData.isVent}
              onChange={(e) => setFormData({ ...formData, isVent: e.target.checked })}
              className="w-4 h-4 text-purple-600 bg-white border-2 border-purple-200 rounded"
            />
            <label htmlFor="isVent" className="text-sm text-gray-700">
              This is a vent post (just need to get it out, don't need advice)
            </label>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border-2 border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-purple-200 text-gray-900 rounded-lg hover:border-purple-500 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg hover:scale-105 transition-all disabled:opacity-50 shadow-xl"
            >
              {submitting ? 'Posting...' : 'Post Anonymously'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Community;
