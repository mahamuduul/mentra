import { Link } from 'react-router-dom';
import { FaBrain, FaHeart, FaSmile, FaArrowRight, FaComments } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import heroImage from '../assets/hero.png';

const AnimatedWaves = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Multiple wave layers for depth */}
      <svg className="absolute bottom-0 left-0 right-0 w-full h-full" viewBox="0 0 1440 320" preserveAspectRatio="xMidYMax slice">
        {/* Wave 1 - Darkest */}
        <path
          fill="rgba(107, 33, 168, 0.3)"
          d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          className="animate-wave"
          style={{ animationDuration: '25s', animationDelay: '0s' }}
        />
        
        {/* Wave 2 - Medium */}
        <path
          fill="rgba(124, 58, 237, 0.2)"
          d="M0,224L48,208C96,192,192,160,288,149.3C384,139,480,149,576,170.7C672,192,768,224,864,224C960,224,1056,192,1152,165.3C1248,139,1344,117,1392,106.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          className="animate-wave"
          style={{ animationDuration: '20s', animationDelay: '3s' }}
        />
        
        {/* Wave 3 - Lightest */}
        <path
          fill="rgba(168, 85, 247, 0.15)"
          d="M0,160L48,181.3C96,203,192,245,288,240C384,235,480,181,576,176C672,171,768,213,864,213.3C960,213,1056,171,1152,154.7C1248,139,1344,149,1392,154.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          className="animate-wave"
          style={{ animationDuration: '30s', animationDelay: '6s' }}
        />
      </svg>

      {/* Floating particles - slower animation */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-2 h-2 bg-purple-300/40 rounded-full animate-float" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-purple-400/30 rounded-full animate-float" style={{ animationDelay: '3s' }}></div>
        <div className="absolute bottom-40 left-1/4 w-2 h-2 bg-purple-300/40 rounded-full animate-float" style={{ animationDelay: '6s' }}></div>
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-purple-400/30 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 right-1/4 w-3 h-3 bg-purple-300/40 rounded-full animate-float" style={{ animationDelay: '4s' }}></div>
      </div>
    </div>
  );
};

