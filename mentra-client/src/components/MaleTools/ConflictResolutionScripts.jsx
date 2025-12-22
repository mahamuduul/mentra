import { useState } from 'react';
import { FaComments, FaCopy, FaCheckCircle } from 'react-icons/fa';

const ConflictResolutionScripts = () => {
  const [selectedScenario, setSelectedScenario] = useState('workplace');
  const [copiedIndex, setCopiedIndex] = useState(null);

  const scenarios = [
    {
      id: 'workplace',
      title: 'Workplace Conflict',
      icon: '💼',
      scripts: [
        {
          situation: 'Colleague takes credit for your work',
          script: "I need to talk to you about the project presentation. I noticed my contributions weren't mentioned. I'd like to discuss how we can make sure everyone's work is acknowledged going forward.",
          tips: ['Stay calm and factual', 'Focus on the future, not blame', 'Request a private conversation']
        },
        {
          situation: 'Boss gives unfair criticism',
          script: "I appreciate the feedback, but I'd like to understand more. Can we review the specific instances you're referring to? I want to make sure I'm meeting expectations.",
          tips: ['Ask clarifying questions', 'Stay professional', 'Request specific examples']
        },
        {
          situation: 'Overwhelmed with workload',
          script: "I want to do quality work on all my projects. Right now I have X, Y, and Z on my plate. Can we prioritize which needs my attention first, or discuss extending some deadlines?",
          tips: ['Be honest about capacity', 'Offer solutions', 'Focus on quality over quantity']
        }
      ]
    },
    {
      id: 'relationship',
      title: 'Relationship Conflict',
      icon: '❤️',
      scripts: [
        {
          situation: 'Partner not listening',
          script: "I need to share something that's important to me. Can we find a time when we can both focus without distractions? I really need you to hear me on this.",
          tips: ['Request undivided attention', 'Use "I" statements', 'Choose the right time']
        },
        {
          situation: 'Disagreement about household duties',
          script: "I feel overwhelmed with the household tasks. Can we sit down and create a plan that feels fair to both of us? I'm open to compromise.",
          tips: ['Express feelings without blame', 'Seek collaborative solution', 'Be willing to negotiate']
        },
        {
          situation: 'Feeling unappreciated',
          script: "I've been feeling like my efforts aren't being noticed. It would mean a lot to me if we could acknowledge each other's contributions more often. What do you think?",
          tips: ['Share your feelings', 'Make specific requests', 'Ask for their input']
        }
      ]
    },
    {
      id: 'family',
      title: 'Family Conflict',
      icon: '👨‍👩‍👧‍👦',
      scripts: [
        {
          situation: 'Parent boundary issues',
          script: "I love you and value our relationship. At the same time, I need to make my own decisions about [topic]. I hope you can respect that, even if you disagree.",
          tips: ['Affirm the relationship first', 'Be firm but loving', 'Allow them to have feelings']
        },
        {
          situation: 'Sibling rivalry',
          script: "Our relationship is important to me. I've felt hurt by [specific behavior]. Can we talk about how we can interact in a way that works better for both of us?",
          tips: ['Focus on the relationship', 'Be specific about behavior', 'Seek mutual understanding']
        },
        {
          situation: 'Parenting disagreement',
          script: "We both want what's best for our kids. I'm concerned about [issue]. Can we discuss our different perspectives and find an approach we're both comfortable with?",
          tips: ['Start with common ground', 'Express concerns, not criticism', 'Collaborate on solutions']
        }
      ]
    },
    {
      id: 'social',
      title: 'Social Situations',
      icon: '👥',
      scripts: [
        {
          situation: 'Friend repeatedly cancels plans',
          script: "I value our friendship, and I've noticed plans have been canceled a few times. If you're too busy right now, I understand. But if there's something else, I'd like to talk about it.",
          tips: ['Express care for friendship', 'Give benefit of doubt', 'Open door for honest conversation']
        },
        {
          situation: 'Someone makes inappropriate jokes',
          script: "Hey, I know you're joking, but that type of humor doesn't sit well with me. I'd appreciate it if we could keep things respectful.",
          tips: ['Be direct but not aggressive', 'Set clear boundaries', 'Don't apologize for your boundaries']
        },
        {
          situation: 'Declining unwanted invitation',
          script: "Thank you for thinking of me! I won't be able to make it this time, but I appreciate the invitation. Let's plan something another time.",
          tips: ['Be appreciative', 'No need to over-explain', 'Offer alternative if desired']
        }
      ]
    }
  ];

  const communicationTechniques = [
    {
      name: 'I-Statements',
      description: 'Express your feelings without blaming',
      formula: '"I feel [emotion] when [behavior] because [reason]."',
      example: '"I feel frustrated when meetings start late because it impacts my schedule."'
    },
    {
      name: 'Active Listening',
      description: 'Show you understand before responding',
      formula: '"What I hear you saying is... Is that correct?"',
      example: '"So you\'re saying you felt left out of the decision. Did I understand that right?"'
    },
    {
      name: 'Time-Out Request',
      description: 'Pause when emotions are too high',
      formula: '"I need a break to cool down. Can we continue in [time]?"',
      example: '"I\'m getting too heated. Can we pick this up in 30 minutes?"'
    },
    {
      name: 'Focus on Solutions',
      description: 'Move from problem to action',
      formula: '"What can we do to prevent this going forward?"',
      example: '"How can we set up a system so this doesn\'t happen again?"'
    }
  ];

  const currentScenario = scenarios.find(s => s.id === selectedScenario);

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <div className="flex items-start space-x-3">
          <FaComments className="text-green-600 text-xl mt-1" />
          <div>
            <h5 className="font-semibold text-gray-900 mb-2">Conflict Resolution Scripts</h5>
            <p className="text-sm text-gray-700">
              Use these proven scripts and techniques to navigate difficult conversations with confidence.
              Adapt the language to match your style while keeping the core principles.
            </p>
          </div>
        </div>
      </div>

      {/* Scenario Selection */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-4">Choose a Scenario</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {scenarios.map(scenario => (
            <button
              key={scenario.id}
              onClick={() => setSelectedScenario(scenario.id)}
              className={`p-4 rounded-lg font-medium transition-colors text-center ${
                selectedScenario === scenario.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <div className="text-3xl mb-2">{scenario.icon}</div>
              <div className="text-sm">{scenario.title}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Scripts */}
      {currentScenario && (
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">{currentScenario.title} Scripts</h4>
          {currentScenario.scripts.map((item, index) => (
            <div key={index} className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-start justify-between mb-3">
                <h5 className="font-semibold text-gray-900">{item.situation}</h5>
                <button
                  onClick={() => copyToClipboard(item.script, index)}
                  className="flex items-center gap-2 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
                >
                  {copiedIndex === index ? (
                    <>
                      <FaCheckCircle className="text-green-600" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <FaCopy />
                      Copy
                    </>
                  )}
                </button>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
                <p className="text-sm text-gray-900 italic">"{item.script}"</p>
              </div>

              <div>
                <span className="text-xs font-medium text-gray-500 uppercase">Tips:</span>
                <ul className="mt-2 space-y-1">
                  {item.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-blue-600 mt-1">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Communication Techniques */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-4">Core Communication Techniques</h4>
        <div className="grid md:grid-cols-2 gap-4">
          {communicationTechniques.map((technique, index) => (
            <div key={index} className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h5 className="font-semibold text-gray-900 mb-2">{technique.name}</h5>
              <p className="text-sm text-gray-700 mb-3">{technique.description}</p>
              
              <div className="space-y-2">
                <div className="p-2 bg-white rounded border border-purple-200">
                  <span className="text-xs font-medium text-purple-900">Formula:</span>
                  <p className="text-sm text-gray-900 mt-1">{technique.formula}</p>
                </div>
                
                <div className="p-2 bg-white rounded border border-purple-200">
                  <span className="text-xs font-medium text-purple-900">Example:</span>
                  <p className="text-sm text-gray-700 mt-1 italic">{technique.example}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* De-escalation Tips */}
      <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
        <h5 className="font-semibold text-gray-900 mb-3">De-escalation Strategies</h5>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <span className="font-medium text-gray-900">Do:</span>
            <ul className="mt-2 space-y-1">
              <li>✓ Stay calm and breathe deeply</li>
              <li>✓ Acknowledge their perspective</li>
              <li>✓ Use a soft, steady tone</li>
              <li>✓ Take breaks if needed</li>
              <li>✓ Focus on one issue at a time</li>
            </ul>
          </div>
          <div>
            <span className="font-medium text-gray-900">Don't:</span>
            <ul className="mt-2 space-y-1">
              <li>✗ Raise your voice</li>
              <li>✗ Use "always" or "never"</li>
              <li>✗ Bring up past issues</li>
              <li>✗ Make it personal</li>
              <li>✗ Force immediate resolution</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConflictResolutionScripts;
