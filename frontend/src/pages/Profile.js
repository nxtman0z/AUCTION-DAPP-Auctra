import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Form, Alert, Tab, Tabs } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaShieldAlt, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import KYCVerification from '../components/KYCVerification';

const Profile = () => {
  const { user, theme } = useAuth();
  const [editing, setEditing] = useState(false);
  const [showKYC, setShowKYC] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    bio: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSuccess('Profile updated successfully!');
    setEditing(false);
    setLoading(false);
    setTimeout(() => setSuccess(''), 3000);
  };

  const cancelEdit = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
      address: '',
      bio: ''
    });
    setEditing(false);
  };

  if (!user) {
    return (
      <Container className="py-4">
        <Alert variant="warning">
          Please log in to view your profile.
        </Alert>
      </Container>
    );
  }

  return (
    <>
      <Container className="py-4">
        <Row>
          <Col lg={4}>
            {/* Profile Card */}
            <Card className={`mb-4 shadow-lg border-0 ${theme === 'dark' ? 'bg-dark text-light' : 'bg-white'}`} style={{ borderRadius: '15px' }}>
              <Card.Body className="text-center p-4">
                <div className="mb-3">
                  <div 
                    className="d-inline-flex align-items-center justify-content-center shadow-sm"
                    style={{ 
                      width: '80px', 
                      height: '80px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    }}
                  >
                    <FaUser size={30} className="text-white" />
                  </div>
                </div>
                
                <h4 className="fw-bold mb-1" style={{ color: theme === 'dark' ? '#fff' : '#667eea' }}>{user.name}</h4>
                <p className="text-muted mb-3">{user.email}</p>
                
                <div className="mb-3">
                  {user.isVerified ? (
                    <Badge className="d-flex align-items-center justify-content-center rounded-pill px-3 py-2" 
                           style={{ background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)', color: 'white' }}>
                      <FaShieldAlt className="me-1" />
                      Verified Account
                    </Badge>
                  ) : (
                    <Badge className="d-flex align-items-center justify-content-center rounded-pill px-3 py-2"
                           style={{ background: 'linear-gradient(135deg, #ffc107 0%, #ff8c00 100%)', color: 'white' }}>
                      <FaShieldAlt className="me-1" />
                      Pending Verification
                    </Badge>
                  )}
                </div>
                
                <div className="mb-3">
                  <Badge className="rounded-pill px-3" style={{ 
                    background: user.isAdmin 
                      ? 'linear-gradient(135deg, #dc3545 0%, #fd7e14 100%)' 
                      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white'
                  }}>
                    {user.isAdmin ? 'Administrator' : 'Regular User'}
                  </Badge>
                </div>
                
                {!user.isVerified && (
                  <Button
                    size="sm"
                    onClick={() => setShowKYC(true)}
                    className="w-100 mb-2 rounded-3 fw-medium"
                    style={{ 
                      background: 'linear-gradient(135deg, #ffc107 0%, #ff8c00 100%)',
                      border: 'none',
                      color: 'white'
                    }}
                  >
                    Complete KYC Verification
                  </Button>
                )}
                
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => setEditing(!editing)}
                  className="w-100 rounded-3 fw-medium"
                  style={{ borderColor: '#667eea', color: '#667eea' }}
                >
                  <FaEdit className="me-1" />
                  {editing ? 'Cancel Edit' : 'Edit Profile'}
                </Button>
              </Card.Body>
            </Card>

            {/* Stats Card */}
            <Card className={`shadow-lg border-0 ${theme === 'dark' ? 'bg-dark text-light' : 'bg-white'}`} style={{ borderRadius: '15px' }}>
              <Card.Header className="border-0 text-center py-3" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <h6 className="mb-0 text-white fw-bold">Account Statistics</h6>
              </Card.Header>
              <Card.Body className="p-4">
                <div className="row text-center">
                  <div className="col-4">
                    <h4 className="fw-bold mb-0" style={{ color: '#667eea' }}>5</h4>
                    <small className="text-muted">Auctions</small>
                  </div>
                  <div className="col-4">
                    <h4 className="fw-bold mb-0" style={{ color: '#28a745' }}>12</h4>
                    <small className="text-muted">Bids Placed</small>
                  </div>
                  <div className="col-4">
                    <h4 className="fw-bold mb-0" style={{ color: '#ffc107' }}>3</h4>
                    <small className="text-muted">Won</small>
                  </div>
                </div>
                <hr style={{ borderColor: '#667eea', opacity: 0.3 }} />
                <div className="text-center">
                  <small className="text-muted">Member since</small>
                  <div className="fw-medium" style={{ color: theme === 'dark' ? '#fff' : '#667eea' }}>January 2024</div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={8}>
            {success && <Alert variant="success">{success}</Alert>}
            
            <Card className={`${theme === 'dark' ? 'bg-dark text-light' : ''}`}>
              <Card.Header>
                <h5 className="mb-0">Profile Information</h5>
              </Card.Header>
              <Card.Body>
                <Tabs defaultActiveKey="personal" className="mb-3">
                  <Tab eventKey="personal" title="Personal Info">
                    <Form>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              disabled={!editing}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              disabled={!editing}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              disabled={!editing}
                              placeholder="Enter phone number"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Address</Form.Label>
                            <Form.Control
                              type="text"
                              name="address"
                              value={formData.address}
                              onChange={handleInputChange}
                              disabled={!editing}
                              placeholder="Enter address"
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Bio</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="bio"
                          value={formData.bio}
                          onChange={handleInputChange}
                          disabled={!editing}
                          placeholder="Tell us about yourself..."
                        />
                      </Form.Group>

                      {editing && (
                        <div className="d-flex gap-2">
                          <Button
                            variant="success"
                            onClick={handleSave}
                            disabled={loading}
                          >
                            <FaSave className="me-1" />
                            {loading ? 'Saving...' : 'Save Changes'}
                          </Button>
                          <Button
                            variant="outline-secondary"
                            onClick={cancelEdit}
                            disabled={loading}
                          >
                            <FaTimes className="me-1" />
                            Cancel
                          </Button>
                        </div>
                      )}
                    </Form>
                  </Tab>

                  <Tab eventKey="security" title="Security">
                    <div>
                      <h6 className="mb-3">Change Password</h6>
                      <Form>
                        <Form.Group className="mb-3">
                          <Form.Label>Current Password</Form.Label>
                          <Form.Control type="password" placeholder="Enter current password" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>New Password</Form.Label>
                          <Form.Control type="password" placeholder="Enter new password" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Confirm New Password</Form.Label>
                          <Form.Control type="password" placeholder="Confirm new password" />
                        </Form.Group>
                        <Button variant="primary">Update Password</Button>
                      </Form>
                      
                      <hr className="my-4" />
                      
                      <h6 className="mb-3">Two-Factor Authentication</h6>
                      <Alert variant="info">
                        Two-factor authentication adds an extra layer of security to your account.
                      </Alert>
                      <Button variant="outline-primary">Enable 2FA</Button>
                    </div>
                  </Tab>

                  <Tab eventKey="preferences" title="Preferences">
                    <div>
                      <h6 className="mb-3">Notification Settings</h6>
                      <Form>
                        <Form.Check
                          type="switch"
                          id="email-notifications"
                          label="Email Notifications"
                          className="mb-3"
                        />
                        <Form.Check
                          type="switch"
                          id="bid-alerts"
                          label="Bid Alerts"
                          className="mb-3"
                        />
                        <Form.Check
                          type="switch"
                          id="auction-updates"
                          label="Auction Updates"
                          className="mb-3"
                        />
                        <Form.Check
                          type="switch"
                          id="marketing"
                          label="Marketing Communications"
                          className="mb-3"
                        />
                      </Form>
                      
                      <hr className="my-4" />
                      
                      <h6 className="mb-3">Display Preferences</h6>
                      <Form>
                        <Form.Group className="mb-3">
                          <Form.Label>Language</Form.Label>
                          <Form.Select>
                            <option>English</option>
                            <option>Spanish</option>
                            <option>French</option>
                            <option>German</option>
                          </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Currency</Form.Label>
                          <Form.Select>
                            <option>USD - US Dollar</option>
                            <option>EUR - Euro</option>
                            <option>GBP - British Pound</option>
                            <option>JPY - Japanese Yen</option>
                          </Form.Select>
                        </Form.Group>
                      </Form>
                    </div>
                  </Tab>
                </Tabs>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <KYCVerification show={showKYC} onHide={() => setShowKYC(false)} />
    </>
  );
};

export default Profile;
