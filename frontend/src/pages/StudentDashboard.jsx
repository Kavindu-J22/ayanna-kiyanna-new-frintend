import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Badge,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  School,
  Person,
  Class as ClassIcon,
  Schedule,
  CheckCircle,
  Pending,
  Lock,
  Visibility,
  Add,
  Notifications,
  Dashboard as DashboardIcon,
  LocationOn,
  AccessTime,
  Group,
  Delete
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const StudentDashboard = () => {
  const navigate = useNavigate();

  const [error, setError] = useState('');
  const [student, setStudent] = useState(null);
  const [availableClasses, setAvailableClasses] = useState([]);
  const [classRequests, setClassRequests] = useState([]);
  const [showPasswordDialog, setShowPasswordDialog] = useState(true);
  const [studentPassword, setStudentPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [authenticating, setAuthenticating] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [requestReason, setRequestReason] = useState('');
  const [submittingRequest, setSubmittingRequest] = useState(false);

  // Forgot Password States
  const [showForgotPasswordDialog, setShowForgotPasswordDialog] = useState(false);
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [showNewPasswordDialog, setShowNewPasswordDialog] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [forgotPasswordError, setForgotPasswordError] = useState('');
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);

  // Grade Filter States
  const [availableGrades, setAvailableGrades] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState('');
  const [loadingGrades, setLoadingGrades] = useState(false);

  useEffect(() => {
    const checkUserAccess = async () => {
      // Check if user is logged in
      const userEmail = localStorage.getItem('userEmail');
      const token = localStorage.getItem('token');

      if (!userEmail || !token) {
        setError('Please login first');
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      try {
        // Check user role from database
        const response = await axios.get('https://ayanna-kiyanna-new-backend.onrender.com/api/auth/me', {
          headers: { 'x-auth-token': token }
        });

        const currentUserRole = response.data.role;

        if (currentUserRole !== 'student') {
          setError('Access denied. Student role required.');
          setTimeout(() => navigate('/'), 3000);
          return;
        }

        // Dashboard data will be loaded after successful login
      } catch (error) {
        console.error('Error checking user role:', error);
        if (error.response?.status === 401) {
          setError('Your session has expired. Please login again.');
          localStorage.removeItem('token');
          localStorage.removeItem('userEmail');
          localStorage.removeItem('userRole');
          setTimeout(() => navigate('/login'), 3000);
        } else {
          setError('Failed to verify user permissions.');
          setTimeout(() => navigate('/'), 3000);
        }
      }
    };

    checkUserAccess();
  }, [navigate, authenticated]);

  // Load grades when authenticated
  useEffect(() => {
    if (authenticated) {
      loadGrades();
    }
  }, [authenticated]);



  const loadAdditionalData = async () => {
    try {
      const token = localStorage.getItem('token');

      // Load available classes (with error handling)
      try {
        const classesResponse = await axios.get(
          'https://ayanna-kiyanna-new-backend.onrender.com/api/students/available-classes',
          { headers: { 'x-auth-token': token } }
        );
        setAvailableClasses(classesResponse.data.classes || []);
      } catch (error) {
        console.error('Error loading available classes:', error);
        setAvailableClasses([]);
      }

      // Load class requests (with error handling)
      try {
        const requestsResponse = await axios.get(
          'https://ayanna-kiyanna-new-backend.onrender.com/api/students/class-requests',
          { headers: { 'x-auth-token': token } }
        );
        setClassRequests(requestsResponse.data.requests || []);
      } catch (error) {
        console.error('Error loading class requests:', error);
        setClassRequests([]);
      }
    } catch (error) {
      console.error('Error loading additional data:', error);
    }
  };

  const handleStudentLogin = async () => {
    if (!studentPassword) {
      setPasswordError('Please enter your student password');
      return;
    }

    setAuthenticating(true);
    setPasswordError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'https://ayanna-kiyanna-new-backend.onrender.com/api/students/login',
        { studentPassword },
        { headers: { 'x-auth-token': token } }
      );

      // Set student data from login response
      setStudent(response.data.student);
      setAuthenticated(true);
      setShowPasswordDialog(false);

      // Load additional data separately with error handling
      await loadAdditionalData();
    } catch (error) {
      setPasswordError(error.response?.data?.message || 'Invalid student password');
    } finally {
      setAuthenticating(false);
    }
  };

  const handleClassEnrollment = (classItem) => {
    setSelectedClass(classItem);
    setShowRequestDialog(true);
    setRequestReason('');
  };

  const submitClassRequest = async () => {
    if (!requestReason.trim()) {
      alert('Please enter a reason for your enrollment request');
      return;
    }

    if (requestReason.trim().length < 10) {
      alert('Please provide a more detailed reason (at least 10 characters)');
      return;
    }

    setSubmittingRequest(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'https://ayanna-kiyanna-new-backend.onrender.com/api/class-requests',
        {
          classId: selectedClass._id,
          reason: requestReason.trim()
        },
        { headers: { 'x-auth-token': token } }
      );

      // Reload data
      await loadAdditionalData();
      setShowRequestDialog(false);
      alert('Class enrollment request submitted successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit enrollment request');
    } finally {
      setSubmittingRequest(false);
    }
  };

  const deleteClassRequest = async (requestId) => {
    if (!window.confirm('Are you sure you want to delete this class request?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/class-requests/${requestId}`,
        { headers: { 'x-auth-token': token } }
      );

      // Reload data
      await loadAdditionalData();
      alert('Class request deleted successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete class request');
    }
  };

  // Forgot Password Functions
  const handleForgotPassword = () => {
    setShowPasswordDialog(false);
    setForgotPasswordError('');

    // Check if email is stored in localStorage
    const storedEmail = localStorage.getItem('userEmail');

    if (storedEmail) {
      // If email is stored, use it directly and send OTP
      setForgotPasswordEmail(storedEmail);
      sendPasswordResetOTPDirectly(storedEmail);
    } else {
      // If no email stored, show email input dialog
      setForgotPasswordEmail('');
      setShowForgotPasswordDialog(true);
    }
  };

  const sendPasswordResetOTPDirectly = async (email) => {
    setForgotPasswordLoading(true);
    setForgotPasswordError('');

    try {
      await axios.post('https://ayanna-kiyanna-new-backend.onrender.com/api/students/forgot-password', {
        email: email
      });

      setShowOtpDialog(true);
      alert(`Password reset code sent to ${email}!`);
    } catch (error) {
      setForgotPasswordError(error.response?.data?.message || 'Failed to send reset code');
      // If there's an error, show the email input dialog
      setShowForgotPasswordDialog(true);
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const sendPasswordResetOTP = async () => {
    if (!forgotPasswordEmail) {
      setForgotPasswordError('Please enter your email address');
      return;
    }

    setForgotPasswordLoading(true);
    setForgotPasswordError('');

    try {
      await axios.post('https://ayanna-kiyanna-new-backend.onrender.com/api/students/forgot-password', {
        email: forgotPasswordEmail
      });

      setShowForgotPasswordDialog(false);
      setShowOtpDialog(true);
      alert('Password reset code sent to your email!');
    } catch (error) {
      setForgotPasswordError(error.response?.data?.message || 'Failed to send reset code');
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const verifyOTPAndProceed = async () => {
    if (!otpCode || otpCode.length !== 6) {
      setForgotPasswordError('Please enter a valid 6-digit OTP');
      return;
    }

    setForgotPasswordLoading(true);
    setForgotPasswordError('');

    try {
      await axios.post('https://ayanna-kiyanna-new-backend.onrender.com/api/students/verify-reset-otp', {
        email: forgotPasswordEmail,
        otp: otpCode
      });

      setShowOtpDialog(false);
      setShowNewPasswordDialog(true);
    } catch (error) {
      setForgotPasswordError(error.response?.data?.message || 'Invalid or expired OTP');
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const resetPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      setForgotPasswordError('Password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setForgotPasswordError('Passwords do not match');
      return;
    }

    setForgotPasswordLoading(true);
    setForgotPasswordError('');

    try {
      await axios.post('https://ayanna-kiyanna-new-backend.onrender.com/api/students/reset-password', {
        email: forgotPasswordEmail,
        otp: otpCode,
        newPassword: newPassword
      });

      // Reset all states
      setShowNewPasswordDialog(false);
      setShowPasswordDialog(true);
      setForgotPasswordEmail('');
      setOtpCode('');
      setNewPassword('');
      setConfirmPassword('');
      setForgotPasswordError('');

      alert('Password reset successfully! You can now login with your new password.');
    } catch (error) {
      setForgotPasswordError(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  // Grade Filter Functions
  const loadGrades = async () => {
    setLoadingGrades(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'https://ayanna-kiyanna-new-backend.onrender.com/api/students/grades',
        { headers: { 'x-auth-token': token } }
      );
      setAvailableGrades(response.data.grades || []);
    } catch (error) {
      console.error('Error loading grades:', error);
      setAvailableGrades([]);
    } finally {
      setLoadingGrades(false);
    }
  };

  const loadFilteredClasses = async (grade = '') => {
    try {
      const token = localStorage.getItem('token');
      const url = grade
        ? `https://ayanna-kiyanna-new-backend.onrender.com/api/students/available-classes?grade=${encodeURIComponent(grade)}`
        : 'https://ayanna-kiyanna-new-backend.onrender.com/api/students/available-classes';

      const response = await axios.get(url, {
        headers: { 'x-auth-token': token }
      });
      setAvailableClasses(response.data.classes || []);
    } catch (error) {
      console.error('Error loading filtered classes:', error);
      setAvailableClasses([]);
    }
  };

  const handleGradeFilterChange = (event) => {
    const grade = event.target.value;
    setSelectedGrade(grade);
    loadFilteredClasses(grade);
  };

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button onClick={() => navigate('/')}>
          Back to Home
        </Button>
      </Container>
    );
  }

  // Student Password Dialog
  if (showPasswordDialog) {
    return (
      <Dialog open={true} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: 'center' }}>
          <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 2 }}>
            <Lock />
          </Avatar>
          <Typography variant="h5" component="div">
            Student Dashboard Access
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Enter your student password to access your dashboard
          </Typography>
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Student Password"
            type="password"
            value={studentPassword}
            onChange={(e) => setStudentPassword(e.target.value)}
            error={!!passwordError}
            helperText={passwordError}
            sx={{ mt: 2 }}
            onKeyPress={(e) => e.key === 'Enter' && handleStudentLogin()}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1, flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <Button onClick={() => navigate('/')}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleStudentLogin}
              disabled={authenticating}
              startIcon={authenticating ? <CircularProgress size={20} /> : <Visibility />}
            >
              {authenticating ? 'Authenticating...' : 'Access Dashboard'}
            </Button>
          </Box>
          <Button
            variant="text"
            color="secondary"
            onClick={handleForgotPassword}
            sx={{ textTransform: 'none' }}
          >
            Forgot Password?
          </Button>
        </DialogActions>
      </Dialog>
    );
  }



  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      py: 4
    }}>
      <Container maxWidth="xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <Paper elevation={8} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item>
                <Avatar sx={{ bgcolor: 'primary.main', width: 80, height: 80 }}>
                  <School sx={{ fontSize: 40 }} />
                </Avatar>
              </Grid>
              <Grid item xs>
                <Typography variant="h4" component="h1" gutterBottom sx={{
                  fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                  fontWeight: 'bold'
                }}>
                  Student Dashboard
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  Welcome back, {student?.firstName} {student?.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Student ID: {student?.studentId}
                </Typography>
              </Grid>
              <Grid item>
                <Chip
                  label={student?.status}
                  color={student?.status === 'Approved' ? 'success' : student?.status === 'Pending' ? 'warning' : 'error'}
                  icon={student?.status === 'Approved' ? <CheckCircle /> : <Pending />}
                  sx={{ fontSize: '1rem', py: 2 }}
                />
              </Grid>
            </Grid>
          </Paper>

          <Grid container spacing={4}>
            {/* Enrolled Classes */}
            <Grid item xs={12} lg={8}>
              <Paper elevation={6} sx={{ p: 3, borderRadius: 3, mb: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <ClassIcon sx={{ mr: 1 }} />
                  My Enrolled Classes
                </Typography>
                <Divider sx={{ mb: 3 }} />

                {student?.enrolledClasses?.length > 0 ? (
                  <Grid container spacing={3}>
                    {student.enrolledClasses
                      .filter(c => c.category !== 'Special Class')
                      .map((classItem) => (
                        <Grid item xs={12} md={6} key={classItem._id}>
                          <Card sx={{
                            height: '100%',
                            border: student.status === 'Approved' ? '2px solid #4caf50' : '2px solid #ff9800'
                          }}>
                            <CardContent>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6">{classItem.grade}</Typography>
                                <Chip
                                  label={classItem.category}
                                  size="small"
                                  color="primary"
                                />
                              </Box>
                              <Typography color="text.secondary" gutterBottom>
                                <Schedule sx={{ fontSize: 16, mr: 1 }} />
                                {classItem.date} • {classItem.startTime} - {classItem.endTime}
                              </Typography>
                              <Typography color="text.secondary" gutterBottom>
                                <LocationOn sx={{ fontSize: 16, mr: 1 }} />
                                {classItem.venue}
                              </Typography>
                              <Typography color="text.secondary" gutterBottom>
                                Platform: {classItem.platform}
                              </Typography>

                              <Button
                                variant="contained"
                                fullWidth
                                sx={{ mt: 2 }}
                                disabled={student.status !== 'Approved'}
                                startIcon={student.status === 'Approved' ? <Visibility /> : <Lock />}
                                onClick={() => student.status === 'Approved' && navigate(`/class/${classItem._id}`)}
                              >
                                {student.status === 'Approved' ? 'Access Class' : 'Pending Approval'}
                              </Button>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                  </Grid>
                ) : (
                  <Alert severity="info">
                    You haven't enrolled in any classes yet. Browse available classes below to get started.
                  </Alert>
                )}
              </Paper>

              {/* Special Classes Section */}
              <Paper elevation={6} sx={{ p: 3, borderRadius: 3, mb: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <School sx={{ mr: 1, color: 'warning.main' }} />
                  Enrolled Special Classes
                </Typography>
                <Divider sx={{ mb: 3 }} />

                {student?.enrolledClasses?.filter(c => c.category === 'Special Class').length > 0 ? (
                  <Grid container spacing={3}>
                    {student.enrolledClasses
                      .filter(c => c.category === 'Special Class')
                      .map((classItem) => (
                        <Grid item xs={12} md={6} key={classItem._id}>
                          <Card sx={{
                            height: '100%',
                            border: '2px solid',
                            borderColor: 'warning.main',
                            background: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: '0 8px 24px rgba(255, 152, 0, 0.2)',
                              transition: 'all 0.3s ease'
                            }
                          }}>
                            <CardContent>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6" sx={{ color: 'warning.dark' }}>{classItem.grade}</Typography>
                                <Chip
                                  label="Special Class"
                                  size="small"
                                  color="warning"
                                  sx={{ fontWeight: 'bold' }}
                                />
                              </Box>
                              <Typography color="text.secondary" gutterBottom>
                                <Schedule sx={{ fontSize: 16, mr: 1, color: 'warning.main' }} />
                                {classItem.date} • {classItem.startTime} - {classItem.endTime}
                              </Typography>
                              <Typography color="text.secondary" gutterBottom>
                                <LocationOn sx={{ fontSize: 16, mr: 1, color: 'warning.main' }} />
                                {classItem.venue}
                              </Typography>
                              <Typography color="text.secondary" gutterBottom>
                                Platform: {classItem.platform}
                              </Typography>

                              <Button
                                variant="contained"
                                fullWidth
                                sx={{
                                  mt: 2,
                                  bgcolor: 'warning.main',
                                  '&:hover': {
                                    bgcolor: 'warning.dark'
                                  }
                                }}
                                disabled={student.status !== 'Approved'}
                                startIcon={student.status === 'Approved' ? <Visibility /> : <Lock />}
                                onClick={() => student.status === 'Approved' && navigate(`/class/${classItem._id}`)}
                              >
                                {student.status === 'Approved' ? 'Access Special Class' : 'Pending Approval'}
                              </Button>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                  </Grid>
                ) : (
                  <Alert severity="info" sx={{
                    bgcolor: 'warning.50',
                    border: '1px solid',
                    borderColor: 'warning.200'
                  }}>
                    You haven't enrolled in any special classes yet. These classes are designed for specific learning needs and are available upon request.
                  </Alert>
                )}
              </Paper>

              {/* Available Classes */}
              <Paper elevation={6} sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <Add sx={{ mr: 1 }} />
                  Available Classes
                </Typography>
                <Divider sx={{ mb: 3 }} />

                {/* Grade Filter */}
                <Box sx={{ mb: 3 }}>
                  <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Filter by Grade</InputLabel>
                    <Select
                      value={selectedGrade}
                      label="Filter by Grade"
                      onChange={handleGradeFilterChange}
                      disabled={loadingGrades}
                    >
                      <MenuItem value="">
                        <em>All Grades</em>
                      </MenuItem>
                      {availableGrades.map((grade) => (
                        <MenuItem key={grade} value={grade}>
                          {grade}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                {availableClasses.length > 0 ? (
                  <Grid container spacing={3}>
                    {availableClasses.map((classItem) => (
                      <Grid item xs={12} md={6} key={classItem._id}>
                        <Card>
                          <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                              <Typography variant="h6">{classItem.grade}</Typography>
                              <Chip
                                label={classItem.category}
                                size="small"
                                variant="outlined"
                              />
                            </Box>
                            <Typography color="text.secondary" gutterBottom>
                              <Schedule sx={{ fontSize: 16, mr: 1 }} />
                              {classItem.date} • {classItem.startTime} - {classItem.endTime}
                            </Typography>
                            <Typography color="text.secondary" gutterBottom>
                              <LocationOn sx={{ fontSize: 16, mr: 1 }} />
                              {classItem.venue}
                            </Typography>
                            <Typography color="text.secondary" gutterBottom>
                              <Group sx={{ fontSize: 16, mr: 1 }} />
                              {classItem.availableSpots} spots available
                            </Typography>

                            <Button
                              variant="outlined"
                              fullWidth
                              sx={{ mt: 2 }}
                              onClick={() => handleClassEnrollment(classItem)}
                              disabled={student?.status !== 'Approved'}
                            >
                              Request to Enroll
                            </Button>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Alert severity="info">
                    No additional classes available for enrollment at this time.
                  </Alert>
                )}
              </Paper>
            </Grid>

            {/* Sidebar */}
            <Grid item xs={12} lg={4}>
              {/* Class Requests Status */}
              <Paper elevation={6} sx={{ p: 3, borderRadius: 3, mb: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <Badge badgeContent={classRequests.filter(r => r.status === 'Pending').length} color="warning">
                    <Pending sx={{ mr: 1 }} />
                  </Badge>
                  My Class Requests
                </Typography>
                <Divider sx={{ mb: 2 }} />

                {classRequests.length > 0 ? (
                  <List dense>
                    {classRequests.slice(0, 5).map((request) => (
                      <ListItem
                        key={request._id}
                        divider
                        secondaryAction={
                          request.status === 'Pending' && (
                            <IconButton
                              edge="end"
                              aria-label="delete"
                              onClick={() => deleteClassRequest(request._id)}
                              size="small"
                              color="error"
                            >
                              <Delete />
                            </IconButton>
                          )
                        }
                      >
                        <ListItemIcon>
                          {request.status === 'Pending' && <Pending color="warning" />}
                          {request.status === 'Approved' && <CheckCircle color="success" />}
                          {request.status === 'Rejected' && <Notifications color="error" />}
                        </ListItemIcon>
                        <ListItemText
                          primary={`${request.class?.grade} - ${request.class?.category}`}
                          secondary={
                            <Box>
                              <Typography variant="caption" display="block">
                                Status: {request.status}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {request.reason.substring(0, 50)}...
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No class requests yet
                  </Typography>
                )}
              </Paper>

              {/* Quick Actions */}
              <Paper elevation={6} sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Quick Actions
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Person />}
                  sx={{ mb: 2 }}
                >
                  View Profile
                </Button>

                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Schedule />}
                  sx={{ mb: 2 }}
                >
                  Class Schedule
                </Button>

                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<DashboardIcon />}
                  onClick={() => navigate('/')}
                >
                  Back to Home
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </motion.div>
      </Container>

      {/* Class Request Dialog */}
      <Dialog open={showRequestDialog} onClose={() => setShowRequestDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Request to Enroll in Class
        </DialogTitle>
        <DialogContent>
          {selectedClass && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                {selectedClass.grade} - {selectedClass.category}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {selectedClass.date} • {selectedClass.startTime} - {selectedClass.endTime}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Venue: {selectedClass.venue}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Available Spots: {selectedClass.availableSpots}
              </Typography>
            </Box>
          )}
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Reason for Enrollment Request"
            placeholder="Please explain why you want to enroll in this class..."
            value={requestReason}
            onChange={(e) => setRequestReason(e.target.value)}
            helperText={`${requestReason.length}/500 characters (minimum 10 required)`}
            inputProps={{ maxLength: 500 }}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowRequestDialog(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={submitClassRequest}
            disabled={submittingRequest || requestReason.trim().length < 10}
            startIcon={submittingRequest ? <CircularProgress size={20} /> : null}
          >
            {submittingRequest ? 'Submitting...' : 'Submit Request'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Forgot Password Dialog */}
      <Dialog open={showForgotPasswordDialog} onClose={() => setShowForgotPasswordDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: 'center' }}>
          <Avatar sx={{ bgcolor: 'warning.main', mx: 'auto', mb: 2 }}>
            <Lock />
          </Avatar>
          <Typography variant="h5" component="div">
            Reset Student Password
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            We couldn't find your email in the system. Please enter your email address to receive a password reset code.
          </Typography>
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={forgotPasswordEmail}
            onChange={(e) => setForgotPasswordEmail(e.target.value)}
            error={!!forgotPasswordError}
            helperText={forgotPasswordError}
            sx={{ mt: 2 }}
            onKeyPress={(e) => e.key === 'Enter' && sendPasswordResetOTP()}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => {
            setShowForgotPasswordDialog(false);
            setShowPasswordDialog(true);
          }}>
            Back to Login
          </Button>
          <Button
            variant="contained"
            onClick={sendPasswordResetOTP}
            disabled={forgotPasswordLoading}
            startIcon={forgotPasswordLoading ? <CircularProgress size={20} /> : null}
          >
            {forgotPasswordLoading ? 'Sending...' : 'Send Reset Code'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* OTP Verification Dialog */}
      <Dialog open={showOtpDialog} onClose={() => setShowOtpDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: 'center' }}>
          <Avatar sx={{ bgcolor: 'info.main', mx: 'auto', mb: 2 }}>
            <Lock />
          </Avatar>
          <Typography variant="h5" component="div">
            Enter Verification Code
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            We sent a 6-digit code to {forgotPasswordEmail || 'your email'}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="6-Digit Code"
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value)}
            error={!!forgotPasswordError}
            helperText={forgotPasswordError}
            sx={{ mt: 2 }}
            inputProps={{ maxLength: 6 }}
            onKeyPress={(e) => e.key === 'Enter' && verifyOTPAndProceed()}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => {
            setShowOtpDialog(false);
            setShowForgotPasswordDialog(true);
          }}>
            Back
          </Button>
          <Button
            variant="contained"
            onClick={verifyOTPAndProceed}
            disabled={forgotPasswordLoading}
            startIcon={forgotPasswordLoading ? <CircularProgress size={20} /> : null}
          >
            {forgotPasswordLoading ? 'Verifying...' : 'Verify Code'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* New Password Dialog */}
      <Dialog open={showNewPasswordDialog} onClose={() => setShowNewPasswordDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: 'center' }}>
          <Avatar sx={{ bgcolor: 'success.main', mx: 'auto', mb: 2 }}>
            <Lock />
          </Avatar>
          <Typography variant="h5" component="div">
            Set New Password
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Enter your new student dashboard password
          </Typography>
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            sx={{ mt: 2, mb: 2 }}
            helperText="Password must be at least 6 characters long"
          />
          <TextField
            fullWidth
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={!!forgotPasswordError}
            helperText={forgotPasswordError}
            onKeyPress={(e) => e.key === 'Enter' && resetPassword()}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => {
            setShowNewPasswordDialog(false);
            setShowOtpDialog(true);
          }}>
            Back
          </Button>
          <Button
            variant="contained"
            onClick={resetPassword}
            disabled={forgotPasswordLoading}
            startIcon={forgotPasswordLoading ? <CircularProgress size={20} /> : null}
          >
            {forgotPasswordLoading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Loading Dialog for Auto OTP Send */}
      <Dialog open={forgotPasswordLoading && !showForgotPasswordDialog && !showOtpDialog} maxWidth="sm" fullWidth>
        <DialogContent sx={{ textAlign: 'center', py: 4 }}>
          <CircularProgress size={60} sx={{ mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Sending Reset Code
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please wait while we send a password reset code to your email...
          </Typography>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default StudentDashboard;
