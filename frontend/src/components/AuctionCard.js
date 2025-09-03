import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEye, FaClock, FaUser } from 'react-icons/fa';
import { weiToEther, formatAddress } from '../utils/web3Utils';
import Countdown from 'react-countdown';

const AuctionCard = ({ auction }) => {
  const { address, name, image, currentBid, timeLeft, isLive, seller } = auction;

  // Countdown renderer
  const countdownRenderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      return <span className="status-badge status-ended">Ended</span>;
    } else {
      return (
        <span className="countdown-timer">
          {hours.toString().padStart(2, '0')}:
          {minutes.toString().padStart(2, '0')}:
          {seconds.toString().padStart(2, '0')}
        </span>
      );
    }
  };

  return (
    <motion.div 
      className="auction-card"
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="auction-image">
        {image ? (
          <img src={`https://gateway.pinata.cloud/ipfs/${image}`} alt={name} />
        ) : (
          <div className="auction-placeholder">
            <FaEye />
            <span>No Image</span>
          </div>
        )}
        
        <div className="auction-status">
          {isLive ? (
            <span className="status-badge status-active">Live</span>
          ) : (
            <span className="status-badge status-ended">Ended</span>
          )}
        </div>
      </div>

      <div className="auction-content">
        <h3 className="auction-title">{name || 'Untitled Auction'}</h3>
        
        <div className="auction-info">
          <div className="auction-price">
            <span className="price-label">Current Bid</span>
            <span className="price-value">
              {weiToEther(currentBid || '0')} ETH
            </span>
          </div>

          <div className="auction-seller">
            <FaUser className="seller-icon" />
            <span>{formatAddress(seller)}</span>
          </div>
        </div>

        <div className="auction-timer">
          <FaClock className="timer-icon" />
          {isLive && timeLeft > 0 ? (
            <Countdown 
              date={Date.now() + (timeLeft * 1000)}
              renderer={countdownRenderer}
            />
          ) : (
            <span className="countdown-timer ended">Auction Ended</span>
          )}
        </div>

        <div className="auction-actions">
          <Link 
            to={`/auction/${address}`} 
            className="btn btn-primary auction-view-btn"
          >
            <FaEye />
            View Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default AuctionCard;
