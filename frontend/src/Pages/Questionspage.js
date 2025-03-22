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
{/* Choices */}
  <div className="choices-container">
  {questions[currentQuestionIndex]?.choices && questions[currentQuestionIndex]?.choices.length > 0 ? (
    questions[currentQuestionIndex]?.choices?.map((choice, idx) => (
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
        {choice === 'Other' && answers[currentQuestionIndex]?.some(a => a.startsWith('Other:')) ? (
          <input
            type="text"
            className="text-answer"
            style={{ color: 'black' }}
            value={answers[currentQuestionIndex]?.find(a => a.startsWith('Other:'))?.replace('Other: ', '') || ''}
            onChange={(e) => handleOtherTextChange(currentQuestionIndex, e.target.value)}
            placeholder="Enter your custom answer..."
            autoFocus
          />
        ) : (
          <span>{choice}</span>
        )}
      </label>
    ))
  ) : (
    // Render a text input by default when no choices exist
    <input
      type="text"
      className="text-answer"
      value={answers[currentQuestionIndex]?.[0] || ''}
      onChange={(e) => setAnswers({ ...answers, [currentQuestionIndex]: [e.target.value] })}
      placeholder="Enter your response..."
      autoFocus
    />
  )}
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
