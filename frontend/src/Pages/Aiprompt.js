/*
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
        const response = await fetch('${process.env.REACT_APP_API_URL}', {
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
      const response = await fetch('${process.env.REACT_APP_API_URL}', {
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

        <Card className={className} style={{ width: '100%', height: '100%', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={handleOpen}>
          <CardMedia
            component="img"
            image={imageUrl}
            alt={altText}
            style={{ width: '100%', height: '100%', objectFit: 'contain', maxHeight: '300px' }} 
          />
        </Card>
  
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
<Typography className="question-heading">
  <strong>What does a {rec.job_role} do?</strong>
</Typography>
<Typography className="answer-text">
  {expandedData[index]?.explanation?.job_description || 'Loading...'}
</Typography>

<Typography className="question-heading">
  <strong>How it aligns with your requirements?</strong>
</Typography>
<Typography className="answer-text">
  {expandedData[index]?.explanation?.alignment || 'Loading...'}
</Typography>

<Typography className="question-heading">
  <strong>Average Salary</strong>:
</Typography>
<ul>
  <li className="answer-text"><strong>Local Salary:</strong> {expandedData[index]?.explanation?.average_salary?.local_salary || 'XX,XXX - YY,YYY [Currency]'}</li>
  <li className="answer-text"><strong>USA Salary:</strong> {expandedData[index]?.explanation?.average_salary?.usa_salary || 'XX,XXX - YY,YYY USD'}</li>
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



*/


/* where the image is half seen and animations are thope
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
import { Card, CardMedia, Dialog, DialogContent } from '@mui/material';

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
        const response = await fetch('${process.env.REACT_APP_API_URL}', {
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
              explanation: data.explanation,
              loaded: true  // This triggers animation
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
      const response = await fetch('${process.env.REACT_APP_API_URL}', {
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
        <Card className={className} onClick={handleOpen}>
          <CardMedia component="img" image={imageUrl} alt={altText} />
        </Card>
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
          <DialogContent>
            <img src={imageUrl} alt={altText} style={{ width: '100%', height: 'auto', maxHeight: '90vh' }} />
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



/*
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
import { Card, CardMedia, Dialog, DialogContent } from '@mui/material';

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
        const response = await fetch('${process.env.REACT_APP_API_URL}', {
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
              explanation: data.explanation,
              loaded: true  // This triggers animation
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
      const response = await fetch('${process.env.REACT_APP_API_URL}', {
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



/* this is the one where edit option is present
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
    setOpenAccordions((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));

    if (!expandedData[index]) {
      try {
        const response = await fetch('${process.env.REACT_APP_API_URL}', {
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
              flowchart: data.flowchart || "", // Ensuring image is assigned properly
              explanation: data.explanation || {}, // Prevent undefined errors
              loaded: true
            }
          }));
        }
      } catch (error) {
        console.error("Error fetching roadmap data:", error);
      }
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
      const response = await fetch('${process.env.REACT_APP_API_URL}', {
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
          </div>

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
                <div className="accordion-content">
                  {expandedData[index]?.flowchart ? (
                    <Card className="accordion-image-holder">
                      <CardMedia
                        component="img"
                        image={`data:image/png;base64,${expandedData[index]?.flowchart}`}
                        alt="Job Role Visual"
                      />
                    </Card>
                  ) : (
                    <div className="image-placeholder">No image available.</div>
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
    setOpenAccordions((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));

    if (!expandedData[index]) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/generate-roadmap`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_prompt: userPrompt, job_title: jobRole })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (!data || !data.flowchart || !data.explanation) {
          throw new Error("Invalid response format: Missing flowchart or explanation");
        }
        if (data) {
          setExpandedData((prevData) => ({
            ...prevData,
            [index]: {
              flowchart: data.flowchart,
              explanation: data.explanation,
              loaded: true
            }
          }));
        }
      } catch (error) {
        console.error("Error fetching roadmap data:", error);
        alert(`Failed to load roadmap for. Please try again.`);
            }
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
