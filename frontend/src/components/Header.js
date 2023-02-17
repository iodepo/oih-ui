import React, { useState } from 'react';
import {Navbar, Nav, Form, FormControl, Button, NavDropdown, Container, Col} from 'react-bootstrap';
import logo1 from '../resources/Logo Nav x 2.png';

export default function Header() {
    const [showNav, setShowNav] = useState(true);

    function closeSidebar() {
        const menubar = document.getElementById("responsive-navbar-nav");
        menubar.classList.remove("show");
    }

    return (
        <div>
            <Navbar expand={false} variant="dark" className="navbar-oih pt-4" collapseOnSelect>
                <Container id="NavContainer">
                    <Col md="auto">
                        <Navbar.Brand className="text-white h6" href="https://oceaninfohub.org/contact-2/" target="_blank">Become a partner</Navbar.Brand>
                    </Col>
                    <Col md="auto">
                        <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                        <Navbar.Collapse id="responsive-navbar-nav">
                            <Nav className="mr-auto">
                                <Nav.Link className="text-light menu-text" href="https://oceaninfohub.org/" target="_blank">OIH HOME</Nav.Link>
                                <Nav.Link className="text-light menu-text" href="https://oceaninfohub.org/about/project-overview/" target="_blank">ABOUT OIH</Nav.Link>
                                {/* <Nav.Link className="text-light menu-text" href="/">FAQ</Nav.Link> */}
                                <Nav.Link className="text-light menu-text" href="http://graph.oceaninfohub.org/blazegraph/#query" target="_blank">ODIS GRAPH INTERFACE</Nav.Link>
                                <Nav.Link className="text-light menu-text" href="http://catalogue.gatewaygeo.ca:8501/odis/dashboard/" target="_blank">ODIS DASHBOARD</Nav.Link>
                            </Nav>
                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" style={{fill: "#fff"}}
                                 width="30" height="30"
                                 viewBox="0 0 30 30" className="close-btn" onClick={() => closeSidebar()}>
                                <path
                                    d="M 7 4 C 6.744125 4 6.4879687 4.0974687 6.2929688 4.2929688 L 4.2929688 6.2929688 C 3.9019687 6.6839688 3.9019687 7.3170313 4.2929688 7.7070312 L 11.585938 15 L 4.2929688 22.292969 C 3.9019687 22.683969 3.9019687 23.317031 4.2929688 23.707031 L 6.2929688 25.707031 C 6.6839688 26.098031 7.3170313 26.098031 7.7070312 25.707031 L 15 18.414062 L 22.292969 25.707031 C 22.682969 26.098031 23.317031 26.098031 23.707031 25.707031 L 25.707031 23.707031 C 26.098031 23.316031 26.098031 22.682969 25.707031 22.292969 L 18.414062 15 L 25.707031 7.7070312 C 26.098031 7.3170312 26.098031 6.6829688 25.707031 6.2929688 L 23.707031 4.2929688 C 23.316031 3.9019687 22.682969 3.9019687 22.292969 4.2929688 L 15 11.585938 L 7.7070312 4.2929688 C 7.5115312 4.0974687 7.255875 4 7 4 z"></path>
                            </svg>
                        </Navbar.Collapse>
                    </Col>
                </Container>
            </Navbar>
        </div>
    )
}