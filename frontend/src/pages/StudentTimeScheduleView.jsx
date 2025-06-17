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
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  LinearProgress
} from '@mui/material';
import {
  ArrowBack,
  CalendarToday,
  Assignment,
  CheckCircle,
  RadioButtonUnchecked,
  School,
  EventNote,
  TrendingUp
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';

const StudentTimeScheduleView = () => {
  const { classId } = useParams();
  const navigate = useNavigate();

  // State management
  const [classData, setClassData] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter states
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [currentWeekInfo, setCurrentWeekInfo] = useState(null);

  useEffect(() => {
    fetchClassData();
    fetchCurrentWeekInfo();
    fetchSchedules();
  }, [classId]);

  useEffect(() => {
    fetchSchedules();
  }, [selectedYear, selectedMonth]);

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
    }
  };

  const fetchCurrentWeekInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'https://ayanna-kiyanna-new-backend.onrender.com/api/time-schedules/current-week-info',
        { headers: { 'x-auth-token': token } }
      );
      setCurrentWeekInfo(response.data);
    } catch (error) {
      console.error('Error fetching current week info:', error);
    }
  };

  const fetchSchedules = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/time-schedules/class/${classId}?year=${selectedYear}&month=${selectedMonth}`,
        { headers: { 'x-auth-token': token } }
      );
      setSchedules(response.data);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      setError('Error loading schedules');
    } finally {
      setLoading(false);
    }
  };

  const getMonthName = (monthNumber) => {
    const months = [
      'ජනවාරි', 'පෙබරවාරි', 'මාර්තු', 'අප්‍රේල්', 'මැයි', 'ජූනි',
      'ජූලි', 'අගෝස්තු', 'සැප්තැම්බර්', 'ඔක්තෝබර්', 'නොවැම්බර්', 'දෙසැම්බර්'
    ];
    return months[monthNumber - 1] || monthNumber;
  };

  const getWeekName = (weekNumber) => {
    const weeks = ['පළමු', 'දෙවන', 'තෙවන', 'සිව්වන', 'පස්වන'];
    return weeks[weekNumber - 1] || `${weekNumber} වන`;
  };

  const isCurrentWeek = (schedule) => {
    return currentWeekInfo && 
           schedule.year === currentWeekInfo.year && 
           schedule.month === currentWeekInfo.month && 
           schedule.week === currentWeekInfo.week;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
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
              පාඩම් කාලසටහන්
            </Typography>
          </Box>
          
          {classData && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <School color="primary" />
              <Typography variant="h6" sx={{
                fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
              }}>
                {classData.grade} - {classData.category}
              </Typography>
              <Chip label={classData.type} color="primary" size="small" />
            </Box>
          )}
        </Paper>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Current Week Info */}
        {currentWeekInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Paper elevation={3} sx={{ 
              p: 3, 
              mb: 3, 
              borderRadius: 3,
              background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <EventNote color="primary" />
                <Typography variant="h6" fontWeight="bold" sx={{
                  fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                }}>
                  වර්තමාන සතිය
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Chip 
                  label={`වර්ෂය: ${currentWeekInfo.year}`} 
                  color="primary" 
                  variant="outlined" 
                />
                <Chip 
                  label={`මාසය: ${getMonthName(currentWeekInfo.month)}`} 
                  color="secondary" 
                  variant="outlined" 
                />
                <Chip 
                  label={`සතිය: ${getWeekName(currentWeekInfo.week)}`} 
                  color="success" 
                  variant="outlined" 
                />
              </Box>
            </Paper>
          </motion.div>
        )}

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight="bold" sx={{
              fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
              mb: 2
            }}>
              පෙරහන්
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>වර්ෂය</InputLabel>
                  <Select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    label="වර්ෂය"
                  >
                    {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(year => (
                      <MenuItem key={year} value={year}>{year}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>මාසය</InputLabel>
                  <Select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    label="මාසය"
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                      <MenuItem key={month} value={month}>
                        {getMonthName(month)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>
        </motion.div>

        {/* Schedules Grid */}
        <Grid container spacing={3} justifyContent="center">
          {schedules.map((schedule, index) => (
            <Grid item xs={12} md={6} lg={4} key={schedule._id} sx={{
            display: 'grid',
            alignItems: 'stretch', // This ensures all cards stretch to the same height
            }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card sx={{
                  height: '100%',
                  maxWidth: '350px',
                  minWidth: '350px',
                  display: 'flex', // Add this
                  flexDirection: 'column', // Add this
                  background: isCurrentWeek(schedule) 
                    ? 'linear-gradient(135deg, #e8f5e8 0%, #f0f8ff 100%)'
                    : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                  border: isCurrentWeek(schedule) 
                    ? '2px solid #4caf50' 
                    : '1px solid #e0e0e0',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                  }
                }}>
                  <CardContent sx={{ 
                  p: 3,
                  flex: 1, // Add this
                  display: 'flex', // Add this
                  flexDirection: 'column' // Add this
                }}>
                    {/* Schedule Header */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" fontWeight="bold" sx={{
                        fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                      }}>
                        {getMonthName(schedule.month)} - {getWeekName(schedule.week)} සතිය
                      </Typography>
                      {isCurrentWeek(schedule) && (
                        <Chip 
                          label="වර්තමාන සතිය" 
                          color="success" 
                          size="small"
                          sx={{ fontWeight: 'bold' }}
                        />
                      )}
                    </Box>

                    {/* Year Display */}
                    <Chip 
                      label={`වර්ෂය: ${schedule.year}`} 
                      size="small" 
                      sx={{ mb: 2 }} 
                    />

                    {/* Progress Overview */}
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="subtitle2" fontWeight="bold" sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}>
                          <TrendingUp fontSize="small" />
                          ප්‍රගතිය
                        </Typography>
                        <Typography variant="subtitle2" fontWeight="bold" color="primary">
                          {schedule.completedTasksCount || 0}/{schedule.totalTasksCount || 0}
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={schedule.completionPercentage || 0}
                        sx={{ 
                          height: 8, 
                          borderRadius: 4,
                          backgroundColor: '#e0e0e0',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: schedule.completionPercentage === 100 ? '#4caf50' : '#2196f3'
                          }
                        }}
                      />
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                        {schedule.completionPercentage || 0}% සම්පූර්ණයි
                      </Typography>
                    </Box>

                    {/* Tasks */}
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ 
                      mb: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}>
                      <Assignment fontSize="small" />
                      සතියේ කාර්ය
                    </Typography>
                    
                    {schedule.tasks && schedule.tasks.length > 0 ? (
                      <List dense sx={{ mb: 2 }}>
                        {schedule.tasks.map((task) => (
                          <ListItem key={task._id} sx={{ px: 0, py: 0.5 }}>
                            <ListItemIcon sx={{ minWidth: 32 }}>
                              {task.isDone ? (
                                <CheckCircle color="success" fontSize="small" />
                              ) : (
                                <RadioButtonUnchecked color="action" fontSize="small" />
                              )}
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Typography variant="body2" sx={{
                                  textDecoration: task.isDone ? 'line-through' : 'none',
                                  opacity: task.isDone ? 0.7 : 1,
                                  fontWeight: task.isDone ? 'normal' : 'medium'
                                }}>
                                  {task.title}
                                </Typography>
                              }
                              secondary={task.description && (
                                <Typography variant="caption" sx={{
                                  textDecoration: task.isDone ? 'line-through' : 'none',
                                  opacity: task.isDone ? 0.6 : 0.8
                                }}>
                                  {task.description}
                                </Typography>
                              )}
                            />
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontStyle: 'italic' }}>
                        මෙම සතිය සඳහා කාර්ය නොමැත
                      </Typography>
                    )}

                    {/* Note */}
                    {schedule.note && (
                      <Box sx={{ 
                        mt: 2, 
                        p: 2, 
                        bgcolor: isCurrentWeek(schedule) ? '#f0f8ff' : '#f5f5f5', 
                        borderRadius: 2,
                        border: isCurrentWeek(schedule) ? '1px solid #e3f2fd' : 'none'
                      }}>
                        <Typography variant="body2" sx={{
                          fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                        }}>
                          <strong>සටහන:</strong> {schedule.note}
                        </Typography>
                      </Box>
                    )}

                        {/* Created By Info - This will now always be at the bottom */}
                      <Box sx={{ 
                        mt: 'auto', // This pushes it to the bottom
                        pt: 2, 
                        borderTop: '1px solid #e0e0e0' 
                      }}>
                        <Typography variant="caption" color="text.secondary">
                          සාදන ලද්දේ: {schedule.createdBy?.fullName || 'Admin'}
                        </Typography>
                        <br />
                        <Typography variant="caption" color="text.secondary">
                          දිනය: {new Date(schedule.createdAt).toLocaleDateString('si-LK')}
                        </Typography>
                      </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* No Schedules Message */}
        {schedules.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
              <CalendarToday sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" sx={{
                fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                mb: 1
              }}>
                කාලසටහන් නොමැත
              </Typography>
              <Typography variant="body2" color="text.secondary">
                මෙම මාසය සඳහා කාලසටහන් නොමැත. ගුරුවරයා විසින් කාලසටහන් සාදන තෙක් රැඳී සිටින්න.
              </Typography>
            </Paper>
          </motion.div>
        )}
      </Container>
    </Box>
  );
};

export default StudentTimeScheduleView;
