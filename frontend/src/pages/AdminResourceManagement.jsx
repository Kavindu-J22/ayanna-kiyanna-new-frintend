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
  Alert,
  CircularProgress,
  Chip,
  Fab,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  ArrowBack,
  Add,
  Edit,
  Delete,
  FolderOpen,
  AttachFile,
  Link as LinkIcon,
  School,
  CloudUpload,
  Close
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';

const AdminResourceManagement = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // State management
  const [resources, setResources] = useState([]);
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Dialog states
  const [createDialog, setCreateDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    attachments: [],
    externalLinks: []
  });
  const [formLoading, setFormLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchClassData();
    fetchResources();
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

  const fetchResources = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/resources/class/${classId}`,
        { headers: { 'x-auth-token': token } }
      );
      setResources(response.data.resources);
    } catch (err) {
      console.error('Error fetching resources:', err);
      setError('Failed to load resources');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'ml_default');

        const response = await fetch(
          'https://api.cloudinary.com/v1_1/dl9k5qoae/auto/upload',
          {
            method: 'POST',
            body: formData
          }
        );

        const data = await response.json();
        return {
          url: data.secure_url,
          publicId: data.public_id,
          name: file.name,
          type: file.type.startsWith('image/') ? 'image' : 'pdf',
          size: file.size
        };
      });

      const uploadedFiles = await Promise.all(uploadPromises);
      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...uploadedFiles]
      }));
    } catch (err) {
      console.error('Error uploading files:', err);
      alert('Failed to upload files');
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

  const addExternalLink = () => {
    setFormData(prev => ({
      ...prev,
      externalLinks: [...prev.externalLinks, { title: '', url: '', description: '' }]
    }));
  };

  const updateExternalLink = (index, field, value) => {
    const updatedLinks = [...formData.externalLinks];
    updatedLinks[index][field] = value;
    setFormData(prev => ({
      ...prev,
      externalLinks: updatedLinks
    }));
  };

  const removeExternalLink = (index) => {
    setFormData(prev => ({
      ...prev,
      externalLinks: prev.externalLinks.filter((_, i) => i !== index)
    }));
  };

  const handleCreateResource = async () => {
    try {
      setFormLoading(true);
      const token = localStorage.getItem('token');
      
      const resourceData = {
        ...formData,
        classId
      };

      await axios.post(
        'https://ayanna-kiyanna-new-backend.onrender.com/api/resources',
        resourceData,
        { headers: { 'x-auth-token': token } }
      );

      setCreateDialog(false);
      resetForm();
      fetchResources();
      alert('Resource created successfully!');
    } catch (err) {
      console.error('Error creating resource:', err);
      alert(err.response?.data?.message || 'Failed to create resource');
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateResource = async () => {
    try {
      setFormLoading(true);
      const token = localStorage.getItem('token');

      await axios.put(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/resources/${selectedResource._id}`,
        formData,
        { headers: { 'x-auth-token': token } }
      );

      setEditDialog(false);
      resetForm();
      fetchResources();
      alert('Resource updated successfully!');
    } catch (err) {
      console.error('Error updating resource:', err);
      alert(err.response?.data?.message || 'Failed to update resource');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteResource = async () => {
    try {
      setFormLoading(true);
      const token = localStorage.getItem('token');
      
      await axios.delete(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/resources/${selectedResource._id}`,
        { headers: { 'x-auth-token': token } }
      );

      setDeleteDialog(false);
      setSelectedResource(null);
      fetchResources();
      alert('Resource deleted successfully!');
    } catch (err) {
      console.error('Error deleting resource:', err);
      alert(err.response?.data?.message || 'Failed to delete resource');
    } finally {
      setFormLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      attachments: [],
      externalLinks: []
    });
    setSelectedResource(null);
  };

  const openEditDialog = (resource) => {
    setSelectedResource(resource);
    setFormData({
      title: resource.title,
      description: resource.description,
      attachments: resource.attachments || [],
      externalLinks: resource.externalLinks || []
    });
    setEditDialog(true);
  };

  const openDeleteDialog = (resource) => {
    setSelectedResource(resource);
    setDeleteDialog(true);
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
              වෙනත් සම්පත් සහ මෙවලම් කළමනාකරණය
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

        {/* Resources Grid */}
        <Grid container spacing={3}>
          {resources.map((resource) => (
            <Grid item xs={12} sm={6} md={4} key={resource._id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6
                  }
                }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" fontWeight="bold" sx={{
                      fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                      mb: 2
                    }}>
                      {resource.title}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {resource.description.length > 100 
                        ? `${resource.description.substring(0, 100)}...` 
                        : resource.description
                      }
                    </Typography>

                    {resource.attachments && resource.attachments.length > 0 && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <AttachFile fontSize="small" color="primary" />
                        <Typography variant="caption" color="primary">
                          {resource.attachments.length} Attachment(s)
                        </Typography>
                      </Box>
                    )}

                    {resource.externalLinks && resource.externalLinks.length > 0 && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <LinkIcon fontSize="small" color="secondary" />
                        <Typography variant="caption" color="secondary">
                          {resource.externalLinks.length} External Link(s)
                        </Typography>
                      </Box>
                    )}

                    <Typography variant="caption" color="text.secondary">
                      Created: {new Date(resource.createdAt).toLocaleDateString()}
                    </Typography>
                  </CardContent>

                  <Box sx={{ p: 2, pt: 0, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Button
                      size="small"
                      startIcon={<FolderOpen />}
                      onClick={() => navigate(`/resource-details/${resource._id}`)}
                      sx={{ flex: 1, minWidth: '120px' }}
                    >
                      View Details
                    </Button>
                    <IconButton
                      size="small"
                      onClick={() => openEditDialog(resource)}
                      color="primary"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => openDeleteDialog(resource)}
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

        {resources.length === 0 && (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <FolderOpen sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" sx={{
              fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
            }}>
              සම්පත් නොමැත
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              නව සම්පතක් සෑදීමට + බොත්තම ක්ලික් කරන්න
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

        {/* Create/Edit Resource Dialog */}
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
            {createDialog ? 'නව සම්පතක් සෑදීම' : 'සම්පත සංස්කරණය'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <TextField
                fullWidth
                label="සම්පත් මාතෘකාව"
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

              {/* File Upload Section */}
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                ගොනු ඇමුණුම් (පින්තූර, PDF)
              </Typography>

              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUpload />}
                sx={{ mb: 2 }}
                disabled={uploading}
              >
                {uploading ? 'උඩුගත කරමින්...' : 'ගොනු උඩුගත කරන්න'}
                <input
                  type="file"
                  hidden
                  multiple
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                />
              </Button>

              {formData.attachments.length > 0 && (
                <List dense sx={{ mb: 3 }}>
                  {formData.attachments.map((attachment, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={attachment.name}
                        secondary={`${attachment.type} - ${(attachment.size / 1024 / 1024).toFixed(2)} MB`}
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          onClick={() => removeAttachment(index)}
                          color="error"
                        >
                          <Close />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              )}

              {/* External Links Section */}
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                බාහිර සබැඳි (ශ්‍රව්‍ය, දෘශ්‍ය, විශේෂ සබැඳි)
              </Typography>

              {formData.externalLinks.map((link, index) => (
                <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #ddd', borderRadius: 2 }}>
                  <TextField
                    fullWidth
                    label="සබැඳි මාතෘකාව"
                    value={link.title}
                    onChange={(e) => updateExternalLink(index, 'title', e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="URL"
                    value={link.url}
                    onChange={(e) => updateExternalLink(index, 'url', e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="විස්තරය (විකල්ප)"
                    value={link.description}
                    onChange={(e) => updateExternalLink(index, 'description', e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <Button
                    color="error"
                    startIcon={<Delete />}
                    onClick={() => removeExternalLink(index)}
                  >
                    සබැඳිය ඉවත් කරන්න
                  </Button>
                </Box>
              ))}

              <Button
                startIcon={<Add />}
                onClick={addExternalLink}
                sx={{ mb: 3 }}
              >
                බාහිර සබැඳිය එක් කරන්න
              </Button>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setCreateDialog(false);
                setEditDialog(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={createDialog ? handleCreateResource : handleUpdateResource}
              disabled={formLoading || !formData.title || !formData.description}
            >
              {formLoading ? <CircularProgress size={20} /> : (createDialog ? 'Create' : 'Update')}
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
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete the resource "{selectedResource?.title}"?
              This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteResource}
              disabled={formLoading}
            >
              {formLoading ? <CircularProgress size={20} /> : 'Delete'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default AdminResourceManagement;
