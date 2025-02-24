/*

import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowUpCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '../components/ui/alert';
import Button from '../components/ui/button';
import Navbar from '../components/Navbar';
import { Box, Typography, CircularProgress } from '@mui/material';
import '../components/Styles/QuestionsPage.css';

const QuestionsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const questions = location.state?.questions || [];
  const initial_context = location.state?.initial_context;
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollContainerRef = useRef(null);

  // Calculate progress percentage
  const progress = (Object.keys(answers).length / questions.length) * 100;

  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        setIsScrolled(scrollContainerRef.current.scrollTop > 100);
      }
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const handleAnswerChange = (questionIndex, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: value,
    }));
    setError('');
  };

  const handleSubmit = async () => {
    if (questions.some((_, index) => !answers[index])) {
      setError('Please answer all questions before submitting.' + initial_context);
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/generate-prompt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initial_context, answers, questions }),
      });
      if (!response.ok) throw new Error('Submission failed');
      const result = await response.json();

      navigate('/aiprompt', { state: { prompt: result.prompt } });
    } catch (err) {
      setError('Failed to submit answers. Please try again.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="questions-page">
        
        <h1 className="heading">HELP OUR AI KNOW YOU MORE !</h1>

        <div className={`flip-card ${progress === 100 ? 'flipped' : ''}`}>
          <div className="flip-card-inner">
            
            <div className="flip-card-front">
              <div className="circular-progress-wrapper">
                <Box className="circular-progress-container">
                  <CircularProgress
                    variant="determinate"
                    value={progress}
                    size={100}
                    thickness={5}
                    sx={{ color: '#82cded' }} 
                  />
                  <Typography className="progress-text">{`${Math.round(progress)}%`}</Typography>
                </Box>
              </div>
            </div>

            <div className="flip-card-back">
             <div className="back-content">
              <p className="encouraging-text">You've made it! </p>
              <p className="encouraging-text">Submit to see the prompt!</p>
              <Button onClick={handleSubmit} className="submit-button">You're good to go</Button>
             </div>
            </div>

          </div>
        </div>

        <div className="questions-list">
          {questions.map((question, index) => (
            <div key={index} className="question-item">
              <h2 className="question-text">{question.question}</h2>
              {question.choices ? (
                <div className="choices-container">
                  {question.choices.map((choice, idx) => (
                    <label key={idx} className="choice-label">
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value={choice}
                        checked={answers[index] === choice || (choice === 'Other' && answers[index]?.startsWith('Other:'))}
                        onChange={(e) => handleAnswerChange(index, e.target.value)}
                      />
                      {choice}
                    </label>
                  ))}
                  {answers[index] === 'Other' || answers[index]?.startsWith('Other:') ? (
                    <textarea
                      className="text-answer"
                      value={answers[index]?.replace('Other: ', '') || ''}
                      onChange={(e) => handleAnswerChange(index, `Other: ${e.target.value}`)}
                      placeholder="Enter your custom answer..."
                    />
                  ) : null}
                </div>
              ) : (
                <textarea
                  className="text-answer"
                  value={answers[index] || ''}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  placeholder="Enter your answer here..."
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default QuestionsPage;
*/

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import Button from '../components/ui/button';
import Navbar from '../components/Navbar';
import '../components/Styles/QuestionsPage.css';

const QuestionsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const questions = location.state?.questions || [];
  const initial_context = location.state?.initial_context;
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false); // State for pop-up modal
  const [showErrorPopup, setShowErrorPopup] = useState(false); // State for error pop-up

  // Ensure questions are not empty before rendering
  useEffect(() => {
    if (!questions || questions.length === 0) {
      setErrorMessage('No questions available. Please try again later.');
      setShowErrorPopup(true);
    }
  }, [questions]);

  // Calculate progress
  const progress = questions.length > 0 ? ((Object.keys(answers).length / questions.length) * 100).toFixed(0) : 0;

  // Handle multiple selections
  const handleAnswerChange = (questionIndex, value) => {
    setAnswers((prev) => {
      const prevAnswers = prev[questionIndex] || [];
      let newAnswers;

      if (prevAnswers.includes(value)) {
        // Remove answer if already selected
        newAnswers = prevAnswers.filter((answer) => answer !== value);
      } else {
        // Otherwise, add it to the selection
        newAnswers = [...prevAnswers, value];
      }

      return {
        ...prev,
        [questionIndex]: newAnswers,
      };
    });
  };

  const handleOtherTextChange = (questionIndex, text) => {
    setAnswers((prev) => {
      const updatedOtherAnswer = `Other: ${text}`;
      return {
        ...prev,
        [questionIndex]: prev[questionIndex]
          .filter((a) => !a.startsWith('Other:')) // Remove previous "Other" entry
          .concat(updatedOtherAnswer), // Add new one
      };
    });
  };

  const handleSubmit = async () => {
    if (questions.some((_, index) => !answers[index] || answers[index].length === 0)) {
      setErrorMessage('Please answer all questions before submitting.');
      setShowErrorPopup(true); // Show error pop-up
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/generate-prompt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          initial_context,
          answers: Object.fromEntries(
            Object.entries(answers).map(([key, value]) => [key, Array.isArray(value) ? value : [value]])
          ),
          questions,
        }),
      });

      if (!response.ok) throw new Error('Submission failed');
      const result = await response.json();

      navigate('/aiprompt', { state: { prompt: result.prompt } });
    } catch (err) {
      setErrorMessage('Failed to submit answers. Please try again.');
      setShowErrorPopup(true);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  return (
    <>
      <Navbar />
      <div className="questions-page">
        {/* Progress Tracker */}
        {questions.length > 0 && (
  <div className="linear-progress-container">
    {questions.map((_, index) => {
      const totalQuestions = questions.length;
      const spacing = 100 / (totalQuestions - 1); // Calculate equal spacing
      const position = spacing * index; // Position each bubble

      return (
        <div
          key={index}
          className={`progress-section ${index === currentQuestionIndex ? 'active' : ''} ${
            answers[index] && answers[index].length > 0 ? 'completed' : ''
          }`}
          style={{
            left: `${position}%`, // Position bubbles equally
          }}
          onClick={() => setCurrentQuestionIndex(index)}
        >
          {index + 1}
        </div>
      );
    })}
    <div className="progress-line"></div>
  </div>
)}

        {/* Question Content */}
        {questions.length > 0 && (
          <div className="question-content">
            <div className="question-card">
              <h2 className="question-text">{questions[currentQuestionIndex]?.question}</h2>

              {/* Choices */}
              <div className="choices-container">
                {questions[currentQuestionIndex]?.choices?.map((choice, idx) => (
                  <label key={idx} className={`choice-label ${answers[currentQuestionIndex]?.includes(choice) ? 'selected' : ''}`}>
                    <input
                      type="checkbox"
                      name={`question-${currentQuestionIndex}`}
                      value={choice}
                      checked={answers[currentQuestionIndex]?.includes(choice) || (choice === 'Other' && answers[currentQuestionIndex]?.some(a => a.startsWith('Other:')))}
                      onChange={(e) =>
                        choice === 'Other'
                          ? handleAnswerChange(currentQuestionIndex, 'Other: ') // Initialize empty text field
                          : handleAnswerChange(currentQuestionIndex, e.target.value)
                      }
                    />

                    {/* If "Other" is selected, show a text box instead */}
                    {choice === 'Other' && answers[currentQuestionIndex]?.some(a => a.startsWith('Other:')) ? (
                      <input
                        type="text"
                        className="text-answer"
                        value={answers[currentQuestionIndex]?.find(a => a.startsWith('Other:'))?.replace('Other: ', '') || ''}
                        onChange={(e) => handleOtherTextChange(currentQuestionIndex, e.target.value)}
                        placeholder="Enter your custom answer..."
                        autoFocus
                      />
                    ) : (
                      <span>{choice}</span>
                    )}
                  </label>
                ))}
              </div>

              {/* "Why are you asking me this?" text */}
              <p className="question-info" onClick={() => setShowPopup(true)}>
                Why are you asking me this?
              </p>
            </div>

            {/* Navigation Buttons */}
            <div className="navigation-buttons">
              {/* Left Arrow (Previous) */}
              <button onClick={handlePrevious} disabled={currentQuestionIndex === 0} className="nav-button left">
                <FaArrowLeft />
              </button>

              {/* Right Arrow (Next/Submit) */}
              {currentQuestionIndex === questions.length - 1 ? (
                <button onClick={handleSubmit} className="nav-button right">
                  Generate
                </button>
              ) : (
                <button onClick={handleNext} className="nav-button right">
                  <FaArrowRight />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Pop-up Box */}
      {showPopup && (
        <div className="popup-overlay" onClick={() => setShowPopup(false)}>
          <div className="popup-box" onClick={(e) => e.stopPropagation()}>
            <h2>Great question!</h2>
            <p>
              The more we know, the better we serve! <br />
              Just a couple of minutes and your AI will be customized to understand you like never before!
            </p>
            <button className="popup-close" onClick={() => setShowPopup(false)}>OK</button>
          </div>
        </div>
      )}

      {/* Error Pop-up Box */}
      {showErrorPopup && (
        <div className="popup-overlay" onClick={() => setShowErrorPopup(false)}>
          <div className="popup-box" onClick={(e) => e.stopPropagation()}>
            <h2>Error</h2>
            <p>{errorMessage}</p>
            <button className="popup-close" onClick={() => setShowErrorPopup(false)}>OK</button>
          </div>
        </div>
      )}
    </>
  );
};

export default QuestionsPage;