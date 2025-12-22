import { motion } from 'framer-motion';

const AuthButton = ({ 
  children, 
  variant = 'primary', 
  isLoading = false,
  disabled = false,
  icon: Icon,
  className = '',
  ...props 
}) => {
  const baseStyles = 'w-full flex items-center justify-center gap-3 px-6 py-3 font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl',
    google: 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 shadow-md hover:shadow-lg',
    outline: 'border-2 border-blue-500 text-blue-500 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Loading...
        </>
      ) : (
        <>
          {Icon && <Icon className="text-xl" />}
          {children}
        </>
      )}
    </motion.button>
  );
};

export default AuthButton;