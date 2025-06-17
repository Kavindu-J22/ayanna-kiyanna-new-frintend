import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress,
  Chip,
  Fab,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  ArrowBack,
  Add,
  Edit,
  Delete,
  Assignment,
  Visibility,
  Link as LinkIcon,
  School,
  Grade,
  Publish,
  Unpublished
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';

const AdminExamManagement = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // State management
  const [exams, setExams] = useState([]);
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Dialog states
  const [createDialog, setCreateDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    examLink: '',
    examDate: null,
    examStartTime: null,
    examEndTime: null,
    guidelines: [],
    isPublished: false
  });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchClassData();
    fetchExams();
  }, [classId]);

  const fetchClassData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/classes/${classId}`,
        { headers: { 'x-auth-token': token } }
      );
      setClassData(response.data);
    } catch (err) {
      console.error('Error fetching class data:', err);
      setError('Failed to load class data');
    }
  };

  const fetchExams = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/exams/class/${classId}`,
        { headers: { 'x-auth-token': token } }
      );
      setExams(response.data.exams);
    } catch (err) {
      console.error('Error fetching exams:', err);
      setError('Failed to load exams');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateExam = async () => {
    try {
      setFormLoading(true);
      const token = localStorage.getItem('token');
      
      const examData = {
        ...formData,
        classId,
        examDate: formData.examDate ? formData.examDate.toISOString() : null,
        examStartTime: formData.examStartTime ? formData.examStartTime.toTimeString().slice(0, 5) : null,
        examEndTime: formData.examEndTime ? formData.examEndTime.toTimeString().slice(0, 5) : null
      };

      await axios.post(
        'https://ayanna-kiyanna-new-backend.onrender.com/api/exams',
        examData,
        { headers: { 'x-auth-token': token } }
      );

      setCreateDialog(false);
      resetForm();
      fetchExams();
      alert('Exam created successfully!');
    } catch (err) {
      console.error('Error creating exam:', err);
      alert(err.response?.data?.message || 'Failed to create exam');
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateExam = async () => {
    try {
      setFormLoading(true);
      const token = localStorage.getItem('token');
      
      const examData = {
        ...formData,
        examDate: formData.examDate ? formData.examDate.toISOString() : null,
        examStartTime: formData.examStartTime ? formData.examStartTime.toTimeString().slice(0, 5) : null,
        examEndTime: formData.examEndTime ? formData.examEndTime.toTimeString().slice(0, 5) : null
      };

      await axios.put(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/exams/${selectedExam._id}`,
        examData,
        { headers: { 'x-auth-token': token } }
      );

      setEditDialog(false);
      resetForm();
      fetchExams();
      alert('Exam updated successfully!');
    } catch (err) {
      console.error('Error updating exam:', err);
      alert(err.response?.data?.message || 'Failed to update exam');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteExam = async () => {
    try {
      setFormLoading(true);
      const token = localStorage.getItem('token');
      
      await axios.delete(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/exams/${selectedExam._id}`,
        { headers: { 'x-auth-token': token } }
      );

      setDeleteDialog(false);
      setSelectedExam(null);
      fetchExams();
      alert('Exam deleted successfully!');
    } catch (err) {
      console.error('Error deleting exam:', err);
      alert(err.response?.data?.message || 'Failed to delete exam');
    } finally {
      setFormLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      examLink: '',
      examDate: null,
      examStartTime: null,
      examEndTime: null,
      guidelines: [],
      isPublished: false
    });
    setSelectedExam(null);
  };

  const openEditDialog = (exam) => {
    setSelectedExam(exam);

    // Convert time strings to Date objects for TimePicker
    const createTimeFromString = (timeString) => {
      if (!timeString) return null;
      const [hours, minutes] = timeString.split(':');
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      return date;
    };

    setFormData({
      title: exam.title,
      description: exam.description,
      examLink: exam.examLink || '',
      examDate: exam.examDate ? new Date(exam.examDate) : null,
      examStartTime: createTimeFromString(exam.examStartTime),
      examEndTime: createTimeFromString(exam.examEndTime),
      guidelines: exam.guidelines || [],
      isPublished: exam.isPublished
    });
    setEditDialog(true);
  };

  const openDeleteDialog = (exam) => {
    setSelectedExam(exam);
    setDeleteDialog(true);
  };

  const handleTogglePublish = async (exam) => {
    try {
      const token = localStorage.getItem('token');
      const newPublishStatus = !exam.isPublished;

      await axios.put(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/exams/${exam._id}/publish`,
        { isPublished: newPublishStatus },
        { headers: { 'x-auth-token': token } }
      );

      fetchExams();
      alert(`විභාගය ${newPublishStatus ? 'ප්‍රකාශ කරන ලදී' : 'ප්‍රකාශනය අවලංගු කරන ලදී'}!`);
    } catch (err) {
      console.error('Error toggling publish status:', err);
      alert(err.response?.data?.message || 'Failed to update publish status');
    }
  };

  const addGuideline = () => {
    const newGuideline = {
      guidelineNumber: formData.guidelines.length + 1,
      guidelineText: ''
    };
    setFormData(prev => ({
      ...prev,
      guidelines: [...prev.guidelines, newGuideline]
    }));
  };

  const updateGuideline = (index, text) => {
    const updatedGuidelines = [...formData.guidelines];
    updatedGuidelines[index].guidelineText = text;
    setFormData(prev => ({
      ...prev,
      guidelines: updatedGuidelines
    }));
  };

  const removeGuideline = (index) => {
    const updatedGuidelines = formData.guidelines.filter((_, i) => i !== index);
    // Renumber guidelines
    updatedGuidelines.forEach((guideline, i) => {
      guideline.guidelineNumber = i + 1;
    });
    setFormData(prev => ({
      ...prev,
      guidelines: updatedGuidelines
    }));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ mt: 2 }}
        >
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
              විභාග සහ ප්‍රතිඵල කළමනාකරණය
            </Typography>
          </Box>
          
          {classData && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <School color="primary" />
              <Typography variant="h6" sx={{
                fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
              }}>
                {classData.grade} - {classData.category}
              </Typography>
              <Chip 
                label={classData.type} 
                color="primary" 
                size="small" 
              />
            </Box>
          )}
        </Paper>

        {/* Exams Grid */}
        <Grid container spacing={3} justifyContent="center">
          {exams.map((exam) => (
            <Grid item xs={12} sm={6} md={4} key={exam._id} sx={{
            display: 'grid',
            alignItems: 'stretch', // This ensures all cards stretch to the same height
            }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card sx={{
                  height: '100%',
                  maxWidth: '350px',
                  minWidth: '350px',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6
                  }
                }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" fontWeight="bold" sx={{
                        fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                        flex: 1
                      }}>
                        {exam.title}
                      </Typography>
                      <Chip
                        label={exam.isPublished ? 'Published' : 'Draft'}
                        color={exam.isPublished ? 'success' : 'default'}
                        size="small"
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {exam.description.length > 100 
                        ? `${exam.description.substring(0, 100)}...` 
                        : exam.description
                      }
                    </Typography>

                    {exam.examLink && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <LinkIcon fontSize="small" color="primary" />
                        <Typography variant="caption" color="primary">
                          Exam Link Available
                        </Typography>
                      </Box>
                    )}

                    {exam.examDate && (
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        දිනය: {new Date(exam.examDate).toLocaleDateString('si-LK')}
                      </Typography>
                    )}

                    {(exam.examStartTime || exam.examEndTime) && (
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        වේලාව: {exam.examStartTime && exam.examEndTime
                          ? `${exam.examStartTime} - ${exam.examEndTime}`
                          : exam.examStartTime || exam.examEndTime}
                      </Typography>
                    )}

                    {/* Overdue Status */}
                    {exam.isOverdue && (
                      <Typography variant="caption" color="error" sx={{
                        display: 'block',
                        fontWeight: 'bold',
                        bgcolor: 'error.light',
                        color: 'error.contrastText',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        mt: 1
                      }}>
                        කාලය ඉකුත්
                      </Typography>
                    )}
                  </CardContent>

                  <Box sx={{ p: 2, pt: 0, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Button
                      size="small"
                      startIcon={<Grade />}
                      onClick={() => navigate(`/exam-marks/${exam._id}`)}
                      sx={{ flex: 1, minWidth: '120px' }}
                    >
                      ලකුණු ප්‍රදානය
                    </Button>
                    <Button
                      size="small"
                      startIcon={exam.isPublished ? <Unpublished /> : <Publish />}
                      onClick={() => handleTogglePublish(exam)}
                      color={exam.isPublished ? "warning" : "success"}
                      variant="outlined"
                      sx={{ minWidth: '100px' }}
                    >
                      {exam.isPublished ? 'අප්‍රකාශ' : 'ප්‍රකාශ'}
                    </Button>
                    <IconButton
                      size="small"
                      onClick={() => openEditDialog(exam)}
                      color="primary"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => openDeleteDialog(exam)}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {exams.length === 0 && (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Assignment sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" sx={{
              fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
            }}>
              විභාග නොමැත
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              නව විභාගයක් සෑදීමට + බොත්තම ක්ලික් කරන්න
            </Typography>
          </Paper>
        )}

        {/* Floating Action Button */}
        <Fab
          color="primary"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }}
          onClick={() => setCreateDialog(true)}
        >
          <Add />
        </Fab>

        {/* Create/Edit Exam Dialog */}
        <Dialog
          open={createDialog || editDialog}
          onClose={() => {
            setCreateDialog(false);
            setEditDialog(false);
            resetForm();
          }}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{
            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
            fontWeight: 'bold'
          }}>
            {createDialog ? 'නව විභාගයක් සෑදීම' : 'විභාගය සංස්කරණය'}
          </DialogTitle>
          <DialogContent>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Box sx={{ pt: 2 }}>
                <TextField
                  fullWidth
                  label="විභාග මාතෘකාව"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  sx={{ mb: 3 }}
                  required
                />

                <TextField
                  fullWidth
                  label="විස්තරය"
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  sx={{ mb: 3 }}
                  required
                />

                <TextField
                  fullWidth
                  label="විභාග සබැඳිය (විකල්ප)"
                  placeholder="https://forms.google.com/..."
                  value={formData.examLink}
                  onChange={(e) => setFormData(prev => ({ ...prev, examLink: e.target.value }))}
                  sx={{ mb: 3 }}
                  helperText="Google Forms URL හෝ වෙනත් විභාග වේදිකා සබැඳිය"
                />

                <DatePicker
                  label="විභාග දිනය (විකල්ප)"
                  value={formData.examDate}
                  onChange={(newValue) => setFormData(prev => ({ ...prev, examDate: newValue }))}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      sx={{ mb: 3 }}
                      helperText="විභාගය පැවැත්වීමට නියමිත දිනය"
                    />
                  )}
                />

                {/* Time Fields - Start and End with proper spacing */}
                <Box sx={{ display: 'flex', gap: 2, mb: 3, mt: 2 }}>
                  <TimePicker
                    label="ආරම්භ වේලාව (විකල්ප)"
                    value={formData.examStartTime}
                    onChange={(newValue) => setFormData(prev => ({ ...prev, examStartTime: newValue }))}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        helperText="විභාගය ආරම්භ වන වේලාව"
                        sx={{ mt: 1 }}
                      />
                    )}
                  />
                  <TimePicker
                    label="අවසාන වේලාව (විකල්ප)"
                    value={formData.examEndTime}
                    onChange={(newValue) => setFormData(prev => ({ ...prev, examEndTime: newValue }))}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        helperText="විභාගය අවසාන වන වේලාව"
                        sx={{ mt: 1 }}
                      />
                    )}
                  />
                </Box>

                {/* Guidelines Section */}
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                  විභාග මාර්ගෝපදේශ
                </Typography>

                {formData.guidelines.map((guideline, index) => (
                  <Box key={index} sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'flex-start' }}>
                    <Typography sx={{ mt: 2, minWidth: '30px' }}>
                      {guideline.guidelineNumber}.
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="මාර්ගෝපදේශය ඇතුළත් කරන්න..."
                      value={guideline.guidelineText}
                      onChange={(e) => updateGuideline(index, e.target.value)}
                      multiline
                      rows={2}
                    />
                    <IconButton
                      color="error"
                      onClick={() => removeGuideline(index)}
                      sx={{ mt: 1 }}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                ))}

                <Button
                  startIcon={<Add />}
                  onClick={addGuideline}
                  sx={{ mb: 3 }}
                >
                  මාර්ගෝපදේශය එක් කරන්න
                </Button>

                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isPublished}
                      onChange={(e) => setFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
                    />
                  }
                  label="විභාගය ප්‍රකාශ කරන්න"
                  sx={{ display: 'block' }}
                />
              </Box>
            </LocalizationProvider>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setCreateDialog(false);
                setEditDialog(false);
                resetForm();
              }}
            >
              අවලංගු කරන්න
            </Button>
            <Button
              variant="contained"
              onClick={createDialog ? handleCreateExam : handleUpdateExam}
              disabled={formLoading || !formData.title || !formData.description}
            >
              {formLoading ? <CircularProgress size={20} /> : (createDialog ? 'සෑදීම' : 'යාවත්කාලීන කරන්න')}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialog}
          onClose={() => setDeleteDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>මකාදැමීම තහවුරු කරන්න</DialogTitle>
          <DialogContent>
            <Typography>
              ඔබට "{selectedExam?.title}" විභාගය මකා දැමීමට අවශ්‍යද?
              මෙම ක්‍රියාව සම්බන්ධිත සියලුම ලකුණු ද මකා දමනු ඇති අතර එය අහෝසි කළ නොහැක.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialog(false)}>
              අවලංගු කරන්න
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteExam}
              disabled={formLoading}
            >
              {formLoading ? <CircularProgress size={20} /> : 'මකා දමන්න'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default AdminExamManagement;
