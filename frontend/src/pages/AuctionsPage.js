import React from 'react';
import { motion } from 'framer-motion';
import LoadingSpinner from '../components/LoadingSpinner';

const AuctionsPage = () => {
  return (
    <div className="auctions-page">
      <div className="container">
        <motion.div 
          className="page-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="page-title text-gradient">All Auctions</h1>
          <p className="page-subtitle">Discover and bid on amazing items</p>
        </motion.div>
        
        <div className="auctions-content">
          <LoadingSpinner message="Loading auctions..." />
          {/* TODO: Implement auction listing */}
        </div>
      </div>
    </div>
  );
};

export default AuctionsPage;
