
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/Styles/Intropage.css';

const IntroPage = () => {
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

export default IntroPage;

