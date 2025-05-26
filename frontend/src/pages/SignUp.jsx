import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  StepConnector,
  IconButton,
  InputAdornment,
  Divider,
  useTheme,
  useMediaQuery,
  Avatar,
  Chip,
  CircularProgress,
  Fade,
  Zoom,
  Grow,
  CssBaseline,
  alpha,
  Card,
  CardContent,
  Rating,
  Tooltip,
  Badge,
  LinearProgress,
  Backdrop,
  Checkbox
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Visibility,
  VisibilityOff,
  Email,
  Person,
  Lock,
  School,
  CheckCircle,
  ArrowForward,
  ArrowBack,
  Celebration,
  EmojiEvents,
  Facebook,
  Google,
  Twitter,
  GitHub,
  Fingerprint,
  LockOpen,
  Favorite,
  Star,
  StarBorder,
  Lightbulb,
  Cake,
  Pets,
  SportsEsports,
  MusicNote,
  Brush,
  Code
} from '@mui/icons-material';
import { keyframes } from '@emotion/react';

// Import assets
import AKlogo from '../assets/AKlogo.png';
import registrationImage from '../assets/registrationImage.png';

// Animation keyframes
const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

// Styled components
const GradientBackground = styled(Box)(() => ({
  minHeight: '100vh',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: `linear-gradient(135deg, ${alpha('#1A032B', 0.97)} 0%, ${alpha('#3A0D5D', 0.95)} 50%, ${alpha('#6A11CB', 0.93)} 100%)`,
  backgroundSize: '400% 400%',
  animation: 'gradientAnimation 15s ease infinite',
  position: 'relative',
  overflow: 'hidden',
  padding: 0,
  margin: 0,
  marginTop: 7, // Add top margin as requested
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.1) 0%, transparent 70%)',
    zIndex: 1,
  },
  '@keyframes gradientAnimation': {
    '0%': { backgroundPosition: '0% 50%' },
    '50%': { backgroundPosition: '100% 50%' },
    '100%': { backgroundPosition: '0% 50%' },
  },
}));

const StyledPaper = styled(Paper)(() => ({
  borderRadius: 20,
  overflow: 'hidden',
  boxShadow: '0 15px 35px rgba(0, 0, 0, 0.3)',
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  position: 'relative',
  zIndex: 10,
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '5px',
    background: 'linear-gradient(90deg, #9c27b0, #673ab7, #3f51b5, #2196f3)',
    backgroundSize: '300% 300%',
    animation: 'gradientShift 3s ease infinite',
  },
  '@keyframes gradientShift': {
    '0%': { backgroundPosition: '0% 50%' },
    '50%': { backgroundPosition: '100% 50%' },
    '100%': { backgroundPosition: '0% 50%' },
  }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    transition: 'all 0.3s ease',
    background: alpha(theme.palette.background.paper, 0.8),
    backdropFilter: 'blur(5px)',
    '& fieldset': {
      borderColor: alpha(theme.palette.primary.main, 0.3),
      borderWidth: 1.5,
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused': {
      transform: 'translateY(-3px)',
      boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
      '& fieldset': {
        borderColor: theme.palette.primary.main,
        borderWidth: 2,
      }
    },
  },
  '& .MuiInputLabel-root': {
    color: alpha(theme.palette.text.primary, 0.7),
    '&.Mui-focused': {
      color: theme.palette.primary.main,
    }
  },
  '& .MuiInputBase-input': {
    padding: '16px 14px',
  }
}));

const AnimatedButton = styled(Button)(() => ({
  borderRadius: 30,
  padding: '12px 24px',
  fontWeight: 'bold',
  fontSize: '1rem',
  textTransform: 'none',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
    transition: 'all 0.5s ease',
  },
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 7px 20px rgba(0,0,0,0.3)',
    '&:before': {
      left: '100%',
    }
  },
  '&:active': {
    transform: 'translateY(1px)',
    boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
  }
}));

const SocialButton = styled(IconButton)(({ theme }) => ({
  margin: theme.spacing(0, 1),
  width: 50,
  height: 50,
  borderRadius: '50%',
  boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 6px 15px rgba(0,0,0,0.2)',
  }
}));

