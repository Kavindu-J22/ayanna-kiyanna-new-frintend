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
  Schedule,
  Assignment
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
                label={`${classData.date} - ${classData.grade} ශ්‍රේණිය`}
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
              <Grid container spacing={4}>
                {/* Basic Information Section */}
                <Grid item xs={12}>
                  <Paper elevation={1} sx={{ p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
                    <Typography variant="h6" fontWeight="bold" sx={{
                      fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                      mb: 3,
                      color: 'primary.main',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}>
                      <Assignment />
                      මූලික තොරතුරු
                    </Typography>

                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="පැවරුම් මාතෘකාව *"
                          value={formData.title}
                          onChange={(e) => handleInputChange('title', e.target.value)}
                          required
                          inputProps={{ maxLength: 200 }}
                          helperText={`${formData.title.length}/200 අක්ෂර`}
                          sx={{ mb: 2 }}
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
                          sx={{ mb: 2 }}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <DateTimePicker
                          label="අවසන් දිනය"
                          value={formData.dueDate}
                          onChange={(newValue) => handleInputChange('dueDate', newValue)}
                          renderInput={(params) => <TextField {...params} fullWidth />}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Alert severity="info" sx={{ height: 'fit-content' }}>
                          <Typography variant="body2">
                            අවසන් දිනය සැකසූ විට, සිසුන්ට එම දිනයෙන් පසුව ඒ බව දැනුවත් වේ.
                          </Typography>
                        </Alert>
                      </Grid>
                    </Grid>
                  </Paper>
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

                {/* Tasks Section */}
                <Grid item xs={12}>
                  <Paper elevation={1} sx={{ p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                      <Typography variant="h6" fontWeight="bold" sx={{
                        fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                        color: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}>
                        <Assignment />
                        කාර්ය (විකල්ප)
                      </Typography>
                      <Button
                        startIcon={<Add />}
                        onClick={handleAddTask}
                        variant="contained"
                        size="small"
                        sx={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
                          }
                        }}
                      >
                        කාර්යයක් එක් කරන්න
                      </Button>
                    </Box>

                    {formData.tasks.length === 0 && (
                      <Alert severity="info" sx={{ mb: 2 }}>
                        <Typography variant="body2">
                          සිසුන්ට නිශ්චිත කාර්ය ලබා දීමට මෙහි කාර්ය එක් කරන්න. මෙය විකල්ප වේ.
                        </Typography>
                      </Alert>
                    )}

                    <Grid container spacing={2}>
                      {formData.tasks.map((task, index) => (
                        <Grid item xs={12} key={index}>
                          <Card sx={{
                            border: '1px solid',
                            borderColor: 'primary.light',
                            '&:hover': {
                              boxShadow: 3
                            }
                          }}>
                            <CardContent sx={{ p: 3 }}>
                              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                <TextField
                                  fullWidth
                                  label={`කාර්යය ${task.taskNumber}`}
                                  value={task.taskDescription}
                                  onChange={(e) => handleTaskChange(index, e.target.value)}
                                  multiline
                                  rows={3}
                                  inputProps={{ maxLength: 1000 }}
                                  helperText={`${task.taskDescription.length}/1000 අක්ෂර`}
                                />
                                <IconButton
                                  color="error"
                                  onClick={() => handleRemoveTask(index)}
                                  sx={{ mt: 1 }}
                                >
                                  <Delete />
                                </IconButton>
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Paper>
                </Grid>

                {/* Attachments Section */}
                <Grid item xs={12}>
                  <Paper elevation={1} sx={{ p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                      <Typography variant="h6" fontWeight="bold" sx={{
                        fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                        color: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}>
                        <AttachFile />
                        ගොනු (විකල්ප)
                      </Typography>
                      <Button
                        component="label"
                        startIcon={uploading ? <CircularProgress size={16} /> : <CloudUpload />}
                        variant="contained"
                        size="small"
                        disabled={uploading}
                        sx={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
                          }
                        }}
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

                    {formData.attachments.length === 0 && (
                      <Alert severity="info" sx={{ mb: 2 }}>
                        <Typography variant="body2">
                          PDF, JPG, JPEG, PNG ගොනු එක් කළ හැක. උපරිම ගොනු ප්‍රමාණය 10MB වේ.
                        </Typography>
                      </Alert>
                    )}

                    <Grid container spacing={2}>
                      {formData.attachments.map((attachment, index) => (
                        <Grid item xs={12} md={6} key={index}>
                          <Card sx={{
                            border: '1px solid',
                            borderColor: 'primary.light',
                            '&:hover': {
                              boxShadow: 3
                            }
                          }}>
                            <CardContent sx={{ p: 2 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                                  <AttachFile color="primary" />
                                  <Box sx={{ minWidth: 0, flex: 1 }}>
                                    <Typography variant="body2" fontWeight="bold" noWrap>
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
                                  size="small"
                                >
                                  <Delete />
                                </IconButton>
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Paper>
                </Grid>

                {/* Guidelines Section */}
                <Grid item xs={12}>
                  <Paper elevation={1} sx={{ p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                      <Typography variant="h6" fontWeight="bold" sx={{
                        fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                        color: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}>
                        <Assignment />
                        මාර්ගෝපදේශ (විකල්ප)
                      </Typography>
                      <Button
                        startIcon={<Add />}
                        onClick={handleAddGuideline}
                        variant="contained"
                        size="small"
                        sx={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
                          }
                        }}
                      >
                        මාර්ගෝපදේශයක් එක් කරන්න
                      </Button>
                    </Box>

                    {formData.guidelines.length === 0 && (
                      <Alert severity="info" sx={{ mb: 2 }}>
                        <Typography variant="body2">
                          සිසුන්ට මාර්ගෝපදේශන ලබා දීමට මෙහි මාර්ගෝපදේශ එක් කරන්න. මෙය විකල්ප වේ.
                        </Typography>
                      </Alert>
                    )}

                    <Grid container spacing={2}>
                      {formData.guidelines.map((guideline, index) => (
                        <Grid item xs={12} key={index}>
                          <Card sx={{
                            border: '1px solid',
                            borderColor: 'primary.light',
                            '&:hover': {
                              boxShadow: 3
                            }
                          }}>
                            <CardContent sx={{ p: 3 }}>
                              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                <TextField
                                  fullWidth
                                  label={`මාර්ගෝපදේශය ${guideline.guidelineNumber}`}
                                  value={guideline.guidelineText}
                                  onChange={(e) => handleGuidelineChange(index, e.target.value)}
                                  multiline
                                  rows={3}
                                  inputProps={{ maxLength: 500 }}
                                  helperText={`${guideline.guidelineText.length}/500 අක්ෂර`}
                                />
                                <IconButton
                                  color="error"
                                  onClick={() => handleRemoveGuideline(index)}
                                  sx={{ mt: 1 }}
                                >
                                  <Delete />
                                </IconButton>
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Paper>
                </Grid>

                {/* Submit Button */}
                <Grid item xs={12}>
                  <Paper elevation={1} sx={{ p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center' }}>
                      <Button
                        variant="outlined"
                        size="large"
                        onClick={() => navigate(`/admin-assignments/${classId}`)}
                        sx={{ minWidth: 150 }}
                      >
                        අවලංගු කරන්න
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} /> : null}
                        sx={{
                          minWidth: 200,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
                          }
                        }}
                      >
                        {loading ? 'සාදමින්...' : 'පැවරුම සාදන්න'}
                      </Button>
                    </Box>
                  </Paper>
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
