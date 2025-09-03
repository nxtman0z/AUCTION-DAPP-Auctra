const mongoose = require('mongoose');

// User Schema - sabhi users ka data yahan store hoga
const userSchema = new mongoose.Schema({
  // Blockchain related
  walletAddress: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  
  // Personal Information
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  
  name: {
    type: String,
    required: true,
    trim: true
  },
  
  // Verification Status
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  
  isKYCVerified: {
    type: Boolean,
    default: false
  },
  
  // User Role
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  
  // Profile Information
  profilePicture: {
    type: String,
    default: ''
  },
  
  phone: {
    type: String,
    default: ''
  },
  
  country: {
    type: String,
    default: ''
  },
  
  // Statistics
  stats: {
    auctionsCreated: {
      type: Number,
      default: 0
    },
    auctionsWon: {
      type: Number,
      default: 0
    },
    totalBids: {
      type: Number,
      default: 0
    },
    totalSpent: {
      type: Number,
      default: 0
    },
    totalEarned: {
      type: Number,
      default: 0
    }
  },
  
  // Verification codes
  emailVerificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  
  // Timestamps
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true, // automatically adds createdAt and updatedAt
});

// Indexes for faster queries
userSchema.index({ walletAddress: 1 });
userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });

// Virtual field for full name display
userSchema.virtual('displayName').get(function() {
  return this.name || this.walletAddress.slice(0, 6) + '...';
});

module.exports = mongoose.model('User', userSchema);
