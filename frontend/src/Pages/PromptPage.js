/*
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../components/Styles/PromptPage.css';
import '../index.css';

const countries = [ "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", 
  "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", 
  "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", 
  "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", 
  "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", 
  "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", 
  "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", 
  "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", 
  "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", 
  "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", 
  "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea (North)", "Korea (South)", "Kuwait", "Kyrgyzstan", 
  "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", 
  "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", 
  "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", 
  "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", 
  "Niger", "Nigeria", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", 
  "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", 
  "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", 
  "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", 
  "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "Spain", "Sri Lanka", "Sudan", 
  "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", 
  "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", 
  "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", 
  "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"];

const PromptPage = ({ onQuestionsGenerated = () => {} }) => {
  const [text, setText] = useState('');
  const [question1, setQuestion1] = useState('');
  const [question2, setQuestion2] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Load saved data from localStorage when the component mounts
    const savedText = localStorage.getItem('text');
    const savedQuestion1 = localStorage.getItem('question1');
    const savedQuestion2 = localStorage.getItem('question2');
    if (savedText) setText(savedText);
    if (savedQuestion1) setQuestion1(savedQuestion1);
    if (savedQuestion2) setQuestion2(savedQuestion2);
  }, []);

  const handleTextChange = (e) => {
    setText(e.target.value);
    localStorage.setItem('text', e.target.value); // Save to localStorage
    setError('');
  };

  const handleQuestion1Change = (e) => {
    setQuestion1(e.target.value);
    localStorage.setItem('question1', e.target.value); // Save to localStorage
    setError('');
  };

  const handleQuestion2Change = (e) => {
    setQuestion2(e.target.value);
    localStorage.setItem('question2', e.target.value); // Save to localStorage
    setError('');
  };

  const validateInputs = () => {
    if (!text.trim()) {
      setError('Please enter your interests and context');
      return false;
    }
    if (!question1) {
      setError('Please select your education level');
      return false;
    }
    if (!question2) {
      setError('Please select your country');
      return false;
    }
    return true;
  };

  const handleGenerateQuestions = async () => {
    if (!validateInputs()) {
      return;
    }

    setIsLoading(true);
    setError('');


    const requestData = {
      initial_context: text,
      highest_education: question1,
      country: question2,
    };

    try {
      const response = await fetch({process.env.REACT_APP_API_URL}, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error(`Server error ${response.status}:`, errorData);
        throw new Error(`Server error: ${response.status}: ${errorData}`);
      }

      const result = await response.json();

      if (result.error) {
        throw new Error(result.error);
      }

      if (!result.questions || !Array.isArray(result.questions)) {
        throw new Error('Invalid response format from server');
      }

      setError('');
      onQuestionsGenerated(result.questions);

      // Redirect to QuestionsPage with generated questions
      navigate('/questions', { state: { questions: result.questions,
initial_context: result.initial_context
       } });
      

    } catch (error) {
      console.error('Error in handleGenerateQuestions:', error);
      setError(`Error: ${error.message || 'Failed to generate questions'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="prompt-container">
      <nav className="navbar">
        <div className="logo">Career AI</div>
        <button className="logout-btn">Logout</button>
      </nav>
      
      <main className="main-content">
        <p className="prompt-text">
          Choose your path! Use the generated prompt or customize it to match your preferences. Your career journey starts here!
        </p>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <div className="dropdown-section">
          <div className="dropdown-box">
            <label htmlFor="question1">Question 1: Level of education?</label>
            <select 
              id="question1" 
              value={question1} 
              onChange={handleQuestion1Change}
              className={!question1 ? 'error' : ''}>
              <option value="" disabled>Select an option</option>
              <option value="High School Diploma">High School Diploma</option>
              <option value="Undergraduate Degree">Undergraduate Degree</option>
              <option value="Graduate Degree">Graduate Degree</option>
              <option value="PhD">PhD</option>
            </select>
          </div>

          <div className="dropdown-box">
            <label htmlFor="question2">Question 2: Country you live in?</label>
            <select 
              id="question2" 
              value={question2} 
              onChange={handleQuestion2Change}
              className={!question2 ? 'error' : ''}>
              <option value="" disabled>Select an option</option>
              {countries.map((country, index) => (
                <option key={index} value={country}>{country}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="response-box">
          <textarea
            className={`generated-text ${!text.trim() ? 'error' : ''}`}
            value={text}
            onChange={handleTextChange}
            placeholder="Example: I am interested in badminton, weightlifting and Math..."
          />
        </div>

        <div className="button-container">
          <button 
            className="icon-btn ok-btn" 
            aria-label="OK" 
            onClick={handleGenerateQuestions}
            disabled={isLoading}
          >
            {isLoading ? 'Generating...' : 'Generate Questions'}
          </button>
        </div>
      </main>
    </div>
  );
};

export default PromptPage;
*/



