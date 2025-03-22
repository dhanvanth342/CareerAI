import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../components/Styles/Writeprompt.css';
import '../components/Styles/Aiprompt.css';
import NavBar from '../components/Navbar';
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Accordion, AccordionSummary, AccordionDetails, Typography, Card, CardContent } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import SendIcon from '@mui/icons-material/Send';
import ExpandableImageHolder from '../components/ExpandableImageHolder';
import Footer from '../components/Footer';

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
  const [errorMessage, setErrorMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showOkButton, setShowOkButton] = useState(false);
  const [isLoading, setIsLoading] = useState(true);


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

  useEffect(() => {
    console.log("Updated expandedData:", expandedData);
  }, [expandedData]);

    
  const handleTextChange = (e) => setPrompt(e.target.value);
  const handleEditClick = () => setIsEditable(true);

  const handleAccordionToggle = async (index, jobRole, userPrompt) => {
    setOpenAccordions((prev) => ({ ...prev, [index]: !prev[index] }));
    
    if (!expandedData[index]) {
      // Show modal immediately when accordion is clicked
      setShowModal(true);
      setShowOkButton(false);
      setIsLoading(true);
      
      // Set timer for OK button and thumbs up (16 seconds)
      setTimeout(() => {
        setShowOkButton(true);
        setIsLoading(false);
      }, 16000);

      try {
        const response = await fetch('http://localhost:5000/generate-roadmap', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_prompt: userPrompt, job_title: jobRole }),
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();

        if (data) {
          setExpandedData((prevData) => ({
            ...prevData,
            [index]: {
              flowchart: data.flowchart,
              explanation: data.explanation,
              loaded: true,
            },
          }));
        }
      } catch (error) {
        console.error("Error fetching roadmap data:", error);
      }
    }
  };

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      // Display an error message if the prompt is empty
      setErrorMessage('⚠️ Please write a prompt before submitting.');
      return;
    }
    setErrorMessage('');
    setIsEditable(false);
    setLoading(true);
    setInitialSubmit(false);
    try {
      const response = await fetch('http://localhost:5000/generate-recommendations', {
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
          <h6>Note: Specify your country for better salary predictions!!</h6>
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

          <div className="textboxx-container">
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
                 {isEditable ? (
        <SendIcon className="submit-icon" onClick={handleSubmit} />
      ) : (
        <EditIcon className="edit-icon" onClick={handleEditClick} />
      )}
              </div>
            )}
          </div>
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        {initialSubmit ? (
            <div className="initial-submitt-container">
              
            <button className="initial-submit-button" onClick={handleSubmit}>
              Load recommendations
            </button>
          </div>
        ) : loading ? (
          <div className="loading-container">
            <motion.h1 className="loading-text">{loadingText}</motion.h1>
            <motion.h1 className="countdown">{rounded}</motion.h1>
          </div>
        ) : (
          recommendations.map((rec, index) => (
            <Accordion variant='div' key={index} expanded={openAccordions[index]} onChange={() => handleAccordionToggle(index, rec.job_role, prompt)}>
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
                  <div className="accordion-text-container">
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
                </div>
              </AccordionDetails>
            </Accordion>
          ))
        )}
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
      <Footer/>
    </>
  );
};

export default WritePrompt;
