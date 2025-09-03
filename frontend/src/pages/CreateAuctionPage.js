import React from 'react';
import { motion } from 'framer-motion';

const CreateAuctionPage = ({ account, user }) => {
  return (
    <div className="create-auction-page">
      <div className="container">
        <motion.div 
          className="page-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="page-title text-gradient">Create Auction</h1>
          <p className="page-subtitle">List your item for auction</p>
        </motion.div>
        
        <div className="create-form-container">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Coming Soon</h2>
            </div>
            <p>Create auction functionality will be implemented here.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAuctionPage;
