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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Fab,
  Alert,
  CircularProgress,
  Chip,
  Avatar
} from '@mui/material';
import {
  Add as AddIcon,
  Folder as FolderIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ReviewsPage = () => {
  const navigate = useNavigate();
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userRole, setUserRole] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Dialog states
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });

  // Check authentication and get user role
  useEffect(() => {
    const checkAuth = async () => {
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) {
        setError('කරුණාකර පළමුව ලොගින් වන්න හෝ ලියාපදිංචි වන්න');
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`https://ayanna-kiyanna-new-backend.onrender.com/api/auth/me`, {
          headers: { 'x-auth-token': token }
        });

        setUserRole(response.data.role);
        setIsAuthenticated(true);
        fetchFolders();
      } catch (error) {
        console.error('Error checking authentication:', error);
        setError('සත්‍යාපනය අසාර්ථක විය');
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const fetchFolders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`https://ayanna-kiyanna-new-backend.onrender.com/api/reviews/folders`, {
        headers: { 'x-auth-token': token }
      });
      setFolders(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching folders:', error);
      setError('ෆෝල්ඩර් ලබා ගැනීමේදී දෝෂයක් ඇති විය');
      setLoading(false);
    }
  };

  const handleCreateFolder = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`https://ayanna-kiyanna-new-backend.onrender.com/api/reviews/folders`, formData, {
        headers: { 'x-auth-token': token }
      });
      setSuccess('ෆෝල්ඩරය සාර්ථකව නිර්මාණය කරන ලදී');
      setOpenCreateDialog(false);
      setFormData({ title: '', description: '' });
      fetchFolders();
    } catch (error) {
      console.error('Error creating folder:', error);
      setError('ෆෝල්ඩරය නිර්මාණය කිරීමේදී දෝෂයක් ඇති විය');
    }
  };

  const handleEditFolder = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`https://ayanna-kiyanna-new-backend.onrender.com/api/reviews/folders/${selectedFolder._id}`, formData, {
        headers: { 'x-auth-token': token }
      });
      setSuccess('ෆෝල්ඩරය සාර්ථකව යාවත්කාලීන කරන ලදී');
      setOpenEditDialog(false);
      setFormData({ title: '', description: '' });
      setSelectedFolder(null);
      fetchFolders();
    } catch (error) {
      console.error('Error updating folder:', error);
      setError('ෆෝල්ඩරය යාවත්කාලීන කිරීමේදී දෝෂයක් ඇති විය');
    }
  };

  const handleDeleteFolder = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://ayanna-kiyanna-new-backend.onrender.com/api/reviews/folders/${selectedFolder._id}`, {
        headers: { 'x-auth-token': token }
      });
      setSuccess('ෆෝල්ඩරය සාර්ථකව ඉවත් කරන ලදී');
      setOpenDeleteDialog(false);
      setSelectedFolder(null);
      fetchFolders();
    } catch (error) {
      console.error('Error deleting folder:', error);
      setError('ෆෝල්ඩරය ඉවත් කිරීමේදී දෝෂයක් ඇති විය');
    }
  };

  const openEditFolderDialog = (folder) => {
    setSelectedFolder(folder);
    setFormData({ title: folder.title, description: folder.description });
    setOpenEditDialog(true);
  };

  const openDeleteFolderDialog = (folder) => {
    setSelectedFolder(folder);
    setOpenDeleteDialog(true);
  };

  const handleNavigateToLogin = () => {
    navigate('/login');
  };

  if (!isAuthenticated && error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box textAlign="center" sx={{ py: 8 }}>
          <Typography variant="h4" gutterBottom sx={{ color: '#e91e63', fontWeight: 'bold' }}>
            විචාර
          </Typography>
          <Alert severity="warning" sx={{ mb: 3, fontSize: '1.1rem' }}>
            {error}
          </Alert>
          <Button
            variant="contained"
            onClick={handleNavigateToLogin}
            sx={{
              background: 'linear-gradient(45deg, #e91e63, #ff5722)',
              color: 'white',
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              borderRadius: 3,
              '&:hover': {
                background: 'linear-gradient(45deg, #c2185b, #f4511e)',
              }
            }}
          >
            ලොගින් වන්න
          </Button>
        </Box>
      </Container>
    );
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} sx={{ color: '#e91e63' }} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box textAlign="center" sx={{ mb: 4 }}>
        <Typography 
          variant="h3" 
          gutterBottom 
          sx={{ 
            color: '#e91e63', 
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          විචාර
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            color: '#666', 
            mb: 2,
            fontStyle: 'italic'
          }}
        >
          සාහිත්‍ය විචාර සහ විශ්ලේෂණ සඳහා වන අන්තර්ගතය
        </Typography>
      </Box>

      {/* Success/Error Messages */}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Folders Grid */}
      <Grid container spacing={3} justifyContent="center">
        {folders.map((folder) => (
          <Grid item xs={12} sm={6} md={4} key={folder._id}
          sx={{
          display: 'grid',
          alignItems: 'stretch', // This ensures all cards stretch to the same height
          }}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                maxWidth: '350px',
                minWidth: '350px',
                flexDirection: 'column',
                background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)',
                border: '2px solid transparent',
                borderRadius: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 24px rgba(233, 30, 99, 0.15)',
                  border: '2px solid #e91e63'
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar sx={{ bgcolor: '#e91e63', mr: 2 }}>
                    <FolderIcon />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
                    {folder.title}
                  </Typography>
                </Box>
                
                <Typography variant="body2" color="text.secondary" 
                sx={{
                fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
                mb: 2,
                lineHeight: 1.5,
                minHeight: '30px',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                fontSize: '0.8rem'
                }}
                >
                  {folder.description}
                </Typography>

                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Chip
                    label={`නිර්මාණය: ${new Date(folder.createdAt).toLocaleDateString('si-LK')}`}
                    size="small"
                    sx={{ bgcolor: '#f3e5f5', color: '#7b1fa2' }}
                  />
                </Box>
              </CardContent>

              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<VisibilityIcon />}
                  onClick={() => navigate(`/reviews/folder/${folder._id}`)}
                  sx={{
                    background: 'linear-gradient(45deg, #e91e63, #ff5722)',
                    color: 'white',
                    fontWeight: 'bold',
                    borderRadius: 2,
                    py: 1,
                    '&:hover': {
                      background: 'linear-gradient(45deg, #c2185b, #f4511e)',
                    }
                  }}
                >
                  ගවේෂණය කරන්න
                </Button>

                {(userRole === 'admin' || userRole === 'moderator') && (
                  <Box display="flex" gap={1} ml={1}>
                    <Button
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => openEditFolderDialog(folder)}
                      sx={{ color: '#ff9800', minWidth: 'auto' }}
                    >
                      සංස්කරණය
                    </Button>
                    <Button
                      size="small"
                      startIcon={<DeleteIcon />}
                      onClick={() => openDeleteFolderDialog(folder)}
                      sx={{ color: '#f44336', minWidth: 'auto' }}
                    >
                      ඉවත් කරන්න
                    </Button>
                  </Box>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Empty State */}
      {folders.length === 0 && (
        <Box textAlign="center" sx={{ py: 8 }}>
          <FolderIcon sx={{ fontSize: 80, color: '#ccc', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            තවම ෆෝල්ඩර් නොමැත
          </Typography>
        </Box>
      )}

      {/* Create Folder FAB */}
      {(userRole === 'admin' || userRole === 'moderator') && (
        <Fab
          color="primary"
          aria-label="add folder"
          onClick={() => setOpenCreateDialog(true)}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: 'linear-gradient(45deg, #e91e63, #ff5722)',
            '&:hover': {
              background: 'linear-gradient(45deg, #c2185b, #f4511e)',
            }
          }}
        >
          <AddIcon />
        </Fab>
      )}

      {/* Create Folder Dialog */}
      <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#e91e63', color: 'white', fontWeight: 'bold' }}>
          නව ෆෝල්ඩරයක් නිර්මාණය කරන්න
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="ෆෝල්ඩර් නම"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="විස්තරය"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            margin="normal"
            multiline
            rows={3}
            required
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenCreateDialog(false)}>
            අවලංගු කරන්න
          </Button>
          <Button 
            onClick={handleCreateFolder}
            variant="contained"
            sx={{ 
              background: 'linear-gradient(45deg, #e91e63, #ff5722)',
              '&:hover': { background: 'linear-gradient(45deg, #c2185b, #f4511e)' }
            }}
          >
            නිර්මාණය කරන්න
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Folder Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#ff9800', color: 'white', fontWeight: 'bold' }}>
          ෆෝල්ඩරය සංස්කරණය කරන්න
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="ෆෝල්ඩර් නම"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="විස්තරය"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            margin="normal"
            multiline
            rows={3}
            required
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenEditDialog(false)}>
            අවලංගු කරන්න
          </Button>
          <Button 
            onClick={handleEditFolder}
            variant="contained"
            sx={{ bgcolor: '#ff9800', '&:hover': { bgcolor: '#f57c00' } }}
          >
            යාවත්කාලීන කරන්න
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Folder Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle sx={{ color: '#f44336', fontWeight: 'bold' }}>
          ෆෝල්ඩරය ඉවත් කරන්න
        </DialogTitle>
        <DialogContent>
          <Typography>
            ඔබට "{selectedFolder?.title}" ෆෝල්ඩරය ඉවත් කිරීමට අවශ්‍යද? මෙම ක්‍රියාව ආපසු හැරවිය නොහැක.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenDeleteDialog(false)}>
            අවලංගු කරන්න
          </Button>
          <Button 
            onClick={handleDeleteFolder}
            variant="contained"
            color="error"
          >
            ඉවත් කරන්න
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ReviewsPage;
