import { useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const BackButton = ({ to, className = '' }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show back button on home page
  if (location.pathname === '/') {
    return null;
  }

  const handleBack = () => {
    if (to) {
      navigate(to);
    } else {
      // Go back to previous page or home if no history
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        navigate('/');
      }
    }
  };

  return (
    <button
      onClick={handleBack}
      className={`inline-flex items-center space-x-2 px-4 py-2 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-200 ${className}`}
      aria-label="Go back"
    >
      <FaArrowLeft className="text-lg" />
      <span>Back</span>
    </button>
  );
};

export default BackButton;
