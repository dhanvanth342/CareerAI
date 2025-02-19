/*
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '../components/ui/alert';
import Button from '../components/ui/button';

const QuestionsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const questions = location.state?.questions || [];

  const [answers, setAnswers] = useState({});
  const [error, setError] = useState('');

  const handleAnswerChange = (questionIndex, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const unansweredQuestions = questions.filter((_, index) => !answers[index]);
      if (unansweredQuestions.length > 0) {
        setError('Please answer all questions before submitting.');
        return;
      }

      const response = await fetch('http://localhost:5000/generate-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers,
          questions,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Submission successful:', result);
        navigate('/results', { state: { recommendations: result } });
      } else {
        throw new Error('Failed to submit answers');
      }
    } catch (err) {
      setError('Failed to submit answers. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Career Assessment Questions</h1>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
   
      <div className="h-[500px] overflow-y-auto border p-4 rounded-md shadow-md">
        <div className="space-y-6">
          {questions.map((question, index) => (
            <div key={index} className="pb-6 border-b last:border-b-0">
              <h2 className="text-lg font-semibold mb-2">{question.question}</h2>

             
              {question.choices ? (
                <div className="space-y-2">
                  {question.choices
                    .filter(choice => choice.toLowerCase() !== 'other') // Filter out "Other" if it comes from backend
                    .map((choice, idx) => (
                      <div key={idx} className="flex items-center">
                        <input
                          type="radio"
                          id={`choice-${index}-${idx}`}
                          name={`question-${index}`}
                          value={choice}
                          checked={answers[index] === choice}
                          onChange={(e) => handleAnswerChange(index, e.target.value)}
                          className="mr-2"
                        />
                        <label htmlFor={`choice-${index}-${idx}`} className="text-gray-700">
                          {choice}
                        </label>
                      </div>
                    ))}

                
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id={`choice-other-${index}`}
                        name={`question-${index}`}
                        value="Other"
                        checked={answers[index]?.startsWith('Other:')}
                        onChange={() => handleAnswerChange(index, 'Other: ')}
                        className="mr-2"
                      />
                      <label htmlFor={`choice-other-${index}`} className="text-gray-700">
                        Other
                      </label>
                    </div>

                    {answers[index]?.startsWith('Other:') && (
                      <textarea
                        value={answers[index].replace('Other: ', '')}
                        onChange={(e) => handleAnswerChange(index, `Other: ${e.target.value}`)}
                        className="w-full p-2 border rounded-md mt-2"
                        rows={2}
                        placeholder="Enter your custom answer..."
                      />
                    )}
                  </div>
                </div>
              ) : (
                // Open-ended Questions
                <textarea
                  value={answers[index] || ''}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  className="w-full p-2 border rounded-md"
                  rows={4}
                  placeholder="Enter your answer here..."
                />
              )}
            </div>
          ))}
        </div>
      </div>

    
      <div className="mt-6 flex justify-end">
        <Button onClick={handleSubmit}>Submit</Button>
      </div>
    </div>
  );
};

export default QuestionsPage;
*/


/* FINAL - 09:06PM

import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowUpCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '../components/ui/alert';
import Button from '../components/ui/button';
import Navbar from '../components/Navbar';
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

    setTimeout(() => {
      scrollContainerRef.current?.scrollBy({ top: 100, behavior: 'smooth' });
    }, 200);
  };

  const handleSubmit = async () => {
    if (questions.some((_, index) => !answers[index])) {
      setError('Please answer all questions before submitting.'+initial_context);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/generate-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initial_context,answers, questions }),
      });
      if (!response.ok) throw new Error('Submission failed');
      const result = await response.json();
      
      navigate('/aiprompt', { state: { prompt: result.prompt } }); // Navigate to Aiprompt with the generated prompt
    } catch (err) {
      setError('Failed to submit answers. Please try again.');
    }
  };
  

  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
    <Navbar />
    <div className="questions-container">
      <h1 className="title">Career Assessment Questions</h1>
      {error && (
        <Alert variant="destructive" className="alert-box">
          <AlertCircle className="icon" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div ref={scrollContainerRef} className="questions-box">
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

      <div className="actions-container">
        {isScrolled && (
          <button onClick={scrollToTop} className="scroll-top-btn">
            <ArrowUpCircle className="scroll-icon" />
          </button>
        )}
        <Button onClick={handleSubmit}>Submit</Button>
      </div>
    </div>
    </>
  );
};

export default QuestionsPage;

*/

