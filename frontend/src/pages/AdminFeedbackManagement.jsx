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
  Chip,
  IconButton,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  Tabs,
  Tab
} from '@mui/material';
import {
  ContactSupport as ContactSupportIcon,
  Reply as ReplyIcon,
  Delete as DeleteIcon,
  FilterList as FilterListIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminFeedbackManagement = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReplyDialog, setShowReplyDialog] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [filters, setFilters] = useState({
    about: 'all',
    replied: 'all'
  });
  
  const [replyData, setReplyData] = useState({
    reply: ''
  });

  const navigate = useNavigate();

  const aboutOptions = [
    { value: 'all', label: 'සියල්ල' },
    { value: 'Subject Related', label: 'විෂය සම්බන්ධ' },
    { value: 'System Related', label: 'පද්ධති සම්බන්ධ' },
    { value: 'Classes Related', label: 'පන්ති සම්බන්ධ' },
    { value: 'Other', label: 'වෙනත්' }
  ];

  const replyStatusOptions = [
    { value: 'all', label: 'සියල්ල' },
    { value: 'true', label: 'පිළිතුරු ලබා දී ඇත' },
    { value: 'false', label: 'පිළිතුරු සඳහා රැඳී සිටින' }
  ];

  useEffect(() => {
    checkAdminAuth();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [feedbacks, filters, tabValue]);

  const checkAdminAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await axios.get('https://ayanna-kiyanna-new-backend.onrender.com/api/auth/me', {
        headers: { 'x-auth-token': token }
      });

      if (response.data.role !== 'admin' && response.data.role !== 'moderator') {
        navigate('/');
        return;
      }

      fetchFeedbacks();
    } catch (err) {
      console.error('Authentication error:', err);
      navigate('/login');
    }
  };

  const fetchFeedbacks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://ayanna-kiyanna-new-backend.onrender.com/api/feedback/admin/all', {
        headers: { 'x-auth-token': token }
      });

      if (response.data.success) {
        setFeedbacks(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching feedbacks:', err);
      setError('Error loading feedbacks');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...feedbacks];

    // Filter by tab (replied/unreplied)
    if (tabValue === 1) {
      filtered = filtered.filter(feedback => !feedback.reply);
    } else if (tabValue === 2) {
      filtered = filtered.filter(feedback => feedback.reply);
    }

    // Filter by category
    if (filters.about !== 'all') {
      filtered = filtered.filter(feedback => feedback.about === filters.about);
    }

    setFilteredFeedbacks(filtered);
  };

  const openReplyDialog = (feedback) => {
    setSelectedFeedback(feedback);
    setReplyData({ reply: feedback.reply || '' });
    setShowReplyDialog(true);
  };

  const handleReplyToFeedback = async () => {
    if (!replyData.reply.trim()) {
      setError('කරුණාකර පිළිතුර ඇතුළත් කරන්න');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/feedback/${selectedFeedback._id}/reply`,
        { reply: replyData.reply },
        { headers: { 'x-auth-token': token } }
      );

      if (response.data.success) {
        // Update the feedbacks state
        const updatedFeedbacks = feedbacks.map(feedback => 
          feedback._id === selectedFeedback._id 
            ? { ...feedback, reply: replyData.reply, repliedAt: new Date() }
            : feedback
        );
        setFeedbacks(updatedFeedbacks);
        
        setShowReplyDialog(false);
        setReplyData({ reply: '' });
        setError('');
      }
    } catch (err) {
      console.error('Error replying to feedback:', err);
      setError('පිළිතුර යැවීමේදී දෝෂයක් ඇතිවිය');
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

      setFeedbacks(feedbacks.filter(feedback => feedback._id !== feedbackId));
    } catch (err) {
      console.error('Error deleting feedback:', err);
      setError('ප්‍රතිපෝෂණය මකා දැමීමේදී දෝෂයක් ඇතිවිය');
    }
  };

  const getTabCounts = () => {
    const total = feedbacks.length;
    const unreplied = feedbacks.filter(f => !f.reply).length;
    const replied = feedbacks.filter(f => f.reply).length;
    return { total, unreplied, replied };
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} sx={{ color: '#E91E63' }} />
      </Box>
    );
  }

  const { total, unreplied, replied } = getTabCounts();

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
          User Questions and Feedbacks
        </Typography>
        
        <Typography variant="h6" color="text.secondary" sx={{
          fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
          maxWidth: '800px',
          mx: 'auto',
          lineHeight: 1.6
        }}>
          පරිශීලක ප්‍රතිපෝෂණ සහ ප්‍රශ්න කළමනාකරණය. ප්‍රශ්නවලට පිළිතුරු දෙන්න සහ ප්‍රතිපෝෂණ කළමනාකරණය කරන්න.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Tabs */}
      <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ mb: 3 }}>
        <Tab label={`සියල්ල (${total})`} />
        <Tab label={`නොපිළිතුරු (${unreplied})`} />
        <Tab label={`පිළිතුරු ලබා දී ඇත (${replied})`} />
      </Tabs>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif' }}>
          <FilterListIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          පෙරහන්
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>විෂය</InputLabel>
              <Select
                value={filters.about}
                label="විෂය"
                onChange={(e) => setFilters(prev => ({ ...prev, about: e.target.value }))}
              >
                {aboutOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Feedbacks */}
      <Grid container spacing={3}>
        <AnimatePresence>
          {filteredFeedbacks.map((feedback, index) => (
            <Grid item xs={12} key={feedback._id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
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
                        {!feedback.reply && (
                          <Chip
                            label="නොපිළිතුරු"
                            size="small"
                            color="warning"
                            sx={{ ml: 1, mb: 1 }}
                          />
                        )}
                        <Typography variant="h6" sx={{
                          fontWeight: 'bold',
                          fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                          color: '#2E2E2E'
                        }}>
                          {feedback.title}
                        </Typography>
                      </Box>
                      
                      <Box>
                        <Button
                          size="small"
                          startIcon={<ReplyIcon />}
                          onClick={() => openReplyDialog(feedback)}
                          sx={{ color: '#4CAF50', mr: 1 }}
                        >
                          {feedback.reply ? 'පිළිතුර සංස්කරණය' : 'පිළිතුරු දෙන්න'}
                        </Button>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteFeedback(feedback._id)}
                          sx={{ color: '#F44336' }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
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

                    {/* User Information */}
                    <Paper sx={{ p: 2, bgcolor: '#f5f5f5', mb: 2 }}>
                      <Typography variant="subtitle2" sx={{
                        fontWeight: 'bold',
                        mb: 1,
                        fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
                      }}>
                        පරිශීලක තොරතුරු:
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <PersonIcon sx={{ fontSize: 16, color: '#666' }} />
                          <Typography variant="body2">{feedback.submittedBy?.fullName}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <EmailIcon sx={{ fontSize: 16, color: '#666' }} />
                          <Typography variant="body2">{feedback.submittedBy?.email}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <PhoneIcon sx={{ fontSize: 16, color: '#666' }} />
                          <Typography variant="body2">{feedback.submittedBy?.contactNumber}</Typography>
                        </Box>
                      </Box>
                    </Paper>

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
                      {feedback.reply ? ` පිළිතුරු දී ඇත ${new Date(feedback.repliedAt).toLocaleDateString('si-LK')}` : ' පිළිතුරු සඳහා රැඳී සිටින්න'}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </AnimatePresence>
      </Grid>

      {filteredFeedbacks.length === 0 && !loading && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <ContactSupportIcon sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" sx={{
            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
          }}>
            තවම ප්‍රතිපෝෂණ නැත
          </Typography>
          <Typography variant="body2" color="text.secondary">
            පරිශීලකයින්ගේ ප්‍රතිපෝෂණ සඳහා රැඳී සිටින්න
          </Typography>
        </Box>
      )}

      {/* Reply Dialog */}
      <Dialog 
        open={showReplyDialog} 
        onClose={() => setShowReplyDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{
          fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #E91E63 30%, #FF9800 90%)',
          color: 'white'
        }}>
          ප්‍රතිපෝෂණයට පිළිතුරු දෙන්න
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography variant="body2" sx={{
            mb: 2,
            fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
            color: '#666',
            p: 2,
            bgcolor: '#f5f5f5',
            borderRadius: 1
          }}>
            <strong>ප්‍රතිපෝෂණය:</strong> {selectedFeedback?.description}
          </Typography>
          
          <TextField
            fullWidth
            label="ඔබගේ පිළිතුර *"
            multiline
            rows={4}
            value={replyData.reply}
            onChange={(e) => setReplyData({ reply: e.target.value })}
            placeholder="කරුණාකර ඔබගේ පිළිතුර මෙහි ටයිප් කරන්න..."
            InputLabelProps={{
              style: { fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif' }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setShowReplyDialog(false)}>
            අවලංගු කරන්න
          </Button>
          <Button
            variant="contained"
            onClick={handleReplyToFeedback}
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={20} /> : <ReplyIcon />}
            sx={{
              bgcolor: '#E91E63',
              '&:hover': { bgcolor: '#C2185B' }
            }}
          >
            පිළිතුර යවන්න
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminFeedbackManagement;
