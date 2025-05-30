import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Tooltip,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  Avatar,
  Alert
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  AccessTime as TimeIcon,
  LocationOn as LocationIcon,
  People as PeopleIcon,
  CalendarToday as CalendarIcon,
  School as SchoolIcon,
  Group as GroupIcon,
  CleaningServices as CleanIcon,
  Login as AccessIcon,
  Close,
  Search,
  Visibility
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';

const ClassList = ({ classes, onEdit, onDelete, onRefresh }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dayNameFilter, setDayNameFilter] = useState('');
  const [specificDateFilter, setSpecificDateFilter] = useState(null);
  const [cleaningSpots, setCleaningSpots] = useState(false);

  // View Students Dialog states
  const [viewStudentsDialog, setViewStudentsDialog] = useState(false);
  const [selectedClassForStudents, setSelectedClassForStudents] = useState(null);
  const [classStudents, setClassStudents] = useState([]);
  const [studentsSearchTerm, setStudentsSearchTerm] = useState('');
  const [loadingClassStudents, setLoadingClassStudents] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  // Helper function to check if a date string is a weekday name
  const isWeekdayName = (dateString) => {
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return weekdays.includes(dateString);
  };

  // Helper function to check if a date string is a specific date (YYYY-MM-DD format)
  const isSpecificDate = (dateString) => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    return dateRegex.test(dateString);
  };

  // Helper function to format date for comparison
  const formatDateForComparison = (date) => {
    if (!date) return '';
    const d = new Date(date);
    // Use local date to avoid timezone issues
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`; // Returns YYYY-MM-DD format
  };

  // Filter classes based on search and filters
  const filteredClasses = classes.filter(classItem => {
    const matchesSearch =
      classItem.grade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classItem.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classItem.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (classItem.category && classItem.category.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = !typeFilter || classItem.type === typeFilter;
    const matchesGrade = !gradeFilter || classItem.grade === gradeFilter;
    const matchesCategory = !categoryFilter || classItem.category === categoryFilter;

    // Date filtering logic
    const matchesDayName = !dayNameFilter || (isWeekdayName(classItem.date) && classItem.date === dayNameFilter);
    const matchesSpecificDate = !specificDateFilter || (isSpecificDate(classItem.date) && classItem.date === formatDateForComparison(specificDateFilter));

    return matchesSearch && matchesType && matchesGrade && matchesCategory && matchesDayName && matchesSpecificDate;
  });

  // Get unique grades, categories, and day names for filter
  const uniqueGrades = [...new Set(classes.map(c => c.grade))].sort();
  const uniqueCategories = [...new Set(classes.map(c => c.category).filter(Boolean))].sort();
  const uniqueDayNames = [...new Set(classes.map(c => c.date).filter(date => isWeekdayName(date)))].sort();

  // Define weekday order for proper sorting
  const weekdayOrder = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const sortedDayNames = uniqueDayNames.sort((a, b) => weekdayOrder.indexOf(a) - weekdayOrder.indexOf(b));

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getTypeChipColor = (type) => {
    return type === 'Normal' ? 'primary' : 'secondary';
  };

  const getStatusChipColor = (isActive) => {
    return isActive ? 'success' : 'default';
  };

  const getPlatformChipColor = (platform) => {
    switch (platform) {
      case 'Physical': return 'primary';
      case 'Online': return 'secondary';
      case 'Hybrid': return 'warning';
      default: return 'primary';
    }
  };

  const formatTime = (time) => {
    return time ? time.substring(0, 5) : '';
  };

  const handleCleanAndResetSpots = async () => {
    if (!window.confirm('ඔබට සියලුම පන්ති සඳහා තිබෙන ඉඩ ප්රමාණ පිරිසිදු කර යළි සකස් කිරීමට අවශ්ය බව ඔබට විශ්වාසද?\n\nමෙය:\n- ඉවත් කරන ලද ශිෂ්යයන් පන්ති ලියාපදිංචි වලින් ඉවත් කරයි\n- ශිෂ්ය හා පන්ති වාර්තා අතර ඇති අස්ථාවර දත්ත නිවැරදි කරයි\n- තිබෙන ඉඩ ප්රමාණ ගණනය කිරීම් යාවත්කාලීන කරයි\n\n(මෙම ක්‍රියාවලිය සෑම දිනකම රාත්‍රී 12 ට සහ දහවල් 12 ට ස්වයංක්‍රීයව සිදුවන අතර මෙය ක්‍රියාත්මක කිරීම තුලින් මේ මොහොතේ ද සිදුකල හැක) මෙම ක්‍රියාවලිය අහෝසි කළ නොහැකිය.')) {
      return;
    }

    setCleaningSpots(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'https://ayanna-kiyanna-new-backend.onrender.com/api/classes/clean-and-reset-spots',
        {},
        { headers: { 'x-auth-token': token } }
      );

      if (response.data.success) {
        const summary = response.data.summary;
        alert(`Cleanup completed successfully!\n\nSummary:\n- Classes processed: ${summary.totalClassesProcessed}\n- Students removed: ${summary.totalStudentsRemoved}\n- Deleted students removed: ${summary.totalDeletedStudentsRemoved}\n- Classes modified: ${summary.classesModified}`);

        // Refresh the class list
        if (onRefresh) {
          onRefresh();
        }
      }
    } catch (error) {
      console.error('Error cleaning spots:', error);
      alert(error.response?.data?.message || 'Failed to clean and reset available spots');
    } finally {
      setCleaningSpots(false);
    }
  };

  // Handle viewing students for a class
  const handleViewStudents = async (classItem) => {
    setSelectedClassForStudents(classItem);
    setViewStudentsDialog(true);
    setLoadingClassStudents(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/classes/${classItem._id}/students`,
        { headers: { 'x-auth-token': token } }
      );
      setClassStudents(response.data.students || []);
    } catch (error) {
      console.error('Error fetching class students:', error);
      setClassStudents([]);
    } finally {
      setLoadingClassStudents(false);
    }
  };

  const handleStudentsSearch = (event) => {
    setStudentsSearchTerm(event.target.value);
  };

  // Filter students based on search term
  const filteredStudents = classStudents.filter(student => {
    if (!studentsSearchTerm.trim()) return true;
    const searchTerm = studentsSearchTerm.trim().toLowerCase();
    return (
      student.studentId.toLowerCase().includes(searchTerm) ||
      student.firstName.toLowerCase().includes(searchTerm) ||
      student.lastName.toLowerCase().includes(searchTerm) ||
      (student.fullName && student.fullName.toLowerCase().includes(searchTerm))
    );
  });

  // Mobile Card View
  const MobileClassCard = ({ classItem, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card sx={{ mb: 2, borderRadius: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box>
              <Typography variant="h6" sx={{
                fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                fontWeight: 'bold'
              }}>
                {classItem.grade}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                <Chip
                  label={classItem.type === 'Normal' ? 'සාමාන්‍ය' : 'විශේෂ'}
                  color={getTypeChipColor(classItem.type)}
                  size="small"
                />
                <Chip
                  label={classItem.category || 'N/A'}
                  color="default"
                  size="small"
                  variant="outlined"
                />
                <Chip
                  label={classItem.platform || 'Physical'}
                  color={getPlatformChipColor(classItem.platform)}
                  size="small"
                  variant="outlined"
                />
                <Chip
                  label={classItem.isActive ? 'සක්‍රීය' : 'අක්‍රීය'}
                  color={getStatusChipColor(classItem.isActive)}
                  size="small"
                />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
              <Tooltip title="සිසුන් බලන්න">
                <IconButton
                  size="small"
                  color="info"
                  onClick={() => handleViewStudents(classItem)}
                  sx={{
                    bgcolor: 'rgba(33, 150, 243, 0.1)',
                    '&:hover': { bgcolor: 'rgba(33, 150, 243, 0.2)' }
                  }}
                >
                  <GroupIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="පන්තියට ප්‍රවේශය">
                <IconButton
                  size="small"
                  color="success"
                  onClick={() => navigate(`/class/${classItem._id}`)}
                  sx={{
                    bgcolor: 'rgba(76, 175, 80, 0.1)',
                    '&:hover': { bgcolor: 'rgba(76, 175, 80, 0.2)' }
                  }}
                >
                  <AccessIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="සංස්කරණය කරන්න">
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => onEdit(classItem)}
                  sx={{
                    bgcolor: 'rgba(102, 126, 234, 0.1)',
                    '&:hover': { bgcolor: 'rgba(102, 126, 234, 0.2)' }
                  }}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="මකන්න">
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => onDelete(classItem)}
                  sx={{
                    bgcolor: 'rgba(244, 67, 54, 0.1)',
                    '&:hover': { bgcolor: 'rgba(244, 67, 54, 0.2)' }
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <CalendarIcon fontSize="small" color="action" />
                <Typography variant="body2">{classItem.date}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <TimeIcon fontSize="small" color="action" />
                <Typography variant="body2">
                  {formatTime(classItem.startTime)} - {formatTime(classItem.endTime)}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <LocationIcon fontSize="small" color="action" />
                <Typography variant="body2" noWrap>{classItem.venue}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <PeopleIcon fontSize="small" color="action" />
                <Typography variant="body2">
                  {classItem.enrolledCount || 0}/{classItem.capacity} ({classItem.availableSpots || (classItem.capacity - (classItem.enrolledCount || 0))})
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {classItem.specialNote && (
            <Box sx={{ mt: 2, p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary">
                {classItem.specialNote}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <Paper elevation={3} sx={{ borderRadius: 3 }}>
      {/* Filters */}
      <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Grid container spacing={2} alignItems="center">
          {/* First Row */}
          <Grid item xs={12} md={2.4}>
            <TextField
              fullWidth
              label="සොයන්න"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={1.8}>
            <FormControl fullWidth size="small" sx={{ minWidth: '200px' }}>
              <InputLabel>වර්ගය</InputLabel>
              <Select
                value={typeFilter}
                label="වර්ගය"
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <MenuItem value="">සියල්ල</MenuItem>
                <MenuItem value="Normal">සාමාන්‍ය</MenuItem>
                <MenuItem value="Special">විශේෂ/අමතර</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={1.8}>
            <FormControl fullWidth size="small" sx={{ minWidth: '200px' }}>
              <InputLabel>ප්‍රවර්ගය</InputLabel>
              <Select
                value={categoryFilter}
                label="ප්‍රවර්ගය"
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <MenuItem value="">සියල්ල</MenuItem>
                {uniqueCategories.map((category) => (
                  <MenuItem key={category} value={category}>{category}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth size="small" sx={{ minWidth: '200px' }}>
              <InputLabel>ශ්‍රේණිය</InputLabel>
              <Select
                value={gradeFilter}
                label="ශ්‍රේණිය"
                onChange={(e) => setGradeFilter(e.target.value)}
              >
                <MenuItem value="">සියල්ල</MenuItem>
                {uniqueGrades.map((grade) => (
                  <MenuItem key={grade} value={grade}>{grade}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                මුළු පන්ති: {filteredClasses.length}
              </Typography>
              <Button
                variant="contained"
                color="warning"
                size="small"
                startIcon={cleaningSpots ? <CircularProgress size={16} color="inherit" /> : <CleanIcon />}
                onClick={handleCleanAndResetSpots}
                disabled={cleaningSpots}
                sx={{
                  fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                  fontWeight: 'bold',
                  borderRadius: 2,
                  textTransform: 'none'
                }}
              >
                {cleaningSpots ? 'තහවුරු කරමින්...' : 'පන්ති වල ඉතිරි ඉඩ ප්‍රමාණ තහවුරු කරන්න'}
              </Button>
            </Box>
          </Grid>

          {/* Second Row - Date Filters */}
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small" sx={{ minWidth: '200px' }}>
              <InputLabel>දින නම (සාමාන්‍ය පන්ති)</InputLabel>
              <Select
                value={dayNameFilter}
                label="දින නම (සාමාන්‍ය පන්ති)"
                onChange={(e) => setDayNameFilter(e.target.value)}
              >
                <MenuItem value="">සියල්ල</MenuItem>
                {sortedDayNames.map((dayName) => (
                  <MenuItem key={dayName} value={dayName}>{dayName}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="නිශ්චිත දිනය (විශේෂ පන්ති)"
                value={specificDateFilter}
                onChange={(newValue) => setSpecificDateFilter(newValue)}
                slotProps={{
                  textField: {
                    size: 'small',
                    fullWidth: true,
                    placeholder: 'YYYY-MM-DD',
                    sx: { minWidth: '200px' }
                  }
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  setDayNameFilter('');
                  setSpecificDateFilter(null);
                }}
                sx={{
                  fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                  textTransform: 'none'
                }}
              >
                දින ෆිල්ටර් ඉවත් කරන්න
              </Button>
              <Typography variant="caption" color="text.secondary">
                සාමාන්‍ය පන්ති සඳහා දින නම සහ විශේෂ පන්ති සඳහා නිශ්චිත දිනය භාවිතා කරන්න
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Content */}
      {filteredClasses.length === 0 ? (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <SchoolIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" sx={{
            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
          }}>
            පන්ති හමු නොවීය
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ඔබගේ සෙවුම් නිර්ණායක වෙනස් කර නැවත උත්සාහ කරන්න
          </Typography>
        </Box>
      ) : isMobile ? (
        // Mobile View
        <Box sx={{ p: 2 }}>
          {filteredClasses
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((classItem, index) => (
              <MobileClassCard
                key={classItem._id}
                classItem={classItem}
                index={index}
              />
            ))}
        </Box>
      ) : (
        // Desktop Table View
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>ශ්‍රේණිය</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>වර්ගය</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>ප්‍රවර්ගය</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Platform</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>දිනය</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>වේලාව</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>ස්ථානය</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>ධාරිතාව</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>තත්වය</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>ක්‍රියාමාර්ග</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredClasses
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((classItem, index) => (
                  <motion.tr
                    key={classItem._id}
                    component={TableRow}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    hover
                  >
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {classItem.grade}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={classItem.type === 'Normal' ? 'සාමාන්‍ය' : 'විශේෂ/අමතර'}
                        color={getTypeChipColor(classItem.type)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {classItem.category || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={classItem.platform || 'Physical'}
                        color={getPlatformChipColor(classItem.platform)}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{classItem.date}</TableCell>
                    <TableCell>
                      {formatTime(classItem.startTime)} - {formatTime(classItem.endTime)}
                    </TableCell>
                    <TableCell>
                      <Tooltip title={classItem.venue}>
                        <Typography variant="body2" noWrap sx={{ maxWidth: 150 }}>
                          {classItem.venue}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PeopleIcon fontSize="small" color="action" />
                        {classItem.enrolledCount || 0}/{classItem.capacity} ({classItem.availableSpots || (classItem.capacity - (classItem.enrolledCount || 0))})
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={classItem.isActive ? 'සක්‍රීය' : 'අක්‍රීය'}
                        color={getStatusChipColor(classItem.isActive)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="සිසුන් බලන්න">
                          <IconButton
                            size="small"
                            color="info"
                            onClick={() => handleViewStudents(classItem)}
                            sx={{
                              bgcolor: 'rgba(33, 150, 243, 0.1)',
                              '&:hover': { bgcolor: 'rgba(33, 150, 243, 0.2)' }
                            }}
                          >
                            <GroupIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="පන්තියට ප්‍රවේශය">
                          <IconButton
                            size="small"
                            color="success"
                            onClick={() => navigate(`/class/${classItem._id}`)}
                            sx={{
                              bgcolor: 'rgba(76, 175, 80, 0.1)',
                              '&:hover': { bgcolor: 'rgba(76, 175, 80, 0.2)' }
                            }}
                          >
                            <AccessIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="සංස්කරණය කරන්න">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => onEdit(classItem)}
                            sx={{
                              bgcolor: 'rgba(102, 126, 234, 0.1)',
                              '&:hover': { bgcolor: 'rgba(102, 126, 234, 0.2)' }
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="මකන්න">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => onDelete(classItem)}
                            sx={{
                              bgcolor: 'rgba(244, 67, 54, 0.1)',
                              '&:hover': { bgcolor: 'rgba(244, 67, 54, 0.2)' }
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </motion.tr>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Pagination */}
      {filteredClasses.length > 0 && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredClasses.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="පිටුවකට පේළි:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} of ${count !== -1 ? count : `more than ${to}`}`
          }
        />
      )}

      {/* View Students Dialog */}
      <Dialog
        open={viewStudentsDialog}
        onClose={() => setViewStudentsDialog(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle sx={{
          fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
          fontWeight: 'bold',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>
            {selectedClassForStudents ?
              `${selectedClassForStudents.grade} - ${selectedClassForStudents.category} පන්තියේ සිසුන්` :
              'පන්තියේ සිසුන්'
            }
          </span>
          <IconButton onClick={() => setViewStudentsDialog(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {/* Search Field */}
          <TextField
            fullWidth
            placeholder="සිසු ID හෝ නම අනුව සොයන්න..."
            value={studentsSearchTerm}
            onChange={handleStudentsSearch}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
            }}
            sx={{ mb: 3 }}
          />

          {loadingClassStudents ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : filteredStudents.length > 0 ? (
            <TableContainer component={Paper} sx={{ mt: 2, maxHeight: 500 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif' }}>
                      ප්‍රොෆයිල් පින්තූරය
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif' }}>
                      සිසු ID
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif' }}>
                      නම
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif' }}>
                      ශ්‍රේණිය
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif' }}>
                      පාසල
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif' }}>
                      සම්බන්ධතා අංකය
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif' }}>
                      ක්‍රියාමාර්ග
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student._id} hover>
                      <TableCell>
                        <Avatar
                          src={student.profilePicture}
                          sx={{ width: 40, height: 40 }}
                        >
                          {student.firstName?.charAt(0)}
                        </Avatar>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={student.studentId}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {student.firstName} {student.lastName}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {student.selectedGrade}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {student.school}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {student.contactNumber}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<Visibility />}
                          sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                            fontWeight: 'bold',
                            textTransform: 'none',
                            borderRadius: 2,
                            '&:hover': {
                              background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                              transform: 'scale(1.02)',
                            },
                            transition: 'all 0.3s ease'
                          }}
                        >
                          ප්‍රොෆයිලය සහ ප්‍රගතිය
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Alert severity="info">
              {studentsSearchTerm ? 'සෙවුම සඳහා ප්‍රතිඵල හමු නොවීය' : 'මෙම පන්තියට ලියාපදිංචි වූ සිසුන් නොමැත'}
            </Alert>
          )}
        </DialogContent>
      </Dialog>
    </Paper>
  );
};

export default ClassList;
