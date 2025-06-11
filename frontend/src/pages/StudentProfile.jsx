import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Divider,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Badge
} from '@mui/material';
import {
  Person as PersonIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  School as SchoolIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Cake as CakeIcon,
  Class as ClassIcon,
  AccountCircle as AccountCircleIcon,
  AdminPanelSettings as AdminIcon,
  Visibility as VisibilityIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';

const StudentProfile = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [student, setStudent] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [profilePictureUploading, setProfilePictureUploading] = useState(false);
  
  // Check if user is admin
  const userRole = localStorage.getItem('userRole');
  const isAdmin = userRole === 'admin' || userRole === 'moderator';

  useEffect(() => {
    loadStudentProfile();
  }, [studentId]);

  const loadStudentProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      let response;
      if (studentId && isAdmin) {
        // Admin viewing specific student profile
        response = await axios.get(
          `https://ayanna-kiyanna-new-backend.onrender.com/api/admin/students/${studentId}`,
          { headers: { 'x-auth-token': token } }
        );
      } else {
        // Student viewing own profile
        response = await axios.get(
          'https://ayanna-kiyanna-new-backend.onrender.com/api/students/profile',
          { headers: { 'x-auth-token': token } }
        );
      }

      // Handle different response structures
      const studentData = response.data.student || response.data;
      setStudent(studentData);
      setUserDetails(studentData.userId);
      setEditData({
        surname: response.data.surname || '',
        firstName: response.data.firstName || '',
        lastName: response.data.lastName || '',
        contactNumber: response.data.contactNumber || '',
        whatsappNumber: response.data.whatsappNumber || '',
        email: response.data.email || '',
        address: response.data.address || '',
        school: response.data.school || '',
        gender: response.data.gender || '',
        birthday: response.data.birthday ? response.data.birthday.split('T')[0] : '',
        currentStudent: response.data.currentStudent || '',
        guardianName: response.data.guardianName || '',
        guardianType: response.data.guardianType || '',
        guardianContact: response.data.guardianContact || '',
        selectedGrade: response.data.selectedGrade || ''
      });
    } catch (error) {
      console.error('Error loading student profile:', error);
      setError(error.response?.data?.message || 'Failed to load student profile');
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    setEditMode(!editMode);
    if (editMode) {
      // Reset edit data when canceling
      setEditData({
        surname: student.surname || '',
        firstName: student.firstName || '',
        lastName: student.lastName || '',
        contactNumber: student.contactNumber || '',
        whatsappNumber: student.whatsappNumber || '',
        email: student.email || '',
        address: student.address || '',
        school: student.school || '',
        gender: student.gender || '',
        birthday: student.birthday ? student.birthday.split('T')[0] : '',
        currentStudent: student.currentStudent || '',
        guardianName: student.guardianName || '',
        guardianType: student.guardianType || '',
        guardianContact: student.guardianContact || '',
        selectedGrade: student.selectedGrade || ''
      });
    }
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      
      // Calculate age from birthday
      const age = editData.birthday ? 
        Math.floor((new Date() - new Date(editData.birthday)) / (365.25 * 24 * 60 * 60 * 1000)) : 
        student.age;

      const updateData = {
        ...editData,
        age: age
      };

      let response;
      if (studentId && isAdmin) {
        // Admin updating student profile
        response = await axios.put(
          `https://ayanna-kiyanna-new-backend.onrender.com/api/admin/students/${studentId}/update`,
          updateData,
          { headers: { 'x-auth-token': token } }
        );
      } else {
        // Student updating own profile
        response = await axios.put(
          'https://ayanna-kiyanna-new-backend.onrender.com/api/students/profile/update',
          updateData,
          { headers: { 'x-auth-token': token } }
        );
      }

      // Handle different response structures
      const studentData = response.data.student || response.data;
      setStudent(studentData);
      setEditMode(false);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.response?.data?.message || 'Failed to update profile');
      setTimeout(() => setError(''), 5000);
    } finally {
      setSaving(false);
    }
  };

  const handleProfilePictureUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setProfilePictureUploading(true);
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'ml_default');
      formData.append('cloud_name', 'dl9k5qoae');

      const response = await fetch(
        'https://api.cloudinary.com/v1_1/dl9k5qoae/image/upload',
        {
          method: 'POST',
          body: formData
        }
      );

      const data = await response.json();
      
      if (data.secure_url) {
        // Update profile picture in database
        const token = localStorage.getItem('token');
        const updateData = { profilePicture: data.secure_url };

        let updateResponse;
        if (studentId && isAdmin) {
          updateResponse = await axios.put(
            `https://ayanna-kiyanna-new-backend.onrender.com/api/admin/students/${studentId}/update`,
            updateData,
            { headers: { 'x-auth-token': token } }
          );
        } else {
          updateResponse = await axios.put(
            'https://ayanna-kiyanna-new-backend.onrender.com/api/students/profile/update',
            updateData,
            { headers: { 'x-auth-token': token } }
          );
        }

        // Handle different response structures
        const studentData = updateResponse.data.student || updateResponse.data;
        setStudent(studentData);
        setSuccess('Profile picture updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      setError('Failed to upload profile picture');
      setTimeout(() => setError(''), 5000);
    } finally {
      setProfilePictureUploading(false);
    }
  };

  const handleAccessAsStudent = async (classId) => {
    try {
      const token = localStorage.getItem('token');

      // Check if student is enrolled in this class
      const isEnrolled = student.enrolledClasses?.some(
        classItem => classItem._id === classId
      );

      if (!isEnrolled) {
        setError('Student is not enrolled in this class.');
        setTimeout(() => setError(''), 5000);
        return;
      }

      // Store admin view information
      localStorage.setItem('adminView', 'true');
      localStorage.setItem('adminViewStudentId', studentId);
      localStorage.setItem('adminViewStudentName', `${student.firstName} ${student.lastName}`);
      localStorage.setItem('adminViewStudentIdNumber', student.studentId);
      localStorage.setItem('originalAdminToken', token);

      // Set student role and data for the session
      localStorage.setItem('userRole', 'student');
      localStorage.setItem('studentData', JSON.stringify(student));
      localStorage.setItem('adminAsStudentMode', 'true');

      // Navigate to specific class
      navigate(`/specific-class/${classId}`);
    } catch (error) {
      console.error('Error accessing as student:', error);
      setError('Failed to access class as student. Please try again.');
      setTimeout(() => setError(''), 5000);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  if (!student) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">
          Student profile not found.
          {error && (
            <div>
              <br />
              Error details: {error}
              <br />
              Student ID: {studentId}
              <br />
              User Role: {userRole}
              <br />
              Is Admin: {isAdmin ? 'Yes' : 'No'}
            </div>
          )}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Back Button */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(isAdmin ? '/student-management' : '/student-dashboard')}
        sx={{ mb: 2 }}
      >
        Back to {isAdmin ? 'Student Management' : 'Dashboard'}
      </Button>

      {/* Success/Error Messages */}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Page Title */}
      <Typography variant="h4" gutterBottom sx={{ 
        fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
        fontWeight: 'bold',
        color: 'primary.main',
        mb: 3
      }}>
        {isAdmin ? 'Student Profile Management' : 'My Profile'}
      </Typography>

      <Grid container spacing={3}>
        {/* User Account Details Section */}
        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Paper elevation={6} sx={{ p: 3, borderRadius: 3, mb: 3 }}>
              <Typography variant="h5" gutterBottom sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                color: 'primary.main',
                fontWeight: 'bold'
              }}>
                <AccountCircleIcon />
                User Account Details
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <EmailIcon color="primary" />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Email Address
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {userDetails?.email || 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <PersonIcon color="primary" />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Full Name
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {userDetails?.fullName || 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <AdminIcon color="primary" />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Role
                      </Typography>
                      <Chip 
                        label={userDetails?.role || 'N/A'} 
                        color="primary" 
                        size="small"
                      />
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Badge 
                      color={userDetails?.emailVerified ? 'success' : 'error'}
                      variant="dot"
                    >
                      <EmailIcon color="primary" />
                    </Badge>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Email Verification
                      </Typography>
                      <Chip 
                        label={userDetails?.emailVerified ? 'Verified' : 'Not Verified'} 
                        color={userDetails?.emailVerified ? 'success' : 'error'} 
                        size="small"
                      />
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </motion.div>
        </Grid>

        {/* Student Account Details Section */}
        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Paper elevation={6} sx={{ p: 3, borderRadius: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: 'primary.main',
                  fontWeight: 'bold'
                }}>
                  <SchoolIcon />
                  Student Account Details
                </Typography>

                {/* Edit Button - Only show if admin or own profile */}
                {(isAdmin || !studentId) && (
                  <Button
                    variant={editMode ? "outlined" : "contained"}
                    color={editMode ? "error" : "primary"}
                    startIcon={editMode ? <CancelIcon /> : <EditIcon />}
                    onClick={handleEditToggle}
                    disabled={saving}
                  >
                    {editMode ? 'Cancel' : 'Edit Profile'}
                  </Button>
                )}
              </Box>
              <Divider sx={{ mb: 3 }} />

              {/* Profile Picture Section */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                <Box sx={{ position: 'relative' }}>
                  <Avatar
                    src={student.profilePicture}
                    sx={{
                      width: 120,
                      height: 120,
                      border: '4px solid',
                      borderColor: 'primary.main',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                    }}
                  >
                    {student.firstName?.[0]}{student.lastName?.[0]}
                  </Avatar>

                  {editMode && (
                    <Box sx={{ position: 'absolute', bottom: -10, right: -10 }}>
                      <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="profile-picture-upload"
                        type="file"
                        onChange={handleProfilePictureUpload}
                      />
                      <label htmlFor="profile-picture-upload">
                        <IconButton
                          component="span"
                          sx={{
                            bgcolor: 'primary.main',
                            color: 'white',
                            '&:hover': { bgcolor: 'primary.dark' }
                          }}
                          disabled={profilePictureUploading}
                        >
                          {profilePictureUploading ? (
                            <CircularProgress size={20} color="inherit" />
                          ) : (
                            <EditIcon />
                          )}
                        </IconButton>
                      </label>
                    </Box>
                  )}
                </Box>
              </Box>

              <Grid container spacing={3}>
                {/* Personal Information */}
                <Grid item xs={12}>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Personal Information
                  </Typography>
                </Grid>

                <Grid item xs={12} md={4}>
                  {editMode ? (
                    <TextField
                      fullWidth
                      label="Surname"
                      value={editData.surname}
                      onChange={(e) => handleInputChange('surname', e.target.value)}
                      required
                    />
                  ) : (
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Surname
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {student.surname || 'N/A'}
                      </Typography>
                    </Box>
                  )}
                </Grid>

                <Grid item xs={12} md={4}>
                  {editMode ? (
                    <TextField
                      fullWidth
                      label="First Name"
                      value={editData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      required
                    />
                  ) : (
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        First Name
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {student.firstName || 'N/A'}
                      </Typography>
                    </Box>
                  )}
                </Grid>

                <Grid item xs={12} md={4}>
                  {editMode ? (
                    <TextField
                      fullWidth
                      label="Last Name"
                      value={editData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      required
                    />
                  ) : (
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Last Name
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {student.lastName || 'N/A'}
                      </Typography>
                    </Box>
                  )}
                </Grid>

                <Grid item xs={12} md={6}>
                  {editMode ? (
                    <TextField
                      fullWidth
                      label="Contact Number"
                      value={editData.contactNumber}
                      onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                      required
                    />
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <PhoneIcon color="primary" />
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Contact Number
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {student.contactNumber || 'N/A'}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Grid>

                <Grid item xs={12} md={6}>
                  {editMode ? (
                    <TextField
                      fullWidth
                      label="WhatsApp Number"
                      value={editData.whatsappNumber}
                      onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
                      required
                    />
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <PhoneIcon color="primary" />
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          WhatsApp Number
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {student.whatsappNumber || 'N/A'}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Grid>

                <Grid item xs={12} md={6}>
                  {editMode && isAdmin ? (
                    <TextField
                      fullWidth
                      label="Email Address"
                      value={editData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                      helperText="Only admin can change email"
                    />
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <EmailIcon color="primary" />
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Email Address
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {student.email || 'N/A'}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Grid>

                <Grid item xs={12} md={6}>
                  {editMode ? (
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      label="Address"
                      value={editData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      required
                    />
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <LocationIcon color="primary" />
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Address
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {student.address || 'N/A'}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Grid>

                {/* Additional Information */}
                <Grid item xs={12}>
                  <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 2 }}>
                    Additional Information
                  </Typography>
                </Grid>

                <Grid item xs={12} md={4}>
                  {editMode ? (
                    <TextField
                      fullWidth
                      label="School"
                      value={editData.school}
                      onChange={(e) => handleInputChange('school', e.target.value)}
                      required
                    />
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <SchoolIcon color="primary" />
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          School
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {student.school || 'N/A'}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Grid>

                <Grid item xs={12} md={4}>
                  {editMode ? (
                    <FormControl fullWidth required>
                      <InputLabel>Gender</InputLabel>
                      <Select
                        value={editData.gender}
                        onChange={(e) => handleInputChange('gender', e.target.value)}
                        label="Gender"
                      >
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                      </Select>
                    </FormControl>
                  ) : (
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Gender
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {student.gender || 'N/A'}
                      </Typography>
                    </Box>
                  )}
                </Grid>

                <Grid item xs={12} md={4}>
                  {editMode ? (
                    <TextField
                      fullWidth
                      type="date"
                      label="Birthday"
                      value={editData.birthday}
                      onChange={(e) => handleInputChange('birthday', e.target.value)}
                      slotProps={{ inputLabel: { shrink: true } }}
                      required
                    />
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <CakeIcon color="primary" />
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Birthday
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {student.birthday ? new Date(student.birthday).toLocaleDateString() : 'N/A'}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Grid>

                <Grid item xs={12} md={4}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Age
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {student.age || 'N/A'} years
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={4}>
                  {editMode ? (
                    <FormControl fullWidth required>
                      <InputLabel>Current Student Status</InputLabel>
                      <Select
                        value={editData.currentStudent}
                        onChange={(e) => handleInputChange('currentStudent', e.target.value)}
                        label="Current Student Status"
                      >
                        <MenuItem value="Current Student">Current Student</MenuItem>
                        <MenuItem value="New Student">New Student</MenuItem>
                      </Select>
                    </FormControl>
                  ) : (
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Student Status
                      </Typography>
                      <Chip
                        label={student.currentStudent || 'N/A'}
                        color={student.currentStudent === 'Current Student' ? 'success' : 'info'}
                        size="small"
                      />
                    </Box>
                  )}
                </Grid>

                <Grid item xs={12} md={4}>
                  {editMode ? (
                    <FormControl fullWidth required>
                      <InputLabel>Selected Grade</InputLabel>
                      <Select
                        value={editData.selectedGrade}
                        onChange={(e) => handleInputChange('selectedGrade', e.target.value)}
                        label="Selected Grade"
                      >
                        <MenuItem value="Grade 9">Grade 9</MenuItem>
                        <MenuItem value="Grade 10">Grade 10</MenuItem>
                        <MenuItem value="Grade 11">Grade 11</MenuItem>
                        <MenuItem value="A/L">A/L</MenuItem>
                      </Select>
                    </FormControl>
                  ) : (
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Selected Grade
                      </Typography>
                      <Chip
                        label={student.selectedGrade || 'N/A'}
                        color="primary"
                        size="small"
                      />
                    </Box>
                  )}
                </Grid>

                {/* Guardian Information */}
                <Grid item xs={12}>
                  <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 2 }}>
                    Guardian Information
                  </Typography>
                </Grid>

                <Grid item xs={12} md={4}>
                  {editMode ? (
                    <TextField
                      fullWidth
                      label="Guardian Name"
                      value={editData.guardianName}
                      onChange={(e) => handleInputChange('guardianName', e.target.value)}
                      required
                    />
                  ) : (
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Guardian Name
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {student.guardianName || 'N/A'}
                      </Typography>
                    </Box>
                  )}
                </Grid>

                <Grid item xs={12} md={4}>
                  {editMode ? (
                    <FormControl fullWidth required>
                      <InputLabel>Guardian Type</InputLabel>
                      <Select
                        value={editData.guardianType}
                        onChange={(e) => handleInputChange('guardianType', e.target.value)}
                        label="Guardian Type"
                      >
                        <MenuItem value="Mother">Mother</MenuItem>
                        <MenuItem value="Father">Father</MenuItem>
                        <MenuItem value="Guardian">Guardian</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                      </Select>
                    </FormControl>
                  ) : (
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Guardian Type
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {student.guardianType || 'N/A'}
                      </Typography>
                    </Box>
                  )}
                </Grid>

                <Grid item xs={12} md={4}>
                  {editMode ? (
                    <TextField
                      fullWidth
                      label="Guardian Contact"
                      value={editData.guardianContact}
                      onChange={(e) => handleInputChange('guardianContact', e.target.value)}
                      required
                    />
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <PhoneIcon color="primary" />
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Guardian Contact
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {student.guardianContact || 'N/A'}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Grid>

                {/* System Information - Display Only */}
                <Grid item xs={12}>
                  <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 2 }}>
                    System Information
                  </Typography>
                </Grid>

                <Grid item xs={12} md={3}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Student ID
                    </Typography>
                    <Typography variant="body1" fontWeight="medium" color="primary">
                      {student.studentId || 'N/A'}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={3}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Payment Role
                    </Typography>
                    <Chip
                      label={student.paymentRole || 'N/A'}
                      color="info"
                      size="small"
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} md={3}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Payment Status
                    </Typography>
                    <Chip
                      label={student.paymentStatus || 'N/A'}
                      color={
                        student.paymentStatus === 'Paid' ? 'success' :
                        student.paymentStatus === 'Unpaid' ? 'error' : 'warning'
                      }
                      size="small"
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} md={3}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Free Classes
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {student.freeClasses?.length || 0} classes
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* Save Button */}
              {editMode && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                    disabled={saving}
                    size="large"
                  >
                    {saving ? <CircularProgress size={20} color="inherit" /> : 'Save Changes'}
                  </Button>
                </Box>
              )}
            </Paper>
          </motion.div>
        </Grid>

        {/* Enrolled Classes Section */}
        {student.enrolledClasses && Array.isArray(student.enrolledClasses) && student.enrolledClasses.length > 0 && (
          <Grid item xs={12}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Paper elevation={6} sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h5" gutterBottom sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: 'primary.main',
                  fontWeight: 'bold'
                }}>
                  <ClassIcon />
                  Enrolled Classes ({student.enrolledClasses.length})
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  {student.enrolledClasses.map((classItem, index) => (
                    <Grid item xs={12} md={6} lg={4} key={classItem._id || index}>
                      <Card
                        elevation={4}
                        sx={{
                          height: '100%',
                          borderRadius: 2,
                          border: '2px solid',
                          borderColor: 'primary.light',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                          }
                        }}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <Typography variant="h6" color="primary" fontWeight="bold">
                              {classItem.grade || 'N/A'}
                            </Typography>
                            <Chip
                              label={classItem.category || 'General'}
                              size="small"
                              color="secondary"
                            />
                          </Box>

                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Type: {classItem.type || 'N/A'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Date: {classItem.date ? new Date(classItem.date).toLocaleDateString() : 'N/A'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Time: {classItem.startTime || 'N/A'} - {classItem.endTime || 'N/A'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Venue: {classItem.venue || 'N/A'}
                            </Typography>
                            {classItem.platform && (
                              <Typography variant="body2" color="text.secondary" gutterBottom>
                                Platform: {classItem.platform}
                              </Typography>
                            )}
                            <Typography variant="body2" color="text.secondary">
                              Capacity: {classItem.enrolledStudents?.length || 0}/{classItem.capacity || 'N/A'}
                            </Typography>
                          </Box>

                          {/* Admin Access Button */}
                          {isAdmin && (
                            <Box sx={{ mt: 2 }}>
                              <Button
                                fullWidth
                                variant="contained"
                                color="secondary"
                                startIcon={<VisibilityIcon />}
                                onClick={() => handleAccessAsStudent(classItem._id)}
                                sx={{
                                  background: 'linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)',
                                  fontWeight: 'bold',
                                  '&:hover': {
                                    background: 'linear-gradient(45deg, #FF5252 30%, #26A69A 90%)',
                                  }
                                }}
                              >
                                Access as this Student
                              </Button>
                            </Box>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </motion.div>
          </Grid>
        )}

        {/* No Enrolled Classes Message */}
        {(!student.enrolledClasses || !Array.isArray(student.enrolledClasses) || student.enrolledClasses.length === 0) && (
          <Grid item xs={12}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Paper elevation={6} sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h5" gutterBottom sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: 'primary.main',
                  fontWeight: 'bold'
                }}>
                  <ClassIcon />
                  Enrolled Classes
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No Enrolled Classes
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    This student is not currently enrolled in any classes.
                  </Typography>
                </Box>
              </Paper>
            </motion.div>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default StudentProfile;
