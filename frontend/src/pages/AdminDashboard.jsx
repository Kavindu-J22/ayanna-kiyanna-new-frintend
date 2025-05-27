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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  useTheme,
  useMediaQuery,
  Container,
  Divider
} from '@mui/material';
import {
  Dashboard,
  People,
  School,
  Assignment,
  Settings,
  ExitToApp,
  Notifications,
  TrendingUp,
  PersonAdd,
  Edit,
  Delete,
  Visibility,
  BarChart,
  PieChart,
  Timeline
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
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

  // Sample data for admin dashboard
  const stats = [
    { title: 'මුළු සිසුන්', value: '156', icon: <People />, color: '#667eea' },
    { title: 'සක්‍රීය පන්ති', value: '12', icon: <School />, color: '#f093fb' },
    { title: 'අවසන් වූ පන්ති', value: '8', icon: <Assignment />, color: '#a8edea' },
    { title: 'මාසික ආදායම', value: 'Rs. 45,000', icon: <TrendingUp />, color: '#ffecd2' }
  ];

  const recentStudents = [
    { id: 1, name: 'සුනේත්‍රා පෙරේරා', email: 'sunethra@email.com', course: 'සිංහල භාෂා', status: 'සක්‍රීය', joinDate: '2024-01-15' },
    { id: 2, name: 'රවීන්ද්‍ර ජයසිංහ', email: 'raveendra@email.com', course: 'සාම්ප්‍රදායික නර්තන', status: 'සක්‍රීය', joinDate: '2024-01-20' },
    { id: 3, name: 'නිරූපමා සිල්වා', email: 'nirupama@email.com', course: 'සිංහල සංගීතය', status: 'අක්‍රීය', joinDate: '2024-01-25' },
    { id: 4, name: 'කමල් ප්‍රියන්ත', email: 'kamal@email.com', course: 'සිංහල භාෂා', status: 'සක්‍රීය', joinDate: '2024-02-01' },
    { id: 5, name: 'සරිත් කුමාර', email: 'sarith@email.com', course: 'සාම්ප්‍රදායික නර්තන', status: 'සක්‍රීය', joinDate: '2024-02-05' }
  ];

  const quickActions = [
    { title: 'නව සිසුවා එකතු කරන්න', icon: <PersonAdd />, color: '#667eea' },
    { title: 'පන්ති කාලසටහන', icon: <School />, color: '#f093fb' },
    { title: 'වාර්තා බලන්න', icon: <BarChart />, color: '#a8edea' },
    { title: 'සිස්ටම් සැකසුම්', icon: <Settings />, color: '#ffecd2' }
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
                bgcolor: 'error.main',
                fontSize: '1.5rem'
              }}>
                <Dashboard />
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight="bold" sx={{
                  fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                }}>
                  පරිපාලක උපකරණ පුවරුව
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {userInfo.fullName || 'පරිපාලක'} - {userInfo.email}
                </Typography>
                <Chip 
                  label="පරිපාලක" 
                  color="error" 
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
          {/* Statistics Cards */}
          <Grid item xs={12}>
            <Grid container spacing={2}>
              {stats.map((stat, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <motion.div whileHover={{ scale: 1.02 }}>
                    <Card sx={{ 
                      background: `linear-gradient(135deg, ${stat.color} 0%, ${stat.color}99 100%)`,
                      color: 'white',
                      height: '100%'
                    }}>
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Box sx={{ mb: 1 }}>
                          {React.cloneElement(stat.icon, { sx: { fontSize: 40 } })}
                        </Box>
                        <Typography variant="h4" fontWeight="bold">
                          {stat.value}
                        </Typography>
                        <Typography variant="body2" sx={{
                          fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
                        }}>
                          {stat.title}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Quick Actions */}
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ 
                mb: 3,
                fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
              }}>
                ඉක්මන් ක්‍රියාමාර්ග
              </Typography>
              <Grid container spacing={2}>
                {quickActions.map((action, index) => (
                  <Grid item xs={12} key={index}>
                    <motion.div whileHover={{ scale: 1.02 }}>
                      <Card variant="outlined" sx={{ 
                        p: 2, 
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: 'grey.50'
                        }
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ 
                            bgcolor: action.color,
                            width: 40,
                            height: 40
                          }}>
                            {action.icon}
                          </Avatar>
                          <Typography variant="body1" fontWeight="medium" sx={{
                            fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
                          }}>
                            {action.title}
                          </Typography>
                        </Box>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>

          {/* Recent Students */}
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ 
                mb: 3,
                fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
              }}>
                මෑත සිසුන්
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>නම</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>පන්තිය</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>තත්ත්වය</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>ක්‍රියාමාර්ග</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentStudents.map((student) => (
                      <TableRow key={student.id} hover>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {student.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {student.email}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{
                            fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
                          }}>
                            {student.course}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={student.status}
                            color={student.status === 'සක්‍රීය' ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton size="small" color="primary">
                              <Visibility />
                            </IconButton>
                            <IconButton size="small" color="primary">
                              <Edit />
                            </IconButton>
                            <IconButton size="small" color="error">
                              <Delete />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AdminDashboard;
