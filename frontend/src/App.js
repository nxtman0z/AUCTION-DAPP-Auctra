import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Auctions from './pages/Auctions';
import AuctionDetails from './pages/AuctionDetails';
import UploadProduct from './pages/UploadProduct';
import MyBids from './pages/MyBids';
import AdminDashboard from './pages/AdminDashboard';
import ApplyForAdmin from './pages/ApplyForAdmin';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main style={{ minHeight: 'calc(100vh - 120px)', paddingTop: '80px' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auctions" element={<Auctions />} />
              <Route path="/auction/:id" element={<AuctionDetails />} />
              <Route path="/upload" element={<UploadProduct />} />
              <Route path="/my-bids" element={<MyBids />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/apply-admin" element={<ApplyForAdmin />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
