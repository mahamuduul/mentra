import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '', 
  hover = true,
  glass = false,
  ...props 
}) => {
  const baseStyles = 'rounded-2xl p-6 transition-all duration-300';
  const glassStyles = glass 
    ? 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg' 
    : 'bg-white dark:bg-gray-800 shadow-lg';
  
  const hoverStyles = hover 
    ? 'hover:shadow-2xl hover:-translate-y-1' 
    : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`${baseStyles} ${glassStyles} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
