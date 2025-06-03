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
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [classData, setClassData] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [selectedPayments, setSelectedPayments] = useState([]);
  const [processDialog, setProcessDialog] = useState({ open: false, action: '', paymentId: null });
  const [actionNote, setActionNote] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
                                {payment.studentId.fullName}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {payment.studentId.studentId}
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
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Button
                                size="small"
                                variant="contained"
                                color="success"
                                onClick={() => setProcessDialog({ open: true, action: 'Approved', paymentId: payment._id })}
                              >
                                Approve
                              </Button>
                              <Button
                                size="small"
                                variant="contained"
                                color="error"
                                onClick={() => setProcessDialog({ open: true, action: 'Rejected', paymentId: payment._id })}
                              >
                                Reject
                              </Button>
                              <Button
                                size="small"
                                variant="outlined"
                                startIcon={<Visibility />}
                                onClick={() => window.open(payment.receiptUrl, '_blank')}
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
              <Typography variant="h6" gutterBottom sx={{
                fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
              }}>
                සියලුම සිසුන්ගේ ගෙවීම් තත්ත්වය
              </Typography>

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
                    {paymentData.allStudentsStatus.map((studentData) => (
                      <TableRow key={studentData.student._id}>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" fontWeight="bold">
                              {studentData.student.fullName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {studentData.student.studentId}
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
                          {studentData.payment && (
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<Visibility />}
                              onClick={() => window.open(studentData.payment.receiptUrl, '_blank')}
                            >
                              View Receipt
                            </Button>
                          )}
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
      </Container>
    </Box>
  );
};

export default AdminClassPayments;
