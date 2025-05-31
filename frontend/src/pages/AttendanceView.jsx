import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Chip,
  Avatar,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  useTheme,
  useMediaQuery,
  TablePagination
} from '@mui/material';
import {
  ArrowBack,
  Assignment,
  CheckCircle,
  Cancel,
  Edit,
  Save,
  Visibility,
  CalendarToday,
  TrendingUp,
  People
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';

const AttendanceView = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isMonitor = searchParams.get('monitor') === 'true';
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // State management
  const [classData, setClassData] = useState(null);
  const [attendanceSheets, setAttendanceSheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState('');
  const [currentStudent, setCurrentStudent] = useState(null);
  const [studentAttendanceStats, setStudentAttendanceStats] = useState(null);

  // Update attendance dialog states
  const [updateDialog, setUpdateDialog] = useState(false);
  const [selectedSheet, setSelectedSheet] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [updateLoading, setUpdateLoading] = useState(false);

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Filter states
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchClassData();
    checkUserRole();
  }, [classId]);

  useEffect(() => {
    if (classData && currentStudent) {
      fetchAttendanceSheets();
      // Fetch student's personal attendance statistics
      if (userRole === 'student') {
        fetchStudentAttendanceStats();
      }
    }
  }, [classData, currentStudent, selectedMonth, selectedYear, userRole]);

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
        }
      }
    } catch (err) {
      console.error('Error checking user role:', err);
    }
  };

  const fetchAttendanceSheets = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/attendance/class/${classId}?month=${selectedMonth}&year=${selectedYear}`,
        { headers: { 'x-auth-token': token } }
      );

      setAttendanceSheets(response.data.data || []);
    } catch (err) {
      console.error('Error fetching attendance sheets:', err);

      // Handle specific error cases
      if (err.response?.status === 404 && err.response?.data?.message?.includes('Student profile not found')) {
        setError('ඔබගේ සිසු ප්‍රොෆයිලය හමු නොවීය. කරුණාකර පරිපාලකයා සම්බන්ධ කර ගන්න.');
      } else if (err.response?.status === 404) {
        setError('පන්තිය හමු නොවීය');
      } else {
        setError('පැමිණීම් පත්‍රිකා පූරණය කිරීමේදී දෝෂයක් ඇතිවිය');
      }
    }
  };

  const fetchStudentAttendanceStats = async () => {
    if (!currentStudent) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/attendance/student-stats/${currentStudent._id}/${classId}?month=${selectedMonth}&year=${selectedYear}`,
        { headers: { 'x-auth-token': token } }
      );
      setStudentAttendanceStats(response.data.data);
    } catch (err) {
      console.error('Error fetching student attendance stats:', err);
      // Set default stats if API fails
      setStudentAttendanceStats({
        totalSheets: 0,
        presentCount: 0,
        absentCount: 0,
        attendancePercentage: 0
      });
    }
  };

  // Get month name in Sinhala
  const getMonthNameSinhala = (month) => {
    const monthNames = [
      'ජනවාරි', 'පෙබරවාරි', 'මාර්තු', 'අප්‍රේල්', 'මැයි', 'ජූනි',
      'ජූලි', 'අගෝස්තු', 'සැප්තැම්බර්', 'ඔක්තෝබර්', 'නොවැම්බර්', 'දෙසැම්බර්'
    ];
    return monthNames[month - 1] || '';
  };

  const handleUpdateAttendance = async () => {
    try {
      setUpdateLoading(true);
      const token = localStorage.getItem('token');

      const payload = {
        studentAttendance: attendanceData.map(student => ({
          studentId: student.studentId._id,
          status: student.status
        }))
      };

      await axios.put(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/attendance/${selectedSheet._id}/monitor-update`,
        payload,
        { headers: { 'x-auth-token': token } }
      );

      setUpdateDialog(false);
      setSelectedSheet(null);
      setAttendanceData([]);

      fetchAttendanceSheets();
      alert('Attendance updated successfully!');
    } catch (err) {
      console.error('Error updating attendance:', err);
      alert(err.response?.data?.message || 'Failed to update attendance');
    } finally {
      setUpdateLoading(false);
    }
  };

  const openUpdateDialog = (sheet) => {
    setSelectedSheet(sheet);
    setAttendanceData(sheet.studentAttendance || []);
    setUpdateDialog(true);
  };

  const isViewOnlyMode = (sheet) => {
    return !canUpdateSheet(sheet) && canViewFullSheet(sheet);
  };

  const updateStudentAttendance = (studentId, status) => {
    setAttendanceData(prev =>
      prev.map(student =>
        student.studentId._id === studentId
          ? { ...student, status }
          : student
      )
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('si-LK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Present': return 'success';
      case 'Absent': return 'error';
      default: return 'default';
    }
  };

  const getSheetStatusColor = (status) => {
    switch (status) {
      case 'Draft': return 'warning';
      case 'Completed': return 'success';
      case 'Updated': return 'info';
      default: return 'default';
    }
  };

  const canUpdateSheet = (sheet) => {
    if (!isMonitor || !currentStudent) return false;

    // First check if student is actually a monitor of this class
    const isClassMonitor = classData.monitors?.some(monitor =>
      monitor._id.toString() === currentStudent._id.toString()
    );

    if (!isClassMonitor) return false;

    // Check if monitor has permission from admin
    // If adminOnly is true, no monitors have permission
    if (sheet.monitorPermissions?.adminOnly) {
      return false;
    }

    const hasPermission = sheet.monitorPermissions?.allMonitors ||
      sheet.monitorPermissions?.selectedMonitors?.some(monitor => {
        // Handle both populated objects and direct IDs
        const monitorId = monitor._id ? monitor._id.toString() : monitor.toString();
        return monitorId === currentStudent._id.toString();
      });

    // Debug permission checking
    console.log('Permission debug for sheet:', sheet._id, {
      allMonitors: sheet.monitorPermissions?.allMonitors,
      selectedMonitors: sheet.monitorPermissions?.selectedMonitors?.map(monitor => ({
        id: monitor._id ? monitor._id.toString() : monitor.toString(),
        name: monitor.firstName ? `${monitor.firstName} ${monitor.lastName}` : 'Unknown'
      })),
      currentStudentId: currentStudent._id.toString(),
      hasPermission
    });

    if (!hasPermission) return false;

    // Check if already locked by another monitor (early updater restriction)
    if (sheet.monitorUpdate?.isLocked) {
      // If locked by this monitor, they can still view but not edit again
      if (sheet.monitorUpdate?.updatedBy?.toString() === currentStudent._id.toString()) {
        return false; // Already updated by this monitor
      } else {
        return false; // Locked by another monitor
      }
    }

    // Can only update if sheet is in Draft status
    return sheet.status === 'Draft';
  };

  const canViewFullSheet = (sheet) => {
    if (!isMonitor || !currentStudent) return false;

    // Check if student is actually a monitor of this class
    const isClassMonitor = classData.monitors?.some(monitor =>
      monitor._id.toString() === currentStudent._id.toString()
    );

    // All class monitors can view attendance sheets (regardless of permission)
    return isClassMonitor;
  };

  const getMonitorStatus = (sheet) => {
    if (!isMonitor || !currentStudent) return null;

    const isClassMonitor = classData.monitors?.some(monitor =>
      monitor._id.toString() === currentStudent._id.toString()
    );

    if (!isClassMonitor) return 'not_monitor';

    // Check if sheet is updated/locked first (before checking permissions)
    if (sheet.monitorUpdate?.isLocked) {
      // Debug the comparison - check if updatedBy is populated correctly
      console.log('Monitor status debug:', {
        sheetId: sheet._id,
        sheetUpdatedBy: sheet.monitorUpdate?.updatedBy,
        sheetUpdatedByType: typeof sheet.monitorUpdate?.updatedBy,
        currentStudentId: currentStudent._id,
        currentStudentType: typeof currentStudent._id,
        comparison: sheet.monitorUpdate?.updatedBy?._id?.toString() === currentStudent._id.toString(),
        directComparison: sheet.monitorUpdate?.updatedBy?.toString() === currentStudent._id.toString()
      });

      // Try both comparison methods - populated object vs direct ID
      const isUpdatedByMe = sheet.monitorUpdate?.updatedBy?._id?.toString() === currentStudent._id.toString() ||
                           sheet.monitorUpdate?.updatedBy?.toString() === currentStudent._id.toString();

      if (isUpdatedByMe) {
        return 'updated_by_me';
      } else {
        return 'updated_by_other';
      }
    }

    // Check permissions only for non-updated sheets
    // If adminOnly is true, no monitors have permission
    if (sheet.monitorPermissions?.adminOnly) {
      return 'no_permission';
    }

    const hasPermission = sheet.monitorPermissions?.allMonitors ||
      sheet.monitorPermissions?.selectedMonitors?.some(monitor => {
        // Handle both populated objects and direct IDs
        const monitorId = monitor._id ? monitor._id.toString() : monitor.toString();
        return monitorId === currentStudent._id.toString();
      });

    if (!hasPermission) return 'no_permission';

    if (sheet.status === 'Draft') {
      return 'can_update';
    }

    return 'completed';
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
              {isMonitor ? 'නිරීක්ෂක පැමිණීම් කළමනාකරණය' : 'මගේ පැමිණීම්'}
            </Typography>
          </Box>

          <Typography variant="h6" color="text.secondary" sx={{
            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
          }}>
            {classData.grade} - {classData.category}
          </Typography>

          {isMonitor && (
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{
                fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
              }}>
                ⚠️ සටහන: ඔබට පැමිණීම් පත්‍රිකාවක් එක් වරක් පමණක් යාවත්කාලීන කළ හැක. ප්‍රවේශමෙන් සලකුණු කරන්න.
              </Typography>
            </Alert>
          )}
        </Paper>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Paper elevation={6} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight="bold" sx={{
              fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
              mb: 2
            }}>
              පෙරහන්
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  select
                  fullWidth
                  label="මාසය"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  SelectProps={{ native: true }}
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {new Date(2024, i).toLocaleDateString('si-LK', { month: 'long' })}
                    </option>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  select
                  fullWidth
                  label="වර්ෂය"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  SelectProps={{ native: true }}
                >
                  {Array.from({ length: 100 }, (_, i) => {
                    const year = new Date().getFullYear() - 2 + i;
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </TextField>
              </Grid>
            </Grid>
          </Paper>
        </motion.div>

        {/* Student Personal Attendance Statistics */}
        {userRole === 'student' && studentAttendanceStats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Paper elevation={6} sx={{
              p: 4,
              mb: 4,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Background decoration */}
              <Box sx={{
                position: 'absolute',
                top: -30,
                left: -30,
                width: 150,
                height: 150,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                zIndex: 0
              }} />

              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <People sx={{ fontSize: 40, color: 'rgba(255, 255, 255, 0.9)' }} />
                  <Box>
                    <Typography variant="h5" fontWeight="bold" sx={{
                      fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                    }}>
                      මගේ පැමිණීම් තත්ත්වය
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      {getMonthNameSinhala(selectedMonth)} {selectedYear} - {classData.grade} - {classData.category}
                    </Typography>
                  </Box>
                </Box>

                <Grid container spacing={3}>
                  {/* Main Personal Percentage - Featured */}
                  <Grid item xs={12} md={6}>
                    <Box sx={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      borderRadius: 3,
                      p: 3,
                      textAlign: 'center',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      <Typography variant="h6" fontWeight="bold" sx={{
                        fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                        mb: 2,
                        opacity: 0.9
                      }}>
                        මගේ පැමිණීම් ප්‍රතිශතය
                      </Typography>

                      <Box sx={{ position: 'relative', display: 'inline-flex', mb: 2 }}>
                        <CircularProgress
                          variant="determinate"
                          value={studentAttendanceStats.attendancePercentage}
                          size={120}
                          thickness={6}
                          sx={{
                            color: studentAttendanceStats.attendancePercentage >= 80 ? '#4caf50' :
                                   studentAttendanceStats.attendancePercentage >= 60 ? '#ff9800' : '#f44336',
                            '& .MuiCircularProgress-circle': {
                              strokeLinecap: 'round',
                            }
                          }}
                        />
                        <Box sx={{
                          top: 0,
                          left: 0,
                          bottom: 0,
                          right: 0,
                          position: 'absolute',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          <Typography variant="h3" fontWeight="bold" color="white">
                            {studentAttendanceStats.attendancePercentage}%
                          </Typography>
                        </Box>
                      </Box>

                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        {studentAttendanceStats.totalSheets} පත්‍රිකාවලින්
                      </Typography>
                    </Box>
                  </Grid>

                  {/* Personal Statistics */}
                  <Grid item xs={12} md={6}>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Box sx={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: 2,
                          p: 2,
                          textAlign: 'center'
                        }}>
                          <Typography variant="h4" fontWeight="bold" color="#4caf50">
                            {studentAttendanceStats.presentCount}
                          </Typography>
                          <Typography variant="body2" sx={{ opacity: 0.8 }}>
                            පැමිණි දින
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={6}>
                        <Box sx={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: 2,
                          p: 2,
                          textAlign: 'center'
                        }}>
                          <Typography variant="h4" fontWeight="bold" color="#f44336">
                            {studentAttendanceStats.absentCount}
                          </Typography>
                          <Typography variant="body2" sx={{ opacity: 0.8 }}>
                            නොපැමිණි දින
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={12}>
                        <Box sx={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: 2,
                          p: 2,
                          textAlign: 'center'
                        }}>
                          <Typography variant="h4" fontWeight="bold">
                            {studentAttendanceStats.totalSheets}
                          </Typography>
                          <Typography variant="body2" sx={{ opacity: 0.8 }}>
                            මුළු පැමිණීම් පත්‍රිකා
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>

                {/* Personal Performance Indicator */}
                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <Typography variant="body1" sx={{
                    fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                    opacity: 0.9
                  }}>
                    {studentAttendanceStats.attendancePercentage >= 90 ? '🌟 ඉතා විශිෂ්ට! ඔබ නිතරම පන්තියට පැමිණෙනවා!' :
                     studentAttendanceStats.attendancePercentage >= 80 ? '🎉 විශිෂ්ට! හොඳ පැමිණීම් වාර්තාවක්!' :
                     studentAttendanceStats.attendancePercentage >= 60 ? '👍 හොඳයි! තව ටිකක් වැඩිදියුණු කරන්න!' :
                     '📚 වැඩිපුර පන්තියට පැමිණීමට උත්සාහ කරන්න!'}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </motion.div>
        )}

        {/* Attendance Sheets */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Paper elevation={6} sx={{ borderRadius: 3 }}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" sx={{
                fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                mb: 2
              }}>
                පැමිණීම් වාර්තා ({attendanceSheets.length})
              </Typography>
            </Box>

            {attendanceSheets.length > 0 ? (
              <>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif' }}>
                          දිනය
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'bold', fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif' }}>
                          තත්ත්වය
                        </TableCell>
                        {!isMonitor && (
                          <TableCell sx={{ fontWeight: 'bold', fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif' }}>
                            මගේ පැමිණීම
                          </TableCell>
                        )}
                        {isMonitor && (
                          <>
                            <TableCell sx={{ fontWeight: 'bold', fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif' }}>
                              අපේක්ෂිත සංඛ්‍යාව
                            </TableCell>
                            <TableCell sx={{ fontWeight: 'bold', fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif' }}>
                              සැබෑ සංඛ්‍යාව
                            </TableCell>
                            <TableCell sx={{ fontWeight: 'bold', fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif' }}>
                              ක්‍රියාමාර්ග
                            </TableCell>
                          </>
                        )}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {attendanceSheets
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((sheet) => {
                          const myAttendance = sheet.studentAttendance?.find(
                            record => record.studentId._id === currentStudent?._id
                          );

                          return (
                            <TableRow key={sheet._id} hover>
                              <TableCell>
                                <Typography variant="body2" fontWeight="medium">
                                  {formatDate(sheet.date)}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={sheet.status}
                                  color={getSheetStatusColor(sheet.status)}
                                  size="small"
                                />
                                {sheet.status === 'Draft' && (
                                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                    නිරීක්ෂකයා විසින් තවම යාවත්කාලීන කර නැත
                                  </Typography>
                                )}
                              </TableCell>
                              {!isMonitor && (
                                <TableCell>
                                  {myAttendance ? (
                                    <Chip
                                      label={myAttendance.status === 'Present' ? 'පැමිණ ඇත' : 'නොපැමිණ'}
                                      color={getStatusColor(myAttendance.status)}
                                      size="small"
                                    />
                                  ) : (
                                    <Typography variant="body2" color="text.secondary">
                                      මෙදින පන්තියේ ඔබව තවම සලකුණු කර නැත
                                    </Typography>
                                  )}
                                </TableCell>
                              )}
                              {isMonitor && (
                                <>
                                  <TableCell>
                                    <Typography variant="body2">
                                      {sheet.expectedPresentCount}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography variant="body2">
                                      {sheet.actualPresentCount}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
                                      <Box sx={{ display: 'flex', gap: 1 }}>
                                        {/* View button - always available for monitors with permission */}
                                        {(canViewFullSheet(sheet) || canUpdateSheet(sheet)) && (
                                          <IconButton
                                            size="small"
                                            color="primary"
                                            onClick={() => openUpdateDialog(sheet)}
                                            title="පැමිණීම් බලන්න"
                                          >
                                            <Visibility />
                                          </IconButton>
                                        )}

                                        {/* Edit button - only for sheets that can be updated */}
                                        {canUpdateSheet(sheet) && (
                                          <IconButton
                                            size="small"
                                            color="secondary"
                                            onClick={() => openUpdateDialog(sheet)}
                                            title="පැමිණීම් යාවත්කාලීන කරන්න"
                                          >
                                            <Edit />
                                          </IconButton>
                                        )}
                                      </Box>

                                      {/* Status messages */}
                                      {(() => {
                                        const status = getMonitorStatus(sheet);
                                        switch (status) {
                                          case 'not_monitor':
                                            return (
                                              <Typography variant="caption" color="text.secondary">
                                                ඔබ මෙම පන්තියේ නිරීක්ෂකයෙකු නොවේ
                                              </Typography>
                                            );
                                          case 'no_permission':
                                            return (
                                              <Typography variant="caption" color="text.secondary">
                                                ඔබට මෙම පත්‍රිකාව යාවත්කාලීන කිරීමට අවසර නැත
                                              </Typography>
                                            );
                                          case 'updated_by_me':
                                            return (
                                              <Typography variant="caption" color="success.main">
                                                ඔබ විසින් යාවත්කාලීන කර ඇත
                                              </Typography>
                                            );
                                          case 'updated_by_other':
                                            return (
                                              <Typography variant="caption" color="warning.main">
                                                වෙනත් නිරීක්ශකයෙකු විසින් යාවත්කාලීන කර ඇත
                                              </Typography>
                                            );
                                          case 'can_update':
                                            return (
                                              <Typography variant="caption" color="info.main">
                                                යාවත්කාලීන කිරීමට හැකිය
                                              </Typography>
                                            );
                                          case 'completed':
                                            return (
                                              <Typography variant="caption" color="success.main">
                                                සම්පූර්ණ කර ඇත
                                              </Typography>
                                            );
                                          default:
                                            return null;
                                        }
                                      })()}
                                    </Box>
                                  </TableCell>
                                </>
                              )}
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </TableContainer>

                <TablePagination
                  component="div"
                  count={attendanceSheets.length}
                  page={page}
                  onPageChange={(event, newPage) => setPage(newPage)}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={(event) => {
                    setRowsPerPage(parseInt(event.target.value, 10));
                    setPage(0);
                  }}
                  labelRowsPerPage="පිටුවකට පේළි:"
                  labelDisplayedRows={({ from, to, count }) =>
                    `${from}-${to} of ${count !== -1 ? count : `more than ${to}`}`
                  }
                />
              </>
            ) : (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Assignment sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" sx={{
                  fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                }}>
                  මෙම මාසයේ පැමිණීම් වාර්තා නොමැත
                </Typography>
              </Box>
            )}
          </Paper>
        </motion.div>

        {/* Update Attendance Dialog */}
        <Dialog
          open={updateDialog}
          onClose={() => setUpdateDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{
            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
            fontWeight: 'bold'
          }}>
            {selectedSheet && canUpdateSheet(selectedSheet)
              ? 'පැමිණීම් යාවත්කාලීන කරන්න'
              : 'පැමිණීම් බලන්න'
            }
          </DialogTitle>
          <DialogContent>
            {selectedSheet && (
              <Box sx={{ mt: 2 }}>
                {canUpdateSheet(selectedSheet) ? (
                  <Alert severity="warning" sx={{ mb: 3 }}>
                    <Typography variant="body2" sx={{
                      fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                    }}>
                      අපේක්ෂිත පැමිණ සිසුන් සංඛ්‍යාව: <strong>{selectedSheet.expectedPresentCount}</strong>
                      <br />
                      ඔබ සලකුණු කරන පැමිණ සිසුන් සංඛ්‍යාව මෙම අගයට සමාන විය යුතුය.
                    </Typography>
                  </Alert>
                ) : (
                  <Alert severity="info" sx={{ mb: 3 }}>
                    <Typography variant="body2" sx={{
                      fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                    }}>
                      අපේක්ෂිත පැමිණ සිසුන් සංඛ්‍යාව: <strong>{selectedSheet.expectedPresentCount}</strong>
                      <br />
                      සැබෑ පැමිණ සිසුන් සංඛ්‍යාව: <strong>{selectedSheet.actualPresentCount}</strong>
                      <br />
                      {selectedSheet.monitorUpdate?.updatedBy?.toString() === currentStudent?._id.toString()
                        ? 'ඔබ විසින් යාවත්කාලීන කර ඇත'
                        : 'වෙනත් නිරීක්ෂකයෙකු විසින් යාවත්කාලීන කර ඇත'
                      }
                    </Typography>
                  </Alert>
                )}

                <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif' }}>
                          සිසුවා
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'bold', fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif' }}>
                          සිසු ID
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'bold', fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif' }}>
                          පැමිණීම
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {attendanceData.map((student) => (
                        <TableRow key={student.studentId._id}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Avatar
                                src={student.studentId.profilePicture}
                                sx={{ width: 32, height: 32 }}
                              >
                                {student.studentId.firstName?.charAt(0)}
                              </Avatar>
                              <Box>
                                <Typography variant="body2">
                                  {student.studentId.firstName} {student.studentId.lastName}
                                  {/* Show (you) label for the current monitor */}
                                  {isMonitor && student.studentId._id === currentStudent?._id && (
                                    <Chip
                                      label="ඔබ"
                                      size="small"
                                      color="primary"
                                      variant="outlined"
                                      sx={{
                                        ml: 1,
                                        fontSize: '0.7rem',
                                        height: '20px',
                                        fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                                      }}
                                    />
                                  )}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={student.studentId.studentId}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            {canUpdateSheet(selectedSheet) ? (
                              <FormControl component="fieldset">
                                <RadioGroup
                                  row
                                  value={student.status}
                                  onChange={(e) => updateStudentAttendance(student.studentId._id, e.target.value)}
                                >
                                  <FormControlLabel
                                    value="Present"
                                    control={<Radio color="success" />}
                                    label="පැමිණ ඇත"
                                  />
                                  <FormControlLabel
                                    value="Absent"
                                    control={<Radio color="error" />}
                                    label="නොපැමිණ"
                                  />
                                </RadioGroup>
                              </FormControl>
                            ) : (
                              <Chip
                                label={student.status === 'Present' ? 'පැමිණ ඇත' : 'නොපැමිණ'}
                                color={student.status === 'Present' ? 'success' : 'error'}
                                size="small"
                              />
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 2 }}>
                  <Typography variant="body2" sx={{
                    fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                  }}>
                    <strong>සාරාංශය:</strong>
                    <br />
                    පැමිණ ඇති සිසුන්: {attendanceData.filter(s => s.status === 'Present').length}
                    <br />
                    නොපැමිණි සිසුන්: {attendanceData.filter(s => s.status === 'Absent').length}
                    <br />
                    සම්පූර්ණ සිසුන්: {attendanceData.length}
                  </Typography>

                  {attendanceData.filter(s => s.status === 'Present').length !== selectedSheet.expectedPresentCount && (
                    <Alert severity="error" sx={{ mt: 1 }}>
                      <Typography variant="body2">
                        පැමිණ ඇති සිසුන් සංඛ්‍යාව ({attendanceData.filter(s => s.status === 'Present').length})
                        අපේක්ෂිත සංඛ්‍යාවට ({selectedSheet.expectedPresentCount}) සමාන නොවේ!
                      </Typography>
                    </Alert>
                  )}
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setUpdateDialog(false)}>
              {selectedSheet && canUpdateSheet(selectedSheet) ? 'අවලංගු කරන්න' : 'වසන්න'}
            </Button>
            {selectedSheet && canUpdateSheet(selectedSheet) && (
              <Button
                variant="contained"
                onClick={handleUpdateAttendance}
                disabled={
                  updateLoading ||
                  !selectedSheet ||
                  attendanceData.filter(s => s.status === 'Present').length !== selectedSheet.expectedPresentCount
                }
                startIcon={updateLoading ? <CircularProgress size={16} /> : <Save />}
              >
                {updateLoading ? 'යාවත්කාලීන කරමින්...' : 'යාවත්කාලීන කරන්න'}
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default AttendanceView;
