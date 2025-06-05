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
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox
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
  Group,
  CheckCircle,
  FolderOpen,
  VideoCall,
  Computer
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
  const [confirmingMonitors, setConfirmingMonitors] = useState(false);

  // Student management states
  const [addStudentDialog, setAddStudentDialog] = useState(false);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [loadingAvailableStudents, setLoadingAvailableStudents] = useState(false);
  const [addingStudent, setAddingStudent] = useState(false);
  const [removingStudent, setRemovingStudent] = useState('');
  const [studentSearchTerm, setStudentSearchTerm] = useState('');

  // Add new state variables after other state declarations
  const [normalClasses, setNormalClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [bulkAdding, setBulkAdding] = useState(false);

  // Add new state for special class note
  const [showSpecialNote, setShowSpecialNote] = useState(false);

  // Free Class Dialog State
  const [freeClassDialog, setFreeClassDialog] = useState(false);

  // Function to handle payment button clicks with free class check
  const handlePaymentButtonClick = (navigateTo) => {
    if (classData?.isFreeClass) {
      setFreeClassDialog(true);
    } else {
      navigate(navigateTo);
    }
  };

  useEffect(() => {
    fetchClassData();
    checkUserRole();
  }, [classId]);

  // Add effect to check if class is special
  useEffect(() => {
    if (classData && classData.type === 'Special') {
      setShowSpecialNote(true);
    } else {
      setShowSpecialNote(false);
    }
  }, [classData]);

  useEffect(() => {
    const fetchNormalClasses = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          'https://ayanna-kiyanna-new-backend.onrender.com/api/classes/normal-classes',
          { headers: { 'x-auth-token': token } }
        );
        setNormalClasses(response.data.classes);
      } catch (err) {
        console.error('Error fetching normal classes:', err);
      }
    };

    if (addStudentDialog) {
      fetchNormalClasses();
    }
  }, [addStudentDialog]);

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

  const handleConfirmMonitors = async () => {
    if (!window.confirm('මෙම පන්තියේ නිරීක්ෂකයින් තහවුරු කරන්න?\n\nමෙය:\n- දැනට පන්තියට ලියාපදිංචි නොවූ නිරීක්ෂකයින් ඉවත් කරයි\n- මකා දැමූ සිසුන් නිරීක්ෂක ලැයිස්තුවෙන් ඉවත් කරයි\n\n(මෙම ක්‍රියාවලිය සෑම දිනකම උදෑසන 3 ට (3.00 AM) ස්වයංක්‍රීයව සිදුවන අතර මෙය ක්‍රියාත්මක කිරීම තුලින් මේ මොහොතේ ද සිදුකල හැක) මෙම ක්‍රියාව අහෝසි කළ නොහැක.')) {
      return;
    }

    try {
      setConfirmingMonitors(true);
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/classes/${classId}/confirm-monitors`,
        {},
        { headers: { 'x-auth-token': token } }
      );

      if (response.data.success) {
        const summary = response.data.summary;
        if (summary.monitorsRemoved > 0) {
          alert(`නිරීක්ෂක තහවුරු කිරීම සම්පූර්ණයි!\n\nසාරාංශය:\n- ඉවත් කළ නිරීක්ෂකයින්: ${summary.monitorsRemoved}\n- දැනට ඇති නිරීක්ෂකයින්: ${summary.newMonitorsCount}`);
        } else {
          alert('සියලුම නිරීක්ෂකයින් වලංගු වන අතර දැනට පන්තියට ලියාපදිංචි වී ඇත.');
        }

        // Refresh class data
        await fetchClassData();
      }
    } catch (err) {
      console.error('Error confirming monitors:', err);
      alert(err.response?.data?.message || 'නිරීක්ෂකයින් තහවුරු කිරීමේදී දෝෂයක් ඇතිවිය');
    } finally {
      setConfirmingMonitors(false);
    }
  };

  const handleSearchStudents = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    fetchStudents(value);
  };

  // Student management functions
  const fetchAvailableStudents = async (search = '', filterClassId = '') => {
    try {
      setLoadingAvailableStudents(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/classes/${classData._id}/available-students${filterClassId ? `?filterClassId=${filterClassId}` : ''}`,
        { headers: { 'x-auth-token': token } }
      );

      let students = response.data.students;

      // Filter by search term if provided
      if (search.trim()) {
        const searchTerm = search.trim().toLowerCase();
        students = students.filter(student =>
          student.studentId.toLowerCase().includes(searchTerm) ||
          student.firstName.toLowerCase().includes(searchTerm) ||
          student.lastName.toLowerCase().includes(searchTerm) ||
          (student.fullName && student.fullName.toLowerCase().includes(searchTerm))
        );
      }

      setAvailableStudents(students);
    } catch (err) {
      console.error('Error fetching available students:', err);
      alert('Failed to load available students');
    } finally {
      setLoadingAvailableStudents(false);
    }
  };

  const handleAddStudent = async (studentId) => {
    try {
      setAddingStudent(true);
      const token = localStorage.getItem('token');
      await axios.post(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/classes/${classId}/enroll`,
        { studentId },
        { headers: { 'x-auth-token': token } }
      );

      // Refresh class data and close dialog
      await fetchClassData();
      setAddStudentDialog(false);
      alert('Student enrolled successfully!');
    } catch (err) {
      console.error('Error adding student:', err);
      alert(err.response?.data?.message || 'Failed to enroll student');
    } finally {
      setAddingStudent(false);
    }
  };

  const handleRemoveStudent = async (studentId) => {
    if (!window.confirm('Are you sure you want to remove this student from the class?')) {
      return;
    }

    try {
      setRemovingStudent(studentId);
      const token = localStorage.getItem('token');
      await axios.post(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/classes/${classId}/remove-student`,
        { studentId },
        { headers: { 'x-auth-token': token } }
      );

      // Refresh class data and students list
      await fetchClassData();
      await fetchStudents(searchTerm);
      alert('Student removed successfully!');
    } catch (err) {
      console.error('Error removing student:', err);
      alert(err.response?.data?.message || 'Failed to remove student');
    } finally {
      setRemovingStudent('');
    }
  };

  const handleOpenAddStudentDialog = () => {
    setAddStudentDialog(true);
    setStudentSearchTerm('');
    fetchAvailableStudents();
  };

  // Add new function to handle class filter change
  const handleClassFilterChange = async (event) => {
    const classId = event.target.value;
    setSelectedClass(classId);
    setSelectedStudents([]);
    setSelectAll(false);
    setStudentSearchTerm('');
    await fetchAvailableStudents('', classId);
  };

  // Add new function to handle bulk student addition
  const handleBulkAddStudents = async () => {
    if (selectedStudents.length === 0) {
      alert('Please select at least one student to add');
      return;
    }

    if (!window.confirm(`Are you sure you want to add ${selectedStudents.length} students to this class?`)) {
      return;
    }

    try {
      setBulkAdding(true);
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/classes/${classData._id}/bulk-enroll`,
        { studentIds: selectedStudents },
        { headers: { 'x-auth-token': token } }
      );

      if (response.data.results.success.length > 0) {
        alert(`Successfully added ${response.data.results.success.length} students to the class`);
        // Refresh class data and close dialog
        await fetchClassData();
        setAddStudentDialog(false);
        setSelectedStudents([]);
        setSelectAll(false);
      }

      if (response.data.results.failed.length > 0) {
        alert(`Failed to add ${response.data.results.failed.length} students. Please check the console for details.`);
        console.log('Failed enrollments:', response.data.results.failed);
      }
    } catch (err) {
      console.error('Error adding students:', err);
      alert(err.response?.data?.message || 'Failed to add students');
    } finally {
      setBulkAdding(false);
    }
  };

  // Add new function to handle individual student selection
  const handleStudentSelect = (studentId) => {
    setSelectedStudents(prev => {
      // If student is already selected, remove it
      if (prev.includes(studentId)) {
        const newSelected = prev.filter(id => id !== studentId);
        setSelectAll(false);
        return newSelected;
      }
      // If student is not selected, add it
      const newSelected = [...prev, studentId];
      // Update select all state based on whether all students are now selected
      setSelectAll(newSelected.length === availableStudents.length);
      return newSelected;
    });
  };

  // Add new function to handle select all
  const handleSelectAll = (event) => {
    const checked = event.target.checked;
    setSelectAll(checked);
    if (checked) {
      setSelectedStudents(availableStudents.map(student => student._id));
    } else {
      setSelectedStudents([]);
    }
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
          <Paper elevation={6} sx={{ p: 4, mb: 2, borderRadius: 3 }}>
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
                  <Grid item xs={12} sm={6}>
                  <Typography variant="body1" color="text.secondary">
                    {classData.monthlyFee === 0 ? "Free of charge" : `Monthly Fee Rs: ${classData.monthlyFee} /=`}
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
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Tooltip title="නිරීක්ෂකයෙකු එක් කරන්න">
                          <IconButton
                            color="primary"
                            onClick={() => setAddMonitorDialog(true)}
                            disabled={classData.monitors?.length >= 5}
                            size="small"
                          >
                            <PersonAdd />
                          </IconButton>
                        </Tooltip>
                      </Box>
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

                  {/* Confirm Monitors Button */}
                  {isAdmin && classData.monitors && classData.monitors.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={handleConfirmMonitors}
                        disabled={confirmingMonitors}
                        startIcon={confirmingMonitors ? <CircularProgress size={16} /> : <CheckCircle />}
                        sx={{
                          background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
                          color: 'white',
                          fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                          fontWeight: 'bold',
                          fontSize: '0.9rem',
                          py: 1.5,
                          borderRadius: 2,
                          textTransform: 'none',
                          boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #43a047 0%, #1b5e20 100%)',
                            boxShadow: '0 6px 16px rgba(76, 175, 80, 0.4)',
                            transform: 'translateY(-1px)',
                          },
                          '&:disabled': {
                            background: 'linear-gradient(135deg, #a5d6a7 0%, #81c784 100%)',
                            color: 'white',
                            opacity: 0.7
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {confirmingMonitors ? 'නිරීක්ෂකයින් තහවුරු කරමින්...' : 'නිරීක්ෂකයින් තහවුරු කරන්න'}
                      </Button>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          display: 'block',
                          textAlign: 'center',
                          mt: 1,
                          fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                          fontSize: '0.75rem'
                        }}
                      >
                        වලංගු නොවන නිරීක්ෂකයින් ස්වයංක්‍රීයව ඉවත් කරයි
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </motion.div>

        {/* Special Note Alert - Moved and Styled */}
        {showSpecialNote && (userRole === 'admin' || userRole === 'moderator') && (
          <Paper
            elevation={3}
            sx={{
              mt: 1,
              p: 3,
              mb: 2,
              background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
              borderRadius: 3,
              border: '1px solid #90caf9',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Box sx={{ position: 'absolute', top: 0, right: 0, p: 1 }}>
              <School sx={{ fontSize: 40, color: 'rgba(144, 202, 249, 0.5)' }} />
            </Box>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                color: '#1976d2',
                fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <Assignment sx={{ color: '#1976d2' }} />
              විශේෂ/අමතර පන්ති පිලිබද වැදගත් සටහන
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#0d47a1',
                fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                lineHeight: 1.8,
                position: 'relative',
                zIndex: 1
              }}
            >
              මෙය විශේෂ/අමතර පන්තියකි. ඔබට අවශ්‍යනම් පමණක් මෙම පන්ති වල ද පැමිණීම් කළමනාකරණය, පන්ති ගෙවීම් කළමනාකරණය වැනි කරයුතු සිදුකර හැකිය. එසේත් නැතිනම් දත්ත වල නිරවද්‍යතාවය වෙනුවෙන් මෙම අමතර හෝ විශේෂ පන්තිය සිදු කරන සාමාන්‍ය පන්තියට අදාල ව ඔවුන්ගේ පැමිණීම හා ගෙවීම් සටහන් කරන්න. අවශ්‍යතාවය අනුව ඔබට මෙම විශේෂ/අමතර පන්තියේම ද එම කටයුතු ද ගැටලුවක් නැතිව සිදුකර හැකිය.
            </Typography>
          </Paper>
        )}

        {/* Student Special Note */}
        {showSpecialNote && userRole === 'student' && (
          <Paper
            elevation={3}
            sx={{
              mt: 1,
              p: 3,
              mb: 2,
              background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
              borderRadius: 3,
              border: '1px solid #ffb74d',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Box sx={{ position: 'absolute', top: 0, right: 0, p: 1 }}>
              <School sx={{ fontSize: 40, color: 'rgba(255, 183, 77, 0.5)' }} />
            </Box>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                color: '#e65100',
                fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <Assignment sx={{ color: '#e65100' }} />
              විශේෂ/අමතර පන්ති තොරතුරු
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#bf360c',
                fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                lineHeight: 1.8,
                position: 'relative',
                zIndex: 1
              }}
            >
              මෙය ගුරුතුමා විසින් සිදුකල අමතර හෝ විශේෂ පන්තියකි. මෙහි ඔබගේ පැමිණීම හෝ ඔබගේ පන්ති ගෙවීම් පිටු තුල කිසිවක් නොපෙන්වන්නේ නම් එය ගැටලුවන් නොකරගන්න. අදාල පරිදි ගුරුතුමා විසින් එම දත්ත ඔබගේ අදාල සාමාන්‍ය පත්තිය තුල ඇතුලත් කර ඇත. අවශ්‍යනම් ඔබගේ සාමාන්‍ය පන්තියට ඇතුල් වී ඒවා පරීක්ශාකර බලන්න, නැතිනම් එය නෙසලකා හරින්න.
            </Typography>
          </Paper>
        )}

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
                            පන්තියේ සිසුන් ප්‍රගතිය සමග
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                            බලන්න / ඉවත් කරන්න
                          </Typography>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Card sx={{
                        height: '100%',
                        background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
                        color: 'white',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                        onClick={handleOpenAddStudentDialog}
                      >
                        <CardContent sx={{ textAlign: 'center', py: 3 }}>
                          <PersonAdd sx={{ fontSize: 40, mb: 2 }} />
                          <Typography variant="h6" fontWeight="bold" sx={{
                            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                          }}>
                            සිසුන් එක් කරන්න
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                            නව සිසුන් ඇතුල් කරන්න
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
                      }}
                        onClick={() => navigate(`/attendance-management/${classId}`)}
                      >
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
                      <Card
                        onClick={() => handlePaymentButtonClick(`/admin-class-payments/${classId}`)}
                        sx={{
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
                      }}
                        onClick={() => navigate(`/admin-assignments/${classId}`)}
                      >
                        <CardContent sx={{ textAlign: 'center', py: 3 }}>
                          <Assignment sx={{ fontSize: 40, mb: 2 }} />
                          <Typography variant="h6" fontWeight="bold" sx={{
                            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                          }}>
                            පැවරුම් සහ ඇගයීම් කළමනාකරණය
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
                      }}
                        onClick={() => navigate(`/admin-time-schedule/${classId}`)}
                      >
                        <CardContent sx={{ textAlign: 'center', py: 3 }}>
                          <CalendarToday sx={{ fontSize: 40, mb: 2 }} />
                          <Typography variant="h6" fontWeight="bold" sx={{
                            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                          }}>
                            පාඩම් කාලසටහන් කළමනාකරණය
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
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                        onClick={() => navigate(`/admin-exams/${classId}`)}
                      >
                        <CardContent sx={{ textAlign: 'center', py: 3 }}>
                          <Assignment sx={{ fontSize: 40, mb: 2 }} />
                          <Typography variant="h6" fontWeight="bold" sx={{
                            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                          }}>
                            විභාග සහ ප්‍රතිඵල කළමනාකරණය
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                            විභාග සහ ලකුණු
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
                      }}
                        onClick={() => navigate(`/admin-resources/${classId}`)}
                      >
                        <CardContent sx={{ textAlign: 'center', py: 3 }}>
                          <FolderOpen sx={{ fontSize: 40, mb: 2 }} />
                          <Typography variant="h6" fontWeight="bold" sx={{
                            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                          }}>
                            වෙනත් සම්පත් සහ මෙවලම් කළමනාකරණය
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                            සම්පත් සහ ලින්ක්
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
                      }}
                        onClick={() => navigate(`/admin-announcements/${classId}`)}
                      >
                        <CardContent sx={{ textAlign: 'center', py: 3 }}>
                          <Notifications sx={{ fontSize: 40, mb: 2 }} />
                          <Typography variant="h6" fontWeight="bold" sx={{
                            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                          }}>
                            විශේෂ නිවේදන සහ දැනුවත් කිරීම් කළමනාකරණය
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                            දැනුම්දීම් යවන්න
                          </Typography>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Card sx={{
                        height: '100%',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                        onClick={() => navigate(`/admin-online-sessions/${classId}`)}
                      >
                        <CardContent sx={{ textAlign: 'center', py: 3 }}>
                          <VideoCall sx={{ fontSize: 40, mb: 2 }} />
                          <Typography variant="h6" fontWeight="bold" sx={{
                            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                          }}>
                            Online Sessions කළමනාකරණය
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                            මාර්ගගත සැසි සාදන්න
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
                      }}
                        onClick={() => {
                          // Check if student is a monitor
                          const isMonitor = classData.monitors?.some(monitor =>
                            monitor._id.toString() === currentStudent?._id.toString()
                          );

                          if (isMonitor) {
                            navigate(`/attendance-view/${classId}?monitor=true`);
                          } else {
                            navigate(`/attendance-view/${classId}`);
                          }
                        }}
                      >
                        <CardContent sx={{ textAlign: 'center', py: 3 }}>
                          <Assignment sx={{ fontSize: 40, mb: 2 }} />
                          <Typography variant="h6" fontWeight="bold" sx={{
                            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                          }}>
                            මගේ පැමිණීම් බලන්න
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                            {classData.monitors?.some(monitor => monitor._id.toString() === currentStudent?._id.toString())
                              ? 'නිරීක්ෂක අවසර ඇත'
                              : 'පැමිණීම් වාර්තාව'
                            }
                          </Typography>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Card
                        onClick={() => handlePaymentButtonClick(`/student-class-payments/${classId}`)}
                        sx={{
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
                      }}
                        onClick={() => navigate(`/student-assignments/${classId}`)}
                      >
                        <CardContent sx={{ textAlign: 'center', py: 3 }}>
                          <Assignment sx={{ fontSize: 40, mb: 2 }} />
                          <Typography variant="h6" fontWeight="bold" sx={{
                            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                          }}>
                            පැවරුම් සහ ඇගයීම්
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
                      }}
                        onClick={() => navigate(`/student-time-schedule/${classId}`)}
                      >
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
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                        onClick={() => navigate(`/student-exams/${classId}`)}
                      >
                        <CardContent sx={{ textAlign: 'center', py: 3 }}>
                          <Assignment sx={{ fontSize: 40, mb: 2 }} />
                          <Typography variant="h6" fontWeight="bold" sx={{
                            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                          }}>
                            විභාග සහ ප්‍රතිඵල
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                            විභාග සහ ලකුණු
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
                      }}
                        onClick={() => navigate(`/student-resources/${classId}`)}
                      >
                        <CardContent sx={{ textAlign: 'center', py: 3 }}>
                          <FolderOpen sx={{ fontSize: 40, mb: 2 }} />
                          <Typography variant="h6" fontWeight="bold" sx={{
                            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                          }}>
                            සම්පත් සහ මෙවලම්
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                            සම්පත් සහ ලින්ක්
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
                      }}
                        onClick={() => navigate(`/student-announcements/${classId}`)}
                      >
                        <CardContent sx={{ textAlign: 'center', py: 3 }}>
                          <Notifications sx={{ fontSize: 40, mb: 2 }} />
                          <Typography variant="h6" fontWeight="bold" sx={{
                            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                          }}>
                            විශේෂ නිවේදන සහ දැනුවත් කිරීම්
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                            නවතම දැනුම්දීම්
                          </Typography>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Card sx={{
                        height: '100%',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                        onClick={() => navigate(`/student-online-sessions/${classId}`)}
                      >
                        <CardContent sx={{ textAlign: 'center', py: 3 }}>
                          <Computer sx={{ fontSize: 40, mb: 2 }} />
                          <Typography variant="h6" fontWeight="bold" sx={{
                            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                          }}>
                            Online Sessions බලන්න
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                            මාර්ගගත සැසි බලන්න
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
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
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
                                fontSize: '0.75rem',
                                '&:hover': {
                                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                                  transform: 'scale(1.02)',
                                },
                                transition: 'all 0.3s ease'
                              }}
                            >
                              ප්‍රොෆයිලය සමග ප්‍රගතිය
                            </Button>
                            {isAdmin && (
                              <Button
                                variant="contained"
                                size="small"
                                startIcon={removingStudent === student._id ? <CircularProgress size={12} /> : <PersonRemove />}
                                onClick={() => handleRemoveStudent(student._id)}
                                disabled={removingStudent === student._id}
                                sx={{
                                  background: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
                                  color: 'white',
                                  fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                                  fontWeight: 'bold',
                                  textTransform: 'none',
                                  borderRadius: 2,
                                  fontSize: '0.75rem',
                                  '&:hover': {
                                    background: 'linear-gradient(135deg, #e53935 0%, #c62828 100%)',
                                    transform: 'scale(1.02)',
                                  },
                                  '&:disabled': {
                                    background: 'linear-gradient(135deg, #ffcdd2 0%, #ef9a9a 100%)',
                                    color: 'white',
                                    opacity: 0.7
                                  },
                                  transition: 'all 0.3s ease'
                                }}
                              >
                                ඉවත් කරන්න
                              </Button>
                            )}
                          </Box>
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

        {/* Add Student Dialog */}
        <Dialog
          open={addStudentDialog}
          onClose={() => {
            setAddStudentDialog(false);
            setSelectedClass('');
            setSelectedStudents([]);
            setSelectAll(false);
          }}
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
            <span>සිසුන් එක් කරන්න</span>
            <IconButton onClick={() => {
              setAddStudentDialog(false);
              setSelectedClass('');
              setSelectedStudents([]);
              setSelectAll(false);
            }}>
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              මෙම පන්තියට ලියාපදිංචි නොවූ අනුමත සිසුන්ගෙන් තෝරන්න
            </Typography>

            {/* Class Filter */}
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>පන්තිය අනුව පෙරහන් කරන්න</InputLabel>
              <Select
                value={selectedClass}
                onChange={handleClassFilterChange}
                label="පන්තිය අනුව පෙරහන් කරන්න"
              >
                <MenuItem value="">
                  <em>ඇතුලත් කල හැකි සියලුම සිසුන්</em>
                </MenuItem>
                {normalClasses.map((classItem) => (
                  <MenuItem key={classItem._id} value={classItem._id}>
                    {classItem.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Search Field */}
            <TextField
              fullWidth
              placeholder="සිසු ID හෝ නම අනුව සොයන්න..."
              value={studentSearchTerm}
              onChange={(e) => {
                setStudentSearchTerm(e.target.value);
                fetchAvailableStudents(e.target.value, selectedClass);
              }}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
              }}
              sx={{ mb: 3 }}
            />

            {/* Selected Count */}
            {selectedStudents.length > 0 && (
              <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" color="primary">
                  {selectedStudents.length} සිසුන් තෝරා ඇත
                </Typography>
                <Button
                  size="small"
                  onClick={() => {
                    setSelectedStudents([]);
                    setSelectAll(false);
                  }}
                >
                  අහෝසි කරන්න
                </Button>
              </Box>
            )}

            {loadingAvailableStudents ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : availableStudents.length > 0 ? (
              <TableContainer component={Paper} sx={{ mt: 2, maxHeight: 400 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectAll}
                          onChange={handleSelectAll}
                          indeterminate={selectedStudents.length > 0 && selectedStudents.length < availableStudents.length}
                        />
                      </TableCell>
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
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {availableStudents.map((student) => (
                      <TableRow
                        key={student._id}
                        hover
                        selected={selectedStudents.includes(student._id)}
                        sx={{ cursor: 'pointer' }}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selectedStudents.includes(student._id)}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStudentSelect(student._id);
                            }}
                          />
                        </TableCell>
                        <TableCell onClick={() => handleStudentSelect(student._id)}>
                          <Avatar
                            src={student.profilePicture}
                            sx={{ width: 40, height: 40 }}
                          >
                            {student.firstName?.charAt(0)}
                          </Avatar>
                        </TableCell>
                        <TableCell onClick={() => handleStudentSelect(student._id)}>
                          <Chip
                            label={student.studentId}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell onClick={() => handleStudentSelect(student._id)}>
                          <Typography variant="body2" fontWeight="medium">
                            {student.firstName} {student.lastName}
                          </Typography>
                        </TableCell>
                        <TableCell onClick={() => handleStudentSelect(student._id)}>
                          <Typography variant="body2">
                            {student.selectedGrade}
                          </Typography>
                        </TableCell>
                        <TableCell onClick={() => handleStudentSelect(student._id)}>
                          <Typography variant="body2">
                            {student.school}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Alert severity="info">
                {studentSearchTerm ? 'සෙවුම සඳහා ප්‍රතිඵල හමු නොවීය' : 'මෙහි මෙම පන්තියට එක් කළ හැකි සිසුන් නොමැත'}
              </Alert>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2, gap: 1 }}>
            <Button
              onClick={() => {
                setAddStudentDialog(false);
                setSelectedClass('');
                setSelectedStudents([]);
                setSelectAll(false);
              }}
            >
              අවලංගු කරන්න
            </Button>
            <Button
              variant="contained"
              onClick={handleBulkAddStudents}
              disabled={selectedStudents.length === 0 || bulkAdding}
              startIcon={bulkAdding ? <CircularProgress size={20} /> : <PersonAdd />}
              sx={{
                background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
                color: 'white',
                fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                fontWeight: 'bold',
                textTransform: 'none',
                borderRadius: 2,
                '&:hover': {
                  background: 'linear-gradient(135deg, #43a047 0%, #1b5e20 100%)',
                  transform: 'scale(1.02)',
                },
                '&:disabled': {
                  background: 'linear-gradient(135deg, #a5d6a7 0%, #81c784 100%)',
                  color: 'white',
                  opacity: 0.7
                },
                transition: 'all 0.3s ease'
              }}
            >
              {bulkAdding ? 'සිසුන් එකතු කරමින්...' : 'තෝරාගත් සිසුන් එක් කරන්න'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Free Class Dialog */}
        <Dialog
          open={freeClassDialog}
          onClose={() => setFreeClassDialog(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 4,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              overflow: 'hidden'
            }
          }}
        >
          <DialogContent sx={{ textAlign: 'center', py: 4, px: 3 }}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {/* Free Class Icon */}
              <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                mb: 3,
                position: 'relative'
              }}>
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  <Box sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #4CAF50 0%, #81C784 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 32px rgba(76, 175, 80, 0.3)',
                    border: '3px solid rgba(255, 255, 255, 0.2)'
                  }}>
                    <Payment sx={{ fontSize: 40, color: 'white' }} />
                  </Box>
                </motion.div>
              </Box>

              {/* Title */}
              <Typography variant="h4" fontWeight="bold" sx={{
                fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                mb: 2,
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}>
                🎉 නොමිලේ පන්තියක්! 🎉
              </Typography>

              {/* Message */}
              <Typography variant="h6" sx={{
                fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                mb: 3,
                opacity: 0.9,
                lineHeight: 1.6
              }}>
                මෙම පන්තිය සම්පූර්ණයෙන්ම නොමිලේ පවත්වනු ලබන පන්තියකි!
              </Typography>

              <Typography variant="body1" sx={{
                fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                mb: 4,
                opacity: 0.8,
                lineHeight: 1.5
              }}>
                ඔබට මෙම පන්තිය සදහා කිසිදු ගෙවීමක් කිරීමට අවශ්‍ය නැත.
                ගෙවීම් කළමනාකරණ පිටුවට ප්‍රවේශ වීමට අවශ්‍ය නැත.
              </Typography>

              {/* Decorative Elements */}
              <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: 2,
                mb: 3,
                opacity: 0.7
              }}>
                <motion.span
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                  style={{ fontSize: '2rem' }}
                >
                  ✨
                </motion.span>
                <motion.span
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                  style={{ fontSize: '2rem' }}
                >
                  🎓
                </motion.span>
                <motion.span
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
                  style={{ fontSize: '2rem' }}
                >
                  ✨
                </motion.span>
              </Box>
            </motion.div>
          </DialogContent>

          <DialogActions sx={{
            justifyContent: 'center',
            pb: 3,
            background: 'rgba(255, 255, 255, 0.1)'
          }}>
            <Button
              onClick={() => setFreeClassDialog(false)}
              variant="contained"
              size="large"
              sx={{
                background: 'linear-gradient(135deg, #4CAF50 0%, #81C784 100%)',
                color: 'white',
                fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                fontWeight: 'bold',
                px: 4,
                py: 1.5,
                borderRadius: 3,
                fontSize: '1.1rem',
                boxShadow: '0 4px 16px rgba(76, 175, 80, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #45a049 0%, #75c478 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(76, 175, 80, 0.5)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              තේරුම් ගත්තා! 👍
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default SpecificClass;
