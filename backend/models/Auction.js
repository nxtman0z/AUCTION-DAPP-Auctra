const mongoose = require('mongoose');

// Auction Schema - har auction ka complete data
const auctionSchema = new mongoose.Schema({
  // Blockchain Information
  contractAddress: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  
  transactionHash: {
    type: String,
    required: true
  },
  
  blockNumber: {
    type: Number,
    required: true
  },
  
  // Creator Information
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  creatorWallet: {
    type: String,
    required: true,
    lowercase: true
  },
  
  // Product Details
  product: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true,
      enum: ['Electronics', 'Fashion', 'Home', 'Sports', 'Books', 'Art', 'Collectibles', 'Other']
    },
    condition: {
      type: String,
      enum: ['New', 'Like New', 'Good', 'Fair', 'Poor'],
      default: 'New'
    },
    images: [{
      url: String,
      publicId: String, // Cloudinary public ID
      isPrimary: {
        type: Boolean,
        default: false
      }
    }],
    specifications: [{
      key: String,
      value: String
    }]
  },
  
  // Auction Configuration
  auction: {
    startingPrice: {
      type: Number,
      required: true,
      min: 0
    },
    reservePrice: {
      type: Number,
      default: 0
    },
    startTime: {
      type: Date,
      required: true
    },
    endTime: {
      type: Date,
      required: true
    },
    durationHours: {
      type: Number,
      required: true
    }
  },
  
  // Current Bidding Status
  bidding: {
    currentHighestBid: {
      type: Number,
      default: 0
    },
    highestBidder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    highestBidderWallet: {
      type: String,
      lowercase: true
    },
    totalBids: {
      type: Number,
      default: 0
    },
    uniqueBidders: {
      type: Number,
      default: 0
    }
  },
  
  // Auction Status
  status: {
    type: String,
    enum: ['pending', 'active', 'ended', 'cancelled', 'completed'],
    default: 'pending'
  },
  
  // Result Information
  result: {
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    winnerWallet: String,
    winningBid: Number,
    platformFee: Number,
    sellerAmount: Number,
    endedAt: Date,
    endedBy: String // 'automatic', 'manual', 'cancelled'
  },
  
  // Additional Metadata
  metadata: {
    views: {
      type: Number,
      default: 0
    },
    watchers: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      addedAt: {
        type: Date,
        default: Date.now
      }
    }],
    featured: {
      type: Boolean,
      default: false
    },
    tags: [String]
  },
  
  // Shipping Information (if applicable)
  shipping: {
    required: {
      type: Boolean,
      default: true
    },
    cost: {
      type: Number,
      default: 0
    },
    methods: [String],
    regions: [String]
  }
}, {
  timestamps: true
});

// Indexes for performance
auctionSchema.index({ contractAddress: 1 });
auctionSchema.index({ creator: 1 });
auctionSchema.index({ status: 1 });
auctionSchema.index({ 'auction.endTime': 1 });
auctionSchema.index({ 'product.category': 1 });
auctionSchema.index({ createdAt: -1 });
auctionSchema.index({ 'bidding.currentHighestBid': -1 });

// Compound indexes
auctionSchema.index({ status: 1, 'auction.endTime': 1 });
auctionSchema.index({ 'product.category': 1, status: 1 });

// Virtual fields
auctionSchema.virtual('isActive').get(function() {
  const now = new Date();
  return this.status === 'active' && 
         this.auction.startTime <= now && 
         this.auction.endTime > now;
});

auctionSchema.virtual('timeRemaining').get(function() {
  const now = new Date();
  if (this.auction.endTime > now) {
    return this.auction.endTime - now;
  }
  return 0;
});

auctionSchema.virtual('primaryImage').get(function() {
  const primaryImg = this.product.images.find(img => img.isPrimary);
  return primaryImg ? primaryImg.url : (this.product.images[0] ? this.product.images[0].url : '');
});

module.exports = mongoose.model('Auction', auctionSchema);
