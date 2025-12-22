import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaChartLine, FaSmile, FaFrown, FaMeh, FaGrin, FaSadCry, FaPlus } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { showSuccessToast, showErrorToast } from '../../utils/toast';

const MoodTracker = () => {
  const { currentUser } = useAuth();
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    mood: 3,
    triggers: '',
    sleepHours: 7,
    notes: '',
    date: new Date().toISOString().split('T')[0]
  });

  const moodOptions = [
    { value: 1, icon: FaSadCry, label: 'Very Low', color: 'red' },
    { value: 2, icon: FaFrown, label: 'Low', color: 'orange' },
    { value: 3, icon: FaMeh, label: 'Neutral', color: 'yellow' },
    { value: 4, icon: FaSmile, label: 'Good', color: 'lightgreen' },
    { value: 5, icon: FaGrin, label: 'Excellent', color: 'green' }
  ];

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const token = await currentUser.getIdToken();
      const response = await fetch('http://localhost:5000/api/tools/mood-tracker', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const entries = await response.json();
        setEntries(entries || []);
      }
    } catch (error) {
      console.error('Error fetching entries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const token = await currentUser.getIdToken();
      const response = await fetch('http://localhost:5000/api/tools', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          toolType: 'mood-tracker',
          data: formData
        }),
      });

      if (response.ok) {
        showSuccessToast('Mood entry saved');
        setShowForm(false);
        setFormData({
          mood: 3,
          triggers: '',
          sleepHours: 7,
          notes: '',
          date: new Date().toISOString().split('T')[0]
        });
        fetchEntries();
      } else {
        showErrorToast('Failed to save entry');
      }
    } catch (error) {
      console.error('Error saving entry:', error);
      showErrorToast('Failed to save entry');
    }
  };

  const getMoodIcon = (value) => {
    const mood = moodOptions.find(m => m.value === value);
    return mood || moodOptions[2];
  };

  const getWeeklyAverage = () => {
    if (entries.length === 0) return 0;
    const last7 = entries.slice(0, 7);
    const sum = last7.reduce((acc, entry) => acc + entry.data.mood, 0);
    return (sum / last7.length).toFixed(1);
  };

  const getAverageSleep = () => {
    if (entries.length === 0) return 0;
    const last7 = entries.slice(0, 7);
    const sum = last7.reduce((acc, entry) => acc + entry.data.sleepHours, 0);
    return (sum / last7.length).toFixed(1);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const weeklyAvg = getWeeklyAverage();
  const avgSleep = getAverageSleep();

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white mb-8 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <FaChartLine className="text-4xl" />
              <h1 className="text-3xl font-bold">Mood Tracker</h1>
            </div>
            <p className="text-purple-100 text-lg">
              Track your daily mood, triggers, and sleep patterns
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-all flex items-center gap-2 shadow-lg"
          >
            <FaPlus /> Log Mood
          </button>
        </div>
      </div>

      {/* Weekly Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-gray-600 mb-2">Weekly Average Mood</h3>
          <div className="flex items-center gap-4">
            <div className="text-4xl font-bold text-purple-600">{weeklyAvg}</div>
            {React.createElement(getMoodIcon(Math.round(weeklyAvg)).icon, { className: 'text-3xl' })}
          </div>
          <p className="text-sm text-gray-500 mt-2">Based on last 7 days</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-gray-600 mb-2">Average Sleep</h3>
          <div className="text-4xl font-bold text-blue-600">{avgSleep}h</div>
          <p className="text-sm text-gray-500 mt-2">Per night</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-gray-600 mb-2">Total Entries</h3>
          <div className="text-4xl font-bold text-pink-600">{entries.length}</div>
          <p className="text-sm text-gray-500 mt-2">Days tracked</p>
        </div>
      </div>

      {/* Entry Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <h3 className="text-xl font-bold mb-6 text-gray-800">Log Your Mood</h3>

          <div className="space-y-6">
            {/* Mood Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                How's your mood today?
              </label>
              <div className="flex justify-between gap-2">
                {moodOptions.map(mood => (
                  <button
                    key={mood.value}
                    onClick={() => setFormData({...formData, mood: mood.value})}
                    className={`flex-1 flex flex-col items-center p-4 rounded-lg transition-all ${
                      formData.mood === mood.value
                        ? `bg-${mood.color}-100 border-2 border-${mood.color}-500 scale-105`
                        : 'bg-gray-50 border-2 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <mood.icon className={`text-3xl text-${mood.color}-500`} />
                    <span className="text-xs mt-2 text-gray-700">{mood.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Triggers */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Any triggers or notable events?
              </label>
              <input
                type="text"
                value={formData.triggers}
                onChange={(e) => setFormData({...formData, triggers: e.target.value})}
                placeholder="e.g., stressful meeting, good news, argument..."
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Sleep Hours */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hours of sleep last night: <span className="text-purple-600 font-bold">{formData.sleepHours}h</span>
              </label>
              <input
                type="range"
                min="0"
                max="12"
                step="0.5"
                value={formData.sleepHours}
                onChange={(e) => setFormData({...formData, sleepHours: parseFloat(e.target.value)})}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0h</span>
                <span>6h</span>
                <span>12h</span>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional notes (optional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Anything else you want to note about today..."
                rows="3"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                className="flex-1 bg-purple-600 text-white py-4 rounded-lg font-semibold hover:bg-purple-700 transition-all shadow-lg"
              >
                Save Entry
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

      {/* Weekly Graph Visualization */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h3 className="text-xl font-bold mb-6 text-gray-800">Weekly Mood Graph</h3>
        <div className="flex items-end justify-between gap-2 h-64">
          {entries.slice(0, 7).reverse().map((entry, index) => {
            const mood = getMoodIcon(entry.data.mood);
            const height = (entry.data.mood / 5) * 100;
            return (
              <div key={entry._id} className="flex-1 flex flex-col items-center">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  className={`w-full bg-gradient-to-t from-${mood.color}-400 to-${mood.color}-600 rounded-t-lg min-h-[20px]`}
                />
                <div className="mt-2 text-center">
                  <mood.icon className="text-2xl mx-auto" />
                  <p className="text-xs text-gray-600 mt-1">
                    {new Date(entry.data.date).toLocaleDateString('en', { weekday: 'short' })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        {entries.length < 7 && (
          <p className="text-center text-gray-500 mt-4 text-sm">
            Track for {7 - entries.length} more days to see full weekly graph
          </p>
        )}
      </div>

      {/* Recent Entries */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Recent Entries</h3>
        <div className="space-y-3">
          {entries.slice(0, 10).map((entry) => {
            const mood = getMoodIcon(entry.data.mood);
            return (
              <div key={entry._id} className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg">
                <mood.icon className={`text-3xl text-${mood.color}-500`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-gray-800">
                      {new Date(entry.data.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                    </p>
                    <span className="text-sm text-gray-600">💤 {entry.data.sleepHours}h sleep</span>
                  </div>
                  {entry.data.triggers && (
                    <p className="text-sm text-gray-600">
                      <strong>Triggers:</strong> {entry.data.triggers}
                    </p>
                  )}
                  {entry.data.notes && (
                    <p className="text-sm text-gray-600 italic mt-1">"{entry.data.notes}"</p>
                  )}
                </div>
              </div>
            );
          })}
          {entries.length === 0 && (
            <p className="text-center text-gray-500 py-8">No mood entries yet. Start tracking today!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoodTracker;
