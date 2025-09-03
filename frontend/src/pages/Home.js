import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaGavel, FaUpload, FaTrophy, FaShieldAlt, FaUsers, FaClock } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { theme } = useAuth();

  const features = [
    {
      icon: <FaGavel size={40} className="text-primary mb-3" />,
      title: "Live Auctions",
      description: "Participate in real-time bidding with transparent blockchain transactions"
    },
    {
      icon: <FaShieldAlt size={40} className="text-success mb-3" />,
      title: "Secure & Trusted",
      description: "Built on blockchain technology ensuring security and transparency"
    },
    {
      icon: <FaUsers size={40} className="text-info mb-3" />,
      title: "Global Community",
      description: "Connect with buyers and sellers from around the world"
    },
    {
      icon: <FaClock size={40} className="text-warning mb-3" />,
      title: "24/7 Available",
      description: "Auctions run continuously with automatic settlement"
    }
  ];

  const stats = [
    { number: "1,234", label: "Total Auctions" },
    { number: "567", label: "Active Users" },
    { number: "$2.5M", label: "Total Volume" },
    { number: "98%", label: "Success Rate" }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className={`py-5 ${theme === 'dark' ? 'bg-dark' : 'bg-light'}`}>
        <Container>
          <Row className="align-items-center min-vh-50">
            <Col lg={6}>
              <h1 className="display-4 fw-bold mb-4">
                Decentralized Auction Platform
              </h1>
              <p className="lead mb-4 text-muted">
                Bid. Win. Own.
              </p>
              <p className="mb-4">
                Experience the future of auctions with our blockchain-powered platform. 
                Transparent, secure, and fair bidding for everyone.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <Button 
                  as={Link} 
                  to="/auctions" 
                  variant="primary" 
                  size="lg"
                  className="px-4"
                >
                  Explore Auctions
                </Button>
                <Button 
                  as={Link} 
                  to="/upload" 
                  variant="outline-primary" 
                  size="lg"
                  className="px-4"
                >
                  <FaUpload className="me-2" />
                  Upload Product
                </Button>
              </div>
            </Col>
            <Col lg={6} className="text-center">
              <div className="position-relative">
                <div className="bg-gradient rounded-circle d-inline-flex align-items-center justify-content-center" 
                     style={{ width: '300px', height: '300px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                  <FaTrophy size={120} className="text-white" />
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="py-5">
        <Container>
          <Row>
            {stats.map((stat, index) => (
              <Col md={3} className="text-center mb-4" key={index}>
                <h2 className="fw-bold text-primary mb-1">{stat.number}</h2>
                <p className="text-muted mb-0">{stat.label}</p>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className={`py-5 ${theme === 'dark' ? 'bg-secondary bg-opacity-10' : 'bg-light'}`}>
        <Container>
          <Row className="mb-5">
            <Col className="text-center">
              <h2 className="fw-bold mb-3">Why Choose AuctionBlock?</h2>
              <p className="lead text-muted">
                Revolutionizing the auction experience with cutting-edge technology
              </p>
            </Col>
          </Row>
          <Row>
            {features.map((feature, index) => (
              <Col md={6} lg={3} className="mb-4" key={index}>
                <Card className={`h-100 border-0 shadow-sm ${theme === 'dark' ? 'bg-dark text-light' : ''}`}>
                  <Card.Body className="text-center p-4">
                    {feature.icon}
                    <h5 className="fw-bold mb-3">{feature.title}</h5>
                    <p className="text-muted mb-0">{feature.description}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-5">
        <Container>
          <Row>
            <Col className="text-center">
              <div className="bg-primary bg-gradient rounded-3 p-5 text-white">
                <h2 className="fw-bold mb-3">Ready to Start Bidding?</h2>
                <p className="lead mb-4">
                  Join thousands of users who trust AuctionBlock for their auction needs
                </p>
                <div className="d-flex gap-3 justify-content-center flex-wrap">
                  <Button 
                    as={Link} 
                    to="/signup" 
                    variant="light" 
                    size="lg"
                    className="px-4"
                  >
                    Get Started
                  </Button>
                  <Button 
                    as={Link} 
                    to="/auctions" 
                    variant="outline-light" 
                    size="lg"
                    className="px-4"
                  >
                    Browse Auctions
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Home;
