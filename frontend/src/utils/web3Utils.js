import Web3 from 'web3';
import { CONTRACT_CONFIG, AUCTION_FACTORY_ABI, SIMPLE_AUCTION_ABI } from './contractConfig';

let web3;
let auctionFactoryContract;
let accounts = [];

// Initialize Web3
export const initWeb3 = async () => {
  try {
    // Modern dapp browsers
    if (window.ethereum) {
      web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
    }
    // Legacy dapp browsers
    else if (window.web3) {
      web3 = new Web3(window.web3.currentProvider);
    }
    // Fallback to localhost (for development)
    else {
      console.log('No web3 instance injected, using Local web3.');
      web3 = new Web3(new Web3.providers.HttpProvider(CONTRACT_CONFIG.RPC_URL));
    }

    // Get accounts
    accounts = await web3.eth.getAccounts();
    console.log('Connected accounts:', accounts);

    // Initialize contract
    auctionFactoryContract = new web3.eth.Contract(
      AUCTION_FACTORY_ABI,
      CONTRACT_CONFIG.AUCTION_FACTORY_ADDRESS
    );

    return {
      web3,
      accounts,
      contract: auctionFactoryContract
    };
  } catch (error) {
    console.error('Error initializing web3:', error);
    throw error;
  }
};

// Get current account
export const getCurrentAccount = async () => {
  if (!web3) await initWeb3();
  const accounts = await web3.eth.getAccounts();
  return accounts[0];
};

// Connect wallet
export const connectWallet = async () => {
  try {
    if (!window.ethereum) {
      throw new Error('Please install MetaMask!');
    }
    
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const web3Instance = new Web3(window.ethereum);
    const accounts = await web3Instance.eth.getAccounts();
    
    return {
      success: true,
      account: accounts[0],
      web3: web3Instance
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// Check if user is registered
export const isUserRegistered = async (address) => {
  try {
    if (!auctionFactoryContract) await initWeb3();
    return await auctionFactoryContract.methods.isRegisteredUser(address).call();
  } catch (error) {
    console.error('Error checking user registration:', error);
    return false;
  }
};

// Get user details
export const getUserDetails = async (address) => {
  try {
    if (!auctionFactoryContract) await initWeb3();
    const user = await auctionFactoryContract.methods.users(address).call();
    return {
      email: user.email,
      isVerified: user.isVerified,
      isAdmin: user.isAdmin,
      auctionsCreated: user.auctionsCreated,
      auctionsWon: user.auctionsWon,
      walletAddress: user.walletAddress
    };
  } catch (error) {
    console.error('Error getting user details:', error);
    return null;
  }
};

// Create auction
export const createAuction = async (productData, account) => {
  try {
    if (!auctionFactoryContract) await initWeb3();
    
    const { name, description, imageHash, startingPrice, duration } = productData;
    
    const result = await auctionFactoryContract.methods
      .createAuction(name, description, imageHash, startingPrice, duration)
      .send({ from: account });
    
    return {
      success: true,
      transactionHash: result.transactionHash,
      auctionAddress: result.events.AuctionCreated.returnValues.auctionContract
    };
  } catch (error) {
    console.error('Error creating auction:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Get all active auctions
export const getAllActiveAuctions = async () => {
  try {
    if (!auctionFactoryContract) await initWeb3();
    const auctionAddresses = await auctionFactoryContract.methods.getAllActiveAuctions().call();
    
    // Get details for each auction
    const auctions = [];
    for (let address of auctionAddresses) {
      const auctionDetails = await getAuctionDetails(address);
      if (auctionDetails) {
        auctions.push({ address, ...auctionDetails });
      }
    }
    
    return auctions;
  } catch (error) {
    console.error('Error getting active auctions:', error);
    return [];
  }
};

// Get auction details
export const getAuctionDetails = async (auctionAddress) => {
  try {
    if (!web3) await initWeb3();
    
    const auctionContract = new web3.eth.Contract(SIMPLE_AUCTION_ABI, auctionAddress);
    const details = await auctionContract.methods.getFullDetails().call();
    
    return {
      name: details.name,
      description: details.description,
      image: details.image,
      seller: details.sellerAddress,
      currentBid: details.currentBid,
      currentWinner: details.currentWinner,
      timeLeft: details.timeLeft,
      isLive: details.isLive,
      hasFinished: details.hasFinished
    };
  } catch (error) {
    console.error('Error getting auction details:', error);
    return null;
  }
};

// Place bid
export const placeBid = async (auctionAddress, bidAmount, account) => {
  try {
    if (!web3) await initWeb3();
    
    const auctionContract = new web3.eth.Contract(SIMPLE_AUCTION_ABI, auctionAddress);
    const bidAmountWei = web3.utils.toWei(bidAmount.toString(), 'ether');
    
    const result = await auctionContract.methods
      .placeBid()
      .send({ 
        from: account, 
        value: bidAmountWei 
      });
    
    return {
      success: true,
      transactionHash: result.transactionHash
    };
  } catch (error) {
    console.error('Error placing bid:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// End auction
export const endAuction = async (auctionAddress, account) => {
  try {
    if (!web3) await initWeb3();
    
    const auctionContract = new web3.eth.Contract(SIMPLE_AUCTION_ABI, auctionAddress);
    const result = await auctionContract.methods
      .endAuction()
      .send({ from: account });
    
    return {
      success: true,
      transactionHash: result.transactionHash
    };
  } catch (error) {
    console.error('Error ending auction:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Withdraw funds
export const withdrawFunds = async (auctionAddress, account) => {
  try {
    if (!web3) await initWeb3();
    
    const auctionContract = new web3.eth.Contract(SIMPLE_AUCTION_ABI, auctionAddress);
    const result = await auctionContract.methods
      .withdraw()
      .send({ from: account });
    
    return {
      success: true,
      transactionHash: result.transactionHash
    };
  } catch (error) {
    console.error('Error withdrawing funds:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Format address for display
export const formatAddress = (address) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Convert Wei to Ether
export const weiToEther = (wei) => {
  if (!web3) return '0';
  return web3.utils.fromWei(wei.toString(), 'ether');
};

// Convert Ether to Wei
export const etherToWei = (ether) => {
  if (!web3) return '0';
  return web3.utils.toWei(ether.toString(), 'ether');
};

export { web3, auctionFactoryContract };
