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
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminPasswordDialog from '../components/AdminPasswordDialog';
import StudentRegistrationDialog from '../components/StudentRegistrationDialog';
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
  const [userRole, setUserRole] = useState(null);
  const [showAdminDialog, setShowAdminDialog] = useState(false);
  const [showStudentDialog, setShowStudentDialog] = useState(false);
  const navigate = useNavigate();

  // Enhanced mobile scrolling fix - comprehensive solution
  useEffect(() => {
    // Detect mobile devices more accurately
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                          (window.innerWidth <= 768 && 'ontouchstart' in window);

    if (isMobileDevice) {
      // Create comprehensive CSS for mobile scrolling fix
      const style = document.createElement('style');
      style.id = 'mobile-scroll-fix';
      style.textContent = `
        /* Root level scrolling fixes */
        html {
          overflow-x: hidden !important;
          overflow-y: auto !important;
          -webkit-overflow-scrolling: touch !important;
          touch-action: pan-y !important;
          height: 100% !important;
          position: relative !important;
          scroll-behavior: smooth !important;
        }

        body {
          overflow-x: hidden !important;
          overflow-y: auto !important;
          -webkit-overflow-scrolling: touch !important;
          touch-action: pan-y !important;
          height: auto !important;
          min-height: 100% !important;
          position: relative !important;
          margin: 0 !important;
          padding: 0 !important;
        }

        /* Fix for iOS Safari viewport issues */
        @supports (-webkit-touch-callout: none) {
          html {
            height: -webkit-fill-available !important;
          }
          body {
            min-height: -webkit-fill-available !important;
          }
        }

        /* Complete overflow hidden strategy for mobile scrolling */
        .MuiContainer-root {
          overflow: hidden !important;
          -webkit-overflow-scrolling: auto !important;
        }

        /* Apply overflow hidden to all Material-UI components */
        .MuiBox-root {
          overflow: hidden !important;
        }

        /* Force overflow hidden on all elements except body */
        * {
          overflow: hidden !important;
          -webkit-overflow-scrolling: touch !important;
          scroll-behavior: smooth !important;
        }

        /* Only body should be scrollable */
        body {
          overflow-x: hidden !important;
          overflow-y: auto !important;
          -webkit-overflow-scrolling: touch !important;
        }

        html {
          overflow-x: hidden !important;
          overflow-y: auto !important;
        }

        /* Fix for fixed positioned elements */
        [style*="position: fixed"] {
          -webkit-transform: translateZ(0) !important;
          transform: translateZ(0) !important;
        }

        /* Prevent content jumping during scroll */
        .motion-safe {
          will-change: auto !important;
          transform: translateZ(0) !important;
        }

        /* Ensure all sections have overflow hidden */
        section, div, .MuiPaper-root {
          overflow: hidden !important;
        }

        /* Exception for logo container - allow shadow to show */
        .logo-container, .logo-container * {
          overflow: visible !important;
        }
      `;

      // Remove existing style if present
      const existingStyle = document.getElementById('mobile-scroll-fix');
      if (existingStyle) {
        existingStyle.remove();
      }

      // Add new style
      document.head.appendChild(style);

      // Apply body styles directly
      const bodyStyles = {
        overflowX: 'hidden',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        touchAction: 'pan-y',
        height: 'auto',
        minHeight: '100%',
        position: 'relative',
        margin: '0',
        padding: '0'
      };

      // Store original styles for cleanup
      const originalStyles = {};
      Object.keys(bodyStyles).forEach(key => {
        originalStyles[key] = document.body.style[key];
        document.body.style[key] = bodyStyles[key];
      });

      // Apply html styles
      const htmlStyles = {
        overflowX: 'hidden',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        touchAction: 'pan-y',
        height: '100%',
        position: 'relative',
        scrollBehavior: 'smooth'
      };

      const originalHtmlStyles = {};
      Object.keys(htmlStyles).forEach(key => {
        originalHtmlStyles[key] = document.documentElement.style[key];
        document.documentElement.style[key] = htmlStyles[key];
      });

      // Cleanup function
      return () => {
        // Remove injected styles
        const styleElement = document.getElementById('mobile-scroll-fix');
        if (styleElement) {
          styleElement.remove();
        }

        // Restore original body styles
        Object.keys(originalStyles).forEach(key => {
          document.body.style[key] = originalStyles[key];
        });

        // Restore original html styles
        Object.keys(originalHtmlStyles).forEach(key => {
          document.documentElement.style[key] = originalHtmlStyles[key];
        });
      };
    }
  }, []);

  // Ensure page starts at top and optimize mobile scrolling
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);

    // Also ensure body scroll position is reset
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;

    // Comprehensive mobile scroll optimization
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                          (window.innerWidth <= 768 && 'ontouchstart' in window);

    if (isMobileDevice) {
      // Disable momentum scrolling on problematic elements
      const motionElements = document.querySelectorAll('[data-framer-motion], .motion-safe');
      motionElements.forEach(element => {
        element.style.WebkitOverflowScrolling = 'auto';
        element.style.willChange = 'auto';
        element.style.transform = 'translateZ(0)';
        element.style.backfaceVisibility = 'hidden';
      });

      // Fix for content jumping during scroll
      const allBoxElements = document.querySelectorAll('.MuiBox-root');
      allBoxElements.forEach(element => {
        element.style.willChange = 'auto';
        element.style.transform = 'translateZ(0)';
      });

      // Optimize scroll performance with throttling
      let ticking = false;
      let lastScrollY = window.scrollY;

      const updateScrollPosition = () => {
        const currentScrollY = window.scrollY;

        // Only update if scroll position actually changed
        if (Math.abs(currentScrollY - lastScrollY) > 1) {
          lastScrollY = currentScrollY;

          // Force repaint to prevent content jumping
          document.body.style.transform = 'translateZ(0)';
          requestAnimationFrame(() => {
            document.body.style.transform = '';
          });
        }

        ticking = false;
      };

      const requestScrollUpdate = () => {
        if (!ticking) {
          requestAnimationFrame(updateScrollPosition);
          ticking = true;
        }
      };

      // Use passive listeners for better performance
      window.addEventListener('scroll', requestScrollUpdate, { passive: true });
      window.addEventListener('touchmove', requestScrollUpdate, { passive: true });

      return () => {
        window.removeEventListener('scroll', requestScrollUpdate);
        window.removeEventListener('touchmove', requestScrollUpdate);
      };
    }
  }, []);

  useEffect(() => {
    // Check if user email exists in local storage
    const email = localStorage.getItem('userEmail');
    if (email) {
      setUserEmail(email);
      fetchUserRole();
    }
  }, []);

  const fetchUserRole = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await axios.get('https://ayanna-kiyanna-new-backend.onrender.com/api/auth/me', {
          headers: {
            'x-auth-token': token
          }
        });
        setUserRole(response.data.role);
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
    }
  };

  const handleDashboardClick = async () => {
    if (!userEmail) {
      // User not logged in, redirect to login
      navigate('/login');
      return;
    }

    try {
      // Check user role from database
      const token = localStorage.getItem('token');
      const response = await axios.get('https://ayanna-kiyanna-new-backend.onrender.com/api/auth/me', {
        headers: { 'x-auth-token': token }
      });

      const currentUserRole = response.data.role;

      // Check user role and navigate accordingly
      if (currentUserRole === 'student') {
        navigate('/student-dashboard');
      } else if (currentUserRole === 'user') {
        // Show student registration dialog for regular users
        setShowStudentDialog(true);
      } else if (currentUserRole === 'admin' || currentUserRole === 'moderator') {
        // Show admin password dialog
        setShowAdminDialog(true);
      } else {
        // Default to student registration dialog for unknown roles
        setShowStudentDialog(true);
      }
    } catch (error) {
      console.error('Error checking user role:', error);
      if (error.response?.status === 401) {
        alert('Your session has expired. Please login again.');
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userRole');
        navigate('/login');
      } else {
        alert('Failed to verify user permissions. Please try again.');
      }
    }
  };

  const handleAdminPasswordSuccess = () => {
    navigate('/admin-dashboard');
  };

  const handleStudentRegistrationClick = async () => {
    if (!userEmail) {
      // User not logged in, show message
      alert('Please login first to register as a student');
      navigate('/login');
      return;
    }

    try {
      // Check user role from database
      const token = localStorage.getItem('token');
      const response = await axios.get('https://ayanna-kiyanna-new-backend.onrender.com/api/auth/me', {
        headers: { 'x-auth-token': token }
      });

      const currentUserRole = response.data.role;

      if (currentUserRole === 'student') {
        // Already a student
        alert('You are already registered as a student. Use your personal student dashboard. Good Luck!');
        return;
      }

      if (!['user', 'admin', 'moderator'].includes(currentUserRole)) {
        alert('Only users with appropriate roles can register as students');
        return;
      }

      // Navigate to student registration form
      navigate('/student-registration');
    } catch (error) {
      console.error('Error checking user role:', error);
      if (error.response?.status === 401) {
        alert('Your session has expired. Please login again.');
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userRole');
        navigate('/login');
      } else {
        alert('Failed to verify user permissions. Please try again.');
      }
    }
  };

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
    <Box
      sx={{
        width: '100%',
        height: 'auto',
        minHeight: '100vh',
        position: 'relative',
        // Apply overflow hidden to main container
        overflow: 'hidden',
        paddingTop: 0,
        marginTop: 0,
        // Optimize for mobile scrolling
        WebkitOverflowScrolling: 'touch',
        touchAction: 'pan-y'
      }}>
{/* Welcome Section with Enhanced Animated Background */}
<Box
  sx={{
    background: 'linear-gradient(135deg, #6a11cb 0%, #ff6b9d 50%, #ff8e53 100%)',
    color: 'white',
    py: { xs: 8, sm: 10, md: 12 },
    position: 'relative',
    overflow: 'hidden', // Apply overflow hidden
    minHeight: { xs: '100vh', sm: '100vh' },
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingTop: { xs: '60px', sm: '80px' },
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
  {/* Optimized Floating Particle System */}
  {[...Array(12)].map((_, i) => {
    const colors = [
      'rgba(255,107,157,0.4)',
      'rgba(255,142,83,0.4)',
      'rgba(255,235,59,0.4)',
      'rgba(106,17,203,0.3)'
    ];

    return (
      <motion.div
        key={`particle-${i}`}
        animate={{
          y: [-20, 20, -20],
          x: [-15, 15, -15],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 8 + i * 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: i * 0.5
        }}
        style={{
          position: 'absolute',
          top: `${10 + (i % 8) * 10}%`,
          left: `${10 + (i % 6) * 15}%`,
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: colors[i % colors.length],
          zIndex: 1,
          willChange: 'transform',
          pointerEvents: 'none'
        }}
      />
    );
  })}

  {/* Simplified Light Orbs */}
  {[...Array(4)].map((_, i) => (
    <motion.div
      key={`light-orb-${i}`}
      animate={{
        scale: [0.5, 1, 0.5],
        opacity: [0.2, 0.5, 0.2]
      }}
      transition={{
        duration: 6 + i * 2,
        repeat: Infinity,
        ease: "easeInOut",
        delay: i * 1.5
      }}
      style={{
        position: 'absolute',
        top: `${20 + i * 20}%`,
        left: `${15 + i * 20}%`,
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(255,255,255,0.6), rgba(255,107,157,0.2), transparent)`,
        filter: 'blur(1px)',
        zIndex: 0,
        willChange: 'transform',
        pointerEvents: 'none'
      }}
    />
  ))}

  {/* Simple Sparkles */}
  {[...Array(6)].map((_, i) => (
    <motion.div
      key={`sparkle-${i}`}
      animate={{
        opacity: [0, 0.8, 0]
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
        delay: i * 0.8
      }}
      style={{
        position: 'absolute',
        top: `${20 + i * 15}%`,
        left: `${20 + i * 12}%`,
        width: '2px',
        height: '2px',
        background: 'rgba(255,255,255,0.8)',
        borderRadius: '50%',
        zIndex: 2,
        willChange: 'opacity',
        pointerEvents: 'none'
      }}
    />
  ))}

  {/* Simple Geometric Patterns */}
  {[...Array(3)].map((_, i) => (
    <motion.div
      key={`pattern-${i}`}
      animate={{
        rotate: [0, 360]
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: "linear",
        delay: i * 5
      }}
      style={{
        position: 'absolute',
        top: `${30 + i * 25}%`,
        left: `${80 + i * 5}%`,
        width: '40px',
        height: '40px',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: i % 2 === 0 ? '50%' : '0%',
        background: 'transparent',
        zIndex: 0,
        willChange: 'transform'
      }}
    />
  ))}

  {/* Floating Sinhala Letters */}
  {[
    // Main "අයන්න කියන්න" letters - more visible
    { letter: 'අ', top: '12%', left: '8%', delay: 0, color: 'rgba(255,107,157,0.7)', size: 'large' },
    { letter: 'ය', top: '22%', right: '12%', delay: 2, color: 'rgba(255,142,83,0.7)', size: 'large' },
    { letter: 'න්', top: '42%', left: '5%', delay: 4, color: 'rgba(255,235,59,0.8)', size: 'large' },
    { letter: 'න', top: '32%', right: '6%', delay: 1, color: 'rgba(106,17,203,0.7)', size: 'large' },
    { letter: 'කි', top: '62%', left: '10%', delay: 3, color: 'rgba(255,107,157,0.7)', size: 'large' },
    { letter: 'ය', top: '52%', right: '15%', delay: 5, color: 'rgba(255,142,83,0.7)', size: 'large' },
    { letter: 'න්', top: '72%', left: '7%', delay: 1.5, color: 'rgba(255,235,59,0.8)', size: 'large' },
    { letter: 'න', top: '82%', right: '10%', delay: 4.5, color: 'rgba(106,17,203,0.7)', size: 'large' },

    // Additional scattered letters for richness
    { letter: 'ස', top: '18%', left: '15%', delay: 6, color: 'rgba(255,107,157,0.5)', size: 'medium' },
    { letter: 'ම', top: '28%', right: '20%', delay: 7, color: 'rgba(255,142,83,0.5)', size: 'medium' },
    { letter: 'ග', top: '38%', left: '2%', delay: 8, color: 'rgba(255,235,59,0.6)', size: 'medium' },
    { letter: 'ත', top: '48%', right: '3%', delay: 2.5, color: 'rgba(106,17,203,0.5)', size: 'medium' },
    { letter: 'ර', top: '58%', left: '15%', delay: 9, color: 'rgba(255,107,157,0.5)', size: 'medium' },
    { letter: 'ල', top: '68%', right: '20%', delay: 3.5, color: 'rgba(255,142,83,0.5)', size: 'medium' },
    { letter: 'ක', top: '78%', left: '2%', delay: 10, color: 'rgba(255,235,59,0.6)', size: 'medium' },
    { letter: 'ප', top: '88%', right: '3%', delay: 4.8, color: 'rgba(106,17,203,0.5)', size: 'medium' },

    // Small decorative letters
    { letter: 'ද', top: '8%', left: '20%', delay: 11, color: 'rgba(255,107,157,0.4)', size: 'small' },
    { letter: 'ව', top: '16%', right: '25%', delay: 12, color: 'rgba(255,142,83,0.4)', size: 'small' },
    { letter: 'බ', top: '26%', left: '25%', delay: 13, color: 'rgba(255,235,59,0.5)', size: 'small' },
    { letter: 'ච', top: '36%', right: '25%', delay: 6.5, color: 'rgba(106,17,203,0.4)', size: 'small' },
    { letter: 'ජ', top: '46%', left: '20%', delay: 14, color: 'rgba(255,107,157,0.4)', size: 'small' },
    { letter: 'ට', top: '56%', right: '25%', delay: 7.5, color: 'rgba(255,142,83,0.4)', size: 'small' },
    { letter: 'ඩ', top: '66%', left: '25%', delay: 15, color: 'rgba(255,235,59,0.5)', size: 'small' },
    { letter: 'ණ', top: '76%', right: '25%', delay: 8.5, color: 'rgba(106,17,203,0.4)', size: 'small' },
    { letter: 'ථ', top: '86%', left: '20%', delay: 16, color: 'rgba(255,107,157,0.4)', size: 'small' },
    { letter: 'ධ', top: '92%', right: '22%', delay: 9.5, color: 'rgba(255,142,83,0.4)', size: 'small' }
  ].map((item, index) => {
    const sizes = {
      large: { width: 80, height: 80, fontSize: 24, radius: 35 },
      medium: { width: 65, height: 65, fontSize: 18, radius: 28 },
      small: { width: 50, height: 50, fontSize: 14, radius: 22 }
    };
    const size = sizes[item.size] || sizes.medium;

    return (
      <motion.div
        key={`floating-letter-${index}`}
        animate={{
          y: [-15, 15, -15],
          x: [-8, 8, -8],
          opacity: item.size === 'large' ? [0.3, 0.6, 0.3] : item.size === 'medium' ? [0.2, 0.4, 0.2] : [0.15, 0.3, 0.15],
          rotate: [-5, 5, -5]
        }}
        transition={{
          duration: 8 + index * 1.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: item.delay
        }}
        style={{
          position: 'absolute',
          top: item.top,
          left: item.left,
          right: item.right,
          zIndex: 0,
          pointerEvents: 'none'
        }}
      >
        <svg width={size.width} height={size.height} viewBox={`0 0 ${size.width} ${size.height}`} fill="none">
          <circle
            cx={size.width / 2}
            cy={size.height / 2}
            r={size.radius}
            fill={item.color.replace(/0\.\d+/, '0.15')}
            stroke={item.color}
            strokeWidth={item.size === 'large' ? '2' : '1'}
            strokeDasharray={item.size === 'large' ? '4,3' : '3,2'}
          />
          <text
            x={size.width / 2}
            y={size.height / 2 + size.fontSize / 3}
            textAnchor="middle"
            fill={item.color}
            fontSize={size.fontSize}
            fontFamily='"Noto Sans Sinhala", "Yaldevi", serif'
            fontWeight={item.size === 'large' ? '700' : '600'}
          >
            {item.letter}
          </text>
        </svg>
      </motion.div>
    );
  })}

  {/* Additional Decorative Sinhala Elements */}
  <motion.div
    animate={{
      opacity: [0.15, 0.35, 0.15],
      scale: [0.9, 1.1, 0.9]
    }}
    transition={{
      duration: 12,
      repeat: Infinity,
      ease: "easeInOut"
    }}
    style={{
      position: 'absolute',
      top: '20%',
      right: '3%',
      zIndex: 0,
      pointerEvents: 'none'
    }}
  >
    <svg width="90" height="90" viewBox="0 0 90 90" fill="none">
      <path
        d="M45 10 Q55 20 55 35 Q55 50 45 60 Q35 50 35 35 Q35 20 45 10 Z"
        fill="rgba(255,107,157,0.2)"
        stroke="rgba(255,107,157,0.4)"
        strokeWidth="2"
      />
      <text
        x="45"
        y="80"
        textAnchor="middle"
        fill="rgba(255,255,255,0.4)"
        fontSize="14"
        fontFamily='"Noto Sans Sinhala", serif'
        fontWeight="600"
      >
        සිංහල
      </text>
    </svg>
  </motion.div>

  <motion.div
    animate={{
      opacity: [0.2, 0.4, 0.2],
      rotate: [0, 360]
    }}
    transition={{
      duration: 30,
      repeat: Infinity,
      ease: "linear"
    }}
    style={{
      position: 'absolute',
      bottom: '15%',
      left: '3%',
      zIndex: 0,
      pointerEvents: 'none'
    }}
  >
    <svg width="85" height="85" viewBox="0 0 85 85" fill="none">
      <circle
        cx="42.5"
        cy="42.5"
        r="35"
        fill="rgba(255,142,83,0.1)"
        stroke="rgba(255,142,83,0.4)"
        strokeWidth="2"
        strokeDasharray="6,4"
      />
      <text
        x="42.5"
        y="50"
        textAnchor="middle"
        fill="rgba(255,142,83,0.5)"
        fontSize="18"
        fontFamily='"Noto Sans Sinhala", serif'
        fontWeight="600"
      >
        "අ"යන්න
      </text>
    </svg>
  </motion.div>

  {/* Additional floating word elements */}
  <motion.div
    animate={{
      opacity: [0.1, 0.25, 0.1],
      y: [-10, 10, -10]
    }}
    transition={{
      duration: 14,
      repeat: Infinity,
      ease: "easeInOut",
      delay: 2
    }}
    style={{
      position: 'absolute',
      top: '5%',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 0,
      pointerEvents: 'none'
    }}
  >
    <svg width="100" height="40" viewBox="0 0 100 40" fill="none">
      <text
        x="50"
        y="25"
        textAnchor="middle"
        fill="rgba(255,235,59,0.4)"
        fontSize="16"
        fontFamily='"Noto Sans Sinhala", serif'
        fontWeight="500"
      >
        ජගත්
      </text>
    </svg>
  </motion.div>

  <motion.div
    animate={{
      opacity: [0.12, 0.3, 0.12],
      x: [-5, 5, -5]
    }}
    transition={{
      duration: 16,
      repeat: Infinity,
      ease: "easeInOut",
      delay: 4
    }}
    style={{
      position: 'absolute',
      bottom: '5%',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 0,
      pointerEvents: 'none'
    }}
  >
    <svg width="120" height="40" viewBox="0 0 120 40" fill="none">
      <text
        x="60"
        y="25"
        textAnchor="middle"
        fill="rgba(106,17,203,0.4)"
        fontSize="16"
        fontFamily='"Noto Sans Sinhala", serif'
        fontWeight="500"
      >
        සිංහල
      </text>
    </svg>
  </motion.div>

  {/* Simple Background Elements */}
  <motion.div
    animate={{
      opacity: [0.1, 0.3, 0.1]
    }}
    transition={{
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut"
    }}
    style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '100%',
      height: '100px',
      background: 'linear-gradient(90deg, transparent, rgba(255,107,157,0.05), transparent)',
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
    <Box
      className="logo-container"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        mb: 2,
        position: 'relative',
        zIndex: 2,
        // Fix clipping issue - allow shadow to extend beyond container
        overflow: 'visible',
        padding: '25px 20px 20px 20px' // Increase top padding to fully prevent shadow clipping on mobile
      }}>
      <motion.div
        animate={{
          y: [0, -12, 0, 12, 0],
          rotate: [0, 1, 0, -1, 0],
          scale: [1, 1.02, 1, 1.02, 1]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: [0.25, 0.46, 0.45, 0.94],
          times: [0, 0.25, 0.5, 0.75, 1]
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          // Ensure shadow is not clipped during animation
          overflow: 'visible',
          padding: '0 10px 10px 10px' // Reduce top padding, keep sides and bottom
        }}
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

  <Container maxWidth="lg" sx={{
    px: { xs: 2, sm: 3 }, // Responsive padding
    width: '100%',
    position: 'relative'
  }}>
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
              color: 'white',
              textShadow: `
                0 0 10px rgba(255,107,157,0.6),
                0 0 20px rgba(255,142,83,0.4),
                2px 2px 4px rgba(0,0,0,0.3)
              `,

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
              color: '#ffeb3b',
              textShadow: '0 0 8px rgba(255,235,59,0.4), 2px 2px 4px rgba(0,0,0,0.3)'
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
        mt: 6,
        textAlign: 'center',
        position: 'relative',
        zIndex: 2,
        // Fix mobile button overflow
        px: isMobile ? 2 : 0,
        overflow: 'visible', // Allow button content to be fully visible
        minHeight: isMobile ? '120px' : 'auto' // Ensure enough space for button
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
                {(() => {
                  const fullName = localStorage.getItem('fullName');
                  if (fullName) {
                    const nameParts = fullName.split(' ');
                    return nameParts.length > 1 ? nameParts[1] : nameParts[0];
                  }
                  return userEmail.split('@')[0];
                })()}
              </Box> 👋
            </Typography>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                startIcon={<Person sx={{ fontSize: '1.5rem' }} />}
                onClick={handleDashboardClick}
                sx={{
                  fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                  borderRadius: '50px',
                  px: isMobile ? 3 : 5, // Reduce padding on mobile
                  py: 1.5,
                  fontWeight: 'bold',
                  fontSize: isMobile ? '0.9rem' : '1.1rem', // Smaller font on mobile
                  boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
                  background: 'linear-gradient(45deg, #ff9800 30%, #ffeb3b 90%)',
                  transition: 'all 0.3s ease',
                  width: isMobile ? '100%' : 'auto', // Full width on mobile
                  maxWidth: isMobile ? '300px' : 'none', // Limit max width on mobile
                  overflow: 'hidden', // Prevent text overflow
                  textOverflow: 'ellipsis', // Add ellipsis if needed
                  whiteSpace: isMobile ? 'nowrap' : 'normal', // Prevent wrapping on mobile
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


</Box>

{/* Register as Student Section */}
<Box
  sx={{
    py: 6,
    background: 'linear-gradient(135deg, #f9f9f9 0%, #e3f2fd 100%)',
    position: 'relative',
    overflow: 'hidden', // Apply overflow hidden
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
                onClick={() => handleStudentRegistrationClick()}
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


<Box
  sx={{
    py: 4,
    background: '#f9f9f9'
  }}>
      <Container>
        <Box
          className="carousel-container"
          sx={{
            position: 'relative',
            width: '100%',
            overflow: 'hidden' // Restore overflow hidden for carousel functionality
          }}>
          {/* Slider container */}
          <Box sx={{
            display: 'flex',
            transition: 'transform 0.5s ease',
            transform: `translateX(-${currentSlide * (100 / carouselItems.length)}%)`,
            width: `${carouselItems.length * 100}%`,
            // Prevent transform issues on mobile that could interfere with scrolling
            willChange: isMobile ? 'auto' : 'transform'
            // Remove overflow property to let parent handle clipping
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
<Box
  sx={{
    py: { xs: 4, md: 5 },
    background: 'linear-gradient(to bottom, #f9f9f9 0%, #ffffff 100%)',
    position: 'relative',
    overflow: 'hidden', // Apply overflow hidden
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
<Box
  sx={{
    py: 10,
    background: 'linear-gradient(135deg, #f9fafe 0%, #e6ecf8 100%)',
    position: 'relative',
    overflow: 'hidden', // Apply overflow hidden
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
<Box
  sx={{
    py: 10,
    background: 'linear-gradient(135deg, #f5f7fa 0%, #f0f4f8 100%)',
    position: 'relative',
    overflow: 'hidden', // Apply overflow hidden
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
<Box
  sx={{
    py: 8,
    background: 'linear-gradient(135deg, #6a11cb 0%,rgb(252, 37, 166) 100%)',
    color: 'white',
    position: 'relative',
    overflow: 'hidden', // Apply overflow hidden
    display: 'flex',
    alignItems: 'center',
    minHeight: { xs: 'auto', md: '100vh' }, // Remove fixed height on mobile
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
            minHeight: { xs: 'auto', md: '500px' }, // Remove fixed height on mobile
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
            minHeight: { xs: 'auto', md: '500px' }, // Remove fixed height on mobile
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

      {/* Admin Password Dialog */}
      <AdminPasswordDialog
        open={showAdminDialog}
        onClose={() => setShowAdminDialog(false)}
        onSuccess={handleAdminPasswordSuccess}
      />

      {/* Student Registration Dialog */}
      <StudentRegistrationDialog
        open={showStudentDialog}
        onClose={() => setShowStudentDialog(false)}
      />
    </Box>
  );
};

export default Home;