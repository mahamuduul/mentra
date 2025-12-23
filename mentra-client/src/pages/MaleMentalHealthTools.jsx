import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FaBriefcase, FaDollarSign, FaFire, FaChevronDown, FaChevronUp, FaSave } from 'react-icons/fa';

// Career Pressure Tools
import GoalBreakdownTool from '../components/MaleTools/GoalBreakdownTool';
import BurnoutCheckIn from '../components/MaleTools/BurnoutCheckIn';
import TimeManagementPlanner from '../components/MaleTools/TimeManagementPlanner';
import CBTReframingWorksheet from '../components/MaleTools/CBTReframingWorksheet';

// Financial Stress Tools
import FinancialStressJournal from '../components/MaleTools/FinancialStressJournal';
import ProblemSolvingWorksheet from '../components/MaleTools/ProblemSolvingWorksheet';
import BudgetAwarenessTool from '../components/MaleTools/BudgetAwarenessTool';
import SupportResourceHub from '../components/MaleTools/SupportResourceHub';

// Anger Management Tools
import TriggerTracker from '../components/MaleTools/TriggerTracker';
import CoolingOffTimer from '../components/MaleTools/CoolingOffTimer';
import AngerCBTWorksheet from '../components/MaleTools/AngerCBTWorksheet';
import ConflictResolutionScripts from '../components/MaleTools/ConflictResolutionScripts';

const MaleMentalHealthTools = () => {
  const [activeCategory, setActiveCategory] = useState('career');
  const [expandedTool, setExpandedTool] = useState(null);

  const categories = [
    {
      id: 'career',
      title: 'Career Pressure',
      icon: FaBriefcase,
      color: 'blue',
      tools: [
        { id: 'goal-breakdown', title: 'Goal Breakdown Tool', component: GoalBreakdownTool },
        { id: 'burnout-checkin', title: 'Burnout & Stress Check-in', component: BurnoutCheckIn },
        { id: 'time-management', title: 'Time Management Planner', component: TimeManagementPlanner },
        { id: 'cbt-reframing', title: 'CBT Reframing Worksheet', component: CBTReframingWorksheet },
      ],
    },
    {
      id: 'financial',
      title: 'Financial Stress',
      icon: FaDollarSign,
      color: 'green',
      tools: [
        { id: 'stress-journal', title: 'Financial Stress Journal', component: FinancialStressJournal },
        { id: 'problem-solving', title: 'Problem-Solving Worksheet', component: ProblemSolvingWorksheet },
        { id: 'budget-tool', title: 'Budget Awareness Tool', component: BudgetAwarenessTool },
        { id: 'resource-hub', title: 'Support Resource Hub', component: SupportResourceHub },
      ],
    },
    {
      id: 'anger',
      title: 'Anger Management',
      icon: FaFire,
      color: 'red',
      tools: [
        { id: 'trigger-tracker', title: 'Trigger Tracker', component: TriggerTracker },
        { id: 'cooling-timer', title: 'Cooling-Off Timer', component: CoolingOffTimer },
        { id: 'anger-cbt', title: 'Anger CBT Worksheet', component: AngerCBTWorksheet },
        { id: 'conflict-scripts', title: 'Conflict Resolution Scripts', component: ConflictResolutionScripts },
      ],
    },
  ];

  const activeTools = categories.find(cat => cat.id === activeCategory)?.tools || [];
  const activeCategoryData = categories.find(cat => cat.id === activeCategory);

  const toggleTool = (toolId) => {
    setExpandedTool(expandedTool === toolId ? null : toolId);
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>Men's Mental Health Tools - Mentra</title>
        <meta name="description" content="Evidence-based mental health tools designed specifically for men. Address career pressure, financial stress, and anger management challenges." />
      </Helmet>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Mental Health Tools
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Evidence-based tools designed specifically for men's mental health challenges.
            All your progress is automatically saved to your dashboard.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => {
                  setActiveCategory(category.id);
                  setExpandedTool(null);
                }}
                className={`flex items-center space-x-3 px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeCategory === category.id
                    ? 'bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-xl'
                    : 'bg-white text-gray-900 border-2 border-purple-200 hover:border-purple-500'
                }`}
              >
                <Icon className="text-xl" />
                <span>{category.title}</span>
              </button>
            );
          })}
        </div>

        {/* Tools List */}
        <div className="max-w-5xl mx-auto space-y-4">
          {activeTools.map((tool, index) => {
            const ToolComponent = tool.component;
            const isExpanded = expandedTool === tool.id;

            return (
              <div
                key={tool.id}
                className="bg-white rounded-xl shadow-xl overflow-hidden border-2 border-purple-200"
              >
                {/* Tool Header */}
                <button
                  onClick={() => toggleTool(tool.id)}
                  className={`w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors ${
                    isExpanded ? 'border-b border-purple-200' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-10 bg-gradient-to-b from-purple-600 to-purple-800 rounded-full"></div>
                    <h3 className="text-xl font-semibold text-gray-900">{tool.title}</h3>
                  </div>
                  {isExpanded ? (
                    <FaChevronUp className="text-gray-400" />
                  ) : (
                    <FaChevronDown className="text-gray-400" />
                  )}
                </button>

                {/* Tool Content */}
                {isExpanded && (
                  <div className="p-6 bg-gray-50">
                    <ToolComponent />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Info Notice */}
        <div className="mt-12 max-w-5xl mx-auto bg-white border-2 border-purple-200 rounded-xl p-6 shadow-xl">
          <h4 className="font-semibold text-gray-900 mb-2">Your Progress is Saved</h4>
          <p className="text-gray-600">
            All data you enter in these tools is automatically saved and can be viewed in your dashboard.
            Your information is private, secure, and only accessible by you.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MaleMentalHealthTools;
