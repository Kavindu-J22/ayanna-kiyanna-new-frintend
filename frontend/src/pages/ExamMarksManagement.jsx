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
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  ArrowBack,
  Grade,
  Search,
  Assignment,
  Person,
  Edit,
  Sort
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';

const ExamMarksManagement = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // State management
  const [exam, setExam] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default');

  // Dialog states
  const [marksDialog, setMarksDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [marks, setMarks] = useState('');
  const [remarks, setRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchExamData();
    fetchStudents();
  }, [examId]);

  const fetchExamData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/exams/${examId}`,
        { headers: { 'x-auth-token': token } }
      );
      setExam(response.data.exam);
    } catch (err) {
      console.error('Error fetching exam data:', err);
      setError('Failed to load exam data');
    }
  };

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/exams/${examId}/students?search=${searchTerm}`,
        { headers: { 'x-auth-token': token } }
      );
      setStudents(response.data.students);
    } catch (err) {
      console.error('Error fetching students:', err);
      setError('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignMarks = async () => {
    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');
      
      await axios.post(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/exams/${examId}/marks`,
        {
          studentId: selectedStudent._id,
          marks: parseFloat(marks),
          remarks
        },
        { headers: { 'x-auth-token': token } }
      );

      setMarksDialog(false);
      resetMarksForm();
      fetchStudents();
      alert('Marks assigned successfully!');
    } catch (err) {
      console.error('Error assigning marks:', err);
      alert(err.response?.data?.message || 'Failed to assign marks');
    } finally {
      setSubmitting(false);
    }
  };

  const resetMarksForm = () => {
    setSelectedStudent(null);
    setMarks('');
    setRemarks('');
  };

  const openMarksDialog = (student) => {
    setSelectedStudent(student);
    if (student.examMark) {
      setMarks(student.examMark.marks.toString());
      setRemarks(student.examMark.remarks || '');
    } else {
      setMarks('');
      setRemarks('');
    }
    setMarksDialog(true);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      fetchStudents();
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm]);

  if (loading && !students.length) {
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
              ලකුණු ප්‍රදානය
            </Typography>
          </Box>
          
          {exam && (
            <Box>
              <Typography variant="h6" sx={{
                fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                mb: 1
              }}>
                {exam.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {exam.description}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                <Chip 
                  label={exam.isPublished ? 'Published' : 'Draft'} 
                  color={exam.isPublished ? 'success' : 'default'} 
                  size="small" 
                />
                {exam.examDate && (
                  <Chip
                    label={`දිනය: ${new Date(exam.examDate).toLocaleDateString('si-LK')}`}
                    variant="outlined"
                    size="small"
                  />
                )}
                {(exam.examStartTime || exam.examEndTime) && (
                  <Chip
                    label={`වේලාව: ${exam.examStartTime && exam.examEndTime
                      ? `${exam.examStartTime} - ${exam.examEndTime}`
                      : exam.examStartTime || exam.examEndTime}`}
                    variant="outlined"
                    size="small"
                    color="secondary"
                  />
                )}
              </Box>
            </Box>
          )}
        </Paper>

        {/* Search and Sort */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField
              placeholder="සිසු නම හෝ Student ID අනුව සොයන්න..."
              value={searchTerm}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{ flex: 1, minWidth: 300 }}
            />
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>ලකුණු අනුව සැකසීම</InputLabel>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                label="ලකුණු අනුව සැකසීම"
                startAdornment={<Sort sx={{ mr: 1, color: 'action.active' }} />}
              >
                <MenuItem value="default">පෙරනිමි (නම අනුව)</MenuItem>
                <MenuItem value="marks-high-low">ලකුණු: වැඩි සිට අඩු</MenuItem>
                <MenuItem value="marks-low-high">ලකුණු: අඩු සිට වැඩි</MenuItem>
                <MenuItem value="name-a-z">නම: A සිට Z</MenuItem>
                <MenuItem value="name-z-a">නම: Z සිට A</MenuItem>
                <MenuItem value="graded-first">ලකුණු ලබා දුන් පළමුව</MenuItem>
                <MenuItem value="ungraded-first">ලකුණු නොලබා දුන් පළමුව</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Paper>

        {/* Students Grid */}
        <Grid container spacing={3}>
          {students
            .sort((a, b) => {
              switch (sortBy) {
                case 'marks-high-low':
                  // Sort by marks (high to low), put ungraded at the end
                  if (!a.examMark && !b.examMark) return 0;
                  if (!a.examMark) return 1;
                  if (!b.examMark) return -1;
                  return b.examMark.marks - a.examMark.marks;
                case 'marks-low-high':
                  // Sort by marks (low to high), put ungraded at the end
                  if (!a.examMark && !b.examMark) return 0;
                  if (!a.examMark) return 1;
                  if (!b.examMark) return -1;
                  return a.examMark.marks - b.examMark.marks;
                case 'name-a-z':
                  // Sort by student name A-Z
                  const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
                  const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
                  return nameA.localeCompare(nameB);
                case 'name-z-a':
                  // Sort by student name Z-A
                  const nameA2 = `${a.firstName} ${a.lastName}`.toLowerCase();
                  const nameB2 = `${b.firstName} ${b.lastName}`.toLowerCase();
                  return nameB2.localeCompare(nameA2);
                case 'graded-first':
                  // Show graded students first
                  if (a.examMark && !b.examMark) return -1;
                  if (!a.examMark && b.examMark) return 1;
                  // If both graded or both ungraded, sort by name
                  const nameA3 = `${a.firstName} ${a.lastName}`.toLowerCase();
                  const nameB3 = `${b.firstName} ${b.lastName}`.toLowerCase();
                  return nameA3.localeCompare(nameB3);
                case 'ungraded-first':
                  // Show ungraded students first
                  if (!a.examMark && b.examMark) return -1;
                  if (a.examMark && !b.examMark) return 1;
                  // If both graded or both ungraded, sort by name
                  const nameA4 = `${a.firstName} ${a.lastName}`.toLowerCase();
                  const nameB4 = `${b.firstName} ${b.lastName}`.toLowerCase();
                  return nameA4.localeCompare(nameB4);
                default:
                  // Default sorting by name A-Z
                  const nameA5 = `${a.firstName} ${a.lastName}`.toLowerCase();
                  const nameB5 = `${b.firstName} ${b.lastName}`.toLowerCase();
                  return nameA5.localeCompare(nameB5);
              }
            })
            .map((student) => (
            <Grid item xs={12} sm={6} md={4} key={student._id} sx={{
            display: 'grid',
            alignItems: 'stretch', // This ensures all cards stretch to the same height
            }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card sx={{
                  height: '100%',
                  display: 'flex',
                  minWidth: '250px',
                  maxWidth: '250px',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 4
                  }
                }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <Person />
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" fontWeight="bold">
                          {student.firstName} {student.lastName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {student.studentId}
                        </Typography>
                      </Box>
                    </Box>

                    {student.examMark ? (
                      <Box sx={{ 
                        p: 2, 
                        bgcolor: student.examMark.marks >= 50 ? 'success.light' : 
                                student.examMark.marks >= 40 ? 'warning.light' : 'error.light', 
                        borderRadius: 2,
                        mb: 2
                    }}>
                        <Typography variant="h5" fontWeight="bold" 
                            color={student.examMark.marks >= 50 ? 'success.dark' : 
                                  student.examMark.marks >= 40 ? 'warning.dark' : 'error.dark'}>
                            {student.examMark.marks}/100
                        </Typography>
                        {student.examMark.remarks && (
                            <Typography variant="body2" 
                                color={student.examMark.marks >= 50 ? 'success.dark' : 
                                      student.examMark.marks >= 40 ? 'warning.dark' : 'error.dark'} 
                                sx={{ mt: 1 }}>
                                {student.examMark.remarks}
                            </Typography>
                        )}
                        <Typography variant="caption" 
                            color={student.examMark.marks >= 50 ? 'success.dark' : 
                                  student.examMark.marks >= 40 ? 'warning.dark' : 'error.dark'}>
                            Assigned: {new Date(student.examMark.assignedAt).toLocaleDateString()}
                        </Typography>
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
                          No marks assigned yet
                        </Typography>
                      </Box>
                    )}
                  </CardContent>

                  <Box sx={{ p: 2, pt: 0 }}>
                    <Button
                      fullWidth
                      variant={student.examMark ? "outlined" : "contained"}
                      startIcon={student.examMark ? <Edit /> : <Grade />}
                      onClick={() => openMarksDialog(student)}
                    >
                      {student.examMark ? 'Edit Marks' : 'Assign Marks'}
                    </Button>
                  </Box>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {students.length === 0 && !loading && (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Assignment sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" sx={{
              fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
            }}>
              සිසුන් නොමැත
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              මෙම පන්තියට ලියාපදිංචි සිසුන් නොමැත
            </Typography>
          </Paper>
        )}

        {/* Marks Assignment Dialog */}
        <Dialog
          open={marksDialog}
          onClose={() => {
            setMarksDialog(false);
            resetMarksForm();
          }}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{
            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
            fontWeight: 'bold'
          }}>
            {selectedStudent?.examMark ? 'ලකුණු සංස්කරණය' : 'ලකුණු ප්‍රදානය'}
          </DialogTitle>
          <DialogContent>
            {selectedStudent && (
              <Box sx={{ pt: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <Person />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {selectedStudent.firstName} {selectedStudent.lastName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedStudent.studentId}
                    </Typography>
                  </Box>
                </Box>

                <TextField
                  fullWidth
                  label="Marks (0-100)"
                  type="number"
                  value={marks}
                  onChange={(e) => setMarks(e.target.value)}
                  inputProps={{ min: 0, max: 100, step: 0.5 }}
                  sx={{ mb: 3 }}
                  required
                />

                <TextField
                  fullWidth
                  label="Remarks (Optional)"
                  multiline
                  rows={3}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Add any comments or feedback..."
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setMarksDialog(false);
                resetMarksForm();
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleAssignMarks}
              disabled={submitting || !marks || parseFloat(marks) < 0 || parseFloat(marks) > 100}
            >
              {submitting ? <CircularProgress size={20} /> : 'Save Marks'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default ExamMarksManagement;
