import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [account, setAccount] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Mock auctions data (replace with real data later)
  const [auctions] = useState([
    {
      id: 1,
      title: "Vintage Ferrari Model",
      description: "Rare 1965 Ferrari 250 GT collectible model",
      image: "https://via.placeholder.com/300x200/ff6b6b/white?text=Ferrari",
      currentBid: "2.5",
      timeLeft: "2h 15m",
      seller: "0x742d35Cc...",
      status: "active"
    },
    {
      id: 2,
      title: "Digital Art NFT",
      description: "Unique digital artwork by famous artist",
      image: "https://via.placeholder.com/300x200/4ecdc4/white?text=NFT+Art",
      currentBid: "1.8",
      timeLeft: "5h 30m",
      seller: "0x8ba1f109...",
      status: "active"
    },
    {
      id: 3,
      title: "Limited Edition Watch",
      description: "Swiss luxury watch, limited edition",
      image: "https://via.placeholder.com/300x200/45b7d1/white?text=Watch",
      currentBid: "3.2",
      timeLeft: "1d 8h",
      seller: "0x9c58c4f2...",
      status: "active"
    }
  ]);

  // Connect wallet function
  const connectWallet = async () => {
    try {
      setLoading(true);
      if (window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        setAccount(accounts[0]);
        
        // Mock user data (replace with smart contract call)
        setUser({
          address: accounts[0],
          email: "user@example.com",
          isVerified: true,
          isAdmin: false,
          auctionsCreated: 3,
          auctionsWon: 1
        });
        
        console.log('Connected to:', accounts[0]);
        alert('✅ Wallet connected successfully!');
      } else {
        alert('❌ Please install MetaMask!');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('❌ Failed to connect wallet');
    } finally {
      setLoading(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setAccount('');
    setUser(null);
    alert('👋 Wallet disconnected');
  };

  // Check if wallet is already connected
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' })
        .then(accounts => {
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            // Mock user data
            setUser({
              address: accounts[0],
              email: "user@example.com",
              isVerified: true,
              isAdmin: false,
              auctionsCreated: 3,
              auctionsWon: 1
            });
          }
        })
        .catch(console.error);
    }
  }, []);

  // Components (inline for simplicity)
  const Header = ({ currentPage, setCurrentPage, account, user, onConnect, onDisconnect, loading }) => (
    <header className="header">
      <div className="container">
        <div className="logo">
          <h1>🎯 AuctionHub</h1>
        </div>
        
        <nav className="nav">
          <button 
            onClick={() => setCurrentPage('home')} 
            className={currentPage === 'home' ? 'nav-link active' : 'nav-link'}
          >
            🏠 Home
          </button>
          <button 
            onClick={() => setCurrentPage('auctions')} 
            className={currentPage === 'auctions' ? 'nav-link active' : 'nav-link'}
          >
            🔨 Auctions
          </button>
          {account && (
            <button 
              onClick={() => setCurrentPage('create')} 
              className={currentPage === 'create' ? 'nav-link active' : 'nav-link'}
            >
              ➕ Create
            </button>
          )}
          {account && (
            <button 
              onClick={() => setCurrentPage('profile')} 
              className={currentPage === 'profile' ? 'nav-link active' : 'nav-link'}
            >
              👤 Profile
            </button>
          )}
          {account && user?.isAdmin && (
            <button 
              onClick={() => setCurrentPage('admin')} 
              className={currentPage === 'admin' ? 'nav-link active' : 'nav-link'}
            >
              👑 Admin
            </button>
          )}
        </nav>
        
        <div className="wallet-section">
          {account ? (
            <div className="wallet-connected">
              <div className="user-info">
                <span className="wallet-address">{account.slice(0, 6)}...{account.slice(-4)}</span>
                {user && <span className="user-status">{user.isVerified ? '✅' : '⏳'}</span>}
              </div>
              <button onClick={onDisconnect} className="btn-secondary">Disconnect</button>
            </div>
          ) : (
            <button onClick={onConnect} disabled={loading} className="btn-primary">
              {loading ? '🔄 Connecting...' : '🔗 Connect Wallet'}
            </button>
          )}
        </div>
      </div>
    </header>
  );

  const HomePage = ({ auctions, setCurrentPage }) => (
    <div className="page">
      <div className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Welcome to <span className="gradient-text">AuctionHub</span></h1>
            <p className="hero-subtitle">
              🚀 The future of decentralized auctions. Buy, sell, and bid on unique items 
              with complete transparency and security powered by blockchain technology.
            </p>
            <div className="hero-buttons">
              <button onClick={() => setCurrentPage('auctions')} className="btn-primary large">
                🔨 Explore Auctions
              </button>
              <button onClick={() => setCurrentPage('create')} className="btn-secondary large">
                ➕ Create Auction
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="featured-section">
        <div className="container">
          <h2 className="section-title">⭐ Featured Auctions</h2>
          <div className="auctions-grid">
            {auctions.slice(0, 3).map(auction => (
              <div key={auction.id} className="auction-card">
                <div className="auction-image">
                  <img src={auction.image} alt={auction.title} />
                  <div className="auction-status">🔴 LIVE</div>
                </div>
                <div className="auction-info">
                  <h3>{auction.title}</h3>
                  <p>{auction.description}</p>
                  <div className="auction-details">
                    <div className="current-bid">
                      <span className="label">Current Bid:</span>
                      <span className="value">{auction.currentBid} ETH</span>
                    </div>
                    <div className="time-left">
                      <span className="label">Time Left:</span>
                      <span className="value">{auction.timeLeft}</span>
                    </div>
                  </div>
                  <button className="btn-primary">📝 Place Bid</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const AuctionsPage = ({ auctions, account }) => (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>🔨 All Auctions</h1>
          <p>Discover and bid on amazing items</p>
        </div>
        
        <div className="auctions-grid">
          {auctions.map(auction => (
            <div key={auction.id} className="auction-card">
              <div className="auction-image">
                <img src={auction.image} alt={auction.title} />
                <div className="auction-status">🔴 LIVE</div>
              </div>
              <div className="auction-info">
                <h3>{auction.title}</h3>
                <p>{auction.description}</p>
                <div className="auction-details">
                  <div className="current-bid">
                    <span className="label">Current Bid:</span>
                    <span className="value">{auction.currentBid} ETH</span>
                  </div>
                  <div className="time-left">
                    <span className="label">Time Left:</span>
                    <span className="value">{auction.timeLeft}</span>
                  </div>
                  <div className="seller">
                    <span className="label">Seller:</span>
                    <span className="value">{auction.seller}</span>
                  </div>
                </div>
                {account ? (
                  <button className="btn-primary">📝 Place Bid</button>
                ) : (
                  <button className="btn-secondary" disabled>Connect Wallet to Bid</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const CreateAuction = ({ account, user }) => (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>➕ Create New Auction</h1>
          <p>List your item for bidding</p>
        </div>
        
        <div className="form-container">
          <form className="auction-form">
            <div className="form-group">
              <label>Product Name</label>
              <input type="text" placeholder="Enter product name" className="form-input" />
            </div>
            
            <div className="form-group">
              <label>Description</label>
              <textarea placeholder="Describe your item" className="form-input" rows="4"></textarea>
            </div>
            
            <div className="form-group">
              <label>Starting Price (ETH)</label>
              <input type="number" step="0.01" placeholder="0.1" className="form-input" />
            </div>
            
            <div className="form-group">
              <label>Auction Duration</label>
              <select className="form-input">
                <option value="24">24 Hours</option>
                <option value="48">48 Hours</option>
                <option value="72">3 Days</option>
                <option value="168">1 Week</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Product Images</label>
              <div className="file-upload">
                <input type="file" multiple accept="image/*" />
                <p>Click to upload or drag and drop</p>
              </div>
            </div>
            
            <button type="submit" className="btn-primary large">🚀 Create Auction</button>
          </form>
        </div>
      </div>
    </div>
  );

  const ProfilePage = ({ account, user }) => (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>👤 My Profile</h1>
          <p>Manage your account and view your activity</p>
        </div>
        
        <div className="profile-container">
          <div className="profile-card">
            <div className="profile-header">
              <div className="profile-avatar">👤</div>
              <div className="profile-info">
                <h2>User Profile</h2>
                <p className="wallet-address">{account}</p>
              </div>
            </div>
            
            <div className="profile-stats">
              <div className="stat">
                <span className="stat-value">{user?.auctionsCreated || 0}</span>
                <span className="stat-label">Auctions Created</span>
              </div>
              <div className="stat">
                <span className="stat-value">{user?.auctionsWon || 0}</span>
                <span className="stat-label">Auctions Won</span>
              </div>
              <div className="stat">
                <span className="stat-value">{user?.isVerified ? '✅' : '⏳'}</span>
                <span className="stat-label">Verification Status</span>
              </div>
            </div>
            
            <div className="profile-details">
              <div className="detail-item">
                <strong>Email:</strong> {user?.email || 'Not set'}
              </div>
              <div className="detail-item">
                <strong>Member Since:</strong> January 2024
              </div>
              <div className="detail-item">
                <strong>Role:</strong> {user?.isAdmin ? '👑 Admin' : '👤 User'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const AdminPanel = ({ account, user }) => (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>👑 Admin Panel</h1>
          <p>Platform management and user administration</p>
        </div>
        
        <div className="admin-container">
          <div className="admin-stats">
            <div className="admin-card">
              <h3>📊 Platform Statistics</h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="number">156</span>
                  <span className="label">Total Users</span>
                </div>
                <div className="stat-item">
                  <span className="number">24</span>
                  <span className="label">Active Auctions</span>
                </div>
                <div className="stat-item">
                  <span className="number">1,234</span>
                  <span className="label">Total Bids</span>
                </div>
                <div className="stat-item">
                  <span className="number">45.6 ETH</span>
                  <span className="label">Total Volume</span>
                </div>
              </div>
            </div>
            
            <div className="admin-card">
              <h3>🔧 Quick Actions</h3>
              <div className="admin-actions">
                <button className="admin-btn">✅ Verify User</button>
                <button className="admin-btn">👑 Add Admin</button>
                <button className="admin-btn">💰 Update Fees</button>
                <button className="admin-btn">⏸️ Pause Platform</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render current page
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage auctions={auctions} setCurrentPage={setCurrentPage} />;
      case 'auctions':
        return <AuctionsPage auctions={auctions} account={account} />;
      case 'create':
        return account ? <CreateAuction account={account} user={user} /> : 
               <div className="auth-required">
                 <h2>🔒 Authentication Required</h2>
                 <p>Please connect your wallet to create auctions</p>
                 <button onClick={connectWallet} className="btn-primary">Connect Wallet</button>
               </div>;
      case 'profile':
        return account ? <ProfilePage account={account} user={user} /> : 
               <div className="auth-required">
                 <h2>🔒 Authentication Required</h2>
                 <p>Please connect your wallet to view profile</p>
                 <button onClick={connectWallet} className="btn-primary">Connect Wallet</button>
               </div>;
      case 'admin':
        return (account && user?.isAdmin) ? <AdminPanel account={account} user={user} /> : 
               <div className="auth-required">
                 <h2>👑 Admin Access Required</h2>
                 <p>Only administrators can access this panel</p>
               </div>;
      default:
        return <HomePage auctions={auctions} setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="App">
      <Header 
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        account={account}
        user={user}
        onConnect={connectWallet}
        onDisconnect={disconnectWallet}
        loading={loading}
      />
      
      <main className="main-content">
        {renderPage()}
      </main>
      
      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 AuctionHub - Decentralized Auction Platform</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
