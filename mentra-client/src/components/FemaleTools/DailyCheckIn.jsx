import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSmile, FaFrown, FaMeh, FaGrin, FaSadCry, FaCalendarCheck } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { showSuccessToast, showErrorToast } from '../../utils/toast';

const DailyCheckIn = () => {
  const { currentUser } = useAuth();
  const [checkIns, setCheckIns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(true);
  
  const [formData, setFormData] = useState({
    mood: 5,
    stress: 5,
    note: '',
    date: new Date().toISOString().split('T')[0]
  });

  const moodIcons = [
    { value: 1, icon: FaSadCry, label: 'Very Bad', color: 'red' },
    { value: 2, icon: FaFrown, label: 'Bad', color: 'orange' },
    { value: 3, icon: FaMeh, label: 'Okay', color: 'yellow' },
    { value: 4, icon: FaSmile, label: 'Good', color: 'lightgreen' },
    { value: 5, icon: FaGrin, label: 'Excellent', color: 'green' },
  ];

  const suggestions = {
    lowMood: [
      "Try taking a short walk outside",
      "Listen to your favorite music",
      "Reach out to a friend or loved one",
      "Practice self-compassion - it's okay to have difficult days"
    ],
    highStress: [
      "Try a 5-minute breathing exercise",
      "Take a break from screens",
      "Make a to-do list to organize your thoughts",
      "Consider talking to a counselor if stress persists"
    ],
    goodDay: [
      "Great! Keep up the positive momentum",
      "Take a moment to appreciate what went well",
      "Consider journaling about your positive experience"
    ]
  };

  useEffect(() => {
    fetchCheckIns();
    checkTodayEntry();
  }, []);

  const fetchCheckIns = async () => {
    try {
      const token = await currentUser.getIdToken();
      const response = await fetch('http://localhost:5000/api/tools/daily-checkin', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const checkIns = await response.json();
        setCheckIns(checkIns || []);
      }
    } catch (error) {
      console.error('Error fetching check-ins:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkTodayEntry = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayEntry = checkIns.find(entry => entry.data.date === today);
    if (todayEntry) {
      setShowForm(false);
      setFormData({
        mood: todayEntry.data.mood,
        stress: todayEntry.data.stress,
        note: todayEntry.data.note,
        date: todayEntry.data.date
      });
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
          toolType: 'daily-checkin',
          data: {
            ...formData,
            createdAt: new Date().toISOString()
          }
        }),
      });

      if (response.ok) {
        showSuccessToast('Daily check-in saved!');
        setShowForm(false);
        fetchCheckIns();
      } else {
        showErrorToast('Failed to save check-in');
      }
    } catch (error) {
      console.error('Error saving check-in:', error);
      showErrorToast('Failed to save check-in');
    }
  };

  const getMoodIcon = (value) => {
    const mood = moodIcons.find(m => m.value === value);
    return mood || moodIcons[2];
  };

  const getAutoSuggestions = () => {
    const results = [];
    if (formData.mood <= 2) {
      results.push(...suggestions.lowMood);
    }
    if (formData.stress >= 8) {
      results.push(...suggestions.highStress);
    }
    if (formData.mood >= 4 && formData.stress <= 4) {
      results.push(...suggestions.goodDay);
    }
    return results;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  const autoSuggestions = getAutoSuggestions();
  const MoodIcon = getMoodIcon(formData.mood).icon;

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl p-8 text-white mb-8 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <FaCalendarCheck className="text-4xl" />
              <h1 className="text-3xl font-bold">Daily Check-In</h1>
            </div>
            <p className="text-teal-100 text-lg">
              Track your mood and stress levels each day
            </p>
          </div>
        </div>
      </div>

      {showForm ? (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-8 mb-6"
        >
          <h3 className="text-2xl font-bold mb-6 text-gray-800 text-center">
            How are you feeling today?
          </h3>

          {/* Mood Slider */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-gray-700 mb-4 text-center">
              Your Mood
            </label>
            <div className="flex justify-center mb-4">
              <MoodIcon className={`text-8xl text-${getMoodIcon(formData.mood).color}-500`} />
            </div>
            <input
              type="range"
              min="1"
              max="5"
              value={formData.mood}
              onChange={(e) => setFormData({...formData, mood: parseInt(e.target.value)})}
              className="w-full h-3 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #ef4444 0%, #f59e0b 25%, #eab308 50%, #84cc16 75%, #22c55e 100%)`
              }}
            />
            <div className="flex justify-between mt-2">
              {moodIcons.map(mood => (
                <button
                  key={mood.value}
                  onClick={() => setFormData({...formData, mood: mood.value})}
                  className={`flex flex-col items-center p-2 rounded-lg transition-all ${
                    formData.mood === mood.value ? 'bg-teal-100 scale-110' : 'hover:bg-gray-100'
                  }`}
                >
                  <mood.icon className={`text-2xl text-${mood.color}-500`} />
                  <span className="text-xs mt-1 text-gray-600">{mood.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Stress Slider */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-gray-700 mb-4 text-center">
              Stress Level: <span className="text-teal-600">{formData.stress}/10</span>
            </label>
            <input
              type="range"
              min="0"
              max="10"
              value={formData.stress}
              onChange={(e) => setFormData({...formData, stress: parseInt(e.target.value)})}
              className="w-full h-3"
            />
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>😌 No Stress</span>
              <span>😰 Extreme Stress</span>
            </div>
          </div>

          {/* Note */}
          <div className="mb-6">
            <label className="block text-lg font-semibold text-gray-700 mb-2">
              Short Note (Optional)
            </label>
            <textarea
              value={formData.note}
              onChange={(e) => setFormData({...formData, note: e.target.value})}
              placeholder="How was your day? What's on your mind?"
              rows="4"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          {/* Auto Suggestions */}
          {autoSuggestions.length > 0 && (
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border-2 border-teal-200 rounded-lg p-6 mb-6">
              <h4 className="font-bold text-teal-800 mb-3 flex items-center gap-2">
                💡 Personalized Suggestions
              </h4>
              <ul className="space-y-2">
                {autoSuggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-2 text-teal-900">
                    <span className="text-teal-600 font-bold">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-4 rounded-lg font-semibold hover:from-teal-700 hover:to-cyan-700 transition-all shadow-lg text-lg"
          >
            Save Today's Check-In
          </button>
        </motion.div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Check-In Complete!</h3>
          <p className="text-gray-600 mb-4">You've already checked in today. Come back tomorrow!</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-all"
          >
            Update Today's Check-In
          </button>
        </div>
      )}

      {/* History */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Recent Check-Ins</h3>
        <div className="space-y-3">
          {checkIns.slice(0, 7).map((entry) => {
            const entryMood = getMoodIcon(entry.data.mood);
            const EntryIcon = entryMood.icon;
            return (
              <div key={entry._id} className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg">
                <div className="text-center">
                  <EntryIcon className={`text-3xl text-${entryMood.color}-500`} />
                  <p className="text-xs text-gray-600 mt-1">{entryMood.label}</p>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-gray-800">
                      {new Date(entry.data.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                    </p>
                    <span className="text-sm text-gray-600">
                      Stress: <span className={`font-bold ${entry.data.stress >= 7 ? 'text-red-600' : 'text-green-600'}`}>
                        {entry.data.stress}/10
                      </span>
                    </span>
                  </div>
                  {entry.data.note && (
                    <p className="text-sm text-gray-600 italic">"{entry.data.note}"</p>
                  )}
                </div>
              </div>
            );
          })}
          {checkIns.length === 0 && (
            <p className="text-center text-gray-500 py-8">No check-ins yet. Start today!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyCheckIn;
