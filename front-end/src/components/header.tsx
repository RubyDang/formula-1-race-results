'use client'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import './componentGlobal.css';
import { Offcanvas } from 'react-bootstrap';
import Cookies from 'universal-cookie';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function Header() {
  const cookies = new Cookies();
  const router = useRouter();
  const [offset, setOffset] = useState(0);

  const onClick = (event: React.MouseEvent<HTMLAnchorElement>)=>{
    event.preventDefault();
    cookies.set('isLoading', true, { path: '/' })
    router.push(`${(event.target as HTMLAnchorElement).href||"/"}`);
  }

    useEffect(() => {
        const onScroll = () => setOffset(window.pageYOffset);
        // clean up code
        window.removeEventListener('scroll', onScroll);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

  return (
    <Navbar  expand="md" className={`py-0 custom-header ${offset >= 250 && "custom-header-changed-style"}`} id='header'>
      <Container fluid>
        <Navbar.Brand href="/" onClick={onClick}>
          F1
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Offcanvas
          id={`offcanvasNavbar-expand-md`}
          aria-labelledby={`offcanvasNavbarLabel-expand-md`}
          placement="start"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id={`offcanvasNavbarLabel-expand-md`}>
              F1
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body className='justify-content-lg-start justify-content-md-around align-items-center'>
            <Nav.Link href="/" className='custom-dropdown py-3' onClick={onClick}>Home</Nav.Link>
            <NavDropdown
              className='mx-lg-3 custom-dropdown py-3'
              title="Results By Years"
              id={`offcanvasNavbarDropdown-expand-md`}
            >
              <NavDropdown.Item className={`h-100 custom-dropdown-item`} href="/results/races" onClick={onClick}>Race Results</NavDropdown.Item>
              <NavDropdown.Item className={`h-100 custom-dropdown-item`} href="/results/teams" onClick={onClick}>Teams</NavDropdown.Item>
              <NavDropdown.Item className={`h-100 custom-dropdown-item`} href="/results/drivers" onClick={onClick}>Drivers</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown
              className='mx-lg-3 custom-dropdown py-3'
              title="Few Results In 3 Years"
              id={`offcanvasNavbarDropdown-expand-md-1`}
            >
              <NavDropdown.Item className={`h-100 custom-dropdown-item`} href="/fewer-results/races" onClick={onClick}>Race Results</NavDropdown.Item>
              <NavDropdown.Item className={`h-100 custom-dropdown-item`} href="/fewer-results/teams" onClick={onClick}>Teams</NavDropdown.Item>
              <NavDropdown.Item className={`h-100 custom-dropdown-item`} href="/fewer-results/drivers" onClick={onClick}>Drivers</NavDropdown.Item>
            </NavDropdown>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
}

export default Header;