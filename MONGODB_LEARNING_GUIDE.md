# 📚 MongoDB Learning Guide for Auction DApp

## 🎯 What is MongoDB?
MongoDB is a **NoSQL database** that stores data in **JSON-like documents** instead of tables (like SQL). Perfect for web applications!

## 🏗️ Basic Concepts You Need to Know:

### 1. **Database** → Your entire project data
```
auction-dapp (database name)
```

### 2. **Collection** → Like a table in SQL
```
- users (collection)
- auctions (collection) 
- bids (collection)
```

### 3. **Document** → Like a row in SQL, but flexible JSON
```javascript
// Example user document
{
  _id: ObjectId("..."),
  walletAddress: "0x742d35Cc...",
  email: "user@gmail.com",
  name: "John Doe",
  isVerified: true,
  createdAt: "2025-01-15T10:30:00Z"
}
```

## 🛠️ Step-by-Step Installation:

### Step 1: Install MongoDB
```bash
# Download from: https://www.mongodb.com/try/download/community
# OR use chocolatey (if you have it):
choco install mongodb
```

### Step 2: Install Node.js packages
```bash
cd backend
npm install
```

### Step 3: Start MongoDB Service
```bash
# Windows Service (auto-start)
net start MongoDB

# OR manually:
mongod --dbpath "C:\data\db"
```

### Step 4: Start your backend
```bash
npm run dev
```

## 📝 Basic MongoDB Operations (You'll Use These):

### 1. **CREATE** (Insert Data)
```javascript
// Create new user
const user = new User({
  walletAddress: "0x123...",
  email: "test@gmail.com",
  name: "Test User"
});
await user.save(); // Saves to database
```

### 2. **READ** (Find Data)
```javascript
// Find one user
const user = await User.findOne({ email: "test@gmail.com" });

// Find all auctions
const auctions = await Auction.find({ status: "active" });

// Find with conditions
const myAuctions = await Auction.find({ creator: userId });
```

### 3. **UPDATE** (Modify Data)
```javascript
// Update user verification
await User.findByIdAndUpdate(userId, { 
  isVerified: true 
});

// Update auction status
await Auction.findByIdAndUpdate(auctionId, {
  status: "ended",
  "result.winner": winnerId
});
```

### 4. **DELETE** (Remove Data)
```javascript
// Delete a bid
await Bid.findByIdAndDelete(bidId);

// Delete user (careful!)
await User.findByIdAndDelete(userId);
```

## 🎯 Real Examples for Your Auction App:

### Example 1: Create New Auction
```javascript
const newAuction = new Auction({
  contractAddress: "0x456...",
  creator: userId,
  creatorWallet: "0x123...",
  product: {
    name: "iPhone 15",
    description: "Brand new phone",
    category: "Electronics",
    images: [{ url: "image1.jpg", isPrimary: true }]
  },
  auction: {
    startingPrice: 50000,
    startTime: new Date(),
    endTime: new Date(Date.now() + 24*60*60*1000), // 24 hours
    durationHours: 24
  }
});

await newAuction.save();
console.log("✅ Auction created!");
```

### Example 2: Place a Bid
```javascript
const newBid = new Bid({
  auction: auctionId,
  bidder: userId,
  bidderWallet: "0x789...",
  amount: 60000,
  transactionHash: "0xabc..."
});

await newBid.save();

// Update auction with new highest bid
await Auction.findByIdAndUpdate(auctionId, {
  "bidding.currentHighestBid": 60000,
  "bidding.highestBidder": userId,
  "bidding.totalBids": { $inc: 1 }
});
```

### Example 3: Get Active Auctions
```javascript
const activeAuctions = await Auction.find({ 
  status: "active",
  "auction.endTime": { $gt: new Date() } // End time > current time
})
.populate('creator', 'name walletAddress') // Join user data
.sort({ createdAt: -1 }) // Latest first
.limit(20); // Only 20 results

console.log("Active auctions:", activeAuctions);
```

## 🎪 MongoDB Compass (GUI Tool):
- Download **MongoDB Compass** for visual database management
- Connect to: `mongodb://localhost:27017`
- You can see all your data visually!

## 🔥 Pro Tips for Your Project:

### 1. **Always use await** with database operations
```javascript
// ❌ Wrong
const user = User.findOne({ email: "test@gmail.com" });

// ✅ Correct  
const user = await User.findOne({ email: "test@gmail.com" });
```

### 2. **Handle errors properly**
```javascript
try {
  const auction = await Auction.findById(auctionId);
  if (!auction) {
    return res.status(404).json({ message: "Auction not found" });
  }
} catch (error) {
  console.error("Database error:", error);
  res.status(500).json({ message: "Server error" });
}
```

### 3. **Use populate for references**
```javascript
// Get auction with creator details
const auction = await Auction.findById(auctionId)
  .populate('creator', 'name email walletAddress')
  .populate('bidding.highestBidder', 'name walletAddress');
```

## 🚀 Next Steps:
1. Install MongoDB on your system
2. Run `npm install` in backend folder
3. Start MongoDB service
4. Run `npm run dev` to start backend
5. Open `http://localhost:5000` to test

**MongoDB is like a smart JSON storage! 📊**

Need help with installation or any specific part? Let me know! 🤝
