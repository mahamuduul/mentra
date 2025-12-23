import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaSmile, FaMeh, FaFrown, FaSadTear, FaGrin,
  FaCalendarAlt, FaChartLine, FaFire 
} from 'react-icons/fa';
import { MdEmojiEmotions } from 'react-icons/md';

const MoodTracker = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState('');
  const [moodHistory, setMoodHistory] = useState([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const moods = [
    { icon: FaGrin, label: 'Excellent', value: 5, color: 'text-green-500', bgColor: 'bg-green-100 dark:bg-green-900/30' },
    { icon: FaSmile, label: 'Good', value: 4, color: 'text-blue-500', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
    { icon: FaMeh, label: 'Okay', value: 3, color: 'text-yellow-500', bgColor: 'bg-yellow-100 dark:bg-yellow-900/30' },
    { icon: FaFrown, label: 'Not Great', value: 2, color: 'text-orange-500', bgColor: 'bg-orange-100 dark:bg-orange-900/30' },
    { icon: FaSadTear, label: 'Difficult', value: 1, color: 'text-red-500', bgColor: 'bg-red-100 dark:bg-red-900/30' },
  ];

  useEffect(() => {
    const saved = localStorage.getItem('moodHistory');
    if (saved) {
      setMoodHistory(JSON.parse(saved));
    }
    calculateStreak();
  }, []);

  const calculateStreak = () => {
    const saved = localStorage.getItem('moodHistory');
    if (!saved) return;
    
    const history = JSON.parse(saved);
    let streak = 0;
    const today = new Date().setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      const hasEntry = history.some(entry => entry.date === dateStr);
      
      if (hasEntry) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    setCurrentStreak(streak);
  };

  const saveMood = () => {
    if (!selectedMood) return;

    const today = new Date().toISOString().split('T')[0];
    const newEntry = {
      date: today,
      mood: selectedMood.value,
      label: selectedMood.label,
      note: note,
      timestamp: new Date().toISOString(),
    };

    const updated = moodHistory.filter(entry => entry.date !== today);
    updated.push(newEntry);
    updated.sort((a, b) => new Date(b.date) - new Date(a.date));

    setMoodHistory(updated);
    localStorage.setItem('moodHistory', JSON.stringify(updated));
    setSelectedMood(null);
    setNote('');
    calculateStreak();
  };

  const getMoodForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return moodHistory.find(entry => entry.date === dateStr);
  };

  const getAverageMood = () => {
    if (moodHistory.length === 0) return 0;
    const sum = moodHistory.reduce((acc, entry) => acc + entry.mood, 0);
    return (sum / moodHistory.length).toFixed(1);
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const todayEntry = getMoodForDate(new Date());

  return (
    <div className="min-h-screen py-12 bg-white relative">

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-block mb-4">
            <div className="flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-purple-800 text-white px-4 py-2 rounded-full text-sm font-medium">
              <MdEmojiEmotions className="text-2xl" />
              <span>Track Your Emotions</span>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Mood Tracker
          </h1>
          <p className="text-xl text-gray-600">
            Track your emotional journey and discover patterns
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border-2 border-purple-200 hover:border-purple-500 transition-all hover:shadow-xl">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center">
                <FaFire className="text-3xl text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Current Streak</p>
                <p className="text-3xl font-bold text-gray-900">{currentStreak} days</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border-2 border-purple-200 hover:border-purple-500 transition-all hover:shadow-xl">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center">
                <FaChartLine className="text-3xl text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Average Mood</p>
                <p className="text-3xl font-bold text-gray-900">{getAverageMood()} / 5</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border-2 border-purple-200 hover:border-purple-500 transition-all hover:shadow-xl">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center">
                <FaCalendarAlt className="text-3xl text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Entries</p>
                <p className="text-3xl font-bold text-gray-900">{moodHistory.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Mood Input */}
          <div className="bg-white rounded-2xl p-6 border-2 border-purple-200">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              How are you feeling today?
            </h2>

            {todayEntry ? (
              <div className="text-center py-8">
                <div className={`text-6xl mb-4 ${moods.find(m => m.value === todayEntry.mood)?.color}`}>
                  {moods.find(m => m.value === todayEntry.mood)?.icon && 
                    (() => {
                      const Icon = moods.find(m => m.value === todayEntry.mood).icon;
                      return <Icon className="mx-auto" />;
                    })()
                  }
                </div>
                <p className="text-xl font-semibold text-gray-900 mb-2">
                  You logged: {todayEntry.label}
                </p>
                {todayEntry.note && (
                  <p className="text-gray-600 italic">
                    {todayEntry.note}
                  </p>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-5 gap-3 mb-6">
                  {moods.map((mood) => {
                    const Icon = mood.icon;
                    return (
                      <motion.button
                        key={mood.value}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedMood(mood)}
                        className={`p-4 rounded-xl transition-all ${
                          selectedMood?.value === mood.value
                            ? 'bg-purple-100 ring-2 ring-purple-600'
                            : 'bg-gray-100 hover:bg-purple-50'
                        }`}
                      >
                        <Icon className={`text-3xl mx-auto ${selectedMood?.value === mood.value ? mood.color : 'text-gray-400'}`} />
                      </motion.button>
                    );
                  })}
                </div>

                {selectedMood && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <p className="text-center text-lg font-semibold text-gray-900">
                      Feeling {selectedMood.label}
                    </p>
                    
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Add a note about your day (optional)..."
                      className="w-full px-4 py-3 rounded-lg border-2 border-purple-200 bg-white text-gray-900 placeholder-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
                      rows={3}
                    />

                    <button 
                      onClick={saveMood}
                      className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white font-bold rounded-xl hover:from-purple-700 hover:to-purple-900 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      Save Mood
                    </button>
                  </motion.div>
                )}
              </>
            )}
          </div>

          {/* Calendar View */}
          <div className="bg-white rounded-2xl p-6 border-2 border-purple-200">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              Mood Calendar
            </h2>

            <div className="mb-4 flex justify-between items-center">
              <button
                onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() - 1)))}
                className="p-2 hover:bg-purple-100 rounded text-gray-900"
              >
                Previous
              </button>
              <span className="font-semibold text-gray-900">
                {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
              <button
                onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() + 1)))}
                className="p-2 hover:bg-purple-100 rounded text-gray-900"
              >
                Next
              </button>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
                  {day}
                </div>
              ))}

              {getDaysInMonth(selectedDate).map((date, index) => {
                if (!date) {
                  return <div key={`empty-${index}`} />;
                }

                const entry = getMoodForDate(date);
                const mood = entry ? moods.find(m => m.value === entry.mood) : null;
                const isToday = date.toDateString() === new Date().toDateString();

                return (
                  <motion.div
                    key={date.toISOString()}
                    whileHover={{ scale: 1.1 }}
                    className={`aspect-square flex items-center justify-center rounded-lg text-sm ${
                      isToday ? 'ring-2 ring-purple-600' : ''
                    } ${
                      mood ? 'bg-purple-100' : 'bg-gray-100'
                    }`}
                  >
                    {mood ? (
                      <div className="text-center">
                        {(() => {
                          const Icon = mood.icon;
                          return <Icon className={`text-xl ${mood.color}`} />;
                        })()}
                      </div>
                    ) : (
                      <span className="text-purple-600">{date.getDate()}</span>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent History */}
        {moodHistory.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl p-6 border-2 border-purple-200">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              Recent Entries
            </h2>
            <div className="space-y-4">
              {moodHistory.slice(0, 5).map((entry) => {
                const mood = moods.find(m => m.value === entry.mood);
                const Icon = mood?.icon;
                return (
                  <div key={entry.timestamp} className="flex items-start gap-4 p-4 rounded-lg bg-white border-2 border-purple-200">
                    {Icon && <Icon className={`text-3xl ${mood.color}`} />}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {entry.label}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(entry.date).toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </p>
                        </div>
                      </div>
                      {entry.note && (
                        <p className="text-gray-900 mt-2">
                          {entry.note}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodTracker;
