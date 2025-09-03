import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaTwitter, FaFacebook, FaInstagram, FaGithub, FaLinkedin } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Footer = () => {
  const { theme } = useAuth();
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`py-4 mt-5 ${theme === 'dark' ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
      <Container>
        <Row>
          <Col md={4} className="mb-3">
            <h5 className="fw-bold">AuctionBlock</h5>
            <p className="mb-2">Decentralized auction platform powered by blockchain technology.</p>
            <p className="mb-0 text-primary fw-medium">🔗 Powered by Blockchain</p>
          </Col>
          
          <Col md={3} className="mb-3">
            <h6 className="fw-bold">Quick Links</h6>
            <ul className="list-unstyled">
              <li><Link to="/" className="text-decoration-none">Home</Link></li>
              <li><Link to="/auctions" className="text-decoration-none">Auctions</Link></li>
              <li><Link to="/upload" className="text-decoration-none">Upload Product</Link></li>
              <li><Link to="/my-bids" className="text-decoration-none">My Bids</Link></li>
            </ul>
          </Col>
          
          <Col md={3} className="mb-3">
            <h6 className="fw-bold">Support</h6>
            <ul className="list-unstyled">
              <li><button className="btn btn-link p-0 text-decoration-none text-start">Contact Us</button></li>
              <li><button className="btn btn-link p-0 text-decoration-none text-start">FAQ</button></li>
              <li><button className="btn btn-link p-0 text-decoration-none text-start">Terms of Service</button></li>
              <li><button className="btn btn-link p-0 text-decoration-none text-start">Privacy Policy</button></li>
            </ul>
          </Col>
          
          <Col md={2} className="mb-3">
            <h6 className="fw-bold">Follow Us</h6>
            <div className="d-flex gap-2">
              <button className="btn btn-link p-0 text-decoration-none">
                <FaTwitter size={20} />
              </button>
              <button className="btn btn-link p-0 text-decoration-none">
                <FaFacebook size={20} />
              </button>
              <button className="btn btn-link p-0 text-decoration-none">
                <FaInstagram size={20} />
              </button>
              <button className="btn btn-link p-0 text-decoration-none">
                <FaGithub size={20} />
              </button>
              <button className="btn btn-link p-0 text-decoration-none">
                <FaLinkedin size={20} />
              </button>
            </div>
          </Col>
        </Row>
        
        <hr className="my-3" />
        
        <Row>
          <Col className="text-center">
            <p className="mb-0">
              © {currentYear} AuctionBlock. All rights reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
