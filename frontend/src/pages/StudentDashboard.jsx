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
  Badge
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
  Group
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
        <DialogActions sx={{ p: 3, pt: 1 }}>
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
                    {student.enrolledClasses.map((classItem) => (
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

              {/* Available Classes */}
              <Paper elevation={6} sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <Add sx={{ mr: 1 }} />
                  Available Classes
                </Typography>
                <Divider sx={{ mb: 3 }} />

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
                      <ListItem key={request._id} divider>
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
    </Box>
  );
};

export default StudentDashboard;
