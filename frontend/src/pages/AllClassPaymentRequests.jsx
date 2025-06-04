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
  Delete,
  School,
  Person,
  CalendarToday,
  AttachMoney,
  TrendingUp,
  PendingActions,
  Info,
  Assessment,
  BarChart,
  PieChart
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
  const [deleteDialog, setDeleteDialog] = useState({ open: false, payment: null });
  const [actionNote, setActionNote] = useState('');

  // Available classes for filter
  const [classes, setClasses] = useState([]);

  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    totalIncome: 0,
    selectedMonthIncome: 0
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
    calculateStats(paymentRequests);
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
        'https://ayanna-kiyanna-new-backend.onrender.com/api/classes?limit=100',
        { headers: { 'x-auth-token': token } }
      );
      // The API returns classes in response.data.classes
      setClasses(response.data.classes || []);
    } catch (error) {
      console.error('Error fetching classes:', error);
      setClasses([]); // Set empty array on error
    }
  };

  const calculateStats = (requests) => {
    const approvedRequests = requests.filter(r => r.status.toLowerCase() === 'approved');
    const totalIncome = approvedRequests.reduce((sum, request) => sum + (request.amount || 0), 0);

    // Calculate selected month income using payment month/year fields
    let selectedMonthIncome = 0;
    if (monthFilter && yearFilter) {
      const selectedMonthApproved = approvedRequests.filter(request => {
        return request.month === parseInt(monthFilter) &&
               request.year === parseInt(yearFilter);
      });
      selectedMonthIncome = selectedMonthApproved.reduce((sum, request) => sum + (request.amount || 0), 0);
    }

    const stats = {
      total: requests.length,
      pending: requests.filter(r => r.status.toLowerCase() === 'pending').length,
      approved: approvedRequests.length,
      rejected: requests.filter(r => r.status.toLowerCase() === 'rejected').length,
      totalIncome,
      selectedMonthIncome
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
      filtered = filtered.filter(request => request.status.toLowerCase() === statusFilter);
    }

    // Class filter
    if (classFilter) {
      filtered = filtered.filter(request => request.class?._id === classFilter);
    }

    // Month filter - use payment month field instead of createdAt
    if (monthFilter) {
      filtered = filtered.filter(request => request.month === parseInt(monthFilter));
    }

    // Year filter - use payment year field instead of createdAt
    if (yearFilter) {
      filtered = filtered.filter(request => request.year === parseInt(yearFilter));
    }

    setFilteredRequests(filtered);
  };

  const handleUpdateStatus = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!actionDialog.payment?._id) {
        setError('ගෙවීම් ඉල්ලීම හඳුනාගත නොහැක');
        return;
      }

      if (!actionDialog.action) {
        setError('කරුණාකර ක්‍රියාමාර්ගයක් තෝරන්න');
        return;
      }

      const response = await axios.put(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/admin/payment-requests/${actionDialog.payment._id}/status`,
        {
          status: actionDialog.action,
          adminNote: actionNote || `Payment ${actionDialog.action} by admin`
        },
        { headers: { 'x-auth-token': token } }
      );

      if (response.data) {
        setSuccess(`ගෙවීම් ඉල්ලීම ${actionDialog.action === 'approved' ? 'අනුමත' : 'ප්‍රතික්ෂේප'} කරන ලදී`);
        setActionDialog({ open: false, payment: null, action: '' });
        setActionNote('');
        fetchPaymentRequests();
      }
    } catch (error) {
      console.error('Error updating payment status:', error);

      let errorMessage = 'ගෙවීම් තත්ත්වය යාවත්කාලීන කිරීමේදී දෝෂයක් ඇති විය';

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 404) {
        errorMessage = 'ගෙවීම් ඉල්ලීම හමු නොවිණි';
      } else if (error.response?.status === 401) {
        errorMessage = 'ඔබට මෙම ක්‍රියාමාර්ගය සිදු කිරීමට අවසර නැත';
      } else if (error.response?.status === 400) {
        errorMessage = 'වලංගු නොවන දත්ත ලබා දී ඇත';
      }

      setError(errorMessage);
    }
  };

  const handleDeletePayment = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/admin/payment-requests/${deleteDialog.payment._id}`,
        { headers: { 'x-auth-token': token } }
      );

      setSuccess('ගෙවීම් ඉල්ලීම සාර්ථකව ඉවත් කරන ලදී');
      setDeleteDialog({ open: false, payment: null });
      fetchPaymentRequests();
    } catch (error) {
      console.error('Error deleting payment request:', error);
      setError('ගෙවීම් ඉල්ලීම ඉවත් කිරීමේදී දෝෂයක් ඇති විය');
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'approved': return 'success';
      case 'rejected': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getStatusChipSx = (status) => {
    const baseStyle = {
      fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
      fontWeight: 'bold',
      minWidth: '100px'
    };

    switch (status.toLowerCase()) {
      case 'approved':
        return {
          ...baseStyle,
          backgroundColor: '#4caf50',
          color: 'white',
          '&:hover': { backgroundColor: '#388e3c' }
        };
      case 'rejected':
        return {
          ...baseStyle,
          backgroundColor: '#f44336',
          color: 'white',
          '&:hover': { backgroundColor: '#d32f2f' }
        };
      case 'pending':
        return {
          ...baseStyle,
          backgroundColor: '#ff9800',
          color: 'white',
          '&:hover': { backgroundColor: '#f57c00' }
        };
      default:
        return baseStyle;
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
              සියලුම පන්ති ගෙවීම්
            </Typography>
          </Box>

          {/* Statistics Cards */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={2.4}>
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
            <Grid item xs={12} sm={6} md={2.4}>
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
            <Grid item xs={12} sm={6} md={2.4}>
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
            <Grid item xs={12} sm={6} md={2.4}>
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
            <Grid item xs={12} sm={6} md={2.4}>
              <motion.div whileHover={{ scale: 1.02 }}>
                <Card sx={{ background: 'linear-gradient(135deg, #9c27b0 0%, #673ab7 100%)', color: 'white' }}>
                  <CardContent sx={{ textAlign: 'center', py: 2 }}>
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mx: 'auto', mb: 1 }}>
                      <TrendingUp />
                    </Avatar>
                    <Typography variant="h5" fontWeight="bold">Rs. {stats.totalIncome.toLocaleString()}</Typography>
                    <Typography variant="body2">මුළු ආදායම</Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>

          {/* Selected Month Income Card */}
          {monthFilter && yearFilter && (
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} md={6}>
                <motion.div whileHover={{ scale: 1.02 }}>
                  <Card sx={{ background: 'linear-gradient(135deg, #ff5722 0%, #e64a19 100%)', color: 'white' }}>
                    <CardContent sx={{ textAlign: 'center', py: 3 }}>
                      <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mx: 'auto', mb: 2, width: 56, height: 56 }}>
                        <Assessment />
                      </Avatar>
                      <Typography variant="h4" fontWeight="bold">Rs. {stats.selectedMonthIncome.toLocaleString()}</Typography>
                      <Typography variant="h6">
                        {monthNames[monthFilter - 1]} {yearFilter} ආදායම
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
              <Grid item xs={12} md={6}>
                <motion.div whileHover={{ scale: 1.02 }}>
                  <Card sx={{ background: 'linear-gradient(135deg, #607d8b 0%, #455a64 100%)', color: 'white' }}>
                    <CardContent sx={{ textAlign: 'center', py: 3 }}>
                      <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mx: 'auto', mb: 2, width: 56, height: 56 }}>
                        <BarChart />
                      </Avatar>
                      <Typography variant="h4" fontWeight="bold">
                        {((stats.selectedMonthIncome / stats.totalIncome) * 100 || 0).toFixed(1)}%
                      </Typography>
                      <Typography variant="h6">
                        මුළු ආදායමෙන් ප්‍රතිශතය
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            </Grid>
          )}
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
              <FormControl fullWidth size="small" sx={{ minWidth: 200 }}>
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
              <FormControl fullWidth size="small" sx={{ minWidth: 200 }}>
                <InputLabel>පන්තිය</InputLabel>
                <Select
                  value={classFilter}
                  onChange={(e) => setClassFilter(e.target.value)}
                  label="පන්තිය"
                >
                  <MenuItem value="">සියලුම පන්ති</MenuItem>
                  {classes && classes.length > 0 ? classes.map((cls) => (
                    <MenuItem key={cls._id} value={cls._id}>
                      {cls.grade} - {cls.category}
                    </MenuItem>
                  )) : (
                    <MenuItem disabled>පන්ති පූරණය වෙමින්...</MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>

            {/* Month Filter */}
            <Grid item xs={12} md={2}>
              <FormControl fullWidth size="small" sx={{ minWidth: 200 }}>
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
              <FormControl fullWidth size="small" sx={{ minWidth: 200 }}>
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

          {/* Smart Note */}
          <Box sx={{ mt: 3, p: 2, bgcolor: 'info.50', borderRadius: 2, border: '1px solid', borderColor: 'info.200' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <Info sx={{ color: 'info.main', mt: 0.5 }} />
              <Typography variant="body2" sx={{
                fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                color: 'info.dark',
                lineHeight: 1.6
              }}>
                <strong>වැදගත් සටහන:</strong> අනුමත කරනලද හෝ ප්‍රතික්ශේප කරන ලද ගෙවීම් ඉල්ලීම් වල <strong>තත්වය නැවත වෙනස් කිරීමට අවශ්‍යනම්</strong> අදාල පන්තිය වෙත ඇතුල් වී <strong>(පන්ති කලමණාකරනය ඔස්සේ)</strong> එහි පන්ති ගාස්තු ගෙවීම් වල අදාල ඉල්ලීම පරීක්ශා කර බලා ඔබට එය වෙනස් කර හැක. මෙම පිටුව තුල එයට ඔබට අවස්තාව ලබා දී නැත්තේ ගෙවීම් දත්ත වල ආරක්ශාව සහ නිරවද්‍යතාවය පවත්වා ගැනීම වෙනුවෙන් බව කරුනාවෙන් සලකන්න. එම පිටුව තුලදී ඔබට පන්තියේ ගෙවීම් පිලිබදව වැඩිදුරටත් අධ්‍යනය කල හැකි අතර වාර්තාද ලබා ගත හැක.
              </Typography>
            </Box>
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
                  filteredRequests.map((request) => (
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
                          <Typography variant="body2" fontWeight="medium" color="success.main">
                            Rs. {request.amount || 'N/A'} /=
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusText(request.status)}
                          size="small"
                          sx={getStatusChipSx(request.status)}
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
                          {request.status.toLowerCase() === 'pending' && (
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
                          <Tooltip title="ඉවත් කරන්න">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => setDeleteDialog({ open: true, payment: request })}
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="පන්තියේ පිටුවට">
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => window.open(`/admin-class-payments/${request.class?._id}`, '_blank')}
                              sx={{
                                fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                                fontSize: '0.75rem',
                                minWidth: 'auto',
                                px: 1,
                                py: 0.5,
                                ml: 1
                              }}
                            >
                              පන්තියේ පිටුවට
                            </Button>
                          </Tooltip>
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

                  {/* Display attachments or single receipt */}
                  {(viewDialog.payment.attachments?.length > 0 || viewDialog.payment.receiptUrl) && (
                    <>
                      <Typography variant="subtitle2" color="text.secondary">ගෙවීම් රිසිට්පත/සාක්ශි:</Typography>
                      <Box sx={{ mt: 1, mb: 2 }}>
                        {viewDialog.payment.attachments?.length > 0 ? (
                          // Display multiple attachments
                          <Grid container spacing={1}>
                            {viewDialog.payment.attachments.map((attachment, index) => (
                              <Grid item key={index}>
                                <Button
                                  variant="outlined"
                                  size="small"
                                  onClick={() => window.open(attachment.url, '_blank')}
                                  sx={{ mr: 1, mb: 1 }}
                                >
                                  {attachment.type === 'pdf' ? 'PDF' : 'රූපය'} {index + 1}
                                </Button>
                              </Grid>
                            ))}
                          </Grid>
                        ) : (
                          // Display single receipt (backward compatibility)
                          <Button
                            variant="outlined"
                            onClick={() => window.open(viewDialog.payment.receiptUrl, '_blank')}
                          >
                            රිසිට්පත බලන්න
                          </Button>
                        )}
                      </Box>
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

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialog.open}
          onClose={() => setDeleteDialog({ open: false, payment: null })}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{
            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
            color: 'error.main'
          }}>
            ගෙවීම් ඉල්ලීම ඉවත් කරන්න
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" sx={{ mb: 2, fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif' }}>
              ඔබට මෙම ගෙවීම් ඉල්ලීම ස්ථිරවම ඉවත් කිරීමට අවශ්‍යද? මෙම ක්‍රියාමාර්ගය ආපසු හැරවිය නොහැක.
            </Typography>

            {deleteDialog.payment && (
              <Box sx={{ p: 2, bgcolor: 'error.50', borderRadius: 1, border: '1px solid', borderColor: 'error.200' }}>
                <Typography variant="body2">
                  <strong>සිසුවා:</strong> {deleteDialog.payment.student?.fullName}
                </Typography>
                <Typography variant="body2">
                  <strong>පන්තිය:</strong> {deleteDialog.payment.class?.grade} - {deleteDialog.payment.class?.category}
                </Typography>
                <Typography variant="body2">
                  <strong>මාසය:</strong> {monthNames[deleteDialog.payment.month - 1]} {deleteDialog.payment.year}
                </Typography>
                <Typography variant="body2">
                  <strong>තත්ත්වය:</strong> {getStatusText(deleteDialog.payment.status)}
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialog({ open: false, payment: null })}>
              අවලංගු කරන්න
            </Button>
            <Button
              onClick={handleDeletePayment}
              variant="contained"
              color="error"
              sx={{
                fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
              }}
            >
              ඉවත් කරන්න
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default AllClassPaymentRequests;
