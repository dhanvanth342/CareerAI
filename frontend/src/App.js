import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './Pages/Mainpage';
import Login from './Pages/Login';
import Intropage from './Pages/Intropage';
import Signup from './Pages/Signup';
import PromptPage from './Pages/PromptPage';
import QuestionsPage from './Pages/Questionspage';
import Aiprompt from './Pages/Aiprompt';
import Team from './Pages/Team';
import HowItWorks from './Pages/About';
import WritePrompt from './Pages/Writeprompt';


function App() {
    return (
        <Router>
            <Routes>
                <Route path ="/" element={<Intropage /> } />
                <Route path ="/Signup" element={<Signup/>} />
                <Route path="/Login" element={<Login />} />
                <Route path="/Mainpage" element={<MainPage />} />
                <Route path ="/PromptPage" element ={<PromptPage />} />
                <Route path ="/questions" element ={<QuestionsPage/>} />
                <Route path = "/Aiprompt" element={<Aiprompt/>} /> 
                <Route path = "/WritePrompt" element={<WritePrompt/>} /> 
                <Route path = "/About" element= {<HowItWorks/>}/>
                <Route path = "/Team" element= {<Team/>}/>
                {/* Future routes for new pages */}
            </Routes>
        </Router>
    );
}

export default App;
