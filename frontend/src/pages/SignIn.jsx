import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Link, 
  Divider,
  InputAdornment,
  IconButton,
  FormControlLabel,
  Checkbox,
  Dialog,
  DialogContent,
  DialogActions,
  Slide
} from '@mui/material';
import { Visibility, VisibilityOff, Google, CheckCircle, Celebration } from '@mui/icons-material';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import AKlogo from '../assets/AKlogo.png';
import { firebaseConfig } from '../config';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const SignInPage = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [openSuccessPopup, setOpenSuccessPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const animationRef = useRef(null);

    const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('https://ayanna-kiyanna-new-backend.onrender.com/api/auth/login', {
        email: formData.email,
        password: formData.password
      });

      // Store user data in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userEmail', formData.email);
      
      if (response.data.user) {
        localStorage.setItem('fullName', response.data.user.fullName);
      }

      // Show success popup
      setPopupMessage(`Welcome back, ${response.data.user.fullName || response.data.user.email}!`);
      setOpenSuccessPopup(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
      console.error('Login error:', err);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      
      const response = await axios.post('https://ayanna-kiyanna-new-backend.onrender.com/api/auth/firebase-google', {
        idToken
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userEmail', response.data.user.email);
      localStorage.setItem('fullName', response.data.user.fullName);

      setPopupMessage(`ආයුබෝවන් 🙏 ${response.data.user.fullName || response.data.user.email}!`);
      setOpenSuccessPopup(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Google login failed. Please try again.');
      console.error('Google login error:', err);
    }
  };

  const handleCloseSuccessPopup = () => {
    setOpenSuccessPopup(false);
    
    // Use setTimeout to ensure navigation happens after state updates
    setTimeout(() => {
      window.location.href = '/'; // This will do a full navigation
    }, 100);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleRememberMeChange = (event) => {
    setRememberMe(event.target.checked);
  };

  useEffect(() => {
    const container = animationRef.current;
    if (!container) return;

    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.zIndex = '-1';
    container.appendChild(canvas);

    const resizeCanvas = () => {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    };
    resizeCanvas();

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Awesome colors: Purple, Pink, Green, Orange
    const colors = [
    { r: 142, g: 68, b: 173, name: "Vivid Purple" },    // Brighter, richer purple
    { r: 245, g: 66, b: 137, name: "Electric Pink" },   // More vibrant, neon-like pink
    { r: 39, g: 174, b: 96, name: "Emerald Green" },    // Deeper, jewel-toned green
    { r: 255, g: 147, b: 41, name: "Tangerine Glow" },  // Warmer, more dynamic orange
    { r: 64, g: 224, b: 208, name: "Aqua Teal" },       // Fresh, trendy teal for contrast
    { r: 255, g: 245, b: 157, name: "Sunlit Yellow" }   // Bright, cheerful yellow for pop
    ];

    // Particles configuration
    const particles = [];
    const particleCount = Math.floor(window.innerWidth / 5);

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 3 + 1, // Smaller particles
        color: `rgba(255, 255, 255, ${Math.random() * 0.2 + 0.1})`,
        speed: Math.random() * 0.3 + 0.1, // Slower movement
        angle: Math.random() * Math.PI * 2,
        drift: (Math.random() - 0.5) * 0.1
      });
    }

    // Animation variables
    let colorIndex = 0;
    let targetColor = colors[colorIndex];
    let currentColor = {...targetColor};
    let time = 0;
    let animationId;

    const animate = () => {
      time++;
      
      // Smooth color transition
      if (time % 200 === 0) { // Faster color transitions
        colorIndex = (colorIndex + 1) % colors.length;
        targetColor = colors[colorIndex];
      }
      
      currentColor.r += (targetColor.r - currentColor.r) * 0.01;
      currentColor.g += (targetColor.g - currentColor.g) * 0.01;
      currentColor.b += (targetColor.b - currentColor.b) * 0.01;
      
      // Create gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, `rgba(${Math.floor(currentColor.r)}, ${Math.floor(currentColor.g)}, ${Math.floor(currentColor.b)}, 0.7)`);
      gradient.addColorStop(1, `rgba(${Math.floor(currentColor.r * 0.6)}, ${Math.floor(currentColor.g * 0.6)}, ${Math.floor(currentColor.b * 0.6)}, 0.7)`);
      
      // Fill canvas
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        // Create bubble shape
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        
        // Add subtle glow
        ctx.shadowBlur = 5;
        ctx.shadowColor = p.color;
        
        // Update position
        p.x += Math.cos(p.angle) * p.speed;
        p.y += Math.sin(p.angle) * p.speed + p.drift;
        
        // Reset particles that go off screen
        if (p.x < -p.radius) p.x = canvas.width + p.radius;
        if (p.x > canvas.width + p.radius) p.x = -p.radius;
        if (p.y < -p.radius) p.y = canvas.height + p.radius;
        if (p.y > canvas.height + p.radius) p.y = -p.radius;
      }
      
      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      resizeCanvas();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      if (container && canvas.parentNode === container) {
        container.removeChild(canvas);
      }
    };
  }, []);

  return (
    <>
      {/* Background container - fixed position behind everything */}
      <Box
        ref={animationRef}
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 1,
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle at 20% 50%, rgba(156, 39, 176, 0.1), transparent 70%)',
            zIndex: -1,
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle at 80% 50%, rgba(233, 30, 99, 0.1), transparent 70%)',
            zIndex: -1,
          }
        }}
      />

      {/* Main content */}
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
          position: 'relative',
          zIndex: 1
        }}
      >
        <Paper
          elevation={6}
          sx={{
            maxWidth: 400,
            width: '100%',
            p: 3,
            mt: 1,
            borderRadius: 3,
            backgroundColor: 'rgba(255, 255, 255, 0.75)',
            backdropFilter: 'blur(2px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            position: 'relative',
            zIndex: 2,
            animation: 'fadeIn 0.8s ease-in',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
            transform: 'translateY(0)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '&:hover': {
              boxShadow: '0 12px 25px rgba(0, 0, 0, 0.2)',
              transform: 'translateY(-5px)'
            }
          }}
        >
          <Box sx={{ 
            textAlign: 'center', 
            mb: 4,
            animation: 'fadeIn 0.5s ease-in'
          }}>
            <Box
              component="img"
              src={AKlogo}
              alt="Ayanna Kiyanna Sinhala Institute Logo"
              sx={{ 
                height: 100,
                width: 'auto',
                marginBottom: 2,
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05) rotate(-5deg)'
                },
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
              }} 
            />
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ 
                fontWeight: 700,
                color: '#2c3e50',
                mt: 1,
                background: 'linear-gradient(45deg,rgb(156, 41, 185),rgb(58, 44, 80))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block',
                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              "අ"යන්න කියන්න
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Welcome back! Sign in to continue your learning journey
            </Typography>
          </Box>

      {/* Update the form section */}
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
            {error && (
              <Typography color="error" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}

        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          variant="outlined"
          value={formData.email}
          onChange={handleInputChange}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              '& fieldset': {
                borderColor: 'rgba(0, 0, 0, 0.23)',
              },
              '&:hover fieldset': {
                borderColor: '#9c27b0',
              },
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: '#9c27b0',
            }
          }}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          id="password"
          autoComplete="current-password"
          variant="outlined"
          value={formData.password}
          onChange={handleInputChange}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              '& fieldset': {
                borderColor: 'rgba(0, 0, 0, 0.23)',
              },
              '&:hover fieldset': {
                borderColor: '#9c27b0',
              },
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: '#9c27b0',
            }
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  edge="end"
                  sx={{ color: '#9c27b0' }}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={rememberMe} 
                    onChange={handleRememberMeChange}
                    sx={{ 
                      color: '#673ab7', // Purple
                      '&.Mui-checked': {
                        color: '#673ab7', // Purple
                      }
                    }}
                  />
                }
                label="Remember me"
                sx={{ color: '#673ab7' }} // Purple
              />
              <Link href="#" variant="body2" sx={{ 
                textDecoration: 'none',
                color: '#673ab7', // Purple
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}>
                Forgot password?
              </Link>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 2,
                mb: 2,
                py: 1.2,
                borderRadius: 2,
                fontSize: '0.95rem',
                fontWeight: 600,
                background: 'linear-gradient(45deg, #9c27b0, #673ab7)',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                '&:hover': {
                  boxShadow: '0 6px 8px rgba(0,0,0,0.15)',
                  background: 'linear-gradient(45deg, #673ab7, #9c27b0)',
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Sign In
            </Button>

            <Divider sx={{ my: 3, color: '#7f8c8d' }}>
              <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                OR CONTINUE WITH GOOGLE
              </Typography>
            </Divider>

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<Google sx={{ 
                  background: 'white', 
                  borderRadius: '50%',
                  p: 0.5,
                  color: '#DB4437'
                }} />}
                onClick={handleGoogleSignIn}
                sx={{
                  maxWidth: 300,
                  borderRadius: 2,
                  py: 1,
                  background: 'linear-gradient(to right,rgb(104, 66, 244),rgb(52, 168, 133), #FBBC05, #EA4335)',
                  backgroundSize: '300% 100%',
                  color: 'white',
                  fontWeight: 600,
                  textTransform: 'none',
                  letterSpacing: 0.5,
                  '&:hover': {
                    backgroundPosition: '100% 0',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 12px rgba(0,0,0,0.2)'
                  },
                  transition: 'all 0.5s ease, transform 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(to right, rgba(255,255,255,0.1), rgba(255,255,255,0.3), rgba(255,255,255,0.1))',
                    transform: 'translateX(-100%)',
                    transition: 'transform 0.6s ease'
                  },
                  '&:hover::before': {
                    transform: 'translateX(100%)'
                  }
                }}
              >
                Continue with Google
              </Button>
            </Box>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                New to Ayanna Kiyanna?{' '}
                <Link href="/register" variant="body2" sx={{ 
                  fontWeight: 600, 
                  textDecoration: 'none',
                  color: '#673ab7',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}>
                  Create an account
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Success Popup */}
      <Dialog
        open={openSuccessPopup}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseSuccessPopup}
        aria-describedby="success-dialog-description"
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 3,
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            padding: '20px',
            textAlign: 'center',
            maxWidth: '400px'
          }
        }}
      >
        <DialogContent sx={{ py: 4 }}>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Celebration sx={{ 
              fontSize: 80, 
              color: '#9c27b0', 
              mb: 2,
              filter: 'drop-shadow(0 4px 8px rgba(156, 39, 176, 0.3))'
            }} />
            <Typography variant="h5" component="div" sx={{ 
              mb: 2,
              fontWeight: 700,
              background: 'linear-gradient(45deg, #9c27b0, #673ab7)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              සාදරයෙන් පිළිගනිමු.!
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              {popupMessage}
            </Typography>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(102, 187, 106, 0.2)',
              borderRadius: '20px',
              padding: '10px 20px',
              mb: 3
            }}>
              <CheckCircle sx={{ color: '#66bb6a', mr: 1 }} />
              <Typography variant="body2" sx={{ color: '#2e7d32' }}>
                You are now logged in
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button
            onClick={handleCloseSuccessPopup}
            variant="contained"
            sx={{
              borderRadius: '20px',
              px: 4,
              py: 1,
              background: 'linear-gradient(45deg, #9c27b0, #673ab7)',
              '&:hover': {
                background: 'linear-gradient(45deg, #673ab7, #9c27b0)'
              }
            }}
          >
            Continue to Dashboard
          </Button>
        </DialogActions>
      </Dialog>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}
      </style>
    </>
  );
};

export default SignInPage;