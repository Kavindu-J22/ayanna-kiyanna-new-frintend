import React from 'react';
import { Typography } from '@mui/material';

const TestPage = ({ title }) => {
  return (
    <Typography variant="h4" component="h1" gutterBottom>
      {title} Page
    </Typography>
  );
};

export default TestPage;