import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Badge, Table, Modal } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { FaClock, FaGavel, FaUser, FaHistory, FaTrophy } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const AuctionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, theme } = useAuth();
  const [auction, setAuction] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [bidHistory, setBidHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Mock auction data
  useEffect(() => {
    const mockAuction = {
      id: parseInt(id),
      title: "Vintage Rolex Watch",
      description: "Rare 1970s Rolex Submariner in excellent condition. This timepiece features the iconic black dial and matching bezel, with tritium hour markers that have developed a beautiful patina over time. The watch has been serviced recently and comes with original box and papers. A true collector's piece that represents the golden age of Rolex manufacturing.",
      images: [
        "https://via.placeholder.com/600x400?text=Vintage+Watch+1",
        "https://via.placeholder.com/600x400?text=Vintage+Watch+2",
        "https://via.placeholder.com/600x400?text=Vintage+Watch+3"
      ],
      currentBid: 5200,
      startingPrice: 3000,
      totalBids: 12,
      timeLeft: 2 * 24 * 60 * 60 * 1000, // 2 days
      status: "active",
      category: "Watches",
      seller: "john_collector",
      condition: "Excellent",
      specifications: {
        "Brand": "Rolex",
        "Model": "Submariner",
        "Year": "1970s",
        "Case Material": "Stainless Steel",
        "Movement": "Automatic",
        "Water Resistance": "200m"
      }
    };

    const mockBidHistory = [
      { id: 1, bidder: "watch_enthusiast", amount: 5200, timestamp: new Date(Date.now() - 30000) },
      { id: 2, bidder: "collector_123", amount: 5000, timestamp: new Date(Date.now() - 300000) },
      { id: 3, bidder: "vintage_lover", amount: 4800, timestamp: new Date(Date.now() - 600000) },
      { id: 4, bidder: "timepiece_fan", amount: 4500, timestamp: new Date(Date.now() - 900000) },
      { id: 5, bidder: "luxury_buyer", amount: 4200, timestamp: new Date(Date.now() - 1200000) }
    ];

    setAuction(mockAuction);
    setBidHistory(mockBidHistory);
    setTimeLeft(mockAuction.timeLeft);
  }, [id]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1000) {
            if (auction) {
              setAuction(prev => ({ ...prev, status: 'ended' }));
            }
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft, auction]);

  const formatTimeLeft = (time) => {
    if (time <= 0) return "Auction Ended";
    
    const days = Math.floor(time / (1000 * 60 * 60 * 24));
    const hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((time % (1000 * 60)) / 1000);
    
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  const handlePlaceBid = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    if (!user.isVerified) {
      setError('Please complete KYC verification to place bids');
      return;
    }

    const bid = parseFloat(bidAmount);
    if (!bid || bid <= auction.currentBid) {
      setError(`Bid must be higher than current bid of $${auction.currentBid}`);
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update auction
      setAuction(prev => ({
        ...prev,
        currentBid: bid,
        totalBids: prev.totalBids + 1
      }));
      
      // Add to bid history
      const newBid = {
        id: bidHistory.length + 1,
        bidder: user.name,
        amount: bid,
        timestamp: new Date()
      };
      setBidHistory(prev => [newBid, ...prev]);
      
      setSuccess(`Your bid of $${bid.toLocaleString()} has been placed successfully!`);
      setBidAmount('');
      
    } catch (error) {
      setError('Failed to place bid. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!auction) {
    return (
      <Container className="py-4">
        <div className="text-center">
          <h4>Loading auction details...</h4>
        </div>
      </Container>
    );
  }

  return (
    <>
      <Container className="py-4">
        <Row>
          {/* Main Content */}
          <Col lg={8}>
            {/* Image Gallery */}
            <Card className={`mb-4 ${theme === 'dark' ? 'bg-dark text-light' : ''}`}>
              <Card.Body>
                <div className="text-center">
                  <img
                    src={auction.images[0]}
                    alt={auction.title}
                    className="img-fluid rounded"
                    style={{ maxHeight: '400px' }}
                  />
                </div>
              </Card.Body>
            </Card>

            {/* Description */}
            <Card className={`mb-4 ${theme === 'dark' ? 'bg-dark text-light' : ''}`}>
              <Card.Body>
                <h5 className="fw-bold mb-3">Description</h5>
                <p className="mb-3">{auction.description}</p>
                
                <h6 className="fw-bold mb-3">Specifications</h6>
                <Table striped bordered hover size="sm" variant={theme}>
                  <tbody>
                    {Object.entries(auction.specifications).map(([key, value]) => (
                      <tr key={key}>
                        <td className="fw-medium">{key}</td>
                        <td>{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>

            {/* Bid History */}
            <Card className={`${theme === 'dark' ? 'bg-dark text-light' : ''}`}>
              <Card.Header>
                <h5 className="mb-0">
                  <FaHistory className="me-2" />
                  Bid History ({bidHistory.length})
                </h5>
              </Card.Header>
              <Card.Body>
                {bidHistory.length > 0 ? (
                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {bidHistory.map((bid, index) => (
                      <div key={bid.id} className={`d-flex justify-content-between align-items-center py-2 ${index < bidHistory.length - 1 ? 'border-bottom' : ''}`}>
                        <div>
                          <strong>${bid.amount.toLocaleString()}</strong>
                          <small className="text-muted ms-2">
                            by {bid.bidder === user?.name ? 'You' : bid.bidder}
                          </small>
                        </div>
                        <small className="text-muted">
                          {bid.timestamp.toLocaleString()}
                        </small>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted mb-0">No bids yet. Be the first to bid!</p>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* Sidebar */}
          <Col lg={4}>
            {/* Auction Info */}
            <Card className={`mb-4 ${theme === 'dark' ? 'bg-dark text-light' : ''}`}>
              <Card.Header>
                <h4 className="mb-0">{auction.title}</h4>
              </Card.Header>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <Badge bg="primary">{auction.category}</Badge>
                  <Badge bg={auction.status === 'active' ? 'success' : 'secondary'}>
                    {auction.status}
                  </Badge>
                </div>

                <div className="text-center mb-4">
                  <h2 className="text-primary fw-bold mb-1">
                    ${auction.currentBid.toLocaleString()}
                  </h2>
                  <small className="text-muted">
                    Starting bid: ${auction.startingPrice.toLocaleString()}
                  </small>
                </div>

                <div className="text-center mb-4">
                  <div className={`fw-bold mb-2 ${timeLeft < 60000 ? 'text-danger' : 'text-warning'}`}>
                    <FaClock className="me-2" />
                    {formatTimeLeft(timeLeft)}
                  </div>
                  <small className="text-muted">
                    <FaGavel className="me-1" />
                    {auction.totalBids} bids
                  </small>
                </div>

                <div className="mb-3">
                  <small className="text-muted">Seller</small>
                  <div className="fw-medium">
                    <FaUser className="me-2" />
                    {auction.seller}
                  </div>
                </div>

                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}

                {auction.status === 'active' ? (
                  <Form onSubmit={handlePlaceBid}>
                    <Form.Group className="mb-3">
                      <Form.Label>Your Bid</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder={`Minimum: $${auction.currentBid + 1}`}
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        min={auction.currentBid + 1}
                        step="0.01"
                      />
                    </Form.Group>
                    <Button 
                      type="submit" 
                      variant="primary" 
                      size="lg" 
                      className="w-100"
                      disabled={loading}
                    >
                      {loading ? 'Placing Bid...' : 'Place Bid'}
                    </Button>
                  </Form>
                ) : (
                  <div className="text-center">
                    <FaTrophy size={40} className="text-warning mb-3" />
                    <h5 className="text-success">Auction Ended</h5>
                    {bidHistory.length > 0 && (
                      <div>
                        <p className="mb-0">Winner:</p>
                        <strong>{bidHistory[0].bidder}</strong>
                        <p className="text-muted">
                          Winning bid: ${bidHistory[0].amount.toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </Card.Body>
            </Card>

            {/* Seller Info */}
            <Card className={`${theme === 'dark' ? 'bg-dark text-light' : ''}`}>
              <Card.Header>
                <h6 className="mb-0">Seller Information</h6>
              </Card.Header>
              <Card.Body>
                <div className="text-center">
                  <FaUser size={40} className="text-muted mb-2" />
                  <h6 className="fw-bold">{auction.seller}</h6>
                  <p className="text-muted small mb-2">Joined: Jan 2020</p>
                  <Badge bg="success" className="mb-2">Verified</Badge>
                  <div className="small text-muted">
                    <div>Rating: ⭐⭐⭐⭐⭐ (4.8/5)</div>
                    <div>Total Sales: 127</div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Login Modal */}
      <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Login Required</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>You need to be logged in to place bids.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLoginModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => navigate('/login')}>
            Go to Login
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AuctionDetails;
