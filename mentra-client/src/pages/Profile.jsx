import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaEnvelope, FaCalendarAlt, FaEdit, FaSave, FaTimes, FaMars, FaVenus } from 'react-icons/fa';
import { showSuccessToast, showErrorToast } from '../utils/toast';

const Profile = () => {
  const { user, currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    gender: user?.gender || '',
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const token = await currentUser.getIdToken();
      
      // Update gender if changed
      if (formData.gender && formData.gender !== user.gender) {
        const response = await fetch('http://localhost:5000/api/user/update-gender', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ gender: formData.gender })
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('mentra_user', JSON.stringify(data.data.user));
          showSuccessToast('Profile updated successfully!');
          setTimeout(() => window.location.reload(), 1000);
        } else {
          showErrorToast('Failed to update profile.');
        }
      } else {
        showSuccessToast('No changes to save.');
      }
      
      setIsEditing(false);
    } catch (error) {
      console.error('Update error:', error);
      showErrorToast('Failed to update profile. Please try again.');
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      gender: user?.gender || '',
    });
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-purple-200">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 py-8 px-4 relative">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full blur-3xl"></div>
        <div className="absolute top-96 right-20 w-96 h-96 bg-purple-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-purple-300 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Profile Settings</h1>
          <p className="text-purple-200">Manage your account information and preferences</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-purple-400/30 p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Personal Information</h2>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-lg hover:scale-105 transition-all shadow-lg shadow-purple-500/50"
              >
                <FaEdit />
                <span>Edit Profile</span>
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:scale-105 transition-all shadow-lg shadow-green-500/50"
                >
                  <FaSave />
                  <span>Save</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center space-x-2 px-4 py-2 border border-purple-400/50 text-purple-200 rounded-lg hover:bg-white/10 transition-all"
                >
                  <FaTimes />
                  <span>Cancel</span>
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Avatar Section */}
            <div className="flex flex-col items-center space-y-4">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-24 h-24 rounded-full border-4 border-purple-400/50"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center border-4 border-purple-400/50 shadow-lg shadow-purple-500/50">
                  <FaUser className="text-white text-2xl" />
                </div>
              )}
              <p className="text-sm text-purple-200">Profile Picture</p>
              {user.loginMethod === 'google' && (
                <p className="text-xs text-purple-300">Synced from Google</p>
              )}
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  <FaUser className="inline mr-2" />
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-purple-400/30 bg-purple-700/30 text-white placeholder-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                ) : (
                  <p className="px-3 py-2 bg-purple-700/30 rounded-lg text-white">{user.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  <FaEnvelope className="inline mr-2" />
                  Email Address
                </label>
                <p className="px-3 py-2 bg-purple-700/30 rounded-lg text-white">{user.email}</p>
                <p className="text-xs text-purple-300 mt-1">Email cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  Gender
                </label>
                {isEditing ? (
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => handleInputChange('gender', 'Male')}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        formData.gender === 'Male'
                          ? 'bg-blue-500/30 border-blue-400'
                          : 'bg-purple-700/20 border-purple-400/30 hover:border-blue-400/50'
                      }`}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <FaMars className="text-2xl text-blue-400" />
                        <span className="text-white font-medium">Male</span>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInputChange('gender', 'Female')}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        formData.gender === 'Female'
                          ? 'bg-pink-500/30 border-pink-400'
                          : 'bg-purple-700/20 border-purple-400/30 hover:border-pink-400/50'
                      }`}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <FaVenus className="text-2xl text-pink-400" />
                        <span className="text-white font-medium">Female</span>
                      </div>
                    </button>
                  </div>
                ) : (
                  <p className="px-3 py-2 bg-purple-700/30 rounded-lg text-white">
                    {user.gender ? (
                      <span className="flex items-center">
                        {user.gender === 'Male' ? <FaMars className="mr-2 text-blue-400" /> : <FaVenus className="mr-2 text-pink-400" />}
                        {user.gender}
                      </span>
                    ) : (
                      <span className="text-yellow-400">Not set - Click Edit to add</span>
                    )}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  <FaCalendarAlt className="inline mr-2" />
                  Member Since
                </label>
                <p className="px-3 py-2 bg-purple-700/30 rounded-lg text-white">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently joined'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Stats */}
        {user.profile && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-purple-400/30 p-8">
            <h2 className="text-xl font-semibold text-white mb-6">Profile Summary</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-purple-700/30 rounded-lg border border-purple-400/30">
                <h3 className="font-medium text-purple-200">Mental Health Goals</h3>
                <p className="text-2xl font-bold text-white">
                  {user.profile.mentalHealthGoals?.length || 0}
                </p>
              </div>
              
              <div className="text-center p-4 bg-purple-700/30 rounded-lg border border-purple-400/30">
                <h3 className="font-medium text-purple-200">Current Stress Level</h3>
                <p className="text-2xl font-bold text-white">
                  {user.profile.stressLevel ? `${user.profile.stressLevel}/10` : 'Not set'}
                </p>
              </div>
              
              <div className="text-center p-4 bg-purple-700/30 rounded-lg border border-purple-400/30">
                <h3 className="font-medium text-purple-200">Preferred Activities</h3>
                <p className="text-2xl font-bold text-white">
                  {user.profile.preferredActivities?.length || 0}
                </p>
              </div>
            </div>

            {!user.profileCompleted && (
              <div className="mt-6 p-4 bg-yellow-500/20 border border-yellow-400/30 rounded-lg backdrop-blur-sm">
                <p className="text-yellow-200">
                  <strong>Profile Incomplete:</strong> Complete your survey to unlock personalized recommendations!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;