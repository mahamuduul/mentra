import { forwardRef } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const InputField = forwardRef(({ 
  type = 'text',
  label,
  placeholder,
  error,
  icon: Icon,
  showPasswordToggle,
  showPassword,
  onTogglePassword,
  className = '',
  ...props 
}, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
        )}
        <input
          ref={ref}
          type={showPasswordToggle ? (showPassword ? 'text' : 'password') : type}
          placeholder={placeholder}
          className={`w-full px-4 py-3 ${Icon ? 'pl-10' : ''} ${showPasswordToggle ? 'pr-10' : ''} 
            rounded-lg border border-gray-300 dark:border-gray-600 
            bg-white dark:bg-gray-800 
            text-gray-900 dark:text-white 
            placeholder-gray-500 dark:placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            transition-colors ${className}`}
          {...props}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
          <span>⚠️</span> {error}
        </p>
      )}
    </div>
  );
});

InputField.displayName = 'InputField';

export default InputField;