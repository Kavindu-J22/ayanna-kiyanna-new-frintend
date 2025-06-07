import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  CardMedia,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Divider,
  Avatar
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  QuestionAnswer as QuestionAnswerIcon,
  Send as SendIcon,
  NotificationsActive as NotificationsActiveIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Reply as ReplyIcon,
  Link as LinkIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SpecialNoticePage = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showQuestionDialog, setShowQuestionDialog] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [expandedNotice, setExpandedNotice] = useState(null);
  
  const [questionData, setQuestionData] = useState({
    question: ''
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
      setCurrentUser(response.data);
      setIsAuthenticated(true);
      fetchNotices();
    } catch (err) {
      console.error('Authentication error:', err);
      setShowLoginDialog(true);
      setLoading(false);
    }
  };

  const fetchNotices = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://ayanna-kiyanna-new-backend.onrender.com/api/special-notices', {
        headers: { 'x-auth-token': token }
      });

      if (response.data.success) {
        setNotices(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching notices:', err);
      setError('Error loading notices');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    setShowLoginDialog(false);
    navigate('/login');
  };

  const openQuestionDialog = (notice) => {
    setSelectedNotice(notice);
    setShowQuestionDialog(true);
  };

  const handleSubmitQuestion = async () => {
    if (!questionData.question.trim()) {
      setError('කරුණාකර ප්‍රශ්නය ඇතුළත් කරන්න');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/special-notices/${selectedNotice._id}/questions`,
        { question: questionData.question },
        { headers: { 'x-auth-token': token } }
      );

      if (response.data.success) {
        // Update the notice with the new question
        const updatedNotices = notices.map(notice => 
          notice._id === selectedNotice._id 
            ? { ...notice, questions: [...(notice.questions || []), response.data.data] }
            : notice
        );
        setNotices(updatedNotices);
        
        setShowQuestionDialog(false);
        setQuestionData({ question: '' });
        setError('');
      }
    } catch (err) {
      console.error('Error submitting question:', err);
      setError('ප්‍රශ්නය යැවීමේදී දෝෂයක් ඇතිවිය');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteQuestion = async (noticeId, questionId) => {
    if (!window.confirm('ඔබට මෙම ප්‍රශ්නය මකා දැමීමට අවශ්‍යද?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/special-notices/${noticeId}/questions/${questionId}`,
        { headers: { 'x-auth-token': token } }
      );

      // Update the notices state
      const updatedNotices = notices.map(notice => 
        notice._id === noticeId 
          ? { ...notice, questions: notice.questions.filter(q => q._id !== questionId) }
          : notice
      );
      setNotices(updatedNotices);
    } catch (err) {
      console.error('Error deleting question:', err);
      setError('ප්‍රශ්නය මකා දැමීමේදී දෝෂයක් ඇතිවිය');
    }
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
          අයන්න කියන්න - Special Notices
        </Typography>
        
        <Typography variant="h6" color="text.secondary" sx={{
          fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
          maxWidth: '800px',
          mx: 'auto',
          lineHeight: 1.6
        }}>
          අයන්න කියන්න ආයතනයේ විශේෂ නිවේදන සහ ප්‍රකාශන. 
          ඔබට ප්‍රශ්න ඇත්නම් කරුණාකර අදාළ නිවේදනය යටතේ ප්‍රශ්න කරන්න.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Notices */}
      <Box sx={{ mb: 4 }}>
        <AnimatePresence>
          {notices.map((notice, index) => (
            <motion.div
              key={notice._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card sx={{
                mb: 3,
                borderRadius: 3,
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 30px rgba(233, 30, 99, 0.15)'
                }
              }}>
                {notice.attachment && (
                  <CardMedia
                    component="img"
                    height="300"
                    image={notice.attachment.url}
                    alt={notice.title}
                    sx={{ objectFit: 'cover' }}
                  />
                )}
                
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h5" component="h2" sx={{
                    fontWeight: 'bold',
                    mb: 2,
                    fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                    color: '#2E2E2E'
                  }}>
                    {notice.title}
                  </Typography>
                  
                  <Typography variant="body1" sx={{
                    mb: 3,
                    fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
                    lineHeight: 1.6,
                    color: '#555'
                  }}>
                    {notice.content}
                  </Typography>

                  {notice.sourceLinks && notice.sourceLinks.length > 0 && (
                    <Box sx={{ mb: 3 }}>
                      {notice.sourceLinks.map((link, linkIndex) => (
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

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Chip
                      icon={<NotificationsActiveIcon />}
                      label={`${new Date(notice.createdAt).toLocaleDateString('si-LK')}`}
                      size="small"
                      sx={{
                        bgcolor: '#E3F2FD',
                        color: '#1976D2'
                      }}
                    />
                    
                    <Button
                      variant="outlined"
                      startIcon={<QuestionAnswerIcon />}
                      onClick={() => openQuestionDialog(notice)}
                      sx={{
                        borderColor: '#E91E63',
                        color: '#E91E63',
                        '&:hover': {
                          borderColor: '#C2185B',
                          bgcolor: '#FCE4EC'
                        }
                      }}
                    >
                      ප්‍රශ්නයක් අසන්න
                    </Button>
                  </Box>

                  {/* Questions Section */}
                  {notice.questions && notice.questions.length > 0 && (
                    <Accordion 
                      expanded={expandedNotice === notice._id}
                      onChange={() => setExpandedNotice(expandedNotice === notice._id ? null : notice._id)}
                      sx={{ mt: 2 }}
                    >
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography sx={{
                          fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
                          fontWeight: 'medium'
                        }}>
                          ප්‍රශ්න සහ පිළිතුරු ({notice.questions.length})
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        {notice.questions.map((question, qIndex) => (
                          <Box key={question._id} sx={{ mb: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                              <Avatar sx={{ bgcolor: '#E91E63', width: 32, height: 32 }}>
                                {question.askedBy?.fullName?.charAt(0) || 'U'}
                              </Avatar>
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="body2" sx={{
                                  fontWeight: 'medium',
                                  mb: 0.5,
                                  fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
                                }}>
                                  {question.askedBy?.fullName || 'Unknown User'}
                                </Typography>
                                <Typography variant="body1" sx={{
                                  mb: 1,
                                  fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
                                }}>
                                  {question.question}
                                </Typography>
                                
                                {question.reply && (
                                  <Box sx={{ mt: 2, p: 2, bgcolor: '#E8F5E8', borderRadius: 1, borderLeft: '4px solid #4CAF50' }}>
                                    <Typography variant="body2" sx={{
                                      fontWeight: 'medium',
                                      mb: 0.5,
                                      color: '#2E7D32',
                                      fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
                                    }}>
                                      Admin Reply:
                                    </Typography>
                                    <Typography variant="body1" sx={{
                                      fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
                                    }}>
                                      {question.reply}
                                    </Typography>
                                  </Box>
                                )}

                                {/* Question Actions */}
                                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                  {(currentUser?._id === question.askedBy?._id && !question.reply) && (
                                    <IconButton
                                      size="small"
                                      onClick={() => handleDeleteQuestion(notice._id, question._id)}
                                      sx={{ color: '#F44336' }}
                                    >
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  )}
                                </Box>
                              </Box>
                            </Box>
                          </Box>
                        ))}
                      </AccordionDetails>
                    </Accordion>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </Box>

      {notices.length === 0 && !loading && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <NotificationsActiveIcon sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" sx={{
            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
          }}>
            තවම විශේෂ නිවේදන නැත
          </Typography>
          <Typography variant="body2" color="text.secondary">
            නව නිවේදන සඳහා නිතර පරීක්ෂා කරන්න
          </Typography>
        </Box>
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
            Special Notices බැලීමට කරුණාකර පළමුව ලොගින් වන්න හෝ ගිණුමක් සාදන්න.
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

      {/* Question Dialog */}
      <Dialog 
        open={showQuestionDialog} 
        onClose={() => setShowQuestionDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{
          fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #E91E63 30%, #FF9800 90%)',
          color: 'white'
        }}>
          ප්‍රශ්නයක් අසන්න
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography variant="body2" sx={{
            mb: 2,
            fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
            color: '#666'
          }}>
            "{selectedNotice?.title}" නිවේදනය සම්බන්ධයෙන්
          </Typography>
          
          <TextField
            fullWidth
            label="ඔබගේ ප්‍රශ්නය *"
            multiline
            rows={4}
            value={questionData.question}
            onChange={(e) => setQuestionData({ question: e.target.value })}
            placeholder="කරුණාකර ඔබගේ ප්‍රශ්නය මෙහි ටයිප් කරන්න..."
            InputLabelProps={{
              style: { fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif' }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setShowQuestionDialog(false)}>
            අවලංගු කරන්න
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmitQuestion}
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={20} /> : <SendIcon />}
            sx={{
              bgcolor: '#E91E63',
              '&:hover': { bgcolor: '#C2185B' }
            }}
          >
            ප්‍රශ්නය යවන්න
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SpecialNoticePage;
