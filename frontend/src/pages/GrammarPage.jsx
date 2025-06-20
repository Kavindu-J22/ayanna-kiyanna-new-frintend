import React, { useState, useEffect } from 'react';
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
  Chip,
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
  Description as DescriptionIcon,
  Login as LoginIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const GrammarPage = () => {
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

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
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
  };

  const fetchFolders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://ayanna-kiyanna-new-backend.onrender.com/api/grammar/folders', {
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
  };

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
        'https://ayanna-kiyanna-new-backend.onrender.com/api/grammar/folders',
        formData,
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
      setError('Error creating folder');
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
        `https://ayanna-kiyanna-new-backend.onrender.com/api/grammar/folders/${editingFolder._id}`,
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
      setError('Error updating folder');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteFolder = async (folderId) => {
    if (!window.confirm('ඔබට මෙම ෆෝල්ඩරය මකා දැමීමට අවශ්‍යද?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/grammar/folders/${folderId}`,
        { headers: { 'x-auth-token': token } }
      );

      setFolders(folders.filter(folder => folder._id !== folderId));
    } catch (err) {
      console.error('Error deleting folder:', err);
      setError('Error deleting folder');
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
    navigate(`/grammar/folder/${folderId}`);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={60} sx={{ color: '#E91E63' }} />
      </Box>
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
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
            ව්‍යාකරණ
          </Typography>
          <Typography
            variant="h7"
            sx={{
              fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
              opacity: 0.9,
              maxWidth: '700px',
              mx: 'auto',
              lineHeight: 1.6
            }}
          >
            සිංහල ව්‍යාකරණ පිළිබඳ සම්පූර්ණ අධ්‍යයන ද්‍රව්‍ය සහ සම්පත් මෙහි ඇත. 
            ව්‍යාකරණ නීති, වචන වර්ග, වාක්‍ය ව්‍යුහය සහ භාෂා කුසලතා වර්ධනය කිරීම සඳහා 
            අවශ්‍ය සියලුම තොරතුරු ලබා ගන්න.
          </Typography>
        </Paper>
      </motion.div>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

{/* Folders Grid */}
<Grid container spacing={4} justifyContent="center" sx={{ padding: 3 }}>
  <AnimatePresence>
    {folders.map((folder, index) => (
      <Grid item xs={12} sm={6} md={4} key={folder._id} sx={{ display: 'flex' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ y: -5, scale: 1.02 }}
          style={{ width: '100%' }}
        >
          <Card
            elevation={6}
            sx={{
              height: '100%',
              maxWidth: '350px',
              minWidth: '350px',
              display: 'flex',
              flexDirection: 'column',
              background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
              borderRadius: 3,
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
              border: '1px solid rgba(255,255,255,0.3)',
              overflow: 'hidden',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 15px 30px rgba(0,0,0,0.2)'
              }
            }}
          >
            <CardContent sx={{ flexGrow: 1, p: 3 }}>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar
                  sx={{
                    bgcolor: '#E91E63',
                    mr: 2,
                    width: 48,
                    height: 48,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                  }}
                >
                  <FolderIcon fontSize="medium" />
                </Avatar>
                <Typography
                  variant="h6"
                  component="h3"
                  sx={{
                    fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                    fontWeight: 'bold',
                    color: '#2C3E50',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden'
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

              <Box 
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.6)',
                  borderRadius: 2,
                  p: 1.5,
                  mt: 'auto'
                }}
              >
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <PersonIcon fontSize="small" sx={{ color: '#5D6D7E' }} />
                  <Typography variant="caption" sx={{ color: '#5D6D7E', fontWeight: 500 }}>
                    {folder.createdBy?.fullName}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" gap={1}>
                  <TimeIcon fontSize="small" sx={{ color: '#5D6D7E' }} />
                  <Typography variant="caption" sx={{ color: '#5D6D7E', fontWeight: 500 }}>
                    {new Date(folder.createdAt).toLocaleDateString('si-LK')}
                  </Typography>
                </Box>
              </Box>
            </CardContent>

            <CardActions sx={{ p: 2, pt: 0 }}>
              <Button
                variant="contained"
                fullWidth
                onClick={() => handleExploreFolder(folder._id)}
                sx={{
                  bgcolor: '#E91E63',
                  fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                  fontWeight: 'bold',
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1rem',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  '&:hover': {
                    bgcolor: '#C2185B',
                    boxShadow: '0 6px 8px rgba(0,0,0,0.15)'
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
                    sx={{ 
                      color: '#FF9800',
                      backgroundColor: 'rgba(255,152,0,0.1)',
                      '&:hover': {
                        backgroundColor: 'rgba(255,152,0,0.2)'
                      }
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteFolder(folder._id)}
                    sx={{ 
                      color: '#F44336',
                      backgroundColor: 'rgba(244,67,54,0.1)',
                      '&:hover': {
                        backgroundColor: 'rgba(244,67,54,0.2)'
                      }
                    }}
                  >
                    <DeleteIcon fontSize="small" />
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
              background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
              borderRadius: 3
            }}
          >
            <FolderIcon sx={{ fontSize: 80, color: '#E91E63', mb: 2 }} />
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
              ව්‍යාකරණ ෆෝල්ඩර නිර්මාණය කිරීමට පරිපාලකයින්ට පමණක් හැකිය
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
            bgcolor: '#E91E63',
            '&:hover': {
              bgcolor: '#C2185B'
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
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
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
            <FolderIcon sx={{ color: '#E91E63' }} />
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
              bgcolor: '#E91E63',
              fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
              '&:hover': {
                bgcolor: '#C2185B'
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
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
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
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
            ව්‍යාකරණ අංශයට ප්‍රවේශ වීමට කරුණාකර පළමුව ලොගින් වන්න හෝ ලියාපදිංචි වන්න.
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

export default GrammarPage;
