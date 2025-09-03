import React from 'react';
import { motion } from 'framer-motion';
import { FaGavel } from 'react-icons/fa';

const LoadingSpinner = ({ message = 'Loading AuctionHub...' }) => {
  return (
    <div className="loading-spinner">
      <motion.div 
        className="loading-logo"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <FaGavel className="loading-icon" />
      </motion.div>
      
      <motion.div 
        className="loading-dots"
        initial={{ opacity: 0.3 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
      >
        <div className="spinner"></div>
      </motion.div>
      
      <motion.p 
        className="loading-text"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {message}
      </motion.p>
    </div>
  );
};

export default LoadingSpinner;
