// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Main Factory Contract
contract AuctionFactory is Ownable, Pausable {
    uint256 public platformFee = 250; // 2.5% (250/10000)
    address public feeRecipient;
    uint256 public totalAuctions;
    
    // User management
    struct User {
        string email;
        bool isVerified;
        bool isAdmin;
        uint256 auctionsCreated;
        uint256 auctionsWon;
        address walletAddress;
    }
    
    // All auctions array
    SimpleAuction[] public allAuctions;
    
    // Mappings
    mapping(address => User) public users;
    mapping(string => address) public emailToAddress; // email -> wallet address
    mapping(address => bool) public isRegisteredUser;
    mapping(address => SimpleAuction[]) public userAuctions;
    
    // Events
    event UserRegistered(address indexed userAddress, string email);
    event UserVerified(address indexed userAddress);
    event AuctionCreated(address indexed auctionContract, address indexed creator, string productName);
    event AdminAdded(address indexed admin);
    
    constructor() Ownable(msg.sender) {
        feeRecipient = msg.sender;
        // Make deployer the first admin
        users[msg.sender] = User("admin@auctionhub.com", true, true, 0, 0, msg.sender);
        isRegisteredUser[msg.sender] = true;
    }
    
    // User Registration (called by backend after email verification)
    function registerUser(address userAddress, string memory email) external onlyOwner {
        require(!isRegisteredUser[userAddress], "User already registered");
        require(emailToAddress[email] == address(0), "Email already used");
        
        users[userAddress] = User(email, true, false, 0, 0, userAddress);
        emailToAddress[email] = userAddress;
        isRegisteredUser[userAddress] = true;
        
        emit UserRegistered(userAddress, email);
    }
    
    // Add admin (only existing admin can add)
    function addAdmin(address adminAddress) external onlyOwner {
        require(isRegisteredUser[adminAddress], "User must be registered first");
        users[adminAddress].isAdmin = true;
        emit AdminAdded(adminAddress);
    }
    
    // Create auction (only verified users)
    function createAuction(
        string memory productName,
        string memory productDescription,
        string memory imageHash,
        uint256 startingPrice,
        uint256 durationInHours
    ) external returns (address) {
        require(isRegisteredUser[msg.sender], "User not registered");
        require(users[msg.sender].isVerified, "User not verified");
        require(durationInHours >= 1 && durationInHours <= 168, "Duration must be 1-168 hours");
        
        SimpleAuction newAuction = new SimpleAuction(
            msg.sender,
            productName,
            productDescription,
            imageHash,
            startingPrice,
            durationInHours,
            platformFee,
            feeRecipient
        );
        
        allAuctions.push(newAuction);
        userAuctions[msg.sender].push(newAuction);
        users[msg.sender].auctionsCreated++;
        totalAuctions++;
        
        emit AuctionCreated(address(newAuction), msg.sender, productName);
        return address(newAuction);
    }
    
    // Get all active auctions
    function getAllActiveAuctions() external view returns (address[] memory) {
        address[] memory activeAuctions = new address[](allAuctions.length);
        uint256 activeCount = 0;
        
        for (uint256 i = 0; i < allAuctions.length; i++) {
            if (allAuctions[i].checkIfActive()) {
                activeAuctions[activeCount] = address(allAuctions[i]);
                activeCount++;
            }
        }
        
        // Resize array to actual count
        address[] memory result = new address[](activeCount);
        for (uint256 i = 0; i < activeCount; i++) {
            result[i] = activeAuctions[i];
        }
        return result;
    }
    
    // Get user's auctions
    function getUserAuctions(address user) external view returns (SimpleAuction[] memory) {
        return userAuctions[user];
    }
    
    // Check if user is admin
    function isAdmin(address user) external view returns (bool) {
        return users[user].isAdmin;
    }
    
    // Update platform fee (only admin)
    function updatePlatformFee(uint256 newFee) external onlyOwner {
        require(newFee <= 1000, "Fee cannot exceed 10%");
        platformFee = newFee;
    }
}

