import { useAuth } from '../context/AuthContext';
import GenderProtectedSection from '../components/GenderProtectedSection';
import { FaMars, FaVenus, FaUsers } from 'react-icons/fa';

/**
 * Example page demonstrating gender-based access control
 * This shows how to implement different sections for different genders
 */
const GenderBasedExample = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Please Login
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            You need to be logged in to view this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* User Info */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Gender-Based Content Example
          </h1>
          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              {user?.gender === 'Male' ? (
                <FaMars className="text-blue-500" />
              ) : (
                <FaVenus className="text-pink-500" />
              )}
              <span>
                Welcome, <span className="font-semibold">{user?.name}</span>
              </span>
            </div>
            <span>•</span>
            <span>Gender: {user?.gender}</span>
          </div>
        </div>

        {/* Universal Content - Visible to All */}
        <section>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <FaUsers className="text-purple-500 text-2xl" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Universal Resources
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              These resources are available to all users regardless of gender:
            </p>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                General mental health tips
              </li>
              <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                Stress management techniques
              </li>
              <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                Meditation guides
              </li>
            </ul>
          </div>
        </section>

        {/* Male-Only Section */}
        <GenderProtectedSection 
          allowedGenders={['Male']}
          fallbackMessage="This section is specifically designed for male users."
        >
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl shadow-lg p-6 border-2 border-blue-200 dark:border-blue-700">
            <div className="flex items-center gap-3 mb-4">
              <FaMars className="text-blue-600 dark:text-blue-400 text-2xl" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Men's Mental Health Resources
              </h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Specialized content and resources tailored for men:
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                Understanding male-specific mental health challenges
              </li>
              <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                Dealing with performance pressure and expectations
              </li>
              <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                Building emotional resilience
              </li>
              <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                Men's support groups and communities
              </li>
            </ul>
          </div>
        </GenderProtectedSection>

        {/* Female-Only Section */}
        <GenderProtectedSection 
          allowedGenders={['Female']}
          fallbackMessage="This section is specifically designed for female users."
        >
          <div className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 rounded-xl shadow-lg p-6 border-2 border-pink-200 dark:border-pink-700">
            <div className="flex items-center gap-3 mb-4">
              <FaVenus className="text-pink-600 dark:text-pink-400 text-2xl" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Women's Mental Health Resources
              </h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Specialized content and resources tailored for women:
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <span className="w-2 h-2 bg-pink-600 rounded-full"></span>
                Hormonal changes and mental health
              </li>
              <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <span className="w-2 h-2 bg-pink-600 rounded-full"></span>
                Postpartum mental health support
              </li>
              <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <span className="w-2 h-2 bg-pink-600 rounded-full"></span>
                Work-life balance strategies
              </li>
              <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <span className="w-2 h-2 bg-pink-600 rounded-full"></span>
                Women's support networks
              </li>
            </ul>
          </div>
        </GenderProtectedSection>

        {/* Conditional Rendering Example */}
        <section>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Personalized Recommendations
            </h2>
            <div className="space-y-3">
              {user?.gender === 'Male' ? (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Recommended for you:</strong> Studies show that men often benefit from 
                    physical activities like sports and exercise to manage stress and improve mental health.
                  </p>
                </div>
              ) : (
                <div className="bg-pink-50 dark:bg-pink-900/20 rounded-lg p-4">
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Recommended for you:</strong> Research indicates that women often find 
                    social connections and expressive activities beneficial for mental wellness.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Hidden Section Example */}
        <GenderProtectedSection allowedGenders={['Male']} showFallback={false}>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
            <p className="text-gray-700 dark:text-gray-300">
              This section is only visible to male users and doesn't show a fallback message 
              to other users. It simply doesn't render for female users.
            </p>
          </div>
        </GenderProtectedSection>
      </div>
    </div>
  );
};

export default GenderBasedExample;
