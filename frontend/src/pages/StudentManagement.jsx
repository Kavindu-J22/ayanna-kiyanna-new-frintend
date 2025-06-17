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
  Divider,
  Avatar
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
  CreditCard,
  Email,
  ContentCopy,
  CheckCircleOutline,
  Info,
  ArrowRightAlt,
  Subject,
  Public,
  CalendarToday
} from '@mui/icons-material';
import { CgProfile } from "react-icons/cg";
import { FaPerson } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
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
  const [showMessageSuccessDialog, setShowMessageSuccessDialog] = useState(false);
  const [sentMessageDetails, setSentMessageDetails] = useState({ subject: '', message: '', studentName: '' });
  const [showClassChangeDialog, setShowClassChangeDialog] = useState(false);
  const [showStatusChangeDialog, setShowStatusChangeDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [messageSubject, setMessageSubject] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [selectedOldClass, setSelectedOldClass] = useState('');
  const [selectedNewClass, setSelectedNewClass] = useState('');
  const [newStatus, setNewStatus] = useState('');

  // Add new state variables
  const [selectedPaymentRole, setSelectedPaymentRole] = useState('');
  const [selectedFreeClasses, setSelectedFreeClasses] = useState([]);
  const [showPaymentRoleDialog, setShowPaymentRoleDialog] = useState(false);
  const [showPaymentStatusDialog, setShowPaymentStatusDialog] = useState(false);
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('');

  // Add new state variables for payment filters
  const [paymentRoleFilter, setPaymentRoleFilter] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('');

  useEffect(() => {
    loadStudentData();
    loadAdditionalData();
    loadPendingClassRequestsCount();
  }, [statusFilter, gradeFilter, classFilter, currentPage, paymentRoleFilter, paymentStatusFilter]);

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

  const defaultGrades = ["Grade 6", "Grade 7", "Grade 8", "Grade 9", "Other"];

  const allGrades = [...new Set([...defaultGrades, ...availableGrades])];

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

      // Build query parameters
      const params = new URLSearchParams();
      params.append('page', currentPage);
      params.append('limit', 10);
      if (statusFilter) params.append('status', statusFilter);
      if (gradeFilter) params.append('grade', gradeFilter);
      if (classFilter) params.append('classId', classFilter);
      if (paymentRoleFilter) params.append('paymentRole', paymentRoleFilter);
      if (paymentStatusFilter) params.append('paymentStatus', paymentStatusFilter);
      if (searchTerm) params.append('search', searchTerm);

      // Load students
      const studentsResponse = await axios.get(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/admin/students?${params.toString()}`,
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
      console.error('Error loading student data:', error);
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

      // Store message details for success dialog
      setSentMessageDetails({
        subject: messageSubject,
        message: messageBody,
        studentName: `${selectedStudent.firstName} ${selectedStudent.lastName}`
      });

      setShowMessageDialog(false);
      setShowMessageSuccessDialog(true);
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
    setSelectedFreeClasses(student.freeClasses || []);
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

    // Validate free classes selection
    if (selectedPaymentRole === 'Free Card' && selectedFreeClasses.length === 0) {
      setError('Please select at least one class for Free Card payment role');
      return;
    }

    setProcessing(true);
    try {
      const response = await axios.put(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/admin/students/${selectedStudent._id}/payment-role`,
        {
          paymentRole: selectedPaymentRole,
          freeClasses: selectedFreeClasses,
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
              freeClasses: selectedFreeClasses,
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
        setSelectedFreeClasses([]);
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
          adminNote: adminNote || `Payments & Behavior status updated`
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
        setSuccess('Payments & Behavior status updated successfully');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      console.error('Error updating Payments & Behavior status:', error);
      setError(error.response?.data?.message || 'Error updating Payments & Behavior status');
      setTimeout(() => setError(''), 3000);
    } finally {
      setProcessing(false);
    }
  };

  // Add a function to count active filters
  const getActiveFiltersCount = () => {
    let count = 0;
    if (statusFilter) count++;
    if (gradeFilter) count++;
    if (classFilter) count++;
    if (paymentRoleFilter) count++;
    if (paymentStatusFilter) count++;
    if (searchTerm) count++;
    return count;
  };

  // Add a function to count filtered results
  const getFilteredResultsCount = () => {
    return students.filter(student => {
      const matchesStatus = !statusFilter || student.status === statusFilter;
      const matchesGrade = !gradeFilter || student.selectedGrade === gradeFilter;
      const matchesClass = !classFilter || (student.enrolledClasses && student.enrolledClasses.some(cls => cls._id === classFilter));
      const matchesPaymentRole = !paymentRoleFilter || student.paymentRole === paymentRoleFilter;
      const matchesPaymentStatus = !paymentStatusFilter || student.paymentStatus === paymentStatusFilter;
      const matchesSearch = !searchTerm ||
        student.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentId?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesGrade && matchesClass && matchesPaymentRole && matchesPaymentStatus && matchesSearch;
    }).length;
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
        <Box>
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                <FilterList sx={{ mr: 1 }} />
                Filters & Search
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip
                    label={`${getActiveFiltersCount()} Active Filters`}
                    color="primary"
                    variant="outlined"
                    sx={{
                      '& .MuiChip-label': {
                        fontWeight: 'bold',
                        fontSize: '0.9rem'
                      }
                    }}
                  />
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 'medium' }}>
                    |
                  </Typography>
                  <Chip
                    label={`${getFilteredResultsCount()} Results`}
                    color="secondary"
                    variant="outlined"
                    sx={{
                      '& .MuiChip-label': {
                        fontWeight: 'bold',
                        fontSize: '0.9rem'
                      }
                    }}
                  />
                </Box>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setStatusFilter('');
                    setGradeFilter('');
                    setClassFilter('');
                    setPaymentRoleFilter('');
                    setPaymentStatusFilter('');
                    setSearchTerm('');
                  }}
                  startIcon={<Refresh />}
                  size="small"
                >
                  Clear All
                </Button>
              </Box>
            </Box>
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
                  sx={{ minWidth: '200px' }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth sx={{ minWidth: '200px' }}>
                  <InputLabel>Registration Status</InputLabel>
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    label="Registration Status"
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Approved">Approved</MenuItem>
                    <MenuItem value="Rejected">Rejected</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
              <FormControl fullWidth sx={{ minWidth: '200px' }}>
                <InputLabel>Grade</InputLabel>
                <Select
                  value={gradeFilter}
                  onChange={(e) => setGradeFilter(e.target.value)}
                  label="Grade"
                >
                  <MenuItem value="">All Grades</MenuItem>
                  {allGrades.map((grade) => (
                    <MenuItem key={grade} value={grade}>{grade}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth sx={{ minWidth: '200px' }}>
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
              <Grid item xs={12} md={3}>
                <FormControl fullWidth sx={{ minWidth: '200px' }}>
                  <InputLabel>Payment Role</InputLabel>
                  <Select
                    value={paymentRoleFilter}
                    onChange={(e) => setPaymentRoleFilter(e.target.value)}
                    label="Payment Role"
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="Pay Card">Pay Card</MenuItem>
                    <MenuItem value="Free Card">Free Card</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth sx={{ minWidth: '200px' }}>
                  <InputLabel>Payments & Behavior Status</InputLabel>
                  <Select
                    value={paymentStatusFilter}
                    onChange={(e) => setPaymentStatusFilter(e.target.value)}
                    label="Payments & Behavior Status"
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="admissioned">හොදයි, ගැටලුවක් නැත, සිසුන්</MenuItem>
                    <MenuItem value="Paid">ඉතා හොදයි, සිසුන්</MenuItem>
                    <MenuItem value="Unpaid">සැලකිළිමත් විය යුතු, සිසුන්</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>

{/* Students Grid */}
<Box sx={{ mb: 3 }}>
  <Typography variant="h6" sx={{
    fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
    fontWeight: 'bold',
    mb: 2,
    display: 'flex',
    alignItems: 'center',
    color: 'text.primary',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    position: 'relative',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: -8,
      left: 0,
      width: '100%',
      height: 3,
      background: 'linear-gradient(90deg, #3f51b5 0%,rgb(37, 98, 148) 100%)',
      borderRadius: 3
    }
  }}>
    <Group sx={{ 
      mr: 1.5,
      color: 'primary.main',
      fontSize: '1.5rem'
    }} />
    සිසුන්ගේ ලැයිස්තුව (Students List) - {students.filter(student => {
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
    }).length} Students
  </Typography>

  <Grid container spacing={3} sx={{
    display: 'flex',
    alignItems: 'stretch' // Ensure all grid items stretch to same height
  }}>
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
      <Grid item xs={12} sm={6} md={3} lg={3} key={student._id} sx={{
        display: 'flex', // Make grid item a flex container
        minWidth: 0 // Prevent flex item from overflowing
      }}>
        <Card
          elevation={8}
          sx={{
            width: '100%', // Take full width of grid item
            minWidth: 350, // Set minimum width for consistency
            maxWidth: 350, // Set maximum width for consistency
            height: 'auto',
            display: 'flex',
            flexDirection: 'column',
            mx: 'auto', // Center the card
            borderRadius: 3,
            overflow: 'hidden',
            background: 'linear-gradient(145deg, #ffffff 0%, #f5f7fa 100%)',
            borderLeft: '5px solid',
            borderColor: student.status === 'Approved' ? '#4caf50' :
                       student.status === 'Pending' ? '#ff9800' : '#f44336',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
            '&:hover': {
              boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
              transform: 'translateY(-5px)',
              borderLeftWidth: 8,
              borderColor: 'rgba(75, 72, 72, 0.97)'
            }
          }}
        >
          {/* Header Section */}
          <Box sx={{
            background: student.status === 'Approved'
              ? 'linear-gradient(135deg, #388e3c 0%, #4caf50 100%)'
              : student.status === 'Pending'
              ? 'linear-gradient(135deg, #f57c00 0%, #ff9800 100%)'
              : 'linear-gradient(135deg, #d32f2f 0%, #f44336 100%)',
            color: 'white',
            p: 2,
            position: 'relative',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 1,
              position: 'relative',
              zIndex: 1
            }}>
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  bgcolor: 'rgba(255,255,255,0.25)',
                  mr: 2,
                  border: '3px solid rgba(255,255,255,0.35)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.1)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                  }
                }}
              >
                {student.profilePicture ? (
                  <img
                    src={student.profilePicture}
                    alt={student.firstName}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <Person sx={{ fontSize: 32 }} />
                )}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{
                  fontWeight: 'bold',
                  fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                  fontSize: '1.15rem',
                  lineHeight: 1.2,
                  textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                }}>
                  {student.firstName} {student.lastName}
                </Typography>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  cursor: 'pointer',
                  p: 0.5,
                  borderRadius: 1,
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.25)',
                    transform: 'scale(1.03)'
                  },
                  transition: 'all 0.2s ease',
                  width: 'fit-content'
                }}
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(student.studentId);
                    setSuccess(`✅ Student ID "${student.studentId}" copied successfully!`);
                    setTimeout(() => setSuccess(''), 3000);
                  } catch (err) {
                    setError('Failed to copy Student ID');
                    setTimeout(() => setError(''), 2000);
                  }
                }}
                >
                  <Typography variant="body2" sx={{
                    opacity: 0.95,
                    fontWeight: 'bold',
                    fontSize: '0.85rem',
                    letterSpacing: '0.5px'
                  }}>
                    ID: {student.studentId}
                  </Typography>
                  <Tooltip title="Click to copy Student ID" arrow>
                    <ContentCopy sx={{
                      fontSize: 16,
                      opacity: 0.8,
                      '&:hover': { opacity: 1 }
                    }} />
                  </Tooltip>
                </Box>
              </Box>
            </Box>

            {/* Status Chip */}
            <Box sx={{ 
              position: 'absolute', 
              top: 12, 
              right: 12,
              zIndex: 2
            }}>
              <Chip
                label={student.status}
                icon={getStatusIcon(student.status)}
                size="small"
                sx={{
                  bgcolor: 'rgba(255,255,255,0.25)',
                  color: 'white',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  fontSize: '0.7rem',
                  height: 24,
                  '& .MuiChip-icon': { 
                    color: 'white',
                    fontSize: '0.9rem',
                    ml: 0.5
                  },
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                }}
              />
            </Box>
            
            {/* Decorative elements */}
            <Box sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '40%',
              height: '100%',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 100%)',
              clipPath: 'polygon(100% 0, 0% 100%, 100% 100%)'
            }} />
          </Box>

          {/* Card Content */}
          <CardContent sx={{ 
            flexGrow: 1, 
            p: 2.5,
            background: 'linear-gradient(to bottom, #ffffff 0%, #f8fafc 100%)'
          }}>
            {/* Basic Info */}
            <Box sx={{ 
              mb: 2.5,
              p: 1.5,
              borderRadius: 2,
              background: 'rgba(245, 245, 245, 0.5)',
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)'
            }}>
              <Typography variant="body2" sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 1.5,
                color: 'text.secondary',
                fontSize: '0.85rem'
              }}>
                <Email sx={{ 
                  mr: 1.5, 
                  fontSize: 18,
                  color: 'primary.main'
                }} />
                <Box sx={{ 
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {student.email}
                </Box>
              </Typography>
              <Typography variant="body2" sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 1.5,
                color: 'text.secondary',
                fontSize: '0.85rem'
              }}>
                <School sx={{ 
                  mr: 1.5, 
                  fontSize: 18,
                  color: 'secondary.main'
                }} />
                Grade: {student.selectedGrade}
              </Typography>
              <Typography variant="body2" sx={{
                display: 'flex',
                alignItems: 'center',
                color: 'text.secondary',
                fontSize: '0.85rem'
              }}>
                <Info sx={{ 
                  mr: 1.5, 
                  fontSize: 18,
                  color: 'text.secondary'
                }} />
                {student.currentStudent}
              </Typography>
            </Box>

            {/* Payment Information */}
            <Box sx={{ 
              mb: 2.5,
              p: 1.5,
              borderRadius: 2,
              background: 'rgba(245, 245, 245, 0.5)',
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)'
            }}>
              <Typography variant="subtitle2" sx={{ 
                mb: 1.5, 
                fontWeight: 'bold',
                color: 'text.primary',
                display: 'flex',
                alignItems: 'center',
                '&::before': {
                  content: '""',
                  display: 'inline-block',
                  width: 4,
                  height: 16,
                  backgroundColor: 'primary.main',
                  borderRadius: 2,
                  mr: 1
                }
              }}>
                Payment & Behavior Information
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 1.5
              }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  flexWrap: 'wrap'
                }}>
                  <Chip
                    label={student.paymentRole === 'Pay Card' ? 'Pay Card Owner' : 'Free Card Owner'}
                    color={student.paymentRole === 'Pay Card' ? 'primary' : 'secondary'}
                    icon={<CreditCard sx={{ fontSize: 16 }} />}
                    size="small"
                    onClick={() => handleUpdatePaymentRole(student)}
                    sx={{ 
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '0.7rem',
                      height: 26,
                      '&:hover': {
                        transform: 'scale(1.05)'
                      },
                      transition: 'all 0.2s ease'
                    }}
                  />
                  <Typography variant="caption" sx={{
                    fontSize: '0.65rem',
                    color: 'primary.main',
                    fontWeight: 'bold',
                    background: 'linear-gradient(45deg,rgb(42, 112, 168) 30%,rgb(20, 55, 63) 90%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    👈
                    Click to change
                  </Typography>
                </Box>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  flexWrap: 'wrap'
                }}>
                  <Chip
                    label={
                      student.paymentStatus === 'Paid' ? 'ඉතා හොදයි' :
                      student.paymentStatus === 'Unpaid' ? 'සැලකිලිමත් විය යුතුයි' : 'හොදයි,ගැටලුවක් නැත'
                    }
                    color={
                      student.paymentStatus === 'Paid' ? 'success' :
                      student.paymentStatus === 'Unpaid' ? 'error' : 'warning'
                    }
                    icon={<FaPerson />}
                    size="small"
                    onClick={() => handleUpdatePaymentStatus(student)}
                    sx={{
                      cursor: 'pointer',
                      fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                      fontWeight: 'bold',
                      fontSize: '0.7rem',
                      height: 26,
                      '&:hover': {
                        transform: 'scale(1.05)'
                      },
                      transition: 'all 0.2s ease'
                    }}
                  />
                  <Typography variant="caption" sx={{
                    fontSize: '0.65rem',
                    color: 'success.main',
                    fontWeight: 'bold',
                    background: 'linear-gradient(45deg,rgb(62, 141, 65) 30%,rgb(63, 88, 34) 90%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    👈
                    Click to change
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Enrolled Classes */}
            <Box sx={{ 
              mb: 1,
              p: 1.5,
              borderRadius: 2,
              background: 'rgba(184, 176, 176, 0.5)',
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)'
            }}>
              <Typography variant="subtitle2" sx={{ 
                mb: 1.5, 
                fontWeight: 'bold',
                color: 'text.primary',
                display: 'flex',
                alignItems: 'center',
                '&::before': {
                  content: '""',
                  display: 'inline-block',
                  width: 4,
                  height: 16,
                  backgroundColor: 'secondary.main',
                  borderRadius: 2,
                  mr: 1
                }
              }}>
                Enrolled Classes ({student.enrolledClasses?.length || 0})
              </Typography>
              {student.enrolledClasses && student.enrolledClasses.length > 0 ? (
                <Box sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 0.75,
                  alignItems: 'center'
                }}>
                  {student.enrolledClasses.slice(0, 2).map((classItem, index) => (
                    <Chip
                      key={index}
                      label={`${classItem.grade} - ${classItem.category}`}
                      size="small"
                      variant="outlined"
                      color="primary"
                      onClick={(e) => {
                        if (e.target.closest('.MuiChip-deleteIcon')) {
                          return;
                        }
                        navigate(`/class/${classItem._id}`);
                      }}
                      onDelete={(e) => {
                        e.stopPropagation();
                        handleRemoveFromClass(student, classItem._id);
                      }}
                      deleteIcon={<RemoveCircle sx={{ fontSize: 16 }} />}
                      sx={{
                        fontSize: '0.65rem',
                        cursor: 'pointer',
                        height: 24,
                        '&:hover': {
                          backgroundColor: 'primary.light',
                          color: 'white',
                          boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                        },
                        transition: 'all 0.2s ease'
                      }}
                    />
                  ))}
                  {student.enrolledClasses.length > 2 && (
                    <Chip
                      label={`+${student.enrolledClasses.length - 2} more`}
                      size="small"
                      variant="outlined"
                      sx={{ 
                        fontSize: '0.65rem',
                        height: 24,
                        '&:hover': {
                          backgroundColor: 'action.hover'
                        }
                      }}
                      onClick={() => handleViewDetails(student)}
                    />
                  )}
                </Box>
              ) : (
                <Typography variant="body2" sx={{ 
                  fontStyle: 'italic',
                  color: 'text.disabled',
                  fontSize: '0.8rem',
                  textAlign: 'center',
                  py: 0.5
                }}>
                  No classes enrolled
                </Typography>
              )}
            </Box>
          </CardContent>

          {/* Action Buttons */}
          <Box sx={{
            p: 2,
            pt: 1.5,
            borderTop: '1px solid',
            borderColor: 'divider',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #e6e9f0 100%)',
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8
          }}>
            <Typography variant="caption" sx={{
              mb: 1.5,
              display: 'block',
              fontWeight: 'bold',
              color: 'primary.dark',
              textAlign: 'center',
              fontSize: '0.7rem',
              letterSpacing: '0.5px',
              textTransform: 'uppercase'
            }}>
              ⚡ Quick Actions
            </Typography>

            {/* Primary Actions Row */}
            <Box sx={{
              display: 'flex',
              gap: 1,
              justifyContent: 'center',
              mb: 1.5,
              flexWrap: 'wrap'
            }}>
              <Tooltip title="View Full Details" arrow>
                <Button
                  size="small"
                  onClick={() => handleViewDetails(student)}
                  startIcon={<Visibility sx={{ fontSize: 18 }} />}
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    minWidth: 'auto',
                    px: 1.5,
                    py: 0.5,
                    fontSize: '0.7rem',
                    fontWeight: 'bold',
                    borderRadius: 1,
                    '&:hover': {
                      bgcolor: 'primary.dark',
                      transform: 'scale(1.05)',
                      boxShadow: '0 3px 10px rgba(63, 81, 181, 0.3)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  View
                </Button>
              </Tooltip>

              <Tooltip title="View Student Profile" arrow>
                <Button
                  size="small"
                  onClick={() => navigate(`/student-profile/${student._id}`)}
                  startIcon={<CgProfile sx={{ fontSize: 18 }} />}
                  sx={{
                    bgcolor: 'rgb(71, 63, 181)',
                    color: 'white',
                    minWidth: 'auto',
                    px: 1.5,
                    py: 0.5,
                    fontSize: '0.7rem',
                    fontWeight: 'bold',
                    borderRadius: 1,
                    '&:hover': {
                      bgcolor: 'primary.dark',
                      transform: 'scale(1.05)',
                      boxShadow: '0 3px 10px rgba(63, 81, 181, 0.3)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  Profile
                </Button>
              </Tooltip>

              <Tooltip title="Send Message" arrow>
                <Button
                  size="small"
                  onClick={() => handleSendMessage(student)}
                  startIcon={<Message sx={{ fontSize: 18 }} />}
                  sx={{
                    bgcolor: 'info.main',
                    color: 'white',
                    minWidth: 'auto',
                    px: 1.5,
                    py: 0.5,
                    fontSize: '0.7rem',
                    fontWeight: 'bold',
                    borderRadius: 1,
                    '&:hover': {
                      bgcolor: 'info.dark',
                      transform: 'scale(1.05)',
                      boxShadow: '0 3px 10px rgba(2, 136, 209, 0.3)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  Message
                </Button>
              </Tooltip>

              {student.status === 'Approved' && (
                <Tooltip title="Change Class" arrow>
                  <Button
                    size="small"
                    onClick={() => handleChangeClass(student)}
                    startIcon={<SwapHoriz sx={{ fontSize: 18 }} />}
                    sx={{
                      bgcolor: 'warning.main',
                      color: 'white',
                      minWidth: 'auto',
                      px: 1.5,
                      py: 0.5,
                      fontSize: '0.7rem',
                      fontWeight: 'bold',
                      borderRadius: 1,
                      '&:hover': {
                        bgcolor: 'warning.dark',
                        transform: 'scale(1.05)',
                        boxShadow: '0 3px 10px rgba(255, 152, 0, 0.3)'
                      },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Change
                  </Button>
                </Tooltip>
              )}
            </Box>

            {/* Status Actions Row */}
            <Box sx={{
              display: 'flex',
              gap: 0.75,
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              {student.status === 'Pending' && (
                <>
                  <Tooltip title="Approve Student" arrow>
                    <Button
                      size="small"
                      onClick={() => handleStudentAction(student, 'approve')}
                      startIcon={<CheckCircle sx={{ fontSize: 16 }} />}
                      sx={{
                        bgcolor: 'success.main',
                        color: 'white',
                        minWidth: 'auto',
                        px: 1,
                        py: 0.25,
                        fontSize: '0.65rem',
                        fontWeight: 'bold',
                        borderRadius: 1,
                        '&:hover': {
                          bgcolor: 'success.dark',
                          transform: 'scale(1.05)',
                          boxShadow: '0 3px 8px rgba(46, 125, 50, 0.3)'
                        },
                        transition: 'all 0.2s ease'
                      }}
                    >
                      Approve
                    </Button>
                  </Tooltip>
                  <Tooltip title="Reject Student" arrow>
                    <Button
                      size="small"
                      onClick={() => handleStudentAction(student, 'reject')}
                      startIcon={<Cancel sx={{ fontSize: 16 }} />}
                      sx={{
                        bgcolor: 'error.main',
                        color: 'white',
                        minWidth: 'auto',
                        px: 1,
                        py: 0.25,
                        fontSize: '0.65rem',
                        fontWeight: 'bold',
                        borderRadius: 1,
                        '&:hover': {
                          bgcolor: 'error.dark',
                          transform: 'scale(1.05)',
                          boxShadow: '0 3px 8px rgba(211, 47, 47, 0.3)'
                        },
                        transition: 'all 0.2s ease'
                      }}
                    >
                      Reject
                    </Button>
                  </Tooltip>
                </>
              )}

              {student.status === 'Approved' && (
                <Tooltip title="Hold Student" arrow>
                  <Button
                    size="small"
                    onClick={() => handleStatusChange(student, 'Pending')}
                    startIcon={<Pending sx={{ fontSize: 16 }} />}
                    sx={{
                      bgcolor: '#ff9100',
                      color: 'white',
                      minWidth: 'auto',
                      px: 1,
                      py: 0.25,
                      fontSize: '0.65rem',
                      fontWeight: 'bold',
                      borderRadius: 1,
                      '&:hover': {
                        bgcolor: '#ff6d00',
                        transform: 'scale(1.05)',
                        boxShadow: '0 3px 8px rgba(255, 109, 0, 0.3)'
                      },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Hold
                  </Button>
                </Tooltip>
              )}

              {student.status === 'Rejected' && (
                <>
                  <Tooltip title="Approve Student" arrow>
                    <Button
                      size="small"
                      onClick={() => handleStatusChange(student, 'Approved')}
                      startIcon={<CheckCircle sx={{ fontSize: 16 }} />}
                      sx={{
                        bgcolor: 'success.main',
                        color: 'white',
                        minWidth: 'auto',
                        px: 1,
                        py: 0.25,
                        fontSize: '0.65rem',
                        fontWeight: 'bold',
                        borderRadius: 1,
                        '&:hover': {
                          bgcolor: 'success.dark',
                          transform: 'scale(1.05)',
                          boxShadow: '0 3px 8px rgba(46, 125, 50, 0.3)'
                        },
                        transition: 'all 0.2s ease'
                      }}
                    >
                      Approve
                    </Button>
                  </Tooltip>
                  <Tooltip title="Move to Pending" arrow>
                    <Button
                      size="small"
                      onClick={() => handleStatusChange(student, 'Pending')}
                      startIcon={<Pending sx={{ fontSize: 16 }} />}
                      sx={{
                        bgcolor: '#ff9100',
                        color: 'white',
                        minWidth: 'auto',
                        px: 1,
                        py: 0.25,
                        fontSize: '0.65rem',
                        fontWeight: 'bold',
                        borderRadius: 1,
                        '&:hover': {
                          bgcolor: '#ff6d00',
                          transform: 'scale(1.05)',
                          boxShadow: '0 3px 8px rgba(255, 109, 0, 0.3)'
                        },
                        transition: 'all 0.2s ease'
                      }}
                    >
                      Pending
                    </Button>
                  </Tooltip>
                </>
              )}

              <Tooltip title="Delete Student" arrow>
                <Button
                  size="small"
                  onClick={() => handleDeleteStudent(student)}
                  startIcon={<Delete sx={{ fontSize: 16 }} />}
                  sx={{
                    bgcolor: '#d32f2f',
                    color: 'white',
                    minWidth: 'auto',
                    px: 1,
                    py: 0.25,
                    fontSize: '0.65rem',
                    fontWeight: 'bold',
                    borderRadius: 1,
                    '&:hover': {
                      bgcolor: '#b71c1c',
                      transform: 'scale(1.05)',
                      boxShadow: '0 3px 8px rgba(183, 28, 28, 0.3)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  Delete
                </Button>
              </Tooltip>
            </Box>
          </Box>
        </Card>
      </Grid>
    ))}
  </Grid>

            {/* No Students Found Message */}
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
            }).length === 0 && (
              <Paper elevation={3} sx={{ p: 4, textAlign: 'center', mt: 3, borderRadius: 3 }}>
                <School sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" sx={{
                  fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                  mb: 1
                }}>
                  සිසුන් හමු නොවීය (No Students Found)
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Please adjust your search criteria or filters to find students.
                </Typography>
              </Paper>
            )}
          </Box>

{/* Student Details Dialog */}
<Dialog
  open={showDetailsDialog}
  onClose={() => setShowDetailsDialog(false)}
  maxWidth="lg"
  fullWidth
  PaperProps={{
    sx: {
      borderRadius: '12px',
      background: 'linear-gradient(145deg, #ffffff 0%, #f5f7fa 100%)',
      boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.15)',
      border: '1px solid rgba(0, 0, 0, 0.1)',
      overflow: 'hidden'
    }
  }}
>
  {/* Dialog Header with Gradient */}
  <DialogTitle sx={{
    background: 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)',
    color: 'white',
    textAlign: 'center',
    py: 2.5,
    fontSize: '1.5rem',
    fontWeight: 600,
    letterSpacing: '0.5px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  }}>
    <Person sx={{ 
      mr: 1.5, 
      fontSize: 32,
      background: 'rgba(255,255,255,0.2)',
      borderRadius: '50%',
      padding: '5px'
    }} />
    Student Details - {selectedStudent?.studentId}
  </DialogTitle>

  {/* Main Content */}
  <DialogContent sx={{ 
    p: 0,
    '&::-webkit-scrollbar': {
      width: '8px'
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0,0,0,0.2)',
      borderRadius: '4px'
    }
  }}>
    {selectedStudent && (
      <Box sx={{ p: 3 }}>
        {/* Top Cards Row */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {/* Personal Information Card */}
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{
              p: 3,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
              borderLeft: '5px solid #1976d2',
              height: '100%',
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
              }
            }}>
              <Box sx={{ 
                display: 'flex',
                alignItems: 'center',
                mb: 2,
                color: '#1976d2'
              }}>
                <Person sx={{ 
                  mr: 1.5,
                  fontSize: 28,
                  background: 'rgba(25, 118, 210, 0.1)',
                  borderRadius: '50%',
                  padding: '5px'
                }} />
                <Typography variant="h6" sx={{ 
                  fontWeight: 600,
                  letterSpacing: '0.3px'
                }}>
                  Personal Information
                </Typography>
              </Box>
              <Box sx={{ 
                display: 'grid',
                gridTemplateColumns: 'max-content 1fr',
                gap: '12px 8px',
                alignItems: 'center'
              }}>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>Name:</Typography>
                <Typography>{selectedStudent.firstName} {selectedStudent.lastName}</Typography>
                
                <Typography variant="body1" sx={{ fontWeight: 500 }}>Email:</Typography>
                <Typography sx={{ wordBreak: 'break-word' }}>{selectedStudent.email}</Typography>
                
                <Typography variant="body1" sx={{ fontWeight: 500 }}>Contact:</Typography>
                <Typography>{selectedStudent.contactNumber}</Typography>
                
                <Typography variant="body1" sx={{ fontWeight: 500 }}>School:</Typography>
                <Typography>{selectedStudent.school}</Typography>
                
                <Typography variant="body1" sx={{ fontWeight: 500 }}>Grade:</Typography>
                <Typography>{selectedStudent.selectedGrade}</Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Guardian Information Card */}
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{
              p: 3,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
              borderLeft: '5px solid #9c27b0',
              height: '100%',
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
              }
            }}>
              <Box sx={{ 
                display: 'flex',
                alignItems: 'center',
                mb: 2,
                color: '#9c27b0'
              }}>
                <Group sx={{ 
                  mr: 1.5,
                  fontSize: 28,
                  background: 'rgba(156, 39, 176, 0.1)',
                  borderRadius: '50%',
                  padding: '5px'
                }} />
                <Typography variant="h6" sx={{ 
                  fontWeight: 600,
                  letterSpacing: '0.3px'
                }}>
                  Guardian Information
                </Typography>
              </Box>
              <Box sx={{ 
                display: 'grid',
                gridTemplateColumns: 'max-content 1fr',
                gap: '12px 8px',
                alignItems: 'center'
              }}>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>Guardian:</Typography>
                <Typography>{selectedStudent.guardianName}</Typography>
                
                <Typography variant="body1" sx={{ fontWeight: 500 }}>Type:</Typography>
                <Typography>{selectedStudent.guardianType}</Typography>
                
                <Typography variant="body1" sx={{ fontWeight: 500 }}>Contact:</Typography>
                <Typography>{selectedStudent.guardianContact}</Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Status and Payment Row */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {/* Status Card */}
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{
              p: 3,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
              borderLeft: '5px solid #4caf50',
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
              }
            }}>
              <Box sx={{ 
                display: 'flex',
                alignItems: 'center',
                mb: 2,
                color: '#4caf50'
              }}>
                <Assignment sx={{ 
                  mr: 1.5,
                  fontSize: 28,
                  background: 'rgba(76, 175, 80, 0.1)',
                  borderRadius: '50%',
                  padding: '5px'
                }} />
                <Typography variant="h6" sx={{ 
                  fontWeight: 600,
                  letterSpacing: '0.3px'
                }}>
                  Status Information
                </Typography>
              </Box>
              <Box sx={{ 
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                flexWrap: 'wrap'
              }}>
                <Chip
                  label={selectedStudent.status}
                  color={getStatusColor(selectedStudent.status)}
                  icon={getStatusIcon(selectedStudent.status)}
                  size="medium"
                  sx={{ 
                    fontSize: '0.9rem',
                    py: 1.5,
                    px: 2,
                    fontWeight: 500,
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                  }}
                />
                {selectedStudent.adminAction?.actionNote && (
                  <Box sx={{
                    bgcolor: 'rgba(255,255,255,0.8)',
                    p: 1.5,
                    borderRadius: '8px',
                    border: '1px solid #e0e0e0',
                    flexGrow: 1,
                    minWidth: '200px'
                  }}>
                    <Typography variant="subtitle2" sx={{ 
                      fontWeight: 500,
                      color: 'text.secondary',
                      mb: 0.5
                    }}>
                      Admin Note:
                    </Typography>
                    <Typography variant="body2">
                      {selectedStudent.adminAction.actionNote}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>

          {/* Payment Information Card */}
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{
              p: 3,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
              borderLeft: '5px solid #ff9800',
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
              }
            }}>
              <Box sx={{ 
                display: 'flex',
                alignItems: 'center',
                mb: 2,
                color: '#ff9800'
              }}>
                <Payment sx={{ 
                  mr: 1.5,
                  fontSize: 28,
                  background: 'rgba(255, 152, 0, 0.1)',
                  borderRadius: '50%',
                  padding: '5px'
                }} />
                <Typography variant="h6" sx={{ 
                  fontWeight: 600,
                  letterSpacing: '0.3px'
                }}>
                  Payment & Behavior Information
                </Typography>
              </Box>
              <Box sx={{ 
                display: 'flex',
                flexDirection: 'column',
                gap: 2
              }}>
                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                  <Chip
                    label={selectedStudent.paymentRole}
                    color={selectedStudent.paymentRole === 'Pay Card' ? 'primary' : 'secondary'}
                    icon={<CreditCard sx={{ fontSize: '18px !important' }} />}
                    sx={{
                      fontWeight: 500,
                      px: 1.5,
                      py: 1,
                      boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Chip
                    label={
                      selectedStudent.paymentStatus === 'Paid' ? 'ඉතා හොදයි' :
                      selectedStudent.paymentStatus === 'admissioned' ? 'හොදයි, ගැටලුවක් නැත' :
                      selectedStudent.paymentStatus === 'Unpaid' ? 'සැලකිළිමත් විය යුතුයි' :
                      selectedStudent.paymentStatus
                    }
                    color={
                      selectedStudent.paymentStatus === 'Paid' ? 'success' :
                      selectedStudent.paymentStatus === 'admissioned' ? 'primary' :
                      'warning'
                    }
                    sx={{
                      fontWeight: 500,
                      px: 1.5,
                      py: 1,
                      boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                    }}
                  />
                </Box>
                
                
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Enrolled Classes Section */}
        <Paper elevation={0} sx={{
          p: 3,
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
          borderLeft: '5px solid #673ab7',
          mb: 2,
          transition: 'transform 0.3s, box-shadow 0.3s',
          '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
          }
        }}>
          <Box sx={{ 
            display: 'flex',
            alignItems: 'center',
            mb: 3,
            color: '#673ab7'
          }}>
            <Class sx={{ 
              mr: 1.5,
              fontSize: 28,
              background: 'rgba(103, 58, 183, 0.1)',
              borderRadius: '50%',
              padding: '5px'
            }} />
            <Typography variant="h6" sx={{ 
              fontWeight: 600,
              letterSpacing: '0.3px'
            }}>
              Enrolled Classes ({selectedStudent.enrolledClasses?.length || 0})
            </Typography>
          </Box>

          {selectedStudent.enrolledClasses && selectedStudent.enrolledClasses.length > 0 ? (
            <Grid container spacing={3}>
              {selectedStudent.enrolledClasses.map((classItem, index) => {
                const capacity = classItem.capacity || 0;
                const enrolledCount = classItem.enrolledCount || 0;
                const availableSpots = classItem.availableSpots || 0;

                return (
                  <Grid item xs={12} md={6} key={index}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        borderRadius: '10px',
                        border: '1px solid #e0e0e0',
                        background: 'white',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
                          borderColor: '#1976d2'
                        },
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '4px',
                          height: '100%',
                          background: 'linear-gradient(to bottom, #1976d2, #42a5f5)'
                        }
                      }}
                      onClick={() => navigate(`/class/${classItem._id}`)}
                    >
                      {/* Class Header */}
                      <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        mb: 2
                      }}>
                        <Box>
                          <Typography variant="subtitle1" fontWeight="600" sx={{
                            display: 'flex',
                            alignItems: 'center',
                            color: 'primary.main',
                            mb: 0.5
                          }}>
                            <Category sx={{ mr: 1, fontSize: 20 }} />
                            {classItem.category}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{
                            display: 'flex',
                            alignItems: 'center',
                            ml: 3
                          }}>
                            <School sx={{ mr: 1, fontSize: 16 }} />
                            Grade: {classItem.grade}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="View Class" arrow>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/class/${classItem._id}`);
                              }}
                              sx={{
                                bgcolor: 'primary.light',
                                color: 'primary.main',
                                '&:hover': { 
                                  bgcolor: 'primary.main',
                                  color: 'white'
                                }
                              }}
                            >
                              <Visibility fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Remove Student" arrow>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveFromClass(selectedStudent, classItem._id);
                              }}
                              sx={{
                                bgcolor: 'error.light',
                                color: 'error.main',
                                '&:hover': { 
                                  bgcolor: 'error.main',
                                  color: 'white'
                                }
                              }}
                            >
                              <RemoveCircle fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>

                      {/* Class Details */}
                      <Box sx={{ 
                        display: 'grid',
                        gridTemplateColumns: 'max-content 1fr',
                        gap: '10px 8px',
                        alignItems: 'center',
                        mt: 2
                      }}>
                        <Schedule sx={{ fontSize: 18, color: 'text.secondary' }} />
                        <Typography variant="body2">
                          {classItem.startTime} - {classItem.endTime}
                        </Typography>
                        
                        <LocationOn sx={{ fontSize: 18, color: 'text.secondary' }} />
                        <Typography variant="body2">{classItem.venue}</Typography>
                        
                        <People sx={{ fontSize: 18, color: 'text.secondary' }} />
                        <Typography variant="body2">
                          {availableSpots} / {capacity} slots available ({enrolledCount} enrolled)
                        </Typography>
                        
                        <Public sx={{ fontSize: 18, color: 'text.secondary' }} />
                        <Typography variant="body2">{classItem.platform || 'Physical'}</Typography>
                        
                        <CalendarToday sx={{ fontSize: 18, color: 'text.secondary' }} />
                        <Typography variant="body2">{classItem.date}</Typography>
                      </Box>

                      {/* Click hint */}
                      <Box sx={{
                        mt: 2,
                        pt: 2,
                        borderTop: '1px dashed #e0e0e0',
                        textAlign: 'center'
                      }}>
                        <Typography variant="caption" color="text.secondary" sx={{
                          fontStyle: 'italic',
                          fontSize: '0.7rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Info sx={{ fontSize: 14, mr: 0.5 }} />
                          Click to view class details
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          ) : (
            <Box sx={{
              textAlign: 'center',
              py: 4,
              bgcolor: 'rgba(255,255,255,0.7)',
              borderRadius: '8px'
            }}>
              <Class sx={{ 
                fontSize: 60, 
                color: 'text.disabled', 
                mb: 2,
                opacity: 0.5
              }} />
              <Typography variant="h6" color="text.secondary" sx={{ 
                fontStyle: 'italic',
                mb: 1
              }}>
                No classes enrolled yet
              </Typography>
              <Typography variant="body2" color="text.disabled">
                This student hasn't enrolled in any classes
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>
    )}
  </DialogContent>

  {/* Dialog Footer */}
  <DialogActions sx={{
    p: 2.5,
    background: '#f5f7fa',
    borderTop: '1px solid #e0e0e0',
    display: 'flex',
    justifyContent: 'center'
  }}>
    <Button
      onClick={() => setShowDetailsDialog(false)}
      variant="contained"
      size="large"
      startIcon={<CheckCircleOutline sx={{ fontSize: 24 }} />}
      sx={{
        bgcolor: 'primary.main',
        color: 'white',
        px: 5,
        py: 1.5,
        borderRadius: '8px',
        fontWeight: 600,
        letterSpacing: '0.5px',
        textTransform: 'uppercase',
        boxShadow: '0 3px 10px rgba(25, 118, 210, 0.3)',
        '&:hover': {
          bgcolor: 'primary.dark',
          boxShadow: '0 5px 15px rgba(25, 118, 210, 0.4)'
        },
        transition: 'all 0.2s ease'
      }}
    >
      Close Details
    </Button>
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
                  onChange={(e) => {
                    setSelectedPaymentRole(e.target.value);
                    if (e.target.value === 'Pay Card') {
                      setSelectedFreeClasses([]);
                    }
                  }}
                  label="Payment Role"
                >
                  <MenuItem value="Pay Card">Pay Card</MenuItem>
                  <MenuItem value="Free Card">Free Card</MenuItem>
                </Select>
              </FormControl>

              {selectedPaymentRole === 'Free Card' && (
                <>
                  <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
                    Select Classes for Free Card
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Select the classes that will be free for this student
                  </Typography>

                  {/* Display currently selected free classes as chips */}
                  {selectedFreeClasses.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Selected Free Classes:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {selectedFreeClasses.map((classId) => {
                          const classItem = selectedStudent?.enrolledClasses?.find(c => c._id === classId);
                          return classItem ? (
                            <Chip
                              key={classId}
                              label={`${classItem.grade} - ${classItem.category}`}
                              onDelete={() => setSelectedFreeClasses(prev => prev.filter(id => id !== classId))}
                              color="primary"
                              variant="outlined"
                            />
                          ) : null;
                        })}
                      </Box>
                    </Box>
                  )}

                  {/* Display available classes for selection */}
                  <FormControl fullWidth>
                    <InputLabel>Select Classes</InputLabel>
                    <Select
                      multiple
                      value={selectedFreeClasses}
                      onChange={(e) => setSelectedFreeClasses(e.target.value)}
                      label="Select Classes"
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((classId) => {
                            const classItem = selectedStudent?.enrolledClasses?.find(c => c._id === classId);
                            return classItem ? (
                              <Chip
                                key={classId}
                                label={`${classItem.grade} - ${classItem.category}`}
                                size="small"
                              />
                            ) : null;
                          })}
                        </Box>
                      )}
                    >
                      {selectedStudent?.enrolledClasses
                        ?.filter(classItem => classItem.type === 'Normal')
                        .map((classItem) => (
                          <MenuItem key={classItem._id} value={classItem._id}>
                            {classItem.grade} - {classItem.category} ({classItem.date})
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </>
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
              <Button onClick={() => setShowPaymentRoleDialog(false)} disabled={processing}>
                Cancel
              </Button>
              <Button
                onClick={confirmPaymentRoleUpdate}
                variant="contained"
                color="primary"
                disabled={processing || (selectedPaymentRole === 'Free Card' && selectedFreeClasses.length === 0)}
                startIcon={processing ? <CircularProgress size={20} /> : null}
              >
                {processing ? 'Updating...' : 'Update'}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Payment Status Update Dialog */}
          <Dialog open={showPaymentStatusDialog} onClose={() => setShowPaymentStatusDialog(false)} maxWidth="sm" fullWidth>
            <DialogTitle>Update Payments & Behavior Status</DialogTitle>
            <DialogContent>
              <Typography gutterBottom>
                Update Payments & Behavior status for {selectedStudent?.firstName} {selectedStudent?.lastName}
              </Typography>
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Payments & Behavior Status</InputLabel>
                <Select
                  value={selectedPaymentStatus}
                  onChange={(e) => setSelectedPaymentStatus(e.target.value)}
                  label="Payments & Behavior"
                >
                  <MenuItem value="admissioned">හොදයි, ගැටලුවක් නැත</MenuItem>
                  <MenuItem value="Paid">ඉතා හොදයි</MenuItem>
                  <MenuItem value="Unpaid">සැලකිළිමත් විය යුතුයි !</MenuItem>
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

          {/* Message Success Dialog */}
          <Dialog
            open={showMessageSuccessDialog}
            onClose={() => setShowMessageSuccessDialog(false)}
            maxWidth="sm"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: 3,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                animation: 'float 3s ease-in-out infinite',
                '@keyframes float': {
                  '0%, 100%': { transform: 'translateY(0px)' },
                  '50%': { transform: 'translateY(-10px)' }
                }
              }
            }}
          >
            <DialogTitle sx={{
              textAlign: 'center',
              pb: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2
            }}>
              <CheckCircle sx={{ fontSize: 40, color: '#4caf50' }} />
              <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                Message Sent Successfully!
              </Typography>
            </DialogTitle>
            <DialogContent sx={{ pt: 2 }}>
              <Box sx={{
                p: 3,
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: 2,
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)'
              }}>
                <Typography variant="h6" gutterBottom sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: '#fff',
                  fontWeight: 'bold'
                }}>
                  <Person sx={{ color: '#4caf50' }} />
                  Sent to: {sentMessageDetails.studentName}
                </Typography>

                <Box sx={{ mt: 2, mb: 2 }}>
                  <Typography variant="subtitle1" sx={{
                    fontWeight: 'bold',
                    color: '#ffeb3b',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 1
                  }}>
                    <Subject sx={{ fontSize: 20 }} />
                    Subject:
                  </Typography>
                  <Typography variant="body1" sx={{
                    pl: 3,
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    p: 1,
                    borderRadius: 1,
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}>
                    {sentMessageDetails.subject}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle1" sx={{
                    fontWeight: 'bold',
                    color: '#ffeb3b',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 1
                  }}>
                    <Message sx={{ fontSize: 20 }} />
                    Message:
                  </Typography>
                  <Typography variant="body1" sx={{
                    pl: 3,
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    p: 2,
                    borderRadius: 1,
                    border: '1px solid rgba(255,255,255,0.2)',
                    whiteSpace: 'pre-wrap',
                    maxHeight: '150px',
                    overflowY: 'auto'
                  }}>
                    {sentMessageDetails.message}
                  </Typography>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3, justifyContent: 'center' }}>
              <Button
                onClick={() => setShowMessageSuccessDialog(false)}
                variant="contained"
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: 'bold',
                  px: 4,
                  py: 1,
                  borderRadius: 2,
                  border: '1px solid rgba(255,255,255,0.3)',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.3)',
                    transform: 'scale(1.05)'
                  },
                  transition: 'all 0.3s ease'
                }}
                startIcon={<CheckCircle />}
              >
                OK
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Container>
    </Box>
  );
};

export default StudentManagement;
