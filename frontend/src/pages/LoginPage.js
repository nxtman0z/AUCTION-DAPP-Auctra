import React from 'react';
import { motion } from 'framer-motion';
import { FaWallet, FaUserPlus, FaArrowRight } from 'react-icons/fa';

const LoginPage = ({ account, onConnectWallet, updateUserData }) => {
  const handleConnect = async () => {
    await onConnectWallet();
    if (account) {
      await updateUserData();
    }
  };

  return (
    <div className="login-page">
      <div className="container">
        <motion.div 
          className="login-container"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="card login-card">
            <div className="card-header text-center">
              <h1 className="card-title">Welcome to AuctionHub</h1>
              <p className="card-subtitle">Connect your wallet to get started</p>
            </div>
            
            <div className="login-content">
              <div className="login-steps">
                <div className="step">
                  <div className="step-icon">
                    <FaWallet />
                  </div>
                  <div className="step-content">
                    <h3>Connect Wallet</h3>
                    <p>Connect your MetaMask wallet to start using AuctionHub</p>
                  </div>
                </div>
                
                <div className="step-arrow">
                  <FaArrowRight />
                </div>
                
                <div className="step">
                  <div className="step-icon">
                    <FaUserPlus />
                  </div>
                  <div className="step-content">
                    <h3>Get Verified</h3>
                    <p>Complete the verification process to create and bid on auctions</p>
                  </div>
                </div>
              </div>
              
              <div className="login-actions">
                <button 
                  onClick={handleConnect}
                  className="btn btn-primary login-btn"
                >
                  <FaWallet />
                  Connect MetaMask Wallet
                </button>
                
                <p className="login-note">
                  Don't have MetaMask? <a href="https://metamask.io" target="_blank" rel="noopener noreferrer">Get it here</a>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
