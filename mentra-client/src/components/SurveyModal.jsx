import { useEffect } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import Survey from './Survey/Survey';

const SurveyModal = ({ isOpen, onComplete }) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleComplete = (userData) => {
    onComplete?.(userData);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with blur - NO CLICK TO CLOSE */}
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          {/* Modal - CANNOT BE CLOSED */}
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white px-8 py-6">
                  <h2 className="text-3xl font-bold">Complete Your Profile</h2>
                  <p className="text-purple-200 mt-2">
                    Help us personalize your mental wellness journey
                  </p>
                  <p className="text-purple-300 text-sm mt-3 flex items-center gap-2">
                    <span className="inline-block w-2 h-2 bg-purple-300 rounded-full"></span>
                    Required to continue
                  </p>
                </div>

                {/* Survey Content - Scrollable */}
                <div className="max-h-[70vh] overflow-y-auto">
                  <Survey onComplete={handleComplete} />
                </div>
              </Motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SurveyModal;
