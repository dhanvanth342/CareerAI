import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../components/Styles/Writeprompt.css';
import NavBar from '../components/Navbar';
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Accordion, AccordionSummary, AccordionDetails, Typography, Card, CardContent } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import SendIcon from '@mui/icons-material/Send';
import ExpandableImageHolder from '../components/ExpandableImageHolder';

const WritePrompt = () => {
  const [isEditable, setIsEditable] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openAccordions, setOpenAccordions] = useState({});
  const [expandedData, setExpandedData] = useState({});
  const [initialSubmit, setInitialSubmit] = useState(true);
  const location = useLocation();
  const [prompt, setPrompt] = useState(location.state?.prompt || '');
  const count = useMotionValue(10);
  const rounded = useTransform(count, Math.round);
  const [loadingText, setLoadingText] = useState("");

  useEffect(() => {
    if (loading) {
      setLoadingText("Career Paths loading in ");
      const animation = animate(count, 0, {
        duration: 20,
        onComplete: () => setLoading(false),
      });
      return () => animation.stop();
    }
  }, [loading]);

  const handleTextChange = (e) => setPrompt(e.target.value);
  const handleEditClick = () => setIsEditable(true);
  


  const handleAccordionToggle = async (index, jobRole, userPrompt) => {
    setOpenAccordions((prev) => ({ ...prev, [index]: !prev[index] }));
    if (!expandedData[index]) {
      try {
        const response = await fetch('http://localhost:5000/generate-roadmap', {
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

    // Handle card click to update prompt
    const handleCardClick = (text) => {
      setPrompt(text);
    };
  return (
    <>
      <NavBar />
      <div className="writeprompt-container">
        < div className="prompt-box">
          <h4>Write your prompt here!</h4>
          <p>Need inspiration? Check out these examples for your prompt! </p>
          <div className="example-prompts">
          <Card className="example-card" onClick={() => handleCardClick('What are the best career options for a software engineer?')}>
              <CardContent>
                <Typography variant="h6"></Typography>
                <Typography variant="body2">"What are the best career options for a software engineer?"</Typography>
              </CardContent>
            </Card>
            <Card className="example-card" onClick={() => handleCardClick('How do I transition from marketing to data science?')}>
              <CardContent>
                <Typography variant="h6"></Typography>
                <Typography variant="body2">"How do I transition from marketing to data science?"</Typography>
              </CardContent>
            </Card>
            <Card className="example-card" onClick={() => handleCardClick('What are the skills required for a career in AI?')}>
              <CardContent>
                <Typography variant="h6"></Typography>
                <Typography variant="body2">"What are the skills required for a career in AI?"</Typography>
              </CardContent>
            </Card>
          </div>

          <div className="textbox-container">
            {isEditable ? (
              <textarea className="ai-text" value={prompt} onChange={handleTextChange} />
            ) : (
              <textarea
                  className="ai-text"
                  value={prompt}
                  onChange={handleTextChange}
                  placeholder="Type your prompt here..."
              />
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
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography component={'div'}>
                  <h1><span className="job-title-blue">{rec.job_role}:</span> </h1>
                  <div className="job-description">{rec.description}</div>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div className={`accordion-content ${expandedData[index]?.loaded ? "loaded" : ""}`}>
                  {expandedData[index] ? (
                    <ExpandableImageHolder
                      imageUrl={`data:image/png;base64,${expandedData[index]?.flowchart ?? ''}`}
                      altText="Job Role Visual"
                    />
                  ) : (
                    <div className="image-placeholder">Loading image...</div>
                  )}
                  <Typography><strong>What does a {rec.job_role} do?</strong></Typography>
                  <Typography>{expandedData[index]?.explanation?.job_description || 'Loading...'}</Typography>
                </div>
              </AccordionDetails>
            </Accordion>
          ))
        )}
      </div>
    </>
  );
};

export default WritePrompt;