// src/components/Footer.js
import React from 'react';
import '../components/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} NextEnti? All rights reserved.</p>
      <p>
        Have feedback?{' '}
        <a href="mailto:nextentinxt@gmail.com" className="footer-link">
          Email us
        </a>
      </p>
    </footer>
  );
};

export default Footer;