/*
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowUpCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '../components/ui/alert';
import Button from '../components/ui/button';
import Navbar from '../components/Navbar';
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

    setTimeout(() => {
      scrollContainerRef.current?.scrollBy({ top: 100, behavior: 'smooth' });
    }, 200);
  };

  const handleSubmit = async () => {
    if (questions.some((_, index) => !answers[index])) {
      setError('Please answer all questions before submitting.' + initial_context);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/generate-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initial_context, answers, questions }),
      });
      if (!response.ok) throw new Error('Submission failed');
      const result = await response.json();

      navigate('/aiprompt', { state: { prompt: result.prompt } }); // Navigate to Aiprompt with the generated prompt
    } catch (err) {
      setError('Failed to submit answers. Please try again.');
    }
  };

  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Navbar />
      <div className="questions-page">
        <div className="image-container">
          <img src={require('../assets/think.png')} alt="Thinking Illustration" />
        </div>
        <div className="questions-container">
          <h1 className="title">Career Assessment Questions</h1>
          {error && (
            <Alert variant="destructive" className="alert-box">
              <AlertCircle className="icon" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div ref={scrollContainerRef} className="questions-box">
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
                          checked={
                            answers[index] === choice || (choice === 'Other' && answers[index]?.startsWith('Other:'))
                          }
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

          <div className="actions-container">
            {isScrolled && (
              <button onClick={scrollToTop} className="scroll-top-btn">
                <ArrowUpCircle className="scroll-icon" />
              </button>
            )}
            <Button onClick={handleSubmit}>Submit</Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuestionsPage;

*/

/*
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowUpCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '../components/ui/alert';
import Button from '../components/ui/button';
import Navbar from '../components/Navbar';
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
      const response = await fetch('http://localhost:5000/generate-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initial_context, answers, questions }),
      });
      if (!response.ok) throw new Error('Submission failed');
      const result = await response.json();

      navigate('/aiprompt', { state: { prompt: result.prompt } }); // Navigate to Aiprompt with the generated prompt
    } catch (err) {
      setError('Failed to submit answers. Please try again.');
    }
  };

  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Navbar />
      <div className="questions-page">
        <div className="image-container">
          <img src={require('../assets/think.png')} alt="Thinking Illustration" />
        </div>
        <div className="questions-container">
          <h1 className="title">Career Assessment Questions</h1>
          {error && (
            <Alert variant="destructive" className="alert-box">
              <AlertCircle className="icon" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div ref={scrollContainerRef} className="questions-list">
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
                          checked={
                            answers[index] === choice || (choice === 'Other' && answers[index]?.startsWith('Other:'))
                          }
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

          <div className="actions-container">
            {isScrolled && (
              <button onClick={scrollToTop} className="scroll-top-btn">
                <ArrowUpCircle className="scroll-icon" />
              </button>
            )}
            <Button onClick={handleSubmit}>Submit</Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuestionsPage;
*/

/*FINAL WITH PROGRESS BAR - 5:50PM
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowUpCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '../components/ui/alert';
import Button from '../components/ui/button';
import Navbar from '../components/Navbar';
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

  // Progress bar logic
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
      const response = await fetch('http://localhost:5000/generate-prompt', {
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

  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Navbar />
      
      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="questions-page">

        <div className="questions-container">
          <h1 className="title">Career Assessment Questions</h1>

          {error && (
            <Alert variant="destructive" className="alert-box">
              <AlertCircle className="icon" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div ref={scrollContainerRef} className="questions-list">
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
                          checked={
                            answers[index] === choice || (choice === 'Other' && answers[index]?.startsWith('Other:'))
                          }
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

          <div className="actions-container">
            {isScrolled && (
              <button onClick={scrollToTop} className="scroll-top-btn">
                <ArrowUpCircle className="scroll-icon" />
              </button>
            )}
            <Button onClick={handleSubmit}>Submit</Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuestionsPage;
*/

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
      const response = await fetch('http://localhost:5000/generate-prompt', {
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

  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Navbar />
      
      <div className="questions-page">
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
                        checked={
                          answers[index] === choice || (choice === 'Other' && answers[index]?.startsWith('Other:'))
                        }
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


        <div className="actions-container">
          {isScrolled && (
            <button onClick={scrollToTop} className="scroll-top-btn">
              <ArrowUpCircle className="scroll-icon" />
            </button>
          )}
          <Button onClick={handleSubmit}>Submit</Button>
        </div>
      </div>
    </>
  );
};

export default QuestionsPage;
*/



/* this has percentage
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
      const response = await fetch('http://localhost:5000/generate-prompt', {
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

  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Navbar />
      <div className="spacer"></div>
      <div className="questions-page">
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
                        checked={
                          answers[index] === choice || (choice === 'Other' && answers[index]?.startsWith('Other:'))
                        }
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
      const response = await fetch('http://localhost:5000/generate-prompt', {
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
      
      <div className="spacer"></div>

      <div className="questions-page">
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
      const response = await fetch('http://localhost:5000/generate-prompt', {
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
        {/* Heading */}
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