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
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          sx={{ 
            fontWeight: 'bold', 
            color: '#4A148C',
            mb: 2,
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          Classes & Time Tables
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            color: '#7B1FA2', 
            mb: 3,
            maxWidth: '800px',
            mx: 'auto',
            lineHeight: 1.6
          }}
        >
          අයන්න කියන්න ආයතනයේ සියලුම සාමාන්‍ය පන්ති සහ කාල සටහන් පිළිබඳ විස්තර මෙහි දැක්වේ. 
          ඔබට අවශ්‍ය පන්තියක් තෝරාගෙන ලියාපදිංචි වීමට හැකිය.
        </Typography>
        <Divider sx={{ bgcolor: '#BA68C8', height: 2, width: '100px', mx: 'auto' }} />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Classes Grid */}
      {isAuthenticated && (
        <Grid container spacing={3}>
          {classes.length === 0 ? (
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <SchoolIcon sx={{ fontSize: 80, color: '#BA68C8', mb: 2 }} />
                <Typography variant="h5" sx={{ color: '#7B1FA2', mb: 1 }}>
                  No Classes Available
                </Typography>
                <Typography variant="body1" sx={{ color: '#666' }}>
                  Currently, there are no active classes available for enrollment.
                </Typography>
              </Box>
            </Grid>
          ) : (
            classes.map((classItem) => (
              <Grid item xs={12} sm={6} md={4} key={classItem._id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    background: 'linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%)',
                    border: '2px solid #BA68C8',
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 24px rgba(123, 31, 162, 0.3)',
                      border: '2px solid #7B1FA2'
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    {/* Class Header */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      {getPlatformIcon(classItem.platform)}
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          ml: 1, 
                          fontWeight: 'bold', 
                          color: '#4A148C',
                          fontSize: '1.1rem'
                        }}
                      >
                        {classItem.grade}
                      </Typography>
                    </Box>

                    {/* Class Details */}
                    <Box sx={{ mb: 2 }}>
                      <Chip 
                        label={classItem.category} 
                        size="small" 
                        sx={{ 
                          bgcolor: '#7B1FA2', 
                          color: 'white', 
                          fontWeight: 'bold',
                          mb: 1
                        }} 
                      />
                      <Chip 
                        label={classItem.platform} 
                        size="small" 
                        sx={{ 
                          bgcolor: '#BA68C8', 
                          color: 'white', 
                          ml: 1,
                          mb: 1
                        }} 
                      />
                    </Box>

                    {/* Schedule Info */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <ScheduleIcon sx={{ fontSize: 18, color: '#7B1FA2', mr: 1 }} />
                      <Typography variant="body2" sx={{ color: '#4A148C', fontWeight: 'medium' }}>
                        {(classItem.date)} | {formatTime(classItem.startTime)} - {formatTime(classItem.endTime)}
                      </Typography>
                    </Box>

                    {/* Venue */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationIcon sx={{ fontSize: 18, color: '#7B1FA2', mr: 1 }} />
                      <Typography variant="body2" sx={{ color: '#4A148C', fontWeight: 'medium' }}>
                        {classItem.venue}
                      </Typography>
                      {classItem.locationLink && (
                        <Tooltip title="View on Map">
                          <IconButton 
                            size="small" 
                            sx={{ ml: 1, color: '#7B1FA2' }}
                            onClick={() => window.open(classItem.locationLink, '_blank')}
                          >
                            <MapIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>

                    {/* Capacity */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <PeopleIcon sx={{ fontSize: 18, color: '#7B1FA2', mr: 1 }} />
                      <Typography variant="body2" sx={{ color: '#4A148C', fontWeight: 'medium' }}>
                        {classItem.enrolledCount || 0}/{classItem.capacity} 
                        <span style={{ color: '#2E7D32', marginLeft: '8px' }}>
                          ({classItem.availableSpots} Available)
                        </span>
                      </Typography>
                    </Box>

                    {/* Monthly Fee */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <PaymentIcon sx={{ fontSize: 18, color: '#7B1FA2', mr: 1 }} />
                      <Typography variant="body2" sx={{ color: '#4A148C', fontWeight: 'bold' }}>
                        Rs. {classItem.monthlyFee ? classItem.monthlyFee.toLocaleString() : 'Free'}/month
                      </Typography>
                    </Box>

                    {/* Special Note */}
                    {classItem.specialNote && (
                      <Box sx={{ mb: 2 }}>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#6A1B9A', 
                            fontStyle: 'italic',
                            bgcolor: 'rgba(186, 104, 200, 0.1)',
                            p: 1,
                            borderRadius: 1,
                            border: '1px solid rgba(186, 104, 200, 0.3)'
                          }}
                        >
                          <InfoIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                          {classItem.specialNote}
                        </Typography>
                      </Box>
                    )}

                    {/* Enroll Button */}
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => handleEnrollClick(classItem)}
                      disabled={classItem.availableSpots <= 0}
                      sx={{
                        background: classItem.availableSpots <= 0 
                          ? 'linear-gradient(45deg, #9E9E9E 30%, #757575 90%)'
                          : 'linear-gradient(45deg, #7B1FA2 30%, #9C27B0 90%)',
                        color: 'white',
                        fontWeight: 'bold',
                        py: 1.5,
                        borderRadius: 2,
                        '&:hover': {
                          background: classItem.availableSpots <= 0 
                            ? 'linear-gradient(45deg, #9E9E9E 30%, #757575 90%)'
                            : 'linear-gradient(45deg, #6A1B9A 30%, #8E24AA 90%)',
                          transform: classItem.availableSpots <= 0 ? 'none' : 'translateY(-2px)',
                          boxShadow: classItem.availableSpots <= 0 ? 'none' : '0 6px 12px rgba(123, 31, 162, 0.4)'
                        }
                      }}
                    >
                      {classItem.availableSpots <= 0 ? 'Class Full' : 'Enroll Now'}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
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
