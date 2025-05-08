import React from 'react';
import { Box, CircularProgress, Typography, useTheme, useMediaQuery } from '@mui/material';
import Logo from '../assets/B.png'; // Update this import path

const LoadingScreen = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        background: 'linear-gradient(-45deg, #1A032B, #3A0D5D, #4A148C, #7B1FA2)',
        backgroundSize: '400% 400%',
        animation: 'gradientShift 8s ease infinite',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          width: '200%',
          height: '200%',
          top: '-50%',
          left: '-50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          animation: 'rotate 20s linear infinite',
        },
        '@keyframes gradientShift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        '@keyframes rotate': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      }}
    >
      {/* Floating particles - reduced count on mobile */}
      {[...Array(isMobile ? 8 : 15)].map((_, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            width: isMobile ? 4 : 6,
            height: isMobile ? 4 : 6,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.3)',
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: 'float 10s ease-in-out infinite',
            animationDelay: `${Math.random() * 5}s`,
            '@keyframes float': {
              '0%': { transform: 'translateY(0) translateX(0)' },
              '50%': { transform: 'translateY(-50px) translateX(20px)' },
              '100%': { transform: 'translateY(0) translateX(0)' },
            },
          }}
        />
      ))}

      {/* Logo Container - responsive sizing */}
      <Box
        sx={{
          width: isMobile ? 100 : 150,
          height: isMobile ? 100 : 150,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: isMobile ? 2 : 4,
          background: 'linear-gradient(145deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05))',
          boxShadow: `
            0 0 ${isMobile ? '10px' : '20px'} rgba(186, 104, 200, 0.5),
            0 0 ${isMobile ? '20px' : '40px'} rgba(186, 104, 200, 0.3),
            inset 0 0 ${isMobile ? '10px' : '20px'} rgba(255, 255, 255, 0.1)
          `,
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          position: 'relative',
          animation: 'pulse 3s ease-in-out infinite',
          '@keyframes pulse': {
            '0%': { transform: 'scale(1)', boxShadow: `0 0 ${isMobile ? '10px' : '20px'} rgba(186, 104, 200, 0.5)` },
            '50%': { 
              transform: 'scale(1.05)', 
              boxShadow: `0 0 ${isMobile ? '15px' : '30px'} rgba(186, 104, 200, 0.8)` 
            },
            '100%': { transform: 'scale(1)', boxShadow: `0 0 ${isMobile ? '10px' : '20px'} rgba(186, 104, 200, 0.5)` },
          },
        }}
      >
        <img 
          src={Logo} 
          alt="Logo" 
          style={{ 
            width: '80%', 
            height: '80%', 
            objectFit: 'contain',
            filter: 'drop-shadow(0 0 10px rgba(225, 190, 231, 0.7))'
          }} 
        />
      </Box>
      
      {/* Animated Progress - responsive sizing */}
      <Box sx={{ position: 'relative', width: isMobile ? 60 : 80, height: isMobile ? 60 : 80, mb: isMobile ? 2 : 3 }}>
        <CircularProgress 
          size={isMobile ? 60 : 80} 
          thickness={2}
          variant="determinate"
          value={75}
          sx={{ 
            position: 'absolute',
            color: 'rgba(255,255,255,0.1)',
          }} 
        />
        <CircularProgress 
          size={isMobile ? 60 : 80} 
          thickness={4}
          sx={{ 
            position: 'absolute',
            color: '#BA68C8',
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            },
            animation: 'rotateProgress 2s linear infinite',
            '@keyframes rotateProgress': {
              '0%': { transform: 'rotate(0deg)' },
              '100%': { transform: 'rotate(360deg)' },
            }
          }} 
        />
      </Box>
      
      {/* Text Content - responsive typography */}
<Box sx={{ textAlign: 'center', position: 'relative', zIndex: 1, px: { xs: 2, md: 4 } }}>
      {/* Main Title */}
      <Typography
        variant={isMobile ? 'h5' : 'h4'}
        sx={{
          color: 'transparent',
          fontWeight: 800,
          letterSpacing: { xs: '1px', md: '2.5px' },
          textShadow: '0 4px 20px rgba(186, 104, 200, 0.7)',
          mb: 1.5,
          background: 'linear-gradient(90deg, #D81B60, #8E24AA, #1E88E5)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontSize: { xs: '1.6rem', md: '2.4rem' },
          lineHeight: 1.3,
          fontFamily: '"Noto Sans Sinhala", "Roboto", sans-serif',
          animation: 'fadeIn 1.5s ease-in-out',
          '@keyframes fadeIn': {
            '0%': { opacity: 0, transform: 'translateY(20px)' },
            '100%': { opacity: 1, transform: 'translateY(0)' },
          },
        }}
      >
        "අයන්න කියන්න"
      </Typography>

      {/* Subtitle with Animated Dots */}
      <Typography 
          variant={isMobile ? "body2" : "subtitle1"}
          sx={{
            color: 'rgba(255,255,255,0.8)',
            fontWeight: 300,
            letterSpacing: '1px',
            position: 'relative',
            fontSize: isMobile ? '0.875rem' : '1rem',
            '&::after': {
              content: '"..."',
              position: 'absolute',
              animation: 'dots 1.5s steps(5, end) infinite',
              '@keyframes dots': {
                '0%, 20%': { content: '""' },
                '40%': { content: '"."' },
                '60%': { content: '".."' },
                '80%, 100%': { content: '"..."' },
              }
            }
          }}
        >
          Loading
        </Typography>
    </Box>
      
      {/* Glow effect - reduced on mobile */}
      <Box sx={{
        position: 'absolute',
        bottom: '-50%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: isMobile ? '100%' : '80%',
        height: '50%',
        background: 'radial-gradient(ellipse at center, rgba(186, 104, 200, 0.3) 0%, transparent 70%)',
        filter: isMobile ? 'blur(10px)' : 'blur(20px)',
      }} />
    </Box>
  );
};

export default LoadingScreen;