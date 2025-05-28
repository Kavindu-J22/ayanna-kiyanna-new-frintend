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
  Edit,
  Delete,
  Refresh,
  FilterList,
  ArrowBack,
  Pending,
  Group,
  Assignment,
  TrendingUp,
  Search,
  Message,
  SwapHoriz,
  RemoveCircle,
  Class
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

  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  // New functionality states
  const [availableClasses, setAvailableClasses] = useState([]);
  const [availableGrades, setAvailableGrades] = useState([]);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [showClassChangeDialog, setShowClassChangeDialog] = useState(false);
  const [messageSubject, setMessageSubject] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [selectedOldClass, setSelectedOldClass] = useState('');
  const [selectedNewClass, setSelectedNewClass] = useState('');

  useEffect(() => {
    loadStudentData();
    loadAdditionalData();
  }, [statusFilter, gradeFilter, currentPage]);

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

  const loadStudentData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      // Load students
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        ...(statusFilter && { status: statusFilter }),
        ...(gradeFilter && { grade: gradeFilter })
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
              <Grid item xs={12} md={4}>
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
              <Grid item xs={12} md={4}>
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
              <Grid item xs={12} md={4}>
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
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Classes</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {students.filter(student => {
                    const matchesStatus = !statusFilter || student.status === statusFilter;
                    const matchesGrade = !gradeFilter || student.selectedGrade === gradeFilter;
                    const matchesSearch = !searchTerm ||
                      student.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      student.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      student.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      student.studentId?.toLowerCase().includes(searchTerm.toLowerCase());
                    return matchesStatus && matchesGrade && matchesSearch;
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
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {/* Student Details Dialog */}
          <Dialog open={showDetailsDialog} onClose={() => setShowDetailsDialog(false)} maxWidth="md" fullWidth>
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
        </motion.div>
      </Container>
    </Box>
  );
};

export default StudentManagement;
