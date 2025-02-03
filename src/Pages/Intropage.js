
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/Styles/Intropage.css'; // Ensure this file has the required styles

const symbolsArray = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789∑π√∆∫∞≠≈'.split('');

const Intropage = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => navigate('/Login');
  const handleGetStarted = () => navigate('/Signup');

  // Generate random symbols with random colors and animation
  const symbols = Array.from({ length: 50 }).map((_, i) => {
    const randomSymbol = symbolsArray[Math.floor(Math.random() * symbolsArray.length)];
    const randomClass = Math.random() > 0.5 ? 'blue' : 'green'; // Randomize color class
    return (
      <div
        key={i}
        className={`symbol ${randomClass}`}
        style={{
          top: `${Math.random() * 100}vh`,
          left: `${Math.random() * 100}vw`,
          animationDuration: `${6 + Math.random() * 5}s`,
          fontSize: `${1 + Math.random() * 2.5}rem`,
        }}
      >
        {randomSymbol}
      </div>
    );
  });

  return (
    <div className="intro-container">
      <div className="symbols-container">{symbols}</div>

      <nav className="navbar">
        <div className="logo">Career AI</div>
        <button className="animated-button" onClick={handleLoginClick}>
          Log In
          <span></span><span></span><span></span><span></span>
        </button>
      </nav>

      <main className="main-content">
        <h1 className="center-title">Career AI</h1>
        <p className="intro-text">
          Are you unsure about your career path? Answer a few questions or share your prompt to receive personalized career suggestions. Start now and gain clarity on your future opportunities!
        </p>
        <button className="animated-get-button" onClick={handleGetStarted}>
          Get Started
          <span></span><span></span><span></span><span></span>
        </button>
      </main>
    </div>
  );
};

export default Intropage;

/*
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/Styles/Intropage.css';

const Intropage = () => {
  const navigate = useNavigate(); // Initialize navigation

  // Navigate to the login page when the "Log In" button is clicked
  const handleLoginClick = () => {
    navigate('/Login');
  };

  // Navigate to the login page (or other pages) when "Get Started" is clicked
  const handleGetStarted = () => {
    navigate('/Signup'); // Redirect to the login page
  };

  return (
    <div className="intro-container">
      <nav className="navbar">
        <div className="logo">Career AI</div>
        <button className="login-btn" onClick={handleLoginClick}>
          Log In
        </button>
      </nav>
      
      <main className="main-content">
        <h1 className="center-title">Career AI</h1>
        <p className="intro-text">
          Are you unsure about your career path? Answer a few questions or share your prompt to receive personalized career suggestions. Start now and gain clarity on your future opportunities! 
        </p>
        <button className="get-started-btn" onClick={handleGetStarted}>
          Get Started
        </button>
      </main>
    </div>
  );
};

export default Intropage;
*/