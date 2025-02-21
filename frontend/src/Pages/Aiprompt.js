/*
import React, { useEffect, useState } from 'react';
import { useRef } from 'react';
import { useLocation } from 'react-router-dom';
import '../components/Styles/Aiprompt.css';
import NavBar from '../components/Navbar';
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Card, CardMedia, Dialog, DialogContent } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SendIcon from '@mui/icons-material/Send';

const Aiprompt = () => {
  const [isEditable, setIsEditable] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openAccordions, setOpenAccordions] = useState({});
  const [expandedData, setExpandedData] = useState({});
  const [initialSubmit, setInitialSubmit] = useState(true);
  const location = useLocation();
  const [prompt, setPrompt] = useState(location.state?.prompt || 'No prompt available');
  const ongoingRequests = useRef(new Set());
  const count = useMotionValue(10);
  const rounded = useTransform(count, Math.round);

  useEffect(() => {
    if (loading) {
      const animation = animate(count, 0, {
        duration: 10,
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
    // Check if data already exists
    if (expandedData[index]) {
      setOpenAccordions(prev => ({
        ...prev,
        [index]: !prev[index]
      }));
      return;
    }
  
    // Add loading state
    setOpenAccordions(prev => ({
      ...prev,
      [index]: true
    }));
  
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/generate-roadmap`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          user_prompt: userPrompt, 
          job_title: jobRole 
        })
      });
  
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      
      const data = await response.json();
      setExpandedData(prev => ({
        ...prev,
        [index]: data
      }));
    } catch (error) {
      console.error("Error fetching roadmap data:", error);
      setOpenAccordions(prev => ({
        ...prev,
        [index]: false
      }));
    }
  };
  

  const handleEditClick = () => {
    setIsEditable(true);
  };

  const handleSubmit = async () => {
    setIsEditable(false);
    setLoading(true);
    setInitialSubmit(false);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/generate-recommendations`, {
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
        <Card className={className} style={{ 
          width: '550px', 
          height: 'auto', 
          cursor: 'pointer', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          overflow: 'hidden' 
        }} onClick={handleOpen}>
          <CardMedia
            component="img"
            image={imageUrl}
            alt={altText}
            style={{ 
              width: '100%', 
              height: 'auto', 
              maxHeight: '350px',
              objectFit: 'contain', 
              display: 'block',
              margin: '0 auto'
            }} 
          />
        </Card>
  
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
          <DialogContent style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
      <div className="aiprompt-container">
        <div className="prompt-box">
          <h2>Here is your AI-generated Prompt!</h2>
          <div className="textbox-container">
            {isEditable ? (
              <textarea className="ai-text" value={prompt} onChange={handleTextChange} />
            ) : (
              <div className="ai-text static-text">{prompt}</div>
            )}
            {!initialSubmit ? (
            <div className="icon-container">
              {isEditable ? (
                <SendIcon className="submit-icon" onClick={handleSubmit} />
              ) : (
                <EditIcon className="edit-icon" onClick={handleEditClick} />
              )}
            </div>
          ) : null}
        </div>
          </div>
        {initialSubmit && (
          <div className="initial-submit-container">
            <button className="initial-submit-button" onClick={handleSubmit}>Submit</button>
          </div>
        )}

        {loading ? (
          <div className="loading-container">
            <motion.h1 className="countdown">{rounded}</motion.h1>
          </div>
        ) : recommendations.length > 0 ? (
          recommendations.map((rec, index) => (
            <Accordion key={index} expanded={openAccordions[index]} onChange={() => handleAccordionToggle(index, rec.job_role, prompt)}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>
                  <strong>
                    <span className="job-title-blue">{rec.job_role}</span> :
                    <span className="job-description">{rec.description}</span>
                  </strong>
                </Typography>
                <Typography className="match-percentage">
                  {rec.match_percentage} <span className="match-rate-text">Match Rate</span>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div className={`accordion-content ${expandedData[index]?.loaded ? "loaded" : ""}`}>
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
                    <Typography className="question-heading"><strong>What does a {rec.job_role} do?</strong></Typography>
                    <Typography className="answer-text">{expandedData[index]?.explanation?.job_description || 'Loading...'}</Typography>

                    <Typography className="question-heading"><strong>How it aligns with your requirements?</strong></Typography>
                    <Typography className="answer-text">{expandedData[index]?.explanation?.alignment || 'Loading...'}</Typography>

                    <Typography className="question-heading"><strong>Average Salary</strong>:</Typography>
                    <ul>
                      <li className="answer-text"><strong>Local Salary:</strong> {expandedData[index]?.explanation?.average_salary?.local_salary || 'XX,XXX - YY,YYY [Currency]'}</li>
                      <li className="answer-text"><strong>USA Salary:</strong> {expandedData[index]?.explanation?.average_salary?.usa_salary || 'XX,XXX - YY,YYY USD'}</li>
                    </ul>
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>
          ))
        ) : null}
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
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import SendIcon from '@mui/icons-material/Send';
import ExpandableImageHolder from '../components/ExpandableImageHolder';

const Aiprompt = () => {
  const [isEditable, setIsEditable] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openAccordions, setOpenAccordions] = useState({});
  const [expandedData, setExpandedData] = useState({});
  const [initialSubmit, setInitialSubmit] = useState(true);

  const location = useLocation();
  const [prompt, setPrompt] = useState(location.state?.prompt || 'No prompt available');

  const count = useMotionValue(10);
  const rounded = useTransform(count, Math.round);

  useEffect(() => {
    if (loading) {
      setLoadingText("Career Paths loading in "); // Set text when loading starts
  
      const animation = animate(count, 0, {
        duration: 20,
        onUpdate: (latest) => {
          if (latest === 10) {
            setLoadingText("Career Paths loading in /n ");
          }
        },
        onComplete: () => setLoading(false),
      });
  
      return () => animation.stop();
    }
  }, [loading]);
  
  const [loadingText, setLoadingText] = useState("");

  const handleTextChange = (e) => setPrompt(e.target.value);
  const handleEditClick = () => setIsEditable(true);

  const handleAccordionToggle = async (index, jobRole, userPrompt) => {
    setOpenAccordions((prev) => ({ ...prev, [index]: !prev[index] }));

    if (!expandedData[index]) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/generate-roadmap`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_prompt: userPrompt, job_title: jobRole }),
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        setExpandedData((prevData) => ({
          ...prevData,
          [index]: {
            flowchart: data.flowchart,
            explanation: data.explanation,
            loaded: true,
          },
        }));
      } catch (error) {
        console.error("Error fetching roadmap data:", error);
      }
    }
  };

  const handleSubmit = async () => {
    setIsEditable(false);
    setLoading(true);
    setInitialSubmit(false);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/generate-recommendations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      setRecommendations(data?.career_recommendations || []);
    } catch (error) {
      setRecommendations([]);
    }
  };

  return (
    <>
      <NavBar />
      <div className="aiprompt-container">
        <div className="prompt-box">
          <h4>There you go,  </h4>
          <p>Here is your AI-generated Prompt!</p>
          <div className="textbox-container">
            {isEditable ? (
              <textarea className="ai-text" value={prompt} onChange={handleTextChange} />
            ) : (
              <div className="ai-text static-text">{prompt}</div>
            )}
            {!initialSubmit && (
              <div className="icon-container">
                {isEditable ? <SendIcon className="submit-icon" onClick={handleSubmit} /> : <EditIcon className="edit-icon" onClick={handleEditClick} />}
              </div>
            )}
          </div>
        </div>

        {initialSubmit ? (
          <div className="initial-submit-container">
            <button className="initial-submit-button" onClick={handleSubmit}>Load recommendations</button>
          </div>
        ) : loading ? (
          <div className="loading-container">
            <motion.h1 className="loading-text">{loadingText}</motion.h1>
            <motion.h1 className="countdown">{rounded}</motion.h1>
          </div>
        ) : (
          recommendations.map((rec, index) => (
            <Accordion key={index} expanded={openAccordions[index]} onChange={() => handleAccordionToggle(index, rec.job_role, prompt)}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} className="accordion-header">
              <div className="job-accordion-left">
                <Typography component={'div'}>
                      <h1><span className="job-title-blue">{rec.job_role}:</span> </h1>
                     
                    <div className="job-description">{rec.description}</div>
                  
                </Typography>
                </div>
                <div className="match-container">
                <Typography className="match-percentage">
                  {rec.match_percentage} <div className="match-rate-text">Match Rate</div>
                </Typography>
                </div>
              </AccordionSummary>
              <AccordionDetails>
                <div className={`accordion-content ${expandedData[index]?.loaded ? "loaded" : ""}`}>
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
                    <Typography className="question-heading"><strong>What does a {rec.job_role} do?</strong></Typography>
                    <Typography className="answer-text">{expandedData[index]?.explanation?.job_description || <div className="loading-container">
            <motion.h1 className="loading-text">{loadingText}</motion.h1>
            <motion.h1 className="countdown">{rounded}</motion.h1>
          </div>}</Typography>

                    <Typography className="question-heading"><strong>How it aligns with your requirements?</strong></Typography>
                    <Typography className="answer-text">{expandedData[index]?.explanation?.alignment || 'Loading...'}</Typography>

                    <Typography className="question-heading"><strong>Average Salary</strong>:</Typography>
                    <ul>
                      <li className="answer-text"><strong>Local Salary:</strong> {expandedData[index]?.explanation?.average_salary?.local_salary || 'XX,XXX - YY,YYY [Currency]'}</li>
                      <li className="answer-text"><strong>USA Salary:</strong> {expandedData[index]?.explanation?.average_salary?.usa_salary || 'XX,XXX - YY,YYY USD'}</li>
                    </ul>
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>
          ))
        )}
      </div>
    </>
  );
};

export default Aiprompt;