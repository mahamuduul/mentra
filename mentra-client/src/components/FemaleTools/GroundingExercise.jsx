import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaHandPaper, FaPlay, FaPause, FaRedo, FaExclamationCircle, FaHeart, FaBrain } from 'react-icons/fa';

const GroundingExercise = () => {
  const [activeExercise, setActiveExercise] = useState(null);
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState('inhale');
  const [breathCount, setBreathCount] = useState(4);
  const [groundingStep, setGroundingStep] = useState(0);

  const groundingSteps = [
    { count: 5, sense: 'SEE', prompt: 'Name 5 things you can SEE around you', icon: '👁️', color: 'blue' },
    { count: 4, sense: 'TOUCH', prompt: 'Name 4 things you can TOUCH', icon: '✋', color: 'green' },
    { count: 3, sense: 'HEAR', prompt: 'Name 3 things you can HEAR', icon: '👂', color: 'yellow' },
    { count: 2, sense: 'SMELL', prompt: 'Name 2 things you can SMELL', icon: '👃', color: 'purple' },
    { count: 1, sense: 'TASTE', prompt: 'Name 1 thing you can TASTE', icon: '👅', color: 'pink' }
  ];

  const breathingTechniques = [
    { name: '4-7-8 Breathing', inhale: 4, hold: 7, exhale: 8, description: 'Calming technique for anxiety' },
    { name: 'Box Breathing', inhale: 4, hold: 4, exhale: 4, description: 'Equal breathing for balance' },
    { name: 'Simple Deep Breathing', inhale: 4, hold: 0, exhale: 6, description: 'Basic relaxation' }
  ];

  useEffect(() => {
    let timer;
    if (breathingActive) {
      timer = setInterval(() => {
        setBreathCount(prev => {
          if (prev > 1) return prev - 1;
          
          // Move to next phase
          if (breathPhase === 'inhale') {
            setBreathPhase('hold');
            return breathingTechniques[activeExercise]?.hold || 4;
          } else if (breathPhase === 'hold') {
            setBreathPhase('exhale');
            return breathingTechniques[activeExercise]?.exhale || 4;
          } else {
            setBreathPhase('inhale');
            return breathingTechniques[activeExercise]?.inhale || 4;
          }
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [breathingActive, breathPhase, activeExercise]);

  const startBreathing = (index) => {
    setActiveExercise(index);
    setBreathingActive(true);
    setBreathPhase('inhale');
    setBreathCount(breathingTechniques[index].inhale);
  };

  const stopBreathing = () => {
    setBreathingActive(false);
  };

  const resetBreathing = () => {
    setBreathingActive(false);
    setBreathPhase('inhale');
    if (activeExercise !== null) {
      setBreathCount(breathingTechniques[activeExercise].inhale);
    }
  };

  const startGrounding = () => {
    setGroundingStep(0);
  };

  const nextGroundingStep = () => {
    if (groundingStep < groundingSteps.length - 1) {
      setGroundingStep(prev => prev + 1);
    } else {
      setGroundingStep(-1); // Completed
    }
  };

  const emergencyCalm = () => {
    window.location.href = 'tel:988';
  };

  const getBreathColor = () => {
    switch (breathPhase) {
      case 'inhale': return 'from-blue-400 to-blue-600';
      case 'hold': return 'from-yellow-400 to-yellow-600';
      case 'exhale': return 'from-green-400 to-green-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getStepColor = (color) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      yellow: 'from-yellow-500 to-yellow-600',
      purple: 'from-purple-500 to-purple-600',
      pink: 'from-pink-500 to-pink-600'
    };
    return colors[color] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white mb-8 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <FaHandPaper className="text-4xl" />
              <h1 className="text-3xl font-bold">Grounding & Breathing Exercises</h1>
            </div>
            <p className="text-indigo-100 text-lg">
              Calm your mind and body with proven grounding techniques
            </p>
          </div>
          <button
            onClick={emergencyCalm}
            className="bg-red-500 text-white px-6 py-4 rounded-lg font-bold hover:bg-red-600 transition-all shadow-lg animate-pulse flex items-center gap-2"
          >
            <FaExclamationCircle /> PANIC BUTTON
            <br />
            <span className="text-xs font-normal">Call Crisis Line</span>
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* 5-4-3-2-1 Grounding */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-2">
            <FaBrain className="text-indigo-600" />
            5-4-3-2-1 Grounding Technique
          </h3>
          
          <p className="text-gray-600 mb-6">
            This technique helps you stay present by focusing on your five senses. 
            Take your time with each step.
          </p>

          {groundingStep === -1 ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-8 text-white text-center"
            >
              <div className="text-6xl mb-4">✅</div>
              <h4 className="text-2xl font-bold mb-2">Great Job!</h4>
              <p className="mb-6">You've completed the grounding exercise. How do you feel?</p>
              <button
                onClick={() => setGroundingStep(-2)}
                className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-all"
              >
                Start Again
              </button>
            </motion.div>
          ) : groundingStep >= 0 ? (
            <motion.div
              key={groundingStep}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="space-y-4"
            >
              <div className={`bg-gradient-to-r ${getStepColor(groundingSteps[groundingStep].color)} rounded-xl p-6 text-white`}>
                <div className="text-5xl mb-3 text-center">{groundingSteps[groundingStep].icon}</div>
                <h4 className="text-3xl font-bold text-center mb-2">
                  {groundingSteps[groundingStep].count}
                </h4>
                <p className="text-xl text-center">
                  {groundingSteps[groundingStep].prompt}
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Take a moment to notice each one:</p>
                <div className="space-y-2">
                  {[...Array(groundingSteps[groundingStep].count)].map((_, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center text-xs font-bold">
                        {i + 1}
                      </div>
                      <div className="flex-1 border-b-2 border-dashed border-gray-300 py-2"></div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={nextGroundingStep}
                className="w-full bg-indigo-600 text-white py-4 rounded-lg font-semibold hover:bg-indigo-700 transition-all text-lg"
              >
                {groundingStep < groundingSteps.length - 1 ? 'Next Sense' : 'Complete'}
              </button>

              <div className="flex justify-center gap-2 mt-4">
                {groundingSteps.map((_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full ${
                      i === groundingStep ? 'bg-indigo-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          ) : (
            <div className="text-center">
              <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl p-8 mb-4">
                <div className="text-6xl mb-4">🧘‍♀️</div>
                <p className="text-gray-700 mb-6">
                  The 5-4-3-2-1 technique is a simple yet powerful grounding exercise 
                  that helps bring you back to the present moment when you're feeling 
                  anxious, overwhelmed, or disconnected.
                </p>
              </div>
              <button
                onClick={startGrounding}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg text-lg"
              >
                Start Grounding Exercise
              </button>
            </div>
          )}
        </div>

        {/* Breathing Timer */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-2">
            <FaHeart className="text-pink-600" />
            Guided Breathing Timer
          </h3>

          {activeExercise === null ? (
            <div className="space-y-4">
              <p className="text-gray-600 mb-4">
                Choose a breathing technique to help you relax and reduce stress.
              </p>
              {breathingTechniques.map((technique, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-r from-pink-50 to-purple-50 border-2 border-pink-200 rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all"
                  onClick={() => startBreathing(index)}
                >
                  <h4 className="text-xl font-bold text-gray-800 mb-2">{technique.name}</h4>
                  <p className="text-gray-600 mb-3">{technique.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-700">
                    <span className="bg-blue-100 px-3 py-1 rounded-full">
                      Inhale: {technique.inhale}s
                    </span>
                    {technique.hold > 0 && (
                      <span className="bg-yellow-100 px-3 py-1 rounded-full">
                        Hold: {technique.hold}s
                      </span>
                    )}
                    <span className="bg-green-100 px-3 py-1 rounded-full">
                      Exhale: {technique.exhale}s
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-4">
                <h4 className="font-bold text-gray-800 text-lg">
                  {breathingTechniques[activeExercise].name}
                </h4>
                <p className="text-sm text-gray-600">
                  {breathingTechniques[activeExercise].description}
                </p>
              </div>

              {/* Breathing Animation */}
              <div className="relative flex flex-col items-center justify-center py-12">
                <motion.div
                  animate={{
                    scale: breathPhase === 'inhale' ? 1.5 : breathPhase === 'hold' ? 1.5 : 1,
                  }}
                  transition={{ duration: 1 }}
                  className={`w-48 h-48 rounded-full bg-gradient-to-r ${getBreathColor()} shadow-2xl flex items-center justify-center`}
                >
                  <div className="text-white text-center">
                    <div className="text-6xl font-bold mb-2">{breathCount}</div>
                    <div className="text-xl font-semibold uppercase tracking-wider">
                      {breathPhase}
                    </div>
                  </div>
                </motion.div>

                <div className="mt-8 text-center">
                  <p className="text-2xl font-bold text-gray-800 mb-2">
                    {breathPhase === 'inhale' && '🌬️ Breathe In'}
                    {breathPhase === 'hold' && '⏸️ Hold Your Breath'}
                    {breathPhase === 'exhale' && '💨 Breathe Out'}
                  </p>
                  <p className="text-gray-600">
                    {breathPhase === 'inhale' && 'Slowly breathe in through your nose'}
                    {breathPhase === 'hold' && 'Hold your breath gently'}
                    {breathPhase === 'exhale' && 'Slowly breathe out through your mouth'}
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex gap-3">
                <button
                  onClick={breathingActive ? stopBreathing : () => setBreathingActive(true)}
                  className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 text-white py-4 rounded-lg font-semibold hover:from-pink-700 hover:to-purple-700 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  {breathingActive ? (
                    <>
                      <FaPause /> Pause
                    </>
                  ) : (
                    <>
                      <FaPlay /> Resume
                    </>
                  )}
                </button>
                <button
                  onClick={resetBreathing}
                  className="bg-gray-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-gray-700 transition-all shadow-lg flex items-center gap-2"
                >
                  <FaRedo /> Reset
                </button>
                <button
                  onClick={() => {
                    setActiveExercise(null);
                    setBreathingActive(false);
                  }}
                  className="bg-gray-400 text-white px-6 py-4 rounded-lg font-semibold hover:bg-gray-500 transition-all"
                >
                  Change
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Emergency Support */}
      <div className="mt-8 bg-red-50 border-2 border-red-300 rounded-xl p-6">
        <h4 className="font-bold text-red-800 mb-3 flex items-center gap-2 text-lg">
          <FaExclamationCircle />
          Need Immediate Help?
        </h4>
        <p className="text-red-700 mb-4">
          If you're experiencing a crisis or panic attack, these exercises can help. 
          But if you need immediate support, don't hesitate to reach out:
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => window.location.href = 'tel:988'}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-all font-semibold shadow-lg"
          >
            📞 Call 988 (Crisis Lifeline)
          </button>
          <button
            onClick={() => window.location.href = 'sms:741741'}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-all font-semibold shadow-lg"
          >
            💬 Text HOME to 741741 (Crisis Text Line)
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroundingExercise;
