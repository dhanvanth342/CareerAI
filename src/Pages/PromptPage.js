/*
import React, { useState } from 'react';
import '../components/Styles/PromptPage.css';

const PromptPage = () => {
  const [text, setText] = useState('');

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  return (
    <div className="prompt-container">
      <nav className="navbar">
        <div className="logo">Career AI</div>
        <button className="logout-btn">Logout</button>
      </nav>
      
      <main className="main-content">
        <p className="prompt-text">Choose your path! Use the generated prompt or customize it to match your 
          preferences. Your career journey starts here!!</p>
        
        <div className="response-box">
          <textarea
            className="generated-text"
            value={text}
            onChange={handleTextChange}
            placeholder="Generated text appears here..."
          />
        </div>

        <div className="button-container">
          <button className="icon-btn edit-btn" aria-label="Edit"></button>
          <button className="icon-btn ok-btn" aria-label="OK"></button>
        </div>
      </main>
    </div>
  );
};

export default PromptPage;
*/

import React, { useState } from 'react';
import '../components/Styles/PromptPage.css';

// List of countries (kept clean and external to the component)
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

const PromptPage = () => {
  const [text, setText] = useState('');
  const [question1, setQuestion1] = useState('');
  const [question2, setQuestion2] = useState('');

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleQuestion1Change = (e) => {
    setQuestion1(e.target.value);
  };

  const handleQuestion2Change = (e) => {
    setQuestion2(e.target.value);
  };

  return (
    <div className="prompt-container">

      <nav className="navbar">
        <div className="logo">Career AI</div>
        <button className="logout-btn">Logout</button>
      </nav>
      
      <main className="main-content">
        <p className="prompt-text">Choose your path! Use the generated prompt or customize it to match your preferences. Your career journey starts here!</p>
        
        {/* Dropdown Section */}
        <div className="dropdown-section">
          <div className="dropdown-box">
            <label htmlFor="question1">Question 1: Level of education?</label>
            <select id="question1" value={question1} onChange={handleQuestion1Change}>
              <option value="" disabled>Select an option</option>
              <option value="option1">High School Diploma</option>
              <option value="option2">Undergraduate Degree</option>
              <option value="option3">Graduate Degree</option>
              <option value="option4">PhD</option>
            </select>
          </div>

          <div className="dropdown-box">
            <label htmlFor="question2">Question 2: Country you live in?</label>
            <select id="question2" value={question2} onChange={handleQuestion2Change}>
              <option value="" disabled>Select an option</option>
              {countries.map((country, index) => (
                <option key={index} value={country}>{country}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Response Box */}
        <div className="response-box">
          <textarea
            className="generated-text"
            value={text}
            onChange={handleTextChange}
            placeholder="Generated text appears here..."
          />
        </div>

        {/* Buttons */}
        <div className="button-container">
          <button className="icon-btn edit-btn" aria-label="Edit">Edit</button>
          <button className="icon-btn ok-btn" aria-label="OK">OK</button>
        </div>
      </main>
    </div>
  );
};

export default PromptPage;
