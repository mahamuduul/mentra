import { useState, useEffect, useRef } from 'react';
import { FaPlay, FaPause, FaRedo, FaCheckCircle } from 'react-icons/fa';

const CoolingOffTimer = () => {
  const [duration, setDuration] = useState(5);
  const [timeLeft, setTimeLeft] = useState(300);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [selectedTechnique, setSelectedTechnique] = useState('breathing');
  const intervalRef = useRef(null);

  const techniques = [
    {
      id: 'breathing',
      name: 'Deep Breathing',
      description: 'Breathe in for 4 counts, hold for 4, breathe out for 6. Repeat.',
      steps: [
        'Find a comfortable position',
        'Breathe in slowly through your nose for 4 counts',
        'Hold your breath for 4 counts',
        'Breathe out slowly through your mouth for 6 counts',
        'Repeat until you feel calmer'
      ]
    },
    {
      id: 'progressive',
      name: 'Progressive Muscle Relaxation',
      description: 'Tense and relax muscle groups to release physical tension.',
      steps: [
        'Sit or lie down comfortably',
        'Tense your fists for 5 seconds, then release',
        'Tense your arms, then release',
        'Move through shoulders, neck, face, chest',
        'Notice the difference between tension and relaxation'
      ]
    },
    {
      id: 'grounding',
      name: '5-4-3-2-1 Grounding',
      description: 'Use your senses to bring yourself to the present moment.',
      steps: [
        'Name 5 things you can see',
        'Name 4 things you can touch',
        'Name 3 things you can hear',
        'Name 2 things you can smell',
        'Name 1 thing you can taste'
      ]
    },
    {
      id: 'visualization',
      name: 'Calm Place Visualization',
      description: 'Imagine yourself in a peaceful, safe location.',
      steps: [
        'Close your eyes if comfortable',
        'Picture a place where you feel completely calm',
        'Notice the colors, sounds, and smells',
        'Feel the temperature and textures',
        'Stay in this peaceful place until the timer ends'
      ]
    }
  ];

  const currentTechnique = techniques.find(t => t.id === selectedTechnique);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsCompleted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const handleStart = () => {
    if (timeLeft === 0) {
      setTimeLeft(duration * 60);
      setIsCompleted(false);
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(duration * 60);
    setIsCompleted(false);
  };

  const handleDurationChange = (newDuration) => {
    setDuration(newDuration);
    setTimeLeft(newDuration * 60);
    setIsRunning(false);
    setIsCompleted(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    return ((duration * 60 - timeLeft) / (duration * 60)) * 100;
  };

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <p className="text-sm text-gray-700">
          <strong>Take a cooling-off break</strong> when you feel anger rising. Use this time to practice calming techniques
          and prevent escalation. Taking a break is a sign of strength, not weakness.
        </p>
      </div>

      {/* Timer Display */}
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-8 rounded-xl text-white text-center">
        {isCompleted ? (
          <div className="space-y-4">
            <FaCheckCircle className="text-6xl mx-auto text-green-300" />
            <h3 className="text-2xl font-bold">Great Job!</h3>
            <p className="text-blue-100">You took time to cool down. How are you feeling now?</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-8xl font-bold">{formatTime(timeLeft)}</div>
            <div className="w-full h-2 bg-white/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-1000"
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Duration Selection */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-4">Timer Duration</h4>
        <div className="grid grid-cols-4 gap-3">
          {[5, 10, 15, 20].map(mins => (
            <button
              key={mins}
              onClick={() => handleDurationChange(mins)}
              disabled={isRunning}
              className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                duration === mins
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {mins} min
            </button>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex justify-center gap-4">
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="flex items-center gap-2 px-8 py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
            >
              <FaPlay />
              {timeLeft === duration * 60 ? 'Start Timer' : 'Resume'}
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="flex items-center gap-2 px-8 py-4 bg-yellow-600 text-white font-semibold rounded-lg hover:bg-yellow-700 transition-colors"
            >
              <FaPause />
              Pause
            </button>
          )}
          
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-8 py-4 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
          >
            <FaRedo />
            Reset
          </button>
        </div>
      </div>

      {/* Calming Techniques */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-4">Calming Techniques</h4>
        
        {/* Technique Selector */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
          {techniques.map(technique => (
            <button
              key={technique.id}
              onClick={() => setSelectedTechnique(technique.id)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedTechnique === technique.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {technique.name}
            </button>
          ))}
        </div>

        {/* Selected Technique Details */}
        {currentTechnique && (
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h5 className="font-semibold text-gray-900 mb-2">{currentTechnique.name}</h5>
            <p className="text-sm text-gray-700 mb-4">{currentTechnique.description}</p>
            
            <div className="space-y-2">
              <h6 className="text-sm font-medium text-gray-900">Steps:</h6>
              <ol className="space-y-2">
                {currentTechnique.steps.map((step, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs">
                      {index + 1}
                    </span>
                    <span className="mt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <h5 className="font-semibold text-gray-900 mb-2">Tips for Cooling Down</h5>
        <ul className="space-y-1 text-sm text-gray-700">
          <li>• Remove yourself from the situation if possible</li>
          <li>• Focus on your breathing - it's your anchor</li>
          <li>• Avoid planning what to say next - just be present</li>
          <li>• It's okay to tell others "I need a few minutes"</li>
          <li>• Return to the situation only when you feel calmer</li>
        </ul>
      </div>
    </div>
  );
};

export default CoolingOffTimer;
