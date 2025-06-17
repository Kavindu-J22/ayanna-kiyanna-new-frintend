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
  Avatar,
  IconButton,
  Breadcrumbs,
  Link
} from '@mui/material';
import {
  Add as AddIcon,
  Article as ArticleIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  ArrowBack as ArrowBackIcon,
  Home as HomeIcon,
  Favorite as FavoriteIcon,
  CloudUpload as CloudUploadIcon,
  Link as LinkIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import CloudinaryUpload from '../components/CloudinaryUpload';

const OtherEntFolderView = () => {
  const navigate = useNavigate();
  const { folderId } = useParams();
  const [folder, setFolder] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userRole, setUserRole] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Dialog states
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    attachments: [],
    sourceLinks: []
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
        fetchFolderAndFiles();
      } catch (error) {
        console.error('Error checking authentication:', error);
        setError('සත්‍යාපනය අසාර්ථක විය');
        setLoading(false);
      }
    };

    checkAuth();
  }, [folderId]);

  const fetchFolderAndFiles = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch folder details
      const folderResponse = await axios.get(`https://ayanna-kiyanna-new-backend.onrender.com/api/otherEnt/folders/${folderId}`, {
        headers: { 'x-auth-token': token }
      });
      setFolder(folderResponse.data.data);

      // Fetch files in folder
      const filesResponse = await axios.get(`https://ayanna-kiyanna-new-backend.onrender.com/api/otherEnt/folders/${folderId}/files`, {
        headers: { 'x-auth-token': token }
      });
      setFiles(filesResponse.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching folder and files:', error);
      setError('ෆෝල්ඩර් සහ ගොනු ලබා ගැනීමේදී දෝෂයක් ඇති විය');
      setLoading(false);
    }
  };

  const handleCreateFile = async () => {
    try {
      const token = localStorage.getItem('token');
      const fileData = { ...formData, folderId };
      
      await axios.post(`https://ayanna-kiyanna-new-backend.onrender.com/api/otherEnt/files`, fileData, {
        headers: { 'x-auth-token': token }
      });
      
      setSuccess('ගොනුව සාර්ථකව නිර්මාණය කරන ලදී');
      setOpenCreateDialog(false);
      resetFormData();
      fetchFolderAndFiles();
    } catch (error) {
      console.error('Error creating file:', error);
      setError('ගොනුව නිර්මාණය කිරීමේදී දෝෂයක් ඇති විය');
    }
  };

  const handleEditFile = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`https://ayanna-kiyanna-new-backend.onrender.com/api/otherEnt/files/${selectedFile._id}`, formData, {
        headers: { 'x-auth-token': token }
      });
      
      setSuccess('ගොනුව සාර්ථකව යාවත්කාලීන කරන ලදී');
      setOpenEditDialog(false);
      resetFormData();
      setSelectedFile(null);
      fetchFolderAndFiles();
    } catch (error) {
      console.error('Error updating file:', error);
      setError('ගොනුව යාවත්කාලීන කිරීමේදී දෝෂයක් ඇති විය');
    }
  };

  const handleDeleteFile = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://ayanna-kiyanna-new-backend.onrender.com/api/otherEnt/files/${selectedFile._id}`, {
        headers: { 'x-auth-token': token }
      });
      
      setSuccess('ගොනුව සාර්ථකව ඉවත් කරන ලදී');
      setOpenDeleteDialog(false);
      setSelectedFile(null);
      fetchFolderAndFiles();
    } catch (error) {
      console.error('Error deleting file:', error);
      setError('ගොනුව ඉවත් කිරීමේදී දෝෂයක් ඇති විය');
    }
  };

  const resetFormData = () => {
    setFormData({
      title: '',
      description: '',
      content: '',
      attachments: [],
      sourceLinks: []
    });
  };

  const openEditFileDialog = (file) => {
    setSelectedFile(file);
    setFormData({
      title: file.title,
      description: file.description,
      content: file.content || '',
      attachments: file.attachments || [],
      sourceLinks: file.sourceLinks || []
    });
    setOpenEditDialog(true);
  };

  const openDeleteFileDialog = (file) => {
    setSelectedFile(file);
    setOpenDeleteDialog(true);
  };

  const handleNavigateToLogin = () => {
    navigate('/login');
  };

  const addSourceLink = () => {
    setFormData({
      ...formData,
      sourceLinks: [...formData.sourceLinks, { title: '', url: '', description: '' }]
    });
  };

  const updateSourceLink = (index, field, value) => {
    const updatedLinks = [...formData.sourceLinks];
    updatedLinks[index][field] = value;
    setFormData({ ...formData, sourceLinks: updatedLinks });
  };

  const removeSourceLink = (index) => {
    const updatedLinks = formData.sourceLinks.filter((_, i) => i !== index);
    setFormData({ ...formData, sourceLinks: updatedLinks });
  };

  if (!isAuthenticated && error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box textAlign="center" sx={{ py: 8 }}>
          <Typography variant="h4" gutterBottom sx={{ color: '#ff5722', fontWeight: 'bold' }}>
            වෙනත් අමතර
          </Typography>
          <Alert severity="warning" sx={{ mb: 3, fontSize: '1.1rem' }}>
            {error}
          </Alert>
          <Button
            variant="contained"
            onClick={handleNavigateToLogin}
            sx={{
              background: 'linear-gradient(45deg, #ff5722, #ff9800)',
              color: 'white',
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              borderRadius: 3,
              '&:hover': {
                background: 'linear-gradient(45deg, #f4511e, #f57c00)',
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
        <CircularProgress size={60} sx={{ color: '#ff5722' }} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link
          component="button"
          variant="body1"
          onClick={() => navigate('/')}
          sx={{ display: 'flex', alignItems: 'center', color: '#ff5722' }}
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          මුල් පිටුව
        </Link>
        <Link
          component="button"
          variant="body1"
          onClick={() => navigate('/otherEnt')}
          sx={{ color: '#ff5722' }}
        >
          වෙනත් අමතර
        </Link>
        <Typography color="text.primary">{folder?.title}</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <IconButton 
            onClick={() => navigate('/otherEnt')}
            sx={{ mr: 2, color: '#ff5722' }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography 
            variant="h4" 
            sx={{ 
              color: '#ff5722', 
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            {folder?.title}
          </Typography>
        </Box>
        <Typography 
          variant="body1" 
          sx={{ 
            color: '#444', 
            ml: 7,
            fontStyle: 'italic'
          }}
        >
          {folder?.description}
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

      {/* Files Grid */}
      <Grid container spacing={3} justifyContent="center">
        {files.map((file) => (
          <Grid item xs={12} sm={6} md={4} key={file._id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                maxWidth: '350px',
                minWidth: '350px',
                minHeight: '355px',
                maxHeight: '355px',
                flexDirection: 'column',
                background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)',
                border: '2px solid transparent',
                borderRadius: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 24px rgba(255, 87, 34, 0.15)',
                  border: '2px solid #ff5722'
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar sx={{ bgcolor: '#ff5722', mr: 2 }}>
                    <ArticleIcon />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
                    {file.title}
                  </Typography>
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                  {file.description.length > 100 ? `${file.description.substring(0, 100)}...` : file.description}
                </Typography>

                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Chip
                    label={`${file.attachments?.length || 0} ගොනු`}
                    size="small"
                    icon={<CloudUploadIcon />}
                    sx={{ bgcolor: '#e3f2fd', color: '#1976d2' }}
                  />
                  <Chip
                    label={`${file.sourceLinks?.length || 0} සබැඳි`}
                    size="small"
                    icon={<LinkIcon />}
                    sx={{ bgcolor: '#fff3e0', color: '#f57c00' }}
                  />
                </Box>

                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box display="flex" alignItems="center" gap={1}>
                    <FavoriteIcon sx={{ color: '#ff5722', fontSize: 18 }} />
                    <Typography variant="caption">{file.likes?.length || 0}</Typography>
                  </Box>
                  <Chip
                    label={new Date(file.createdAt).toLocaleDateString('si-LK')}
                    size="small"
                    sx={{ bgcolor: '#fff3e0', color: '#f57c00' }}
                  />
                </Box>
              </CardContent>

              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<VisibilityIcon />}
                  onClick={() => navigate(`/otherEnt/file/${file._id}`)}
                  sx={{
                    background: 'linear-gradient(45deg, #ff5722, #ff9800)',
                    color: 'white',
                    fontWeight: 'bold',
                    borderRadius: 2,
                    py: 1,
                    '&:hover': {
                      background: 'linear-gradient(45deg, #f4511e, #f57c00)',
                    }
                  }}
                >
                  බලන්න
                </Button>

                {(userRole === 'admin' || userRole === 'moderator') && (
                  <Box display="flex" gap={1} ml={1}>
                    <Button
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => openEditFileDialog(file)}
                      sx={{ color: '#ff9800', minWidth: 'auto' }}
                    >
                      සංස්කරණය
                    </Button>
                    <Button
                      size="small"
                      startIcon={<DeleteIcon />}
                      onClick={() => openDeleteFileDialog(file)}
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
      {files.length === 0 && (
        <Box textAlign="center" sx={{ py: 8 }}>
          <ArticleIcon sx={{ fontSize: 80, color: '#ccc', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            මෙම ෆෝල්ඩරයේ තවම ගොනු නොමැත
          </Typography>
        </Box>
      )}

      {/* Create File FAB */}
      {(userRole === 'admin' || userRole === 'moderator') && (
        <Fab
          color="primary"
          aria-label="add file"
          onClick={() => setOpenCreateDialog(true)}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: 'linear-gradient(45deg, #ff5722, #ff9800)',
            '&:hover': {
              background: 'linear-gradient(45deg, #f4511e, #f57c00)',
            }
          }}
        >
          <AddIcon />
        </Fab>
      )}

      {/* Create File Dialog */}
      <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: '#ff5722', color: 'white', fontWeight: 'bold' }}>
          නව ගොනුවක් නිර්මාණය කරන්න
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="ගොනු නම"
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
          <TextField
            fullWidth
            label="අන්තර්ගතය (විකල්ප)"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            margin="normal"
            multiline
            rows={4}
          />

          {/* File Upload Section */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#ff5722', fontWeight: 'bold' }}>
              ගොනු උඩුගත කරන්න (විකල්ප)
            </Typography>
            <CloudinaryUpload
              onUploadSuccess={(files) => setFormData({ ...formData, attachments: files })}
              onUploadError={(error) => setError('ගොනු උඩුගත කිරීමේදී දෝෂයක් ඇති විය')}
              existingFiles={formData.attachments}
              onRemoveFile={(index) => {
                const updatedAttachments = formData.attachments.filter((_, i) => i !== index);
                setFormData({ ...formData, attachments: updatedAttachments });
              }}
              maxFiles={5}
              acceptedTypes={['image/*', 'application/pdf']}
            />
          </Box>

          {/* Source Links Section */}
          <Box sx={{ mt: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">මූලාශ්‍ර සබැඳි (විකල්ප)</Typography>
              <Button
                startIcon={<AddIcon />}
                onClick={addSourceLink}
                sx={{ color: '#ff5722' }}
              >
                සබැඳියක් එක් කරන්න
              </Button>
            </Box>
            
            {formData.sourceLinks.map((link, index) => (
              <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #ddd', borderRadius: 2 }}>
                <TextField
                  fullWidth
                  label="සබැඳි නම"
                  value={link.title}
                  onChange={(e) => updateSourceLink(index, 'title', e.target.value)}
                  margin="normal"
                  size="small"
                />
                <TextField
                  fullWidth
                  label="URL"
                  value={link.url}
                  onChange={(e) => updateSourceLink(index, 'url', e.target.value)}
                  margin="normal"
                  size="small"
                />
                <TextField
                  fullWidth
                  label="විස්තරය (විකල්ප)"
                  value={link.description}
                  onChange={(e) => updateSourceLink(index, 'description', e.target.value)}
                  margin="normal"
                  size="small"
                />
                <Button
                  onClick={() => removeSourceLink(index)}
                  color="error"
                  size="small"
                  sx={{ mt: 1 }}
                >
                  ඉවත් කරන්න
                </Button>
              </Box>
            ))}
          </Box>

          <Alert severity="info" sx={{ mt: 2 }}>
            ගොනු සහ මූලාශ්‍ර සබැඳි විකල්ප වේ. ඔබට අවශ්‍ය ඒවා එක් කරන්න.
          </Alert>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenCreateDialog(false)}>
            අවලංගු කරන්න
          </Button>
          <Button
            onClick={handleCreateFile}
            variant="contained"
            disabled={!formData.title || !formData.description}
            sx={{
              background: 'linear-gradient(45deg, #ff5722, #ff9800)',
              '&:hover': { background: 'linear-gradient(45deg, #f4511e, #f57c00)' }
            }}
          >
            නිර්මාණය කරන්න
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit File Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: '#ff9800', color: 'white', fontWeight: 'bold' }}>
          ගොනුව සංස්කරණය කරන්න
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="ගොනු නම"
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
          <TextField
            fullWidth
            label="අන්තර්ගතය (විකල්ප)"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            margin="normal"
            multiline
            rows={4}
          />

          {/* File Upload Section */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#ff9800', fontWeight: 'bold' }}>
              ගොනු උඩුගත කරන්න (විකල්ප)
            </Typography>
            <CloudinaryUpload
              onUploadSuccess={(files) => setFormData({ ...formData, attachments: files })}
              onUploadError={(error) => setError('ගොනු උඩුගත කිරීමේදී දෝෂයක් ඇති විය')}
              existingFiles={formData.attachments}
              onRemoveFile={(index) => {
                const updatedAttachments = formData.attachments.filter((_, i) => i !== index);
                setFormData({ ...formData, attachments: updatedAttachments });
              }}
              maxFiles={5}
              acceptedTypes={['image/*', 'application/pdf']}
            />
          </Box>

          {/* Source Links Section */}
          <Box sx={{ mt: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">මූලාශ්‍ර සබැඳි (විකල්ප)</Typography>
              <Button
                startIcon={<AddIcon />}
                onClick={addSourceLink}
                sx={{ color: '#ff9800' }}
              >
                සබැඳියක් එක් කරන්න
              </Button>
            </Box>

            {formData.sourceLinks.map((link, index) => (
              <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #ddd', borderRadius: 2 }}>
                <TextField
                  fullWidth
                  label="සබැඳි නම"
                  value={link.title}
                  onChange={(e) => updateSourceLink(index, 'title', e.target.value)}
                  margin="normal"
                  size="small"
                />
                <TextField
                  fullWidth
                  label="URL"
                  value={link.url}
                  onChange={(e) => updateSourceLink(index, 'url', e.target.value)}
                  margin="normal"
                  size="small"
                />
                <TextField
                  fullWidth
                  label="විස්තරය (විකල්ප)"
                  value={link.description}
                  onChange={(e) => updateSourceLink(index, 'description', e.target.value)}
                  margin="normal"
                  size="small"
                />
                <Button
                  onClick={() => removeSourceLink(index)}
                  color="error"
                  size="small"
                  sx={{ mt: 1 }}
                >
                  ඉවත් කරන්න
                </Button>
              </Box>
            ))}
          </Box>

          <Alert severity="info" sx={{ mt: 2 }}>
            ගොනු සහ මූලාශ්‍ර සබැඳි විකල්ප වේ. ඔබට අවශ්‍ය ඒවා එක් කරන්න.
          </Alert>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenEditDialog(false)}>
            අවලංගු කරන්න
          </Button>
          <Button
            onClick={handleEditFile}
            variant="contained"
            disabled={!formData.title || !formData.description}
            sx={{
              background: 'linear-gradient(45deg, #ff9800, #ffc107)',
              '&:hover': { background: 'linear-gradient(45deg, #f57c00, #ff8f00)' }
            }}
          >
            යාවත්කාලීන කරන්න
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete File Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#f44336', color: 'white', fontWeight: 'bold' }}>
          ගොනුව ඉවත් කරන්න
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            ඔබට මෙම ගොනුව ඉවත් කිරීමට අවශ්‍යද?
          </Typography>
          {selectedFile && (
            <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                {selectedFile.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedFile.description}
              </Typography>
            </Box>
          )}
          <Alert severity="warning" sx={{ mt: 2 }}>
            මෙම ක්‍රියාව ආපසු හැරවිය නොහැක. ගොනුව ස්ථිරවම ඉවත් වේ.
          </Alert>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenDeleteDialog(false)}>
            අවලංගු කරන්න
          </Button>
          <Button
            onClick={handleDeleteFile}
            variant="contained"
            sx={{
              bgcolor: '#f44336',
              '&:hover': { bgcolor: '#d32f2f' }
            }}
          >
            ඉවත් කරන්න
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default OtherEntFolderView;
