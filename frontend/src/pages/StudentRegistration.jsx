import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  FormLabel,
  Avatar,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  IconButton,
  Chip,
  Skeleton,
  Badge,
  Tooltip
} from '@mui/material';
import {
  Person,
  School,
  FamilyRestroom,
  Class as ClassIcon,
  Security,
  Check,
  ArrowBack,
  ArrowForward,
  PhotoCamera,
  ContentCopy,
  Groups,
  Schedule,
  LocationOn,
  Computer,
  Warning,
  CheckCircle
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const StudentRegistration = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [availableGrades, setAvailableGrades] = useState([]);
  const [availableClasses, setAvailableClasses] = useState([]);
  const [useContactForWhatsapp, setUseContactForWhatsapp] = useState(false);

  // Form data state
  const [formData, setFormData] = useState({
    // Personal Information
    surname: '',
    firstName: '',
    lastName: '',
    contactNumber: '',
    whatsappNumber: '',
    email: localStorage.getItem('userEmail') || '',
    address: '',
    school: '',
    gender: '',
    birthday: '',
    age: '',
    currentStudent: '',
    profilePicture: '',

    // Guardian Information
    guardianName: '',
    guardianType: '',
    guardianContact: '',

    // Academic Information
    selectedGrade: '',
    enrolledClasses: [],

    // Credentials
    studentPassword: '',
    confirmPassword: '',

    // Agreement
    agreedToTerms: false
  });

  const steps = [
    'Personal Information',
    'Guardian Information',
    'Academic Information',
    'Security & Agreement'
  ];

  const fetchAvailableGrades = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://ayanna-kiyanna-new-backend.onrender.com/api/students/grades', {
        headers: { 'x-auth-token': token }
      });
      setAvailableGrades(response.data.grades);
    } catch (error) {
      console.error('Error fetching grades:', error);
    }
  }, []);

  const fetchUserRoleAndValidate = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://ayanna-kiyanna-new-backend.onrender.com/api/auth/me', {
        headers: { 'x-auth-token': token }
      });

      const userRole = response.data.role;

      if (userRole === 'student') {
        setError('You are already registered as a student. Use your personal student dashboard.');
        setTimeout(() => navigate('/'), 3000);
        return;
      }

      if (!['user', 'admin', 'moderator'].includes(userRole)) {
        setError('Only users with appropriate roles can register as students');
        setTimeout(() => navigate('/'), 3000);
        return;
      }

      // If validation passes, fetch available grades
      fetchAvailableGrades();
    } catch (error) {
      console.error('Error fetching user role:', error);
      if (error.response?.status === 401) {
        setError('Your session has expired. Please login again.');
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userRole');
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setError('Failed to verify user permissions. Please try again.');
        setTimeout(() => navigate('/'), 3000);
      }
    }
  }, [navigate, fetchAvailableGrades]);

  useEffect(() => {
    // Check if user is logged in and fetch role from database
    const userEmail = localStorage.getItem('userEmail');
    const token = localStorage.getItem('token');

    if (!userEmail || !token) {
      setError('Please login first to register as a student');
      setTimeout(() => navigate('/login'), 3000);
      return;
    }

    // Fetch user role from database
    fetchUserRoleAndValidate();
  }, [fetchUserRoleAndValidate, navigate]);

  const fetchAvailableClasses = async (grade) => {
    try {
      setLoadingClasses(true);
      setAvailableClasses([]);
      const token = localStorage.getItem('token');
      const response = await axios.get(`https://ayanna-kiyanna-new-backend.onrender.com/api/students/available-classes?grade=${grade}`, {
        headers: { 'x-auth-token': token }
      });
      setAvailableClasses(response.data.classes);
    } catch (error) {
      console.error('Error fetching classes:', error);
      setError('Failed to fetch available classes. Please try again.');
    } finally {
      setLoadingClasses(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Auto-fill WhatsApp number if checkbox is checked
    if (field === 'contactNumber' && useContactForWhatsapp) {
      setFormData(prev => ({
        ...prev,
        whatsappNumber: value
      }));
    }

    // Fetch classes when grade is selected
    if (field === 'selectedGrade' && value) {
      fetchAvailableClasses(value);
    }

    // Calculate age when birthday is selected
    if (field === 'birthday' && value) {
      const birthDate = new Date(value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      // Adjust age if birthday hasn't occurred this year
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      setFormData(prev => ({
        ...prev,
        [field]: value,
        age
      }));
      return;
    }
  };

  const handleUseContactForWhatsapp = (checked) => {
    setUseContactForWhatsapp(checked);
    if (checked) {
      setFormData(prev => ({
        ...prev,
        whatsappNumber: prev.contactNumber
      }));
    }
  };

  const handleProfilePictureUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Profile picture must be less than 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'ml_default');
      formData.append('cloud_name', 'dl9k5qoae');

      const response = await fetch('https://api.cloudinary.com/v1_1/dl9k5qoae/image/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.secure_url) {
        setFormData(prev => ({
          ...prev,
          profilePicture: data.secure_url
        }));
        setError('');
      } else {
        setError('Failed to upload image. Please try again.');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Failed to upload image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClassSelection = (classId, classItem) => {
    // Check if class is at capacity
    if (classItem.enrolledStudents >= classItem.capacity) {
      setError(`Class "${classItem.grade} - ${classItem.category}" is at full capacity (${classItem.capacity} students). Please select another class.`);
      return;
    }

    setFormData(prev => ({
      ...prev,
      enrolledClasses: prev.enrolledClasses.includes(classId)
        ? prev.enrolledClasses.filter(id => id !== classId)
        : [...prev.enrolledClasses, classId]
    }));
    setError(''); // Clear any previous capacity errors
  };

  // Validation functions
  const validateAge = (birthday) => {
    if (!birthday || birthday === '') return false;
    try {
      const birthDate = new Date(birthday);
      if (isNaN(birthDate.getTime())) return false;

      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      return age >= 13;
    } catch (error) {
      return false;
    }
  };

  const validateContactNumber = (number) => {
    if (!number || typeof number !== 'string') return false;
    // Sri Lankan phone number validation (10 digits starting with 0)
    const phoneRegex = /^0[0-9]{9}$/;
    return phoneRegex.test(number.trim());
  };

  const validateWhatsAppNumber = (number) => {
    if (!number || typeof number !== 'string') return false;
    // WhatsApp number validation (can be international format)
    const whatsappRegex = /^(\+94|0)[0-9]{9}$/;
    return whatsappRegex.test(number.trim());
  };

  const validateStep = (step) => {
    switch (step) {
      case 0: { // Personal Information
        const basicFieldsValid =
          (formData.surname || '').trim() &&
          (formData.firstName || '').trim() &&
          (formData.lastName || '').trim() &&
          (formData.contactNumber || '').trim() &&
          (formData.whatsappNumber || '').trim() &&
          (formData.email || '').trim() &&
          (formData.address || '').trim() &&
          (formData.school || '').trim() &&
          (formData.gender || '').trim() &&
          (formData.birthday || '').trim() &&
          (formData.currentStudent || '').trim() &&
          (formData.profilePicture || '').trim();

        const ageValid = validateAge(formData.birthday);
        const contactValid = validateContactNumber(formData.contactNumber);
        const whatsappValid = validateWhatsAppNumber(formData.whatsappNumber);

        return basicFieldsValid && ageValid && contactValid && whatsappValid;
      }
      case 1: // Guardian Information
        return (formData.guardianName || '').trim() &&
               (formData.guardianType || '').trim() &&
               (formData.guardianContact || '').trim();
      case 2: // Academic Information
        return (formData.selectedGrade || '').trim() &&
               formData.enrolledClasses &&
               formData.enrolledClasses.length > 0;
      case 3: // Security & Agreement
        return (formData.studentPassword || '').trim() &&
               (formData.confirmPassword || '').trim() &&
               formData.studentPassword === formData.confirmPassword &&
               (formData.studentPassword || '').length >= 6 &&
               formData.agreedToTerms;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
      setError('');
    } else {
      // Provide specific error messages based on the step
      switch (activeStep) {
        case 0:
          if (!formData.profilePicture) {
            setError('Profile picture is required. Please upload a profile picture.');
          } else if (!validateAge(formData.birthday)) {
            setError('You must be at least 13 years old to register.');
          } else if (!validateContactNumber(formData.contactNumber)) {
            setError('Please enter a valid Sri Lankan contact number (10 digits starting with 0).');
          } else if (!validateWhatsAppNumber(formData.whatsappNumber)) {
            setError('Please enter a valid WhatsApp number.');
          } else {
            setError('Please fill in all required fields correctly.');
          }
          break;
        case 1:
          setError('Please fill in all guardian information fields.');
          break;
        case 2:
          setError('Please select your grade and at least one class to enroll.');
          break;
        case 3:
          if ((formData.studentPassword || '').length < 6) {
            setError('Password must be at least 6 characters long.');
          } else if ((formData.studentPassword || '') !== (formData.confirmPassword || '')) {
            setError('Passwords do not match.');
          } else if (!formData.agreedToTerms) {
            setError('Please agree to the terms and conditions.');
          } else {
            setError('Please complete all required fields.');
          }
          break;
        default:
          setError('Please fill in all required fields correctly.');
      }
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
    setError('');
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) {
      setError('Please complete all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');

      await axios.post(
        'https://ayanna-kiyanna-new-backend.onrender.com/api/students/register',
        formData,
        {
          headers: { 'x-auth-token': token }
        }
      );

      setSuccess('Student registration submitted successfully! Waiting for admin approval.');

      // Update localStorage with new role
      localStorage.setItem('userRole', 'student');

      setTimeout(() => {
        navigate('/student-dashboard');
      }, 3000);
    } catch (error) {
      console.error('Registration error:', error);
      console.error('Error response:', error.response?.data);

      if (error.response?.data?.details) {
        setError(`Registration failed: ${error.response.data.details.join(', ')}`);
      } else if (error.response?.data?.errors) {
        const errorMessages = error.response.data.errors.map(err => err.msg).join(', ');
        setError(`Validation errors: ${errorMessages}`);
      } else {
        setError(error.response?.data?.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (error && !success) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button onClick={() => navigate('/')} startIcon={<ArrowBack />}>
          Back to Home
        </Button>
      </Container>
    );
  }

  if (success) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
        <Typography variant="body1" sx={{ textAlign: 'center', mt: 2 }}>
          Redirecting to student dashboard...
        </Typography>
      </Container>
    );
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 25%, #45B7D1 50%, #96CEB4 75%, #FFEAA7 100%)',
      py: 4,
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 107, 107, 0.3) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(78, 205, 196, 0.3) 0%, transparent 50%)',
        zIndex: 1
      }
    }}>
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Paper elevation={12} sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #FF6B6B 0%, #4ECDC4 25%, #45B7D1 50%, #96CEB4 75%, #FFEAA7 100%)',
              zIndex: 1
            }
          }}>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 4, position: 'relative', zIndex: 2 }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Avatar sx={{
                  background: 'linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)',
                  width: 100,
                  height: 100,
                  mx: 'auto',
                  mb: 3,
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                  border: '3px solid rgba(255, 255, 255, 0.8)'
                }}>
                  <School sx={{ fontSize: 50, color: 'white' }} />
                </Avatar>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Typography variant="h3" component="h1" gutterBottom sx={{
                  fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                  fontWeight: 'bold',
                  background: 'linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1
                }}>
                  සිසු ලියාපදිංචිය
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
                  Student Registration Form
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>
                  Join our learning community today!
                </Typography>
              </motion.div>
            </Box>

            {/* Stepper */}
            <Stepper
              activeStep={activeStep}
              sx={{
                mb: 4,
                '& .MuiStepLabel-label': {
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  fontWeight: 'bold'
                },
                '& .MuiStepIcon-root': {
                  fontSize: { xs: '1.2rem', sm: '1.5rem' }
                }
              }}
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {/* Step Content */}
            <Box sx={{
              minHeight: { xs: 300, md: 400 },
              px: { xs: 1, sm: 2 }
            }}>
              {activeStep === 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Typography variant="h6" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                    <Person sx={{ mr: 1 }} />
                    Personal Information
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Surname"
                        value={formData.surname || ''}
                        onChange={(e) => handleInputChange('surname', e.target.value)}
                        required
                        sx={{ minWidth: 200 }}
                        error={formData.surname && formData.surname.length < 2}
                        helperText={formData.surname && formData.surname.length < 2 ? 'Surname must be at least 2 characters' : ''}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="First Name"
                        value={formData.firstName || ''}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        required
                        sx={{ minWidth: 200 }}
                        error={formData.firstName && formData.firstName.length < 2}
                        helperText={formData.firstName && formData.firstName.length < 2 ? 'First name must be at least 2 characters' : ''}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Last Name"
                        value={formData.lastName || ''}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        required
                        sx={{ minWidth: 200 }}
                        error={formData.lastName && formData.lastName.length < 2}
                        helperText={formData.lastName && formData.lastName.length < 2 ? 'Last name must be at least 2 characters' : ''}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Contact Number"
                        value={formData.contactNumber || ''}
                        onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                        required
                        sx={{ minWidth: 200 }}
                        error={formData.contactNumber && !validateContactNumber(formData.contactNumber)}
                        helperText={formData.contactNumber && !validateContactNumber(formData.contactNumber) ? 'Enter valid Sri Lankan number (10 digits starting with 0)' : 'Example: 0771234567'}
                        placeholder="0771234567"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box>
                        <TextField
                          fullWidth
                          label="WhatsApp Number"
                          value={formData.whatsappNumber || ''}
                          onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
                          required
                          sx={{ minWidth: 200 }}
                          error={formData.whatsappNumber && !validateWhatsAppNumber(formData.whatsappNumber)}
                          helperText={formData.whatsappNumber && !validateWhatsAppNumber(formData.whatsappNumber) ? 'Enter valid WhatsApp number' : 'Example: 0771234567 or +94771234567'}
                          placeholder="0771234567"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={useContactForWhatsapp}
                              onChange={(e) => handleUseContactForWhatsapp(e.target.checked)}
                            />
                          }
                          label="Use contact number for the Whatsapp Numer (Auto Fill)"
                          sx={{ mt: 1 }}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        value={formData.email || ''}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                        sx={{ minWidth: 200 }}
                        helperText="Auto-filled from your account. You can edit if needed."
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Address"
                        multiline
                        rows={2}
                        value={formData.address || ''}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        required
                        sx={{ minWidth: 200 }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="School"
                        value={formData.school || ''}
                        onChange={(e) => handleInputChange('school', e.target.value)}
                        required
                        sx={{ minWidth: 200 }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth required sx={{ minWidth: 200 }}>
                        <InputLabel>Gender</InputLabel>
                        <Select
                          value={formData.gender || ''}
                          onChange={(e) => handleInputChange('gender', e.target.value)}
                          label="Gender"
                        >
                          <MenuItem value="Male">Male</MenuItem>
                          <MenuItem value="Female">Female</MenuItem>
                          <MenuItem value="Other">Other</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Birthday"
                        type="date"
                        value={formData.birthday || ''}
                        onChange={(e) => handleInputChange('birthday', e.target.value)}
                        slotProps={{ inputLabel: { shrink: true } }}
                        required
                        sx={{ minWidth: 200 }}
                        error={formData.birthday && !validateAge(formData.birthday)}
                        helperText={formData.birthday && !validateAge(formData.birthday) ? 'You must be at least 13 years old' : ''}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Age"
                        type="number"
                        value={formData.age || ''}
                        onChange={(e) => handleInputChange('age', e.target.value)}
                        slotProps={{ input: { readOnly: true } }}
                        helperText="Auto-calculated from birthday"
                        sx={{ minWidth: 200 }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl component="fieldset" required>
                        <FormLabel component="legend">Student Status</FormLabel>
                        <RadioGroup
                          value={formData.currentStudent || ''}
                          onChange={(e) => handleInputChange('currentStudent', e.target.value)}
                        >
                          <FormControlLabel value="Current Student" control={<Radio />} label="Current Student" />
                          <FormControlLabel value="New Student" control={<Radio />} label="New Student" />
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{
                        p: 3,
                        border: '2px dashed',
                        borderColor: formData.profilePicture ? 'success.main' : 'primary.main',
                        borderRadius: 2,
                        textAlign: 'center',
                        bgcolor: formData.profilePicture ? 'success.50' : 'primary.50',
                        transition: 'all 0.3s ease'
                      }}>
                        <Typography variant="subtitle1" gutterBottom sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: formData.profilePicture ? 'success.main' : 'primary.main',
                          fontWeight: 'bold'
                        }}>
                          <PhotoCamera sx={{ mr: 1 }} />
                          Profile Picture (Required) *
                        </Typography>

                        {formData.profilePicture ? (
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                            <Avatar
                              src={formData.profilePicture}
                              alt="Profile Preview"
                              sx={{
                                width: 120,
                                height: 120,
                                border: '3px solid',
                                borderColor: 'success.main',
                                boxShadow: 3
                              }}
                            />
                            <Chip
                              icon={<CheckCircle />}
                              label="Profile picture uploaded successfully"
                              color="success"
                              variant="filled"
                            />
                            <Button
                              variant="outlined"
                              component="label"
                              startIcon={<PhotoCamera />}
                              size="small"
                            >
                              Change Picture
                              <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={handleProfilePictureUpload}
                              />
                            </Button>
                          </Box>
                        ) : (
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{
                              width: 80,
                              height: 80,
                              bgcolor: 'grey.300',
                              border: '2px dashed',
                              borderColor: 'grey.400'
                            }}>
                              <PhotoCamera sx={{ fontSize: 40, color: 'grey.600' }} />
                            </Avatar>
                            <Button
                              variant="contained"
                              component="label"
                              startIcon={<PhotoCamera />}
                              sx={{
                                minWidth: 200,
                                py: 1.5,
                                background: 'linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)',
                                '&:hover': {
                                  background: 'linear-gradient(45deg, #FF5252 30%, #26A69A 90%)',
                                }
                              }}
                              disabled={loading}
                            >
                              {loading ? 'Uploading...' : 'Upload Profile Picture'}
                              <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={handleProfilePictureUpload}
                              />
                            </Button>
                            <Typography variant="caption" color="text.secondary">
                              Maximum file size: 5MB. Supported formats: JPG, PNG, GIF
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </motion.div>
              )}

              {activeStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Typography variant="h6" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                    <FamilyRestroom sx={{ mr: 1 }} />
                    Guardian Information
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Guardian Name"
                        value={formData.guardianName || ''}
                        onChange={(e) => handleInputChange('guardianName', e.target.value)}
                        required
                        sx={{ minWidth: 200 }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth required sx={{ minWidth: 200 }}>
                        <InputLabel>Guardian Type</InputLabel>
                        <Select
                          value={formData.guardianType || ''}
                          onChange={(e) => handleInputChange('guardianType', e.target.value)}
                          label="Guardian Type"
                        >
                          <MenuItem value="Mother">Mother</MenuItem>
                          <MenuItem value="Father">Father</MenuItem>
                          <MenuItem value="Guardian">Guardian</MenuItem>
                          <MenuItem value="Other">Other</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Guardian Contact Number"
                        value={formData.guardianContact || ''}
                        onChange={(e) => handleInputChange('guardianContact', e.target.value)}
                        required
                        sx={{ minWidth: 200 }}
                        placeholder="0771234567"
                        helperText="Guardian's contact number for emergency purposes"
                      />
                    </Grid>
                  </Grid>
                </motion.div>
              )}

              {activeStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Typography variant="h6" gutterBottom sx={{
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    background: 'linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 'bold'
                  }}>
                    <ClassIcon sx={{ mr: 1, color: 'primary.main' }} />
                    Academic Information
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <FormControl fullWidth required sx={{ minWidth: 200 }}>
                        <InputLabel>Select Your Grade</InputLabel>
                        <Select
                          value={formData.selectedGrade || ''}
                          onChange={(e) => handleInputChange('selectedGrade', e.target.value)}
                          label="Select Your Grade"
                        >
                          {availableGrades.map((grade) => (
                            <MenuItem key={grade} value={grade}>{grade}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    {formData.selectedGrade && (
                      <Grid item xs={12}>
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="h6" gutterBottom sx={{
                            display: 'flex',
                            alignItems: 'center',
                            color: 'primary.main',
                            fontWeight: 'bold'
                          }}>
                            <Groups sx={{ mr: 1 }} />
                            Available Classes for {formData.selectedGrade}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Select one or more classes you want to enroll in. Check capacity before selecting.
                          </Typography>
                        </Box>

                        {loadingClasses ? (
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
                            <CircularProgress size={40} sx={{ mb: 2 }} />
                            <Typography variant="body1" color="text.secondary">
                              Loading available classes...
                            </Typography>
                          </Box>
                        ) : availableClasses.length === 0 ? (
                          <Alert severity="info" sx={{ mt: 2 }}>
                            No classes available for the selected grade. Please contact administration.
                          </Alert>
                        ) : (
                          <Grid container spacing={3}>
                            {availableClasses.map((classItem) => {
                              const isSelected = formData.enrolledClasses.includes(classItem._id);
                              const enrolledCount = classItem.enrolledCount || (classItem.enrolledStudents ? classItem.enrolledStudents.length : 0);
                              const isAtCapacity = enrolledCount >= classItem.capacity;
                              const capacityPercentage = (enrolledCount / classItem.capacity) * 100;

                              return (
                                <Grid item xs={12} md={6} lg={4} key={classItem._id}>
                                  <Card
                                    sx={{
                                      cursor: isAtCapacity && !isSelected ? 'not-allowed' : 'pointer',
                                      border: 2,
                                      borderColor: isSelected ? 'success.main' : isAtCapacity ? 'error.main' : 'grey.300',
                                      background: isSelected
                                        ? 'linear-gradient(135deg, #E8F5E8 0%, #C8E6C9 100%)'
                                        : isAtCapacity
                                        ? 'linear-gradient(135deg, #FFEBEE 0%, #FFCDD2 100%)'
                                        : 'linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%)',
                                      '&:hover': {
                                        boxShadow: isAtCapacity && !isSelected ? 1 : 6,
                                        transform: isAtCapacity && !isSelected ? 'none' : 'translateY(-2px)',
                                        transition: 'all 0.3s ease'
                                      },
                                      position: 'relative',
                                      overflow: 'visible'
                                    }}
                                    onClick={() => !isAtCapacity && handleClassSelection(classItem._id, classItem)}
                                  >
                                    {isSelected && (
                                      <Chip
                                        icon={<CheckCircle />}
                                        label="Selected"
                                        color="success"
                                        size="small"
                                        sx={{
                                          position: 'absolute',
                                          top: -8,
                                          right: 8,
                                          zIndex: 1
                                        }}
                                      />
                                    )}
                                    {isAtCapacity && !isSelected && (
                                      <Chip
                                        icon={<Warning />}
                                        label="Full"
                                        color="error"
                                        size="small"
                                        sx={{
                                          position: 'absolute',
                                          top: -8,
                                          right: 8,
                                          zIndex: 1
                                        }}
                                      />
                                    )}

                                    <CardContent sx={{ pb: 1 }}>
                                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                          {classItem.grade}
                                        </Typography>
                                        <Chip
                                          label={classItem.category}
                                          size="small"
                                          color="primary"
                                          variant="outlined"
                                        />
                                      </Box>

                                      <Box sx={{ mb: 2 }}>
                                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                          <Schedule sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                                          {classItem.date} • {classItem.startTime} - {classItem.endTime}
                                        </Typography>
                                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                          <LocationOn sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                                          {classItem.venue}
                                        </Typography>
                                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                          <Computer sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                                          {classItem.platform}
                                        </Typography>
                                      </Box>

                                      {/* Capacity Bar */}
                                      <Box sx={{ mb: 2 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                          <Typography variant="caption" color="text.secondary">
                                            Capacity
                                          </Typography>
                                          <Typography variant="caption" sx={{
                                            fontWeight: 'bold',
                                            color: capacityPercentage >= 90 ? 'error.main' : capacityPercentage >= 70 ? 'warning.main' : 'success.main'
                                          }}>
                                            {enrolledCount}/{classItem.capacity}
                                          </Typography>
                                        </Box>
                                        <Box sx={{
                                          width: '100%',
                                          height: 6,
                                          bgcolor: 'grey.200',
                                          borderRadius: 3,
                                          overflow: 'hidden'
                                        }}>
                                          <Box sx={{
                                            width: `${Math.min(capacityPercentage, 100)}%`,
                                            height: '100%',
                                            bgcolor: capacityPercentage >= 90 ? 'error.main' : capacityPercentage >= 70 ? 'warning.main' : 'success.main',
                                            transition: 'width 0.3s ease'
                                          }} />
                                        </Box>
                                      </Box>

                                      {isAtCapacity && !isSelected && (
                                        <Alert severity="error" sx={{ mt: 1 }}>
                                          This class is at full capacity
                                        </Alert>
                                      )}
                                    </CardContent>
                                  </Card>
                                </Grid>
                              );
                            })}
                          </Grid>
                        )}
                      </Grid>
                    )}
                  </Grid>
                </motion.div>
              )}

              {activeStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Typography variant="h6" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                    <Security sx={{ mr: 1 }} />
                    Security & Agreement
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Student Password"
                        type="password"
                        value={formData.studentPassword || ''}
                        onChange={(e) => handleInputChange('studentPassword', e.target.value)}
                        required
                        sx={{ minWidth: 200 }}
                        error={formData.studentPassword && formData.studentPassword.length < 6}
                        helperText={formData.studentPassword && formData.studentPassword.length < 6 ? 'Password must be at least 6 characters' : 'Minimum 6 characters'}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Confirm Password"
                        type="password"
                        value={formData.confirmPassword || ''}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        required
                        sx={{ minWidth: 200 }}
                        error={formData.confirmPassword && formData.studentPassword !== formData.confirmPassword}
                        helperText={formData.confirmPassword && formData.studentPassword !== formData.confirmPassword ? 'Passwords do not match' : 'Re-enter your password'}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Paper sx={{
                        p: 3,
                        bgcolor: 'linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%)',
                        border: '1px solid',
                        borderColor: 'primary.main',
                        borderRadius: 2
                      }}>
                        <Typography variant="h6" gutterBottom sx={{
                          color: 'primary.main',
                          fontWeight: 'bold',
                          display: 'flex',
                          alignItems: 'center'
                        }}>
                          <Security sx={{ mr: 1 }} />
                          Terms and Conditions
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                          By registering as a student, you agree to:
                        </Typography>
                        <Typography variant="body2" component="ul" sx={{ pl: 2, mb: 3 }}>
                          <li>Follow all class guidelines and rules</li>
                          <li>Respect teachers and fellow students</li>
                          <li>Attend classes regularly and on time</li>
                          <li>Complete assignments and homework as required</li>
                          <li>Maintain appropriate behavior during classes</li>
                        </Typography>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={formData.agreedToTerms}
                              onChange={(e) => handleInputChange('agreedToTerms', e.target.checked)}
                              required
                              sx={{
                                color: 'primary.main',
                                '&.Mui-checked': {
                                  color: 'success.main',
                                }
                              }}
                            />
                          }
                          label={
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              I agree to the student guidelines and terms *
                            </Typography>
                          }
                          sx={{ mt: 2 }}
                        />
                      </Paper>
                    </Grid>
                  </Grid>
                </motion.div>
              )}
            </Box>

            {/* Navigation Buttons */}
            <Box sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              gap: { xs: 2, sm: 0 },
              mt: 4,
              pt: 3,
              borderTop: '1px solid',
              borderColor: 'divider'
            }}>
              <Button
                onClick={handleBack}
                disabled={activeStep === 0}
                startIcon={<ArrowBack />}
                variant="outlined"
                sx={{
                  minWidth: { xs: '100%', sm: 120 },
                  py: 1.5,
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 'bold',
                  order: { xs: 2, sm: 1 },
                  '&:disabled': {
                    opacity: 0.5
                  }
                }}
              >
                Back
              </Button>

              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={loading || !validateStep(activeStep)}
                  endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Check />}
                  sx={{
                    minWidth: { xs: '100%', sm: 150 },
                    py: 1.5,
                    borderRadius: 3,
                    textTransform: 'none',
                    fontWeight: 'bold',
                    fontSize: { xs: '1rem', sm: '1.1rem' },
                    order: { xs: 1, sm: 2 },
                    background: loading ? 'grey.400' : 'linear-gradient(45deg, #4CAF50 30%, #45A049 90%)',
                    '&:hover': {
                      background: loading ? 'grey.400' : 'linear-gradient(45deg, #45A049 30%, #4CAF50 90%)',
                    },
                    '&:disabled': {
                      background: 'grey.400',
                      color: 'white'
                    }
                  }}
                >
                  {loading ? 'Submitting...' : 'Complete Registration'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={!validateStep(activeStep)}
                  endIcon={<ArrowForward />}
                  sx={{
                    minWidth: { xs: '100%', sm: 120 },
                    py: 1.5,
                    borderRadius: 3,
                    textTransform: 'none',
                    fontWeight: 'bold',
                    order: { xs: 1, sm: 2 },
                    background: 'linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #4ECDC4 30%, #FF6B6B 90%)',
                    },
                    '&:disabled': {
                      background: 'grey.400',
                      color: 'white'
                    }
                  }}
                >
                  Next Step
                </Button>
              )}
            </Box>

          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default StudentRegistration;
