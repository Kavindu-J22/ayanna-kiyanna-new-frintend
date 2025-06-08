import React, { useState, useEffect, useRef } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Box,
  Container,
  useMediaQuery,
  useTheme,
  Collapse,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge,
  Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ExploreIcon from '@mui/icons-material/Explore';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import NotificationsIcon from '@mui/icons-material/Notifications';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import PeopleIcon from '@mui/icons-material/People';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import BusinessIcon from '@mui/icons-material/Business';
import { styled, alpha } from '@mui/material/styles';
import { keyframes } from '@mui/system';
import { useLocation } from 'react-router-dom';

// Import your logo image (make sure the path is correct)
import logo from '../assets/AKlogo.png';

// Import cart icon component
import CartIcon from './CartIcon';

const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha('#1a0638', 0.95)} 0%, ${alpha('#2e0b5e', 0.98)} 100%)`,
  backdropFilter: 'blur(10px)',
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.4)',
  borderBottom: `1px solid ${alpha('#9c64ff', 0.2)}`,
  padding: theme.spacing(0.5, 0),
  position: 'fixed',
  zIndex: 1200,
  transition: 'all 0.3s ease',
  '&:hover': {
    background: `linear-gradient(135deg, ${alpha('#1a0638', 1)} 0%, ${alpha('#2e0b5e', 1)} 100%)`,
  },
  '& > div': {
    position: 'relative'
  }
}));

const LogoTitle = styled(Typography)(({ theme }) => ({
  fontFamily: '"Sinhala MN", "Iskoola Pota", sans-serif',
  fontWeight: 700,
  letterSpacing: '0.5px',
  display: 'flex',
  alignItems: 'center',
  transition: 'all 0.3s ease',
  '& img': {
    marginRight: theme.spacing(2),
    height: '40px',
    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
    transition: 'all 0.3s ease',
    [theme.breakpoints.down('sm')]: {
      height: '32px',
      marginRight: theme.spacing(1),
    },
  },
  '&:hover img': {
    transform: 'rotate(-5deg)',
    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))',
  },
  '& .title-text': {
    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
}));

const NavButton = styled(Button)(({ theme }) => ({
  color: 'white',
  fontWeight: 500,
  margin: theme.spacing(0, 0.5),
  padding: theme.spacing(1, 2),
  position: 'relative',
  overflow: 'hidden',
  borderRadius: '8px',
  transition: 'all 0.3s ease',
  '&:before': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: '50%',
    width: 0,
    height: '2px',
    backgroundColor: '#b388ff',
    transition: 'all 0.3s ease',
    transform: 'translateX(-50%)',
  },
  '&:hover': {
    backgroundColor: 'rgba(179, 136, 255, 0.1)',
    transform: 'translateY(-2px)',
    '&:before': {
      width: '70%',
    }
  },
  '&.active': {
    color: '#b388ff',
    '&:before': {
      width: '70%',
      backgroundColor: '#b388ff',
    }
  }
}));

const AuthButton = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  fontWeight: 600,
  borderRadius: '12px',
  padding: theme.spacing(1, 2.5),
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
  transition: 'all 0.3s ease, transform 0.2s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.4)',
  }
}));

const MobileMenuButton = styled(Button)(({ theme, open }) => ({
  borderRadius: '12px',
  backgroundColor: open ? 'rgba(179, 136, 255, 0.2)' : 'transparent',
  padding: theme.spacing(0.5, 1.5),
  fontSize: '0.875rem',
  minWidth: 'auto',
  transition: 'all 0.3s ease',
  animation: `${pulseAnimation} 3s infinite`,
  '&:hover': {
    backgroundColor: 'rgba(179, 136, 255, 0.3)',
  },
  '& .MuiButton-startIcon': {
    marginRight: theme.spacing(0.5),
  }
}));

const Header = () => {
  const location = useLocation();
  const [userEmail, setUserEmail] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const mobileMenuRef = useRef(null);
  const mobileMenuButtonRef = useRef(null);
  const navigate = useNavigate();

  // Debug mobile menu state
  useEffect(() => {
    console.log('Mobile menu state changed:', mobileMenuOpen, 'isMobile:', isMobile);
  }, [mobileMenuOpen, isMobile]);

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (email) {
      setUserEmail(email);
      loadUnreadCount();
    }
  }, []);

  const loadUnreadCount = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await axios.get(
          'https://ayanna-kiyanna-new-backend.onrender.com/api/notifications/unread-count',
          { headers: { 'x-auth-token': token } }
        );
        setUnreadCount(response.data.unreadCount || 0);
      }
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  };

  // Refresh unread count every 30 seconds
  useEffect(() => {
    if (userEmail) {
      const interval = setInterval(loadUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [userEmail]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Only handle if menu is open and we're on mobile
      if (!mobileMenuOpen || !isMobile) return;

      // Check if click is outside both the menu and the button
      const isClickOutsideMenu = mobileMenuRef.current && !mobileMenuRef.current.contains(event.target);
      const isClickOutsideButton = mobileMenuButtonRef.current && !mobileMenuButtonRef.current.contains(event.target);

      if (isClickOutsideMenu && isClickOutsideButton) {
        console.log('Clicking outside mobile menu, closing...');
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [mobileMenuOpen, isMobile]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    setUserEmail(null);
    handleMenuClose();

    navigate('/');
  };

  const toggleMobileMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Toggle mobile menu clicked, current state:', mobileMenuOpen);
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const navItems = [
    { name: 'Home', path: '/', icon: <HomeIcon /> },
    { name: 'About', path: '/about', icon: <PeopleIcon /> },
    { name: 'Services', path: '/services', icon: <BusinessIcon /> },
    { name: 'Products', path: '/products', icon: <InfoIcon /> },
    { name: 'Contact', path: '/contact', icon: <ContactMailIcon /> },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <StyledAppBar>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <LogoTitle
              variant="h6"
              noWrap
              sx={{ flexGrow: isMobile ? 0 : 1, cursor: 'pointer' }}
              onClick={() => {
                  window.location.href = '/';
              }}
            >
              <img src={logo} alt="Logo" />
              <span className="title-text">"අ"යන්න කියන්න</span>
            </LogoTitle>

            {!isMobile && (
              <Box sx={{
                display: 'flex',
                mx: 'auto',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '4px',
                backdropFilter: 'blur(5px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.1)'
              }}>
                {navItems.map((item) => (
                  <NavButton
                    key={item.name}
                    href={item.path}
                    className={isActive(item.path) ? 'active' : ''}
                  >
                    {item.name}
                  </NavButton>
                ))}
              </Box>
            )}

            {isMobile && (
                <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
                <MobileMenuButton
                ref={mobileMenuButtonRef}
                startIcon={<ExploreIcon fontSize="small" sx={{ color: 'white' }} />}
                onClick={toggleMobileMenu}
                open={mobileMenuOpen}
                sx={{
                  color: 'white',
                  border: '2px solid rgba(255, 255, 255, 0.5)', // Made border more visible
                  backgroundColor: mobileMenuOpen ? 'rgba(179, 136, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    borderColor: 'white'
                  },
                  // Add some debugging styles
                  minHeight: '30px',
                  minWidth: '80px',
                  fontSize: '0.65rem'
                }}
              >
                {mobileMenuOpen ? 'Close' : 'Explore'}
              </MobileMenuButton>
                </Box>
            )}

            <Box sx={{ flexGrow: isMobile ? 0 : 1 }} />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {userEmail ? (
                <>
                  <CartIcon />
                  <IconButton
                    size="large"
                    aria-label="notifications"
                    color="inherit"
                    onClick={() => navigate('/notifications')}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(179, 136, 255, 0.1)'
                      }
                    }}
                  >
                    <Badge badgeContent={unreadCount} color="secondary">
                      <NotificationsIcon />
                    </Badge>
                  </IconButton>

                  <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenuOpen}
                    color="inherit"
                    sx={{
                      '&:hover': {
                        transform: 'scale(1.1)',
                      },
                      transition: 'transform 0.3s ease'
                    }}
                  >
                    <Avatar sx={{
                      width: 36,
                      height: 36,
                      bgcolor: '#b388ff',
                      color: '#1a0638',
                      border: '2px solid #ffffff',
                      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
                    }}>
                      {userEmail.charAt(0).toUpperCase()}
                    </Avatar>
                  </IconButton>

                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    PaperProps={{
                      style: {
                        marginTop: '10px',
                        backgroundColor: alpha('#2e0b5e', 0.98),
                        backdropFilter: 'blur(20px)',
                        color: 'white',
                        borderRadius: '12px',
                        border: '1px solid rgba(179, 136, 255, 0.2)',
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
                        minWidth: '200px',
                      },
                    }}
                  >
                    <MenuItem
                      onClick={handleMenuClose}
                      sx={{
                        '&:hover': {
                          backgroundColor: 'rgba(179, 136, 255, 0.1)',
                        },
                        '&:first-of-type': {
                          borderTopLeftRadius: '8px',
                          borderTopRightRadius: '8px',
                        }
                      }}
                    >
                      Profile
                    </MenuItem>
                    <MenuItem
                      onClick={handleMenuClose}
                      sx={{
                        '&:hover': {
                          backgroundColor: 'rgba(179, 136, 255, 0.1)',
                        }
                      }}
                    >
                      Settings
                    </MenuItem>
                    <Divider sx={{ borderColor: 'rgba(179, 136, 255, 0.2)' }} />
                    <MenuItem
                      onClick={handleLogout}
                      sx={{
                        '&:hover': {
                          backgroundColor: 'rgba(255, 0, 0, 0.1)',
                        },
                        '&:last-of-type': {
                          borderBottomLeftRadius: '8px',
                          borderBottomRightRadius: '8px',
                        }
                      }}
                    >
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  {!isMobile ? (
                    <>
                      <AuthButton
                        variant="outlined"
                        color="inherit"
                        onClick={() => navigate("/login")}
                        sx={{
                          borderColor: 'rgba(179, 136, 255, 0.3)',
                          '&:hover': {
                            backgroundColor: 'rgba(179, 136, 255, 0.1)',
                            borderColor: '#b388ff'
                          }
                        }}
                      >
                        Sign In
                      </AuthButton>
                      <AuthButton
                        variant="contained"
                        color="secondary"
                        onClick={() => navigate("/register")}
                        sx={{
                          backgroundColor: '#b388ff',
                          color: '#1a0638',
                          '&:hover': {
                            backgroundColor: '#9c64ff',
                            transform: 'translateY(-3px)',
                            color: '#1a0638',
                          }
                        }}
                      >
                        Sign Up
                      </AuthButton>
                    </>
                  ) : (
                    <>
                      <IconButton
                        color="inherit"
                        onClick={() => navigate("/login")}
                        sx={{
                          ml: 1,
                          '&:hover': {
                            backgroundColor: 'rgba(179, 136, 255, 0.2)',
                            transform: 'scale(1.1)'
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <LoginIcon />
                      </IconButton>
                      <IconButton
                        color="inherit"
                        onClick={() => navigate("/register")}
                        sx={{
                          backgroundColor: 'rgba(179, 136, 255, 0.3)',
                          ml: 1,
                          '&:hover': {
                            backgroundColor: 'rgba(179, 136, 255, 0.5)',
                            transform: 'scale(1.1)'
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <PersonAddIcon />
                      </IconButton>
                    </>
                  )}
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </StyledAppBar>

      {/* Mobile menu dropdown - moved outside Container */}
      {isMobile && (
        <Collapse
          in={mobileMenuOpen}
          timeout="auto"
          unmountOnExit
          ref={mobileMenuRef}
          sx={{
            position: 'fixed',
            top: '64px', // Height of AppBar
            left: 0,
            right: 0,
            backgroundColor: alpha('#1a0638', 0.95),
            backdropFilter: 'blur(20px)',
            zIndex: 1300, // Higher than AppBar
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
            borderBottom: '1px solid rgba(179, 136, 255, 0.2)',
            width: '100vw',
            maxHeight: 'calc(100vh - 64px)',
            overflowY: 'auto'
          }}
        >
          <Box sx={{ p: 2 }}>
            <List sx={{ py: 0 }}>
              {navItems.map((item) => (
                <ListItem
                  button
                  key={item.name}
                  component="a"
                  href={item.path}
                  onClick={() => {
                    console.log('Menu item clicked:', item.name);
                    setMobileMenuOpen(false);
                  }}
                  sx={{
                    borderRadius: '8px',
                    mb: 0.5,
                    transition: 'all 0.3s ease',
                    backgroundColor: isActive(item.path) ? 'rgba(179, 136, 255, 0.2)' : 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(179, 136, 255, 0.1)',
                      transform: 'translateX(5px)'
                    },
                    display: 'flex',
                    justifyContent: 'center',
                    textAlign: 'center'
                  }}
                >
                  <ListItemIcon sx={{
                    color: isActive(item.path) ? '#b388ff' : 'white',
                    minWidth: 'auto',
                    mr: 1
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.name}
                    primaryTypographyProps={{
                      color: isActive(item.path) ? '#b388ff' : 'white',
                      fontWeight: 500,
                      variant: 'body1'
                    }}
                    sx={{
                      flex: 'none',
                      textAlign: 'center'
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Collapse>
      )}

      {/* Add padding to content to account for fixed header */}
      <Toolbar />
    </>
  );
};

export default Header;