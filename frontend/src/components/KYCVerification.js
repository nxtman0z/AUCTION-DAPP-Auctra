import React, { useState } from 'react';
import { Modal, Form, Button, Alert, ProgressBar } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { FaIdCard, FaCheckCircle } from 'react-icons/fa';

const KYCVerification = ({ show, onHide }) => {
  const { verifyUser } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    address: '',
    phoneNumber: '',
    idNumber: '',
    idDocument: null
  });
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      idDocument: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate KYC verification process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setVerified(true);
    verifyUser();
    setLoading(false);
    
    setTimeout(() => {
      onHide();
      setStep(1);
      setVerified(false);
      setFormData({
        fullName: '',
        dateOfBirth: '',
        address: '',
        phoneNumber: '',
        idNumber: '',
        idDocument: null
      });
    }, 2000);
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title className="d-flex align-items-center">
          <FaIdCard className="me-2 text-primary" />
          KYC Verification
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        {verified ? (
          <div className="text-center py-4">
            <FaCheckCircle size={60} className="text-success mb-3" />
            <h4 className="text-success">Verification Complete!</h4>
            <p>Your account has been successfully verified. You can now participate in all auction activities.</p>
          </div>
        ) : (
          <>
            <ProgressBar now={(step / 2) * 100} className="mb-4" />
            
            <Form onSubmit={handleSubmit}>
              {step === 1 && (
                <div>
                  <h5 className="mb-3">Personal Information</h5>
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name *</Form.Label>
                    <Form.Control
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Date of Birth *</Form.Label>
                    <Form.Control
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Phone Number *</Form.Label>
                    <Form.Control
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Address *</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </div>
              )}
              
              {step === 2 && (
                <div>
                  <h5 className="mb-3">Identity Verification</h5>
                  <Form.Group className="mb-3">
                    <Form.Label>ID Number *</Form.Label>
                    <Form.Control
                      type="text"
                      name="idNumber"
                      value={formData.idNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Upload ID Document *</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                      required
                    />
                    <Form.Text className="text-muted">
                      Upload a clear photo or scan of your government-issued ID
                    </Form.Text>
                  </Form.Group>
                  
                  <Alert variant="info">
                    <strong>Privacy Notice:</strong> Your documents are encrypted and securely stored. 
                    They will only be used for verification purposes.
                  </Alert>
                </div>
              )}
            </Form>
          </>
        )}
      </Modal.Body>
      
      {!verified && (
        <Modal.Footer>
          {step > 1 && (
            <Button variant="secondary" onClick={prevStep}>
              Previous
            </Button>
          )}
          {step < 2 ? (
            <Button 
              variant="primary" 
              onClick={nextStep}
              disabled={!formData.fullName || !formData.dateOfBirth || !formData.phoneNumber || !formData.address}
            >
              Next
            </Button>
          ) : (
            <Button 
              variant="success" 
              onClick={handleSubmit}
              disabled={loading || !formData.idNumber || !formData.idDocument}
            >
              {loading ? 'Verifying...' : 'Submit for Verification'}
            </Button>
          )}
        </Modal.Footer>
      )}
    </Modal>
  );
};

export default KYCVerification;
