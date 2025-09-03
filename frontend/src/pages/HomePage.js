import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaGavel, 
  FaUsers, 
  FaTrophy, 
  FaRocket,
  FaShieldAlt,
  FaGlobe,
  FaArrowRight,
  FaStar
} from 'react-icons/fa';
import { getAllActiveAuctions } from '../utils/web3Utils';
import AuctionCard from '../components/AuctionCard';

const HomePage = () => {
  const [featuredAuctions, setFeaturedAuctions] = useState([]);
  const [stats, setStats] = useState({
    totalAuctions: 0,
    activeUsers: 0,
    totalBids: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      setLoading(true);
      const auctions = await getAllActiveAuctions();
      setFeaturedAuctions(auctions.slice(0, 3)); // Show only first 3 auctions
      
      // Mock stats for now (you can get these from your backend)
      setStats({
        totalAuctions: auctions.length,
        activeUsers: 150,
        totalBids: 1250
      });
    } catch (error) {
      console.error('Error loading home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <FaShieldAlt />,
      title: 'Secure & Transparent',
      description: 'All auctions are secured by smart contracts on the blockchain, ensuring complete transparency and security.'
    },
    {
      icon: <FaGlobe />,
      title: 'Global Marketplace',
      description: 'Connect with buyers and sellers worldwide in our decentralized auction platform.'
    },
    {
      icon: <FaRocket />,
      title: 'Easy to Use',
      description: 'Simple and intuitive interface makes it easy for anyone to participate in auctions.'
    }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <motion.section 
        className="hero-section"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container">
          <div className="hero-content">
            <motion.div 
              className="hero-text"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <h1 className="hero-title">
                Welcome to <span className="text-gradient">AuctionHub</span>
              </h1>
              <p className="hero-subtitle">
                The future of decentralized auctions. Buy, sell, and bid on unique items 
                with complete transparency and security powered by blockchain technology.
              </p>
              
              <div className="hero-buttons">
                <Link to="/auctions" className="btn btn-primary">
                  <FaGavel />
                  Explore Auctions
                </Link>
                <Link to="/login" className="btn btn-outline">
                  Get Started
                  <FaArrowRight />
                </Link>
              </div>
            </motion.div>
            
            <motion.div 
              className="hero-visual"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <div className="hero-auction-card">
                <div className="hero-card-image">
                  <FaGavel className="hero-card-icon" />
                </div>
                <div className="hero-card-content">
                  <h3>Live Auction</h3>
                  <p className="price-display">2.5 ETH</p>
                  <div className="timer-display">05:23:14</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section 
        className="stats-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container">
          <div className="stats-grid">
            <motion.div 
              className="stat-card"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <FaGavel className="stat-icon" />
              <h3 className="stat-number">{stats.totalAuctions}+</h3>
              <p className="stat-label">Active Auctions</p>
            </motion.div>
            
            <motion.div 
              className="stat-card"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <FaUsers className="stat-icon" />
              <h3 className="stat-number">{stats.activeUsers}+</h3>
              <p className="stat-label">Verified Users</p>
            </motion.div>
            
            <motion.div 
              className="stat-card"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <FaTrophy className="stat-icon" />
              <h3 className="stat-number">{stats.totalBids}+</h3>
              <p className="stat-label">Total Bids</p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Featured Auctions */}
      {featuredAuctions.length > 0 && (
        <motion.section 
          className="featured-section"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">
                <FaStar className="section-icon" />
                Featured Auctions
              </h2>
              <p className="section-subtitle">
                Discover the hottest auctions happening right now
              </p>
            </div>
            
            <div className="auctions-grid">
              {featuredAuctions.map((auction, index) => (
                <motion.div
                  key={auction.address}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <AuctionCard auction={auction} />
                </motion.div>
              ))}
            </div>
            
            <div className="section-footer">
              <Link to="/auctions" className="btn btn-secondary">
                View All Auctions
                <FaArrowRight />
              </Link>
            </div>
          </div>
        </motion.section>
      )}

      {/* Features Section */}
      <motion.section 
        className="features-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose AuctionHub?</h2>
            <p className="section-subtitle">
              Experience the future of auctions with our cutting-edge platform
            </p>
          </div>
          
          <div className="features-grid">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="feature-card"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="feature-icon">
                  {feature.icon}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="cta-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Start Bidding?</h2>
            <p className="cta-subtitle">
              Join thousands of users who trust AuctionHub for secure, transparent auctions
            </p>
            <Link to="/login" className="btn btn-primary cta-button">
              Get Started Now
              <FaRocket />
            </Link>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default HomePage;
