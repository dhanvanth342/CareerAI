import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './Pages/Mainpage';
import Login from './Pages/Login';
import Intropage from './Pages/Intropage';
import Signup from './Pages/Signup';
import PromptPage from './Pages/PromptPage';
function App() {
    return (
        <Router>
            <Routes>
                <Route path ="/" element={<Intropage /> } />
                <Route path ="/Signup" element={<Signup/>} />
                <Route path="/Login" element={<Login />} />
                <Route path="/Mainpage" element={<MainPage />} />
                <Route path ="/PromptPage" element ={<PromptPage />} />
                {/* Future routes for new pages */}
            </Routes>
        </Router>
    );
}

export default App;
