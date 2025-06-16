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
  Close as CloseIcon,
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
  const [showEditDialog, setShowEditDialog] = useState(false);

  const [editingFeedback, setEditingFeedback] = useState(null);
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
    attachment: null,
    sourceLinks: []
  });

  const [editFormData, setEditFormData] = useState({
    about: '',
    title: '',
    description: '',
    attachment: null,
    sourceLinks: [],
    removeCurrentAttachment: false
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

    // Validate source links
    for (const link of formData.sourceLinks) {
      if (link.title.trim() && !link.url.trim()) {
        setError('කරුණාකර සියලුම source links සඳහා URL ඇතුළත් කරන්න');
        return;
      }
      if (link.url.trim() && !link.title.trim()) {
        setError('කරුණාකර සියලුම source links සඳහා title ඇතුළත් කරන්න');
        return;
      }
      // Basic URL validation
      if (link.url.trim() && !link.url.trim().match(/^https?:\/\/.+/)) {
        setError('කරුණාකර වලංගු URL ඇතුළත් කරන්න (http:// හෝ https:// සමඟ)');
        return;
      }
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
      const filteredSourceLinks = formData.sourceLinks.filter(link => link.title.trim() && link.url.trim());
      console.log('Sending source links:', filteredSourceLinks);

      const feedbackData = {
        about: formData.about,
        title: formData.title,
        description: formData.description,
        attachment,
        sourceLinks: filteredSourceLinks
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
        setTabValue(1);
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
      attachment: null,
      sourceLinks: []
    });
  };

  const resetEditForm = () => {
    setEditFormData({
      about: '',
      title: '',
      description: '',
      attachment: null,
      sourceLinks: [],
      removeCurrentAttachment: false
    });
  };

  const addSourceLink = (isEdit = false) => {
    const newLink = { title: '', url: '' };
    if (isEdit) {
      setEditFormData(prev => ({
        ...prev,
        sourceLinks: [...prev.sourceLinks, newLink]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        sourceLinks: [...prev.sourceLinks, newLink]
      }));
    }
  };

  const removeSourceLink = (index, isEdit = false) => {
    if (isEdit) {
      setEditFormData(prev => ({
        ...prev,
        sourceLinks: prev.sourceLinks.filter((_, i) => i !== index)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        sourceLinks: prev.sourceLinks.filter((_, i) => i !== index)
      }));
    }
  };

  const updateSourceLink = (index, field, value, isEdit = false) => {
    if (isEdit) {
      setEditFormData(prev => ({
        ...prev,
        sourceLinks: prev.sourceLinks.map((link, i) =>
          i === index ? { ...link, [field]: value } : link
        )
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        sourceLinks: prev.sourceLinks.map((link, i) =>
          i === index ? { ...link, [field]: value } : link
        )
      }));
    }
  };

  const handleEditFeedback = (feedback) => {
    setEditingFeedback(feedback);
    setEditFormData({
      about: feedback.about,
      title: feedback.title,
      description: feedback.description,
      attachment: null, // Don't pre-fill attachment for editing
      sourceLinks: feedback.sourceLinks || [],
      removeCurrentAttachment: false
    });
    setShowEditDialog(true);
  };

  const handleUpdateFeedback = async () => {
    if (!editFormData.about || !editFormData.title.trim() || !editFormData.description.trim()) {
      setError('කරුණාකර සියලුම අවශ්‍ය ක්ෂේත්‍ර පුරවන්න');
      return;
    }

    // Validate source links
    for (const link of editFormData.sourceLinks) {
      if (link.title.trim() && !link.url.trim()) {
        setError('කරුණාකර සියලුම source links සඳහා URL ඇතුළත් කරන්න');
        return;
      }
      if (link.url.trim() && !link.title.trim()) {
        setError('කරුණාකර සියලුම source links සඳහා title ඇතුළත් කරන්න');
        return;
      }
      // Basic URL validation
      if (link.url.trim() && !link.url.trim().match(/^https?:\/\/.+/)) {
        setError('කරුණාකර වලංගු URL ඇතුළත් කරන්න (http:// හෝ https:// සමඟ)');
        return;
      }
    }

    setSubmitting(true);
    try {
      let attachment = editingFeedback.attachment; // Keep existing attachment by default

      // Handle attachment removal
      if (editFormData.removeCurrentAttachment) {
        attachment = null;
      }

      // Handle new attachment upload
      if (editFormData.attachment) {
        attachment = await handleFileUpload(editFormData.attachment);
        if (!attachment) {
          setSubmitting(false);
          return;
        }
      }

      const token = localStorage.getItem('token');
      const filteredEditSourceLinks = editFormData.sourceLinks.filter(link => link.title.trim() && link.url.trim());
      console.log('Sending edit source links:', filteredEditSourceLinks);

      const updateData = {
        about: editFormData.about,
        title: editFormData.title,
        description: editFormData.description,
        attachment,
        sourceLinks: filteredEditSourceLinks
      };

      const response = await axios.put(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/feedback/${editingFeedback._id}`,
        updateData,
        { headers: { 'x-auth-token': token } }
      );

      if (response.data.success) {
        const updatedFeedbacks = myFeedbacks.map(feedback =>
          feedback._id === editingFeedback._id ? response.data.data : feedback
        );
        setMyFeedbacks(updatedFeedbacks);
        setShowEditDialog(false);
        resetEditForm();
        setEditingFeedback(null);
        setError('');
      }
    } catch (err) {
      console.error('Error updating feedback:', err);
      setError('ප්‍රතිපෝෂණය යාවත්කාලීන කිරීමේදී දෝෂයක් ඇතිවිය');
    } finally {
      setSubmitting(false);
    }
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
      {/* Header with animated gradient */}
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h3" component="h1" sx={{
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #E91E63 30%, #FF9800 90%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2,
            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
          }}>
            අයන්න කියන්න - Contact Support
          </Typography>
          <Divider sx={{ 
            height: 4,
            background: 'linear-gradient(90deg, rgba(233,30,99,0.1) 0%, rgba(233,30,99,0.8) 50%, rgba(233,30,99,0.1) 100%)',
            border: 'none',
            borderRadius: 2,
            my: 2
          }} />
        </motion.div>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Tabs 
        value={tabValue} 
        onChange={(e, newValue) => setTabValue(newValue)} 
        sx={{ 
          mb: 4,
          '& .MuiTabs-indicator': {
            height: 4,
            borderRadius: '2px 2px 0 0',
            backgroundColor: '#E91E63'
          }
        }}
      >
        <Tab label="Contact Information" sx={{ 
          fontSize: '1rem',
          fontWeight: 'bold',
          fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
          textTransform: 'none'
        }} />
        <Tab label="My Feedbacks & Questions" sx={{ 
          fontSize: '1rem',
          fontWeight: 'bold',
          fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
          textTransform: 'none'
        }} />
      </Tabs>

      {/* Contact Information Tab */}
      {tabValue === 0 && (
        <Box>
          <Grid container spacing={4} sx={{ mb: 4 }}>
            <Grid item xs={12}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card sx={{
                  borderRadius: 4,
                  boxShadow: '0 12px 40px rgba(233, 30, 99, 0.15)',
                  background: 'linear-gradient(145deg, #ffffff 0%, #fcf4f7 100%)',
                  border: 'none',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0 15px 45px rgba(233, 30, 99, 0.2)'
                  },
                  transition: 'all 0.3s ease'
                }}>
                  {/* Decorative elements */}
                  <Box sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: 180,
                    height: 180,
                    background: 'radial-gradient(circle, rgba(233,30,99,0.08) 0%, rgba(255,255,255,0) 70%)',
                    borderRadius: '50%',
                    transform: 'translate(30%, -30%)'
                  }} />
                  <Box sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: 150,
                    height: 150,
                    background: 'radial-gradient(circle, rgba(255,152,0,0.08) 0%, rgba(255,255,255,0) 70%)',
                    borderRadius: '50%',
                    transform: 'translate(-30%, 30%)'
                  }} />
                  
                  <CardContent sx={{ p: { xs: 3, md: 5 }, flexGrow: 1 }}>
                    {/* Header with animated underline */}
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mb: 4,
                      position: 'relative',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: -8,
                        left: 0,
                        width: '80px',
                        height: '4px',
                        background: 'linear-gradient(90deg, #E91E63 0%, #FF9800 100%)',
                        borderRadius: 2
                      }
                    }}>
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        bgcolor: 'rgba(233, 30, 99, 0.1)',
                        mr: 3,
                        flexShrink: 0
                      }}>
                        <ContactSupportIcon sx={{ 
                          fontSize: 32, 
                          color: '#E91E63'
                        }} />
                      </Box>
                      <Typography variant="h4" sx={{
                        fontWeight: 'bold',
                        fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                        color: '#2E2E2E',
                        lineHeight: 1.2
                      }}>
                        අයන්න කියන්න <br/>සම්බන්ධතා
                      </Typography>
                    </Box>

                    {/* Contact items grid */}
                    <Grid container spacing={3}>
                      {[
                        { 
                          icon: <PhoneIcon sx={{ color: '#E91E63', fontSize: 28 }} />, 
                          text: '+94 36 2268 882',
                          label: 'ජංගම දුරකථන'
                        },
                        { 
                          icon: <EmailIcon sx={{ color: '#E91E63', fontSize: 28 }} />, 
                          text: 'ayannakiyanna@gmail.com',
                          label: 'විද්‍යුත් තැපෑල'
                        },
                        { 
                          icon: <WhatsAppIcon sx={{ color: '#25D366', fontSize: 28 }} />, 
                          text: '+94 777 047 391',
                          label: 'WhatsApp'
                        },
                        { 
                          icon: <LocationOnIcon sx={{ color: '#E91E63', fontSize: 28 }} />, 
                          text: '98/8, මල්වත්ත, යටන්වල, රුවන්වැල්ල, ශ්‍රී ලංකාව',
                          label: 'ලිපිනය'
                        },
                        { 
                          icon: <FacebookIcon sx={{ color: '#1877F2', fontSize: 28 }} />, 
                          text: 'facebook.com/ayannakiyanna',
                          label: 'ෆේස්බුක්'
                        },
                        { 
                          icon: <LanguageIcon sx={{ color: '#E91E63', fontSize: 28 }} />, 
                          text: 'www.ayannakiyanna.com',
                          label: 'වෙබ් අඩවිය'
                        }
                      ].map((item, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                          <motion.div
                            whileHover={{ y: -3 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Box sx={{ 
                              display: 'flex',
                              alignItems: 'flex-start',
                              p: 3,
                              height: '100%',
                              borderRadius: 2,
                              bgcolor: 'rgba(255, 255, 255, 0.7)',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                              border: '1px solid rgba(233, 30, 99, 0.1)',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                bgcolor: 'rgba(233, 30, 99, 0.03)',
                                boxShadow: '0 6px 16px rgba(233, 30, 99, 0.1)'
                              }
                            }}>
                              <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 48,
                                height: 48,
                                borderRadius: '50%',
                                bgcolor: 'rgba(233, 30, 99, 0.08)',
                                mr: 2,
                                flexShrink: 0
                              }}>
                                {item.icon}
                              </Box>
                              <Box>
                                <Typography variant="body2" sx={{
                                  color: '#E91E63',
                                  fontWeight: 'medium',
                                  mb: 0.5,
                                  fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                                }}>
                                  {item.label}
                                </Typography>
                                <Typography variant="body1" sx={{
                                  fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
                                  lineHeight: 1.4
                                }}>
                                  {item.text}
                                </Typography>
                              </Box>
                            </Box>
                          </motion.div>
                        </Grid>
                      ))}
                    </Grid>

                    {/* Social media action buttons */}
                    <Box sx={{ 
                      mt: 4,
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 2,
                      justifyContent: 'center'
                    }}>
                      {/* WhatsApp Button */}
                      <Button
                        variant="contained"
                        startIcon={<WhatsAppIcon sx={{ fontSize: 24 }} />}
                        onClick={() => window.open('https://wa.me/94777047391', '_blank')}
                        sx={{
                          bgcolor: '#25D366',
                          borderRadius: 3,
                          px: 2,
                          py: 1.8,
                          fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
                          fontWeight: 'bold',
                          fontSize: '1rem',
                          textTransform: 'none',
                          minWidth: 260,
                          boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)',
                          '&:hover': {
                            bgcolor: '#128C7E',
                            boxShadow: '0 6px 16px rgba(37, 211, 102, 0.4)',
                            transform: 'translateY(-2px)'
                          },
                          transition: 'all 0.3s ease',
                          position: 'relative',
                          overflow: 'hidden',
                          '&::after': {
                            content: '""',
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            width: 5,
                            height: 5,
                            background: 'rgba(255, 255, 255, 0.5)',
                            opacity: 0,
                            borderRadius: '100%',
                            transform: 'scale(1, 1) translate(-50%)',
                            transformOrigin: '50% 50%'
                          },
                          '&:focus:not(:active)::after': {
                            animation: 'ripple 1s ease-out'
                          },
                          '@keyframes ripple': {
                            '0%': {
                              transform: 'scale(0, 0)',
                              opacity: 0.5
                            },
                            '100%': {
                              transform: 'scale(20, 20)',
                              opacity: 0
                            }
                          }
                        }}
                      >
                        WhatsApp ඔස්සේ සම්බන්ධ වන්න
                      </Button>

                      {/* Facebook Button */}
                      <Button
                        variant="contained"
                        startIcon={<FacebookIcon sx={{ fontSize: 24 }} />}
                        onClick={() => window.open('https://www.facebook.com/profile.php?id=100066826185077', '_blank')}
                        sx={{
                          bgcolor: '#1877F2',
                          borderRadius: 3,
                          px: 2,
                          py: 1.8,
                          fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
                          fontWeight: 'bold',
                          fontSize: '1rem',
                          textTransform: 'none',
                          minWidth: 260,
                          boxShadow: '0 4px 12px rgba(24, 119, 242, 0.3)',
                          '&:hover': {
                            bgcolor: '#0D5B9D',
                            boxShadow: '0 6px 16px rgba(24, 119, 242, 0.4)',
                            transform: 'translateY(-2px)'
                          },
                          transition: 'all 0.3s ease',
                          position: 'relative',
                          overflow: 'hidden',
                          '&::after': {
                            content: '""',
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            width: 5,
                            height: 5,
                            background: 'rgba(255, 255, 255, 0.5)',
                            opacity: 0,
                            borderRadius: '100%',
                            transform: 'scale(1, 1) translate(-50%)',
                            transformOrigin: '50% 50%'
                          },
                          '&:focus:not(:active)::after': {
                            animation: 'ripple 1s ease-out'
                          }
                        }}
                      >
                        Facebook පිටුවට යන්න
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <Card sx={{
                  borderRadius: 3,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  background: 'linear-gradient(135deg, #ffffff 0%,rgb(248, 242, 226) 100%)',
                  border: '1px solid rgba(233, 30, 99, 0.1)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {/* Decorative elements */}
                  <Box sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: 120,
                    height: 120,
                    background: 'radial-gradient(circle, rgba(233,30,99,0.1) 0%, rgba(255,255,255,0) 70%)',
                    borderRadius: '50%',
                    transform: 'translate(50%, -50%)'
                  }} />
                  <Box sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: 100,
                    height: 100,
                    background: 'radial-gradient(circle, rgba(255,152,0,0.1) 0%, rgba(255,255,255,0) 70%)',
                    borderRadius: '50%',
                    transform: 'translate(-50%, 50%)'
                  }} />
                  
                  <CardContent sx={{ p: 4, flexGrow: 1 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mb: 3,
                      padding: 2,
                      background: 'linear-gradient(90deg, rgba(233,30,99,0.1) 0%, rgba(255,255,255,0) 100%)',
                      borderRadius: 2
                    }}>
                      <ContactSupportIcon sx={{ 
                        fontSize: 40, 
                        color: '#E91E63', 
                        mr: 2 
                      }} />
                      <Typography variant="h5" sx={{
                        fontWeight: 'bold',
                        fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                        color: '#2E2E2E'
                      }}>
                        ප්‍රතිපෝෂණ සහ ප්‍රශ්න
                      </Typography>
                    </Box>

                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: { xs: 'column', sm: 'row' },
                      alignItems: 'center',
                      mb: 3
                    }}>
                      <Box sx={{ 
                        flex: 1,
                        mr: { sm: 3 },
                        mb: { xs: 3, sm: 0 }
                      }}>
                        <Typography variant="body1" sx={{
                          mb: 2,
                          fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
                          lineHeight: 1.6
                        }}>
                          ඔබට අයන්න කියන්න ආයතනය සම්බන්ධයෙන් කිසියම් ප්‍රශ්නයක්, යෝජනාවක් හෝ ප්‍රතිපෝෂණයක් ඇත්නම් 
                          කරුණාකර පහත බොත්තම භාවිතා කරන්න.
                        </Typography>
                        <Button
                          variant="contained"
                          startIcon={<ContactSupportIcon />}
                          onClick={() => setShowFeedbackDialog(true)}
                          sx={{
                            bgcolor: '#E91E63',
                            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                            fontWeight: 'bold',
                            px: 4,
                            py: 1.5,
                            borderRadius: 2,
                            boxShadow: '0 4px 12px rgba(233, 30, 99, 0.3)',
                            '&:hover': {
                              bgcolor: '#C2185B',
                              boxShadow: '0 6px 16px rgba(233, 30, 99, 0.4)'
                            }
                          }}
                        >
                          ප්‍රතිපෝෂණයක් යවන්න
                        </Button>
                      </Box>
                      <Box sx={{
                        flex: 1,
                        display: 'flex',
                        justifyContent: 'center'
                      }}>
                        <img 
                          src="https://res.cloudinary.com/dl9k5qoae/image/upload/v1750023725/Ask_ewytxw.png" 
                          alt="Feedback Illustration" 
                          style={{ 
                            maxWidth: '100%', 
                            height: 'auto',
                            maxHeight: '200px',
                            borderRadius: '8px'
                          }} 
                        />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </Box>
      )}

{/* My Feedbacks Tab */}
{tabValue === 1 && (
  <Box>
    {myFeedbacks.length === 0 ? (
      <Box sx={{ 
        textAlign: 'center', 
        py: 8,
        backgroundColor: 'rgba(233, 30, 99, 0.03)',
        borderRadius: 3,
        border: '1px dashed rgba(233, 30, 99, 0.3)',
        maxWidth: 600,
        mx: 'auto'
      }}>
        <ContactSupportIcon sx={{ 
          fontSize: 80, 
          color: 'grey.400', 
          mb: 2 
        }} />
        <Typography variant="h6" color="text.secondary" sx={{
          fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
          mb: 1
        }}>
          තවම ප්‍රතිපෝෂණ නැත
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          ප්‍රථම ප්‍රතිපෝෂණය යැවීමට Contact Information ටැබයට යන්න
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ContactSupportIcon />}
          onClick={() => setTabValue(0)}
          sx={{
            color: '#E91E63',
            borderColor: '#E91E63',
            '&:hover': {
              backgroundColor: 'rgba(233, 30, 99, 0.08)',
              borderColor: '#C2185B'
            }
          }}
        >
          Contact Information
        </Button>
      </Box>
    ) : (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {myFeedbacks.map((feedback, index) => (
          <motion.div
            key={feedback._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card sx={{
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              transition: 'all 0.3s ease',
              width: '100%',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: '0 8px 30px rgba(233, 30, 99, 0.15)'
              }
            }}>
              <CardContent sx={{ p: 3 }}>
                {/* Header Section */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start', 
                  mb: 2,
                  gap: 2
                }}>
                  <Box sx={{ flex: 1 }}>
                    <Chip
                      label={aboutOptions.find(opt => opt.value === feedback.about)?.label || feedback.about}
                      size="small"
                      sx={{
                        bgcolor: '#E3F2FD',
                        color: '#1976D2',
                        mb: 1,
                        fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
                      }}
                    />
                    <Typography variant="h6" sx={{
                      fontWeight: 'bold',
                      fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                      color: '#2E2E2E',
                      mb: 1
                    }}>
                      {feedback.title}
                    </Typography>
                  </Box>
                  
                  {!feedback.reply && (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleEditFeedback(feedback)}
                        sx={{ color: '#FF9800' }}
                        title="Edit Feedback"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteFeedback(feedback._id)}
                        sx={{ color: '#F44336' }}
                        title="Delete Feedback"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  )}
                </Box>

                {/* Description */}
                <Typography variant="body1" sx={{
                  mb: 3,
                  fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
                  lineHeight: 1.6
                }}>
                  {feedback.description}
                </Typography>

                {/* Attachments */}
                {feedback.attachment && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" sx={{
                      fontWeight: 'medium',
                      mb: 1,
                      color: '#E91E63',
                      fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
                    }}>
                      ඇමුණුම්:
                    </Typography>
                    <Button
                      variant="outlined"
                      onClick={() => window.open(feedback.attachment.url, '_blank')}
                      sx={{
                        color: '#E91E63',
                        borderColor: '#E91E63',
                        '&:hover': {
                          backgroundColor: 'rgba(233, 30, 99, 0.08)',
                          borderColor: '#C2185B'
                        },
                        width: '100%',
                        justifyContent: 'flex-start',
                        textAlign: 'left'
                      }}
                      startIcon={<span>📎</span>}
                    >
                      ඇමුණුම් පෙන්වන්න
                    </Button>
                  </Box>
                )}

                {/* Source Links */}
                {feedback.sourceLinks && feedback.sourceLinks.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" sx={{
                      fontWeight: 'medium',
                      mb: 1,
                      color: '#1976D2',
                      fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
                    }}>
                      සබැදි (Source Links):
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {feedback.sourceLinks.map((link, index) => (
                        <Button
                          key={index}
                          variant="outlined"
                          href={link.url}
                          target="_blank"
                          size="small"
                          sx={{
                            color: '#1976D2',
                            borderColor: '#1976D2',
                            textTransform: 'none',
                            '&:hover': {
                              backgroundColor: 'rgba(25, 118, 210, 0.08)',
                              borderColor: '#1565C0'
                            }
                          }}
                          startIcon={<span>🔗</span>}
                        >
                          {link.title}
                        </Button>
                      ))}
                    </Box>
                  </Box>
                )}

                {/* Admin Reply Section */}
                {feedback.reply && (
                  <Paper sx={{
                    p: 3,
                    bgcolor: '#E8F5E8',
                    borderLeft: '4px solid #4CAF50',
                    mb: 3,
                    borderRadius: 2
                  }}>
                    <Typography variant="body2" sx={{
                      fontWeight: 'medium',
                      mb: 1,
                      color: '#2E7D32',
                      fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
                    }}>
                      ගුරුතුමාගේ පිළිතුර:
                    </Typography>
                    <Typography variant="body1" sx={{
                      fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
                      mb: 2
                    }}>
                      {feedback.reply}
                    </Typography>

                    {feedback.replyAttachment && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" sx={{
                          fontWeight: 'medium',
                          mb: 1,
                          color: '#2E7D32',
                          fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
                          fontSize: '11px'
                        }}>
                          ගුරුතුමාගේ ඇමුණුම් :
                        </Typography>
                        <Button
                          variant="outlined"
                          onClick={() => window.open(feedback.replyAttachment.url, '_blank')}
                          sx={{
                            color: '#2E7D32',
                            borderColor: '#2E7D32',
                            '&:hover': {
                              backgroundColor: 'rgba(46, 125, 50, 0.08)',
                              borderColor: '#1B5E20'
                            },
                            width: '100%',
                            justifyContent: 'flex-start',
                            textAlign: 'left'
                          }}
                          startIcon={<span>📎</span>}
                        >
                          ගුරුතුමාගේ ඇමුණුම් පෙන්වන්න
                        </Button>
                      </Box>
                    )}

                    {feedback.replySourceLinks && feedback.replySourceLinks.length > 0 && (
                      <Box>
                        <Typography variant="subtitle2" sx={{
                          fontWeight: 'medium',
                          mb: 1,
                          color: '#2E7D32',
                          fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
                          fontSize: '11px'
                        }}>
                          ගුරුතුමාගේ සබැදි (Source Links):
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {feedback.replySourceLinks.map((link, index) => (
                            <Button
                              key={index}
                              variant="outlined"
                              href={link.url}
                              target="_blank"
                              size="small"
                              sx={{
                                color: '#2E7D32',
                                borderColor: '#2E7D32',
                                textTransform: 'none',
                                '&:hover': {
                                  backgroundColor: 'rgba(46, 125, 50, 0.08)',
                                  borderColor: '#1B5E20'
                                }
                              }}
                              startIcon={<span>🔗</span>}
                            >
                              {link.title}
                            </Button>
                          ))}
                        </Box>
                      </Box>
                    )}
                  </Paper>
                )}

                {/* Date and Status */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mt: 2
                }}>
                  <Typography variant="caption" color="text.secondary" sx={{
                    fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
                  }}>
                    {new Date(feedback.createdAt).toLocaleDateString('si-LK')}
                  </Typography>
                  <Chip
                    label={feedback.reply ? 'පිළිතුරු ලැබී ඇත' : 'පිළිතුරු බලාපොරොත්තුවෙන්'}
                    size="small"
                    sx={{
                      bgcolor: feedback.reply ? '#E8F5E8' : '#FFF3E0',
                      color: feedback.reply ? '#2E7D32' : '#E65100',
                      fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </Box>
    )}
  </Box>
)}

      {/* Login Dialog */}
      <Dialog 
        open={showLoginDialog} 
        onClose={() => setShowLoginDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{
          textAlign: 'center',
          fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
          background: 'linear-gradient(45deg, #E91E63 30%, #FF9800 90%)',
          color: 'white',
          py: 3
        }}>
          සාදරයෙන් පිළිගනිමු!
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', py: 4 }}>
          <Box sx={{ mb: 3 }}>
            <ContactSupportIcon sx={{ 
              fontSize: 60, 
              color: '#E91E63',
              opacity: 0.8
            }} />
          </Box>
          <Typography variant="body1" sx={{
            fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
            mb: 2,
            fontSize: '1.1rem'
          }}>
            Contact Support භාවිතා කිරීමට කරුණාකර පළමුව ලොගින් වන්න හෝ ගිණුමක් සාදන්න.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ 
          justifyContent: 'center', 
          pb: 4,
          px: 4
        }}>
          <Button
            variant="contained"
            onClick={handleLoginRedirect}
            sx={{
              bgcolor: '#E91E63',
              fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
              fontWeight: 'bold',
              px: 4,
              py: 1.5,
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(233, 30, 99, 0.3)',
              '&:hover': {
                bgcolor: '#C2185B',
                boxShadow: '0 6px 16px rgba(233, 30, 99, 0.4)'
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
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{
          fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #E91E63 30%, #FF9800 90%)',
          color: 'white',
          py: 3
        }}>
          ප්‍රතිපෝෂණ සහ ප්‍රශ්න ෆෝමය
        </DialogTitle>
        <DialogContent sx={{ mt: 2, p: 4 }}>
          <Box sx={{ mb: 3 }}>
            <img 
              src="https://res.cloudinary.com/dl9k5qoae/image/upload/v1750023725/Ask_ewytxw.png" 
              alt="Feedback Illustration" 
              style={{ 
                maxWidth: '150px', 
                height: 'auto',
                margin: '0 auto',
                display: 'block',
                marginBottom: '20px'
              }} 
            />
          </Box>
          
          <TextField
            fullWidth
            select
            label="විෂය *"
            value={formData.about}
            onChange={(e) => setFormData(prev => ({ ...prev, about: e.target.value }))}
            sx={{ mb: 3 }}
            InputLabelProps={{
              style: { fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif' }
            }}
            InputProps={{
              sx: {
                borderRadius: 2,
                fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
              }
            }}
          >
            {aboutOptions.map((option) => (
              <MenuItem 
                key={option.value} 
                value={option.value}
                sx={{ fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif' }}
              >
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="මාතෘකාව *"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            sx={{ mb: 3 }}
            InputLabelProps={{
              style: { fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif' }
            }}
            InputProps={{
              sx: {
                borderRadius: 2,
                fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
              }
            }}
          />

          <TextField
            fullWidth
            label="විස්තරය *"
            multiline
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            sx={{ mb: 3 }}
            placeholder="කරුණාකර ඔබගේ ප්‍රශ්නය හෝ ප්‍රතිපෝෂණය විස්තරාත්මකව ලියන්න..."
            InputLabelProps={{
              style: { fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif' }
            }}
            InputProps={{
              sx: {
                borderRadius: 2,
                fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
              }
            }}
          />

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{
              fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
              mb: 2,
              fontWeight: 'medium'
            }}>
              ඇමුණුම (විකල්ප) - ඡායාරූප හෝ PDF
            </Typography>
            <Box
              sx={{
                border: '2px dashed #E91E63',
                borderRadius: 2,
                p: 3,
                textAlign: 'center',
                backgroundColor: '#fafafa',
                '&:hover': {
                  backgroundColor: 'rgba(233, 30, 99, 0.03)'
                }
              }}
            >
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => setFormData(prev => ({ ...prev, attachment: e.target.files[0] }))}
                style={{ display: 'none' }}
                id="feedback-attachment"
              />
              <label htmlFor="feedback-attachment">
                <Button
                  variant="outlined"
                  component="span"
                  sx={{
                    color: '#E91E63',
                    borderColor: '#E91E63',
                    mb: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(233, 30, 99, 0.08)',
                      borderColor: '#C2185B'
                    }
                  }}
                >
                  ගොනුව තෝරන්න
                </Button>
              </label>
              <Typography variant="caption" sx={{
                display: 'block',
                color: 'text.secondary',
                fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
              }}>
                {formData.attachment ? formData.attachment.name : 'කිසිදු ගොනුවක් තෝරා නැත'}
              </Typography>
            </Box>
          </Box>

          {/* Source Links Section */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{
              fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
              mb: 2,
              fontWeight: 'medium'
            }}>
              Source Links (විකල්ප)
            </Typography>

            {formData.sourceLinks.map((link, index) => (
              <Box key={index} sx={{
                display: 'flex',
                gap: 2,
                mb: 2,
                p: 2,
                border: '1px solid #E0E0E0',
                borderRadius: 2,
                backgroundColor: '#FAFAFA'
              }}>
                <TextField
                  fullWidth
                  label="Title"
                  value={link.title}
                  onChange={(e) => updateSourceLink(index, 'title', e.target.value)}
                  size="small"
                  sx={{ flex: 1 }}
                />
                <TextField
                  fullWidth
                  label="URL"
                  value={link.url}
                  onChange={(e) => updateSourceLink(index, 'url', e.target.value)}
                  size="small"
                  sx={{ flex: 2 }}
                />
                <IconButton
                  onClick={() => removeSourceLink(index)}
                  sx={{ color: '#F44336' }}
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}

            <Button
              variant="outlined"
              onClick={() => addSourceLink()}
              sx={{
                color: '#1976D2',
                borderColor: '#1976D2',
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.08)',
                  borderColor: '#1565C0'
                }
              }}
            >
              Add Source Link
            </Button>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setShowFeedbackDialog(false)}
            sx={{
              color: '#E91E63',
              fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
              '&:hover': {
                backgroundColor: 'rgba(233, 30, 99, 0.08)'
              }
            }}
          >
            අවලංගු කරන්න
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmitFeedback}
            disabled={submitting || uploading}
            startIcon={submitting || uploading ? <CircularProgress size={20} /> : <SendIcon />}
            sx={{
              bgcolor: '#E91E63',
              fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
              borderRadius: 2,
              px: 4,
              '&:hover': { 
                bgcolor: '#C2185B',
                boxShadow: '0 4px 12px rgba(233, 30, 99, 0.3)'
              }
            }}
          >
            යවන්න
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Feedback Dialog */}
      <Dialog
        open={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{
          fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #FF9800 30%, #E91E63 90%)',
          color: 'white',
          py: 3
        }}>
          ප්‍රතිපෝෂණය සංස්කරණය කරන්න
        </DialogTitle>
        <DialogContent sx={{ mt: 2, p: 4 }}>
          <TextField
            fullWidth
            select
            label="විෂය *"
            value={editFormData.about}
            onChange={(e) => setEditFormData(prev => ({ ...prev, about: e.target.value }))}
            sx={{ mb: 3 }}
            InputLabelProps={{
              style: { fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif' }
            }}
            InputProps={{
              sx: {
                borderRadius: 2,
                fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
              }
            }}
          >
            {aboutOptions.map((option) => (
              <MenuItem
                key={option.value}
                value={option.value}
                sx={{ fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif' }}
              >
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="මාතෘකාව *"
            value={editFormData.title}
            onChange={(e) => setEditFormData(prev => ({ ...prev, title: e.target.value }))}
            sx={{ mb: 3 }}
            InputLabelProps={{
              style: { fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif' }
            }}
            InputProps={{
              sx: {
                borderRadius: 2,
                fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
              }
            }}
          />

          <TextField
            fullWidth
            label="විස්තරය *"
            multiline
            rows={4}
            value={editFormData.description}
            onChange={(e) => setEditFormData(prev => ({ ...prev, description: e.target.value }))}
            sx={{ mb: 3 }}
            placeholder="කරුණාකර ඔබගේ ප්‍රශ්නය හෝ ප්‍රතිපෝෂණය විස්තරාත්මකව ලියන්න..."
            InputLabelProps={{
              style: { fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif' }
            }}
            InputProps={{
              sx: {
                borderRadius: 2,
                fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
              }
            }}
          />

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{
              fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
              mb: 2,
              fontWeight: 'medium'
            }}>
              ඇමුණුම (විකල්ප) - ඡායාරූප හෝ PDF
            </Typography>

            {/* Show existing attachment */}
            {editingFeedback?.attachment && !editFormData.removeCurrentAttachment && (
              <Box sx={{ mb: 2, p: 2, border: '1px solid #E0E0E0', borderRadius: 2, backgroundColor: '#F5F5F5' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle2" sx={{ color: '#666' }}>
                    Current Attachment:
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    onClick={() => setEditFormData(prev => ({ ...prev, removeCurrentAttachment: true }))}
                    sx={{ minWidth: 'auto', px: 1 }}
                  >
                    🗑️ Remove
                  </Button>
                </Box>
                <Button
                  variant="outlined"
                  onClick={() => window.open(editingFeedback.attachment.url, '_blank')}
                  size="small"
                  sx={{ color: '#666', borderColor: '#666' }}
                >
                  📎 View Current Attachment
                </Button>
              </Box>
            )}

            {/* Show removed attachment message */}
            {editFormData.removeCurrentAttachment && (
              <Box sx={{ mb: 2, p: 2, border: '1px solid #F44336', borderRadius: 2, backgroundColor: '#FFEBEE' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle2" sx={{ color: '#F44336' }}>
                    Current attachment will be removed
                  </Typography>
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => setEditFormData(prev => ({ ...prev, removeCurrentAttachment: false }))}
                    sx={{ color: '#F44336', minWidth: 'auto' }}
                  >
                    Undo
                  </Button>
                </Box>
              </Box>
            )}

            <Box
              sx={{
                border: '2px dashed #FF9800',
                borderRadius: 2,
                p: 3,
                textAlign: 'center',
                backgroundColor: '#fafafa',
                '&:hover': {
                  backgroundColor: 'rgba(255, 152, 0, 0.03)'
                }
              }}
            >
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => setEditFormData(prev => ({ ...prev, attachment: e.target.files[0] }))}
                style={{ display: 'none' }}
                id="edit-feedback-attachment"
              />
              <label htmlFor="edit-feedback-attachment">
                <Button
                  variant="outlined"
                  component="span"
                  sx={{
                    color: '#FF9800',
                    borderColor: '#FF9800',
                    mb: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 152, 0, 0.08)',
                      borderColor: '#F57C00'
                    }
                  }}
                >
                  ගොනුව තෝරන්න
                </Button>
              </label>
              <Typography variant="caption" sx={{
                display: 'block',
                color: 'text.secondary',
                fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
              }}>
                {editFormData.attachment ? editFormData.attachment.name : 'නව ගොනුවක් තෝරන්න (වත්මන් ගොනුව රඳවා ගැනීමට හිස්ව තබන්න)'}
              </Typography>
            </Box>
          </Box>

          {/* Source Links Section for Edit */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{
              fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
              mb: 2,
              fontWeight: 'medium'
            }}>
              Source Links (විකල්ප)
            </Typography>

            {editFormData.sourceLinks.map((link, index) => (
              <Box key={index} sx={{
                display: 'flex',
                gap: 2,
                mb: 2,
                p: 2,
                border: '1px solid #E0E0E0',
                borderRadius: 2,
                backgroundColor: '#FAFAFA'
              }}>
                <TextField
                  fullWidth
                  label="Title"
                  value={link.title}
                  onChange={(e) => updateSourceLink(index, 'title', e.target.value, true)}
                  size="small"
                  sx={{ flex: 1 }}
                />
                <TextField
                  fullWidth
                  label="URL"
                  value={link.url}
                  onChange={(e) => updateSourceLink(index, 'url', e.target.value, true)}
                  size="small"
                  sx={{ flex: 2 }}
                />
                <IconButton
                  onClick={() => removeSourceLink(index, true)}
                  sx={{ color: '#F44336' }}
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}

            <Button
              variant="outlined"
              onClick={() => addSourceLink(true)}
              sx={{
                color: '#1976D2',
                borderColor: '#1976D2',
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.08)',
                  borderColor: '#1565C0'
                }
              }}
            >
              Add Source Link
            </Button>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => {
              setShowEditDialog(false);
              resetEditForm();
              setEditingFeedback(null);
            }}
            sx={{
              color: '#FF9800',
              fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
              '&:hover': {
                backgroundColor: 'rgba(255, 152, 0, 0.08)'
              }
            }}
          >
            අවලංගු කරන්න
          </Button>
          <Button
            variant="contained"
            onClick={handleUpdateFeedback}
            disabled={submitting || uploading}
            startIcon={submitting || uploading ? <CircularProgress size={20} /> : <EditIcon />}
            sx={{
              bgcolor: '#FF9800',
              fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
              borderRadius: 2,
              px: 4,
              '&:hover': {
                bgcolor: '#F57C00',
                boxShadow: '0 4px 12px rgba(255, 152, 0, 0.3)'
              }
            }}
          >
            යාවත්කාලීන කරන්න
          </Button>
        </DialogActions>
      </Dialog>


    </Container>
  );
};

export default ContactSupportPage;