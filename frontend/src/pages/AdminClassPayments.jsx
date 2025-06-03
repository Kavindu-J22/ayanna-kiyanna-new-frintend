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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  IconButton,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import {
  ArrowBack,
  Payment,
  CalendarToday,
  CheckCircle,
  Cancel,
  Visibility,
  SelectAll
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';

const AdminClassPayments = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Default to current month
  const [classData, setClassData] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [selectedPayments, setSelectedPayments] = useState([]);
  const [processDialog, setProcessDialog] = useState({ open: false, action: '', paymentId: null });
  const [actionNote, setActionNote] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // New dialog states
  const [viewRequestDialog, setViewRequestDialog] = useState({ open: false, payment: null });
  const [updateStatusDialog, setUpdateStatusDialog] = useState({ open: false, studentData: null });
  const [newStatus, setNewStatus] = useState('');

  const monthNames = [
    'ජනවාරි', 'පෙබරවාරි', 'මාර්තු', 'අප්‍රේල්', 'මැයි', 'ජූනි',
    'ජූලි', 'අගෝස්තු', 'සැප්තැම්බර්', 'ඔක්තෝබර්', 'නොවැම්බර්', 'දෙසැම්බර්'
  ];

  useEffect(() => {
    fetchClassData();
  }, [classId]);

  useEffect(() => {
    if (selectedMonth) {
      fetchPaymentData();
    }
  }, [classId, selectedYear, selectedMonth]);

  const fetchClassData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/classes/${classId}`,
        { headers: { 'x-auth-token': token } }
      );
      setClassData(response.data);
    } catch (error) {
      console.error('Error fetching class data:', error);
      setError('Error loading class data');
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/payments/admin/${classId}/${selectedYear}/${selectedMonth}`,
        { headers: { 'x-auth-token': token } }
      );

      // Debug logging to see the actual data structure
      console.log('=== PAYMENT DATA RECEIVED ===');
      console.log('Full response:', response.data);

      if (response.data.paymentRequests && response.data.paymentRequests.length > 0) {
        console.log('\n=== PAYMENT REQUEST STUDENT DATA ===');
        const studentData = response.data.paymentRequests[0].studentId;
        console.log('Student object:', studentData);
        console.log('firstName:', studentData?.firstName);
        console.log('lastName:', studentData?.lastName);
        console.log('surname:', studentData?.surname);
        console.log('fullName:', studentData?.fullName);
        console.log('studentId:', studentData?.studentId);
      }

      if (response.data.allStudentsStatus && response.data.allStudentsStatus.length > 0) {
        console.log('\n=== ALL STUDENTS STATUS DATA ===');
        const studentData = response.data.allStudentsStatus[0].student;
        console.log('Student object:', studentData);
        console.log('firstName:', studentData?.firstName);
        console.log('lastName:', studentData?.lastName);
        console.log('surname:', studentData?.surname);
        console.log('fullName:', studentData?.fullName);
        console.log('studentId:', studentData?.studentId);
      }

      setPaymentData(response.data);
    } catch (error) {
      console.error('Error fetching payment data:', error);
      setError(error.response?.data?.message || 'Error loading payment data');
    } finally {
      setLoading(false);
    }
  };

  const handleMonthSelect = (month) => {
    setSelectedMonth(month);
    setSelectedPayments([]);
  };

  const handlePaymentSelection = (paymentId) => {
    setSelectedPayments(prev => 
      prev.includes(paymentId) 
        ? prev.filter(id => id !== paymentId)
        : [...prev, paymentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedPayments.length === paymentData.paymentRequests.length) {
      setSelectedPayments([]);
    } else {
      setSelectedPayments(paymentData.paymentRequests.map(p => p._id));
    }
  };

  const handleProcessPayment = async (action, paymentId = null) => {
    try {
      const token = localStorage.getItem('token');

      if (paymentId) {
        // Process single payment
        await axios.put(
          `https://ayanna-kiyanna-new-backend.onrender.com/api/payments/admin/${paymentId}/process`,
          { action, actionNote },
          { headers: { 'x-auth-token': token } }
        );
      } else {
        // Bulk process
        await axios.put(
          'https://ayanna-kiyanna-new-backend.onrender.com/api/payments/admin/bulk-process',
          { paymentIds: selectedPayments, action, actionNote },
          { headers: { 'x-auth-token': token } }
        );
      }

      setSuccess(`Payment(s) ${action.toLowerCase()} successfully`);
      setProcessDialog({ open: false, action: '', paymentId: null });
      setActionNote('');
      setSelectedPayments([]);
      fetchPaymentData();
    } catch (error) {
      console.error('Error processing payment:', error);
      setError(error.response?.data?.message || 'Error processing payment');
    }
  };

  // Function to update payment status for existing payments
  const handleUpdatePaymentStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/payments/admin/${updateStatusDialog.studentData.payment._id}/process`,
        { action: newStatus, actionNote },
        { headers: { 'x-auth-token': token } }
      );

      setSuccess(`Payment status updated to ${newStatus} successfully`);
      setUpdateStatusDialog({ open: false, studentData: null });
      setNewStatus('');
      setActionNote('');
      fetchPaymentData();
    } catch (error) {
      console.error('Error updating payment status:', error);
      setError(error.response?.data?.message || 'Error updating payment status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'success';
      case 'Rejected': return 'error';
      case 'Pending': return 'warning';
      default: return 'default';
    }
  };

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear - 2; year <= currentYear + 1; year++) {
      years.push(year);
    }
    return years;
  };

  // Helper function to get student display name
  const getStudentDisplayName = (student) => {
    console.log('Getting display name for student:', student);

    // If fullName exists and is not empty
    if (student?.fullName && student.fullName.trim() !== '') {
      return student.fullName;
    }

    // Try to construct from firstName and lastName
    if (student?.firstName && student?.lastName) {
      return `${student.firstName} ${student.lastName}`;
    }

    // Try individual fields
    if (student?.firstName) {
      return student.firstName;
    }

    if (student?.lastName) {
      return student.lastName;
    }

    if (student?.surname) {
      return student.surname;
    }

    // Fallback
    return 'N/A';
  };

  // Filter students based on search query
  const filteredStudents = paymentData?.allStudentsStatus?.filter(studentData => {
    if (!searchQuery) return true;

    const displayName = getStudentDisplayName(studentData.student);
    const studentId = studentData.student?.studentId || '';
    const surname = studentData.student?.surname || '';
    const firstName = studentData.student?.firstName || '';
    const lastName = studentData.student?.lastName || '';

    return displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
           studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
           surname.toLowerCase().includes(searchQuery.toLowerCase()) ||
           firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
           lastName.toLowerCase().includes(searchQuery.toLowerCase());
  }) || [];

  if (loading && !paymentData) {
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
              පන්ති ගෙවීම් කළමනාකරණය
            </Typography>
          </Box>
          
          {classData && (
            <Typography variant="h6" sx={{
              fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
            }}>
              {classData.grade} - {classData.category}
            </Typography>
          )}
        </Paper>

        {/* Year Selection */}
        <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>වර්ෂය තෝරන්න</InputLabel>
            <Select
              value={selectedYear}
              label="වර්ෂය තෝරන්න"
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              {generateYearOptions().map(year => (
                <MenuItem key={year} value={year}>{year}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Paper>

        {/* Month Selection */}
        <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
          <Typography variant="h6" gutterBottom sx={{
            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
          }}>
            මාසය තෝරන්න
          </Typography>
          <Grid container spacing={2}>
            {monthNames.map((monthName, index) => (
              <Grid item xs={6} sm={4} md={3} lg={2} key={index}>
                <Button
                  fullWidth
                  variant={selectedMonth === index + 1 ? 'contained' : 'outlined'}
                  onClick={() => handleMonthSelect(index + 1)}
                  sx={{
                    fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                    fontWeight: 'bold'
                  }}
                >
                  {monthName}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Payment Management */}
        {selectedMonth && paymentData && (
          <>
            {/* Payment Requests Section */}
            <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{
                  fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                }}>
                  ගෙවීම් ඉල්ලීම් ({monthNames[selectedMonth - 1]} {selectedYear})
                </Typography>
                
                {paymentData.paymentRequests.length > 0 && (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      startIcon={<SelectAll />}
                      onClick={handleSelectAll}
                      size="small"
                    >
                      {selectedPayments.length === paymentData.paymentRequests.length ? 'Deselect All' : 'Select All'}
                    </Button>
                    {selectedPayments.length > 0 && (
                      <>
                        <Button
                          variant="contained"
                          color="success"
                          onClick={() => setProcessDialog({ open: true, action: 'Approved', paymentId: null })}
                          size="small"
                        >
                          Approve Selected ({selectedPayments.length})
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => setProcessDialog({ open: true, action: 'Rejected', paymentId: null })}
                          size="small"
                        >
                          Reject Selected ({selectedPayments.length})
                        </Button>
                      </>
                    )}
                  </Box>
                )}
              </Box>

              {paymentData.paymentRequests.length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selectedPayments.length === paymentData.paymentRequests.length}
                            indeterminate={selectedPayments.length > 0 && selectedPayments.length < paymentData.paymentRequests.length}
                            onChange={handleSelectAll}
                          />
                        </TableCell>
                        <TableCell>Student</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Attendance</TableCell>
                        <TableCell>Submitted</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paymentData.paymentRequests.map((payment) => (
                        <TableRow key={payment._id}>
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={selectedPayments.includes(payment._id)}
                              onChange={() => handlePaymentSelection(payment._id)}
                            />
                          </TableCell>
                          <TableCell>
                            <Box>
                              <Typography variant="body2" fontWeight="bold">
                                {getStudentDisplayName(payment.studentId)}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {payment.studentId?.studentId || 'N/A'}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>Rs. {payment.amount}/=</TableCell>
                          <TableCell>
                            {payment.attendanceData.presentDays}/{payment.attendanceData.totalClassDays}
                          </TableCell>
                          <TableCell>
                            {new Date(payment.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                              <Button
                                size="small"
                                variant="outlined"
                                startIcon={<Visibility />}
                                onClick={() => setViewRequestDialog({ open: true, payment })}
                                sx={{ mb: 1 }}
                              >
                                View Request
                              </Button>
                              <Button
                                size="small"
                                variant="contained"
                                color="success"
                                onClick={() => setProcessDialog({ open: true, action: 'Approved', paymentId: payment._id })}
                                sx={{ mb: 1 }}
                              >
                                Approve
                              </Button>
                              <Button
                                size="small"
                                variant="contained"
                                color="error"
                                onClick={() => setProcessDialog({ open: true, action: 'Rejected', paymentId: payment._id })}
                                sx={{ mb: 1 }}
                              >
                                Reject
                              </Button>
                              <Button
                                size="small"
                                variant="outlined"
                                startIcon={<Visibility />}
                                onClick={() => window.open(payment.receiptUrl, '_blank')}
                                sx={{ mb: 1 }}
                              >
                                View Receipt
                              </Button>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Alert severity="info">No pending payment requests for this month.</Alert>
              )}
            </Paper>

            {/* All Students Status */}
            <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{
                  fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                }}>
                  සියලුම සිසුන්ගේ ගෙවීම් තත්ත්වය
                </Typography>
                <TextField
                  size="small"
                  placeholder="Search by name or Student ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{ minWidth: 250 }}
                />
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Student</TableCell>
                      <TableCell>Attendance</TableCell>
                      <TableCell>Payment Status</TableCell>
                      <TableCell>Payment Role</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredStudents.map((studentData) => (
                      <TableRow key={studentData.student._id}>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" fontWeight="bold">
                              {getStudentDisplayName(studentData.student)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {studentData.student?.studentId || 'N/A'}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          {studentData.attendance.presentDays}/{studentData.attendance.totalClassDays}
                        </TableCell>
                        <TableCell>
                          {studentData.payment ? (
                            <Chip 
                              label={studentData.payment.status}
                              color={getStatusColor(studentData.payment.status)}
                              size="small"
                            />
                          ) : studentData.requiresPayment ? (
                            <Chip label="Not Requested" color="warning" size="small" />
                          ) : (
                            <Chip label="Not Required" color="default" size="small" />
                          )}
                        </TableCell>
                        <TableCell>
                          {studentData.isFreeClass ? (
                            <Chip label="Free Card Owner" color="success" size="small" />
                          ) : (
                            <Chip label="Pay Card Owner" color="default" size="small" />
                          )}
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            {studentData.payment && (
                              <>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  startIcon={<Visibility />}
                                  onClick={() => setViewRequestDialog({ open: true, payment: studentData.payment })}
                                  sx={{ mb: 1 }}
                                >
                                  View Request
                                </Button>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  startIcon={<Visibility />}
                                  onClick={() => window.open(studentData.payment.receiptUrl, '_blank')}
                                  sx={{ mb: 1 }}
                                >
                                  View Receipt
                                </Button>
                                <Button
                                  size="small"
                                  variant="contained"
                                  color="primary"
                                  onClick={() => {
                                    setUpdateStatusDialog({ open: true, studentData });
                                    setNewStatus(studentData.payment.status);
                                  }}
                                  sx={{ mb: 1 }}
                                >
                                  Update Status
                                </Button>
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
          </>
        )}

        {/* Error/Success Messages */}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>
        )}

        {/* Process Payment Dialog */}
        <Dialog open={processDialog.open} onClose={() => setProcessDialog({ open: false, action: '', paymentId: null })}>
          <DialogTitle>
            {processDialog.action} Payment{processDialog.paymentId ? '' : 's'}
          </DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Action Note (Optional)"
              value={actionNote}
              onChange={(e) => setActionNote(e.target.value)}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setProcessDialog({ open: false, action: '', paymentId: null })}>
              Cancel
            </Button>
            <Button
              onClick={() => handleProcessPayment(processDialog.action, processDialog.paymentId)}
              color={processDialog.action === 'Approved' ? 'success' : 'error'}
              variant="contained"
            >
              {processDialog.action}
            </Button>
          </DialogActions>
        </Dialog>

        {/* View Request Dialog */}
        <Dialog
          open={viewRequestDialog.open}
          onClose={() => setViewRequestDialog({ open: false, payment: null })}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Payment Request Details</DialogTitle>
          <DialogContent>
            {viewRequestDialog.payment && (
              <Box sx={{ mt: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Student Name:</Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {getStudentDisplayName(viewRequestDialog.payment.studentId)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Student ID:</Typography>
                    <Typography variant="body1">
                      {viewRequestDialog.payment.studentId?.studentId || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Amount:</Typography>
                    <Typography variant="body1">Rs. {viewRequestDialog.payment.amount}/=</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Attendance:</Typography>
                    <Typography variant="body1">
                      {viewRequestDialog.payment.attendanceData?.presentDays || 0}/{viewRequestDialog.payment.attendanceData?.totalClassDays || 0}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Submitted Date:</Typography>
                    <Typography variant="body1">
                      {new Date(viewRequestDialog.payment.createdAt).toLocaleDateString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Status:</Typography>
                    <Chip
                      label={viewRequestDialog.payment.status}
                      color={getStatusColor(viewRequestDialog.payment.status)}
                      size="small"
                    />
                  </Grid>
                  {viewRequestDialog.payment.additionalNote && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">Additional Note:</Typography>
                      <Typography variant="body1" sx={{
                        bgcolor: 'grey.100',
                        p: 2,
                        borderRadius: 1,
                        mt: 1,
                        fontStyle: 'italic'
                      }}>
                        {viewRequestDialog.payment.additionalNote}
                      </Typography>
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">Receipt:</Typography>
                    <Button
                      variant="outlined"
                      startIcon={<Visibility />}
                      onClick={() => window.open(viewRequestDialog.payment.receiptUrl, '_blank')}
                      sx={{ mt: 1 }}
                    >
                      View Receipt
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewRequestDialog({ open: false, payment: null })}>
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Update Payment Status Dialog */}
        <Dialog
          open={updateStatusDialog.open}
          onClose={() => setUpdateStatusDialog({ open: false, studentData: null })}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Update Payment Status</DialogTitle>
          <DialogContent>
            {updateStatusDialog.studentData && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1" gutterBottom>
                  Student: <strong>
                    {getStudentDisplayName(updateStatusDialog.studentData.student)}
                  </strong>
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Current Status: <Chip
                    label={updateStatusDialog.studentData.payment?.status || 'N/A'}
                    color={getStatusColor(updateStatusDialog.studentData.payment?.status)}
                    size="small"
                  />
                </Typography>

                <FormControl fullWidth sx={{ mt: 3 }}>
                  <InputLabel>New Status</InputLabel>
                  <Select
                    value={newStatus}
                    label="New Status"
                    onChange={(e) => setNewStatus(e.target.value)}
                  >
                    <MenuItem value="Approved">Approved</MenuItem>
                    <MenuItem value="Rejected">Rejected</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Action Note (Optional)"
                  value={actionNote}
                  onChange={(e) => setActionNote(e.target.value)}
                  sx={{ mt: 2 }}
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setUpdateStatusDialog({ open: false, studentData: null })}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdatePaymentStatus}
              color="primary"
              variant="contained"
              disabled={!newStatus}
            >
              Update Status
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default AdminClassPayments;
