import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Avatar,
  Container,
  Paper,
  IconButton,
  useTheme,
  useMediaQuery,
  TextField
} from '@mui/material';
import {
  School,
  Person,
  Email,
  Phone,
  LocationOn,
  ArrowRight,
  ArrowLeft,
  Menu,
  PersonAdd,
  Login,
  Dashboard as DashboardIcon,
  Schedule,
  MenuBook,
  Star,
  Check,
  AccessTime,
  KeyboardArrowUp
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import logo from '../assets/AKlogo.png'; // Update with your actual logo path

const Home = () => {
  const [userEmail, setUserEmail] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user email exists in local storage
    const email = localStorage.getItem('userEmail');
    if (email) {
      setUserEmail(email);
    }
  }, []);

  useEffect(() => {
    // Add scroll event listener
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Sample data for the carousel
  const carouselItems = [
    {
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      title: "සුවිශේෂී පන්ති මාලා",
      description: "අපගේ සාම්ප්‍රදායික නර්තන පන්ති සඳහා අයදුම් කරන්න"
    },
    {
      image: "https://images.unsplash.com/photo-1541178735493-479c1a27ed24?ixlib=rb-1.2.1&auto=format&fit=crop&w=1351&q=80",
      title: "මාර්ගගත පන්ති",
      description: "සංගීතයේ මනා අත්දැකීමක් ලබා දෙන පන්ති"
    },
    {
      image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      title: "විභාග පෙරහුරු හා සම්මන්ත්‍රණ",
      description: "නාට්‍ය කලාව උගන්වන විශේෂ පන්ති"
    },
    {
      image: "https://images.unsplash.com/photo-1547153760-18fc86324498?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      title: "නායකත්ව පුහුනු වැඩසටහන්",
      description: "උඩරට සංස්කෘතියේ සුවිශේෂී නැටුම්"
    },
    {
      image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      title: "රසවින්දන වැඩසටහන්",
      description: "සාම්ප්‍රදායික රඟමඩුල්ල පන්ති"
    }
  ];

  // Testimonials data
  const testimonials = [
    {
      name: "සුනේත්‍රා පෙරේරා",
      role: "සිසුවා",
      content: "අයන්න කියන්න ආයතනයේ පන්ති මගේ ජීවිතය වෙනස් කළා. මෙතැනින් ලැබුණු අත්දැකීම් අමුතුම දෙයක්.",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      name: "රවීන්ද්‍ර ජයසිංහ",
      role: "මාතාපිය",
      content: "මගේ දරුවාගේ සංස්කෘතික දැනුම වර්ධනය කිරීමට මෙම ආයතනය ඉතාමත් උපකාරී විය.",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      name: "නිරූපමා සිල්වා",
      role: "සිසුවා",
      content: "ජගත් කුමාර සර්ගේ උගන්වන ආකාරය අතිවිශිෂ්ටයි. ඔහුගේ පන්ති ඉතාමත් රසවත්.",
      avatar: "https://randomuser.me/api/portraits/women/63.jpg"
    }
  ];

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === carouselItems.length - 1 ? 0 : prev + 1));
    }, 2000); // Change slide every 2 seconds

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [carouselItems.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === carouselItems.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? carouselItems.length - 1 : prev - 1));
  };

  return (
    <Box sx={{ overflowX: 'hidden', maxWidth: '100%' }}>
{/* Welcome Section with Enhanced Animated Background */}
<Box
  sx={{
    background: 'linear-gradient(135deg, #6a11cb 0%, #ff6b9d 50%, #ff8e53 100%)',
    color: 'white',
    py: 12,
    position: 'relative',
    overflow: 'hidden',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    '&:before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `
        radial-gradient(circle at 20% 30%, rgba(255,255,255,0.15) 0%, transparent 50%),
        radial-gradient(circle at 80% 70%, rgba(255,107,157,0.3) 0%, transparent 50%),
        radial-gradient(circle at 40% 80%, rgba(106,17,203,0.2) 0%, transparent 50%)
      `,
      animation: 'backgroundPulse 8s ease-in-out infinite alternate',
    },
    '&:after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `
        linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.05) 50%, transparent 70%),
        linear-gradient(-45deg, transparent 30%, rgba(255,107,157,0.1) 50%, transparent 70%)
      `,
      animation: 'shimmerEffect 6s ease-in-out infinite',
    },
    '@keyframes backgroundPulse': {
      '0%': {
        transform: 'scale(1) rotate(0deg)',
        opacity: 0.8,
      },
      '100%': {
        transform: 'scale(1.1) rotate(5deg)',
        opacity: 1,
      },
    },
    '@keyframes shimmerEffect': {
      '0%, 100%': {
        transform: 'translateX(-100%) translateY(-100%)',
      },
      '50%': {
        transform: 'translateX(100%) translateY(100%)',
      },
    },
  }}
>
  {/* New Awesome Floating Particle System */}
  {[...Array(30)].map((_, i) => {
    const particleTypes = [
      { shape: 'circle', size: 4 + Math.sin(i) * 3 },
      { shape: 'hexagon', size: 6 + Math.cos(i) * 4 },
      { shape: 'star', size: 5 + Math.sin(i * 0.5) * 3 },
      { shape: 'diamond', size: 4 + Math.cos(i * 0.7) * 3 },
      { shape: 'heart', size: 6 + Math.sin(i * 0.3) * 2 }
    ];

    const particle = particleTypes[i % particleTypes.length];
    const colors = [
      { primary: 'rgba(255,107,157,0.6)', secondary: 'rgba(255,142,83,0.4)', glow: 'rgba(255,107,157,0.8)' },
      { primary: 'rgba(255,142,83,0.6)', secondary: 'rgba(255,235,59,0.4)', glow: 'rgba(255,142,83,0.8)' },
      { primary: 'rgba(255,235,59,0.6)', secondary: 'rgba(255,107,157,0.4)', glow: 'rgba(255,235,59,0.8)' },
      { primary: 'rgba(106,17,203,0.5)', secondary: 'rgba(255,107,157,0.4)', glow: 'rgba(106,17,203,0.7)' },
      { primary: 'rgba(255,255,255,0.7)', secondary: 'rgba(255,142,83,0.3)', glow: 'rgba(255,255,255,0.9)' }
    ];

    const color = colors[i % colors.length];

    // Create unique movement patterns for each particle
    const movementPattern = {
      x: [
        -30 - Math.sin(i) * 20,
        30 + Math.cos(i) * 20,
        -20 + Math.sin(i * 0.5) * 15
      ],
      y: [
        -40 - Math.cos(i) * 25,
        40 + Math.sin(i) * 25,
        -30 + Math.cos(i * 0.7) * 20
      ],
      rotate: [0, 360 + Math.sin(i) * 180, 720],
      scale: [0.5, 1.2 + Math.sin(i * 0.3) * 0.3, 0.7],
      opacity: [0.1, 0.8 + Math.cos(i * 0.2) * 0.2, 0.2]
    };

    return (
      <motion.div
        key={`awesome-particle-${i}`}
        animate={movementPattern}
        transition={{
          duration: 15 + Math.sin(i) * 8,
          repeat: Infinity,
          ease: "easeInOut",
          repeatType: "loop",
          delay: (i * 0.3) % 5
        }}
        style={{
          position: 'absolute',
          top: `${5 + (i % 9) * 10}%`,
          left: `${5 + (i % 10) * 9}%`,
          width: `${particle.size}px`,
          height: `${particle.size}px`,
          zIndex: 1,
          willChange: 'transform, opacity',
          pointerEvents: 'none',
          ...(particle.shape === 'circle' && {
            borderRadius: '50%',
            background: `radial-gradient(circle, ${color.primary}, ${color.secondary})`,
            boxShadow: `0 0 ${particle.size * 2}px ${color.glow}, inset 0 0 ${particle.size}px rgba(255,255,255,0.3)`
          }),
          ...(particle.shape === 'hexagon' && {
            clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)',
            background: `linear-gradient(60deg, ${color.primary}, ${color.secondary}, ${color.primary})`,
            filter: `drop-shadow(0 0 ${particle.size}px ${color.glow})`
          }),
          ...(particle.shape === 'star' && {
            clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
            background: `conic-gradient(from 0deg, ${color.primary}, ${color.secondary}, ${color.glow}, ${color.primary})`,
            filter: `drop-shadow(0 0 ${particle.size * 1.5}px ${color.glow})`
          }),
          ...(particle.shape === 'diamond' && {
            clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
            background: `linear-gradient(45deg, ${color.primary}, ${color.secondary})`,
            boxShadow: `0 0 ${particle.size * 1.5}px ${color.glow}`
          }),
          ...(particle.shape === 'heart' && {
            clipPath: 'path("M12,21.35l-1.45-1.32C5.4,15.36,2,12.28,2,8.5 C2,5.42,4.42,3,7.5,3c1.74,0,3.41,0.81,4.5,2.09C13.09,3.81,14.76,3,16.5,3 C19.58,3,22,5.42,22,8.5c0,3.78-3.4,6.86-8.55,11.54L12,21.35z")',
            background: `radial-gradient(ellipse, ${color.primary}, ${color.secondary})`,
            filter: `drop-shadow(0 0 ${particle.size}px ${color.glow})`
          })
        }}
      />
    );
  })}

  {/* Floating Light Orbs */}
  {[...Array(8)].map((_, i) => (
    <motion.div
      key={`light-orb-${i}`}
      animate={{
        x: [0, 100 * Math.sin(i), -80 * Math.cos(i), 0],
        y: [0, -60 * Math.cos(i), 80 * Math.sin(i), 0],
        scale: [0.3, 1, 0.5, 0.3],
        opacity: [0.1, 0.6, 0.3, 0.1]
      }}
      transition={{
        duration: 20 + i * 2,
        repeat: Infinity,
        ease: "easeInOut",
        delay: i * 1.5
      }}
      style={{
        position: 'absolute',
        top: `${10 + i * 12}%`,
        left: `${8 + i * 11}%`,
        width: `${15 + i * 3}px`,
        height: `${15 + i * 3}px`,
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(255,255,255,0.8), rgba(255,107,157,0.3), transparent)`,
        filter: 'blur(1px)',
        zIndex: 0,
        willChange: 'transform, opacity',
        pointerEvents: 'none'
      }}
    />
  ))}

  {/* Magical Sparkles */}
  {[...Array(15)].map((_, i) => (
    <motion.div
      key={`sparkle-${i}`}
      animate={{
        scale: [0, 1, 0],
        rotate: [0, 180, 360],
        opacity: [0, 1, 0]
      }}
      transition={{
        duration: 3 + Math.random() * 2,
        repeat: Infinity,
        ease: "easeInOut",
        delay: Math.random() * 5,
        repeatDelay: Math.random() * 3
      }}
      style={{
        position: 'absolute',
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        width: '3px',
        height: '3px',
        background: 'rgba(255,255,255,0.9)',
        clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
        filter: 'drop-shadow(0 0 3px rgba(255,255,255,0.8))',
        zIndex: 2,
        willChange: 'transform, opacity',
        pointerEvents: 'none'
      }}
    />
  ))}

  {/* Floating Geometric Patterns */}
  {[...Array(8)].map((_, i) => (
    <motion.div
      key={`pattern-${i}`}
      animate={{
        rotate: [0, 360],
        scale: [1, 1.3, 1],
        opacity: [0.1, 0.3, 0.1]
      }}
      transition={{
        duration: 15 + Math.random() * 10,
        repeat: Infinity,
        ease: "linear",
        delay: Math.random() * 8
      }}
      style={{
        position: 'absolute',
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        width: `${30 + Math.random() * 40}px`,
        height: `${30 + Math.random() * 40}px`,
        border: '2px solid rgba(255,255,255,0.2)',
        borderRadius: i % 2 === 0 ? '50%' : '0%',
        background: 'transparent',
        zIndex: 0
      }}
    />
  ))}

  {/* Animated Wave Layers */}
  <motion.div
    animate={{
      x: [0, 100, 0],
      y: [0, -50, 0],
    }}
    transition={{
      duration: 20,
      repeat: Infinity,
      ease: "easeInOut"
    }}
    style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '120%',
      height: '200px',
      background: 'linear-gradient(90deg, transparent, rgba(255,107,157,0.1), transparent)',
      clipPath: 'polygon(0 50%, 100% 80%, 100% 100%, 0% 100%)',
      zIndex: 0
    }}
  />

  <motion.div
    animate={{
      x: [0, -80, 0],
      y: [0, 30, 0],
    }}
    transition={{
      duration: 25,
      repeat: Infinity,
      ease: "easeInOut",
      delay: 5
    }}
    style={{
      position: 'absolute',
      top: 0,
      right: 0,
      width: '120%',
      height: '150px',
      background: 'linear-gradient(90deg, transparent, rgba(255,142,83,0.1), transparent)',
      clipPath: 'polygon(0 0, 100% 0, 100% 70%, 0 40%)',
      zIndex: 0
    }}
  />

  {/* Morphing Blob Animations */}
  <motion.div
    animate={{
      borderRadius: ['30% 70% 70% 30% / 30% 30% 70% 70%', '70% 30% 30% 70% / 70% 70% 30% 30%', '30% 70% 70% 30% / 30% 30% 70% 70%'],
      scale: [1, 1.2, 1],
      rotate: [0, 180, 360]
    }}
    transition={{
      duration: 12,
      repeat: Infinity,
      ease: "easeInOut"
    }}
    style={{
      position: 'absolute',
      top: '10%',
      left: '10%',
      width: '200px',
      height: '200px',
      background: 'radial-gradient(circle, rgba(255,107,157,0.1), rgba(106,17,203,0.05))',
      filter: 'blur(2px)',
      zIndex: 0
    }}
  />

  <motion.div
    animate={{
      borderRadius: ['70% 30% 30% 70% / 70% 70% 30% 30%', '30% 70% 70% 30% / 30% 30% 70% 70%', '70% 30% 30% 70% / 70% 70% 30% 30%'],
      scale: [1, 0.8, 1],
      rotate: [360, 180, 0]
    }}
    transition={{
      duration: 15,
      repeat: Infinity,
      ease: "easeInOut",
      delay: 3
    }}
    style={{
      position: 'absolute',
      bottom: '15%',
      right: '15%',
      width: '150px',
      height: '150px',
      background: 'radial-gradient(circle, rgba(255,142,83,0.1), rgba(255,235,59,0.05))',
      filter: 'blur(1.5px)',
      zIndex: 0
    }}
  />

  {/* Logo with enhanced animation */}
  <motion.div
    initial={{ y: -100, opacity: 0, scale: 0.5 }}
    animate={{ y: 0, opacity: 1, scale: 1 }}
    transition={{
      type: 'spring',
      stiffness: 100,
      damping: 10,
      duration: 0.8
    }}
  >
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      mb: 4,
      position: 'relative',
      zIndex: 2
    }}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <img
          src={logo}
          alt="Ayanna Kiyanna Logo"
          style={{
            height: isMobile ? '100px' : '150px',
            objectFit: 'contain',
            filter: 'drop-shadow(0 0 15px rgba(255,255,255,0.7))',
            transition: 'all 0.3s ease'
          }}
        />
      </motion.div>
    </Box>
  </motion.div>

  <Container >
    {/* Main heading with staggered animation */}
    <Box sx={{ position: 'relative', zIndex: 2 }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.2, delayChildren: 0.3 }}
      >
        <motion.div
          variants={{
            hidden: { y: 20, opacity: 0 },
            visible: { y: 0, opacity: 1 }
          }}
        >
          <Typography
            variant={isMobile ? 'h3' : 'h2'}
            component="h1"
            gutterBottom
            sx={{
              fontFamily: '"Yaldevi", "Noto Serif Sinhala", "Abhaya Libre", serif',
              fontWeight: 900,
              textAlign: 'center',
              letterSpacing: '4px',
              mb: 2,
              fontSize: isMobile ? '3.2rem' : '5.5rem',
              position: 'relative',
              color: 'transparent',
              background: `
                conic-gradient(from 0deg at 50% 50%,
                  #ff6b9d 0deg,
                  #ffeb3b 72deg,
                  #ff8e53 144deg,
                  #ff3b9d 216deg,
                  #ffffff 288deg,
                  #ff6b9d 360deg
                )
              `,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              animation: 'crystallineGlow 5s ease-in-out infinite, floatingText 8s ease-in-out infinite',
              transform: 'perspective(1200px) rotateX(15deg) rotateY(-5deg)',
              transformStyle: 'preserve-3d',
              '@keyframes crystallineGlow': {
                '0%': {
                  textShadow: `
                    0 0 3px rgba(255,255,255,0.7),
                    0 0 8px rgba(255,107,157,0.6),
                    0 0 15px rgba(255,107,157,0.4),
                    0 0 22px rgba(255,107,157,0.3),
                    0 0 30px rgba(255,107,157,0.15),
                    3px 3px 0px rgba(255,142,83,0.5),
                    6px 6px 0px rgba(255,235,59,0.3),
                    9px 9px 0px rgba(255,59,157,0.2)
                  `,
                  filter: `
                    drop-shadow(0 0 18px rgba(255,107,157,0.5))
                    drop-shadow(0 0 35px rgba(255,142,83,0.25))
                    brightness(1.15)
                    contrast(1.1)
                    saturate(1.2)
                  `,
                },
                '25%': {
                  textShadow: `
                    0 0 4px rgba(255,255,255,0.7),
                    0 0 10px rgba(255,142,83,0.6),
                    0 0 18px rgba(255,142,83,0.4),
                    0 0 25px rgba(255,142,83,0.3),
                    0 0 32px rgba(255,142,83,0.15),
                    3px 3px 0px rgba(255,235,59,0.5),
                    6px 6px 0px rgba(255,107,157,0.3),
                    9px 9px 0px rgba(255,59,157,0.2)
                  `,
                  filter: `
                    drop-shadow(0 0 20px rgba(255,142,83,0.5))
                    drop-shadow(0 0 40px rgba(255,235,59,0.25))
                    brightness(1.2)
                    contrast(1.15)
                    saturate(1.25)
                  `,
                },
                '50%': {
                  textShadow: `
                    0 0 5px rgba(255,255,255,0.7),
                    0 0 12px rgba(255,235,59,0.6),
                    0 0 20px rgba(255,235,59,0.4),
                    0 0 28px rgba(255,235,59,0.3),
                    0 0 35px rgba(255,235,59,0.15),
                    3px 3px 0px rgba(255,59,157,0.5),
                    6px 6px 0px rgba(255,142,83,0.3),
                    9px 9px 0px rgba(255,107,157,0.2)
                  `,
                  filter: `
                    drop-shadow(0 0 22px rgba(255,235,59,0.5))
                    drop-shadow(0 0 45px rgba(255,59,157,0.25))
                    brightness(1.25)
                    contrast(1.2)
                    saturate(1.3)
                  `,
                },
                '75%': {
                  textShadow: `
                    0 0 6px rgba(255,255,255,0.7),
                    0 0 14px rgba(255,59,157,0.6),
                    0 0 22px rgba(255,59,157,0.4),
                    0 0 30px rgba(255,59,157,0.3),
                    0 0 38px rgba(255,59,157,0.15),
                    3px 3px 0px rgba(255,107,157,0.5),
                    6px 6px 0px rgba(255,235,59,0.3),
                    9px 9px 0px rgba(255,142,83,0.2)
                  `,
                  filter: `
                    drop-shadow(0 0 25px rgba(255,59,157,0.5))
                    drop-shadow(0 0 50px rgba(255,107,157,0.25))
                    brightness(1.2)
                    contrast(1.15)
                    saturate(1.25)
                  `,
                },
                '100%': {
                  textShadow: `
                    0 0 3px rgba(255,255,255,0.7),
                    0 0 8px rgba(255,107,157,0.6),
                    0 0 15px rgba(255,107,157,0.4),
                    0 0 22px rgba(255,107,157,0.3),
                    0 0 30px rgba(255,107,157,0.15),
                    3px 3px 0px rgba(255,142,83,0.5),
                    6px 6px 0px rgba(255,235,59,0.3),
                    9px 9px 0px rgba(255,59,157,0.2)
                  `,
                  filter: `
                    drop-shadow(0 0 18px rgba(255,107,157,0.5))
                    drop-shadow(0 0 35px rgba(255,142,83,0.25))
                    brightness(1.15)
                    contrast(1.1)
                    saturate(1.2)
                  `,
                },
              },
              '@keyframes floatingText': {
                '0%, 100%': {
                  transform: 'perspective(1200px) rotateX(15deg) rotateY(-5deg) translateY(0px) scale(1)',
                },
                '25%': {
                  transform: 'perspective(1200px) rotateX(12deg) rotateY(-3deg) translateY(-8px) scale(1.02)',
                },
                '50%': {
                  transform: 'perspective(1200px) rotateX(18deg) rotateY(-7deg) translateY(-5px) scale(1.01)',
                },
                '75%': {
                  transform: 'perspective(1200px) rotateX(13deg) rotateY(-2deg) translateY(-10px) scale(1.03)',
                },
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: '-20px',
                left: '-20px',
                right: '-20px',
                bottom: '-20px',
                background: `
                  radial-gradient(ellipse at center,
                    rgba(255,107,157,0.3) 0%,
                    rgba(255,142,83,0.2) 30%,
                    rgba(255,235,59,0.1) 60%,
                    transparent 100%
                  )
                `,
                borderRadius: '50%',
                filter: 'blur(25px)',
                zIndex: -1,
                animation: 'crystalAura 4s ease-in-out infinite alternate',
              },
              '@keyframes crystalAura': {
                '0%': {
                  opacity: 0.4,
                  transform: 'scale(0.8) rotate(0deg)',
                },
                '100%': {
                  opacity: 0.8,
                  transform: 'scale(1.2) rotate(360deg)',
                },
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '120%',
                height: '120%',
                transform: 'translate(-50%, -50%)',
                background: `
                  conic-gradient(from 0deg,
                    transparent 0deg,
                    rgba(255,107,157,0.1) 90deg,
                    transparent 180deg,
                    rgba(255,142,83,0.1) 270deg,
                    transparent 360deg
                  )
                `,
                borderRadius: '50%',
                filter: 'blur(15px)',
                zIndex: -2,
                animation: 'crystalRing 6s linear infinite',
              },
              '@keyframes crystalRing': {
                '0%': {
                  transform: 'translate(-50%, -50%) rotate(0deg) scale(0.9)',
                  opacity: 0.3,
                },
                '50%': {
                  transform: 'translate(-50%, -50%) rotate(180deg) scale(1.1)',
                  opacity: 0.6,
                },
                '100%': {
                  transform: 'translate(-50%, -50%) rotate(360deg) scale(0.9)',
                  opacity: 0.3,
                },
              }
            }}
          >
            ආයුබෝවන්..
          </Typography>
        </motion.div>

        <motion.div
          variants={{
            hidden: { y: 20, opacity: 0 },
            visible: { y: 0, opacity: 1 }
          }}
        >
          <Typography
            variant={isMobile ? 'h5' : 'h4'}
            component="h2"
            gutterBottom
            sx={{
              fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", "Yaldevi", sans-serif',
              fontWeight: 700,
              textAlign: 'center',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              lineHeight: 1.3,
              px: isMobile ? 2 : 0,
              mb: 4,
              fontSize: isMobile ? '1.8rem' : '2.5rem'
            }}
          >
            <Box component="span" sx={{ color: '#ffeb3b' }}>"අ"</Box>යන්න කියන්න සිංහල ආයතනයට<br />
            <Box component="span" sx={{
              background: 'linear-gradient(to right, #ffeb3b, #ff9800)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: `
                0 0 1px rgba(255,255,255,0.8),
                0 0 3px rgba(255,107,157,0.6),
                0 0 6px rgba(255,142,83,0.4),
                0 0 9px rgba(255,235,59,0.3),
                2px 2px 0px rgba(255,59,157,0.4),
                4px 4px 0px rgba(255,142,83,0.3)
              `,
              filter: `
                drop-shadow(0 0 8px rgba(255,107,157,0.4))
                drop-shadow(0 0 15px rgba(255,142,83,0.2))
                brightness(1.1)
                contrast(1.1)
                saturate(1.2)
              `,
              '&::before': {
                content: '""',
                position: 'absolute',
                top: '-8px',
                left: '-12px',
                right: '-12px',
                bottom: '-8px',
                background: `
                  radial-gradient(ellipse at center,
                    rgba(255,107,157,0.15) 0%,
                    rgba(255,142,83,0.1) 40%,
                    rgba(255,235,59,0.05) 70%,
                    transparent 100%
                  )
                `,
                borderRadius: '15px',
                filter: 'blur(12px)',
                zIndex: -1,
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                top: '0',
                left: '0',
                right: '0',
                bottom: '0',
                background: `
                  linear-gradient(45deg,
                    transparent 0%,
                    rgba(255,255,255,0.1) 30%,
                    rgba(255,255,255,0.2) 50%,
                    rgba(255,255,255,0.1) 70%,
                    transparent 100%
                  )
                `,
                borderRadius: '8px',
                zIndex: 1,
                pointerEvents: 'none',
                opacity: 0.6,
              }
            }}>
              සාදරයෙන් පිළිගනිමු..!
            </Box>
          </Typography>
        </motion.div>

        <motion.div
          variants={{
            hidden: { y: 20, opacity: 0 },
            visible: { y: 0, opacity: 1 }
          }}
        >
          <Box sx={{
            background: 'rgba(0,0,0,0.2)',
            backdropFilter: 'blur(5px)',
            borderRadius: '16px',
            p: 3,
            mb: 4,
            borderLeft: '4px solid #ffeb3b',
            maxWidth: '800px',
            mx: 'auto'
          }}>
            <Typography
              variant={isMobile ? 'h7' : 'h6'}
              component="div"
              sx={{
                fontFamily: '"Noto Serif Sinhala", "Abhaya Libre", serif',
                textAlign: 'center',
                fontStyle: 'italic',
                textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                lineHeight: 1.6,
                fontSize: isMobile ? '1.1rem' : '1.3rem',
                fontWeight: 500
              }}
            >
              "ලෝභ නැතුව සතර බෙදන, අසිරිමත් බුද්ධි මෙහෙවර"
              <Typography
                component="div"
                variant={isMobile ? 'subtitle1' : 'h6'}
                sx={{
                  fontFamily: '"Yaldevi", "Gemunu Libre", sans-serif',
                  mt: 2,
                  fontWeight: 700,
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: isMobile ? '1rem' : '1.2rem',
                  textShadow: '0 0 8px rgba(255,235,59,0.4)'
                }}
              >
                - ජගත් කුමාර ජයසිංහ -
              </Typography>
            </Typography>
          </Box>
        </motion.div>
      </motion.div>

{/* Centered Side Menu Instruction */}
<motion.div
  initial={{ y: 20, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ delay: 1, duration: 0.8 }}
  style={{ display: 'flex', justifyContent: 'center' }}
>
  <Paper
    elevation={6}
    sx={{
      p: 2,
      backgroundColor: 'rgba(0,0,0,0.25)',
      backdropFilter: 'blur(8px)',
      width: isMobile ? '100%' : '80%',
      maxWidth: '600px',
      borderRadius: '16px',
      border: '1px solid rgba(255,255,255,0.1)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      overflow: 'hidden',
      position: 'relative',
      textAlign: 'center',
      '&:before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: 'linear-gradient(to right, #6a11cb,rgb(157, 68, 253))'
      }
    }}
  >
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection={isMobile ? 'column' : 'row'}
      gap={1}
    >
      <DashboardIcon sx={{
        fontSize: '2rem',
        color: 'rgb(249, 230, 184)',
        mb: isMobile ? 1 : 0
      }} />
      <Typography
        variant={isMobile ? 'body2' : 'body1'}
        sx={{
          fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
          fontWeight: 600,
          textAlign: 'center',
          lineHeight: 1.5,
          color: 'rgb(249, 230, 184)',
          fontSize: isMobile ? '0.95rem' : '1.1rem',
          textShadow: '0 0 5px rgba(249, 230, 184, 0.3)'
        }}
      >
        ඔබේ ගමන ගවේෂණය කිරීම සඳහා දකුණු පස මෙනුව භාවිතා කරන්න 🎗️
      </Typography>
    </Box>
  </Paper>
</motion.div>

      {/* User section with enhanced buttons */}
      <Box sx={{
        mt: 8,
        textAlign: 'center',
        position: 'relative',
        zIndex: 2
      }}>
        {userEmail ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Typography variant="h6" gutterBottom sx={{
              fontFamily: '"Yaldevi", "Noto Sans Sinhala", sans-serif',
              mb: 3,
              fontSize: isMobile ? '1.2rem' : '1.4rem',
              fontWeight: 600
            }}>
              නැවත සාදරයෙන් පිළිගනිමු,
              <Box component="span" sx={{
                color: '#ffeb3b',
                fontWeight: 700,
                ml: 1,
                textShadow: '0 0 8px rgba(255,235,59,0.4)'
              }}>
                {userEmail.split('@')[0]}
              </Box>
            </Typography>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                startIcon={<Person sx={{ fontSize: '1.5rem' }} />}
                sx={{
                  fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                  borderRadius: '50px',
                  px: 5,
                  py: 1.5,
                  fontWeight: 'bold',
                  fontSize: isMobile ? '1rem' : '1.1rem',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
                  background: 'linear-gradient(45deg, #ff9800 30%, #ffeb3b 90%)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0 12px 25px rgba(0,0,0,0.4)'
                  }
                }}
              >
                පුද්ගලික උපකරණ පුවරුව
              </Button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <Typography variant="h6" gutterBottom sx={{
              fontFamily: '"Yaldevi", "Noto Sans Sinhala", sans-serif',
              mb: 3,
              fontSize: isMobile ? '1.2rem' : '1.4rem',
              fontWeight: 600
            }}>
            🎯අප සමඟ එකතු වන්න
            </Typography>
            <Box display="flex" justifyContent="center" gap={3} flexWrap="wrap">
              <motion.div whileHover={{ scale: 1.05 }}>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  startIcon={<PersonAdd sx={{ fontSize: '1.5rem' }} />}
                  sx={{
                    fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                    borderRadius: '50px',
                    px: 5,
                    py: 1.5,
                    fontWeight: 'bold',
                    fontSize: isMobile ? '1rem' : '1.1rem',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
                    background: 'linear-gradient(45deg, #ff9800 30%,rgb(255, 59, 157) 90%)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: '0 12px 25px rgba(0,0,0,0.4)'
                    }
                  }}
                >
                  ලියාපදිංචි වන්න
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Button
                  variant="outlined"
                  color="secondary"
                  size="large"
                  startIcon={<Login sx={{ fontSize: '1.5rem' }} />}
                  sx={{
                    fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                    borderRadius: '50px',
                    px: 5,
                    py: 1.5,
                    fontWeight: 'bold',
                    fontSize: isMobile ? '1rem' : '1.1rem',
                    borderWidth: '2px',
                    borderColor: '#ffeb3b',
                    color: '#ffeb3b',
                    '&:hover': {
                      borderWidth: '2px',
                      backgroundColor: 'rgba(255,235,59,0.1)',
                      borderColor: '#ffeb3b'
                    }
                  }}
                >
                  ඇතුළු වන්න
                </Button>
              </motion.div>
            </Box>
          </motion.div>
        )}
      </Box>
    </Box>
  </Container>

  {/* Animated floating elements */}
  <motion.div
    animate={{
      y: [0, -40, 0],
      rotate: [0, 360]
    }}
    transition={{
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut"
    }}
    style={{
      position: 'absolute',
      top: '20%',
      left: '10%',
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(255,235,59,0.3) 0%, transparent 70%)',
      filter: 'blur(2px)',
      zIndex: 1
    }}
  />
  <motion.div
    animate={{
      y: [0, 30, 0],
      x: [0, 20, 0]
    }}
    transition={{
      duration: 10,
      repeat: Infinity,
      ease: "easeInOut",
      delay: 2
    }}
    style={{
      position: 'absolute',
      bottom: '15%',
      right: '15%',
      width: '100px',
      height: '100px',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(106,17,203,0.3) 0%, transparent 70%)',
      filter: 'blur(3px)',
      zIndex: 1
    }}
  />
</Box>

{/* Register as Student Section */}
<Box sx={{
  py: 6,  // Reduced padding
  background: 'linear-gradient(135deg, #f9f9f9 0%, #e3f2fd 100%)',
  position: 'relative',
  overflow: 'hidden',
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'url(/abstract-bg.svg) no-repeat',
    backgroundSize: 'cover',
    opacity: 0.05,
    zIndex: 0
  }
}}>
  <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <Typography
        variant="h3"
        component="h2"
        gutterBottom
        sx={{
          fontFamily: '"Yaldevi", "Noto Sans Sinhala", "Gemunu Libre", sans-serif',
          fontSize: { xs: '1.8rem', sm: '2.2rem' }, // Smaller font size
          textAlign: 'center',
          mb: 4,  // Reduced margin
          color: 'rgb(129, 27, 112)',
          fontWeight: 'bold',
          position: 'relative',
          textShadow: '1px 1px 3px rgba(0,0,0,0.1)',
          '&:after': {
            content: '""',
            display: 'block',
            width: '80px',  // Smaller underline
            height: '3px',
            background: theme.palette.secondary.main,
            margin: '15px auto 0',  // Reduced margin
            borderRadius: '2px',
          }
        }}
      >
        සිසුවකු ලෙස ලියාපදිංචි වන්න 🎓
      </Typography>
    </motion.div>

    <Grid container spacing={3} justifyContent="center" alignItems="stretch"> {/* Reduced spacing */}
      {/* Box 1 - Register as New Student */}
      <Grid item xs={12} sm={6} md={4} sx={{ display: 'flex' }}>
        <motion.div
          whileHover={{ y: -5, scale: 1.02 }}  // Smaller hover effect
          transition={{ duration: 0.3 }}
          style={{ height: '100%', width: '100%' }}
        >
          <Card sx={{
            height: '100%',
            width: '300px',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '12px',  // Smaller border radius
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',  // Smaller shadow
            transition: 'all 0.3s ease',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(248,248,248,0.9) 100%)',
            border: '1px solid rgba(0,0,0,0.05)',
            '&:hover': {
              boxShadow: '0 8px 20px rgba(0,0,0,0.12)'  // Smaller hover shadow
            }
          }}>
            <Box sx={{
              height: '160px',  // Reduced height
              background: 'linear-gradient(135deg,rgb(254, 251, 79) 0%,rgb(254, 114, 0) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
              '&:before': {
                content: '""',
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                width: '200%',
                height: '200%',
                background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
                transform: 'rotate(30deg)'
              }
            }}>
              <PersonAdd sx={{
                fontSize: '4rem',  // Smaller icon
                color: 'white',
                opacity: 0.9,
                zIndex: 1
              }} />
            </Box>
            <CardContent sx={{
              textAlign: 'center',
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              p: 2  // Reduced padding
            }}>
              <Box>
                <Typography gutterBottom variant="h6" component="div" sx={{
                  fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                  fontWeight: 'bold',
                  mb: 1
                }}> {/* Smaller heading */}
                  නව සිසු ලියාපදිංචිය
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{
                  fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
                  fontSize: '0.875rem',
                  mb: 1.5
                }}> {/* Smaller text */}
                  අපගේ පන්ති සඳහා ලියාපදිංචි වීමේ පහසු ක්‍රියාවලිය
                </Typography>
              </Box>
              <Button
                variant="contained"
                size="small"  // Smaller button
                endIcon={<ArrowRight fontSize="small" />}
                sx={{
                  fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                  borderRadius: '50px',
                  px: 3,
                  mt: 1,
                  alignSelf: 'center',
                  background: 'linear-gradient(90deg,rgb(254, 204, 79) 0%,rgb(254, 89, 0) 100%)',
                  boxShadow: '0 2px 6px rgba(79, 172, 254, 0.3)',
                  '&:hover': {
                    boxShadow: '0 4px 10px rgba(79, 172, 254, 0.4)'
                  }
                }}
              >
                ලියාපදිංචි වන්න
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </Grid>

      {/* Box 2 - Classes and Times */}
      <Grid item xs={12} sm={6} md={4} sx={{ display: 'flex' }}>
        <motion.div
          whileHover={{ y: -5, scale: 1.02 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          style={{ height: '100%', width: '100%' }}
        >
          <Card sx={{
            height: '100%',
            width: '300px',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            transition: 'all 0.3s ease',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(248,248,248,0.9) 100%)',
            border: '1px solid rgba(0,0,0,0.05)',
            '&:hover': {
              boxShadow: '0 8px 20px rgba(0,0,0,0.12)'
            }
          }}>
            <Box sx={{
              height: '160px',
              background: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
              '&:before': {
                content: '""',
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                width: '200%',
                height: '200%',
                background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
                transform: 'rotate(30deg)'
              }
            }}>
              <Schedule sx={{
                fontSize: '4rem',
                color: 'white',
                opacity: 0.9,
                zIndex: 1
              }} />
            </Box>
            <CardContent sx={{
              textAlign: 'center',
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              p: 2
            }}>
              <Box>
                <Typography gutterBottom variant="h6" component="div" sx={{
                  fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                  fontWeight: 'bold',
                  mb: 1
                }}>
                  පන්ති සහ වේලාවන්
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{
                  fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
                  fontSize: '0.875rem',
                  mb: 1.5
                }}>
                විවිධ ශ්‍රේණි සඳහා පැවැත්වෙන පන්ති සහ ඒවායේ කාලසටහන්
                </Typography>
              </Box>
              <Button
                variant="contained"
                size="small"
                endIcon={<ArrowRight fontSize="small" />}
                sx={{
                  fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                  borderRadius: '50px',
                  px: 3,
                  mt: 1,
                  alignSelf: 'center',
                  background: 'linear-gradient(90deg, #a18cd1 0%, #fbc2eb 100%)',
                  boxShadow: '0 2px 6px rgba(161, 140, 209, 0.3)',
                  '&:hover': {
                    boxShadow: '0 4px 10px rgba(161, 140, 209, 0.4)'
                  }
                }}
              >
                වැඩිදුර තොරතුරු
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </Grid>

      {/* Box 3 - Book Reservation */}
      <Grid item xs={12} sm={6} md={4} sx={{ display: 'flex' }}>
        <motion.div
          whileHover={{ y: -5, scale: 1.02 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          style={{ height: '100%', width: '100%' }}
        >
          <Card sx={{
            height: '100%',
            width: '300px',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            transition: 'all 0.3s ease',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(248,248,248,0.9) 100%)',
            border: '1px solid rgba(0,0,0,0.05)',
            '&:hover': {
              boxShadow: '0 8px 20px rgba(0,0,0,0.12)'
            }
          }}>
            <Box sx={{
              height: '160px',
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
              '&:before': {
                content: '""',
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                width: '200%',
                height: '200%',
                background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
                transform: 'rotate(30deg)'
              }
            }}>
              <MenuBook sx={{
                fontSize: '4rem',
                color: 'white',
                opacity: 0.9,
                zIndex: 1
              }} />
            </Box>
            <CardContent sx={{
              textAlign: 'center',
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              p: 2
            }}>
              <Box>
                <Typography gutterBottom variant="h6" component="div" sx={{
                  fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                  fontWeight: 'bold',
                  mb: 1
                }}>
                  පොත් තබාගැනීම
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{
                  fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
                  fontSize: '0.875rem',
                  mb: 1.5
                }}>
                අධ්‍යයනයේ පහසුව සඳහා අවශ්‍ය පොත් තබාගැනීමට මග පෙන්වීම
                </Typography>
              </Box>
              <Button
                variant="contained"
                size="small"
                endIcon={<ArrowRight fontSize="small" />}
                sx={{
                  fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                  borderRadius: '50px',
                  px: 3,
                  mt: 1,
                  alignSelf: 'center',
                  background: 'linear-gradient(90deg, #f093fb 0%, #f5576c 100%)',
                  boxShadow: '0 2px 6px rgba(240, 147, 251, 0.3)',
                  '&:hover': {
                    boxShadow: '0 4px 10px rgba(240, 147, 251, 0.4)'
                  }
                }}
              >
                වැඩිදුර තොරතුරු
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </Grid>
    </Grid>
  </Container>
</Box>


<Box sx={{ py: 4, background: '#f9f9f9' }}>
      <Container>
        <Box sx={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
          {/* Slider container */}
          <Box sx={{
            display: 'flex',
            transition: 'transform 0.5s ease',
            transform: `translateX(-${currentSlide * (100 / carouselItems.length)}%)`,
            width: `${carouselItems.length * 100}%`
          }}>
            {carouselItems.map((item, index) => (
              <Box
                key={index}
                sx={{
                  width: `${100 / carouselItems.length}%`,
                  position: 'relative',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  flexShrink: 0
                }}
              >
                <Box
                  component="img"
                  src={item.image}
                  alt={item.title}
                  sx={{
                    width: '100%',
                    height: isMobile ? '300px' : '500px',
                    objectFit: 'cover',
                    filter: 'brightness(0.7)'
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: 4,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
                    color: 'white'
                  }}
                >
                  <Typography variant="h4" component="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
                    {item.title}
                  </Typography>
                  <Typography variant="h6" component="p" sx={{ mb: 3 }}>
                    {item.description}
                  </Typography>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    sx={{
                      fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                      borderRadius: '50px',
                      px: 4
                    }}
                  >
                    තවත් බලන්න
                  </Button>
                </Box>
              </Box>
            ))}
          </Box>

          {/* Navigation arrows */}
          {!isMobile && (
            <>
              <IconButton
                onClick={prevSlide}
                sx={{
                  position: 'absolute',
                  zIndex: 2,
                  left: 20,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(255,255,255,0.7)',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.9)'
                  }
                }}
              >
                <ArrowLeft fontSize="large" />
              </IconButton>
              <IconButton
                onClick={nextSlide}
                sx={{
                  position: 'absolute',
                  zIndex: 2,
                  right: 20,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(255,255,255,0.7)',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.9)'
                  }
                }}
              >
                <ArrowRight fontSize="large" />
              </IconButton>
            </>
          )}

          {/* Indicators */}
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            mt: 3,
            gap: 1
          }}>
            {carouselItems.map((_, index) => (
              <Box
                key={index}
                onClick={() => setCurrentSlide(index)}
                sx={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: currentSlide === index ? theme.palette.primary.main : theme.palette.grey[400],
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease'
                }}
              />
            ))}
          </Box>
        </Box>
      </Container>
    </Box>

{/* Our Message Section */}
<Box sx={{
  py: { xs: 4, md: 5 },
  background: 'linear-gradient(to bottom, #f9f9f9 0%, #ffffff 100%)',
  position: 'relative',
  overflow: 'hidden',
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: 'url(/path/to/subtle-pattern.png)',
    opacity: 0.03,
    zIndex: 0
  }
}}>
  <Container sx={{ position: 'relative', zIndex: 1 }}>
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <Typography
        variant="h3"
        component="h2"
        gutterBottom
        sx={{
          fontFamily: '"Yaldevi", "Noto Sans Sinhala", "Gemunu Libre", sans-serif',
          textAlign: 'center',
          fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
          mb: { xs: 4, md: 6 },
          color: 'rgb(129, 27, 112)',
          fontWeight: 'bold',
          position: 'relative',
          '&:after': {
            content: '""',
            display: 'block',
            width: '100px',
            height: '4px',
            background: `linear-gradient(to right, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
            margin: { xs: '15px auto 0', md: '20px auto 0' },
            borderRadius: '2px'
          }
        }}
      >
        📃 අපගේ පණිවිඩය
      </Typography>
    </motion.div>

    <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
      {/* Image Section - Left Column */}
      <Grid item xs={12} md={6} sx={{
        order: { xs: 2, md: 1 },
        display: 'flex',
        justifyContent: { xs: 'center', md: 'flex-end' }
      }}>
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '400px'
          }}
        >
          <Box sx={{
            position: 'relative',
            width: '100%',
            '&:before': {
              content: '""',
              position: 'absolute',
              width: '90%',
              height: '100%',
              border: `4px solid ${theme.palette.secondary.light}`,
              borderRadius: '16px',
              top: 15,
              left: 15,
              zIndex: -1
            }
          }}>
            <CardMedia
              component="img"
              image="https://res.cloudinary.com/db8kwduja/image/upload/c_scale,w_400/v1746823214/IMG_1993_rfgwxq.png"
              alt="Our Message"
              sx={{
                borderRadius: '12px',
                boxShadow: '0 15px 30px rgba(0,0,0,0.12)',
                transform: 'rotate(-3deg)',
                transition: 'transform 0.3s ease',
                width: '90%',
                height: 'auto',
                '&:hover': {
                  transform: 'rotate(-1deg) scale(1.02)'
                }
              }}
            />
          </Box>
          <Box sx={{
            position: 'absolute',
            bottom: -15,
            right: -15,
            backgroundColor: 'rgba(239, 24, 103, 0.99)',
            color: 'white',
            borderRadius: '50%',
            width: 70,
            height: 70,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
            fontSize: '0.9rem'
          }}>
            සිංහල
          </Box>
        </motion.div>
      </Grid>

      {/* Content Section - Right Column */}
      <Grid item xs={12} md={6} sx={{
        order: { xs: 1, md: 2 },
        display: 'flex',
        justifyContent: { xs: 'center', md: 'flex-start' }
      }}>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ width: '100%', maxWidth: '700px' }}
        >
          <Box sx={{
            backgroundColor: 'rgba(255,255,255,0.9)',
            borderRadius: '12px',
            p: { xs: 3, md: 4 },
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.14)',
            width: '100%'
          }}>
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                fontFamily: '"Yaldevi", "Noto Sans Sinhala", sans-serif',
                fontWeight: 'bold',
                color: 'rgba(239, 23, 66, 0.97)',
                mb: 3,
                lineHeight: 1.3,
                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }
              }}
            >
              අපි ගැන <Box component="span" sx={{ color: 'rgb(129, 27, 112)' }}>බිදක්..</Box>
            </Typography>

            <Box sx={{
              mb: 4,
              '& p': {
                fontSize: '1.1rem',
                lineHeight: '1.8',
                mb: 3,
                position: 'relative',
                pl: 3,
                '&:before': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: '0.5em',
                  height: '8px',
                  width: '8px',
                  backgroundColor: theme.palette.secondary.main,
                  borderRadius: '50%'
                }
              }
            }}>
          <Typography variant="body1" sx={{
            fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
            fontSize: '0.95rem',
            textAlign: 'justify',
            mb: 3,
            lineHeight: 1.6
          }}>
            "අයන්න කියන්න" යනු ශ්‍රී ලාංකික සංස්කෘතිය, භාෂාව හා සාහිත්‍යය සම්බන්ධයෙන් ගැඹුරු හා සවිස්තරාත්මක දැනුම ලබා දෙන ප්‍රමුඛතම අන්තර්ජාල ප්‍රකාශනයක් බවට පත්වීම අපගේ අරමුණයි. අපි අපගේ පාඨකයන්ට සිංහල භාෂාවේ සියලු අංශ පිළිබඳව නිවැරදි, අධ්‍යයනය කළ ප්‍රතිඵල සහ ගවේෂණාත්මක ලිපි සැපයීමට කටයුතු කරමු.
          </Typography>

          <Typography variant="body1" sx={{
            fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
            fontSize: '0.95rem',
            textAlign: 'justify',
            mb: 3,
            lineHeight: 1.6
          }}>
            සිංහල භාෂාව, සාහිත්‍යය, ව්‍යාකරණය, කාව්‍ය ශාස්ත්‍රය, නාට්‍ය කලාව සහ සංස්කෘතික උරුමය පිළිබඳ සියලු තොරතුරු එකම ස්ථානයකින් ලබා ගත හැකි වන පරිදි අපි අපගේ අන්තර්ජාල වේදිකාව සකස් කර ඇත. විශේෂයෙන් අධ්‍යාපනික අවශ්‍යතා සඳහා වන විෂය නිර්දේශ ආශ්‍රිත ගැඹුරු විශ්ලේෂණ, පාඩම් උපකරණ සහ උදාහරණ සහිත පැහැදිලි කිරීම් අපගේ වෙබ් අඩවියේ විශේෂ ලක්ෂණයකි.
          </Typography>

          <Typography variant="body1" sx={{
            fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
            fontSize: '0.95rem',
            textAlign: 'justify',
            mb: 3,
            lineHeight: 1.6
          }}>
            අපගේ අධ්‍යාපනික ප්‍රවේශය හරහා සිසුන්ට ශ්‍රී ලංකාවේ සමෘද්ධ සංස්කෘතික උරුමය පිළිබඳ ගෞරවාදර ඇති කරගැනීමටත්, නවීන ලෝකයට අනුගත වන අතරම ජාතික අනන්‍යතාවය රැකගැනීමටත් අපි උපකාරී වෙමු. අපගේ විශේෂඥ ගුරු මඩුල්ල විසින් සකස් කරන ලද නිර්මාණශීලී ඉගැන්වීම් ක්‍රම මගින් සිසුන්ගේ භාෂා දක්ෂතා, විවේචනාත්මක චින්තනය හා නිර්මාණශීලිත්වය වර්ධනය කිරීම අපගේ ප්‍රමුඛ ඉලක්කයයි.
          </Typography>

            </Box>

            <Box sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              '& .MuiButton-root': {
                width: { xs: '100%', sm: 'auto' }
              }
            }}>
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowRight />}
                sx={{
                  fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                  color: 'rgb(255, 255, 255)',
                  backgroundColor: 'rgba(239, 23, 66, 0.97)',
                  borderRadius: '50px',
                  px: 4,
                  fontWeight: 'bold',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 16px rgba(0,0,0,0.15)'
                  }
                }}
              >
                තවත් කියවන්න
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                size="large"
                sx={{
                  fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                  borderRadius: '50px',
                  px: 4,
                  fontWeight: 'bold',
                  borderWidth: '2px',
                  '&:hover': {
                    borderWidth: '2px',
                    backgroundColor: 'rgba(0,0,0,0.02)'
                  }
                }}
              >
                අප හා සම්බන්ධ වන්න
              </Button>
            </Box>
          </Box>
        </motion.div>
      </Grid>
    </Grid>
  </Container>
