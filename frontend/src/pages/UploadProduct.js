import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { FaUpload, FaImage, FaDollarSign, FaIdCard } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const UploadProduct = () => {
  const { user, theme } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    startingPrice: '',
    reservePrice: '',
    auctionDuration: '',
    auctionEndDate: '',
    auctionEndTime: '',
    condition: '',
    images: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const categories = [
    'Electronics',
    'Watches',
    'Jewelry',
    'Art',
    'Antiques',
    'Sports',
    'Automobiles',
    'Fashion',
    'Books',
    'Other'
  ];

  const conditions = [
    'New',
    'Like New',
    'Excellent',
    'Very Good',
    'Good',
    'Fair',
    'Poor'
  ];

  // Check if user is logged in and verified
  if (!user) {
    return (
      <Container className="py-4">
        <Row className="justify-content-center">
          <Col md={6} className="text-center">
            <Alert variant="warning">
              <h4>Login Required</h4>
              <p>You need to be logged in to upload products for auction.</p>
              <Button variant="primary" onClick={() => navigate('/login')}>
                Login
              </Button>
            </Alert>
          </Col>
        </Row>
      </Container>
    );
  }

  if (!user.isVerified) {
    return (
      <Container className="py-4">
        <Row className="justify-content-center">
          <Col md={8} className="text-center">
            <Card className={`shadow-lg border-0 ${theme === 'dark' ? 'bg-dark text-light' : 'bg-white'}`} style={{ borderRadius: '20px' }}>
              <Card.Body className="p-5">
                <div className="mb-4">
                  <div className="bg-gradient-warning rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                       style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, #ffc107 0%, #fd7e14 100%)' }}>
                    <FaIdCard size={35} className="text-white" />
                  </div>
                </div>
                <h3 className="fw-bold mb-3" style={{ color: '#fd7e14' }}>Admin Verification Required</h3>
                <p className="lead mb-4">
                  Your account needs to be verified by an administrator before you can create auctions.
                </p>
                <Alert variant="info" className="border-0 mb-4" style={{ backgroundColor: '#e3f2fd' }}>
                  <h6 className="fw-bold mb-2">📋 What happens after verification:</h6>
                  <ul className="mb-0 text-start">
                    <li>✅ Create unlimited auctions</li>
                    <li>✅ Upload product images and details</li>
                    <li>✅ Set starting prices and duration</li>
                    <li>✅ Manage your active auctions</li>
                  </ul>
                </Alert>
                <div className="d-flex gap-3 justify-content-center flex-wrap">
                  <Button
                    as={Link}
                    to="/profile"
                    size="lg"
                    className="fw-medium rounded-3"
                    style={{ 
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none'
                    }}
                  >
                    View Profile
                  </Button>
                  <Button
                    as={Link}
                    to="/auctions"
                    variant="outline-primary"
                    size="lg"
                    className="fw-medium rounded-3"
                    style={{ 
                      borderColor: '#667eea',
                      color: '#667eea'
                    }}
                  >
                    Browse Auctions
                  </Button>
                </div>
                <div className="mt-4">
                  <small className="text-muted">
                    💡 You can still bid on existing auctions while waiting for verification
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + formData.images.length > 5) {
      setError('Maximum 5 images allowed');
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    setUploadProgress(0);

    // Validation
    if (!formData.title || !formData.description || !formData.category || 
        !formData.startingPrice || !formData.auctionEndDate || !formData.auctionEndTime) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (formData.images.length === 0) {
      setError('Please upload at least one image');
      setLoading(false);
      return;
    }

    if (parseFloat(formData.reservePrice) < parseFloat(formData.startingPrice)) {
      setError('Reserve price cannot be less than starting price');
      setLoading(false);
      return;
    }

    try {
      // Simulate file upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setSuccess('Product uploaded successfully! Your auction will be reviewed and activated shortly.');
      
      // Reset form
      setTimeout(() => {
        setFormData({
          title: '',
          description: '',
          category: '',
          startingPrice: '',
          reservePrice: '',
          auctionDuration: '',
          auctionEndDate: '',
          auctionEndTime: '',
          condition: '',
          images: []
        });
        setUploadProgress(0);
        setSuccess('');
      }, 3000);
      
    } catch (error) {
      setError('Failed to upload product. Please try again.');
      setUploadProgress(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className={`shadow-lg border-0 ${theme === 'dark' ? 'bg-dark text-light' : 'bg-white'}`} style={{ borderRadius: '20px' }}>
            <Card.Header className="border-0 text-center py-4" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
              <h3 className="mb-0 text-white fw-bold">
                <FaUpload className="me-2" />
                Create New Auction
              </h3>
              <p className="mb-0 text-white-50 mt-2">Upload your product and start earning</p>
            </Card.Header>
            <Card.Body className="p-4">
              {error && <Alert variant="danger" className="border-0">{error}</Alert>}
              {success && <Alert variant="success" className="border-0">{success}</Alert>}
              
              {loading && (
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="fw-medium">Creating auction...</span>
                    <span className="fw-bold" style={{ color: '#667eea' }}>{uploadProgress}%</span>
                  </div>
                  <div className="progress rounded-3" style={{ height: '8px' }}>
                    <div 
                      className="progress-bar" 
                      role="progressbar" 
                      style={{ 
                        width: `${uploadProgress}%`,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      }}
                    ></div>
                  </div>
                </div>
              )}

              <Form onSubmit={handleSubmit}>
                {/* Basic Information */}
                <div className="mb-4">
                  <h5 className="mb-3 d-flex align-items-center" style={{ color: '#667eea' }}>
                    📝 Product Information
                  </h5>
                  
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-medium">Product Name *</Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter product name"
                      required
                      className="rounded-3"
                      style={{ borderColor: '#667eea' }}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-medium">Product Description *</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Detailed description of your product including condition, features, etc."
                      required
                      className="rounded-3"
                      style={{ borderColor: '#667eea' }}
                    />
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-medium">Category *</Form.Label>
                        <Form.Select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          required
                          className="rounded-3"
                          style={{ borderColor: '#667eea' }}
                        >
                          <option value="">Select Category</option>
                          {categories.map(category => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-medium">Condition *</Form.Label>
                        <Form.Select
                          name="condition"
                          value={formData.condition}
                          onChange={handleInputChange}
                          required
                          className="rounded-3"
                          style={{ borderColor: '#667eea' }}
                        >
                          <option value="">Select Condition</option>
                          {conditions.map(condition => (
                            <option key={condition} value={condition}>
                              {condition}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                </div>

                {/* Images */}
                <div className="mb-4">
                  <h5 className="mb-3 d-flex align-items-center" style={{ color: '#667eea' }}>
                    <FaImage className="me-2" />
                    Product Images
                  </h5>
                  
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-medium">Upload Images * (Max 5)</Form.Label>
                    <Form.Control
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={formData.images.length >= 5}
                      className="rounded-3"
                      style={{ borderColor: '#667eea' }}
                    />
                    <Form.Text className="text-muted">
                      Upload high-quality images. First image will be the main display image.
                    </Form.Text>
                  </Form.Group>

                  {formData.images.length > 0 && (
                    <div className="mb-3">
                      <Row>
                        {formData.images.map((image, index) => (
                          <Col xs={6} md={4} lg={3} key={index} className="mb-3">
                            <div className="position-relative">
                              <img
                                src={URL.createObjectURL(image)}
                                alt={`Product ${index + 1}`}
                                className="img-fluid rounded-3 shadow-sm"
                                style={{ aspectRatio: '1', objectFit: 'cover' }}
                              />
                              <Button
                                variant="danger"
                                size="sm"
                                className="position-absolute top-0 end-0 m-1 rounded-circle"
                                onClick={() => removeImage(index)}
                                style={{ width: '30px', height: '30px' }}
                              >
                                ×
                              </Button>
                              {index === 0 && (
                                <div className="position-absolute bottom-0 start-0 m-2">
                                  <small className="badge text-white px-2 py-1 rounded-3" 
                                         style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                                    Main Image
                                  </small>
                                </div>
                              )}
                            </div>
                          </Col>
                        ))}
                      </Row>
                    </div>
                  )}
                </div>

                {/* Pricing & Auction Settings */}
                <div className="mb-4">
                  <h5 className="mb-3 d-flex align-items-center" style={{ color: '#667eea' }}>
                    <FaDollarSign className="me-2" />
                    Auction Settings
                  </h5>
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-medium">Starting Price * (ETH)</Form.Label>
                        <Form.Control
                          type="number"
                          name="startingPrice"
                          value={formData.startingPrice}
                          onChange={handleInputChange}
                          placeholder="0.01"
                          min="0.001"
                          step="0.001"
                          required
                          className="rounded-3"
                          style={{ borderColor: '#667eea' }}
                        />
                        <Form.Text className="text-muted">
                          Minimum starting price is 0.001 ETH
                        </Form.Text>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-medium">Auction Duration * (Hours)</Form.Label>
                        <Form.Select
                          name="auctionDuration"
                          value={formData.auctionDuration}
                          onChange={handleInputChange}
                          required
                          className="rounded-3"
                          style={{ borderColor: '#667eea' }}
                        >
                          <option value="">Select Duration</option>
                          <option value="1">1 Hour</option>
                          <option value="6">6 Hours</option>
                          <option value="12">12 Hours</option>
                          <option value="24">1 Day</option>
                          <option value="48">2 Days</option>
                          <option value="72">3 Days</option>
                          <option value="168">1 Week</option>
                        </Form.Select>
                        <Form.Text className="text-muted">
                          Choose auction duration (1-168 hours)
                        </Form.Text>
                      </Form.Group>
                    </Col>
                  </Row>
                </div>

                <Alert variant="info" className="border-0 mb-4" style={{ backgroundColor: '#e3f2fd' }}>
                  <h6 className="fw-bold mb-2">⚠️ Important Notes:</h6>
                  <ul className="mb-0 small">
                    <li>Platform fee: 2.5% of winning bid</li>
                    <li>Auctions cannot be cancelled once bidding starts</li>
                    <li>All transactions are on Ethereum blockchain</li>
                    <li>Winners must pay within 24 hours</li>
                  </ul>
                </Alert>

                <div className="d-grid gap-3">
                  <Button
                    type="submit"
                    size="lg"
                    className="fw-medium rounded-3"
                    disabled={loading}
                    style={{ 
                      background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                      border: 'none'
                    }}
                  >
                    {loading ? 'Creating Auction...' : '🚀 Create Auction'}
                  </Button>
                  <Button
                    variant="outline-secondary"
                    size="lg"
                    onClick={() => navigate('/auctions')}
                    disabled={loading}
                    className="fw-medium rounded-3"
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UploadProduct;
