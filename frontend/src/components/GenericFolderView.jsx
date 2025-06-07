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
  Avatar,
  Paper,
  Chip,
  Breadcrumbs,
  Link,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Add as AddIcon,
  Description as FileIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Person as PersonIcon,
  AccessTime as TimeIcon,
  ArrowBack as ArrowBackIcon,
  Attachment as AttachmentIcon,
  Link as LinkIcon,
  CloudUpload as CloudUploadIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const GenericFolderView = ({ 
  title, 
  apiEndpoint, 
  routePath,
  sectionName 
}) => {
  const [folder, setFolder] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [editingFile, setEditingFile] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    attachments: [],
    sourceLinks: []
  });
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { folderId } = useParams();

  useEffect(() => {
    checkAuthentication();
  }, [folderId]);

  const checkAuthentication = async () => {
    const userEmail = localStorage.getItem('userEmail');
    const token = localStorage.getItem('token');

    if (!userEmail || !token) {
      navigate('/login');
      return;
    }

    try {
      const response = await axios.get('https://ayanna-kiyanna-new-backend.onrender.com/api/auth/me', {
        headers: { 'x-auth-token': token }
      });

      setUserRole(response.data.role);
      fetchFolderAndFiles();
    } catch (err) {
      console.error('Authentication error:', err);
      navigate('/login');
    }
  };

  const fetchFolderAndFiles = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch folder details
      const folderResponse = await axios.get(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/${apiEndpoint}/folders/${folderId}`,
        { headers: { 'x-auth-token': token } }
      );

      // Fetch files in folder
      const filesResponse = await axios.get(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/${apiEndpoint}/folders/${folderId}/files`,
        { headers: { 'x-auth-token': token } }
      );

      if (folderResponse.data.success) {
        setFolder(folderResponse.data.data);
      }

      if (filesResponse.data.success) {
        setFiles(filesResponse.data.data);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setError('කරුණාකර PDF හෝ Image ගොනුවක් තෝරන්න');
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setError('ගොනුවේ ප්‍රමාණය 10MB ට වඩා අඩු විය යුතුය');
      return;
    }

    setUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);
    formDataUpload.append('upload_preset', 'ml_default');

    try {
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dl9k5qoae/auto/upload',
        formDataUpload
      );

      const newAttachment = {
        title: file.name,
        description: '',
        name: file.name,
        url: response.data.secure_url,
        publicId: response.data.public_id,
        type: file.type.startsWith('image/') ? 'image' : 'pdf',
        size: file.size
      };

      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, newAttachment]
      }));

      setError('');
    } catch (err) {
      console.error('Upload error:', err);
      setError('ගොනුව උඩුගත කිරීමේදී දෝෂයක් ඇතිවිය');
    } finally {
      setUploading(false);
    }
  };

  const removeAttachment = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const addSourceLink = () => {
    setFormData(prev => ({
      ...prev,
      sourceLinks: [...prev.sourceLinks, { title: '', url: '' }]
    }));
  };

  const updateSourceLink = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      sourceLinks: prev.sourceLinks.map((link, i) => 
        i === index ? { ...link, [field]: value } : link
      )
    }));
  };

  const removeSourceLink = (index) => {
    setFormData(prev => ({
      ...prev,
      sourceLinks: prev.sourceLinks.filter((_, i) => i !== index)
    }));
  };

  const handleCreateFile = async () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      setError('කරුණාකර සියලුම අනිවාර්ය ක්ෂේත්‍ර පුරවන්න');
      return;
    }

    // Validate that at least one attachment or valid source link is provided
    const hasAttachments = formData.attachments && formData.attachments.length > 0;
    const hasValidSourceLinks = formData.sourceLinks && formData.sourceLinks.length > 0 &&
                               formData.sourceLinks.some(link => link.title && link.url);

    if (!hasAttachments && !hasValidSourceLinks) {
      setError('අවම වශයෙන් එක් ගොනුවක් හෝ සම්පත් සබැඳියක් අවශ්‍යයි');
      return;
    }

    // Filter out empty source links
    const validSourceLinks = formData.sourceLinks.filter(link => link.title && link.url);

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/${apiEndpoint}/files`,
        {
          ...formData,
          folderId: folderId,
          sourceLinks: validSourceLinks
        },
        { headers: { 'x-auth-token': token } }
      );

      if (response.data.success) {
        setFiles([...files, response.data.data]);
        setShowCreateDialog(false);
        resetForm();
        setError('');
      }
    } catch (err) {
      console.error('Error creating file:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('ගොනුව නිර්මාණය කිරීමේදී දෝෂයක් ඇතිවිය');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      content: '',
      attachments: [],
      sourceLinks: []
    });
  };

  const handleEditFile = async () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      setError('කරුණාකර සියලුම අනිවාර්ය ක්ෂේත්‍ර පුරවන්න');
      return;
    }

    // Validate that at least one attachment or valid source link is provided
    const hasAttachments = formData.attachments && formData.attachments.length > 0;
    const hasValidSourceLinks = formData.sourceLinks && formData.sourceLinks.length > 0 &&
                               formData.sourceLinks.some(link => link.title && link.url);

    if (!hasAttachments && !hasValidSourceLinks) {
      setError('අවම වශයෙන් එක් ගොනුවක් හෝ සම්පත් සබැඳියක් අවශ්‍යයි');
      return;
    }

    // Filter out empty source links
    const validSourceLinks = formData.sourceLinks.filter(link => link.title && link.url);

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/${apiEndpoint}/files/${editingFile._id}`,
        {
          ...formData,
          sourceLinks: validSourceLinks
        },
        { headers: { 'x-auth-token': token } }
      );

      if (response.data.success) {
        setFiles(files.map(file =>
          file._id === editingFile._id ? response.data.data : file
        ));
        setShowEditDialog(false);
        setEditingFile(null);
        resetForm();
        setError('');
      }
    } catch (err) {
      console.error('Error updating file:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('ගොනුව යාවත්කාලීන කිරීමේදී දෝෂයක් ඇතිවිය');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteFile = async (fileId) => {
    if (!window.confirm('ඔබට මෙම ගොනුව මකා දැමීමට අවශ්‍යද?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/${apiEndpoint}/files/${fileId}`,
        { headers: { 'x-auth-token': token } }
      );

      setFiles(files.filter(file => file._id !== fileId));
    } catch (err) {
      console.error('Error deleting file:', err);
      setError('ගොනුව මකා දැමීමේදී දෝෂයක් ඇතිවිය');
    }
  };

  const openEditDialog = (file) => {
    setEditingFile(file);
    setFormData({
      title: file.title,
      description: file.description,
      content: file.content || '',
      attachments: file.attachments || [],
      sourceLinks: file.sourceLinks || []
    });
    setShowEditDialog(true);
  };

  const handleViewDetails = (file) => {
    setSelectedFile(file);
    setShowDetailsDialog(true);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={60} sx={{ color: '#E91E63' }} />
      </Box>
    );
  }

  if (!folder) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="error">ෆෝල්ඩරය සොයා ගත නොහැක</Alert>
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
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            p: 4,
            mb: 4,
            borderRadius: 3
          }}
        >
          <Box display="flex" alignItems="center" mb={2}>
            <IconButton
              onClick={() => navigate(routePath)}
              sx={{ color: 'white', mr: 2 }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Breadcrumbs
              separator="›"
              sx={{
                '& .MuiBreadcrumbs-separator': { color: 'white' },
                '& .MuiBreadcrumbs-li': { color: 'white' }
              }}
            >
              <Link
                color="inherit"
                onClick={() => navigate(routePath)}
                sx={{ cursor: 'pointer', textDecoration: 'none' }}
              >
                {title}
              </Link>
              <Typography color="inherit">{folder.title}</Typography>
            </Breadcrumbs>
          </Box>

          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
              fontWeight: 'bold'
            }}
          >
            {folder.title}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
              opacity: 0.9
            }}
          >
            {folder.description}
          </Typography>
        </Paper>
      </motion.div>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Files Grid */}
      <Grid container spacing={3}>
        <AnimatePresence>
          {files.map((file, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={file._id}>
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
                    flexDirection: 'column',
                    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
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
                          bgcolor: '#4CAF50',
                          mr: 2,
                          width: 48,
                          height: 48
                        }}
                      >
                        <FileIcon />
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
                        {file.title}
                      </Typography>
                    </Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
                        mb: 2,
                        lineHeight: 1.5
                      }}
                    >
                      {file.description}
                    </Typography>

                    {/* Attachments */}
                    {file.attachments && file.attachments.length > 0 && (
                      <Box mb={2}>
                        <Typography variant="caption" color="text.secondary" display="flex" alignItems="center" gap={1}>
                          <AttachmentIcon fontSize="small" />
                          {file.attachments.length} ගොනු
                        </Typography>
                        <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                          {file.attachments.slice(0, 3).map((attachment, idx) => (
                            <Chip
                              key={idx}
                              label={attachment.type === 'pdf' ? 'PDF' : 'IMG'}
                              size="small"
                              color={attachment.type === 'pdf' ? 'error' : 'info'}
                              onClick={() => window.open(attachment.url, '_blank')}
                              sx={{ cursor: 'pointer' }}
                            />
                          ))}
                          {file.attachments.length > 3 && (
                            <Chip
                              label={`+${file.attachments.length - 3}`}
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </Box>
                      </Box>
                    )}

                    {/* Source Links */}
                    {file.sourceLinks && file.sourceLinks.length > 0 && (
                      <Box mb={2}>
                        <Typography variant="caption" color="text.secondary" display="flex" alignItems="center" gap={1}>
                          <LinkIcon fontSize="small" />
                          {file.sourceLinks.length} සබැඳි
                        </Typography>
                      </Box>
                    )}

                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <PersonIcon fontSize="small" color="action" />
                      <Typography variant="caption" color="text.secondary">
                        {file.createdBy?.fullName}
                      </Typography>
                    </Box>

                    <Box display="flex" alignItems="center" gap={1}>
                      <TimeIcon fontSize="small" color="action" />
                      <Typography variant="caption" color="text.secondary">
                        {new Date(file.createdAt).toLocaleDateString('si-LK')}
                      </Typography>
                    </Box>
                  </CardContent>

                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => handleViewDetails(file)}
                      sx={{
                        bgcolor: '#4CAF50',
                        fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                        fontWeight: 'bold',
                        '&:hover': {
                          bgcolor: '#388E3C'
                        }
                      }}
                    >
                      විස්තර බලන්න
                    </Button>

                    {(userRole === 'admin' || userRole === 'moderator') && (
                      <Box display="flex" gap={1} ml={1}>
                        <IconButton
                          size="small"
                          onClick={() => openEditDialog(file)}
                          sx={{ color: '#FF9800' }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteFile(file._id)}
                          sx={{ color: '#F44336' }}
                        >
                          <DeleteIcon />
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
      {files.length === 0 && !loading && (
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
            <FileIcon sx={{ fontSize: 80, color: '#4CAF50', mb: 2 }} />
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                color: '#2C3E50'
              }}
            >
              තවම ගොනු නොමැත
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
              }}
            >
              ගොනු නිර්මාණය කිරීමට පරිපාලකයින්ට පමණක් හැකිය
            </Typography>
          </Paper>
        </motion.div>
      )}

      {/* Create File FAB */}
      {(userRole === 'admin' || userRole === 'moderator') && (
        <Fab
          color="primary"
          aria-label="add file"
          onClick={() => setShowCreateDialog(true)}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            bgcolor: '#4CAF50',
            '&:hover': {
              bgcolor: '#388E3C'
            }
          }}
        >
          <AddIcon />
        </Fab>
      )}

      {/* Create File Dialog */}
      <Dialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        maxWidth="lg"
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
            <FileIcon sx={{ color: '#4CAF50' }} />
            නව ගොනුවක් නිර්මාණය කරන්න
          </Box>
          <IconButton onClick={() => setShowCreateDialog(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="ගොනු නම"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                margin="normal"
                variant="outlined"
                required
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
                rows={3}
                required
                sx={{
                  '& .MuiInputLabel-root': {
                    fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
                  }
                }}
              />
              <TextField
                fullWidth
                label="අන්තර්ගතය (විකල්ප)"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
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
            </Grid>
            <Grid item xs={12} md={6}>
              {/* File Upload Section */}
              <Box mb={3}>
                <Typography variant="h6" gutterBottom sx={{ fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif' }}>
                  ගොනු උඩුගත කරන්න
                </Typography>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={uploading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
                  disabled={uploading}
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  {uploading ? 'උඩුගත වෙමින්...' : 'ගොනුවක් තෝරන්න'}
                  <input
                    type="file"
                    hidden
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                  />
                </Button>

                {/* Display uploaded attachments */}
                {formData.attachments.map((attachment, index) => (
                  <Box key={index} display="flex" alignItems="center" justifyContent="space-between" p={1} border={1} borderColor="grey.300" borderRadius={1} mb={1}>
                    <Typography variant="body2">{attachment.title}</Typography>
                    <IconButton size="small" onClick={() => removeAttachment(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
              </Box>

              {/* Source Links Section */}
              <Box>
                <Typography variant="h6" gutterBottom sx={{ fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif' }}>
                  සම්පත් සබැඳි
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<LinkIcon />}
                  onClick={addSourceLink}
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  සබැඳියක් එක් කරන්න
                </Button>

                {/* Display source links */}
                {formData.sourceLinks.map((link, index) => (
                  <Box key={index} mb={2} p={2} border={1} borderColor="grey.300" borderRadius={1}>
                    <TextField
                      fullWidth
                      label="සබැඳි නම"
                      value={link.title}
                      onChange={(e) => updateSourceLink(index, 'title', e.target.value)}
                      margin="dense"
                      size="small"
                    />
                    <TextField
                      fullWidth
                      label="URL"
                      value={link.url}
                      onChange={(e) => updateSourceLink(index, 'url', e.target.value)}
                      margin="dense"
                      size="small"
                    />
                    <Box display="flex" justifyContent="flex-end" mt={1}>
                      <IconButton size="small" onClick={() => removeSourceLink(index)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setShowCreateDialog(false)}
            sx={{
              fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
            }}
          >
            අවලංගු කරන්න
          </Button>
          <Button
            variant="contained"
            onClick={handleCreateFile}
            disabled={submitting}
            sx={{
              bgcolor: '#4CAF50',
              fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
              fontWeight: 'bold',
              '&:hover': {
                bgcolor: '#388E3C'
              }
            }}
          >
            {submitting ? <CircularProgress size={20} color="inherit" /> : 'නිර්මාණය කරන්න'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit File Dialog */}
      <Dialog
        open={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        maxWidth="lg"
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
            ගොනුව සංස්කරණය කරන්න
          </Box>
          <IconButton onClick={() => setShowEditDialog(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="ගොනු නම"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                margin="normal"
                variant="outlined"
                required
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
                rows={3}
                required
                sx={{
                  '& .MuiInputLabel-root': {
                    fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
                  }
                }}
              />
              <TextField
                fullWidth
                label="අන්තර්ගතය (විකල්ප)"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
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
            </Grid>
            <Grid item xs={12} md={6}>
              {/* File Upload Section */}
              <Box mb={3}>
                <Typography variant="h6" gutterBottom sx={{ fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif' }}>
                  ගොනු උඩුගත කරන්න
                </Typography>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={uploading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
                  disabled={uploading}
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  {uploading ? 'උඩුගත වෙමින්...' : 'ගොනුවක් තෝරන්න'}
                  <input
                    type="file"
                    hidden
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                  />
                </Button>

                {/* Display uploaded attachments */}
                {formData.attachments.map((attachment, index) => (
                  <Box key={index} display="flex" alignItems="center" justifyContent="space-between" p={1} border={1} borderColor="grey.300" borderRadius={1} mb={1}>
                    <Typography variant="body2">{attachment.title}</Typography>
                    <IconButton size="small" onClick={() => removeAttachment(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
              </Box>

              {/* Source Links Section */}
              <Box>
                <Typography variant="h6" gutterBottom sx={{ fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif' }}>
                  සම්පත් සබැඳි
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<LinkIcon />}
                  onClick={addSourceLink}
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  සබැඳියක් එක් කරන්න
                </Button>

                {/* Display source links */}
                {formData.sourceLinks.map((link, index) => (
                  <Box key={index} mb={2} p={2} border={1} borderColor="grey.300" borderRadius={1}>
                    <TextField
                      fullWidth
                      label="සබැඳි නම"
                      value={link.title}
                      onChange={(e) => updateSourceLink(index, 'title', e.target.value)}
                      margin="dense"
                      size="small"
                    />
                    <TextField
                      fullWidth
                      label="URL"
                      value={link.url}
                      onChange={(e) => updateSourceLink(index, 'url', e.target.value)}
                      margin="dense"
                      size="small"
                    />
                    <Box display="flex" justifyContent="flex-end" mt={1}>
                      <IconButton size="small" onClick={() => removeSourceLink(index)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setShowEditDialog(false)}
            sx={{
              fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
            }}
          >
            අවලංගු කරන්න
          </Button>
          <Button
            variant="contained"
            onClick={handleEditFile}
            disabled={submitting}
            sx={{
              bgcolor: '#FF9800',
              fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
              fontWeight: 'bold',
              '&:hover': {
                bgcolor: '#F57C00'
              }
            }}
          >
            {submitting ? <CircularProgress size={20} color="inherit" /> : 'යාවත්කාලීන කරන්න'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* File Details Dialog */}
      <Dialog
        open={showDetailsDialog}
        onClose={() => setShowDetailsDialog(false)}
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
            <FileIcon sx={{ color: '#4CAF50' }} />
            ගොනු විස්තර
          </Box>
          <IconButton onClick={() => setShowDetailsDialog(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {selectedFile && (
            <Box>
              <Typography variant="h6" gutterBottom sx={{ fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif' }}>
                {selectedFile.title}
              </Typography>

              <Typography variant="body1" paragraph sx={{ fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif' }}>
                <strong>විස්තරය:</strong> {selectedFile.description}
              </Typography>

              {selectedFile.content && (
                <Typography variant="body1" paragraph sx={{ fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif' }}>
                  <strong>අන්තර්ගතය:</strong> {selectedFile.content}
                </Typography>
              )}

              {/* Attachments */}
              {selectedFile.attachments && selectedFile.attachments.length > 0 && (
                <Box mb={3}>
                  <Typography variant="h6" gutterBottom sx={{ fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif' }}>
                    ගොනු ({selectedFile.attachments.length})
                  </Typography>
                  <Grid container spacing={2}>
                    {selectedFile.attachments.map((attachment, index) => (
                      <Grid item xs={12} sm={6} key={index}>
                        <Card elevation={2} sx={{ p: 2 }}>
                          <Box display="flex" alignItems="center" gap={2}>
                            <Avatar sx={{ bgcolor: attachment.type === 'pdf' ? '#F44336' : '#2196F3' }}>
                              {attachment.type === 'pdf' ? 'PDF' : 'IMG'}
                            </Avatar>
                            <Box flexGrow={1}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                {attachment.title}
                              </Typography>
                              {attachment.description && (
                                <Typography variant="caption" color="text.secondary">
                                  {attachment.description}
                                </Typography>
                              )}
                            </Box>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => window.open(attachment.url, '_blank')}
                              sx={{ fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif' }}
                            >
                              බලන්න
                            </Button>
                          </Box>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              {/* Source Links */}
              {selectedFile.sourceLinks && selectedFile.sourceLinks.length > 0 && (
                <Box mb={3}>
                  <Typography variant="h6" gutterBottom sx={{ fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif' }}>
                    සම්පත් සබැඳි ({selectedFile.sourceLinks.length})
                  </Typography>
                  <Grid container spacing={2}>
                    {selectedFile.sourceLinks.map((link, index) => (
                      <Grid item xs={12} sm={6} key={index}>
                        <Card elevation={2} sx={{ p: 2 }}>
                          <Box display="flex" alignItems="center" gap={2}>
                            <Avatar sx={{ bgcolor: '#FF9800' }}>
                              <LinkIcon />
                            </Avatar>
                            <Box flexGrow={1}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                {link.title}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ wordBreak: 'break-all' }}>
                                {link.url}
                              </Typography>
                            </Box>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => window.open(link.url, '_blank')}
                              sx={{ fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif' }}
                            >
                              යන්න
                            </Button>
                          </Box>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              {/* File Info */}
              <Box mt={3} p={2} bgcolor="grey.100" borderRadius={2}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary">
                      <PersonIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                      නිර්මාණය කළේ: {selectedFile.createdBy?.fullName}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary">
                      <TimeIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                      දිනය: {new Date(selectedFile.createdAt).toLocaleDateString('si-LK')}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setShowDetailsDialog(false)}
            variant="contained"
            sx={{
              bgcolor: '#4CAF50',
              fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
              fontWeight: 'bold',
              '&:hover': {
                bgcolor: '#388E3C'
              }
            }}
          >
            හරි
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default GenericFolderView;
