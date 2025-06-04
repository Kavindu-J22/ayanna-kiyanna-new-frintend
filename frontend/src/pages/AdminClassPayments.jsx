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
  SelectAll,
  Search,
  PictureAsPdf,
  Assessment,
  TrendingUp,
  People,
  Warning,
  MonetizationOn,
  Badge
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
  // New dialog states
  const [viewRequestDialog, setViewRequestDialog] = useState({ open: false, payment: null });
  const [updateStatusDialog, setUpdateStatusDialog] = useState({ open: false, studentData: null });
  const [newStatus, setNewStatus] = useState('');

  // Payment behavior dialog states
  const [paymentBehaviorDialog, setPaymentBehaviorDialog] = useState({ open: false, student: null });
  const [newPaymentStatus, setNewPaymentStatus] = useState('');

  // Search functionality
  const [searchTerm, setSearchTerm] = useState('');

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

      setSuccess(`Payments & Behavior status updated to ${newStatus} successfully`);
      setUpdateStatusDialog({ open: false, studentData: null });
      setNewStatus('');
      setActionNote('');
      fetchPaymentData();
    } catch (error) {
      console.error('Error updating payment status:', error);
      setError(error.response?.data?.message || 'Error updating payment status');
    }
  };

  // Function to update student payment status
  const handleUpdatePaymentBehavior = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/admin/students/${paymentBehaviorDialog.student._id}/payment-status`,
        {
          paymentStatus: newPaymentStatus,
          adminNote: `Payments & Behavior status updated by admin`
        },
        { headers: { 'x-auth-token': token } }
      );

      setSuccess(`Student payments & behavior status updated successfully`);
      setPaymentBehaviorDialog({ open: false, student: null });
      setNewPaymentStatus('');
      // Fetch fresh data to get the actual stored values
      await fetchPaymentData();
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

  // Calculate summary statistics for selected month
  const calculateMonthlySummary = () => {
    if (!paymentData) return null;

    const approvedPayments = paymentData.paymentRequests?.filter(p =>
      p.status && p.status.toLowerCase() === 'approved'
    ) || [];

    const totalIncome = approvedPayments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
    const paidStudentCount = approvedPayments.length;

    const allStudents = paymentData.allStudentsStatus || [];
    const notRequestedCount = allStudents.filter(s => !s.payment && s.requiresPayment).length;
    const notRequiredCount = allStudents.filter(s => !s.requiresPayment).length;
    const lowAttendanceCount = allStudents.filter(s => s.attendance?.presentDays < 2).length;

    return {
      totalIncome,
      paidStudentCount,
      notRequestedCount,
      notRequiredCount,
      lowAttendanceCount,
      totalStudents: allStudents.length,
      pendingCount: paymentData.paymentRequests?.filter(p => p.status && p.status.toLowerCase() === 'pending').length || 0,
      rejectedCount: paymentData.paymentRequests?.filter(p => p.status && p.status.toLowerCase() === 'rejected').length || 0
    };
  };

  const monthlySummary = calculateMonthlySummary();

  // Enhanced PDF generation function
  const generatePDFReport = () => {
    if (!monthlySummary || !paymentData) return;

    const reportData = {
      classInfo: {
        grade: classData?.grade,
        category: classData?.category,
        monthlyFee: classData?.monthlyFee
      },
      period: {
        month: monthNames[selectedMonth - 1],
        year: selectedYear
      },
      summary: monthlySummary,
      paymentRequests: paymentData.paymentRequests,
      allStudents: paymentData.allStudentsStatus
    };

    // Create detailed HTML content for PDF
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>පන්ති ගෙවීම් වාර්තාව</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .summary { background: #f5f5f5; padding: 15px; margin: 20px 0; border-radius: 5px; }
        .student-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .student-table th, .student-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .student-table th { background-color: #4CAF50; color: white; }
        .status-approved { color: #4CAF50; font-weight: bold; }
        .status-pending { color: #FF9800; font-weight: bold; }
        .status-rejected { color: #F44336; font-weight: bold; }
        .status-not-requested { color: #9E9E9E; font-weight: bold; }
        .low-attendance { background-color: #FFF3E0; }
    </style>
</head>
<body>
    <div class="header">
        <h1>පන්ති ගෙවීම් වාර්තාව</h1>
        <h2>${reportData.classInfo.grade} - ${reportData.classInfo.category}</h2>
        <h3>${reportData.period.month} ${reportData.period.year}</h3>
        <p>මාසික ගාස්තුව: Rs. ${reportData.classInfo.monthlyFee}/=</p>
    </div>

    <div class="summary">
        <h3>සාරාංශය</h3>
        <table style="width: 100%;">
            <tr><td><strong>මුළු ආදායම:</strong></td><td>Rs. ${monthlySummary.totalIncome.toLocaleString()}/=</td></tr>
            <tr><td><strong>ගෙවීම් සිදු කළ සිසුන්:</strong></td><td>${monthlySummary.paidStudentCount}</td></tr>
            <tr><td><strong>ගෙවීම් ඉල්ලීම් නොකළ සිසුන්:</strong></td><td>${monthlySummary.notRequestedCount}</td></tr>
            <tr><td><strong>ගෙවීම් අවශ්‍ය නොවන සිසුන්:</strong></td><td>${monthlySummary.notRequiredCount}</td></tr>
            <tr><td><strong>අඩු පැමිණීමක් ඇති සිසුන්:</strong></td><td>${monthlySummary.lowAttendanceCount}</td></tr>
            <tr><td><strong>මුළු සිසුන්:</strong></td><td>${monthlySummary.totalStudents}</td></tr>
            <tr><td><strong>බලාපොරොත්තුවෙන්:</strong></td><td>${monthlySummary.pendingCount}</td></tr>
            <tr><td><strong>ප්‍රතික්ෂේප කළ:</strong></td><td>${monthlySummary.rejectedCount}</td></tr>
        </table>
    </div>

    <h3>සිසුන්ගේ විස්තර</h3>
    <table class="student-table">
        <thead>
            <tr>
                <th>සිසුවාගේ නම</th>
                <th>Student ID</th>
                <th>පැමිණීම</th>
                <th>ගෙවීම් තත්ත්වය</th>
                <th>ගෙවීම් ප්‍රමාණය</th>
                <th>සටහන්</th>
            </tr>
        </thead>
        <tbody>
            ${reportData.allStudents.map(student => {
              const isLowAttendance = student.attendance?.presentDays < 2;
              const paymentStatus = student.payment ?
                (student.payment.status.toLowerCase() === 'approved' ? 'අනුමත' :
                 student.payment.status.toLowerCase() === 'pending' ? 'බලාපොරොත්තුවෙන්' :
                 student.payment.status.toLowerCase() === 'rejected' ? 'ප්‍රතික්ෂේප' : 'නොදන්නා') :
                (student.requiresPayment ? 'ගෙවීම් ඉල්ලීම නොකළ' : 'ගෙවීම අවශ්‍ය නැත');

              const statusClass = student.payment ?
                `status-${student.payment.status.toLowerCase()}` : 'status-not-requested';

              return `
                <tr ${isLowAttendance ? 'class="low-attendance"' : ''}>
                    <td>${getStudentDisplayName(student.student)}</td>
                    <td>${student.student?.studentId || 'N/A'}</td>
                    <td>${student.attendance?.presentDays || 0}/${student.attendance?.totalClassDays || 0}${isLowAttendance ? ' (අඩු)' : ''}</td>
                    <td class="${statusClass}">${paymentStatus}</td>
                    <td>${student.payment ? `Rs. ${student.payment.amount}/=` : '-'}</td>
                    <td>${student.payment?.additionalNote || '-'}</td>
                </tr>
              `;
            }).join('')}
        </tbody>
    </table>

    <div style="margin-top: 30px; text-align: center; color: #666;">
        <p>වාර්තාව ජනනය කළ දිනය: ${new Date().toLocaleDateString('si-LK')}</p>
        <p>වාර්තාව ජනනය කළ වේලාව: ${new Date().toLocaleTimeString('si-LK')}</p>
    </div>
</body>
</html>
    `;

    // Create and download HTML file (can be opened as PDF)
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `payment-report-${reportData.classInfo.grade}-${reportData.period.month}-${reportData.period.year}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Show success message
    alert('වාර්තාව සාර්ථකව බාගන්නා ලදී! HTML ගොනුව ඔබගේ බ්‍රවුසරයේ විවෘත කර Print > Save as PDF භාවිතා කරන්න.');
  };

  // Filter students based on search term
  const filteredStudents = paymentData?.allStudentsStatus?.filter(studentData => {
    if (!searchTerm.trim()) return true;

    const displayName = getStudentDisplayName(studentData.student);
    const studentId = studentData.student?.studentId || '';
    const surname = studentData.student?.surname || '';
    const firstName = studentData.student?.firstName || '';
    const lastName = studentData.student?.lastName || '';

    const searchLower = searchTerm.toLowerCase();
    return displayName.toLowerCase().includes(searchLower) ||
           studentId.toLowerCase().includes(searchLower) ||
           surname.toLowerCase().includes(searchLower) ||
           firstName.toLowerCase().includes(searchLower) ||
           lastName.toLowerCase().includes(searchLower);
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

        {/* Monthly Summary Statistics */}
        {selectedMonth && paymentData && monthlySummary && (
          <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{
                fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
              }}>
                {monthNames[selectedMonth - 1]} {selectedYear} - සාරාංශය
              </Typography>
              <Button
                variant="contained"
                startIcon={<PictureAsPdf />}
                onClick={generatePDFReport}
                sx={{
                  fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                }}
              >
                වාර්තාව බාගන්න
              </Button>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ background: 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)', color: 'white' }}>
                  <CardContent sx={{ textAlign: 'center', py: 2 }}>
                    <MonetizationOn sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h5" fontWeight="bold">
                      Rs. {monthlySummary.totalIncome.toLocaleString()}
                    </Typography>
                    <Typography variant="body2">මුළු ආදායම</Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)', color: 'white' }}>
                  <CardContent sx={{ textAlign: 'center', py: 2 }}>
                    <CheckCircle sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h5" fontWeight="bold">
                      {monthlySummary.paidStudentCount}
                    </Typography>
                    <Typography variant="body2">ගෙවීම් සිදු කළ සිසුන්</Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)', color: 'white' }}>
                  <CardContent sx={{ textAlign: 'center', py: 2 }}>
                    <Warning sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h5" fontWeight="bold">
                      {monthlySummary.notRequestedCount}
                    </Typography>
                    <Typography variant="body2">ගෙවීම් ඉල්ලීම් නොකළ</Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ background: 'linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)', color: 'white' }}>
                  <CardContent sx={{ textAlign: 'center', py: 2 }}>
                    <People sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h5" fontWeight="bold">
                      {monthlySummary.totalStudents}
                    </Typography>
                    <Typography variant="body2">මුළු සිසුන්</Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ background: 'linear-gradient(135deg, #607d8b 0%, #455a64 100%)', color: 'white' }}>
                  <CardContent sx={{ textAlign: 'center', py: 2 }}>
                    <TrendingUp sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h5" fontWeight="bold">
                      {monthlySummary.notRequiredCount}
                    </Typography>
                    <Typography variant="body2">ගෙවීම් අවශ්‍ය නොවන</Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ background: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)', color: 'white' }}>
                  <CardContent sx={{ textAlign: 'center', py: 2 }}>
                    <Assessment sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h5" fontWeight="bold">
                      {monthlySummary.lowAttendanceCount}
                    </Typography>
                    <Typography variant="body2">අඩු පැමිණීම</Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ background: 'linear-gradient(135deg, #ff5722 0%, #e64a19 100%)', color: 'white' }}>
                  <CardContent sx={{ textAlign: 'center', py: 2 }}>
                    <Payment sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h5" fontWeight="bold">
                      {monthlySummary.pendingCount}
                    </Typography>
                    <Typography variant="body2">බලාපොරොත්තුවෙන්</Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ background: 'linear-gradient(135deg, #795548 0%, #5d4037 100%)', color: 'white' }}>
                  <CardContent sx={{ textAlign: 'center', py: 2 }}>
                    <Cancel sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h5" fontWeight="bold">
                      {monthlySummary.rejectedCount}
                    </Typography>
                    <Typography variant="body2">ප්‍රතික්ෂේප කළ</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        )}

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

                <TextField
                  size="small"
                  placeholder="නම හෝ Student ID අනුව සොයන්න..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                  sx={{ minWidth: 300 }}
                />
              </Box>

              {paymentData.paymentRequests.length > 0 && (
                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
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
                      {paymentData.paymentRequests.filter(payment => {
                        if (!searchTerm.trim()) return true;
                        const displayName = getStudentDisplayName(payment.studentId);
                        const studentId = payment.studentId?.studentId || '';
                        const searchLower = searchTerm.toLowerCase();
                        return displayName.toLowerCase().includes(searchLower) ||
                               studentId.toLowerCase().includes(searchLower);
                      }).map((payment) => (
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
                              {/* View Receipt/Attachments Button */}
                              {payment.attachments?.length > 0 ? (
                                <Box sx={{ mb: 1 }}>
                                  {payment.attachments.map((attachment, index) => (
                                    <Button
                                      key={index}
                                      size="small"
                                      variant="outlined"
                                      startIcon={<Visibility />}
                                      onClick={() => window.open(attachment.url, '_blank')}
                                      sx={{ mr: 1, mb: 0.5 }}
                                    >
                                      {attachment.type === 'pdf' ? 'PDF' : 'Image'} {index + 1}
                                    </Button>
                                  ))}
                                </Box>
                              ) : (
                                <Button
                                  size="small"
                                  variant="outlined"
                                  startIcon={<Visibility />}
                                  onClick={() => window.open(payment.receiptUrl, '_blank')}
                                  sx={{ mb: 1 }}
                                >
                                  View Receipt
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
                <Alert severity="info">No pending payment requests for this month.</Alert>
              )}
            </Paper>

            {/* All Students Status */}
            <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
              {/* Smart Note about Payment Status */}
              <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
                <Typography variant="body2" sx={{
                  fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                  fontWeight: 'bold',
                  mb: 1
                }}>
                  ගෙවීම් තත්ත්වය කළමනාකරණය:
                </Typography>
                <Typography variant="body2" sx={{
                  fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                }}>
                  <strong>Actions තීරුවේ ඇති ගෙවීම් තත්ත්වය සහ හැසිරීම පිළිබද දක්වන සටහන</strong> බොත්තමෙන් ඔබට සිසුවාගේ ගෙවීම් තත්ත්වය පිලිබද සටහනක් තබාගත හැක. මෙය ස්වයංක්‍රීයව සිදු නොකරන අතර ඔබගේ පහසුවට සහ <strong>අවශ්‍ය වූ විට සිසුවාව දැනුවත් කිරීමට ලබා දී ඇති පහසුකමකි</strong>. ඒ මත ක්ලික් කිරීමෙන් ඔබට එය වෙනස් කල හැක.
                </Typography>
              </Alert>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{
                  fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                }}>
                  සියලුම සිසුන්ගේ ගෙවීම් තත්ත්වය
                </Typography>
                <TextField
                  size="small"
                  placeholder="නම හෝ Student ID අනුව සොයන්න..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                  sx={{ minWidth: 300 }}
                />
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Student</TableCell>
                      <TableCell>Attendance</TableCell>
                      <TableCell>Payment Status</TableCell>
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
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2">
                              {studentData.attendance.presentDays}/{studentData.attendance.totalClassDays}
                            </Typography>
                            {studentData.attendance.presentDays < 2 && (
                              <Chip
                                label="ගෙවීම අනිවාර්ය  නැත"
                                size="small"
                                sx={{
                                  bgcolor: 'info.100',
                                  color: 'info.dark',
                                  fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                                  fontSize: '0.7rem',
                                  height: '20px'
                                }}
                                icon={<Badge sx={{ fontSize: '14px' }} />}
                              />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          {studentData.payment ? (
                            <Chip
                              label={studentData.payment.status}
                              color={getStatusColor(studentData.payment.status)}
                              size="small"
                            />
                          ) : studentData.isFreeClass ? (
                            <Chip label="Not Required (Free)" color="default" size="small" />
                          ) : (
                            <Chip label="Not Requested (Unpaid)" color="warning" size="small" />
                          )}
                        </TableCell>

                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            {/* Payment Status Button */}
                            <Button
                              size="small"
                              variant="outlined"
                              color={
                                studentData.student?.paymentStatus === 'Paid' ? 'success' :
                                studentData.student?.paymentStatus === 'Unpaid' ? 'error' :
                                'primary'
                              }
                              onClick={() => {
                                setPaymentBehaviorDialog({ open: true, student: studentData.student });
                                setNewPaymentStatus(studentData.student?.paymentStatus || 'admissioned');
                              }}
                              sx={{
                                mb: 1,
                                fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                                fontSize: '0.75rem'
                              }}
                            >
                              {(() => {
                                const status = studentData.student?.paymentStatus;
                                if (status === 'Paid') return 'ඉතා හොදයි';
                                if (status === 'Unpaid') return 'සැලකිළිමත් විය යුතුයි';
                                if (status === 'admissioned') return 'හොදයි, ගැටලුවක් නැත';
                                return 'හොදයි, ගැටලුවක් නැත'; // default fallback
                              })()}
                            </Button>

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
                                {/* View Receipt/Attachments */}
                                {studentData.payment.attachments?.length > 0 ? (
                                  <Box sx={{ mb: 1 }}>
                                    {studentData.payment.attachments.map((attachment, index) => (
                                      <Button
                                        key={index}
                                        size="small"
                                        variant="outlined"
                                        startIcon={<Visibility />}
                                        onClick={() => window.open(attachment.url, '_blank')}
                                        sx={{ mr: 1, mb: 0.5 }}
                                      >
                                        {attachment.type === 'pdf' ? 'PDF' : 'Image'} {index + 1}
                                      </Button>
                                    ))}
                                  </Box>
                                ) : (
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    startIcon={<Visibility />}
                                    onClick={() => window.open(studentData.payment.receiptUrl, '_blank')}
                                    sx={{ mb: 1 }}
                                  >
                                    View Receipt
                                  </Button>
                                )}
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
                    <Typography variant="subtitle2" color="text.secondary">Receipt/Attachments:</Typography>
                    <Box sx={{ mt: 1 }}>
                      {viewRequestDialog.payment.attachments?.length > 0 ? (
                        // Display multiple attachments
                        <Grid container spacing={1}>
                          {viewRequestDialog.payment.attachments.map((attachment, index) => (
                            <Grid item key={index}>
                              <Button
                                variant="outlined"
                                size="small"
                                startIcon={<Visibility />}
                                onClick={() => window.open(attachment.url, '_blank')}
                                sx={{ mr: 1, mb: 1 }}
                              >
                                {attachment.type === 'pdf' ? 'PDF' : 'Image'} {index + 1}
                              </Button>
                            </Grid>
                          ))}
                        </Grid>
                      ) : (
                        // Display single receipt (backward compatibility)
                        <Button
                          variant="outlined"
                          startIcon={<Visibility />}
                          onClick={() => window.open(viewRequestDialog.payment.receiptUrl, '_blank')}
                        >
                          View Receipt
                        </Button>
                      )}
                    </Box>
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

        {/* Payment Behavior Dialog */}
        <Dialog
          open={paymentBehaviorDialog.open}
          onClose={() => setPaymentBehaviorDialog({ open: false, student: null })}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{
            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
          }}>
            ගෙවීම් තත්ත්වය සහ හැසිරීම පිළිබද සටහන වෙනස් කරන්න
          </DialogTitle>
          <DialogContent>
            {paymentBehaviorDialog.student && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1" gutterBottom sx={{
                  fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                }}>
                  සිසුවා: <strong>
                    {getStudentDisplayName(paymentBehaviorDialog.student)}
                  </strong>
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom sx={{
                  fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                }}>
                  වර්තමාන තත්ත්වය: <Chip
                  label={
                    paymentBehaviorDialog.student?.paymentStatus === 'Paid' ? 'ඉතා හොදයි' :
                    paymentBehaviorDialog.student?.paymentStatus === 'Unpaid' ? 'සැලකිළිමත් විය යුතුයි' :
                    'හොදයි, ගැටලුවක් නැත'  // Default for 'admissioned' or when undefined
                  }
                  color={
                    paymentBehaviorDialog.student?.paymentStatus === 'Paid' ? 'success' :
                    paymentBehaviorDialog.student?.paymentStatus === 'Unpaid' ? 'error' :
                    'primary'  // Default color for 'admissioned' or when undefined
                  }
                  size="small"
                />
                </Typography>

                <FormControl fullWidth sx={{ mt: 3 }}>
                  <InputLabel sx={{
                    fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                  }}>
                    නව ගෙවීම් තත්ත්වය
                  </InputLabel>
                  <Select
                    value={newPaymentStatus}
                    label="නව ගෙවීම් තත්ත්වය"
                    onChange={(e) => setNewPaymentStatus(e.target.value)}
                    sx={{
                      fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                    }}
                  >
                    <MenuItem value="admissioned">හොදයි, ගැටලුවක් නැත</MenuItem>
                    <MenuItem value="Paid">ඉතා හොදයි</MenuItem>
                    <MenuItem value="Unpaid">සැලකිළිමත් විය යුතුයි</MenuItem>
                  </Select>
                </FormControl>

                <Alert severity="info" sx={{ mt: 2, borderRadius: 2 }}>
                  <Typography variant="body2" sx={{
                    fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                  }}>
                    මෙම සටහන සිසුවාගේ ගෙවීම් තත්ත්වය සහ හැසිරීම පිලිබද ඔබගේ අදහස සදහා පමණි. මෙය ස්වයංක්‍රීයව ගෙවීම් ක්‍රියාවලියට බලපාන්නේ නැත.
                  </Typography>
                </Alert>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setPaymentBehaviorDialog({ open: false, student: null })}
              sx={{
                fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
              }}
            >
              අවලංගු කරන්න
            </Button>
            <Button
              onClick={handleUpdatePaymentBehavior}
              color="primary"
              variant="contained"
              disabled={!newPaymentStatus}
              sx={{
                fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
              }}
            >
              යාවත්කාලීන කරන්න
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default AdminClassPayments;
