import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  School as SchoolIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  People as PeopleIcon,
  Payment as PaymentIcon,
  Computer as ComputerIcon,
  Home as HomeIcon,
  SettingsInputComponent as HybridIcon,
  Login as LoginIcon,
  PersonAdd as PersonAddIcon,
  Info as InfoIcon,
  Map as MapIcon
} from '@mui/icons-material';
import axios from 'axios';

const ClassesInfoPage = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showStudentDialog, setShowStudentDialog] = useState(false);
  const [showNotStudentDialog, setShowNotStudentDialog] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    const userEmail = localStorage.getItem('userEmail');
    const token = localStorage.getItem('token');

    if (!userEmail || !token) {
      setShowLoginDialog(true);
      setLoading(false);
      return;
    }

    try {
      // Check user role from database
      const response = await axios.get('https://ayanna-kiyanna-new-backend.onrender.com/api/auth/me', {
        headers: { 'x-auth-token': token }
      });

      setUserRole(response.data.role);
      setIsAuthenticated(true);
      fetchClasses();
    } catch (err) {
      console.error('Authentication error:', err);
      setShowLoginDialog(true);
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await axios.get('https://ayanna-kiyanna-new-backend.onrender.com/api/classes/public-classes');
      setClasses(response.data.classes || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching classes:', err);
      setError('Failed to load classes. Please try again later.');
      setLoading(false);
    }
  };

  const handleEnrollClick = async (classItem) => {
    try {
      const token = localStorage.getItem('token');
      
      // Check if user is already a student
      const studentResponse = await axios.get(
        'https://ayanna-kiyanna-new-backend.onrender.com/api/students/profile',
        { headers: { 'x-auth-token': token } }
      );

      if (studentResponse.data) {
        // User is already a student
        setShowStudentDialog(true);
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        // User is not a student
        setShowNotStudentDialog(true);
      } else {
        console.error('Error checking student status:', err);
        setError('Failed to check student status. Please try again.');
      }
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  const handleStudentRegistrationRedirect = () => {
    navigate('/student-registration');
  };

  const handleStudentDashboardRedirect = () => {
    navigate('/student-dashboard');
  };

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'Online':
        return <ComputerIcon />;
      case 'Physical':
        return <HomeIcon />;
      case 'Hybrid':
        return <HybridIcon />;
      default:
        return <SchoolIcon />;
    }
  };

  const formatTime = (time) => {
    if (!time) return '';
    return time.substring(0, 5); // Remove seconds if present
  };


  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} sx={{ color: '#7B1FA2' }} />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <Typography
          variant="h2"
          component="h1"
          sx={{
            fontWeight: 'bold',
            color: '#4A148C',
            mb: 2,
            textShadow: '3px 3px 6px rgba(74, 20, 140, 0.3)',
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
          }}
        >
          පන්ති සහ කාල සටහන්
        </Typography>
        <Typography
          variant="h5"
          sx={{
            color: '#7B1FA2',
            mb: 2,
            maxWidth: '900px',
            mx: 'auto',
            lineHeight: 1.8,
            fontWeight: 'medium',
            fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' }
          }}
        >
          අයන්න කියන්න ආයතනයේ සියලුම පන්ති සහ කාල සටහන් පිළිබඳ සම්පූර්ණ විස්තර
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: '#9C27B0',
            mb: 4,
            maxWidth: '700px',
            mx: 'auto',
            lineHeight: 1.6,
            fontSize: '1.1rem'
          }}
        >
          ඔබට අවශ්‍ය පන්තියක් තෝරාගෙන ලියාපදිංචි වීමට හැකිය. සෑම පන්තියකම සම්පූර්ණ තොරතුරු පහත දැක්වේ.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Divider sx={{
            bgcolor: 'linear-gradient(90deg, #BA68C8, #E1BEE7, #BA68C8)',
            height: 4,
            width: '150px',
            borderRadius: 2
          }} />
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

