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
        </div>
    )
}