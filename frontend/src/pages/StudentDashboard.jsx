import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  Button,
  Paper,
  LinearProgress,
  Chip,
  IconButton,
  useTheme,
  useMediaQuery,
  Container
} from '@mui/material';
import {
  School,
  Assignment,
  Schedule,
  Star,
  BookmarkBorder,
  PlayCircleOutline,
  TrendingUp,
  CalendarToday,
  Notifications,
  Settings,
  ExitToApp,
  MenuBook,
  Quiz,
  VideoLibrary,
  EmojiEvents
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const [userInfo, setUserInfo] = useState({});
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  useEffect(() => {
    // Get user info from localStorage
    const email = localStorage.getItem('userEmail');
    const fullName = localStorage.getItem('fullName');
    setUserInfo({ email, fullName });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('fullName');
    navigate('/');
  };

  // Sample data for student dashboard
  const courses = [
    {
      id: 1,
      title: 'සිංහල භාෂා මූලධර්ම',
      progress: 75,
      totalLessons: 20,
      completedLessons: 15,
      nextLesson: 'අකුරු හඳුනාගැනීම',
      instructor: 'ජගත් කුමාර'
    },
    {
      id: 2,
      title: 'සාම්ප්‍රදායික නර්තන',
      progress: 45,
      totalLessons: 16,
      completedLessons: 7,
      nextLesson: 'මූලික පියවර',
      instructor: 'ජගත් කුමාර'
    },
    {
      id: 3,
      title: 'සිංහල සංගීතය',
      progress: 60,
      totalLessons: 12,
      completedLessons: 7,
      nextLesson: 'තාල ගණන',
      instructor: 'ජගත් කුමාර'
    }
  ];

  const upcomingClasses = [
    {
      title: 'සිංහල භාෂා පන්තිය',
      time: '10:00 AM',
      date: 'අද',
      type: 'Live Class'
    },
    {
      title: 'නර්තන පුහුණුව',
      time: '2:00 PM',
      date: 'හෙට',
      type: 'Practice Session'
    },
    {
      title: 'සංගීත සිද්ධාන්ත',
      time: '4:00 PM',
      date: 'සිකුරාදා',
      type: 'Theory Class'
    }
  ];

  const achievements = [
    { title: 'පළමු පන්තිය සම්පූර්ණ කළා', icon: <Star />, date: '2024-01-15' },
    { title: '10 පන්ති සම්පූර්ණ කළා', icon: <School />, date: '2024-01-20' },
    { title: 'පරීක්ෂණය සමත් වුණා', icon: <EmojiEvents />, date: '2024-01-25' }
  ];

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
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{
                width: 60,
                height: 60,
                bgcolor: 'primary.main',
                fontSize: '1.5rem'
              }}>
                {userInfo.fullName?.charAt(0) || 'S'}
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight="bold" sx={{
                  fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                }}>
                  ආයුබෝවන්, {userInfo.fullName || 'සිසුවා'}!
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {userInfo.email}
                </Typography>
                <Chip
                  label="සිසුවා"
                  color="primary"
                  size="small"
                  sx={{ mt: 0.5 }}
                />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton color="primary">
                <Notifications />
              </IconButton>
              <IconButton color="primary">
                <Settings />
              </IconButton>
              <Button
                variant="outlined"
                startIcon={<ExitToApp />}
                onClick={handleLogout}
                sx={{
                  fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                }}
              >
                ඉවත් වන්න
              </Button>
            </Box>
          </Box>
        </Paper>

        <Grid container spacing={3}>
          {/* Quick Stats */}
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <motion.div whileHover={{ scale: 1.02 }}>
                  <Card sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    height: '100%'
                  }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <School sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="h4" fontWeight="bold">3</Typography>
                      <Typography variant="body2">ලියාපදිංචි පන්ති</Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <motion.div whileHover={{ scale: 1.02 }}>
                  <Card sx={{
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    color: 'white',
                    height: '100%'
                  }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Assignment sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="h4" fontWeight="bold">29</Typography>
                      <Typography variant="body2">සම්පූර්ණ පාඩම්</Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <motion.div whileHover={{ scale: 1.02 }}>
                  <Card sx={{
                    background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                    color: '#333',
                    height: '100%'
                  }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <TrendingUp sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="h4" fontWeight="bold">85%</Typography>
                      <Typography variant="body2">සාමාන්‍ය ප්‍රගතිය</Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <motion.div whileHover={{ scale: 1.02 }}>
                  <Card sx={{
                    background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
                    color: '#333',
                    height: '100%'
                  }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Star sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="h4" fontWeight="bold">12</Typography>
                      <Typography variant="body2">ලබාගත් සම්මාන</Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            </Grid>
          </Grid>

          {/* My Courses */}
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" fontWeight="bold" sx={{
                mb: 3,
                fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
              }}>
                මගේ පන්ති
              </Typography>
              <Grid container spacing={2}>
                {courses.map((course) => (
                  <Grid item xs={12} key={course.id}>
                    <motion.div whileHover={{ scale: 1.01 }}>
                      <Card variant="outlined" sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" fontWeight="bold" sx={{
                              fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                            }}>
                              {course.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              ගුරුතුමා: {course.instructor}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              ඊළඟ පාඩම: {course.nextLesson}
                            </Typography>
                          </Box>
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<PlayCircleOutline />}
                            sx={{
                              fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                            }}
                          >
                            දිගටම කරන්න
                          </Button>
                        </Box>
                        <Box sx={{ mb: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2">ප්‍රගතිය</Typography>
                            <Typography variant="body2">{course.completedLessons}/{course.totalLessons} පාඩම්</Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={course.progress}
                            sx={{ height: 8, borderRadius: 4 }}
                          />
                        </Box>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            {/* Upcoming Classes */}
            <Paper elevation={3} sx={{ p: 3, borderRadius: 3, mb: 3 }}>
              <Typography variant="h6" fontWeight="bold" sx={{
                mb: 2,
                fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
              }}>
                ඉදිරි පන්ති
              </Typography>
              {upcomingClasses.map((cls, index) => (
                <Box key={index} sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 2,
                  mb: 1,
                  bgcolor: 'grey.50',
                  borderRadius: 2
                }}>
                  <CalendarToday sx={{ mr: 2, color: 'primary.main' }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" fontWeight="bold">
                      {cls.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {cls.date} - {cls.time}
                    </Typography>
                    <Chip label={cls.type} size="small" sx={{ ml: 1 }} />
                  </Box>
                </Box>
              ))}
            </Paper>

            {/* Recent Achievements */}
            <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" fontWeight="bold" sx={{
                mb: 2,
                fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
              }}>
                මෑත සාධනයන්
              </Typography>
              {achievements.map((achievement, index) => (
                <Box key={index} sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 2,
                  mb: 1,
                  bgcolor: 'success.50',
                  borderRadius: 2
                }}>
                  <Box sx={{ mr: 2, color: 'success.main' }}>
                    {achievement.icon}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" fontWeight="bold">
                      {achievement.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {achievement.date}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default StudentDashboard;
