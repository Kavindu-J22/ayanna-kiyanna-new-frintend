import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Grid,
  IconButton,
  Chip,
  CircularProgress,
  Paper,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  ArrowBack,
  VideoCall,
  AccessTime,
  CalendarToday,
  Link as LinkIcon,
  Computer,
  PlayArrow,
  Schedule,
  Info,
  CheckCircle,
  Cancel
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const StudentOnlineSessions = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  
  // State management
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [classData, setClassData] = useState(null);

  // Fetch class data and sessions
  useEffect(() => {
    fetchClassData();
    fetchSessions();
  }, [classId]);

  const fetchClassData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`https://ayanna-kiyanna-new-backend.onrender.com/api/classes/${classId}`, {
        headers: { 'x-auth-token': token }
      });
      setClassData(response.data.data);
    } catch (error) {
      console.error('Error fetching class data:', error);
    }
  };

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`https://ayanna-kiyanna-new-backend.onrender.com/api/online-sessions/class/${classId}`, {
        headers: { 'x-auth-token': token }
      });
      setSessions(response.data.data || []);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  const getSessionStatus = (session) => {
    const now = new Date();
    const sessionDate = new Date(session.sessionDate);
    const [startHour, startMinute] = session.startTime.split(':').map(Number);
    const [endHour, endMinute] = session.endTime.split(':').map(Number);
    
    const startDateTime = new Date(sessionDate);
    startDateTime.setHours(startHour, startMinute, 0, 0);
    
    const endDateTime = new Date(sessionDate);
    endDateTime.setHours(endHour, endMinute, 0, 0);
    
    if (now < startDateTime) {
      return { 
        status: 'upcoming', 
        color: 'primary', 
        text: 'ඉදිරියට', 
        canAccess: false,
        message: 'සැසිය තවම ආරම්භ වී නැත'
      };
    } else if (now >= startDateTime && now <= endDateTime) {
      return { 
        status: 'live', 
        color: 'success', 
        text: 'සජීවී', 
        canAccess: true,
        message: 'දැන් සැසියට සම්බන්ධ වන්න'
      };
    } else {
      return { 
        status: 'ended', 
        color: 'default', 
        text: 'අවසන්', 
        canAccess: false,
        message: 'මෙම සැසිය අවසන් වී ඇත ⚠️'
      };
    }
  };

  const handleJoinSession = (meetingLink) => {
    window.open(meetingLink, '_blank');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('si-LK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconButton onClick={() => navigate(`/specific-class/${classId}`)} sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
          <Computer sx={{ fontSize: 32, mr: 2, color: 'primary.main' }} />
          <Typography variant="h4" fontWeight="bold" sx={{
            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
          }}>
            Online Sessions
          </Typography>
        </Box>
        {classData && (
          <Typography variant="h6" color="text.secondary" sx={{
            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
          }}>
            {classData.grade} - {classData.category}
          </Typography>
        )}
      </Box>

      {/* Sessions Grid */}
      <Grid container spacing={3} justifyContent="center">
        <AnimatePresence>
          {sessions.map((session) => {
            const statusInfo = getSessionStatus(session);
            return (
              <Grid item xs={12} md={6} lg={4} key={session._id} sx={{
              display: 'grid',
              alignItems: 'stretch', // This ensures all cards stretch to the same height
              }}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card sx={{
                    height: '100%',
                    maxWidth: '350px',
                    minWidth: '350px',
                    background: statusInfo.status === 'live' 
                      ? 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)'
                      : statusInfo.status === 'ended'
                      ? 'linear-gradient(135deg, #9e9e9e 0%, #616161 100%)'
                      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    position: 'relative',
                    border: statusInfo.status === 'live' ? '3px solid #4caf50' : 'none',
                    boxShadow: statusInfo.status === 'live' ? '0 0 20px rgba(76, 175, 80, 0.5)' : 'none'
                  }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="h6" fontWeight="bold" sx={{
                          fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                        }}>
                          {session.title}
                        </Typography>
                        <Chip
                          label={statusInfo.text}
                          color={statusInfo.color}
                          size="small"
                          sx={{ 
                            color: 'white',
                            fontWeight: 'bold',
                            ...(statusInfo.status === 'live' && {
                              animation: 'pulse 2s infinite'
                            })
                          }}
                        />
                      </Box>
                      
                      {session.description && (
                        <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
                          {session.description}
                        </Typography>
                      )}
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <CalendarToday sx={{ fontSize: 16, mr: 1 }} />
                        <Typography variant="body2">
                          {formatDate(session.sessionDate)}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <AccessTime sx={{ fontSize: 16, mr: 1 }} />
                        <Typography variant="body2">
                          {session.startTime} - {session.endTime}
                        </Typography>
                      </Box>

                      {session.meetingId && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Info sx={{ fontSize: 16, mr: 1 }} />
                          <Typography variant="body2">
                            Meeting ID: {session.meetingId}
                          </Typography>
                        </Box>
                      )}

                      {/* Guidelines */}
                      {session.guidelines && session.guidelines.length > 0 && (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>
                            මාර්ගෝපදේශ:
                          </Typography>
                          <List dense sx={{ py: 0 }}>
                            {session.guidelines.map((guideline, index) => (
                              <ListItem key={index} sx={{ py: 0, px: 0 }}>
                                <ListItemIcon sx={{ minWidth: 20 }}>
                                  <CheckCircle sx={{ fontSize: 12, color: 'white' }} />
                                </ListItemIcon>
                                <ListItemText 
                                  primary={guideline}
                                  primaryTypographyProps={{
                                    variant: 'body2',
                                    sx: { fontSize: '0.8rem' }
                                  }}
                                />
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      )}

                      {/* Additional Note */}
                      {session.additionalNote && (
                        <Alert 
                          severity="info" 
                          sx={{ 
                            mb: 2, 
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            color: 'white',
                            '& .MuiAlert-icon': { color: 'white' }
                          }}
                        >
                          <Typography variant="body2">
                            {session.additionalNote}
                          </Typography>
                        </Alert>
                      )}
                      
                      {/* Action Button */}
                      <Box sx={{ textAlign: 'center' }}>
                        {statusInfo.canAccess ? (
                          <Button
                            variant="contained"
                            size="large"
                            startIcon={<PlayArrow />}
                            onClick={() => handleJoinSession(session.meetingLink)}
                            sx={{
                              backgroundColor: 'rgba(255, 255, 255, 0.9)',
                              color: '#2e7d32',
                              fontWeight: 'bold',
                              fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                              '&:hover': { 
                                backgroundColor: 'white',
                                transform: 'scale(1.05)'
                              },
                              animation: 'pulse 2s infinite'
                            }}
                          >
                            දැන් සම්බන්ධ වන්න
                          </Button>
                        ) : (
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="body2" sx={{ 
                              opacity: 0.8,
                              fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                            }}>
                              {statusInfo.message}
                            </Typography>
                            {statusInfo.status === 'upcoming' && (
                              <Button
                                variant="outlined"
                                size="small"
                                startIcon={<Schedule />}
                                disabled
                                sx={{
                                  mt: 1,
                                  color: 'white',
                                  borderColor: 'rgba(255, 255, 255, 0.5)',
                                  fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                                }}
                              >
                                සැසිය ඉදිරියට
                              </Button>
                            )}
                            {statusInfo.status === 'ended' && (
                              <Button
                                variant="outlined"
                                size="small"
                                startIcon={<Cancel />}
                                disabled
                                sx={{
                                  mt: 1,
                                  color: 'white',
                                  borderColor: 'rgba(255, 255, 255, 0.5)',
                                  fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                                }}
                              >
                                සැසිය අවසන්
                              </Button>
                            )}
                          </Box>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            );
          })}
        </AnimatePresence>
      </Grid>

      {sessions.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center', mt: 4 }}>
          <Computer sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" sx={{
            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
          }}>
            මෙම පන්තිය සඳහා Online Sessions නොමැත
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            ගුරුවරයා විසින් Online Sessions සාදන විට ඔබට දැකගත හැකිය
          </Typography>
        </Paper>
      )}

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(76, 175, 80, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
          }
        }
      `}</style>
    </Container>
  );
};

export default StudentOnlineSessions;
