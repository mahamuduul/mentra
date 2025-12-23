import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { 
  FaUser, 
  FaSignOutAlt, 
  FaBrain, 
  FaHeart, 
  FaChartLine, 
  FaFire, 
  FaTrophy,
  FaCalendarCheck,
  FaSmile,
  FaBed,
  FaBook,
  FaGamepad,
  FaUsers,
  FaDumbbell,
  FaMedal,
  FaStar,
  FaArrowRight,
  FaCheckCircle,
  FaClock,
  FaBullseye,
  FaBatteryHalf,
  FaShieldAlt,
  FaExclamationTriangle,
  FaDollarSign
} from 'react-icons/fa';
import { MdTrendingUp, MdTrendingDown } from 'react-icons/md';

const Dashboard = () => {
  const { user, currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [toolsData, setToolsData] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const fetchToolsData = async () => {
    try {
      const token = await currentUser.getIdToken();
      const response = await fetch('http://localhost:5000/api/tools', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setToolsData(data);
      }
    } catch (error) {
      console.error('Error fetching tools data:', error);
    }
  };

  useEffect(() => {
    if (currentUser && user?.gender === 'Male') {
      fetchToolsData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, user]);

  const handleLogout = async () => {
    await logout();
  };

  // Mock data - In production, this would come from API
  const [dashboardData] = useState({
    streak: 7,
    totalActivities: 24,
    moodScore: 7.5,
    sleepAverage: 7.2,
    weeklyProgress: 85,
    achievements: [
      { id: 1, title: '7 Day Streak', icon: FaFire, color: 'from-purple-600 to-purple-800', earned: true },
      { id: 2, title: 'Early Bird', icon: FaClock, color: 'from-purple-600 to-purple-800', earned: true },
      { id: 3, title: 'Mood Master', icon: FaSmile, color: 'from-purple-600 to-purple-800', earned: false },
      { id: 4, title: 'Community Hero', icon: FaUsers, color: 'from-purple-600 to-purple-800', earned: true },
    ],
    recentActivities: [
      { id: 1, type: 'mood', title: 'Logged mood', time: '2 hours ago', icon: FaSmile },
      { id: 2, type: 'journal', title: 'Created journal entry', time: '5 hours ago', icon: FaBook },
      { id: 3, type: 'game', title: 'Completed memory game', time: 'Yesterday', icon: FaGamepad },
      { id: 4, type: 'sleep', title: 'Logged 8 hours sleep', time: 'Yesterday', icon: FaBed },
    ],
    weeklyMoodData: [
      { day: 'Mon', mood: 7 },
      { day: 'Tue', mood: 6 },
      { day: 'Wed', mood: 8 },
      { day: 'Thu', mood: 7 },
      { day: 'Fri', mood: 9 },
      { day: 'Sat', mood: 8 },
      { day: 'Sun', mood: 7.5 },
    ],
    recommendations: [
      { id: 1, title: 'Morning Meditation', desc: 'Start your day with calm', icon: FaBrain, link: '/quick-calm', color: 'from-purple-600 to-purple-800' },
      { id: 2, title: 'Journal Entry', desc: 'Reflect on your thoughts', icon: FaBook, link: '/journal', color: 'from-purple-600 to-purple-800' },
      { id: 3, title: 'Community Chat', desc: 'Connect with others', icon: FaUsers, link: '/community', color: 'from-purple-600 to-purple-800' },
      { id: 4, title: 'Memory Game', desc: 'Train your brain', icon: FaGamepad, link: '/games', color: 'from-purple-600 to-purple-800' },
    ],
    goals: [
      { id: 1, title: 'Meditate daily', progress: 70, total: 7, current: 5 },
      { id: 2, title: 'Journal 3x/week', progress: 100, total: 3, current: 3 },
      { id: 3, title: 'Sleep 8 hours', progress: 85, total: 7, current: 6 },
    ]
  });

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getMoodLabel = (score) => {
    if (score >= 8) return 'Great';
    if (score >= 6) return 'Good';
    if (score >= 4) return 'Okay';
    return 'Low';
  };

  const getMoodTrend = () => {
    const recent = dashboardData.weeklyMoodData.slice(-3);
    const avg = recent.reduce((sum, d) => sum + d.mood, 0) / recent.length;
    const prevAvg = dashboardData.weeklyMoodData.slice(-6, -3).reduce((sum, d) => sum + d.mood, 0) / 3;
    return avg > prevAvg ? 'up' : 'down';
  };

  return (
    <div className="min-h-screen bg-white relative">
      <Helmet>
        <title>Dashboard - Mentra</title>
        <meta name="description" content="Your personal mental health dashboard. Track your mood, view achievements, and access personalized wellness recommendations." />
      </Helmet>
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-purple-800 border-b border-purple-500 sticky top-0 z-10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <FaBrain className="text-2xl text-white" />
              <h1 className="text-xl font-bold text-white">Mentra Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-8 w-8 rounded-full border-2 border-white"
                  />
                ) : (
                  <FaUser className="h-8 w-8 p-2 bg-white/20 rounded-full text-white border-2 border-white" />
                )}
                <span className="text-sm font-medium text-white">
                  {user?.name || 'User'}
                </span>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-white hover:bg-white/20 rounded-lg transition-colors"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {getGreeting()}, {user?.name?.split(' ')[0] || 'there'}!
          </h2>
          <p className="text-gray-600">
            {currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Stats & Progress */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Streak Card */}
              <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-4 shadow-lg border-2 border-purple-200">
                <div className="flex items-center justify-between mb-2">
                  <FaFire className="text-3xl text-white" />
                  <div className="text-right">
                    <p className="text-white/90 text-xs font-medium">Streak</p>
                    <p className="text-2xl font-bold text-white">{dashboardData.streak}</p>
                  </div>
                </div>
                <p className="text-white/90 text-xs">Days in a row!</p>
              </div>

              {/* Mood Score */}
              <div className="bg-white rounded-xl p-4 border-2 border-purple-200 hover:border-purple-500 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <FaSmile className="text-3xl text-yellow-400" />
                  <div className="text-right">
                    <p className="text-gray-600 text-xs font-medium">Avg Mood</p>
                    <p className="text-2xl font-bold text-gray-900 flex items-center gap-1">
                      {dashboardData.moodScore}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  {getMoodTrend() === 'up' ? (
                    <><MdTrendingUp className="text-green-400" /> Improving</>
                  ) : (
                    <><MdTrendingDown className="text-orange-400" /> Declining</>
                  )}
                </div>
              </div>

              {/* Activities */}
              <div className="bg-white rounded-xl p-4 border-2 border-purple-200 hover:border-purple-500 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <FaCalendarCheck className="text-3xl text-blue-400" />
                  <div className="text-right">
                    <p className="text-gray-600 text-xs font-medium">Activities</p>
                    <p className="text-2xl font-bold text-gray-900">{dashboardData.totalActivities}</p>
                  </div>
                </div>
                <p className="text-gray-600 text-xs">This month</p>
              </div>

              {/* Sleep */}
              <div className="bg-white rounded-xl p-4 border-2 border-purple-200 hover:border-purple-500 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <FaBed className="text-3xl text-purple-400" />
                  <div className="text-right">
                    <p className="text-gray-600 text-xs font-medium">Sleep Avg</p>
                    <p className="text-2xl font-bold text-gray-900">{dashboardData.sleepAverage}h</p>
                  </div>
                </div>
                <p className="text-gray-600 text-xs">Per night</p>
              </div>
            </div>

            {/* Weekly Mood Chart */}
            <div className="bg-white rounded-xl p-6 border-2 border-purple-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Weekly Mood Trend</h3>
              <div className="flex items-end justify-between h-48 gap-2">
                {dashboardData.weeklyMoodData.map((data, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-purple-900/50 rounded-t-lg relative overflow-hidden" style={{ height: `${(data.mood / 10) * 100}%` }}>
                      <div className="absolute inset-0 bg-gradient-to-t from-purple-500 to-purple-300 animate-pulse"></div>
                      <div className="absolute inset-0 flex items-start justify-center pt-1">
                        <span className="text-xs font-bold text-white">{data.mood}</span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-600 font-medium">{data.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Goals Progress */}
            <div className="bg-white rounded-xl p-6 border-2 border-purple-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Weekly Goals</h3>
                <span className="text-sm text-gray-600">{dashboardData.weeklyProgress}% Complete</span>
              </div>
              <div className="space-y-4">
                {dashboardData.goals.map((goal) => (
                  <div key={goal.id}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-900 font-medium text-sm">{goal.title}</span>
                      <span className="text-gray-600 text-sm">{goal.current}/{goal.total}</span>
                    </div>
                    <div className="h-2 bg-purple-900/50 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full transition-all duration-500"
                        style={{ width: `${goal.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Male Mental Health Tools Summary */}
            {user?.gender === 'Male' && toolsData.length > 0 && (
              <div className="bg-white rounded-xl p-6 border-2 border-purple-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Mental Health Tools</h3>
                  <Link 
                    to="/male-mental-health-tools"
                    className="text-sm text-purple-600 hover:text-gray-900 transition-colors flex items-center gap-1"
                  >
                    View All <FaArrowRight className="text-xs" />
                  </Link>
                </div>
                <div className="space-y-3">
                  {/* Goals Summary */}
                  {toolsData.filter(t => t.toolType === 'goal-breakdown').length > 0 && (
                    <div className="p-3 bg-purple-50 rounded-lg border-2 border-purple-200">
                      <div className="flex items-center gap-3">
                        <FaBullseye className="text-2xl text-purple-600" />
                        <div className="flex-1">
                          <p className="text-gray-900 font-medium text-sm">Career Goals</p>
                          <p className="text-gray-600 text-xs">
                            {toolsData.filter(t => t.toolType === 'goal-breakdown').length} active {toolsData.filter(t => t.toolType === 'goal-breakdown').length === 1 ? 'goal' : 'goals'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Burnout Check-ins */}
                  {toolsData.filter(t => t.toolType === 'burnout-checkin').length > 0 && (
                    <div className="p-3 bg-purple-50 rounded-lg border-2 border-purple-200">
                      <div className="flex items-center gap-3">
                        <FaBatteryHalf className="text-2xl text-purple-600" />
                        <div className="flex-1">
                          <p className="text-gray-900 font-medium text-sm">Burnout Tracking</p>
                          <p className="text-gray-600 text-xs">
                            {toolsData.filter(t => t.toolType === 'burnout-checkin').length} check-ins recorded
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Time Management */}
                  {toolsData.filter(t => t.toolType === 'time-management').length > 0 && (
                    <div className="p-3 bg-purple-50 rounded-lg border-2 border-purple-200">
                      <div className="flex items-center gap-3">
                        <FaClock className="text-2xl text-purple-600" />
                        <div className="flex-1">
                          <p className="text-gray-900 font-medium text-sm">Time Management</p>
                          <p className="text-gray-600 text-xs">
                            {toolsData.filter(t => t.toolType === 'time-management').length} {toolsData.filter(t => t.toolType === 'time-management').length === 1 ? 'task' : 'tasks'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* CBT Reframing */}
                  {toolsData.filter(t => t.toolType === 'cbt-reframing').length > 0 && (
                    <div className="p-3 bg-purple-50 rounded-lg border-2 border-purple-200">
                      <div className="flex items-center gap-3">
                        <FaBrain className="text-2xl text-purple-600" />
                        <div className="flex-1">
                          <p className="text-gray-900 font-medium text-sm">CBT Worksheets</p>
                          <p className="text-gray-600 text-xs">
                            {toolsData.filter(t => t.toolType === 'cbt-reframing').length} worksheets completed
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Financial Stress Tools */}
                  {toolsData.filter(t => ['financial-journal', 'problem-solving', 'budget-awareness'].includes(t.toolType)).length > 0 && (
                    <div className="p-3 bg-purple-50 rounded-lg border-2 border-purple-200">
                      <div className="flex items-center gap-3">
                        <FaDollarSign className="text-2xl text-purple-600" />
                        <div className="flex-1">
                          <p className="text-gray-900 font-medium text-sm">Financial Tools</p>
                          <p className="text-gray-600 text-xs">
                            {toolsData.filter(t => ['financial-journal', 'problem-solving', 'budget-awareness'].includes(t.toolType)).length} entries
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Anger Management Tools */}
                  {toolsData.filter(t => ['trigger-tracker', 'anger-cbt', 'cooling-timer'].includes(t.toolType)).length > 0 && (
                    <div className="p-3 bg-purple-50 rounded-lg border-2 border-purple-200">
                      <div className="flex items-center gap-3">
                        <FaFire className="text-2xl text-purple-600" />
                        <div className="flex-1">
                          <p className="text-gray-900 font-medium text-sm">Anger Management</p>
                          <p className="text-gray-600 text-xs">
                            {toolsData.filter(t => ['trigger-tracker', 'anger-cbt', 'cooling-timer'].includes(t.toolType)).length} tools used
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Total Tools Usage */}
                  <div className="p-3 bg-purple-50 rounded-lg border-2 border-purple-200">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{toolsData.length}</p>
                      <p className="text-gray-600 text-xs">Total tool entries</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Female Mental Health Tools Summary */}
            {(user?.gender === 'Female' || user?.gender === 'female' || user?.profile?.gender === 'female') && toolsData.length > 0 && (
              <div className="bg-white rounded-xl p-6 border-2 border-purple-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Mental Health Tools</h3>
                  <Link 
                    to="/female-tools"
                    className="text-sm text-purple-600 hover:text-gray-900 transition-colors flex items-center gap-1"
                  >
                    View All <FaArrowRight className="text-xs" />
                  </Link>
                </div>
                <div className="space-y-3">
                  {/* Harassment Support */}
                  {toolsData.filter(t => ['harassment-report', 'safety-plan', 'counselor-ticket', 'grounding-exercise'].includes(t.toolType)).length > 0 && (
                    <div className="p-3 bg-purple-50 rounded-lg border-2 border-purple-200">
                      <div className="flex items-center gap-3">
                        <FaShieldAlt className="text-2xl text-purple-600" />
                        <div className="flex-1">
                          <p className="text-gray-900 font-medium text-sm">Harassment Support</p>
                          <p className="text-gray-600 text-xs">
                            {toolsData.filter(t => ['harassment-report', 'safety-plan', 'counselor-ticket', 'grounding-exercise'].includes(t.toolType)).length} tools used
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Pressure Management */}
                  {toolsData.filter(t => ['cbt-thought-record', 'goal-boundary', 'peer-support', 'daily-checkin'].includes(t.toolType)).length > 0 && (
                    <div className="p-3 bg-purple-50 rounded-lg border-2 border-purple-200">
                      <div className="flex items-center gap-3">
                        <FaBrain className="text-2xl text-purple-600" />
                        <div className="flex-1">
                          <p className="text-gray-900 font-medium text-sm">Pressure Management</p>
                          <p className="text-gray-600 text-xs">
                            {toolsData.filter(t => ['cbt-thought-record', 'goal-boundary', 'peer-support', 'daily-checkin'].includes(t.toolType)).length} entries
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Safety Tools */}
                  {toolsData.filter(t => ['emergency-resources', 'trusted-contact', 'risk-assessment', 'safety-education'].includes(t.toolType)).length > 0 && (
                    <div className="p-3 bg-purple-50 rounded-lg border-2 border-purple-200">
                      <div className="flex items-center gap-3">
                        <FaExclamationTriangle className="text-2xl text-purple-600" />
                        <div className="flex-1">
                          <p className="text-gray-900 font-medium text-sm">Safety Resources</p>
                          <p className="text-gray-600 text-xs">
                            {toolsData.filter(t => ['emergency-resources', 'trusted-contact', 'risk-assessment', 'safety-education'].includes(t.toolType)).length} tools accessed
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Mental Stress Tools */}
                  {toolsData.filter(t => ['breathing-meditation', 'mood-tracker', 'stress-assessment', 'exercise-library'].includes(t.toolType)).length > 0 && (
                    <div className="p-3 bg-purple-50 rounded-lg border-2 border-purple-200">
                      <div className="flex items-center gap-3">
                        <FaHeart className="text-2xl text-purple-600" />
                        <div className="flex-1">
                          <p className="text-gray-900 font-medium text-sm">Stress Management</p>
                          <p className="text-gray-600 text-xs">
                            {toolsData.filter(t => ['breathing-meditation', 'mood-tracker', 'stress-assessment', 'exercise-library'].includes(t.toolType)).length} exercises
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Total Tools Usage */}
                  <div className="p-3 bg-purple-50 rounded-lg border-2 border-purple-200">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{toolsData.length}</p>
                      <p className="text-gray-600 text-xs">Total tool entries</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Activity */}
            <div className="bg-white rounded-xl p-6 border-2 border-purple-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {dashboardData.recentActivities.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <div key={activity.id} className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border-2 border-purple-200">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                        <Icon className="text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-900 font-medium text-sm">{activity.title}</p>
                        <p className="text-purple-600 text-xs">{activity.time}</p>
                      </div>
                      <FaCheckCircle className="text-green-400" />
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column - Recommendations & Achievements */}
          <div className="space-y-6">
            
            {/* Achievements */}
            <div className="bg-white rounded-xl p-6 border-2 border-purple-200">
              <div className="flex items-center gap-2 mb-4">
                <FaTrophy className="text-yellow-400 text-xl" />
                <h3 className="text-lg font-bold text-gray-900">Achievements</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {dashboardData.achievements.map((achievement) => {
                  const Icon = achievement.icon;
                  return (
                    <div 
                      key={achievement.id}
                      className={`p-4 rounded-xl border ${
                        achievement.earned 
                          ? 'bg-gradient-to-br ' + achievement.color + ' border-white/20 shadow-lg'
                          : 'bg-purple-900/30 border-purple-700/30 opacity-50'
                      } flex flex-col items-center text-center transition-all hover:scale-105`}
                    >
                      <Icon className="text-2xl text-white mb-2" />
                      <span className="text-xs text-white font-medium">{achievement.title}</span>
                      {achievement.earned && <FaMedal className="text-yellow-300 text-xs mt-1" />}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-xl p-6 border-2 border-purple-200">
              <div className="flex items-center gap-2 mb-4">
                <FaStar className="text-yellow-400 text-xl" />
                <h3 className="text-lg font-bold text-gray-900">Recommended for You</h3>
              </div>
              <div className="space-y-3">
                {dashboardData.recommendations.map((rec) => (
                  <button
                    key={rec.id}
                    onClick={() => navigate(rec.link)}
                    className="w-full text-left p-4 bg-purple-50 rounded-lg border-2 border-purple-200 hover:border-purple-500 hover:bg-purple-100 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{rec.icon}</span>
                      <div className="flex-1">
                        <p className="text-gray-900 font-medium text-sm">{rec.title}</p>
                        <p className="text-purple-600 text-xs">{rec.desc}</p>
                      </div>
                      <FaArrowRight className="text-purple-600 group-hover:text-gray-900 group-hover:translate-x-1 transition-all" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-6 shadow-2xl shadow-purple-500/50 border border-purple-400/30">
              <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button 
                  onClick={() => navigate('/mood-tracker')}
                  className="w-full px-4 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg font-medium text-sm transition-all border border-white/20 flex items-center justify-between"
                >
                  <span>Log Today's Mood</span>
                  <FaSmile />
                </button>
                <button 
                  onClick={() => navigate('/journal')}
                  className="w-full px-4 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg font-medium text-sm transition-all border border-white/20 flex items-center justify-between"
                >
                  <span>Write Journal Entry</span>
                  <FaBook />
                </button>
                <button 
                  onClick={() => navigate('/games')}
                  className="w-full px-4 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg font-medium text-sm transition-all border border-white/20 flex items-center justify-between"
                >
                  <span>Play Brain Games</span>
                  <FaGamepad />
                </button>
              </div>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
};

export default Dashboard;
