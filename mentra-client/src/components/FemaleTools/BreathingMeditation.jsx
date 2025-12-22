import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaPlay, FaPause, FaRedo } from 'react-icons/fa';

const BreathingMeditation = () => {
  const [activeSession, setActiveSession] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState('inhale');
  const [count, setCount] = useState(4);
  const [completedCycles, setCompletedCycles] = useState(0);

  const techniques = [
    {
      id: '4-7-8',
      name: '4-7-8 Breathing',
      description: 'Calming technique for anxiety and sleep',
      inhale: 4,
      hold: 7,
      exhale: 8,
      icon: '😌',
      color: 'blue'
    },
    {
      id: 'box',
      name: 'Box Breathing',
      description: 'Equal breathing for balance and focus',
      inhale: 4,
      hold: 4,
      exhale: 4,
      holdAfter: 4,
      icon: '📦',
      color: 'purple'
    },
    {
      id: 'deep',
      name: 'Deep Belly Breathing',
      description: 'Simple relaxation technique',
      inhale: 5,
      hold: 0,
      exhale: 7,
      icon: '🧘‍♀️',
      color: 'green'
    },
    {
      id: 'calm',
      name: 'Calming Breath',
      description: 'Quick stress relief',
      inhale: 3,
      hold: 3,
      exhale: 6,
      icon: '🌸',
      color: 'pink'
    }
  ];

  const mindfulnessSteps = [
    'Find a comfortable seated position',
    'Close your eyes or soften your gaze',
    'Notice any tension in your body and let it go',
    'Bring your attention to your breath',
    'Breathe naturally without forcing',
    'Notice the sensation of air entering and leaving',
    'If your mind wanders, gently return focus to breath',
    'Continue for as long as feels comfortable'
  ];

  useEffect(() => {
    let timer;
    if (isActive && activeSession) {
      timer = setInterval(() => {
        setCount(prev => {
          if (prev > 1) return prev - 1;

          const tech = techniques.find(t => t.id === activeSession);
          
          if (phase === 'inhale') {
            setPhase(tech.hold > 0 ? 'hold' : 'exhale');
            return tech.hold > 0 ? tech.hold : tech.exhale;
          } else if (phase === 'hold' && !tech.holdAfter) {
            setPhase('exhale');
            return tech.exhale;
          } else if (phase === 'hold' && tech.holdAfter) {
            setPhase('exhale');
            return tech.exhale;
          } else if (phase === 'exhale' && tech.holdAfter) {
            setPhase('holdAfter');
            return tech.holdAfter;
          } else {
            setCompletedCycles(c => c + 1);
            setPhase('inhale');
            return tech.inhale;
          }
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isActive, phase, activeSession]);

  const startSession = (techId) => {
    const tech = techniques.find(t => t.id === techId);
    setActiveSession(techId);
    setIsActive(true);
    setPhase('inhale');
    setCount(tech.inhale);
    setCompletedCycles(0);
  };

  const stopSession = () => {
    setIsActive(false);
  };

  const resetSession = () => {
    const tech = techniques.find(t => t.id === activeSession);
    setIsActive(false);
    setPhase('inhale');
    setCount(tech?.inhale || 4);
    setCompletedCycles(0);
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale': return 'from-blue-400 to-blue-600';
      case 'hold': return 'from-yellow-400 to-yellow-600';
      case 'exhale': return 'from-green-400 to-green-600';
      case 'holdAfter': return 'from-purple-400 to-purple-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale': return '🌬️ Breathe In';
      case 'hold': return '⏸️ Hold';
      case 'exhale': return '💨 Breathe Out';
      case 'holdAfter': return '⏸️ Hold';
      default: return '';
    }
  };

  const getPhaseInstruction = () => {
    switch (phase) {
      case 'inhale': return 'Slowly breathe in through your nose';
      case 'hold': return 'Hold your breath gently';
      case 'exhale': return 'Slowly breathe out through your mouth';
      case 'holdAfter': return 'Hold with lungs empty';
      default: return '';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-8 shadow-xl">
        <div className="flex items-center gap-3 mb-3">
          <FaHeart className="text-4xl" />
          <h1 className="text-3xl font-bold">Guided Breathing & Meditation</h1>
        </div>
        <p className="text-blue-100 text-lg">
          Structured breathing techniques and mindfulness exercises for relaxation
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Breathing Techniques */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">🌬️ Breathing Techniques</h2>
          
          {!activeSession ? (
            <div className="space-y-4">
              {techniques.map(tech => (
                <motion.div
                  key={tech.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => startSession(tech.id)}
                  className={`bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all border-l-4 border-${tech.color}-500`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-3xl">{tech.icon}</span>
                        <h3 className="text-xl font-bold text-gray-800">{tech.name}</h3>
                      </div>
                      <p className="text-gray-600">{tech.description}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 text-sm">
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                      Inhale: {tech.inhale}s
                    </span>
                    {tech.hold > 0 && (
                      <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
                        Hold: {tech.hold}s
                      </span>
                    )}
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
                      Exhale: {tech.exhale}s
                    </span>
                    {tech.holdAfter && (
                      <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                        Hold: {tech.holdAfter}s
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-6">
                <h3 className="font-bold text-gray-800 text-lg mb-1">
                  {techniques.find(t => t.id === activeSession)?.name}
                </h3>
                <p className="text-sm text-gray-600">
                  Cycles completed: <span className="font-bold text-purple-600">{completedCycles}</span>
                </p>
              </div>

              {/* Breathing Animation */}
              <div className="flex flex-col items-center justify-center py-12">
                <motion.div
                  animate={{
                    scale: phase === 'inhale' ? 1.5 : phase.includes('hold') ? 1.5 : 1,
                  }}
                  transition={{ duration: 1 }}
                  className={`w-48 h-48 rounded-full bg-gradient-to-r ${getPhaseColor()} shadow-2xl flex items-center justify-center`}
                >
                  <div className="text-white text-center">
                    <div className="text-6xl font-bold mb-2">{count}</div>
                    <div className="text-xl font-semibold uppercase">{phase}</div>
                  </div>
                </motion.div>

                <div className="mt-8 text-center">
                  <p className="text-2xl font-bold text-gray-800 mb-2">{getPhaseText()}</p>
                  <p className="text-gray-600">{getPhaseInstruction()}</p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex gap-3">
                <button
                  onClick={isActive ? stopSession : () => setIsActive(true)}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  {isActive ? <><FaPause /> Pause</> : <><FaPlay /> Resume</>}
                </button>
                <button
                  onClick={resetSession}
                  className="bg-gray-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-gray-700 transition-all flex items-center gap-2"
                >
                  <FaRedo /> Reset
                </button>
                <button
                  onClick={() => {
                    setActiveSession(null);
                    setIsActive(false);
                    setCompletedCycles(0);
                  }}
                  className="bg-gray-400 text-white px-6 py-4 rounded-lg font-semibold hover:bg-gray-500 transition-all"
                >
                  Back
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mindfulness Meditation */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">🧘‍♀️ Mindfulness Meditation</h2>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Simple Mindfulness Practice</h3>
            <p className="text-gray-600 mb-6">
              Follow these steps for a calming meditation session. Take your time with each step.
            </p>
            
            <div className="space-y-3">
              {mindfulnessSteps.map((step, index) => (
                <div key={index} className="flex items-start gap-3 bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
                  <span className="bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    {index + 1}
                  </span>
                  <p className="text-gray-700 pt-1">{step}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <p className="text-sm text-blue-800">
                <strong>Tip:</strong> Start with just 5 minutes a day. Even short meditation sessions can 
                significantly reduce stress and improve mental clarity.
              </p>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">💡 Quick Tips</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <p>Practice at the same time each day to build a habit</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <p>Find a quiet, comfortable space</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <p>Be patient with yourself - meditation is a skill</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <p>Use breathing exercises before bed for better sleep</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <p>Try different techniques to find what works for you</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreathingMeditation;
