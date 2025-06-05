import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  IconButton,
  Alert,
  CircularProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Card,
  CardContent,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  ArrowBack,
  Notifications,
  AttachFile,
  OpenInNew,
  PictureAsPdf,
  Image,
  PriorityHigh,
  CalendarToday,
  Person,
  AccessTime
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';

const AnnouncementDetails = () => {
  const { announcementId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // State management
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnnouncementDetails();
  }, [announcementId]);

  const fetchAnnouncementDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/announcements/${announcementId}`,
        { headers: { 'x-auth-token': token } }
      );
      setAnnouncement(response.data.announcement);
    } catch (err) {
      console.error('Error fetching announcement details:', err);
      setError('Failed to load announcement details');
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
          ආපසු යන්න
        </Button>
      </Container>
    );
  }

  if (!announcement) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning">දැනුම්දීම සොයා ගත නොහැක</Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ mt: 2 }}
        >
          ආපසු යන්න
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
      <Container maxWidth="lg">
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
              දැනුම්දීම් විස්තර
            </Typography>
          </Box>
        </Paper>

        {/* Announcement Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card sx={{
            mb: 3,
            opacity: isExpired(announcement.expiryDate) ? 0.8 : 1
          }}>
            <CardContent sx={{ p: 4 }}>
              {/* Title and Priority */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <Typography variant="h4" fontWeight="bold" sx={{
                  fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                  flex: 1,
                  mr: 2
                }}>
                  {announcement.title}
                </Typography>
                <Chip
                  label={announcement.priority}
                  color={getPriorityColor(announcement.priority)}
                  size="large"
                  icon={announcement.priority === 'Urgent' ? <PriorityHigh /> : undefined}
                  sx={{ fontWeight: 'bold' }}
                />
              </Box>

              {/* Status Alert */}
              {isExpired(announcement.expiryDate) && (
                <Alert severity="warning" sx={{ mb: 3 }}>
                  <Typography sx={{ fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif' }}>
                    මෙම දැනුම්දීම කල් ඉකුත් වී ඇත
                  </Typography>
                </Alert>
              )}

              {/* Description */}
              <Typography variant="h6" sx={{
                fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                mb: 2,
                fontWeight: 'bold'
              }}>
                විස්තරය:
              </Typography>
              <Typography variant="body1" sx={{
                mb: 4,
                lineHeight: 1.8,
                fontSize: '1.1rem',
                whiteSpace: 'pre-wrap'
              }}>
                {announcement.description}
              </Typography>

              {/* Metadata */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Person color="primary" />
                  <Typography variant="body2">
                    <strong>ප්‍රකාශ කළේ:</strong> {announcement.createdBy?.fullName || 'Unknown'}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccessTime color="primary" />
                  <Typography variant="body2">
                    <strong>දිනය:</strong> {new Date(announcement.createdAt).toLocaleDateString('si-LK')}
                  </Typography>
                </Box>

                {announcement.expiryDate && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarToday color={isExpired(announcement.expiryDate) ? 'error' : 'warning'} />
                    <Typography 
                      variant="body2" 
                      color={isExpired(announcement.expiryDate) ? 'error' : 'warning.main'}
                    >
                      <strong>
                        {isExpired(announcement.expiryDate) ? 'කල් ඉකුත් වූ දිනය:' : 'කල් ඉකුත් වන දිනය:'}
                      </strong> {new Date(announcement.expiryDate).toLocaleDateString('si-LK')}
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* File Attachments */}
              {announcement.attachments && announcement.attachments.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{
                    fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                    mb: 2,
                    fontWeight: 'bold'
                  }}>
                    ඇමුණුම්:
                  </Typography>
                  <List>
                    {announcement.attachments.map((attachment, index) => (
                      <ListItem 
                        key={index} 
                        button 
                        onClick={() => handleOpenAttachment(attachment.url)}
                        sx={{ 
                          border: '1px solid #e0e0e0', 
                          borderRadius: 2, 
                          mb: 1,
                          '&:hover': { 
                            bgcolor: 'action.hover',
                            transform: 'translateX(4px)',
                            transition: 'all 0.2s ease'
                          }
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

              {/* Class Information */}
              {announcement.classId && (
                <Box sx={{ 
                  p: 3, 
                  bgcolor: 'primary.light', 
                  borderRadius: 2,
                  color: 'primary.contrastText'
                }}>
                  <Typography variant="h6" sx={{
                    fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                    fontWeight: 'bold',
                    mb: 1
                  }}>
                    පන්ති තොරතුරු:
                  </Typography>
                  <Typography>
                    {announcement.classId.grade} - {announcement.classId.category} ({announcement.classId.type})
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Back Button */}
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button
            variant="contained"
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
            size="large"
            sx={{
              background: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
              color: 'white',
              fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
              fontWeight: 'bold',
              px: 4,
              py: 1.5,
              '&:hover': {
                background: 'linear-gradient(135deg, #9575cd 0%, #f8bbd9 100%)'
              }
            }}
          >
            ආපසු යන්න
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default AnnouncementDetails;
