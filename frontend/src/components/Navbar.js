import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaWallet, 
  FaUser, 
  FaGavel, 
  FaPlus, 
  FaHome,
  FaBars,
  FaTimes,
  FaCrown
} from 'react-icons/fa';
import { formatAddress } from '../utils/web3Utils';
import '../styles/Navbar.css';

const Navbar = ({ account, user, onConnectWallet, onDisconnectWallet, isConnecting }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.nav 
      className="navbar"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-brand" onClick={closeMobileMenu}>
          <div className="logo">
            <FaGavel className="logo-icon" />
            <span className="logo-text">AuctionHub</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar-menu">
          <Link 
            to="/" 
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
          >
            <FaHome />
            <span>Home</span>
          </Link>
          
          <Link 
            to="/auctions" 
            className={`nav-link ${isActive('/auctions') ? 'active' : ''}`}
          >
            <FaGavel />
            <span>Auctions</span>
          </Link>
          
          {account && user && (
            <Link 
              to="/create-auction" 
              className={`nav-link ${isActive('/create-auction') ? 'active' : ''}`}
            >
              <FaPlus />
              <span>Create</span>
            </Link>
          )}
          
          {account && user && user.isAdmin && (
            <Link 
              to="/admin" 
              className={`nav-link admin-link ${isActive('/admin') ? 'active' : ''}`}
            >
              <FaCrown />
              <span>Admin</span>
            </Link>
          )}
        </div>

        {/* User Section */}
        <div className="navbar-user">
          {account ? (
            <div className="user-menu">
              <Link to="/profile" className="user-info" onClick={closeMobileMenu}>
                <div className="user-avatar">
                  <FaUser />
                </div>
                <div className="user-details">
                  <span className="user-address">{formatAddress(account)}</span>
                  {user && (
                    <span className="user-status">
                      {user.isAdmin ? '👑 Admin' : user.isVerified ? '✅ Verified' : '⏳ Pending'}
                    </span>
                  )}
                </div>
              </Link>
              
              <button 
                onClick={onDisconnectWallet}
                className="btn btn-outline disconnect-btn"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button 
              onClick={onConnectWallet}
              disabled={isConnecting}
              className="btn btn-primary connect-btn"
            >
              <FaWallet />
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="mobile-menu-toggle"
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      <motion.div 
        className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}
        initial={{ height: 0, opacity: 0 }}
        animate={{ 
          height: isMobileMenuOpen ? 'auto' : 0,
          opacity: isMobileMenuOpen ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="mobile-menu-content">
          <Link 
            to="/" 
            className={`mobile-nav-link ${isActive('/') ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            <FaHome />
            <span>Home</span>
          </Link>
          
          <Link 
            to="/auctions" 
            className={`mobile-nav-link ${isActive('/auctions') ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            <FaGavel />
            <span>Auctions</span>
          </Link>
          
          {account && user && (
            <Link 
              to="/create-auction" 
              className={`mobile-nav-link ${isActive('/create-auction') ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              <FaPlus />
              <span>Create Auction</span>
            </Link>
          )}
          
          {account && user && user.isAdmin && (
            <Link 
              to="/admin" 
              className={`mobile-nav-link admin-link ${isActive('/admin') ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              <FaCrown />
              <span>Admin Panel</span>
            </Link>
          )}

          <div className="mobile-user-section">
            {account ? (
              <div className="mobile-user-info">
                <Link to="/profile" onClick={closeMobileMenu}>
                  <div className="mobile-user-avatar">
                    <FaUser />
                  </div>
                  <div className="mobile-user-details">
                    <span className="mobile-user-address">{formatAddress(account)}</span>
                    {user && (
                      <span className="mobile-user-status">
                        {user.isAdmin ? '👑 Admin' : user.isVerified ? '✅ Verified' : '⏳ Pending'}
                      </span>
                    )}
                  </div>
                </Link>
                
                <button 
                  onClick={() => {
                    onDisconnectWallet();
                    closeMobileMenu();
                  }}
                  className="btn btn-outline disconnect-btn"
                >
                  Disconnect Wallet
                </button>
              </div>
            ) : (
              <button 
                onClick={() => {
                  onConnectWallet();
                  closeMobileMenu();
                }}
                disabled={isConnecting}
                className="btn btn-primary connect-btn mobile-connect"
              >
                <FaWallet />
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.nav>
  );
};

export default Navbar;
