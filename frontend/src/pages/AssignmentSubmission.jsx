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
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  ArrowBack,
  CloudUpload,
  AttachFile,
  Delete,
  Schedule,
  Assignment,
  CheckCircle,
  Info
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';

const AssignmentSubmission = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [assignment, setAssignment] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    submissionText: '',
    attachments: []
  });

  useEffect(() => {
    fetchAssignment();
  }, [assignmentId]);

  const fetchAssignment = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/assignments/${assignmentId}`,
        { headers: { 'x-auth-token': token } }
      );
      setAssignment(response.data.assignment);
      
      // If already submitted, populate form with existing data
      if (response.data.assignment.submissionStatus?.submitted) {
        setFormData({
          submissionText: response.data.assignment.submissionStatus.submissionText || '',
          attachments: response.data.assignment.submissionStatus.attachments || []
        });
      }
    } catch (error) {
      console.error('Error fetching assignment:', error);
      setError('Error loading assignment');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check if already have 5 attachments
    if (formData.attachments.length >= 5) {
      setError('Maximum 5 attachments allowed');
      return;
    }

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
    
    if (!formData.submissionText.trim()) {
      setError('Submission text is required');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const isUpdate = assignment.submissionStatus?.submitted;
      
      const endpoint = `https://ayanna-kiyanna-new-backend.onrender.com/api/assignments/${assignmentId}/submit`;
      const method = isUpdate ? 'put' : 'post';

      await axios[method](
        endpoint,
        formData,
        { headers: { 'x-auth-token': token } }
      );

      setSuccess(`Assignment ${isUpdate ? 'updated' : 'submitted'} successfully!`);
      
      setTimeout(() => {
        navigate(`/student-assignments/${assignment.classId._id}`);
      }, 2000);

    } catch (error) {
      console.error('Error submitting assignment:', error);
      setError(error.response?.data?.message || 'Error submitting assignment');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isOverdue = () => {
    if (!assignment?.dueDate) return false;
    return new Date() > new Date(assignment.dueDate);
  };

  const isAlreadyGraded = () => {
    return assignment?.submissionStatus?.marks !== null && assignment?.submissionStatus?.marks !== undefined;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!assignment) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">Assignment not found</Alert>
      </Container>
    );
  }

  return (
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
            <IconButton onClick={() => navigate(`/student-assignments/${assignment.classId._id}`)} color="primary">
              <ArrowBack />
            </IconButton>
            <Typography variant="h4" fontWeight="bold" sx={{
              fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
            }}>
              {assignment.submissionStatus?.submitted ? 'පැවරුම සංස්කරණය' : 'පැවරුම ඉදිරිපත් කරන්න'}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Chip 
              label={assignment.title}
              color="primary"
              variant="outlined"
            />
            {assignment.dueDate && (
              <Chip 
                label={`අවසන් දිනය: ${formatDate(assignment.dueDate)}`}
                color={isOverdue() ? 'error' : 'default'}
                variant="outlined"
                icon={<Schedule />}
              />
            )}
            {assignment.submissionStatus?.submitted && (
              <Chip 
                label="ඉදිරිපත් කර ඇත"
                color="success"
                variant="filled"
                icon={<CheckCircle />}
              />
            )}
          </Box>
        </Paper>

        {/* Alerts */}
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
        
        {isOverdue() && !assignment.submissionStatus?.submitted && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography fontWeight="bold">කාලය ඉකුත් වී ඇත!</Typography>
            <Typography variant="body2">
              මෙම පැවරුමේ අවසන් දිනය ගත වී ඇත. කෙසේ වෙතත් ඔබට තවමත් ඉදිරිපත් කළ හැකිය.
            </Typography>
          </Alert>
        )}

        {isAlreadyGraded() && (
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography fontWeight="bold">ලකුණු ලබා දී ඇත</Typography>
            <Typography variant="body2">
              මෙම පැවරුම සඳහා ලකුණු ලබා දී ඇති නිසා ඔබට එය සංස්කරණය කළ නොහැක.
            </Typography>
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Assignment Details */}
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 3, height: 'fit-content' }}>
              <Typography variant="h6" fontWeight="bold" sx={{
                fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                mb: 2
              }}>
                පැවරුම් විස්තර
              </Typography>
              
              <Typography variant="body2" sx={{ mb: 3 }}>
                {assignment.description}
              </Typography>

              {/* Tasks */}
              {assignment.tasks && assignment.tasks.length > 0 && (
                <>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                    කාර්ය:
                  </Typography>
                  <List dense>
                    {assignment.tasks.map((task, index) => (
                      <ListItem key={index} sx={{ pl: 0 }}>
                        <ListItemIcon>
                          <Assignment fontSize="small" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={`${task.taskNumber}. ${task.taskDescription}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}

              {/* Guidelines */}
              {assignment.guidelines && assignment.guidelines.length > 0 && (
                <>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, mt: 2 }}>
                    මාර්ගෝපදේශ:
                  </Typography>
                  <List dense>
                    {assignment.guidelines.map((guideline, index) => (
                      <ListItem key={index} sx={{ pl: 0 }}>
                        <ListItemIcon>
                          <Info fontSize="small" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={`${guideline.guidelineNumber}. ${guideline.guidelineText}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}

              {/* Assignment Attachments */}
              {assignment.attachments && assignment.attachments.length > 0 && (
                <>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, mt: 2 }}>
                    ගුරුතුමාගේ ගොනු:
                  </Typography>
                  {assignment.attachments.map((attachment, index) => (
                    <Card key={index} sx={{ mb: 1 }}>
                      <CardContent sx={{ py: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AttachFile fontSize="small" />
                          <Typography variant="body2" component="a" href={attachment.url} target="_blank" rel="noopener noreferrer">
                            {attachment.name}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </>
              )}
            </Paper>
          </Grid>

          {/* Submission Form */}
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
              <form onSubmit={handleSubmit}>
                <Typography variant="h6" fontWeight="bold" sx={{
                  fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                  mb: 3
                }}>
                  ඔබගේ පිළිතුර
                </Typography>

                <TextField
                  fullWidth
                  multiline
                  rows={8}
                  label="ඔබගේ පිළිතුර ලියන්න *"
                  value={formData.submissionText}
                  onChange={(e) => setFormData(prev => ({ ...prev, submissionText: e.target.value }))}
                  required
                  disabled={isAlreadyGraded()}
                  inputProps={{ maxLength: 5000 }}
                  helperText={`${formData.submissionText.length}/5000 අක්ෂර`}
                  sx={{ mb: 3 }}
                />

                <Divider sx={{ my: 3 }} />

                {/* File Attachments */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" fontWeight="bold" sx={{
                      fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                    }}>
                      ගොනු (විකල්ප - උපරිම 5)
                    </Typography>
                    {!isAlreadyGraded() && (
                      <Button
                        component="label"
                        startIcon={uploading ? <CircularProgress size={16} /> : <CloudUpload />}
                        variant="outlined"
                        size="small"
                        disabled={uploading || formData.attachments.length >= 5}
                      >
                        ගොනුවක් එක් කරන්න
                        <input
                          type="file"
                          hidden
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleFileUpload}
                        />
                      </Button>
                    )}
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
                          {!isAlreadyGraded() && (
                            <IconButton
                              color="error"
                              onClick={() => handleRemoveAttachment(index)}
                            >
                              <Delete />
                            </IconButton>
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>

                {/* Submit Button */}
                {!isAlreadyGraded() && (
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
                    <Button
                      variant="outlined"
                      onClick={() => navigate(`/student-assignments/${assignment.classId._id}`)}
                    >
                      අවලංගු කරන්න
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={submitting}
                      startIcon={submitting ? <CircularProgress size={16} /> : null}
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
                        }
                      }}
                    >
                      {submitting ? 'ඉදිරිපත් කරමින්...' : (assignment.submissionStatus?.submitted ? 'යාවත්කාලීන කරන්න' : 'ඉදිරිපත් කරන්න')}
                    </Button>
                  </Box>
                )}
              </form>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AssignmentSubmission;
