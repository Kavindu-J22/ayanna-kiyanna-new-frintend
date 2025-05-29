import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Alert,
  CircularProgress,
  Tooltip,
  useTheme,
  useMediaQuery,
  Fab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  ArrowBack,
  School,
  Schedule,
  LocationOn,
  People,
  PersonAdd,
  PersonRemove,
  Visibility,
  Search,
  Close,
  Assignment,
  Payment,
  Notifications,
  TrendingUp,
  CalendarToday,
  Group
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';

const SpecificClass = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // State management
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState('');
  const [currentStudent, setCurrentStudent] = useState(null);

  // Dialog states
  const [addMonitorDialog, setAddMonitorDialog] = useState(false);
  const [studentsDialog, setStudentsDialog] = useState(false);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [monitorSearchTerm, setMonitorSearchTerm] = useState('');

  // Monitor management states
  const [addingMonitor, setAddingMonitor] = useState(false);
  const [removingMonitor, setRemovingMonitor] = useState('');

  useEffect(() => {
    fetchClassData();
    checkUserRole();
  }, [classId]);

  const fetchClassData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/classes/${classId}`,
        { headers: { 'x-auth-token': token } }
      );
      setClassData(response.data);
    } catch (err) {
      console.error('Error fetching class data:', err);
      setError('Failed to load class data');
    } finally {
      setLoading(false);
    }
  };

  const checkUserRole = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'https://ayanna-kiyanna-new-backend.onrender.com/api/auth/me',
        { headers: { 'x-auth-token': token } }
      );
      setUserRole(response.data.role);

      // If student, get student data
      if (response.data.role === 'student') {
        try {
          const studentResponse = await axios.get(
            'https://ayanna-kiyanna-new-backend.onrender.com/api/students/profile',
            { headers: { 'x-auth-token': token } }
          );
          setCurrentStudent(studentResponse.data);
        } catch (studentErr) {
          console.error('Error fetching student data:', studentErr);
          // Continue without student data if not found
        }
      }
    } catch (err) {
      console.error('Error checking user role:', err);
    }
  };

  const fetchStudents = async (search = '') => {
    try {
      setLoadingStudents(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/classes/${classId}/students?search=${search}`,
        { headers: { 'x-auth-token': token } }
      );
      setStudents(response.data.students);
    } catch (err) {
      console.error('Error fetching students:', err);
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleAddMonitor = async (studentId) => {
    try {
      setAddingMonitor(true);
      const token = localStorage.getItem('token');
      await axios.post(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/classes/${classId}/add-monitor`,
        { studentId },
        { headers: { 'x-auth-token': token } }
      );

      // Refresh class data
      await fetchClassData();
      setAddMonitorDialog(false);
    } catch (err) {
      console.error('Error adding monitor:', err);
      alert(err.response?.data?.message || 'Failed to add monitor');
    } finally {
      setAddingMonitor(false);
    }
  };

  const handleRemoveMonitor = async (studentId) => {
    try {
      setRemovingMonitor(studentId);
      const token = localStorage.getItem('token');
      await axios.post(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/classes/${classId}/remove-monitor`,
        { studentId },
        { headers: { 'x-auth-token': token } }
      );

      // Refresh class data
      await fetchClassData();
    } catch (err) {
      console.error('Error removing monitor:', err);
      alert(err.response?.data?.message || 'Failed to remove monitor');
    } finally {
      setRemovingMonitor('');
    }
  };

  const handleViewStudents = () => {
    // Only allow admins to view students
    if (userRole === 'admin' || userRole === 'moderator') {
      setStudentsDialog(true);
      fetchStudents();
    }
  };

  const handleSearchStudents = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    fetchStudents(value);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error || !classData) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{error || 'Class not found'}</Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ mt: 2 }}
        >
          Go Back
        </Button>
      </Container>
    );
  }

  const isAdmin = userRole === 'admin' || userRole === 'moderator';
  const isStudent = userRole === 'student';

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      py: 3
    }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Paper elevation={3} sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <IconButton onClick={() => navigate(-1)} color="primary">
              <ArrowBack />
            </IconButton>
            <Typography variant="h4" fontWeight="bold" sx={{
              fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
            }}>
              {isAdmin ? 'පන්ති කළමනාකරණය' : 'මගේ පන්තිය'}
            </Typography>
          </Box>
        </Paper>

        {/* Class Details Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper elevation={6} sx={{ p: 4, mb: 4, borderRadius: 3 }}>
            <Grid container spacing={4}>
              {/* Class Information */}
              <Grid item xs={12} md={8}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Avatar sx={{
                    width: 60,
                    height: 60,
                    bgcolor: 'primary.main',
                    fontSize: '1.5rem'
                  }}>
                    <School />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" fontWeight="bold" sx={{
                      fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                    }}>
                      {classData.grade} - {classData.category}
                    </Typography>
                    <Chip
                      label={classData.type}
                      color="primary"
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Schedule color="action" />
                      <Typography variant="body1">
                        {classData.date} • {classData.startTime} - {classData.endTime}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <LocationOn color="action" />
                      <Typography variant="body1">{classData.venue}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <People color="action" />
                      <Typography variant="body1">
                        {classData.enrolledCount}/{classData.capacity} සිසුන්
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1" color="text.secondary">
                      Platform: {classData.platform}
                    </Typography>
                  </Grid>
                </Grid>

                {classData.specialNote && (
                  <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>විශේෂ සටහන:</strong> {classData.specialNote}
                    </Typography>
                  </Box>
                )}
              </Grid>

              {/* Monitors Section */}
              <Grid item xs={12} md={4}>
                <Box sx={{
                  p: 3,
                  bgcolor: 'primary.50',
                  borderRadius: 2,
                  border: '2px solid',
                  borderColor: 'primary.200'
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" fontWeight="bold" sx={{
                      fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                    }}>
                      පන්ති නිරීක්ෂකයින්
                    </Typography>
                    {isAdmin && (
                      <Tooltip title="නිරීක්ෂකයෙකු එක් කරන්න">
                        <IconButton
                          color="primary"
                          onClick={() => setAddMonitorDialog(true)}
                          disabled={classData.monitors?.length >= 5}
                        >
                          <PersonAdd />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>

                  {classData.monitors && classData.monitors.length > 0 ? (
                    <List dense>
                      {classData.monitors.map((monitor, index) => (
                        <ListItem key={monitor._id} sx={{ px: 0 }}>
                          <ListItemAvatar>
                            <Avatar
                              src={monitor.profilePicture}
                              sx={{ width: 32, height: 32 }}
                            >
                              {monitor.firstName?.charAt(0)}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={`${monitor.firstName} ${monitor.lastName}`}
                            secondary={monitor.studentId}
                            primaryTypographyProps={{ fontSize: '0.9rem' }}
                            secondaryTypographyProps={{ fontSize: '0.8rem' }}
                          />
                          {isAdmin && (
                            <ListItemSecondaryAction>
                              <IconButton
                                edge="end"
                                size="small"
                                color="error"
                                onClick={() => handleRemoveMonitor(monitor._id)}
                                disabled={removingMonitor === monitor._id}
                              >
                                {removingMonitor === monitor._id ? (
                                  <CircularProgress size={16} />
                                ) : (
                                  <PersonRemove />
                                )}
                              </IconButton>
                            </ListItemSecondaryAction>
                          )}
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body2" color="text.secondary" textAlign="center">
                      නිරීක්ෂකයින් නොමැත
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </motion.div>

        {/* Management Buttons Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h5" fontWeight="bold" sx={{
              fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
              mb: 3,
              textAlign: 'center'
            }}>
              {isAdmin ? 'පන්ති කළමනාකරණ විකල්ප' : 'මගේ පන්ති විකල්ප'}
            </Typography>

            <Grid container spacing={3}>
              {isAdmin ? (
                // Admin Management Options
                <>
                  <Grid item xs={12} sm={6} md={4}>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Card sx={{
                        height: '100%',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onClick={handleViewStudents}
                      >
                        <CardContent sx={{ textAlign: 'center', py: 3 }}>
                          <Group sx={{ fontSize: 40, mb: 2 }} />
                          <Typography variant="h6" fontWeight="bold" sx={{
                            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                          }}>
                            සිසුන් බලන්න
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                            ප්‍රගතිය සමඟ
                          </Typography>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Card sx={{
                        height: '100%',
                        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                        color: 'white',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}>
                        <CardContent sx={{ textAlign: 'center', py: 3 }}>
                          <Assignment sx={{ fontSize: 40, mb: 2 }} />
                          <Typography variant="h6" fontWeight="bold" sx={{
                            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                          }}>
                            පැමිණීම් කළමනාකරණය
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                            සිසුන්ගේ පැමිණීම්
                          </Typography>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Card sx={{
                        height: '100%',
                        background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                        color: '#333',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}>
                        <CardContent sx={{ textAlign: 'center', py: 3 }}>
                          <Payment sx={{ fontSize: 40, mb: 2 }} />
                          <Typography variant="h6" fontWeight="bold" sx={{
                            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                          }}>
                            පන්ති ගෙවීම් කළමනාකරණය
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                            ගෙවීම් තත්ත්වය
                          </Typography>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Card sx={{
                        height: '100%',
                        background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
                        color: '#333',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}>
                        <CardContent sx={{ textAlign: 'center', py: 3 }}>
                          <Assignment sx={{ fontSize: 40, mb: 2 }} />
                          <Typography variant="h6" fontWeight="bold" sx={{
                            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                          }}>
                            ගෘහ කාර්ය කළමනාකරණය
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                            සතිපතා කාර්ය
                          </Typography>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Card sx={{
                        height: '100%',
                        background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
                        color: '#333',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}>
                        <CardContent sx={{ textAlign: 'center', py: 3 }}>
                          <CalendarToday sx={{ fontSize: 40, mb: 2 }} />
                          <Typography variant="h6" fontWeight="bold" sx={{
                            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                          }}>
                            ඊළඟ පාඩම් කාලසටහන
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                            කාලසටහන් කරන්න
                          </Typography>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Card sx={{
                        height: '100%',
                        background: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
                        color: 'white',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}>
                        <CardContent sx={{ textAlign: 'center', py: 3 }}>
                          <Notifications sx={{ fontSize: 40, mb: 2 }} />
                          <Typography variant="h6" fontWeight="bold" sx={{
                            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                          }}>
                            පන්ති දැනුම්දීම් කළමනාකරණය
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                            දැනුම්දීම් යවන්න
                          </Typography>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                </>
              ) : (
                // Student Options
                <>
                  <Grid item xs={12} sm={6} md={4}>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Card sx={{
                        height: '100%',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}>
                        <CardContent sx={{ textAlign: 'center', py: 3 }}>
                          <TrendingUp sx={{ fontSize: 40, mb: 2 }} />
                          <Typography variant="h6" fontWeight="bold" sx={{
                            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                          }}>
                            මගේ ප්‍රගතිය බලන්න
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                            පන්තියේ ප්‍රගතිය
                          </Typography>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Card sx={{
                        height: '100%',
                        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                        color: 'white',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}>
                        <CardContent sx={{ textAlign: 'center', py: 3 }}>
                          <Assignment sx={{ fontSize: 40, mb: 2 }} />
                          <Typography variant="h6" fontWeight="bold" sx={{
                            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                          }}>
                            මගේ පැමිණීම් බලන්න
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                            පැමිණීම් වාර්තාව
                          </Typography>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Card sx={{
                        height: '100%',
                        background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                        color: '#333',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}>
                        <CardContent sx={{ textAlign: 'center', py: 3 }}>
                          <Payment sx={{ fontSize: 40, mb: 2 }} />
                          <Typography variant="h6" fontWeight="bold" sx={{
                            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                          }}>
                            මගේ පන්ති ගෙවීම් & ගෙවන්න
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                            ගෙවීම් තත්ත්වය
                          </Typography>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Card sx={{
                        height: '100%',
                        background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
                        color: '#333',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}>
                        <CardContent sx={{ textAlign: 'center', py: 3 }}>
                          <Assignment sx={{ fontSize: 40, mb: 2 }} />
                          <Typography variant="h6" fontWeight="bold" sx={{
                            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                          }}>
                            සතිපතා ගෘහ කාර්ය
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                            කාර්ය ලැයිස්තුව
                          </Typography>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Card sx={{
                        height: '100%',
                        background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
                        color: '#333',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}>
                        <CardContent sx={{ textAlign: 'center', py: 3 }}>
                          <CalendarToday sx={{ fontSize: 40, mb: 2 }} />
                          <Typography variant="h6" fontWeight="bold" sx={{
                            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                          }}>
                            ඊළඟ පාඩම් කාලසටහන බලන්න
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                            කාලසටහන
                          </Typography>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Card sx={{
                        height: '100%',
                        background: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
                        color: 'white',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}>
                        <CardContent sx={{ textAlign: 'center', py: 3 }}>
                          <Notifications sx={{ fontSize: 40, mb: 2 }} />
                          <Typography variant="h6" fontWeight="bold" sx={{
                            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                          }}>
                            පන්ති දැනුම්දීම්
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                            නවතම දැනුම්දීම්
                          </Typography>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                </>
              )}
            </Grid>
          </Paper>
        </motion.div>

        {/* Add Monitor Dialog */}
        <Dialog
          open={addMonitorDialog}
          onClose={() => setAddMonitorDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{
            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
            fontWeight: 'bold'
          }}>
            නිරීක්ෂකයෙකු එක් කරන්න
          </DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              මෙම පන්තියට ලියාපදිංචි වූ සිසුන්ගෙන් නිරීක්ෂකයෙකු තෝරන්න
            </Typography>

            {/* Search Field for Monitor Selection */}
            <TextField
              fullWidth
              placeholder="සිසු ID හෝ නම අනුව සොයන්න..."
              value={monitorSearchTerm}
              onChange={(e) => setMonitorSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
              }}
              sx={{ mb: 3 }}
            />

            {isAdmin && classData?.enrolledStudents && classData.enrolledStudents.length > 0 ? (
              <List>
                {classData.enrolledStudents
                  .filter(student => !classData.monitors?.some(monitor => monitor._id === student._id))
                  .filter(student => {
                    if (!monitorSearchTerm.trim()) return true;
                    const searchTerm = monitorSearchTerm.trim().toLowerCase();
                    return (
                      student.studentId.toLowerCase().includes(searchTerm) ||
                      student.firstName.toLowerCase().includes(searchTerm) ||
                      student.lastName.toLowerCase().includes(searchTerm) ||
                      (student.fullName && student.fullName.toLowerCase().includes(searchTerm))
                    );
                  })
                  .map((student) => (
                    <ListItem
                      key={student._id}
                      sx={{
                        border: '1px solid',
                        borderColor: 'grey.300',
                        borderRadius: 2,
                        mb: 1
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar src={student.profilePicture}>
                          {student.firstName?.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={`${student.firstName} ${student.lastName}`}
                        secondary={student.studentId}
                      />
                      <ListItemSecondaryAction>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleAddMonitor(student._id)}
                          disabled={addingMonitor}
                        >
                          {addingMonitor ? <CircularProgress size={16} /> : 'එක් කරන්න'}
                        </Button>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
              </List>
            ) : (
              <Alert severity="info">
                {isAdmin ? 'මෙම පන්තියට ලියාපදිංචි වූ සිසුන් නොමැත' : 'ප්‍රවේශය ප්‍රතික්ෂේප විය'}
              </Alert>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddMonitorDialog(false)}>
              අවලංගු කරන්න
            </Button>
          </DialogActions>
        </Dialog>

        {/* Students View Dialog */}
        <Dialog
          open={studentsDialog}
          onClose={() => setStudentsDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{
            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
            fontWeight: 'bold',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>ලියාපදිංචි සිසුන්</span>
            <IconButton onClick={() => setStudentsDialog(false)}>
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            {/* Search Field */}
            <TextField
              fullWidth
              placeholder="සිසු ID හෝ නම අනුව සොයන්න..."
              value={searchTerm}
              onChange={handleSearchStudents}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
              }}
              sx={{ mb: 3 }}
            />

            {loadingStudents ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : students.length > 0 ? (
              <TableContainer component={Paper} sx={{ mt: 2, maxHeight: 400 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold', fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif' }}>
                        ප්‍රොෆයිල් පින්තූරය
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif' }}>
                        සිසු ID
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif' }}>
                        නම
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif' }}>
                        ශ්‍රේණිය
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif' }}>
                        පාසල
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif' }}>
                        සම්බන්ධතා අංකය
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif' }}>
                        ක්‍රියාමාර්ග
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow key={student._id} hover>
                        <TableCell>
                          <Avatar
                            src={student.profilePicture}
                            sx={{ width: 40, height: 40 }}
                          >
                            {student.firstName?.charAt(0)}
                          </Avatar>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={student.studentId}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {student.firstName} {student.lastName}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {student.selectedGrade}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {student.school}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {student.contactNumber}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<Visibility />}
                            sx={{
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              color: 'white',
                              fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                              fontWeight: 'bold',
                              textTransform: 'none',
                              borderRadius: 2,
                              '&:hover': {
                                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                                transform: 'scale(1.02)',
                              },
                              transition: 'all 0.3s ease'
                            }}
                          >
                            ප්‍රොෆයිලය සහ ප්‍රගතිය
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Alert severity="info">
                {searchTerm ? 'සෙවුම සඳහා ප්‍රතිඵල හමු නොවීය' : 'මෙම පන්තියට ලියාපදිංචි වූ සිසුන් නොමැත'}
              </Alert>
            )}
          </DialogContent>
        </Dialog>
      </Container>
    </Box>
  );
};

export default SpecificClass;
