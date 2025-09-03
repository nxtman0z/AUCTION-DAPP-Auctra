import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Tab, Tabs } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaEnvelope, FaLock, FaUserPlus, FaWallet, FaUserShield } from 'react-icons/fa';

const Signup = () => {
  const { signup, theme } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('user');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    walletAddress: ''
  });
  const [adminFormData, setAdminFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    walletAddress: '',
    adminKey: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleInputChange = (e, isAdmin = false) => {
    const { name, value } = e.target;
    if (isAdmin) {
      setAdminFormData(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validateWalletAddress = (address) => {
    // Basic Ethereum wallet address validation
    const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
    return ethAddressRegex.test(address);
  };

  const handleSubmit = async (e, isAdmin = false) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const data = isAdmin ? adminFormData : formData;

    // Validation
    if (!data.name || !data.email || !data.password || !data.confirmPassword || !data.walletAddress) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (!validateWalletAddress(data.walletAddress)) {
      setError('Please enter a valid Ethereum wallet address (0x...)');
      setLoading(false);
      return;
    }

    if (data.password !== data.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (data.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    if (isAdmin && !data.adminKey) {
      setError('Admin key is required for admin signup');
      setLoading(false);
      return;
    }

    // Valid admin keys
    const validAdminKeys = ['ADMIN22', 'ADMIN23', 'ADMIN24', 'ADMIN25', 'ADMIN26'];

    if (isAdmin && !validAdminKeys.includes(data.adminKey)) {
      setError('Invalid admin key');
      setLoading(false);
      return;
    }

    if (!acceptTerms) {
      setError('Please accept the terms and conditions');
      setLoading(false);
      return;
    }

    try {
      const result = await signup(data.email, data.password, data.name, data.walletAddress, isAdmin);
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error || 'Signup failed');
      }
    } catch (error) {
      setError('Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <Card className={`shadow-lg border-0 ${theme === 'dark' ? 'bg-dark text-light' : 'bg-white'}`} style={{ borderRadius: '20px' }}>
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <div className="bg-gradient-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                     style={{ width: '60px', height: '60px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                  <FaUserPlus size={24} className="text-white" />
                </div>
                <h2 className="fw-bold mb-2" style={{ color: '#667eea' }}>Join AuctionBlock</h2>
                <p className="text-muted">Create your account to start bidding</p>
              </div>

              {error && <Alert variant="danger" className="border-0">{error}</Alert>}

              <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="mb-4 custom-tabs"
                fill
              >
                <Tab eventKey="user" title={<><FaUser className="me-2" />User Signup</>}>
                  <Form onSubmit={(e) => handleSubmit(e, false)}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-medium">
                        <FaUser className="me-2" style={{ color: '#667eea' }} />
                        Full Name *
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange(e, false)}
                        placeholder="Enter your full name"
                        required
                        className="rounded-3"
                        style={{ borderColor: '#667eea' }}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label className="fw-medium">
                        <FaEnvelope className="me-2" style={{ color: '#667eea' }} />
                        Email Address *
                      </Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange(e, false)}
                        placeholder="Enter your email"
                        required
                        className="rounded-3"
                        style={{ borderColor: '#667eea' }}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label className="fw-medium">
                        <FaWallet className="me-2" style={{ color: '#667eea' }} />
                        Wallet Address *
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="walletAddress"
                        value={formData.walletAddress}
                        onChange={(e) => handleInputChange(e, false)}
                        placeholder="0x..."
                        required
                        className="rounded-3"
                        style={{ borderColor: '#667eea', fontFamily: 'monospace' }}
                      />
                      <Form.Text className="text-muted">
                        Enter your Ethereum wallet address (required for transactions)
                      </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label className="fw-medium">
                        <FaLock className="me-2" style={{ color: '#667eea' }} />
                        Password *
                      </Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={(e) => handleInputChange(e, false)}
                        placeholder="Create a password"
                        required
                        minLength={6}
                        className="rounded-3"
                        style={{ borderColor: '#667eea' }}
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label className="fw-medium">
                        <FaLock className="me-2" style={{ color: '#667eea' }} />
                        Confirm Password *
                      </Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange(e, false)}
                        placeholder="Confirm your password"
                        required
                        className="rounded-3"
                        style={{ borderColor: '#667eea' }}
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Check
                        type="checkbox"
                        label={
                          <span>
                            I agree to the{' '}
                            <Link to="#" className="text-decoration-none" style={{ color: '#667eea' }}>
                              Terms of Service
                            </Link>{' '}
                            and{' '}
                            <Link to="#" className="text-decoration-none" style={{ color: '#667eea' }}>
                              Privacy Policy
                            </Link>
                          </span>
                        }
                        checked={acceptTerms}
                        onChange={(e) => setAcceptTerms(e.target.checked)}
                        required
                      />
                    </Form.Group>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-100 mb-3 fw-medium rounded-3"
                      disabled={loading}
                      style={{ 
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        border: 'none'
                      }}
                    >
                      {loading ? 'Creating Account...' : 'Create User Account'}
                    </Button>
                  </Form>
                </Tab>

                <Tab eventKey="admin" title={<><FaUserShield className="me-2" />Admin Signup</>}>
                  
                  <Form onSubmit={(e) => handleSubmit(e, true)}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-medium">
                        <FaUser className="me-2" style={{ color: '#dc3545' }} />
                        Admin Name *
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={adminFormData.name}
                        onChange={(e) => handleInputChange(e, true)}
                        placeholder="Enter admin name"
                        required
                        className="rounded-3"
                        style={{ borderColor: '#dc3545' }}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label className="fw-medium">
                        <FaEnvelope className="me-2" style={{ color: '#dc3545' }} />
                        Admin Email *
                      </Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={adminFormData.email}
                        onChange={(e) => handleInputChange(e, true)}
                        placeholder="Enter admin email"
                        required
                        className="rounded-3"
                        style={{ borderColor: '#dc3545' }}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label className="fw-medium">
                        <FaWallet className="me-2" style={{ color: '#dc3545' }} />
                        Admin Wallet Address *
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="walletAddress"
                        value={adminFormData.walletAddress}
                        onChange={(e) => handleInputChange(e, true)}
                        placeholder="0x..."
                        required
                        className="rounded-3"
                        style={{ borderColor: '#dc3545', fontFamily: 'monospace' }}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label className="fw-medium">
                        <FaLock className="me-2" style={{ color: '#dc3545' }} />
                        Password *
                      </Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={adminFormData.password}
                        onChange={(e) => handleInputChange(e, true)}
                        placeholder="Create admin password"
                        required
                        minLength={6}
                        className="rounded-3"
                        style={{ borderColor: '#dc3545' }}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label className="fw-medium">
                        <FaLock className="me-2" style={{ color: '#dc3545' }} />
                        Confirm Password *
                      </Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={adminFormData.confirmPassword}
                        onChange={(e) => handleInputChange(e, true)}
                        placeholder="Confirm admin password"
                        required
                        className="rounded-3"
                        style={{ borderColor: '#dc3545' }}
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label className="fw-medium">
                        <FaUserShield className="me-2" style={{ color: '#dc3545' }} />
                        Admin Key *
                      </Form.Label>
                      <Form.Control
                        type="password"
                        name="adminKey"
                        value={adminFormData.adminKey}
                        onChange={(e) => handleInputChange(e, true)}
                        placeholder="Enter admin key"
                        required
                        className="rounded-3"
                        style={{ borderColor: '#dc3545' }}
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Check
                        type="checkbox"
                        label={
                          <span>
                            I agree to the{' '}
                            <Link to="#" className="text-decoration-none" style={{ color: '#dc3545' }}>
                              Terms of Service
                            </Link>{' '}
                            and{' '}
                            <Link to="#" className="text-decoration-none" style={{ color: '#dc3545' }}>
                              Privacy Policy
                            </Link>
                          </span>
                        }
                        checked={acceptTerms}
                        onChange={(e) => setAcceptTerms(e.target.checked)}
                        required
                      />
                    </Form.Group>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-100 mb-3 fw-medium rounded-3"
                      disabled={loading}
                      style={{ 
                        background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
                        border: 'none'
                      }}
                    >
                      {loading ? 'Creating Admin...' : 'Create Admin Account'}
                    </Button>
                  </Form>
                </Tab>
              </Tabs>

              <div className="text-center">
                <p className="mb-0">
                  Already have an account?{' '}
                  <Link to="/login" className="text-decoration-none fw-medium" style={{ color: '#667eea' }}>
                    Sign in here
                  </Link>
                </p>
              </div>
            </Card.Body>
          </Card>

          {/* Info Card */}
          <Card className={`mt-3 border-0 ${theme === 'dark' ? 'bg-dark text-light' : 'bg-white'}`} style={{ borderRadius: '15px' }}>
            <Card.Body className="p-3">
              <h6 className="fw-bold mb-2" style={{ color: '#667eea' }}>📋 Getting Started</h6>
              <ul className="small mb-0">
                <li>✅ Complete registration with valid wallet address</li>
                <li>⏳ Wait for admin verification to start creating auctions</li>
                <li>💰 Verified users can bid on all active auctions immediately</li>
                <li>🔒 All transactions are secured by blockchain technology</li>
              </ul>
            </Card.Body>
          </Card>

          {/* Demo Credentials */}
          <Card className={`mt-3 border-0 ${theme === 'dark' ? 'bg-dark text-light' : 'bg-white'}`} style={{ borderRadius: '15px' }}>
            <Card.Body className="p-3">
              <h6 className="fw-bold mb-2" style={{ color: '#28a745' }}>🔑 Demo Credentials</h6>
              <div className="small">
                <div className="mb-2">
                  <strong>Admin Key:</strong> ADMIN_SIGNUP_KEY_2024
                </div>
                <div className="mb-2">
                  <strong>Sample Wallet:</strong> 0x742dEf5C29BEBB3D2b2c8C74B0c6e1a2F123B456
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Signup;
