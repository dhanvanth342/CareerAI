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
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../components/Styles/Aiprompt.css';
import NavBar from '../components/Navbar';
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Card, CardMedia, IconButton, Dialog, DialogContent } from '@mui/material';



const Aiprompt = () => {
  const [text, setText] = useState('');
  const [isEditable, setIsEditable] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openAccordions, setOpenAccordions] = useState({});
  const [expandedData, setExpandedData] = useState({});
  const location = useLocation();
  const [prompt, setPrompt] = useState(location.state?.prompt || 'No prompt available');

  const count = useMotionValue(10);
  const rounded = useTransform(count, Math.round);

  useEffect(() => {
    if (loading) {
      const animation = animate(count, 0, {
        duration:10,
        onComplete: () => {
          setLoading(false);
        }
      });
      return () => animation.stop();
    }
  }, [loading]);

  const handleTextChange = (e) => {
    setPrompt(e.target.value);
  };

  const handleAccordionToggle = async (index, jobRole, userPrompt) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));

    if (!expandedData[index]) {
      try {
        const response = await fetch('http://localhost:5000/generate-roadmap', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_prompt: userPrompt, job_title: jobRole })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (data) {
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
      const response = await fetch('http://localhost:5000/generate-recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      const data = await response.json();
      if (data && data.career_recommendations) {
        setRecommendations(data.career_recommendations);
      } else {
        setRecommendations([]);
      }
    } catch (error) {
      setRecommendations([]);
    }
  };

  const ExpandableImageHolder = ({ imageUrl, altText, className }) => {
    const [open, setOpen] = useState(false);
  
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
  
    return (
      <>
        {/* Image preview inside accordion */}
        <Card className={className} style={{ width: '100%', height: '100%', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={handleOpen}>
          <CardMedia
            component="img"
            image={imageUrl}
            alt={altText}
            style={{ width: '100%', height: '100%', objectFit: 'contain', maxHeight: '300px' }} 
          />
        </Card>
  
        {/* Full-size image in Dialog */}
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
          <DialogContent>
            <img
              src={imageUrl}
              alt={altText}
              style={{ width: '100%', height: 'auto', maxHeight: '90vh', objectFit: 'contain' }}
            />
          </DialogContent>
        </Dialog>
      </>
    );
  };
  
  

  return (
    <>
    <NavBar />
    
    <div className="aiprompt-container" style={{ marginTop: '60px' }}>
  
      <div className="prompt-box">
        <h2>Here is your AI-generated Prompt!</h2>
        <div className="textbox-container">
          {isEditable ? (
            <textarea
              className="ai-text"
              value={prompt}
              onChange={handleTextChange}
            />
          ) : (
            <div className="ai-text static-text">{prompt}</div>
          )}
        </div>
        <div className="button-container">
          <button className="edit-button" onClick={handleEditClick}>
            {isEditable ? 'Save' : 'Edit'}
          </button>
          <button className="ok-button" onClick={handleSubmit}>Submit</button>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <motion.h1 className="countdown">{rounded}</motion.h1>
        </div>
      ) : recommendations.length > 0 ? (
        recommendations.map((rec, index) => (
          <Accordion key={index} expanded={openAccordions[index]} onChange={() => handleAccordionToggle(index, rec.job_role, prompt)}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${index}-content`}
              id={`panel${index}-header`}
            >
              <Typography><strong>{rec.job_role} : {rec.description}</strong></Typography>
              <Typography variant="caption">match percentage: {rec.match_percentage}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div className="accordion-content">
                {expandedData[index] ? (
               <ExpandableImageHolder
               imageUrl={`data:image/png;base64,${expandedData[index]?.flowchart ?? ''}`}
               altText="Job Role Visual"
               className="accordion-image-holder"
             />
             
                ) : (
                  <div className="image-placeholder">Loading image...</div>
                )}
                <div className="accordion-text">
                <Typography sx={{ paddingTop: "0 !important", marginTop: "0 !important" }}><strong>What does a {rec.job_role} do?</strong> <br />
                 {expandedData[index]?.explanation?.job_description|| 'Loading...'}</Typography>
                <Typography><strong>How it aligns with your requirements?</strong> <br />
                 {expandedData[index]?.explanation?.alignment || 'Loading...'}</Typography>
                <Typography><strong>Average Salary</strong>:</Typography>
                <ul>
                  <li><strong>Local Salary:</strong> {expandedData[index]?.explanation?.average_salary?.local_salary || 'XX,XXX - YY,YYY [Currency]'}</li>
                  <li><strong>USA Salary:</strong> {expandedData[index]?.explanation?.average_salary?.usa_salary || 'XX,XXX - YY,YYY USD'}</li>
                </ul>
                </div>
              </div>
            </AccordionDetails>
          </Accordion>
        ))
      ) : (
        <p></p>
      )}
    </div>
    </>
  );
};

export default Aiprompt;