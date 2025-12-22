import { useState } from 'react';
import { FaBook, FaDownload, FaCheckCircle, FaGavel, FaShieldAlt, FaExclamationTriangle } from 'react-icons/fa';
import { showSuccessToast } from '../../utils/toast';

const SafetyEducation = () => {
  const [checkedItems, setCheckedItems] = useState([]);

  const safetyTips = [
    {
      category: 'Personal Safety Basics',
      icon: '🛡️',
      color: 'blue',
      tips: [
        'Trust your instincts - if something feels wrong, it probably is',
        'Stay alert and aware of your surroundings at all times',
        'Keep your phone charged and accessible',
        'Let someone know where you\'re going and when you\'ll be back',
        'Avoid isolated areas, especially at night',
        'Walk confidently and purposefully',
        'Vary your daily routines and routes'
      ]
    },
    {
      category: 'Digital Safety',
      icon: '📱',
      color: 'purple',
      tips: [
        'Use strong, unique passwords for all accounts',
        'Enable two-factor authentication',
        'Be cautious about sharing personal information online',
        'Check privacy settings on social media regularly',
        'Don\'t share your location in real-time publicly',
        'Be wary of suspicious links and emails',
        'Keep your devices and apps updated'
      ]
    },
    {
      category: 'Dating Safety',
      icon: '💝',
      color: 'pink',
      tips: [
        'Meet in public places for first dates',
        'Tell a friend where you\'re going and who you\'re meeting',
        'Have your own transportation or money for a taxi',
        'Don\'t leave drinks unattended',
        'Watch your drink being prepared',
        'Trust your gut - leave if you feel uncomfortable',
        'Video chat before meeting in person (for online dates)',
        'Keep early dates short and during daylight hours'
      ]
    },
    {
      category: 'Home Safety',
      icon: '🏠',
      color: 'green',
      tips: [
        'Keep doors and windows locked',
        'Install quality locks and consider a security system',
        'Don\'t advertise when you\'re away from home',
        'Get to know your neighbors',
        'Keep outdoor areas well-lit',
        'Don\'t open the door for unexpected visitors',
        'Have an escape plan and practice it'
      ]
    },
    {
      category: 'Transportation Safety',
      icon: '🚗',
      color: 'orange',
      tips: [
        'Check the backseat before getting in your car',
        'Lock doors immediately after entering vehicle',
        'Park in well-lit, populated areas',
        'Have keys ready before approaching your car',
        'If using ride-sharing, verify driver and car details',
        'Share your route with someone you trust',
        'Sit in the back seat when using ride-sharing'
      ]
    }
  ];

  const legalRights = [
    {
      title: 'You Have the Right to Say No',
      description: 'Consent must be freely given, enthusiastic, and can be withdrawn at any time. "No" means no, regardless of the circumstances or relationship.',
      icon: '✋'
    },
    {
      title: 'Protection Orders',
      description: 'You can request a restraining order or protection order against someone threatening your safety. Contact local law enforcement or courts for assistance.',
      icon: '⚖️'
    },
    {
      title: 'Workplace Rights',
      description: 'You have the right to a workplace free from harassment and discrimination. Report violations to HR or the Equal Employment Opportunity Commission (EEOC).',
      icon: '💼'
    },
    {
      title: 'Housing Rights',
      description: 'The Violence Against Women Act (VAWA) provides protections for survivors of domestic violence in housing situations.',
      icon: '🏘️'
    },
    {
      title: 'Legal Representation',
      description: 'You may be entitled to free or low-cost legal assistance through legal aid organizations, especially in cases of domestic violence or sexual assault.',
      icon: '👩‍⚖️'
    },
    {
      title: 'Victim Rights',
      description: 'As a victim of crime, you have rights including: the right to be heard, the right to protection, the right to information about the case, and the right to restitution.',
      icon: '🎗️'
    }
  ];

  const downloadChecklist = () => {
    const checklist = `
PERSONAL SAFETY CHECKLIST
Generated from Mentra Mental Health Platform

${safetyTips.map(section => `
${section.category.toUpperCase()}
${section.tips.map((tip, i) => `☐ ${tip}`).join('\n')}
`).join('\n')}

LEGAL RIGHTS SUMMARY
${legalRights.map((right, i) => `
${i + 1}. ${right.title}
   ${right.description}
`).join('\n')}

---
This checklist is for educational purposes. 
For emergencies, call 911 or your local emergency services.
For support, call the National Domestic Violence Hotline: 1-800-799-7233
    `.trim();

    const blob = new Blob([checklist], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'safety-checklist.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showSuccessToast('Checklist downloaded successfully');
  };

  const toggleCheckItem = (category, index) => {
    const key = `${category}-${index}`;
    setCheckedItems(prev => 
      prev.includes(key) 
        ? prev.filter(item => item !== key)
        : [...prev, key]
    );
  };

  const isChecked = (category, index) => {
    return checkedItems.includes(`${category}-${index}`);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-green-600 rounded-2xl p-8 text-white mb-8 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <FaBook className="text-4xl" />
              <h1 className="text-3xl font-bold">Safety Education Library</h1>
            </div>
            <p className="text-teal-100 text-lg">
              Essential safety tips, legal rights awareness, and downloadable resources
            </p>
          </div>
          <button
            onClick={downloadChecklist}
            className="bg-white text-teal-600 px-6 py-3 rounded-lg font-semibold hover:bg-teal-50 transition-all flex items-center gap-2 shadow-lg"
          >
            <FaDownload /> Download Checklist
          </button>
        </div>
      </div>

      {/* Safety Tips by Category */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">🛡️ Safety Tips & Best Practices</h2>
        <div className="space-y-6">
          {safetyTips.map((section, sectionIndex) => (
            <div key={sectionIndex} className="bg-white rounded-xl shadow-lg p-6">
              <h3 className={`text-xl font-bold mb-4 text-${section.color}-800 flex items-center gap-2`}>
                <span className="text-3xl">{section.icon}</span>
                {section.category}
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                {section.tips.map((tip, tipIndex) => (
                  <div 
                    key={tipIndex}
                    onClick={() => toggleCheckItem(section.category, tipIndex)}
                    className={`flex items-start gap-3 p-4 rounded-lg cursor-pointer transition-all ${
                      isChecked(section.category, tipIndex)
                        ? `bg-${section.color}-50 border-2 border-${section.color}-500`
                        : 'bg-gray-50 border-2 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {isChecked(section.category, tipIndex) ? (
                        <FaCheckCircle className={`text-${section.color}-600 text-xl`} />
                      ) : (
                        <div className="w-5 h-5 border-2 border-gray-400 rounded"></div>
                      )}
                    </div>
                    <p className={`text-sm ${isChecked(section.category, tipIndex) ? 'font-semibold' : ''} text-gray-700`}>
                      {tip}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legal Rights Awareness */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <FaGavel className="text-purple-600" />
          Know Your Legal Rights
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {legalRights.map((right, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-all">
              <div className="flex items-start gap-4 mb-3">
                <div className="text-4xl">{right.icon}</div>
                <h3 className="text-lg font-bold text-gray-800">{right.title}</h3>
              </div>
              <p className="text-gray-700 text-sm">{right.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Do's and Don'ts */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">✅ Do's and ❌ Don'ts</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
              <FaCheckCircle className="text-green-600" />
              DO These Things
            </h3>
            <div className="space-y-3">
              {[
                'Trust your instincts and intuition',
                'Document incidents with dates and details',
                'Seek support from trusted friends and family',
                'Create and practice a safety plan',
                'Learn about available resources in your area',
                'Keep important documents in a safe place',
                'Take care of your mental health',
                'Know that it\'s not your fault'
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-gray-700">
                  <span className="text-green-600 font-bold mt-1">✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-red-800 mb-4 flex items-center gap-2">
              <FaExclamationTriangle className="text-red-600" />
              DON'T Do These Things
            </h3>
            <div className="space-y-3">
              {[
                'Don\'t blame yourself for someone else\'s actions',
                'Don\'t ignore warning signs or red flags',
                'Don\'t keep abuse or threats secret',
                'Don\'t confront an abuser without a safety plan',
                'Don\'t give up on seeking help if first attempt fails',
                'Don\'t feel you have to handle everything alone',
                'Don\'t rush into major decisions under pressure',
                'Don\'t believe you deserve to be treated badly'
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-gray-700">
                  <span className="text-red-600 font-bold mt-1">✗</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Important Resources */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-6 mb-8">
        <h3 className="font-bold text-blue-800 text-lg mb-4 flex items-center gap-2">
          <FaShieldAlt />
          Important Contact Information
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg">
            <p className="font-semibold text-gray-800 mb-2">Emergency Services</p>
            <p className="text-2xl font-bold text-red-600 mb-1">911</p>
            <p className="text-sm text-gray-600">For immediate life-threatening situations</p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className="font-semibold text-gray-800 mb-2">National Domestic Violence Hotline</p>
            <p className="text-2xl font-bold text-purple-600 mb-1">1-800-799-7233</p>
            <p className="text-sm text-gray-600">24/7 confidential support</p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className="font-semibold text-gray-800 mb-2">RAINN Sexual Assault Hotline</p>
            <p className="text-2xl font-bold text-pink-600 mb-1">1-800-656-4673</p>
            <p className="text-sm text-gray-600">Support for survivors</p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className="font-semibold text-gray-800 mb-2">Crisis Text Line</p>
            <p className="text-2xl font-bold text-blue-600 mb-1">Text HOME to 741741</p>
            <p className="text-sm text-gray-600">24/7 text support</p>
          </div>
        </div>
      </div>

      {/* Download Section */}
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="text-6xl mb-4">📥</div>
        <h3 className="text-2xl font-bold text-gray-800 mb-3">
          Download Your Personal Safety Checklist
        </h3>
        <p className="text-gray-600 mb-6">
          Get a comprehensive safety checklist with all tips and legal rights information in a downloadable text file. 
          Keep it accessible for reference anytime.
        </p>
        <button
          onClick={downloadChecklist}
          className="bg-gradient-to-r from-teal-600 to-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-teal-700 hover:to-green-700 transition-all shadow-lg flex items-center gap-2 mx-auto text-lg"
        >
          <FaDownload /> Download Safety Checklist
        </button>
      </div>

      {/* Disclaimer */}
      <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
        <p className="text-sm text-yellow-800">
          <strong>Disclaimer:</strong> This information is for educational purposes only and not a substitute for professional advice. 
          Every situation is unique. For personalized guidance, please consult with local law enforcement, legal professionals, 
          or domestic violence advocates. If you're in immediate danger, call 911.
        </p>
      </div>
    </div>
  );
};

export default SafetyEducation;
