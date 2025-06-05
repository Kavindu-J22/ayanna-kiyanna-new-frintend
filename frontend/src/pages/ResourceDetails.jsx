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
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Card,
  CardContent,
  Grid,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  ArrowBack,
  FolderOpen,
  AttachFile,
  OpenInNew,
  PictureAsPdf,
  Image,
  Link as LinkIcon,
  Launch,
  Person,
  AccessTime,
  Download
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';

const ResourceDetails = () => {
  const { resourceId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // State management
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchResourceDetails();
  }, [resourceId]);

  const fetchResourceDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/resources/${resourceId}`,
        { headers: { 'x-auth-token': token } }
      );
      setResource(response.data.resource);
    } catch (err) {
      console.error('Error fetching resource details:', err);
      setError('Failed to load resource details');
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
          ආපසු යන්න
        </Button>
      </Container>
    );
  }

  if (!resource) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning">සම්පත සොයා ගත නොහැක</Alert>
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
              සම්පත් විස්තර
            </Typography>
          </Box>
        </Paper>

        {/* Resource Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 4 }}>
              {/* Title */}
              <Typography variant="h4" fontWeight="bold" sx={{
                fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                mb: 3,
                color: 'primary.main'
              }}>
                {resource.title}
              </Typography>

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
                {resource.description}
              </Typography>

              {/* Metadata */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Person color="primary" />
                  <Typography variant="body2">
                    <strong>සෑදූ අය:</strong> {resource.createdBy?.fullName || 'Unknown'}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccessTime color="primary" />
                  <Typography variant="body2">
                    <strong>සෑදූ දිනය:</strong> {new Date(resource.createdAt).toLocaleDateString('si-LK')}
                  </Typography>
                </Box>
              </Box>

              {/* Content Grid */}
              <Grid container spacing={4}>
                {/* File Attachments */}
                {resource.attachments && resource.attachments.length > 0 && (
                  <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%', bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                      <CardContent>
                        <Typography variant="h6" sx={{
                          fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                          mb: 2,
                          fontWeight: 'bold',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}>
                          <AttachFile />
                          ගොනු ඇමුණුම්
                        </Typography>
                        <List>
                          {resource.attachments.map((attachment, index) => (
                            <ListItem 
                              key={index} 
                              button 
                              onClick={() => handleOpenAttachment(attachment.url)}
                              sx={{ 
                                border: '1px solid rgba(255,255,255,0.3)', 
                                borderRadius: 2, 
                                mb: 1,
                                bgcolor: 'rgba(255,255,255,0.1)',
                                '&:hover': { 
                                  bgcolor: 'rgba(255,255,255,0.2)',
                                  transform: 'translateX(4px)',
                                  transition: 'all 0.2s ease'
                                }
                              }}
                            >
                              <ListItemIcon sx={{ color: 'inherit' }}>
                                {getFileIcon(attachment.type)}
                              </ListItemIcon>
                              <ListItemText
                                primary={attachment.name}
                                secondary={
                                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                                    {attachment.type.toUpperCase()} - {(attachment.size / 1024 / 1024).toFixed(2)} MB
                                  </Typography>
                                }
                              />
                              <Download fontSize="small" />
                            </ListItem>
                          ))}
                        </List>
                      </CardContent>
                    </Card>
                  </Grid>
                )}

                {/* External Links */}
                {resource.externalLinks && resource.externalLinks.length > 0 && (
                  <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%', bgcolor: 'secondary.light', color: 'secondary.contrastText' }}>
                      <CardContent>
                        <Typography variant="h6" sx={{
                          fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                          mb: 2,
                          fontWeight: 'bold',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}>
                          <LinkIcon />
                          බාහිර සබැඳි
                        </Typography>
                        <List>
                          {resource.externalLinks.map((link, index) => (
                            <ListItem 
                              key={index} 
                              button 
                              onClick={() => handleOpenExternalLink(link.url)}
                              sx={{ 
                                border: '1px solid rgba(255,255,255,0.3)', 
                                borderRadius: 2, 
                                mb: 1,
                                bgcolor: 'rgba(255,255,255,0.1)',
                                '&:hover': { 
                                  bgcolor: 'rgba(255,255,255,0.2)',
                                  transform: 'translateX(4px)',
                                  transition: 'all 0.2s ease'
                                }
                              }}
                            >
                              <ListItemIcon sx={{ color: 'inherit' }}>
                                <Launch />
                              </ListItemIcon>
                              <ListItemText
                                primary={link.title}
                                secondary={
                                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                                    {link.description || link.url}
                                  </Typography>
                                }
                              />
                              <OpenInNew fontSize="small" />
                            </ListItem>
                          ))}
                        </List>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
              </Grid>

              {/* Class Information */}
              {resource.classId && (
                <Box sx={{ 
                  p: 3, 
                  bgcolor: 'success.light', 
                  borderRadius: 2,
                  color: 'success.contrastText',
                  mt: 4
                }}>
                  <Typography variant="h6" sx={{
                    fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                    fontWeight: 'bold',
                    mb: 1
                  }}>
                    පන්ති තොරතුරු:
                  </Typography>
                  <Typography>
                    {resource.classId.grade} - {resource.classId.category} ({resource.classId.type})
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
              background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
              color: '#333',
              fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
              fontWeight: 'bold',
              px: 4,
              py: 1.5,
              '&:hover': {
                background: 'linear-gradient(135deg, #ff8a95 0%, #fdbde5 100%)'
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

export default ResourceDetails;
