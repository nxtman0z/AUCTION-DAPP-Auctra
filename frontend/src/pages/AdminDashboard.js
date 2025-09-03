import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Alert, Tab, Tabs, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FaUsers, 
  FaGavel, 
  FaDollarSign, 
  FaChartBar, 
  FaEye, 
  FaCheck, 
  FaTimes, 
  FaBan,
  FaShieldAlt 
} from 'react-icons/fa';

const AdminDashboard = () => {
  const { user, theme } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [auctions, setAuctions] = useState([]);
  const [users, setUsers] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Mock data for admin dashboard
    setStats({
      totalUsers: 1247,
      activeAuctions: 23,
      totalVolume: 2500000,
      successRate: 98.5
    });

    setAuctions([
      {
        id: 1,
        title: "Vintage Rolex Watch",
        seller: "john_collector",
        currentBid: 5200,
        startingPrice: 3000,
        status: "active",
        endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        category: "Watches",
        approved: true
      },
      {
        id: 2,
        title: "MacBook Pro M2",
        seller: "tech_seller",
        currentBid: 1800,
        startingPrice: 1200,
        status: "active",
        endDate: new Date(Date.now() + 5 * 60 * 60 * 1000),
        category: "Electronics",
        approved: true
      },
      {
        id: 3,
        title: "Diamond Ring",
        seller: "jewelry_store",
        currentBid: 0,
        startingPrice: 2000,
        status: "pending",
        endDate: null,
        category: "Jewelry",
        approved: false
      }
    ]);

    setUsers([
      {
        id: 1,
        name: "John Collector",
        email: "john@collector.com",
        joinDate: new Date("2024-01-15"),
        status: "active",
        verified: true,
        totalAuctions: 5,
        totalBids: 23
      },
      {
        id: 2,
        name: "Tech Seller",
        email: "tech@seller.com",
        joinDate: new Date("2024-02-20"),
        status: "active",
        verified: true,
        totalAuctions: 8,
        totalBids: 12
      },
      {
        id: 3,
        name: "New User",
        email: "new@user.com",
        joinDate: new Date("2024-03-01"),
        status: "pending",
        verified: false,
        totalAuctions: 0,
        totalBids: 3
      }
    ]);
  }, []);

  // Check if user is admin
  if (!user || !user.isAdmin) {
    return (
      <Container className="py-4">
        <Alert variant="danger">
          <h4>Access Denied</h4>
          <p>You don't have permission to access the admin dashboard.</p>
          <Button variant="primary" onClick={() => navigate('/')}>
            Go to Homepage
          </Button>
        </Alert>
      </Container>
    );
  }

  const handleApproveAuction = async (auctionId) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setAuctions(prev => prev.map(auction => 
      auction.id === auctionId 
        ? { ...auction, approved: true, status: 'active' }
        : auction
    ));
    setLoading(false);
  };

  const handleRejectAuction = async (auctionId) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setAuctions(prev => prev.filter(auction => auction.id !== auctionId));
    setLoading(false);
  };

  const handleBanUser = async (userId) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, status: 'banned' }
        : user
    ));
    setLoading(false);
    setShowUserModal(false);
  };

  const handleUnbanUser = async (userId) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, status: 'active' }
        : user
    ));
    setLoading(false);
    setShowUserModal(false);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge bg="success">Active</Badge>;
      case 'pending':
        return <Badge bg="warning">Pending</Badge>;
      case 'banned':
        return <Badge bg="danger">Banned</Badge>;
      case 'ended':
        return <Badge bg="secondary">Ended</Badge>;
      default:
        return <Badge bg="info">{status}</Badge>;
    }
  };

  return (
    <>
      <Container className="py-4">
        <Row className="mb-4">
          <Col>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div>
                <div className="d-flex align-items-center mb-2">
                  <FaShieldAlt className="me-2" size={28} style={{ color: '#667eea' }} />
                  <h1 className="fw-bold mb-0" style={{ color: '#667eea' }}>Admin Dashboard</h1>
                </div>
                <p className="text-muted mb-0">Manage auctions, users, and platform overview with powerful admin tools</p>
              </div>
              <Badge className="px-3 py-2 rounded-pill" style={{ 
                background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                color: 'white'
              }}>
                System Status: Online
              </Badge>
            </div>
          </Col>
        </Row>

        {/* Stats Cards */}
        <Row className="mb-4">
          <Col md={3} className="mb-3">
            <Card className={`text-center h-100 border-0 shadow-sm ${theme === 'dark' ? 'bg-dark text-light' : 'bg-white'}`} style={{ borderRadius: '15px' }}>
              <Card.Body className="p-4">
                <div 
                  className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3 shadow-sm"
                  style={{ 
                    width: '60px', 
                    height: '60px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  }}
                >
                  <FaUsers size={24} className="text-white" />
                </div>
                <h3 className="fw-bold mb-1" style={{ color: '#667eea' }}>{stats.totalUsers?.toLocaleString()}</h3>
                <p className="text-muted mb-0">Total Users</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-3">
            <Card className={`text-center h-100 border-0 shadow-sm ${theme === 'dark' ? 'bg-dark text-light' : 'bg-white'}`} style={{ borderRadius: '15px' }}>
              <Card.Body className="p-4">
                <div 
                  className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3 shadow-sm"
                  style={{ 
                    width: '60px', 
                    height: '60px',
                    background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)'
                  }}
                >
                  <FaGavel size={24} className="text-white" />
                </div>
                <h3 className="fw-bold mb-1" style={{ color: '#28a745' }}>{stats.activeAuctions}</h3>
                <p className="text-muted mb-0">Active Auctions</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-3">
            <Card className={`text-center h-100 border-0 shadow-sm ${theme === 'dark' ? 'bg-dark text-light' : 'bg-white'}`} style={{ borderRadius: '15px' }}>
              <Card.Body className="p-4">
                <div 
                  className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3 shadow-sm"
                  style={{ 
                    width: '60px', 
                    height: '60px',
                    background: 'linear-gradient(135deg, #ffc107 0%, #ff8c00 100%)'
                  }}
                >
                  <FaDollarSign size={24} className="text-white" />
                </div>
                <h3 className="fw-bold mb-1" style={{ color: '#ffc107' }}>${stats.totalVolume?.toLocaleString()}</h3>
                <p className="text-muted mb-0">Total Volume</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-3">
            <Card className={`text-center h-100 border-0 shadow-sm ${theme === 'dark' ? 'bg-dark text-light' : 'bg-white'}`} style={{ borderRadius: '15px' }}>
              <Card.Body className="p-4">
                <div 
                  className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3 shadow-sm"
                  style={{ 
                    width: '60px', 
                    height: '60px',
                    background: 'linear-gradient(135deg, #dc3545 0%, #fd7e14 100%)'
                  }}
                >
                  <FaChartBar size={24} className="text-white" />
                </div>
                <h3 className="fw-bold mb-1" style={{ color: '#dc3545' }}>{stats.successRate}%</h3>
                <p className="text-muted mb-0">Success Rate</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Tabs */}
        <Tabs defaultActiveKey="auctions" className="mb-4">
          <Tab eventKey="auctions" title="Manage Auctions">
            <Card className={`${theme === 'dark' ? 'bg-dark text-light' : ''}`}>
              <Card.Header>
                <h5 className="mb-0">All Auctions</h5>
              </Card.Header>
              <Card.Body>
                <div className="table-responsive">
                  <Table striped hover variant={theme}>
                    <thead>
                      <tr>
                        <th>Auction</th>
                        <th>Seller</th>
                        <th>Current Bid</th>
                        <th>Status</th>
                        <th>End Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {auctions.map(auction => (
                        <tr key={auction.id}>
                          <td>
                            <div>
                              <div className="fw-medium">{auction.title}</div>
                              <small className="text-muted">{auction.category}</small>
                            </div>
                          </td>
                          <td>{auction.seller}</td>
                          <td className="fw-bold">
                            ${auction.currentBid > 0 ? auction.currentBid.toLocaleString() : auction.startingPrice.toLocaleString()}
                          </td>
                          <td>{getStatusBadge(auction.status)}</td>
                          <td>
                            {auction.endDate ? auction.endDate.toLocaleDateString() : 'N/A'}
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <Button variant="outline-primary" size="sm">
                                <FaEye />
                              </Button>
                              {auction.status === 'pending' && (
                                <>
                                  <Button 
                                    variant="success" 
                                    size="sm"
                                    onClick={() => handleApproveAuction(auction.id)}
                                    disabled={loading}
                                  >
                                    <FaCheck />
                                  </Button>
                                  <Button 
                                    variant="danger" 
                                    size="sm"
                                    onClick={() => handleRejectAuction(auction.id)}
                                    disabled={loading}
                                  >
                                    <FaTimes />
                                  </Button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </Tab>

          <Tab eventKey="users" title="Manage Users">
            <Card className={`${theme === 'dark' ? 'bg-dark text-light' : ''}`}>
              <Card.Header>
                <h5 className="mb-0">All Users</h5>
              </Card.Header>
              <Card.Body>
                <div className="table-responsive">
                  <Table striped hover variant={theme}>
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Join Date</th>
                        <th>Status</th>
                        <th>Verified</th>
                        <th>Activity</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(user => (
                        <tr key={user.id}>
                          <td>
                            <div>
                              <div className="fw-medium">{user.name}</div>
                              <small className="text-muted">{user.email}</small>
                            </div>
                          </td>
                          <td>{user.joinDate.toLocaleDateString()}</td>
                          <td>{getStatusBadge(user.status)}</td>
                          <td>
                            {user.verified ? (
                              <Badge bg="success">Verified</Badge>
                            ) : (
                              <Badge bg="warning">Pending</Badge>
                            )}
                          </td>
                          <td>
                            <small>
                              {user.totalAuctions} auctions<br />
                              {user.totalBids} bids
                            </small>
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <Button 
                                variant="outline-primary" 
                                size="sm"
                                onClick={() => {
                                  setSelectedUser(user);
                                  setShowUserModal(true);
                                }}
                              >
                                <FaEye />
                              </Button>
                              {user.status === 'active' ? (
                                <Button 
                                  variant="warning" 
                                  size="sm"
                                  onClick={() => handleBanUser(user.id)}
                                  disabled={loading}
                                >
                                  <FaBan />
                                </Button>
                              ) : user.status === 'banned' ? (
                                <Button 
                                  variant="success" 
                                  size="sm"
                                  onClick={() => handleUnbanUser(user.id)}
                                  disabled={loading}
                                >
                                  <FaCheck />
                                </Button>
                              ) : null}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </Tab>

          <Tab eventKey="analytics" title="Analytics">
            <Row>
              <Col md={6} className="mb-4">
                <Card className={`h-100 ${theme === 'dark' ? 'bg-dark text-light' : ''}`}>
                  <Card.Header>
                    <h6 className="mb-0">Recent Activity</h6>
                  </Card.Header>
                  <Card.Body>
                    <div className="list-group list-group-flush">
                      <div className="list-group-item bg-transparent border-0 px-0">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <small className="text-muted">New user registered</small>
                            <div className="fw-medium">Jane Smith</div>
                          </div>
                          <small className="text-muted">2 min ago</small>
                        </div>
                      </div>
                      <div className="list-group-item bg-transparent border-0 px-0">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <small className="text-muted">Auction ended</small>
                            <div className="fw-medium">Vintage Guitar</div>
                          </div>
                          <small className="text-muted">1 hour ago</small>
                        </div>
                      </div>
                      <div className="list-group-item bg-transparent border-0 px-0">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <small className="text-muted">New auction created</small>
                            <div className="fw-medium">Art Painting</div>
                          </div>
                          <small className="text-muted">3 hours ago</small>
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6} className="mb-4">
                <Card className={`h-100 ${theme === 'dark' ? 'bg-dark text-light' : ''}`}>
                  <Card.Header>
                    <h6 className="mb-0">Platform Settings</h6>
                  </Card.Header>
                  <Card.Body>
                    <Form>
                      <Form.Group className="mb-3">
                        <Form.Label>Default Auction Duration (days)</Form.Label>
                        <Form.Control type="number" defaultValue={7} />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Minimum Bid Increment (%)</Form.Label>
                        <Form.Control type="number" defaultValue={5} />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Platform Fee (%)</Form.Label>
                        <Form.Control type="number" defaultValue={2.5} step={0.1} />
                      </Form.Group>
                      <Button variant="primary" size="sm">
                        Save Settings
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab>
        </Tabs>
      </Container>

      {/* User Details Modal */}
      <Modal show={showUserModal} onHide={() => setShowUserModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <div>
              <Row>
                <Col md={6}>
                  <h6>Personal Information</h6>
                  <p><strong>Name:</strong> {selectedUser.name}</p>
                  <p><strong>Email:</strong> {selectedUser.email}</p>
                  <p><strong>Join Date:</strong> {selectedUser.joinDate.toLocaleDateString()}</p>
                  <p><strong>Status:</strong> {getStatusBadge(selectedUser.status)}</p>
                </Col>
                <Col md={6}>
                  <h6>Activity Summary</h6>
                  <p><strong>Total Auctions:</strong> {selectedUser.totalAuctions}</p>
                  <p><strong>Total Bids:</strong> {selectedUser.totalBids}</p>
                  <p><strong>Verification Status:</strong> {selectedUser.verified ? 'Verified' : 'Pending'}</p>
                </Col>
              </Row>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUserModal(false)}>
            Close
          </Button>
          {selectedUser && selectedUser.status === 'active' && (
            <Button 
              variant="warning" 
              onClick={() => handleBanUser(selectedUser.id)}
              disabled={loading}
            >
              Ban User
            </Button>
          )}
          {selectedUser && selectedUser.status === 'banned' && (
            <Button 
              variant="success" 
              onClick={() => handleUnbanUser(selectedUser.id)}
              disabled={loading}
            >
              Unban User
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AdminDashboard;
