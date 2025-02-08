import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../components/Styles/Aiprompt.css';
import Navbar from '../components/Navbar';

const recommendations = [
  {
    job_role: "Software Developer",
    description: "Responsible for developing and maintaining software applications.",
    match_percentage: "85%"
  },
  {
    job_role: "Data Scientist",
    description: "Works on data analysis, machine learning models, and deriving insights.",
    match_percentage: "78%"
  },
  {
    job_role: "Project Manager",
    description: "Oversees project planning, resource allocation, and execution.",
    match_percentage: "80%"
  },
  {
    job_role: "UI/UX Designer",
    description: "Designs intuitive user interfaces and experiences.",
    match_percentage: "75%"
  },
  {
    job_role: "DevOps Engineer",
    description: "Focuses on CI/CD pipelines, automation, and server management.",
    match_percentage: "82%"
  },
  {
    job_role: "Business Analyst",
    description: "Analyzes business requirements and bridges the gap between IT and business.",
    match_percentage: "77%"
  }
];

const Aiprompt = () => {
  const [text, setText] = useState('');
  const [isEditable, setIsEditable] = useState(false);
  const location = useLocation();
  const [prompt, setPrompt] = useState(location.state?.prompt || 'No prompt available');

  const handleTextChange = (e) => {
    setPrompt(e.target.value);
  };

  const handleAccordionToggle = (index) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleEditClick = () => {
    setIsEditable(!isEditable);
  };

  const [openAccordions, setOpenAccordions] = useState({});

  return (
    <>
      <Navbar />
      <div className="aiprompt-container" style={{ marginTop: '200px' }}>
        <div className="prompt-container">
          <h2>Here is your AI-generated Prompt!</h2>
          <div className="textbox-container">
          {isEditable ? (
        <textarea 
          className="prompt-text"
          value={prompt} 
          onChange={handleTextChange}
        />
          ) : (
            <div className="prompt-text static-text">{prompt}</div>
          )}
        </div>
        </div>

        <div className="button-container">
          <button className="edit-button" onClick={handleEditClick}>{isEditable ? 'Save' : 'Edit'}</button>
          <button className="ok-button" onClick={() => console.log(recommendations)}>Submit</button>
        </div>

        {recommendations.map((rec, index) => (
          <div key={index} className="accordion">
            <div 
              className="accordion-header" 
              onClick={() => handleAccordionToggle(index)}
            >
              <h3>{rec.job_role} - {rec.match_percentage}:{rec.description} </h3>
            </div>
            {openAccordions[index] && (
              <div className="accordion-content">
                <div className="accordion-image-holder">
                  <div className="image-placeholder">Image Holder</div>
                </div>
                <div className="accordion-text">
                  <p> Text </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default Aiprompt;
