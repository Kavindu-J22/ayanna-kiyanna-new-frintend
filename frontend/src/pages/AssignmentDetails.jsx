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
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';
import {
  ArrowBack,
  Assignment,
  Schedule,
  AttachFile,
  Info,
  Edit,
  Send,
  CheckCircle,
  Grade
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';

const AssignmentDetails = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [assignment, setAssignment] = useState(null);
  const [error, setError] = useState('');

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
    } catch (error) {
      console.error('Error fetching assignment:', error);
      setError('Error loading assignment');
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

  const isOverdue = () => {
    if (!assignment?.dueDate) return false;
    return new Date() > new Date(assignment.dueDate);
  };

  const isAlreadySubmitted = () => {
    return assignment?.submissionStatus?.submitted;
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
              පැවරුම් විස්තර
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Chip 
              label={assignment.classId.title}
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
            {isAlreadySubmitted() && (
              <Chip 
                label="ඉදිරිපත් කර ඇත"
                color="success"
                variant="filled"
                icon={<CheckCircle />}
              />
            )}
            {isAlreadyGraded() && (
              <Chip 
                label={`ලකුණු: ${assignment.submissionStatus.marks}/100`}
                color="info"
                variant="filled"
                icon={<Grade />}
              />
            )}
          </Box>
        </Paper>

        {/* Error Messages */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {isOverdue() && !isAlreadySubmitted() && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography fontWeight="bold">කාලය ඉකුත් වී ඇත!</Typography>
            <Typography variant="body2">
              මෙම පැවරුමේ අවසන් දිනය ගත වී ඇත. කෙසේ වෙතත් ඔබට තවමත් ඉදිරිපත් කළ හැකිය.
            </Typography>
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Assignment Content */}
          <Grid item xs={12} md={8}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                <Typography variant="h5" fontWeight="bold" sx={{
                  fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                  mb: 3
                }}>
                  {assignment.title}
                </Typography>
                
                <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.7 }}>
                  {assignment.description}
                </Typography>

                {/* Tasks */}
                {assignment.tasks && assignment.tasks.length > 0 && (
                  <>
                    <Divider sx={{ my: 3 }} />
                    <Typography variant="h6" fontWeight="bold" sx={{
                      fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                      mb: 2
                    }}>
                      කාර්ය:
                    </Typography>
                    <List>
                      {assignment.tasks.map((task, index) => (
                        <ListItem key={index} sx={{ pl: 0 }}>
                          <ListItemIcon>
                            <Assignment color="primary" />
                          </ListItemIcon>
                          <ListItemText 
                            primary={`${task.taskNumber}. ${task.taskDescription}`}
                            primaryTypographyProps={{
                              variant: 'body1',
                              sx: { lineHeight: 1.6 }
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </>
                )}

                {/* Guidelines */}
                {assignment.guidelines && assignment.guidelines.length > 0 && (
                  <>
                    <Divider sx={{ my: 3 }} />
                    <Typography variant="h6" fontWeight="bold" sx={{
                      fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                      mb: 2
                    }}>
                      මාර්ගෝපදේශ:
                    </Typography>
                    <List>
                      {assignment.guidelines.map((guideline, index) => (
                        <ListItem key={index} sx={{ pl: 0 }}>
                          <ListItemIcon>
                            <Info color="info" />
                          </ListItemIcon>
                          <ListItemText 
                            primary={`${guideline.guidelineNumber}. ${guideline.guidelineText}`}
                            primaryTypographyProps={{
                              variant: 'body1',
                              sx: { lineHeight: 1.6 }
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </>
                )}

                {/* Assignment Attachments */}
                {assignment.attachments && assignment.attachments.length > 0 && (
                  <>
                    <Divider sx={{ my: 3 }} />
                    <Typography variant="h6" fontWeight="bold" sx={{
                      fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                      mb: 2
                    }}>
                      ගුරුතුමාගේ ගොනු:
                    </Typography>
                    {assignment.attachments.map((attachment, index) => (
                      <Card key={index} sx={{ mb: 2 }}>
                        <CardContent sx={{ py: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <AttachFile color="action" />
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography variant="body1" fontWeight="bold">
                                {attachment.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {attachment.type.toUpperCase()} • {(attachment.size / 1024 / 1024).toFixed(2)} MB
                              </Typography>
                            </Box>
                            <Button
                              variant="outlined"
                              size="small"
                              href={attachment.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              බාගන්න
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </>
                )}

                {/* Submission Feedback */}
                {isAlreadyGraded() && assignment.submissionStatus.feedback && (
                  <>
                    <Divider sx={{ my: 3 }} />
                    <Paper sx={{ p: 3, bgcolor: 'info.light', borderRadius: 2 }}>
                      <Typography variant="h6" fontWeight="bold" sx={{
                        fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                        mb: 2,
                        color: 'info.dark'
                      }}>
                        ගුරුතුමාගේ ප්‍රතිචාරය:
                      </Typography>
                      <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                        "{assignment.submissionStatus.feedback}"
                      </Typography>
                    </Paper>
                  </>
                )}
              </Paper>
            </motion.div>
          </Grid>

          {/* Action Panel */}
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Paper elevation={3} sx={{ p: 3, borderRadius: 3, position: 'sticky', top: 24 }}>
                <Typography variant="h6" fontWeight="bold" sx={{
                  fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                  mb: 3
                }}>
                  ක්‍රියාමාර්ග
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {!isAlreadySubmitted() ? (
                    <Button
                      variant="contained"
                      startIcon={<Send />}
                      onClick={() => navigate(`/submit-assignment/${assignmentId}`)}
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
                  ) : !isAlreadyGraded() ? (
                    <Button
                      variant="outlined"
                      startIcon={<Edit />}
                      onClick={() => navigate(`/edit-submission/${assignmentId}`)}
                      fullWidth
                    >
                      සංස්කරණය කරන්න
                    </Button>
                  ) : (
                    <Alert severity="success">
                      <Typography variant="body2">
                        ඔබගේ පැවරුම සම්පූර්ණයි! ලකුණු ලබා දී ඇත.
                      </Typography>
                    </Alert>
                  )}

                  <Button
                    variant="outlined"
                    onClick={() => navigate(`/student-assignments/${assignment.classId._id}`)}
                    fullWidth
                  >
                    පැවරුම් ලැයිස්තුවට
                  </Button>
                </Box>

                {/* Assignment Info */}
                <Box sx={{ mt: 4 }}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                    පැවරුම් තොරතුරු:
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">කාර්ය ගණන:</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {assignment.tasks?.length || 0}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">මාර්ගෝපදේශ:</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {assignment.guidelines?.length || 0}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">ගොනු:</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {assignment.attachments?.length || 0}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">ප්‍රකාශ කළ දිනය:</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {formatDate(assignment.publishedAt)}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AssignmentDetails;
