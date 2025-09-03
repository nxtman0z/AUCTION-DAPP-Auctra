import React from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';

const AuctionDetailsPage = () => {
  const { address } = useParams();
  
  return (
    <div className="auction-details-page">
      <div className="container">
        <motion.div 
          className="page-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="page-title text-gradient">Auction Details</h1>
          <p className="page-subtitle">Contract: {address}</p>
        </motion.div>
        
        <div className="auction-details-content">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Coming Soon</h2>
            </div>
            <p>Auction details functionality will be implemented here.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionDetailsPage;
