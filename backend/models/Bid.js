const mongoose = require('mongoose');

// Bid Schema - har bid ka record
const bidSchema = new mongoose.Schema({
  // Auction Reference
  auction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auction',
    required: true
  },
  
  auctionContract: {
    type: String,
    required: true,
    lowercase: true
  },
  
  // Bidder Information
  bidder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  bidderWallet: {
    type: String,
    required: true,
    lowercase: true
  },
  
  // Bid Details
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  
  // Blockchain Transaction
  transactionHash: {
    type: String,
    required: true,
    unique: true
  },
  
  blockNumber: {
    type: Number,
    required: true
  },
  
  gasUsed: Number,
  gasPrice: String,
  
  // Bid Status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'outbid', 'winning', 'won', 'refunded'],
    default: 'pending'
  },
  
  // Previous highest bid (for context)
  previousHighestBid: {
    amount: Number,
    bidder: String
  },
  
  // Refund Information
  refund: {
    processed: {
      type: Boolean,
      default: false
    },
    transactionHash: String,
    processedAt: Date,
    amount: Number
  },
  
  // Additional metadata
  metadata: {
    userAgent: String,
    ipAddress: String,
    country: String,
    bidStrategy: {
      type: String,
      enum: ['manual', 'auto', 'snipe'],
      default: 'manual'
    }
  }
}, {
  timestamps: true
});

// Indexes
bidSchema.index({ auction: 1, createdAt: -1 });
bidSchema.index({ bidder: 1, createdAt: -1 });
bidSchema.index({ auctionContract: 1 });
bidSchema.index({ transactionHash: 1 });
bidSchema.index({ status: 1 });
bidSchema.index({ amount: -1 });

// Compound indexes
bidSchema.index({ auction: 1, amount: -1 });
bidSchema.index({ bidder: 1, status: 1 });

module.exports = mongoose.model('Bid', bidSchema);
