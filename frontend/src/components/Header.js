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
                        <Navbar.Brand className="text-white h6">This page is still a BETA version!!</Navbar.Brand>
                    </Col>
                </Container>
            </Navbar>
        </div>
    )
}