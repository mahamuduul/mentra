import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaGoogle, FaBrain } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import InputField from '../components/ui/InputField';
import AuthButton from '../components/ui/AuthButton';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login, loginWithGoogle, isLoading } = useAuth();
  const emailRef = useRef();
  const passwordRef = useRef();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Focus on first error field
      if (errors.email) emailRef.current?.focus();
      else if (errors.password) passwordRef.current?.focus();
      return;
    }

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      navigate('/'); // Redirect to home, survey modal will show if needed
    } else {
      setErrors({ submit: result.error });
    }
  };

  const handleGoogleLogin = async () => {
    const result = await loginWithGoogle();
    
    if (result.success) {
      navigate('/'); // Redirect to home, survey modal will show if needed
    } else {
      setErrors({ submit: result.error });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (errors.submit) {
      setErrors(prev => ({ ...prev, submit: '' }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full space-y-8"
      >
        {/* Header */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-purple-700 shadow-lg shadow-purple-500/50"
          >
            <FaBrain className="h-8 w-8 text-white" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-3xl font-bold text-gray-900 dark:text-white"
          >
            Welcome back
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-2 text-gray-600 dark:text-gray-300"
          >
            Sign in to continue your mental wellness journey
          </motion.p>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 space-y-6"
        >
          {/* Google Login */}
          <AuthButton
            variant="google"
            icon={FaGoogle}
            onClick={handleGoogleLogin}
            isLoading={isLoading}
            disabled={isLoading}
          >
            Continue with Google
          </AuthButton>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                Or continue with email
              </span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField
              ref={emailRef}
              name="email"
              type="email"
              label="Email Address"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              icon={FaEnvelope}
              error={errors.email}
            />

            <InputField
              ref={passwordRef}
              name="password"
              label="Password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              icon={FaLock}
              error={errors.password}
              showPasswordToggle
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
            />

            {/* Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 dark:border-gray-600 rounded"
                />
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                  Remember me
                </span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/20 border border-red-400/30 rounded-lg p-3"
              >
                <p className="text-sm text-red-200 flex items-center gap-2">
                  <span>⚠️</span> {errors.submit}
                </p>
              </motion.div>
            )}

            {/* Submit Button */}
            <AuthButton
              type="submit"
              variant="primary"
              isLoading={isLoading}
              disabled={isLoading}
            >
              Sign In
            </AuthButton>
          </form>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-300">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Terms */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-xs text-gray-500 dark:text-gray-400"
        >
          By signing in, you agree to our{' '}
          <Link to="/terms" className="text-purple-600 dark:text-purple-400 hover:underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link to="/privacy" className="text-purple-600 dark:text-purple-400 hover:underline">
            Privacy Policy
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Login;
