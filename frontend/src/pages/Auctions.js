import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Form, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaSearch, FaClock, FaEye, FaGavel, FaUpload } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Auctions = () => {
  const { theme } = useAuth();
  const [auctions, setAuctions] = useState([]);
  const [filteredAuctions, setFilteredAuctions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Mock auction data - REMOVED FOR REAL BACKEND INTEGRATION
  useEffect(() => {
    // This will be replaced with real API calls later
    const mockAuctions = [];  // Empty for now, will be populated from backend
    
    setAuctions(mockAuctions);
    setFilteredAuctions(mockAuctions);
  }, []);

  // Filter and search functionality
  useEffect(() => {
    let filtered = auctions.filter(auction => {
      const matchesSearch = auction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           auction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           auction.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterStatus === 'all' || auction.status === filterStatus;
      
      return matchesSearch && matchesFilter;
    });

    // Sort auctions
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => b.id - a.id);
        break;
      case 'ending_soon':
        filtered.sort((a, b) => {
          if (a.timeLeft === -1) return 1;
          if (b.timeLeft === -1) return -1;
          return a.timeLeft - b.timeLeft;
        });
        break;
      case 'highest_bid':
        filtered.sort((a, b) => b.currentBid - a.currentBid);
        break;
      case 'most_bids':
        filtered.sort((a, b) => b.totalBids - a.totalBids);
        break;
      default:
        break;
    }

    setFilteredAuctions(filtered);
  }, [auctions, searchTerm, filterStatus, sortBy]);

  const formatTimeLeft = (timeLeft) => {
    if (timeLeft === -1) return "Ended";
    
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getStatusBadge = (status, timeLeft) => {
    if (status === 'ended') {
      return <Badge bg="secondary">Ended</Badge>;
    }
    if (timeLeft < 60 * 60 * 1000) { // Less than 1 hour
      return <Badge bg="danger">Ending Soon</Badge>;
    }
    return <Badge bg="success">Active</Badge>;
  };

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="fw-bold mb-3">Current Auctions</h1>
          <p className="text-muted">Discover unique items and place your bids</p>
        </Col>
      </Row>

      {/* Search and Filters */}
      <Row className="mb-4">
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search auctions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={3}>
          <Form.Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Auctions</option>
            <option value="active">Active</option>
            <option value="ended">Ended</option>
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="ending_soon">Ending Soon</option>
            <option value="highest_bid">Highest Bid</option>
            <option value="most_bids">Most Bids</option>
          </Form.Select>
        </Col>
      </Row>

      {/* Results count */}
      <Row className="mb-3">
        <Col>
          <p className="text-muted mb-0">
            Showing {filteredAuctions.length} of {auctions.length} auctions
          </p>
        </Col>
      </Row>

      {/* Auctions Grid */}
      <Row>
        {filteredAuctions.map(auction => (
          <Col md={6} lg={4} className="mb-4" key={auction.id}>
            <Card className={`h-100 shadow-sm auction-card ${theme === 'dark' ? 'bg-dark text-light' : ''}`}>
              <Card.Img 
                variant="top" 
                src={auction.image} 
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <Card.Body className="d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <Badge bg="primary" className="mb-2">{auction.category}</Badge>
                  {getStatusBadge(auction.status, auction.timeLeft)}
                </div>
                
                <Card.Title className="h5 mb-2">{auction.title}</Card.Title>
                <Card.Text className="text-muted small mb-3">
                  {auction.description}
                </Card.Text>
                
                <div className="mt-auto">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div>
                      <small className="text-muted d-block">Current Bid</small>
                      <h5 className="mb-0 text-primary">
                        ${auction.currentBid > 0 ? auction.currentBid.toLocaleString() : auction.startingPrice.toLocaleString()}
                      </h5>
                    </div>
                    <div className="text-end">
                      <small className="text-muted d-block">
                        <FaGavel className="me-1" />
                        {auction.totalBids} bids
                      </small>
                      <small className="text-warning fw-medium">
                        <FaClock className="me-1" />
                        {formatTimeLeft(auction.timeLeft)}
                      </small>
                    </div>
                  </div>
                  
                  {auction.status === 'ended' && auction.winner && (
                    <div className="mb-2">
                      <small className="text-muted">Won by: </small>
                      <small className="fw-medium">{auction.winner}</small>
                    </div>
                  )}
                  
                  <div className="d-grid gap-2">
                    <Button
                      as={Link}
                      to={`/auction/${auction.id}`}
                      variant={auction.status === 'ended' ? 'outline-secondary' : 'primary'}
                      size="sm"
                    >
                      <FaEye className="me-2" />
                      {auction.status === 'ended' ? 'View Results' : 'View & Bid'}
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {filteredAuctions.length === 0 && (
        <Row>
          <Col className="text-center py-5">
            <div className="mb-4">
              <div className="bg-gradient-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                   style={{ width: '100px', height: '100px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <FaGavel size={40} className="text-white" />
              </div>
            </div>
            <h3 className="fw-bold mb-3" style={{ color: '#667eea' }}>No Auctions Available</h3>
            <p className="text-muted mb-4 lead">
              {auctions.length === 0 
                ? "Be the first to create an auction on our platform!" 
                : "No auctions match your current search or filters"}
            </p>
            {auctions.length === 0 && (
              <div>
                <Button
                  as={Link}
                  to="/upload"
                  size="lg"
                  className="me-3 fw-medium rounded-3"
                  style={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none'
                  }}
                >
                  <FaUpload className="me-2" />
                  Create First Auction
                </Button>
                <Button
                  as={Link}
                  to="/"
                  variant="outline-primary"
                  size="lg"
                  className="fw-medium rounded-3"
                  style={{ 
                    borderColor: '#667eea',
                    color: '#667eea'
                  }}
                >
                  Back to Home
                </Button>
              </div>
            )}
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Auctions;
