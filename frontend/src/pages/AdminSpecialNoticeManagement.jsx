import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Fab,
  CircularProgress,
  Alert,
  Chip,
  Menu,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  NotificationsActive as NotificationsActiveIcon,
  ExpandMore as ExpandMoreIcon,
  Reply as ReplyIcon,
  QuestionAnswer as QuestionAnswerIcon,
  Link as LinkIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminSpecialNoticeManagement = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showReplyDialog, setShowReplyDialog] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [expandedNotice, setExpandedNotice] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    attachment: null,
    sourceLinks: ['']
  });

  const [replyData, setReplyData] = useState({
    reply: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAuth();
  }, []);

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

      fetchNotices();
    } catch (err) {
      console.error('Authentication error:', err);
      navigate('/login');
    }
  };

  const fetchNotices = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://ayanna-kiyanna-new-backend.onrender.com/api/special-notices', {
        headers: { 'x-auth-token': token }
      });

      if (response.data.success) {
        setNotices(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching notices:', err);
      setError('Error loading notices');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) return null;

    setUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);
    formDataUpload.append('upload_preset', 'ml_default');

    try {
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dl9k5qoae/image/upload',
        formDataUpload
      );

      return {
        url: response.data.secure_url,
        publicId: response.data.public_id
      };
    } catch (err) {
      console.error('Upload error:', err);
      setError('ගොනුව උඩුගත කිරීමේදී දෝෂයක් ඇතිවිය');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleCreateNotice = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
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
      const noticeData = {
        title: formData.title,
        content: formData.content,
        attachment,
        sourceLinks: formData.sourceLinks.filter(link => link.trim())
      };

      const response = await axios.post(
        'https://ayanna-kiyanna-new-backend.onrender.com/api/special-notices',
        noticeData,
        { headers: { 'x-auth-token': token } }
      );

      if (response.data.success) {
        setNotices([response.data.data, ...notices]);
        setShowCreateDialog(false);
        resetForm();
        setError('');
      }
    } catch (err) {
      console.error('Error creating notice:', err);
      setError('නිවේදනය සෑදීමේදී දෝෂයක් ඇතිවිය');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateNotice = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      setError('කරුණාකර සියලුම අවශ්‍ය ක්ෂේත්‍ර පුරවන්න');
      return;
    }

    setSubmitting(true);
    try {
      let attachment = editingNotice.attachment;
      if (formData.attachment) {
        const uploadResult = await handleFileUpload(formData.attachment);
        if (uploadResult) {
          attachment = uploadResult;
        }
      }

      const token = localStorage.getItem('token');
      const noticeData = {
        title: formData.title,
        content: formData.content,
        attachment,
        sourceLinks: formData.sourceLinks.filter(link => link.trim())
      };

      const response = await axios.put(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/special-notices/${editingNotice._id}`,
        noticeData,
        { headers: { 'x-auth-token': token } }
      );

      if (response.data.success) {
        const updatedNotices = notices.map(notice => 
          notice._id === editingNotice._id ? response.data.data : notice
        );
        setNotices(updatedNotices);
        setShowEditDialog(false);
        resetForm();
        setError('');
      }
    } catch (err) {
      console.error('Error updating notice:', err);
      setError('නිවේදනය යාවත්කාලීන කිරීමේදී දෝෂයක් ඇතිවිය');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      attachment: null,
      sourceLinks: ['']
    });
    setEditingNotice(null);
  };

  const handleMenuOpen = (event, notice) => {
    setAnchorEl(event.currentTarget);
    setSelectedNotice(notice);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedNotice(null);
  };

  const openEditDialog = (notice) => {
    setEditingNotice(notice);
    setFormData({
      title: notice.title,
      content: notice.content,
      attachment: null,
      sourceLinks: notice.sourceLinks?.length > 0 ? notice.sourceLinks : ['']
    });
    setShowEditDialog(true);
    handleMenuClose();
  };

  const handleDeleteNotice = async (noticeId) => {
    if (!window.confirm('ඔබට මෙම නිවේදනය මකා දැමීමට අවශ්‍යද?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/special-notices/${noticeId}`,
        { headers: { 'x-auth-token': token } }
      );

      setNotices(notices.filter(notice => notice._id !== noticeId));
      handleMenuClose();
    } catch (err) {
      console.error('Error deleting notice:', err);
      setError('නිවේදනය මකා දැමීමේදී දෝෂයක් ඇතිවිය');
    }
  };

  const openReplyDialog = (notice, question) => {
    setSelectedNotice(notice);
    setSelectedQuestion(question);
    setReplyData({ reply: question.reply || '' });
    setShowReplyDialog(true);
  };

  const handleReplyToQuestion = async () => {
    if (!replyData.reply.trim()) {
      setError('කරුණාකර පිළිතුර ඇතුළත් කරන්න');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/special-notices/${selectedNotice._id}/questions/${selectedQuestion._id}/reply`,
        { reply: replyData.reply },
        { headers: { 'x-auth-token': token } }
      );

      if (response.data.success) {
        // Update the notices state
        const updatedNotices = notices.map(notice => {
          if (notice._id === selectedNotice._id) {
            const updatedQuestions = notice.questions.map(q => 
              q._id === selectedQuestion._id 
                ? { ...q, reply: replyData.reply, repliedAt: new Date() }
                : q
            );
            return { ...notice, questions: updatedQuestions };
          }
          return notice;
        });
        setNotices(updatedNotices);
        
        setShowReplyDialog(false);
        setReplyData({ reply: '' });
        setError('');
      }
    } catch (err) {
      console.error('Error replying to question:', err);
      setError('පිළිතුර යැවීමේදී දෝෂයක් ඇතිවිය');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteQuestion = async (noticeId, questionId) => {
    if (!window.confirm('ඔබට මෙම ප්‍රශ්නය මකා දැමීමට අවශ්‍යද?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/special-notices/${noticeId}/questions/${questionId}`,
        { headers: { 'x-auth-token': token } }
      );

      // Update the notices state
      const updatedNotices = notices.map(notice => 
        notice._id === noticeId 
          ? { ...notice, questions: notice.questions.filter(q => q._id !== questionId) }
          : notice
      );
      setNotices(updatedNotices);
    } catch (err) {
      console.error('Error deleting question:', err);
      setError('ප්‍රශ්නය මකා දැමීමේදී දෝෂයක් ඇතිවිය');
    }
  };

  const addSourceLink = () => {
    setFormData(prev => ({
      ...prev,
      sourceLinks: [...prev.sourceLinks, '']
    }));
  };

  const updateSourceLink = (index, value) => {
    const newLinks = [...formData.sourceLinks];
    newLinks[index] = value;
    setFormData(prev => ({
      ...prev,
      sourceLinks: newLinks
    }));
  };

  const removeSourceLink = (index) => {
    setFormData(prev => ({
      ...prev,
      sourceLinks: prev.sourceLinks.filter((_, i) => i !== index)
    }));
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
          Special Notice Management
        </Typography>
        
        <Typography variant="h6" color="text.secondary" sx={{
          fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
          maxWidth: '800px',
          mx: 'auto',
          lineHeight: 1.6
        }}>
          විශේෂ නිවේදන සහ ප්‍රශ්න කළමනාකරණය. නව නිවේදන සාදන්න, සංස්කරණය කරන්න සහ ප්‍රශ්නවලට පිළිතුරු දෙන්න.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Notices */}
      <Box sx={{ mb: 4 }}>
        <AnimatePresence>
          {notices.map((notice, index) => (
            <motion.div
              key={notice._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card sx={{
                mb: 3,
                borderRadius: 3,
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 30px rgba(233, 30, 99, 0.15)'
                }
              }}>
                {notice.attachment && (
                  <CardMedia
                    component="img"
                    height="300"
                    image={notice.attachment.url}
                    alt={notice.title}
                    sx={{ objectFit: 'cover' }}
                  />
                )}
                
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h5" component="h2" sx={{
                      fontWeight: 'bold',
                      fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                      color: '#2E2E2E',
                      flex: 1
                    }}>
                      {notice.title}
                    </Typography>
                    
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, notice)}
                      sx={{ color: '#666' }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Box>
                  
                  <Typography variant="body1" sx={{
                    mb: 3,
                    fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
                    lineHeight: 1.6,
                    color: '#555'
                  }}>
                    {notice.content}
                  </Typography>

                  {notice.sourceLinks && notice.sourceLinks.length > 0 && (
                    <Box sx={{ mb: 3 }}>
                      {notice.sourceLinks.map((link, linkIndex) => (
                        <Chip
                          key={linkIndex}
                          icon={<LinkIcon />}
                          label="Source Link"
                          size="small"
                          component="a"
                          href={link}
                          target="_blank"
                          clickable
                          sx={{
                            mr: 0.5,
                            mb: 0.5,
                            bgcolor: '#E3F2FD',
                            color: '#1976D2',
                            '&:hover': {
                              bgcolor: '#BBDEFB'
                            }
                          }}
                        />
                      ))}
                    </Box>
                  )}

                  <Chip
                    icon={<NotificationsActiveIcon />}
                    label={`${new Date(notice.createdAt).toLocaleDateString('si-LK')}`}
                    size="small"
                    sx={{
                      bgcolor: '#E3F2FD',
                      color: '#1976D2',
                      mb: 2
                    }}
                  />

                  {/* Questions Section */}
                  {notice.questions && notice.questions.length > 0 && (
                    <Accordion 
                      expanded={expandedNotice === notice._id}
                      onChange={() => setExpandedNotice(expandedNotice === notice._id ? null : notice._id)}
                      sx={{ mt: 2 }}
                    >
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography sx={{
                          fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
                          fontWeight: 'medium'
                        }}>
                          ප්‍රශ්න සහ පිළිතුරු ({notice.questions.length})
                          {notice.questions.some(q => !q.reply) && (
                            <Chip 
                              label={`${notice.questions.filter(q => !q.reply).length} නොපිළිතුරු`}
                              size="small"
                              color="warning"
                              sx={{ ml: 1 }}
                            />
                          )}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        {notice.questions.map((question, qIndex) => (
                          <Box key={question._id} sx={{ mb: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                              <Avatar sx={{ bgcolor: '#E91E63', width: 32, height: 32 }}>
                                {question.askedBy?.fullName?.charAt(0) || 'U'}
                              </Avatar>
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="body2" sx={{
                                  fontWeight: 'medium',
                                  mb: 0.5,
                                  fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
                                }}>
                                  {question.askedBy?.fullName || 'Unknown User'}
                                </Typography>
                                <Typography variant="body1" sx={{
                                  mb: 1,
                                  fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
                                }}>
                                  {question.question}
                                </Typography>
                                
                                {question.reply && (
                                  <Box sx={{ mt: 2, p: 2, bgcolor: '#E8F5E8', borderRadius: 1, borderLeft: '4px solid #4CAF50' }}>
                                    <Typography variant="body2" sx={{
                                      fontWeight: 'medium',
                                      mb: 0.5,
                                      color: '#2E7D32',
                                      fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
                                    }}>
                                      Admin Reply:
                                    </Typography>
                                    <Typography variant="body1" sx={{
                                      fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
                                    }}>
                                      {question.reply}
                                    </Typography>
                                  </Box>
                                )}

                                {/* Question Actions */}
                                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                  <Button
                                    size="small"
                                    startIcon={<ReplyIcon />}
                                    onClick={() => openReplyDialog(notice, question)}
                                    sx={{ color: '#4CAF50' }}
                                  >
                                    {question.reply ? 'පිළිතුර සංස්කරණය' : 'පිළිතුරු දෙන්න'}
                                  </Button>
                                  <IconButton
                                    size="small"
                                    onClick={() => handleDeleteQuestion(notice._id, question._id)}
                                    sx={{ color: '#F44336' }}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Box>
                              </Box>
                            </Box>
                          </Box>
                        ))}
                      </AccordionDetails>
                    </Accordion>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </Box>

      {notices.length === 0 && !loading && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <NotificationsActiveIcon sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" sx={{
            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
          }}>
            තවම විශේෂ නිවේදන නැත
          </Typography>
          <Typography variant="body2" color="text.secondary">
            පළමු නිවේදනය සෑදීමට + බොත්තම ක්ලික් කරන්න
          </Typography>
        </Box>
      )}

      {/* Create Button */}
      <Fab
        color="primary"
        aria-label="add notice"
        onClick={() => setShowCreateDialog(true)}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          bgcolor: '#E91E63',
          '&:hover': {
            bgcolor: '#C2185B'
          }
        }}
      >
        <AddIcon />
      </Fab>

      {/* Create Dialog */}
      <Dialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{
          fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #E91E63 30%, #FF9800 90%)',
          color: 'white'
        }}>
          නව විශේෂ නිවේදනයක් සාදන්න
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
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
            label="නිවේදන අන්තර්ගතය *"
            multiline
            rows={6}
            value={formData.content}
            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
            sx={{ mb: 2 }}
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
              ඡායාරූපය (විකල්ප)
            </Typography>
            <input
              type="file"
              accept="image/*"
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

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" sx={{
              fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
              mb: 1,
              fontWeight: 'medium'
            }}>
              මූලාශ්‍ර සබැඳි (විකල්ප)
            </Typography>
            {formData.sourceLinks.map((link, index) => (
              <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                  fullWidth
                  placeholder="https://example.com"
                  value={link}
                  onChange={(e) => updateSourceLink(index, e.target.value)}
                  size="small"
                />
                {formData.sourceLinks.length > 1 && (
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => removeSourceLink(index)}
                  >
                    මකන්න
                  </Button>
                )}
              </Box>
            ))}
            <Button
              variant="outlined"
              size="small"
              onClick={addSourceLink}
              sx={{ mt: 1 }}
            >
              සබැඳියක් එකතු කරන්න
            </Button>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setShowCreateDialog(false)}>
            අවලංගු කරන්න
          </Button>
          <Button
            variant="contained"
            onClick={handleCreateNotice}
            disabled={submitting || uploading}
            sx={{
              bgcolor: '#E91E63',
              '&:hover': { bgcolor: '#C2185B' }
            }}
          >
            {submitting || uploading ? <CircularProgress size={20} /> : 'සාදන්න'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{
          fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #E91E63 30%, #FF9800 90%)',
          color: 'white'
        }}>
          නිවේදනය සංස්කරණය කරන්න
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
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
            label="නිවේදන අන්තර්ගතය *"
            multiline
            rows={6}
            value={formData.content}
            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
            sx={{ mb: 2 }}
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
              නව ඡායාරූපය (විකල්ප)
            </Typography>
            <input
              type="file"
              accept="image/*"
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

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" sx={{
              fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
              mb: 1,
              fontWeight: 'medium'
            }}>
              මූලාශ්‍ර සබැඳි (විකල්ප)
            </Typography>
            {formData.sourceLinks.map((link, index) => (
              <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                  fullWidth
                  placeholder="https://example.com"
                  value={link}
                  onChange={(e) => updateSourceLink(index, e.target.value)}
                  size="small"
                />
                {formData.sourceLinks.length > 1 && (
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => removeSourceLink(index)}
                  >
                    මකන්න
                  </Button>
                )}
              </Box>
            ))}
            <Button
              variant="outlined"
              size="small"
              onClick={addSourceLink}
              sx={{ mt: 1 }}
            >
              සබැඳියක් එකතු කරන්න
            </Button>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setShowEditDialog(false)}>
            අවලංගු කරන්න
          </Button>
          <Button
            variant="contained"
            onClick={handleUpdateNotice}
            disabled={submitting || uploading}
            sx={{
              bgcolor: '#E91E63',
              '&:hover': { bgcolor: '#C2185B' }
            }}
          >
            {submitting || uploading ? <CircularProgress size={20} /> : 'යාවත්කාලීන කරන්න'}
          </Button>
        </DialogActions>
      </Dialog>

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
          ප්‍රශ්නයට පිළිතුරු දෙන්න
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
            <strong>ප්‍රශ්නය:</strong> {selectedQuestion?.question}
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
            onClick={handleReplyToQuestion}
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

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => openEditDialog(selectedNotice)}>
          <EditIcon sx={{ mr: 1 }} />
          සංස්කරණය කරන්න
        </MenuItem>
        <MenuItem onClick={() => handleDeleteNotice(selectedNotice?._id)}>
          <DeleteIcon sx={{ mr: 1 }} />
          මකා දමන්න
        </MenuItem>
      </Menu>
    </Container>
  );
};

export default AdminSpecialNoticeManagement;
