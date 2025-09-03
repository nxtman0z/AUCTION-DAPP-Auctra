import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Table, Alert, Tab, Tabs } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaGavel, FaTrophy, FaClock, FaEye, FaHistory } from 'react-icons/fa';

const MyBids = () => {
  const { user, theme } = useAuth();
  const [activeBids, setActiveBids] = useState([]);
  const [wonAuctions, setWonAuctions] = useState([]);
  const [bidHistory, setBidHistory] = useState([]);

  useEffect(() => {
    if (user) {
      // Mock data for user's bids
      const mockActiveBids = [
        {
          id: 1,
          auctionId: 1,
          title: "Vintage Rolex Watch",
          image: "https://via.placeholder.com/100x80?text=Watch",
          myBid: 5200,
          currentBid: 5200,
          myBidTime: new Date(Date.now() - 30000),
          timeLeft: 2 * 24 * 60 * 60 * 1000,
          status: "leading",
          totalBids: 12
        },
        {
          id: 2,
          auctionId: 2,
          title: "MacBook Pro M2",
          image: "https://via.placeholder.com/100x80?text=MacBook",
          myBid: 1650,
          currentBid: 1800,
          myBidTime: new Date(Date.now() - 300000),
          timeLeft: 5 * 60 * 60 * 1000,
          status: "outbid",
          totalBids: 8
        }
      ];

      const mockWonAuctions = [
        {
          id: 3,
          auctionId: 4,
          title: "Signed Basketball Jersey",
          image: "https://via.placeholder.com/100x80?text=Jersey",
          winningBid: 750,
          endDate: new Date(Date.now() - 86400000),
          status: "won",
          paymentStatus: "pending"
        },
        {
          id: 4,
          auctionId: 5,
          title: "Vintage Guitar",
          image: "https://via.placeholder.com/100x80?text=Guitar",
          winningBid: 1200,
          endDate: new Date(Date.now() - 7 * 86400000),
          status: "won",
          paymentStatus: "completed"
        }
      ];

      const mockBidHistory = [
        {
          id: 1,
          auctionId: 1,
          title: "Vintage Rolex Watch",
          bidAmount: 5200,
          bidTime: new Date(Date.now() - 30000),
          status: "active"
        },
        {
          id: 2,
          auctionId: 1,
          title: "Vintage Rolex Watch",
          bidAmount: 5000,
          bidTime: new Date(Date.now() - 300000),
          status: "outbid"
        },
        {
          id: 3,
          auctionId: 2,
          title: "MacBook Pro M2",
          bidAmount: 1650,
          bidTime: new Date(Date.now() - 400000),
          status: "outbid"
        },
        {
          id: 4,
          auctionId: 4,
          title: "Signed Basketball Jersey",
          bidAmount: 750,
          bidTime: new Date(Date.now() - 86400000),
          status: "won"
        }
      ];

      setActiveBids(mockActiveBids);
      setWonAuctions(mockWonAuctions);
      setBidHistory(mockBidHistory);
    }
  }, [user]);

  if (!user) {
    return (
      <Container className="py-4">
        <Alert variant="warning">
          Please log in to view your bids.
        </Alert>
      </Container>
    );
  }

  const formatTimeLeft = (timeLeft) => {
    if (timeLeft <= 0) return "Ended";
    
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getBidStatusBadge = (status) => {
    switch (status) {
      case 'leading':
        return <Badge bg="success">Leading</Badge>;
      case 'outbid':
        return <Badge bg="warning">Outbid</Badge>;
      case 'won':
        return <Badge bg="primary">Won</Badge>;
      case 'lost':
        return <Badge bg="secondary">Lost</Badge>;
      default:
        return <Badge bg="info">Active</Badge>;
    }
  };

  const getPaymentStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <Badge bg="success">Paid</Badge>;
      case 'pending':
        return <Badge bg="warning">Payment Pending</Badge>;
      case 'failed':
        return <Badge bg="danger">Payment Failed</Badge>;
      default:
        return <Badge bg="secondary">N/A</Badge>;
    }
  };

  return (
    <Container className="py-4">
      <Row>
        <Col>
          <h1 className="fw-bold mb-3">My Bids</h1>
          <p className="text-muted mb-4">Track your auction activity and manage your bids</p>
        </Col>
      </Row>

      {/* Summary Cards */}
      <Row className="mb-4">
        <Col md={3} className="mb-3">
          <Card className={`text-center ${theme === 'dark' ? 'bg-dark text-light' : ''}`}>
            <Card.Body>
              <FaGavel size={30} className="text-primary mb-2" />
              <h4 className="fw-bold mb-1">{activeBids.length}</h4>
              <small className="text-muted">Active Bids</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className={`text-center ${theme === 'dark' ? 'bg-dark text-light' : ''}`}>
            <Card.Body>
              <FaTrophy size={30} className="text-warning mb-2" />
              <h4 className="fw-bold mb-1">{wonAuctions.length}</h4>
              <small className="text-muted">Won Auctions</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className={`text-center ${theme === 'dark' ? 'bg-dark text-light' : ''}`}>
            <Card.Body>
              <FaHistory size={30} className="text-info mb-2" />
              <h4 className="fw-bold mb-1">{bidHistory.length}</h4>
              <small className="text-muted">Total Bids</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className={`text-center ${theme === 'dark' ? 'bg-dark text-light' : ''}`}>
            <Card.Body>
              <span className="display-6 text-success">$</span>
              <h4 className="fw-bold mb-1">2,950</h4>
              <small className="text-muted">Total Won Value</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tabs */}
      <Tabs defaultActiveKey="active" className="mb-4">
        <Tab eventKey="active" title={`Active Bids (${activeBids.length})`}>
          <Card className={`${theme === 'dark' ? 'bg-dark text-light' : ''}`}>
            <Card.Body>
              {activeBids.length > 0 ? (
                <div className="table-responsive">
                  <Table striped hover variant={theme}>
                    <thead>
                      <tr>
                        <th>Auction</th>
                        <th>My Bid</th>
                        <th>Current Bid</th>
                        <th>Status</th>
                        <th>Time Left</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeBids.map(bid => (
                        <tr key={bid.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <img
                                src={bid.image}
                                alt={bid.title}
                                className="rounded me-3"
                                style={{ width: '60px', height: '48px', objectFit: 'cover' }}
                              />
                              <div>
                                <div className="fw-medium">{bid.title}</div>
                                <small className="text-muted">
                                  Bid placed: {bid.myBidTime.toLocaleString()}
                                </small>
                              </div>
                            </div>
                          </td>
                          <td className="fw-bold">${bid.myBid.toLocaleString()}</td>
                          <td className="fw-bold text-primary">${bid.currentBid.toLocaleString()}</td>
                          <td>{getBidStatusBadge(bid.status)}</td>
                          <td>
                            <div className={`fw-medium ${bid.timeLeft < 3600000 ? 'text-danger' : ''}`}>
                              <FaClock className="me-1" />
                              {formatTimeLeft(bid.timeLeft)}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <Button
                                as={Link}
                                to={`/auction/${bid.auctionId}`}
                                variant="outline-primary"
                                size="sm"
                              >
                                <FaEye className="me-1" />
                                View
                              </Button>
                              {bid.status === 'outbid' && (
                                <Button variant="warning" size="sm">
                                  Place New Bid
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-4">
                  <FaGavel size={50} className="text-muted mb-3" />
                  <h5 className="text-muted">No Active Bids</h5>
                  <p className="text-muted mb-3">You haven't placed any bids yet.</p>
                  <Button as={Link} to="/auctions" variant="primary">
                    Browse Auctions
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="won" title={`Won Auctions (${wonAuctions.length})`}>
          <Card className={`${theme === 'dark' ? 'bg-dark text-light' : ''}`}>
            <Card.Body>
              {wonAuctions.length > 0 ? (
                <div className="table-responsive">
                  <Table striped hover variant={theme}>
                    <thead>
                      <tr>
                        <th>Auction</th>
                        <th>Winning Bid</th>
                        <th>End Date</th>
                        <th>Payment Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {wonAuctions.map(auction => (
                        <tr key={auction.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <img
                                src={auction.image}
                                alt={auction.title}
                                className="rounded me-3"
                                style={{ width: '60px', height: '48px', objectFit: 'cover' }}
                              />
                              <div>
                                <div className="fw-medium">{auction.title}</div>
                                <FaTrophy className="text-warning me-1" />
                                <small className="text-warning">Winner</small>
                              </div>
                            </div>
                          </td>
                          <td className="fw-bold text-success">${auction.winningBid.toLocaleString()}</td>
                          <td>{auction.endDate.toLocaleString()}</td>
                          <td>{getPaymentStatusBadge(auction.paymentStatus)}</td>
                          <td>
                            <div className="d-flex gap-2">
                              <Button
                                as={Link}
                                to={`/auction/${auction.auctionId}`}
                                variant="outline-primary"
                                size="sm"
                              >
                                <FaEye className="me-1" />
                                View
                              </Button>
                              {auction.paymentStatus === 'pending' && (
                                <Button variant="success" size="sm">
                                  Pay Now
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-4">
                  <FaTrophy size={50} className="text-muted mb-3" />
                  <h5 className="text-muted">No Won Auctions</h5>
                  <p className="text-muted mb-3">You haven't won any auctions yet.</p>
                  <Button as={Link} to="/auctions" variant="primary">
                    Browse Auctions
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="history" title={`Bid History (${bidHistory.length})`}>
          <Card className={`${theme === 'dark' ? 'bg-dark text-light' : ''}`}>
            <Card.Body>
              {bidHistory.length > 0 ? (
                <div className="table-responsive">
                  <Table striped hover variant={theme}>
                    <thead>
                      <tr>
                        <th>Auction</th>
                        <th>Bid Amount</th>
                        <th>Bid Time</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bidHistory.map(bid => (
                        <tr key={bid.id}>
                          <td className="fw-medium">{bid.title}</td>
                          <td className="fw-bold">${bid.bidAmount.toLocaleString()}</td>
                          <td>{bid.bidTime.toLocaleString()}</td>
                          <td>{getBidStatusBadge(bid.status)}</td>
                          <td>
                            <Button
                              as={Link}
                              to={`/auction/${bid.auctionId}`}
                              variant="outline-primary"
                              size="sm"
                            >
                              <FaEye className="me-1" />
                              View Auction
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-4">
                  <FaHistory size={50} className="text-muted mb-3" />
                  <h5 className="text-muted">No Bid History</h5>
                  <p className="text-muted">Your bidding history will appear here.</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default MyBids;
