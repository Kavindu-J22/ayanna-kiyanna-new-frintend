import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Grid,
  Chip,
  IconButton,
  Divider,
  Avatar,
  Paper
} from '@mui/material';
import {
  ContactSupport as ContactSupportIcon,
  Send as SendIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationOnIcon,
  Facebook as FacebookIcon,
  WhatsApp as WhatsAppIcon,
  Language as LanguageIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ContactSupportPage = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [myFeedbacks, setMyFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  
  const [formData, setFormData] = useState({
    about: '',
    title: '',
    description: '',
    attachment: null
  });

  const navigate = useNavigate();

  const aboutOptions = [
    { value: 'Subject Related', label: 'විෂය සම්බන්ධ' },
    { value: 'System Related', label: 'පද්ධති සම්බන්ධ' },
    { value: 'Classes Related', label: 'පන්ති සම්බන්ධ' },
    { value: 'Other', label: 'වෙනත්' }
  ];

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    const userEmail = localStorage.getItem('userEmail');
    const token = localStorage.getItem('token');

    if (!userEmail || !token) {
      setShowLoginDialog(true);
      setLoading(false);
      return;
    }

    try {
      // Check user role from database
      const response = await axios.get('https://ayanna-kiyanna-new-backend.onrender.com/api/auth/me', {
        headers: { 'x-auth-token': token }
      });

      setCurrentUser(response.data);
      setIsAuthenticated(true);
      fetchMyFeedbacks();
    } catch (err) {
      console.error('Authentication error:', err);
      setShowLoginDialog(true);
      setLoading(false);
    }
  };

  const fetchMyFeedbacks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://ayanna-kiyanna-new-backend.onrender.com/api/feedback/my-feedbacks', {
        headers: { 'x-auth-token': token }
      });

      if (response.data.success) {
        setMyFeedbacks(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching feedbacks:', err);
      setError('Error loading feedbacks');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    setShowLoginDialog(false);
    navigate('/login');
  };

  const handleFileUpload = async (file) => {
    if (!file) return null;

    setUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);
    formDataUpload.append('upload_preset', 'ml_default');

    try {
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dl9k5qoae/auto/upload',
        formDataUpload
      );

      return {
        url: response.data.secure_url,
        publicId: response.data.public_id,
        type: response.data.resource_type
      };
    } catch (err) {
      console.error('Upload error:', err);
      setError('ගොනුව උඩුගත කිරීමේදී දෝෂයක් ඇතිවිය');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmitFeedback = async () => {
    if (!formData.about || !formData.title.trim() || !formData.description.trim()) {
      setError('කරුණාකර සියලුම අවශ්‍ය ක්ෂේත්‍ර පුරවන්න');
      return;
    }

    setSubmitting(true);
    try {
      let attachment = null;
      if (formData.attachment) {
        attachment = await handleFileUpload(formData.attachment);
        if (!attachment) {
          setSubmitting(false);
          return;
        }
      }

      const token = localStorage.getItem('token');
      const feedbackData = {
        about: formData.about,
        title: formData.title,
        description: formData.description,
        attachment
      };

      const response = await axios.post(
        'https://ayanna-kiyanna-new-backend.onrender.com/api/feedback',
        feedbackData,
        { headers: { 'x-auth-token': token } }
      );

      if (response.data.success) {
        setMyFeedbacks([response.data.data, ...myFeedbacks]);
        setShowFeedbackDialog(false);
        resetForm();
        setError('');
        setTabValue(1); // Switch to My Feedbacks tab
      }
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setError('ප්‍රතිපෝෂණය යැවීමේදී දෝෂයක් ඇතිවිය');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      about: '',
      title: '',
      description: '',
      attachment: null
    });
  };

  const handleDeleteFeedback = async (feedbackId) => {
    if (!window.confirm('ඔබට මෙම ප්‍රතිපෝෂණය මකා දැමීමට අවශ්‍යද?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/feedback/${feedbackId}`,
        { headers: { 'x-auth-token': token } }
      );

      setMyFeedbacks(myFeedbacks.filter(feedback => feedback._id !== feedbackId));
    } catch (err) {
      console.error('Error deleting feedback:', err);
      setError('ප්‍රතිපෝෂණය මකා දැමීමේදී දෝෂයක් ඇතිවිය');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} sx={{ color: '#E91E63' }} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" sx={{
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #E91E63 30%, #FF9800 90%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 2,
          fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
        }}>
          අයන්න කියන්න - Contact Support
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ mb: 3 }}>
        <Tab label="Contact Information" />
        <Tab label="My Feedbacks" />
      </Tabs>

      {/* Contact Information Tab */}
      {tabValue === 0 && (
        <Box>
          {/* Contact Details */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <Card sx={{
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                background: 'linear-gradient(135deg, #E3F2FD 0%, #F3E5F5 100%)'
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h5" sx={{
                    fontWeight: 'bold',
                    mb: 3,
                    fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                    color: '#2E2E2E'
                  }}>
                    අයන්න කියන්න සම්බන්ධතා
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PhoneIcon sx={{ color: '#E91E63', mr: 2 }} />
                    <Typography variant="body1">+94 77 123 4567</Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <EmailIcon sx={{ color: '#E91E63', mr: 2 }} />
                    <Typography variant="body1">info@ayannakiyanna.lk</Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <WhatsAppIcon sx={{ color: '#25D366', mr: 2 }} />
                    <Typography variant="body1">+94 77 123 4567</Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationOnIcon sx={{ color: '#E91E63', mr: 2 }} />
                    <Typography variant="body1">කොළඹ, ශ්‍රී ලංකාව</Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <FacebookIcon sx={{ color: '#1877F2', mr: 2 }} />
                    <Typography variant="body1">facebook.com/ayannakiyanna</Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LanguageIcon sx={{ color: '#E91E63', mr: 2 }} />
                    <Typography variant="body1">www.ayannakiyanna.lk</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                background: 'linear-gradient(135deg, #FFF3E0 0%, #FCE4EC 100%)'
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h5" sx={{
                    fontWeight: 'bold',
                    mb: 3,
                    fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                    color: '#2E2E2E'
                  }}>
                    ප්‍රතිපෝෂණ සහ ප්‍රශ්න
                  </Typography>

                  <Typography variant="body1" sx={{
                    mb: 3,
                    fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
                    lineHeight: 1.6
                  }}>
                    ඔබට අයන්න කියන්න ආයතනය සම්බන්ධයෙන් කිසියම් ප්‍රශ්නයක්, යෝජනාවක් හෝ ප්‍රතිපෝෂණයක් ඇත්නම් 
                    කරුණාකර පහත ෆෝමය භාවිතා කරන්න.
                  </Typography>

                  <Button
                    variant="contained"
                    startIcon={<ContactSupportIcon />}
                    onClick={() => setShowFeedbackDialog(true)}
                    sx={{
                      bgcolor: '#E91E63',
                      fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                      fontWeight: 'bold',
                      px: 3,
                      py: 1.5,
                      '&:hover': {
                        bgcolor: '#C2185B'
                      }
                    }}
                  >
                    ප්‍රතිපෝෂණයක් යවන්න
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* My Feedbacks Tab */}
      {tabValue === 1 && (
        <Box>
          {myFeedbacks.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <ContactSupportIcon sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" sx={{
                fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
              }}>
                තවම ප්‍රතිපෝෂණ නැත
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ප්‍රථම ප්‍රතිපෝෂණය යැවීමට Contact Information ටැබයට යන්න
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {myFeedbacks.map((feedback, index) => (
                <Grid item xs={12} key={feedback._id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card sx={{
                      borderRadius: 3,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 30px rgba(233, 30, 99, 0.15)'
                      }
                    }}>
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Box>
                            <Chip
                              label={aboutOptions.find(opt => opt.value === feedback.about)?.label || feedback.about}
                              size="small"
                              sx={{
                                bgcolor: '#E3F2FD',
                                color: '#1976D2',
                                mb: 1
                              }}
                            />
                            <Typography variant="h6" sx={{
                              fontWeight: 'bold',
                              fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                              color: '#2E2E2E'
                            }}>
                              {feedback.title}
                            </Typography>
                          </Box>
                          
                          {!feedback.reply && (
                            <Box>
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteFeedback(feedback._id)}
                                sx={{ color: '#F44336' }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                          )}
                        </Box>

                        <Typography variant="body1" sx={{
                          mb: 2,
                          fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
                          lineHeight: 1.6
                        }}>
                          {feedback.description}
                        </Typography>

                        {feedback.attachment && (
                          <Box sx={{ mb: 2 }}>
                            {feedback.attachment.type === 'image' ? (
                              <img
                                src={feedback.attachment.url}
                                alt="Attachment"
                                style={{
                                  maxWidth: '200px',
                                  maxHeight: '200px',
                                  borderRadius: '8px',
                                  objectFit: 'cover'
                                }}
                              />
                            ) : (
                              <Button
                                variant="outlined"
                                href={feedback.attachment.url}
                                target="_blank"
                                sx={{ color: '#E91E63', borderColor: '#E91E63' }}
                              >
                                View Attachment
                              </Button>
                            )}
                          </Box>
                        )}

                        {feedback.reply && (
                          <Paper sx={{ p: 2, bgcolor: '#E8F5E8', borderLeft: '4px solid #4CAF50' }}>
                            <Typography variant="body2" sx={{
                              fontWeight: 'medium',
                              mb: 1,
                              color: '#2E7D32',
                              fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
                            }}>
                              Admin Reply:
                            </Typography>
                            <Typography variant="body1" sx={{
                              fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
                            }}>
                              {feedback.reply}
                            </Typography>
                          </Paper>
                        )}

                        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                          {new Date(feedback.createdAt).toLocaleDateString('si-LK')} - 
                          {feedback.reply ? ' පිළිතුරු ලැබී ඇත' : ' පිළිතුරු සඳහා රැඳී සිටින්න'}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}

      {/* Login Dialog */}
      <Dialog open={showLoginDialog} onClose={() => setShowLoginDialog(false)}>
        <DialogTitle sx={{
          textAlign: 'center',
          fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
          background: 'linear-gradient(45deg, #E91E63 30%, #FF9800 90%)',
          color: 'white'
        }}>
          සාදරයෙන් පිළිගනිමු!
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', py: 3 }}>
          <Typography variant="body1" sx={{
            fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
            mb: 2
          }}>
            Contact Support භාවිතා කිරීමට කරුණාකර පළමුව ලොගින් වන්න හෝ ගිණුමක් සාදන්න.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button
            variant="contained"
            onClick={handleLoginRedirect}
            sx={{
              bgcolor: '#E91E63',
              fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
              fontWeight: 'bold',
              px: 4,
              '&:hover': {
                bgcolor: '#C2185B'
              }
            }}
          >
            ලොගින් වන්න
          </Button>
        </DialogActions>
      </Dialog>

      {/* Feedback Dialog */}
      <Dialog
        open={showFeedbackDialog}
        onClose={() => setShowFeedbackDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{
          fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #E91E63 30%, #FF9800 90%)',
          color: 'white'
        }}>
          ප්‍රතිපෝෂණ සහ ප්‍රශ්න ෆෝමය
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <TextField
            fullWidth
            select
            label="විෂය *"
            value={formData.about}
            onChange={(e) => setFormData(prev => ({ ...prev, about: e.target.value }))}
            sx={{ mb: 2 }}
            InputLabelProps={{
              style: { fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif' }
            }}
          >
            {aboutOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="මාතෘකාව *"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            sx={{ mb: 2 }}
            InputLabelProps={{
              style: { fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif' }
            }}
          />

          <TextField
            fullWidth
            label="විස්තරය *"
            multiline
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            sx={{ mb: 2 }}
            placeholder="කරුණාකර ඔබගේ ප්‍රශ්නය හෝ ප්‍රතිපෝෂණය විස්තරාත්මකව ලියන්න..."
            InputLabelProps={{
              style: { fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif' }
            }}
          />

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" sx={{
              fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
              mb: 1,
              fontWeight: 'medium'
            }}>
              ඇමුණුම (විකල්ප) - ඡායාරූප හෝ PDF
            </Typography>
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => setFormData(prev => ({ ...prev, attachment: e.target.files[0] }))}
              style={{
                width: '100%',
                padding: '10px',
                border: '2px dashed #E91E63',
                borderRadius: '8px',
                backgroundColor: '#fafafa'
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setShowFeedbackDialog(false)}>
            අවලංගු කරන්න
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmitFeedback}
            disabled={submitting || uploading}
            startIcon={submitting || uploading ? <CircularProgress size={20} /> : <SendIcon />}
            sx={{
              bgcolor: '#E91E63',
              '&:hover': { bgcolor: '#C2185B' }
            }}
          >
            යවන්න
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ContactSupportPage;
