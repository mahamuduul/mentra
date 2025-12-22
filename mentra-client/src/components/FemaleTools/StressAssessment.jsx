import { useState } from 'react';
import { FaBrain, FaCheckCircle, FaLightbulb } from 'react-icons/fa';

const StressAssessment = () => {
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [stressLevel, setStressLevel] = useState('');

  const questions = [
    { id: 1, question: "In the past month, how often have you felt unable to control important things in your life?", category: 'control' },
    { id: 2, question: "How often have you felt confident about your ability to handle personal problems?", category: 'confidence', reverse: true },
    { id: 3, question: "How often have you felt that things were going your way?", category: 'positive', reverse: true },
    { id: 4, question: "How often have you felt difficulties were piling up so high you could not overcome them?", category: 'overwhelm' },
    { id: 5, question: "How often have you been upset because of something that happened unexpectedly?", category: 'unexpected' },
    { id: 6, question: "How often have you felt nervous or stressed?", category: 'nervous' },
    { id: 7, question: "How often have you been able to control irritations in your life?", category: 'irritation', reverse: true },
    { id: 8, question: "How often have you found that you could not cope with all the things you had to do?", category: 'coping' },
    { id: 9, question: "How often have you been angered because of things outside your control?", category: 'anger' },
    { id: 10, question: "How often have you felt you were on top of things?", category: 'ontop', reverse: true }
  ];

  const answerOptions = [
    { value: 0, label: 'Never' },
    { value: 1, label: 'Almost Never' },
    { value: 2, label: 'Sometimes' },
    { value: 3, label: 'Fairly Often' },
    { value: 4, label: 'Very Often' }
  ];

  const handleAnswer = (questionId, value, reverse) => {
    const score = reverse ? (4 - value) : value;
    setAnswers(prev => ({ ...prev, [questionId]: score }));
  };

  const calculateStress = () => {
    const totalScore = Object.values(answers).reduce((sum, val) => sum + val, 0);
    
    let level = '';
    if (totalScore <= 13) {
      level = 'low';
    } else if (totalScore <= 26) {
      level = 'moderate';
    } else {
      level = 'high';
    }

    setStressLevel(level);
    setShowResults(true);
  };

  const canSubmit = Object.keys(answers).length === questions.length;

  const reset = () => {
    setAnswers({});
    setShowResults(false);
    setStressLevel('');
  };

  const getStressInfo = () => {
    switch (stressLevel) {
      case 'low':
        return {
          title: '✅ Low Stress Level',
          color: 'green',
          description: 'Your stress levels are currently low. You seem to be managing well and have good coping mechanisms.',
          suggestions: [
            'Continue your current stress management practices',
            'Maintain healthy habits like exercise and good sleep',
            'Stay connected with supportive friends and family',
            'Practice gratitude and mindfulness regularly',
            'Keep a balanced work-life routine'
          ]
        };
      case 'moderate':
        return {
          title: '⚠️ Moderate Stress Level',
          color: 'yellow',
          description: 'You\'re experiencing moderate stress. It\'s important to take steps to manage it before it increases.',
          suggestions: [
            'Try our breathing and meditation exercises daily',
            'Identify and address specific stressors in your life',
            'Practice time management and prioritization',
            'Make time for activities you enjoy',
            'Consider talking to someone about what\'s stressing you',
            'Ensure you\'re getting adequate sleep and nutrition',
            'Set boundaries to protect your time and energy'
          ]
        };
      case 'high':
        return {
          title: '🚨 High Stress Level',
          color: 'red',
          description: 'Your stress levels are high. It\'s important to seek support and implement stress reduction strategies.',
          suggestions: [
            'Consider speaking with a mental health professional',
            'Use our counselor chat for immediate support',
            'Practice daily stress-reduction techniques',
            'Break down overwhelming tasks into smaller steps',
            'Reach out to trusted friends or family',
            'Evaluate if you need to make changes in your life',
            'Don\'t try to handle everything alone',
            'Take regular breaks and prioritize self-care',
            'If stress is affecting your daily functioning, seek professional help'
          ]
        };
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white mb-8 shadow-xl">
        <div className="flex items-center gap-3 mb-3">
          <FaBrain className="text-4xl" />
          <h1 className="text-3xl font-bold">Stress Self-Assessment</h1>
        </div>
        <p className="text-indigo-100 text-lg">
          Evaluate your stress levels and get personalized suggestions
        </p>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg mb-8">
        <h3 className="font-bold text-blue-800 mb-2">About This Assessment</h3>
        <p className="text-sm text-blue-800">
          This assessment is based on the Perceived Stress Scale (PSS), a widely used psychological tool. 
          Answer honestly about how you've felt over the past month. Your responses are private and not stored.
        </p>
      </div>

      {!showResults ? (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-6 text-gray-800">
            How often have you experienced the following in the past month?
          </h3>

          <div className="space-y-8">
            {questions.map((q, index) => (
              <div key={q.id} className="border-b pb-6 last:border-b-0">
                <div className="flex items-start gap-3 mb-4">
                  <span className="bg-indigo-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    {index + 1}
                  </span>
                  <p className="text-gray-800 font-medium pt-1">{q.question}</p>
                </div>
                
                <div className="flex flex-wrap gap-2 ml-11">
                  {answerOptions.map(option => (
                    <button
                      key={option.value}
                      onClick={() => handleAnswer(q.id, option.value, q.reverse)}
                      className={`flex-1 min-w-[100px] py-3 px-2 rounded-lg font-semibold transition-all text-sm ${
                        (answers[q.id] === (q.reverse ? (4 - option.value) : option.value))
                          ? 'bg-indigo-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex gap-4">
            <button
              onClick={calculateStress}
              disabled={!canSubmit}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              {canSubmit ? 'See Results' : `Answer All Questions (${Object.keys(answers).length}/${questions.length})`}
            </button>
            <button
              onClick={reset}
              className="px-8 py-4 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-all"
            >
              Reset
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Results */}
          <div className={`bg-${getStressInfo().color}-50 border-4 border-${getStressInfo().color}-500 rounded-xl p-8 shadow-xl`}>
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">
                {stressLevel === 'low' && '✅'}
                {stressLevel === 'moderate' && '⚠️'}
                {stressLevel === 'high' && '🚨'}
              </div>
              <h2 className={`text-3xl font-bold text-${getStressInfo().color}-800 mb-2`}>
                {getStressInfo().title}
              </h2>
              <p className={`text-${getStressInfo().color}-700 text-lg`}>
                {getStressInfo().description}
              </p>
            </div>

            {/* Suggestions */}
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-bold text-gray-800 mb-4 text-lg flex items-center gap-2">
                <FaLightbulb className={`text-${getStressInfo().color}-600`} />
                Personalized Suggestions:
              </h3>
              <div className="space-y-3">
                {getStressInfo().suggestions.map((suggestion, index) => (
                  <div key={index} className={`flex items-start gap-3 bg-${getStressInfo().color}-50 p-4 rounded-lg`}>
                    <FaCheckCircle className={`text-${getStressInfo().color}-600 mt-1 flex-shrink-0`} />
                    <p className="text-gray-800">{suggestion}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid md:grid-cols-3 gap-4">
            <button
              onClick={reset}
              className="bg-gray-600 text-white py-4 rounded-lg font-semibold hover:bg-gray-700 transition-all shadow-lg"
            >
              Take Assessment Again
            </button>
            <button
              onClick={() => window.location.href = '/female-tools'}
              className="bg-purple-600 text-white py-4 rounded-lg font-semibold hover:bg-purple-700 transition-all shadow-lg"
            >
              Explore Stress Tools
            </button>
            <button
              onClick={() => window.location.href = '/female-tools'}
              className="bg-teal-600 text-white py-4 rounded-lg font-semibold hover:bg-teal-700 transition-all shadow-lg"
            >
              Talk to Counselor
            </button>
          </div>

          {/* Additional Resources */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-bold text-gray-800 mb-4">🛠️ Recommended Tools:</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Breathing Exercises</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Guided breathing techniques to calm your nervous system instantly.
                </p>
                <button className="text-blue-600 font-semibold hover:underline text-sm">
                  Try Now →
                </button>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Mood Tracker</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Track patterns between stress, mood, and daily activities.
                </p>
                <button className="text-purple-600 font-semibold hover:underline text-sm">
                  Start Tracking →
                </button>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">CBT Thought Record</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Challenge stressful thoughts and develop balanced perspectives.
                </p>
                <button className="text-green-600 font-semibold hover:underline text-sm">
                  Start Recording →
                </button>
              </div>
              <div className="bg-gradient-to-r from-pink-50 to-pink-100 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Exercise Library</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Quick relaxation exercises and stress-relief activities.
                </p>
                <button className="text-pink-600 font-semibold hover:underline text-sm">
                  Browse Exercises →
                </button>
              </div>
            </div>
          </div>

          {stressLevel === 'high' && (
            <div className="bg-red-50 border-2 border-red-300 rounded-xl p-6">
              <h4 className="font-bold text-red-800 text-lg mb-3">
                🆘 Need Immediate Support?
              </h4>
              <p className="text-red-700 mb-4">
                If you're feeling overwhelmed or in crisis, please reach out for professional support:
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => window.location.href = 'tel:988'}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-all font-semibold shadow-lg"
                >
                  📞 Call 988 (Crisis Lifeline)
                </button>
                <button
                  onClick={() => window.location.href = 'sms:741741?body=HOME'}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-all font-semibold shadow-lg"
                >
                  💬 Text HOME to 741741
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StressAssessment;
