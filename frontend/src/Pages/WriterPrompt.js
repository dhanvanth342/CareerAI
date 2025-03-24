import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/Navbar';
import '../components/Styles/WriterPrompt.css';
import '../components/Styles/Aiprompt.css';

const WriterPrompt = () => {
  const navigate = useNavigate();
  const [education, setEducation] = useState('');
  const [skills, setSkills] = useState('');
  const [interests, setInterests] = useState('');
  const [experience, setExperience] = useState('');
  const [preferences, setPreferences] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [showOkButton, setShowOkButton] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setShowModal(true);
    setShowOkButton(false);
    setIsLoading(true);

    setTimeout(() => {
      setShowOkButton(true);
      setIsLoading(false);
    }, 16000);

    try {
      const formData = {
        education: education,
        skills: skills,
        interests: interests,
        experience: experience,
        preferences: preferences
      };

      const response = await fetch('http://localhost:5000/generate-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      navigate('/aiprompt', { state: { prompt: data.prompt } });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      <NavBar />
      <div className="writer-prompt-container">
        <form onSubmit={handleSubmit}>
          {/* ... your existing form fields ... */}
        </form>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-text">
              {isLoading ? (
                <div className="wave-loader">
                  <div className="wave-bar"></div>
                  <div className="wave-bar"></div>
                  <div className="wave-bar"></div>
                  <div className="wave-bar"></div>
                  <div className="wave-bar"></div>
                </div>
              ) : (
                <div className="thumbs-up">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z" 
                      stroke="#83c9fc" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      className="thumbs-up-path"/>
                  </svg>
                </div>
              )}
              <p>It's your career we are loading, please wait...</p>
            </div>
            {showOkButton && (
              <button 
                className="modal-ok-button"
                onClick={() => setShowModal(false)}
              >
                OK
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default WriterPrompt; 