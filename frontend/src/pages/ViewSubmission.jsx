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
  Avatar,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import {
  ArrowBack,
  AttachFile,
  Grade,
  Person,
  Schedule,
  Assignment,
  Edit
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';

const ViewSubmission = () => {
  const { submissionId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submission, setSubmission] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Grading dialog state
  const [gradeDialog, setGradeDialog] = useState(false);
  const [gradeData, setGradeData] = useState({ marks: '', feedback: '' });
  const [grading, setGrading] = useState(false);

  useEffect(() => {
    if (submissionId) {
      fetchSubmission();
    } else {
      setError('No submission ID provided');
      setLoading(false);
    }
  }, [submissionId]);

  const fetchSubmission = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/assignments/submissions/${submissionId}`,
        { headers: { 'x-auth-token': token } }
      );

      setSubmission(response.data.submission);
      setGradeData({
        marks: response.data.submission.marks || '',
        feedback: response.data.submission.feedback || ''
      });
    } catch (error) {
      console.error('Error fetching submission:', error);
      setError(`Error loading submission: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGradeSubmission = async () => {
    if (!gradeData.marks || gradeData.marks < 0 || gradeData.marks > 100) {
      setError('Please enter valid marks between 0 and 100');
      return;
    }

    setGrading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/assignments/submissions/${submissionId}/grade`,
        {
          marks: parseFloat(gradeData.marks),
          feedback: gradeData.feedback
        },
        { headers: { 'x-auth-token': token } }
      );

      setSuccess('Submission graded successfully!');
      setGradeDialog(false);
      fetchSubmission(); // Refresh data
    } catch (error) {
      console.error('Error grading submission:', error);
      setError(error.response?.data?.message || 'Error grading submission');
    } finally {
      setGrading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getGradeColor = (marks) => {
    if (marks >= 75) return 'success';
    if (marks >= 50) return 'warning';
    return 'error';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading submission...</Typography>
      </Box>
    );
  }

  if (error && !submission) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button onClick={() => navigate(-1)} sx={{ mt: 2 }}>
          Go Back
        </Button>
      </Container>
    );
  }

  if (!submission) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">Submission not found</Alert>
        <Button onClick={() => navigate(-1)} sx={{ mt: 2 }}>
          Go Back
        </Button>
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
            <IconButton onClick={() => navigate(-1)} color="primary">
              <ArrowBack />
            </IconButton>
            <Typography variant="h4" fontWeight="bold" sx={{
              fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
            }}>
              ප්‍රතිචාර විස්තර
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Chip 
              label={submission.assignmentId.title}
              color="primary"
              variant="outlined"
            />
            <Chip 
              label={`${submission.studentId.firstName} ${submission.studentId.lastName}`}
              color="secondary"
              variant="outlined"
              avatar={<Avatar src={submission.studentId.profilePicture}>{submission.studentId.firstName?.charAt(0)}</Avatar>}
            />
            {submission.marks !== null && submission.marks !== undefined && (
              <Chip 
                label={`${submission.marks}/100`}
                color={getGradeColor(submission.marks)}
                variant="filled"
                icon={<Grade />}
              />
            )}
          </Box>
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

        <Grid container spacing={3}>
          {/* Student Info */}
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Paper elevation={3} sx={{ p: 3, borderRadius: 3, mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" sx={{
                  fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                  mb: 2
                }}>
                  සිසු තොරතුරු
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Avatar 
                    src={submission.studentId.profilePicture}
                    sx={{ width: 60, height: 60 }}
                  >
                    {submission.studentId.firstName?.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {submission.studentId.firstName} {submission.studentId.lastName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {submission.studentId.studentId}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    ඉදිරිපත් කළ දිනය:
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {formatDate(submission.submittedAt)}
                  </Typography>
                </Box>

                {submission.gradedAt && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      ලකුණු ලබා දුන් දිනය:
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {formatDate(submission.gradedAt)}
                    </Typography>
                  </Box>
                )}

                {submission.gradedBy && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      ලකුණු ලබා දුන්නේ:
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {submission.gradedBy.fullName}
                    </Typography>
                  </Box>
                )}

                <Box sx={{ mt: 3 }}>
                  <Button
                    variant="contained"
                    startIcon={<Grade />}
                    onClick={() => setGradeDialog(true)}
                    fullWidth
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
                      }
                    }}
                  >
                    {submission.marks !== null ? 'ලකුණු සංස්කරණය' : 'ලකුණු ලබා දෙන්න'}
                  </Button>
                </Box>
              </Paper>
            </motion.div>
          </Grid>

          {/* Submission Content */}
          <Grid item xs={12} md={8}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Paper elevation={3} sx={{ p: 4, borderRadius: 3, mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" sx={{
                  fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                  mb: 3
                }}>
                  සිසුගේ පිළිතුර
                </Typography>
                
                <Typography variant="body1" sx={{ 
                  lineHeight: 1.7,
                  whiteSpace: 'pre-wrap',
                  mb: 3
                }}>
                  {submission.submissionText}
                </Typography>

                {/* Attachments */}
                {submission.attachments && submission.attachments.length > 0 && (
                  <>
                    <Divider sx={{ my: 3 }} />
                    <Typography variant="h6" fontWeight="bold" sx={{
                      fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                      mb: 2
                    }}>
                      ගොනු ({submission.attachments.length})
                    </Typography>
                    
                    {submission.attachments.map((attachment, index) => (
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

                {/* Current Grade and Feedback */}
                {submission.marks !== null && submission.marks !== undefined && (
                  <>
                    <Divider sx={{ my: 3 }} />
                    <Paper sx={{ p: 3, bgcolor: 'success.light', borderRadius: 2 }}>
                      <Typography variant="h6" fontWeight="bold" sx={{
                        fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                        mb: 2,
                        color: 'success.dark'
                      }}>
                        ලකුණු: {submission.marks}/100
                      </Typography>
                      
                      {submission.feedback && (
                        <>
                          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, color: 'success.dark' }}>
                            ප්‍රතිචාරය:
                          </Typography>
                          <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                            "{submission.feedback}"
                          </Typography>
                        </>
                      )}
                    </Paper>
                  </>
                )}
              </Paper>
            </motion.div>
          </Grid>
        </Grid>

        {/* Grade Dialog */}
        <Dialog
          open={gradeDialog}
          onClose={() => setGradeDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{
            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
            fontWeight: 'bold'
          }}>
            ලකුණු ලබා දෙන්න
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                {submission.studentId.firstName} {submission.studentId.lastName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {submission.studentId.studentId}
              </Typography>
            </Box>
            
            <TextField
              fullWidth
              label="ලකුණු (0-100)"
              type="number"
              value={gradeData.marks}
              onChange={(e) => setGradeData(prev => ({ ...prev, marks: e.target.value }))}
              inputProps={{ min: 0, max: 100 }}
              sx={{ mb: 3 }}
              required
            />
            
            <TextField
              fullWidth
              multiline
              rows={4}
              label="ප්‍රතිචාරය (විකල්ප)"
              value={gradeData.feedback}
              onChange={(e) => setGradeData(prev => ({ ...prev, feedback: e.target.value }))}
              inputProps={{ maxLength: 1000 }}
              helperText={`${gradeData.feedback.length}/1000 අක්ෂර`}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setGradeDialog(false)}>
              අවලංගු කරන්න
            </Button>
            <Button 
              onClick={handleGradeSubmission}
              variant="contained"
              disabled={grading}
              startIcon={grading ? <CircularProgress size={16} /> : null}
            >
              {grading ? 'සුරකිමින්...' : 'ලකුණු ලබා දෙන්න'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default ViewSubmission;
