import { useState } from 'react';
import { FaClipboardCheck, FaExclamationTriangle, FaPhoneAlt, FaShieldAlt } from 'react-icons/fa';

const RiskAssessment = () => {
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [riskLevel, setRiskLevel] = useState('');

  const questions = [
    {
      id: 1,
      question: "Do you feel physically safe in your current environment?",
      weight: 3
    },
    {
      id: 2,
      question: "Has someone threatened to hurt you or someone you care about?",
      weight: 5
    },
    {
      id: 3,
      question: "Do you have access to a safe place to go if needed?",
      weight: 2,
      reverse: true
    },
    {
      id: 4,
      question: "Have you experienced physical violence recently?",
      weight: 5
    },
    {
      id: 5,
      question: "Are you being monitored, followed, or stalked?",
      weight: 4
    },
    {
      id: 6,
      question: "Do you feel trapped or unable to leave your situation?",
      weight: 4
    },
    {
      id: 7,
      question: "Has the violence or threats increased in frequency or severity?",
      weight: 4
    },
    {
      id: 8,
      question: "Do you have people you can trust and reach out to?",
      weight: 2,
      reverse: true
    },
    {
      id: 9,
      question: "Are you afraid for your safety or life?",
      weight: 5
    },
    {
      id: 10,
      question: "Has someone prevented you from leaving, calling for help, or seeing friends/family?",
      weight: 4
    }
  ];

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const calculateRisk = () => {
    let totalScore = 0;
    questions.forEach(q => {
      const answer = answers[q.id];
      if (answer === 'yes') {
        totalScore += q.reverse ? 0 : q.weight;
      } else if (answer === 'no' && q.reverse) {
        totalScore += q.weight;
      }
    });

    const maxScore = questions.reduce((sum, q) => sum + q.weight, 0);
    const percentage = (totalScore / maxScore) * 100;

    let level = '';
    if (percentage >= 60) {
      level = 'high';
    } else if (percentage >= 30) {
      level = 'moderate';
    } else {
      level = 'low';
    }

    setRiskLevel(level);
    setShowResults(true);
  };

  const canSubmit = Object.keys(answers).length === questions.length;

  const resetAssessment = () => {
    setAnswers({});
    setShowResults(false);
    setRiskLevel('');
  };

  const getRiskColor = () => {
    switch (riskLevel) {
      case 'high': return 'red';
      case 'moderate': return 'yellow';
      case 'low': return 'green';
      default: return 'gray';
    }
  };

  const getRiskGuidance = () => {
    switch (riskLevel) {
      case 'high':
        return {
          title: '🚨 High Risk - Immediate Action Recommended',
          description: 'Based on your responses, you may be in a high-risk situation. Your safety is the top priority.',
          actions: [
            'Call 911 if you are in immediate danger',
            'Contact the National Domestic Violence Hotline: 1-800-799-7233',
            'Create a safety plan immediately (use our Safety Plan Builder)',
            'Tell someone you trust about your situation',
            'Consider contacting local domestic violence services',
            'Keep your phone charged and accessible',
            'Have an escape route planned',
            'Pack an emergency bag if possible'
          ],
          urgency: 'critical'
        };
      case 'moderate':
        return {
          title: '⚠️ Moderate Risk - Take Precautions',
          description: 'Your situation shows some concerning factors. Taking preventive steps now can help keep you safer.',
          actions: [
            'Create a safety plan (use our Safety Plan Builder)',
            'Identify safe places you can go',
            'Set up trusted contacts who can help',
            'Document any incidents (dates, times, details)',
            'Learn about your legal options and rights',
            'Consider talking to a counselor or advocate',
            'Keep important documents in a safe place',
            'Trust your instincts - if something feels wrong, reach out for help'
          ],
          urgency: 'important'
        };
      case 'low':
        return {
          title: '✅ Low Risk - Stay Aware',
          description: 'Your responses suggest a lower risk level, but it\'s always good to be prepared and stay aware.',
          actions: [
            'Continue monitoring your situation',
            'Know the warning signs of escalating danger',
            'Keep emergency numbers saved in your phone',
            'Maintain connections with friends and family',
            'Trust your instincts - seek help if things change',
            'Learn about safety planning just in case',
            'Support others who may need help',
            'Stay informed about available resources'
          ],
          urgency: 'informational'
        };
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-8 text-white mb-8 shadow-xl">
        <div className="flex items-center gap-3 mb-3">
          <FaClipboardCheck className="text-4xl" />
          <h1 className="text-3xl font-bold">Safety Risk Assessment</h1>
        </div>
        <p className="text-orange-100 text-lg">
          Quick checklist to help evaluate your current safety situation
        </p>
      </div>

      {/* Important Notice */}
      <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg mb-8">
        <h3 className="font-bold text-red-800 mb-2 flex items-center gap-2">
          <FaExclamationTriangle />
          Important Information
        </h3>
        <ul className="text-sm text-red-800 space-y-1">
          <li>• This is a screening tool, not a professional assessment</li>
          <li>• Your answers are private and not stored anywhere</li>
          <li>• If you're in immediate danger, call 911 or leave this page and seek help</li>
          <li>• Trust your instincts - you know your situation best</li>
        </ul>
      </div>

      {!showResults ? (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-6 text-gray-800">
            Answer these questions honestly about your current situation:
          </h3>

          <div className="space-y-6">
            {questions.map((q, index) => (
              <div key={q.id} className="border-b pb-6 last:border-b-0">
                <div className="flex items-start gap-3 mb-3">
                  <span className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    {index + 1}
                  </span>
                  <p className="text-gray-800 font-medium pt-1">{q.question}</p>
                </div>
                
                <div className="flex gap-4 ml-11">
                  <button
                    onClick={() => handleAnswer(q.id, 'yes')}
                    className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                      answers[q.id] === 'yes'
                        ? 'bg-orange-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => handleAnswer(q.id, 'no')}
                    className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                      answers[q.id] === 'no'
                        ? 'bg-orange-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex gap-4">
            <button
              onClick={calculateRisk}
              disabled={!canSubmit}
              className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 rounded-lg font-semibold hover:from-orange-700 hover:to-red-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              {canSubmit ? 'See Results' : `Answer All Questions (${Object.keys(answers).length}/${questions.length})`}
            </button>
            <button
              onClick={resetAssessment}
              className="px-8 py-4 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-all"
            >
              Reset
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Results */}
          <div className={`bg-${getRiskColor()}-50 border-4 border-${getRiskColor()}-500 rounded-xl p-8 shadow-xl`}>
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">
                {riskLevel === 'high' && '🚨'}
                {riskLevel === 'moderate' && '⚠️'}
                {riskLevel === 'low' && '✅'}
              </div>
              <h2 className={`text-3xl font-bold text-${getRiskColor()}-800 mb-2`}>
                {getRiskGuidance().title}
              </h2>
              <p className={`text-${getRiskColor()}-700 text-lg`}>
                {getRiskGuidance().description}
              </p>
            </div>

            {/* Emergency Buttons for High Risk */}
            {riskLevel === 'high' && (
              <div className="bg-white rounded-lg p-6 mb-6">
                <h3 className="font-bold text-red-800 mb-4 text-lg">🆘 Immediate Help:</h3>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => window.location.href = 'tel:911'}
                    className="flex-1 bg-red-600 text-white px-6 py-4 rounded-lg hover:bg-red-700 transition-all font-bold shadow-lg flex items-center justify-center gap-2"
                  >
                    <FaPhoneAlt /> Call 911
                  </button>
                  <button
                    onClick={() => window.location.href = 'tel:1-800-799-7233'}
                    className="flex-1 bg-purple-600 text-white px-6 py-4 rounded-lg hover:bg-purple-700 transition-all font-bold shadow-lg flex items-center justify-center gap-2"
                  >
                    <FaPhoneAlt /> Domestic Violence Hotline
                  </button>
                </div>
              </div>
            )}

            {/* Recommended Actions */}
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-bold text-gray-800 mb-4 text-lg flex items-center gap-2">
                <FaShieldAlt className={`text-${getRiskColor()}-600`} />
                Recommended Actions:
              </h3>
              <div className="space-y-3">
                {getRiskGuidance().actions.map((action, index) => (
                  <div key={index} className={`flex items-start gap-3 bg-${getRiskColor()}-50 p-4 rounded-lg`}>
                    <span className={`bg-${getRiskColor()}-500 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold flex-shrink-0 text-sm`}>
                      {index + 1}
                    </span>
                    <p className="text-gray-800">{action}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={resetAssessment}
              className="bg-gray-600 text-white py-4 rounded-lg font-semibold hover:bg-gray-700 transition-all shadow-lg"
            >
              Take Assessment Again
            </button>
            <button
              onClick={() => window.location.href = '/female-tools'}
              className="bg-purple-600 text-white py-4 rounded-lg font-semibold hover:bg-purple-700 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <FaShieldAlt /> Go to Safety Tools
            </button>
          </div>

          {/* Additional Resources */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="font-bold text-gray-800 mb-4">📚 Additional Resources & Tools:</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Safety Plan Builder</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Create a detailed plan with trusted contacts, safe places, and emergency steps.
                </p>
                <button 
                  onClick={() => window.location.href = '/female-tools'}
                  className="text-purple-600 font-semibold hover:underline text-sm"
                >
                  Create Safety Plan →
                </button>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Emergency Resources</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Quick access to crisis hotlines and emergency services.
                </p>
                <button 
                  onClick={() => window.location.href = '/female-tools'}
                  className="text-purple-600 font-semibold hover:underline text-sm"
                >
                  View Resources →
                </button>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Trusted Contact Alert</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Pre-written messages to quickly alert people you trust.
                </p>
                <button 
                  onClick={() => window.location.href = '/female-tools'}
                  className="text-purple-600 font-semibold hover:underline text-sm"
                >
                  Set Up Alerts →
                </button>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Counselor Support</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Talk to a female counselor in a secure, confidential chat.
                </p>
                <button 
                  onClick={() => window.location.href = '/female-tools'}
                  className="text-purple-600 font-semibold hover:underline text-sm"
                >
                  Start Chat →
                </button>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="text-sm text-blue-800">
              <strong>Remember:</strong> This assessment is a tool to help you think about your safety. 
              Only you know your full situation. Trust your instincts. If something feels wrong, it probably is. 
              Reach out for help - you deserve to be safe.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiskAssessment;
