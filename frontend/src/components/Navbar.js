import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
    const [click, setClick] = useState(false);
    const [color, setColor] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Changes navbar color on scroll
    useEffect(() => {
        const changeColor = () => {
            if (window.scrollY >= 50) {
                setColor(true);
            } else {
                setColor(false);
            }
        };

        window.addEventListener("scroll", changeColor);
        return () => window.removeEventListener("scroll", changeColor);
    }, []);

    const handleLogoutClick = () => {
        console.log("Logout button clicked");
        navigate("/");
    };

    // Hide Navbar on Intropage
    if (location.pathname === "/") {
        return null;
    }

    return (
        <div className={color ? "header header-bg" : "header"}>
            <Link to="/" className="logo">
                <h1>Next Enti?</h1>
            </Link>

            <ul className={click ? "nav-menu active" : "nav-menu"}>
                <li><Link to="/Mainpage">Home</Link></li>
                <li><Link to="/Team">Team</Link></li>
                <li><Link to="/About">About</Link></li>
                {/* Logout as a list item */}
                <li><Link to="/" onClick={handleLogoutClick}>Logout</Link></li>
            </ul>

            <div className="hamburger" onClick={() => setClick(!click)}>
                <span className="bar"></span>
                <span className="bar"></span>
                <span className="bar"></span>
            </div>
        </div>
    );
};

export default Navbar;