</Box>

{/* About Teacher Section - Text Focused Design */}
<Box sx={{
  py: 10,
  background: 'linear-gradient(135deg, #f9fafe 0%, #e6ecf8 100%)',
  position: 'relative',
  overflow: 'hidden',
  '&:before': {
    content: '""',
    position: 'absolute',
    top: -100,
    right: -100,
    width: 400,
    height: 400,
    background: 'radial-gradient(circle, rgba(106,17,203,0.08) 0%, transparent 70%)',
    zIndex: 0
  }
}}>
  <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
    {/* Section Header with Decorative Elements */}
    <Box sx={{ textAlign: 'center', mb: 8, position: 'relative' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography
          variant="h3"
          component="h2"
          sx={{
            fontFamily: '"Yaldevi", "Noto Sans Sinhala", "Gemunu Libre", sans-serif',
            display: 'inline-block',
            fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
            fontWeight: 800,
            color: 'rgb(129, 27, 112)',
            position: 'relative',
            '&:after': {
              content: '""',
              position: 'absolute',
              bottom: -15,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 80,
              height: 4,
              background: `linear-gradient(90deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
              borderRadius: 2
            }
          }}
        >
          ✒️ගුරුවරයා පිළිබදව
        </Typography>
      </motion.div>
    </Box>

    {/* Teacher Content */}
    <Grid container spacing={6} justifyContent="center">
      <Grid item xs={12} md={10} lg={8}>
        <Box sx={{
          backgroundColor: 'rgba(255,255,255,0.95)',
          borderRadius: 4,
          p: { xs: 3, md: 5 },
          boxShadow: '0 15px 40px rgba(0,0,0,0.08)',
          borderLeft: `6px solid ${theme.palette.secondary.main}`,
          position: 'relative',
          overflow: 'hidden',
          '&:before': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            width: 120,
            height: 120,
            background: `linear-gradient(45deg, transparent, ${theme.palette.primary.light} 100%)`,
            opacity: 0.1,
            borderRadius: '0 0 0 100%'
          }
        }}>
          {/* Teacher Name with Decorative Element */}
          <Box sx={{ mb: 3, position: 'relative' }}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontFamily: '"Yaldevi", "Noto Sans Sinhala", sans-serif',
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 2
                }}
              >
                <School sx={{
                  fontSize: 40,
                  color: theme.palette.secondary.main
                }} />
                ජගත් කුමාර ජයසිංහ
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  fontFamily: '"Noto Sans Sinhala", "Gemunu Libre", sans-serif',
                  mt: 1,
                  color: theme.palette.secondary.dark,
                  fontStyle: 'italic',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <Star sx={{ fontSize: '1rem', color: theme.palette.warning.main }} />
                ප්‍රවීණ සිංහල දේශක හා ලේඛක
              </Typography>
            </motion.div>
          </Box>

          {/* Teacher Description with Animated Bullet Points */}
          <Box sx={{ mb: 4 }}>
            {[
              "සිංහල සංස්කෘතික ක්ෂේත්‍රයේ ප්‍රවීණ ගුරුවරයෙක් වන අතර ඔහුගේ අත්දැකීම් වසර 25කට අධික කාලයක් පුරා විහිදෙයි.",
              "ජාතික හා ජාත්‍යන්තර මට්ටමින් සිංහල සංස්කෘතිය නියෝජනය කර ඇත.",
              "සාම්ප්‍රදායික ක්‍රම හා නවීන අධ්‍යාපන ක්‍රම අතර සුන්දර සම්බන්ධතාවක් ගොඩනගා ඇත.",
              "සිසුන් සඳහා නවෝත්පාදනාත්මක ඉගැන්වීම් ක්‍රම භාවිතයෙන් සංස්කෘතික අධ්‍යාපනය ප්‍රගුණ කිරීම."
            ].map((point, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Box sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  mb: 2,
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: index % 2 === 0 ? 'rgba(106, 17, 203, 0.03)' : 'transparent',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(106, 17, 203, 0.05)',
                    transform: 'translateX(5px)'
                  }
                }}>
                  <Box sx={{
                    minWidth: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2,
                    mt: '2px'
                  }}>
                    <Check sx={{ fontSize: 16, color: 'white' }} />
                  </Box>
                  <Typography variant="body1" sx={{
                    fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
                    fontSize: '0.95rem',
                    lineHeight: 1.6,
                    color: theme.palette.text.secondary
                  }}>
                    {point}
                  </Typography>
                </Box>
              </motion.div>
            ))}
          </Box>

          {/* Action Buttons */}
          <Box sx={{
            display: 'flex',
            gap: 2,
            mt: 4,
            flexWrap: 'wrap',
            '& .MuiButton-root': {
              borderRadius: '50px',
              px: 4,
              py: 1.5,
              fontWeight: 700,
              fontSize: '1rem',
              transition: 'all 0.3s ease'
            }
          }}>
            <Button
              variant="contained"
              startIcon={<School />}
              sx={{
                fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                backgroundColor: 'rgb(203, 17, 144)',
                boxShadow: '0 4px 15px rgba(106, 17, 203, 0.3)',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: '0 6px 20px rgba(106, 17, 203, 0.4)'
                }
              }}
            >
              ගුරුතුමා පිළිබදව
            </Button>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<MenuBook />}
              sx={{
                fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                borderColor: 'rgba(107, 17, 203, 0.69)',
                color: 'rgba(107, 17, 203, 0.88)',
                borderWidth: 2,
                '&:hover': {
                  backgroundColor: 'rgba(106, 17, 203, 0.05)',
                  borderWidth: 2
                }
              }}
            >
              ගුරුතුමාගේ කෘති
            </Button>
          </Box>
        </Box>
      </Grid>
    </Grid>
  </Container>
</Box>

{/* Testimonials Section - Enhanced */}
<Box sx={{
  py: 10,
  background: 'linear-gradient(135deg, #f5f7fa 0%, #f0f4f8 100%)',
  position: 'relative',
  overflow: 'hidden',
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'url(/path/to/subtle-pattern.png)',
    opacity: 0.05,
    zIndex: 0
  }
}}>
  <Container sx={{ position: 'relative', zIndex: 1 }}>
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <Typography
        variant="h3"
        component="h2"
        gutterBottom
        sx={{
          fontFamily: '"Yaldevi", "Noto Sans Sinhala", "Gemunu Libre", sans-serif',
          textAlign: 'center',
          fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
          mb: 8,
          color: 'rgb(129, 27, 112)',
          fontWeight: 'bold',
          position: 'relative',
          '&:after': {
            content: '""',
            display: 'block',
            width: '80px',
            height: '5px',
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            margin: '24px auto 0',
            borderRadius: '5px'
          }
        }}
      >
        අප ගැන අදහස් 💭
      </Typography>
    </motion.div>

    <Grid container spacing={4} sx={{
      justifyContent: 'center',
      '& .MuiGrid-item': {
        display: 'flex',
        justifyContent: 'center'
      }
    }}>
      {testimonials.map((testimonial, index) => (
        <Grid item xs={12} sm={6} md={4} key={index} sx={{
          display: 'flex'
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{
              duration: 0.6,
              delay: index * 0.15,
              type: 'spring',
              stiffness: 100
            }}
            style={{ width: '100%', maxWidth: '380px' }}
          >
            <Card sx={{
              height: '100%',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
              transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              background: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.3)',
              '&:hover': {
                transform: 'translateY(-8px) scale(1.02)',
                boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
              }
            }}>
              <CardContent sx={{
                flexGrow: 1,
                textAlign: 'center',
                px: 3,
                py: 4,
                position: 'relative',
                '&:before': {
                  content: '"“"',
                  position: 'absolute',
                  top: 20,
                  left: 20,
                  fontSize: '5rem',
                  color: theme.palette.primary.light,
                  opacity: 0.2,
                  fontFamily: 'serif',
                  lineHeight: 1
                }
              }}>
                <Box sx={{
                  position: 'relative',
                  zIndex: 1
                }}>
                  <Avatar
                    alt={testimonial.name}
                    src={testimonial.avatar}
                    sx={{
                      width: 90,
                      height: 90,
                      margin: '0 auto 24px',
                      border: `4px solid ${theme.palette.primary.main}`,
                      boxShadow: `0 4px 12px ${theme.palette.primary.light}`,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.1)'
                      }
                    }}
                  />
                  <Typography
                    variant="body1"
                    paragraph
                    sx={{
                      fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
                      fontStyle: 'italic',
                      mb: 3,
                      fontSize: '1.1rem',
                      lineHeight: 1.7,
                      position: 'relative',
                      '&:after': {
                        content: '"”"',
                        position: 'absolute',
                        bottom: -30,
                        right: 10,
                        fontSize: '5rem',
                        color: theme.palette.primary.light,
                        opacity: 0.2,
                        fontFamily: 'serif',
                        lineHeight: 1
                      }
                    }}
                  >
                    {testimonial.content}
                  </Typography>
                </Box>
              </CardContent>
              <Box sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                padding: 2.5,
                textAlign: 'center',
                borderBottomLeftRadius: '16px',
                borderBottomRightRadius: '16px',
                color: 'white'
              }}>
                <Typography variant="h6" component="h3" sx={{
                  fontFamily: '"Yaldevi", "Noto Sans Sinhala", sans-serif',
                  fontWeight: 'bold',
                  mb: 0.5
                }}>
                  {testimonial.name}
                </Typography>
                <Typography variant="subtitle2" sx={{
                  fontFamily: '"Noto Sans Sinhala", "Gemunu Libre", sans-serif',
                  opacity: 0.9,
                  fontSize: '0.85rem'
                }}>
                  {testimonial.role}
                </Typography>
              </Box>
            </Card>
          </motion.div>
        </Grid>
      ))}
    </Grid>

    {/* Decorative elements */}
    <Box sx={{
      position: 'absolute',
      top: '10%',
      left: '5%',
      width: '100px',
      height: '100px',
      borderRadius: '50%',
      background: `radial-gradient(circle, ${theme.palette.primary.light} 0%, rgba(0,0,0,0) 70%)`,
      opacity: 0.3,
      zIndex: 0
    }} />
    <Box sx={{
      position: 'absolute',
      bottom: '15%',
      right: '8%',
      width: '150px',
      height: '150px',
      borderRadius: '50%',
      background: `radial-gradient(circle, ${theme.palette.secondary.light} 0%, rgba(0,0,0,0) 70%)`,
      opacity: 0.3,
      zIndex: 0
    }} />
  </Container>
</Box>

{/* Contact Section */}
<Box sx={{
  py: 8,
  background: 'linear-gradient(135deg, #6a11cb 0%,rgb(252, 37, 166) 100%)',
  color: 'white',
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  minHeight: '100vh',
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
    zIndex: 0
  }
}}>
  <Container maxWidth="lg" sx={{
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }}>
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      style={{ width: '100%' }}
    >
      <Typography
        variant="h3"
        component="h2"
        gutterBottom
        sx={{
          fontFamily: '"Yaldevi", "Noto Sans Sinhala", "Gemunu Libre", sans-serif',
          textAlign: 'center',
          mb: 6,
          fontWeight: 'bold',
          position: 'relative',
          textShadow: '0 2px 10px rgba(0,0,0,0.2)',
          '&:after': {
            content: '""',
            display: 'block',
            width: '100px',
            height: '4px',
            background: 'white',
            margin: '20px auto 0',
            borderRadius: '2px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
          }
        }}
      >
        අප අමතන්න
      </Typography>
    </motion.div>

    <Grid container spacing={4} sx={{
      justifyContent: 'center',
      alignItems: 'stretch',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <Grid item xs={12} md={5}>
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ height: '100%' }}
        >
          <Box sx={{
            backgroundColor: 'rgba(255,255,255,0.1)',
            padding: 4,
            borderRadius: '16px',
            height: '100%',
            minHeight: '500px',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.2)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            display: 'flex',
            flexDirection: 'column',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 12px 40px rgba(0,0,0,0.3)'
            }
          }}>
            {/* Contact Info Box Content - Same as before */}
            <Typography variant="h5" component="h3" gutterBottom sx={{
              fontFamily: '"Yaldevi", "Noto Sans Sinhala", sans-serif',
              fontWeight: 'bold',
              mb: 4,
              display: 'flex',
              alignItems: 'center',
              '&:before': {
                content: '""',
                display: 'inline-block',
                width: '30px',
                height: '3px',
                background: 'white',
                marginRight: '16px',
                borderRadius: '2px'
              }
            }}>
              අපගේ ලිපිනය
            </Typography>
            <Box sx={{ mb: 3, flex: 1 }}>
              <Box display="flex" alignItems="flex-start" mb={3}>
                <LocationOn sx={{
                  mr: 2,
                  fontSize: '2rem',
                  background: 'rgba(255,255,255,0.2)',
                  p: 1,
                  borderRadius: '50%',
                  minWidth: '48px',
                  minHeight: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }} />
                <Box>
                  <Typography variant="subtitle1" sx={{
                    fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                    fontWeight: 'bold'
                  }}>
                    ලිපිනය
                  </Typography>
                  <Typography variant="body1" sx={{
                    fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
                  }}>
                    123 සංස්කෘතික වීථිය, කොළඹ 07, ශ්‍රී ලංකාව
                  </Typography>
                </Box>
              </Box>
              <Box display="flex" alignItems="flex-start" mb={3}>
                <Phone sx={{
                  mr: 2,
                  fontSize: '2rem',
                  background: 'rgba(255,255,255,0.2)',
                  p: 1,
                  borderRadius: '50%',
                  minWidth: '48px',
                  minHeight: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }} />
                <Box>
                  <Typography variant="subtitle1" sx={{
                    fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                    fontWeight: 'bold'
                  }}>
                    දුරකථන
                  </Typography>
                  <Typography variant="body1">
                    +94 112 345 678
                  </Typography>
                </Box>
              </Box>
              <Box display="flex" alignItems="flex-start">
                <Email sx={{
                  mr: 2,
                  fontSize: '2rem',
                  background: 'rgba(255,255,255,0.2)',
                  p: 1,
                  borderRadius: '50%',
                  minWidth: '48px',
                  minHeight: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }} />
                <Box>
                  <Typography variant="subtitle1" sx={{
                    fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                    fontWeight: 'bold'
                  }}>
                    ඊමේල්
                  </Typography>
                  <Typography variant="body1">
                    info@ayannakiyanna.lk
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box sx={{ mt: 'auto' }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.798511757686!2d79.8588464153939!3d6.921657495003654!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2596b2f0b1e0d%3A0x2d5a4a3e6f6b1b1a!2sColombo%2C%20Sri%20Lanka!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"
                width="100%"
                height="250"
                style={{
                  border: 0,
                  borderRadius: '12px',
                  filter: 'sepia(30%) hue-rotate(190deg) saturate(120%)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
                }}
                allowFullScreen=""
                loading="lazy"
                title="Google Map"
              ></iframe>
            </Box>
          </Box>
        </motion.div>
      </Grid>

      <Grid item xs={12} md={5}>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ height: '100%' }}
        >
          <Box sx={{
            backgroundColor: 'rgba(255,255,255,0.1)',
            padding: 4,
            borderRadius: '16px',
            height: '100%',
            minHeight: '500px',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.2)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            display: 'flex',
            flexDirection: 'column',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 12px 40px rgba(0,0,0,0.3)'
            }
          }}>
            {/* Contact Form Box Content - Same as before */}
            <Typography variant="h5" component="h3" gutterBottom sx={{
              fontFamily: '"Yaldevi", "Noto Sans Sinhala", sans-serif',
              fontWeight: 'bold',
              mb: 4,
              display: 'flex',
              alignItems: 'center',
              '&:before': {
                content: '""',
                display: 'inline-block',
                width: '30px',
                height: '3px',
                background: 'white',
                marginRight: '16px',
                borderRadius: '2px'
              }
            }}>
              පණිවුඩයක් යවන්න
            </Typography>
            <Box component="form" sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
              flex: 1
            }}>
              <Box>
                <Typography variant="subtitle1" sx={{
                  fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                  mb: 1,
                  fontWeight: 'bold'
                }}>ඔබගේ නම</Typography>
                <TextField
                  fullWidth
                  placeholder="ඔබගේ නම"
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      '& fieldset': {
                        borderColor: 'rgba(255,255,255,0.3)'
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255,255,255,0.5)'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'white'
                      }
                    },
                    '& .MuiInputBase-input': {
                      color: 'white',
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255,255,255,0.7)'
                    }
                  }}
                />
              </Box>
              <Box>
                <Typography variant="subtitle1" sx={{
                  fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                  mb: 1,
                  fontWeight: 'bold'
                }}>ඔබගේ ඊමේල් ලිපිනය</Typography>
                <TextField
                  fullWidth
                  placeholder="ඔබගේ ඊමේල් ලිපිනය"
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      '& fieldset': {
                        borderColor: 'rgba(255,255,255,0.3)'
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255,255,255,0.5)'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'white'
                      }
                    },
                    '& .MuiInputBase-input': {
                      color: 'white',
                    }
                  }}
                />
              </Box>
              <Box>
                <Typography variant="subtitle1" sx={{
                  fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                  mb: 1,
                  fontWeight: 'bold'
                }}>පණිවුඩය</Typography>
                <TextField
                  fullWidth
                  placeholder="ඔබගේ පණිවුඩය"
                  variant="outlined"
                  multiline
                  rows={4}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      '& fieldset': {
                        borderColor: 'rgba(255,255,255,0.3)'
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255,255,255,0.5)'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'white'
                      }
                    },
                    '& .MuiInputBase-input': {
                      color: 'white',
                    }
                  }}
                />
              </Box>
              <Box sx={{ mt: 'auto', textAlign: 'right' }}>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    endIcon={<ArrowRight />}
                    sx={{
                      fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                      borderRadius: '50px',
                      px: 4,
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      textTransform: 'none',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                      '&:hover': {
                        boxShadow: '0 6px 20px rgba(0,0,0,0.3)'
                      }
                    }}
                  >
                    පණිවුඩය යවන්න
                  </Button>
                </motion.div>
              </Box>
            </Box>
          </Box>
        </motion.div>
      </Grid>
    </Grid>
  </Container>
</Box>

{/* Footer */}
<Box sx={{
  py: 6,
  backgroundColor: theme.palette.grey[900],
  color: 'white',
  borderTop: `4px solid ${theme.palette.primary.main}`,
  position: 'relative'
}}>
  <Container>
    <Grid container spacing={4} alignItems="flex-start">
      {/* Logo & Description Column */}
      <Grid item xs={12} md={6} lg={5}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{
            mb: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: { xs: 'center', md: 'flex-start' }
          }}>
            <img
              src={logo}
              alt="Ayanna Kiyanna Logo"
              style={{
                height: '70px',
                objectFit: 'contain',
                marginBottom: '16px'
              }}
            />
            <Typography variant="body1" sx={{
              fontFamily: '"Noto Serif Sinhala", "Abhaya Libre", serif',
              mb: 2,
              fontStyle: 'italic',
              color: theme.palette.grey[300],
              textAlign: { xs: 'center', md: 'left' }
            }}>
              "ලෝභ නැතුව සතර බෙදන, අසිරිමත් බුද්ධි මෙහෙවර"
            </Typography>
            <Typography variant="body2" sx={{
              fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
              color: theme.palette.grey[400],
              textAlign: { xs: 'center', md: 'left' },
              lineHeight: 1.6
            }}>
              අයන්න කියන්න සිංහල ආයතනය ලෙස අපගේ අරමුණ වන්නේ සිංහල සංස්කෘතියේ සුන්දරත්වය හා ගැඹුර අනාගත පරපුරට රැකගැනීමයි.
            </Typography>
          </Box>
        </motion.div>
      </Grid>

      {/* Contact Column */}
      <Grid item xs={12} md={6} lg={4}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Typography variant="h6" component="h3" sx={{
            fontFamily: '"Yaldevi", "Noto Sans Sinhala", sans-serif',
            fontWeight: 'bold',
            mb: 3,
            textAlign: { xs: 'center', md: 'left' }
          }}>
            සම්බන්ධ වන්න
          </Typography>

          <Box sx={{ mb: 3 }}>
            {[
              { icon: <LocationOn sx={{ color: theme.palette.primary.main }} />, text: '123 සංස්කෘතික වීථිය, කොළඹ 07, ශ්‍රී ලංකාව' },
              { icon: <Phone sx={{ color: theme.palette.primary.main }} />, text: '+94 112 345 678' },
              { icon: <Email sx={{ color: theme.palette.primary.main }} />, text: 'info@ayannakiyanna.lk' }
            ].map((item, index) => (
              <Box key={index} display="flex" alignItems="flex-start" mb={2}>
                <Box sx={{ mr: 2, mt: '2px' }}>
                  {item.icon}
                </Box>
                <Typography variant="body2" sx={{
                  fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
                  color: theme.palette.grey[300],
                  lineHeight: 1.6
                }}>
                  {item.text}
                </Typography>
              </Box>
            ))}
          </Box>
        </motion.div>
      </Grid>

    </Grid>

    {/* Social Media & Copyright Section */}
    <Box sx={{
      mt: 6,
      pt: 4,
      borderTop: `1px solid ${theme.palette.grey[800]}`,
      display: 'flex',
      flexDirection: { xs: 'column', sm: 'row' },
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 3
    }}>
      {/* Social Media Icons */}
      <Box sx={{
        display: 'flex',
        gap: 1,
        order: { xs: 2, sm: 1 }
      }}>
        {[
          { icon: 'https://cdn-icons-png.flaticon.com/512/124/124010.png', name: 'Facebook' },
          { icon: 'https://cdn-icons-png.flaticon.com/512/2111/2111463.png', name: 'Instagram' },
          { icon: 'https://cdn-icons-png.flaticon.com/512/174/174857.png', name: 'LinkedIn' },
          { icon: 'https://cdn-icons-png.flaticon.com/512/1384/1384060.png', name: 'YouTube' }
        ].map((social, index) => (
          <IconButton
            key={index}
            sx={{
              backgroundColor: theme.palette.grey[800],
              borderRadius: '8px',
              transition: 'all 0.3s ease',
              p: 1,
              '&:hover': {
                backgroundColor: theme.palette.primary.main
              }
            }}
          >
            <Box
              component="img"
              src={social.icon}
              alt={social.name}
              sx={{
                width: '20px',
                height: '20px',
                filter: 'brightness(0) invert(1)'
              }}
            />
          </IconButton>
        ))}
      </Box>

      {/* Copyright */}
      <Typography variant="body2" sx={{
        fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
        color: theme.palette.grey[400],
        textAlign: 'center',
        order: { xs: 1, sm: 2 }
      }}>
        © {new Date().getFullYear()} අයන්න කියන්න සිංහල ආයතනය. සියලුම හිමිකම් ඇවිරිණි.
      </Typography>
    </Box>
  </Container>
</Box>

{/* Go to Top Button */}
{isVisible && (
  <motion.div
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.5 }}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    style={{
      position: 'fixed',
      bottom: '30px',
      right: '30px',
      zIndex: 1000
    }}
  >
    <IconButton
      onClick={scrollToTop}
      sx={{
        backgroundColor: 'rgba(107, 17, 203, 0.61)',
        color: 'white',
        width: '60px',
        height: '60px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        '&:hover': {
          backgroundColor: 'rgba(106, 17, 203, 1)',
          transform: 'translateY(-3px)'
        },
        transition: 'all 0.3s ease'
      }}
    >
      <KeyboardArrowUp sx={{ fontSize: '2rem' }} />
    </IconButton>
  </motion.div>
)}
    </Box>
  );
};

export default Home;