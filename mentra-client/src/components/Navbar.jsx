import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaBrain, FaBars, FaTimes, FaUser, FaSignOutAlt, FaCalendarCheck } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Mood Tracker', path: '/mood-tracker', auth: true },
    { name: 'Journal', path: '/journal', auth: true },
    { name: 'Community', path: '/community', auth: true },
    { name: 'Live Chat', path: '/live-chat', auth: true },
    { name: 'Resources', path: '/resources' },
    { name: 'About', path: '/about' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Clickable to Home */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 group cursor-pointer"
            aria-label="Go to homepage"
          >
            <FaBrain className="text-3xl text-purple-300 group-hover:text-purple-200 transition-colors duration-200" />
            <span className="text-2xl font-bold text-white group-hover:text-purple-100 transition-colors duration-200">
              Mentra
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              if (item.auth && !isAuthenticated) return null;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive(item.path)
                      ? 'bg-primary-700 text-white'
                      : 'text-purple-200 hover:bg-primary-800 hover:text-white'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Right Section: Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {isLoading ? (
              <div className="h-10 w-10 rounded-full border-2 border-purple-300 border-t-transparent animate-spin"></div>
            ) : isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary-800 hover:bg-primary-700 text-white rounded-full transition-all"
                >
                  <img 
                    src={user?.avatar || '/default-avatar.png'} 
                    alt={user?.name}
                    className="w-8 h-8 rounded-full border-2 border-purple-300"
                  />
                  <span className="font-medium">{user?.name}</span>
                </button>

                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl py-2 border border-gray-200">
                    <Link
                      to="/profile"
                      className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-purple-50 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <FaUser className="text-primary-600" />
                      <span>Profile</span>
                    </Link>
                    <Link
                      to="/dashboard"
                      className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-purple-50 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <FaBrain className="text-primary-600" />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      to="/my-bookings"
                      className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-purple-50 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <FaCalendarCheck className="text-primary-600" />
                      <span>My Bookings</span>
                    </Link>
                    <hr className="my-2" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <FaSignOutAlt />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-6 py-2 text-purple-200 hover:text-white font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2 bg-white text-primary-700 rounded-full font-medium hover:bg-purple-50 transition-all shadow-lg hover:shadow-xl"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-purple-200 hover:text-white transition-colors"
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-primary-800 border-t border-primary-700">
          <div className="px-4 py-4 space-y-2">
            {navItems.map((item) => {
              if (item.auth && !isAuthenticated) return null;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive(item.path)
                      ? 'bg-primary-700 text-white'
                      : 'text-purple-200 hover:bg-primary-700 hover:text-white'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              );
            })}

            {/* Mobile Auth Buttons */}
            <div className="pt-4 border-t border-primary-700 space-y-2">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center space-x-3 px-4 py-3 text-white">
                    <img 
                      src={user?.avatar || '/default-avatar.png'} 
                      alt={user?.name}
                      className="w-10 h-10 rounded-full border-2 border-purple-300"
                    />
                    <span className="font-medium">{user?.name}</span>
                  </div>
                  <Link
                    to="/dashboard"
                    className="block px-4 py-3 text-purple-200 hover:bg-primary-700 hover:text-white rounded-lg transition-all"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/my-bookings"
                    className="block px-4 py-3 text-purple-200 hover:bg-primary-700 hover:text-white rounded-lg transition-all"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Bookings
                  </Link>
                  <Link
                    to="/profile"
                    className="block px-4 py-3 text-purple-200 hover:bg-primary-700 hover:text-white rounded-lg transition-all"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 text-red-400 hover:bg-red-900/20 rounded-lg transition-all"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-4 py-3 text-center bg-primary-700 text-white rounded-lg font-medium hover:bg-primary-600 transition-all"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="block px-4 py-3 text-center bg-white text-primary-700 rounded-lg font-medium hover:bg-purple-50 transition-all"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
