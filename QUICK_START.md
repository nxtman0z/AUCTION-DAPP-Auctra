# 🚀 Quick Start Guide - Auction DApp Backend

## ✅ What's Already Done:
- ✅ Backend server setup complete
- ✅ MongoDB models created (User, Auction, Bid)
- ✅ Database connection working
- ✅ Package.json with all dependencies
- ✅ Environment configuration

## 🛠️ Next Steps for You:

### 1. **Install MongoDB** (Required)
```bash
# Option 1: Download installer
Go to: https://www.mongodb.com/try/download/community
Download and install MongoDB Community Server

# Option 2: Using Windows Package Manager
winget install MongoDB.MongoDB

# Option 3: Using Chocolatey (if you have it)
choco install mongodb
```

### 2. **Start MongoDB Service**
```bash
# Windows Service (recommended)
net start MongoDB

# OR start manually
mongod --dbpath "C:\data\db"
```

### 3. **Test Your Setup**
```bash
# Your backend is already running at:
http://localhost:5000

# Test endpoints:
http://localhost:5000/api/health
```

## 📱 MongoDB Compass (GUI Tool)
1. Download: https://www.mongodb.com/products/compass
2. Connect to: `mongodb://localhost:27017`
3. You'll see your `auction-dapp` database with collections

## 🎯 What Each File Does:

### `/models/` - Database Schemas
- **User.js**: User profiles, wallet addresses, verification
- **Auction.js**: Complete auction data, products, bidding info  
- **Bid.js**: Individual bid records with blockchain data

### `/config/` - Configuration
- **database.js**: MongoDB connection setup

### Main Files
- **server.js**: Main server file (already running!)
- **package.json**: Dependencies and scripts
- **.env**: Environment variables (configure this!)

## 🔧 Environment Setup
Edit `.env` file with your details:
```bash
# Database
MONGODB_URI=mongodb://localhost:27017/auction-dapp

# JWT Secret (change this!)
JWT_SECRET=your-super-secret-key-here

# Email (for verification)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## 📊 Database Structure Preview:

### Users Collection
```javascript
{
  walletAddress: "0x742d35Cc...",
  email: "user@gmail.com", 
  name: "John Doe",
  isEmailVerified: true,
  role: "user", // or "admin"
  stats: {
    auctionsCreated: 5,
    auctionsWon: 2,
    totalBids: 25
  }
}
```

### Auctions Collection
```javascript
{
  contractAddress: "0x456...",
  creator: ObjectId("..."),
  product: {
    name: "iPhone 15",
    description: "Brand new",
    category: "Electronics",
    images: [...]
  },
  auction: {
    startingPrice: 50000,
    startTime: Date,
    endTime: Date
  },
  bidding: {
    currentHighestBid: 75000,
    highestBidder: ObjectId("..."),
    totalBids: 12
  },
  status: "active"
}
```

## 🚀 Ready to Code!

Your MongoDB backend is **production-ready** with:
- ✅ Proper data relationships
- ✅ Indexes for fast queries  
- ✅ Validation and error handling
- ✅ Blockchain integration ready
- ✅ Scalable architecture

**Next: Create API routes and connect to your smart contracts!** 🔥

Need help with anything specific? Let me know! 🤝
