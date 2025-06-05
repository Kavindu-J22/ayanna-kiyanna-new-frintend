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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Alert,
  CircularProgress,
  Fab,
  Tooltip
} from '@mui/material';
import {
  ArrowBack,
  Add,
  Edit,
  Delete,
  Visibility,
  Assignment,
  Publish,
  UnpublishedOutlined,
  Schedule,
  People,
  AttachFile
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';

const AdminAssignmentManagement = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [classData, setClassData] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Dialog states
  const [createDialog, setCreateDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

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
        `https://ayanna-kiyanna-new-backend.onrender.com/api/assignments/class/${classId}`,
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

  const handleTogglePublish = async (assignmentId, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/assignments/${assignmentId}/publish`,
        { isPublished: !currentStatus },
        { headers: { 'x-auth-token': token } }
      );
      
      setSuccess(`Assignment ${!currentStatus ? 'published' : 'unpublished'} successfully!`);
      fetchAssignments();
    } catch (error) {
      console.error('Error toggling publish status:', error);
      setError('Error updating assignment status');
    }
  };

  const handleDeleteAssignment = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/assignments/${selectedAssignment._id}`,
        { headers: { 'x-auth-token': token } }
      );
      
      setSuccess('Assignment deleted successfully!');
      setDeleteDialog(false);
      setSelectedAssignment(null);
      fetchAssignments();
    } catch (error) {
      console.error('Error deleting assignment:', error);
      setError('Error deleting assignment');
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
              පැවරුම් සහ ඇගයීම් කළමනාකරණය
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
                label={`පන්තියේ සිසුන් ${classData.enrolledStudents?.length || 0} යි`}
                color="secondary"
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

        {/* Smart Notes Section */}
        <Paper elevation={2} sx={{ p: 3, mb: 4, bgcolor: 'info.light', borderRadius: 3 }}>
          <Typography variant="h6" fontWeight="bold" sx={{
            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
            mb: 2,
            color: 'info.dark'
          }}>
            📝 පැවරුම් කළමනාකරණය පිළිබඳ වැදගත් සටහන්
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>ප්‍රකාශිත පැවරුම්:</strong> සිසුන්ට පෙනෙන සහ ඉදිරිපත් කළ හැකි පැවරුම්
                </Typography>
              </Alert>
              <Alert severity="warning" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>ප්‍රකාශ නොකළ පැවරුම්:</strong> සිසුන්ට නොපෙනෙන, සකස් කරමින් පවතින පැවරුම්
                </Typography>
              </Alert>
            </Grid>
            <Grid item xs={12} md={6}>
              <Alert severity="success" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>ප්‍රතිචාර බලන්න:</strong> සිසුන්ගේ ඉදිරිපත් කිරීම් සහ ලකුණු ලබා දීම
                </Typography>
              </Alert>
              <Alert severity="error" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>කාලය ඉකුත්:</strong> අවසන් දිනය පසු වූ පැවරුම ඒ බව සිසුන්ට පෙන්නුම් කරයි
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
                  height: 400, // Fixed height for uniform boxes
                  minWidth: 480, // Fixed minimum width
                  maxWidth: 480, // Fixed maximum width
                  width: '100%', // Full width within constraints
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  border: '1px solid',
                  borderColor: 'primary.light',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6,
                    borderColor: 'primary.main'
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
                      label={assignment.isPublished ? 'ප්‍රකාශිත' : 'ප්‍රකාශ නොකළ'}
                      color={assignment.isPublished ? 'success' : 'warning'}
                      size="small"
                      icon={assignment.isPublished ? <Publish /> : <UnpublishedOutlined />}
                      sx={{ fontWeight: 'bold' }}
                    />
                  </Box>

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

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AttachFile fontSize="small" color="primary" />
                        <Typography variant="caption" fontWeight="bold">
                          {assignment.attachments?.length || 0} ගොනු
                        </Typography>
                      </Box>
                    </Box>

                    {/* Action Buttons */}
                    <Box sx={{
                      display: 'flex',
                      gap: 1,
                      flexDirection: 'column',
                      mt: 'auto',
                      pt: 2
                    }}>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<Visibility />}
                          onClick={() => navigate(`/assignment-submissions/${assignment._id}`)}
                          sx={{ flex: 1 }}
                        >
                          ප්‍රතිචාර බලන්න
                        </Button>

                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<Edit />}
                          onClick={() => navigate(`/edit-assignment/${assignment._id}`)}
                          sx={{ flex: 1 }}
                        >
                          සංස්කරණය
                        </Button>
                      </Box>

                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          size="small"
                          variant={assignment.isPublished ? "contained" : "outlined"}
                          color={assignment.isPublished ? 'warning' : 'success'}
                          startIcon={assignment.isPublished ? <UnpublishedOutlined /> : <Publish />}
                          onClick={() => handleTogglePublish(assignment._id, assignment.isPublished)}
                          sx={{ flex: 1 }}
                        >
                          {assignment.isPublished ? 'අප්‍රකාශ කරන්න' : 'ප්‍රකාශ කරන්න'}
                        </Button>

                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => {
                            setSelectedAssignment(assignment);
                            setDeleteDialog(true);
                          }}
                          sx={{
                            border: '1px solid',
                            borderColor: 'error.main',
                            '&:hover': {
                              bgcolor: 'error.light'
                            }
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
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
              නව පැවරුමක් සෑදීමට යට දකුණු පස කොනේ ඇති  + බොත්තම ක්ලික් කරන්න
            </Typography>
          </Paper>
        )}

        {/* Floating Action Button */}
        <Tooltip title="නව පැවරුමක් සාදන්න">
          <Fab
            color="primary"
            sx={{
              position: 'fixed',
              bottom: 36,
              right: 24,
              background: 'linear-gradient(135deg,rgb(110, 218, 182) 0%,rgb(132, 51, 179) 100%)'
            }}
            onClick={() => navigate(`/create-assignment/${classId}`)}
          >
            <Add />
          </Fab>
        </Tooltip>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialog}
          onClose={() => setDeleteDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{
            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
            fontWeight: 'bold'
          }}>
            පැවරුම මකන්න
          </DialogTitle>
          <DialogContent>
            <Typography>
              ඔබට "{selectedAssignment?.title}" පැවරුම මකා දැමීමට අවශ්‍යද? මෙම ක්‍රියාව අහෝසි කළ නොහැක.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialog(false)}>
              අවලංගු කරන්න
            </Button>
            <Button 
              onClick={handleDeleteAssignment}
              color="error"
              variant="contained"
            >
              මකන්න
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default AdminAssignmentManagement;
