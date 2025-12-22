import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { showSuccessToast, showErrorToast } from '../../utils/toast';
import { FaLightbulb, FaCheckCircle } from 'react-icons/fa';

const CBTReframingWorksheet = () => {
  const { currentUser } = useAuth();
  const [worksheet, setWorksheet] = useState({
    situation: '',
    negativeThought: '',
    emotions: [],
    evidenceFor: '',
    evidenceAgainst: '',
    balancedThought: '',
  });
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const emotionOptions = [
    'Anxious', 'Angry', 'Sad', 'Frustrated', 'Overwhelmed',
    'Hopeless', 'Guilty', 'Ashamed', 'Fearful', 'Irritated'
  ];

  const cognitiveDistortions = [
    { name: 'All-or-Nothing', description: 'Seeing things in black and white' },
    { name: 'Overgeneralization', description: 'Making broad conclusions from single events' },
    { name: 'Mental Filter', description: 'Focusing only on negatives' },
    { name: 'Catastrophizing', description: 'Expecting the worst possible outcome' },
    { name: 'Personalization', description: 'Blaming yourself for things outside your control' },
  ];

  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchHistory = async () => {
    try {
      const token = await currentUser.getIdToken();
      const response = await fetch('http://localhost:5000/api/tools/cbt-reframing', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (!response.ok) {
        console.error('Failed to fetch history:', response.status);
        return;
      }
      
      const data = await response.json();
      setHistory(data || []);
    } catch (error) {
      console.error('Error:', error);
      showErrorToast('Failed to load history');
    }
  };

  const handleEmotionToggle = (emotion) => {
    setWorksheet({
      ...worksheet,
      emotions: worksheet.emotions.includes(emotion)
        ? worksheet.emotions.filter(e => e !== emotion)
        : [...worksheet.emotions, emotion]
    });
  };

  const handleSave = async () => {
    if (!worksheet.situation.trim()) {
      showErrorToast('Please describe the situation');
      return;
    }

    if (!worksheet.negativeThought.trim()) {
      showErrorToast('Please enter your negative thought');
      return;
    }

    if (!worksheet.balancedThought.trim()) {
      showErrorToast('Please create a balanced thought');
      return;
    }

    setIsLoading(true);
    try {
      const token = await currentUser.getIdToken();
      const response = await fetch('http://localhost:5000/api/tools', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          toolType: 'cbt-reframing',
          data: worksheet,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Save worksheet failed:', response.status, errorData);
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }
      
      await response.json();
      showSuccessToast('Worksheet saved successfully');
      fetchHistory();
      setWorksheet({
        situation: '',
        negativeThought: '',
        emotions: [],
        evidenceFor: '',
        evidenceAgainst: '',
        balancedThought: '',
      });
    } catch (error) {
      showErrorToast(error.message || 'Failed to save worksheet');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* CBT Reframing Guide */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div className="flex items-start space-x-3">
          <FaLightbulb className="text-blue-600 text-xl mt-1" />
          <div>
            <h5 className="font-semibold text-gray-900 mb-2">Cognitive Behavioral Therapy (CBT) Reframing</h5>
            <p className="text-sm text-gray-700">
              Challenge negative automatic thoughts by examining evidence and creating more balanced perspectives.
              This evidence-based technique helps reduce anxiety, stress, and negative emotions.
            </p>
          </div>
        </div>
      </div>

      {/* Common Cognitive Distortions */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-3">Common Thinking Traps</h4>
        <div className="space-y-2">
          {cognitiveDistortions.map((distortion, index) => (
            <div key={index} className="flex items-start space-x-2 text-sm">
              <span className="font-medium text-gray-900 min-w-[150px]">{distortion.name}:</span>
              <span className="text-gray-600">{distortion.description}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Worksheet Form */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-4">Reframing Worksheet</h4>
        
        <div className="space-y-6">
          {/* Situation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              1. Describe the Situation
            </label>
            <textarea
              value={worksheet.situation}
              onChange={(e) => setWorksheet({ ...worksheet, situation: e.target.value })}
              rows="3"
              placeholder="What happened? Where were you? Who was involved?"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Negative Thought */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              2. What's Your Negative Thought?
            </label>
            <textarea
              value={worksheet.negativeThought}
              onChange={(e) => setWorksheet({ ...worksheet, negativeThought: e.target.value })}
              rows="2"
              placeholder="e.g., 'I'm a complete failure' or 'Everyone thinks I'm incompetent'"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Emotions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              3. What Emotions Do You Feel?
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {emotionOptions.map(emotion => (
                <label key={emotion} className="flex items-center space-x-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={worksheet.emotions.includes(emotion)}
                    onChange={() => handleEmotionToggle(emotion)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{emotion}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Evidence For */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              4. Evidence Supporting the Negative Thought
            </label>
            <textarea
              value={worksheet.evidenceFor}
              onChange={(e) => setWorksheet({ ...worksheet, evidenceFor: e.target.value })}
              rows="3"
              placeholder="What facts support this thought? Be specific and objective."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Evidence Against */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              5. Evidence Against the Negative Thought
            </label>
            <textarea
              value={worksheet.evidenceAgainst}
              onChange={(e) => setWorksheet({ ...worksheet, evidenceAgainst: e.target.value })}
              rows="3"
              placeholder="What facts contradict this thought? Consider past successes, alternative explanations."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Balanced Thought */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              6. Create a Balanced, Realistic Thought
            </label>
            <textarea
              value={worksheet.balancedThought}
              onChange={(e) => setWorksheet({ ...worksheet, balancedThought: e.target.value })}
              rows="3"
              placeholder="Based on the evidence, what's a more balanced way to view this situation?"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={isLoading}
            className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : 'Save Worksheet'}
          </button>
        </div>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">Your Reframing History</h4>
          {history.slice(0, 5).map((entry, index) => (
            <div key={index} className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <span className="text-sm font-medium text-gray-600">
                  {new Date(entry.createdAt).toLocaleDateString()}
                </span>
                <FaCheckCircle className="text-green-600" />
              </div>
              
              <div className="space-y-3">
                <div>
                  <span className="text-xs font-medium text-gray-500 uppercase">Situation</span>
                  <p className="text-sm text-gray-900 mt-1">{entry.data.situation}</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                    <span className="text-xs font-medium text-red-900 uppercase">Negative Thought</span>
                    <p className="text-sm text-red-800 mt-1">{entry.data.negativeThought}</p>
                  </div>
                  
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <span className="text-xs font-medium text-green-900 uppercase">Balanced Thought</span>
                    <p className="text-sm text-green-800 mt-1">{entry.data.balancedThought}</p>
                  </div>
                </div>

                {entry.data.emotions && entry.data.emotions.length > 0 && (
                  <div>
                    <span className="text-xs font-medium text-gray-500 uppercase">Emotions</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {entry.data.emotions.map((emotion, i) => (
                        <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {emotion}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CBTReframingWorksheet;
