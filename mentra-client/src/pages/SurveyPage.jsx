import { useNavigate } from 'react-router-dom';
import Survey from '../components/Survey/Survey';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

const SurveyPage = () => {
  const navigate = useNavigate();
  const { needsSurvey, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    } else if (!isLoading && isAuthenticated && !needsSurvey) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, needsSurvey, isLoading, navigate]);

  const handleSurveyComplete = () => {
    navigate('/dashboard');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !needsSurvey) {
    return null;
  }

  return <Survey onComplete={handleSurveyComplete} />;
};

export default SurveyPage;