const StyledStepConnector = styled(StepConnector)(({ theme }) => ({
  '& .MuiStepConnector-line': {
    borderColor: alpha(theme.palette.primary.main, 0.3),
    borderLeftWidth: 3,
    minHeight: 40,
  },
  '&.Mui-active, &.Mui-completed': {
    '& .MuiStepConnector-line': {
      borderColor: theme.palette.primary.main,
    },
  },
}));

const StyledStepLabel = styled(StepLabel)(({ theme }) => ({
  '& .MuiStepLabel-label': {
    fontWeight: 600,
    marginTop: theme.spacing(1),
    '&.Mui-active': {
      color: theme.palette.primary.main,
    },
    '&.Mui-completed': {
      color: theme.palette.success.main,
    },
  },
  '& .MuiStepIcon-root': {
    width: 35,
    height: 35,
    '&.Mui-active': {
      color: theme.palette.primary.main,
    },
    '&.Mui-completed': {
      color: theme.palette.success.main,
    },
  },
}));

const FloatingElement = styled(Box)(({ delay = 0 }) => ({
  position: 'absolute',
  animation: `${float} 3s ease-in-out infinite`,
  animationDelay: `${delay}s`,
  zIndex: 0,
}));

const SignUp = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  // State for multi-step form
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState({});
  const [formProgress, setFormProgress] = useState(0);

  // Form data state
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    password: '',
    confirmPassword: '',
    showPassword: false,
    showConfirmPassword: false,
    agreeToTerms: false
  });

  // UI states
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);



  // Steps for the multi-step form
  const steps = [
    { label: 'Basic Info', icon: <Person /> },
    { label: 'Security', icon: <Lock /> },
    { label: 'Complete', icon: <CheckCircle /> }
  ];

  // Canvas animation effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const particles = [];
    const particleCount = 50;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 5 + 1,
        color: `rgba(${Math.floor(Math.random() * 100 + 155)}, ${Math.floor(Math.random() * 100 + 155)}, ${Math.floor(Math.random() * 255)}, ${Math.random() * 0.5 + 0.1})`,
        speedX: Math.random() * 2 - 1,
        speedY: Math.random() * 2 - 1
      });
    }

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        // Move particles
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
      });
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  // Calculate password strength
  const calculatePasswordStrength = (password) => {
    let strength = 0;

    if (password.length >= 8) strength += 1;
    if (password.match(/[A-Z]/)) strength += 1;
    if (password.match(/[0-9]/)) strength += 1;
    if (password.match(/[^A-Za-z0-9]/)) strength += 1;

    setPasswordStrength(strength);
    return strength;
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'password') {
      calculatePasswordStrength(value);
    }

    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Toggle password visibility
  const handleClickShowPassword = () => {
    setFormData({ ...formData, showPassword: !formData.showPassword });
  };

  const handleClickShowConfirmPassword = () => {
    setFormData({ ...formData, showConfirmPassword: !formData.showConfirmPassword });
  };



  // Form validation
  const validateForm = () => {
    const newErrors = {};

    // Validate based on current step
    if (activeStep === 0) {
      if (!formData.email) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
      }

      if (!formData.fullName) {
        newErrors.fullName = 'Full name is required';
      }
    } else if (activeStep === 1) {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      } else if (calculatePasswordStrength(formData.password) < 3) {
        newErrors.password = 'Password is too weak';
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    } else if (activeStep === 2) {
      if (!formData.agreeToTerms) {
        newErrors.agreeToTerms = 'You must agree to the terms and conditions';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle step navigation
  const handleNext = () => {
    if (validateForm()) {
      const newCompleted = { ...completed };
      newCompleted[activeStep] = true;
      setCompleted(newCompleted);

      const newProgress = ((activeStep + 1) / steps.length) * 100;
      setFormProgress(newProgress);

      setActiveStep(prevStep => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prevStep => prevStep - 1);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await axios.post('https://ayanna-kiyanna-new-backend.onrender.com/api/auth/register', {
        email: formData.email,
        fullName: formData.fullName,
        password: formData.password
      });

      setShowSuccessMessage(true);

      // Redirect after showing success message briefly
      setTimeout(() => {
        navigate('/login', { state: { registrationSuccess: true } });
      }, 3000);

    } catch (error) {
      console.error('Registration error:', error.response?.data?.message || error.message);
      setErrors({
        ...errors,
        submit: error.response?.data?.message || 'Registration failed. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle checkbox change
  const handleCheckboxChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.checked
    });
  };

  // Render password strength indicator
  const renderPasswordStrength = () => {
    const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];
    const strengthColors = ['#f44336', '#ff9800', '#2196f3', '#4caf50'];

    return (
      <Box sx={{ mt: 1, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="caption" color="text.secondary">
            Password Strength:
          </Typography>
          <Typography variant="caption" sx={{ color: strengthColors[passwordStrength - 1] || 'text.secondary', fontWeight: 600 }}>
            {passwordStrength > 0 ? strengthLabels[passwordStrength - 1] : 'None'}
          </Typography>
        </Box>
        <Box sx={{ width: '100%', height: 4, bgcolor: 'rgba(0,0,0,0.1)', borderRadius: 2, overflow: 'hidden' }}>
          <Box
            sx={{
              height: '100%',
              width: `${passwordStrength * 25}%`,
              bgcolor: strengthColors[passwordStrength - 1] || 'transparent',
              transition: 'width 0.3s ease, background-color 0.3s ease'
            }}
          />
        </Box>
      </Box>
    );
  };



  // Render form step content
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: { xs: 2, md: 2.5 }, fontWeight: 600, color: theme.palette.primary.main, fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
              Let's get to know you
            </Typography>

            <StyledTextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              variant="outlined"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: { xs: 2.5, md: 3 } }}
            />

            <StyledTextField
              fullWidth
              label="Full Name"
              name="fullName"
              type="text"
              variant="outlined"
              value={formData.fullName}
              onChange={handleChange}
              error={!!errors.fullName}
              helperText={errors.fullName}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="primary" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: { xs: 2, md: 2.5 }, fontWeight: 600, color: theme.palette.primary.main, fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
              Secure your account
            </Typography>

            <StyledTextField
              fullWidth
              label="Password"
              name="password"
              type={formData.showPassword ? 'text' : 'password'}
              variant="outlined"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                      size="small"
                    >
                      {formData.showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 1 }}
            />

            {renderPasswordStrength()}

            <StyledTextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type={formData.showConfirmPassword ? 'text' : 'password'}
              variant="outlined"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Fingerprint color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={handleClickShowConfirmPassword}
                      edge="end"
                      size="small"
                    >
                      {formData.showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mt: { xs: 2, sm: 0 } }}
            />
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: { xs: 2, md: 2.5 }, fontWeight: 600, color: theme.palette.primary.main, fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
              Almost there!
            </Typography>

            <Box sx={{
              p: { xs: 2.5, md: 3 },
              borderRadius: 2,
              bgcolor: alpha(theme.palette.success.main, 0.1),
              mb: { xs: 2.5, md: 3 }
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircle color="success" sx={{ mr: 1 }} />
                <Typography variant="body1" fontWeight={600}>
                  Account Details
                </Typography>
              </Box>

              <Box sx={{ pl: 4 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Email:</strong> {formData.email}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Name:</strong> {formData.fullName}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
              <Checkbox
                checked={formData.agreeToTerms}
                onChange={handleCheckboxChange}
                name="agreeToTerms"
                color="primary"
                sx={{ mt: -0.5 }}
              />
              <Typography variant="body2" color="text.secondary">
                I agree to the <Link href="#" sx={{ color: theme.palette.primary.main }}>Terms of Service</Link> and <Link href="#" sx={{ color: theme.palette.primary.main }}>Privacy Policy</Link>
              </Typography>
            </Box>

            {errors.agreeToTerms && (
              <Typography color="error" variant="caption">
                {errors.agreeToTerms}
              </Typography>
            )}
          </Box>
        );

      default:
        return null;
    }
  };

  // Render navigation buttons
  const renderNavButtons = () => {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        mt: { xs: 3, md: 3 },
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 2, sm: 0 }
      }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={activeStep === 0 ? () => navigate('/login') : handleBack}
          startIcon={<ArrowBack />}
          fullWidth={isMobile}
          size={isMobile ? "large" : "medium"}
          sx={{
            borderRadius: 30,
            px: 3,
            textTransform: 'none',
            fontWeight: 600,
            order: { xs: 2, sm: 1 }
          }}
        >
          {activeStep === 0 ? 'Back to Login' : 'Back'}
        </Button>

        {activeStep === steps.length - 1 ? (
          <AnimatedButton
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
            fullWidth={isMobile}
            size={isMobile ? "large" : "medium"}
            endIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <CheckCircle />}
            sx={{ order: { xs: 1, sm: 2 } }}
          >
            {isSubmitting ? 'Creating Account...' : 'Complete Registration'}
          </AnimatedButton>
        ) : (
          <AnimatedButton
            variant="contained"
            color="primary"
            onClick={handleNext}
            fullWidth={isMobile}
            size={isMobile ? "large" : "medium"}
            endIcon={<ArrowForward />}
            sx={{ order: { xs: 1, sm: 2 } }}
          >
            Continue
          </AnimatedButton>
        )}
      </Box>
    );
  };



  return (
    <GradientBackground>
      {/* Background canvas animation */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
        }}
      />

      {/* Floating elements */}
      <FloatingElement
        sx={{
          top: '10%',
          left: '5%',
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(156,39,176,0.3) 0%, rgba(156,39,176,0) 70%)'
        }}
        delay={0.5}
      />
      <FloatingElement
        sx={{
          top: '70%',
          right: '10%',
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(33,150,243,0.3) 0%, rgba(33,150,243,0) 70%)'
        }}
        delay={1.2}
      />
      <FloatingElement
        sx={{
          bottom: '15%',
          left: '15%',
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(103,58,183,0.3) 0%, rgba(103,58,183,0) 70%)'
        }}
        delay={0.8}
      />

      <Container maxWidth="xl" sx={{
        position: 'relative',
        zIndex: 2,
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 2, sm: 3, md: 4 }
      }}>
        <Grid container sx={{
          height: { xs: 'auto', md: 'fit-content' },
          minHeight: { md: '85vh' },
          maxHeight: { md: '95vh' },
          width: '100%',
          maxWidth: '1400px',
          margin: '0 auto',
          alignItems: 'center',
          justifyContent: 'center'
        }} spacing={{ xs: 0, md: 4 }}>
          {/* Left side - Form */}
          <Grid item xs={12} md={6} sx={{
            height: { xs: 'auto', md: '100%' },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: { xs: 1, sm: 2, md: 3 },
            order: { xs: 2, md: 1 }
          }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{ width: '100%', maxWidth: '500px' }}
            >
              <StyledPaper elevation={6} sx={{
                p: { xs: 3, sm: 4, md: 4 },
                height: 'fit-content',
                maxHeight: { xs: 'none', md: '85vh' },
                width: '100%',
                overflowY: { xs: 'visible', md: 'auto' },
                display: 'flex',
                flexDirection: 'column',
                mx: 'auto',
                my: { xs: 2, md: 0 }
              }}>
                {/* Logo and title */}
                <Box sx={{ textAlign: 'center', mb: { xs: 3, md: 3 } }}>
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: 'loop' }}
                  >
                    <Box
                      component="img"
                      src={AKlogo}
                      alt="Ayanna Kiyanna Logo"
                      sx={{ height: { xs: 70, md: 75 }, width: 'auto', mb: { xs: 1.5, md: 2 } }}
                    />
                  </motion.div>

                  <Typography variant="h4" component="h1" sx={{
                    fontWeight: 700,
                    background: 'linear-gradient(45deg, #9c27b0, #673ab7)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 1,
                    fontSize: { xs: '1.8rem', md: '2.125rem' }
                  }}>
                    Create Account
                  </Typography>

                  <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: '0.9rem', md: '1rem' } }}>
                    Join our community and start your learning journey
                  </Typography>
                </Box>

                {/* Progress indicator */}
                <Box sx={{ mb: { xs: 3, md: 3 } }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                      Step {activeStep + 1} of {steps.length}
                    </Typography>
                    <Typography variant="body2" fontWeight={600} color="primary" sx={{ fontSize: '0.8rem' }}>
                      {Math.round(formProgress)}% Complete
                    </Typography>
                  </Box>

                  <Box sx={{ width: '100%', height: 5, bgcolor: 'rgba(0,0,0,0.1)', borderRadius: 3, overflow: 'hidden' }}>
                    <Box
                      component={motion.div}
                      initial={{ width: 0 }}
                      animate={{ width: `${formProgress}%` }}
                      transition={{ duration: 0.5 }}
                      sx={{
                        height: '100%',
                        background: 'linear-gradient(90deg, #9c27b0, #673ab7)',
                        borderRadius: 3
                      }}
                    />
                  </Box>
                </Box>

                {/* Stepper */}
                <Stepper
                  activeStep={activeStep}
                  orientation="horizontal"
                  alternativeLabel={isMobile}
                  sx={{
                    mb: { xs: 3, md: 3 },
                    '& .MuiStepConnector-line': {
                      minWidth: { xs: 15, sm: 30 }
                    },
                    '& .MuiStepLabel-root': {
                      flexDirection: { xs: 'column', sm: 'row' }
                    },
                    '& .MuiStepLabel-label': {
                      fontSize: { xs: '0.75rem', md: '0.875rem' }
                    }
                  }}>
                  {steps.map((step, index) => (
                    <Step key={step.label} completed={completed[index]}>
                      <StepLabel
                        StepIconComponent={() => (
                          <Avatar
                            sx={{
                              width: { xs: 30, sm: 40 },
                              height: { xs: 30, sm: 40 },
                              bgcolor: index === activeStep
                                ? 'primary.main'
                                : completed[index]
                                  ? 'success.main'
                                  : 'rgba(0,0,0,0.1)',
                              color: index === activeStep || completed[index] ? 'white' : 'text.secondary',
                              transition: 'all 0.3s ease',
                              fontSize: { xs: '0.8rem', sm: '1rem' }
                            }}
                          >
                            {step.icon}
                          </Avatar>
                        )}
                      >
                        {step.label}
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>

                {/* Form content */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {renderStepContent(activeStep)}
                  </motion.div>
                </AnimatePresence>

                {/* Error message */}
                {errors.submit && (
                  <Typography color="error" align="center" sx={{ mt: 2 }}>
                    {errors.submit}
                  </Typography>
                )}

                {/* Navigation buttons */}
                {renderNavButtons()}

                {/* Login link */}
                <Box sx={{ textAlign: 'center', mt: { xs: 3, md: 3 } }}>
                  <Divider sx={{ my: 1.5 }} />
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                    Already have an account?{' '}
                    <Link
                      component={motion.a}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => navigate('/login')}
                      sx={{
                        color: theme.palette.primary.main,
                        fontWeight: 600,
                        cursor: 'pointer',
                        textDecoration: 'none',
                        '&:hover': {
                          textDecoration: 'underline'
                        }
                      }}
                    >
                      Sign In
                    </Link>
                  </Typography>
                </Box>
              </StyledPaper>
            </motion.div>
          </Grid>

          {/* Right side - Image and info */}
          <Grid item xs={12} md={6} sx={{
            height: { xs: 'auto', md: '100%' },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            order: { xs: 1, md: 2 },
            p: { xs: 1, sm: 2, md: 3 },
            bgcolor: { xs: 'transparent', md: 'rgba(0,0,0,0.02)' }
          }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{ width: '100%', height: '100%', maxWidth: '500px' }}
            >
                <Box sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  width: '100%'
                }}>
                  <Box
                    component={motion.div}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    sx={{
                      borderRadius: 4,
                      overflow: 'hidden',
                      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                      position: 'relative',
                      height: { xs: 250, sm: 350, md: '60vh' },
                      maxHeight: '600px',
                      mb: { xs: 2, md: 3 },
                      width: '100%'
                    }}
                  >
                    <Box
                      component="img"
                      src={registrationImage}
                      alt="Registration"
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center',
                        filter: 'brightness(0.8)',
                        display: 'block'
                      }}
                    />

                    <Box sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(to top, rgba(26, 3, 43, 0.8) 0%, rgba(26, 3, 43, 0.4) 50%, rgba(26, 3, 43, 0.2) 100%)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      p: { xs: 2, sm: 3, md: 4 }
                    }}>
                      <Typography variant="h3" component="h2" sx={{
                        color: 'white',
                        fontWeight: 700,
                        textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                        mb: { xs: 1, sm: 1.5, md: 2 },
                        fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem', lg: '3rem' },
                        lineHeight: { xs: 1.2, md: 1.3 }
                      }}>
                        Welcome to Ayanna Kiyanna
                      </Typography>

                      <Typography variant="h6" sx={{
                        color: 'white',
                        textShadow: '0 1px 5px rgba(0,0,0,0.5)',
                        mb: { xs: 2, sm: 2.5, md: 3 },
                        fontSize: { xs: '0.9rem', sm: '1.1rem', md: '1.25rem' },
                        lineHeight: { xs: 1.3, md: 1.4 }
                      }}>
                        Begin your journey to language mastery
                      </Typography>

                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        color: 'white',
                        mb: { xs: 1, md: 2 }
                      }}>
                        <EmojiEvents sx={{
                          mr: 1,
                          color: '#FFD700',
                          fontSize: { xs: '1.2rem', md: '1.5rem' }
                        }} />
                        <Typography variant="body1" fontWeight={500} sx={{
                          fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1rem' }
                        }}>
                          Join thousands of successful students
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Testimonial */}
                  <Card sx={{
                    borderRadius: 3,
                    p: { xs: 1.5, sm: 2, md: 3 },
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
                    position: 'relative',
                    overflow: 'visible',
                    display: { xs: 'none', sm: 'block' }
                  }}>
                    <Box sx={{
                      position: 'absolute',
                      top: { xs: -15, md: -20 },
                      left: { xs: 15, md: 20 },
                      width: { xs: 35, md: 40 },
                      height: { xs: 35, md: 40 },
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)'
                    }}>
                      <Favorite sx={{
                        color: 'white',
                        fontSize: { xs: 18, md: 20 }
                      }} />
                    </Box>

                    <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                      <Typography variant="body1" sx={{
                        fontStyle: 'italic',
                        mb: 2,
                        fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1rem' },
                        lineHeight: { xs: 1.4, md: 1.5 }
                      }}>
                        "Ayana Kiyanna transformed my language learning experience. The personalized approach and expert guidance helped me achieve fluency faster than I thought possible."
                      </Typography>

                      <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: { xs: 1, sm: 0 }
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{
                            bgcolor: 'secondary.main',
                            mr: { xs: 1.5, md: 2 },
                            width: { xs: 35, md: 40 },
                            height: { xs: 35, md: 40 },
                            fontSize: { xs: '0.9rem', md: '1rem' }
                          }}>S</Avatar>
                          <Box>
                            <Typography variant="subtitle2" fontWeight={600} sx={{
                              fontSize: { xs: '0.8rem', md: '0.875rem' }
                            }}>
                              Sarah Johnson
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{
                              fontSize: { xs: '0.7rem', md: '0.75rem' }
                            }}>
                              Student since 2022
                            </Typography>
                          </Box>
                        </Box>

                        <Rating value={5} readOnly size="small" sx={{
                          '& .MuiRating-icon': {
                            fontSize: { xs: '1rem', md: '1.2rem' }
                          }
                        }} />
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              </motion.div>
            </Grid>
        </Grid>
      </Container>

      {/* Success message */}
      <Backdrop
        sx={{ color: '#fff', zIndex: 9999 }}
        open={showSuccessMessage}
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Paper sx={{
            p: 4,
            borderRadius: 3,
            textAlign: 'center',
            maxWidth: 400,
            boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
          }}>
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
            >
              <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
            </motion.div>

            <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
              Registration Successful!
            </Typography>

            <Typography variant="body1" sx={{ mb: 3 }}>
              Your account has been created successfully. Redirecting to login...
            </Typography>

            <CircularProgress size={24} sx={{ color: theme.palette.primary.main }} />
          </Paper>
        </motion.div>
      </Backdrop>
    </GradientBackground>
  );
};

export default SignUp;