/*
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/Styles/PromptPage.css';
import '../index.css';

const countries = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina",
  "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados",
  "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana",
  "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon",
  "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo",
  "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica",
  "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia",
  "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana",
  "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary",
  "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan",
  "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea (North)", "Korea (South)", "Kuwait", "Kyrgyzstan",
  "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
  "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania",
  "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco",
  "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua",
  "Niger", "Nigeria", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea",
  "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda",
  "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino",
  "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore",
  "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "Spain", "Sri Lanka", "Sudan",
  "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste",
  "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine",
  "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City",
  "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

const PromptPage = ({ onQuestionsGenerated = () => {} }) => {
  const [text, setText] = useState('');
  const [question1, setQuestion1] = useState('');
  const [question2, setQuestion2] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const savedText = localStorage.getItem('text');
    const savedQuestion1 = localStorage.getItem('question1');
    const savedQuestion2 = localStorage.getItem('question2');
    if (savedText) setText(savedText);
    if (savedQuestion1) setQuestion1(savedQuestion1);
    if (savedQuestion2) setQuestion2(savedQuestion2);
  }, []);

  const handleTextChange = (e) => {
    setText(e.target.value);
    localStorage.setItem('text', e.target.value);
    setError('');
  };

  const handleQuestion1Change = (e) => {
    setQuestion1(e.target.value);
    localStorage.setItem('question1', e.target.value);
    setError('');
  };

  const handleQuestion2Change = (e) => {
    setQuestion2(e.target.value);
    localStorage.setItem('question2', e.target.value);
    setError('');
  };

  const validateInputs = () => {
    if (!text.trim()) {
      setError('Please enter your interests and context');
      return false;
    }
    if (!question1) {
      setError('Please select your education level');
      return false;
    }
    if (!question2) {
      setError('Please select your country');
      return false;
    }
    return true;
  };

  const handleGenerateQuestions = async () => {
    if (!validateInputs()) {
      return;
    }

    setIsLoading(true);
    setError('');

    const requestData = {
      initial_context: text,
      highest_education: question1,
      country: question2,
    };

    try {
      const response = await fetch({process.env.REACT_APP_API_URL}, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();

      if (result.error) {
        throw new Error(result.error);
      }

      if (!result.questions || !Array.isArray(result.questions)) {
        throw new Error('Invalid response format from server');
      }

      setError('');
      onQuestionsGenerated(result.questions);
      navigate('/questions', { state: { questions: result.questions } });
    } catch (error) {
      console.error('Error in handleGenerateQuestions:', error);
      setError(`Error: ${error.message || 'Failed to generate questions'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="prompt-container">
      <nav className="navbar">
        <div className="logo">Career AI</div>
        <button className="logout-btn">Logout</button>
      </nav>

      <main className="main-content">
        <p className="prompt-text">
          Choose your path! It all starts here! 
        </p>

        {error && <div className="error-message">{error}</div>}

        <div className="question-boxes">
          <div className="question-box">
            <h2 className="box-title">Question 1</h2>
            <p className="box-description">What is your highest level of education?</p>
            <select id="question1" value={question1} onChange={handleQuestion1Change}>
              <option value="" disabled>
                Select an option
              </option>
              <option value="High School Diploma">High School Diploma</option>
              <option value="Undergraduate Degree">Undergraduate Degree</option>
              <option value="Graduate Degree">Graduate Degree</option>
              <option value="PhD">PhD</option>
            </select>
          </div>

          <div className="question-box">
            <h2 className="box-title">Question 2</h2>
            <p className="box-description">Which country do you live in?</p>
            <select id="question2" value={question2} onChange={handleQuestion2Change}>
              <option value="" disabled>
                Select an option
              </option>
              {countries.map((country, index) => (
                <option key={index} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="response-box">
          <textarea
            className={`generated-text ${!text.trim() ? 'error' : ''}`}
            value={text}
            onChange={handleTextChange}
            placeholder="Example: I am interested in badminton, weightlifting and Math..."
          />
        </div>

        <div className="button-container">
          <button className="icon-btn" onClick={handleGenerateQuestions} disabled={isLoading}>
            {isLoading ? 'Generating...' : 'Generate Questions'}
          </button>
        </div>
      </main>
    </div>
  );
};

export default PromptPage;
*/


