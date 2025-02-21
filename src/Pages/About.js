
/*
import React, { useState } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';

import '../index.css';

const HowItWorks = () => {
  const data = [
    { id: 'Step 1: Choose Your Prompt', value: 20, color: '#0284F0', description: 'Decide whether to generate a prompt or write your own.' },
    { id: 'Step 2: Provide Basic Info', value: 20, color: '#3A5780', description: 'Answer basic questions about your background and interests' },
    { id: 'Step 3: AI Magic Happens', value: 20, color: '#507B9E', description: 'Get career recommendations based on your inputs' },
    { id: 'Step 4: Explore Careers', value: 20, color: '#7FA3C0', description: 'Select a career to see a flowchart and steps to achieve it' },
  ];

  const [selectedIndex, setSelectedIndex] = useState(null);

  // Handle click on pie chart segment
  const handleItemClick = (event, params) => {
    setSelectedIndex(params.dataIndex); // Update selected index based on clicked segment
  };

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '90vh',
        width: '75vw',
      }}
    > 
      <Typography variant="h3" gutterBottom>
       HOW IT WORKS!!
      </Typography>

      <Grid container alignItems="center" justifyContent="center" spacing={2} sx={{ mt: 1 }}>
        
        <Grid item xs={6}>
          <PieChart
            series={[
              {
                data,
                innerRadius: '40%',
                outerRadius: '100%',
                cornerRadius: 4,
                paddingAngle: 2,
                highlightScope: { fade: 'global', highlight: 'item' },
                faded: { innerRadius: 40, additionalRadius: -30, color: 'gray' },
                
              },
            ]}
            width={570}
            height={500}
            tooltip={{ trigger: 'none' }}
            onItemClick={handleItemClick} // Attach click handler
          />
        </Grid>

      
        <Grid item xs={6}>
          {selectedIndex !== null && (
            <Box
              sx={{
                border: `2px solid ${data[selectedIndex].color}`,
                borderRadius: 5,
                padding: 3,
                textAlign: 'center',
                backgroundColor: 'transparent',
                color: '#fff',
                
              }}
            >
              <Typography variant="h5">{data[selectedIndex].id}</Typography>
              <Typography variant="body1">{data[selectedIndex].description}</Typography>
              
            </Box>
          )}
         
        </Grid>
      </Grid>
    </Box>
  );
};

export default HowItWorks; 

*/
/*
import React, { useState } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import NavBar from '../components/Navbar';
import '../components/Styles/About.css';
import '../index.css';

const HowItWorks = () => {
  const data = [
    { id: 'Step 1: Choose Your Prompt', value: 20, color: '#0284F0', description: 'Decide whether to generate a prompt or write your own.' },
    { id: 'Step 2: Provide Basic Info', value: 20, color: '#3A5780', description: 'Answer basic questions about your background and interests' },
    { id: 'Step 3: AI Magic Happens', value: 20, color: '#507B9E', description: 'Get career recommendations based on your inputs' },
    { id: 'Step 4: Explore Careers', value: 20, color: '#7FA3C0', description: 'Select a career to see a flowchart and steps to achieve it' },
  ];

  const [selectedIndex, setSelectedIndex] = useState(null);

  // Handle click on pie chart segment
  const handleItemClick = (event, params) => {
    setSelectedIndex(params.dataIndex); // Update selected index based on clicked segment
  };

  return (
   
    <Box className="how-it-works-container">
      <NavBar />
      <Typography className="how-it-works-title" variant="h3" gutterBottom>
        HOW IT WORKS!!
      </Typography>

      <Grid
        container
        alignItems="center"
        justifyContent="center"
        spacing={2}
        className="how-it-works-grid-container"
      >
       
        <Grid item xs={6}>
          <PieChart
            series={[
              {
                data,
                innerRadius: '40%',
                outerRadius: '100%',
                cornerRadius: 4,
                paddingAngle: 2,
                highlightScope: { fade: 'global', highlight: 'item' },
                faded: { innerRadius: 40, additionalRadius: -30, color: 'gray' },
              },
            ]}
            width={570}
            height={500}
            tooltip={{ trigger: 'none' }}
            onItemClick={handleItemClick} // Attach click handler
          />
        </Grid>

        
        <Grid item xs={6}>
          {selectedIndex !== null && (
            <Box
              className="how-it-works-description-box"
              style={{
                borderColor: data[selectedIndex].color,
                borderWidth: '2px',
                borderStyle: 'solid',
              }}
            >
              <Typography variant="h5">{data[selectedIndex].id}</Typography>
              <Typography variant="body1">{data[selectedIndex].description}</Typography>
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default HowItWorks;

*/

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
        HOW IT WORKS
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
