import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  IconButton,
  Alert,
  CircularProgress,
  Chip,
  FormControlLabel,
  Switch,
  Divider
} from '@mui/material';
import {
  ArrowBack,
  Add,
  Delete,
  CloudUpload,
  AttachFile,
  Schedule
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { motion } from 'framer-motion';
import axios from 'axios';

const CreateAssignment = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [classData, setClassData] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tasks: [],
    attachments: [],
    guidelines: [],
    dueDate: null,
    isPublished: false
  });

  useEffect(() => {
    fetchClassData();
  }, [classId]);

  const fetchClassData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/classes/${classId}`,
        { headers: { 'x-auth-token': token } }
      );
      setClassData(response.data);
    } catch (error) {
      console.error('Error fetching class data:', error);
      setError('Error loading class data');
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddTask = () => {
    setFormData(prev => ({
      ...prev,
      tasks: [...prev.tasks, { taskNumber: prev.tasks.length + 1, taskDescription: '' }]
    }));
  };

  const handleTaskChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      tasks: prev.tasks.map((task, i) => 
        i === index ? { ...task, taskDescription: value } : task
      )
    }));
  };

  const handleRemoveTask = (index) => {
    setFormData(prev => ({
      ...prev,
      tasks: prev.tasks.filter((_, i) => i !== index).map((task, i) => ({
        ...task,
        taskNumber: i + 1
      }))
    }));
  };

  const handleAddGuideline = () => {
    setFormData(prev => ({
      ...prev,
      guidelines: [...prev.guidelines, { guidelineNumber: prev.guidelines.length + 1, guidelineText: '' }]
    }));
  };

  const handleGuidelineChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      guidelines: prev.guidelines.map((guideline, i) => 
        i === index ? { ...guideline, guidelineText: value } : guideline
      )
    }));
  };

  const handleRemoveGuideline = (index) => {
    setFormData(prev => ({
      ...prev,
      guidelines: prev.guidelines.filter((_, i) => i !== index).map((guideline, i) => ({
        ...guideline,
        guidelineNumber: i + 1
      }))
    }));
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setError('Only PDF and image files are allowed');
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('upload_preset', 'ml_default');
      uploadFormData.append('cloud_name', 'dl9k5qoae');

      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dl9k5qoae/auto/upload',
        uploadFormData
      );

      const newAttachment = {
        url: response.data.secure_url,
        publicId: response.data.public_id,
        name: file.name,
        type: file.type.includes('pdf') ? 'pdf' : 'image',
        size: file.size
      };

      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, newAttachment]
      }));

      setSuccess('File uploaded successfully!');
    } catch (error) {
      console.error('Error uploading file:', error);
      setError('Error uploading file. Please try again.');
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Title and description are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');

      // Prepare submit data with proper date handling
      let dueDate = null;
      if (formData.dueDate) {
        try {
          dueDate = formData.dueDate instanceof Date ? formData.dueDate.toISOString() : formData.dueDate;
        } catch (dateError) {
          console.error('Date conversion error:', dateError);
          dueDate = null;
        }
      }

      const submitData = {
        ...formData,
        classId,
        tasks: formData.tasks.filter(task => task.taskDescription && task.taskDescription.trim()),
        guidelines: formData.guidelines.filter(guideline => guideline.guidelineText && guideline.guidelineText.trim()),
        dueDate
      };

      await axios.post(
        'https://ayanna-kiyanna-new-backend.onrender.com/api/assignments',
        submitData,
        { headers: { 'x-auth-token': token } }
      );

      setSuccess('Assignment created successfully!');

      setTimeout(() => {
        navigate(`/admin-assignments/${classId}`);
      }, 2000);

    } catch (error) {
      console.error('Error creating assignment:', error);
      setError(error.response?.data?.message || 'Error creating assignment');

      // Log the full error for debugging
      if (error.response?.data?.errors) {
        console.error('Validation errors:', error.response.data.errors);
        setError(`Validation errors: ${error.response.data.errors.map(e => e.msg).join(', ')}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
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
              <IconButton onClick={() => navigate(`/admin-assignments/${classId}`)} color="primary">
                <ArrowBack />
              </IconButton>
              <Typography variant="h4" fontWeight="bold" sx={{
                fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
              }}>
                නව පැවරුමක් සාදන්න
              </Typography>
            </Box>
            
            {classData && (
              <Chip 
                label={`${classData.title} - ${classData.grade} ශ්‍රේණිය`}
                color="primary"
                variant="outlined"
              />
            )}
          </Paper>

          {/* Error/Success Messages */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
              {success}
            </Alert>
          )}

          {/* Form */}
          <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* Basic Information */}
                <Grid item xs={12}>
                  <Typography variant="h6" fontWeight="bold" sx={{
                    fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                    mb: 2
                  }}>
                    මූලික තොරතුරු
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="පැවරුම් මාතෘකාව *"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    required
                    inputProps={{ maxLength: 200 }}
                    helperText={`${formData.title.length}/200 අක්ෂර`}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="පැවරුම් විස්තරය *"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    required
                    inputProps={{ maxLength: 2000 }}
                    helperText={`${formData.description.length}/2000 අක්ෂර`}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <DateTimePicker
                    label="අවසන් දිනය (විකල්ප)"
                    value={formData.dueDate}
                    onChange={(newValue) => handleInputChange('dueDate', newValue)}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </Grid>

                {/* <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.isPublished}
                        onChange={(e) => handleInputChange('isPublished', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="දැන්ම ප්‍රකාශ කරන්න"
                  />
                </Grid> */}

                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                </Grid>

                {/* Tasks Section */}
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" fontWeight="bold" sx={{
                      fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                    }}>
                      කාර්ය (විකල්ප)
                    </Typography>
                    <Button
                      startIcon={<Add />}
                      onClick={handleAddTask}
                      variant="outlined"
                      size="small"
                    >
                      කාර්යයක් එක් කරන්න
                    </Button>
                  </Box>

                  {formData.tasks.map((task, index) => (
                    <Card key={index} sx={{ mb: 2 }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                          <TextField
                            fullWidth
                            label={`කාර්යය ${task.taskNumber}`}
                            value={task.taskDescription}
                            onChange={(e) => handleTaskChange(index, e.target.value)}
                            multiline
                            rows={2}
                            inputProps={{ maxLength: 1000 }}
                          />
                          <IconButton
                            color="error"
                            onClick={() => handleRemoveTask(index)}
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                </Grid>

                {/* Attachments Section */}
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" fontWeight="bold" sx={{
                      fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                    }}>
                      ගොනු (විකල්ප)
                    </Typography>
                    <Button
                      component="label"
                      startIcon={uploading ? <CircularProgress size={16} /> : <CloudUpload />}
                      variant="outlined"
                      size="small"
                      disabled={uploading}
                    >
                      ගොනුවක් එක් කරන්න
                      <input
                        type="file"
                        hidden
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileUpload}
                      />
                    </Button>
                  </Box>

                  {formData.attachments.map((attachment, index) => (
                    <Card key={index} sx={{ mb: 2 }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <AttachFile color="action" />
                            <Box>
                              <Typography variant="body2" fontWeight="bold">
                                {attachment.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {attachment.type.toUpperCase()} • {(attachment.size / 1024 / 1024).toFixed(2)} MB
                              </Typography>
                            </Box>
                          </Box>
                          <IconButton
                            color="error"
                            onClick={() => handleRemoveAttachment(index)}
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                </Grid>

                {/* Guidelines Section */}
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" fontWeight="bold" sx={{
                      fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                    }}>
                      මාර්ගෝපදේශ (විකල්ප)
                    </Typography>
                    <Button
                      startIcon={<Add />}
                      onClick={handleAddGuideline}
                      variant="outlined"
                      size="small"
                    >
                      මාර්ගෝපදේශයක් එක් කරන්න
                    </Button>
                  </Box>

                  {formData.guidelines.map((guideline, index) => (
                    <Card key={index} sx={{ mb: 2 }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                          <TextField
                            fullWidth
                            label={`මාර්ගෝපදේශය ${guideline.guidelineNumber}`}
                            value={guideline.guidelineText}
                            onChange={(e) => handleGuidelineChange(index, e.target.value)}
                            multiline
                            rows={2}
                            inputProps={{ maxLength: 500 }}
                          />
                          <IconButton
                            color="error"
                            onClick={() => handleRemoveGuideline(index)}
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Grid>

                {/* Submit Button */}
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
                    <Button
                      variant="outlined"
                      onClick={() => navigate(`/admin-assignments/${classId}`)}
                    >
                      අවලංගු කරන්න
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={16} /> : null}
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
                        }
                      }}
                    >
                      {loading ? 'සාදමින්...' : 'පැවරුම සාදන්න'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Container>
      </Box>
    </LocalizationProvider>
  );
};

export default CreateAssignment;
