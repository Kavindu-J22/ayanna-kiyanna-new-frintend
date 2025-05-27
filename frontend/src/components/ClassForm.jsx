import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Box,
  Typography,
  IconButton,
  Autocomplete,
  Chip
} from '@mui/material';
import {
  Close as CloseIcon,
  Add as AddIcon,
  AccessTime as TimeIcon,
  CalendarToday as CalendarIcon,
  School as SchoolIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const ClassForm = ({ open, onClose, onSubmit, editingClass }) => {
  const [formData, setFormData] = useState({
    type: '',
    grade: '',
    date: '',
    startTime: '',
    endTime: '',
    venue: '',
    capacity: '',
    specialNote: '',
    isActive: true
  });

  const [availableGrades, setAvailableGrades] = useState([]);
  const [availableVenues, setAvailableVenues] = useState([]);
  const [customGrade, setCustomGrade] = useState('');
  const [customVenue, setCustomVenue] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [errors, setErrors] = useState({});

  const weekdays = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday',
    'Thursday', 'Friday', 'Saturday'
  ];

  const defaultGrades = [
    'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'A/L', 'Sinhala Literature'
  ];

  const defaultVenues = [
    'Home(Group Class)',
    'Manawa (Hall class)',
    'Yatiyanthota Nethma (Hall class)'
  ];

  useEffect(() => {
    if (open) {
      fetchDropdownData();
      if (editingClass) {
        setFormData({
          type: editingClass.type || '',
          grade: editingClass.grade || '',
          date: editingClass.date || '',
          startTime: editingClass.startTime || '',
          endTime: editingClass.endTime || '',
          venue: editingClass.venue || '',
          capacity: editingClass.capacity || '',
          specialNote: editingClass.specialNote || '',
          isActive: editingClass.isActive !== undefined ? editingClass.isActive : true
        });

        // Handle date for special classes
        if (editingClass.type === 'Special' && editingClass.date) {
          try {
            setSelectedDate(new Date(editingClass.date));
          } catch (e) {
            setSelectedDate(null);
          }
        }
      } else {
        resetForm();
      }
    }
  }, [open, editingClass]);

  const fetchDropdownData = async () => {
    try {
      const token = localStorage.getItem('token');

      // Initialize with default values first
      setAvailableGrades([...defaultGrades]);
      setAvailableVenues([...defaultVenues]);

      // Try to fetch additional grades from backend
      try {
        const gradesResponse = await fetch('https://ayanna-kiyanna-new-backend.onrender.com/api/classes/grades', {
          headers: { 'x-auth-token': token }
        });
        if (gradesResponse.ok) {
          const grades = await gradesResponse.json();
          // Merge with defaults and remove duplicates
          const allGrades = [...new Set([...defaultGrades, ...grades])];
          setAvailableGrades(allGrades.sort());
        }
      } catch (err) {
        console.log('Could not fetch grades from backend, using defaults');
      }

      // Try to fetch additional venues from backend
      try {
        const venuesResponse = await fetch('https://ayanna-kiyanna-new-backend.onrender.com/api/classes/venues', {
          headers: { 'x-auth-token': token }
        });
        if (venuesResponse.ok) {
          const venues = await venuesResponse.json();
          // Merge with defaults and remove duplicates
          const allVenues = [...new Set([...defaultVenues, ...venues])];
          setAvailableVenues(allVenues.sort());
        }
      } catch (err) {
        console.log('Could not fetch venues from backend, using defaults');
      }
    } catch (error) {
      console.error('Error fetching dropdown data:', error);
      // Fallback to defaults
      setAvailableGrades([...defaultGrades]);
      setAvailableVenues([...defaultVenues]);
    }
  };

  const resetForm = () => {
    setFormData({
      type: '',
      grade: '',
      date: '',
      startTime: '',
      endTime: '',
      venue: '',
      capacity: '',
      specialNote: '',
      isActive: true
    });
    setSelectedDate(null);
    setCustomGrade('');
    setCustomVenue('');
    setErrors({});
  };

  const removeGrade = (gradeToRemove) => {
    if (!defaultGrades.includes(gradeToRemove)) {
      setAvailableGrades(prev => prev.filter(grade => grade !== gradeToRemove));
      if (formData.grade === gradeToRemove) {
        setFormData(prev => ({ ...prev, grade: '' }));
      }
    }
  };

  const removeVenue = (venueToRemove) => {
    if (!defaultVenues.includes(venueToRemove)) {
      setAvailableVenues(prev => prev.filter(venue => venue !== venueToRemove));
      if (formData.venue === venueToRemove) {
        setFormData(prev => ({ ...prev, venue: '' }));
      }
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }

    // Handle type change
    if (field === 'type') {
      setFormData(prev => ({
        ...prev,
        date: ''
      }));
      setSelectedDate(null);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (date) {
      setFormData(prev => ({
        ...prev,
        date: date.toISOString().split('T')[0]
      }));
    }
  };

  const addCustomGrade = () => {
    if (customGrade.trim() && !availableGrades.includes(customGrade.trim())) {
      const newGrade = customGrade.trim();
      setAvailableGrades(prev => [...prev, newGrade].sort());
      setFormData(prev => ({ ...prev, grade: newGrade }));
      setCustomGrade('');
    }
  };

  const addCustomVenue = () => {
    if (customVenue.trim() && !availableVenues.includes(customVenue.trim())) {
      const newVenue = customVenue.trim();
      setAvailableVenues(prev => [...prev, newVenue].sort());
      setFormData(prev => ({ ...prev, venue: newVenue }));
      setCustomVenue('');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.type) newErrors.type = 'Type is required';
    if (!formData.grade) newErrors.grade = 'Grade is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.startTime) newErrors.startTime = 'Start time is required';
    if (!formData.endTime) newErrors.endTime = 'End time is required';
    if (!formData.venue) newErrors.venue = 'Venue is required';
    if (!formData.capacity) newErrors.capacity = 'Capacity is required';

    // Validate time format
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (formData.startTime && !timeRegex.test(formData.startTime)) {
      newErrors.startTime = 'Invalid time format (HH:MM)';
    }
    if (formData.endTime && !timeRegex.test(formData.endTime)) {
      newErrors.endTime = 'Invalid time format (HH:MM)';
    }

    // Validate time logic
    if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
      newErrors.endTime = 'End time must be after start time';
    }

    // Validate capacity
    const capacity = parseInt(formData.capacity);
    if (formData.capacity && (isNaN(capacity) || capacity < 1 || capacity > 500)) {
      newErrors.capacity = 'Capacity must be between 1 and 500';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        scroll="paper"
      >
        <DialogTitle sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SchoolIcon />
            {editingClass ? 'පන්තිය සංස්කරණය කරන්න' : 'නව පන්තියක් එකතු කරන්න'}
          </Box>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{
              mb: 2,
              fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
              color: '#333',
              borderBottom: '2px solid #667eea',
              pb: 1
            }}>
              මූලික තොරතුරු
            </Typography>
            <Grid container spacing={3}>
              {/* 1. FIRST FIELD: Type Selection - Full Width */}
              <Grid item xs={12}>
                <FormControl fullWidth error={!!errors.type}>
                  <InputLabel>පන්ති වර්ගය *</InputLabel>
                  <Select
                    value={formData.type}
                    label="පන්ති වර්ගය *"
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    sx={{
                      minWidth: '200px',
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': { borderColor: '#667eea' },
                        '&.Mui-focused fieldset': { borderColor: '#667eea' },
                        fontSize: '1.1rem',
                        minWidth: '200px'
                      }
                    }}
                  >
                    <MenuItem value="Normal">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarIcon fontSize="small" />
                        සාමාන්‍ය පන්තිය
                      </Box>
                    </MenuItem>
                    <MenuItem value="Special">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TimeIcon fontSize="small" />
                        විශේෂ පන්තිය
                      </Box>
                    </MenuItem>
                  </Select>
                  {errors.type && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                      {errors.type}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              {/* 2. SECOND FIELD: Grade Selection - Full Width */}
              <Grid item xs={12}>
                <Box>
                  <Autocomplete
                    value={formData.grade}
                    onChange={(_, newValue) => handleInputChange('grade', newValue || '')}
                    options={availableGrades}
                    freeSolo
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="ශ්‍රේණිය *"
                        error={!!errors.grade}
                        helperText={errors.grade}
                        fullWidth
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': { borderColor: '#667eea' },
                            '&.Mui-focused fieldset': { borderColor: '#667eea' }
                          }
                        }}
                      />
                    )}
                  />
                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    <TextField
                      size="small"
                      placeholder="නව ශ්‍රේණියක් එකතු කරන්න"
                      value={customGrade}
                      onChange={(e) => setCustomGrade(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addCustomGrade()}
                      sx={{ flexGrow: 1 }}
                    />
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={addCustomGrade}
                      startIcon={<AddIcon />}
                      disabled={!customGrade.trim()}
                      sx={{
                        borderColor: '#667eea',
                        color: '#667eea',
                        '&:hover': { borderColor: '#5a6fd8', bgcolor: 'rgba(102, 126, 234, 0.04)' }
                      }}
                    >
                      එකතු කරන්න
                    </Button>
                  </Box>

                  {/* Available Grades with Remove Option */}
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                      ලබා ගත හැකි ශ්‍රේණි:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {availableGrades.map((grade) => (
                        <Chip
                          key={grade}
                          label={grade}
                          size="small"
                          variant={defaultGrades.includes(grade) ? "filled" : "outlined"}
                          color={defaultGrades.includes(grade) ? "primary" : "default"}
                          onDelete={!defaultGrades.includes(grade) ? () => removeGrade(grade) : undefined}
                          deleteIcon={<DeleteIcon />}
                          sx={{
                            fontSize: '0.75rem',
                            '& .MuiChip-deleteIcon': {
                              fontSize: '16px'
                            }
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{
              mb: 2,
              fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
              color: '#333',
              borderBottom: '2px solid #667eea',
              pb: 1
            }}>
              දිනය සහ වේලාව
            </Typography>
            <Grid container spacing={3}>
              {/* 1. FIRST FIELD: Date Selection - Full Width */}
              <Grid item xs={12}>
                {formData.type === 'Normal' ? (
                  <FormControl fullWidth error={!!errors.date}>
                    <InputLabel>දිනය *</InputLabel>
                    <Select
                      value={formData.date}
                      label="දිනය *"
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      sx={{
                        minWidth: '200px',
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': { borderColor: '#667eea' },
                          '&.Mui-focused fieldset': { borderColor: '#667eea' },
                          fontSize: '1.1rem',
                          minWidth: '200px'
                        }
                      }}
                    >
                      {weekdays.map((day) => (
                        <MenuItem key={day} value={day}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CalendarIcon fontSize="small" />
                            {day}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.date && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                        {errors.date}
                      </Typography>
                    )}
                  </FormControl>
                ) : (
                  <DatePicker
                    label="දිනය *"
                    value={selectedDate}
                    onChange={handleDateChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        error={!!errors.date}
                        helperText={errors.date}
                        sx={{
                          minWidth: '200px',
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': { borderColor: '#667eea' },
                            '&.Mui-focused fieldset': { borderColor: '#667eea' },
                            fontSize: '1.1rem',
                            minWidth: '200px'
                          }
                        }}
                      />
                    )}
                  />
                )}
              </Grid>

              {/* 2. SECOND FIELD: Time Fields - Second Row */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="ආරම්භ වේලාව *"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => handleInputChange('startTime', e.target.value)}
                  error={!!errors.startTime}
                  helperText={errors.startTime}
                  slotProps={{
                    inputLabel: { shrink: true },
                    htmlInput: {
                      style: {
                        fontSize: '1.1rem',
                        padding: '16px 14px',
                        cursor: 'pointer'
                      }
                    }
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': { borderColor: '#667eea' },
                      '&.Mui-focused fieldset': { borderColor: '#667eea' },
                      fontSize: '1.1rem',
                      cursor: 'pointer'
                    },
                    '& .MuiInputBase-input': {
                      cursor: 'pointer'
                    }
                  }}
                  onClick={(e) => e.target.showPicker && e.target.showPicker()}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="අවසාන වේලාව *"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => handleInputChange('endTime', e.target.value)}
                  error={!!errors.endTime}
                  helperText={errors.endTime}
                  slotProps={{
                    inputLabel: { shrink: true },
                    htmlInput: {
                      style: {
                        fontSize: '1.1rem',
                        padding: '16px 14px',
                        cursor: 'pointer'
                      }
                    }
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': { borderColor: '#667eea' },
                      '&.Mui-focused fieldset': { borderColor: '#667eea' },
                      fontSize: '1.1rem',
                      cursor: 'pointer'
                    },
                    '& .MuiInputBase-input': {
                      cursor: 'pointer'
                    }
                  }}
                  onClick={(e) => e.target.showPicker && e.target.showPicker()}
                />
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{
              mb: 2,
              fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
              color: '#333',
              borderBottom: '2px solid #667eea',
              pb: 1
            }}>
              ස්ථානය සහ ධාරිතාව
            </Typography>
            <Grid container spacing={3}>
              {/* Venue Selection */}
              <Grid item xs={12} md={8}>
                <Box>
                  <Autocomplete
                    value={formData.venue}
                    onChange={(_, newValue) => handleInputChange('venue', newValue || '')}
                    options={availableVenues}
                    freeSolo
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="ස්ථානය *"
                        error={!!errors.venue}
                        helperText={errors.venue}
                        fullWidth
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': { borderColor: '#667eea' },
                            '&.Mui-focused fieldset': { borderColor: '#667eea' }
                          }
                        }}
                      />
                    )}
                  />
                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    <TextField
                      size="small"
                      placeholder="නව ස්ථානයක් එකතු කරන්න"
                      value={customVenue}
                      onChange={(e) => setCustomVenue(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addCustomVenue()}
                      sx={{ flexGrow: 1 }}
                    />
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={addCustomVenue}
                      startIcon={<AddIcon />}
                      disabled={!customVenue.trim()}
                      sx={{
                        borderColor: '#667eea',
                        color: '#667eea',
                        '&:hover': { borderColor: '#5a6fd8', bgcolor: 'rgba(102, 126, 234, 0.04)' }
                      }}
                    >
                      එකතු කරන්න
                    </Button>
                  </Box>

                  {/* Available Venues with Remove Option */}
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                      ලබා ගත හැකි ස්ථාන:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {availableVenues.map((venue) => (
                        <Chip
                          key={venue}
                          label={venue}
                          size="small"
                          variant={defaultVenues.includes(venue) ? "filled" : "outlined"}
                          color={defaultVenues.includes(venue) ? "primary" : "default"}
                          onDelete={!defaultVenues.includes(venue) ? () => removeVenue(venue) : undefined}
                          deleteIcon={<DeleteIcon />}
                          sx={{
                            fontSize: '0.75rem',
                            '& .MuiChip-deleteIcon': {
                              fontSize: '16px'
                            }
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                </Box>
              </Grid>

              {/* Capacity */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="ධාරිතාව (සිසුන්) *"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => handleInputChange('capacity', e.target.value)}
                  error={!!errors.capacity}
                  helperText={errors.capacity}
                  slotProps={{ htmlInput: { min: 1, max: 500 } }}
                  sx={{
                    minWidth: '150px',
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': { borderColor: '#667eea' },
                      '&.Mui-focused fieldset': { borderColor: '#667eea' }
                    }
                  }}
                />
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{
              mb: 2,
              fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
              color: '#333',
              borderBottom: '2px solid #667eea',
              pb: 1
            }}>
              අමතර තොරතුරු
            </Typography>
            <Grid container spacing={3}>
              {/* Active Status */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>පන්ති තත්වය *</InputLabel>
                  <Select
                    value={formData.isActive}
                    label="පන්ති තත්වය *"
                    onChange={(e) => handleInputChange('isActive', e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': { borderColor: '#667eea' },
                        '&.Mui-focused fieldset': { borderColor: '#667eea' }
                      }
                    }}
                  >
                    <MenuItem value={true}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip label="සක්‍රීය" color="success" size="small" />
                        සක්‍රීය පන්තිය
                      </Box>
                    </MenuItem>
                    <MenuItem value={false}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip label="අක්‍රීය" color="default" size="small" />
                        අක්‍රීය පන්තිය
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Special Note */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="විශේෂ සටහන (අමතර)"
                  multiline
                  rows={4}
                  value={formData.specialNote}
                  onChange={(e) => handleInputChange('specialNote', e.target.value)}
                  slotProps={{ htmlInput: { maxLength: 500 } }}
                  helperText={`${formData.specialNote.length}/500 අකුරු`}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': { borderColor: '#667eea' },
                      '&.Mui-focused fieldset': { borderColor: '#667eea' }
                    }
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose}>
            අවලංගු කරන්න
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              bgcolor: '#667eea',
              '&:hover': { bgcolor: '#5a6fd8' }
            }}
          >
            {editingClass ? 'යාවත්කාලීන කරන්න' : 'සුරකින්න'}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default ClassForm;
