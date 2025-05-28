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
  Chip
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
  ContentCopy
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const StudentRegistration = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
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
      const token = localStorage.getItem('token');
      const response = await axios.get(`https://ayanna-kiyanna-new-backend.onrender.com/api/students/available-classes?grade=${grade}`, {
        headers: { 'x-auth-token': token }
      });
      setAvailableClasses(response.data.classes);
    } catch (error) {
      console.error('Error fetching classes:', error);
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

  const handleClassSelection = (classId) => {
    setFormData(prev => ({
      ...prev,
      enrolledClasses: prev.enrolledClasses.includes(classId)
        ? prev.enrolledClasses.filter(id => id !== classId)
        : [...prev.enrolledClasses, classId]
    }));
  };

  const validateStep = (step) => {
    switch (step) {
      case 0: // Personal Information
        return formData.surname && formData.firstName && formData.lastName &&
               formData.contactNumber && formData.whatsappNumber && formData.email &&
               formData.address && formData.school && formData.gender &&
               formData.birthday && formData.currentStudent;
      case 1: // Guardian Information
        return formData.guardianName && formData.guardianType && formData.guardianContact;
      case 2: // Academic Information
        return formData.selectedGrade && formData.enrolledClasses.length > 0;
      case 3: // Security & Agreement
        return formData.studentPassword && formData.confirmPassword &&
               formData.studentPassword === formData.confirmPassword &&
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
      setError('Please fill in all required fields correctly');
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
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      py: 4
    }}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Paper elevation={8} sx={{
            p: 4,
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)'
          }}>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Avatar sx={{
                bgcolor: 'primary.main',
                width: 80,
                height: 80,
                mx: 'auto',
                mb: 2
              }}>
                <School sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h4" component="h1" gutterBottom sx={{
                fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                fontWeight: 'bold',
                color: 'primary.main'
              }}>
                සිසු ලියාපදිංචිය
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Student Registration Form
              </Typography>
            </Box>

            {/* Stepper */}
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {steps.map((label, index) => (
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
            <Box sx={{ minHeight: 400 }}>
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
                        value={formData.surname}
                        onChange={(e) => handleInputChange('surname', e.target.value)}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="First Name"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Last Name"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Contact Number"
                        value={formData.contactNumber}
                        onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box>
                        <TextField
                          fullWidth
                          label="WhatsApp Number"
                          value={formData.whatsappNumber}
                          onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
                          required
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={useContactForWhatsapp}
                              onChange={(e) => handleUseContactForWhatsapp(e.target.checked)}
                            />
                          }
                          label="Use contact number"
                          sx={{ mt: 1 }}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                        helperText="Auto-filled from your account. You can edit if needed."
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Address"
                        multiline
                        rows={2}
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="School"
                        value={formData.school}
                        onChange={(e) => handleInputChange('school', e.target.value)}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth required>
                        <InputLabel>Gender</InputLabel>
                        <Select
                          value={formData.gender}
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
                        value={formData.birthday}
                        onChange={(e) => handleInputChange('birthday', e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Age"
                        type="number"
                        value={formData.age}
                        onChange={(e) => handleInputChange('age', e.target.value)}
                        InputProps={{ readOnly: true }}
                        helperText="Auto-calculated from birthday"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl component="fieldset" required>
                        <FormLabel component="legend">Student Status</FormLabel>
                        <RadioGroup
                          value={formData.currentStudent}
                          onChange={(e) => handleInputChange('currentStudent', e.target.value)}
                        >
                          <FormControlLabel value="Current Student" control={<Radio />} label="Current Student" />
                          <FormControlLabel value="New Student" control={<Radio />} label="New Student" />
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <Box>
                        <Typography variant="subtitle1" gutterBottom>
                          Profile Picture (Optional)
                        </Typography>
                        <Button
                          variant="outlined"
                          component="label"
                          startIcon={<PhotoCamera />}
                          sx={{ mb: 2 }}
                        >
                          Upload Profile Picture
                          <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={handleProfilePictureUpload}
                          />
                        </Button>
                        {formData.profilePicture && (
                          <Box sx={{ mt: 2 }}>
                            <img
                              src={formData.profilePicture}
                              alt="Profile Preview"
                              style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8 }}
                            />
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
                        value={formData.guardianName}
                        onChange={(e) => handleInputChange('guardianName', e.target.value)}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth required>
                        <InputLabel>Guardian Type</InputLabel>
                        <Select
                          value={formData.guardianType}
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
                        value={formData.guardianContact}
                        onChange={(e) => handleInputChange('guardianContact', e.target.value)}
                        required
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
                  <Typography variant="h6" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                    <ClassIcon sx={{ mr: 1 }} />
                    Academic Information
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <FormControl fullWidth required>
                        <InputLabel>Select Your Grade</InputLabel>
                        <Select
                          value={formData.selectedGrade}
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
                        <Typography variant="subtitle1" gutterBottom>
                          Select Classes to Enroll:
                        </Typography>
                        <Grid container spacing={2}>
                          {availableClasses.map((classItem) => (
                            <Grid item xs={12} md={6} key={classItem._id}>
                              <Card
                                sx={{
                                  cursor: 'pointer',
                                  border: formData.enrolledClasses.includes(classItem._id) ? 2 : 1,
                                  borderColor: formData.enrolledClasses.includes(classItem._id) ? 'primary.main' : 'grey.300',
                                  '&:hover': { boxShadow: 3 }
                                }}
                                onClick={() => handleClassSelection(classItem._id)}
                              >
                                <CardContent>
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="h6">{classItem.grade}</Typography>
                                    {formData.enrolledClasses.includes(classItem._id) && (
                                      <Check color="primary" />
                                    )}
                                  </Box>
                                  <Typography color="text.secondary" gutterBottom>
                                    {classItem.category}
                                  </Typography>
                                  <Typography variant="body2">
                                    {classItem.date} • {classItem.startTime} - {classItem.endTime}
                                  </Typography>
                                  <Typography variant="body2">
                                    Venue: {classItem.venue}
                                  </Typography>
                                  <Typography variant="body2">
                                    Platform: {classItem.platform}
                                  </Typography>
                                </CardContent>
                              </Card>
                            </Grid>
                          ))}
                        </Grid>
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
                        value={formData.studentPassword}
                        onChange={(e) => handleInputChange('studentPassword', e.target.value)}
                        required
                        helperText="Minimum 6 characters"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Confirm Password"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        required
                        error={formData.confirmPassword && formData.studentPassword !== formData.confirmPassword}
                        helperText={formData.confirmPassword && formData.studentPassword !== formData.confirmPassword ? 'Passwords do not match' : ''}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Paper sx={{ p: 3, bgcolor: 'grey.50' }}>
                        <Typography variant="h6" gutterBottom>
                          Terms and Conditions
                        </Typography>
                        <Typography variant="body2" paragraph>
                          By registering as a student, you agree to:
                        </Typography>
                        <Typography variant="body2" component="ul" sx={{ pl: 2 }}>
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
                            />
                          }
                          label="I agree to the student guidelines and terms"
                          sx={{ mt: 2 }}
                        />
                      </Paper>
                    </Grid>
                  </Grid>
                </motion.div>
              )}
            </Box>

            {/* Navigation Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                onClick={handleBack}
                disabled={activeStep === 0}
                startIcon={<ArrowBack />}
              >
                Back
              </Button>

              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={loading || !validateStep(activeStep)}
                  endIcon={loading ? <CircularProgress size={20} /> : <Check />}
                  sx={{ minWidth: 120 }}
                >
                  {loading ? 'Submitting...' : 'Register'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={!validateStep(activeStep)}
                  endIcon={<ArrowForward />}
                >
                  Next
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
