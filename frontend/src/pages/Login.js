import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Tab, Tabs } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaLock, FaUserShield } from 'react-icons/fa';

const Login = () => {
  const { login, theme } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [adminFormData, setAdminFormData] = useState({
    email: '',
    password: '',
    adminKey: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('user');

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

  const handleSubmit = async (e, isAdmin = false) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const data = isAdmin ? adminFormData : formData;
    
    if (!data.email || !data.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (isAdmin && !data.adminKey) {
      setError('Admin key is required for admin login');
      setLoading(false);
      return;
    }

    try {
      const result = await login(data.email, data.password, isAdmin);
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (error) {
      setError('Login failed. Please try again.');
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
                  <FaUser size={24} className="text-white" />
                </div>
                <h2 className="fw-bold mb-2" style={{ color: '#667eea' }}>Welcome Back</h2>
                <p className="text-muted">Sign in to your account</p>
              </div>

              {error && <Alert variant="danger" className="border-0">{error}</Alert>}

              <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="mb-4 custom-tabs"
                fill
              >
                <Tab eventKey="user" title={<><FaUser className="me-2" />User Login</>}>
                  <Form onSubmit={(e) => handleSubmit(e, false)}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-medium">
                        <FaUser className="me-2" style={{ color: '#667eea' }} />
                        Email Address
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

                    <Form.Group className="mb-4">
                      <Form.Label className="fw-medium">
                        <FaLock className="me-2" style={{ color: '#667eea' }} />
                        Password
                      </Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={(e) => handleInputChange(e, false)}
                        placeholder="Enter your password"
                        required
                        className="rounded-3"
                        style={{ borderColor: '#667eea' }}
                      />
                    </Form.Group>

                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <Form.Check
                        type="checkbox"
                        label="Remember me"
                        style={{ color: '#667eea' }}
                      />
                      <Link to="#" className="text-decoration-none small" style={{ color: '#667eea' }}>
                        Forgot password?
                      </Link>
                    </div>

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
                      {loading ? 'Signing In...' : 'Sign In'}
                    </Button>
                  </Form>
                </Tab>

                <Tab eventKey="admin" title={<><FaUserShield className="me-2" />Admin Login</>}>
                  
                  <Form onSubmit={(e) => handleSubmit(e, true)}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-medium">
                        <FaUserShield className="me-2" style={{ color: '#dc3545' }} />
                        Admin Email
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
                        <FaLock className="me-2" style={{ color: '#dc3545' }} />
                        Password
                      </Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={adminFormData.password}
                        onChange={(e) => handleInputChange(e, true)}
                        placeholder="Enter admin password"
                        required
                        className="rounded-3"
                        style={{ borderColor: '#dc3545' }}
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label className="fw-medium">
                        <FaLock className="me-2" style={{ color: '#dc3545' }} />
                        Admin Key
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
                      {loading ? 'Verifying...' : 'Admin Login'}
                    </Button>
                  </Form>
                </Tab>
              </Tabs>

              <div className="text-center">
                <p className="mb-0">
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-decoration-none fw-medium" style={{ color: '#667eea' }}>
                    Sign up here
                  </Link>
                </p>
              </div>
            </Card.Body>
          </Card>

          {/* Demo Credentials */}
          <Card className={`mt-3 border-0 ${theme === 'dark' ? 'bg-dark text-light' : 'bg-white'}`} style={{ borderRadius: '15px' }}>
            <Card.Body className="p-3">
              <h6 className="fw-bold mb-2" style={{ color: '#28a745' }}>🔑 Demo Credentials</h6>
              <div className="small">
                <div className="mb-2">
                  <strong className="text-primary">User:</strong> user@demo.com / password123
                </div>
                <div>
                  <strong className="text-danger">Admin:</strong> admin@demo.com / admin123 / ADMIN_KEY_2024
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
