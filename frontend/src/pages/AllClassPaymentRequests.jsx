import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Avatar,
  Container,
  Alert,
  Tooltip,
  Badge,
  Divider
} from '@mui/material';
import {
  ArrowBack,
  Search,
  FilterList,
  Payment,
  Visibility,
  CheckCircle,
  Cancel,
  School,
  Person,
  CalendarToday,
  AttachMoney,
  TrendingUp,
  PendingActions
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AllClassPaymentRequests = () => {
  const navigate = useNavigate();
  const [paymentRequests, setPaymentRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [monthFilter, setMonthFilter] = useState('');
  const [yearFilter, setYearFilter] = useState(new Date().getFullYear());

  // Dialog states
  const [viewDialog, setViewDialog] = useState({ open: false, payment: null });
  const [actionDialog, setActionDialog] = useState({ open: false, payment: null, action: '' });
  const [actionNote, setActionNote] = useState('');

  // Available classes for filter
  const [classes, setClasses] = useState([]);

  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });

  const monthNames = [
    'ජනවාරි', 'පෙබරවාරි', 'මාර්තු', 'අප්‍රේල්', 'මැයි', 'ජූනි',
    'ජූලි', 'අගෝස්තු', 'සැප්තැම්බර්', 'ඔක්තෝබර්', 'නොවැම්බර්', 'දෙසැම්බර්'
  ];

  useEffect(() => {
    fetchPaymentRequests();
    fetchClasses();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [paymentRequests, searchTerm, statusFilter, classFilter, monthFilter, yearFilter]);

  const fetchPaymentRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'https://ayanna-kiyanna-new-backend.onrender.com/api/admin/all-payment-requests',
        { headers: { 'x-auth-token': token } }
      );
      
      setPaymentRequests(response.data.paymentRequests || []);
      calculateStats(response.data.paymentRequests || []);
    } catch (error) {
      console.error('Error fetching payment requests:', error);
      setError('ගෙවීම් ඉල්ලීම් ලබා ගැනීමේදී දෝෂයක් ඇති විය');
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'https://ayanna-kiyanna-new-backend.onrender.com/api/admin/classes',
        { headers: { 'x-auth-token': token } }
      );
      setClasses(response.data || []);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const calculateStats = (requests) => {
    const stats = {
      total: requests.length,
      pending: requests.filter(r => r.status === 'pending').length,
      approved: requests.filter(r => r.status === 'approved').length,
      rejected: requests.filter(r => r.status === 'rejected').length
    };
    setStats(stats);
  };

  const applyFilters = () => {
    let filtered = [...paymentRequests];

    // Search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(request => 
        request.student?.firstName?.toLowerCase().includes(searchLower) ||
        request.student?.lastName?.toLowerCase().includes(searchLower) ||
        request.student?.fullName?.toLowerCase().includes(searchLower) ||
        request.student?.studentId?.toLowerCase().includes(searchLower) ||
        request.class?.grade?.toLowerCase().includes(searchLower) ||
        request.class?.category?.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (statusFilter) {
      filtered = filtered.filter(request => request.status === statusFilter);
    }

    // Class filter
    if (classFilter) {
      filtered = filtered.filter(request => request.class?._id === classFilter);
    }

    // Month filter
    if (monthFilter) {
      filtered = filtered.filter(request => {
        const requestDate = new Date(request.createdAt);
        return requestDate.getMonth() + 1 === parseInt(monthFilter);
      });
    }

    // Year filter
    if (yearFilter) {
      filtered = filtered.filter(request => {
        const requestDate = new Date(request.createdAt);
        return requestDate.getFullYear() === parseInt(yearFilter);
      });
    }

    setFilteredRequests(filtered);
  };

  const handleUpdateStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/admin/payment-requests/${actionDialog.payment._id}/status`,
        { 
          status: actionDialog.action,
          adminNote: actionNote || `Payment ${actionDialog.action} by admin`
        },
        { headers: { 'x-auth-token': token } }
      );

      setSuccess(`ගෙවීම් ඉල්ලීම ${actionDialog.action === 'approved' ? 'අනුමත' : 'ප්‍රතික්ෂේප'} කරන ලදී`);
      setActionDialog({ open: false, payment: null, action: '' });
      setActionNote('');
      fetchPaymentRequests();
    } catch (error) {
      console.error('Error updating payment status:', error);
      setError('ගෙවීම් තත්ත්වය යාවත්කාලීන කිරීමේදී දෝෂයක් ඇති විය');
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
      case 'approved': return 'අනුමත';
      case 'rejected': return 'ප්‍රතික්ෂේප';
      case 'pending': return 'බලාපොරොත්තුවෙන්';
      default: return status;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('si-LK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear; i >= currentYear - 5; i--) {
      years.push(i);
    }
    return years;
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      py: 3
    }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <IconButton onClick={() => navigate('/admin-dashboard')} sx={{ mr: 2 }}>
              <ArrowBack />
            </IconButton>
            <Typography variant="h4" fontWeight="bold" sx={{
              fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
            }}>
              සියලුම පන්ති ගෙවීම් ඉල්ලීම්
            </Typography>
          </Box>

          {/* Statistics Cards */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <motion.div whileHover={{ scale: 1.02 }}>
                <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                  <CardContent sx={{ textAlign: 'center', py: 2 }}>
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mx: 'auto', mb: 1 }}>
                      <Payment />
                    </Avatar>
                    <Typography variant="h4" fontWeight="bold">{stats.total}</Typography>
                    <Typography variant="body2">මුළු ඉල්ලීම්</Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <motion.div whileHover={{ scale: 1.02 }}>
                <Card sx={{ background: 'linear-gradient(135deg, #ffa726 0%, #ff9800 100%)', color: 'white' }}>
                  <CardContent sx={{ textAlign: 'center', py: 2 }}>
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mx: 'auto', mb: 1 }}>
                      <PendingActions />
                    </Avatar>
                    <Typography variant="h4" fontWeight="bold">{stats.pending}</Typography>
                    <Typography variant="body2">බලාපොරොත්තුවෙන්</Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <motion.div whileHover={{ scale: 1.02 }}>
                <Card sx={{ background: 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)', color: 'white' }}>
                  <CardContent sx={{ textAlign: 'center', py: 2 }}>
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mx: 'auto', mb: 1 }}>
                      <CheckCircle />
                    </Avatar>
                    <Typography variant="h4" fontWeight="bold">{stats.approved}</Typography>
                    <Typography variant="body2">අනුමත</Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <motion.div whileHover={{ scale: 1.02 }}>
                <Card sx={{ background: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)', color: 'white' }}>
                  <CardContent sx={{ textAlign: 'center', py: 2 }}>
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mx: 'auto', mb: 1 }}>
                      <Cancel />
                    </Avatar>
                    <Typography variant="h4" fontWeight="bold">{stats.rejected}</Typography>
                    <Typography variant="body2">ප්‍රතික්ෂේප</Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </Paper>

        {/* Filters Section */}
        <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
          <Typography variant="h6" sx={{
            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <FilterList /> පෙරහන් සහ සෙවීම
          </Typography>

          <Grid container spacing={2}>
            {/* Search Field */}
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                size="small"
                placeholder="නම, Student ID, පන්තිය..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>

            {/* Status Filter */}
            <Grid item xs={12} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>තත්ත්වය</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="තත්ත්වය"
                >
                  <MenuItem value="">සියල්ල</MenuItem>
                  <MenuItem value="pending">බලාපොරොත්තුවෙන්</MenuItem>
                  <MenuItem value="approved">අනුමත</MenuItem>
                  <MenuItem value="rejected">ප්‍රතික්ෂේප</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Class Filter */}
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>පන්තිය</InputLabel>
                <Select
                  value={classFilter}
                  onChange={(e) => setClassFilter(e.target.value)}
                  label="පන්තිය"
                >
                  <MenuItem value="">සියලුම පන්ති</MenuItem>
                  {classes.map((cls) => (
                    <MenuItem key={cls._id} value={cls._id}>
                      {cls.grade} - {cls.category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Month Filter */}
            <Grid item xs={12} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>මාසය</InputLabel>
                <Select
                  value={monthFilter}
                  onChange={(e) => setMonthFilter(e.target.value)}
                  label="මාසය"
                >
                  <MenuItem value="">සියලුම මාස</MenuItem>
                  {monthNames.map((month, index) => (
                    <MenuItem key={index + 1} value={index + 1}>
                      {month}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Year Filter */}
            <Grid item xs={12} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>වර්ෂය</InputLabel>
                <Select
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  label="වර්ෂය"
                >
                  {generateYearOptions().map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Clear Filters Button */}
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('');
                setClassFilter('');
                setMonthFilter('');
                setYearFilter(new Date().getFullYear());
              }}
              sx={{
                fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
              }}
            >
              පෙරහන් ඉවත් කරන්න
            </Button>
          </Box>
        </Paper>

        {/* Success/Error Messages */}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Payment Requests Table */}
        <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
            <Typography variant="h6" sx={{
              fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
            }}>
              ගෙවීම් ඉල්ලීම් ({filteredRequests.length})
            </Typography>
          </Box>

          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif' }}>
                    සිසුවා
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif' }}>
                    පන්තිය
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif' }}>
                    මාසය
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif' }}>
                    ගෙවීම් මුදල
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif' }}>
                    තත්ත්වය
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif' }}>
                    දිනය
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif' }}>
                    ක්‍රියාමාර්ග
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4 }}>
                      <Typography>පූරණය වෙමින්...</Typography>
                    </TableCell>
                  </TableRow>
                ) : filteredRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4 }}>
                      <Typography sx={{ fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif' }}>
                        ගෙවීම් ඉල්ලීම් හමු නොවිණි
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRequests.map((request, index) => (
                    <TableRow key={request._id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                            <Person />
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {request.student?.fullName || `${request.student?.firstName} ${request.student?.lastName}`}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {request.student?.studentId}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <School sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Box>
                            <Typography variant="body2" sx={{
                              fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                            }}>
                              {request.class?.grade}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {request.class?.category}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{
                          fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                        }}>
                          {monthNames[request.month - 1]} {request.year}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AttachMoney sx={{ fontSize: 16, color: 'success.main' }} />
                          <Typography variant="body2" fontWeight="medium" color="success.main">
                            Rs. {request.amount || 'N/A'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusText(request.status)}
                          color={getStatusColor(request.status)}
                          size="small"
                          sx={{
                            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CalendarToday sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="caption">
                            {formatDate(request.createdAt)}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="විස්තර බලන්න">
                            <IconButton
                              size="small"
                              onClick={() => setViewDialog({ open: true, payment: request })}
                            >
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                          {request.status === 'pending' && (
                            <>
                              <Tooltip title="අනුමත කරන්න">
                                <IconButton
                                  size="small"
                                  color="success"
                                  onClick={() => setActionDialog({ open: true, payment: request, action: 'approved' })}
                                >
                                  <CheckCircle />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="ප්‍රතික්ෂේප කරන්න">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => setActionDialog({ open: true, payment: request, action: 'rejected' })}
                                >
                                  <Cancel />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

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
                  <Typography variant="subtitle2" color="text.secondary">සිසුවා:</Typography>
                  <Typography variant="body1" fontWeight="medium" sx={{ mb: 2 }}>
                    {viewDialog.payment.student?.fullName || `${viewDialog.payment.student?.firstName} ${viewDialog.payment.student?.lastName}`}
                  </Typography>

                  <Typography variant="subtitle2" color="text.secondary">Student ID:</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {viewDialog.payment.student?.studentId}
                  </Typography>

                  <Typography variant="subtitle2" color="text.secondary">පන්තිය:</Typography>
                  <Typography variant="body1" sx={{ mb: 2, fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif' }}>
                    {viewDialog.payment.class?.grade} - {viewDialog.payment.class?.category}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">මාසය:</Typography>
                  <Typography variant="body1" sx={{ mb: 2, fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif' }}>
                    {monthNames[viewDialog.payment.month - 1]} {viewDialog.payment.year}
                  </Typography>

                  <Typography variant="subtitle2" color="text.secondary">ගෙවීම් මුදල:</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }} color="success.main" fontWeight="medium">
                    Rs. {viewDialog.payment.amount || 'N/A'}
                  </Typography>

                  <Typography variant="subtitle2" color="text.secondary">තත්ත්වය:</Typography>
                  <Chip
                    label={getStatusText(viewDialog.payment.status)}
                    color={getStatusColor(viewDialog.payment.status)}
                    sx={{ mb: 2, fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif' }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" color="text.secondary">ඉල්ලීම් දිනය:</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {formatDate(viewDialog.payment.createdAt)}
                  </Typography>

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
                        fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                      }}>
                        {viewDialog.payment.note}
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

        {/* Action Confirmation Dialog */}
        <Dialog
          open={actionDialog.open}
          onClose={() => setActionDialog({ open: false, payment: null, action: '' })}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{
            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
          }}>
            {actionDialog.action === 'approved' ? 'ගෙවීම අනුමත කරන්න' : 'ගෙවීම ප්‍රතික්ෂේප කරන්න'}
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" sx={{ mb: 2, fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif' }}>
              ඔබට මෙම ගෙවීම් ඉල්ලීම {actionDialog.action === 'approved' ? 'අනුමත' : 'ප්‍රතික්ෂේප'} කිරීමට අවශ්‍යද?
            </Typography>

            {actionDialog.payment && (
              <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1, mb: 2 }}>
                <Typography variant="body2">
                  <strong>සිසුවා:</strong> {actionDialog.payment.student?.fullName}
                </Typography>
                <Typography variant="body2">
                  <strong>පන්තිය:</strong> {actionDialog.payment.class?.grade} - {actionDialog.payment.class?.category}
                </Typography>
                <Typography variant="body2">
                  <strong>මාසය:</strong> {monthNames[actionDialog.payment.month - 1]} {actionDialog.payment.year}
                </Typography>
              </Box>
            )}

            <TextField
              fullWidth
              multiline
              rows={3}
              label="සටහන (විකල්ප)"
              value={actionNote}
              onChange={(e) => setActionNote(e.target.value)}
              placeholder="මෙම ක්‍රියාමාර්ගය සදහා සටහනක් ඇතුළත් කරන්න..."
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setActionDialog({ open: false, payment: null, action: '' })}>
              අවලංගු කරන්න
            </Button>
            <Button
              onClick={handleUpdateStatus}
              variant="contained"
              color={actionDialog.action === 'approved' ? 'success' : 'error'}
              sx={{
                fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
              }}
            >
              {actionDialog.action === 'approved' ? 'අනුමත කරන්න' : 'ප්‍රතික්ෂේප කරන්න'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default AllClassPaymentRequests;
