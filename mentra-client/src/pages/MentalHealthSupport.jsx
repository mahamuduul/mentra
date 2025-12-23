import { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext';
import GenderProtectedSection from '../components/GenderProtectedSection';
import { Link } from 'react-router-dom';
import { 
  FaShieldAlt, 
  FaUserShield, 
  FaExclamationTriangle, 
  FaBrain,
  FaBriefcase,
  FaDollarSign,
  FaFire,
  FaComments,
  FaBook,
  FaPhone,
  FaCalendarCheck,
  FaMars,
  FaVenus,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';

const MentalHealthSupport = () => {
  const { user, isAuthenticated } = useAuth();
  const [expandedProblem, setExpandedProblem] = useState(null);

  // Get gender from user data
  const userGender = user?.gender || user?.profile?.gender;
  const normalizedGender = userGender ? userGender.charAt(0).toUpperCase() + userGender.slice(1).toLowerCase() : null;

  // Female-specific problems and solutions
  const femaleProblems = [
    {
      id: 'harassment',
      title: 'Harassment Issues',
      icon: FaShieldAlt,
      color: 'pink',
      description: 'Trauma-informed care using evidence-based CBT and supportive counseling',
      clinicalApproach: 'Cognitive Behavioral Therapy (CBT) & Trauma-Informed Care',
      proven: 'Clinically proven to reduce anxiety and trauma symptoms',
      webTools: [
        {
          name: 'Anonymous Reporting',
          description: 'Secure platform to report incidents confidentially',
          link: '/female-tools'
        },
        {
          name: 'Safety Plan Builder',
          description: 'Create personalized safety plans with emergency contacts',
          link: '/female-tools'
        },
        {
          name: 'Secure Counselor Ticket',
          description: 'One-to-one chat with trained female counselors',
          link: '/female-tools'
        },
        {
          name: 'Grounding Exercises',
          description: '5-4-3-2-1 techniques and breathing exercises',
          link: '/female-tools'
        }
      ]
    },
    {
      id: 'social-pressure',
      title: 'Social or Personal Pressure',
      icon: FaUserShield,
      color: 'purple',
      description: 'CBT and peer-support interventions to reduce social stress',
      clinicalApproach: 'CBT & Peer-Support Interventions',
      proven: 'Research-proven to reduce social stress and improve emotional resilience',
      webTools: [
        {
          name: 'CBT Thought Record',
          description: 'Challenge negative thoughts with cognitive therapy',
          link: '/female-tools'
        },
        {
          name: 'Goal & Boundary Planner',
          description: 'Set goals and practice saying no with confidence',
          link: '/female-tools'
        },
        {
          name: 'Peer Support Forum',
          description: 'Moderated community for sharing experiences safely',
          link: '/female-tools'
        },
        {
          name: 'Daily Check-In',
          description: 'Track mood and stress with personalized suggestions',
          link: '/female-tools'
        }
      ]
    },
    {
      id: 'safety',
      title: 'Safety-Related Issues',
      icon: FaExclamationTriangle,
      color: 'red',
      description: 'Psychoeducation and crisis-intervention models for personal safety',
      clinicalApproach: 'Psychoeducation & Crisis-Intervention Models',
      proven: 'Proven to improve personal safety awareness and emotional stability',
      webTools: [
        {
          name: 'Emergency Resources',
          description: 'Hotline directory with one-tap calling',
          link: '/female-tools'
        },
        {
          name: 'Trusted Contact Alert',
          description: 'Pre-written emergency message templates',
          link: '/female-tools'
        },
        {
          name: 'Risk Assessment',
          description: 'Personal safety quiz with risk-specific guidance',
          link: '/female-tools'
        },
        {
          name: 'Safety Education',
          description: 'Safety tips library with legal rights information',
          link: '/female-tools'
        }
      ]
    },
    {
      id: 'mental-stress',
      title: 'Mental Stress',
      icon: FaBrain,
      color: 'indigo',
      description: 'Mindfulness-Based Stress Reduction (MBSR) and CBT techniques',
      clinicalApproach: 'MBSR & Cognitive Behavioral Therapy',
      proven: 'Clinically proven to lower stress and anxiety levels',
      webTools: [
        {
          name: 'Breathing & Meditation',
          description: 'Guided breathing techniques and mindfulness exercises',
          link: '/female-tools'
        },
        {
          name: 'Mood Tracker',
          description: 'Daily mood logging with weekly graph visualization',
          link: '/female-tools'
        },
        {
          name: 'Stress Assessment',
          description: 'Evaluate stress levels with personalized suggestions',
          link: '/female-tools'
        },
        {
          name: 'Exercise Library',
          description: 'Relaxation exercises and journaling prompts',
          link: '/female-tools'
        }
      ]
    }
  ];

  // Male-specific problems and solutions
  const maleProblems = [
    {
      id: 'career-pressure',
      title: 'Career Pressure',
      icon: FaBriefcase,
      color: 'blue',
      description: 'CBT-based stress management and goal-oriented counseling',
      clinicalApproach: 'CBT-Based Stress Management & Goal-Oriented Counseling',
      proven: 'Proven to reduce work-related stress and burnout',
      webTools: [
        {
          name: 'Career Counseling Chat',
          description: 'Professional guidance for career-related stress',
          link: '/counselors'
        },
        {
          name: 'Goal-Setting Dashboard',
          description: 'Track career goals and achievements',
          link: '/tools/goal-tracker'
        },
        {
          name: 'Motivational Content',
          description: 'Resources for professional development and resilience',
          link: '/resources'
        },
        {
          name: 'Stress-Control Exercises',
          description: 'Guided techniques for managing work pressure',
          link: '/tools/stress-control'
        }
      ]
    },
    {
      id: 'financial-stress',
      title: 'Financial Stress',
      icon: FaDollarSign,
      color: 'green',
      description: 'CBT and problem-solving therapy for financial anxiety',
      clinicalApproach: 'CBT & Problem-Solving Therapy',
      proven: 'Research-confirmed to manage financial anxiety and emotional distress',
      webTools: [
        {
          name: 'Financial Stress Counseling',
          description: 'Specialized sessions for financial anxiety',
          link: '/counselors'
        },
        {
          name: 'Coping Resources',
          description: 'Educational content on financial stress management',
          link: '/resources'
        },
        {
          name: 'Emotional Support Chat',
          description: 'Real-time support for financial concerns',
          link: '/live-chat'
        },
        {
          name: 'Self-Help Modules',
          description: 'Structured programs for financial stress relief',
          link: '/tools/financial-coping'
        }
      ]
    },
    {
      id: 'anger-management',
      title: 'Anger Management',
      icon: FaFire,
      color: 'orange',
      description: 'Anger Management Therapy and CBT techniques',
      clinicalApproach: 'Anger Management Therapy & CBT',
      proven: 'Widely proven to improve emotional regulation and behavioral control',
      webTools: [
        {
          name: 'Anger-Control Exercises',
          description: 'Guided techniques to manage anger responses',
          link: '/tools/anger-control'
        },
        {
          name: 'Trigger Tracking',
          description: 'Identify and monitor anger triggers',
          link: '/tools/trigger-tracker'
        },
        {
          name: 'Behavioral Therapy Content',
          description: 'Educational resources on anger management',
          link: '/resources'
        },
        {
          name: 'Therapist-Led Sessions',
          description: 'Professional therapy for anger issues',
          link: '/counselors'
        }
      ]
    }
  ];

  const toggleProblem = (problemId) => {
    setExpandedProblem(expandedProblem === problemId ? null : problemId);
  };

  const ProblemCard = ({ problem, genderColor }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl border-2 border-purple-200 overflow-hidden hover:border-purple-500 transition-all duration-300 shadow-xl"
    >
      <button
        onClick={() => toggleProblem(problem.id)}
        className="w-full p-6 flex items-center justify-between text-left"
      >
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center">
            <problem.icon className="text-2xl text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">{problem.title}</h3>
            <p className="text-sm text-gray-600">{problem.description}</p>
          </div>
        </div>
        {expandedProblem === problem.id ? (
          <FaChevronUp className="text-gray-900 text-xl" />
        ) : (
          <FaChevronDown className="text-gray-900 text-xl" />
        )}
      </button>

      {expandedProblem === problem.id && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="border-t border-purple-200"
        >
          <div className="p-6 space-y-6">
            {/* Clinical Approach */}
            <div className="bg-white rounded-xl border-2 border-purple-200 p-4 shadow-xl">
              <h4 className="text-sm font-semibold text-purple-600 mb-2">Clinical Approach</h4>
              <p className="text-gray-900 font-medium">{problem.clinicalApproach}</p>
              <p className="text-purple-600 text-sm mt-2 flex items-center">
                <span className="mr-2"></span>
                {problem.proven}
              </p>
            </div>

            {/* Web-Based Tools */}
            <div>
              <h4 className="text-sm font-semibold text-purple-600 mb-4">Evidence-Based Web Solutions</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {problem.webTools.map((tool, index) => (
                  <Link
                    key={index}
                    to={tool.link}
                    className="bg-white hover:bg-gradient-to-br hover:from-purple-600 hover:to-purple-800 border-2 border-purple-200 hover:border-purple-500 rounded-lg p-4 transition-all duration-300 group shadow-xl"
                  >
                    <h5 className="text-gray-900 font-semibold mb-2 group-hover:text-white transition-colors">
                      {tool.name}
                    </h5>
                    <p className="text-sm text-gray-600 group-hover:text-white">{tool.description}</p>
                    <span className="text-xs text-purple-600 group-hover:text-white mt-2 inline-block">
                      Access Tool
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3">
              <Link
                to="/counselors"
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-br from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white rounded-lg transition-all shadow-xl"
              >
                <FaPhone />
                <span>Book Counselor</span>
              </Link>
              <Link
                to="/resources"
                className="flex items-center space-x-2 px-4 py-2 bg-white hover:bg-gradient-to-br hover:from-purple-600 hover:to-purple-800 text-gray-900 hover:text-white border-2 border-purple-200 hover:border-purple-500 rounded-lg transition-all shadow-xl"
              >
                <FaBook />
                <span>Learn More</span>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <Helmet>
        <title>Mental Health Support - Mentra</title>
        <meta name="description" content="Access gender-specific mental health support with evidence-based therapeutic tools and research-backed interventions." />
      </Helmet>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Evidence-Based Mental Health Support
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Gender-specific support using clinically proven therapeutic methods and research-backed interventions
          </p>
        </motion.div>

        {!isAuthenticated ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-purple-600 to-purple-800 border-2 border-purple-200 rounded-2xl p-8 text-center max-w-2xl mx-auto shadow-xl"
          >
            <h3 className="text-2xl font-bold text-white mb-4">Login Required</h3>
            <p className="text-white mb-6">
              Please login to access personalized mental health support based on your needs.
            </p>
            <Link
              to="/login"
              className="inline-block px-8 py-3 bg-gradient-to-br from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-semibold rounded-xl transition-all"
            >
              Login Now
            </Link>
          </motion.div>
        ) : !normalizedGender ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-purple-600 to-purple-800 border-2 border-purple-200 rounded-2xl p-8 text-center max-w-2xl mx-auto shadow-xl"
          >
            <h3 className="text-2xl font-bold text-white mb-4">Complete Your Profile</h3>
            <p className="text-white mb-6">
              Please update your profile to access gender-specific mental health support.
            </p>
            <Link
              to="/profile"
              className="inline-block px-8 py-3 bg-gradient-to-br from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-semibold rounded-xl transition-all"
            >
              Update Profile
            </Link>
          </motion.div>
        ) : (
          <>
            {/* Female Support Section */}
            <GenderProtectedSection allowedGenders={['Female']} showFallback={false}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-16"
              >
                <div className="flex items-center justify-center mb-8">
                  <div className="flex items-center space-x-3 bg-gradient-to-br from-purple-600 to-purple-800 px-6 py-3 rounded-full">
                    <FaVenus className="text-2xl text-white" />
                    <h2 className="text-2xl font-bold text-white">Women's Mental Health Support</h2>
                  </div>
                </div>
                <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
                  Specialized support addressing challenges unique to women's mental health, using evidence-based therapeutic approaches.
                </p>
                <div className="space-y-6">
                  {femaleProblems.map((problem) => (
                    <ProblemCard key={problem.id} problem={problem} genderColor="pink" />
                  ))}
                </div>
              </motion.div>
            </GenderProtectedSection>

            {/* Male Support Section */}
            <GenderProtectedSection allowedGenders={['Male']} showFallback={false}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-16"
              >
                <div className="flex items-center justify-center mb-8">
                  <div className="flex items-center space-x-3 bg-gradient-to-br from-purple-600 to-purple-800 px-6 py-3 rounded-full">
                    <FaMars className="text-2xl text-white" />
                    <h2 className="text-2xl font-bold text-white">Men's Mental Health Support</h2>
                  </div>
                </div>
                <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
                  Targeted support for men's mental health challenges, using clinically proven therapeutic methods and interventions.
                </p>
                <div className="space-y-6">
                  {maleProblems.map((problem) => (
                    <ProblemCard key={problem.id} problem={problem} genderColor="blue" />
                  ))}
                </div>
              </motion.div>
            </GenderProtectedSection>

            {/* Privacy Notice */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl border-2 border-purple-200 p-8 text-center shadow-xl"
            >
              <FaShieldAlt className="text-4xl text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Privacy & Confidentiality</h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                All interventions follow ethical mental health practices. Your data is protected, and all sessions are confidential.
                We use evidence-based approaches validated by psychological research and real-world digital mental health platforms.
              </p>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default MentalHealthSupport;
