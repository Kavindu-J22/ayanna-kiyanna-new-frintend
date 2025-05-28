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
  const [notifications, setNotifications] = useState([]);
  const [showPasswordDialog, setShowPasswordDialog] = useState(true);
  const [studentPassword, setStudentPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [authenticating, setAuthenticating] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

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

      // Load notifications (with error handling)
      try {
        const notificationsResponse = await axios.get(
          'https://ayanna-kiyanna-new-backend.onrender.com/api/notifications',
          { headers: { 'x-auth-token': token } }
        );
        setNotifications(notificationsResponse.data.notifications || []);
      } catch (error) {
        console.error('Error loading notifications:', error);
        setNotifications([]);
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

  const handleClassEnrollment = async (classId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'https://ayanna-kiyanna-new-backend.onrender.com/api/students/enroll-class',
        { classId },
        { headers: { 'x-auth-token': token } }
      );

      // Reload student data and available classes
      await loadAdditionalData();
      alert('Successfully enrolled in class!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to enroll in class');
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
                              onClick={() => handleClassEnrollment(classItem._id)}
                              disabled={student?.status !== 'Approved'}
                            >
                              Ask to Enroll
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
              {/* Notifications */}
              <Paper elevation={6} sx={{ p: 3, borderRadius: 3, mb: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <Badge badgeContent={notifications.filter(n => !n.read).length} color="error">
                    <Notifications sx={{ mr: 1 }} />
                  </Badge>
                  Notifications
                </Typography>
                <Divider sx={{ mb: 2 }} />

                {notifications.length > 0 ? (
                  <List dense>
                    {notifications.slice(0, 5).map((notification) => (
                      <ListItem key={notification._id} divider>
                        <ListItemIcon>
                          <Notifications color={notification.read ? 'disabled' : 'primary'} />
                        </ListItemIcon>
                        <ListItemText
                          primary={notification.title}
                          secondary={notification.message}
                          primaryTypographyProps={{
                            fontWeight: notification.read ? 'normal' : 'bold'
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No notifications yet
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
    </Box>
  );
};

export default StudentDashboard;
