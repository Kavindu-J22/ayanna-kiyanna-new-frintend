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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Badge
} from '@mui/material';
import {
  ArrowBack,
  Grade,
  Visibility,
  CheckCircle,
  PendingActions,
  Person,
  Assignment,
  AttachFile
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';

const AssignmentSubmissions = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [assignment, setAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [notSubmittedStudents, setNotSubmittedStudents] = useState([]);
  const [stats, setStats] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [tabValue, setTabValue] = useState(0);
  
  // Grading dialog state
  const [gradeDialog, setGradeDialog] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [gradeData, setGradeData] = useState({ marks: '', feedback: '' });
  const [grading, setGrading] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, [assignmentId]);

  const fetchSubmissions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/assignments/${assignmentId}/submissions`,
        { headers: { 'x-auth-token': token } }
      );
      
      setAssignment(response.data.assignment);
      setSubmissions(response.data.submissions || []);
      setNotSubmittedStudents(response.data.notSubmittedStudents || []);
      setStats(response.data.stats || {});
    } catch (error) {
      console.error('Error fetching submissions:', error);
      setError('Error loading submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenGradeDialog = (submission) => {
    setSelectedSubmission(submission);
    setGradeData({
      marks: submission.marks || '',
      feedback: submission.feedback || ''
    });
    setGradeDialog(true);
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
        `https://ayanna-kiyanna-new-backend.onrender.com/api/assignments/submissions/${selectedSubmission._id}/grade`,
        {
          marks: parseFloat(gradeData.marks),
          feedback: gradeData.feedback
        },
        { headers: { 'x-auth-token': token } }
      );

      setSuccess('Submission graded successfully!');
      setGradeDialog(false);
      setSelectedSubmission(null);
      setGradeData({ marks: '', feedback: '' });
      fetchSubmissions();
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
            <IconButton onClick={() => navigate(-1)} color="primary">
              <ArrowBack />
            </IconButton>
            <Typography variant="h4" fontWeight="bold" sx={{
              fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
            }}>
              පැවරුම් ප්‍රතිචාර
            </Typography>
          </Box>
          
          {assignment && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Chip 
                label={assignment.title}
                color="primary"
                variant="outlined"
              />
              <Chip 
                label={`${stats.submitted}/${stats.totalEnrolled} ඉදිරිපත් කර ඇත`}
                color="info"
                variant="outlined"
              />
              <Chip 
                label={`${stats.graded} ලකුණු ලබා දී ඇත`}
                color="success"
                variant="outlined"
              />
            </Box>
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

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h4" fontWeight="bold" color="primary">
                {stats.totalEnrolled}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                මුළු සිසුන්
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h4" fontWeight="bold" color="success.main">
                {stats.submitted}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ඉදිරිපත් කර ඇත
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h4" fontWeight="bold" color="warning.main">
                {stats.notSubmitted}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ඉදිරිපත් නොකළ
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h4" fontWeight="bold" color="info.main">
                {stats.graded}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ලකුණු ලබා දී ඇත
              </Typography>
            </Card>
          </Grid>
        </Grid>

        {/* Tabs */}
        <Paper elevation={3} sx={{ borderRadius: 3 }}>
          <Tabs 
            value={tabValue} 
            onChange={(e, newValue) => setTabValue(newValue)}
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab 
              label={
                <Badge badgeContent={submissions.length} color="primary">
                  ඉදිරිපත් කළ ප්‍රතිචාර
                </Badge>
              } 
            />
            <Tab 
              label={
                <Badge badgeContent={notSubmittedStudents.length} color="error">
                  ඉදිරිපත් නොකළ සිසුන්
                </Badge>
              } 
            />
          </Tabs>

          {/* Submitted Submissions Tab */}
          {tabValue === 0 && (
            <Box sx={{ p: 3 }}>
              {submissions.length > 0 ? (
                <Grid container spacing={3}>
                  {submissions.map((submission) => (
                    <Grid item xs={12} md={6} lg={4} key={submission._id}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card sx={{
                          height: '100%',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: 6
                          },
                          transition: 'all 0.3s ease'
                        }}>
                          <CardContent>
                            {/* Student Info */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                              <Avatar src={submission.studentId.profilePicture}>
                                {submission.studentId.firstName?.charAt(0)}
                              </Avatar>
                              <Box>
                                <Typography variant="subtitle1" fontWeight="bold">
                                  {submission.studentId.firstName} {submission.studentId.lastName}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {submission.studentId.studentId}
                                </Typography>
                              </Box>
                            </Box>

                            {/* Submission Info */}
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                              ඉදිරිපත් කළ දිනය: {formatDate(submission.submittedAt)}
                            </Typography>

                            {/* Submission Text Preview */}
                            <Typography variant="body2" sx={{ mb: 2 }}>
                              {submission.submissionText.length > 100 
                                ? `${submission.submissionText.substring(0, 100)}...`
                                : submission.submissionText
                              }
                            </Typography>

                            {/* Attachments */}
                            {submission.attachments && submission.attachments.length > 0 && (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <AttachFile fontSize="small" />
                                <Typography variant="caption">
                                  {submission.attachments.length} ගොනු
                                </Typography>
                              </Box>
                            )}

                            {/* Grade Display */}
                            {submission.marks !== null && submission.marks !== undefined ? (
                              <Chip
                                label={`${submission.marks}/100`}
                                color={getGradeColor(submission.marks)}
                                variant="filled"
                                sx={{ mb: 2 }}
                              />
                            ) : (
                              <Chip
                                label="ලකුණු නොදී ඇත"
                                color="warning"
                                variant="outlined"
                                sx={{ mb: 2 }}
                              />
                            )}

                            {/* Action Buttons */}
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                              <Button
                                size="small"
                                variant="outlined"
                                startIcon={<Visibility />}
                                onClick={() => navigate(`/view-submission/${submission._id}`)}
                              >
                                විස්තර
                              </Button>
                              <Button
                                size="small"
                                variant="contained"
                                startIcon={<Grade />}
                                onClick={() => handleOpenGradeDialog(submission)}
                                color={submission.marks !== null ? 'warning' : 'primary'}
                              >
                                {submission.marks !== null ? 'සංස්කරණය' : 'ලකුණු'}
                              </Button>
                            </Box>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <Assignment sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    ප්‍රතිචාර ඉදිරිපත් කර නොමැත
                  </Typography>
                </Box>
              )}
            </Box>
          )}

          {/* Not Submitted Students Tab */}
          {tabValue === 1 && (
            <Box sx={{ p: 3 }}>
              {notSubmittedStudents.length > 0 ? (
                <List>
                  {notSubmittedStudents.map((student) => (
                    <ListItem key={student._id} sx={{ border: '1px solid', borderColor: 'grey.300', borderRadius: 2, mb: 1 }}>
                      <ListItemAvatar>
                        <Avatar src={student.profilePicture}>
                          {student.firstName?.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={`${student.firstName} ${student.lastName}`}
                        secondary={student.studentId}
                      />
                      <Chip
                        label="ඉදිරිපත් නොකළ"
                        color="error"
                        variant="outlined"
                        icon={<PendingActions />}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
                  <Typography variant="h6" color="success.main">
                    සියලුම සිසුන් ඉදිරිපත් කර ඇත!
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </Paper>

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
            {selectedSubmission && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {selectedSubmission.studentId.firstName} {selectedSubmission.studentId.lastName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {selectedSubmission.studentId.studentId}
                </Typography>
              </Box>
            )}
            
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

export default AssignmentSubmissions;
