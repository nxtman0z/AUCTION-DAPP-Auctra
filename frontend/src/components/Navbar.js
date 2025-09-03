import React, { useState } from 'react';
import { Navbar as BSNavbar, Nav, Container, Button, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaMoon, FaSun, FaGavel } from 'react-icons/fa';
import KYCVerification from './KYCVerification';

const Navbar = () => {
  const { user, logout, theme, toggleTheme } = useAuth();
  const navigate = useNavigate();
  const [showKYC, setShowKYC] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <BSNavbar bg={theme === 'dark' ? 'dark' : 'light'} variant={theme} fixed="top" expand="lg" className="shadow-sm">
        <Container>
          <BSNavbar.Brand as={Link} to="/" className="fw-bold d-flex align-items-center">
            <FaGavel className="me-2 text-primary" size={24} />
            AuctionBlock
          </BSNavbar.Brand>
          
          <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
          
          <BSNavbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/" className="fw-medium">
                Home
              </Nav.Link>
              <Nav.Link as={Link} to="/auctions" className="fw-medium">
                Auctions
              </Nav.Link>
              {user && (
                <>
                  <Nav.Link as={Link} to="/upload" className="fw-medium">
                    Upload Product
                  </Nav.Link>
                  <Nav.Link as={Link} to="/my-bids" className="fw-medium">
                    My Bids
                  </Nav.Link>
                  {user.isAdmin ? (
                    <Nav.Link as={Link} to="/admin" className="fw-medium text-warning">
                      Admin Dashboard
                    </Nav.Link>
                  ) : (
                    <Nav.Link as={Link} to="/apply-admin" className="fw-medium text-info">
                      Apply for Admin
                    </Nav.Link>
                  )}
                </>
              )}
            </Nav>
            
            <Nav className="align-items-center">
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={toggleTheme}
                className="me-3"
              >
                {theme === 'light' ? <FaMoon /> : <FaSun />}
              </Button>
              
              {user ? (
                <Dropdown align="end">
                  <Dropdown.Toggle variant="outline-primary" id="dropdown-basic" className="d-flex align-items-center">
                    <FaUser className="me-2" />
                    {user.name}
                  </Dropdown.Toggle>
                  
                  <Dropdown.Menu>
                    <Dropdown.Item as={Link} to="/profile">
                      Profile
                    </Dropdown.Item>
                    {!user.isVerified && (
                      <Dropdown.Item onClick={() => setShowKYC(true)} className="text-warning">
                        Complete KYC
                      </Dropdown.Item>
                    )}
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout} className="text-danger">
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <div>
                  <Button
                    as={Link}
                    to="/login"
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                  >
                    Login
                  </Button>
                  <Button
                    as={Link}
                    to="/signup"
                    variant="primary"
                    size="sm"
                  >
                    Signup
                  </Button>
                </div>
              )}
            </Nav>
          </BSNavbar.Collapse>
        </Container>
      </BSNavbar>

      <KYCVerification show={showKYC} onHide={() => setShowKYC(false)} />
    </>
  );
};

export default Navbar;
