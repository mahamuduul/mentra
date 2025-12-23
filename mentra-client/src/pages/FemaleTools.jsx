import { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { FaShieldAlt, FaUserShield, FaExclamationTriangle, FaBrain } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import {
  // Harassment Issues
  AnonymousReportForm,
  SafetyPlanBuilder,
  SecureCounselorTicket,
  GroundingExercise,
  // Social/Personal Pressure
  CBTThoughtRecord,
  GoalBoundaryPlanner,
  PeerSupportForum,
  DailyCheckIn,
  // Safety Issues
  EmergencyResources,
  TrustedContactAlert,
  RiskAssessment,
  SafetyEducation,
  // Mental Stress
  BreathingMeditation,
  MoodTracker,
  StressAssessment,
  ExerciseLibrary
} from '../components/FemaleTools';

const FemaleTools = () => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTool, setSelectedTool] = useState(null);

  const categories = [
    {
      id: 'harassment',
      name: 'Harassment Issues',
      icon: FaShieldAlt,
      gradient: 'from-purple-600 to-purple-800',
      border: 'border-purple-200',
      hover: 'hover:bg-white hover:border-purple-500',
      description: 'Support for dealing with harassment and abuse',
      tools: [
        { id: 'harassment-report', name: 'Anonymous Report Form', component: AnonymousReportForm },
        { id: 'safety-plan', name: 'Safety Plan Builder', component: SafetyPlanBuilder },
        { id: 'counselor-ticket', name: 'Secure Counselor Chat', component: SecureCounselorTicket },
        { id: 'grounding-exercise', name: 'Grounding Exercise Tool', component: GroundingExercise }
      ]
    },
    {
      id: 'pressure',
      name: 'Social/Personal Pressure',
      icon: FaUserShield,
      gradient: 'from-purple-600 to-purple-800',
      border: 'border-purple-200',
      hover: 'hover:bg-white hover:border-purple-500',
      description: 'Help managing societal and family expectations',
      tools: [
        { id: 'cbt-thought-record', name: 'CBT Thought Record', component: CBTThoughtRecord },
        { id: 'goal-boundary', name: 'Goal & Boundary Planner', component: GoalBoundaryPlanner },
        { id: 'peer-support', name: 'Peer Support Forum', component: PeerSupportForum },
        { id: 'daily-checkin', name: 'Daily Check-in', component: DailyCheckIn }
      ]
    },
    {
      id: 'safety',
      name: 'Safety Issues',
      icon: FaExclamationTriangle,
      gradient: 'from-purple-600 to-purple-800',
      border: 'border-purple-200',
      hover: 'hover:bg-white hover:border-purple-500',
      description: 'Resources for personal safety concerns',
      tools: [
        { id: 'emergency-resources', name: 'Emergency Resource Page', component: EmergencyResources },
        { id: 'trusted-contact', name: 'Trusted Contact Alert', component: TrustedContactAlert },
        { id: 'risk-assessment', name: 'Risk Assessment Quiz', component: RiskAssessment },
        { id: 'safety-education', name: 'Safety Education Library', component: SafetyEducation }
      ]
    },
    {
      id: 'mental-stress',
      name: 'Mental Stress',
      icon: FaBrain,
      gradient: 'from-purple-600 to-purple-800',
      border: 'border-purple-200',
      hover: 'hover:bg-white hover:border-purple-500',
      description: 'Tools for anxiety and emotional stress',
      tools: [
        { id: 'breathing-meditation', name: 'Breathing & Meditation', component: BreathingMeditation },
        { id: 'mood-tracker', name: 'Mood Tracker', component: MoodTracker },
        { id: 'stress-assessment', name: 'Stress Self-Assessment', component: StressAssessment },
        { id: 'exercise-library', name: 'Exercise Library', component: ExerciseLibrary }
      ]
    }
  ];

  const ToolComponent = selectedTool?.component;

  if (selectedTool) {
    return (
      <div className="min-h-screen bg-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <button
            onClick={() => setSelectedTool(null)}
            className="mb-6 text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-2"
          >
            Back to Tools
          </button>
          <ToolComponent />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <Helmet>
        <title>Women's Mental Health Tools - Mentra</title>
        <meta name="description" content="Specialized support tools designed for women's unique mental health challenges including safety, harassment, and social pressure issues." />
      </Helmet>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-4">
            Female Mental Health Tools
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Specialized support tools designed for women's unique mental health challenges
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-xl transition-all"
              >
                <div className={`bg-gradient-to-r ${category.gradient} p-6 text-white`}>
                  <div className="flex items-center gap-4 mb-3">
                    <Icon className="text-4xl" />
                    <h2 className="text-2xl font-bold">{category.name}</h2>
                  </div>
                  <p className="text-white/90">{category.description}</p>
                </div>

                <div className="p-6 space-y-3">
                  {category.tools.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => setSelectedTool(tool)}
                      className={`w-full text-left p-4 rounded-lg border-2 ${category.border} ${category.hover} transition-all`}
                    >
                      <h3 className="font-semibold text-gray-800">{tool.name}</h3>
                    </button>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FemaleTools;