{/* Classes Grid */}
{isAuthenticated && (
    <Box sx={{ 
    width: '100%',
    display: 'flex',
    justifyContent: 'center'
  }}>
    <Grid 
      container 
      spacing={3} 
      sx={{ 
        alignItems: 'stretch',
        maxWidth: 'lg', // Limits maximum width to prevent too many cards per row
        width: '100%',
        justifyContent: 'center' // Centers the grid items
      }}
    >
    {classes.length === 0 ? (
      <Grid item xs={12}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <SchoolIcon sx={{ fontSize: 80, color: '#BA68C8', mb: 2 }} />
          <Typography variant="h5" sx={{ color: '#7B1FA2', mb: 1 }}>
            පන්ති නොමැත
          </Typography>
          <Typography variant="body1" sx={{ color: '#666' }}>
            දැනට ලියාපදිංචි වීම සඳහා සක්‍රිය පන්ති නොමැත.
          </Typography>
        </Box>
      </Grid>
    ) : (
      classes.map((classItem) => (
         <Grid 
            item 
            xs={12} 
            sm={6} 
            md={4} 
            lg={4} // Explicitly set lg to 4 to prevent 4 cards on extra large screens
            key={classItem._id}
            sx={{
              display: 'flex',
              maxWidth: { md: 'calc(33.333% - 24px)' } // Ensures exactly 3 cards per row
            }}
          >
          <Card
            sx={{
              width: '350px', // Takes full width of grid item
              height: '100%', // Fills the grid item height
              display: 'flex',
              flexDirection: 'column',
              background: 'linear-gradient(135deg, #F8F4FF 0%, #F3E5F5 50%, #E8D5ED 100%)',
              border: '3px solid #BA68C8',
              borderRadius: 4,
              boxShadow: '0 8px 32px rgba(123, 31, 162, 0.15)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '6px',
                background: 'linear-gradient(90deg, #7B1FA2, #9C27B0, #BA68C8, #E1BEE7)',
              },
              '&:hover': {
                boxShadow: '0 12px 40px rgba(123, 31, 162, 0.25)',
                border: '3px solid #7B1FA2',
                transform: 'translateY(-4px)'
              }
            }}
          >
            <CardContent sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1, // Makes content fill available space
              pt: 4
            }}>
              {/* Class Header */}
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 3,
                p: 2,
                bgcolor: 'rgba(123, 31, 162, 0.08)',
                borderRadius: 3,
                border: '2px solid rgba(123, 31, 162, 0.2)'
              }}>
                <Box sx={{
                  p: 1,
                  borderRadius: '50%',
                  bgcolor: '#7B1FA2',
                  mr: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {React.cloneElement(getPlatformIcon(classItem.platform), {
                    sx: { color: 'white', fontSize: 24 }
                  })}
                </Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 'bold',
                    color: '#4A148C',
                    textAlign: 'center',
                    fontSize: '1.2rem'
                  }}
                >
                  {classItem.grade}
                </Typography>
              </Box>

              {/* Class Details Chips */}
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 3, flexWrap: 'wrap' }}>
                <Chip
                  label={classItem.category}
                  sx={{
                    bgcolor: '#7B1FA2',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '0.85rem',
                    px: 1
                  }}
                />
                <Chip
                  label={classItem.platform}
                  sx={{
                    bgcolor: '#9C27B0',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '0.85rem',
                    px: 1
                  }}
                />
              </Box>

              {/* Class Information */}
              <Box sx={{ flexGrow: 1, mb: 3 }}>
                {/* Schedule Info */}
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: 2,
                  p: 1.5,
                  bgcolor: 'rgba(156, 39, 176, 0.05)',
                  borderRadius: 2,
                  border: '1px solid rgba(156, 39, 176, 0.1)'
                }}>
                  <ScheduleIcon sx={{ fontSize: 20, color: '#7B1FA2', mr: 1.5 }} />
                  <Box>
                    <Typography variant="body2" sx={{ color: '#4A148C', fontWeight: 'bold', fontSize: '0.9rem' }}>
                      දිනය සහ වේලාව
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6A1B9A', fontSize: '0.85rem' }}>
                      {classItem.date}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6A1B9A', fontSize: '0.85rem' }}>
                      {formatTime(classItem.startTime)} - {formatTime(classItem.endTime)}
                    </Typography>
                  </Box>
                </Box>

                {/* Venue */}
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: 2,
                  p: 1.5,
                  bgcolor: 'rgba(156, 39, 176, 0.05)',
                  borderRadius: 2,
                  border: '1px solid rgba(156, 39, 176, 0.1)'
                }}>
                  <LocationIcon sx={{ fontSize: 20, color: '#7B1FA2', mr: 1.5 }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" sx={{ color: '#4A148C', fontWeight: 'bold', fontSize: '0.9rem' }}>
                      ස්ථානය
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6A1B9A', fontSize: '0.85rem' }}>
                      {classItem.venue}
                    </Typography>
                    {classItem.locationLink && (
                      <Button
                        size="small"
                        startIcon={<MapIcon />}
                        onClick={() => window.open(classItem.locationLink, '_blank')}
                        sx={{
                          mt: 0.5,
                          color: '#7B1FA2',
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                          textTransform: 'none',
                          p: 0.5,
                          minWidth: 'auto',
                          '&:hover': {
                            bgcolor: 'rgba(123, 31, 162, 0.1)'
                          }
                        }}
                      >
                        සිතියම බලන්න
                      </Button>
                    )}
                  </Box>
                </Box>

                {/* Capacity */}
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: 2,
                  p: 1.5,
                  bgcolor: 'rgba(156, 39, 176, 0.05)',
                  borderRadius: 2,
                  border: '1px solid rgba(156, 39, 176, 0.1)'
                }}>
                  <PeopleIcon sx={{ fontSize: 20, color: '#7B1FA2', mr: 1.5 }} />
                  <Box>
                    <Typography variant="body2" sx={{ color: '#4A148C', fontWeight: 'bold', fontSize: '0.9rem' }}>
                      ධාරිතාව
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6A1B9A', fontSize: '0.85rem' }}>
                      ලියාපදිංචි: {classItem.enrolledCount || 0}/{classItem.capacity}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#2E7D32', fontSize: '0.85rem', fontWeight: 'bold' }}>
                      ඉතිරි ස්ථාන: {classItem.availableSpots}
                    </Typography>
                  </Box>
                </Box>

                {/* Monthly Fee */}
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: 2,
                  p: 1.5,
                  bgcolor: 'rgba(156, 39, 176, 0.05)',
                  borderRadius: 2,
                  border: '1px solid rgba(156, 39, 176, 0.1)'
                }}>
                  <PaymentIcon sx={{ fontSize: 20, color: '#7B1FA2', mr: 1.5 }} />
                  <Box>
                    <Typography variant="body2" sx={{ color: '#4A148C', fontWeight: 'bold', fontSize: '0.9rem' }}>
                      මාසික ගාස්තුව
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6A1B9A', fontSize: '0.9rem', fontWeight: 'bold' }}>
                      රු. {classItem.monthlyFee ? classItem.monthlyFee.toLocaleString() : 'නොමිලේ'} /=
                    </Typography>
                  </Box>
                </Box>

                {/* Special Note */}
                {classItem.specialNote && (
                  <Box sx={{
                    mb: 2,
                    p: 1.5,
                    bgcolor: 'rgba(255, 193, 7, 0.1)',
                    borderRadius: 2,
                    border: '1px solid rgba(255, 193, 7, 0.3)'
                  }}>
                    <Typography variant="body2" sx={{ color: '#4A148C', fontWeight: 'bold', fontSize: '0.9rem', mb: 0.5 }}>
                      විශේෂ සටහන
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#6A1B9A',
                        fontSize: '0.85rem',
                        fontStyle: 'italic'
                      }}
                    >
                      {classItem.specialNote}
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Enroll Button */}
              <Box sx={{ mt: 'auto' }}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={() => handleEnrollClick(classItem)}
                  disabled={classItem.availableSpots <= 0}
                  sx={{
                    background: classItem.availableSpots <= 0
                      ? 'linear-gradient(45deg, #9E9E9E 30%, #757575 90%)'
                      : 'linear-gradient(45deg, #7B1FA2 30%, #9C27B0 90%)',
                    color: 'white',
                    fontWeight: 'bold',
                    py: 1.8,
                    borderRadius: 3,
                    fontSize: '1rem',
                    textTransform: 'none',
                    boxShadow: classItem.availableSpots <= 0
                      ? 'none'
                      : '0 4px 15px rgba(123, 31, 162, 0.3)',
                    '&:hover': {
                      background: classItem.availableSpots <= 0
                        ? 'linear-gradient(45deg, #9E9E9E 30%, #757575 90%)'
                        : 'linear-gradient(45deg, #6A1B9A 30%, #8E24AA 90%)',
                      boxShadow: classItem.availableSpots <= 0
                        ? 'none'
                        : '0 6px 20px rgba(123, 31, 162, 0.4)'
                    }
                  }}
                >
                  {classItem.availableSpots <= 0 ? 'පන්තිය සම්පූර්ණයි' : 'දැන් ලියාපදිංචි වන්න'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))
    )}
  </Grid>
  </Box>
)}

      {/* Login Required Dialog */}
      <Dialog
        open={showLoginDialog}
        onClose={() => setShowLoginDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: 'linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%)',
            border: '2px solid #BA68C8'
          }
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', color: '#4A148C', fontWeight: 'bold' }}>
          <LoginIcon sx={{ fontSize: 40, mb: 1, display: 'block', mx: 'auto' }} />
          Authentication Required
        </DialogTitle>
        <DialogContent>
          <Typography
            variant="body1"
            sx={{
              textAlign: 'center',
              color: '#7B1FA2',
              fontSize: '1.1rem',
              lineHeight: 1.6
            }}
          >
            පන්ති සහ කාල සටහන් බැලීමට ප්‍රථමයෙන් ඔබ ලොගින් වීම හෝ ලියාපදිංචි වීම අවශ්‍ය වේ.
            <br /><br />
            කරුණාකර ඔබේ ගිණුමට ප්‍රවේශ වන්න.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button
            onClick={handleLoginRedirect}
            variant="contained"
            startIcon={<LoginIcon />}
            sx={{
              background: 'linear-gradient(45deg, #7B1FA2 30%, #9C27B0 90%)',
              color: 'white',
              fontWeight: 'bold',
              px: 4,
              py: 1,
              borderRadius: 2,
              '&:hover': {
                background: 'linear-gradient(45deg, #6A1B9A 30%, #8E24AA 90%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 12px rgba(123, 31, 162, 0.4)'
              }
            }}
          >
            Login / Sign Up
          </Button>
        </DialogActions>
      </Dialog>

      {/* Already Student Dialog */}
      <Dialog
        open={showStudentDialog}
        onClose={() => setShowStudentDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: 'linear-gradient(135deg, #E8F5E8 0%, #C8E6C9 100%)',
            border: '2px solid #4CAF50'
          }
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', color: '#2E7D32', fontWeight: 'bold' }}>
          <SchoolIcon sx={{ fontSize: 40, mb: 1, display: 'block', mx: 'auto' }} />
          Already a Student
        </DialogTitle>
        <DialogContent>
          <Typography
            variant="body1"
            sx={{
              textAlign: 'center',
              color: '#388E3C',
              fontSize: '1.1rem',
              lineHeight: 1.6
            }}
          >
            ඔබ දැනටමත් අපගේ ආයතනයේ ශිෂ්‍යයෙකු වේ!
            <br /><br />
            වෙනත් පන්ති සඳහා ලියාපදිංචි වීමට ඔබේ පුද්ගලික ශිෂ්‍ය ඩෑෂ්බෝඩ් භාවිතා කරන්න.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button
            onClick={() => setShowStudentDialog(false)}
            variant="outlined"
            sx={{
              color: '#388E3C',
              borderColor: '#4CAF50',
              mr: 2,
              '&:hover': {
                borderColor: '#2E7D32',
                backgroundColor: 'rgba(76, 175, 80, 0.1)'
              }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleStudentDashboardRedirect}
            variant="contained"
            startIcon={<SchoolIcon />}
            sx={{
              background: 'linear-gradient(45deg, #4CAF50 30%, #66BB6A 90%)',
              color: 'white',
              fontWeight: 'bold',
              px: 3,
              '&:hover': {
                background: 'linear-gradient(45deg, #388E3C 30%, #4CAF50 90%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 12px rgba(76, 175, 80, 0.4)'
              }
            }}
          >
            Go to Dashboard
          </Button>
        </DialogActions>
      </Dialog>

      {/* Not a Student Dialog */}
      <Dialog
        open={showNotStudentDialog}
        onClose={() => setShowNotStudentDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)',
            border: '2px solid #FF9800'
          }
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', color: '#E65100', fontWeight: 'bold' }}>
          <PersonAddIcon sx={{ fontSize: 40, mb: 1, display: 'block', mx: 'auto' }} />
          Student Registration Required
        </DialogTitle>
        <DialogContent>
          <Typography
            variant="body1"
            sx={{
              textAlign: 'center',
              color: '#F57C00',
              fontSize: '1.1rem',
              lineHeight: 1.6
            }}
          >
            පන්තියකට ලියාපදිංචි වීමට ප්‍රථමයෙන් ඔබ ශිෂ්‍යයෙකු ලෙස ලියාපදිංචි විය යුතුය.
            <br /><br />
            කරුණාකර ශිෂ්‍ය ලියාපදිංචි කිරීමේ පිටුවට යන්න.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button
            onClick={() => setShowNotStudentDialog(false)}
            variant="outlined"
            sx={{
              color: '#F57C00',
              borderColor: '#FF9800',
              mr: 2,
              '&:hover': {
                borderColor: '#E65100',
                backgroundColor: 'rgba(255, 152, 0, 0.1)'
              }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleStudentRegistrationRedirect}
            variant="contained"
            startIcon={<PersonAddIcon />}
            sx={{
              background: 'linear-gradient(45deg, #FF9800 30%, #FFB74D 90%)',
              color: 'white',
              fontWeight: 'bold',
              px: 3,
              '&:hover': {
                background: 'linear-gradient(45deg, #F57C00 30%, #FF9800 90%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 12px rgba(255, 152, 0, 0.4)'
              }
            }}
          >
            Register as Student
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ClassesInfoPage;
