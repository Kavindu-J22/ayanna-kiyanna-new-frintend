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
  Divider
} from '@mui/material';
import {
  ArrowBack,
  Save,
  Edit,
  Visibility,
  People,
  Assignment,
  CheckCircle,
  Cancel
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';

const AttendanceEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEditMode = searchParams.get('edit') === 'true';
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // State management
  const [attendanceSheet, setAttendanceSheet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState('');

  // Form states
  const [formData, setFormData] = useState({
    expectedPresentCount: '',
    monitorPermissions: {
      allMonitors: false,
      selectedMonitors: []
    },
    studentAttendance: [],
    notes: ''
  });

  useEffect(() => {
    fetchAttendanceSheet();
    checkUserRole();
  }, [id]);

  const fetchAttendanceSheet = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/attendance/${id}`,
        { headers: { 'x-auth-token': token } }
      );

      const sheet = response.data.data;
      setAttendanceSheet(sheet);

      // Initialize form data
      setFormData({
        expectedPresentCount: sheet.expectedPresentCount,
        monitorPermissions: sheet.monitorPermissions,
        studentAttendance: sheet.studentAttendance || [],
        notes: sheet.notes || ''
      });
    } catch (err) {
      console.error('Error fetching attendance sheet:', err);
      setError('Failed to load attendance sheet');
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
    } catch (err) {
      console.error('Error checking user role:', err);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');

      const payload = {
        studentAttendance: formData.studentAttendance
          .filter(student => student.studentId?._id) // Filter out students without valid IDs
          .map(student => ({
            studentId: student.studentId._id,
            status: student.status
          }))
      };

      await axios.put(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/attendance/${id}`,
        payload,
        { headers: { 'x-auth-token': token } }
      );

      alert('පැමිණීම් සාර්ථකව යාවත්කාලීන කරන ලදී!');
      navigate(-1);
    } catch (err) {
      console.error('Error updating attendance sheet:', err);
      alert(err.response?.data?.message || 'Failed to update attendance sheet');
    } finally {
      setSaving(false);
    }
  };

  const updateStudentAttendance = (studentId, status) => {
    setFormData(prev => ({
      ...prev,
      studentAttendance: prev.studentAttendance.map(student =>
        student.studentId._id === studentId
          ? { ...student, status }
          : student
      )
    }));
  };



  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('si-LK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error || !attendanceSheet) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{error || 'Attendance sheet not found'}</Alert>
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
  const canEdit = isAdmin && isEditMode;
  const presentCount = formData.studentAttendance.filter(s => s.status === 'Present').length;

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
              {canEdit ? 'පැමිණීම් සංස්කරණය' : 'පැමිණීම් බැලීම'}
            </Typography>
          </Box>

          <Typography variant="h6" color="text.secondary" sx={{
            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
          }}>
            {attendanceSheet.classId?.grade} - {attendanceSheet.classId?.category}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            දිනය: {formatDate(attendanceSheet.date)}
          </Typography>
        </Paper>

        {/* Attendance Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper elevation={6} sx={{ p: 4, mb: 4, borderRadius: 3 }}>
            <Grid container spacing={3}>
              {/* Expected Present Count - Read Only */}
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="තහවුරු කල පැමිණ සිසුන් සංඛ්‍යාව"
                  value={formData.expectedPresentCount}
                  disabled
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>

              {/* Actual Present Count */}
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="සටහන් කල සිසුන් සංඛ්‍යාව"
                  value={presentCount}
                  disabled
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>

              {/* Total Students */}
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="සම්පූර්ණ සිසුන් සංඛ්‍යාව"
                  value={formData.studentAttendance.length}
                  disabled
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>

              {/* Attendance Percentage */}
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="පැමිණීම් ප්‍රතිශතය"
                  value={`${Math.round((presentCount / formData.studentAttendance.length) * 100) || 0}%`}
                  disabled
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
            </Grid>
          </Paper>
        </motion.div>

        {/* Monitor Permissions - Display Only */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Paper elevation={6} sx={{ p: 4, mb: 4, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight="bold" sx={{
              fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
              mb: 3
            }}>
              නිරීක්ෂක අවසර
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body1" sx={{
                fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                fontWeight: 'medium',
                color: 'primary.main'
              }}>
                {formData.monitorPermissions.adminOnly
                  ? "ඔබ සදහා පමණක් අවසර ලබා දී ඇත.(Admin Only)"
                  : formData.monitorPermissions.allMonitors
                  ? "සියලුම නිරීක්ෂකයින්ට අවසර දී ඇත"
                  : "තෝරාගත් නිරීක්ෂකයින්ට අවසර දී ඇත"}
              </Typography>
            </Box>

            {/* Selected Monitors Display */}
            {!formData.monitorPermissions.allMonitors && !formData.monitorPermissions.adminOnly && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" sx={{
                  fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                  fontWeight: 'bold',
                  mb: 2
                }}>
                  තෝරාගත් නිරීක්ෂකයින්:
                </Typography>

                {attendanceSheet.classId?.monitors && attendanceSheet.classId.monitors.length > 0 ? (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {attendanceSheet.classId.monitors
                      .filter(monitor => {
                        const selectedMonitorStrings = formData.monitorPermissions.selectedMonitors.map(id =>
                          typeof id === 'object' ? id._id?.toString() || id.toString() : id.toString()
                        );
                        return selectedMonitorStrings.includes(monitor._id.toString());
                      })
                      .map((monitor) => (
                        <Chip
                          key={monitor._id}
                          avatar={
                            <Avatar
                              src={monitor.profilePicture}
                              sx={{ width: 24, height: 24 }}
                            >
                              {monitor.firstName?.charAt(0)}
                            </Avatar>
                          }
                          label={`${monitor.firstName} ${monitor.lastName}`}
                          variant="outlined"
                          color="primary"
                          size="small"
                        />
                      ))}
                  </Box>
                ) : (
                  <Alert severity="info">
                    මෙම පන්තියට නිරීක්ෂකයින් නොමැත
                  </Alert>
                )}
              </Box>
            )}
          </Paper>
        </motion.div>

        {/* Student Attendance */}
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
                සිසුන්ගේ පැමිණීම් ({formData.studentAttendance.length})
              </Typography>

              {/* Check if there are any "පසුව සම්භන්ද වූ සිසුවෙකි" students */}
              {formData.studentAttendance.some(student =>
                !student.studentId ||
                (student.studentId &&
                 (`${student.studentId.firstName || ''} ${student.studentId.lastName || ''}`.trim() === ''))
              ) && (
                <Alert
                  severity="info"
                  sx={{
                    mb: 2,
                    background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
                    border: '2px solid #4caf50',
                    borderRadius: 3,
                    boxShadow: '0 4px 12px rgba(76, 175, 80, 0.15)'
                  }}
                >
                  <Typography variant="h6" sx={{
                    fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                    fontWeight: 'bold',
                    mb: 2,
                    color: '#2e7d32',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    🎯 විශේෂ සටහන - පසුව සම්භන්ද වූ සිසුන්
                  </Typography>

                  <Typography variant="body1" sx={{
                    fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                    fontWeight: 'medium',
                    mb: 2,
                    color: '#1b5e20',
                    lineHeight: 1.7
                  }}>
                    📋 <strong>මෙම පැමිණීම් පත්‍රිකාවේ "පසුව සම්භන්ද වූ සිසුන්" ද ඇතුළත් වේ.</strong>
                  </Typography>

                  <Box sx={{
                    background: 'rgba(255, 255, 255, 0.7)',
                    borderRadius: 2,
                    p: 2,
                    mb: 2,
                    border: '1px solid rgba(76, 175, 80, 0.3)'
                  }}>
                    <Typography variant="body2" sx={{
                      fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                      color: '#2e7d32',
                      lineHeight: 1.6,
                      mb: 1
                    }}>
                      🔄 <strong>ස්වයංක්‍රීය ගණනය කිරීම:</strong> පද්ධතිය පසුව එක්වූ සිසුන්ගේ පැමිණීම් විශ්ලේෂණ ස්වයංක්‍රීයව සිදු කරයි.
                      පහසුව සඳහා ඔවුන් එදින <strong>"පැමිණි සිසුන්"</strong> ලෙස සලකනු ලැබේ.
                    </Typography>

                    <Typography variant="body2" sx={{
                      fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                      color: '#2e7d32',
                      lineHeight: 1.6
                    }}>
                      ⚠️ <strong>අවවාදය නොසලකන්න:</strong> "සටහන් කළ සිසුන් සංඛ්‍යාව තහවුරු කළ සංඛ්‍යාවට සමාන නොවේ!"
                      යන අවවාදය මෙම හේතුව නිසා පෙන්විය හැක. <strong>එය නොසලකා හරින්න.</strong>
                    </Typography>
                  </Box>

                  <Typography variant="body2" sx={{
                    fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                    color: '#388e3c',
                    fontStyle: 'italic',
                    textAlign: 'center'
                  }}>
                    💡 මෙය සාමාන්‍ය ක්‍රියාවලියකි. කරුණාකර අවබෝධයෙන් සිටින්න!
                  </Typography>
                </Alert>
              )}

              {presentCount !== formData.expectedPresentCount && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    සටහන් කල සිසුන් සංඛ්‍යාව ({presentCount}) තහවුරු කල සංඛ්‍යාවට ({formData.expectedPresentCount}) සමාන නොවේ!
                  </Typography>
                </Alert>
              )}
            </Box>

            <TableContainer sx={{ maxHeight: 600 }}>
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
                    {!canEdit && (
                      <TableCell sx={{ fontWeight: 'bold', fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif' }}>
                        අවසන් සංස්කරණය
                      </TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formData.studentAttendance.map((student) => (
                    <TableRow key={student.studentId?._id || student._id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar
                            src={student.studentId?.profilePicture}
                            sx={{ width: 32, height: 32 }}
                          >
                            {student.studentId?.firstName?.charAt(0) || '?'}
                          </Avatar>
                          <Typography variant="body2">
                            {student.studentId ?
                              `${student.studentId.firstName || ''} ${student.studentId.lastName || ''}` :
                              'පසුව සම්භන්ද වූ සිසුවෙකි'
                            }
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={student.studentId?.studentId || 'ගණනය කිරීම් සදහා "පැමිණ ඇත" ලෙස ගෙන ඇත'}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        {canEdit ? (
                          <FormControl component="fieldset">
                            <RadioGroup
                              row
                              value={student.status}
                              onChange={(e) => updateStudentAttendance(student.studentId?._id, e.target.value)}
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
                      {!canEdit && (
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {student.markedBy ? (
                              <Box>
                                <Typography variant="body2" fontWeight="medium">
                                  {attendanceSheet.status === 'Updated' && attendanceSheet.monitorUpdate?.updatedBy ?
                                    `Monitor: ${attendanceSheet.monitorUpdate.updatedBy.firstName} ${attendanceSheet.monitorUpdate.updatedBy.lastName}` :
                                    `Admin: ${student.markedBy.fullName || 'Admin'}`
                                  }
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {student.markedAt ? new Date(student.markedAt).toLocaleDateString('si-LK') : 'N/A'}
                                </Typography>
                              </Box>
                            ) : (
                              'තවම සලකුණු කර නැත'
                            )}
                          </Typography>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </motion.div>

        {/* Notes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Paper elevation={6} sx={{ p: 4, mt: 4, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight="bold" sx={{
              fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
              mb: 2
            }}>
              සටහන්
            </Typography>

            <TextField
              fullWidth
              multiline
              rows={4}
              value={formData.notes || "සටහන් නොමැත"}
              disabled
              InputProps={{
                readOnly: true,
              }}
            />
          </Paper>
        </motion.div>

        {/* Action Buttons - Only show for edit mode */}
        {canEdit && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Paper elevation={6} sx={{ p: 3, mt: 4, borderRadius: 3 }}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate(-1)}
                  disabled={saving}
                  sx={{
                    fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                    fontWeight: 'bold'
                  }}
                >
                  අවලංගු කරන්න
                </Button>
                <Button
                  variant="contained"
                  startIcon={saving ? <CircularProgress size={16} /> : <Save />}
                  onClick={handleSave}
                  disabled={saving}
                  sx={{
                    background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
                    color: 'white',
                    fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                    fontWeight: 'bold',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #43a047 0%, #1b5e20 100%)',
                    }
                  }}
                >
                  {saving ? 'සුරකිමින්...' : 'සුරකින්න'}
                </Button>
              </Box>
            </Paper>
          </motion.div>
        )}

      </Container>
    </Box>
  );
};

export default AttendanceEdit;
