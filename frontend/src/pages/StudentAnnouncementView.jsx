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
  IconButton,
  Alert,
  CircularProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  ArrowBack,
  Notifications,
  AttachFile,
  School,
  OpenInNew,
  PictureAsPdf,
  Image,
  PriorityHigh,
  CalendarToday
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';

const StudentAnnouncementView = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // State management
  const [announcements, setAnnouncements] = useState([]);
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchClassData();
    fetchAnnouncements();
  }, [classId]);

  const fetchClassData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/classes/${classId}`,
        { headers: { 'x-auth-token': token } }
      );
      setClassData(response.data);
    } catch (err) {
      console.error('Error fetching class data:', err);
      setError('Failed to load class data');
    }
  };

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/announcements/class/${classId}`,
        { headers: { 'x-auth-token': token } }
      );
      setAnnouncements(response.data.announcements);
    } catch (err) {
      console.error('Error fetching announcements:', err);
      setError('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAttachment = (url) => {
    window.open(url, '_blank');
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf':
        return <PictureAsPdf color="error" />;
      case 'image':
        return <Image color="primary" />;
      default:
        return <AttachFile color="action" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Urgent':
        return 'error';
      case 'High':
        return 'warning';
      case 'Medium':
        return 'info';
      case 'Low':
        return 'default';
      default:
        return 'default';
    }
  };

  const isExpired = (expiryDate) => {
    if (!expiryDate) return false;
    return new Date() > new Date(expiryDate);
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
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ mt: 2 }}
        >
          Go Back
        </Button>
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
              විශේෂ නිවේදන සහ දැනුවත් කිරීම්
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
              <Chip 
                label={classData.type} 
                color="primary" 
                size="small" 
              />
            </Box>
          )}
        </Paper>

        {/* Announcements Grid */}
        <Grid container spacing={3}>
          {announcements.map((announcement) => (
            <Grid item xs={12} sm={6} md={4} key={announcement._id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  opacity: isExpired(announcement.expiryDate) ? 0.7 : 1,
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6
                  }
                }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" fontWeight="bold" sx={{
                        fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                        flex: 1
                      }}>
                        {announcement.title}
                      </Typography>
                      <Chip
                        label={announcement.priority}
                        color={getPriorityColor(announcement.priority)}
                        size="small"
                        icon={announcement.priority === 'Urgent' ? <PriorityHigh /> : undefined}
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      {announcement.description}
                    </Typography>

                    {/* File Attachments */}
                    {announcement.attachments && announcement.attachments.length > 0 && (
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                          Attachments:
                        </Typography>
                        <List dense>
                          {announcement.attachments.map((attachment, index) => (
                            <ListItem 
                              key={index} 
                              button 
                              onClick={() => handleOpenAttachment(attachment.url)}
                              sx={{ 
                                border: '1px solid #e0e0e0', 
                                borderRadius: 1, 
                                mb: 1,
                                '&:hover': { bgcolor: 'action.hover' }
                              }}
                            >
                              <ListItemIcon>
                                {getFileIcon(attachment.type)}
                              </ListItemIcon>
                              <ListItemText
                                primary={attachment.name}
                                secondary={`${attachment.type.toUpperCase()} - ${(attachment.size / 1024 / 1024).toFixed(2)} MB`}
                              />
                              <OpenInNew fontSize="small" color="action" />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    )}

                    {/* Date Information */}
                    <Box sx={{ mt: 'auto' }}>
                      {announcement.expiryDate && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <CalendarToday fontSize="small" color={isExpired(announcement.expiryDate) ? 'error' : 'warning'} />
                          <Typography 
                            variant="caption" 
                            color={isExpired(announcement.expiryDate) ? 'error' : 'warning.main'}
                            fontWeight="bold"
                          >
                            {isExpired(announcement.expiryDate) 
                              ? `Expired: ${new Date(announcement.expiryDate).toLocaleDateString()}`
                              : `Expires: ${new Date(announcement.expiryDate).toLocaleDateString()}`
                            }
                          </Typography>
                        </Box>
                      )}
                      
                      <Typography variant="caption" color="text.secondary">
                        Posted: {new Date(announcement.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </CardContent>

                  {/* Access Button */}
                  <Box sx={{ p: 2, pt: 0 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<Notifications />}
                      onClick={() => navigate(`/announcement-details/${announcement._id}`)}
                      disabled={isExpired(announcement.expiryDate)}
                      sx={{
                        background: isExpired(announcement.expiryDate) 
                          ? 'linear-gradient(135deg, #bdbdbd 0%, #9e9e9e 100%)'
                          : 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
                        color: 'white',
                        fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                        fontWeight: 'bold',
                        '&:hover': {
                          background: isExpired(announcement.expiryDate)
                            ? 'linear-gradient(135deg, #9e9e9e 0%, #757575 100%)'
                            : 'linear-gradient(135deg, #9575cd 0%, #f8bbd9 100%)'
                        }
                      }}
                    >
                      {isExpired(announcement.expiryDate) ? 'කල් ඉකුත්' : 'ප්‍රවේශ වන්න'}
                    </Button>
                  </Box>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {announcements.length === 0 && (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Notifications sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" sx={{
              fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
            }}>
              දැනුම්දීම් නොමැත
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              මෙම පන්තිය සඳහා දැනුම්දීම් නොමැත
            </Typography>
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default StudentAnnouncementView;
