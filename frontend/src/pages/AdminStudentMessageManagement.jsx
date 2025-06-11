import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Badge,
  Avatar,
  Divider,
  Tooltip
} from '@mui/material';
import {
  Reply as ReplyIcon,
  AttachFile as AttachFileIcon,
  Close as CloseIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  WhatsApp as WhatsAppIcon,
  Schedule as ScheduleIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Link as LinkIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const AdminStudentMessageManagement = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [openReplyDialog, setOpenReplyDialog] = useState(false);
  const [openEditReplyDialog, setOpenEditReplyDialog] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [unrepliedCount, setUnrepliedCount] = useState(0);
  const [isEditingReply, setIsEditingReply] = useState(false);

  const [replyData, setReplyData] = useState({
    reply: '',
    replyAttachments: [],
    replySourceLinks: ['']
  });

  useEffect(() => {
    fetchMessages();
    fetchUnrepliedCount();
  }, [tabValue]);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const replied = tabValue === 0 ? 'false' : tabValue === 1 ? 'true' : undefined;
      
      const response = await axios.get(
        'https://ayanna-kiyanna-new-backend.onrender.com/api/student-messages/all',
        { 
          headers: { 'x-auth-token': token },
          params: { replied }
        }
      );

      if (response.data.success) {

        setMessages(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('පණිවිඩ ලබා ගැනීමේදී දෝෂයක් ඇතිවිය');
    } finally {
      setLoading(false);
    }
  };

  const fetchUnrepliedCount = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'https://ayanna-kiyanna-new-backend.onrender.com/api/student-messages/unreplied-count',
        { headers: { 'x-auth-token': token } }
      );

      if (response.data.success) {
        setUnrepliedCount(response.data.count);
      }
    } catch (err) {
      console.error('Error fetching unreplied count:', err);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setLoading(true);
  };

  const handleOpenReplyDialog = (message) => {
    setSelectedMessage(message);
    setReplyData({
      reply: '',
      replyAttachments: [],
      replySourceLinks: ['']
    });
    setIsEditingReply(false);
    setOpenReplyDialog(true);
  };

  const handleOpenEditReplyDialog = (message) => {


    setSelectedMessage(message);
    setReplyData({
      reply: message.reply || '',
      replyAttachments: message.replyAttachments || [],
      replySourceLinks: message.replySourceLinks && message.replySourceLinks.length > 0 ? message.replySourceLinks : ['']
    });
    setIsEditingReply(true);
    setOpenReplyDialog(true);
  };

  const handleCloseReplyDialog = () => {
    setOpenReplyDialog(false);
    setSelectedMessage(null);
    setIsEditingReply(false);
    setError('');
    setSuccess('');
  };

  const handleFileUpload = async (files) => {
    const uploadPromises = Array.from(files).map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'ml_default');

      try {
        const response = await axios.post(
          'https://api.cloudinary.com/v1_1/dl9k5qoae/auto/upload',
          formData
        );

        return {
          url: response.data.secure_url,
          publicId: response.data.public_id,
          type: file.type.startsWith('image/') ? 'image' : 'raw',
          originalName: file.name
        };
      } catch (error) {
        console.error('File upload error:', error);
        throw error;
      }
    });

    try {
      const uploadedFiles = await Promise.all(uploadPromises);
      setReplyData(prev => ({
        ...prev,
        replyAttachments: [...prev.replyAttachments, ...uploadedFiles]
      }));
    } catch (error) {
      setError('ගොනු උඩුගත කිරීමේදී දෝෂයක් ඇතිවිය');
    }
  };

  const removeReplyAttachment = (index) => {
    setReplyData(prev => ({
      ...prev,
      replyAttachments: prev.replyAttachments.filter((_, i) => i !== index)
    }));
  };

  const handleReplySourceLinkChange = (index, value) => {
    const newLinks = [...replyData.replySourceLinks];
    newLinks[index] = value;
    setReplyData(prev => ({
      ...prev,
      replySourceLinks: newLinks
    }));
  };

  const addReplySourceLink = () => {
    setReplyData(prev => ({
      ...prev,
      replySourceLinks: [...prev.replySourceLinks, '']
    }));
  };

  const removeReplySourceLink = (index) => {
    const newLinks = replyData.replySourceLinks.filter((_, i) => i !== index);
    setReplyData(prev => ({
      ...prev,
      replySourceLinks: newLinks.length > 0 ? newLinks : ['']
    }));
  };

  const handleSubmitReply = async () => {
    if (!replyData.reply.trim()) {
      setError('පිළිතුර අවශ්‍ය වේ');
      return;
    }



    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const submitData = {
        ...replyData,
        replySourceLinks: replyData.replySourceLinks.filter(link => link.trim() !== '')
      };
      let response;

      if (isEditingReply) {
        // Update existing reply
        response = await axios.put(
          `https://ayanna-kiyanna-new-backend.onrender.com/api/student-messages/${selectedMessage._id}/edit-reply`,
          submitData,
          { headers: { 'x-auth-token': token } }
        );
      } else {
        // Create new reply
        response = await axios.put(
          `https://ayanna-kiyanna-new-backend.onrender.com/api/student-messages/${selectedMessage._id}/reply`,
          submitData,
          { headers: { 'x-auth-token': token } }
        );
      }



      if (response.data.success) {
        setSuccess(isEditingReply ? 'පිළිතුර සාර්ථකව යාවත්කාලීන කරන ලදී' : 'පිළිතුර සාර්ථකව යවන ලදී');
        fetchMessages();
        fetchUnrepliedCount();
        handleCloseReplyDialog();
      }
    } catch (err) {
      console.error('Error with reply:', err);
      setError(isEditingReply ? 'පිළිතුර යාවත්කාලීන කිරීමේදී දෝෂයක් ඇතිවිය' : 'පිළිතුර යැවීමේදී දෝෂයක් ඇතිවිය');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('si-LK');
  };

  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm('ඔබට මෙම පණිවිඩය මකා දැමීමට අවශ්‍යද?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/student-messages/${messageId}`,
        { headers: { 'x-auth-token': token } }
      );

      if (response.data.success) {
        setSuccess('පණිවිඩය සාර්ථකව මකා දමන ලදී');
        fetchMessages();
        fetchUnrepliedCount();
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      setError('පණිවිඩය මකා දැමීමේදී දෝෂයක් ඇතිවිය');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      py: 4
    }}>
      <Container maxWidth="xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <Paper elevation={8} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{
              fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
              fontWeight: 'bold',
              textAlign: 'center',
              background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              සිසුන්ගේ පණිවිඩ සහ ප්‍රශ්න කළමනාකරණය
            </Typography>
          </Paper>

          {/* Alerts */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                  {error}
                </Alert>
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
                  {success}
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tabs */}
          <Paper elevation={4} sx={{ mb: 3, borderRadius: 3 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              centered
              sx={{
                '& .MuiTab-root': {
                  fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                  fontWeight: 'bold'
                }
              }}
            >
              <Tab 
                label={
                  <Badge badgeContent={unrepliedCount} color="error">
                    පිළිතුරු නොදුන් පණිවිඩ
                  </Badge>
                } 
              />
              <Tab label="පිළිතුරු දුන් පණිවිඩ" />
              <Tab label="සියලුම පණිවිඩ" />
            </Tabs>
          </Paper>

          {/* Messages Grid */}
          <Grid container spacing={3}>
            {messages.map((message) => (
              <Grid item xs={12} lg={6} key={message._id}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 3,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                    border: !message.reply ? '2px solid #ff9800' : '2px solid #4caf50'
                  }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      {/* Student Info */}
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                          <PersonIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="h6" sx={{
                            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                          }}>
                            {message.submittedBy?.fullName}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <EmailIcon fontSize="small" />
                            <Typography variant="caption">
                              {message.submittedBy?.email}
                            </Typography>
                          </Box>
                          {message.submittedBy?.contactNumber !== 'N/A' && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <PhoneIcon fontSize="small" />
                              <Typography variant="caption">
                                {message.submittedBy?.contactNumber}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </Box>

                      <Divider sx={{ mb: 2 }} />

                      {/* Message Content */}
                      <Typography variant="subtitle1" gutterBottom sx={{
                        fontWeight: 'bold',
                        color: 'primary.main'
                      }}>
                        {message.about}
                      </Typography>
                      
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        {message.message}
                      </Typography>

                      {/* Source Links */}
                      {message.sourceLinks && message.sourceLinks.length > 0 && (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="caption" sx={{ display: 'block', mb: 1, fontWeight: 'bold', color: 'primary.main' }}>
                            මූලාශ්‍ර සබැඳි ({message.sourceLinks.length}):
                          </Typography>
                          {message.sourceLinks.map((link, index) => (
                            <Chip
                              key={index}
                              icon={<LinkIcon />}
                              label={`සබැඳිය ${index + 1}`}
                              size="small"
                              sx={{
                                mr: 1,
                                mb: 1,
                                backgroundColor: '#fff3e0',
                                '&:hover': {
                                  backgroundColor: '#ffe0b2'
                                }
                              }}
                              onClick={() => window.open(link, '_blank')}
                              clickable
                            />
                          ))}
                        </Box>
                      )}

                      {/* Attachments */}
                      {message.attachments && message.attachments.length > 0 && (
                        <Box sx={{ mb: 2 }}>
                          {message.attachments.map((attachment, index) => (
                            <Chip
                              key={index}
                              icon={<AttachFileIcon />}
                              label={attachment.originalName || 'ගොනුව'}
                              size="small"
                              sx={{ mr: 1, mb: 1 }}
                              onClick={() => window.open(attachment.url, '_blank')}
                            />
                          ))}
                        </Box>
                      )}
                      
                      {/* Reply */}
                      {message.reply && (
                        <Box sx={{
                          bgcolor: 'grey.100',
                          p: 2,
                          borderRadius: 2,
                          mt: 2
                        }}>
                          <Typography variant="subtitle2" gutterBottom sx={{
                            color: 'primary.main',
                            fontWeight: 'bold'
                          }}>
                            පිළිතුර:
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            {message.reply}
                          </Typography>
                          
                          {message.replyAttachments && message.replyAttachments.length > 0 && (
                            <Box sx={{ mt: 2 }}>
                              <Typography variant="caption" sx={{ display: 'block', mb: 1, fontWeight: 'bold', color: 'primary.main' }}>
                                පිළිතුරු ගොනු ({message.replyAttachments.length}):
                              </Typography>
                              {message.replyAttachments.map((attachment, index) => (
                                <Chip
                                  key={index}
                                  icon={<AttachFileIcon />}
                                  label={attachment.originalName || `ගොනුව ${index + 1}`}
                                  size="small"
                                  sx={{
                                    mr: 1,
                                    mb: 1,
                                    backgroundColor: '#e3f2fd',
                                    '&:hover': {
                                      backgroundColor: '#bbdefb'
                                    }
                                  }}
                                  onClick={() => window.open(attachment.url, '_blank')}
                                  clickable
                                />
                              ))}
                            </Box>
                          )}

                          {/* Reply Source Links */}
                          {message.replySourceLinks && message.replySourceLinks.length > 0 && (
                            <Box sx={{ mt: 2 }}>
                              <Typography variant="caption" sx={{ display: 'block', mb: 1, fontWeight: 'bold', color: 'primary.main' }}>
                                පිළිතුරු මූලාශ්‍ර සබැඳි ({message.replySourceLinks.length}):
                              </Typography>
                              {message.replySourceLinks.map((link, index) => (
                                <Chip
                                  key={index}
                                  icon={<LinkIcon />}
                                  label={`සබැඳිය ${index + 1}`}
                                  size="small"
                                  sx={{
                                    mr: 1,
                                    mb: 1,
                                    backgroundColor: '#f3e5f5',
                                    '&:hover': {
                                      backgroundColor: '#e1bee7'
                                    }
                                  }}
                                  onClick={() => window.open(link, '_blank')}
                                  clickable
                                />
                              ))}
                            </Box>
                          )}

                          <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                            පිළිතුරු දුන් දිනය: {formatDate(message.repliedAt)}
                          </Typography>

                          <Button
                            size="small"
                            startIcon={<EditIcon />}
                            onClick={() => handleOpenEditReplyDialog(message)}
                            sx={{
                              mt: 1,
                              color: 'primary.main',
                              fontSize: '0.75rem'
                            }}
                          >
                            පිළිතුර සංස්කරණය කරන්න
                          </Button>
                        </Box>
                      )}
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                        <ScheduleIcon fontSize="small" sx={{ mr: 1 }} />
                        <Typography variant="caption">
                          {formatDate(message.createdAt)}
                        </Typography>
                      </Box>
                    </CardContent>
                    
                    <CardActions>
                      {!message.reply && (
                        <Button
                          startIcon={<ReplyIcon />}
                          onClick={() => handleOpenReplyDialog(message)}
                          variant="contained"
                          sx={{
                            background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                            '&:hover': {
                              background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)'
                            }
                          }}
                        >
                          පිළිතුරු දෙන්න
                        </Button>
                      )}

                      <Button
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDeleteMessage(message._id)}
                        variant="outlined"
                        color="error"
                        sx={{ ml: 1 }}
                      >
                        මකන්න
                      </Button>
                    </CardActions>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          {messages.length === 0 && (
            <Paper elevation={4} sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
              <Typography variant="h6" color="text.secondary">
                පණිවිඩ නොමැත
              </Typography>
            </Paper>
          )}
        </motion.div>
      </Container>

      {/* Reply Dialog */}
      <Dialog
        open={openReplyDialog}
        onClose={handleCloseReplyDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{
          background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
          color: 'white',
          fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
        }}>
          {isEditingReply ? 'පිළිතුර සංස්කරණය කරන්න' : 'පණිවිඩයට පිළිතුරු දෙන්න'}
          <IconButton
            onClick={handleCloseReplyDialog}
            sx={{ position: 'absolute', right: 8, top: 8, color: 'white' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          {selectedMessage && (
            <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.100', borderRadius: 2 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                මුල් පණිවිඩය:
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>විෂය:</strong> {selectedMessage.about}
              </Typography>
              <Typography variant="body2">
                {selectedMessage.message}
              </Typography>
            </Box>
          )}

          <TextField
            fullWidth
            label="ඔබේ පිළිතුර"
            value={replyData.reply}
            onChange={(e) => setReplyData(prev => ({ ...prev, reply: e.target.value }))}
            multiline
            rows={4}
            required
            sx={{ mb: 3 }}
          />

          <Typography variant="subtitle1" gutterBottom>
            ගොනු (විකල්ප)
          </Typography>
          <input
            type="file"
            multiple
            accept="image/*,.pdf"
            onChange={(e) => handleFileUpload(e.target.files)}
            style={{ marginBottom: 16 }}
          />

          {replyData.replyAttachments && replyData.replyAttachments.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" sx={{ display: 'block', mb: 1, fontWeight: 'bold' }}>
                අමුණා ගත් ගොනු ({replyData.replyAttachments.length}):
              </Typography>
              {replyData.replyAttachments.map((attachment, index) => (
                <Chip
                  key={index}
                  label={attachment.originalName || `ගොනුව ${index + 1}`}
                  onDelete={() => removeReplyAttachment(index)}
                  sx={{
                    mr: 1,
                    mb: 1,
                    backgroundColor: '#f3e5f5',
                    '&:hover': {
                      backgroundColor: '#e1bee7'
                    }
                  }}
                  onClick={() => window.open(attachment.url, '_blank')}
                />
              ))}
            </Box>
          )}

          <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
            මූලාශ්‍ර සබැඳි (විකල්ප)
          </Typography>
          {replyData.replySourceLinks.map((link, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <TextField
                fullWidth
                label={`සබැඳිය ${index + 1}`}
                value={link}
                onChange={(e) => handleReplySourceLinkChange(index, e.target.value)}
                placeholder="https://example.com"
                sx={{ mr: 1 }}
              />
              {replyData.replySourceLinks.length > 1 && (
                <IconButton onClick={() => removeReplySourceLink(index)}>
                  <CloseIcon />
                </IconButton>
              )}
            </Box>
          ))}
          <Button onClick={addReplySourceLink} startIcon={<AddIcon />} sx={{ mb: 2 }}>
            සබැඳියක් එක් කරන්න
          </Button>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseReplyDialog}>
            අවලංගු කරන්න
          </Button>
          <Button
            onClick={handleSubmitReply}
            variant="contained"
            disabled={submitting}
            sx={{
              background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)'
              }
            }}
          >
            {submitting ? <CircularProgress size={20} /> : (isEditingReply ? 'පිළිතුර යාවත්කාලීන කරන්න' : 'පිළිතුර යවන්න')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminStudentMessageManagement;
