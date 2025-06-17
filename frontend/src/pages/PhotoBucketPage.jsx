import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Fab,
  CircularProgress,
  Alert,
  Chip,
  Menu,
  MenuItem,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PhotoLibrary as PhotoLibraryIcon,
  MoreVert as MoreVertIcon,
  Link as LinkIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PhotoBucketPage = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    attachment: null,
    sourceLinks: ['']
  });

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
      fetchPhotos();
    } catch (err) {
      console.error('Authentication error:', err);
      setShowLoginDialog(true);
      setLoading(false);
    }
  };

  const fetchPhotos = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://ayanna-kiyanna-new-backend.onrender.com/api/photo-bucket', {
        headers: { 'x-auth-token': token }
      });

      if (response.data.success) {
        setPhotos(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching photos:', err);
      setError('Error loading photos');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    setShowLoginDialog(false);
    navigate('/login');
  };

  const handleFileUpload = async (file) => {
    if (!file) return null;

    setUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);
    formDataUpload.append('upload_preset', 'ml_default');

    try {
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dl9k5qoae/image/upload',
        formDataUpload
      );

      return {
        url: response.data.secure_url,
        publicId: response.data.public_id
      };
    } catch (err) {
      console.error('Upload error:', err);
      setError('ගොනුව උඩුගත කිරීමේදී දෝෂයක් ඇතිවිය');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleCreatePhoto = async () => {
    if (!formData.title.trim()) {
      setError('කරුණාකර මාතෘකාව ඇතුළත් කරන්න');
      return;
    }

    if (!formData.attachment) {
      setError('කරුණාකර ඡායාරූපයක් තෝරන්න');
      return;
    }

    setSubmitting(true);
    try {
      const uploadResult = await handleFileUpload(formData.attachment);
      if (!uploadResult) {
        setSubmitting(false);
        return;
      }

      const token = localStorage.getItem('token');
      const photoData = {
        title: formData.title,
        description: formData.description,
        attachment: uploadResult,
        sourceLinks: formData.sourceLinks.filter(link => link.trim())
      };

      const response = await axios.post(
        'https://ayanna-kiyanna-new-backend.onrender.com/api/photo-bucket',
        photoData,
        { headers: { 'x-auth-token': token } }
      );

      if (response.data.success) {
        setPhotos([response.data.data, ...photos]);
        setShowCreateDialog(false);
        resetForm();
        setError('');
      }
    } catch (err) {
      console.error('Error creating photo:', err);
      setError('ඡායාරූපය සෑදීමේදී දෝෂයක් ඇතිවිය');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdatePhoto = async () => {
    if (!formData.title.trim()) {
      setError('කරුණාකර මාතෘකාව ඇතුළත් කරන්න');
      return;
    }

    setSubmitting(true);
    try {
      let attachment = editingPhoto.attachment;
      if (formData.attachment) {
        const uploadResult = await handleFileUpload(formData.attachment);
        if (uploadResult) {
          attachment = uploadResult;
        }
      }

      const token = localStorage.getItem('token');
      const photoData = {
        title: formData.title,
        description: formData.description,
        attachment,
        sourceLinks: formData.sourceLinks.filter(link => link.trim())
      };

      const response = await axios.put(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/photo-bucket/${editingPhoto._id}`,
        photoData,
        { headers: { 'x-auth-token': token } }
      );

      if (response.data.success) {
        const updatedPhotos = photos.map(photo =>
          photo._id === editingPhoto._id ? response.data.data : photo
        );
        setPhotos(updatedPhotos);
        setShowEditDialog(false);
        resetForm();
        setError('');
      }
    } catch (err) {
      console.error('Error updating photo:', err);
      setError('ඡායාරූපය යාවත්කාලීන කිරීමේදී දෝෂයක් ඇතිවිය');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      attachment: null,
      sourceLinks: ['']
    });
  };

  const handleMenuOpen = (event, photo) => {
    setAnchorEl(event.currentTarget);
    setSelectedPhoto(photo);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPhoto(null);
  };

  const openEditDialog = (photo) => {
    setEditingPhoto(photo);
    setFormData({
      title: photo.title,
      description: photo.description || '',
      attachment: null,
      sourceLinks: photo.sourceLinks?.length > 0 ? photo.sourceLinks : ['']
    });
    setShowEditDialog(true);
    handleMenuClose();
  };

  const handleDeletePhoto = async (photoId) => {
    if (!window.confirm('ඔබට මෙම ඡායාරූපය මකා දැමීමට අවශ්‍යද?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/photo-bucket/${photoId}`,
        { headers: { 'x-auth-token': token } }
      );

      setPhotos(photos.filter(photo => photo._id !== photoId));
      handleMenuClose();
    } catch (err) {
      console.error('Error deleting photo:', err);
      setError('ඡායාරූපය මකා දැමීමේදී දෝෂයක් ඇතිවිය');
    }
  };

  const addSourceLink = () => {
    setFormData(prev => ({
      ...prev,
      sourceLinks: [...prev.sourceLinks, '']
    }));
  };

  const updateSourceLink = (index, value) => {
    const newLinks = [...formData.sourceLinks];
    newLinks[index] = value;
    setFormData(prev => ({
      ...prev,
      sourceLinks: newLinks
    }));
  };

  const removeSourceLink = (index) => {
    setFormData(prev => ({
      ...prev,
      sourceLinks: prev.sourceLinks.filter((_, i) => i !== index)
    }));
  };

  const handleImageClick = (imageUrl, title) => {
    setSelectedImage({ url: imageUrl, title });
    setShowImageModal(true);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} sx={{ color: '#E91E63' }} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" sx={{
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #E91E63 30%, #FF9800 90%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 2,
          fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
        }}>
          අයන්න කියන්න - Photo Bucket
        </Typography>
        
        <Typography variant="h6" color="text.secondary" sx={{
          fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
          maxWidth: '800px',
          mx: 'auto',
          lineHeight: 1.6
        }}>
          අයන්න කියන්න ආයතනයේ විශේෂ අවස්ථා, සිදුවීම් සහ මතක සටහන් ඡායාරූප එකතුව. 
          අපගේ ගමන් මගේ වැදගත් මොහොත් මෙහි සුරකින ලදී.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Photos Grid */}
      <Grid container spacing={3} justifyContent="center">
        <AnimatePresence>
          {photos.map((photo, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={photo._id} sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: 2,
              alignItems: 'stretch', // This ensures all cards stretch to the same height
            }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card sx={{
                  height: '100%',
                  display: 'flex',
                  maxWidth: '560px',
                  minWidth: '560px',
                  flexDirection: 'column',
                  borderRadius: 3,
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 30px rgba(233, 30, 99, 0.2)'
                  }
                }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={photo.attachment?.url}
                    alt={photo.title}
                    sx={{
                      objectFit: 'cover',
                      cursor: 'pointer',
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.05)'
                      }
                    }}
                    onClick={() => handleImageClick(photo.attachment?.url, photo.title)}
                  />
                  
                  <CardContent sx={{ flexGrow: 1, p: 2 }}>
                    <Typography variant="h6" component="h3" sx={{
                      fontWeight: 'bold',
                      mb: 1,
                      fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                      color: '#2E2E2E'
                    }}>
                      {photo.title}
                    </Typography>
                    
                    {photo.description && (
                      <Typography variant="body2" color="text.secondary" sx={{
                        mb: 1,
                        fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
                      }}>
                        {photo.description}
                      </Typography>
                    )}

                    {photo.sourceLinks && photo.sourceLinks.length > 0 && (
                      <Box sx={{ mt: 1 }}>
                        {photo.sourceLinks.map((link, linkIndex) => (
                          <Chip
                            key={linkIndex}
                            icon={<LinkIcon />}
                            label="Source Link"
                            size="small"
                            component="a"
                            href={link}
                            target="_blank"
                            clickable
                            sx={{
                              mr: 0.5,
                              mb: 0.5,
                              bgcolor: '#E3F2FD',
                              color: '#1976D2',
                              '&:hover': {
                                bgcolor: '#BBDEFB'
                              }
                            }}
                          />
                        ))}
                      </Box>
                    )}
                  </CardContent>

                  {(userRole === 'admin' || userRole === 'moderator') && (
                    <CardActions sx={{ p: 2, pt: 0, justifyContent: 'flex-end' }}>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, photo)}
                        sx={{ color: '#666' }}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </CardActions>
                  )}
                </Card>
              </motion.div>
            </Grid>
          ))}
        </AnimatePresence>
      </Grid>

      {photos.length === 0 && !loading && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <PhotoLibraryIcon sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" sx={{
            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
          }}>
            තවම ඡායාරූප එකතු කර නැත
          </Typography>
          <Typography variant="body2" color="text.secondary">
            පළමු ඡායාරූපය එකතු කිරීමට + බොත්තම ක්ලික් කරන්න
          </Typography>
        </Box>
      )}

      {/* Create Button */}
      {(userRole === 'admin' || userRole === 'moderator') && (
        <Tooltip title="නව ඡායාරූපයක් එකතු කරන්න" placement="left">
          <Fab
            color="primary"
            aria-label="add photo"
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
        </Tooltip>
      )}

      {/* Login Dialog */}
      <Dialog open={showLoginDialog} onClose={() => setShowLoginDialog(false)}>
        <DialogTitle sx={{
          textAlign: 'center',
          fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
          background: 'linear-gradient(45deg, #E91E63 30%, #FF9800 90%)',
          color: 'white'
        }}>
          සාදරයෙන් පිළිගනිමු!
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', py: 3 }}>
          <Typography variant="body1" sx={{
            fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
            mb: 2
          }}>
            Photo Bucket බැලීමට කරුණාකර පළමුව ලොගින් වන්න හෝ ගිණුමක් සාදන්න.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button
            variant="contained"
            onClick={handleLoginRedirect}
            sx={{
              bgcolor: '#E91E63',
              fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
              fontWeight: 'bold',
              px: 4,
              '&:hover': {
                bgcolor: '#C2185B'
              }
            }}
          >
            ලොගින් වන්න
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Dialog */}
      <Dialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{
          fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #E91E63 30%, #FF9800 90%)',
          color: 'white'
        }}>
          නව ඡායාරූපයක් එකතු කරන්න
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="මාතෘකාව *"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            sx={{ mb: 2 }}
            InputLabelProps={{
              style: { fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif' }
            }}
          />

          <TextField
            fullWidth
            label="විස්තරය (විකල්ප)"
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            sx={{ mb: 2 }}
            InputLabelProps={{
              style: { fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif' }
            }}
          />

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" sx={{
              fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
              mb: 1,
              fontWeight: 'medium'
            }}>
              ඡායාරූපය *
            </Typography>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFormData(prev => ({ ...prev, attachment: e.target.files[0] }))}
              style={{
                width: '100%',
                padding: '10px',
                border: '2px dashed #E91E63',
                borderRadius: '8px',
                backgroundColor: '#fafafa'
              }}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" sx={{
              fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
              mb: 1,
              fontWeight: 'medium'
            }}>
              මූලාශ්‍ර සබැඳි (විකල්ප)
            </Typography>
            {formData.sourceLinks.map((link, index) => (
              <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                  fullWidth
                  placeholder="https://example.com"
                  value={link}
                  onChange={(e) => updateSourceLink(index, e.target.value)}
                  size="small"
                />
                {formData.sourceLinks.length > 1 && (
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => removeSourceLink(index)}
                  >
                    මකන්න
                  </Button>
                )}
              </Box>
            ))}
            <Button
              variant="outlined"
              size="small"
              onClick={addSourceLink}
              sx={{ mt: 1 }}
            >
              සබැඳියක් එකතු කරන්න
            </Button>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setShowCreateDialog(false)}>
            අවලංගු කරන්න
          </Button>
          <Button
            variant="contained"
            onClick={handleCreatePhoto}
            disabled={submitting || uploading}
            sx={{
              bgcolor: '#E91E63',
              '&:hover': { bgcolor: '#C2185B' }
            }}
          >
            {submitting || uploading ? <CircularProgress size={20} /> : 'සාදන්න'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{
          fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #E91E63 30%, #FF9800 90%)',
          color: 'white'
        }}>
          ඡායාරූපය සංස්කරණය කරන්න
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="මාතෘකාව *"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            sx={{ mb: 2 }}
            InputLabelProps={{
              style: { fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif' }
            }}
          />

          <TextField
            fullWidth
            label="විස්තරය (විකල්ප)"
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            sx={{ mb: 2 }}
            InputLabelProps={{
              style: { fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif' }
            }}
          />

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" sx={{
              fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
              mb: 1,
              fontWeight: 'medium'
            }}>
              නව ඡායාරූපය (විකල්ප)
            </Typography>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFormData(prev => ({ ...prev, attachment: e.target.files[0] }))}
              style={{
                width: '100%',
                padding: '10px',
                border: '2px dashed #E91E63',
                borderRadius: '8px',
                backgroundColor: '#fafafa'
              }}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" sx={{
              fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
              mb: 1,
              fontWeight: 'medium'
            }}>
              මූලාශ්‍ර සබැඳි (විකල්ප)
            </Typography>
            {formData.sourceLinks.map((link, index) => (
              <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                  fullWidth
                  placeholder="https://example.com"
                  value={link}
                  onChange={(e) => updateSourceLink(index, e.target.value)}
                  size="small"
                />
                {formData.sourceLinks.length > 1 && (
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => removeSourceLink(index)}
                  >
                    මකන්න
                  </Button>
                )}
              </Box>
            ))}
            <Button
              variant="outlined"
              size="small"
              onClick={addSourceLink}
              sx={{ mt: 1 }}
            >
              සබැඳියක් එකතු කරන්න
            </Button>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setShowEditDialog(false)}>
            අවලංගු කරන්න
          </Button>
          <Button
            variant="contained"
            onClick={handleUpdatePhoto}
            disabled={submitting || uploading}
            sx={{
              bgcolor: '#E91E63',
              '&:hover': { bgcolor: '#C2185B' }
            }}
          >
            {submitting || uploading ? <CircularProgress size={20} /> : 'යාවත්කාලීන කරන්න'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => openEditDialog(selectedPhoto)}>
          <EditIcon sx={{ mr: 1 }} />
          සංස්කරණය කරන්න
        </MenuItem>
        <MenuItem onClick={() => handleDeletePhoto(selectedPhoto?._id)}>
          <DeleteIcon sx={{ mr: 1 }} />
          මකා දමන්න
        </MenuItem>
      </Menu>

      {/* Image Modal */}
      <Dialog
        open={showImageModal}
        onClose={() => setShowImageModal(false)}
        maxWidth="lg"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            boxShadow: 'none'
          }
        }}
      >
        <DialogTitle sx={{
          color: 'white',
          textAlign: 'center',
          fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
        }}>
          {selectedImage?.title}
          <IconButton
            onClick={() => setShowImageModal(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'white'
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0, textAlign: 'center' }}>
          {selectedImage && (
            <img
              src={selectedImage.url}
              alt={selectedImage.title}
              style={{
                maxWidth: '100%',
                maxHeight: '80vh',
                objectFit: 'contain'
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default PhotoBucketPage;
