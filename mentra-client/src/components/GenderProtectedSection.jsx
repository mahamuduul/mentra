import { useAuth } from '../context/AuthContext';
import { FaLock } from 'react-icons/fa';

/**
 * Gender-based access control component
 * Use this to restrict sections based on user's gender
 * 
 * Usage:
 * <GenderProtectedSection allowedGenders={['Male']}>
 *   <MaleOnlyContent />
 * </GenderProtectedSection>
 */
const GenderProtectedSection = ({ 
  children, 
  allowedGenders = [], 
  fallbackMessage = "This section is not available for your profile.",
  showFallback = true 
}) => {
  const { user } = useAuth();

  // If no user is logged in, don't render anything
  if (!user) {
    return null;
  }

  // Get gender from either user.gender or user.profile.gender and normalize it
  const userGender = user.gender || user.profile?.gender;
  const normalizedGender = userGender ? userGender.charAt(0).toUpperCase() + userGender.slice(1).toLowerCase() : null;

  // Check if user's gender is in the allowed list
  const hasAccess = allowedGenders.length === 0 || allowedGenders.includes(normalizedGender);

  if (hasAccess) {
    return <>{children}</>;
  }

  // Show fallback UI if access is denied and showFallback is true
  if (showFallback) {
    return (
      <div
        className="bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <FaLock className="text-2xl text-gray-400 dark:text-gray-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Access Restricted
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {fallbackMessage}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Don't render anything if showFallback is false
  return null;
};

export default GenderProtectedSection;
