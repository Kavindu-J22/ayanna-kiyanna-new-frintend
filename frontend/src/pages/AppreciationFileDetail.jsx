import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Button,
  Alert,
  CircularProgress,
  Chip,
  Avatar,
  IconButton,
  Breadcrumbs,
  Link,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Paper,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Snackbar
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Home as HomeIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Comment as CommentIcon,
  Send as SendIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Reply as ReplyIcon,
  CloudDownload as CloudDownloadIcon,
  Link as LinkIcon,
  PictureAsPdf as PictureAsPdfIcon,
  Image as ImageIcon,
  Share as ShareIcon,
  ContentCopy as ContentCopyIcon,
  WhatsApp as WhatsAppIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const AppreciationFileDetail = () => {
  const navigate = useNavigate();
  const { fileId } = useParams();
  const [file, setFile] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userRole, setUserRole] = useState('');
  const [currentUserId, setCurrentUserId] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Comment states
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState('');

  // Dialog states
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);

  // Check authentication and get user info
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
        setCurrentUserId(response.data._id);
        setIsAuthenticated(true);
        fetchFileDetails();
      } catch (error) {
        console.error('Error checking authentication:', error);
        setError('සත්‍යාපනය අසාර්ථක විය');
        setLoading(false);
      }
    };

    checkAuth();
  }, [fileId]);

  const fetchFileDetails = async () => {
    try {
      const token = localStorage.getItem('token');

      // Fetch file details
      const fileResponse = await axios.get(`https://ayanna-kiyanna-new-backend.onrender.com/api/appreciation/files/${fileId}`, {
        headers: { 'x-auth-token': token }
      });
      setFile(fileResponse.data.data);

      // Fetch comments
      const commentsResponse = await axios.get(`https://ayanna-kiyanna-new-backend.onrender.com/api/appreciation/files/${fileId}/comments`, {
        headers: { 'x-auth-token': token }
      });
      setComments(commentsResponse.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching file details:', error);
      setError('ගොනු විස්තර ලබා ගැනීමේදී දෝෂයක් ඇති විය');
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`https://ayanna-kiyanna-new-backend.onrender.com/api/appreciation/files/${fileId}/like`, {}, {
        headers: { 'x-auth-token': token }
      });
      
      // Update file likes
      setFile(prev => ({
        ...prev,
        likes: response.data.data.likes
      }));
    } catch (error) {
      console.error('Error toggling like:', error);
      setError('ලයික් කිරීමේදී දෝෂයක් ඇති විය');
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const token = localStorage.getItem('token');
      await axios.post(`https://ayanna-kiyanna-new-backend.onrender.com/api/appreciation/files/${fileId}/comments`, {
        content: newComment
      }, {
        headers: { 'x-auth-token': token }
      });
      
      setNewComment('');
      setSuccess('අදහස සාර්ථකව එක් කරන ලදී');
      fetchFileDetails();
    } catch (error) {
      console.error('Error adding comment:', error);
      setError('අදහස එක් කිරීමේදී දෝෂයක් ඇති විය');
    }
  };

  const handleReply = async (parentCommentId) => {
    if (!replyText.trim()) return;

    try {
      const token = localStorage.getItem('token');
      await axios.post(`https://ayanna-kiyanna-new-backend.onrender.com/api/appreciation/files/${fileId}/comments`, {
        content: replyText,
        parentComment: parentCommentId
      }, {
        headers: { 'x-auth-token': token }
      });
      
      setReplyText('');
      setReplyingTo(null);
      setSuccess('පිළිතුර සාර්ථකව එක් කරන ලදී');
      fetchFileDetails();
    } catch (error) {
      console.error('Error adding reply:', error);
      setError('පිළිතුර එක් කිරීමේදී දෝෂයක් ඇති විය');
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editText.trim()) return;

    try {
      const token = localStorage.getItem('token');
      await axios.put(`https://ayanna-kiyanna-new-backend.onrender.com/api/appreciation/comments/${commentId}`, {
        content: editText
      }, {
        headers: { 'x-auth-token': token }
      });
      
      setEditText('');
      setEditingComment(null);
      setSuccess('අදහස සාර්ථකව යාවත්කාලීන කරන ලදී');
      fetchFileDetails();
    } catch (error) {
      console.error('Error editing comment:', error);
      setError('අදහස සංස්කරණය කිරීමේදී දෝෂයක් ඇති විය');
    }
  };

  const handleDeleteComment = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://ayanna-kiyanna-new-backend.onrender.com/api/appreciation/comments/${commentToDelete}`, {
        headers: { 'x-auth-token': token }
      });
      
      setOpenDeleteDialog(false);
      setCommentToDelete(null);
      setSuccess('අදහස සාර්ථකව ඉවත් කරන ලදී');
      fetchFileDetails();
    } catch (error) {
      console.error('Error deleting comment:', error);
      setError('අදහස ඉවත් කිරීමේදී දෝෂයක් ඇති විය');
    }
  };

  const isLiked = file?.likes?.some(like => like.user._id === currentUserId);

  // Share states
  const [shareAnchorEl, setShareAnchorEl] = useState(null);
  const [shareSuccess, setShareSuccess] = useState(false);

  const handleNavigateToLogin = () => {
    navigate('/login');
  };

  // Share functions
  const handleShareClick = (event) => {
    setShareAnchorEl(event.currentTarget);
  };

  const handleShareClose = () => {
    setShareAnchorEl(null);
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 3000);
      handleShareClose();
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const shareToSocialMedia = (platform) => {
    const url = window.location.href;
    const title = file?.title || 'රසවින්දන';
    const text = `${title} - ${file?.description || ''}`;

    let shareUrl = '';

    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
    handleShareClose();
  };

  if (!isAuthenticated && error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box textAlign="center" sx={{ py: 8 }}>
          <Typography variant="h4" gutterBottom sx={{ color: '#9c27b0', fontWeight: 'bold' }}>
            රසවින්දන
          </Typography>
          <Alert severity="warning" sx={{ mb: 3, fontSize: '1.1rem' }}>
            {error}
          </Alert>
          <Button
            variant="contained"
            onClick={handleNavigateToLogin}
            sx={{
              background: 'linear-gradient(45deg, #9c27b0, #e91e63)',
              color: 'white',
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              borderRadius: 3,
              '&:hover': {
                background: 'linear-gradient(45deg, #7b1fa2, #c2185b)',
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
        <CircularProgress size={60} sx={{ color: '#9c27b0' }} />
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
          sx={{ display: 'flex', alignItems: 'center', color: '#9c27b0' }}
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          මුල් පිටුව
        </Link>
        <Link
          component="button"
          variant="body1"
          onClick={() => navigate('/appreciation')}
          sx={{ color: '#9c27b0' }}
        >
          රසවින්දන
        </Link>
        <Link
          component="button"
          variant="body1"
          onClick={() => navigate(`/appreciation/folder/${file?.folderId._id}`)}
          sx={{ color: '#9c27b0' }}
        >
          {file?.folderId.title}
        </Link>
        <Typography color="text.primary">{file?.title}</Typography>
      </Breadcrumbs>

      {/* Back Button */}
      <Box sx={{ mb: 3 }}>
        <IconButton 
          onClick={() => navigate(`/appreciation/folder/${file?.folderId._id}`)}
          sx={{ mr: 2, color: '#9c27b0' }}
        >
          <ArrowBackIcon />
        </IconButton>
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

      {/* File Content */}
      <Card sx={{ mb: 4, borderRadius: 3, boxShadow: '0 8px 32px rgba(156, 39, 176, 0.1)' }}>
        <CardContent sx={{ p: 4 }}>
          {/* File Header */}
          <Box display="flex" alignItems="center" mb={3}>
            <Avatar sx={{ bgcolor: '#9c27b0', mr: 2, width: 56, height: 56 }}>
              <CommentIcon />
            </Avatar>
            <Box flexGrow={1}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333', mb: 1 }}>
                {file?.title}
              </Typography>
              <Box display="flex" alignItems="center" gap={2}>
                <Chip
                  label={`නිර්මාණය: ${new Date(file?.createdAt).toLocaleDateString('si-LK')}`}
                  size="small"
                  sx={{ bgcolor: '#f3e5f5', color: '#7b1fa2' }}
                />
                <Chip
                  label={`${file?.attachments?.length || 0} ගොනු`}
                  size="small"
                  sx={{ bgcolor: '#e3f2fd', color: '#1976d2' }}
                />
                <Chip
                  label={`${file?.sourceLinks?.length || 0} සබැඳි`}
                  size="small"
                  sx={{ bgcolor: '#fff3e0', color: '#f57c00' }}
                />
              </Box>
            </Box>
          </Box>

          {/* File Description */}
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: '#555' }}>
            {file?.description}
          </Typography>

          {/* File Content */}
          {file?.content && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, color: '#9c27b0', fontWeight: 'bold' }}>
                අන්තර්ගතය
              </Typography>
              <Paper sx={{ p: 3, bgcolor: '#fafafa', borderRadius: 2 }}>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
                  {file?.content}
                </Typography>
              </Paper>
            </Box>
          )}

          {/* Attachments */}
          {file?.attachments && file.attachments.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, color: '#9c27b0', fontWeight: 'bold' }}>
                ගොනු ({file.attachments.length})
              </Typography>
              <Grid container spacing={2}>
                {file.attachments.map((attachment, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card sx={{ 
                      border: '2px solid #9c27b0', 
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 16px rgba(156, 39, 176, 0.2)' }
                    }}>
                      <CardContent sx={{ p: 2 }}>
                        <Box display="flex" alignItems="center" mb={2}>
                          {attachment.type === 'pdf' ? (
                            <PictureAsPdfIcon sx={{ color: '#f44336', mr: 1 }} />
                          ) : (
                            <ImageIcon sx={{ color: '#4caf50', mr: 1 }} />
                          )}
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                            {attachment.title}
                          </Typography>
                        </Box>
                        
                        {attachment.type === 'image' && (
                          <Box sx={{ mb: 2 }}>
                            <img 
                              src={attachment.url} 
                              alt={attachment.title}
                              style={{ 
                                width: '100%', 
                                height: '150px', 
                                objectFit: 'cover', 
                                borderRadius: '8px' 
                              }}
                            />
                          </Box>
                        )}
                        
                        {attachment.description && (
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {attachment.description}
                          </Typography>
                        )}
                        
                        <Button
                          fullWidth
                          variant="contained"
                          startIcon={<CloudDownloadIcon />}
                          onClick={() => window.open(attachment.url, '_blank')}
                          sx={{
                            background: 'linear-gradient(45deg, #9c27b0, #e91e63)',
                            '&:hover': { background: 'linear-gradient(45deg, #7b1fa2, #c2185b)' }
                          }}
                        >
                          {attachment.type === 'pdf' ? 'PDF බලන්න' : 'පින්තූරය බලන්න'}
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* Source Links */}
          {file?.sourceLinks && file.sourceLinks.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, color: '#9c27b0', fontWeight: 'bold' }}>
                මූලාශ්‍ර සබැඳි ({file.sourceLinks.length})
              </Typography>
              <Grid container spacing={2}>
                {file.sourceLinks.map((link, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Card sx={{ 
                      border: '1px solid #9c27b0', 
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': { borderColor: '#7b1fa2', boxShadow: '0 4px 8px rgba(156, 39, 176, 0.2)' }
                    }}>
                      <CardContent sx={{ p: 2 }}>
                        <Box display="flex" alignItems="center" mb={1}>
                          <LinkIcon sx={{ color: '#9c27b0', mr: 1 }} />
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                            {link.title}
                          </Typography>
                        </Box>
                        
                        {link.description && (
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {link.description}
                          </Typography>
                        )}
                        
                        <Button
                          fullWidth
                          variant="outlined"
                          startIcon={<LinkIcon />}
                          onClick={() => window.open(link.url, '_blank')}
                          sx={{
                            borderColor: '#9c27b0',
                            color: '#9c27b0',
                            '&:hover': { borderColor: '#7b1fa2', bgcolor: '#f3e5f5' }
                          }}
                        >
                          සබැඳිය බලන්න
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          <Divider sx={{ my: 3 }} />

          {/* Like and Comment Section */}
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
            <Box display="flex" alignItems="center" gap={2}>
              <Button
                startIcon={isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                onClick={handleLike}
                sx={{
                  color: isLiked ? '#9c27b0' : '#666',
                  fontWeight: 'bold',
                  '&:hover': { bgcolor: '#f3e5f5' }
                }}
              >
                {file?.likes?.length || 0} ලයික්
              </Button>
              <Button
                startIcon={<CommentIcon />}
                sx={{ color: '#666', fontWeight: 'bold' }}
              >
                {comments.length} අදහස්
              </Button>
              <Button
                startIcon={<ShareIcon />}
                onClick={handleShareClick}
                sx={{
                  color: '#666',
                  fontWeight: 'bold',
                  '&:hover': { bgcolor: '#f3e5f5' }
                }}
              >
                බෙදා ගන්න
              </Button>
            </Box>
          </Box>

          {/* Add Comment */}
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="ඔබේ අදහස ලියන්න..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              startIcon={<SendIcon />}
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              sx={{
                background: 'linear-gradient(45deg, #9c27b0, #e91e63)',
                '&:hover': { background: 'linear-gradient(45deg, #7b1fa2, #c2185b)' }
              }}
            >
              අදහස එක් කරන්න
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Comments Section - Similar to Reviews but with purple theme */}
      <Card sx={{ borderRadius: 3, boxShadow: '0 8px 32px rgba(156, 39, 176, 0.1)' }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" sx={{ mb: 3, color: '#9c27b0', fontWeight: 'bold' }}>
            අදහස් ({comments.length})
          </Typography>

          {comments.length === 0 ? (
            <Box textAlign="center" sx={{ py: 4 }}>
              <CommentIcon sx={{ fontSize: 60, color: '#ccc', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                තවම අදහස් නොමැත
              </Typography>
              <Typography variant="body2" color="text.secondary">
                පළමු අදහස ලියන්න!
              </Typography>
            </Box>
          ) : (
            <Box>
              {comments.map((comment) => (
                <Box key={comment._id} sx={{ mb: 3, p: 2, bgcolor: '#fafafa', borderRadius: 2 }}>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Box display="flex" alignItems="center">
                      <Avatar sx={{ bgcolor: '#9c27b0', mr: 2 }}>
                        {comment.user.fullName.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          {comment.user.fullName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(comment.createdAt).toLocaleString('si-LK')}
                          {comment.isEdited && ' (සංස්කරණය කර ඇත)'}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box>
                      {comment.user._id === currentUserId && (
                        <>
                          <IconButton
                            size="small"
                            onClick={() => {
                              setEditingComment(comment._id);
                              setEditText(comment.content);
                            }}
                            sx={{ color: '#ff9800' }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => {
                              setCommentToDelete(comment._id);
                              setOpenDeleteDialog(true);
                            }}
                            sx={{ color: '#f44336' }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </>
                      )}
                      {(userRole === 'admin' || userRole === 'moderator') && (
                        <>
                          <IconButton
                            size="small"
                            onClick={() => setReplyingTo(comment._id)}
                            sx={{ color: '#9c27b0' }}
                          >
                            <ReplyIcon fontSize="small" />
                          </IconButton>
                          {comment.user._id !== currentUserId && (
                            <IconButton
                              size="small"
                              onClick={() => {
                                setCommentToDelete(comment._id);
                                setOpenDeleteDialog(true);
                              }}
                              sx={{ color: '#f44336' }}
                              title="Admin: Delete Comment"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          )}
                        </>
                      )}
                    </Box>
                  </Box>

                  {editingComment === comment._id ? (
                    <Box>
                      <TextField
                        fullWidth
                        multiline
                        rows={2}
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        sx={{ mb: 2 }}
                      />
                      <Box display="flex" gap={1}>
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => handleEditComment(comment._id)}
                          sx={{ bgcolor: '#ff9800' }}
                        >
                          යාවත්කාලීන කරන්න
                        </Button>
                        <Button
                          size="small"
                          onClick={() => {
                            setEditingComment(null);
                            setEditText('');
                          }}
                        >
                          අවලංගු කරන්න
                        </Button>
                      </Box>
                    </Box>
                  ) : (
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {comment.content}
                    </Typography>
                  )}

                  {/* Reply Section */}
                  {replyingTo === comment._id && (
                    <Box sx={{ mt: 2, p: 2, bgcolor: '#fff', borderRadius: 1 }}>
                      <TextField
                        fullWidth
                        multiline
                        rows={2}
                        placeholder="පිළිතුරක් ලියන්න..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        sx={{ mb: 2 }}
                      />
                      <Box display="flex" gap={1}>
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => handleReply(comment._id)}
                          disabled={!replyText.trim()}
                          sx={{ bgcolor: '#9c27b0' }}
                        >
                          පිළිතුර එක් කරන්න
                        </Button>
                        <Button
                          size="small"
                          onClick={() => {
                            setReplyingTo(null);
                            setReplyText('');
                          }}
                        >
                          අවලංගු කරන්න
                        </Button>
                      </Box>
                    </Box>
                  )}

                  {/* Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <Box sx={{ ml: 4, mt: 2 }}>
                      {comment.replies.map((reply) => (
                        <Box key={reply._id} sx={{ mb: 2, p: 2, bgcolor: '#fff', borderRadius: 1, border: '1px solid #e0e0e0' }}>
                          <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                            <Box display="flex" alignItems="center">
                              <Avatar sx={{ bgcolor: '#ff9800', mr: 2, width: 32, height: 32 }}>
                                {reply.user.fullName.charAt(0)}
                              </Avatar>
                              <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
                                  {reply.user.fullName} (Admin)
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {new Date(reply.createdAt).toLocaleString('si-LK')}
                                  {reply.isEdited && <span> (සංස්කරණය කර ඇත)</span>}
                                </Typography>
                              </Box>
                            </Box>

                            {/* Admin can edit/delete their own replies */}
                            {reply.user._id === currentUserId && (userRole === 'admin' || userRole === 'moderator') && (
                              <Box>
                                <IconButton
                                  size="small"
                                  onClick={() => {
                                    setEditingComment(reply._id);
                                    setEditText(reply.content);
                                  }}
                                  sx={{ color: '#ff9800' }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() => {
                                    setCommentToDelete(reply._id);
                                    setOpenDeleteDialog(true);
                                  }}
                                  sx={{ color: '#f44336' }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            )}
                          </Box>

                          {editingComment === reply._id ? (
                            <Box sx={{ ml: 5 }}>
                              <TextField
                                fullWidth
                                multiline
                                rows={2}
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                sx={{ mb: 2 }}
                              />
                              <Box display="flex" gap={1}>
                                <Button
                                  size="small"
                                  variant="contained"
                                  onClick={() => handleEditComment(reply._id)}
                                  sx={{ bgcolor: '#ff9800' }}
                                >
                                  යාවත්කාලීන කරන්න
                                </Button>
                                <Button
                                  size="small"
                                  onClick={() => {
                                    setEditingComment(null);
                                    setEditText('');
                                  }}
                                >
                                  අවලංගු කරන්න
                                </Button>
                              </Box>
                            </Box>
                          ) : (
                            <Typography variant="body2" sx={{ ml: 5 }}>
                              {reply.content}
                            </Typography>
                          )}
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Delete Comment Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle sx={{ color: '#f44336', fontWeight: 'bold' }}>
          අදහස ඉවත් කරන්න
        </DialogTitle>
        <DialogContent>
          <Typography>
            ඔබට මෙම අදහස ඉවත් කිරීමට අවශ්‍යද? මෙම ක්‍රියාව ආපසු හැරවිය නොහැක.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenDeleteDialog(false)}>
            අවලංගු කරන්න
          </Button>
          <Button 
            onClick={handleDeleteComment}
            variant="contained"
            color="error"
          >
            ඉවත් කරන්න
          </Button>
        </DialogActions>
      </Dialog>

      {/* Share Menu */}
      <Menu
        anchorEl={shareAnchorEl}
        open={Boolean(shareAnchorEl)}
        onClose={handleShareClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            minWidth: 200
          }
        }}
      >
        <MenuItem onClick={() => copyToClipboard(window.location.href)}>
          <ListItemIcon>
            <ContentCopyIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="සබැඳිය පිටපත් කරන්න" />
        </MenuItem>
        <MenuItem onClick={() => shareToSocialMedia('whatsapp')}>
          <ListItemIcon>
            <WhatsAppIcon fontSize="small" sx={{ color: '#25D366' }} />
          </ListItemIcon>
          <ListItemText primary="WhatsApp" />
        </MenuItem>
        <MenuItem onClick={() => shareToSocialMedia('facebook')}>
          <ListItemIcon>
            <FacebookIcon fontSize="small" sx={{ color: '#1877F2' }} />
          </ListItemIcon>
          <ListItemText primary="Facebook" />
        </MenuItem>
        <MenuItem onClick={() => shareToSocialMedia('twitter')}>
          <ListItemIcon>
            <TwitterIcon fontSize="small" sx={{ color: '#1DA1F2' }} />
          </ListItemIcon>
          <ListItemText primary="Twitter" />
        </MenuItem>
      </Menu>

      {/* Share Success Snackbar */}
      <Snackbar
        open={shareSuccess}
        autoHideDuration={3000}
        onClose={() => setShareSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          සබැඳිය පිටපත් කරන ලදී!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AppreciationFileDetail;
