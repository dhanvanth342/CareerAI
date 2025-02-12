import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../components/Styles/Aiprompt.css';
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

  const ExpandableImageHolder = ({ imageUrl, altText }) => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
      <>
        {/* Image preview in accordion */}
        <Card style={{ maxWidth: '500px', cursor: 'pointer' }} onClick={handleOpen}>
          <CardMedia
            component="img"
            height="500px"
            image={imageUrl}
            alt={altText}
            style={{ objectFit: 'cover' }}
          />
        </Card>

        {/* Dialog to view the full image */}
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
          <DialogContent>
            <img
              src={imageUrl}
              alt={altText}
              style={{ width: '100%', height: 'auto' }}
            />
          </DialogContent>
        </Dialog>
      </>
    );
  };

  return (
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
              <Typography>{rec.job_role} : {rec.description}</Typography>
              <Typography variant="caption">match percentage: {rec.match_percentage}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div className="accordion-content">
                {expandedData[index] ? (
                  <ExpandableImageHolder
                    imageUrl={`data:image/png;base64,${expandedData[index].flowchart}`}
                    altText="Job Role Visual"
                  />
                ) : (
                  <div className="image-placeholder">Loading image...</div>
                )}
                <div className="accordion-text">
                  {expandedData[index] ? (
                    <p>{expandedData[index].explanation}</p>
                  ) : (
                    <p>Loading more details...</p>
                  )}
                </div>
              </div>
            </AccordionDetails>
          </Accordion>
        ))
      ) : (
        <p></p>
      )}
    </div>
  );
};

export default Aiprompt;
