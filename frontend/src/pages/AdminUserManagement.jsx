import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Avatar,
  Chip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  Badge
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  School as SchoolIcon,
  AdminPanelSettings as AdminIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, user: null });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    // Filter users based on search term
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user =>
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'https://ayanna-kiyanna-new-backend.onrender.com/api/users/all',
        { headers: { 'x-auth-token': token } }
      );

      if (response.data.success) {
        setUsers(response.data.data);
        setFilteredUsers(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('පරිශීලකයින් ලබා ගැනීමේදී දෝෂයක් ඇතිවිය');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteDialog.user) return;

    setDeleting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/users/${deleteDialog.user._id}`,
        { headers: { 'x-auth-token': token } }
      );

      if (response.data.success) {
        setSuccess('පරිශීලකයා සාර්ථකව මකා දමන ලදී');
        fetchUsers(); // Refresh the list
        setDeleteDialog({ open: false, user: null });
      }
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('පරිශීලකයා මකා දැමීමේදී දෝෂයක් ඇතිවිය');
    } finally {
      setDeleting(false);
    }
  };

  const openDeleteDialog = (user) => {
    setDeleteDialog({ open: true, user });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({ open: false, user: null });
  };

  const getUserRoleInfo = (user) => {
    if (user.role === 'admin') {
      return { label: 'Admin', color: '#f44336', icon: <AdminIcon /> };
    } else if (user.studentPassword) {
      return { label: 'Student', color: '#4caf50', icon: <SchoolIcon /> };
    } else {
      return { label: 'User', color: '#2196f3', icon: <PersonIcon /> };
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('si-LK');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      py: 4
    }}>
      <Container maxWidth="xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <Paper elevation={8} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{
              fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
              fontWeight: 'bold',
              textAlign: 'center',
              background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              පරිශීලක කළමනාකරණය
            </Typography>
            
            {/* Search Bar */}
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
              <TextField
                placeholder="නම හෝ ඊමේල් මගින් සොයන්න..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ width: '100%', maxWidth: 500 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Paper>

          {/* Alerts */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                  {error}
                </Alert>
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
                  {success}
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stats */}
          <Paper elevation={4} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                    {users.filter(user => user.studentPassword).length}
                  </Typography>
                  <Typography variant="body1">සිසුන්</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: '#f44336', fontWeight: 'bold' }}>
                    {users.filter(user => user.role === 'admin').length}
                  </Typography>
                  <Typography variant="body1">පරිපාලකයින්</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: '#2196f3', fontWeight: 'bold' }}>
                    {users.length}
                  </Typography>
                  <Typography variant="body1">සම්පූර්ණ පරිශීලකයින්</Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Users Grid */}
          <Grid container spacing={3} justifyContent="center">
            {filteredUsers.map((user) => {
              const roleInfo = getUserRoleInfo(user);
              return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={user._id} sx={{
                  display: 'grid',
                  alignItems: 'stretch', // This ensures all cards stretch to the same height
                  }}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card sx={{
                      height: '100%',
                      display: 'flex',
                      minWidth: '300px',
                      maxWidth: '300px',
                      flexDirection: 'column',
                      borderRadius: 3,
                      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                      border: `2px solid ${roleInfo.color}20`,
                      position: 'relative'
                    }}>
                      {/* Role Badge */}
                      <Box sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        zIndex: 1
                      }}>
                        <Chip
                          icon={roleInfo.icon}
                          label={roleInfo.label}
                          size="small"
                          sx={{
                            backgroundColor: roleInfo.color,
                            color: 'white',
                            fontWeight: 'bold',
                            '& .MuiChip-icon': {
                              color: 'white'
                            }
                          }}
                        />
                      </Box>

                      <CardContent sx={{ flexGrow: 1, pt: 5 }}>
                        {/* Avatar and Name */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                          <Avatar sx={{ 
                            width: 60, 
                            height: 60, 
                            mb: 2,
                            backgroundColor: roleInfo.color,
                            fontSize: '1.5rem'
                          }}>
                            {user.fullName.charAt(0).toUpperCase()}
                          </Avatar>
                          
                          <Box sx={{ textAlign: 'center', width: '100%' }}>
                            <Typography variant="h6" gutterBottom sx={{
                              fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                              fontWeight: 'bold',
                              wordBreak: 'break-word'
                            }}>
                              {user.fullName}
                            </Typography>
                          </Box>
                        </Box>

                        {/* Email */}
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <EmailIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2" sx={{ 
                            wordBreak: 'break-word',
                            fontSize: '0.8rem'
                          }}>
                            {user.email}
                          </Typography>
                        </Box>

                        {/* Registration Date */}
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
                          ලියාපදිංචි: {formatDate(user.createdAt)}
                        </Typography>
                      </CardContent>
                      
                      <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                        <Tooltip title="පරිශීලකයා මකන්න">
                          <Button
                            startIcon={<DeleteIcon />}
                            onClick={() => openDeleteDialog(user)}
                            variant="outlined"
                            color="error"
                            size="small"
                          >
                            මකන්න
                          </Button>
                        </Tooltip>
                      </CardActions>
                    </Card>
                  </motion.div>
                </Grid>
              );
            })}
          </Grid>

          {filteredUsers.length === 0 && !loading && (
            <Paper elevation={4} sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
              <Typography variant="h6" color="text.secondary">
                {searchTerm ? 'සෙවුම් ප්‍රතිඵල නොමැත' : 'පරිශීලකයින් නොමැත'}
              </Typography>
              {searchTerm && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  "{searchTerm}" සඳහා ප්‍රතිඵල සොයා ගත නොහැකි විය
                </Typography>
              )}
            </Paper>
          )}
        </motion.div>
      </Container>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={closeDeleteDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{
          background: 'linear-gradient(45deg, #f44336 30%, #d32f2f 90%)',
          color: 'white',
          fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
        }}>
          පරිශීලකයා මකා දැමීම
          <IconButton
            onClick={closeDeleteDialog}
            sx={{ position: 'absolute', right: 8, top: 8, color: 'white' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          {deleteDialog.user && (
            <Box>
              <Typography variant="body1" gutterBottom>
                ඔබට මෙම පරිශීලකයා මකා දැමීමට අවශ්‍යද?
              </Typography>

              <Box sx={{
                mt: 2,
                p: 2,
                bgcolor: 'grey.100',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center'
              }}>
                <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                  {deleteDialog.user.fullName.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {deleteDialog.user.fullName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {deleteDialog.user.email}
                  </Typography>
                  {deleteDialog.user.studentPassword && (
                    <Chip
                      icon={<SchoolIcon />}
                      label="Student"
                      size="small"
                      sx={{
                        mt: 1,
                        backgroundColor: '#4caf50',
                        color: 'white',
                        '& .MuiChip-icon': {
                          color: 'white'
                        }
                      }}
                    />
                  )}
                </Box>
              </Box>

              <Alert severity="warning" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>අවවාදයයි:</strong> මෙම ක්‍රියාව ආපසු හැරවිය නොහැක. පරිශීලකයාගේ සියලුම දත්ත ස්ථිරවම මකා දැමෙනු ඇත.
                </Typography>
              </Alert>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={closeDeleteDialog} disabled={deleting}>
            අවලංගු කරන්න
          </Button>
          <Button
            onClick={handleDeleteUser}
            variant="contained"
            color="error"
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={20} /> : <DeleteIcon />}
          >
            {deleting ? 'මකමින්...' : 'මකා දමන්න'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminUserManagement;
