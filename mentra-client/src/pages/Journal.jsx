import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBook, FaPlus, FaTrash, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { MdLightbulb } from 'react-icons/md';

const Journal = () => {
  const [entries, setEntries] = useState([]);
  const [isWriting, setIsWriting] = useState(false);
  const [currentEntry, setCurrentEntry] = useState({ title: '', content: '' });
  const [editingId, setEditingId] = useState(null);

  const prompts = [
    "What are three things you're grateful for today?",
    "Describe a challenge you faced and how you handled it.",
    "What made you smile today?",
    "Write about a goal you want to achieve.",
    "How are you feeling right now and why?",
    "What's something you learned about yourself recently?",
    "Describe a moment of peace you experienced.",
    "What would you tell your younger self?",
    "What are you looking forward to?",
    "Write about someone who inspires you.",
  ];

  const [currentPrompt] = useState(prompts[Math.floor(Math.random() * prompts.length)]);

  useEffect(() => {
    const saved = localStorage.getItem('journalEntries');
    if (saved) {
      setEntries(JSON.parse(saved));
    }
  }, []);

  const saveEntry = () => {
    if (!currentEntry.title || !currentEntry.content) return;

    let updated;
    if (editingId) {
      updated = entries.map(entry =>
        entry.id === editingId
          ? { ...entry, ...currentEntry, updatedAt: new Date().toISOString() }
          : entry
      );
      setEditingId(null);
    } else {
      const newEntry = {
        ...currentEntry,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      updated = [newEntry, ...entries];
    }

    setEntries(updated);
    localStorage.setItem('journalEntries', JSON.stringify(updated));
    setCurrentEntry({ title: '', content: '' });
    setIsWriting(false);
  };

  const deleteEntry = (id) => {
    if (!window.confirm('Are you sure you want to delete this entry?')) return;
    
    const updated = entries.filter(entry => entry.id !== id);
    setEntries(updated);
    localStorage.setItem('journalEntries', JSON.stringify(updated));
  };

  const editEntry = (entry) => {
    setCurrentEntry({ title: entry.title, content: entry.content });
    setEditingId(entry.id);
    setIsWriting(true);
  };

  const cancelEdit = () => {
    setCurrentEntry({ title: '', content: '' });
    setEditingId(null);
    setIsWriting(false);
  };

  return (
    <div className="min-h-screen py-20 bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 relative">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full blur-3xl"></div>
        <div className="absolute top-96 right-20 w-96 h-96 bg-purple-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-purple-300 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-block mb-4">
            <div className="flex items-center justify-center space-x-2 bg-purple-700/50 text-purple-100 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
              <FaBook className="text-xl" />
              <span>Express Yourself</span>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Personal Journal
          </h1>
          <p className="text-xl text-purple-200">
            Express your thoughts, feelings, and experiences
          </p>
        </motion.div>

        {/* Writing Prompt */}
        {!isWriting && (
          <div className="mb-8 bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-6 border border-purple-400/30 shadow-2xl shadow-purple-500/50">
            <div className="flex items-start gap-4 text-white">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <MdLightbulb className="text-2xl" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Today's Writing Prompt</h3>
                <p className="text-lg text-purple-100">{currentPrompt}</p>
              </div>
            </div>
          </div>
        )}

        {/* New Entry Button */}
        {!isWriting && (
          <div className="mb-8 text-center">
            <button
              onClick={() => setIsWriting(true)}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-purple-700 text-white font-bold rounded-xl hover:from-purple-600 hover:to-purple-800 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2 mx-auto"
            >
              <FaPlus /> 
              <span>New Journal Entry</span>
            </button>
          </div>
        )}

        {/* Writing Area */}
        <AnimatePresence>
          {isWriting && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="mb-8 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-purple-400/30">
                <h2 className="text-2xl font-bold mb-6 text-white">
                  {editingId ? 'Edit Entry' : 'New Entry'}
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-purple-200">
                      Title
                    </label>
                    <input
                      type="text"
                      value={currentEntry.title}
                      onChange={(e) => setCurrentEntry({ ...currentEntry, title: e.target.value })}
                      placeholder="Give your entry a title..."
                      className="w-full px-4 py-3 rounded-lg border border-purple-400/30 bg-purple-700/30 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 backdrop-blur-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-purple-200">
                      Your Thoughts
                    </label>
                    <textarea
                      value={currentEntry.content}
                      onChange={(e) => setCurrentEntry({ ...currentEntry, content: e.target.value })}
                      placeholder="Start writing..."
                      className="w-full px-4 py-3 rounded-lg border border-purple-400/30 bg-purple-700/30 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none backdrop-blur-sm"
                      rows={12}
                    />
                    <p className="text-sm text-purple-200 mt-2">
                      {currentEntry.content.length} characters
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button 
                      onClick={saveEntry}
                      className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-purple-700 text-white font-bold rounded-xl hover:from-purple-600 hover:to-purple-800 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
                    >
                      <FaSave />
                      <span>Save Entry</span>
                    </button>
                    <button 
                      onClick={cancelEdit}
                      className="px-6 py-3 bg-purple-700/30 border-2 border-purple-400/50 text-white font-bold rounded-xl hover:bg-purple-700/40 transition-all duration-300 flex items-center space-x-2 backdrop-blur-sm"
                    >
                      <FaTimes />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Entries List */}
        {entries.length > 0 ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">
              Your Entries ({entries.length})
            </h2>

            {entries.map((entry) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                layout
              >
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-purple-400/30 hover:border-purple-300 transition-all hover:shadow-2xl hover:shadow-purple-500/50">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">
                        {entry.title}
                      </h3>
                      <p className="text-sm text-purple-200">
                        {new Date(entry.createdAt).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => editEntry(entry)}
                        className="p-2 hover:bg-purple-700/50 rounded-lg transition-colors backdrop-blur-sm"
                      >
                        <FaEdit className="text-purple-300" />
                      </button>
                      <button
                        onClick={() => deleteEntry(entry.id)}
                        className="p-2 hover:bg-red-700/50 rounded-lg transition-colors backdrop-blur-sm"
                      >
                        <FaTrash className="text-red-400" />
                      </button>
                    </div>
                  </div>

                  <p className="text-purple-100 whitespace-pre-wrap">
                    {entry.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          !isWriting && (
            <div className="text-center py-12 bg-white/10 backdrop-blur-md rounded-2xl border border-purple-400/30">
              <FaBook className="text-6xl text-purple-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">
                No Entries Yet
              </h3>
              <p className="text-purple-200 mb-6">
                Start your journaling journey today
              </p>
              <button 
                onClick={() => setIsWriting(true)}
                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-purple-700 text-white font-bold rounded-xl hover:from-purple-600 hover:to-purple-800 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2 mx-auto"
              >
                <FaPlus />
                <span>Write Your First Entry</span>
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Journal;
