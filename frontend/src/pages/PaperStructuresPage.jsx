import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Avatar,
  CircularProgress,
  Alert,
  Collapse,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  Description as DescriptionIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  Link as LinkIcon,
  AttachFile as AttachFileIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

// Import dialog components (will create these next)
import CreatePaperStructureDialog from '../components/CreatePaperStructureDialog';
import EditPaperStructureDialog from '../components/EditPaperStructureDialog';

const PaperStructuresPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [paperStructures, setPaperStructures] = useState([]);
  const [filteredPaperStructures, setFilteredPaperStructures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    grade: '',
    paperPart: '',
    type: ''
  });
  const [filterOptions, setFilterOptions] = useState({
    grades: [],
    paperParts: [],
    types: []
  });
  const [showFilters, setShowFilters] = useState(true);
  
  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedPaperStructure, setSelectedPaperStructure] = useState(null);
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
      fetchPaperStructures();
      fetchFilterOptions();
    } catch (err) {
      console.error('Authentication error:', err);
      setShowLoginDialog(true);
      setLoading(false);
    }
  };

  const fetchPaperStructures = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://ayanna-kiyanna-new-backend.onrender.com/api/paper-structures', {
        headers: { 'x-auth-token': token }
      });

      if (response.data.success) {
        setPaperStructures(response.data.data);
        setFilteredPaperStructures(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching paper structures:', err);
      setError('Error loading paper structures');
    } finally {
      setLoading(false);
    }
  };

  const fetchFilterOptions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://ayanna-kiyanna-new-backend.onrender.com/api/paper-structures/filters', {
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
    let filtered = paperStructures;

    Object.keys(currentFilters).forEach(key => {
      if (currentFilters[key]) {
        filtered = filtered.filter(item => item[key] === currentFilters[key]);
      }
    });

    setFilteredPaperStructures(filtered);
  };

  const clearFilters = () => {
    setFilters({
      grade: '',
      paperPart: '',
      type: ''
    });
    setFilteredPaperStructures(paperStructures);
  };

  const handleCreatePaperStructure = () => {
    setCreateDialogOpen(true);
  };

  const handleEditPaperStructure = (paperStructure) => {
    setSelectedPaperStructure(paperStructure);
    setEditDialogOpen(true);
  };

  const handleDeletePaperStructure = (paperStructure) => {
    setSelectedPaperStructure(paperStructure);
    setDeleteDialogOpen(true);
  };

  const handleViewPaperStructure = (paperStructure) => {
    setSelectedPaperStructure(paperStructure);
    setViewDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://ayanna-kiyanna-new-backend.onrender.com/api/paper-structures/${selectedPaperStructure._id}`, {
        headers: { 'x-auth-token': token }
      });

      fetchPaperStructures();
      setDeleteDialogOpen(false);
      setSelectedPaperStructure(null);
    } catch (err) {
      console.error('Error deleting paper structure:', err);
      setError('Error deleting paper structure');
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Paper Structures': return '#3498DB';
      case 'අනුමාන': return '#E74C3C';
      case 'Others': return '#9B59B6';
      default: return '#95A5A6';
    }
  };

  const getFileIcon = (attachments) => {
    if (!attachments || attachments.length === 0) return <DescriptionIcon />;
    
    const hasImage = attachments.some(att => att.fileType?.startsWith('image/'));
    const hasPdf = attachments.some(att => att.fileType === 'application/pdf');
    
    if (hasImage && hasPdf) return <AttachFileIcon />;
    if (hasImage) return <AttachFileIcon />;
    if (hasPdf) return <DescriptionIcon />;
    return <DescriptionIcon />;
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} sx={{ color: '#667eea' }} />
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
          අයන්න කියන්න - Paper Structures සහ අනුමාන
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" sx={{
            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
            mb: 2
          }}>
            Paper Structures සහ අනුමාන වෙත ප්‍රවේශ වීමට පළමුව ලොගින් වන්න
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{
            fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
          }}>
            ඔබට ගිණුමක් නොමැති නම් ලියාපදිංචි වන්න
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button
            onClick={handleLoginRedirect}
            variant="contained"
            sx={{
              fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              px: 4,
              py: 1.5,
              borderRadius: 2
            }}
          >
            හරි
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
                  Paper Structures සහ අනුමාන
                </Typography>
                <Typography variant="body1" sx={{
                  fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
                  color: 'rgba(255, 255, 255, 0.9)',
                  maxWidth: '600px'
                }}>
                  ප්‍රශ්න පත්‍ර ව්‍යුහයන්, අනුමාන සහ අධ්‍යයන ද්‍රව්‍ය සොයා ගන්න. ශ්‍රේණිය අනුව සංවිධානය කරන ලද ප්‍රශ්න පත්‍ර ව්‍යුහයන් සහ අනුමාන ලබා ගන්න.
                </Typography>
              </Box>
              
              {(userRole === 'admin' || userRole === 'moderator') && (
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleCreatePaperStructure}
                  sx={{
                    fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: 'white',
                    mt: { xs: 2, md: 0 },
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.3)',
                    }
                  }}
                >
                  අලුත් එකක් සාදන්න
                </Button>
              )}
            </Box>
          </Paper>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Filter Section */}
          <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" sx={{
                fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                color: '#2C3E50',
                display: 'flex',
                alignItems: 'center'
              }}>
                <FilterIcon sx={{ mr: 1 }} />
                පෙරහන්
              </Typography>
              <IconButton
                onClick={() => setShowFilters(!showFilters)}
                sx={{ display: { xs: 'flex', md: 'none' } }}
              >
                <FilterIcon />
              </IconButton>
            </Box>

            <Collapse in={showFilters || !isMobile}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small" sx={{ minWidth: 200 }}>
                    <InputLabel>ශ්‍රේණිය</InputLabel>
                    <Select
                      value={filters.grade}
                      label="ශ්‍රේණිය"
                      onChange={(e) => handleFilterChange('grade', e.target.value)}
                    >
                      <MenuItem value="">සියල්ල</MenuItem>
                      {filterOptions.grades.map((grade) => (
                        <MenuItem key={grade} value={grade}>{grade}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small" sx={{ minWidth: 200 }}>
                    <InputLabel>කොටස</InputLabel>
                    <Select
                      value={filters.paperPart}
                      label="කොටස"
                      onChange={(e) => handleFilterChange('paperPart', e.target.value)}
                    >
                      <MenuItem value="">සියල්ල</MenuItem>
                      {filterOptions.paperParts.map((part) => (
                        <MenuItem key={part} value={part}>{part}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small" sx={{ minWidth: 200 }}>
                    <InputLabel>වර්ගය</InputLabel>
                    <Select
                      value={filters.type}
                      label="වර්ගය"
                      onChange={(e) => handleFilterChange('type', e.target.value)}
                    >
                      <MenuItem value="">සියල්ල</MenuItem>
                      {filterOptions.types.map((type) => (
                        <MenuItem key={type} value={type}>{type}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    variant="outlined"
                    startIcon={<ClearIcon />}
                    onClick={clearFilters}
                    fullWidth
                    sx={{
                      fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                      borderColor: '#E74C3C',
                      color: '#E74C3C',
                      '&:hover': {
                        borderColor: '#C0392B',
                        backgroundColor: 'rgba(231, 76, 60, 0.1)'
                      }
                    }}
                  >
                    පෙරහන් ඉවත් කරන්න
                  </Button>
                </Grid>
              </Grid>
            </Collapse>
          </Paper>

          {/* Paper Structures Grid */}
          <Grid container spacing={3} justifyContent="center">
            <AnimatePresence>
              {filteredPaperStructures.map((paperStructure, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={paperStructure._id}
                sx={{
                display: 'grid',
                alignItems: 'stretch', // This ensures all cards stretch to the same height
                }}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        minWidth: '300px',
                        maxWidth: '300px',
                        flexDirection: 'column',
                        borderRadius: 3,
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
                        }
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1, p: 3 }}>
                        <Box display="flex" alignItems="center" mb={2}>
                          <Avatar
                            sx={{
                              bgcolor: getTypeColor(paperStructure.type),
                              mr: 2,
                              width: 48,
                              height: 48
                            }}
                          >
                            {getFileIcon(paperStructure.attachments)}
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
                            {paperStructure.title}
                          </Typography>
                        </Box>

                        {paperStructure.description && (
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
                            {paperStructure.description}
                          </Typography>
                        )}

                        <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                          <Chip
                            label={paperStructure.grade}
                            size="small"
                            icon={<SchoolIcon />}
                            sx={{
                              backgroundColor: '#E8F4FD',
                              color: '#1976D2',
                              fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
                            }}
                          />
                          <Chip
                            label={paperStructure.paperPart}
                            size="small"
                            icon={<AssignmentIcon />}
                            sx={{
                              backgroundColor: '#FFF3E0',
                              color: '#F57C00',
                              fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
                            }}
                          />
                          <Chip
                            label={paperStructure.type}
                            size="small"
                            sx={{
                              backgroundColor: `${getTypeColor(paperStructure.type)}20`,
                              color: getTypeColor(paperStructure.type),
                              fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
                            }}
                          />
                        </Box>

                        {paperStructure.attachments && paperStructure.attachments.length > 0 && (
                          <Box display="flex" alignItems="center" mb={1}>
                            <AttachFileIcon sx={{ fontSize: 16, color: '#666', mr: 0.5 }} />
                            <Typography variant="caption" color="text.secondary">
                              {paperStructure.attachments.length} ගොනු
                            </Typography>
                          </Box>
                        )}

                        {paperStructure.sourceLinks && paperStructure.sourceLinks.length > 0 && (
                          <Box display="flex" alignItems="center">
                            <LinkIcon sx={{ fontSize: 16, color: '#666', mr: 0.5 }} />
                            <Typography variant="caption" color="text.secondary">
                              {paperStructure.sourceLinks.length} සම්බන්ධක
                            </Typography>
                          </Box>
                        )}
                      </CardContent>

                      <Box sx={{ p: 2, pt: 0 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Button
                            size="small"
                            startIcon={<ViewIcon />}
                            onClick={() => handleViewPaperStructure(paperStructure)}
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
                                  onClick={() => handleEditPaperStructure(paperStructure)}
                                  sx={{ color: '#3498DB' }}
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="මකන්න">
                                <IconButton
                                  size="small"
                                  onClick={() => handleDeletePaperStructure(paperStructure)}
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

          {filteredPaperStructures.length === 0 && !loading && (
            <Paper sx={{ p: 4, textAlign: 'center', mt: 4 }}>
              <Typography variant="h6" color="text.secondary" sx={{
                fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
              }}>
                Paper Structures සහ අනුමාන හමු නොවීය
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{
                fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
                mt: 1
              }}>
                පෙරහන් වෙනස් කර නැවත උත්සාහ කරන්න
              </Typography>
            </Paper>
          )}

          {/* Delete Confirmation Dialog */}
          <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
            <DialogTitle sx={{
              fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
              color: '#E74C3C'
            }}>
              Paper Structure මකන්න
            </DialogTitle>
            <DialogContent>
              <Typography sx={{
                fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
              }}>
                ඔබට "{selectedPaperStructure?.title}" මකා දැමීමට අවශ්‍ය බව විශ්වාසද?
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
                variant="contained"
                color="error"
                sx={{
                  fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                }}
              >
                මකන්න
              </Button>
            </DialogActions>
          </Dialog>

          {/* Create Paper Structure Dialog */}
          <CreatePaperStructureDialog
            open={createDialogOpen}
            onClose={() => setCreateDialogOpen(false)}
            onSuccess={() => {
              setCreateDialogOpen(false);
              fetchPaperStructures();
            }}
          />

          {/* Edit Paper Structure Dialog */}
          <EditPaperStructureDialog
            open={editDialogOpen}
            onClose={() => setEditDialogOpen(false)}
            paperStructure={selectedPaperStructure}
            onSuccess={() => {
              setEditDialogOpen(false);
              fetchPaperStructures();
              setSelectedPaperStructure(null);
            }}
          />

          {/* View Paper Structure Dialog */}
          <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
            <DialogTitle sx={{
              fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white'
            }}>
              {selectedPaperStructure?.title}
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
              {selectedPaperStructure && (
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">ශ්‍රේණිය:</Typography>
                    <Typography variant="body1">{selectedPaperStructure.grade}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">වර්ගය:</Typography>
                    <Typography variant="body1">{selectedPaperStructure.type}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">කොටස:</Typography>
                    <Typography variant="body1">{selectedPaperStructure.paperPart}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">නිර්මාණය කළ දිනය:</Typography>
                    <Typography variant="body1">
                      {new Date(selectedPaperStructure.createdAt).toLocaleDateString('si-LK')}
                    </Typography>
                  </Grid>
                  {selectedPaperStructure.description && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">විස්තරය:</Typography>
                      <Typography variant="body1" sx={{ mt: 1 }}>
                        {selectedPaperStructure.description}
                      </Typography>
                    </Grid>
                  )}
                  {selectedPaperStructure.additionalNote && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">අමතර සටහන:</Typography>
                      <Typography variant="body1" sx={{ mt: 1 }}>
                        {selectedPaperStructure.additionalNote}
                      </Typography>
                    </Grid>
                  )}
                  {selectedPaperStructure.attachments && selectedPaperStructure.attachments.length > 0 && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                        ගොනු:
                      </Typography>
                      <Box display="flex" flexWrap="wrap" gap={1}>
                        {selectedPaperStructure.attachments.map((file, index) => (
                          <Chip
                            key={index}
                            label={file.originalName}
                            onClick={() => window.open(file.url, '_blank')}
                            clickable
                            sx={{ m: 0.5 }}
                          />
                        ))}
                      </Box>
                    </Grid>
                  )}
                  {selectedPaperStructure.sourceLinks && selectedPaperStructure.sourceLinks.length > 0 && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                        මූලාශ්‍ර සම්බන්ධක:
                      </Typography>
                      <Box>
                        {selectedPaperStructure.sourceLinks.map((link, index) => (
                          <Box key={index} sx={{ mb: 1 }}>
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<LinkIcon />}
                              onClick={() => window.open(link.url, '_blank')}
                              sx={{ mr: 1, mb: 1 }}
                            >
                              {link.title}
                            </Button>
                          </Box>
                        ))}
                      </Box>
                    </Grid>
                  )}
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

export default PaperStructuresPage;