// Individual Auction Contract
contract SimpleAuction is ReentrancyGuard {
    // Product details
    string public productName;
    string public productDescription;
    string public imageHash; // IPFS hash
    
    // Auction details
    address payable public seller;
    uint256 public startingPrice;
    uint256 public startTime;
    uint256 public endTime;
    uint256 public platformFee;
    address public platformFeeRecipient;
    
    // Bidding state
    address public highestBidder;
    uint256 public highestBid;
    uint256 public totalBids;
    bool public auctionEnded;
    bool public cancelled;
    
    // Bid tracking
    mapping(address => uint256) public pendingReturns;
    mapping(address => bool) public hasWithdrawn;
    address[] public allBidders;
    
    // Events
    event AuctionStarted(string productName, uint256 startingPrice, uint256 endTime);
    event BidPlaced(address indexed bidder, uint256 amount, uint256 timestamp);
    event AuctionEnded(address indexed winner, uint256 winningBid);
    event MoneyWithdrawn(address indexed bidder, uint256 amount);
    event AuctionCancelled();
    
    modifier onlySeller() {
        require(msg.sender == seller, "Only seller can perform this action");
        _;
    }
    
    modifier auctionActive() {
        require(block.timestamp >= startTime, "Auction not started yet");
        require(block.timestamp <= endTime, "Auction has ended");
        require(!auctionEnded, "Auction already ended");
        require(!cancelled, "Auction cancelled");
        _;
    }
    
    constructor(
        address _seller,
        string memory _productName,
        string memory _productDescription,
        string memory _imageHash,
        uint256 _startingPrice,
        uint256 _durationInHours,
        uint256 _platformFee,
        address _feeRecipient
    ) {
        seller = payable(_seller);
        productName = _productName;
        productDescription = _productDescription;
        imageHash = _imageHash;
        startingPrice = _startingPrice;
        startTime = block.timestamp;
        endTime = block.timestamp + (_durationInHours * 1 hours);
        platformFee = _platformFee;
        platformFeeRecipient = _feeRecipient;
        highestBid = _startingPrice;
        
        emit AuctionStarted(_productName, _startingPrice, endTime);
    }
    
    // Place bid function
    function placeBid() external payable auctionActive nonReentrant {
        require(msg.sender != seller, "Seller cannot bid on own auction");
        require(msg.value > highestBid, "Bid must be higher than current highest bid");
        require(msg.value >= startingPrice, "Bid must be at least starting price");
        
        // If there's a previous highest bidder, add their bid to pending returns
        if (highestBidder != address(0)) {
            pendingReturns[highestBidder] += highestBid;
        } else {
            // First bid
            allBidders.push(msg.sender);
        }
        
        // Update highest bid
        if (highestBidder != msg.sender) {
            allBidders.push(msg.sender);
        }
        
        highestBidder = msg.sender;
        highestBid = msg.value;
        totalBids++;
        
        emit BidPlaced(msg.sender, msg.value, block.timestamp);
    }
    
    // End auction (can be called by anyone after time expires)
    function endAuction() external nonReentrant {
        require(block.timestamp > endTime || msg.sender == seller, "Auction still active");
        require(!auctionEnded, "Auction already ended");
        require(!cancelled, "Auction was cancelled");
        
        auctionEnded = true;
        
        if (highestBidder != address(0)) {
            // Calculate platform fee
            uint256 feeAmount = (highestBid * platformFee) / 10000;
            uint256 sellerAmount = highestBid - feeAmount;
            
            // Transfer platform fee
            if (feeAmount > 0 && platformFeeRecipient != address(0)) {
                payable(platformFeeRecipient).transfer(feeAmount);
            }
            
            // Transfer remaining amount to seller
            seller.transfer(sellerAmount);
            
            emit AuctionEnded(highestBidder, highestBid);
        } else {
            emit AuctionEnded(address(0), 0);
        }
    }
    
    // Withdraw money for non-winners
    function withdraw() external nonReentrant returns (bool) {
        require(auctionEnded || cancelled, "Auction still active");
        require(pendingReturns[msg.sender] > 0, "No money to withdraw");
        require(!hasWithdrawn[msg.sender], "Already withdrawn");
        
        uint256 amount = pendingReturns[msg.sender];
        hasWithdrawn[msg.sender] = true;
        pendingReturns[msg.sender] = 0;
        
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");
        
        emit MoneyWithdrawn(msg.sender, amount);
        return true;
    }
    
    // Cancel auction (only if no bids)
    function cancelAuction() external onlySeller nonReentrant {
        require(!auctionEnded, "Auction already ended");
        require(totalBids == 0, "Cannot cancel auction with existing bids");
        
        cancelled = true;
        auctionEnded = true;
        
        emit AuctionCancelled();
    }
    
    // View functions with unique names
    function getFullDetails() external view returns (
        string memory name,
        string memory description,
        string memory image,
        address sellerAddress,
        uint256 currentBid,
        address currentWinner,
        uint256 timeLeft,
        bool isLive,
        bool hasFinished
    ) {
        uint256 timeRemaining = 0;
        bool auctionIsLive = (
            block.timestamp >= startTime &&
            block.timestamp <= endTime &&
            !auctionEnded &&
            !cancelled
        );
        
        if (auctionIsLive) {
            timeRemaining = endTime - block.timestamp;
        }
        
        return (
            productName,
            productDescription,
            imageHash,
            seller,
            highestBid,
            highestBidder,
            timeRemaining,
            auctionIsLive,
            auctionEnded
        );
    }
    
    function checkIfActive() external view returns (bool) {
        return (
            block.timestamp >= startTime &&
            block.timestamp <= endTime &&
            !auctionEnded &&
            !cancelled
        );
    }
    
    function getTimeRemaining() external view returns (uint256) {
        if (auctionEnded || cancelled || block.timestamp >= endTime) {
            return 0;
        }
        return endTime - block.timestamp;
    }
    
    function getBidHistory() external view returns (address[] memory) {
        return allBidders;
    }
    
    function canWithdraw(address user) external view returns (uint256) {
        if (hasWithdrawn[user]) return 0;
        return pendingReturns[user];
    }
    
    // Check if user can get refund
    function getPendingRefund(address user) external view returns (uint256) {
        return pendingReturns[user];
    }
    
    // Get auction summary for listing page
    function getAuctionSummary() external view returns (
        string memory name,
        uint256 currentBid,
        uint256 timeLeft,
        bool isLive,
        string memory image
    ) {
        uint256 remaining = 0;
        bool live = (
            block.timestamp >= startTime &&
            block.timestamp <= endTime &&
            !auctionEnded &&
            !cancelled
        );
        
        if (live) {
            remaining = endTime - block.timestamp;
        }
        
        return (
            productName,
            highestBid,
            remaining,
            live,
            imageHash
        );
    }
}