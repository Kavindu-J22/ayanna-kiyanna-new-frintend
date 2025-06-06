import React, { useState, useEffect } from 'react';
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
  CircularProgress
} from '@mui/material';
import {
  Close as CloseIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import axios from 'axios';

const EditGradeFileDialog = ({ open, onClose, file, gradeCategory, onFileUpdated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    attachments: [],
    sourceLinks: []
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Grade category configurations
  const gradeConfigs = {
    'grade-9': { color: '#3498db' },
    'grade-10': { color: '#e74c3c' },
    'grade-11': { color: '#f39c12' },
    'a-level': { color: '#9b59b6' },
    'sinhala-literature': { color: '#1abc9c' }
  };

  const currentConfig = gradeConfigs[gradeCategory] || gradeConfigs['grade-9'];

  useEffect(() => {
    if (file) {
      setFormData({
        title: file.title || '',
        description: file.description || '',
        content: file.content || '',
        attachments: file.attachments || [],
        sourceLinks: file.sourceLinks || []
      });
    }
  }, [file]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      setError('කරුණාකර සියලුම අනිවාර්ය ක්ෂේත්‍ර පුරවන්න');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/grades/files/${file._id}`,
        formData,
        { headers: { 'x-auth-token': token } }
      );

      if (response.data.success) {
        onFileUpdated(response.data.data);
        setError('');
      }
    } catch (err) {
      console.error('Error updating file:', err);
      const errorMessage = err.response?.data?.message || 'Error updating file';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
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
          background: `linear-gradient(135deg, ${currentConfig.color}20 0%, ${currentConfig.color}10 100%)`,
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
          <EditIcon sx={{ color: '#FF9800' }} />
          ගොනුව සංස්කරණය කරන්න
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
          disabled={submitting}
          sx={{
            bgcolor: '#FF9800',
            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
            '&:hover': {
              bgcolor: '#F57C00'
            }
          }}
        >
          {submitting ? <CircularProgress size={20} color="inherit" /> : 'යාවත්කාලීන කරන්න'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditGradeFileDialog;