/* final - 08/02/25

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/Styles/PromptPage.css';
import '../index.css';

const countries = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina",
  "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados",
  "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana",
  "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon",
  "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo",
  "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica",
  "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia",
  "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana",
  "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary",
  "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan",
  "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea (North)", "Korea (South)", "Kuwait", "Kyrgyzstan",
  "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
  "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania",
  "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco",
  "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua",
  "Niger", "Nigeria", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea",
  "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda",
  "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino",
  "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore",
  "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "Spain", "Sri Lanka", "Sudan",
  "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste",
  "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine",
  "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City",
  "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

const PromptPage = ({ onQuestionsGenerated = () => {} }) => {
  const [text, setText] = useState('');
  const [question1, setQuestion1] = useState('');
  const [question2, setQuestion2] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [heading, setHeading] = useState(''); // Typewriter effect state
  const navigate = useNavigate();

  // Typewriter Effect
  const startTypingEffect = (text) => {
    let i = 0;
    setHeading(''); // Reset heading before typing starts
    const interval = setInterval(() => {
      setHeading((prev) => (prev || '') + (text[i] || '')); // Avoid undefined being appended
      i++;
      if (i === text.length) clearInterval(interval);
    }, 100);
  };

  // Trigger Typewriter When Both Questions Are Answered
  const handleSelectChange = (setter, value) => {
    setter(value);
    if (question1 && question2) return; // Prevent retriggering if already set
    if ((question1 && value) || (question2 && value)) {
      startTypingEffect("WWrite your prompt wisely.");
    }
  };

  const handleGenerateQuestions = async () => {
    if (!text.trim() || !question1 || !question2) {
      setError('Please complete all fields');
      return;
    }
    setError('');
    setIsLoading(true);

    const requestData = { initial_context: text, highest_education: question1, country: question2 };

    try {
      const response = await fetch({process.env.REACT_APP_API_URL}, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const result = await response.json();
      if (result.error) throw new Error(result.error);
      onQuestionsGenerated(result.questions);
      navigate('/questions', { state: { questions: result.questions,initial_context:result.initial_context} });

    } catch (error) {
      setError(`Error: ${error.message || 'Failed to generate questions'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="prompt-container">
      <nav className="navbar">
        <div className="logo">Career AI</div>
        <button className="logout-btn">Logout</button>
      </nav>

      <main className="main-content">
        {question1 && question2 && <p className="prompt-text">{heading}</p>} 
        {error && <div className="error-message">{error}</div>}

        <div className="question-boxes">
          <div className="question-box">
            <select id="question1" value={question1} onChange={(e) => handleSelectChange(setQuestion1, e.target.value)}>
              <option value="" disabled hidden>Highest level of education?</option>
              <option value="High School Diploma">High School Diploma</option>
              <option value="Undergraduate Degree">Undergraduate Degree</option>
              <option value="Graduate Degree">Graduate Degree</option>
              <option value="PhD">PhD</option>
            </select>
          </div>

          <div className="question-box">
            <select id="question2" value={question2} onChange={(e) => handleSelectChange(setQuestion2, e.target.value)}>
              <option value="" disabled hidden>Country you live in?</option>
              {countries.map((country, index) => (
                <option key={index} value={country}>{country}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="response-box">
          <textarea className="generated-text" value={text} onChange={(e) => setText(e.target.value)}
            placeholder="Example: I am interested in badminton, weightlifting and Math..." />
        </div>

        <div className="button-container">
          <button className="icon-btn" onClick={handleGenerateQuestions} disabled={isLoading}>
            {isLoading ? 'Generating...' : 'Generate Questions'}
          </button>
        </div>
      </main>
    </div>
  );
};

export default PromptPage;

*/


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar'; // Import Navbar
import '../components/Styles/PromptPage.css';
import '../index.css';

