import React, { useState } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import '../components/Styles/About.css';
import '../index.css';

const HowItWorks = () => {
  const data = [
    { id: 'Step 1', value: 20, color: '#0284F0', description: 'Description for Step 1' },
    { id: 'Step 2', value: 20, color: '#3A5780', description: 'Description for Step 2' },
    { id: 'Step 3', value: 20, color: '#507B9E', description: 'Description for Step 3' },
    { id: 'Step 4', value: 20, color: '#7FA3C0', description: 'Description for Step 4' },
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
