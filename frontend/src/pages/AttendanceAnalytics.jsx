import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  useMediaQuery,
  Button
} from '@mui/material';
import {
  ArrowBack,
  BarChart,
  TrendingUp,
  School,
  Assignment
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import axios from 'axios';

const AttendanceAnalytics = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // State management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [analyticsData, setAnalyticsData] = useState({
    monthlyData: [],
    classWiseData: []
  });

  // Fetch analytics data
  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const response = await axios.get(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/attendance/analytics?year=${selectedYear}`,
        { headers: { 'x-auth-token': token } }
      );

      if (response.data.success) {
        setAnalyticsData(response.data.data);
      } else {
        setError('Failed to fetch analytics data');
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError(err.response?.data?.message || 'Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [selectedYear]);

  // Prepare chart data
  const monthNames = [
    'ජනවාරි', 'පෙබරවාරි', 'මාර්තු', 'අප්‍රේල්', 'මැයි', 'ජූනි',
    'ජූලි', 'අගෝස්තු', 'සැප්තැම්බර්', 'ඔක්තෝබර්', 'නොවැම්බර්', 'දෙසැම්බර්'
  ];

  const monthlyChartData = monthNames.map((month, index) => {
    const data = analyticsData.monthlyData.find(item => item._id === index + 1);
    const attendancePercentage = data && data.totalStudents > 0
      ? Math.round((data.totalPresent / data.totalStudents) * 100)
      : 0;

    return {
      month,
      sheets: data?.totalSheets || 0,
      attendance: attendancePercentage
    };
  });



  // Calculate summary statistics
  const totalSheets = analyticsData.monthlyData?.reduce((sum, item) => sum + (item.totalSheets || 0), 0) || 0;
  const totalStudents = analyticsData.monthlyData?.reduce((sum, item) => sum + (item.totalStudents || 0), 0) || 0;
  const totalPresent = analyticsData.monthlyData?.reduce((sum, item) => sum + (item.totalPresent || 0), 0) || 0;
  const averageAttendance = totalStudents > 0 ? Math.round((totalPresent / totalStudents) * 100) : 0;

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
              පැමිණීම් විශ්ලේෂණ
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>වර්ෂය</InputLabel>
              <Select
                value={selectedYear}
                label="වර්ෂය"
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                {Array.from({ length: 5 }, (_, i) => {
                  const year = new Date().getFullYear() - 2 + i;
                  return (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Box>
        </Paper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Summary Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #667eea99 100%)',
                color: 'white'
              }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Assignment sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h4" fontWeight="bold">
                    {totalSheets}
                  </Typography>
                  <Typography variant="body2" sx={{
                    fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                  }}>
                    මුළු පත්‍රිකා
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{
                background: 'linear-gradient(135deg, #4caf50 0%, #4caf5099 100%)',
                color: 'white'
              }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <TrendingUp sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h4" fontWeight="bold">
                    {averageAttendance}%
                  </Typography>
                  <Typography variant="body2" sx={{
                    fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                  }}>
                    සාමාන්‍ය පැමිණීම
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{
                background: 'linear-gradient(135deg, #f093fb 0%, #f093fb99 100%)',
                color: 'white'
              }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <School sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h4" fontWeight="bold">
                    {analyticsData.classWiseData?.length || 0}
                  </Typography>
                  <Typography variant="body2" sx={{
                    fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                  }}>
                    සක්‍රීය පන්ති
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{
                background: 'linear-gradient(135deg, #ff9800 0%, #ff980099 100%)',
                color: 'white'
              }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <BarChart sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h4" fontWeight="bold">
                    {totalPresent}
                  </Typography>
                  <Typography variant="body2" sx={{
                    fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                  }}>
                    මුළු පැමිණීම්
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </motion.div>

        {/* Monthly Attendance Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Paper elevation={6} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight="bold" sx={{
              fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
              mb: 3
            }}>
              මාසික පැමිණීම් ප්‍රවණතා
            </Typography>
            {monthlyChartData.some(data => data.sheets > 0) ? (
              <ResponsiveContainer width="100%" height={400}>
                <RechartsBarChart data={monthlyChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sheets" fill="#667eea" name="පත්‍රිකා සංඛ්‍යාව" />
                  <Bar dataKey="attendance" fill="#4caf50" name="පැමිණීම් ප්‍රතිශතය" />
                </RechartsBarChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="text.secondary">
                  තෝරාගත් වර්ෂය සඳහා මාසික දත්ත නොමැත
                </Typography>
              </Box>
            )}
          </Paper>
        </motion.div>

        {/* Class-wise Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Paper elevation={6} sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight="bold" sx={{
              fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
              mb: 3
            }}>
              පන්ති අනුව පැමිණීම් කාර්ය සාධනය
            </Typography>
            <Grid container spacing={2}>
              {analyticsData.classWiseData?.length > 0 ? (
                analyticsData.classWiseData.map((classData) => (
                  <Grid item xs={12} sm={6} md={4} key={classData._id}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" fontWeight="bold" color="primary">
                          {classData.className || 'Unknown Class'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          පත්‍රිකා: {classData.totalSheets || 0}
                        </Typography>
                        <Typography variant="h4" fontWeight="bold" color={
                          (classData.averageAttendance || 0) >= 80 ? 'success.main' :
                          (classData.averageAttendance || 0) >= 60 ? 'warning.main' : 'error.main'
                        }>
                          {Math.round(classData.averageAttendance || 0)}%
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 2 }}>
                          සාමාන්‍ය පැමිණීම
                        </Typography>

                        <Button
                          variant="outlined"
                          size="small"
                          fullWidth
                          onClick={() => navigate(`/attendance-management/${classData._id}`)}
                          sx={{
                            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                            fontSize: '0.875rem',
                            mt: 'auto'
                          }}
                        >
                          මාසය අනුව අධ්‍යනය කරන්න
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                    තෝරාගත් වර්ෂය සඳහා දත්ත නොමැත
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default AttendanceAnalytics;
