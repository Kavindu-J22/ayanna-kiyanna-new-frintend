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
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Chip,
  Divider,
  useTheme,
  useMediaQuery,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination
} from '@mui/material';
import {
  ArrowBack,
  Add,
  Edit,
  Delete,
  Save,
  Cancel,
  People,
  Assignment,
  CheckCircle,
  Close,
  Visibility,
  CalendarToday,
  TrendingUp
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';

const AttendanceManagement = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // State management
  const [classData, setClassData] = useState(null);
  const [attendanceSheets, setAttendanceSheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState('');

  // Create attendance dialog states
  const [createDialog, setCreateDialog] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [formData, setFormData] = useState({
    expectedPresentCount: '',
    monitorPermissions: {
      allMonitors: false,
      selectedMonitors: []
    },
    notes: ''
  });

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
    if (classData) {
      fetchAttendanceSheets();
    }
  }, [classData, selectedMonth, selectedYear]);

  const fetchClassData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5000/api/classes/${classId}`,
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
        'http://localhost:5000/api/auth/me',
        { headers: { 'x-auth-token': token } }
      );
      setUserRole(response.data.role);
    } catch (err) {
      console.error('Error checking user role:', err);
    }
  };

  const fetchAttendanceSheets = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5000/api/attendance/class/${classId}?month=${selectedMonth}&year=${selectedYear}`,
        { headers: { 'x-auth-token': token } }
      );
      setAttendanceSheets(response.data.data || []);
    } catch (err) {
      console.error('Error fetching attendance sheets:', err);
      setError('Failed to load attendance sheets');
    }
  };

  const handleCreateAttendance = async () => {
    try {
      // Validation
      if (!formData.expectedPresentCount || formData.expectedPresentCount <= 0) {
        alert('කරුණාකර වලංගු අපේක්ෂිත පැමිණ සිසුන් සංඛ්‍යාවක් ඇතුළත් කරන්න');
        return;
      }

      // Validate expected count doesn't exceed total students
      if (parseInt(formData.expectedPresentCount) > (classData?.enrolledCount || 0)) {
        alert(`අපේක්ෂිත සංඛ්‍යාව සම්පූර්ණ සිසුන් සංඛ්‍යාවට (${classData?.enrolledCount || 0}) වඩා වැඩි විය නොහැක`);
        return;
      }

      // Validate monitor permissions
      if (!formData.monitorPermissions.allMonitors &&
          formData.monitorPermissions.selectedMonitors.length === 0) {
        alert('කරුණාකර අවම වශයෙන් එක් නිරීක්ෂකයෙකු තෝරන්න හෝ "සියලුම නිරීක්ෂකයින්ට අවසර දෙන්න" තෝරන්න');
        return;
      }

      setCreateLoading(true);
      const token = localStorage.getItem('token');

      const payload = {
        classId,
        expectedPresentCount: parseInt(formData.expectedPresentCount),
        monitorPermissions: formData.monitorPermissions,
        notes: formData.notes
      };

      await axios.post(
        'http://localhost:5000/api/attendance',
        payload,
        { headers: { 'x-auth-token': token } }
      );

      setCreateDialog(false);
      setFormData({
        expectedPresentCount: '',
        monitorPermissions: {
          allMonitors: false,
          selectedMonitors: []
        },
        notes: ''
      });

      fetchAttendanceSheets();
      alert('Attendance sheet created successfully!');
    } catch (err) {
      console.error('Error creating attendance sheet:', err);
      alert(err.response?.data?.message || 'Failed to create attendance sheet');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDeleteAttendance = async (attendanceId) => {
    if (!window.confirm('Are you sure you want to delete this attendance sheet? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `http://localhost:5000/api/attendance/${attendanceId}`,
        { headers: { 'x-auth-token': token } }
      );

      fetchAttendanceSheets();
      alert('Attendance sheet deleted successfully!');
    } catch (err) {
      console.error('Error deleting attendance sheet:', err);
      alert(err.response?.data?.message || 'Failed to delete attendance sheet');
    }
  };

  const handleMonitorSelection = (monitorId) => {
    const selectedMonitors = formData.monitorPermissions.selectedMonitors;
    const isSelected = selectedMonitors.includes(monitorId);

    if (isSelected) {
      setFormData({
        ...formData,
        monitorPermissions: {
          ...formData.monitorPermissions,
          selectedMonitors: selectedMonitors.filter(id => id !== monitorId)
        }
      });
    } else {
      setFormData({
        ...formData,
        monitorPermissions: {
          ...formData.monitorPermissions,
          selectedMonitors: [...selectedMonitors, monitorId]
        }
      });
    }
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
      case 'Draft': return 'warning';
      case 'Completed': return 'success';
      case 'Updated': return 'info';
      default: return 'default';
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
              පැමිණීම් කළමනාකරණය
            </Typography>
          </Box>

          <Typography variant="h6" color="text.secondary" sx={{
            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
          }}>
            {classData.grade} - {classData.category}
          </Typography>
        </Paper>

        {/* Class Info and Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper elevation={6} sx={{ p: 4, mb: 4, borderRadius: 3 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={8}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Assignment color="primary" sx={{ fontSize: 40 }} />
                  <Box>
                    <Typography variant="h5" fontWeight="bold" sx={{
                      fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                    }}>
                      පැමිණීම් පත්‍රිකා කළමනාකරණය
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedMonth}/{selectedYear} මාසය සඳහා
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {isAdmin && (
                <Grid item xs={12} md={4}>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => setCreateDialog(true)}
                    fullWidth
                    sx={{
                      background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
                      color: 'white',
                      fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                      fontWeight: 'bold',
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: 'none',
                      boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #43a047 0%, #1b5e20 100%)',
                        boxShadow: '0 6px 16px rgba(76, 175, 80, 0.4)',
                        transform: 'translateY(-1px)',
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    නව පැමිණීම් පත්‍රිකාවක් සාදන්න
                  </Button>
                </Grid>
              )}
            </Grid>
          </Paper>
        </motion.div>

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
                  {Array.from({ length: 5 }, (_, i) => {
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

        {/* Attendance Sheets Table */}
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
                පැමිණීම් පත්‍රිකා ({attendanceSheets.length})
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
                        <TableCell sx={{ fontWeight: 'bold', fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif' }}>
                          අපේක්ෂිත සංඛ්‍යාව
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'bold', fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif' }}>
                          සැබෑ සංඛ්‍යාව
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'bold', fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif' }}>
                          ප්‍රතිශතය
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'bold', fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif' }}>
                          ක්‍රියාමාර්ග
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {attendanceSheets
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((sheet) => (
                          <TableRow key={sheet._id} hover>
                            <TableCell>
                              <Typography variant="body2" fontWeight="medium">
                                {formatDate(sheet.date)}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={sheet.status}
                                color={getStatusColor(sheet.status)}
                                size="small"
                              />
                            </TableCell>
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
                              <Typography variant="body2">
                                {sheet.attendancePercentage}%
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <IconButton
                                  size="small"
                                  color="primary"
                                  onClick={() => navigate(`/attendance-edit/${sheet._id}`)}
                                >
                                  <Visibility />
                                </IconButton>
                                {isAdmin && (
                                  <>
                                    <IconButton
                                      size="small"
                                      color="secondary"
                                      onClick={() => navigate(`/attendance-edit/${sheet._id}?edit=true`)}
                                    >
                                      <Edit />
                                    </IconButton>
                                    <IconButton
                                      size="small"
                                      color="error"
                                      onClick={() => handleDeleteAttendance(sheet._id)}
                                    >
                                      <Delete />
                                    </IconButton>
                                  </>
                                )}
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
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
                  මෙම මාසයේ පැමිණීම් පත්‍රිකා නොමැත
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  නව පැමිණීම් පත්‍රිකාවක් සාදන්න
                </Typography>
              </Box>
            )}
          </Paper>
        </motion.div>

        {/* Create Attendance Dialog */}
        <Dialog
          open={createDialog}
          onClose={() => setCreateDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{
            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
            fontWeight: 'bold'
          }}>
            අද දිනය සදහා මෙම පන්තියට නව පැමිණීම් පත්‍රිකාවක් සාදන්න
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={3}>
                {/* Expected Present Count */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="අපේක්ෂිත පැමිණ සිසුන් සංඛ්‍යාව"
                    type="number"
                    value={formData.expectedPresentCount}
                    onChange={(e) => setFormData({
                      ...formData,
                      expectedPresentCount: e.target.value
                    })}
                    required
                    inputProps={{ min: 0, max: classData?.enrolledCount || 100 }}
                    helperText={`සම්පූර්ණ සිසුන් සංඛ්‍යාව: ${classData?.enrolledCount || 0}`}
                  />
                </Grid>

                {/* Monitor Permissions */}
                <Grid item xs={12}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend" sx={{
                      fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                      fontWeight: 'bold'
                    }}>
                      නිරීක්ෂක අවසර
                    </FormLabel>
                    <RadioGroup
                      value={formData.monitorPermissions.allMonitors ? 'all' : 'selected'}
                      onChange={(e) => {
                        const isAll = e.target.value === 'all';
                        setFormData({
                          ...formData,
                          monitorPermissions: {
                            allMonitors: isAll,
                            selectedMonitors: isAll ? [] : formData.monitorPermissions.selectedMonitors
                          }
                        });
                      }}
                    >
                      <FormControlLabel
                        value="all"
                        control={<Radio />}
                        label="සියලුම නිරීක්ෂකයින්ට අවසර දෙන්න"
                      />
                      <FormControlLabel
                        value="selected"
                        control={<Radio />}
                        label="තෝරාගත් නිරීක්ෂකයින්ට අවසර දෙන්න"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>

                {/* Selected Monitors */}
                {!formData.monitorPermissions.allMonitors && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" sx={{
                      fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                      fontWeight: 'bold',
                      mb: 1
                    }}>
                      නිරීක්ෂකයින් තෝරන්න:
                    </Typography>

                    {classData?.monitors && classData.monitors.length > 0 ? (
                      <List dense>
                        {classData.monitors.map((monitor) => (
                          <ListItem key={monitor._id} sx={{ px: 0 }}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={formData.monitorPermissions.selectedMonitors.includes(monitor._id)}
                                  onChange={() => handleMonitorSelection(monitor._id)}
                                />
                              }
                              label={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Avatar
                                    src={monitor.profilePicture}
                                    sx={{ width: 32, height: 32 }}
                                  >
                                    {monitor.firstName?.charAt(0)}
                                  </Avatar>
                                  <Box>
                                    <Typography variant="body2" fontWeight="medium">
                                      {monitor.firstName} {monitor.lastName}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      {monitor.studentId}
                                    </Typography>
                                  </Box>
                                </Box>
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Alert severity="info">
                        මෙම පන්තියට නිරීක්ෂකයින් නොමැත
                      </Alert>
                    )}
                  </Grid>
                )}

                {/* Notes */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="සටහන් (විකල්ප)"
                    multiline
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({
                      ...formData,
                      notes: e.target.value
                    })}
                    inputProps={{ maxLength: 500 }}
                    helperText={`${formData.notes.length}/500 අක්ෂර`}
                  />
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCreateDialog(false)}>
              අවලංගු කරන්න
            </Button>
            <Button
              variant="contained"
              onClick={handleCreateAttendance}
              disabled={createLoading || !formData.expectedPresentCount}
              startIcon={createLoading ? <CircularProgress size={16} /> : <Save />}
            >
              {createLoading ? 'සාදමින්...' : 'සාදන්න'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default AttendanceManagement;
