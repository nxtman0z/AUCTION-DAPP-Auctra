import React from 'react';
import { motion } from 'framer-motion';

const ProfilePage = ({ account, user, updateUserData }) => {
  return (
    <div className="profile-page">
      <div className="container">
        <motion.div 
          className="page-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="page-title text-gradient">My Profile</h1>
          <p className="page-subtitle">Manage your account and auctions</p>
        </motion.div>
        
        <div className="profile-content">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">User Information</h2>
            </div>
            <div className="user-info">
              <p><strong>Wallet Address:</strong> {account}</p>
              {user && (
                <>
                  <p><strong>Email:</strong> {user.email || 'Not set'}</p>
                  <p><strong>Verified:</strong> {user.isVerified ? '✅ Yes' : '❌ No'}</p>
                  <p><strong>Admin:</strong> {user.isAdmin ? '👑 Yes' : '❌ No'}</p>
                  <p><strong>Auctions Created:</strong> {user.auctionsCreated || 0}</p>
                  <p><strong>Auctions Won:</strong> {user.auctionsWon || 0}</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
