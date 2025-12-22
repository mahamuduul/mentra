import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaBrain, FaHeartbeat, FaBed, FaDumbbell, FaUsers, FaBullseye, FaHeart, FaExclamationTriangle, FaLifeRing, FaGamepad, FaShieldAlt, FaUserShield, FaBriefcase, FaDollarSign, FaFire } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { showSuccessToast, showErrorToast } from '../../utils/toast';

const Survey = ({ onComplete }) => {
  const { currentUser, syncUserWithBackend, user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Get user gender - use from user profile if available
  const userGender = user?.gender || user?.profile?.gender;
  
  const [formData, setFormData] = useState({
    age: '',
    gender: userGender || '',
    currentMentalState: '',
    stressLevel: 5,
    anxietyLevel: 5,
    sleepQuality: '',
    exerciseFrequency: '',
    supportSystem: '',
    mentalHealthGoals: [],
    mentalHealthProblems: [], // NEW: Specific problems user is facing
    interests: [],
    triggers: [],
    copingMechanisms: [],
    preferredActivities: [],
  });
  
  // Normalize gender for problem selection - use formData.gender (what user selects in step 1)
  const normalizedGender = formData.gender ? formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1).toLowerCase() : null;

  const totalSteps = 8; // Increased from 7 to include mental health problems step

  // Gender-specific mental health problems
  const femaleMentalHealthProblems = [
    { id: 'harassment', label: 'Harassment Issues', icon: FaShieldAlt },
    { id: 'social-pressure', label: 'Social or Personal Pressure', icon: FaUserShield },
    { id: 'safety', label: 'Safety-Related Issues', icon: FaExclamationTriangle },
    { id: 'mental-stress', label: 'Mental Stress', icon: FaBrain },
  ];

  const maleMentalHealthProblems = [
    { id: 'career-pressure', label: 'Career Pressure', icon: FaBriefcase },
    { id: 'financial-stress', label: 'Financial Stress', icon: FaDollarSign },
    { id: 'anger-management', label: 'Anger Management', icon: FaFire },
  ];

  const mentalHealthGoalOptions = [
    'Reduce anxiety',
    'Improve mood',
    'Better sleep',
    'Stress management',
    'Build confidence',
    'Improve relationships',
    'Develop coping skills',
    'Increase mindfulness',
    'Manage depression',
    'Work-life balance',
  ];

  const interestOptions = [
    'Reading',
    'Music',
    'Sports',
    'Art & Creativity',
    'Gaming',
    'Nature & Outdoors',
    'Cooking',
    'Technology',
    'Meditation',
    'Socializing',
    'Learning new skills',
    'Volunteering',
  ];

  const triggerOptions = [
    'Work stress',
    'Financial concerns',
    'Relationship issues',
    'Health problems',
    'Social situations',
    'Change/uncertainty',
    'Perfectionism',
    'Loneliness',
    'Academic pressure',
    'Family conflicts',
  ];

  const copingMechanismOptions = [
    'Deep breathing',
    'Exercise',
    'Talking to friends',
    'Journaling',
    'Listening to music',
    'Meditation',
    'Professional therapy',
    'Creative activities',
    'Time in nature',
    'Reading',
  ];

  const preferredActivityOptions = [
    'Guided meditation',
    'Breathing exercises',
    'Mood tracking',
    'Journaling prompts',
    'Relaxing music',
    'Gentle workouts',
    'Mindfulness exercises',
    'Sleep stories',
    'Cognitive exercises',
    'Social activities',
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleArrayToggle = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value],
    }));
  };

  const nextStep = () => {
    // Validate current step before proceeding
    if (!validateCurrentStep()) {
      return;
    }
    
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1: // Basic Information
        if (!formData.age || formData.age < 13 || formData.age > 120) {
          showErrorToast('Please enter a valid age (13-120)');
          return false;
        }
        if (!formData.gender) {
          showErrorToast('Please select your gender');
          return false;
        }
        return true;
        
      case 2: // Mental Health Status
        if (!formData.currentMentalState) {
          showErrorToast('Please select your current mental state');
          return false;
        }
        return true;
        
      case 3: // Stress & Anxiety Levels - Allow default values (5/5)
        // No validation needed as sliders have default values
        return true;
        
      case 4: // Lifestyle & Wellness
        if (!formData.sleepQuality) {
          showErrorToast('Please select your sleep quality');
          return false;
        }
        if (!formData.exerciseFrequency) {
          showErrorToast('Please select your exercise frequency');
          return false;
        }
        if (!formData.supportSystem) {
          showErrorToast('Please select your support system');
          return false;
        }
        return true;
        
      case 5: // Goals & Interests
        if (formData.mentalHealthGoals.length === 0) {
          showErrorToast('Please select at least one mental health goal');
          return false;
        }
        if (formData.interests.length === 0) {
          showErrorToast('Please select at least one interest');
          return false;
        }
        return true;
        
      case 6: // Mental Health Challenges (NEW - optional selection)
        // Optional step - no validation required
        return true;
        
      case 7: // Triggers & Coping
        if (formData.triggers.length === 0) {
          showErrorToast('Please select at least one trigger');
          return false;
        }
        if (formData.copingMechanisms.length === 0) {
          showErrorToast('Please select at least one coping mechanism');
          return false;
        }
        return true;
        
      case 8: // Preferences
        if (formData.preferredActivities.length === 0) {
          showErrorToast('Please select at least one preferred activity');
          return false;
        }
        return true;
        
      default:
        return true;
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!currentUser) {
      showErrorToast('User not authenticated');
      return;
    }

    // Final validation before submission
    if (!validateCurrentStep()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const token = await currentUser.getIdToken();
      
      // Clean the form data - only send fields with actual values
      const cleanedData = {};
      
      // Add numeric fields only if they have a value
      if (formData.age && formData.age !== '') {
        cleanedData.age = parseInt(formData.age);
      }
      
      if (formData.stressLevel) {
        cleanedData.stressLevel = parseInt(formData.stressLevel);
      }
      
      if (formData.anxietyLevel) {
        cleanedData.anxietyLevel = parseInt(formData.anxietyLevel);
      }
      
      // Add string fields only if they have a value
      if (formData.gender) cleanedData.gender = formData.gender;
      if (formData.currentMentalState) cleanedData.currentMentalState = formData.currentMentalState;
      if (formData.sleepQuality) cleanedData.sleepQuality = formData.sleepQuality;
      if (formData.exerciseFrequency) cleanedData.exerciseFrequency = formData.exerciseFrequency;
      if (formData.supportSystem) cleanedData.supportSystem = formData.supportSystem;
      
      // Add array fields only if they have items
      if (formData.mentalHealthGoals && formData.mentalHealthGoals.length > 0) {
        cleanedData.mentalHealthGoals = formData.mentalHealthGoals;
      }
      if (formData.mentalHealthProblems && formData.mentalHealthProblems.length > 0) {
        cleanedData.mentalHealthProblems = formData.mentalHealthProblems;
      }
      if (formData.interests && formData.interests.length > 0) {
        cleanedData.interests = formData.interests;
      }
      if (formData.triggers && formData.triggers.length > 0) {
        cleanedData.triggers = formData.triggers;
      }
      if (formData.copingMechanisms && formData.copingMechanisms.length > 0) {
        cleanedData.copingMechanisms = formData.copingMechanisms;
      }
      if (formData.preferredActivities && formData.preferredActivities.length > 0) {
        cleanedData.preferredActivities = formData.preferredActivities;
      }
      
      console.log('📤 Submitting survey data:', cleanedData);
      
      const response = await fetch('http://localhost:5000/api/user/survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(cleanedData),
      });

      const data = await response.json();
      
      console.log('📥 Survey response:', data);

      if (data.success) {
        showSuccessToast('Profile completed successfully! 🎉');
        
        // Sync user data to update context with new profile
        setIsSyncing(true);
        await syncUserWithBackend();
        setIsSyncing(false);
        
        onComplete?.(data.data.user);
      } else {
        throw new Error(data.message || 'Failed to submit survey');
      }
    } catch (error) {
      console.error('❌ Survey submission error:', error);
      showErrorToast(error.message || 'Failed to complete profile. Please try again.');
    } finally {
      setIsSubmitting(false);
      setIsSyncing(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <FaUser className="mx-auto text-4xl text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Basic Information</h3>
              <p className="text-gray-600">Tell us a bit about yourself</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age
                </label>
                <input
                  type="number"
                  min="13"
                  max="120"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', parseInt(e.target.value) || '')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your age"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <FaBrain className="mx-auto text-4xl text-purple-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Mental Health Status</h3>
              <p className="text-gray-600">How are you feeling right now?</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Mental State
              </label>
              <select
                value={formData.currentMentalState}
                onChange={(e) => handleInputChange('currentMentalState', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select your current state</option>
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
                <option value="very-poor">Very Poor</option>
              </select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <FaHeartbeat className="mx-auto text-4xl text-red-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Stress & Anxiety Levels</h3>
              <p className="text-gray-600">Rate your current levels (1-10)</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stress Level: {formData.stressLevel}
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.stressLevel}
                  onChange={(e) => handleInputChange('stressLevel', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Low</span>
                  <span>High</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Anxiety Level: {formData.anxietyLevel}
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.anxietyLevel}
                  onChange={(e) => handleInputChange('anxietyLevel', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Low</span>
                  <span>High</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <FaBed className="mx-auto text-4xl text-indigo-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Lifestyle Factors</h3>
              <p className="text-gray-600">Tell us about your sleep, exercise, and support</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sleep Quality
                </label>
                <select
                  value={formData.sleepQuality}
                  onChange={(e) => handleInputChange('sleepQuality', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select sleep quality</option>
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                  <option value="very-poor">Very Poor</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Exercise Frequency
                </label>
                <select
                  value={formData.exerciseFrequency}
                  onChange={(e) => handleInputChange('exerciseFrequency', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select exercise frequency</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Several times a week</option>
                  <option value="monthly">Few times a month</option>
                  <option value="rarely">Rarely</option>
                  <option value="never">Never</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Support System
                </label>
                <select
                  value={formData.supportSystem}
                  onChange={(e) => handleInputChange('supportSystem', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select your support system</option>
                  <option value="strong">Strong (Family & Friends)</option>
                  <option value="moderate">Moderate (Some Support)</option>
                  <option value="weak">Weak (Limited Support)</option>
                  <option value="none">None</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <FaBullseye className="mx-auto text-4xl text-green-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Goals & Interests</h3>
              <p className="text-gray-600">Tell us what matters to you</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Mental Health Goals (Select all that apply)</h4>
                <div className="grid grid-cols-2 gap-3">
                  {mentalHealthGoalOptions.map((goal) => (
                    <label key={goal} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.mentalHealthGoals.includes(goal)}
                        onChange={() => handleArrayToggle('mentalHealthGoals', goal)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">{goal}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Your Interests (Select all that apply)</h4>
                <div className="grid grid-cols-2 gap-3">
                  {interestOptions.map((interest) => (
                    <label key={interest} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.interests.includes(interest)}
                        onChange={() => handleArrayToggle('interests', interest)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">{interest}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center">
              {normalizedGender === 'Female' ? (
                <FaUserShield className="mx-auto text-4xl text-pink-500 mb-4" />
              ) : (
                <FaBriefcase className="mx-auto text-4xl text-blue-500 mb-4" />
              )}
              <h3 className="text-xl font-semibold mb-2">Mental Health Challenges</h3>
              <p className="text-gray-600">Select any challenges you're currently facing</p>
            </div>
            
            <div className="space-y-3">
              {(normalizedGender === 'Female' ? femaleMentalHealthProblems : maleMentalHealthProblems).map((problem) => {
                const Icon = problem.icon;
                return (
                  <label 
                    key={problem.id}
                    className={`flex items-start space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      formData.mentalHealthProblems.includes(problem.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.mentalHealthProblems.includes(problem.id)}
                      onChange={() => handleArrayToggle('mentalHealthProblems', problem.id)}
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-0.5"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <Icon className="text-lg text-blue-600" />
                        <span className="font-medium text-gray-800">{problem.label}</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {problem.id === 'harassment' && 'Support for dealing with harassment and abuse'}
                        {problem.id === 'social-pressure' && 'Help managing societal and family expectations'}
                        {problem.id === 'safety' && 'Resources for personal safety concerns'}
                        {problem.id === 'mental-stress' && 'Tools for anxiety and emotional stress'}
                        {problem.id === 'career-pressure' && 'Support for work-related stress and expectations'}
                        {problem.id === 'financial-stress' && 'Help managing financial worries'}
                        {problem.id === 'anger-management' && 'Techniques for managing anger and frustration'}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
            
            <p className="text-xs text-gray-500 text-center">
              Your selections will help us provide personalized mental health recommendations
            </p>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <FaExclamationTriangle className="mx-auto text-4xl text-yellow-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Triggers & Coping</h3>
              <p className="text-gray-600">Help us understand what affects you</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Common Triggers (Select all that apply)</h4>
                <div className="grid grid-cols-2 gap-2">
                  {triggerOptions.map((trigger) => (
                    <label key={trigger} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.triggers.includes(trigger)}
                        onChange={() => handleArrayToggle('triggers', trigger)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">{trigger}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Current Coping Mechanisms</h4>
                <div className="grid grid-cols-2 gap-2">
                  {copingMechanismOptions.map((mechanism) => (
                    <label key={mechanism} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.copingMechanisms.includes(mechanism)}
                        onChange={() => handleArrayToggle('copingMechanisms', mechanism)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">{mechanism}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 8:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <FaGamepad className="mx-auto text-4xl text-pink-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Preferred Activities</h3>
              <p className="text-gray-600">What activities would you like Mentra to suggest?</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {preferredActivityOptions.map((activity) => (
                <label key={activity} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.preferredActivities.includes(activity)}
                    onChange={() => handleArrayToggle('preferredActivities', activity)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">{activity}</span>
                </label>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 relative"
      >
        {/* Loading Overlay */}
        {(isSubmitting || isSyncing) && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center z-50">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-lg font-medium text-gray-700">
                {isSyncing ? 'Syncing your profile...' : 'Submitting survey...'}
              </p>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round((currentStep / totalSteps) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderStep()}
        </motion.div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              currentStep === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Previous
          </button>

          {currentStep < totalSteps ? (
            <button
              onClick={nextStep}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg font-medium hover:from-purple-700 hover:to-purple-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Completing...' : 'Complete Profile'}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Survey;