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
  FolderOpen,
  AttachFile,
  Link as LinkIcon,
  School,
  OpenInNew,
  PictureAsPdf,
  Image,
  Launch
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';

const StudentResourceView = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // State management
  const [resources, setResources] = useState([]);
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchClassData();
    fetchResources();
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

  const fetchResources = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/resources/class/${classId}`,
        { headers: { 'x-auth-token': token } }
      );
      setResources(response.data.resources);
    } catch (err) {
      console.error('Error fetching resources:', err);
      setError('Failed to load resources');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAttachment = (url) => {
    window.open(url, '_blank');
  };

  const handleOpenExternalLink = (url) => {
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
              සම්පත් සහ මෙවලම්
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

        {/* Resources Grid */}
        <Grid container spacing={3} justifyContent="center">
          {resources.map((resource) => (
            <Grid item xs={12} sm={6} md={4} key={resource._id} sx={{
            display: 'grid',
            alignItems: 'stretch', // This ensures all cards stretch to the same height
            }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card sx={{
                  height: '100%',
                  display: 'flex',
                  maxWidth: '350px',
                  minWidth: '350px',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6
                  }
                }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" fontWeight="bold" sx={{
                      fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                      mb: 2
                    }}>
                      {resource.title}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{
                    fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
                    mb: 2,
                    lineHeight: 1.5,
                    minHeight: '60px',
                    display: '-webkit-box',
                    WebkitLineClamp: 5,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                    }}
                    >
                      {resource.description}
                    </Typography>

                    {/* File Attachments */}
                    {resource.attachments && resource.attachments.length > 0 && (
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                          File Attachments:
                        </Typography>
                        <List dense>
                          {resource.attachments.map((attachment, index) => (
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

                    {/* External Links */}
                    {resource.externalLinks && resource.externalLinks.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                          External Links:
                        </Typography>
                        <List dense>
                          {resource.externalLinks.map((link, index) => (
                            <ListItem 
                              key={index} 
                              button 
                              onClick={() => handleOpenExternalLink(link.url)}
                              sx={{ 
                                border: '1px solid #e0e0e0', 
                                borderRadius: 1, 
                                mb: 1,
                                '&:hover': { bgcolor: 'action.hover' }
                              }}
                            >
                              <ListItemIcon>
                                <LinkIcon color="secondary" />
                              </ListItemIcon>
                              <ListItemText
                                primary={link.title}
                                secondary={link.description || link.url}
                              />
                              <Launch fontSize="small" color="action" />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    )}

                    <Typography variant="caption" color="text.secondary">
                      Added: {new Date(resource.createdAt).toLocaleDateString()}
                    </Typography>
                  </CardContent>

                  {/* Access Button */}
                  <Box sx={{ p: 2, pt: 0 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<FolderOpen />}
                      onClick={() => navigate(`/resource-details/${resource._id}`)}
                      sx={{
                        background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
                        color: '#333',
                        fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                        fontWeight: 'bold',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #ff8a95 0%, #fdbde5 100%)'
                        }
                      }}
                    >
                      ප්‍රවේශ වන්න
                    </Button>
                  </Box>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {resources.length === 0 && (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <FolderOpen sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" sx={{
              fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
            }}>
              සම්පත් නොමැත
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              මෙම පන්තිය සඳහා සම්පත් නොමැත
            </Typography>
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default StudentResourceView;
