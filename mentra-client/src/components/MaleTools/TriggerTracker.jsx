import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { showSuccessToast, showErrorToast } from '../../utils/toast';
import { FaFire, FaTrash } from 'react-icons/fa';

const TriggerTracker = () => {
  const { currentUser } = useAuth();
  const [triggers, setTriggers] = useState([]);
  const [newTrigger, setNewTrigger] = useState({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    situation: '',
    trigger: '',
    angerLevel: 5,
    physicalSymptoms: [],
    thoughts: '',
    response: '',
    effectiveness: 5,
  });
  const [isLoading, setIsLoading] = useState(false);

  const physicalSymptomsOptions = [
    'Rapid heartbeat', 'Tense muscles', 'Clenched jaw', 'Sweating',
    'Shaking', 'Headache', 'Chest tightness', 'Hot face'
  ];

  useEffect(() => {
    fetchTriggers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTriggers = async () => {
    try {
      const token = await currentUser.getIdToken();
      const response = await fetch('http://localhost:5000/api/tools/trigger-tracker', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (!response.ok) {
        console.error('Failed to fetch triggers:', response.status);
        return;
      }
      
      const data = await response.json();
      setTriggers(data || []);
    } catch (error) {
      console.error('Error fetching triggers:', error);
      showErrorToast('Failed to load triggers');
    }
  };

  const handleSymptomToggle = (symptom) => {
    setNewTrigger({
      ...newTrigger,
      physicalSymptoms: newTrigger.physicalSymptoms.includes(symptom)
        ? newTrigger.physicalSymptoms.filter(s => s !== symptom)
        : [...newTrigger.physicalSymptoms, symptom]
    });
  };

  const handleSave = async () => {
    if (!newTrigger.situation.trim()) {
      showErrorToast('Please describe the situation');
      return;
    }

    if (!newTrigger.trigger.trim()) {
      showErrorToast('Please identify the trigger');
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
          toolType: 'trigger-tracker',
          data: newTrigger,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Save trigger failed:', response.status, errorData);
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }
      
      await response.json();
      showSuccessToast('Trigger logged successfully');
      fetchTriggers();
      setNewTrigger({
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().slice(0, 5),
        situation: '',
        trigger: '',
        angerLevel: 5,
        physicalSymptoms: [],
        thoughts: '',
        response: '',
        effectiveness: 5,
      });
    } catch (error) {
      console.error('Error saving trigger:', error);
      showErrorToast(error.message || 'Failed to save trigger');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (triggerId) => {
    try {
      const token = await currentUser.getIdToken();
      const response = await fetch(`http://localhost:5000/api/tools/${triggerId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to delete trigger');
      
      showSuccessToast('Trigger deleted');
      fetchTriggers();
    } catch (error) {
      showErrorToast('Failed to delete trigger');
    }
  };

  const getCommonTriggers = () => {
    const triggerCounts = {};
    triggers.forEach(t => {
      const trigger = t.data.trigger;
      triggerCounts[trigger] = (triggerCounts[trigger] || 0) + 1;
    });
    return Object.entries(triggerCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
  };

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="bg-red-50 p-4 rounded-lg border border-red-200">
        <p className="text-sm text-gray-700">
          <strong>Track your anger triggers</strong> to identify patterns and develop better coping strategies.
          Understanding what sets you off is the first step to managing anger.
        </p>
      </div>

      {/* New Trigger Entry */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-4">Log Anger Trigger</h4>
        
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                value={newTrigger.date}
                onChange={(e) => setNewTrigger({ ...newTrigger, date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time
              </label>
              <input
                type="time"
                value={newTrigger.time}
                onChange={(e) => setNewTrigger({ ...newTrigger, time: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What was the situation?
            </label>
            <textarea
              value={newTrigger.situation}
              onChange={(e) => setNewTrigger({ ...newTrigger, situation: e.target.value })}
              rows="2"
              placeholder="Describe what was happening when you felt angry..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What triggered your anger?
            </label>
            <input
              type="text"
              value={newTrigger.trigger}
              onChange={(e) => setNewTrigger({ ...newTrigger, trigger: e.target.value })}
              placeholder="e.g., Being interrupted, Feeling disrespected, Traffic"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Anger Intensity: {newTrigger.angerLevel}/10
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={newTrigger.angerLevel}
              onChange={(e) => setNewTrigger({ ...newTrigger, angerLevel: parseInt(e.target.value) })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-600 mt-1">
              <span>Mild</span>
              <span>Intense</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Physical Symptoms
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {physicalSymptomsOptions.map(symptom => (
                <label key={symptom} className="flex items-center space-x-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newTrigger.physicalSymptoms.includes(symptom)}
                    onChange={() => handleSymptomToggle(symptom)}
                    className="w-4 h-4 text-red-600 rounded focus:ring-2 focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700">{symptom}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What were you thinking?
            </label>
            <textarea
              value={newTrigger.thoughts}
              onChange={(e) => setNewTrigger({ ...newTrigger, thoughts: e.target.value })}
              rows="2"
              placeholder="What thoughts went through your mind?"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How did you respond?
            </label>
            <textarea
              value={newTrigger.response}
              onChange={(e) => setNewTrigger({ ...newTrigger, response: e.target.value })}
              rows="2"
              placeholder="What did you do or say?"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Response Effectiveness: {newTrigger.effectiveness}/10
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={newTrigger.effectiveness}
              onChange={(e) => setNewTrigger({ ...newTrigger, effectiveness: parseInt(e.target.value) })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-600 mt-1">
              <span>Made it worse</span>
              <span>Very effective</span>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={isLoading}
            className="w-full px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : 'Save Trigger'}
          </button>
        </div>
      </div>

      {/* Insights */}
      {triggers.length >= 3 && (
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <FaFire className="text-orange-600" />
            Your Most Common Triggers
          </h5>
          <div className="space-y-2">
            {getCommonTriggers().map(([trigger, count], index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm text-gray-700">{trigger}</span>
                <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">{count} times</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trigger History */}
      {triggers.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">Trigger History</h4>
          {triggers.slice(0, 10).map((trigger) => (
            <div key={trigger._id} className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-900">
                      {new Date(trigger.data.date).toLocaleDateString()}
                    </span>
                    <span className="text-sm text-gray-600">{trigger.data.time}</span>
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                      Intensity: {trigger.data.angerLevel}/10
                    </span>
                  </div>
                  <p className="text-sm font-medium text-red-700 mt-2">{trigger.data.trigger}</p>
                </div>
                <button
                  onClick={() => handleDelete(trigger._id)}
                  className="text-red-600 hover:text-red-700 p-2"
                >
                  <FaTrash />
                </button>
              </div>

              <div className="space-y-2">
                <div>
                  <span className="text-xs font-medium text-gray-500 uppercase">Situation</span>
                  <p className="text-sm text-gray-900 mt-1">{trigger.data.situation}</p>
                </div>

                {trigger.data.physicalSymptoms && trigger.data.physicalSymptoms.length > 0 && (
                  <div>
                    <span className="text-xs font-medium text-gray-500 uppercase">Physical Symptoms</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {trigger.data.physicalSymptoms.map((symptom, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {symptom}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {trigger.data.response && (
                  <div className="grid md:grid-cols-2 gap-4 mt-3">
                    <div>
                      <span className="text-xs font-medium text-gray-500 uppercase">Response</span>
                      <p className="text-sm text-gray-700 mt-1">{trigger.data.response}</p>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-gray-500 uppercase">Effectiveness</span>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${trigger.data.effectiveness > 6 ? 'bg-green-600' : trigger.data.effectiveness > 3 ? 'bg-yellow-600' : 'bg-red-600'}`}
                            style={{ width: `${trigger.data.effectiveness * 10}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{trigger.data.effectiveness}/10</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {triggers.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>No triggers logged yet. Start tracking above!</p>
        </div>
      )}
    </div>
  );
};

export default TriggerTracker;
