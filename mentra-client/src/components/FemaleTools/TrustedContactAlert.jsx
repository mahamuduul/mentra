import { useState } from 'react';
import { FaUserFriends, FaEnvelope, FaPhone, FaCopy, FaCheckCircle } from 'react-icons/fa';
import { showSuccessToast, showErrorToast } from '../../utils/toast';

const TrustedContactAlert = () => {
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [copiedTemplate, setCopiedTemplate] = useState(null);

  const contactSuggestions = [
    { id: 1, name: 'Best Friend', relationship: 'Friend' },
    { id: 2, name: 'Family Member', relationship: 'Family' },
    { id: 3, name: 'Partner/Spouse', relationship: 'Partner' },
    { id: 4, name: 'Roommate', relationship: 'Roommate' },
    { id: 5, name: 'Coworker', relationship: 'Coworker' },
  ];

  const messageTemplates = [
    {
      id: 'check-in',
      title: '👋 General Check-In',
      situation: 'Want someone to check on you',
      message: "Hi! I wanted to reach out and let you know I'm thinking of you. Can we catch up soon? I could use someone to talk to.",
      tone: 'casual'
    },
    {
      id: 'need-support',
      title: '🤗 Need Support',
      situation: 'Feeling down and need emotional support',
      message: "Hey, I'm going through a tough time right now and could really use your support. Would you have some time to talk? I'd really appreciate it.",
      tone: 'vulnerable'
    },
    {
      id: 'feeling-unsafe',
      title: '⚠️ Feeling Unsafe',
      situation: 'Feel uncomfortable or unsafe',
      message: "I'm in a situation where I don't feel safe. Can you please call me or come get me? I'm at [LOCATION]. Please respond ASAP.",
      tone: 'urgent'
    },
    {
      id: 'check-up',
      title: '📞 Please Check on Me',
      situation: 'Want someone to check up on you later',
      message: "Hi! I'm going through something difficult. Could you please check in on me later today/tonight? I'd feel better knowing someone is looking out for me.",
      tone: 'concerned'
    },
    {
      id: 'emergency',
      title: '🆘 Emergency Alert',
      situation: 'Immediate help needed',
      message: "URGENT: I need help immediately. I'm at [LOCATION]. Please call me right away or come find me. This is serious.",
      tone: 'emergency'
    },
    {
      id: 'leaving-situation',
      title: '🚗 Need Pickup',
      situation: 'Need someone to pick you up',
      message: "I need to leave where I am. Can you please come pick me up at [LOCATION]? I'll explain more when I see you, but I need to leave now.",
      tone: 'urgent'
    },
    {
      id: 'mental-health',
      title: '🧠 Mental Health Support',
      situation: 'Struggling with mental health',
      message: "I'm not doing well mentally and I'm worried about myself. I don't want to be alone right now. Can you please talk to me or come over?",
      tone: 'vulnerable'
    },
    {
      id: 'harassment',
      title: '🛡️ Harassment Situation',
      situation: 'Experiencing harassment',
      message: "Someone is making me uncomfortable/harassing me. I'm at [LOCATION]. Can you please call me or come help me get out of this situation safely?",
      tone: 'urgent'
    },
    {
      id: 'bad-date',
      title: '💔 Need Rescue from Date',
      situation: 'Date going badly, need exit strategy',
      message: "Hi! I need your help. This date isn't going well and I want to leave. Can you please call me in 5 minutes with an 'emergency' so I have an excuse to go?",
      tone: 'tactical'
    },
    {
      id: 'crisis',
      title: '😢 Crisis - Don\'t Want to Be Alone',
      situation: 'In crisis, need immediate company',
      message: "I'm having a really hard time and I'm scared to be alone. Please can you come over or call me? I need someone with me right now. I'm not okay.",
      tone: 'crisis'
    }
  ];

  const copyToClipboard = (text, templateId) => {
    navigator.clipboard.writeText(text).then(() => {
      showSuccessToast('Message copied! Now send it to your trusted contact');
      setCopiedTemplate(templateId);
      setTimeout(() => setCopiedTemplate(null), 3000);
    }).catch(() => {
      showErrorToast('Failed to copy. Please copy manually.');
    });
  };

  const sendViaEmail = (message) => {
    const subject = encodeURIComponent('Need Your Support');
    const body = encodeURIComponent(message);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const sendViaSMS = (message) => {
    const body = encodeURIComponent(message);
    window.location.href = `sms:?body=${body}`;
  };

  const getToneColor = (tone) => {
    const colors = {
      casual: 'blue',
      vulnerable: 'purple',
      urgent: 'orange',
      concerned: 'teal',
      emergency: 'red',
      crisis: 'red',
      tactical: 'indigo'
    };
    return colors[tone] || 'gray';
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white mb-8 shadow-xl">
        <div className="flex items-center gap-3 mb-3">
          <FaUserFriends className="text-4xl" />
          <h1 className="text-3xl font-bold">Trusted Contact Alert</h1>
        </div>
        <p className="text-indigo-100 text-lg">
          Pre-written message templates to quickly reach out for help
        </p>
      </div>

      {/* Instructions */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-6 mb-8">
        <h3 className="font-bold text-blue-800 mb-3 text-lg">
          📱 How to Use This Tool
        </h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white p-4 rounded-lg">
            <div className="text-2xl mb-2">1️⃣</div>
            <p className="text-gray-700">
              <strong>Choose a template</strong> that matches your situation
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <div className="text-2xl mb-2">2️⃣</div>
            <p className="text-gray-700">
              <strong>Copy the message</strong> or customize it if needed
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <div className="text-2xl mb-2">3️⃣</div>
            <p className="text-gray-700">
              <strong>Send to your trusted contact</strong> via text, email, or messaging app
            </p>
          </div>
        </div>
      </div>

      {/* Message Templates */}
      <div className="space-y-4 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          📝 Pre-Written Message Templates
        </h2>
        
        {messageTemplates.map((template) => {
          const toneColor = getToneColor(template.tone);
          const isEmergency = template.tone === 'emergency' || template.tone === 'crisis';
          
          return (
            <div
              key={template.id}
              className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${
                isEmergency ? 'border-red-500 bg-red-50' : `border-${toneColor}-500`
              } hover:shadow-xl transition-all`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                    {template.title}
                    {isEmergency && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                        URGENT
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-600 italic mb-3">
                    For when: {template.situation}
                  </p>
                </div>
                <span className={`bg-${toneColor}-100 text-${toneColor}-700 px-3 py-1 rounded-full text-xs font-semibold uppercase`}>
                  {template.tone}
                </span>
              </div>

              <div className={`${isEmergency ? 'bg-white' : 'bg-gray-50'} p-4 rounded-lg border-2 ${isEmergency ? 'border-red-300' : 'border-gray-200'} mb-4`}>
                <p className="text-gray-800 whitespace-pre-wrap">{template.message}</p>
              </div>

              {template.message.includes('[LOCATION]') && (
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded mb-4">
                  <p className="text-xs text-yellow-800">
                    <strong>Note:</strong> Replace [LOCATION] with your actual location before sending
                  </p>
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => copyToClipboard(template.message, template.id)}
                  className={`flex-1 md:flex-initial bg-${toneColor}-600 text-white px-6 py-3 rounded-lg hover:bg-${toneColor}-700 transition-all font-semibold shadow-md flex items-center justify-center gap-2`}
                >
                  {copiedTemplate === template.id ? (
                    <>
                      <FaCheckCircle /> Copied!
                    </>
                  ) : (
                    <>
                      <FaCopy /> Copy Message
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => sendViaSMS(template.message)}
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-all font-semibold flex items-center gap-2"
                >
                  <FaPhone /> Send SMS
                </button>
                
                <button
                  onClick={() => sendViaEmail(template.message)}
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-all font-semibold flex items-center gap-2"
                >
                  <FaEnvelope /> Email
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Custom Message */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          ✏️ Create Custom Message
        </h3>
        <p className="text-gray-600 mb-4 text-sm">
          Need something more specific? Write your own message here.
        </p>
        <textarea
          value={customMessage}
          onChange={(e) => setCustomMessage(e.target.value)}
          placeholder="Write your custom message here..."
          rows="6"
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent mb-4"
        />
        <div className="flex gap-3">
          <button
            onClick={() => copyToClipboard(customMessage, 'custom')}
            disabled={!customMessage.trim()}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-all font-semibold shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaCopy /> Copy Custom Message
          </button>
          <button
            onClick={() => sendViaSMS(customMessage)}
            disabled={!customMessage.trim()}
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-all font-semibold flex items-center gap-2 disabled:opacity-50"
          >
            <FaPhone /> Send SMS
          </button>
        </div>
      </div>

      {/* Safety Tips */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-6">
        <h3 className="font-bold text-purple-800 text-lg mb-4">
          💡 Safety Tips
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="bg-white p-4 rounded-lg">
            <p className="font-semibold text-gray-800 mb-2">✅ Before You Need Help:</p>
            <ul className="space-y-1 text-gray-700">
              <li>• Save trusted contacts in your phone</li>
              <li>• Let people know they're your emergency contacts</li>
              <li>• Test that they respond to messages</li>
              <li>• Share your location settings in advance</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className="font-semibold text-gray-800 mb-2">🛡️ When Sending Messages:</p>
            <ul className="space-y-1 text-gray-700">
              <li>• Be specific about your location</li>
              <li>• Include a timeframe if needed</li>
              <li>• Send to multiple people if urgent</li>
              <li>• Follow up when you're safe</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Emergency Notice */}
      <div className="mt-8 bg-red-50 border-2 border-red-300 rounded-xl p-6">
        <h4 className="font-bold text-red-800 text-lg mb-3">
          🚨 In Immediate Danger?
        </h4>
        <p className="text-red-700 mb-4">
          If you are in immediate physical danger, call 911 or your local emergency services first. 
          These message templates are for reaching out to trusted contacts, not a replacement for emergency services.
        </p>
        <button
          onClick={() => window.location.href = 'tel:911'}
          className="bg-red-600 text-white px-8 py-4 rounded-lg hover:bg-red-700 transition-all font-bold shadow-lg"
        >
          📞 Call 911 (Emergency Services)
        </button>
      </div>
    </div>
  );
};

export default TrustedContactAlert;
