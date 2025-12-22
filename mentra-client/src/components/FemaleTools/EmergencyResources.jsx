import { FaPhoneAlt, FaComments, FaMapMarkerAlt, FaExclamationTriangle, FaHeart } from 'react-icons/fa';
import { showSuccessToast } from '../../utils/toast';

const EmergencyResources = () => {
  const hotlines = [
    {
      name: 'National Suicide & Crisis Lifeline',
      number: '988',
      description: '24/7 crisis support for suicidal thoughts',
      icon: '🆘',
      color: 'red'
    },
    {
      name: 'National Domestic Violence Hotline',
      number: '1-800-799-7233',
      textNumber: 'Text START to 88788',
      description: 'Support for domestic violence situations',
      icon: '🏠',
      color: 'purple'
    },
    {
      name: 'RAINN Sexual Assault Hotline',
      number: '1-800-656-4673',
      description: 'Support for sexual assault survivors',
      icon: '🤝',
      color: 'pink'
    },
    {
      name: 'Crisis Text Line',
      number: 'Text HOME to 741741',
      description: '24/7 text-based crisis support',
      icon: '💬',
      color: 'blue'
    },
    {
      name: 'National Child Abuse Hotline',
      number: '1-800-422-4453',
      description: 'Report child abuse and get help',
      icon: '👶',
      color: 'orange'
    },
    {
      name: 'Substance Abuse and Mental Health Helpline',
      number: '1-800-662-4357',
      description: 'Support for substance abuse and mental health',
      icon: '🧠',
      color: 'teal'
    },
    {
      name: 'National Eating Disorders Helpline',
      number: '1-800-931-2237',
      textNumber: 'Text NEDA to 741741',
      description: 'Support for eating disorders',
      icon: '🍽️',
      color: 'green'
    },
    {
      name: 'Trevor Project (LGBTQ+ Youth)',
      number: '1-866-488-7386',
      textNumber: 'Text START to 678-678',
      description: 'Crisis support for LGBTQ+ young people',
      icon: '🏳️‍🌈',
      color: 'indigo'
    },
    {
      name: 'Emergency Services',
      number: '911',
      description: 'Immediate life-threatening emergencies',
      icon: '🚨',
      color: 'red'
    }
  ];

  const safetyTips = [
    {
      title: 'Share Your Location',
      description: 'Use your phone\'s location sharing feature to let trusted contacts know where you are',
      steps: [
        'iPhone: Open Find My app → Share My Location',
        'Android: Open Google Maps → Location sharing',
        'Share only with people you trust completely'
      ]
    },
    {
      title: 'Emergency Contacts',
      description: 'Set up ICE (In Case of Emergency) contacts on your phone',
      steps: [
        'Add "ICE" before contact names in your phone',
        'Include medical information if needed',
        'Make sure contacts can be accessed from lock screen'
      ]
    },
    {
      title: 'Safety Apps',
      description: 'Consider installing personal safety apps',
      steps: [
        'Circle of 6: Quick alerts to friends',
        'bSafe: Location tracking and fake call',
        'Noonlight: Silent alarm system'
      ]
    }
  ];

  const makeCall = (number) => {
    const cleanNumber = number.replace(/[^0-9]/g, '');
    window.location.href = `tel:${cleanNumber}`;
    showSuccessToast(`Calling ${number}...`);
  };

  const sendText = (number, message) => {
    const cleanNumber = number.replace(/[^0-9]/g, '');
    window.location.href = `sms:${cleanNumber}${message ? `?body=${encodeURIComponent(message)}` : ''}`;
  };

  const getColorClasses = (color) => {
    const colors = {
      red: 'from-red-500 to-red-600 hover:from-red-600 hover:to-red-700',
      purple: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
      pink: 'from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700',
      blue: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
      orange: 'from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700',
      teal: 'from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700',
      green: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
      indigo: 'from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-8 text-white mb-8 shadow-xl">
        <div className="flex items-center gap-3 mb-3">
          <FaExclamationTriangle className="text-4xl" />
          <h1 className="text-3xl font-bold">Emergency Resources</h1>
        </div>
        <p className="text-red-100 text-lg">
          Quick access to emergency hotlines and safety information
        </p>
      </div>

      {/* Critical Notice */}
      <div className="bg-red-50 border-4 border-red-500 rounded-xl p-6 mb-8">
        <h3 className="font-bold text-red-800 text-xl mb-3 flex items-center gap-2">
          <FaExclamationTriangle className="text-2xl" />
          If you're in immediate danger, call 911
        </h3>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => makeCall('911')}
            className="bg-red-600 text-white px-8 py-4 rounded-lg hover:bg-red-700 transition-all font-bold shadow-lg text-lg flex items-center gap-2"
          >
            <FaPhoneAlt /> Call 911 Now
          </button>
          <p className="text-red-800 flex items-center">
            For life-threatening emergencies: violent situations, medical emergencies, active threats
          </p>
        </div>
      </div>

      {/* Quick Access Hotlines */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FaPhoneAlt className="text-red-600" />
          Crisis Hotlines - Quick Access
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {hotlines.map((hotline, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200 hover:shadow-xl transition-all"
            >
              <div className="text-5xl mb-3">{hotline.icon}</div>
              <h3 className="font-bold text-gray-800 text-lg mb-2">{hotline.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{hotline.description}</p>
              
              <div className="space-y-2">
                {hotline.number && !hotline.number.startsWith('Text') && (
                  <button
                    onClick={() => makeCall(hotline.number)}
                    className={`w-full bg-gradient-to-r ${getColorClasses(hotline.color)} text-white py-3 rounded-lg font-semibold transition-all shadow-md flex items-center justify-center gap-2`}
                  >
                    <FaPhoneAlt /> Call {hotline.number}
                  </button>
                )}
                
                {hotline.number.startsWith('Text') && (
                  <button
                    onClick={() => {
                      const parts = hotline.number.match(/Text (\w+) to (\d+)/);
                      if (parts) sendText(parts[2], parts[1]);
                    }}
                    className={`w-full bg-gradient-to-r ${getColorClasses(hotline.color)} text-white py-3 rounded-lg font-semibold transition-all shadow-md flex items-center justify-center gap-2`}
                  >
                    <FaComments /> {hotline.number}
                  </button>
                )}
                
                {hotline.textNumber && (
                  <button
                    onClick={() => {
                      const parts = hotline.textNumber.match(/Text (\w+) to (\d+)/);
                      if (parts) sendText(parts[2], parts[1]);
                    }}
                    className="w-full bg-gray-600 text-white py-2 rounded-lg font-semibold hover:bg-gray-700 transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    <FaComments /> {hotline.textNumber}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Share Location Guide */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FaMapMarkerAlt className="text-blue-600" />
            Share Your Location
          </h3>
          <div className="space-y-4">
            {safetyTips[0].steps.map((step, index) => (
              <div key={index} className="flex items-start gap-3 bg-blue-50 p-3 rounded-lg">
                <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold flex-shrink-0 text-sm">
                  {index + 1}
                </span>
                <p className="text-gray-700">{step}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded">
            <p className="text-sm text-yellow-800">
              <strong>Safety Tip:</strong> Only share your location with people you completely trust. 
              You can usually set time limits for how long location sharing lasts.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FaHeart className="text-red-600" />
            Safety Apps
          </h3>
          <div className="space-y-4">
            {safetyTips[2].steps.map((app, index) => (
              <div key={index} className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                <p className="font-semibold text-gray-800 mb-1">{app.split(':')[0]}</p>
                <p className="text-sm text-gray-600">{app.split(':')[1]}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> These apps can provide an extra layer of safety. 
              Download them from official app stores and set them up before you need them.
            </p>
          </div>
        </div>
      </div>

      {/* Important Information */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-6">
        <h3 className="font-bold text-purple-800 text-lg mb-4">
          📝 Important Things to Know
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="bg-white p-4 rounded-lg">
            <p className="font-semibold text-gray-800 mb-2">✅ What Hotlines Can Do:</p>
            <ul className="space-y-1 text-gray-700">
              <li>• Provide immediate emotional support</li>
              <li>• Connect you with local resources</li>
              <li>• Help you create a safety plan</li>
              <li>• Listen without judgment</li>
              <li>• Provide information about your options</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className="font-semibold text-gray-800 mb-2">🔒 Your Privacy:</p>
            <ul className="space-y-1 text-gray-700">
              <li>• Most hotlines are confidential</li>
              <li>• You can remain anonymous if you choose</li>
              <li>• Your calls are not recorded or traced</li>
              <li>• Crisis counselors are trained professionals</li>
              <li>• They won't judge or force you to do anything</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Additional Resources */}
      <div className="mt-8 bg-gray-50 rounded-xl p-6">
        <h3 className="font-bold text-gray-800 text-lg mb-3">
          📚 Additional Resources
        </h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">Online Chat Support</h4>
            <p className="text-gray-600">Many hotlines also offer online chat if you prefer not to call.</p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">Local Resources</h4>
            <p className="text-gray-600">Ask hotline counselors about support services in your area.</p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">Legal Aid</h4>
            <p className="text-gray-600">Many organizations offer free legal support for victims.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyResources;
