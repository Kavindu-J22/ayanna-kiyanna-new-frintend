import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  Paper
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Link as LinkIcon
} from '@mui/icons-material';
import axios from 'axios';

const EditPaperDialog = ({ open, onClose, paper, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    grade: '',
    paperType: '',
    paperYear: '',
    paperPart: '',
    attachments: [],
    sourceLinks: []
  });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [newSourceLink, setNewSourceLink] = useState({ title: '', url: '' });

  const gradeOptions = ['Grade 9', 'Grade 10', 'Grade 11', 'A/L', 'සිංහල සාහිත්‍ය (කාණ්ඩ විෂය)'];
  const paperTypeOptions = ['Past Paper', 'Model Paper', 'Other'];
  const paperPartOptions = ['Part 1', 'Part 2', 'Part 3', 'Full Paper', 'Other'];

  useEffect(() => {
    if (paper && open) {
      setFormData({
        title: paper.title || '',
        description: paper.description || '',
        grade: paper.grade || '',
        paperType: paper.paperType || '',
        paperYear: paper.paperYear || '',
        paperPart: paper.paperPart || '',
        attachments: paper.attachments || [],
        sourceLinks: paper.sourceLinks || []
      });
    }
  }, [paper, open]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const isValidType = file.type.startsWith('image/') || file.type === 'application/pdf';
        if (!isValidType) {
          throw new Error('Only images and PDF files are allowed');
        }

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

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const data = await response.json();
        return {
          url: data.secure_url,
          publicId: data.public_id,
          originalName: file.name,
          fileType: file.type,
          fileSize: file.size
        };
      });

      const uploadedFiles = await Promise.all(uploadPromises);
      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...uploadedFiles]
      }));
    } catch (err) {
      setError(err.message || 'File upload failed');
    } finally {
      setUploading(false);
    }
  };

  const removeAttachment = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const addSourceLink = () => {
    if (newSourceLink.title.trim() && newSourceLink.url.trim()) {
      setFormData(prev => ({
        ...prev,
        sourceLinks: [...prev.sourceLinks, { ...newSourceLink }]
      }));
      setNewSourceLink({ title: '', url: '' });
    }
  };

  const removeSourceLink = (index) => {
    setFormData(prev => ({
      ...prev,
      sourceLinks: prev.sourceLinks.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    try {
      setError('');
      
      if (!formData.title.trim()) {
        setError('ප්‍රශ්න පත්‍ර නම අවශ්‍ය වේ');
        return;
      }
      if (!formData.grade) {
        setError('ශ්‍රේණිය තෝරන්න');
        return;
      }
      if (!formData.paperType) {
        setError('ප්‍රශ්න පත්‍ර වර්ගය තෝරන්න');
        return;
      }
      if (!formData.paperYear.trim()) {
        setError('වර්ෂය ඇතුළත් කරන්න');
        return;
      }
      if (!formData.paperPart) {
        setError('කොටස තෝරන්න');
        return;
      }

      // Check if at least one attachment or source link exists
      const hasAttachments = formData.attachments && formData.attachments.length > 0;
      const hasSourceLinks = formData.sourceLinks && formData.sourceLinks.length > 0;

      if (!hasAttachments && !hasSourceLinks) {
        setError('අවම වශයෙන් එක් ගොනුවක් හෝ මූලාශ්‍ර සම්බන්ධකයක් අවශ්‍ය වේ');
        return;
      }

      const token = localStorage.getItem('token');
      const response = await axios.put(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/paperbank/${paper._id}`,
        formData,
        {
          headers: { 'x-auth-token': token }
        }
      );

      if (response.data.success) {
        onSuccess();
        handleClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating paper');
    }
  };

  const handleClose = () => {
    setNewSourceLink({ title: '', url: '' });
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
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
        }
      }}
    >
      <DialogTitle sx={{
        fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        textAlign: 'center',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        py: 3,
        position: 'relative',
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #ff6b6b 0%, #feca57 50%, #48dbfb 100%)'
        }
      }}>
        ප්‍රශ්න පත්‍රය සංස්කරණය කරන්න
      </DialogTitle>
      
      <DialogContent sx={{
        mt: 2,
        background: 'linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%)',
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: '#f1f1f1',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
        }
      }}>
        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 2,
              borderRadius: 2,
              '& .MuiAlert-message': {
                fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
              }
            }}
          >
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Paper elevation={2} sx={{
              p: 2,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #e8f0ff 0%, #f0f8ff 100%)',
              border: '1px solid rgba(102, 126, 234, 0.2)'
            }}>
              <Typography variant="h6" sx={{
                fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                mb: 2,
                color: '#667eea',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                '&::before': {
                  content: '"📝"',
                  marginRight: 1,
                  fontSize: '1.2rem'
                }
              }}>
                මූලික තොරතුරු
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="ප්‍රශ්න පත්‍ර නම *"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              sx={{
                minWidth: 200,
                '& .MuiInputLabel-root': {
                  fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
                },
                '& .MuiInputBase-input': {
                  fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
                }
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} sx={{ mt: 2 }}>
            <FormControl fullWidth sx={{ minWidth: 200 }}>
              <InputLabel sx={{
                fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
              }}>
                ශ්‍රේණිය *
              </InputLabel>
              <Select
                value={formData.grade}
                label="ශ්‍රේණිය *"
                onChange={(e) => handleInputChange('grade', e.target.value)}
                sx={{
                  '& .MuiSelect-select': {
                    fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
                  }
                }}
              >
                {gradeOptions.map(grade => (
                  <MenuItem key={grade} value={grade} sx={{
                    fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
                  }}>
                    {grade}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth sx={{ minWidth: 200 }}>
              <InputLabel sx={{
                fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
              }}>
                ප්‍රශ්න පත්‍ර වර්ගය *
              </InputLabel>
              <Select
                value={formData.paperType}
                label="ප්‍රශ්න පත්‍ර වර්ගය *"
                onChange={(e) => handleInputChange('paperType', e.target.value)}
                sx={{
                  '& .MuiSelect-select': {
                    fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
                  }
                }}
              >
                {paperTypeOptions.map(type => (
                  <MenuItem key={type} value={type} sx={{
                    fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
                  }}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="වර්ෂය *"
              value={formData.paperYear}
              onChange={(e) => handleInputChange('paperYear', e.target.value)}
              placeholder="උදා: 2023"
              sx={{
                '& .MuiInputLabel-root': {
                  fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
                }
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel sx={{
                fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
              }}>
                කොටස *
              </InputLabel>
              <Select
                value={formData.paperPart}
                label="කොටස *"
                onChange={(e) => handleInputChange('paperPart', e.target.value)}
              >
                {paperPartOptions.map(part => (
                  <MenuItem key={part} value={part}>{part}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="විස්තරය (විකල්ප)"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              sx={{
                '& .MuiInputLabel-root': {
                  fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
                }
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Paper elevation={2} sx={{
              p: 2,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #fff5e6 0%, #ffe6cc 100%)',
              border: '1px solid rgba(255, 165, 0, 0.2)'
            }}>
              <Typography variant="h6" sx={{
                fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                mb: 2,
                color: '#ff8c00',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                '&::before': {
                  content: '"📎"',
                  marginRight: 1,
                  fontSize: '1.2rem'
                }
              }}>
                ගොනු අමුණන්න (විකල්ප)
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                textAlign: 'center',
                border: '2px dashed #ccc',
                cursor: 'pointer',
                '&:hover': {
                  borderColor: '#667eea'
                }
              }}
              onClick={() => document.getElementById('file-upload-edit').click()}
            >
              <input
                id="file-upload-edit"
                type="file"
                multiple
                accept="image/*,.pdf"
                style={{ display: 'none' }}
                onChange={(e) => handleFileUpload(e.target.files)}
              />
              
              {uploading ? (
                <CircularProgress />
              ) : (
                <>
                  <CloudUploadIcon sx={{ fontSize: 48, color: '#667eea', mb: 1 }} />
                  <Typography sx={{
                    fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
                  }}>
                    ගොනු තෝරන්න හෝ මෙහි ඇද දමන්න
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    PDF සහ රූප ගොනු පමණක් (උපරිම 10MB)
                  </Typography>
                  <Typography variant="caption" color="primary" sx={{ display: 'block', mt: 1 }}>
                    * අවම වශයෙන් එක් ගොනුවක් හෝ මූලාශ්‍ර සම්බන්ධකයක් අවශ්‍ය වේ
                  </Typography>
                </>
              )}
            </Paper>

            {formData.attachments.length > 0 && (
              <Box sx={{ mt: 2 }}>
                {formData.attachments.map((file, index) => (
                  <Chip
                    key={index}
                    label={file.originalName}
                    onDelete={() => removeAttachment(index)}
                    deleteIcon={<DeleteIcon />}
                    sx={{ m: 0.5 }}
                  />
                ))}
              </Box>
            )}
          </Grid>

          <Grid item xs={12}>
            <Paper elevation={2} sx={{
              p: 2,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #e6f7ff 0%, #ccf2ff 100%)',
              border: '1px solid rgba(0, 191, 255, 0.2)'
            }}>
              <Typography variant="h6" sx={{
                fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                mb: 2,
                color: '#00bfff',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                '&::before': {
                  content: '"🔗"',
                  marginRight: 1,
                  fontSize: '1.2rem'
                }
              }}>
                මූලාශ්‍ර සම්බන්ධක (විකල්ප)
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12}>

            <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
              <TextField
                label="සම්බන්ධක නම"
                value={newSourceLink.title}
                onChange={(e) => setNewSourceLink(prev => ({ ...prev, title: e.target.value }))}
                sx={{
                  flex: 1,
                  minWidth: 200,
                  '& .MuiInputLabel-root': {
                    fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
                  },
                  '& .MuiInputBase-input': {
                    fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
                  }
                }}
              />
              <TextField
                label="URL"
                value={newSourceLink.url}
                onChange={(e) => setNewSourceLink(prev => ({ ...prev, url: e.target.value }))}
                sx={{
                  flex: 1,
                  minWidth: 200,
                  '& .MuiInputLabel-root': {
                    fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
                  },
                  '& .MuiInputBase-input': {
                    fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
                  }
                }}
              />
              <Button
                variant="outlined"
                onClick={addSourceLink}
                startIcon={<AddIcon />}
                disabled={!newSourceLink.title.trim() || !newSourceLink.url.trim()}
                sx={{
                  fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                  borderColor: '#667eea',
                  color: '#667eea',
                  minWidth: 120,
                  '&:hover': {
                    borderColor: '#5a67d8',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)'
                  }
                }}
              >
                එක් කරන්න
              </Button>
            </Box>

            {formData.sourceLinks.length > 0 && (
              <Box>
                {formData.sourceLinks.map((link, index) => (
                  <Chip
                    key={index}
                    icon={<LinkIcon />}
                    label={link.title}
                    onDelete={() => removeSourceLink(index)}
                    deleteIcon={<DeleteIcon />}
                    sx={{ m: 0.5 }}
                  />
                ))}
              </Box>
            )}
          </Grid>
        </Grid>
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
          onClick={handleSubmit}
          variant="contained"
          disabled={uploading}
          sx={{
            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }}
        >
          {uploading ? 'උඩුගත කරමින්...' : 'යාවත්කාලීන කරන්න'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditPaperDialog;
