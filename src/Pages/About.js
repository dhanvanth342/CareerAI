
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

import React, { useState } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import NavBar from '../components/Navbar';

import '../components/Styles/About.css'; // Import the CSS file

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
        {/* Pie Chart */}
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

        {/* Single Description Box */}
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
