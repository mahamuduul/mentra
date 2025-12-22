import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBrain, FaPlus, FaTrash, FaLightbulb, FaFrown, FaSmile } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { showSuccessToast, showErrorToast } from '../../utils/toast';

const CBTThoughtRecord = () => {
  const { currentUser } = useAuth();
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    situation: '',
    automaticThought: '',
    emotion: '',
    emotionIntensity: 5,
    alternativeThought: '',
    newEmotionIntensity: 5
  });

  const emotions = [
    'Anxious', 'Sad', 'Angry', 'Frustrated', 'Overwhelmed', 
    'Guilty', 'Ashamed', 'Fearful', 'Lonely', 'Hopeless', 'Other'
  ];

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const token = await currentUser.getIdToken();
      const response = await fetch('http://localhost:5000/api/tools/cbt-thought-record', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const records = await response.json();
        setRecords(records || []);
      }
    } catch (error) {
      console.error('Error fetching records:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.situation || !formData.automaticThought || !formData.emotion || !formData.alternativeThought) {
      showErrorToast('Please fill in all required fields');
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
          toolType: 'cbt-thought-record',
          data: {
            ...formData,
            createdAt: new Date().toISOString()
          }
        }),
      });

      if (response.ok) {
        showSuccessToast('Thought record saved successfully');
        setFormData({
          situation: '',
          automaticThought: '',
          emotion: '',
          emotionIntensity: 5,
          alternativeThought: '',
          newEmotionIntensity: 5
        });
        setShowForm(false);
        fetchRecords();
      } else {
        showErrorToast('Failed to save thought record');
      }
    } catch (error) {
      console.error('Error saving record:', error);
      showErrorToast('Failed to save thought record');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this thought record?')) return;

    try {
      const token = await currentUser.getIdToken();
      const response = await fetch(`http://localhost:5000/api/tools/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        showSuccessToast('Record deleted');
        fetchRecords();
      }
    } catch (error) {
      console.error('Error deleting record:', error);
      showErrorToast('Failed to delete record');
    }
  };

  const getIntensityColor = (intensity) => {
    if (intensity <= 3) return 'bg-green-500';
    if (intensity <= 6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getIntensityBgColor = (intensity) => {
    if (intensity <= 3) return 'bg-green-50 border-green-300';
    if (intensity <= 6) return 'bg-yellow-50 border-yellow-300';
    return 'bg-red-50 border-red-300';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white mb-8 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <FaBrain className="text-4xl" />
              <h1 className="text-3xl font-bold">CBT Thought Record</h1>
            </div>
            <p className="text-purple-100 text-lg">
              Challenge negative thoughts and develop balanced thinking patterns
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-all flex items-center gap-2 shadow-lg"
          >
            <FaPlus /> New Record
          </button>
        </div>
      </div>

      {/* CBT Guide */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-purple-200 rounded-xl p-6 mb-6">
        <h3 className="font-bold text-purple-800 mb-3 flex items-center gap-2">
          <FaLightbulb className="text-yellow-500" />
          How CBT Thought Records Work
        </h3>
        <div className="grid md:grid-cols-4 gap-4 text-sm">
          <div className="bg-white p-4 rounded-lg border-l-4 border-blue-500">
            <div className="font-bold text-blue-700 mb-1">1. Situation</div>
            <p className="text-gray-600">What happened? When and where?</p>
          </div>
          <div className="bg-white p-4 rounded-lg border-l-4 border-orange-500">
            <div className="font-bold text-orange-700 mb-1">2. Automatic Thought</div>
            <p className="text-gray-600">What went through your mind?</p>
          </div>
          <div className="bg-white p-4 rounded-lg border-l-4 border-red-500">
            <div className="font-bold text-red-700 mb-1">3. Emotion (0-10)</div>
            <p className="text-gray-600">How intense was your feeling?</p>
          </div>
          <div className="bg-white p-4 rounded-lg border-l-4 border-green-500">
            <div className="font-bold text-green-700 mb-1">4. Balanced Thought</div>
            <p className="text-gray-600">More realistic perspective</p>
          </div>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-6 border-2 border-purple-200"
        >
          <h3 className="text-xl font-bold mb-4 text-gray-800">Record Your Thoughts</h3>

          <div className="space-y-6">
            {/* Step 1: Situation */}
            <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
              <label className="block text-sm font-bold text-blue-800 mb-2">
                STEP 1: What was the situation? *
              </label>
              <textarea
                value={formData.situation}
                onChange={(e) => handleInputChange('situation', e.target.value)}
                placeholder="Example: I was at work and my boss asked to speak with me privately..."
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-600 mt-1">Be specific about when, where, and what happened</p>
            </div>

            {/* Step 2: Automatic Thought */}
            <div className="bg-orange-50 p-6 rounded-lg border-l-4 border-orange-500">
              <label className="block text-sm font-bold text-orange-800 mb-2">
                STEP 2: What automatic thought went through your mind? *
              </label>
              <textarea
                value={formData.automaticThought}
                onChange={(e) => handleInputChange('automaticThought', e.target.value)}
                placeholder="Example: I'm going to get fired. I must have done something wrong. Everyone thinks I'm incompetent..."
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-600 mt-1">Write the first thoughts that popped into your head</p>
            </div>

            {/* Step 3: Emotion & Intensity */}
            <div className="bg-red-50 p-6 rounded-lg border-l-4 border-red-500">
              <div className="mb-4">
                <label className="block text-sm font-bold text-red-800 mb-2">
                  STEP 3a: What emotion did you feel? *
                </label>
                <select
                  value={formData.emotion}
                  onChange={(e) => handleInputChange('emotion', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Select emotion</option>
                  {emotions.map(emotion => (
                    <option key={emotion} value={emotion}>{emotion}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-red-800 mb-2">
                  STEP 3b: How intense was this emotion? (0-10) *
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={formData.emotionIntensity}
                    onChange={(e) => handleInputChange('emotionIntensity', parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <div className="flex items-center gap-2">
                    <span className={`${getIntensityColor(formData.emotionIntensity)} text-white px-4 py-2 rounded-lg font-bold text-xl w-16 text-center`}>
                      {formData.emotionIntensity}
                    </span>
                    {formData.emotionIntensity <= 3 ? (
                      <FaSmile className="text-2xl text-green-500" />
                    ) : (
                      <FaFrown className="text-2xl text-red-500" />
                    )}
                  </div>
                </div>
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>0 - None</span>
                  <span>5 - Moderate</span>
                  <span>10 - Extreme</span>
                </div>
              </div>
            </div>

            {/* Step 4: Alternative Thought */}
            <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
              <label className="block text-sm font-bold text-green-800 mb-2">
                STEP 4: What's a more balanced, alternative thought? *
              </label>
              <textarea
                value={formData.alternativeThought}
                onChange={(e) => handleInputChange('alternativeThought', e.target.value)}
                placeholder="Example: My boss often has one-on-one meetings with everyone. It doesn't necessarily mean something bad. I've been performing well on my recent projects. Even if there is an issue, I can handle it..."
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-600 mt-1">
                Challenge the negative thought. What evidence contradicts it? What would you tell a friend?
              </p>
            </div>

            {/* New Emotion Intensity */}
            <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
              <label className="block text-sm font-bold text-green-800 mb-2">
                STEP 5: After considering the alternative thought, rate your emotion intensity now (0-10)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={formData.newEmotionIntensity}
                  onChange={(e) => handleInputChange('newEmotionIntensity', parseInt(e.target.value))}
                  className="flex-1"
                />
                <div className="flex items-center gap-2">
                  <span className={`${getIntensityColor(formData.newEmotionIntensity)} text-white px-4 py-2 rounded-lg font-bold text-xl w-16 text-center`}>
                    {formData.newEmotionIntensity}
                  </span>
                  {formData.newEmotionIntensity <= 3 ? (
                    <FaSmile className="text-2xl text-green-500" />
                  ) : (
                    <FaFrown className="text-2xl text-red-500" />
                  )}
                </div>
              </div>
              {formData.emotionIntensity > formData.newEmotionIntensity && (
                <p className="text-green-700 font-semibold mt-2">
                  ✅ Great! Your emotion intensity decreased by {formData.emotionIntensity - formData.newEmotionIntensity} points
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                className="flex-1 bg-purple-600 text-white py-4 rounded-lg font-semibold hover:bg-purple-700 transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <FaBrain /> Save Thought Record
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-6 py-4 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Records List */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-800">Your Thought Records ({records.length})</h3>
        
        {records.length === 0 ? (
          <div className="bg-gray-50 rounded-xl p-12 text-center">
            <FaBrain className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">No thought records yet</p>
            <p className="text-gray-400 text-sm">Start tracking your thoughts to develop more balanced thinking</p>
          </div>
        ) : (
          records.map((record) => (
            <motion.div
              key={record._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-xl shadow-md p-6 border-2 border-purple-200 hover:shadow-lg transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs text-gray-500">
                  {new Date(record.data.createdAt).toLocaleString()}
                </span>
                <button
                  onClick={() => handleDelete(record._id)}
                  className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-all"
                >
                  <FaTrash />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                    <p className="text-xs font-bold text-blue-800 mb-1">SITUATION</p>
                    <p className="text-gray-700">{record.data.situation}</p>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
                    <p className="text-xs font-bold text-orange-800 mb-1">AUTOMATIC THOUGHT</p>
                    <p className="text-gray-700">{record.data.automaticThought}</p>
                  </div>

                  <div className={`p-4 rounded-lg border-l-4 border-red-500 ${getIntensityBgColor(record.data.emotionIntensity)}`}>
                    <p className="text-xs font-bold text-red-800 mb-2">EMOTION & INTENSITY</p>
                    <div className="flex items-center gap-3">
                      <span className="bg-white px-3 py-1 rounded-full font-semibold text-gray-800">
                        {record.data.emotion}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className={`${getIntensityColor(record.data.emotionIntensity)} text-white px-3 py-1 rounded-full font-bold`}>
                          {record.data.emotionIntensity}/10
                        </span>
                        {record.data.emotionIntensity <= 3 ? (
                          <FaSmile className="text-green-500" />
                        ) : (
                          <FaFrown className="text-red-500" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                    <p className="text-xs font-bold text-green-800 mb-1">BALANCED ALTERNATIVE THOUGHT</p>
                    <p className="text-gray-700">{record.data.alternativeThought}</p>
                  </div>

                  <div className={`p-4 rounded-lg border-l-4 border-green-600 ${getIntensityBgColor(record.data.newEmotionIntensity)}`}>
                    <p className="text-xs font-bold text-green-800 mb-2">NEW EMOTION INTENSITY</p>
                    <div className="flex items-center gap-3">
                      <span className={`${getIntensityColor(record.data.newEmotionIntensity)} text-white px-3 py-1 rounded-full font-bold`}>
                        {record.data.newEmotionIntensity}/10
                      </span>
                      {record.data.emotionIntensity > record.data.newEmotionIntensity && (
                        <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          ↓ Improved by {record.data.emotionIntensity - record.data.newEmotionIntensity}
                        </span>
                      )}
                    </div>
                  </div>

                  {record.data.emotionIntensity > record.data.newEmotionIntensity && (
                    <div className="bg-gradient-to-r from-green-100 to-green-200 p-4 rounded-lg text-center">
                      <FaLightbulb className="text-2xl text-green-700 mx-auto mb-2" />
                      <p className="text-green-800 font-semibold text-sm">
                        Balanced thinking helped reduce your emotion intensity!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default CBTThoughtRecord;
