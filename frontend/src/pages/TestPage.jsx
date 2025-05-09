import React from 'react';
import { Typography, Box } from '@mui/material';

const TestPage = ({ title }) => {
  return (
    <Box
      sx={{
        backgroundColor: '#fcec', // Light pink color
        minHeight: '100vh', // Ensure the background covers the full viewport height
        padding: 2, // Optional: Add some padding for content spacing
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        {title} Page
      </Typography>
    </Box>
  );
};

export default TestPage;