import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { showSuccessToast, showErrorToast } from '../../utils/toast';
import { FaBrain, FaCheckCircle } from 'react-icons/fa';

const AngerCBTWorksheet = () => {
  const { currentUser } = useAuth();
  const [worksheet, setWorksheet] = useState({
    situation: '',
    angerThought: '',
    angerLevel: 5,
    evidenceFor: '',
    evidenceAgainst: '',
    cognitiveDistortions: [],
    alternativeThought: '',
    newAngerLevel: 5,
    actionPlan: '',
  });
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const distortions = [
    { id: 'mindreading', label: 'Mind Reading', description: 'Assuming you know what others think' },
    { id: 'catastrophizing', label: 'Catastrophizing', description: 'Expecting the worst outcome' },
    { id: 'shouldstatements', label: 'Should Statements', description: '"They should/shouldn\'t..."' },
    { id: 'labeling', label: 'Labeling', description: 'Calling yourself or others names' },
    { id: 'blackwhite', label: 'Black & White Thinking', description: 'All-or-nothing perspective' },
    { id: 'personalization', label: 'Personalization', description: 'Taking things personally' },
  ];

  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchHistory = async () => {
    try {
      const token = await currentUser.getIdToken();
      const response = await fetch('http://localhost:5000/api/tools/anger-cbt', {
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

  const handleDistortionToggle = (distortionId) => {
    setWorksheet({
      ...worksheet,
      cognitiveDistortions: worksheet.cognitiveDistortions.includes(distortionId)
        ? worksheet.cognitiveDistortions.filter(d => d !== distortionId)
        : [...worksheet.cognitiveDistortions, distortionId]
    });
  };

  const handleSave = async () => {
    if (!worksheet.situation.trim()) {
      showErrorToast('Please describe the situation');
      return;
    }

    if (!worksheet.angerThought.trim()) {
      showErrorToast('Please enter your anger-producing thought');
      return;
    }

    if (!worksheet.alternativeThought.trim()) {
      showErrorToast('Please create an alternative thought');
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
          toolType: 'anger-cbt',
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
        angerThought: '',
        angerLevel: 5,
        evidenceFor: '',
        evidenceAgainst: '',
        cognitiveDistortions: [],
        alternativeThought: '',
        newAngerLevel: 5,
        actionPlan: '',
      });
    } catch (error) {
      console.error('Error saving worksheet:', error);
      showErrorToast(error.message || 'Failed to save worksheet');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="bg-red-50 p-4 rounded-lg border border-red-200">
        <div className="flex items-start space-x-3">
          <FaBrain className="text-red-600 text-xl mt-1" />
          <div>
            <h5 className="font-semibold text-gray-900 mb-2">Anger CBT (Cognitive Behavioral Therapy)</h5>
            <p className="text-sm text-gray-700">
              Challenge anger-producing thoughts by examining evidence and creating more balanced perspectives.
              This reduces anger intensity and helps you respond more effectively.
            </p>
          </div>
        </div>
      </div>

      {/* Worksheet Form */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-4">Anger Thought Challenge Worksheet</h4>
        
        <div className="space-y-6">
          {/* Step 1: Situation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              1. Describe the Situation
            </label>
            <textarea
              value={worksheet.situation}
              onChange={(e) => setWorksheet({ ...worksheet, situation: e.target.value })}
              rows="3"
              placeholder="What happened? Be specific and factual."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          {/* Step 2: Anger Thought */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              2. What Thought Made You Angry?
            </label>
            <textarea
              value={worksheet.angerThought}
              onChange={(e) => setWorksheet({ ...worksheet, angerThought: e.target.value })}
              rows="2"
              placeholder="e.g., 'He deliberately disrespected me' or 'This always happens to me'"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <div className="mt-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Initial Anger Level:</label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={worksheet.angerLevel}
                  onChange={(e) => setWorksheet({ ...worksheet, angerLevel: parseInt(e.target.value) })}
                  className="flex-1"
                />
                <span className="text-2xl font-bold text-red-600 w-12">{worksheet.angerLevel}</span>
              </div>
            </div>
          </div>

          {/* Step 3: Cognitive Distortions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              3. Identify Thinking Errors
            </label>
            <div className="space-y-2">
              {distortions.map(distortion => (
                <label key={distortion.id} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={worksheet.cognitiveDistortions.includes(distortion.id)}
                    onChange={() => handleDistortionToggle(distortion.id)}
                    className="w-4 h-4 text-red-600 rounded mt-1 focus:ring-2 focus:ring-red-500"
                  />
                  <div>
                    <span className="font-medium text-gray-900">{distortion.label}</span>
                    <p className="text-sm text-gray-600">{distortion.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Step 4: Evidence For */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              4. Evidence Supporting Your Angry Thought
            </label>
            <textarea
              value={worksheet.evidenceFor}
              onChange={(e) => setWorksheet({ ...worksheet, evidenceFor: e.target.value })}
              rows="3"
              placeholder="What facts support this thought? Be objective."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          {/* Step 5: Evidence Against */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              5. Evidence Against Your Angry Thought
            </label>
            <textarea
              value={worksheet.evidenceAgainst}
              onChange={(e) => setWorksheet({ ...worksheet, evidenceAgainst: e.target.value })}
              rows="3"
              placeholder="What facts contradict this thought? Consider alternative explanations."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          {/* Step 6: Alternative Thought */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              6. Create a More Balanced Thought
            </label>
            <textarea
              value={worksheet.alternativeThought}
              onChange={(e) => setWorksheet({ ...worksheet, alternativeThought: e.target.value })}
              rows="3"
              placeholder="Based on the evidence, what's a more balanced, realistic way to view this?"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <div className="mt-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">New Anger Level:</label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={worksheet.newAngerLevel}
                  onChange={(e) => setWorksheet({ ...worksheet, newAngerLevel: parseInt(e.target.value) })}
                  className="flex-1"
                />
                <span className="text-2xl font-bold text-green-600 w-12">{worksheet.newAngerLevel}</span>
              </div>
            </div>
          </div>

          {/* Step 7: Action Plan */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              7. How Will You Handle This Differently?
            </label>
            <textarea
              value={worksheet.actionPlan}
              onChange={(e) => setWorksheet({ ...worksheet, actionPlan: e.target.value })}
              rows="2"
              placeholder="What specific actions will you take based on this new perspective?"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={isLoading}
            className="w-full px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : 'Save Worksheet'}
          </button>
        </div>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">Worksheet History</h4>
          {history.slice(0, 5).map((entry, index) => (
            <div key={index} className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <span className="text-sm font-medium text-gray-600">
                  {new Date(entry.createdAt).toLocaleDateString()}
                </span>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-xs text-gray-500">Before</div>
                    <div className="text-xl font-bold text-red-600">{entry.data.angerLevel}</div>
                  </div>
                  <div className="text-gray-400">→</div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500">After</div>
                    <div className="text-xl font-bold text-green-600">{entry.data.newAngerLevel}</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <span className="text-xs font-medium text-gray-500 uppercase">Situation</span>
                  <p className="text-sm text-gray-900 mt-1">{entry.data.situation}</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                    <span className="text-xs font-medium text-red-900 uppercase">Angry Thought</span>
                    <p className="text-sm text-red-800 mt-1">{entry.data.angerThought}</p>
                  </div>
                  
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <span className="text-xs font-medium text-green-900 uppercase">Balanced Thought</span>
                    <p className="text-sm text-green-800 mt-1">{entry.data.alternativeThought}</p>
                  </div>
                </div>

                {entry.data.cognitiveDistortions && entry.data.cognitiveDistortions.length > 0 && (
                  <div>
                    <span className="text-xs font-medium text-gray-500 uppercase">Thinking Errors</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {entry.data.cognitiveDistortions.map((distId, i) => {
                        const dist = distortions.find(d => d.id === distId);
                        return dist ? (
                          <span key={i} className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">
                            {dist.label}
                          </span>
                        ) : null;
                      })}
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

export default AngerCBTWorksheet;
