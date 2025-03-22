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
    const country="";
    const highest_education="";
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
      navigate('/questions', { state: { questions: result.questions, initial_context: result.initial_context , country: country, highest_education: highest_education} });

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
    {/* First Question Box - Input Field */}
    <div className="question-box input-box">
        <p className="input-label">What is your current education level?</p>
        <input
            type="text"
            id="education-input"
            value={question1}
            onChange={(e) => setQuestion1(e.target.value)}
            placeholder="e.g., B.S. in Electrical Engineering, 3rd year"
            className="education-input"
        />
    </div>

    {/* Second Question Box - Dropdown */}
    <div className="question-box dropdown-box">
        <p className="input-label">Which country</p>
        <select
            id="country-dropdown"
            value={question2}
            onChange={(e) => setQuestion2(e.target.value)}
            className="country-dropdown"
        >
            <option value="" disabled hidden>Choose your country</option>
            {countries.map((country, index) => (
                <option key={index} value={country}>{country}</option>
            ))}
        </select>
    </div>
</div>

        <div className="response-box">
          <textarea className="generated-text" value={text} onChange={(e) => setText(e.target.value)}
            placeholder="Example: I am interested in math and sports, an I am open to study abroad" />
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