const countries = [  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina",
  "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados",
  "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana",
  "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon",
  "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo",
  "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica",
  "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia",
  "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana",
  "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary",
  "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan",
  "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea (North)", "Korea (South)", "Kuwait", "Kyrgyzstan",
  "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
  "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania",
  "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco",
  "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua",
  "Niger", "Nigeria", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea",
  "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda",
  "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino",
  "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore",
  "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "Spain", "Sri Lanka", "Sudan",
  "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste",
  "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine",
  "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City",
  "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"];

const PromptPage = ({ onQuestionsGenerated = () => {} }) => {
  const [text, setText] = useState('');
  const [question1, setQuestion1] = useState('');
  const [question2, setQuestion2] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleGenerateQuestions = async () => {
    if (!text.trim() || !question1 || !question2) {
      setError('Please complete all fields');
      return;
    }
    setError('');
    setIsLoading(true);

    const requestData = { initial_context: text, highest_education: question1, country: question2 };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/generate-questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const result = await response.json();
      if (result.error) throw new Error(result.error);
      onQuestionsGenerated(result.questions);
      navigate('/questions', { state: { questions: result.questions, initial_context: result.initial_context } });

    } catch (error) {
      setError(`Error: ${error.message || 'Failed to generate questions'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
    
    <div className="prompt-container">
        {/* Add Navbar component here */}
        <Navbar />
      <main className="main-content">
        <p className="prompt-text">Choose your path! Your journey starts here.</p>
        {error && <div className="error-message">{error}</div>}

        <div className="question-boxes">
          <div className="question-box">
            <select id="question1" value={question1} onChange={(e) => setQuestion1(e.target.value)}>
              <option value="" disabled hidden>Highest level of education?</option>
              <option value="High School Diploma">High School Diploma</option>
              <option value="Undergraduate Degree">Undergraduate Degree</option>
              <option value="Graduate Degree">Graduate Degree</option>
              <option value="PhD">PhD</option>
            </select>
          </div>

          <div className="question-box">
            <select id="question2" value={question2} onChange={(e) => setQuestion2(e.target.value)}>
              <option value="" disabled hidden>Country you live in?</option>
              {countries.map((country, index) => (
                <option key={index} value={country}>{country}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="response-box">
          <textarea className="generated-text" value={text} onChange={(e) => setText(e.target.value)}
            placeholder="Example: I am interested in badminton, weightlifting, and Math..." />
        </div>

        <div className="button-container">
          <button className="icon-btn" onClick={handleGenerateQuestions} disabled={isLoading}>
            {isLoading ? 'Generating...' : 'Generate Questions'}
          </button>
        </div>
      </main>
    </div>
    </>
  );
};

export default PromptPage;
