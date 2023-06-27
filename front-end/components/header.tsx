'use client'
import Image from 'next/image';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import './componentGlobal.css';
function Header() {
  return (
    <Navbar expand="xl" className="" id='header'>
      <Container fluid>
        <Navbar.Brand href="/">
            F1
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/results/races">Race Results</Nav.Link>
            <Nav.Link href="/results/teams">Teams</Nav.Link>
            <Nav.Link href="/results/drivers">Drivers</Nav.Link>
            
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;