import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaGoogle, FaBrain, FaCheck } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import InputField from '../components/ui/InputField';
import AuthButton from '../components/ui/AuthButton';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    acceptTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { register, loginWithGoogle, isLoading } = useAuth();
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase and number';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.gender) {
      newErrors.gender = 'Please select your gender';
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Focus on first error field
      if (errors.name) nameRef.current?.focus();
      else if (errors.email) emailRef.current?.focus();
      else if (errors.password) passwordRef.current?.focus();
      else if (errors.confirmPassword) confirmPasswordRef.current?.focus();
      return;
    }

    const result = await register(formData.name, formData.email, formData.password, formData.gender);
    
    if (result.success) {
      navigate('/'); // Redirect to home, survey modal will show
    } else {
      setErrors({ submit: result.error });
    }
  };

  const handleGoogleSignup = async () => {
    const result = await loginWithGoogle();
    
    if (result.success) {
      navigate('/'); // Redirect to home, survey modal will show
    } else {
      setErrors({ submit: result.error });
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (errors.submit) {
      setErrors(prev => ({ ...prev, submit: '' }));
    }
  };

  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const strengthColors = ['bg-red-500', 'bg-red-400', 'bg-yellow-500', 'bg-yellow-400', 'bg-green-400', 'bg-green-500'];
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];

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
            Join Mentra
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-2 text-gray-600 dark:text-gray-300"
          >
            Start your mental wellness journey today
          </motion.p>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 space-y-6"
        >
          {/* Google Signup */}
          <AuthButton
            variant="google"
            icon={FaGoogle}
            onClick={handleGoogleSignup}
            isLoading={isLoading}
            disabled={isLoading}
          >
            Sign up with Google
          </AuthButton>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                Or create account with email
              </span>
            </div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField
              ref={nameRef}
              name="name"
              type="text"
              label="Full Name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleInputChange}
              icon={FaUser}
              error={errors.name}
            />

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

            {/* Gender Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Gender *
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label
                  className={`flex items-center justify-center gap-2 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.gender === 'Male'
                      ? 'border-purple-500 bg-purple-500/20 text-purple-900 dark:text-white font-semibold'
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-gray-600'
                  }`}
                >
                  <input
                    type="radio"
                    name="gender"
                    value="Male"
                    checked={formData.gender === 'Male'}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <span className="font-medium">Male</span>
                </label>
                <label
                  className={`flex items-center justify-center gap-2 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.gender === 'Female'
                      ? 'border-purple-500 bg-purple-500/20 text-purple-900 dark:text-white font-semibold'
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-gray-600'
                  }`}
                >
                  <input
                    type="radio"
                    name="gender"
                    value="Female"
                    checked={formData.gender === 'Female'}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <span className="font-medium">Female</span>
                </label>
              </div>
              {errors.gender && (
                <p className="text-sm text-red-200 flex items-center gap-1">
                  <span>⚠️</span> {errors.gender}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <InputField
                ref={passwordRef}
                name="password"
                label="Password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleInputChange}
                icon={FaLock}
                error={errors.password}
                showPasswordToggle
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
              />
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="space-y-2">
                  <div className="flex gap-1">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          i < passwordStrength ? strengthColors[passwordStrength - 1] : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Password strength: {strengthLabels[passwordStrength - 1] || 'Very Weak'}
                  </p>
                </div>
              )}
            </div>

            <InputField
              ref={confirmPasswordRef}
              name="confirmPassword"
              label="Confirm Password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              icon={FaLock}
              error={errors.confirmPassword}
              showPasswordToggle
              showPassword={showConfirmPassword}
              onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
            />

            {/* Terms and Conditions */}
            <div className="space-y-2">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleInputChange}
                  className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 dark:border-gray-600 rounded"
                />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  I agree to the{' '}
                  <Link to="/terms" className="text-purple-600 dark:text-purple-400 hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-purple-600 dark:text-purple-400 hover:underline">
                    Privacy Policy
                  </Link>
                </span>
              </label>
              {errors.acceptTerms && (
                <p className="text-sm text-red-200 flex items-center gap-1">
                  <span>⚠️</span> {errors.acceptTerms}
                </p>
              )}
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
              Create Account
            </AuthButton>
          </form>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-300">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-3"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center">
            Join thousands who trust Mentra
          </h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <FaCheck className="text-green-500 text-xs" />
              <span>Mood tracking</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <FaCheck className="text-green-500 text-xs" />
              <span>Mental games</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <FaCheck className="text-green-500 text-xs" />
              <span>Daily journaling</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <FaCheck className="text-green-500 text-xs" />
              <span>Progress insights</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;
