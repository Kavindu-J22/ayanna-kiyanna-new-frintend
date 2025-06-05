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
  Alert,
  CircularProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  ArrowBack,
  Assignment,
  Link as LinkIcon,
  Grade,
  CalendarToday,
  AccessTime,
  OpenInNew,
  School
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';

const StudentExamView = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // State management
  const [exams, setExams] = useState([]);
  const [classData, setClassData] = useState(null);
  const [myMarks, setMyMarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchClassData();
    fetchExams();
    fetchMyMarks();
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

  const fetchExams = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/exams/class/${classId}?published=true`,
        { headers: { 'x-auth-token': token } }
      );
      setExams(response.data.exams);
    } catch (err) {
      console.error('Error fetching exams:', err);
      setError('Failed to load exams');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyMarks = async () => {
    try {
      const token = localStorage.getItem('token');
      const markPromises = exams.map(exam => 
        axios.get(
          `https://ayanna-kiyanna-new-backend.onrender.com/api/exams/${exam._id}/marks`,
          { headers: { 'x-auth-token': token } }
        ).catch(() => ({ data: { marks: [] } }))
      );
      
      const markResponses = await Promise.all(markPromises);
      const allMarks = markResponses.flatMap(response => response.data.marks);
      setMyMarks(allMarks);
    } catch (err) {
      console.error('Error fetching marks:', err);
    }
  };

  useEffect(() => {
    if (exams.length > 0) {
      fetchMyMarks();
    }
  }, [exams]);

  const getMarkForExam = (examId) => {
    return myMarks.find(mark => mark.examId === examId);
  };

  const handleStartExam = (examLink) => {
    window.open(examLink, '_blank');
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
              විභාග සහ ප්‍රතිඵල
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

        {/* Exams Grid */}
        <Grid container spacing={3}>
          {exams.map((exam) => {
            const myMark = getMarkForExam(exam._id);
            
            return (
              <Grid item xs={12} sm={6} md={4} key={exam._id}>
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
                        {exam.title}
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {exam.description}
                      </Typography>

                      {(exam.examDate || exam.examTime) && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                          {exam.examDate && (
                            <>
                              <CalendarToday fontSize="small" color="primary" />
                              <Typography variant="body2" color="primary" sx={{ mr: 2 }}>
                                දිනය: {new Date(exam.examDate).toLocaleDateString('si-LK')}
                              </Typography>
                            </>
                          )}
                          {exam.examTime && (
                            <>
                              <AccessTime fontSize="small" color="secondary" />
                              <Typography variant="body2" color="secondary">
                                වේලාව: {exam.examTime}
                              </Typography>
                            </>
                          )}
                        </Box>
                      )}

                      {exam.guidelines && exam.guidelines.length > 0 && (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                            Guidelines:
                          </Typography>
                          <List dense>
                            {exam.guidelines.map((guideline, index) => (
                              <ListItem key={index} sx={{ py: 0.5, px: 0 }}>
                                <ListItemText
                                  primary={`${guideline.guidelineNumber}. ${guideline.guidelineText}`}
                                  slotProps={{
                                    primary: { variant: 'body2' }
                                  }}
                                />
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      )}

                      {/* My Marks Section */}
                      {myMark ? (
                        <Box sx={{ 
                          p: 2, 
                          bgcolor: 'success.light', 
                          borderRadius: 2,
                          mb: 2
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Grade color="success" />
                            <Typography variant="subtitle2" fontWeight="bold" color="success.dark">
                              Your Score
                            </Typography>
                          </Box>
                          <Typography variant="h5" fontWeight="bold" color="success.dark">
                            {myMark.marks}/100
                          </Typography>
                          {myMark.remarks && (
                            <Typography variant="body2" color="success.dark" sx={{ mt: 1 }}>
                              {myMark.remarks}
                            </Typography>
                          )}
                        </Box>
                      ) : (
                        <Box sx={{ 
                          p: 2, 
                          bgcolor: 'grey.100', 
                          borderRadius: 2,
                          mb: 2,
                          textAlign: 'center'
                        }}>
                          <Typography variant="body2" color="text.secondary">
                            Marks not assigned yet
                          </Typography>
                        </Box>
                      )}
                    </CardContent>

                    {/* Action Button */}
                    {exam.examLink && (
                      <Box sx={{ p: 2, pt: 0 }}>
                        <Button
                          fullWidth
                          variant="contained"
                          startIcon={<OpenInNew />}
                          onClick={() => handleStartExam(exam.examLink)}
                          sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                            fontWeight: 'bold'
                          }}
                        >
                          දැන් ආරම්භ කරන්න
                        </Button>
                      </Box>
                    )}
                  </Card>
                </motion.div>
              </Grid>
            );
          })}
        </Grid>

        {exams.length === 0 && (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Assignment sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" sx={{
              fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
            }}>
              විභාග නොමැත
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              මෙම පන්තිය සඳහා ප්‍රකාශිත විභාග නොමැත
            </Typography>
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default StudentExamView;
