import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBook, FaHeartbeat, FaChartLine, FaShieldAlt, FaBullseye, FaLightbulb } from 'react-icons/fa';
import { MdEmojiEmotions } from 'react-icons/md';
import NewHero from '../components/NewHero';
import QuickCalm from '../components/QuickCalm';
import CrisisSupport from '../components/CrisisSupport';
import SurveyModal from '../components/SurveyModal';
import ExpertsSection from '../components/ExpertsSection';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { needsSurvey, isAuthenticated } = useAuth();
  const [showSurveyModal, setShowSurveyModal] = useState(false);

  // Show survey modal when user needs survey
  useEffect(() => {
    if (isAuthenticated && needsSurvey) {
      setShowSurveyModal(true);
    }
  }, [isAuthenticated, needsSurvey]);

  const features = [
    {
      icon: MdEmojiEmotions,
      title: 'Mood Tracker',
      description: 'Track your emotional journey, identify patterns, and build healthy habits',
      route: '/mood-tracker',
    },
    {
      icon: FaBook,
      title: 'Personal Journal',
      description: 'Express your thoughts and feelings in a private, secure journal',
      route: '/journal',
    },
    {
      icon: FaHeartbeat,
      title: 'Breathing Exercises',
      description: 'Practice guided breathing techniques to calm your mind and reduce anxiety',
      route: '#quick-calm',
    },
    {
      icon: FaChartLine,
      title: 'Progress Dashboard',
      description: 'Visualize your mental wellness journey with detailed analytics and insights',
      route: '/dashboard',
    },
  ];

  const whyMentra = [
    {
      icon: FaShieldAlt,
      title: 'Private & Secure',
      description: 'Your data is encrypted and protected. We never share your personal information.',
    },
    {
      icon: FaBullseye,
      title: 'Evidence-Based',
      description: 'Our tools are based on scientifically proven mental health practices and therapies.',
    },
    {
      icon: FaLightbulb,
      title: 'Easy to Use',
      description: 'Simple, intuitive interface designed for everyone, regardless of technical skills.',
    },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <NewHero />

      {/* Content Sections */}
      <div className="bg-white relative">
        {/* Features Grid */}
        <section className="py-12 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 animate-fade-in">
              <div className="inline-block mb-4">
                <div className="flex items-center justify-center space-x-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium">
                  <span>Mental Wellness Tools</span>
                </div>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
                Your Mental Wellness
                <span className="block text-purple-600">Toolkit</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Comprehensive tools to support your mental health journey every step of the way
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="group bg-white rounded-2xl p-6 border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 cursor-pointer hover:shadow-xl hover:shadow-purple-200 animate-fade-in transform hover:scale-105"
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onClick={() => navigate(feature.route)}
                  >
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                      <Icon className="text-2xl text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {feature.description}
                    </p>
                    <span className="text-purple-600 font-medium group-hover:translate-x-2 inline-block transition-transform">
                      Explore →
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Mental Health Experts Section */}
        <ExpertsSection />

        {/* Quick Calm Breathing Exercise */}
        <div id="quick-calm">
          <QuickCalm />
        </div>

        {/* Why Choose Mentra */}
        <section className="py-12 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
                Why Choose Mentra?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Trusted by thousands for mental wellness support
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {whyMentra.map((item, index) => {
                const Icon = item.icon;
                return (
                <div
                  key={item.title}
                  className="text-center bg-white rounded-2xl p-8 border-2 border-purple-200 hover:border-purple-500 hover:bg-purple-50 transition-all duration-300 animate-fade-in transform hover:scale-105 hover:shadow-xl hover:shadow-purple-200"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center mb-4 mx-auto">
                    <Icon className="text-3xl text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">
                    {item.description}
                  </p>
                </div>
              );
              })}
            </div>
          </div>
        </section>

        {/* Crisis Support Banner */}
        <CrisisSupport />
      </div>

      {/* Survey Modal */}
      <SurveyModal
        isOpen={showSurveyModal}
        onComplete={() => {
          setShowSurveyModal(false);
          // Stay on home page after completing survey
        }}
      />
    </div>
  );
};

export default Home;
