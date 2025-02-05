import React, { useState } from 'react';
import '../components/Styles/Aiprompt.css';

const Aiprompt = () => {
  const [text, setText] = useState('');

  const handleTextChange = (e) => {
    setText(e.target.value);
    e.target.style.height = 'auto'; // Reset the height
    e.target.style.height = `${e.target.scrollHeight}px`; // Set the height to fit the content
  };
  
  
  return (
    <div className="prompt-container">
      <nav className="navbar">
        <div className="logo">Career AI</div>
        <button className="logout-btn">Logout</button>
      </nav>
      
      <main className="main-content">
        <p className="prompt-text">Here is your AI generated Prompt!</p>
        
        <div className="response-box">
          <textarea
            className="generated-text"
            value={text}
            onChange={handleTextChange}
            placeholder="Generated text appears here..."
          />
        </div>

        <div className="button-container">
      <button className="edit-button" onclick="editPrompt()">Edit</button>
      <button className="ok-button" onclick="confirmPrompt()">Submit</button>
    </div>
      </main>
    </div>
  );
};

export default Aiprompt;
