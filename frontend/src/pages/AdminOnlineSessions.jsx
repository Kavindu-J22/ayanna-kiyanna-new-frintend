import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  Paper,
  Fab,
  Tooltip
} from '@mui/material';
import {
  ArrowBack,
  Add,
  VideoCall,
  Edit,
  Delete,
  AccessTime,
  CalendarToday,
  Link as LinkIcon,
  Close,
  Save
} from '@mui/icons-material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const AdminOnlineSessions = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  
  // State management
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createDialog, setCreateDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [classData, setClassData] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    meetingLink: '',
    meetingId: '',
    sessionDate: new Date(),
    startTime: new Date(),
    endTime: new Date(),
    guidelines: [''],
    additionalNote: ''
  });

  // Fetch class data and sessions
  useEffect(() => {
    fetchClassData();
    fetchSessions();
  }, [classId]);

  const fetchClassData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`https://ayanna-kiyanna-new-backend.onrender.com/api/classes/${classId}`, {
        headers: { 'x-auth-token': token }
      });
      setClassData(response.data.data);
    } catch (error) {
      console.error('Error fetching class data:', error);
    }
  };

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`https://ayanna-kiyanna-new-backend.onrender.com/api/online-sessions/class/${classId}`, {
        headers: { 'x-auth-token': token }
      });
      setSessions(response.data.data || []);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSession = async () => {
    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');
      
      // Format the data
      const sessionData = {
        ...formData,
        classId,
        sessionDate: formData.sessionDate.toISOString().split('T')[0],
        startTime: formData.startTime.toTimeString().slice(0, 5),
        endTime: formData.endTime.toTimeString().slice(0, 5),
        guidelines: formData.guidelines.filter(g => g.trim() !== '')
      };

      await axios.post('https://ayanna-kiyanna-new-backend.onrender.com/api/online-sessions', sessionData, {
        headers: { 'x-auth-token': token }
      });

      setCreateDialog(false);
      resetForm();
      fetchSessions();
    } catch (error) {
      console.error('Error creating session:', error);
      alert('Error creating session: ' + (error.response?.data?.message || error.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSession = async () => {
    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');
      
      const sessionData = {
        ...formData,
        sessionDate: formData.sessionDate.toISOString().split('T')[0],
        startTime: formData.startTime.toTimeString().slice(0, 5),
        endTime: formData.endTime.toTimeString().slice(0, 5),
        guidelines: formData.guidelines.filter(g => g.trim() !== '')
      };

      await axios.put(`https://ayanna-kiyanna-new-backend.onrender.com/api/online-sessions/${selectedSession._id}`, sessionData, {
        headers: { 'x-auth-token': token }
      });

      setEditDialog(false);
      resetForm();
      fetchSessions();
    } catch (error) {
      console.error('Error updating session:', error);
      alert('Error updating session: ' + (error.response?.data?.message || error.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSession = async () => {
    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');
      
      await axios.delete(`https://ayanna-kiyanna-new-backend.onrender.com/api/online-sessions/${selectedSession._id}`, {
        headers: { 'x-auth-token': token }
      });

      setDeleteDialog(false);
      setSelectedSession(null);
      fetchSessions();
    } catch (error) {
      console.error('Error deleting session:', error);
      alert('Error deleting session: ' + (error.response?.data?.message || error.message));
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      meetingLink: '',
      meetingId: '',
      sessionDate: new Date(),
      startTime: new Date(),
      endTime: new Date(),
      guidelines: [''],
      additionalNote: ''
    });
    setSelectedSession(null);
  };

  const openEditDialog = (session) => {
    setSelectedSession(session);
    setFormData({
      title: session.title,
      description: session.description || '',
      meetingLink: session.meetingLink,
      meetingId: session.meetingId || '',
      sessionDate: new Date(session.sessionDate),
      startTime: new Date(`2000-01-01T${session.startTime}:00`),
      endTime: new Date(`2000-01-01T${session.endTime}:00`),
      guidelines: session.guidelines.length > 0 ? session.guidelines : [''],
      additionalNote: session.additionalNote || ''
    });
    setEditDialog(true);
  };

  const addGuideline = () => {
    setFormData(prev => ({
      ...prev,
      guidelines: [...prev.guidelines, '']
    }));
  };

  const updateGuideline = (index, value) => {
    setFormData(prev => ({
      ...prev,
      guidelines: prev.guidelines.map((g, i) => i === index ? value : g)
    }));
  };

  const removeGuideline = (index) => {
    setFormData(prev => ({
      ...prev,
      guidelines: prev.guidelines.filter((_, i) => i !== index)
    }));
  };

  const getSessionStatus = (session) => {
    const now = new Date();
    const sessionDate = new Date(session.sessionDate);
    const [startHour, startMinute] = session.startTime.split(':').map(Number);
    const [endHour, endMinute] = session.endTime.split(':').map(Number);
    
    const startDateTime = new Date(sessionDate);
    startDateTime.setHours(startHour, startMinute, 0, 0);
    
    const endDateTime = new Date(sessionDate);
    endDateTime.setHours(endHour, endMinute, 0, 0);
    
    if (now < startDateTime) {
      return { status: 'upcoming', color: 'primary', text: 'ඉදිරියට' };
    } else if (now >= startDateTime && now <= endDateTime) {
      return { status: 'live', color: 'success', text: 'සජීවී' };
    } else {
      return { status: 'ended', color: 'default', text: 'අවසන්' };
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <IconButton onClick={() => navigate(`/specific-class/${classId}`)} sx={{ mr: 2 }}>
              <ArrowBack />
            </IconButton>
            <VideoCall sx={{ fontSize: 32, mr: 2, color: 'primary.main' }} />
            <Typography variant="h4" fontWeight="bold" sx={{
              fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
            }}>
              Online Sessions කළමනාකරණය
            </Typography>
          </Box>
          {classData && (
            <Typography variant="h6" color="text.secondary" sx={{
              fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
            }}>
              {classData.grade} - {classData.category}
            </Typography>
          )}
        </Box>

        {/* Sessions Grid */}
        <Grid container spacing={3}>
          <AnimatePresence>
            {sessions.map((session) => {
              const statusInfo = getSessionStatus(session);
              return (
                <Grid item xs={12} md={6} lg={4} key={session._id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Card sx={{
                      height: '100%',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      position: 'relative'
                    }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Typography variant="h6" fontWeight="bold" sx={{
                            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                          }}>
                            {session.title}
                          </Typography>
                          <Chip
                            label={statusInfo.text}
                            color={statusInfo.color}
                            size="small"
                            sx={{ color: 'white' }}
                          />
                        </Box>
                        
                        {session.description && (
                          <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
                            {session.description}
                          </Typography>
                        )}
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <CalendarToday sx={{ fontSize: 16, mr: 1 }} />
                          <Typography variant="body2">
                            {new Date(session.sessionDate).toLocaleDateString('si-LK')}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <AccessTime sx={{ fontSize: 16, mr: 1 }} />
                          <Typography variant="body2">
                            {session.startTime} - {session.endTime}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          <Button
                            size="small"
                            startIcon={<Edit />}
                            onClick={() => openEditDialog(session)}
                            sx={{
                              backgroundColor: 'rgba(255, 255, 255, 0.2)',
                              color: 'white',
                              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.3)' }
                            }}
                          >
                            සංස්කරණය
                          </Button>
                          <Button
                            size="small"
                            startIcon={<Delete />}
                            onClick={() => {
                              setSelectedSession(session);
                              setDeleteDialog(true);
                            }}
                            sx={{
                              backgroundColor: 'rgba(244, 67, 54, 0.8)',
                              color: 'white',
                              '&:hover': { backgroundColor: 'rgba(244, 67, 54, 1)' }
                            }}
                          >
                            ඉවත් කරන්න
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              );
            })}
          </AnimatePresence>
        </Grid>

        {sessions.length === 0 && (
          <Paper sx={{ p: 4, textAlign: 'center', mt: 4 }}>
            <VideoCall sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" sx={{
              fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
            }}>
              මෙම පන්තිය සඳහා Online Sessions නොමැත
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              නව Online Session එකක් සාදන්න
            </Typography>
          </Paper>
        )}

        {/* Floating Action Button */}
        <Tooltip title="නව Online Session සාදන්න">
          <Fab
            color="primary"
            sx={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}
            onClick={() => {
              resetForm();
              setCreateDialog(true);
            }}
          >
            <Add />
          </Fab>
        </Tooltip>

        {/* Create/Edit Dialog */}
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
            fontWeight: 'bold',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>{editDialog ? 'Online Session සංස්කරණය කරන්න' : 'නව Online Session සාදන්න'}</span>
            <IconButton onClick={() => {
              setCreateDialog(false);
              setEditDialog(false);
              resetForm();
            }}>
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              {/* Title */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="සැසි මාතෘකාව *"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </Grid>

              {/* Description */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="විස්තරය"
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </Grid>

              {/* Meeting Link */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Meeting Link *"
                  value={formData.meetingLink}
                  onChange={(e) => setFormData(prev => ({ ...prev, meetingLink: e.target.value }))}
                  required
                  placeholder="https://zoom.us/j/..."
                />
              </Grid>

              {/* Meeting ID */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Meeting ID"
                  value={formData.meetingId}
                  onChange={(e) => setFormData(prev => ({ ...prev, meetingId: e.target.value }))}
                  placeholder="123 456 789"
                />
              </Grid>

              {/* Date */}
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="දිනය *"
                  value={formData.sessionDate}
                  onChange={(newValue) => setFormData(prev => ({ ...prev, sessionDate: newValue }))}
                  renderInput={(params) => <TextField {...params} fullWidth required />}
                  minDate={new Date()}
                />
              </Grid>

              {/* Start Time */}
              <Grid item xs={12} sm={6}>
                <TimePicker
                  label="ආරම්භ වේලාව *"
                  value={formData.startTime}
                  onChange={(newValue) => setFormData(prev => ({ ...prev, startTime: newValue }))}
                  renderInput={(params) => <TextField {...params} fullWidth required />}
                />
              </Grid>

              {/* End Time */}
              <Grid item xs={12} sm={6}>
                <TimePicker
                  label="අවසාන වේලාව *"
                  value={formData.endTime}
                  onChange={(newValue) => setFormData(prev => ({ ...prev, endTime: newValue }))}
                  renderInput={(params) => <TextField {...params} fullWidth required />}
                />
              </Grid>

              {/* Guidelines */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                  මාර්ගෝපදේශ
                </Typography>
                {formData.guidelines.map((guideline, index) => (
                  <Box key={index} sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <TextField
                      fullWidth
                      label={`මාර්ගෝපදේශය ${index + 1}`}
                      value={guideline}
                      onChange={(e) => updateGuideline(index, e.target.value)}
                      multiline
                      rows={2}
                    />
                    {formData.guidelines.length > 1 && (
                      <IconButton
                        onClick={() => removeGuideline(index)}
                        color="error"
                        sx={{ alignSelf: 'flex-start', mt: 1 }}
                      >
                        <Delete />
                      </IconButton>
                    )}
                  </Box>
                ))}
                <Button
                  startIcon={<Add />}
                  onClick={addGuideline}
                  variant="outlined"
                  size="small"
                >
                  මාර්ගෝපදේශයක් එක් කරන්න
                </Button>
              </Grid>

              {/* Additional Note */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="අමතර සටහන"
                  multiline
                  rows={3}
                  value={formData.additionalNote}
                  onChange={(e) => setFormData(prev => ({ ...prev, additionalNote: e.target.value }))}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
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
              onClick={editDialog ? handleEditSession : handleCreateSession}
              disabled={submitting || !formData.title || !formData.meetingLink}
              startIcon={submitting ? <CircularProgress size={20} /> : <Save />}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
              }}
            >
              {editDialog ? 'යාවත්කාලීන කරන්න' : 'සාදන්න'}
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
          <DialogTitle sx={{
            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
            fontWeight: 'bold'
          }}>
            Online Session ඉවත් කරන්න
          </DialogTitle>
          <DialogContent>
            <Alert severity="warning" sx={{ mb: 2 }}>
              ඔබට මෙම Online Session ඉවත් කිරීමට අවශ්‍යද?
            </Alert>
            {selectedSession && (
              <Typography variant="body1" sx={{
                fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
              }}>
                <strong>මාතෘකාව:</strong> {selectedSession.title}
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialog(false)}>
              අවලංගු කරන්න
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteSession}
              disabled={submitting}
              startIcon={submitting ? <CircularProgress size={20} /> : <Delete />}
            >
              ඉවත් කරන්න
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </LocalizationProvider>
  );
};

export default AdminOnlineSessions;
