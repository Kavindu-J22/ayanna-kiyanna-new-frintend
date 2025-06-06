import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Paper,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  Description as DescriptionIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  Link as LinkIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CreatePaperDialog from '../components/CreatePaperDialog';
import EditPaperDialog from '../components/EditPaperDialog';

const PaperBankPage = () => {
  const navigate = useNavigate();
  const [papers, setPapers] = useState([]);
  const [filteredPapers, setFilteredPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    grade: '',
    paperType: '',
    paperYear: '',
    paperPart: ''
  });
  const [filterOptions, setFilterOptions] = useState({
    grades: [],
    paperTypes: [],
    paperYears: [],
    paperParts: []
  });
  const [showFilters, setShowFilters] = useState(true);
  
  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

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
      fetchPapers();
      fetchFilterOptions();
    } catch (err) {
      console.error('Authentication error:', err);
      setShowLoginDialog(true);
      setLoading(false);
    }
  };

  const fetchPapers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://ayanna-kiyanna-new-backend.onrender.com/api/paperbank', {
        headers: { 'x-auth-token': token }
      });

      if (response.data.success) {
        setPapers(response.data.data);
        setFilteredPapers(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching papers:', err);
      setError('Error loading papers');
    } finally {
      setLoading(false);
    }
  };

  const fetchFilterOptions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://ayanna-kiyanna-new-backend.onrender.com/api/paperbank/filters', {
        headers: { 'x-auth-token': token }
      });

      if (response.data.success) {
        setFilterOptions(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching filter options:', err);
    }
  };

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const applyFilters = (currentFilters) => {
    let filtered = papers;

    Object.keys(currentFilters).forEach(key => {
      if (currentFilters[key]) {
        filtered = filtered.filter(paper => paper[key] === currentFilters[key]);
      }
    });

    setFilteredPapers(filtered);
  };

  const clearFilters = () => {
    setFilters({
      grade: '',
      paperType: '',
      paperYear: '',
      paperPart: ''
    });
    setFilteredPapers(papers);
  };

  const handleCreatePaper = () => {
    setCreateDialogOpen(true);
  };

  const handleEditPaper = (paper) => {
    setSelectedPaper(paper);
    setEditDialogOpen(true);
  };

  const handleDeletePaper = (paper) => {
    setSelectedPaper(paper);
    setDeleteDialogOpen(true);
  };

  const handleViewPaper = (paper) => {
    setSelectedPaper(paper);
    setViewDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://ayanna-kiyanna-new-backend.onrender.com/api/paperbank/${selectedPaper._id}`, {
        headers: { 'x-auth-token': token }
      });

      fetchPapers();
      setDeleteDialogOpen(false);
      setSelectedPaper(null);
    } catch (err) {
      console.error('Error deleting paper:', err);
      setError('Error deleting paper');
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  const getFileIcon = (attachments) => {
    if (!attachments || attachments.length === 0) return <DescriptionIcon />;
    
    const fileType = attachments[0].fileType;
    if (fileType === 'application/pdf') {
      return <DescriptionIcon />;
    } else if (fileType.startsWith('image/')) {
      return <DescriptionIcon />;
    }
    return <DescriptionIcon />;
  };

  const getPaperTypeColor = (paperType) => {
    switch (paperType) {
      case 'Past Paper': return '#FF6B6B';
      case 'Model Paper': return '#4ECDC4';
      case 'Other': return '#45B7D1';
      default: return '#95A5A6';
    }
  };

  const getGradeColor = (grade) => {
    switch (grade) {
      case 'Grade 9': return '#E74C3C';
      case 'Grade 10': return '#F39C12';
      case 'Grade 11': return '#27AE60';
      case 'A/L': return '#8E44AD';
      case 'සිංහල සාහිත්‍ය (කාණ්ඩ විෂය)': return '#E91E63';
      default: return '#95A5A6';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Login Dialog */}
      <Dialog open={showLoginDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{
          textAlign: 'center',
          fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}>
          අයන්න කියන්න - Paper Bank
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" sx={{
            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
            mb: 2
          }}>
            Paper Bank වෙත ප්‍රවේශ වීමට පළමුව ලොගින් වන්න
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{
            fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
          }}>
            ඔබට ගිණුමක් නොමැති නම් ලියාපදිංචි වන්න
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button
            variant="contained"
            onClick={handleLoginRedirect}
            sx={{
              fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              px: 4
            }}
          >
            ලොගින් වන්න
          </Button>
        </DialogActions>
      </Dialog>

      {isAuthenticated && (
        <>
          {/* Header */}
          <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
              <Box>
                <Typography variant="h4" component="h1" sx={{
                  fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                  fontWeight: 'bold',
                  color: 'white',
                  mb: 1
                }}>
                  අයන්න කියන්න - Paper Bank
                </Typography>
                <Typography variant="body1" sx={{
                  fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
                  color: 'rgba(255, 255, 255, 0.9)',
                  maxWidth: '600px'
                }}>
                  ශ්‍රේණිය අනුව සංවිධානය කරන ලද අතීත ප්‍රශ්න පත්‍ර, ආදර්ශ ප්‍රශ්න පත්‍ර සහ වෙනත් අධ්‍යයන ද්‍රව්‍ය සොයා ගන්න. 
                  ඔබේ අධ්‍යයනය සඳහා අවශ්‍ය සියලුම ප්‍රශ්න පත්‍ර මෙහි ලබා ගත හැකිය.
                </Typography>
              </Box>
              {(userRole === 'admin' || userRole === 'moderator') && (
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleCreatePaper}
                  sx={{
                    fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.3)'
                    }
                  }}
                >
                  නව ප්‍රශ්න පත්‍රයක් එක් කරන්න
                </Button>
              )}
            </Box>
          </Paper>

          {/* Filters */}
          <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" sx={{
                fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                fontWeight: 'bold'
              }}>
                පෙරහන් (Filters)
              </Typography>
              <Box>
                <IconButton onClick={() => setShowFilters(!showFilters)}>
                  <FilterIcon />
                </IconButton>
                <IconButton onClick={clearFilters}>
                  <ClearIcon />
                </IconButton>
              </Box>
            </Box>

            {showFilters && (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small" sx={{ minWidth: 200 }}>
                    <InputLabel sx={{
                      fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
                    }}>
                      ශ්‍රේණිය
                    </InputLabel>
                    <Select
                      value={filters.grade}
                      label="ශ්‍රේණිය"
                      onChange={(e) => handleFilterChange('grade', e.target.value)}
                      sx={{
                        '& .MuiSelect-select': {
                          fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
                        }
                      }}
                    >
                      <MenuItem value="" sx={{
                        fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
                      }}>
                        සියල්ල
                      </MenuItem>
                      {filterOptions.grades.map(grade => (
                        <MenuItem key={grade} value={grade} sx={{
                          fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
                        }}>
                          {grade}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small" sx={{ minWidth: 200 }}>
                    <InputLabel sx={{
                      fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
                    }}>
                      ප්‍රශ්න පත්‍ර වර්ගය
                    </InputLabel>
                    <Select
                      value={filters.paperType}
                      label="ප්‍රශ්න පත්‍ර වර්ගය"
                      onChange={(e) => handleFilterChange('paperType', e.target.value)}
                      sx={{
                        '& .MuiSelect-select': {
                          fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
                        }
                      }}
                    >
                      <MenuItem value="" sx={{
                        fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
                      }}>
                        සියල්ල
                      </MenuItem>
                      {filterOptions.paperTypes.map(type => (
                        <MenuItem key={type} value={type} sx={{
                          fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
                        }}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small" sx={{ minWidth: 200 }}>
                    <InputLabel sx={{
                      fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
                    }}>
                      වර්ෂය
                    </InputLabel>
                    <Select
                      value={filters.paperYear}
                      label="වර්ෂය"
                      onChange={(e) => handleFilterChange('paperYear', e.target.value)}
                      sx={{
                        '& .MuiSelect-select': {
                          fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
                        }
                      }}
                    >
                      <MenuItem value="" sx={{
                        fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
                      }}>
                        සියල්ල
                      </MenuItem>
                      {filterOptions.paperYears.map(year => (
                        <MenuItem key={year} value={year} sx={{
                          fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
                        }}>
                          {year}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small" sx={{ minWidth: 200 }}>
                    <InputLabel sx={{
                      fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
                    }}>
                      කොටස
                    </InputLabel>
                    <Select
                      value={filters.paperPart}
                      label="කොටස"
                      onChange={(e) => handleFilterChange('paperPart', e.target.value)}
                      sx={{
                        '& .MuiSelect-select': {
                          fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
                        }
                      }}
                    >
                      <MenuItem value="" sx={{
                        fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
                      }}>
                        සියල්ල
                      </MenuItem>
                      {filterOptions.paperParts.map(part => (
                        <MenuItem key={part} value={part} sx={{
                          fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
                        }}>
                          {part}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            )}
          </Paper>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Papers Grid */}
          <Grid container spacing={3}>
            <AnimatePresence>
              {filteredPapers.map((paper, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={paper._id}>
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
                              bgcolor: getPaperTypeColor(paper.paperType),
                              mr: 2,
                              width: 48,
                              height: 48
                            }}
                          >
                            {getFileIcon(paper.attachments)}
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
                            {paper.title}
                          </Typography>
                        </Box>

                        {paper.description && (
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
                            {paper.description}
                          </Typography>
                        )}

                        <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                          <Chip
                            label={paper.grade}
                            size="small"
                            sx={{
                              backgroundColor: getGradeColor(paper.grade),
                              color: 'white',
                              fontWeight: 'bold'
                            }}
                          />
                          <Chip
                            label={paper.paperType}
                            size="small"
                            sx={{
                              backgroundColor: getPaperTypeColor(paper.paperType),
                              color: 'white',
                              fontWeight: 'bold'
                            }}
                          />
                          <Chip
                            label={paper.paperYear}
                            size="small"
                            variant="outlined"
                          />
                          <Chip
                            label={paper.paperPart}
                            size="small"
                            variant="outlined"
                          />
                        </Box>

                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                          <PersonIcon fontSize="small" color="action" />
                          <Typography variant="caption" color="text.secondary">
                            {paper.createdBy?.fullName}
                          </Typography>
                        </Box>

                        <Box display="flex" alignItems="center" gap={1} mb={2}>
                          <CalendarIcon fontSize="small" color="action" />
                          <Typography variant="caption" color="text.secondary">
                            {new Date(paper.createdAt).toLocaleDateString('si-LK')}
                          </Typography>
                        </Box>

                        {paper.attachments && paper.attachments.length > 0 && (
                          <Box display="flex" alignItems="center" gap={1} mb={2}>
                            <AssignmentIcon fontSize="small" color="action" />
                            <Typography variant="caption" color="text.secondary">
                              {paper.attachments.length} ගොනු
                            </Typography>
                          </Box>
                        )}

                        {paper.sourceLinks && paper.sourceLinks.length > 0 && (
                          <Box display="flex" alignItems="center" gap={1} mb={2}>
                            <LinkIcon fontSize="small" color="action" />
                            <Typography variant="caption" color="text.secondary">
                              {paper.sourceLinks.length} සම්බන්ධක
                            </Typography>
                          </Box>
                        )}
                      </CardContent>

                      <Box sx={{ p: 2, pt: 0 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Button
                            size="small"
                            startIcon={<ViewIcon />}
                            onClick={() => handleViewPaper(paper)}
                            sx={{
                              fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                              color: '#2C3E50'
                            }}
                          >
                            බලන්න
                          </Button>
                          
                          {(userRole === 'admin' || userRole === 'moderator') && (
                            <Box>
                              <Tooltip title="සංස්කරණය කරන්න">
                                <IconButton
                                  size="small"
                                  onClick={() => handleEditPaper(paper)}
                                  sx={{ color: '#3498DB' }}
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="මකන්න">
                                <IconButton
                                  size="small"
                                  onClick={() => handleDeletePaper(paper)}
                                  sx={{ color: '#E74C3C' }}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          )}
                        </Box>
                      </Box>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </AnimatePresence>
          </Grid>

          {filteredPapers.length === 0 && !loading && (
            <Paper elevation={2} sx={{ p: 4, textAlign: 'center', mt: 4 }}>
              <Typography variant="h6" sx={{
                fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                color: 'text.secondary'
              }}>
                ප්‍රශ්න පත්‍ර හමු නොවීය
              </Typography>
              <Typography variant="body2" sx={{
                fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
                color: 'text.secondary',
                mt: 1
              }}>
                ඔබේ සෙවුම් නිර්ණායක වෙනස් කර නැවත උත්සාහ කරන්න
              </Typography>
            </Paper>
          )}

          {/* Delete Confirmation Dialog */}
          <Dialog open={deleteDialogOpen} maxWidth="sm" fullWidth>
            <DialogTitle sx={{
              fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
            }}>
              ප්‍රශ්න පත්‍රය මකන්න
            </DialogTitle>
            <DialogContent>
              <Typography sx={{
                fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
              }}>
                ඔබට "{selectedPaper?.title}" ප්‍රශ්න පත්‍රය මකා දැමීමට අවශ්‍යද? මෙම ක්‍රියාව ආපසු හැරවිය නොහැක.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setDeleteDialogOpen(false)}
                sx={{
                  fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                }}
              >
                අවලංගු කරන්න
              </Button>
              <Button
                onClick={confirmDelete}
                color="error"
                variant="contained"
                sx={{
                  fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                }}
              >
                මකන්න
              </Button>
            </DialogActions>
          </Dialog>

          {/* Create Paper Dialog */}
          <CreatePaperDialog
            open={createDialogOpen}
            onClose={() => setCreateDialogOpen(false)}
            onSuccess={() => {
              setCreateDialogOpen(false);
              fetchPapers();
            }}
          />

          {/* Edit Paper Dialog */}
          <EditPaperDialog
            open={editDialogOpen}
            onClose={() => setEditDialogOpen(false)}
            paper={selectedPaper}
            onSuccess={() => {
              setEditDialogOpen(false);
              fetchPapers();
              setSelectedPaper(null);
            }}
          />

          {/* View Paper Dialog */}
          <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
            <DialogTitle sx={{
              fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white'
            }}>
              {selectedPaper?.title}
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
              {selectedPaper && (
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">ශ්‍රේණිය:</Typography>
                    <Typography variant="body1">{selectedPaper.grade}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">ප්‍රශ්න පත්‍ර වර්ගය:</Typography>
                    <Typography variant="body1">{selectedPaper.paperType}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">වර්ෂය:</Typography>
                    <Typography variant="body1">{selectedPaper.paperYear}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">කොටස:</Typography>
                    <Typography variant="body1">{selectedPaper.paperPart}</Typography>
                  </Grid>
                  {selectedPaper.description && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">විස්තරය:</Typography>
                      <Typography variant="body1">{selectedPaper.description}</Typography>
                    </Grid>
                  )}
                  {selectedPaper.attachments && selectedPaper.attachments.length > 0 && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>ගොනු:</Typography>
                      {selectedPaper.attachments.map((file, index) => (
                        <Button
                          key={index}
                          variant="outlined"
                          size="small"
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ mr: 1, mb: 1 }}
                        >
                          {file.originalName}
                        </Button>
                      ))}
                    </Grid>
                  )}
                  {selectedPaper.sourceLinks && selectedPaper.sourceLinks.length > 0 && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>මූලාශ්‍ර සම්බන්ධක:</Typography>
                      {selectedPaper.sourceLinks.map((link, index) => (
                        <Button
                          key={index}
                          variant="outlined"
                          size="small"
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          startIcon={<LinkIcon />}
                          sx={{ mr: 1, mb: 1 }}
                        >
                          {link.title}
                        </Button>
                      ))}
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">සාදන ලද්දේ:</Typography>
                    <Typography variant="body2">
                      {selectedPaper.createdBy?.fullName} - {new Date(selectedPaper.createdAt).toLocaleDateString('si-LK')}
                    </Typography>
                  </Grid>
                </Grid>
              )}
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setViewDialogOpen(false)}
                sx={{
                  fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                }}
              >
                වසන්න
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Container>
  );
};

export default PaperBankPage;
