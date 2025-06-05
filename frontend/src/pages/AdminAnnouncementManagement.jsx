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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  ArrowBack,
  Add,
  Edit,
  Delete,
  Notifications,
  AttachFile,
  School,
  CloudUpload,
  Close,
  PriorityHigh
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';

const AdminAnnouncementManagement = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // State management
  const [announcements, setAnnouncements] = useState([]);
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Dialog states
  const [createDialog, setCreateDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    expiryDate: null,
    attachments: []
  });
  const [formLoading, setFormLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchClassData();
    fetchAnnouncements();
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

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/announcements/class/${classId}`,
        { headers: { 'x-auth-token': token } }
      );
      setAnnouncements(response.data.announcements);
    } catch (err) {
      console.error('Error fetching announcements:', err);
      setError('Failed to load announcements');
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

  const handleCreateAnnouncement = async () => {
    try {
      setFormLoading(true);
      const token = localStorage.getItem('token');
      
      const announcementData = {
        ...formData,
        classId,
        expiryDate: formData.expiryDate ? formData.expiryDate.toISOString() : null
      };

      await axios.post(
        'https://ayanna-kiyanna-new-backend.onrender.com/api/announcements',
        announcementData,
        { headers: { 'x-auth-token': token } }
      );

      setCreateDialog(false);
      resetForm();
      fetchAnnouncements();
      alert('Announcement created successfully!');
    } catch (err) {
      console.error('Error creating announcement:', err);
      alert(err.response?.data?.message || 'Failed to create announcement');
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateAnnouncement = async () => {
    try {
      setFormLoading(true);
      const token = localStorage.getItem('token');
      
      const announcementData = {
        ...formData,
        expiryDate: formData.expiryDate ? formData.expiryDate.toISOString() : null
      };

      await axios.put(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/announcements/${selectedAnnouncement._id}`,
        announcementData,
        { headers: { 'x-auth-token': token } }
      );

      setEditDialog(false);
      resetForm();
      fetchAnnouncements();
      alert('Announcement updated successfully!');
    } catch (err) {
      console.error('Error updating announcement:', err);
      alert(err.response?.data?.message || 'Failed to update announcement');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteAnnouncement = async () => {
    try {
      setFormLoading(true);
      const token = localStorage.getItem('token');
      
      await axios.delete(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/announcements/${selectedAnnouncement._id}`,
        { headers: { 'x-auth-token': token } }
      );

      setDeleteDialog(false);
      setSelectedAnnouncement(null);
      fetchAnnouncements();
      alert('Announcement deleted successfully!');
    } catch (err) {
      console.error('Error deleting announcement:', err);
      alert(err.response?.data?.message || 'Failed to delete announcement');
    } finally {
      setFormLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'Medium',
      expiryDate: null,
      attachments: []
    });
    setSelectedAnnouncement(null);
  };

  const openEditDialog = (announcement) => {
    setSelectedAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      description: announcement.description,
      priority: announcement.priority,
      expiryDate: announcement.expiryDate ? new Date(announcement.expiryDate) : null,
      attachments: announcement.attachments || []
    });
    setEditDialog(true);
  };

  const openDeleteDialog = (announcement) => {
    setSelectedAnnouncement(announcement);
    setDeleteDialog(true);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Urgent':
        return 'error';
      case 'High':
        return 'warning';
      case 'Medium':
        return 'info';
      case 'Low':
        return 'default';
      default:
        return 'default';
    }
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
              පන්ති දැනුම්දීම් කළමනාකරණය
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

        {/* Announcements Grid */}
        <Grid container spacing={3}>
          {announcements.map((announcement) => (
            <Grid item xs={12} sm={6} md={4} key={announcement._id}>
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
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" fontWeight="bold" sx={{
                        fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                        flex: 1
                      }}>
                        {announcement.title}
                      </Typography>
                      <Chip
                        label={announcement.priority}
                        color={getPriorityColor(announcement.priority)}
                        size="small"
                        icon={announcement.priority === 'Urgent' ? <PriorityHigh /> : undefined}
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {announcement.description.length > 100 
                        ? `${announcement.description.substring(0, 100)}...` 
                        : announcement.description
                      }
                    </Typography>

                    {announcement.attachments && announcement.attachments.length > 0 && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <AttachFile fontSize="small" color="primary" />
                        <Typography variant="caption" color="primary">
                          {announcement.attachments.length} Attachment(s)
                        </Typography>
                      </Box>
                    )}

                    {announcement.expiryDate && (
                      <Typography variant="caption" color="text.secondary">
                        Expires: {new Date(announcement.expiryDate).toLocaleDateString()}
                      </Typography>
                    )}

                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                      Created: {new Date(announcement.createdAt).toLocaleDateString()}
                    </Typography>
                  </CardContent>

                  <Box sx={{ p: 2, pt: 0, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Button
                      size="small"
                      startIcon={<Notifications />}
                      onClick={() => navigate(`/announcement-details/${announcement._id}`)}
                      sx={{ flex: 1, minWidth: '120px' }}
                    >
                      View Details
                    </Button>
                    <IconButton
                      size="small"
                      onClick={() => openEditDialog(announcement)}
                      color="primary"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => openDeleteDialog(announcement)}
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

        {announcements.length === 0 && (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Notifications sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" sx={{
              fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
            }}>
              දැනුම්දීම් නොමැත
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              නව දැනුම්දීමක් සෑදීමට + බොත්තම ක්ලික් කරන්න
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

        {/* Create/Edit Announcement Dialog */}
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
            {createDialog ? 'නව දැනුම්දීමක් සෑදීම' : 'දැනුම්දීම සංස්කරණය'}
          </DialogTitle>
          <DialogContent>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Box sx={{ pt: 2 }}>
                <TextField
                  fullWidth
                  label="දැනුම්දීම් මාතෘකාව"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  sx={{ mb: 3 }}
                  required
                />

                <TextField
                  fullWidth
                  label="විස්තරය"
                  multiline
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  sx={{ mb: 3 }}
                  required
                />

                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>ප්‍රමුඛතාව</InputLabel>
                  <Select
                    value={formData.priority}
                    label="ප්‍රමුඛතාව"
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                  >
                    <MenuItem value="Low">අඩු</MenuItem>
                    <MenuItem value="Medium">මධ්‍යම</MenuItem>
                    <MenuItem value="High">ඉහළ</MenuItem>
                    <MenuItem value="Urgent">හදිසි</MenuItem>
                  </Select>
                </FormControl>

                <DatePicker
                  label="කල් ඉකුත් වන දිනය (විකල්ප)"
                  value={formData.expiryDate}
                  onChange={(newValue) => setFormData(prev => ({ ...prev, expiryDate: newValue }))}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      sx={{ mb: 3 }}
                      helperText="කල් ඉකුත් නොවන්නේ නම් හිස්ව තබන්න"
                    />
                  )}
                />

                {/* File Upload Section */}
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                  ගොනු ඇමුණුම් (විකල්ප)
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
              </Box>
            </LocalizationProvider>
          </DialogContent>
          <DialogActions>
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
              onClick={createDialog ? handleCreateAnnouncement : handleUpdateAnnouncement}
              disabled={formLoading || !formData.title || !formData.description}
            >
              {formLoading ? <CircularProgress size={20} /> : (createDialog ? 'සෑදීම' : 'යාවත්කාලීන කරන්න')}
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
          <DialogTitle>මකාදැමීම තහවුරු කරන්න</DialogTitle>
          <DialogContent>
            <Typography>
              ඔබට "{selectedAnnouncement?.title}" දැනුම්දීම මකා දැමීමට අවශ්‍යද?
              මෙම ක්‍රියාව අහෝසි කළ නොහැක.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialog(false)}>
              අවලංගු කරන්න
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteAnnouncement}
              disabled={formLoading}
            >
              {formLoading ? <CircularProgress size={20} /> : 'මකා දමන්න'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default AdminAnnouncementManagement;
