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
  Fab,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  AttachFile as AttachFileIcon,
  Link as LinkIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const AdminStudentNoticeManagement = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    content2: '',
    attachments: [],
    sourceLinks: ['']
  });

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'https://ayanna-kiyanna-new-backend.onrender.com/api/student-notices',
        { headers: { 'x-auth-token': token } }
      );

      if (response.data.success) {
        setNotices(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching notices:', err);
      setError('නිවේදන ලබා ගැනීමේදී දෝෂයක් ඇතිවිය');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (notice = null) => {
    if (notice) {
      setSelectedNotice(notice);
      setFormData({
        title: notice.title,
        content: notice.content,
        content2: notice.content2 || '',
        attachments: notice.attachments || [],
        sourceLinks: notice.sourceLinks.length > 0 ? notice.sourceLinks : ['']
      });
      setIsEditing(true);
    } else {
      setSelectedNotice(null);
      setFormData({
        title: '',
        content: '',
        content2: '',
        attachments: [],
        sourceLinks: ['']
      });
      setIsEditing(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedNotice(null);
    setError('');
    setSuccess('');
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSourceLinkChange = (index, value) => {
    const newLinks = [...formData.sourceLinks];
    newLinks[index] = value;
    setFormData(prev => ({
      ...prev,
      sourceLinks: newLinks
    }));
  };

  const addSourceLink = () => {
    setFormData(prev => ({
      ...prev,
      sourceLinks: [...prev.sourceLinks, '']
    }));
  };

  const removeSourceLink = (index) => {
    const newLinks = formData.sourceLinks.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      sourceLinks: newLinks.length > 0 ? newLinks : ['']
    }));
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
      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...uploadedFiles]
      }));
    } catch (error) {
      setError('ගොනු උඩුගත කිරීමේදී දෝෂයක් ඇතිවිය');
    }
  };

  const removeAttachment = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      setError('මාතෘකාව සහ අන්තර්ගතය අවශ්‍ය වේ');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const submitData = {
        ...formData,
        sourceLinks: formData.sourceLinks.filter(link => link.trim() !== '')
      };

      let response;
      if (isEditing) {
        response = await axios.put(
          `https://ayanna-kiyanna-new-backend.onrender.com/api/student-notices/${selectedNotice._id}`,
          submitData,
          { headers: { 'x-auth-token': token } }
        );
      } else {
        response = await axios.post(
          'https://ayanna-kiyanna-new-backend.onrender.com/api/student-notices',
          submitData,
          { headers: { 'x-auth-token': token } }
        );
      }

      if (response.data.success) {
        setSuccess(isEditing ? 'නිවේදනය සාර්ථකව යාවත්කාලීන කරන ලදී' : 'නිවේදනය සාර්ථකව නිර්මාණය කරන ලදී');
        fetchNotices();
        handleCloseDialog();
      }
    } catch (err) {
      console.error('Error submitting notice:', err);
      setError('නිවේදනය සුරැකීමේදී දෝෂයක් ඇතිවිය');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (noticeId) => {
    if (!window.confirm('ඔබට මෙම නිවේදනය මකා දැමීමට අවශ්‍යද?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/student-notices/${noticeId}`,
        { headers: { 'x-auth-token': token } }
      );

      if (response.data.success) {
        setSuccess('නිවේදනය සාර්ථකව මකා දමන ලදී');
        fetchNotices();
      }
    } catch (err) {
      console.error('Error deleting notice:', err);
      setError('නිවේදනය මකා දැමීමේදී දෝෂයක් ඇතිවිය');
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
              සිසුන් සඳහා විශේෂ නිවේදන කළමනාකරණය
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

          {/* Notices Grid */}
          <Grid container spacing={3}>
            {notices.map((notice) => (
              <Grid item xs={12} md={6} lg={4} key={notice._id}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 3,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                  }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" gutterBottom sx={{
                        fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                        fontWeight: 'bold'
                      }}>
                        {notice.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {notice.content.substring(0, 150)}...
                      </Typography>
                      
                      {notice.attachments && notice.attachments.length > 0 && (
                        <Chip
                          icon={<AttachFileIcon />}
                          label={`${notice.attachments.length} ගොනු`}
                          size="small"
                          sx={{ mr: 1, mb: 1 }}
                        />
                      )}
                      
                      {notice.sourceLinks && notice.sourceLinks.length > 0 && (
                        <Chip
                          icon={<LinkIcon />}
                          label={`${notice.sourceLinks.length} සබැඳි`}
                          size="small"
                          sx={{ mr: 1, mb: 1 }}
                        />
                      )}
                      
                      <Typography variant="caption" display="block" sx={{ mt: 2 }}>
                        නිර්මාණය: {new Date(notice.createdAt).toLocaleDateString('si-LK')}
                      </Typography>
                    </CardContent>
                    
                    <CardActions>
                      <Tooltip title="සංස්කරණය">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(notice)}
                          sx={{ color: 'primary.main' }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="මකා දමන්න">
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(notice._id)}
                          sx={{ color: 'error.main' }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </CardActions>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          {/* Add Button */}
          <Fab
            color="primary"
            aria-label="add"
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16,
              background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)'
            }}
            onClick={() => handleOpenDialog()}
          >
            <AddIcon />
          </Fab>
        </motion.div>
      </Container>

      {/* Create/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
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
          {isEditing ? 'නිවේදනය සංස්කරණය කරන්න' : 'නව නිවේදනයක් නිර්මාණය කරන්න'}
          <IconButton
            onClick={handleCloseDialog}
            sx={{ position: 'absolute', right: 8, top: 8, color: 'white' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="මාතෘකාව"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="අන්තර්ගතය"
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                multiline
                rows={4}
                required
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="අන්තර්ගතය 2 (විකල්ප)"
                value={formData.content2}
                onChange={(e) => handleInputChange('content2', e.target.value)}
                multiline
                rows={3}
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid item xs={12}>
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

              {formData.attachments.map((attachment, index) => (
                <Chip
                  key={index}
                  label={attachment.originalName || 'ගොනුව'}
                  onDelete={() => removeAttachment(index)}
                  sx={{ mr: 1, mb: 1 }}
                />
              ))}
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                මූලාශ්‍ර සබැඳි (විකල්ප)
              </Typography>
              {formData.sourceLinks.map((link, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TextField
                    fullWidth
                    label={`සබැඳිය ${index + 1}`}
                    value={link}
                    onChange={(e) => handleSourceLinkChange(index, e.target.value)}
                    sx={{ mr: 1 }}
                  />
                  {formData.sourceLinks.length > 1 && (
                    <IconButton onClick={() => removeSourceLink(index)}>
                      <CloseIcon />
                    </IconButton>
                  )}
                </Box>
              ))}
              <Button onClick={addSourceLink} startIcon={<AddIcon />}>
                සබැඳියක් එක් කරන්න
              </Button>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog}>
            අවලංගු කරන්න
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={submitting}
            sx={{
              background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)'
              }
            }}
          >
            {submitting ? <CircularProgress size={20} /> : (isEditing ? 'යාවත්කාලීන කරන්න' : 'නිර්මාණය කරන්න')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminStudentNoticeManagement;
