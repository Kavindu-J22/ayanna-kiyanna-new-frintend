import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Alert,
  CircularProgress,
  Avatar,
  Paper,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Add as AddIcon,
  Folder as FolderIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Person as PersonIcon,
  AccessTime as TimeIcon,
  Login as LoginIcon,
  School as SchoolIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const GradePage = () => {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingFolder, setEditingFolder] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { gradeCategory } = useParams();

  // Grade category configurations
  const gradeConfigs = {
    'grade-9': {
      title: '9 ශ්‍රේණිය',
      description: '9 ශ්‍රේණියේ සිංහල විෂය සඳහා අධ්‍යයන ද්‍රව්‍ය සහ සම්පත්. ව්‍යාකරණ, සාහිත්‍ය, රචනා ලේඛන සහ භාෂා කුසලතා වර්ධනය කිරීම සඳහා අවශ්‍ය සියලුම තොරතුරු ලබා ගන්න.',
      color: '#3498db',
      gradient: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)'
    },
    'grade-10': {
      title: '10 ශ්‍රේණිය',
      description: '10 ශ්‍රේණියේ සිංහල විෂය සඳහා අධ්‍යයන ද්‍රව්‍ය සහ සම්පත්. O/L විභාගයට සූදානම් වීම සඳහා ව්‍යාකරණ, සාහිත්‍ය, රචනා ලේඛන සහ භාෂා කුසලතා වර්ධනය කරන්න.',
      color: '#e74c3c',
      gradient: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)'
    },
    'grade-11': {
      title: '11 ශ්‍රේණිය',
      description: '11 ශ්‍රේණියේ සිංහල විෂය සඳහා අධ්‍යයන ද්‍රව්‍ය සහ සම්පත්. O/L විභාගයට සූදානම් වීම සඳහා ව්‍යාකරණ, සාහිත්‍ය, රචනා ලේඛන සහ භාෂා කුසලතා වර්ධනය කරන්න.',
      color: '#f39c12',
      gradient: 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)'
    },
    'a-level': {
      title: 'A/L',
      description: 'උසස් පෙළ සිංහල විෂය සඳහා අධ්‍යයන ද්‍රව්‍ය සහ සම්පත්. A/L විභාගයට සූදානම් වීම සඳහා ව්‍යාකරණ, සාහිත්‍ය, රචනා ලේඛන සහ භාෂා කුසලතා වර්ධනය කරන්න.',
      color: '#9b59b6',
      gradient: 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)'
    },
    'sinhala-literature': {
      title: 'සිංහල සාහිත්‍යය (කාණ්ඩ විෂය)',
      description: 'සිංහල සාහිත්‍යය කාණ්ඩ විෂය සඳහා අධ්‍යයන ද්‍රව්‍ය සහ සම්පත්. කවි, කතා, නවකතා, නාට්‍ය, ප්‍රබන්ධ සහ සාහිත්‍ය විචාරණ පිළිබඳ සම්පූර්ණ අධ්‍යයන ද්‍රව්‍ය.',
      color: '#1abc9c',
      gradient: 'linear-gradient(135deg, #1abc9c 0%, #16a085 100%)'
    }
  };

  const currentConfig = gradeConfigs[gradeCategory] || gradeConfigs['grade-9'];

  const fetchFolders = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`https://ayanna-kiyanna-new-backend.onrender.com/api/grades/folders/${gradeCategory}`, {
        headers: { 'x-auth-token': token }
      });

      if (response.data.success) {
        setFolders(response.data.data); // Backend returns folders sorted oldest first
      }
    } catch (err) {
      console.error('Error fetching folders:', err);
      setError('Error loading folders');
    } finally {
      setLoading(false);
    }
  }, [gradeCategory]);

  const checkAuthentication = useCallback(async () => {
    const userEmail = localStorage.getItem('userEmail');
    const token = localStorage.getItem('token');

    if (!userEmail || !token) {
      setShowLoginDialog(true);
      setLoading(false);
      return;
    }

    try {
      // Check user role from database
      const response = await axios.get('https://ayanna-kiyanna-new-backend.onrender.com/api/auth/me', {
        headers: { 'x-auth-token': token }
      });

      setUserRole(response.data.role);
      setIsAuthenticated(true);
      fetchFolders();
    } catch (err) {
      console.error('Authentication error:', err);
      setShowLoginDialog(true);
      setLoading(false);
    }
  }, [fetchFolders]);

  useEffect(() => {
    // Reset loading state when grade category changes
    setLoading(true);
    setError('');
    setFolders([]);
    checkAuthentication();
  }, [gradeCategory, checkAuthentication]);

  const handleLoginRedirect = () => {
    setShowLoginDialog(false);
    navigate('/login');
  };

  const handleCreateFolder = async () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      setError('කරුණාකර සියලුම ක්ෂේත්‍ර පුරවන්න');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'https://ayanna-kiyanna-new-backend.onrender.com/api/grades/folders',
        {
          ...formData,
          gradeCategory
        },
        { headers: { 'x-auth-token': token } }
      );

      if (response.data.success) {
        setFolders([...folders, response.data.data]); // Add new folder to the end
        setShowCreateDialog(false);
        setFormData({ title: '', description: '' });
        setError('');
      }
    } catch (err) {
      console.error('Error creating folder:', err);
      const errorMessage = err.response?.data?.message || 'Error creating folder';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditFolder = async () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      setError('කරුණාකර සියලුම ක්ෂේත්‍ර පුරවන්න');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/grades/folders/${editingFolder._id}`,
        formData,
        { headers: { 'x-auth-token': token } }
      );

      if (response.data.success) {
        setFolders(folders.map(folder => 
          folder._id === editingFolder._id ? response.data.data : folder
        ));
        setShowEditDialog(false);
        setEditingFolder(null);
        setFormData({ title: '', description: '' });
        setError('');
      }
    } catch (err) {
      console.error('Error updating folder:', err);
      const errorMessage = err.response?.data?.message || 'Error updating folder';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteFolder = async (folderId) => {
    if (!window.confirm('ඔබට මෙම ෆෝල්ඩරය මකා දැමීමට අවශ්‍යද?')) {
      return;
    }

    setDeletingId(folderId);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/grades/folders/${folderId}`,
        { headers: { 'x-auth-token': token } }
      );

      setFolders(folders.filter(folder => folder._id !== folderId));
    } catch (err) {
      console.error('Error deleting folder:', err);
      setError('Error deleting folder');
    } finally {
      setDeletingId(null);
    }
  };

  const openEditDialog = (folder) => {
    setEditingFolder(folder);
    setFormData({
      title: folder.title,
      description: folder.description
    });
    setShowEditDialog(true);
  };

  const handleExploreFolder = (folderId) => {
    navigate(`/grade/${gradeCategory}/folder/${folderId}`);
  };

  if (loading && !isAuthenticated) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Box textAlign="center">
              <CircularProgress
                size={80}
                sx={{
                  color: currentConfig.color,
                  mb: 3
                }}
              />
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                  color: '#2C3E50',
                  mb: 1
                }}
              >
                {currentConfig.title}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                  color: '#2C3E50',
                  mb: 1
                }}
              >
                පූරණය වෙමින්...
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
                }}
              >
                කරුණාකර රැඳී සිටින්න
              </Typography>
            </Box>
          </motion.div>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Paper
          elevation={8}
          sx={{
            background: currentConfig.gradient,
            color: 'white',
            p: 4,
            mb: 4,
            borderRadius: 3,
            textAlign: 'center'
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
              fontWeight: 'bold',
              fontSize: { xs: '2rem', md: '3rem' }
            }}
          >
            {currentConfig.title}
          </Typography>
          <Typography
            variant="h7"
            sx={{
              fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
              opacity: 0.9,
              maxWidth: '800px',
              mx: 'auto',
              lineHeight: 1.6
            }}
          >
            {currentConfig.description}
          </Typography>
        </Paper>
      </motion.div>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Folders Grid */}
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="40vh" width="100%">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Box textAlign="center">
              <CircularProgress
                size={80}
                sx={{
                  color: currentConfig.color,
                  mb: 3
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                  color: '#2C3E50',
                  mb: 1
                }}
              >
                ෆෝල්ඩර පූරණය වෙමින්...
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
                }}
              >
                කරුණාකර රැඳී සිටින්න
              </Typography>
            </Box>
          </motion.div>
        </Box>
      ) : (
        <Grid container spacing={3} justifyContent="center">
          <AnimatePresence>
            {folders.map((folder, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={folder._id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card
                  elevation={6}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    maxWidth: '350px',
                    minWidth: '350px',
                    minHeight: '300px',
                    maxHeight: '300px',
                    flexDirection: 'column',
                    background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Avatar
                        sx={{
                          bgcolor: currentConfig.color,
                          mr: 2,
                          width: 48,
                          height: 48
                        }}
                      >
                        <FolderIcon />
                      </Avatar>
                      <Typography
                        variant="h6"
                        component="h3"
                        sx={{
                          fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                          fontWeight: 'bold',
                          color: '#2C3E50'
                        }}
                      >
                        {folder.title}
                      </Typography>
                    </Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
                        mb: 2,
                        lineHeight: 1.5,
                        minHeight: '60px',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                        }}
                        >
                      {folder.description}
                    </Typography>

                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <PersonIcon fontSize="small" color="action" />
                      <Typography variant="caption" color="text.secondary">
                        {folder.createdBy?.fullName}
                      </Typography>
                    </Box>

                    <Box display="flex" alignItems="center" gap={1}>
                      <TimeIcon fontSize="small" color="action" />
                      <Typography variant="caption" color="text.secondary">
                        {new Date(folder.createdAt).toLocaleDateString('si-LK')}
                      </Typography>
                    </Box>
                  </CardContent>

                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => handleExploreFolder(folder._id)}
                      sx={{
                        bgcolor: currentConfig.color,
                        fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                        fontWeight: 'bold',
                        '&:hover': {
                          bgcolor: currentConfig.color,
                          filter: 'brightness(0.9)'
                        }
                      }}
                    >
                      ගවේෂණය කරන්න
                    </Button>

                    {(userRole === 'admin' || userRole === 'moderator') && (
                      <Box display="flex" gap={1} ml={1}>
                        <IconButton
                          size="small"
                          onClick={() => openEditDialog(folder)}
                          sx={{ color: '#FF9800' }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteFolder(folder._id)}
                          disabled={deletingId === folder._id}
                          sx={{ color: '#F44336' }}
                        >
                          {deletingId === folder._id ? (
                            <CircularProgress size={16} sx={{ color: '#F44336' }} />
                          ) : (
                            <DeleteIcon />
                          )}
                        </IconButton>
                      </Box>
                    )}
                  </CardActions>
                </Card>
              </motion.div>
            </Grid>
          ))}
            </AnimatePresence>
          </Grid>
        )}

      {/* Empty State */}
      {folders.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 6,
              textAlign: 'center',
              background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
              borderRadius: 3
            }}
          >
            <SchoolIcon sx={{ fontSize: 80, color: currentConfig.color, mb: 2 }} />
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                color: '#2C3E50'
              }}
            >
              තවම ෆෝල්ඩර නොමැත
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
              }}
            >
              ෆෝල්ඩර නිර්මාණය කිරීමට පරිපාලකයින්ට පමණක් හැකිය
            </Typography>
          </Paper>
        </motion.div>
      )}

      {/* Create Folder FAB */}
      {(userRole === 'admin' || userRole === 'moderator') && (
        <Fab
          color="primary"
          aria-label="add folder"
          onClick={() => setShowCreateDialog(true)}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            bgcolor: currentConfig.color,
            '&:hover': {
              bgcolor: currentConfig.color,
              filter: 'brightness(0.9)'
            }
          }}
        >
          <AddIcon />
        </Fab>
      )}

      {/* Create Folder Dialog */}
      <Dialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: `linear-gradient(135deg, rgb(255, 255, 255) 0%, ${currentConfig.color}90 100%)`
          }
        }}
      >
        <DialogTitle sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
          color: '#2C3E50'
        }}>
          <Box display="flex" alignItems="center" gap={2}>
            <FolderIcon sx={{ color: currentConfig.color }} />
            නව ෆෝල්ඩරයක් නිර්මාණය කරන්න
          </Box>
          <IconButton onClick={() => setShowCreateDialog(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="ෆෝල්ඩර නම"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            margin="normal"
            variant="outlined"
            sx={{
              '& .MuiInputLabel-root': {
                fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
              }
            }}
          />
          <TextField
            fullWidth
            label="විස්තරය"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            margin="normal"
            variant="outlined"
            multiline
            rows={4}
            sx={{
              '& .MuiInputLabel-root': {
                fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setShowCreateDialog(false)}
            sx={{
              fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
            }}
          >
            අවලංගු කරන්න
          </Button>
          <Button
            variant="contained"
            onClick={handleCreateFolder}
            disabled={submitting}
            sx={{
              bgcolor: currentConfig.color,
              fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
              '&:hover': {
                bgcolor: currentConfig.color,
                filter: 'brightness(0.9)'
              }
            }}
          >
            {submitting ? <CircularProgress size={20} color="inherit" /> : 'නිර්මාණය කරන්න'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Folder Dialog */}
      <Dialog
        open={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
          }
        }}
      >
        <DialogTitle sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
          color: '#2C3E50'
        }}>
          <Box display="flex" alignItems="center" gap={2}>
            <EditIcon sx={{ color: '#FF9800' }} />
            ෆෝල්ඩරය සංස්කරණය කරන්න
          </Box>
          <IconButton onClick={() => setShowEditDialog(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="ෆෝල්ඩර නම"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            margin="normal"
            variant="outlined"
            sx={{
              '& .MuiInputLabel-root': {
                fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
              }
            }}
          />
          <TextField
            fullWidth
            label="විස්තරය"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            margin="normal"
            variant="outlined"
            multiline
            rows={4}
            sx={{
              '& .MuiInputLabel-root': {
                fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setShowEditDialog(false)}
            sx={{
              fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
            }}
          >
            අවලංගු කරන්න
          </Button>
          <Button
            variant="contained"
            onClick={handleEditFolder}
            disabled={submitting}
            sx={{
              bgcolor: '#FF9800',
              fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
              '&:hover': {
                bgcolor: '#F57C00'
              }
            }}
          >
            {submitting ? <CircularProgress size={20} color="inherit" /> : 'යාවත්කාලීන කරන්න'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Login Dialog */}
      <Dialog
        open={showLoginDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: currentConfig.gradient,
            color: 'white'
          }
        }}
      >
        <DialogTitle sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
        }}>
          <LoginIcon />
          ප්‍රවේශ වීම අවශ්‍යයි
        </DialogTitle>
        <DialogContent>
          <Typography
            variant="body1"
            sx={{
              fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
              textAlign: 'center',
              py: 2
            }}
          >
            {currentConfig.title} අධ්‍යයන අංශයට ප්‍රවේශ වීමට කරුණාකර පළමුව ලොගින් වන්න හෝ ලියාපදිංචි වන්න.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            variant="contained"
            onClick={handleLoginRedirect}
            fullWidth
            sx={{
              bgcolor: '#ffd700',
              color: '#333',
              fontWeight: 'bold',
              fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
              '&:hover': {
                bgcolor: '#ffed4e'
              }
            }}
          >
            ලොගින් පිටුවට යන්න
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default GradePage;
