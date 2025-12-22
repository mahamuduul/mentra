import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FaHeart, 
  FaComment, 
  FaEye, 
  FaClock,
  FaArrowLeft,
  FaFlag,
  FaPaperPlane
} from 'react-icons/fa';
import { MdHug } from 'react-icons/md';

const CommunityPost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [liked, setLiked] = useState(false);
  const [hugged, setHugged] = useState(false);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/community/${postId}`);
      const data = await response.json();
      setPost(data);
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  const handleLike = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/community/${postId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.uid })
      });
      const data = await response.json();
      setPost({ ...post, likesCount: data.likesCount });
      setLiked(data.liked);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleHug = async () => {
    if (!user || hugged) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/community/${postId}/hug`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.uid })
      });
      const data = await response.json();
      setPost({ ...post, hugsCount: data.hugsCount });
      setHugged(true);
    } catch (error) {
      console.error('Error sending hug:', error);
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!user || !replyText.trim()) return;

    setSubmitting(true);
    try {
      const response = await fetch(`http://localhost:5000/api/community/${postId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: replyText,
          userId: user.uid
        })
      });
      
      if (response.ok) {
        setReplyText('');
        fetchPost(); // Refresh to show new reply
      }
    } catch (error) {
      console.error('Error posting reply:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReport = async () => {
    if (!user) return;
    
    if (window.confirm('Are you sure you want to report this post? Our moderators will review it.')) {
      try {
        await fetch(`http://localhost:5000/api/community/${postId}/report`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.uid })
        });
        alert('Post reported. Thank you for keeping our community safe.');
      } catch (error) {
        console.error('Error reporting post:', error);
      }
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl text-gray-600">Post not found</p>
          <button
            onClick={() => navigate('/community')}
            className="mt-4 text-primary-600 hover:underline"
          >
            ← Back to Community
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <button
          onClick={() => navigate('/community')}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors"
        >
          <FaArrowLeft /> Back to Community
        </button>

        {/* Main Post Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          {/* Post Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {post.author.anonymousName.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-lg text-gray-800">{post.author.anonymousName}</p>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <FaClock className="text-xs" />
                  {formatTimeAgo(post.createdAt)}
                </p>
              </div>
            </div>
            <button
              onClick={handleReport}
              className="text-gray-400 hover:text-red-500 transition-colors"
              title="Report post"
            >
              <FaFlag />
            </button>
          </div>

          {/* Category Badge */}
          {post.category && (
            <div className="mb-4">
              <span className="px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                {post.category.replace('-', ' ')}
              </span>
            </div>
          )}

          {/* Vent Badge */}
          {post.isVent && (
            <div className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
              <p className="text-sm text-blue-700">
                💭 <strong>Vent Space:</strong> This person is just venting and may not need advice right now. Please be supportive and understanding.
              </p>
            </div>
          )}

          {/* Post Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>

          {/* Post Content */}
          <div className="prose max-w-none mb-6">
            <p className="text-gray-700 text-lg whitespace-pre-wrap">{post.content}</p>
          </div>

          {/* Post Stats & Actions */}
          <div className="flex items-center gap-6 pt-6 border-t">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 transition-all hover:scale-110 ${
                liked ? 'text-pink-500' : 'text-gray-500 hover:text-pink-500'
              }`}
            >
              <FaHeart className={liked ? 'fill-current' : ''} />
              <span className="font-medium">{post.likesCount || 0}</span>
            </button>
            
            <button
              onClick={handleHug}
              disabled={hugged}
              className={`flex items-center gap-2 transition-all hover:scale-110 ${
                hugged ? 'text-purple-500' : 'text-gray-500 hover:text-purple-500'
              } disabled:opacity-50`}
            >
              <MdHug className="text-xl" />
              <span className="font-medium">{post.hugsCount || 0}</span>
            </button>
            
            <div className="flex items-center gap-2 text-gray-500">
              <FaComment />
              <span>{post.replies?.length || 0}</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-400 ml-auto">
              <FaEye />
              <span>{post.views || 0} views</span>
            </div>
          </div>
        </div>

        {/* Reply Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FaComment className="text-primary-600" />
            Share Your Support
          </h3>
          <form onSubmit={handleReply}>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a supportive message..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              rows={4}
              maxLength={1000}
            />
            <div className="flex justify-between items-center mt-3">
              <p className="text-xs text-gray-500">{replyText.length}/1000</p>
              <button
                type="submit"
                disabled={!replyText.trim() || submitting}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {submitting ? 'Posting...' : (
                  <>
                    <FaPaperPlane /> Post Reply
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Replies Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900">
            {post.replies?.length || 0} {post.replies?.length === 1 ? 'Reply' : 'Replies'}
          </h3>
          
          {post.replies && post.replies.length > 0 ? (
            post.replies.map((reply, index) => (
              <div key={index} className="bg-white rounded-xl shadow p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    {reply.author.anonymousName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-gray-800">{reply.author.anonymousName}</p>
                      <p className="text-xs text-gray-500">{formatTimeAgo(reply.createdAt)}</p>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap">{reply.content}</p>
                    <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
                      <button className="hover:text-pink-500 transition-colors flex items-center gap-1">
                        <FaHeart /> {reply.likesCount || 0}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl p-12 text-center text-gray-500">
              <FaComment className="text-4xl mx-auto mb-3 text-gray-300" />
              <p>No replies yet. Be the first to offer support!</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default CommunityPost;
