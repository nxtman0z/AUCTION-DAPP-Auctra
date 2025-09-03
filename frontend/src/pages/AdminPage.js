import React from 'react';
import { motion } from 'framer-motion';

const AdminPage = ({ account, user }) => {
  return (
    <div className="admin-page">
      <div className="container">
        <motion.div 
          className="page-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="page-title text-gradient">👑 Admin Panel</h1>
          <p className="page-subtitle">Platform management and user administration</p>
        </motion.div>
        
        <div className="admin-content">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Coming Soon</h2>
            </div>
            <p>Admin functionality will be implemented here.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
