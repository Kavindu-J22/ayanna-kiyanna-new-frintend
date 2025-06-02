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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  Badge,
  Divider
} from '@mui/material';
import {
  School,
  Person,
  CheckCircle,
  Cancel,
  Visibility,
  Delete,
  Refresh,
  FilterList,
  ArrowBack,
  Pending,
  Group,
  Search,
  Message,
  SwapHoriz,
  RemoveCircle,
  Class,
  Schedule,
  LocationOn,
  People,
  Category,
  Assignment,
  Payment,
  CreditCard
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const StudentManagement = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState({});
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showActionDialog, setShowActionDialog] = useState(false);
  const [actionType, setActionType] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [processing, setProcessing] = useState(false);
  const [pendingClassRequestsCount, setPendingClassRequestsCount] = useState(0);
  const [classRequestsLoading, setClassRequestsLoading] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  // New functionality states
  const [availableClasses, setAvailableClasses] = useState([]);
  const [availableGrades, setAvailableGrades] = useState([]);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [showClassChangeDialog, setShowClassChangeDialog] = useState(false);
  const [showStatusChangeDialog, setShowStatusChangeDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [messageSubject, setMessageSubject] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [selectedOldClass, setSelectedOldClass] = useState('');
  const [selectedNewClass, setSelectedNewClass] = useState('');
  const [newStatus, setNewStatus] = useState('');

  // Add new state variables
  const [showPaymentRoleDialog, setShowPaymentRoleDialog] = useState(false);
  const [showPaymentStatusDialog, setShowPaymentStatusDialog] = useState(false);
  const [selectedPaymentRole, setSelectedPaymentRole] = useState('');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('');

  useEffect(() => {
    loadStudentData();
    loadAdditionalData();
    loadPendingClassRequestsCount();
  }, [statusFilter, gradeFilter, classFilter, currentPage]);

  const loadAdditionalData = async () => {
    try {
      const token = localStorage.getItem('token');

      // Load available classes for assignment
      const classesResponse = await axios.get(
        'https://ayanna-kiyanna-new-backend.onrender.com/api/admin/students/available-classes',
        { headers: { 'x-auth-token': token } }
      );
      setAvailableClasses(classesResponse.data.classes || []);

      // Load available grades
      const gradesResponse = await axios.get(
        'https://ayanna-kiyanna-new-backend.onrender.com/api/admin/students/available-grades',
        { headers: { 'x-auth-token': token } }
      );
      setAvailableGrades(gradesResponse.data.grades || []);
    } catch (error) {
      console.error('Error loading additional data:', error);
    }
  };

  const loadPendingClassRequestsCount = async () => {
    try {
      setClassRequestsLoading(true);
      const token = localStorage.getItem('token');

      const response = await axios.get(
        'https://ayanna-kiyanna-new-backend.onrender.com/api/class-requests?status=Pending',
        { headers: { 'x-auth-token': token } }
      );

      const pendingRequests = response.data.requests || [];
      setPendingClassRequestsCount(pendingRequests.length);
    } catch (error) {
      console.error('Error loading pending class requests count:', error);
      setPendingClassRequestsCount(0);
    } finally {
      setClassRequestsLoading(false);
    }
  };

  const loadStudentData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      // Load students
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        ...(statusFilter && { status: statusFilter }),
        ...(gradeFilter && { grade: gradeFilter }),
        ...(classFilter && { classId: classFilter })
      });

      const studentsResponse = await axios.get(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/admin/students?${params}`,
        { headers: { 'x-auth-token': token } }
      );
      setStudents(studentsResponse.data.students);

      // Load stats
      const statsResponse = await axios.get(
        'https://ayanna-kiyanna-new-backend.onrender.com/api/admin/students/stats',
        { headers: { 'x-auth-token': token } }
      );
      setStats(statsResponse.data);

    } catch (error) {
      setError(error.response?.data?.message || 'Failed to load student data');
    } finally {
      setLoading(false);
    }
  };

  const handleStudentAction = async (student, action) => {
    setSelectedStudent(student);
    setActionType(action);
    setShowActionDialog(true);
    setAdminNote('');
  };

  const confirmAction = async () => {
    if (!selectedStudent || !actionType) return;

    setProcessing(true);
    try {
      const token = localStorage.getItem('token');
      const endpoint = actionType === 'approve' ? 'approve' : 'reject';

      await axios.put(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/admin/students/${selectedStudent._id}/${endpoint}`,
        { adminNote },
        { headers: { 'x-auth-token': token } }
      );

      setSuccess(`Student registration ${actionType}d successfully`);
      setShowActionDialog(false);
      loadStudentData();
    } catch (error) {
      setError(error.response?.data?.message || `Failed to ${actionType} student`);
    } finally {
      setProcessing(false);
    }
  };

  const handleApproveAll = async () => {
    setProcessing(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        'https://ayanna-kiyanna-new-backend.onrender.com/api/admin/students/approve-all',
        { adminNote: 'Bulk approval by admin' },
        { headers: { 'x-auth-token': token } }
      );

      setSuccess('All pending registrations approved successfully');
      loadStudentData();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to approve all students');
    } finally {
      setProcessing(false);
    }
  };

  const handleViewDetails = (student) => {
    setSelectedStudent(student);
    setShowDetailsDialog(true);
  };

  const handleSendMessage = (student) => {
    setSelectedStudent(student);
    setShowMessageDialog(true);
    setMessageSubject('');
    setMessageBody('');
  };

  const handleChangeClass = (student) => {
    setSelectedStudent(student);
    setShowClassChangeDialog(true);
    setSelectedOldClass('');
    setSelectedNewClass('');
  };

  const handleRemoveFromClass = async (student, classId) => {
    if (!window.confirm('Are you sure you want to remove this student from the class?')) {
      return;
    }

    setProcessing(true);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/admin/students/${student._id}/classes/${classId}`,
        { headers: { 'x-auth-token': token } }
      );

      setSuccess('Student removed from class successfully');
      loadStudentData();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to remove student from class');
    } finally {
      setProcessing(false);
    }
  };

  const confirmSendMessage = async () => {
    if (!messageSubject.trim() || !messageBody.trim()) {
      setError('Please fill in both subject and message');
      return;
    }

    setProcessing(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/admin/students/${selectedStudent._id}/message`,
        { subject: messageSubject, message: messageBody },
        { headers: { 'x-auth-token': token } }
      );

      setSuccess('Message sent successfully');
      setShowMessageDialog(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to send message');
    } finally {
      setProcessing(false);
    }
  };

  const confirmClassChange = async () => {
    if (!selectedOldClass || !selectedNewClass) {
      setError('Please select both old and new classes');
      return;
    }

    setProcessing(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/admin/students/${selectedStudent._id}/change-class`,
        { oldClassId: selectedOldClass, newClassId: selectedNewClass },
        { headers: { 'x-auth-token': token } }
      );

      setSuccess('Student class changed successfully');
      setShowClassChangeDialog(false);
      loadStudentData();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to change student class');
    } finally {
      setProcessing(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'success';
      case 'Pending': return 'warning';
      case 'Rejected': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved': return <CheckCircle />;
      case 'Pending': return <Pending />;
      case 'Rejected': return <Cancel />;
      default: return null;
    }
  };

  const handleStatusChange = (student, status) => {
    setSelectedStudent(student);
    setNewStatus(status);
    setShowStatusChangeDialog(true);
    setAdminNote('');
  };

  const confirmStatusChange = async () => {
    if (!selectedStudent || !newStatus) return;

    setProcessing(true);
    try {
      const token = localStorage.getItem('token');

      await axios.put(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/admin/students/${selectedStudent._id}/change-status`,
        {
          status: newStatus,
          adminNote
        },
        { headers: { 'x-auth-token': token } }
      );

      setSuccess(`Student status changed to ${newStatus} successfully`);
      setShowStatusChangeDialog(false);
      loadStudentData();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to change student status');
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteStudent = (student) => {
    setSelectedStudent(student);
    setShowDeleteDialog(true);
  };

  const confirmDeleteStudent = async () => {
    if (!selectedStudent) return;

    setProcessing(true);
    try {
      const token = localStorage.getItem('token');

      await axios.delete(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/admin/students/${selectedStudent._id}`,
        { headers: { 'x-auth-token': token } }
      );

      setSuccess('Student deleted successfully');
      setShowDeleteDialog(false);
      loadStudentData();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete student');
    } finally {
      setProcessing(false);
    }
  };

  // Add new handler functions
  const handleUpdatePaymentRole = (student) => {
    setSelectedStudent(student);
    setSelectedPaymentRole(student.paymentRole);
    setShowPaymentRoleDialog(true);
    setAdminNote('');
  };

  const handleUpdatePaymentStatus = (student) => {
    setSelectedStudent(student);
    setSelectedPaymentStatus(student.paymentStatus);
    setShowPaymentStatusDialog(true);
    setAdminNote('');
  };

  const confirmPaymentRoleUpdate = async () => {
    if (!selectedStudent || !selectedPaymentRole) return;

    setProcessing(true);
    try {
      const response = await axios.put(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/admin/students/${selectedStudent._id}/payment-role`,
        {
          paymentRole: selectedPaymentRole,
          adminNote: adminNote || `Payment role updated from ${selectedStudent.paymentRole} to ${selectedPaymentRole}`
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.getItem('token')
          }
        }
      );

      if (response.data) {
        setStudents(students.map(student =>
          student._id === selectedStudent._id
            ? {
              ...student,
              paymentRole: selectedPaymentRole,
              adminAction: {
                actionBy: response.data.student.adminAction.actionBy,
                actionDate: response.data.student.adminAction.actionDate,
                actionNote: response.data.student.adminAction.actionNote
              }
            }
            : student
        ));
        setShowPaymentRoleDialog(false);
        setSelectedStudent(null);
        setSelectedPaymentRole('');
        setAdminNote('');
        setSuccess('Payment role updated successfully');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      console.error('Error updating payment role:', error);
      setError(error.response?.data?.message || 'Error updating payment role');
      setTimeout(() => setError(''), 3000);
    } finally {
      setProcessing(false);
    }
  };

  const confirmPaymentStatusUpdate = async () => {
    if (!selectedStudent || !selectedPaymentStatus) return;

    setProcessing(true);
    try {
      const response = await axios.put(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/admin/students/${selectedStudent._id}/payment-status`,
        {
          paymentStatus: selectedPaymentStatus,
          adminNote: adminNote || `Payment status updated from ${selectedStudent.paymentStatus} to ${selectedPaymentStatus}`
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.getItem('token')
          }
        }
      );

      if (response.data) {
        setStudents(students.map(student =>
          student._id === selectedStudent._id
            ? {
              ...student,
              paymentStatus: selectedPaymentStatus,
              adminAction: {
                actionBy: response.data.student.adminAction.actionBy,
                actionDate: response.data.student.adminAction.actionDate,
                actionNote: response.data.student.adminAction.actionNote
              }
            }
            : student
        ));
        setShowPaymentStatusDialog(false);
        setSelectedStudent(null);
        setSelectedPaymentStatus('');
        setAdminNote('');
        setSuccess('Payment status updated successfully');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
      setError(error.response?.data?.message || 'Error updating payment status');
      setTimeout(() => setError(''), 3000);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress size={60} />
      </Box>
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h4" component="h1" sx={{
                fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center'
              }}>
                <School sx={{ mr: 2, fontSize: 40 }} />
                Student Management
              </Typography>
              <Button
                variant="outlined"
                startIcon={<ArrowBack />}
                onClick={() => navigate('/admin-dashboard')}
              >
                Back to Dashboard
              </Button>
            </Box>

            {/* Statistics Cards */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Group sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h4" fontWeight="bold">{stats.total || 0}</Typography>
                    <Typography variant="body2">Total Students</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Pending sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h4" fontWeight="bold">{stats.pending || 0}</Typography>
                    <Typography variant="body2">Pending Requests</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', color: '#333' }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <CheckCircle sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h4" fontWeight="bold">{stats.approved || 0}</Typography>
                    <Typography variant="body2">Approved Students</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', color: '#333' }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Cancel sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h4" fontWeight="bold">{stats.rejected || 0}</Typography>
                    <Typography variant="body2">Rejected Requests</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                color="success"
                startIcon={<CheckCircle />}
                onClick={handleApproveAll}
                disabled={processing || stats.pending === 0}
              >
                Approve All Pending
              </Button>
              <Button
                variant="contained"
                sx={{
                  background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
                  color: 'white',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #f57c00 0%, #ef6c00 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(255, 152, 0, 0.3)'
                  },
                  transition: 'all 0.3s ease',
                  fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
                  fontWeight: 'bold',
                  position: 'relative',
                  overflow: 'visible'
                }}
                startIcon={
                  <Badge
                    badgeContent={
                      pendingClassRequestsCount > 0 ? (
                        <Box sx={{
                          background: 'linear-gradient(135deg, #e91e63 0%, #ad1457 100%)',
                          color: 'white',
                          borderRadius: '50%',
                          width: 20,
                          height: 20,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.7rem',
                          fontWeight: 'bold',
                          boxShadow: '0 2px 8px rgba(233, 30, 99, 0.4)',
                          animation: pendingClassRequestsCount > 0 ? 'pulse 2s infinite' : 'none',
                          '@keyframes pulse': {
                            '0%': {
                              transform: 'scale(1)',
                              boxShadow: '0 2px 8px rgba(233, 30, 99, 0.4)'
                            },
                            '50%': {
                              transform: 'scale(1.1)',
                              boxShadow: '0 4px 12px rgba(233, 30, 99, 0.6)'
                            },
                            '100%': {
                              transform: 'scale(1)',
                              boxShadow: '0 2px 8px rgba(233, 30, 99, 0.4)'
                            }
                          }
                        }}>
                          {classRequestsLoading ? <CircularProgress size={10} sx={{ color: 'white' }} /> : pendingClassRequestsCount}
                        </Box>
                      ) : null
                    }
                    sx={{
                      '& .MuiBadge-badge': {
                        top: -6,
                        right: -6,
                        border: 'none',
                        padding: 0,
                        minWidth: 'auto',
                        height: 'auto',
                        backgroundColor: 'transparent'
                      }
                    }}
                  >
                    <Assignment />
                  </Badge>
                }
                onClick={() => navigate('/class-requests')}
                disabled={processing}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography component="span" sx={{
                    fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
                    fontWeight: 'bold'
                  }}>
                    පන්ති ඉල්ලීම්
                  </Typography>
                  {pendingClassRequestsCount > 0 && (
                    <Typography component="span" sx={{
                      color: '#fff3e0',
                      fontWeight: 'bold',
                      fontSize: '0.85rem',
                      background: 'rgba(255, 255, 255, 0.2)',
                      px: 1,
                      py: 0.3,
                      borderRadius: 2,
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                    }}>
                      ({pendingClassRequestsCount})
                    </Typography>
                  )}
                </Box>
                {pendingClassRequestsCount > 0 && (
                  <Typography variant="caption" sx={{
                    position: 'absolute',
                    bottom: -18,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    color: '#ff9800',
                    fontWeight: 'medium',
                    fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
                    fontSize: '0.7rem',
                    whiteSpace: 'nowrap',
                    background: 'rgba(255, 255, 255, 0.9)',
                    px: 1,
                    py: 0.2,
                    borderRadius: 1,
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                  }}>
                    අනුමැතිය බලාපොරොත්තුවෙන්
                  </Typography>
                )}
              </Button>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={loadStudentData}
                disabled={processing}
              >
                Refresh
              </Button>
            </Box>
          </Paper>

          {/* Alerts */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
              {success}
            </Alert>
          )}

          {/* Filters */}
          <Paper elevation={6} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <FilterList sx={{ mr: 1 }} />
              Filters & Search
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Search Students"
                  placeholder="Search by name, email, or student ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    label="Status"
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Approved">Approved</MenuItem>
                    <MenuItem value="Rejected">Rejected</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Grade</InputLabel>
                  <Select
                    value={gradeFilter}
                    onChange={(e) => setGradeFilter(e.target.value)}
                    label="Grade"
                  >
                    <MenuItem value="">All Grades</MenuItem>
                    {availableGrades.map((grade) => (
                      <MenuItem key={grade} value={grade}>{grade}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Class</InputLabel>
                  <Select
                    value={classFilter}
                    onChange={(e) => setClassFilter(e.target.value)}
                    label="Class"
                  >
                    <MenuItem value="">All Classes</MenuItem>
                    {availableClasses.map((classItem) => (
                      <MenuItem key={classItem._id} value={classItem._id}>
                        {classItem.grade} - {classItem.category} ({classItem.date})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>

          {/* Students Table */}
          <Paper elevation={6} sx={{ borderRadius: 3 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'primary.main' }}>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Student ID</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Grade</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Registration Status</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Payment Role</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Payment Status</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Classes</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {students.filter(student => {
                    const matchesStatus = !statusFilter || student.status === statusFilter;
                    const matchesGrade = !gradeFilter || student.selectedGrade === gradeFilter;
                    const matchesClass = !classFilter || (student.enrolledClasses && student.enrolledClasses.some(cls => cls._id === classFilter));
                    const matchesSearch = !searchTerm ||
                      student.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      student.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      student.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      student.studentId?.toLowerCase().includes(searchTerm.toLowerCase());
                    return matchesStatus && matchesGrade && matchesClass && matchesSearch;
                  }).map((student) => (
                    <TableRow key={student._id} hover>
                      <TableCell>{student.studentId}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Person sx={{ mr: 1, color: 'primary.main' }} />
                          {student.firstName} {student.lastName}
                        </Box>
                      </TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{student.selectedGrade}</TableCell>
                      <TableCell>
                        <Chip
                          label={student.status}
                          color={getStatusColor(student.status)}
                          icon={getStatusIcon(student.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={student.paymentRole}
                          color={student.paymentRole === 'Pay Card' ? 'primary' : 'secondary'}
                          icon={<CreditCard />}
                          size="small"
                          onClick={() => handleUpdatePaymentRole(student)}
                          sx={{ cursor: 'pointer' }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={student.paymentStatus}
                          color={
                            student.paymentStatus === 'Paid' ? 'success' :
                              student.paymentStatus === 'Unpaid' ? 'error' : 'warning'
                          }
                          icon={<Payment />}
                          size="small"
                          onClick={() => handleUpdatePaymentStatus(student)}
                          sx={{ cursor: 'pointer' }}
                        />
                      </TableCell>
                      <TableCell>
                        {student.enrolledClasses && student.enrolledClasses.length > 0 ? (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {student.enrolledClasses.slice(0, 2).map((classItem, index) => (
                              <Chip
                                key={index}
                                label={`${classItem.grade} - ${classItem.category}`}
                                size="small"
                                variant="outlined"
                                color="primary"
                                onDelete={() => handleRemoveFromClass(student, classItem._id)}
                                deleteIcon={<RemoveCircle />}
                              />
                            ))}
                            {student.enrolledClasses.length > 2 && (
                              <Chip
                                label={`+${student.enrolledClasses.length - 2} more`}
                                size="small"
                                variant="outlined"
                              />
                            )}
                          </Box>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No classes
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              onClick={() => handleViewDetails(student)}
                              color="primary"
                            >
                              <Visibility />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Send Message">
                            <IconButton
                              size="small"
                              onClick={() => handleSendMessage(student)}
                              color="info"
                            >
                              <Message />
                            </IconButton>
                          </Tooltip>

                          {student.status === 'Approved' && (
                            <Tooltip title="Change Class">
                              <IconButton
                                size="small"
                                onClick={() => handleChangeClass(student)}
                                color="warning"
                              >
                                <SwapHoriz />
                              </IconButton>
                            </Tooltip>
                          )}

                          {student.status === 'Pending' && (
                            <>
                              <Tooltip title="Approve">
                                <IconButton
                                  size="small"
                                  onClick={() => handleStudentAction(student, 'approve')}
                                  color="success"
                                >
                                  <CheckCircle />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Reject">
                                <IconButton
                                  size="small"
                                  onClick={() => handleStudentAction(student, 'reject')}
                                  color="error"
                                >
                                  <Cancel />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}

                          {student.status === 'Approved' && (
                            <Tooltip title="Change to hold Sudent">
                              <IconButton
                                size="small"
                                onClick={() => handleStatusChange(student, 'Pending')}
                                color="warning"
                              >
                                <Pending />
                              </IconButton>
                            </Tooltip>
                          )}

                          <Tooltip title="Delete Student">
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteStudent(student)}
                              color="error"
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {/* Student Details Dialog */}
          <Dialog open={showDetailsDialog} onClose={() => setShowDetailsDialog(false)} maxWidth="lg" fullWidth>
            <DialogTitle>
              Student Details - {selectedStudent?.studentId}
            </DialogTitle>
            <DialogContent>
              {selectedStudent && (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>Personal Information</Typography>
                    <Typography><strong>Name:</strong> {selectedStudent.firstName} {selectedStudent.lastName}</Typography>
                    <Typography><strong>Email:</strong> {selectedStudent.email}</Typography>
                    <Typography><strong>Contact:</strong> {selectedStudent.contactNumber}</Typography>
                    <Typography><strong>School:</strong> {selectedStudent.school}</Typography>
                    <Typography><strong>Grade:</strong> {selectedStudent.selectedGrade}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>Guardian Information</Typography>
                    <Typography><strong>Guardian:</strong> {selectedStudent.guardianName}</Typography>
                    <Typography><strong>Type:</strong> {selectedStudent.guardianType}</Typography>
                    <Typography><strong>Contact:</strong> {selectedStudent.guardianContact}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>Status Information</Typography>
                    <Chip
                      label={selectedStudent.status}
                      color={getStatusColor(selectedStudent.status)}
                      icon={getStatusIcon(selectedStudent.status)}
                    />
                    {selectedStudent.adminAction?.actionNote && (
                      <Typography sx={{ mt: 1 }}>
                        <strong>Admin Note:</strong> {selectedStudent.adminAction.actionNote}
                      </Typography>
                    )}
                  </Grid>

                  {/* Class Details Section */}
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                      <Class sx={{ mr: 1 }} />
                      Enrolled Classes ({selectedStudent.enrolledClasses?.length || 0})
                    </Typography>
                    {selectedStudent.enrolledClasses && selectedStudent.enrolledClasses.length > 0 ? (
                      <Grid container spacing={2}>
                        {selectedStudent.enrolledClasses.map((classItem, index) => {
                          // Use the calculated fields from backend
                          const capacity = classItem.capacity || 0;
                          const enrolledCount = classItem.enrolledCount || 0;
                          const availableSpots = classItem.availableSpots || 0;

                          return (
                            <Grid item xs={12} md={6} key={index}>
                              <Paper elevation={2} sx={{ p: 2, borderRadius: 2, border: '1px solid #e0e0e0' }}>
                                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                                  <Category sx={{ mr: 1, fontSize: 20 }} />
                                  {classItem.category}
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                                    <School sx={{ mr: 1, fontSize: 16, color: 'primary.main' }} />
                                    <strong>Grade:</strong> {classItem.grade}
                                  </Typography>
                                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Schedule sx={{ mr: 1, fontSize: 16, color: 'primary.main' }} />
                                    <strong>Time:</strong> {classItem.startTime} - {classItem.endTime}
                                  </Typography>
                                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                                    <LocationOn sx={{ mr: 1, fontSize: 16, color: 'primary.main' }} />
                                    <strong>Venue:</strong> {classItem.venue}
                                  </Typography>
                                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                                    <People sx={{ mr: 1, fontSize: 16, color: 'primary.main' }} />
                                    <strong>Available Spots:</strong> {availableSpots} / {capacity} (Enrolled: {enrolledCount})
                                  </Typography>
                                  <Typography variant="body2">
                                    <strong>Platform:</strong> {classItem.platform || 'Physical'}
                                  </Typography>
                                  <Typography variant="body2">
                                    <strong>Day:</strong> {classItem.date}
                                  </Typography>
                                </Box>
                              </Paper>
                            </Grid>
                          );
                        })}
                      </Grid>
                    ) : (
                      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                        No classes enrolled yet.
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowDetailsDialog(false)}>Close</Button>
            </DialogActions>
          </Dialog>

          {/* Action Confirmation Dialog */}
          <Dialog open={showActionDialog} onClose={() => setShowActionDialog(false)} maxWidth="sm" fullWidth>
            <DialogTitle>
              {actionType === 'approve' ? 'Approve' : 'Reject'} Student Registration
            </DialogTitle>
            <DialogContent>
              <Typography gutterBottom>
                Are you sure you want to {actionType} the registration for {selectedStudent?.firstName} {selectedStudent?.lastName}?
              </Typography>
              <TextField
                fullWidth
                label="Admin Note (Optional)"
                multiline
                rows={3}
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                sx={{ mt: 2 }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowActionDialog(false)} disabled={processing}>
                Cancel
              </Button>
              <Button
                onClick={confirmAction}
                variant="contained"
                color={actionType === 'approve' ? 'success' : 'error'}
                disabled={processing}
                startIcon={processing ? <CircularProgress size={20} /> : null}
              >
                {processing ? 'Processing...' : actionType === 'approve' ? 'Approve' : 'Reject'}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Send Message Dialog */}
          <Dialog open={showMessageDialog} onClose={() => setShowMessageDialog(false)} maxWidth="sm" fullWidth>
            <DialogTitle>
              Send Message to {selectedStudent?.firstName} {selectedStudent?.lastName}
            </DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                label="Subject"
                value={messageSubject}
                onChange={(e) => setMessageSubject(e.target.value)}
                sx={{ mb: 2, mt: 1 }}
              />
              <TextField
                fullWidth
                label="Message"
                multiline
                rows={4}
                value={messageBody}
                onChange={(e) => setMessageBody(e.target.value)}
                placeholder="Enter your message here..."
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowMessageDialog(false)} disabled={processing}>
                Cancel
              </Button>
              <Button
                onClick={confirmSendMessage}
                variant="contained"
                disabled={processing || !messageSubject.trim() || !messageBody.trim()}
                startIcon={processing ? <CircularProgress size={20} /> : <Message />}
              >
                {processing ? 'Sending...' : 'Send Message'}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Change Class Dialog */}
          <Dialog open={showClassChangeDialog} onClose={() => setShowClassChangeDialog(false)} maxWidth="sm" fullWidth>
            <DialogTitle>
              Change Class for {selectedStudent?.firstName} {selectedStudent?.lastName}
            </DialogTitle>
            <DialogContent>
              <FormControl fullWidth sx={{ mb: 2, mt: 1 }}>
                <InputLabel>Current Class</InputLabel>
                <Select
                  value={selectedOldClass}
                  onChange={(e) => setSelectedOldClass(e.target.value)}
                  label="Current Class"
                >
                  {selectedStudent?.enrolledClasses?.map((classItem) => (
                    <MenuItem key={classItem._id} value={classItem._id}>
                      {classItem.grade} - {classItem.category} ({classItem.date})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>New Class</InputLabel>
                <Select
                  value={selectedNewClass}
                  onChange={(e) => setSelectedNewClass(e.target.value)}
                  label="New Class"
                >
                  {availableClasses.map((classItem) => (
                    <MenuItem key={classItem._id} value={classItem._id}>
                      {classItem.grade} - {classItem.category} ({classItem.date}) - {classItem.availableSpots} spots available
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowClassChangeDialog(false)} disabled={processing}>
                Cancel
              </Button>
              <Button
                onClick={confirmClassChange}
                variant="contained"
                disabled={processing || !selectedOldClass || !selectedNewClass}
                startIcon={processing ? <CircularProgress size={20} /> : <SwapHoriz />}
              >
                {processing ? 'Changing...' : 'Change Class'}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Status Change Dialog */}
          <Dialog open={showStatusChangeDialog} onClose={() => setShowStatusChangeDialog(false)} maxWidth="sm" fullWidth>
            <DialogTitle>
              Change Student Status
            </DialogTitle>
            <DialogContent>
              <Typography gutterBottom>
                Are you sure you want to change the status of {selectedStudent?.firstName} {selectedStudent?.lastName} to {newStatus} (Hold This Student) ?. with that, the Student's all Classes will be Hold and Pending. They Can't Access to any Classes!
              </Typography>
              {selectedStudent && (
                <Box sx={{ mt: 2, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="body2">
                    <strong>Student:</strong> {selectedStudent.firstName} {selectedStudent.lastName} ({selectedStudent.studentId})
                  </Typography>
                  <Typography variant="body2">
                    <strong>Current Status:</strong> {selectedStudent.status}
                  </Typography>
                  <Typography variant="body2">
                    <strong>New Status:</strong> {newStatus}
                  </Typography>
                </Box>
              )}
              <TextField
                fullWidth
                label="Admin Note (Optional)"
                multiline
                rows={3}
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                sx={{ mt: 2 }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowStatusChangeDialog(false)} disabled={processing}>
                Cancel
              </Button>
              <Button
                onClick={confirmStatusChange}
                variant="contained"
                color="warning"
                disabled={processing}
                startIcon={processing ? <CircularProgress size={20} /> : null}
              >
                {processing ? 'Processing...' : 'Change Status'}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Delete Student Dialog */}
          <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)} maxWidth="sm" fullWidth>
            <DialogTitle>
              Delete Student
            </DialogTitle>
            <DialogContent>
              <Typography gutterBottom color="error">
                Are you sure you want to permanently delete this student? This action cannot be undone.
              </Typography>
              {selectedStudent && (
                <Box sx={{ mt: 2, p: 2, backgroundColor: 'error.light', borderRadius: 1, color: 'white' }}>
                  <Typography variant="body2">
                    <strong>Student:</strong> {selectedStudent.firstName} {selectedStudent.lastName}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Student ID:</strong> {selectedStudent.studentId}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Email:</strong> {selectedStudent.email}
                  </Typography>
                </Box>
              )}
              <Typography variant="body2" sx={{ mt: 2 }} color="text.secondary">
                This will also:
                • Remove the student from all enrolled classes
                • Delete all class requests
                • Delete all notifications
                • Change the user's role back to 'user'
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowDeleteDialog(false)} disabled={processing}>
                Cancel
              </Button>
              <Button
                onClick={confirmDeleteStudent}
                variant="contained"
                color="error"
                disabled={processing}
                startIcon={processing ? <CircularProgress size={20} /> : <Delete />}
              >
                {processing ? 'Deleting...' : 'Delete Student'}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Payment Role Update Dialog */}
          <Dialog open={showPaymentRoleDialog} onClose={() => setShowPaymentRoleDialog(false)} maxWidth="sm" fullWidth>
            <DialogTitle>Update Payment Role</DialogTitle>
            <DialogContent>
              <Typography gutterBottom>
                Update payment role for {selectedStudent?.firstName} {selectedStudent?.lastName}
              </Typography>
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Payment Role</InputLabel>
                <Select
                  value={selectedPaymentRole}
                  onChange={(e) => setSelectedPaymentRole(e.target.value)}
                  label="Payment Role"
                >
                  <MenuItem value="Pay Card">Pay Card</MenuItem>
                  <MenuItem value="Free Card">Free Card</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Admin Note (Optional)"
                multiline
                rows={3}
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                sx={{ mt: 2 }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowPaymentRoleDialog(false)} disabled={processing}>
                Cancel
              </Button>
              <Button
                onClick={confirmPaymentRoleUpdate}
                variant="contained"
                color="primary"
                disabled={processing}
                startIcon={processing ? <CircularProgress size={20} /> : null}
              >
                {processing ? 'Updating...' : 'Update'}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Payment Status Update Dialog */}
          <Dialog open={showPaymentStatusDialog} onClose={() => setShowPaymentStatusDialog(false)} maxWidth="sm" fullWidth>
            <DialogTitle>Update Payment Status</DialogTitle>
            <DialogContent>
              <Typography gutterBottom>
                Update payment status for {selectedStudent?.firstName} {selectedStudent?.lastName}
              </Typography>
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Payment Status</InputLabel>
                <Select
                  value={selectedPaymentStatus}
                  onChange={(e) => setSelectedPaymentStatus(e.target.value)}
                  label="Payment Status"
                >
                  <MenuItem value="admissioned">Admissioned (අලුත් සිසුවෙකු ලෙස සටහන් කරන්න)</MenuItem>
                  <MenuItem value="Paid">Paid (ගෙවීම් සිදු කල සිසුවෙකු ලෙස සටහන් කරන්න)</MenuItem>
                  <MenuItem value="Unpaid">Unpaid (ගෙවීම් සිදු නොකල සිසුවෙකු ලෙස සටහන් කරන්න)</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Admin Note (Optional)"
                multiline
                rows={3}
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                sx={{ mt: 2 }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowPaymentStatusDialog(false)} disabled={processing}>
                Cancel
              </Button>
              <Button
                onClick={confirmPaymentStatusUpdate}
                variant="contained"
                color="primary"
                disabled={processing}
                startIcon={processing ? <CircularProgress size={20} /> : null}
              >
                {processing ? 'Updating...' : 'Update'}
              </Button>
            </DialogActions>
          </Dialog>
        </motion.div>
      </Container>
    </Box>
  );
};

export default StudentManagement;
