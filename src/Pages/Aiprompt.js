/*
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../components/Styles/Aiprompt.css';
import Navbar from '../components/Navbar';

const Aiprompt = () => {
  const [text, setText] = useState('');
  const [isEditable, setIsEditable] = useState(false);
  const [recommendations, setRecommendations] = useState([]);  // state to hold recommendations
  const [loading, setLoading] = useState(false);  // state to track loading state
  const location = useLocation();
  const [prompt, setPrompt] = useState(location.state?.prompt || 'No prompt available');
  const [openAccordions, setOpenAccordions] = useState({});
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

  const handleSubmit = async () => {
    // Set loading to true while waiting for recommendations
    setLoading(true);

    try {
      console.log("Submitting prompt:", prompt);
      const response = await fetch('http://localhost:5000/generate-recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      const data = await response.json();
      console.log("API response data:", data);

      // If career_recommendations exist, set them to state
      if (data && data.career_recommendations) {
        setRecommendations(data.career_recommendations);
      } else {
        console.error("No career recommendations in response");
        setRecommendations([]);
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      setRecommendations([]);
    } finally {
      setLoading(false);  // Set loading to false once API call is complete
    }
  };

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
          <button className="edit-button" onClick={handleEditClick}>
            {isEditable ? 'Save' : 'Edit'}
          </button>
          <button className="ok-button" onClick={handleSubmit}>
            Submit
          </button>
        </div>

        {loading ? (
          <p>Loading recommendations...</p>  // Show loading message
        ) : recommendations.length > 0 ? (
          recommendations.map((rec, index) => (
            <div key={index} className="accordion">
              <div 
                className="accordion-header" 
                onClick={() => handleAccordionToggle(index)}
              >
                <h3>{rec.job_role} - {rec.match_percentage}: {rec.description}</h3>
              </div>
              {openAccordions[index] && (
                <div className="accordion-content">
                  <div className="accordion-image-holder">
                    <div className="image-placeholder">Image Holder</div>
                  </div>
                  <div className="accordion-text">
                    <p>More details about {rec.job_role}</p>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No recommendations yet. Click "Submit" to generate them.</p>  // Fallback message
        )}
      </div>
    </>
  );
};
export default Aiprompt;
*/
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../components/Styles/Aiprompt.css';
import Navbar from '../components/Navbar';
const Aiprompt = () => {
  const [text, setText] = useState('');
  const [isEditable, setIsEditable] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openAccordions, setOpenAccordions] = useState({});
  const [expandedData, setExpandedData] = useState({});  // To store expanded data (flowchart and explanation)
  const location = useLocation();
  const [prompt, setPrompt] = useState(location.state?.prompt || 'No prompt available');

  const handleTextChange = (e) => {
    setPrompt(e.target.value);
  };

  const handleAccordionToggle = async (index, jobRole, userPrompt) => {
    // Toggle the accordion open/close state
    setOpenAccordions((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  
    // If the data isn't already fetched for this job role, fetch it
    if (!expandedData[index]) {
      try {
        const response = await fetch('http://localhost:5000/generate-roadmap', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            user_prompt: userPrompt, 
            job_title: jobRole 
          })
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json();
        if (data) {
          // Store the additional data (flowchart and explanation) in the expandedData state
          setExpandedData((prevData) => ({
            ...prevData,
            [index]: {
              flowchart: data.flowchart,
              explanation: data.explanation
            }
          }));
        }
      } catch (error) {
        console.error("Error fetching roadmap data:", error);
      }
    }
  };
  

  const handleEditClick = () => {
    setIsEditable(!isEditable);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      console.log("Submitting prompt:", prompt);
      const response = await fetch('http://localhost:5000/generate-recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      const data = await response.json();
      console.log("API response data:", data);

      if (data && data.career_recommendations) {
        setRecommendations(data.career_recommendations);
      } else {
        console.error("No career recommendations in response");
        setRecommendations([]);
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

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
          <button className="edit-button" onClick={handleEditClick}>
            {isEditable ? 'Save' : 'Edit'}
          </button>
          <button className="ok-button" onClick={handleSubmit}>
            Submit
          </button>
        </div>

        {/* Show recommendations or loading state */}
        {loading ? (
          <p>Loading recommendations...</p>
        ) : recommendations.length > 0 ? (
          recommendations.map((rec, index) => (
            <div key={index} className="accordion">
              <div 
                className="accordion-header" 
                onClick={() => handleAccordionToggle(index, rec.job_role,prompt)} // Pass job role to fetch roadmap
              >
                <h3>{rec.job_role} - {rec.match_percentage}: {rec.description}</h3>
              </div>
              {openAccordions[index] && (
                <div className="accordion-content">
                  <div className="accordion-image-holder">
                  {expandedData[index] ? (
  <img 
    src={`data:image/png;base64,${expandedData[index].flowchart}`} 
    alt="Job Role Visual" 
    className="accordion-image" 
    style={{ maxWidth: '100%', height: 'auto', maxHeight: '300px' }} 

  />
) : (
  <div className="image-placeholder">Loading image...</div>
)}

                  </div>
                  <div className="accordion-text">
                    {expandedData[index] ? (
                      <p>{expandedData[index].explanation}</p>
                    ) : (
                      <p>Loading more details...</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No recommendations yet. Click "Submit" to generate them.</p>
        )}
      </div>
    </>
  );
};
export default Aiprompt;
