import React from 'react';
import { Box, Typography, Grid, Card, CardMedia, CardContent } from '@mui/material';
import NavBar from '../components/Navbar';
import '../components/Styles/About.css';
import '../index.css';
import choose1 from '../assets/card1.png'; 
import ques1 from '../assets/card2.png';
import ai3 from '../assets/card3.png';
import ai4 from '../assets/card4.png';

const HowItWorks = () => {
  const data = [
    {
      id: 'Begin Your Career Journey',
      image: choose1,
      detailedText: 'Decide how you want to proceed—either generate a career prompt by answering a few basic questions or write your own prompt for personalized career insights.',
      step: 'Step 1',
      
    },
    {
      id: 'Answer Career Questions',
      image: ques1,
      detailedText: 'If you choose to generate a prompt, provide your highest degree, country, and interests. Based on this, AI will generate tailored career-related questions to understand your preferences better.',
      step: 'Step 2',  
    },
    {
      id: 'Get Career Recommendations',
      image: ai3,
      detailedText: 'Once you answer the questions, AI will generate a detailed career prompt, which you can edit or submit as is. AI will then provide six career paths best suited to your profile.',
      step: 'Step 3',
    },
    {
      id: 'Explore Your Career Path',
      image: ai4,
      detailedText: 'Click on any recommended career to see a step-by-step roadmap in the form of a flowchart, along with key insights on how to become a professional in that field.',
      step: 'Step 4',
    },
  ];

  return (
    
    <Box className="how-it-works-container">
      <NavBar />
      <Typography className="how-it-works-title">
      Step-by-Step Guide
      </Typography>
      <Typography className="how-it-works-description">
        Follow these steps to explore your career options and make informed decisions about your future.
      </Typography>
      <Box className="cards-container">
      <Grid container spacing={6} justifyContent="center">
        {data.map((item, index) => (
          <Grid item xs={12} sm={4} md={4} lg={3} key={index}>
            <Card className="custom-card">
              <Box className="card-content">
                <CardMedia
                  component="img"
                  height="150"
                  image={item.image}
                  alt={item.id}
                  className="card-image"
                />
                <Box
                  sx={{
                    fontStyle: "'Questrial' sanserif",
                      padding: 2.5,
                      textAlign: 'center', 
                  }}
                >
                <Typography
                 sx={{
                      fontStyle: "'Questrial' sanserif",
                      fontSize: '1.5rem', 
                      fontWeight: 'bold', 
                      marginBottom: '1.7rem', 
                      lineHeight: '1', 
                    }}
                 >
                    {item.id}
                  </Typography>
                  
                  <Typography variant="body2" className="detailed-text"  >
                    {item.detailedText}
                  </Typography>  
                  
                  <Typography
                       sx={{
                          fontStyle: "'Questrial' sanserif",
                          fontSize: '1rem', // Slightly smaller font size for the step text
                          color: '#0a77bc', // Use a subtle color for the step text
                          fontWeight:'bold',
                          marginTop: '1rem',
                           }}
                    >{item.step}
                    </Typography>
                  </Box>
                </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
    </Box>
  );
};

export default HowItWorks;