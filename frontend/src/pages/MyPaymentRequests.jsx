import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Divider,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  ArrowBack,
  Payment,
  Visibility,
  School,
  CalendarToday,
  AttachMoney,
  CheckCircle,
  Cancel,
  Pending,
  Receipt
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';

const MyPaymentRequests = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paymentRequests, setPaymentRequests] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });

  // Dialog states
  const [viewDialog, setViewDialog] = useState({ open: false, payment: null });

  const monthNames = [
    'ජනවාරි', 'පෙබරවාරි', 'මාර්තු', 'අප්‍රේල්', 'මැයි', 'ජූනි',
    'ජූලි', 'අගෝස්තු', 'සැප්තැම්බර්', 'ඔක්තෝබර්', 'නොවැම්බර්', 'දෙසැම්බර්'
  ];

  useEffect(() => {
    fetchMyPaymentRequests();
  }, []);

  const fetchMyPaymentRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'https://ayanna-kiyanna-new-backend.onrender.com/api/payments/my-requests',
        { headers: { 'x-auth-token': token } }
      );

      const requests = response.data.paymentRequests || [];
      setPaymentRequests(requests);
      
      // Calculate stats
      const stats = {
        total: requests.length,
        pending: requests.filter(r => r.status === 'pending').length,
        approved: requests.filter(r => r.status === 'approved').length,
        rejected: requests.filter(r => r.status === 'rejected').length
      };
      setStats(stats);
    } catch (error) {
      console.error('Error fetching payment requests:', error);
      setError('ගෙවීම් ඉල්ලීම් ලබා ගැනීමේදී දෝෂයක් ඇති විය');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'success';
      case 'rejected': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'approved': return 'අනුමත කර ඇත';
      case 'rejected': return 'ප්‍රතික්ෂේප කර ඇත';
      case 'pending': return 'අනුමැතිය බලාපොරොත්තුවෙන්';
      default: return status;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircle />;
      case 'rejected': return <Cancel />;
      case 'pending': return <Pending />;
      default: return <Payment />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      py: 4
    }}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <Paper elevation={6} sx={{ p: 3, borderRadius: 3, mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton onClick={() => navigate('/student-dashboard')} sx={{ mr: 2 }}>
                  <ArrowBack />
                </IconButton>
                <Box>
                  <Typography variant="h4" sx={{ 
                    fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                    fontWeight: 'bold',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent'
                  }}>
                    මගේ ගෙවීම් ඉල්ලීම්
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    ඔබගේ සියලුම ගෙවීම් ඉල්ලීම් සහ ඒවායේ තත්ත්වය
                  </Typography>
                </Box>
              </Box>
              <Payment sx={{ fontSize: 40, color: 'primary.main' }} />
            </Box>
          </Paper>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white'
              }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Payment sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h4" fontWeight="bold">{stats.total}</Typography>
                  <Typography variant="body2">මුළු ඉල්ලීම්</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ 
                background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
                color: 'white'
              }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Pending sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h4" fontWeight="bold">{stats.pending}</Typography>
                  <Typography variant="body2">අනුමැතිය බලාපොරොත්තුවෙන්</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ 
                background: 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)',
                color: 'white'
              }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <CheckCircle sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h4" fontWeight="bold">{stats.approved}</Typography>
                  <Typography variant="body2">අනුමත කර ඇත</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ 
                background: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
                color: 'white'
              }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Cancel sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h4" fontWeight="bold">{stats.rejected}</Typography>
                  <Typography variant="body2">ප්‍රතික්ෂේප කර ඇත</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Payment Requests Table */}
          <Paper elevation={6} sx={{ borderRadius: 3 }}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ 
                fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                mb: 2,
                display: 'flex',
                alignItems: 'center'
              }}>
                <Receipt sx={{ mr: 1 }} />
                ගෙවීම් ඉල්ලීම් ලැයිස්තුව
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>පන්තිය</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>මාසය</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>මුදල</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>තත්ත්වය</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>ඉල්ලීම් දිනය</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>ක්‍රියාමාර්ග</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paymentRequests.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4 }}>
                          <Typography variant="body1" color="text.secondary">
                            ගෙවීම් ඉල්ලීම් කිසිවක් නොමැත
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      paymentRequests.map((request) => (
                        <TableRow key={request._id} hover>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <School color="primary" />
                              <Box>
                                <Typography variant="body2" fontWeight="medium">
                                  {request.class?.grade}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {request.class?.category}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <CalendarToday color="action" />
                              <Typography variant="body2" sx={{ fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif' }}>
                                {monthNames[request.month - 1]} {request.year}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <AttachMoney color="success" />
                              <Typography variant="body2" fontWeight="medium" color="success.main">
                                Rs. {request.amount || 'N/A'}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              icon={getStatusIcon(request.status)}
                              label={getStatusText(request.status)}
                              color={getStatusColor(request.status)}
                              sx={{ fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif' }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {formatDate(request.createdAt)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Tooltip title="විස්තර බලන්න">
                              <IconButton
                                size="small"
                                onClick={() => setViewDialog({ open: true, payment: request })}
                              >
                                <Visibility />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Paper>
        </motion.div>

        {/* View Payment Details Dialog */}
        <Dialog
          open={viewDialog.open}
          onClose={() => setViewDialog({ open: false, payment: null })}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{
            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}>
            ගෙවීම් ඉල්ලීම් විස්තර
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            {viewDialog.payment && (
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">පන්තිය:</Typography>
                  <Typography variant="body1" fontWeight="medium" sx={{ mb: 2, fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif' }}>
                    {viewDialog.payment.class?.grade} - {viewDialog.payment.class?.category}
                  </Typography>

                  <Typography variant="subtitle2" color="text.secondary">මාසය:</Typography>
                  <Typography variant="body1" sx={{ mb: 2, fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif' }}>
                    {monthNames[viewDialog.payment.month - 1]} {viewDialog.payment.year}
                  </Typography>

                  <Typography variant="subtitle2" color="text.secondary">ගෙවීම් මුදල:</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }} color="success.main" fontWeight="medium">
                    Rs. {viewDialog.payment.amount || 'N/A'}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">තත්ත්වය:</Typography>
                  <Chip
                    icon={getStatusIcon(viewDialog.payment.status)}
                    label={getStatusText(viewDialog.payment.status)}
                    color={getStatusColor(viewDialog.payment.status)}
                    sx={{ mb: 2, fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif' }}
                  />

                  <Typography variant="subtitle2" color="text.secondary" sx={{ display: 'block', mt: 2 }}>ඉල්ලීම් දිනය:</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {formatDate(viewDialog.payment.createdAt)}
                  </Typography>

                  {viewDialog.payment.adminAction?.actionDate && (
                    <>
                      <Typography variant="subtitle2" color="text.secondary">ක්‍රියාමාර්ග දිනය:</Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {formatDate(viewDialog.payment.adminAction.actionDate)}
                      </Typography>
                    </>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />

                  {viewDialog.payment.receiptUrl && (
                    <>
                      <Typography variant="subtitle2" color="text.secondary">ගෙවීම් රිසිට්පත:</Typography>
                      <Button
                        variant="outlined"
                        onClick={() => window.open(viewDialog.payment.receiptUrl, '_blank')}
                        sx={{ mt: 1, mb: 2 }}
                      >
                        රිසිට්පත බලන්න
                      </Button>
                    </>
                  )}

                  {viewDialog.payment.note && (
                    <>
                      <Typography variant="subtitle2" color="text.secondary">සටහන:</Typography>
                      <Typography variant="body2" sx={{
                        p: 2,
                        bgcolor: 'grey.100',
                        borderRadius: 1,
                        fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                        mb: 2
                      }}>
                        {viewDialog.payment.note}
                      </Typography>
                    </>
                  )}

                  {viewDialog.payment.adminAction?.note && (
                    <>
                      <Typography variant="subtitle2" color="text.secondary">පරිපාලක සටහන:</Typography>
                      <Typography variant="body2" sx={{
                        p: 2,
                        bgcolor: viewDialog.payment.status === 'approved' ? 'success.50' : 'error.50',
                        borderRadius: 1,
                        fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                      }}>
                        {viewDialog.payment.adminAction.note}
                      </Typography>
                    </>
                  )}
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewDialog({ open: false, payment: null })}>
              වසන්න
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default MyPaymentRequests;
