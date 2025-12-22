import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { showSuccessToast, showErrorToast } from '../../utils/toast';

const BurnoutCheckIn = () => {
  const { currentUser } = useAuth();
  const [checkIn, setCheckIn] = useState({
    stressLevel: 5,
    energyLevel: 5,
    workloadLevel: 5,
    symptoms: [],
    notes: '',
  });
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const symptoms = [
    'Exhaustion', 'Cynicism', 'Reduced productivity', 'Irritability',
    'Difficulty concentrating', 'Sleep problems', 'Physical symptoms'
  ];

  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchHistory = async () => {
    try {
      const token = await currentUser.getIdToken();
      const response = await fetch('http://localhost:5000/api/tools/burnout-checkin', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (!response.ok) {
        console.error('Failed to fetch history:', response.status);
        return;
      }
      
      const checkins = await response.json();
      setHistory(checkins || []);
    } catch (error) {
      console.error('Error:', error);
      showErrorToast('Failed to load check-in history');
    }
  };

  const handleSymptomToggle = (symptom) => {
    setCheckIn({
      ...checkIn,
      symptoms: checkIn.symptoms.includes(symptom)
        ? checkIn.symptoms.filter(s => s !== symptom)
        : [...checkIn.symptoms, symptom]
    });
  };

  const handleSave = async () => {
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
          toolType: 'burnout-checkin',
          data: checkIn,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Save check-in failed:', response.status, errorData);
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }
      
      await response.json();
      showSuccessToast('Check-in saved successfully');
      fetchHistory();
      setCheckIn({
        stressLevel: 5,
        energyLevel: 5,
        workloadLevel: 5,
        symptoms: [],
        notes: '',
      });
    } catch (error) {
      showErrorToast(error.message || 'Failed to save check-in');
    } finally {
      setIsLoading(false);
    }
  };

  const getRecommendation = () => {
    const avgLevel = (checkIn.stressLevel + (10 - checkIn.energyLevel) + checkIn.workloadLevel) / 3;
    if (avgLevel > 7 || checkIn.symptoms.length > 3) {
      return {
        level: 'High Risk',
        color: 'red',
        message: 'Your burnout risk is high. Consider booking a counselor session immediately.',
        action: 'Schedule Counselor Session'
      };
    } else if (avgLevel > 5 || checkIn.symptoms.length > 1) {
      return {
        level: 'Moderate Risk',
        color: 'yellow',
        message: 'You\'re showing signs of stress. Try our coping modules and monitor your symptoms.',
        action: 'View Coping Modules'
      };
    } else {
      return {
        level: 'Low Risk',
        color: 'green',
        message: 'You\'re managing well. Keep up your self-care practices.',
        action: 'Continue Monitoring'
      };
    }
  };

  const recommendation = getRecommendation();

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-4">Current Check-in</h4>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stress Level: {checkIn.stressLevel}/10
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={checkIn.stressLevel}
              onChange={(e) => setCheckIn({ ...checkIn, stressLevel: parseInt(e.target.value) })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-600 mt-1">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Energy Level: {checkIn.energyLevel}/10
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={checkIn.energyLevel}
              onChange={(e) => setCheckIn({ ...checkIn, energyLevel: parseInt(e.target.value) })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-600 mt-1">
              <span>Exhausted</span>
              <span>Energized</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Workload Level: {checkIn.workloadLevel}/10
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={checkIn.workloadLevel}
              onChange={(e) => setCheckIn({ ...checkIn, workloadLevel: parseInt(e.target.value) })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-600 mt-1">
              <span>Manageable</span>
              <span>Overwhelming</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Symptoms
            </label>
            <div className="grid grid-cols-2 gap-2">
              {symptoms.map(symptom => (
                <label key={symptom} className="flex items-center space-x-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checkIn.symptoms.includes(symptom)}
                    onChange={() => handleSymptomToggle(symptom)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{symptom}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              value={checkIn.notes}
              onChange={(e) => setCheckIn({ ...checkIn, notes: e.target.value })}
              rows="3"
              placeholder="What's contributing to your stress today?"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className={`p-4 rounded-lg border-2 border-${recommendation.color}-300 bg-${recommendation.color}-50`}>
            <div className="flex items-start justify-between">
              <div>
                <div className={`font-semibold text-${recommendation.color}-900 mb-1`}>
                  {recommendation.level}
                </div>
                <p className={`text-sm text-${recommendation.color}-800`}>
                  {recommendation.message}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={isLoading}
            className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : 'Save Check-in'}
          </button>
        </div>
      </div>

      {history.length > 0 && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-4">Check-in History</h4>
          <div className="space-y-3">
            {history.slice(0, 5).map((entry, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium text-gray-900">
                    {new Date(entry.createdAt).toLocaleDateString()}
                  </span>
                  <span className="text-xs text-gray-600">
                    Stress: {entry.data.stressLevel}/10 | Energy: {entry.data.energyLevel}/10
                  </span>
                </div>
                {entry.data.symptoms && entry.data.symptoms.length > 0 && (
                  <div className="text-xs text-gray-600">
                    Symptoms: {entry.data.symptoms.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BurnoutCheckIn;