const NewHero = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 overflow-hidden flex items-center">
      {/* Animated Wave Background */}
      <AnimatedWaves />

      {/* Content Container - Floating on waves */}
      <div className="relative z-10 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Side - Content with floating animation */}
            <div className="text-white space-y-8 animate-fade-in">
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 animate-float">
                <FaHeart className="text-pink-300" />
                <span className="text-sm font-medium">Your Mental Wellness Companion</span>
              </div>

              {/* Main Heading */}
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                  Find Your
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
                    Inner Peace
                  </span>
                </h1>
                <p className="text-xl lg:text-2xl text-purple-200 max-w-xl">
                  Your safe space for mental wellness, guided support, and emotional growth
                </p>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-6">
                <div className="flex items-center space-x-3 bg-white/5 backdrop-blur-sm rounded-lg p-3 hover:bg-white/10 transition-all animate-float" style={{ animationDelay: '0.2s' }}>
                  <div className="p-3 bg-purple-500/30 rounded-lg">
                    <FaBrain className="text-2xl" />
                  </div>
                  <div>
                    <p className="font-semibold">Track Mood</p>
                    <p className="text-sm text-purple-200">Daily insights</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 bg-white/5 backdrop-blur-sm rounded-lg p-3 hover:bg-white/10 transition-all animate-float" style={{ animationDelay: '0.4s' }}>
                  <div className="p-3 bg-purple-500/30 rounded-lg">
                    <FaHeart className="text-2xl" />
                  </div>
                  <div>
                    <p className="font-semibold">Journal</p>
                    <p className="text-sm text-purple-200">Express yourself</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 bg-white/5 backdrop-blur-sm rounded-lg p-3 hover:bg-white/10 transition-all animate-float" style={{ animationDelay: '0.6s' }}>
                  <div className="p-3 bg-purple-500/30 rounded-lg">
                    <FaSmile className="text-2xl" />
                  </div>
                  <div>
                    <p className="font-semibold">Relax</p>
                    <p className="text-sm text-purple-200">Find calm</p>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 pt-4">
                {isAuthenticated ? (
                  <Link
                    to="/dashboard"
                    className="group inline-flex items-center space-x-2 px-8 py-4 bg-white text-primary-700 rounded-full font-semibold text-lg hover:bg-purple-50 transition-all duration-300 hover:scale-105 shadow-xl"
                  >
                    <span>Go to Dashboard</span>
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/register"
                      className="group inline-flex items-center space-x-2 px-8 py-4 bg-white text-primary-700 rounded-full font-semibold text-lg hover:bg-purple-50 transition-all duration-300 hover:scale-105 shadow-xl"
                    >
                      <span>Get Started Free</span>
                      <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                      to="/login"
                      className="inline-flex items-center space-x-2 px-8 py-4 bg-white/10 backdrop-blur-md text-white rounded-full font-semibold text-lg border-2 border-white/30 hover:bg-white/20 transition-all duration-300"
                    >
                      <span>Sign In</span>
                    </Link>
                  </>
                )}
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-8 pt-8 border-t border-white/20">
                <div className="animate-float" style={{ animationDelay: '1s' }}>
                  <p className="text-3xl font-bold">10K+</p>
                  <p className="text-purple-200 text-sm">Active Users</p>
                </div>
                <div className="animate-float" style={{ animationDelay: '1.2s' }}>
                  <p className="text-3xl font-bold">50K+</p>
                  <p className="text-purple-200 text-sm">Journal Entries</p>
                </div>
                <div className="animate-float" style={{ animationDelay: '1.4s' }}>
                  <p className="text-3xl font-bold">95%</p>
                  <p className="text-purple-200 text-sm">Feel Better</p>
                </div>
              </div>
            </div>

            {/* Right Side - Hero Image */}
            <div className="hidden lg:flex justify-end items-center animate-fade-in">
              <div className="relative w-full max-w-sm">
                {/* Decorative Background Shape */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400/30 via-pink-400/30 to-purple-500/30 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] blur-2xl animate-pulse"></div>
                
                {/* Hero Image Container */}
                <div className="relative rounded-t-full rounded-b-3xl overflow-hidden shadow-2xl border-4 border-white/20 backdrop-blur-sm animate-float">
                  {/* Black Filter Overlay */}
                  <div className="absolute inset-0 bg-black/20 z-10"></div>
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/20 via-transparent to-pink-500/20 z-10"></div>
                  
                  {/* Hero Image */}
                  <img 
                    src={heroImage} 
                    alt="Mental Health Support"
                    className="w-full h-auto object-cover"
                  />
                  
                  {/* Decorative Corner Elements */}
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full blur-xl opacity-60 animate-pulse"></div>
                  <div className="absolute -top-4 -left-4 w-32 h-32 bg-gradient-to-br from-purple-400 to-cyan-400 rounded-full blur-xl opacity-60 animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>
                
                <div className="mt-6 text-center">
                  <p className="text-purple-200 text-sm">
                    Your journey to wellness starts here
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-10">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-white/50 rounded-full animate-float"></div>
        </div>
      </div>

      {/* Floating Live Chat Button */}
      {isAuthenticated && (
        <Link
          to="/live-chat"
          className="fixed bottom-8 right-8 z-50 group"
          aria-label="Open Live Chat"
        >
          <div className="relative">
            {/* Pulsing ring animation */}
            <div className="absolute inset-0 bg-purple-500 rounded-full animate-ping opacity-75"></div>
            
            {/* Main button */}
            <div className="relative bg-gradient-to-br from-purple-600 to-purple-800 text-white p-4 rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-110">
              <FaComments className="text-2xl" />
            </div>

            {/* Notification badge */}
            <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-white animate-pulse">
              <span className="sr-only">Live Chat Available</span>
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>

            {/* Tooltip */}
            <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              <div className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap shadow-xl">
                Join Live Chat
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full">
                  <div className="border-8 border-transparent border-l-gray-900"></div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      )}
    </section>
  );
};

export default NewHero;
