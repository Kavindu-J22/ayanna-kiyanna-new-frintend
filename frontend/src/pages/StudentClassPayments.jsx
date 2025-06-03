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
  Chip,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Tooltip
} from '@mui/material';
import {
  ArrowBack,
  Payment,
  CalendarToday,
  CheckCircle,
  Warning,
  Schedule,
  MonetizationOn
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';

const StudentClassPayments = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState('');

  const monthNames = [
    'ජනවාරි', 'පෙබරවාරි', 'මාර්තු', 'අප්‍රේල්', 'මැයි', 'ජූනි',
    'ජූලි', 'අගෝස්තු', 'සැප්තැම්බර්', 'ඔක්තෝබර්', 'නොවැම්බර්', 'දෙසැම්බර්'
  ];

  useEffect(() => {
    fetchPaymentData();
  }, [classId, selectedYear]);

  const fetchPaymentData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/payments/student/${classId}/${selectedYear}`,
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

  const getMonthStatus = (monthData) => {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    
    if (monthData.year < currentYear || (monthData.year === currentYear && monthData.month < currentMonth)) {
      return 'past';
    } else if (monthData.year === currentYear && monthData.month === currentMonth) {
      return 'current';
    } else {
      return 'future';
    }
  };

  const getMonthStatusLabel = (status) => {
    switch (status) {
      case 'past': return 'අතීත මාසය';
      case 'current': return 'වර්තමාන මාසය';
      case 'future': return 'අනාගත මාසය';
      default: return '';
    }
  };

  const getPaymentButtonText = (monthData) => {
    if (monthData.isFreeClass) {
      return 'නොමිලේ';
    }
    
    if (monthData.payment) {
      switch (monthData.payment.status) {
        case 'Pending': return 'අනුමැතිය සඳහා බලාපොරොත්තුවෙන්';
        case 'Approved': return 'අනුමත කර ගෙවා ඇත';
        case 'Rejected': return 'ප්‍රතික්ෂේප කර ඇත';
        default: return 'ගෙවන්න';
      }
    }
    
    if (!monthData.requiresPayment) {
      return 'ගෙවීම අවශ්‍ය නැත';
    }
    
    if (monthData.isOverdue) {
      return 'ගෙවීම ප්‍රමාද වී ඇත';
    }
    
    return 'ගෙවන්න';
  };

  const getPaymentButtonColor = (monthData) => {
    if (monthData.isFreeClass) return 'success';
    if (monthData.payment?.status === 'Approved') return 'success';
    if (monthData.payment?.status === 'Rejected') return 'error';
    if (monthData.payment?.status === 'Pending') return 'warning';
    if (monthData.isOverdue) return 'error';
    if (!monthData.requiresPayment) return 'default';
    return 'primary';
  };

  const handlePaymentClick = (monthData) => {
    const status = getMonthStatus(monthData);
    
    if (status === 'future') {
      return; // No action for future months
    }
    
    if (monthData.isFreeClass) {
      return; // No action for free classes
    }
    
    if (monthData.payment && monthData.payment.status === 'Pending') {
      // Navigate to update payment page
      navigate(`/class-payment/${classId}/${monthData.year}/${monthData.month}?update=${monthData.payment._id}`);
    } else if (monthData.requiresPayment && !monthData.payment) {
      // Navigate to new payment page
      navigate(`/class-payment/${classId}/${monthData.year}/${monthData.month}`);
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
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
              මගේ පන්ති ගෙවීම්
            </Typography>
          </Box>
          
          {paymentData && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" sx={{
                fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
              }}>
                {paymentData.classData.grade} - {paymentData.classData.category}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                මාසික ගාස්තුව: Rs. {paymentData.classData.monthlyFee}/=
              </Typography>
            </Box>
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

        {/* Monthly Payment Cards */}
        {paymentData && (
          <Grid container spacing={3}>
            {paymentData.monthlyStatus.map((monthData, index) => {
              const status = getMonthStatus(monthData);
              const buttonText = getPaymentButtonText(monthData);
              const buttonColor = getPaymentButtonColor(monthData);
              
              return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card sx={{
                      height: '100%',
                      border: status === 'current' ? '3px solid #4caf50' : '1px solid #e0e0e0',
                      borderRadius: 3,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: 6
                      }
                    }}>
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Typography variant="h6" fontWeight="bold" sx={{
                            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                          }}>
                            {monthNames[monthData.month - 1]}
                          </Typography>
                          <Chip 
                            label={getMonthStatusLabel(status)}
                            size="small"
                            color={status === 'current' ? 'success' : status === 'past' ? 'default' : 'info'}
                          />
                        </Box>

                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <MonetizationOn fontSize="small" />
                            පන්ති ගාස්තුව: Rs. {monthData.monthlyFee}/=
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Schedule fontSize="small" />
                            සහභාගී දින: {monthData.attendance.presentDays}/{monthData.attendance.totalClassDays}
                          </Typography>
                        </Box>

                        {status !== 'future' ? (
                          <Button
                            fullWidth
                            variant="contained"
                            color={buttonColor}
                            onClick={() => handlePaymentClick(monthData)}
                            disabled={monthData.isFreeClass || (monthData.payment?.status === 'Approved')}
                            sx={{
                              fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                              fontWeight: 'bold'
                            }}
                          >
                            {buttonText}
                          </Button>
                        ) : (
                          <Button
                            fullWidth
                            variant="outlined"
                            disabled
                            sx={{
                              fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                              fontWeight: 'bold'
                            }}
                          >
                            ඉදිරියේදී
                          </Button>
                        )}

                        {!monthData.requiresPayment && !monthData.isFreeClass && (
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                            මෙම මාසයේ පන්ති ගාස්තු ගෙවීම අනිවාර්ය නොවේ, ඔබ දින 4කට වඩා පන්තියට සහභාගී වී නැත.
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default StudentClassPayments;
