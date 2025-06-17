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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Checkbox,
  Fab,
  Tooltip
} from '@mui/material';
import {
  ArrowBack,
  Add,
  Edit,
  Delete,
  CalendarToday,
  Assignment,
  CheckCircle,
  RadioButtonUnchecked,
  Save,
  Cancel
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';

const AdminTimeScheduleManagement = () => {
  const { classId } = useParams();
  const navigate = useNavigate();

  // State management
  const [classData, setClassData] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Dialog states
  const [createDialog, setCreateDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    week: 1,
    tasks: [],
    note: ''
  });
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [currentWeekInfo, setCurrentWeekInfo] = useState(null);

  // Filter states
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  useEffect(() => {
    fetchClassData();
    fetchCurrentWeekInfo();
    fetchSchedules();
  }, [classId]);

  useEffect(() => {
    fetchSchedules();
  }, [selectedYear, selectedMonth]);

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

  const fetchCurrentWeekInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'https://ayanna-kiyanna-new-backend.onrender.com/api/time-schedules/current-week-info',
        { headers: { 'x-auth-token': token } }
      );
      setCurrentWeekInfo(response.data);
      
      // Auto-fill form with current week info
      setFormData(prev => ({
        ...prev,
        year: response.data.year,
        month: response.data.month,
        week: response.data.week
      }));
    } catch (error) {
      console.error('Error fetching current week info:', error);
    }
  };

  const fetchSchedules = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/time-schedules/class/${classId}?year=${selectedYear}&month=${selectedMonth}`,
        { headers: { 'x-auth-token': token } }
      );
      setSchedules(response.data);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      setError('Error loading schedules');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSchedule = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'https://ayanna-kiyanna-new-backend.onrender.com/api/time-schedules',
        {
          classId,
          ...formData
        },
        { headers: { 'x-auth-token': token } }
      );
      
      setSuccess('කාලසටහන සාර්ථකව සාදන ලදී');
      setCreateDialog(false);
      resetForm();
      fetchSchedules();
    } catch (error) {
      console.error('Error creating schedule:', error);
      setError(error.response?.data?.message || 'Error creating schedule');
    }
  };

  const handleUpdateSchedule = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/time-schedules/${selectedSchedule._id}`,
        formData,
        { headers: { 'x-auth-token': token } }
      );
      
      setSuccess('කාලසටහන සාර්ථකව යාවත්කාලීන කරන ලදී');
      setEditDialog(false);
      resetForm();
      fetchSchedules();
    } catch (error) {
      console.error('Error updating schedule:', error);
      setError(error.response?.data?.message || 'Error updating schedule');
    }
  };

  const handleDeleteSchedule = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/time-schedules/${selectedSchedule._id}`,
        { headers: { 'x-auth-token': token } }
      );
      
      setSuccess('කාලසටහන සාර්ථකව ඉවත් කරන ලදී');
      setDeleteDialog(false);
      setSelectedSchedule(null);
      fetchSchedules();
    } catch (error) {
      console.error('Error deleting schedule:', error);
      setError('Error deleting schedule');
    }
  };

  const handleToggleTask = async (scheduleId, taskId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/time-schedules/${scheduleId}/tasks/${taskId}/toggle`,
        {},
        { headers: { 'x-auth-token': token } }
      );
      
      fetchSchedules();
    } catch (error) {
      console.error('Error toggling task:', error);
      setError('Error updating task status');
    }
  };

  const addTask = () => {
    if (newTask.title.trim()) {
      setFormData(prev => ({
        ...prev,
        tasks: [...prev.tasks, { ...newTask, isDone: false }]
      }));
      setNewTask({ title: '', description: '' });
    }
  };

  const removeTask = (index) => {
    setFormData(prev => ({
      ...prev,
      tasks: prev.tasks.filter((_, i) => i !== index)
    }));
  };

  const resetForm = () => {
    setFormData({
      year: currentWeekInfo?.year || new Date().getFullYear(),
      month: currentWeekInfo?.month || new Date().getMonth() + 1,
      week: currentWeekInfo?.week || 1,
      tasks: [],
      note: ''
    });
    setNewTask({ title: '', description: '' });
    setSelectedSchedule(null);
  };

  const openEditDialog = (schedule) => {
    setSelectedSchedule(schedule);
    setFormData({
      year: schedule.year,
      month: schedule.month,
      week: schedule.week,
      tasks: schedule.tasks || [],
      note: schedule.note || ''
    });
    setEditDialog(true);
  };

  const openDeleteDialog = (schedule) => {
    setSelectedSchedule(schedule);
    setDeleteDialog(true);
  };

  const getMonthName = (monthNumber) => {
    const months = [
      'ජනවාරි', 'පෙබරවාරි', 'මාර්තු', 'අප්‍රේල්', 'මැයි', 'ජූනි',
      'ජූලි', 'අගෝස්තු', 'සැප්තැම්බර්', 'ඔක්තෝබර්', 'නොවැම්බර්', 'දෙසැම්බර්'
    ];
    return months[monthNumber - 1] || monthNumber;
  };

  const getWeekName = (weekNumber) => {
    const weeks = ['පළමු', 'දෙවන', 'තෙවන', 'සිව්වන', 'පස්වන'];
    return weeks[weekNumber - 1] || `${weekNumber} වන`;
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
              පාඩම් කාලසටහන් කළමනාකරණය
            </Typography>
          </Box>
          
          {classData && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CalendarToday color="primary" />
              <Typography variant="h6" sx={{
                fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
              }}>
                {classData.grade} - {classData.category}
              </Typography>
              <Chip label={classData.type} color="primary" size="small" />
            </Box>
          )}
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

        {/* Current Week Info */}
        {currentWeekInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
              <Typography variant="h6" fontWeight="bold" sx={{
                fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                mb: 2
              }}>
                වර්තමාන සතිය
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Chip 
                  label={`වර්ෂය: ${currentWeekInfo.year}`} 
                  color="primary" 
                  variant="outlined" 
                />
                <Chip 
                  label={`මාසය: ${getMonthName(currentWeekInfo.month)}`} 
                  color="secondary" 
                  variant="outlined" 
                />
                <Chip 
                  label={`සතිය: ${getWeekName(currentWeekInfo.week)}`} 
                  color="success" 
                  variant="outlined" 
                />
              </Box>
            </Paper>
          </motion.div>
        )}

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight="bold" sx={{
              fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
              mb: 2
            }}>
              පෙරහන්
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>වර්ෂය</InputLabel>
                  <Select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    label="වර්ෂය"
                  >
                    {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(year => (
                      <MenuItem key={year} value={year}>{year}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>මාසය</InputLabel>
                  <Select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    label="මාසය"
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                      <MenuItem key={month} value={month}>
                        {getMonthName(month)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>
        </motion.div>

        {/* Schedules Grid */}
        <Grid container spacing={3} justifyContent="center">
          {schedules.map((schedule, index) => (
            <Grid item xs={12} md={6} lg={4} key={schedule._id} sx={{
            display: 'grid',
            alignItems: 'stretch', // This ensures all cards stretch to the same height
            }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card sx={{
                  height: '100%',
                  maxWidth: '350px',
                  minWidth: '350px',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                  border: '1px solid #e0e0e0',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                  },
                  display: 'flex', // Add this to make the card a flex container
                  flexDirection: 'column' // Add this to make content flow vertically
                }}>
                  <CardContent sx={{ 
                  p: 3,
                  flex: 1, // This makes the content take up available space
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                    {/* Schedule Header */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" fontWeight="bold" sx={{
                        fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                      }}>
                        {getMonthName(schedule.month)} - {getWeekName(schedule.week)} සතිය
                      </Typography>
                      <Box>
                        <IconButton 
                          size="small" 
                          onClick={() => openEditDialog(schedule)}
                          sx={{ mr: 1 }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => openDeleteDialog(schedule)}
                          color="error"
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>

                    {/* Year Display */}
                    <Chip 
                      label={`වර්ෂය: ${schedule.year}`} 
                      size="small" 
                      sx={{ mb: 2 }} 
                    />

                    {/* Tasks */}
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                      කාර්ය ({schedule.completedTasksCount || 0}/{schedule.totalTasksCount || 0})
                    </Typography>
                    
                    {schedule.tasks && schedule.tasks.length > 0 ? (
                      <List dense sx={{ mb: 2 }}>
                        {schedule.tasks.map((task) => (
                          <ListItem key={task._id} sx={{ px: 0 }}>
                            <Checkbox
                              checked={task.isDone}
                              onChange={() => handleToggleTask(schedule._id, task._id)}
                              icon={<RadioButtonUnchecked />}
                              checkedIcon={<CheckCircle />}
                              sx={{ mr: 1 }}
                            />
                            <ListItemText
                              primary={task.title}
                              secondary={task.description}
                              sx={{
                                textDecoration: task.isDone ? 'line-through' : 'none',
                                opacity: task.isDone ? 0.7 : 1
                              }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        කාර්ය නොමැත
                      </Typography>
                    )}

                    {/* Note */}
                    {schedule.note && (
                      <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                        <Typography variant="body2" sx={{
                          fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                        }}>
                          <strong>සටහන:</strong> {schedule.note}
                        </Typography>
                      </Box>
                    )}

                    {/* Progress Bar */}
                    <Box sx={{ mt: 'auto', pt: 2 }}> {/* This will push it to the bottom */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="caption">ප්‍රගතිය</Typography>
                      <Typography variant="caption">{schedule.completionPercentage || 0}%</Typography>
                    </Box>
                    <Box sx={{
                      width: '100%',
                      height: 8,
                      bgcolor: '#e0e0e0',
                      borderRadius: 4,
                      overflow: 'hidden'
                    }}>
                      <Box sx={{
                        width: `${schedule.completionPercentage || 0}%`,
                        height: '100%',
                        bgcolor: schedule.completionPercentage === 100 ? '#4caf50' : '#2196f3',
                        transition: 'width 0.3s ease'
                      }} />
                    </Box>
                  </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* No Schedules Message */}
        {schedules.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
              <CalendarToday sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" sx={{
                fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                mb: 1
              }}>
                කාලසටහන් නොමැත
              </Typography>
              <Typography variant="body2" color="text.secondary">
                මෙම මාසය සඳහා කාලසටහන් නොමැත. නව කාලසටහනක් සාදන්න.
              </Typography>
            </Paper>
          </motion.div>
        )}

        {/* Floating Action Button */}
        <Tooltip title="නව කාලසටහනක් සාදන්න">
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

        {/* Create Schedule Dialog */}
        <Dialog
          open={createDialog}
          onClose={() => setCreateDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{
            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
            fontWeight: 'bold'
          }}>
            නව කාලසටහනක් සාදන්න
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              {/* Year, Month, Week Selection */}
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="වර්ෂය"
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                  inputProps={{ min: 2020, max: 2050 }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>මාසය</InputLabel>
                  <Select
                    value={formData.month}
                    onChange={(e) => setFormData(prev => ({ ...prev, month: e.target.value }))}
                    label="මාසය"
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                      <MenuItem key={month} value={month}>
                        {getMonthName(month)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>සතිය</InputLabel>
                  <Select
                    value={formData.week}
                    onChange={(e) => setFormData(prev => ({ ...prev, week: e.target.value }))}
                    label="සතිය"
                  >
                    {Array.from({ length: 5 }, (_, i) => i + 1).map(week => (
                      <MenuItem key={week} value={week}>
                        {getWeekName(week)} සතිය
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Add Task Section */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{
                  fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                  mb: 2
                }}>
                  කාර්ය එක් කරන්න
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="කාර්ය මාතෘකාව *"
                      value={newTask.title}
                      onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="කාර්ය මාතෘකාව ඇතුල් කරන්න"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="විස්තරය (විකල්ප)"
                      value={newTask.description}
                      onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="කාර්ය විස්තරය"
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={addTask}
                      disabled={!newTask.title.trim()}
                      sx={{ height: '56px' }}
                    >
                      <Add />
                    </Button>
                  </Grid>
                </Grid>
              </Grid>

              {/* Tasks List */}
              {formData.tasks.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    එක් කරන ලද කාර්ය ({formData.tasks.length})
                  </Typography>
                  <List>
                    {formData.tasks.map((task, index) => (
                      <ListItem key={index} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, mb: 1 }}>
                        <ListItemText
                          primary={task.title}
                          secondary={task.description}
                        />
                        <ListItemSecondaryAction>
                          <IconButton onClick={() => removeTask(index)} color="error">
                            <Delete />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              )}

              {/* Note */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="සටහන (විකල්ප)"
                  multiline
                  rows={3}
                  value={formData.note}
                  onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
                  placeholder="සතිය සඳහා විශේෂ සටහන්"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCreateDialog(false)} startIcon={<Cancel />}>
              අවලංගු කරන්න
            </Button>
            <Button
              onClick={handleCreateSchedule}
              variant="contained"
              startIcon={<Save />}
              disabled={formData.tasks.length === 0}
            >
              සාදන්න
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Schedule Dialog */}
        <Dialog
          open={editDialog}
          onClose={() => setEditDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{
            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
            fontWeight: 'bold'
          }}>
            කාලසටහන සංස්කරණය කරන්න
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              {/* Year, Month, Week Selection */}
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="වර්ෂය"
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                  inputProps={{ min: 2020, max: 2050 }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>මාසය</InputLabel>
                  <Select
                    value={formData.month}
                    onChange={(e) => setFormData(prev => ({ ...prev, month: e.target.value }))}
                    label="මාසය"
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                      <MenuItem key={month} value={month}>
                        {getMonthName(month)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>සතිය</InputLabel>
                  <Select
                    value={formData.week}
                    onChange={(e) => setFormData(prev => ({ ...prev, week: e.target.value }))}
                    label="සතිය"
                  >
                    {Array.from({ length: 5 }, (_, i) => i + 1).map(week => (
                      <MenuItem key={week} value={week}>
                        {getWeekName(week)} සතිය
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Add Task Section */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{
                  fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                  mb: 2
                }}>
                  කාර්ය එක් කරන්න
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="කාර්ය මාතෘකාව *"
                      value={newTask.title}
                      onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="කාර්ය මාතෘකාව ඇතුල් කරන්න"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="විස්තරය (විකල්ප)"
                      value={newTask.description}
                      onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="කාර්ය විස්තරය"
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={addTask}
                      disabled={!newTask.title.trim()}
                      sx={{ height: '56px' }}
                    >
                      <Add />
                    </Button>
                  </Grid>
                </Grid>
              </Grid>

              {/* Tasks List */}
              {formData.tasks.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    කාර්ය ලැයිස්තුව ({formData.tasks.length})
                  </Typography>
                  <List>
                    {formData.tasks.map((task, index) => (
                      <ListItem key={index} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, mb: 1 }}>
                        <Checkbox
                          checked={task.isDone || false}
                          onChange={(e) => {
                            const updatedTasks = [...formData.tasks];
                            updatedTasks[index] = { ...task, isDone: e.target.checked };
                            setFormData(prev => ({ ...prev, tasks: updatedTasks }));
                          }}
                          icon={<RadioButtonUnchecked />}
                          checkedIcon={<CheckCircle />}
                          sx={{ mr: 1 }}
                        />
                        <ListItemText
                          primary={task.title}
                          secondary={task.description}
                          sx={{
                            textDecoration: task.isDone ? 'line-through' : 'none',
                            opacity: task.isDone ? 0.7 : 1
                          }}
                        />
                        <ListItemSecondaryAction>
                          <IconButton onClick={() => removeTask(index)} color="error">
                            <Delete />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              )}

              {/* Note */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="සටහන (විකල්ප)"
                  multiline
                  rows={3}
                  value={formData.note}
                  onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
                  placeholder="සතිය සඳහා විශේෂ සටහන්"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialog(false)} startIcon={<Cancel />}>
              අවලංගු කරන්න
            </Button>
            <Button
              onClick={handleUpdateSchedule}
              variant="contained"
              startIcon={<Save />}
            >
              යාවත්කාලීන කරන්න
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
            fontWeight: 'bold',
            color: 'error.main'
          }}>
            කාලසටහන ඉවත් කරන්න
          </DialogTitle>
          <DialogContent>
            <Typography sx={{
              fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
            }}>
              ඔබට මෙම කාලසටහන ඉවත් කිරීමට අවශ්‍ය බව විශ්වාසද? මෙම ක්‍රියාව ආපසු හැරවිය නොහැක.
            </Typography>
            {selectedSchedule && (
              <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                <Typography variant="subtitle2">
                  {getMonthName(selectedSchedule.month)} - {getWeekName(selectedSchedule.week)} සතිය ({selectedSchedule.year})
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  කාර්ය: {selectedSchedule.totalTasksCount || 0}
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialog(false)}>
              අවලංගු කරන්න
            </Button>
            <Button
              onClick={handleDeleteSchedule}
              variant="contained"
              color="error"
              startIcon={<Delete />}
            >
              ඉවත් කරන්න
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default AdminTimeScheduleManagement;
