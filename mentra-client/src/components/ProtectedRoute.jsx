import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FaLock, FaSpinner } from 'react-icons/fa';

const ProtectedRoute = ({ children, requireAuth = true }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="text-blue-500"
        >
          <FaSpinner className="text-4xl" />
        </motion.div>
      </div>
    );
  }

  // If route requires authentication but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return (
      <Navigate 
        to="/login" 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  // If route is for unauthenticated users only (login/register) but user is authenticated
  if (!requireAuth && isAuthenticated) {
    // Redirect to home page (survey modal will show there if needed)
    const from = location.state?.from || '/';
    return <Navigate to={from} replace />;
  }

  // Allow all authenticated routes - survey modal will show on home page
  // Users can access live-chat and other pages even if survey not completed

  return children;
};

// Component for showing unauthorized access message
export const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md mx-auto"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20 mb-6"
        >
          <FaLock className="h-8 w-8 text-red-500" />
        </motion.div>
        
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Access Denied
        </h1>
        
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          You need to be signed in to access this page. Please log in to continue your mental wellness journey.
        </p>
        
        <div className="space-y-3">
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="/login"
            className="inline-block w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
          </motion.a>
          
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="/register"
            className="inline-block w-full px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
          >
            Create Account
          </motion.a>
        </div>
      </motion.div>
    </div>
  );
};

export default ProtectedRoute;
