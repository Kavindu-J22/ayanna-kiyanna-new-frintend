import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  Grid,
  Paper
} from '@mui/material';
import {
  Close as CloseIcon,
  InsertDriveFile as FileIcon,
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  PictureAsPdf as PdfIcon,
  Image as ImageIcon,
  Link as LinkIcon,
  Add as AddLinkIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const CreateFileDialog = ({ open, onClose, folderId, onFileCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    attachments: [],
    sourceLinks: []
  });
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  };

  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        // Validate file type
        const isValidType = file.type.startsWith('image/') || file.type === 'application/pdf';
        if (!isValidType) {
          throw new Error('Only images and PDF files are allowed');
        }

        // Validate file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
          throw new Error('File size must be less than 10MB');
        }

        const uploadFormData = new FormData();
        uploadFormData.append('file', file);
        uploadFormData.append('upload_preset', 'ml_default');

        const response = await fetch(
          'https://api.cloudinary.com/v1_1/dl9k5qoae/auto/upload',
          {
            method: 'POST',
            body: uploadFormData
          }
        );

        const data = await response.json();
        return {
          url: data.secure_url,
          publicId: data.public_id,
          title: file.name,
          description: '',
          name: file.name,
          type: file.type.startsWith('image/') ? 'image' : 'pdf',
          size: file.size
        };
      });

      const uploadedFiles = await Promise.all(uploadPromises);
      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...uploadedFiles]
      }));
    } catch (error) {
      console.error('Error uploading files:', error);
      setError('Error uploading files: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveAttachment = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleAttachmentUpdate = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.map((att, i) =>
        i === index ? { ...att, [field]: value } : att
      )
    }));
  };

  const handleAddSourceLink = () => {
    setFormData(prev => ({
      ...prev,
      sourceLinks: [...prev.sourceLinks, { title: '', url: '', description: '' }]
    }));
  };

  const handleRemoveSourceLink = (index) => {
    setFormData(prev => ({
      ...prev,
      sourceLinks: prev.sourceLinks.filter((_, i) => i !== index)
    }));
  };

  const handleSourceLinkUpdate = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      sourceLinks: prev.sourceLinks.map((link, i) =>
        i === index ? { ...link, [field]: value } : link
      )
    }));
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      setError('කරුණාකර සියලුම අනිවාර්ය ක්ෂේත්‍ර පුරවන්න');
      return;
    }

    // Validate source links
    for (const link of formData.sourceLinks) {
      if (link.title && link.title.trim() && (!link.url || !link.url.trim())) {
        setError('සබැඳි නම ඇති සියලුම සබැඳි සඳහා URL අවශ්‍යයි');
        return;
      }
      if (link.url && link.url.trim() && (!link.title || !link.title.trim())) {
        setError('URL ඇති සියලුම සබැඳි සඳහා නම අවශ්‍යයි');
        return;
      }
      if (link.url && link.url.trim() && !link.url.match(/^https?:\/\/.+/)) {
        setError('කරුණාකර වලංගු URL ඇතුළත් කරන්න (http:// හෝ https:// සමඟ)');
        return;
      }
      if (link.title && link.title.length > 100) {
        setError('සබැඳි නම 100 අක්ෂරවලට වඩා අඩු විය යුතුය');
        return;
      }
      if (link.description && link.description.length > 200) {
        setError('සබැඳි විස්තරය 200 අක්ෂරවලට වඩා අඩු විය යුතුය');
        return;
      }
    }

    // Filter out empty source links
    const validSourceLinks = formData.sourceLinks.filter(link =>
      link.title && link.title.trim() && link.url && link.url.trim()
    );

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'https://ayanna-kiyanna-new-backend.onrender.com/api/grammar/files',
        {
          ...formData,
          sourceLinks: validSourceLinks,
          folderId
        },
        { headers: { 'x-auth-token': token } }
      );

      if (response.data.success) {
        onFileCreated(response.data.data);
        setFormData({
          title: '',
          description: '',
          content: '',
          attachments: [],
          sourceLinks: []
        });
        setError('');
      }
    } catch (err) {
      console.error('Error creating file:', err);
      const errorMessage = err.response?.data?.message || 'Error creating file';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      content: '',
      attachments: [],
      sourceLinks: []
    });
    setError('');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
        color: '#2C3E50'
      }}>
        <Box display="flex" alignItems="center" gap={2}>
          <FileIcon sx={{ color: '#E91E63' }} />
          නව ගොනුවක් නිර්මාණය කරන්න
        </Box>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          fullWidth
          label="ගොනු නම *"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          margin="normal"
          variant="outlined"
          sx={{
            '& .MuiInputLabel-root': {
              fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
            }
          }}
        />

        <TextField
          fullWidth
          label="විස්තරය *"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          margin="normal"
          variant="outlined"
          multiline
          rows={3}
          sx={{
            '& .MuiInputLabel-root': {
              fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
            }
          }}
        />

        <TextField
          fullWidth
          label="අන්තර්ගතය (විකල්ප)"
          value={formData.content}
          onChange={(e) => handleInputChange('content', e.target.value)}
          margin="normal"
          variant="outlined"
          multiline
          rows={4}
          sx={{
            '& .MuiInputLabel-root': {
              fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
            }
          }}
        />

        {/* File Upload Section */}
        <Box sx={{ mt: 3 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
              color: '#2C3E50'
            }}
          >
            ගොනු අමුණන්න (විකල්ප)
          </Typography>

          <Paper
            elevation={2}
            sx={{
              p: 3,
              border: '2px dashed #E91E63',
              borderRadius: 2,
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: '#C2185B',
                bgcolor: 'rgba(233, 30, 99, 0.05)'
              }
            }}
            onClick={() => document.getElementById('file-upload').click()}
          >
            <input
              id="file-upload"
              type="file"
              multiple
              accept="image/*,.pdf"
              style={{ display: 'none' }}
              onChange={(e) => handleFileUpload(e.target.files)}
            />
            
            <UploadIcon sx={{ fontSize: 48, color: '#E91E63', mb: 1 }} />
            <Typography
              variant="body1"
              sx={{
                fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
                color: '#2C3E50'
              }}
            >
              ගොනු තෝරන්න හෝ මෙහි ඇද දමන්න
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
              }}
            >
              (පින්තූර සහ PDF ගොනු පමණක්, උපරිම 10MB)
            </Typography>
          </Paper>

          {uploading && (
            <Box display="flex" justifyContent="center" mt={2}>
              <CircularProgress size={30} sx={{ color: '#E91E63' }} />
            </Box>
          )}
        </Box>

        {/* Attachments List */}
        {formData.attachments.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                color: '#2C3E50'
              }}
            >
              අමුණන ලද ගොනු
            </Typography>

            <Grid container spacing={2}>
              <AnimatePresence>
                {formData.attachments.map((attachment, index) => (
                  <Grid item xs={12} key={index}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card elevation={2}>
                        <CardContent sx={{ p: 2 }}>
                          <Box display="flex" alignItems="center" gap={2}>
                            {attachment.type === 'pdf' ? (
                              <PdfIcon sx={{ color: '#F44336' }} />
                            ) : (
                              <ImageIcon sx={{ color: '#4CAF50' }} />
                            )}
                            
                            <Box flexGrow={1}>
                              <TextField
                                fullWidth
                                size="small"
                                label="ගොනු නම"
                                value={attachment.title}
                                onChange={(e) => handleAttachmentUpdate(index, 'title', e.target.value)}
                                sx={{ mb: 1 }}
                              />
                              <TextField
                                fullWidth
                                size="small"
                                label="විස්තරය"
                                value={attachment.description}
                                onChange={(e) => handleAttachmentUpdate(index, 'description', e.target.value)}
                              />
                            </Box>
                            
                            <IconButton
                              onClick={() => handleRemoveAttachment(index)}
                              sx={{ color: '#F44336' }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </AnimatePresence>
            </Grid>
          </Box>
        )}

        {/* Source Links Section */}
        <Box sx={{ mt: 3 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Typography
              variant="h6"
              sx={{
                fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                color: '#2C3E50'
              }}
            >
              මූලාශ්‍ර සබැඳි (විකල්ප)
            </Typography>
            <Button
              variant="outlined"
              size="small"
              startIcon={<AddLinkIcon />}
              onClick={handleAddSourceLink}
              sx={{
                borderColor: '#E91E63',
                color: '#E91E63',
                fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                '&:hover': {
                  borderColor: '#C2185B',
                  color: '#C2185B'
                }
              }}
            >
              සබැඳියක් එක් කරන්න
            </Button>
          </Box>

          {formData.sourceLinks.length > 0 && (
            <Grid container spacing={2}>
              <AnimatePresence>
                {formData.sourceLinks.map((link, index) => (
                  <Grid item xs={12} key={index}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card elevation={2}>
                        <CardContent sx={{ p: 2 }}>
                          <Box display="flex" alignItems="center" gap={2} mb={2}>
                            <LinkIcon sx={{ color: '#E91E63' }} />
                            <Typography
                              variant="subtitle2"
                              sx={{
                                fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                                color: '#2C3E50'
                              }}
                            >
                              සබැඳිය #{index + 1}
                            </Typography>
                            <Box flexGrow={1} />
                            <IconButton
                              size="small"
                              onClick={() => handleRemoveSourceLink(index)}
                              sx={{ color: '#F44336' }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>

                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                size="small"
                                label="සබැඳි නම *"
                                value={link.title}
                                onChange={(e) => handleSourceLinkUpdate(index, 'title', e.target.value)}
                                sx={{
                                  '& .MuiInputLabel-root': {
                                    fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
                                  }
                                }}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                size="small"
                                label="URL *"
                                value={link.url}
                                onChange={(e) => handleSourceLinkUpdate(index, 'url', e.target.value)}
                                placeholder="https://example.com"
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <TextField
                                fullWidth
                                size="small"
                                label="විස්තරය"
                                value={link.description}
                                onChange={(e) => handleSourceLinkUpdate(index, 'description', e.target.value)}
                                sx={{
                                  '& .MuiInputLabel-root': {
                                    fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
                                  }
                                }}
                              />
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </AnimatePresence>
            </Grid>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button
          onClick={handleClose}
          sx={{
            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
          }}
        >
          අවලංගු කරන්න
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={submitting || uploading}
          sx={{
            bgcolor: '#E91E63',
            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
            '&:hover': {
              bgcolor: '#C2185B'
            }
          }}
        >
          {submitting ? <CircularProgress size={20} color="inherit" /> : 'නිර්මාණය කරන්න'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateFileDialog;
