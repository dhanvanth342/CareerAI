import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import MainPage from './Pages/Mainpage';
import Login from './Pages/Login';
import Intropage from './Pages/Intropage';
import Signup from './Pages/Signup';
import PromptPage from './Pages/PromptPage';
import QuestionsPage from './Pages/Questionspage';
import Aiprompt from './Pages/Aiprompt';
import Team from './Pages/Team';
import About from './Pages/About';
import Writeprompt from './Pages/Writeprompt';

function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    if (window.gtag) {
      window.gtag('config', 'G-QPLZZWRNRH', {
        page_path: location.pathname,
      });
    }
  }, [location]);
}

function AppRoutes() {
  usePageTracking();

  return (
    <Routes>
      <Route path="/" element={<Intropage />} />
      <Route path="/Signup" element={<Signup />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/Mainpage" element={<MainPage />} />
      <Route path="/PromptPage" element={<PromptPage />} />
      <Route path="/questions" element={<QuestionsPage />} />
      <Route path="/Aiprompt" element={<Aiprompt />} />
      <Route path="/About" element={<About />} />
      <Route path="/Team" element={<Team />} />
      <Route path="/Writeprompt" element={<Writeprompt />} />
      {/* Future routes for new pages */}
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
