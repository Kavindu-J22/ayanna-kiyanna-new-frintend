import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Container,
  Grid,
  Card,
  CardContent,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  CircularProgress,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  School as SchoolIcon,
  AccessTime as TimeIcon,
  LocationOn as LocationIcon,
  People as PeopleIcon,
  CalendarToday as CalendarIcon,
  ArrowBack as ArrowBackIcon,
  Groups as GroupsIcon,
  Person as PersonIcon,
  Star as StarIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ClassForm from '../components/ClassForm';
import ClassList from '../components/ClassList';

const ClassManagement = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [stats, setStats] = useState({
    total: 0,
    normal: 0,
    special: 0,
    active: 0,
    hallClasses: 0,
    groupClasses: 0,
    individualClasses: 0,
    specialClasses: 0
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('https://ayanna-kiyanna-new-backend.onrender.com/api/classes', {
        headers: {
          'x-auth-token': token
        }
      });

      if (response.ok) {
        const data = await response.json();
        setClasses(data.classes);
        calculateStats(data.classes);
      } else {
        throw new Error('Failed to fetch classes');
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
      showSnackbar('Error fetching classes', 'error');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (classesData) => {
    const stats = {
      total: classesData.length,
      normal: classesData.filter(c => c.type === 'Normal').length,
      special: classesData.filter(c => c.type === 'Special').length,
      active: classesData.filter(c => c.isActive).length,
      hallClasses: classesData.filter(c => c.category === 'Hall Class').length,
      groupClasses: classesData.filter(c => c.category === 'Group Class').length,
      individualClasses: classesData.filter(c => c.category === 'Individual Class').length,
      specialClasses: classesData.filter(c => c.category === 'Special Class').length
    };

    // Debug log to check the stats
    console.log('Calculated stats:', stats);
    console.log('Classes data:', classesData.map(c => ({ grade: c.grade, category: c.category })));

    setStats(stats);
  };

  const handleCreateClass = () => {
    setEditingClass(null);
    setOpenForm(true);
  };

  const handleEditClass = (classItem) => {
    setEditingClass(classItem);
    setOpenForm(true);
  };

  const handleDeleteClass = (classItem) => {
    setDeleteConfirm(classItem);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://ayanna-kiyanna-new-backend.onrender.com/api/classes/${deleteConfirm._id}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token
        }
      });

      if (response.ok) {
        showSnackbar('Class deleted successfully', 'success');
        fetchClasses();
      } else {
        throw new Error('Failed to delete class');
      }
    } catch (error) {
      console.error('Error deleting class:', error);
      showSnackbar('Error deleting class', 'error');
    } finally {
      setDeleteConfirm(null);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      const token = localStorage.getItem('token');
      const url = editingClass ? `https://ayanna-kiyanna-new-backend.onrender.com/api/classes/${editingClass._id}` : 'https://ayanna-kiyanna-new-backend.onrender.com/api/classes';
      const method = editingClass ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const result = await response.json();
        showSnackbar(
          editingClass ? 'පන්තිය සාර්ථකව යාවත්කාලීන කරන ලදී' : 'පන්තිය සාර්ථකව එකතු කරන ලදී',
          'success'
        );
        setOpenForm(false);
        fetchClasses();
      } else {
        // Try to parse error response
        let errorMessage = 'පන්තිය සුරැකීමට අසමත් විය';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.errors?.[0]?.msg || errorMessage;
        } catch (parseError) {
          // If response is not JSON (like HTML error page), use status text
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error saving class:', error);
      let displayMessage = error.message;

      // Handle network errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        displayMessage = 'සර්වරයට සම්බන්ධ වීමට අසමත් විය. කරුණාකර නැවත උත්සාහ කරන්න.';
      }

      showSnackbar(displayMessage, 'error');
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const statsCards = [
    { title: 'මුළු පන්ති', value: stats.total, icon: <SchoolIcon />, color: '#667eea' },
    { title: 'සාමාන්‍ය පන්ති', value: stats.normal, icon: <CalendarIcon />, color: '#f093fb' },
    { title: 'විශේෂ/අමතර පන්ති', value: stats.special, icon: <TimeIcon />, color: '#a8edea' },
    { title: 'සක්‍රීය පන්ති', value: stats.active, icon: <PeopleIcon />, color: '#ffecd2' },
    { title: 'Hall Classes', value: stats.hallClasses, icon: <HomeIcon />, color: '#ff9a9e' },
    { title: 'Group Classes', value: stats.groupClasses, icon: <GroupsIcon />, color: '#a18cd1' },
    { title: 'Individual Classes', value: stats.individualClasses, icon: <PersonIcon />, color: '#fbc2eb' },
    { title: 'Special Classes', value: stats.specialClasses, icon: <StarIcon />, color: '#84fab0' }
  ];

  if (loading) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh'
      }}>
        <CircularProgress size={60} />
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
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/admin-dashboard')}
                sx={{
                  borderColor: '#667eea',
                  color: '#667eea',
                  '&:hover': {
                    borderColor: '#5a6fd8',
                    bgcolor: 'rgba(102, 126, 234, 0.04)'
                  },
                  fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                }}
              >
                ප්‍රධාන පිටුව
              </Button>
              <Typography variant="h4" fontWeight="bold" sx={{
                fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                color: '#333'
              }}>
                පන්ති කළමනාකරණය
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateClass}
              sx={{
                bgcolor: '#667eea',
                '&:hover': { bgcolor: '#5a6fd8' },
                fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                px: 3,
                py: 1.5
              }}
            >
              නව පන්තියක් එකතු කරන්න
            </Button>
          </Box>
        </Paper>

        {/* Statistics Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }} justifyContent="center">
          {statsCards.map((stat, index) => (
            <Grid item xs={6} sm={4} md={3} key={index}>
              <motion.div whileHover={{ scale: 1.02 }}>
                <Card sx={{
                  background: `linear-gradient(135deg, ${stat.color} 0%, ${stat.color}99 100%)`,
                  color: 'white',
                  height: '140px',
                  minWidth: '300px',
                  maxWidth: '300px',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <CardContent sx={{
                    textAlign: 'center',
                    width: '100%',
                    py: 2,
                    '&:last-child': { pb: 2 }
                  }}>
                    <Box sx={{ mb: 1 }}>
                      {React.cloneElement(stat.icon, { sx: { fontSize: 32 } })}
                    </Box>
                    <Typography variant="h5" fontWeight="bold" sx={{ mb: 0.5 }}>
                      {stat.value || 0}
                    </Typography>
                    <Typography variant="body2" sx={{
                      fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
                      fontSize: '0.75rem',
                      lineHeight: 1.1
                    }}>
                      {stat.title}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Class List */}
        <ClassList
          classes={classes}
          onEdit={handleEditClass}
          onDelete={handleDeleteClass}
          onRefresh={fetchClasses}
        />

        {/* Class Form Dialog */}
        <ClassForm
          open={openForm}
          onClose={() => setOpenForm(false)}
          onSubmit={handleFormSubmit}
          editingClass={editingClass}
        />

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={!!deleteConfirm}
          onClose={() => setDeleteConfirm(null)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{
            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
          }}>
            පන්තිය මකන්න
          </DialogTitle>
          <DialogContent>
            <Typography sx={{
              fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
            }}>
              ඔබට මෙම පන්තිය මැකීමට අවශ්‍ය බව විශ්වාසද?
              {deleteConfirm && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                  <Typography variant="body2">
                    <strong>ශ්‍රේණිය:</strong> {deleteConfirm.grade}<br/>
                    <strong>වර්ගය:</strong> {deleteConfirm.type}<br/>
                    <strong>දිනය:</strong> {deleteConfirm.date}<br/>
                    <strong>වේලාව:</strong> {deleteConfirm.startTime} - {deleteConfirm.endTime}
                  </Typography>
                </Box>
              )}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteConfirm(null)}>
              අවලංගු කරන්න
            </Button>
            <Button
              onClick={confirmDelete}
              color="error"
              variant="contained"
            >
              මකන්න
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default ClassManagement;
