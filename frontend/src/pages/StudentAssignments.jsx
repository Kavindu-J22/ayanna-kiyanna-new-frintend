import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  IconButton,
  Alert,
  CircularProgress,
  Chip,
  Badge,
  LinearProgress
} from '@mui/material';
import {
  ArrowBack,
  Assignment,
  Schedule,
  CheckCircle,
  PendingActions,
  Grade,
  Visibility,
  Edit,
  AttachFile
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';

const StudentAssignments = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [classData, setClassData] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchClassData();
    fetchAssignments();
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

  const fetchAssignments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/assignments/class/${classId}?published=true`,
        { headers: { 'x-auth-token': token } }
      );
      setAssignments(response.data.assignments || []);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      setError('Error loading assignments');
    } finally {
      setLoading(false);
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

  const getStatusColor = (submissionStatus) => {
    if (!submissionStatus.submitted) return 'warning';
    if (submissionStatus.marks !== null && submissionStatus.marks !== undefined) return 'success';
    return 'info';
  };

  const getStatusText = (submissionStatus) => {
    if (!submissionStatus.submitted) return 'ඉදිරිපත් නොකළ';
    if (submissionStatus.marks !== null && submissionStatus.marks !== undefined) return 'ලකුණු ලබා දී ඇත';
    return 'ඉදිරිපත් කර ඇත';
  };

  const getStatusIcon = (submissionStatus) => {
    if (!submissionStatus.submitted) return <PendingActions />;
    if (submissionStatus.marks !== null && submissionStatus.marks !== undefined) return <Grade />;
    return <CheckCircle />;
  };

  const isOverdue = (dueDate, submissionStatus) => {
    if (!dueDate || submissionStatus.submitted) return false;
    return new Date() > new Date(dueDate);
  };

  // Helper function to determine color based on marks
function getMarkColor(marks) {
  if (marks >= 75) {
    return { name: 'success', light: 'success.light', dark: 'success.dark' };
  } else if (marks >= 50) {
    return { name: 'warning', light: 'warning.light', dark: 'warning.dark' };
  } else {
    return { name: 'error', light: 'error.light', dark: 'error.dark' };
  }
}

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      py: 3
    }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Paper elevation={3} sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <IconButton onClick={() => navigate(`/specific-class/${classId}`)} color="primary">
              <ArrowBack />
            </IconButton>
            <Typography variant="h4" fontWeight="bold" sx={{
              fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
            }}>
              පැවරුම් සහ ඇගයීම්
            </Typography>
          </Box>
          
          {classData && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Chip 
                label={`${classData.date} Class - ${classData.grade} ශ්‍රේණිය`}
                color="primary"
                variant="outlined"
              />
              <Chip 
                label={`${assignments.length} පැවරුම්`}
                color="secondary"
                variant="outlined"
              />
            </Box>
          )}
        </Paper>

        {/* Error Messages */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Smart Notes Section */}
        <Paper elevation={2} sx={{ p: 3, mb: 4, bgcolor: 'success.light', borderRadius: 3 }}>
          <Typography variant="h6" fontWeight="bold" sx={{
            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
            mb: 2,
            color: 'success.dark'
          }}>
            📚 පැවරුම් ඉදිරිපත් කිරීම පිළිබඳ වැදගත් සටහන්
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>ඉදිරිපත් කිරීම:</strong> අවසන් දිනයට පෙර ඔබේ පැවරුම් ඉදිරිපත් කරන්න
                </Typography>
              </Alert>
              <Alert severity="warning" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>කාලය ඉකුත්:</strong> අවසන් දිනය පසු වූ පැවරුම ඒ බව පෙන්නුම් කරයි
                </Typography>
              </Alert>
            </Grid>
            <Grid item xs={12} md={6}>
              <Alert severity="success" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>ලකුණු ලැබීම:</strong> ගුරුවරයා ලකුණු ලබා දීමෙන් පසු ඔබට පෙනේ
                </Typography>
              </Alert>
              <Alert severity="error" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>සංස්කරණය:</strong> ලකුණු ලැබීමෙන් පසු සංස්කරණය කළ නොහැක
                </Typography>
              </Alert>
            </Grid>
          </Grid>
        </Paper>

        {/* Assignments Grid */}
        <Grid container spacing={3}>
          {assignments.map((assignment) => (
            <Grid item xs={12} md={6} key={assignment._id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card sx={{
                  height: 425, // Fixed height for uniform boxes
                  minWidth: 480, // Fixed minimum width
                  maxWidth: 480, // Fixed maximum width
                  width: '100%', // Full width within constraints
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  border: '1px solid',
                  borderColor: isOverdue(assignment.dueDate, assignment.submissionStatus) ? 'error.main' : 'primary.light',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6,
                    borderColor: isOverdue(assignment.dueDate, assignment.submissionStatus) ? 'error.dark' : 'primary.main'
                  },
                  transition: 'all 0.3s ease'
                }}>
                  {/* Status Badge */}
                  <Box sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    zIndex: 1
                  }}>
                    <Chip
                      label={getStatusText(assignment.submissionStatus)}
                      color={getStatusColor(assignment.submissionStatus)}
                      size="small"
                      icon={getStatusIcon(assignment.submissionStatus)}
                      sx={{ fontWeight: 'bold' }}
                    />
                  </Box>

                  {/* Overdue Badge */}
                  {isOverdue(assignment.dueDate, assignment.submissionStatus) && (
                    <Box sx={{
                      position: 'absolute',
                      top: 16,
                      left: 16,
                      zIndex: 1
                    }}>
                      <Chip
                        label="කාලය ඉකුත්"
                        color="error"
                        size="small"
                        variant="filled"
                        sx={{ fontWeight: 'bold' }}
                      />
                    </Box>
                  )}

                  <CardContent sx={{
                    flexGrow: 1,
                    pt: 3,
                    pb: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%'
                  }}>
                    {/* Title */}
                    <Typography variant="h6" fontWeight="bold" sx={{
                      fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                      mb: 2,
                      pr: 6, // Space for status badge
                      minHeight: 64, // Fixed height for title
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {assignment.title}
                    </Typography>

                    {/* Description */}
                    <Typography variant="body2" color="text.secondary" sx={{
                      mb: 2,
                      minHeight: 60, // Fixed height for description
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {assignment.description}
                    </Typography>

                    {/* Assignment Details */}
                    <Box sx={{ mb: 2, flexGrow: 1 }}>
                      {assignment.dueDate && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Schedule fontSize="small" color="primary" />
                          <Typography variant="caption" fontWeight="bold">
                            {formatDate(assignment.dueDate)}
                          </Typography>
                        </Box>
                      )}

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Assignment fontSize="small" color="primary" />
                        <Typography variant="caption" fontWeight="bold">
                          {assignment.tasks?.length || 0} කාර්ය
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <AttachFile fontSize="small" color="primary" />
                        <Typography variant="caption" fontWeight="bold">
                          {assignment.attachments?.length || 0} ගොනු
                        </Typography>
                      </Box>

                      {/* Marks Display */}
                      {assignment.submissionStatus.marks !== null && assignment.submissionStatus.marks !== undefined && (
                      <Box sx={{ 
                        mt: 2, 
                        p: 2, 
                        bgcolor: getMarkColor(assignment.submissionStatus.marks).light, 
                        borderRadius: 2 
                      }}>
                        <Typography 
                          variant="h6" 
                          fontWeight="bold" 
                          color={getMarkColor(assignment.submissionStatus.marks).dark} 
                          textAlign="center"
                        >
                          ලකුණු: {assignment.submissionStatus.marks}/100
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={assignment.submissionStatus.marks}
                          sx={{ mt: 1, height: 8, borderRadius: 4 }}
                          color={getMarkColor(assignment.submissionStatus.marks).name}
                        />
                        {assignment.submissionStatus.feedback && (
                          <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                            "{assignment.submissionStatus.feedback}"
                          </Typography>
                        )}
                      </Box>
                    )}
                    </Box>

                    {/* Action Buttons */}
                    <Box sx={{
                      display: 'flex',
                      gap: 1,
                      flexDirection: 'column',
                      mt: 'auto',
                      pt: 2
                    }}>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Visibility />}
                        onClick={() => navigate(`/assignment-details/${assignment._id}`)}
                        fullWidth
                      >
                        විස්තර බලන්න
                      </Button>

                      {!assignment.submissionStatus.submitted ? (
                        <Button
                          size="small"
                          variant="contained"
                          color="primary"
                          onClick={() => navigate(`/submit-assignment/${assignment._id}`)}
                          fullWidth
                          sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
                            }
                          }}
                        >
                          ඉදිරිපත් කරන්න
                        </Button>
                      ) : assignment.submissionStatus.marks === null ? (
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<Edit />}
                          onClick={() => navigate(`/edit-submission/${assignment._id}`)}
                          fullWidth
                        >
                          සංස්කරණය කරන්න
                        </Button>
                      ) : null}
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Empty State */}
        {assignments.length === 0 && (
          <Paper sx={{ p: 6, textAlign: 'center', mt: 3 }}>
            <Assignment sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" sx={{
              fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
            }}>
              මෙම පන්තිය සඳහා පැවරුම් නොමැත
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              ගුරුතුමා විසින් පැවරුම් ප්‍රකාශ කළ විට ඒවා මෙහි පෙන්වනු ඇත
            </Typography>
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default StudentAssignments;
