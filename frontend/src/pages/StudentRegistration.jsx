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
  Tooltip,
  useTheme,
  useMediaQuery,
  InputAdornment,
  Collapse
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
  CheckCircle,
  CalendarToday,
  Phone,
  WhatsApp,
  Info,
  Error as ErrorIcon,
  Cancel
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const StudentRegistration = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [availableGrades, setAvailableGrades] = useState([]);
  const [availableClasses, setAvailableClasses] = useState([]);
  const [useContactForWhatsapp, setUseContactForWhatsapp] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [showLiteratureWarning, setShowLiteratureWarning] = useState(false);
  const [isLiteratureOnlyStudent, setIsLiteratureOnlyStudent] = useState(false);
  const [literatureGradeSelected, setLiteratureGradeSelected] = useState('');

  // Registration type state
  const [registrationType, setRegistrationType] = useState(''); // 'with-classes' or 'general-student'

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
    'පුද්ගලික තොරතුරු', // Personal Information
    'භාරකරු තොරතුරු', // Guardian Information
    'අධ්‍යාපනික තොරතුරු', // Academic Information
    'ආරක්ෂාව සහ එකඟතාව' // Security & Agreement
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

      // Fetch classes for the selected grade for display in the selection area
      const gradeResponse = await axios.get(`https://ayanna-kiyanna-new-backend.onrender.com/api/students/available-classes?grade=${grade}`, {
        headers: { 'x-auth-token': token }
      });

      // Also fetch ALL classes to ensure we can display previously selected classes from other grades
      const allClassesResponse = await axios.get(`https://ayanna-kiyanna-new-backend.onrender.com/api/students/available-classes`, {
        headers: { 'x-auth-token': token }
      });

      // Combine both: current grade classes for selection + all classes for display
      const currentGradeClasses = gradeResponse.data.classes || [];
      const allClasses = allClassesResponse.data.classes || [];

      // Create a unique set of classes (avoid duplicates)
      const uniqueClasses = [];
      const seenIds = new Set();

      // Add current grade classes first
      currentGradeClasses.forEach(cls => {
        if (!seenIds.has(cls._id)) {
          uniqueClasses.push({ ...cls, isCurrentGrade: true });
          seenIds.add(cls._id);
        }
      });

      // Add other classes for display purposes
      allClasses.forEach(cls => {
        if (!seenIds.has(cls._id)) {
          uniqueClasses.push({ ...cls, isCurrentGrade: false });
          seenIds.add(cls._id);
        }
      });

      setAvailableClasses(uniqueClasses);
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

    setFormData(prev => {
      const isCurrentlySelected = prev.enrolledClasses.includes(classId);

      if (isCurrentlySelected) {
        // If already selected, remove it (deselect)
        return {
          ...prev,
          enrolledClasses: prev.enrolledClasses.filter(id => id !== classId)
        };
      } else {
        // If not selected, add it
        // For all grades, allow only one class per grade - remove any existing classes from the same grade
        const classesFromSameGrade = prev.enrolledClasses.filter(id => {
          const existingClass = availableClasses.find(c => c._id === id);
          return existingClass && existingClass.grade === classItem.grade;
        });

        // Remove classes from the same grade and add the new one
        const otherClasses = prev.enrolledClasses.filter(id => !classesFromSameGrade.includes(id));
        return {
          ...prev,
          enrolledClasses: [...otherClasses, classId]
        };
      }
    });
    setError(''); // Clear any previous capacity errors
  };

  // Helper function to check if a class is Literature related
  const isLiteratureClass = (classItem) => {
    if (!classItem) return false;
    const grade = (classItem.grade || '').toLowerCase();
    const category = (classItem.category || '').toLowerCase();
    const literatureKeywords = ['lit', 'literature', 'සාහිත්‍ය'];

    return literatureKeywords.some(keyword =>
      grade.includes(keyword) || category.includes(keyword)
    );
  };

  // Helper function to check if selected classes contain Literature
  const hasLiteratureClasses = () => {
    return formData.enrolledClasses.some(classId => {
      const classItem = availableClasses.find(c => c._id === classId);
      return isLiteratureClass(classItem);
    });
  };

  // Helper function to check if ALL selected classes are Literature
  const isOnlyLiteratureClasses = () => {
    if (formData.enrolledClasses.length === 0) return false;
    return formData.enrolledClasses.every(classId => {
      const classItem = availableClasses.find(c => c._id === classId);
      return isLiteratureClass(classItem);
    });
  };

  // Helper function to check if Literature classes are in correct order (first)
  const isLiteratureInCorrectOrder = () => {
    if (formData.enrolledClasses.length === 0) return true;

    const hasLiterature = hasLiteratureClasses();
    const isOnlyLiterature = isOnlyLiteratureClasses();

    // If only Literature classes, order is correct
    if (isOnlyLiterature) return true;

    // If no Literature classes, order is correct
    if (!hasLiterature) return true;

    // If mixed classes, check if Literature classes come first
    if (hasLiterature && !isOnlyLiterature) {
      let foundNonLiterature = false;

      for (const classId of formData.enrolledClasses) {
        const classItem = availableClasses.find(c => c._id === classId);
        const isLit = isLiteratureClass(classItem);

        if (!isLit) {
          foundNonLiterature = true;
        } else if (foundNonLiterature && isLit) {
          // Found Literature class after non-Literature class - wrong order
          return false;
        }
      }
    }

    return true;
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
    } catch {
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

  const validateGuardianContact = (number) => {
    if (!number || typeof number !== 'string') return false;
    // Sri Lankan phone number validation (10 digits starting with 0)
    const phoneRegex = /^0[0-9]{9}$/;
    return phoneRegex.test(number.trim());
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
               (formData.guardianContact || '').trim() &&
               validateGuardianContact(formData.guardianContact);
      case 2: // Academic Information
        // Check if registration type is selected
        if (!registrationType) return false;

        // For general student registration, only grade is required
        if (registrationType === 'general-student') {
          return (formData.selectedGrade || '').trim();
        }

        // For class-based registration, both grade and classes are required
        if (registrationType === 'with-classes') {
          return (formData.selectedGrade || '').trim() &&
                 formData.enrolledClasses &&
                 formData.enrolledClasses.length > 0;
        }

        return false;
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
    // Special validation for Academic Information step (step 2)
    if (activeStep === 2) {
      // Check if basic validation passes first
      if (!validateStep(activeStep)) {
        if (!registrationType) {
          setError('Please select your registration type first.');
        } else if (registrationType === 'general-student') {
          setError('Please select your grade.');
        } else {
          setError('Please select your grade and at least one class to enroll.');
        }
        return;
      }

      // Only check Literature class issues for class-based registration
      if (registrationType === 'with-classes') {
        // Check for Literature class selection issues
        const hasLiterature = hasLiteratureClasses();
        const isOnlyLiterature = isOnlyLiteratureClasses();
        const isCorrectOrder = isLiteratureInCorrectOrder();

        if (hasLiterature && !isOnlyLiterature && !isCorrectOrder) {
          // User has mixed Literature and non-Literature classes in wrong order
          setShowLiteratureWarning(true);
          setError('');
          return; // Don't proceed to next step
        }

        // If only Literature classes are selected, check if grade is manually selected
        if (isOnlyLiterature && !literatureGradeSelected) {
          setIsLiteratureOnlyStudent(true);
          setError('');
          return; // Don't proceed to next step
        }
      }
    }

    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
      setError('');
      setShowLiteratureWarning(false);
      setIsLiteratureOnlyStudent(false);
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
          if (!validateGuardianContact(formData.guardianContact)) {
            setError('Please enter a valid Sri Lankan guardian contact number (10 digits starting with 0).');
          } else {
            setError('Please fill in all guardian information fields.');
          }
          break;
        case 2:
          if (!registrationType) {
            setError('Please select your registration type first.');
          } else if (registrationType === 'general-student') {
            setError('Please select your grade.');
          } else {
            setError('Please select your grade and at least one class to enroll.');
          }
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
              orientation={isMobile ? 'vertical' : 'horizontal'}
              sx={{
                mb: 4,
                '& .MuiStepLabel-label': {
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  fontWeight: 'bold',
                  fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                },
                '& .MuiStepIcon-root': {
                  fontSize: { xs: '1.2rem', sm: '1.5rem' }
                },
                '& .MuiStepConnector-line': {
                  borderColor: 'rgba(255, 107, 107, 0.3)'
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
              <Alert
                severity="error"
                icon={<ErrorIcon />}
                sx={{
                  mb: 3,
                  '& .MuiAlert-message': {
                    fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                  }
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                  ❌ දෝෂය (Error)
                </Typography>
                {error}
              </Alert>
            )}

            {/* Validation Status */}
            <Collapse in={!validateStep(activeStep) && activeStep < steps.length}>
              <Alert
                severity="warning"
                icon={<Warning />}
                sx={{
                  mb: 3,
                  bgcolor: 'rgba(255, 152, 0, 0.1)',
                  border: '1px solid rgba(255, 152, 0, 0.3)'
                }}
              >
                <Typography variant="body2" sx={{
                  fontWeight: 'bold',
                  fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                }}>
                  ⚠️ කරුණාකර සියලුම අවශ්‍ය ක්ෂේත්‍ර සම්පූර්ණ කරන්න
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                  Please complete all required fields to continue
                </Typography>
              </Alert>
            </Collapse>

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
                  <Typography variant="h6" gutterBottom sx={{
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                    color: 'primary.main'
                  }}>
                    <Person sx={{ mr: 1 }} />
                    පුද්ගලික තොරතුරු (Personal Information)
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="වාසගම (Surname)"
                        value={formData.surname || ''}
                        onChange={(e) => handleInputChange('surname', e.target.value)}
                        required
                        sx={{ minWidth: 200 }}
                        error={formData.surname && formData.surname.length < 2}
                        helperText={formData.surname && formData.surname.length < 2 ? 'වාසගම අවම වශයෙන් අකුරු 2ක් විය යුතුය' : ''}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="මුල් නම (First Name)"
                        value={formData.firstName || ''}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        required
                        sx={{ minWidth: 200 }}
                        error={formData.firstName && formData.firstName.length < 2}
                        helperText={formData.firstName && formData.firstName.length < 2 ? 'මුල් නම අවම වශයෙන් අකුරු 2ක් විය යුතුය' : ''}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="අවසාන නම (Last Name)"
                        value={formData.lastName || ''}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        required
                        sx={{ minWidth: 200 }}
                        error={formData.lastName && formData.lastName.length < 2}
                        helperText={formData.lastName && formData.lastName.length < 2 ? 'අවසාන නම අවම වශයෙන් අකුරු 2ක් විය යුතුය' : ''}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="සම්බන්ධතා අංකය (Contact Number)"
                        value={formData.contactNumber || ''}
                        onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                        required
                        sx={{ minWidth: 200 }}
                        error={formData.contactNumber && !validateContactNumber(formData.contactNumber)}
                        helperText={formData.contactNumber && !validateContactNumber(formData.contactNumber) ? 'වලංගු ශ්‍රී ලංකා දුරකථන අංකයක් ඇතුළත් කරන්න' : 'උදාහරණය: 0771234567'}
                        placeholder="0771234567"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Phone color="primary" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box>
                        <TextField
                          fullWidth
                          label="WhatsApp අංකය (WhatsApp Number)"
                          value={formData.whatsappNumber || ''}
                          onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
                          required
                          sx={{ minWidth: 200 }}
                          error={formData.whatsappNumber && !validateWhatsAppNumber(formData.whatsappNumber)}
                          helperText={formData.whatsappNumber && !validateWhatsAppNumber(formData.whatsappNumber) ? 'වලංගු WhatsApp අංකයක් ඇතුළත් කරන්න' : 'උදාහරණය: 0771234567 හෝ +94771234567'}
                          placeholder="0771234567"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <WhatsApp color="success" />
                              </InputAdornment>
                            ),
                          }}
                        />
                        <Box sx={{
                          mt: 1,
                          p: 2,
                          bgcolor: 'rgba(76, 175, 80, 0.1)',
                          borderRadius: 2,
                          border: '1px solid rgba(76, 175, 80, 0.3)'
                        }}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={useContactForWhatsapp}
                                onChange={(e) => handleUseContactForWhatsapp(e.target.checked)}
                                sx={{
                                  color: 'success.main',
                                  '&.Mui-checked': {
                                    color: 'success.main',
                                  }
                                }}
                              />
                            }
                            label={
                              <Typography variant="body2" sx={{
                                fontWeight: 'bold',
                                color: 'success.dark',
                                fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                              }}>
                                මගේ WhatsApp අංකය සහ සම්බන්ධතා අංකය එකම වේ (ස්වයංක්‍රීය පිරවීම)
                              </Typography>
                            }
                          />
                          <Typography variant="caption" sx={{
                            display: 'block',
                            mt: 0.5,
                            color: 'text.secondary',
                            fontStyle: 'italic'
                          }}>
                            ✨ මෙය ඔබේ WhatsApp අංකය ස්වයංක්‍රීයව පිරවනු ඇත
                          </Typography>
                        </Box>
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
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          label="උපන් දිනය (Birthday)"
                          value={formData.birthday ? new Date(formData.birthday) : null}
                          onChange={(newValue) => {
                            if (newValue) {
                              const year = newValue.getFullYear();
                              const month = String(newValue.getMonth() + 1).padStart(2, '0');
                              const day = String(newValue.getDate()).padStart(2, '0');
                              handleInputChange('birthday', `${year}-${month}-${day}`);
                            } else {
                              handleInputChange('birthday', '');
                            }
                          }}
                          enableAccessibleFieldDOMStructure={false}
                          slots={{
                            textField: (params) => (
                              <TextField
                                {...params}
                                fullWidth
                                required
                                sx={{
                                  minWidth: 200,
                                  '& .MuiInputBase-root': {
                                    cursor: 'pointer'
                                  },
                                  '& .MuiInputBase-input': {
                                    cursor: 'pointer',
                                    caretColor: 'transparent'
                                  }
                                }}
                                error={formData.birthday && !validateAge(formData.birthday)}
                                helperText={formData.birthday && !validateAge(formData.birthday) ? 'ඔබ අවම වශයෙන් වයස අවුරුදු 13ක් විය යුතුය' : 'දිනය තෝරන්න (Click the "Calender" icon)'}
                                InputProps={{
                                  ...params.InputProps,
                                  readOnly: true,
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <CalendarToday sx={{ color: 'text.secondary' }} />
                                    </InputAdornment>
                                  )
                                }}
                                onKeyDown={(e) => e.preventDefault()}
                                onFocus={(e) => e.target.blur()}
                              />
                            )
                          }}
                          maxDate={new Date()}
                          minDate={new Date('1900-01-01')}
                        />
                      </LocalizationProvider>
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
                          <FormControlLabel value="Current Student" control={<Radio />} label="පැරණි සිසුවෙකි" />
                          <FormControlLabel value="New Student" control={<Radio />} label="අලුත්ම සිසුවෙකි" />
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
                  <Typography variant="h6" gutterBottom sx={{
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                    color: 'primary.main'
                  }}>
                    <FamilyRestroom sx={{ mr: 1 }} />
                    භාරකරු තොරතුරු (Guardian Information)
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
                        error={formData.guardianContact && !validateGuardianContact(formData.guardianContact)}
                        helperText={formData.guardianContact && !validateGuardianContact(formData.guardianContact) ? 'Please enter a valid Sri Lankan contact number (10 digits starting with 0)' : "Guardian's contact number for emergency purposes"}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Phone sx={{ color: 'text.secondary' }} />
                            </InputAdornment>
                          )
                        }}
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
                    fontWeight: 'bold',
                    fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                  }}>
                    <ClassIcon sx={{ mr: 1, color: 'primary.main' }} />
                    අධ්‍යාපනික තොරතුරු (Academic Information)
                  </Typography>

                  {/* Registration Type Selection */}
                  <Alert
                    severity="info"
                    icon={<Info />}
                    sx={{
                      mb: 3,
                      bgcolor: 'rgba(33, 150, 243, 0.1)',
                      border: '2px solid rgba(33, 150, 243, 0.3)',
                      '& .MuiAlert-icon': {
                        color: 'info.main'
                      }
                    }}
                  >
                    <Typography variant="body2" sx={{
                      fontWeight: 'bold',
                      fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                      mb: 2
                    }}>
                      🎯 ලියාපදිංචි වීමේ ආකාරය තෝරන්න (Select Registration Type)
                    </Typography>

                    <FormControl component="fieldset" fullWidth>
                      <RadioGroup
                        value={registrationType}
                        onChange={(e) => {
                          setRegistrationType(e.target.value);
                          // Reset form data when changing registration type
                          setFormData(prev => ({
                            ...prev,
                            selectedGrade: '',
                            enrolledClasses: []
                          }));
                        }}
                        sx={{ gap: 2 }}
                      >
                        <Paper
                          sx={{
                            p: 2,
                            border: 2,
                            borderColor: registrationType === 'with-classes' ? 'primary.main' : 'grey.300',
                            background: registrationType === 'with-classes'
                              ? 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)'
                              : 'linear-gradient(135deg, #F5F5F5 0%, #EEEEEE 100%)',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              boxShadow: 4,
                              transform: 'translateY(-2px)'
                            }
                          }}
                          onClick={() => {
                            setRegistrationType('with-classes');
                            setFormData(prev => ({
                              ...prev,
                              selectedGrade: '',
                              enrolledClasses: []
                            }));
                          }}
                        >
                          <FormControlLabel
                            value="with-classes"
                            control={<Radio />}
                            label={
                              <Box>
                                <Typography variant="body1" sx={{
                                  fontWeight: 'bold',
                                  fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                                  color: 'primary.main'
                                }}>
                                  📚 ඇතුල් වීමට අවශ්‍ය පන්තිය/පන්ති තෝරමින් සිසුවෙකු ලෙස ලියා පදිංචි වීමට අවශ්‍ය යි
                                </Typography>
                                <Typography variant="caption" sx={{
                                  display: 'block',
                                  mt: 0.5,
                                  color: 'text.secondary',
                                  fontStyle: 'italic'
                                }}>
                                  Want to register as a student by selecting specific classes to enroll
                                </Typography>
                              </Box>
                            }
                            sx={{
                              margin: 0,
                              width: '100%',
                              '& .MuiFormControlLabel-label': {
                                width: '100%'
                              }
                            }}
                          />
                        </Paper>

                        <Paper
                          sx={{
                            p: 2,
                            border: 2,
                            borderColor: registrationType === 'general-student' ? 'success.main' : 'grey.300',
                            background: registrationType === 'general-student'
                              ? 'linear-gradient(135deg, #E8F5E8 0%, #C8E6C9 100%)'
                              : 'linear-gradient(135deg, #F5F5F5 0%, #EEEEEE 100%)',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              boxShadow: 4,
                              transform: 'translateY(-2px)'
                            }
                          }}
                          onClick={() => {
                            setRegistrationType('general-student');
                            setFormData(prev => ({
                              ...prev,
                              selectedGrade: '',
                              enrolledClasses: []
                            }));
                          }}
                        >
                          <FormControlLabel
                            value="general-student"
                            control={<Radio />}
                            label={
                              <Box>
                                <Typography variant="body1" sx={{
                                  fontWeight: 'bold',
                                  fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                                  color: 'success.main'
                                }}>
                                  👤 පන්තියක් තේරීමට අවශ්‍ය නැත. සාමාන්‍ය සිසුවෙකු ලෙස ලියා පදිංචි වීමට අවශ්‍ය යි
                                </Typography>
                                <Typography variant="caption" sx={{
                                  display: 'block',
                                  mt: 0.5,
                                  color: 'text.secondary',
                                  fontStyle: 'italic'
                                }}>
                                  Don't need to select classes. Want to register as a general student
                                </Typography>
                              </Box>
                            }
                            sx={{
                              margin: 0,
                              width: '100%',
                              '& .MuiFormControlLabel-label': {
                                width: '100%'
                              }
                            }}
                          />
                        </Paper>
                      </RadioGroup>
                    </FormControl>
                  </Alert>

                  {/* Important Note - Only show when registration type is selected */}
                  {registrationType && (
                    <Alert
                      severity="warning"
                      icon={<Info />}
                      sx={{
                        mb: 3,
                        bgcolor: 'rgba(255, 193, 7, 0.1)',
                        border: '1px solid rgba(255, 193, 7, 0.3)',
                        '& .MuiAlert-icon': {
                          color: 'warning.main'
                        }
                      }}
                    >
                      <Typography variant="body2" sx={{
                        fontWeight: 'bold',
                        fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                        mb: 1
                      }}>
                        ⚠️ වැදගත් සටහන (Important Note)
                      </Typography>
                      <Typography variant="body2" sx={{
                        fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                      }}>
                        ඔබේ ශ්‍රේණිය ප්‍රවේශමෙන් තෝරන්න. මන්ද ඔබට එය අනාගතයේදී වෙනස් කළ නොහැකි බැවිනි.
                        ඔබට එය වෙනස් කිරීමට අවශ්‍ය නම් පරිපාලකයාට දන්වන්න.
                        මන්ද පද්ධතිය ස්වයංක්‍රීයව ඔබේ ශ්‍රේණිය අනුව වසරින් වසර යාවත්කාලීන කරයි.
                      </Typography>
                      <Typography variant="caption" sx={{
                        display: 'block',
                        mt: 1,
                        fontStyle: 'italic',
                        color: 'text.secondary'
                      }}>
                        📚 Carefully select your grade as you cannot change it in the future.
                        If you need to change it, please inform the admin as the system automatically updates your grade year by year.
                      </Typography>
                    </Alert>
                  )}

                  {/* Sinhala Literature Notice */}
                  <Alert
                    severity="info"
                    icon={<Info />}
                    sx={{
                      mb: 3,
                      bgcolor: 'rgba(33, 150, 243, 0.1)',
                      border: '1px solid rgba(33, 150, 243, 0.3)',
                      '& .MuiAlert-icon': {
                        color: 'info.main'
                      }
                    }}
                  >
                    <Typography variant="body2" sx={{
                      fontWeight: 'bold',
                      fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                      mb: 1
                    }}>
                      📚 සිංහල සාහිත්‍ය පන්ති සඳහා වැදගත් සටහන (Important Note for Sinhala Literature Classes)
                    </Typography>
                    <Typography variant="body2" sx={{
                      fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                      mb: 1
                    }}>
                      ඔබට සිංහල සාහිත්‍ය පන්තියක් සමඟ වෙනත් පන්තියකටද ලියාපදිංචි වීමට අවශ්‍ය නම්,
                      <strong> පළමුව ඔබට අවශ්‍ය සිංහල සාහිත්‍ය පන්තිය තෝරන්න. </strong>
                      ඉන්පසු දෙවනුව, ඔබට අවශ්‍ය වෙනත් පන්ති තෝරන්න.
                      මන්ද අපි ඔබේ ශ්‍රේණිය ඔබේ අවසාන පන්ති තේරීමෙන් ස්වයංක්‍රීයව ලබා ගන්නා බැවිනි.
                    </Typography>
                    <Typography variant="body2" sx={{
                      fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                    }}>
                      <strong>ඔබ සිංහල සාහිත්‍ය පන්තියකට පමණක් ලියාපදිංචි වන්නේ නම්,</strong> කිසිදු ගැටලුවක් නැත.
                      පන්ති තේරීමෙන් පසු, අපි ඔබේ ශ්‍රේණිය වෙනම ලබා ගන්නෙමු.
                    </Typography>
                    <Typography variant="caption" sx={{
                      display: 'block',
                      mt: 1,
                      fontStyle: 'italic',
                      color: 'text.secondary'
                    }}>
                      💡 If you need to enroll in Sinhala Literature class along with other classes,
                      first select the Sinhala Literature class you want to enroll in,
                      then select your other class. We automatically get your grade from your last class selection.
                      If you are only enrolling in Sinhala Literature classes, no problem -
                      we will get your grade manually after class selection.
                    </Typography>
                  </Alert>

                  {/* Literature Warning Dialog */}
                  {showLiteratureWarning && (
                    <Alert
                      severity="warning"
                      icon={<Warning />}
                      sx={{
                        mb: 3,
                        bgcolor: 'rgba(255, 152, 0, 0.1)',
                        border: '2px solid rgba(255, 152, 0, 0.5)',
                        '& .MuiAlert-icon': {
                          color: 'warning.main'
                        }
                      }}
                    >
                      <Typography variant="body2" sx={{
                        fontWeight: 'bold',
                        fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                        mb: 2
                      }}>
                        ⚠️ සිංහල සාහිත්‍ය පන්ති තේරීමේ ගැටලුව (Sinhala Literature Class Selection Issue)
                      </Typography>
                      <Typography variant="body2" sx={{
                        fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                        mb: 2
                      }}>
                        ඔබ සිංහල සාහිත්‍ය පන්ති සහ වෙනත් පන්ති මිශ්‍ර කර තෝරාගෙන ඇත.
                        කරුණාකර ඉහත සටහන අනුව නිවැරදි ක්‍රමය අනුගමනය කරන්න:
                      </Typography>
                      <Typography variant="body2" sx={{
                        fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                        mb: 1,
                        pl: 2
                      }}>
                        1️⃣ පළමුව සිංහල සාහිත්‍ය පන්තිය තෝරන්න<br/>
                        2️⃣ ඉන්පසු වෙනත් පන්තිය තෝරන්න
                      </Typography>
                      <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                        <Button
                          variant="contained"
                          color="warning"
                          size="small"
                          onClick={() => {
                            // Clear all selected classes to start fresh
                            setFormData(prev => ({
                              ...prev,
                              enrolledClasses: []
                            }));
                            setShowLiteratureWarning(false);
                          }}
                          sx={{
                            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                          }}
                        >
                          🔄 නැවත ආරම්භ කරන්න (Start Over)
                        </Button>
                        <Button
                          variant="outlined"
                          color="warning"
                          size="small"
                          onClick={() => setShowLiteratureWarning(false)}
                          sx={{
                            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                          }}
                        >
                          ✅ තේරුම් ගත්තා (Got It)
                        </Button>
                      </Box>
                    </Alert>
                  )}

                  {/* Literature Only Student Grade Selection */}
                  {isLiteratureOnlyStudent && (
                    <Alert
                      severity="success"
                      icon={<CheckCircle />}
                      sx={{
                        mb: 3,
                        bgcolor: 'rgba(76, 175, 80, 0.1)',
                        border: '2px solid rgba(76, 175, 80, 0.5)',
                        '& .MuiAlert-icon': {
                          color: 'success.main'
                        }
                      }}
                    >
                      <Typography variant="body2" sx={{
                        fontWeight: 'bold',
                        fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                        mb: 2
                      }}>
                        🎓 සිංහල සාහිත්‍ය පන්ති සඳහා ශ්‍රේණිය තෝරන්න (Select Grade for Sinhala Literature Classes)
                      </Typography>
                      <Typography variant="body2" sx={{
                        fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                        mb: 2
                      }}>
                        ඔබ සිංහල සාහිත්‍ය පන්ති පමණක් තෝරාගෙන ඇත. කරුණාකර ඔබේ ශ්‍රේණිය තෝරන්න:
                      </Typography>
                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel sx={{ fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif' }}>
                          ඔබේ ශ්‍රේණිය තෝරන්න (Select Your Grade)
                        </InputLabel>
                        <Select
                          value={literatureGradeSelected}
                          onChange={(e) => setLiteratureGradeSelected(e.target.value)}
                          label="ඔබේ ශ්‍රේණිය තෝරන්න (Select Your Grade)"
                          sx={{ fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif' }}
                        >
                          <MenuItem value="Grade 9">Grade 9 (9 ශ්‍රේණිය)</MenuItem>
                          <MenuItem value="Grade 10">Grade 10 (10 ශ්‍රේණිය)</MenuItem>
                          <MenuItem value="Grade 11">Grade 11 (11 ශ්‍රේණිය)</MenuItem>
                          <MenuItem value="A/L">A/L (උසස් පෙළ)</MenuItem>
                          <MenuItem value="Other">Other (වෙනත්)</MenuItem>
                        </Select>
                      </FormControl>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          disabled={!literatureGradeSelected}
                          onClick={() => {
                            // Set the selected grade and proceed
                            setFormData(prev => ({
                              ...prev,
                              selectedGrade: literatureGradeSelected
                            }));
                            setIsLiteratureOnlyStudent(false);
                          }}
                          sx={{
                            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                          }}
                        >
                          ✅ තහවුරු කරන්න (Confirm)
                        </Button>
                        <Button
                          variant="outlined"
                          color="success"
                          size="small"
                          onClick={() => setIsLiteratureOnlyStudent(false)}
                          sx={{
                            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                          }}
                        >
                          ❌ අවලංගු කරන්න (Cancel)
                        </Button>
                      </Box>
                    </Alert>
                  )}

                  {/* Grade Selection - Show only when registration type is selected */}
                  {registrationType && (
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        {registrationType === 'general-student' ? (
                          // General Student Grade Selection
                          <FormControl fullWidth required sx={{ minWidth: 200 }}>
                            <InputLabel>ඔබේ ශ්‍රේණිය තෝරන්න (Select Your Grade)</InputLabel>
                            <Select
                              value={formData.selectedGrade || ''}
                              onChange={(e) => handleInputChange('selectedGrade', e.target.value)}
                              label="ඔබේ ශ්‍රේණිය තෝරන්න (Select Your Grade)"
                            >
                              <MenuItem value="Grade 6">Grade 6 (6 ශ්‍රේණිය)</MenuItem>
                              <MenuItem value="Grade 7">Grade 7 (7 ශ්‍රේණිය)</MenuItem>
                              <MenuItem value="Grade 8">Grade 8 (8 ශ්‍රේණිය)</MenuItem>
                              <MenuItem value="Grade 9">Grade 9 (9 ශ්‍රේණිය)</MenuItem>
                              <MenuItem value="Grade 10">Grade 10 (10 ශ්‍රේණිය)</MenuItem>
                              <MenuItem value="Grade 11">Grade 11 (11 ශ්‍රේණිය)</MenuItem>
                              <MenuItem value="A/L 12">A/L 12 (උසස් පෙළ 12)</MenuItem>
                              <MenuItem value="A/L 13">A/L 13 (උසස් පෙළ 13)</MenuItem>
                              <MenuItem value="Other">Other (වෙනත්)</MenuItem>
                            </Select>
                          </FormControl>
                        ) : (
                          // Class-based Registration Grade Selection
                          <FormControl fullWidth required sx={{ minWidth: 200 }}>
                            <InputLabel>ඔබේ ශ්‍රේණිය තෝරන්න (Select Your Grade)</InputLabel>
                            <Select
                              value={formData.selectedGrade || ''}
                              onChange={(e) => handleInputChange('selectedGrade', e.target.value)}
                              label="ඔබේ ශ්‍රේණිය තෝරන්න (Select Your Grade)"
                            >
                              {availableGrades.map((grade) => (
                                <MenuItem key={grade} value={grade}>{grade}</MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        )}
                      </Grid>

                      {/* General Student Confirmation */}
                      {registrationType === 'general-student' && formData.selectedGrade && (
                        <Grid item xs={12}>
                          <Alert
                            severity="success"
                            icon={<CheckCircle />}
                            sx={{
                              bgcolor: 'rgba(76, 175, 80, 0.1)',
                              border: '2px solid rgba(76, 175, 80, 0.5)',
                              '& .MuiAlert-icon': {
                                color: 'success.main'
                              }
                            }}
                          >
                            <Typography variant="body2" sx={{
                              fontWeight: 'bold',
                              fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                              mb: 1
                            }}>
                              ✅ සාමාන්‍ය සිසුවෙකු ලෙස ලියාපදිංචිය සම්පූර්ණයි! (General Student Registration Complete!)
                            </Typography>
                            <Typography variant="body2" sx={{
                              fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                            }}>
                              ඔබ {formData.selectedGrade} ශ්‍රේණියේ සාමාන්‍ය සිසුවෙකු ලෙස ලියාපදිංචි වී ඇත.
                              ඔබට අනාගතයේදී අවශ්‍ය පන්ති සඳහා වෙනම ලියාපදිංචි විය හැකිය.
                            </Typography>
                            <Typography variant="caption" sx={{
                              display: 'block',
                              mt: 1,
                              fontStyle: 'italic',
                              color: 'text.secondary'
                            }}>
                              You are registered as a general student for {formData.selectedGrade}.
                              You can register for specific classes separately in the future.
                            </Typography>
                          </Alert>
                        </Grid>
                      )}

                      {/* Class Selection - Only for class-based registration */}
                      {registrationType === 'with-classes' && formData.selectedGrade && (
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
                              ✨ මෙම ශ්‍රේණියේ පහත පන්ති වලින් ඔබට ඇතුලත් වීමට අවශ්‍ය පන්තිය තෝරන්න. ඔබට අනෙකුත් පන්ති ප්‍රවර්ග වලින් ද තොරාගැනීම් එක බැගින් සිදු කල හැක. මෙම තෝරාගන්නා පන්ති සදහා ඇඩ්මින්ගේ අනුමැතියෙන් පසුව ප්‍රවේශ විය හැකිය.
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
                            {availableClasses.filter(classItem => classItem.isCurrentGrade).map((classItem) => {
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

                        {/* Selected Classes Display */}
                        {formData.enrolledClasses.length > 0 && (
                          <Box sx={{ mt: 4 }}>
                            <Typography variant="h6" gutterBottom sx={{
                              display: 'flex',
                              alignItems: 'center',
                              color: 'success.main',
                              fontWeight: 'bold',
                              fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                            }}>
                              <CheckCircle sx={{ mr: 1 }} />
                              Selected Classes (තෝරාගත් පන්ති)
                            </Typography>

                            <Paper sx={{
                              p: 3,
                              background: 'linear-gradient(135deg, #E8F5E8 0%, #C8E6C9 100%)',
                              border: '2px solid',
                              borderColor: 'success.main',
                              borderRadius: 3,
                              boxShadow: '0 4px 20px rgba(76, 175, 80, 0.2)'
                            }}>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                {formData.enrolledClasses.map((classId) => {
                                  const selectedClass = availableClasses.find(c => c._id === classId);

                                  if (!selectedClass) {
                                    return (
                                      <motion.div
                                        key={classId}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        transition={{ duration: 0.3 }}
                                      >
                                        <Chip
                                          icon={<School />}
                                          label={
                                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', py: 0.5 }}>
                                              <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                                                තහවුරු කරගනිමින්..
                                              </Typography>
                                              <Typography variant="caption" sx={{ color: 'error.main', fontSize: '0.7rem' }}>
                                                මදක් රැදී සිටින්න.
                                              </Typography>
                                            </Box>
                                          }
                                          onDelete={() => {
                                            // Remove the invalid class ID
                                            setFormData(prev => ({
                                              ...prev,
                                              enrolledClasses: prev.enrolledClasses.filter(id => id !== classId)
                                            }));
                                          }}
                                          deleteIcon={
                                            <Tooltip title="Remove this invalid class" arrow>
                                              <Cancel sx={{
                                                color: 'error.main',
                                                '&:hover': {
                                                  color: 'error.dark',
                                                  transform: 'scale(1.1)'
                                                },
                                                transition: 'all 0.2s ease'
                                              }} />
                                            </Tooltip>
                                          }
                                          sx={{
                                            height: 'auto',
                                            minHeight: 60,
                                            backgroundColor: 'white',
                                            border: '2px solid',
                                            borderColor: 'error.main',
                                            borderRadius: 2,
                                            boxShadow: '0 2px 8px rgba(244, 67, 54, 0.3)',
                                            '&:hover': {
                                              backgroundColor: 'error.50',
                                              transform: 'translateY(-2px)',
                                              boxShadow: '0 4px 12px rgba(244, 67, 54, 0.4)'
                                            },
                                            '& .MuiChip-label': {
                                              padding: '8px 12px',
                                              whiteSpace: 'normal',
                                              textAlign: 'left'
                                            },
                                            '& .MuiChip-deleteIcon': {
                                              margin: '0 8px 0 0'
                                            },
                                            transition: 'all 0.3s ease'
                                          }}
                                        />
                                      </motion.div>
                                    );
                                  }

                                  return (
                                    <motion.div
                                      key={classId}
                                      initial={{ opacity: 0, scale: 0.8 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      exit={{ opacity: 0, scale: 0.8 }}
                                      transition={{ duration: 0.3 }}
                                    >
                                      <Chip
                                        icon={<School />}
                                        label={
                                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', py: 0.5 }}>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'success.dark' }}>
                                              {selectedClass.grade}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: 'success.main', fontSize: '0.7rem' }}>
                                              {selectedClass.category} • {selectedClass.date} • {selectedClass.startTime}-{selectedClass.endTime}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
                                              📍 {selectedClass.venue} • 💻 {selectedClass.platform}
                                            </Typography>
                                          </Box>
                                        }
                                        onDelete={() => handleClassSelection(classId, selectedClass)}
                                        deleteIcon={
                                          <Tooltip title="Remove this class" arrow>
                                            <Cancel sx={{
                                              color: 'error.main',
                                              '&:hover': {
                                                color: 'error.dark',
                                                transform: 'scale(1.1)'
                                              },
                                              transition: 'all 0.2s ease'
                                            }} />
                                          </Tooltip>
                                        }
                                        sx={{
                                          height: 'auto',
                                          minHeight: 60,
                                          backgroundColor: 'white',
                                          border: '2px solid',
                                          borderColor: 'success.main',
                                          borderRadius: 2,
                                          boxShadow: '0 2px 8px rgba(76, 175, 80, 0.3)',
                                          '&:hover': {
                                            backgroundColor: 'success.50',
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 4px 12px rgba(76, 175, 80, 0.4)'
                                          },
                                          '& .MuiChip-label': {
                                            padding: '8px 12px',
                                            whiteSpace: 'normal',
                                            textAlign: 'left'
                                          },
                                          '& .MuiChip-deleteIcon': {
                                            margin: '0 8px 0 0'
                                          },
                                          transition: 'all 0.3s ease'
                                        }}
                                      />
                                    </motion.div>
                                  );
                                })}
                              </Box>

                              {/* Summary Information - සාරාංශ තොරතුරු */}
                              <Box sx={{ mt: 3, pt: 2, borderTop: '1px dashed', borderColor: 'success.main' }}>
                                <Typography variant="body2" sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  color: 'success.dark',
                                  fontWeight: 'bold',
                                  fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                                }}>
                                  <Info sx={{ mr: 1, fontSize: 18 }} />
                                  📚 තෝරාගත් පන්ති සාරාංශය: ඔබ පන්ති {formData.enrolledClasses.length}ක් තෝරාගෙන ඇත. එක් ශ්‍රේණියකට එක් පන්තියක් පමණක් තෝරාගත හැකිය. පන්තියක් ඉවත් කිරීමට ❌ ක්ලික් කරන්න.
                                </Typography>
                                <Typography variant="body2" sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  color: 'success.dark',
                                  fontWeight: 'medium',
                                  fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                                  mt: 1
                                }}>
                                  🎯 අතිරේක පන්ති තේරීම: තවත් පන්ති තෝරාගැනීමට ශ්‍රේණියක් තෝරා අවශ්‍ය පන්තිය තෝරන්න.
                                </Typography>
                                <Typography variant="caption" sx={{
                                  display: 'block',
                                  mt: 1,
                                  color: 'text.secondary',
                                  fontStyle: 'italic',
                                  fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                                }}>
                                  💡 සටහන: ලියාපදිංචිය සම්පූර්ණ කිරීමට පෙර ඔබේ පන්ති තේරීම වෙනස් කළ හැකිය
                                </Typography>
                              </Box>
                            </Paper>
                          </Box>
                        )}
                        </Grid>
                      )}
                    </Grid>
                  )}
                </motion.div>
              )}

              {activeStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Typography variant="h6" gutterBottom sx={{
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                    color: 'primary.main'
                  }}>
                    <Security sx={{ mr: 1 }} />
                    ආරක්ෂාව සහ එකඟතාව (Security & Agreement)
                  </Typography>

                  {/* Password Information Note */}
                  <Alert
                    severity="info"
                    icon={<Info />}
                    sx={{
                      mb: 3,
                      bgcolor: 'rgba(33, 150, 243, 0.1)',
                      border: '1px solid rgba(33, 150, 243, 0.3)',
                      '& .MuiAlert-icon': {
                        color: 'info.main'
                      }
                    }}
                  >
                    <Typography variant="body2" sx={{
                      fontWeight: 'bold',
                      fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                      mb: 1
                    }}>
                      🔐 ශිෂ්‍ය ඩෑෂ්බෝඩ් මුරපදය (Student Dashboard Password)
                    </Typography>
                    <Typography variant="body2" sx={{
                      fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                      mb: 1
                    }}>
                      මෙය ඔබේ ශිෂ්‍ය ඩෑෂ්බෝඩ් මුරපදයයි. ඔබට ඔබේ පවතින පරිශීලක ගිණුමේ මුරපදය (ප්‍රවේශ වීම සඳහා භාවිතා කරන)
                      හෝ වෙනත් ඕනෑම මුරපදයක් භාවිතා කළ හැකිය. ඔබ කැමති එකක් තෝරාගෙන එය ඇතුලත් කරන්න.
                    </Typography>
                    <Typography variant="caption" sx={{
                      display: 'block',
                      fontStyle: 'italic',
                      color: 'text.secondary'
                    }}>
                      💡 This is your Student Dashboard password. You can use your existing User Account Password (used for Sign in)
                      or any other password. Choose the one you like. Best of luck! 🌟
                    </Typography>
                  </Alert>

                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="ශිෂ්‍ය මුරපදය (Student Password)"
                        type="password"
                        value={formData.studentPassword || ''}
                        onChange={(e) => handleInputChange('studentPassword', e.target.value)}
                        required
                        sx={{ minWidth: 200 }}
                        error={formData.studentPassword && formData.studentPassword.length < 6}
                        helperText={formData.studentPassword && formData.studentPassword.length < 6 ? 'මුරපදය අවම වශයෙන් අකුරු 6ක් විය යුතුය' : 'ආරක්ෂිත මුරපදයක් තෝරන්න'}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="මුරපදය තහවුරු කරන්න (Confirm Password)"
                        type="password"
                        value={formData.confirmPassword || ''}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        required
                        sx={{ minWidth: 200 }}
                        error={formData.confirmPassword && formData.studentPassword !== formData.confirmPassword}
                        helperText={formData.confirmPassword && formData.studentPassword !== formData.confirmPassword ? 'මුරපද නොගැලපේ' : 'මුරපදය නැවත ඇතුළත් කරන්න'}
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
                          alignItems: 'center',
                          fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                        }}>
                          <Security sx={{ mr: 1 }} />
                          නියම සහ කොන්දේසි (Terms and Conditions)
                        </Typography>
                        <Typography variant="body2" sx={{
                          mb: 2,
                          fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                          fontWeight: 'bold'
                        }}>
                          ශිෂ්‍යයෙකු ලෙස ලියාපදිංචි වීමෙන්, ඔබ පහත සඳහන් කරුණුවලට එකඟ වේ:
                        </Typography>
                        <Typography variant="body2" component="ul" sx={{
                          pl: 2,
                          mb: 2,
                          fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                        }}>
                          <li>සියලුම පන්ති මාර්ගෝපදේශ සහ නීති රීති අනුගමනය කිරීම</li>
                          <li>ගුරුවරුන්ට සහ සෙසු සිසුන්ට ගරු කිරීම</li>
                          <li>නිතිපතා සහ නියමිත වේලාවට පන්තිවලට පැමිණීම</li>
                          <li>අවශ්‍ය පරිදි පැවරුම් සහ ගෘහ කාර්ය සම්පූර්ණ කිරීම</li>
                          <li>පන්ති කාලය තුළ සුදුසු හැසිරීමක් පවත්වා ගැනීම</li>
                        </Typography>
                        <Typography variant="body2" sx={{
                          mb: 3,
                          fontStyle: 'italic',
                          color: 'text.secondary'
                        }}>
                          By registering as a student, you agree to: Follow all class guidelines and rules,
                          Respect teachers and fellow students, Attend classes regularly and on time,
                          Complete assignments and homework as required, Maintain appropriate behavior during classes.
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
                            <Typography variant="body2" sx={{
                              fontWeight: 'bold',
                              fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                            }}>
                              මම ශිෂ්‍ය මාර්ගෝපදේශ සහ නියමයන්ට එකඟ වෙමි *
                              <br />
                              <Typography variant="caption" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                                (I agree to the student guidelines and terms *)
                              </Typography>
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
                  fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                  '&:disabled': {
                    opacity: 0.5
                  }
                }}
              >
                ආපසු (Back)
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
                    fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                    background: loading ? 'grey.400' : 'linear-gradient(45deg, #4CAF50 30%, #45A049 90%)',
                    '&:hover': {
                      background: loading ? 'grey.400' : 'linear-gradient(45deg, #45A049 30%, #4CAF50 90%)',
                    },
                    '&:disabled': {
                      background: 'grey.400',
                      color: 'white',
                      opacity: 0.7
                    }
                  }}
                >
                  {loading ? 'ඉදිරිපත් කරමින්... (Submitting...)' : 'ලියාපදිංචිය සම්පූර්ණ කරන්න (Complete Registration)'}
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
                    fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                    background: !validateStep(activeStep)
                      ? 'linear-gradient(45deg, #bdbdbd 30%, #9e9e9e 90%)'
                      : 'linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)',
                    '&:hover': {
                      background: !validateStep(activeStep)
                        ? 'linear-gradient(45deg, #bdbdbd 30%, #9e9e9e 90%)'
                        : 'linear-gradient(45deg, #4ECDC4 30%, #FF6B6B 90%)',
                    },
                    '&:disabled': {
                      background: 'linear-gradient(45deg, #bdbdbd 30%, #9e9e9e 90%)',
                      color: 'white',
                      opacity: 0.7
                    }
                  }}
                >
                  ඊළඟ පියවර (Next Step)
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
