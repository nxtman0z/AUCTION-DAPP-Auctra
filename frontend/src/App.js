import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [account, setAccount] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      if (window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        setAccount(accounts[0]);
        console.log('Connected to:', accounts[0]);
      } else {
        alert('Please install MetaMask!');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    // Check if already connected
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' })
        .then(accounts => {
          if (accounts.length > 0) {
            setAccount(accounts[0]);
          }
        });
    }
  }, []);

  return (
    <div className="App">
      <div className="app-container">
        {/* Header */}
        <header className="app-header">
          <div className="logo">
            <h1>🔨 AuctionHub</h1>
            <p>Decentralized Auction Platform</p>
          </div>
          
          <div className="wallet-section">
            {account ? (
              <div className="wallet-connected">
                <span className="wallet-address">
                  {account.slice(0, 6)}...{account.slice(-4)}
                </span>
                <span className="status-badge connected">Connected</span>
              </div>
            ) : (
              <button 
                onClick={connectWallet}
                disabled={isConnecting}
                className="connect-btn"
              >
                {isConnecting ? 'Connecting...' : '🦊 Connect Wallet'}
              </button>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="main-content">
          <div className="hero-section">
            <h2>Welcome to AuctionHub</h2>
            <p>Your Contract Address: <strong>0xb3D30679bB845d16F4119de72404a4699e5ab4f3</strong></p>
            
            {account ? (
              <div className="dashboard">
                <h3>🎉 Wallet Connected Successfully!</h3>
                <div className="wallet-info">
                  <p><strong>Your Address:</strong> {account}</p>
                  <p><strong>Network:</strong> Please ensure you're on the correct network</p>
                </div>
                
                <div className="features-grid">
                  <div className="feature-card">
                    <h4>🔍 View Auctions</h4>
                    <p>Browse all active auctions</p>
                    <button className="feature-btn" disabled>Coming Soon</button>
                  </div>
                  
                  <div className="feature-card">
                    <h4>➕ Create Auction</h4>
                    <p>List your items for auction</p>
                    <button className="feature-btn" disabled>Coming Soon</button>
                  </div>
                  
                  <div className="feature-card">
                    <h4>💰 Place Bids</h4>
                    <p>Bid on exciting items</p>
                    <button className="feature-btn" disabled>Coming Soon</button>
                  </div>
                  
                  <div className="feature-card">
                    <h4>👤 Profile</h4>
                    <p>Manage your account</p>
                    <button className="feature-btn" disabled>Coming Soon</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="connect-prompt">
                <h3>Connect Your Wallet to Get Started</h3>
                <p>To use AuctionHub, you need to connect your MetaMask wallet.</p>
                
                <div className="steps">
                  <div className="step">
                    <span className="step-number">1</span>
                    <p>Install MetaMask if you haven't already</p>
                  </div>
                  <div className="step">
                    <span className="step-number">2</span>
                    <p>Click "Connect Wallet" above</p>
                  </div>
                  <div className="step">
                    <span className="step-number">3</span>
                    <p>Approve the connection in MetaMask</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="app-footer">
          <p>&copy; 2025 AuctionHub - Powered by Blockchain Technology</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
