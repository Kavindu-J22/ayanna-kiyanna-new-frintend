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
  IconButton,
  Alert,
  CircularProgress,
  Avatar,
  Paper,
  Breadcrumbs,
  Link,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
  InsertDriveFile as FileIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  PictureAsPdf as PdfIcon,
  Image as ImageIcon,
  Person as PersonIcon,
  AccessTime as TimeIcon,
  Attachment as AttachmentIcon,
  Link as LinkIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import CreateGradeFileDialog from '../components/CreateGradeFileDialog';
import EditGradeFileDialog from '../components/EditGradeFileDialog';
import GradeFileDetailsDialog from '../components/GradeFileDetailsDialog';

const GradeFolderView = () => {
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
  const [deletingId, setDeletingId] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { gradeCategory, folderId } = useParams();

  // Grade category configurations
  const gradeConfigs = {
    'grade-9': {
      title: '9 ශ්‍රේණිය',
      color: '#3498db',
      gradient: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)'
    },
    'grade-10': {
      title: '10 ශ්‍රේණිය',
      color: '#e74c3c',
      gradient: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)'
    },
    'grade-11': {
      title: '11 ශ්‍රේණිය',
      color: '#f39c12',
      gradient: 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)'
    },
    'a-level': {
      title: 'A/L',
      color: '#9b59b6',
      gradient: 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)'
    },
    'sinhala-literature': {
      title: 'සිංහල සාහිත්‍යය (කාණ්ඩ විෂය)',
      color: '#1abc9c',
      gradient: 'linear-gradient(135deg, #1abc9c 0%, #16a085 100%)'
    }
  };

  const currentConfig = gradeConfigs[gradeCategory] || gradeConfigs['grade-9'];

  const fetchFolderAndFiles = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');

      // Fetch folder details
      const folderResponse = await axios.get(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/grades/folders/single/${folderId}`,
        { headers: { 'x-auth-token': token } }
      );

      if (folderResponse.data.success) {
        setFolder(folderResponse.data.data);
      }

      // Fetch files in folder
      const filesResponse = await axios.get(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/grades/folders/${folderId}/files`,
        { headers: { 'x-auth-token': token } }
      );

      if (filesResponse.data.success) {
        setFiles(filesResponse.data.data); // Backend returns files sorted oldest first
      }
    } catch (err) {
      console.error('Error fetching folder and files:', err);
      setError('Error loading folder contents');
    } finally {
      setLoading(false);
    }
  }, [folderId]);

  const checkAuthentication = useCallback(async () => {
    const userEmail = localStorage.getItem('userEmail');
    const token = localStorage.getItem('token');

    if (!userEmail || !token) {
      navigate('/login');
      return;
    }

    try {
      // Check user role from database
      const response = await axios.get('https://ayanna-kiyanna-new-backend.onrender.com/api/auth/me', {
        headers: { 'x-auth-token': token }
      });

      setUserRole(response.data.role);
      fetchFolderAndFiles();
    } catch (err) {
      console.error('Authentication error:', err);
      navigate('/login');
    }
  }, [navigate, fetchFolderAndFiles]);

  useEffect(() => {
    // Reset loading state when folder ID changes
    setLoading(true);
    setError('');
    setFolder(null);
    setFiles([]);
    checkAuthentication();
  }, [folderId, checkAuthentication]);

  const handleDeleteFile = async (fileId) => {
    if (!window.confirm('ඔබට මෙම ගොනුව මකා දැමීමට අවශ්‍යද?')) {
      return;
    }

    setDeletingId(fileId);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/grades/files/${fileId}`,
        { headers: { 'x-auth-token': token } }
      );

      setFiles(files.filter(file => file._id !== fileId));
    } catch (err) {
      console.error('Error deleting file:', err);
      setError('Error deleting file');
    } finally {
      setDeletingId(null);
    }
  };

  const openEditDialog = (file) => {
    setEditingFile(file);
    setShowEditDialog(true);
  };

  const openDetailsDialog = (file) => {
    setSelectedFile(file);
    setShowDetailsDialog(true);
  };

  const handleFileCreated = (newFile) => {
    setFiles([...files, newFile]); // Add new file to the end
    setShowCreateDialog(false);
  };

  const handleFileUpdated = (updatedFile) => {
    setFiles(files.map(file => 
      file._id === updatedFile._id ? updatedFile : file
    ));
    setShowEditDialog(false);
    setEditingFile(null);
  };

  const getFileIcon = (attachments) => {
    if (!attachments || attachments.length === 0) {
      return <FileIcon />;
    }
    
    const hasImage = attachments.some(att => att.type === 'image');
    const hasPdf = attachments.some(att => att.type === 'pdf');
    
    if (hasImage && hasPdf) {
      return <AttachmentIcon />;
    } else if (hasImage) {
      return <ImageIcon />;
    } else if (hasPdf) {
      return <PdfIcon />;
    }
    
    return <FileIcon />;
  };

  if (loading) {
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

  if (!folder) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="error">
          ෆෝල්ඩරය සොයා ගත නොහැක
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link
          component="button"
          variant="body1"
          onClick={() => navigate(`/grade/${gradeCategory}`)}
          sx={{
            fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
            textDecoration: 'none',
            color: currentConfig.color,
            '&:hover': {
              textDecoration: 'underline'
            }
          }}
        >
          {currentConfig.title}
        </Link>
        <Typography
          color="text.primary"
          sx={{
            fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
          }}
        >
          {folder.title}
        </Typography>
      </Breadcrumbs>

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
            borderRadius: 3
          }}
        >
          <Box display="flex" alignItems="center" mb={2}>
            <IconButton
              onClick={() => navigate(`/grade/${gradeCategory}`)}
              sx={{ color: 'white', mr: 2 }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                fontWeight: 'bold',
                fontSize: { xs: '1.5rem', md: '2.5rem' }
              }}
            >
              {folder.title}
            </Typography>
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
              opacity: 0.9,
              lineHeight: 1.6
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
                ගොනු පූරණය වෙමින්...
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
                        {getFileIcon(file.attachments)}
                      </Avatar>
                      <Typography
                        variant="h6"
                        component="h3"
                        sx={{
                          fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                          fontWeight: 'bold',
                          color: '#2C3E50',
                          fontSize: '1rem'
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
                        lineHeight: 1.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {file.description}
                    </Typography>

                    {file.attachments && file.attachments.length > 0 && (
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <AttachmentIcon fontSize="small" color="action" />
                        <Typography variant="caption" color="text.secondary">
                          {file.attachments.length} ගොනු
                        </Typography>
                      </Box>
                    )}

                    {file.sourceLinks && file.sourceLinks.length > 0 && (
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <LinkIcon fontSize="small" color="action" />
                        <Typography variant="caption" color="text.secondary">
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
                      onClick={() => openDetailsDialog(file)}
                      startIcon={<ViewIcon />}
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
                      බලන්න
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
                          disabled={deletingId === file._id}
                          sx={{ color: '#F44336' }}
                        >
                          {deletingId === file._id ? (
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
              background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
              borderRadius: 3
            }}
          >
            <FileIcon sx={{ fontSize: 80, color: currentConfig.color, mb: 2 }} />
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
              මෙම ෆෝල්ඩරයේ ගොනු නිර්මාණය කිරීමට පරිපාලකයින්ට පමණක් හැකිය
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

      {/* Dialogs */}
      {showCreateDialog && (
        <CreateGradeFileDialog
          open={showCreateDialog}
          onClose={() => setShowCreateDialog(false)}
          folderId={folderId}
          gradeCategory={gradeCategory}
          onFileCreated={handleFileCreated}
        />
      )}

      {showEditDialog && editingFile && (
        <EditGradeFileDialog
          open={showEditDialog}
          onClose={() => setShowEditDialog(false)}
          file={editingFile}
          gradeCategory={gradeCategory}
          onFileUpdated={handleFileUpdated}
        />
      )}

      {showDetailsDialog && selectedFile && (
        <GradeFileDetailsDialog
          open={showDetailsDialog}
          onClose={() => setShowDetailsDialog(false)}
          file={selectedFile}
          gradeCategory={gradeCategory}
        />
      )}
    </Container>
  );
};

export default GradeFolderView;
