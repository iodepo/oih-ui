import {Container, Nav, Navbar, NavDropdown} from "react-bootstrap";
import OIHLogo from '../resources/Logo Nav x 2.png'

export default function Header() {
    return (
        <div className="pt-4">
            <Navbar variant="" expand="lg" className="navbar-oih">
              <Container id="NavContainer">
                <Navbar.Brand className="text-white h6" href="/">Become a partner</Navbar.Brand>
                {/*<Navbar.Toggle aria-controls="basic-navbar-nav" />*/}
                <Navbar.Collapse id="basic-navbar-nav">
                  <Nav className="justify-content-end flex-grow-1 pe-3">
                    <Nav.Link className="text-light menu-text" href="/">HOME</Nav.Link>
                    <Nav.Link className="text-light menu-text" href="/">ABOUT</Nav.Link>
                    <Nav.Link className="text-light menu-text" href="/">FAQ</Nav.Link>
                  </Nav>
                </Navbar.Collapse>
              </Container>
            </Navbar>
        </div>
    )
}