import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, ProgressBar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaUserShield, FaFileUpload, FaUser, FaStar, FaGraduationCap } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const ApplyForAdmin = () => {
  const { user, theme } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    experience: '',
    skills: '',
    motivation: '',
    portfolioLink: '',
    linkedinProfile: '',
    previousAdminExperience: '',
    availability: ''
  });

  const [files, setFiles] = useState({
    cv: null,
    photo: null,
    skillsCertificate: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    if (selectedFiles[0]) {
      setFiles(prev => ({
        ...prev,
        [name]: selectedFiles[0]
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Create FormData for file uploads
      const submitData = new FormData();
      
      // Add form fields
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });

      // Add files
      if (files.cv) submitData.append('cv', files.cv);
      if (files.photo) submitData.append('photo', files.photo);
      if (files.skillsCertificate) submitData.append('skillsCertificate', files.skillsCertificate);

      // Add current user info if logged in
      if (user) {
        submitData.append('currentUserEmail', user.email);
        submitData.append('currentUserName', user.name);
      }

      // Submit to Formspree
      const response = await fetch('https://formspree.io/f/xldwoded', {
        method: 'POST',
        body: submitData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          experience: '',
          skills: '',
          motivation: '',
          portfolioLink: '',
          linkedinProfile: '',
          previousAdminExperience: '',
          availability: ''
        });
        setFiles({
          cv: null,
          photo: null,
          skillsCertificate: null
        });
        
        // Reset file inputs
        document.querySelectorAll('input[type="file"]').forEach(input => input.value = '');
      } else {
        throw new Error('Failed to submit application');
      }
    } catch (err) {
      setError('Failed to submit application. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSuccess(false);
    setError('');
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card className={`shadow-lg border-0 ${theme === 'dark' ? 'bg-dark text-light' : 'bg-white'}`} 
                style={{ borderRadius: '20px', overflow: 'hidden' }}>
            
            {/* Header */}
            <Card.Header className="p-4 border-0" 
                         style={{ 
                           background: 'linear-gradient(135deg, #6f42c1 0%, #007bff 100%)',
                           color: 'white'
                         }}>
              <div className="text-center">
                <FaUserShield size={48} className="mb-3" />
                <h2 className="mb-2 fw-bold">Apply for Admin Role</h2>
                <p className="mb-0 opacity-75">
                  Join our administrative team and help manage the auction platform
                </p>
              </div>
            </Card.Header>

            <Card.Body className="p-4">
              {success ? (
                <Alert variant="success" className="text-center p-4 border-0 rounded-4">
                  <FaUserShield size={32} className="mb-3 text-success" />
                  <h4 className="text-success mb-3">Application Submitted Successfully!</h4>
                  <p className="mb-3">
                    Thank you for your interest in becoming an admin. We have received your application 
                    and will review it carefully. You will receive an email confirmation shortly.
                  </p>
                  <p className="small text-muted mb-3">
                    Our team typically reviews applications within 3-5 business days.
                  </p>
                  <div className="d-flex gap-2 justify-content-center">
                    <Button 
                      variant="success" 
                      onClick={() => navigate('/')}
                      className="px-4"
                    >
                      Go Home
                    </Button>
                    <Button 
                      variant="outline-success" 
                      onClick={resetForm}
                      className="px-4"
                    >
                      Submit Another Application
                    </Button>
                  </div>
                </Alert>
              ) : (
                <>
                  {error && (
                    <Alert variant="danger" className="rounded-4 border-0">
                      {error}
                    </Alert>
                  )}

                  <Alert variant="info" className="rounded-4 border-0 mb-4">
                    <FaUserShield className="me-2" />
                    <strong>Admin Role Requirements:</strong> We're looking for experienced individuals 
                    who can help moderate auctions, manage users, and maintain platform quality.
                  </Alert>

                  <Form onSubmit={handleSubmit}>
                    {/* Personal Information */}
                    <h5 className="text-primary mb-3">
                      <FaUser className="me-2" />
                      Personal Information
                    </h5>
                    
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-medium">Full Name *</Form.Label>
                          <Form.Control
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            required
                            className="rounded-3 border-2"
                            placeholder="Your full name"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-medium">Email Address *</Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="rounded-3 border-2"
                            placeholder="your.email@example.com"
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-medium">Phone Number *</Form.Label>
                          <Form.Control
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                            className="rounded-3 border-2"
                            placeholder="+1 (555) 123-4567"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-medium">LinkedIn Profile</Form.Label>
                          <Form.Control
                            type="url"
                            name="linkedinProfile"
                            value={formData.linkedinProfile}
                            onChange={handleInputChange}
                            className="rounded-3 border-2"
                            placeholder="https://linkedin.com/in/yourprofile"
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    {/* Professional Experience */}
                    <h5 className="text-primary mb-3 mt-4">
                      <FaGraduationCap className="me-2" />
                      Professional Experience
                    </h5>

                    <Form.Group className="mb-3">
                      <Form.Label className="fw-medium">Years of Relevant Experience *</Form.Label>
                      <Form.Select
                        name="experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                        required
                        className="rounded-3 border-2"
                      >
                        <option value="">Select experience level</option>
                        <option value="0-1">0-1 years</option>
                        <option value="2-3">2-3 years</option>
                        <option value="4-5">4-5 years</option>
                        <option value="6-10">6-10 years</option>
                        <option value="10+">10+ years</option>
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label className="fw-medium">Technical Skills *</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="skills"
                        value={formData.skills}
                        onChange={handleInputChange}
                        required
                        className="rounded-3 border-2"
                        placeholder="List your relevant technical skills (e.g., Web Development, Database Management, Security, etc.)"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label className="fw-medium">Previous Admin Experience</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="previousAdminExperience"
                        value={formData.previousAdminExperience}
                        onChange={handleInputChange}
                        className="rounded-3 border-2"
                        placeholder="Describe any previous administrative or moderation experience"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label className="fw-medium">Portfolio/Website Link</Form.Label>
                      <Form.Control
                        type="url"
                        name="portfolioLink"
                        value={formData.portfolioLink}
                        onChange={handleInputChange}
                        className="rounded-3 border-2"
                        placeholder="https://yourportfolio.com"
                      />
                    </Form.Group>

                    {/* Motivation & Availability */}
                    <h5 className="text-primary mb-3 mt-4">
                      <FaStar className="me-2" />
                      Motivation & Availability
                    </h5>

                    <Form.Group className="mb-3">
                      <Form.Label className="fw-medium">Why do you want to be an admin? *</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        name="motivation"
                        value={formData.motivation}
                        onChange={handleInputChange}
                        required
                        className="rounded-3 border-2"
                        placeholder="Explain your motivation and what you can bring to the admin team"
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label className="fw-medium">Availability *</Form.Label>
                      <Form.Select
                        name="availability"
                        value={formData.availability}
                        onChange={handleInputChange}
                        required
                        className="rounded-3 border-2"
                      >
                        <option value="">Select your availability</option>
                        <option value="part-time">Part-time (10-20 hours/week)</option>
                        <option value="full-time">Full-time (40+ hours/week)</option>
                        <option value="flexible">Flexible/As needed</option>
                        <option value="weekends">Weekends only</option>
                        <option value="evenings">Evenings only</option>
                      </Form.Select>
                    </Form.Group>

                    {/* File Uploads */}
                    <h5 className="text-primary mb-3">
                      <FaFileUpload className="me-2" />
                      Required Documents
                    </h5>

                    <Row>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-medium">CV/Resume *</Form.Label>
                          <Form.Control
                            type="file"
                            name="cv"
                            onChange={handleFileChange}
                            required
                            accept=".pdf,.doc,.docx"
                            className="rounded-3 border-2"
                          />
                          <Form.Text className="text-muted small">
                            PDF, DOC, DOCX (Max 5MB)
                          </Form.Text>
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-medium">Professional Photo *</Form.Label>
                          <Form.Control
                            type="file"
                            name="photo"
                            onChange={handleFileChange}
                            required
                            accept="image/*"
                            className="rounded-3 border-2"
                          />
                          <Form.Text className="text-muted small">
                            JPG, PNG (Max 2MB)
                          </Form.Text>
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-medium">Skills Certificate</Form.Label>
                          <Form.Control
                            type="file"
                            name="skillsCertificate"
                            onChange={handleFileChange}
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="rounded-3 border-2"
                          />
                          <Form.Text className="text-muted small">
                            Any relevant certifications (Optional)
                          </Form.Text>
                        </Form.Group>
                      </Col>
                    </Row>

                    {/* Loading Progress */}
                    {loading && (
                      <div className="mb-3">
                        <div className="d-flex align-items-center mb-2">
                          <span className="me-3">Submitting application...</span>
                        </div>
                        <ProgressBar animated now={100} variant="primary" />
                      </div>
                    )}

                    {/* Submit Button */}
                    <div className="text-center">
                      <Button
                        type="submit"
                        disabled={loading}
                        className="btn-gradient px-5 py-3 fw-bold border-0 rounded-4"
                        style={{
                          background: 'linear-gradient(135deg, #6f42c1 0%, #007bff 100%)',
                          boxShadow: '0 4px 15px rgba(111, 66, 193, 0.3)',
                          transform: loading ? 'scale(0.95)' : 'scale(1)',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" />
                            Submitting Application...
                          </>
                        ) : (
                          <>
                            <FaUserShield className="me-2" />
                            Submit Admin Application
                          </>
                        )}
                      </Button>
                    </div>

                    <div className="text-center mt-3">
                      <small className="text-muted">
                        By submitting this application, you agree that all information provided is accurate and complete.
                      </small>
                    </div>
                  </Form>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ApplyForAdmin;
