import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Alert, Tab, Tabs, Form, Modal } from 'react-bootstrap';
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

  // Check if user is admin
  if (!user || user.role !== 'admin') {
    return (
      <Container className="py-4">
        <Alert variant="danger" className="border-0 rounded-3 text-center p-4">
          <h4 className="fw-bold mb-3">🚫 Access Denied</h4>
          <p className="mb-3">You don't have permission to access the admin dashboard.</p>
          <Button 
            className="fw-medium rounded-3"
            style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none'
            }}
            onClick={() => navigate('/')}
          >
            Go to Homepage
          </Button>
        </Alert>
      </Container>
    );
  }

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
        currentBid: 5.2,
        startingPrice: 3.0,
        status: "active",
        endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        category: "Watches",
        approved: true
      },
      {
        id: 2,
        title: "MacBook Pro M2",
        seller: "tech_seller",
        currentBid: 1.8,
        startingPrice: 1.2,
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
        startingPrice: 2.0,
        status: "pending",
        endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
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
        totalAuctions: 15,
        totalBids: 45
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

  const handleApproveAuction = async (auctionId) => {
    setLoading(true);
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
        return <Badge className="rounded-pill px-2" style={{ background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)', color: 'white' }}>Active</Badge>;
      case 'pending':
        return <Badge className="rounded-pill px-2" style={{ background: 'linear-gradient(135deg, #ffc107 0%, #ff8c00 100%)', color: 'white' }}>Pending</Badge>;
      case 'banned':
        return <Badge className="rounded-pill px-2" style={{ background: 'linear-gradient(135deg, #dc3545 0%, #fd7e14 100%)', color: 'white' }}>Banned</Badge>;
      case 'ended':
        return <Badge className="rounded-pill px-2" bg="secondary">Ended</Badge>;
      default:
        return <Badge className="rounded-pill px-2" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>{status}</Badge>;
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
                <h3 className="fw-bold mb-1" style={{ color: '#ffc107' }}>${(stats.totalVolume / 1000000)?.toFixed(1)}M</h3>
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

        {/* Management Tabs */}
        <Tabs defaultActiveKey="auctions" className="mb-4">
          <Tab eventKey="auctions" title="🏺 Manage Auctions">
            <Card className={`border-0 shadow-sm ${theme === 'dark' ? 'bg-dark text-light' : 'bg-white'}`} style={{ borderRadius: '15px' }}>
              <Card.Header className="border-0 py-3" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <h5 className="mb-0 text-white fw-bold">Recent Auctions</h5>
              </Card.Header>
              <Card.Body className="p-0">
                <div className="table-responsive">
                  <Table className="mb-0">
                    <thead style={{ backgroundColor: '#f8f9fa' }}>
                      <tr>
                        <th className="border-0 fw-bold" style={{ color: '#667eea' }}>Product</th>
                        <th className="border-0 fw-bold" style={{ color: '#667eea' }}>Seller</th>
                        <th className="border-0 fw-bold" style={{ color: '#667eea' }}>Current Bid</th>
                        <th className="border-0 fw-bold" style={{ color: '#667eea' }}>Status</th>
                        <th className="border-0 fw-bold" style={{ color: '#667eea' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {auctions.map(auction => (
                        <tr key={auction.id}>
                          <td className="border-0 py-3">
                            <div>
                              <h6 className="mb-0 fw-medium">{auction.title}</h6>
                              <small className="text-muted">{auction.category}</small>
                            </div>
                          </td>
                          <td className="border-0 py-3">
                            <span className="fw-medium">{auction.seller}</span>
                          </td>
                          <td className="border-0 py-3">
                            <div>
                              <span className="fw-bold" style={{ color: '#28a745' }}>
                                {auction.currentBid > 0 ? `${auction.currentBid} ETH` : 'No bids'}
                              </span>
                              <br />
                              <small className="text-muted">Start: {auction.startingPrice} ETH</small>
                            </div>
                          </td>
                          <td className="border-0 py-3">
                            {getStatusBadge(auction.status)}
                          </td>
                          <td className="border-0 py-3">
                            <div className="btn-group btn-group-sm">
                              <Button 
                                variant="outline-primary" 
                                size="sm"
                                className="rounded-3 me-1"
                                style={{ borderColor: '#667eea', color: '#667eea' }}
                              >
                                <FaEye />
                              </Button>
                              {!auction.approved && auction.status === 'pending' && (
                                <>
                                  <Button 
                                    size="sm" 
                                    onClick={() => handleApproveAuction(auction.id)}
                                    disabled={loading}
                                    className="me-1 rounded-3"
                                    style={{ background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)', border: 'none' }}
                                  >
                                    <FaCheck />
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    onClick={() => handleRejectAuction(auction.id)}
                                    disabled={loading}
                                    className="rounded-3"
                                    style={{ background: 'linear-gradient(135deg, #dc3545 0%, #fd7e14 100%)', border: 'none' }}
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

          <Tab eventKey="users" title="👥 Manage Users">
            <Card className={`border-0 shadow-sm ${theme === 'dark' ? 'bg-dark text-light' : 'bg-white'}`} style={{ borderRadius: '15px' }}>
              <Card.Header className="border-0 py-3" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <h5 className="mb-0 text-white fw-bold">User Management</h5>
              </Card.Header>
              <Card.Body className="p-0">
                <div className="table-responsive">
                  <Table className="mb-0">
                    <thead style={{ backgroundColor: '#f8f9fa' }}>
                      <tr>
                        <th className="border-0 fw-bold" style={{ color: '#667eea' }}>User</th>
                        <th className="border-0 fw-bold" style={{ color: '#667eea' }}>Join Date</th>
                        <th className="border-0 fw-bold" style={{ color: '#667eea' }}>Activity</th>
                        <th className="border-0 fw-bold" style={{ color: '#667eea' }}>Status</th>
                        <th className="border-0 fw-bold" style={{ color: '#667eea' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(user => (
                        <tr key={user.id}>
                          <td className="border-0 py-3">
                            <div>
                              <h6 className="mb-0 fw-medium">{user.name}</h6>
                              <small className="text-muted">{user.email}</small>
                            </div>
                          </td>
                          <td className="border-0 py-3">
                            <small className="text-muted">
                              {user.joinDate.toLocaleDateString()}
                            </small>
                          </td>
                          <td className="border-0 py-3">
                            <div>
                              <small className="fw-medium" style={{ color: '#28a745' }}>
                                {user.totalAuctions} auctions
                              </small>
                              <br />
                              <small className="text-muted">
                                {user.totalBids} bids
                              </small>
                            </div>
                          </td>
                          <td className="border-0 py-3">
                            {getStatusBadge(user.status)}
                          </td>
                          <td className="border-0 py-3">
                            <div className="btn-group btn-group-sm">
                              <Button 
                                variant="outline-primary" 
                                size="sm"
                                onClick={() => {
                                  setSelectedUser(user);
                                  setShowUserModal(true);
                                }}
                                className="rounded-3 me-1"
                                style={{ borderColor: '#667eea', color: '#667eea' }}
                              >
                                <FaEye />
                              </Button>
                              {user.status === 'active' ? (
                                <Button 
                                  size="sm" 
                                  onClick={() => handleBanUser(user.id)}
                                  disabled={loading}
                                  className="rounded-3"
                                  style={{ background: 'linear-gradient(135deg, #dc3545 0%, #fd7e14 100%)', border: 'none' }}
                                >
                                  <FaBan />
                                </Button>
                              ) : user.status === 'banned' && (
                                <Button 
                                  size="sm" 
                                  onClick={() => handleUnbanUser(user.id)}
                                  disabled={loading}
                                  className="rounded-3"
                                  style={{ background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)', border: 'none' }}
                                >
                                  <FaCheck />
                                </Button>
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
        </Tabs>
      </Container>

      {/* User Details Modal */}
      <Modal show={showUserModal} onHide={() => setShowUserModal(false)} size="lg" centered>
        <Modal.Header closeButton className="border-0" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <Modal.Title className="text-white fw-bold">User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {selectedUser && (
            <div>
              <Row className="mb-4">
                <Col md={6}>
                  <div className="mb-3">
                    <h6 className="fw-bold mb-1" style={{ color: '#667eea' }}>Full Name</h6>
                    <p className="mb-0">{selectedUser.name}</p>
                  </div>
                  <div className="mb-3">
                    <h6 className="fw-bold mb-1" style={{ color: '#667eea' }}>Email Address</h6>
                    <p className="mb-0">{selectedUser.email}</p>
                  </div>
                  <div className="mb-3">
                    <h6 className="fw-bold mb-1" style={{ color: '#667eea' }}>Status</h6>
                    {getStatusBadge(selectedUser.status)}
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <h6 className="fw-bold mb-1" style={{ color: '#667eea' }}>Join Date</h6>
                    <p className="mb-0">{selectedUser.joinDate.toLocaleDateString()}</p>
                  </div>
                  <div className="mb-3">
                    <h6 className="fw-bold mb-1" style={{ color: '#667eea' }}>Verified</h6>
                    <Badge className="rounded-pill px-2" style={{ 
                      background: selectedUser.verified 
                        ? 'linear-gradient(135deg, #28a745 0%, #20c997 100%)' 
                        : 'linear-gradient(135deg, #ffc107 0%, #ff8c00 100%)',
                      color: 'white'
                    }}>
                      {selectedUser.verified ? '✓ Verified' : '⏳ Pending'}
                    </Badge>
                  </div>
                </Col>
              </Row>
              
              <Row className="text-center mb-4">
                <Col md={4}>
                  <Card className="border-0 shadow-sm" style={{ borderRadius: '10px' }}>
                    <Card.Body className="p-3">
                      <h4 className="fw-bold mb-1" style={{ color: '#667eea' }}>{selectedUser.totalAuctions}</h4>
                      <small className="text-muted">Total Auctions</small>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="border-0 shadow-sm" style={{ borderRadius: '10px' }}>
                    <Card.Body className="p-3">
                      <h4 className="fw-bold mb-1" style={{ color: '#28a745' }}>{selectedUser.totalBids}</h4>
                      <small className="text-muted">Total Bids</small>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="border-0 shadow-sm" style={{ borderRadius: '10px' }}>
                    <Card.Body className="p-3">
                      <h4 className="fw-bold mb-1" style={{ color: '#ffc107' }}>4.8</h4>
                      <small className="text-muted">Rating</small>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0">
          {selectedUser?.status === 'active' ? (
            <Button 
              onClick={() => handleBanUser(selectedUser.id)}
              disabled={loading}
              className="fw-medium rounded-3"
              style={{ background: 'linear-gradient(135deg, #dc3545 0%, #fd7e14 100%)', border: 'none' }}
            >
              <FaBan className="me-1" />
              Ban User
            </Button>
          ) : selectedUser?.status === 'banned' && (
            <Button 
              onClick={() => handleUnbanUser(selectedUser.id)}
              disabled={loading}
              className="fw-medium rounded-3"
              style={{ background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)', border: 'none' }}
            >
              <FaCheck className="me-1" />
              Unban User
            </Button>
          )}
          <Button 
            variant="outline-secondary" 
            onClick={() => setShowUserModal(false)}
            className="fw-medium rounded-3"
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AdminDashboard;
