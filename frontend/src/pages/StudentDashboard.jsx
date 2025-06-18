import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Avatar,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Badge,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip
} from '@mui/material';
import {
  School,
  Person,
  Class as ClassIcon,
  Schedule,
  CheckCircle,
  Pending,
  Lock,
  Visibility,
  Add,
  Add as AddIcon,
  Notifications,
  Dashboard as DashboardIcon,
  LocationOn,
  AccessTime,
  Group,
  Delete,
  Edit,
  Warning,
  Payment,
  Refresh as RefreshIcon,
  Message as MessageIcon,
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  ExpandMore as ExpandMoreIcon,
  Announcement as AnnouncementIcon,
  Link as LinkIcon,
  Close as CloseIcon,
  ContentCopy as ContentCopyIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const StudentDashboard = () => {
  const navigate = useNavigate();

  const [error, setError] = useState('');
  const [student, setStudent] = useState(null);
  const [availableClasses, setAvailableClasses] = useState([]);
  const [classRequests, setClassRequests] = useState([]);
  const [showAllRequests, setShowAllRequests] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(true);
  const [studentPassword, setStudentPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [authenticating, setAuthenticating] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [requestReason, setRequestReason] = useState('');
  const [submittingRequest, setSubmittingRequest] = useState(false);

  // Forgot Password States
  const [showForgotPasswordDialog, setShowForgotPasswordDialog] = useState(false);
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [showNewPasswordDialog, setShowNewPasswordDialog] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [forgotPasswordError, setForgotPasswordError] = useState('');
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);

  // Grade Filter States
  const [availableGrades, setAvailableGrades] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState('');
  const [loadingGrades, setLoadingGrades] = useState(false);

  // Payment Status States
  const [paymentStatuses, setPaymentStatuses] = useState({});
  const [paymentStatusesLoaded, setPaymentStatusesLoaded] = useState(false);

  // Loading States
  const [accessingClass, setAccessingClass] = useState({});

  // Student Notices States
  const [studentNotices, setStudentNotices] = useState([]);
  const [loadingNotices, setLoadingNotices] = useState(false);

  // Student Message States
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [showMyMessagesDialog, setShowMyMessagesDialog] = useState(false);
  const [showEditMessageDialog, setShowEditMessageDialog] = useState(false);
  const [myMessages, setMyMessages] = useState([]);
  const [loadingMyMessages, setLoadingMyMessages] = useState(false);
  const [selectedEditMessage, setSelectedEditMessage] = useState(null);
  const [messageData, setMessageData] = useState({
    about: '',
    message: '',
    attachments: [],
    sourceLinks: ['']
  });
  const [submittingMessage, setSubmittingMessage] = useState(false);
  const [tooltipText, setTooltipText] = useState('Click to copy');

  // Month names in Sinhala
  const monthNames = [
    'ජනවාරි', 'පෙබරවාරි', 'මාර්තු', 'අප්‍රේල්', 'මැයි', 'ජූනි',
    'ජූලි', 'අගෝස්තු', 'සැප්තැම්බර්', 'ඔක්තෝබර්', 'නොවැම්බර්', 'දෙසැම්බර්'
  ];

  useEffect(() => {
    const checkUserAccess = async () => {
      // Check if user is logged in
      const userEmail = localStorage.getItem('userEmail');
      const token = localStorage.getItem('token');

      if (!userEmail || !token) {
        setError('Please login first');
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      try {
        // Check user role from database
        const response = await axios.get('https://ayanna-kiyanna-new-backend.onrender.com/api/auth/me', {
          headers: { 'x-auth-token': token }
        });

        const currentUserRole = response.data.role;

        if (currentUserRole !== 'student') {
          setError('Access denied. Student role required.');
          setTimeout(() => navigate('/'), 3000);
          return;
        }

        // Dashboard data will be loaded after successful login
      } catch (error) {
        console.error('Error checking user role:', error);
        if (error.response?.status === 401) {
          setError('Your session has expired. Please login again.');
          localStorage.removeItem('token');
          localStorage.removeItem('userEmail');
          localStorage.removeItem('userRole');
          setTimeout(() => navigate('/login'), 3000);
        } else {
          setError('Failed to verify user permissions.');
          setTimeout(() => navigate('/'), 3000);
        }
      }
    };

    checkUserAccess();
  }, [navigate, authenticated]);

  // Load grades when authenticated
  useEffect(() => {
    if (authenticated) {
      loadGrades();
    }
  }, [authenticated]);

  // Check payment statuses when student data is available
  useEffect(() => {
    if (student && student.enrolledClasses && student.enrolledClasses.length > 0) {
      console.log('Checking payment statuses for enrolled classes:', student.enrolledClasses.length);
      checkPaymentStatuses(student.enrolledClasses);
    }
  }, [student]);

  // Also check payment statuses when authenticated and student data changes
  useEffect(() => {
    if (authenticated && student && student.enrolledClasses && student.enrolledClasses.length > 0) {
      console.log('Re-checking payment statuses after authentication:', student.enrolledClasses.length);
      checkPaymentStatuses(student.enrolledClasses);
    }
  }, [authenticated, student?.enrolledClasses]);



  const loadAdditionalData = async () => {
    try {
      const token = localStorage.getItem('token');

      // Load available classes (with error handling)
      try {
        const classesResponse = await axios.get(
          'https://ayanna-kiyanna-new-backend.onrender.com/api/students/available-classes',
          { headers: { 'x-auth-token': token } }
        );
        setAvailableClasses(classesResponse.data.classes || []);
      } catch (error) {
        console.error('Error loading available classes:', error);
        setAvailableClasses([]);
      }

      // Load class requests (with error handling)
      try {
        const requestsResponse = await axios.get(
          'https://ayanna-kiyanna-new-backend.onrender.com/api/students/class-requests',
          { headers: { 'x-auth-token': token } }
        );
        setClassRequests(requestsResponse.data.requests || []);
      } catch (error) {
        console.error('Error loading class requests:', error);
        setClassRequests([]);
      }
    } catch (error) {
      console.error('Error loading additional data:', error);
    }
  };

  const checkPaymentStatuses = async (enrolledClasses) => {
    if (!enrolledClasses || enrolledClasses.length === 0) return;

    try {
      const token = localStorage.getItem('token');
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;
      const statuses = {};

      // Check payment status for each enrolled class
      for (const classItem of enrolledClasses) {
        try {
          const response = await axios.get(
            `https://ayanna-kiyanna-new-backend.onrender.com/api/payments/student/${classItem._id}/${currentYear}`,
            { headers: { 'x-auth-token': token } }
          );

          const monthlyStatus = response.data.monthlyStatus;

          // Check all months for overdue or rejected payments, not just current month
          let hasOverduePayment = false;
          let hasRejectedPayment = false;
          let currentMonthRequiresPayment = false;
          let currentMonthPaymentStatus = null;

          monthlyStatus.forEach(monthData => {
            // Check for overdue payments (past months that require payment but don't have approved payment)
            if (monthData.isOverdue) {
              hasOverduePayment = true;
            }

            // Check for rejected payments in any month
            if (monthData.payment?.status === 'Rejected') {
              hasRejectedPayment = true;
            }

            // Get current month specific data
            if (monthData.month === currentMonth) {
              currentMonthRequiresPayment = monthData.requiresPayment;
              currentMonthPaymentStatus = monthData.payment?.status || null;
            }
          });

          statuses[classItem._id] = {
            isOverdue: hasOverduePayment,
            isRejected: hasRejectedPayment,
            requiresPayment: currentMonthRequiresPayment,
            isFreeClass: monthlyStatus[0]?.isFreeClass || false,
            paymentStatus: currentMonthPaymentStatus
          };

          // Debug logging
          console.log(`Payment status for class ${classItem._id} (${classItem.grade}):`, {
            hasOverduePayment,
            hasRejectedPayment,
            currentMonthRequiresPayment,
            currentMonthPaymentStatus,
            monthlyStatusCount: monthlyStatus.length,
            allMonthsData: monthlyStatus
          });
        } catch (error) {
          console.error(`Error checking payment status for class ${classItem._id}:`, error);
          // Set default status if error occurs (allow access if we can't check payment status)
          statuses[classItem._id] = {
            isOverdue: false,
            isRejected: false,
            requiresPayment: false,
            isFreeClass: false,
            paymentStatus: null,
            error: true
          };
        }
      }

      setPaymentStatuses(statuses);
      setPaymentStatusesLoaded(true);
      console.log('Final payment statuses:', statuses);
    } catch (error) {
      console.error('Error checking payment statuses:', error);
      setPaymentStatusesLoaded(true); // Set loaded even on error to prevent infinite loading
    }
  };

  // Function to validate payment before allowing class access
  const validateClassAccess = async (classItem) => {
    try {
      // Set loading state for this specific class
      setAccessingClass(prev => ({ ...prev, [classItem._id]: true }));

      const token = localStorage.getItem('token');
      const currentYear = new Date().getFullYear();

      console.log('Validating class access for:', classItem.grade);

      const response = await axios.get(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/payments/student/${classItem._id}/${currentYear}`,
        { headers: { 'x-auth-token': token } }
      );

      const monthlyStatus = response.data.monthlyStatus;

      // Check for any payment issues
      let hasOverduePayment = false;
      let hasRejectedPayment = false;
      let overdueMonths = [];
      let rejectedMonths = [];

      monthlyStatus.forEach(monthData => {
        if (monthData.isOverdue) {
          hasOverduePayment = true;
          overdueMonths.push(monthData.month);
        }

        if (monthData.payment?.status === 'Rejected') {
          hasRejectedPayment = true;
          rejectedMonths.push(monthData.month);
        }
      });

      // If there are payment issues, show error dialog and prevent access
      if (hasOverduePayment || hasRejectedPayment) {
        // Show payment issue message
        alert(
          `පන්තියට ප්‍රවේශ වීමට පෙර ගෙවීම් ගැටළු විසඳන්න:\n\n${
            hasOverduePayment ? `⚠️ ප්‍රමාද වූ ගෙවීම් මාස : ${overdueMonths.map(m => monthNames[m - 1]).join(', ')}\n` : ''
          }${
            hasRejectedPayment ? `❌ ප්‍රතික්ෂේප වූ ගෙවීම් මාස : ${rejectedMonths.map(m => monthNames[m - 1]).join(', ')}\n` : ''
          }\nගෙවීම් කළමනාකරණය සඳහා "Pay Now" බොත්තම ක්ලික් කරන්න.`
        );

        // Refresh payment status and update UI to show the payment issues
        console.log('Refreshing payment status after payment issue detected');

        // Update payment status for this specific class
        const updatedStatuses = { ...paymentStatuses };
        updatedStatuses[classItem._id] = {
          ...updatedStatuses[classItem._id],
          isOverdue: hasOverduePayment,
          isRejected: hasRejectedPayment,
          accessBlocked: true // Add flag to show access is blocked
        };
        setPaymentStatuses(updatedStatuses);

        // Also refresh all payment statuses to ensure UI is up to date
        if (student && student.enrolledClasses) {
          await checkPaymentStatuses(student.enrolledClasses);
        }

        // Clear loading state
        setAccessingClass(prev => ({ ...prev, [classItem._id]: false }));
        return false;
      }

      // If no payment issues, allow access
      // Clear loading state
      setAccessingClass(prev => ({ ...prev, [classItem._id]: false }));
      return true;

    } catch (error) {
      console.error('Error validating class access:', error);
      // Clear loading state
      setAccessingClass(prev => ({ ...prev, [classItem._id]: false }));
      // If we can't check payment status, allow access (don't block due to technical issues)
      return true;
    }
  };

  // Function to refresh payment statuses for all classes
  const refreshPaymentStatuses = async () => {
    if (student && student.enrolledClasses && student.enrolledClasses.length > 0) {
      console.log('Manually refreshing payment statuses...');
      await checkPaymentStatuses(student.enrolledClasses);
    }
  };

  // Load student notices
  const loadStudentNotices = async () => {
    setLoadingNotices(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'https://ayanna-kiyanna-new-backend.onrender.com/api/student-notices',
        { headers: { 'x-auth-token': token } }
      );

      if (response.data.success) {
        setStudentNotices(response.data.data);
      }
    } catch (error) {
      console.error('Error loading student notices:', error);
    } finally {
      setLoadingNotices(false);
    }
  };

  // Handle message form
  const handleOpenMessageDialog = () => {
    setMessageData({
      about: '',
      message: '',
      attachments: [],
      sourceLinks: ['']
    });
    setShowMessageDialog(true);
  };



  const handleMessageInputChange = (field, value) => {
    setMessageData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = async (files) => {
    if (files.length + messageData.attachments.length > 5) {
      alert('උපරිම ගොනු 5ක් පමණක් අමුණා ගත හැක');
      return;
    }

    const uploadPromises = Array.from(files).map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'ml_default');

      try {
        const response = await axios.post(
          'https://api.cloudinary.com/v1_1/dl9k5qoae/auto/upload',
          formData
        );

        return {
          url: response.data.secure_url,
          publicId: response.data.public_id,
          type: file.type.startsWith('image/') ? 'image' : 'raw',
          originalName: file.name
        };
      } catch (error) {
        console.error('File upload error:', error);
        throw error;
      }
    });

    try {
      const uploadedFiles = await Promise.all(uploadPromises);
      setMessageData(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...uploadedFiles]
      }));
    } catch (error) {
      alert('ගොනු උඩුගත කිරීමේදී දෝෂයක් ඇතිවිය');
    }
  };

  const removeAttachment = (index) => {
    setMessageData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleSourceLinkChange = (index, value) => {
    const currentLinks = messageData.sourceLinks || [''];
    const newLinks = [...currentLinks];
    newLinks[index] = value;
    setMessageData(prev => ({
      ...prev,
      sourceLinks: newLinks
    }));
  };

  const addSourceLink = () => {
    setMessageData(prev => ({
      ...prev,
      sourceLinks: [...(prev.sourceLinks || []), '']
    }));
  };

  const removeSourceLink = (index) => {
    const currentLinks = messageData.sourceLinks || [''];
    const newLinks = currentLinks.filter((_, i) => i !== index);
    setMessageData(prev => ({
      ...prev,
      sourceLinks: newLinks.length > 0 ? newLinks : ['']
    }));
  };

  const submitMessage = async () => {
    if (!messageData.about.trim() || !messageData.message.trim()) {
      alert('විෂය සහ පණිවිඩය අවශ්‍ය වේ');
      return;
    }

    setSubmittingMessage(true);
    try {
      const token = localStorage.getItem('token');
      const submitData = {
        ...messageData,
        sourceLinks: (messageData.sourceLinks || []).filter(link => link.trim() !== '')
      };
      let response;

      if (selectedEditMessage) {
        // Update existing message
        response = await axios.put(
          `https://ayanna-kiyanna-new-backend.onrender.com/api/student-messages/${selectedEditMessage._id}`,
          submitData,
          { headers: { 'x-auth-token': token } }
        );
      } else {
        // Create new message
        response = await axios.post(
          'https://ayanna-kiyanna-new-backend.onrender.com/api/student-messages',
          submitData,
          { headers: { 'x-auth-token': token } }
        );
      }

      if (response.data.success) {
        alert(selectedEditMessage ? 'පණිවිඩය සාර්ථකව යාවත්කාලීන කරන ලදී' : 'පණිවිඩය සාර්ථකව යවන ලදී');
        handleCloseMessageDialog();
        if (showMyMessagesDialog) {
          loadMyMessages(); // Refresh messages if viewing messages dialog is open
        }
      }
    } catch (error) {
      console.error('Error submitting message:', error);
      alert('පණිවිඩය යැවීමේදී දෝෂයක් ඇතිවිය');
    } finally {
      setSubmittingMessage(false);
    }
  };

  // Load user's messages
  const loadMyMessages = async () => {
    setLoadingMyMessages(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'https://ayanna-kiyanna-new-backend.onrender.com/api/student-messages/my-messages',
        { headers: { 'x-auth-token': token } }
      );

      if (response.data.success) {

        setMyMessages(response.data.data);
      }
    } catch (error) {
      console.error('Error loading my messages:', error);
      alert('පණිවිඩ ලබා ගැනීමේදී දෝෂයක් ඇතිවිය');
    } finally {
      setLoadingMyMessages(false);
    }
  };

  // Handle edit message
  const handleEditMessage = (message) => {
    setSelectedEditMessage(message);
    setMessageData({
      about: message.about,
      message: message.message,
      attachments: message.attachments || [],
      sourceLinks: message.sourceLinks && message.sourceLinks.length > 0 ? message.sourceLinks : ['']
    });
    setShowMyMessagesDialog(false);
    setShowMessageDialog(true);
  };

  // Handle delete message
  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm('ඔබට මෙම පණිවිඩය මකා දැමීමට අවශ්‍යද?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/student-messages/${messageId}`,
        { headers: { 'x-auth-token': token } }
      );

      if (response.data.success) {
        alert('පණිවිඩය සාර්ථකව මකා දමන ලදී');
        loadMyMessages(); // Refresh messages
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('පණිවිඩය මකා දැමීමේදී දෝෂයක් ඇතිවිය');
    }
  };

  // Handle close message dialog
  const handleCloseMessageDialog = () => {
    setShowMessageDialog(false);
    setSelectedEditMessage(null);
    setMessageData({
      about: '',
      message: '',
      attachments: [],
      sourceLinks: ['']
    });
  };

  const handleStudentLogin = async () => {
    if (!studentPassword) {
      setPasswordError('Please enter your student password');
      return;
    }

    setAuthenticating(true);
    setPasswordError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'https://ayanna-kiyanna-new-backend.onrender.com/api/students/login',
        { studentPassword },
        { headers: { 'x-auth-token': token } }
      );

      // Set student data from login response
      setStudent(response.data.student);
      setAuthenticated(true);
      setShowPasswordDialog(false);

      // Load additional data separately with error handling
      await loadAdditionalData();

      // Load student notices
      await loadStudentNotices();

      // Check payment statuses for enrolled classes
      if (response.data.student.enrolledClasses) {
        await checkPaymentStatuses(response.data.student.enrolledClasses);
      }
    } catch (error) {
      setPasswordError(error.response?.data?.message || 'Invalid student password');
    } finally {
      setAuthenticating(false);
    }
  };

  const handleClassEnrollment = (classItem) => {
    setSelectedClass(classItem);
    setShowRequestDialog(true);
    setRequestReason('');
  };

  const submitClassRequest = async () => {
    if (!requestReason.trim()) {
      alert('Please enter a reason for your enrollment request');
      return;
    }

    if (requestReason.trim().length < 10) {
      alert('Please provide a more detailed reason (at least 10 characters)');
      return;
    }

    setSubmittingRequest(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'https://ayanna-kiyanna-new-backend.onrender.com/api/class-requests',
        {
          classId: selectedClass._id,
          reason: requestReason.trim()
        },
        { headers: { 'x-auth-token': token } }
      );

      // Reload data
      await loadAdditionalData();
      setShowRequestDialog(false);
      alert('Class enrollment request submitted successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit enrollment request');
    } finally {
      setSubmittingRequest(false);
    }
  };

  const deleteClassRequest = async (requestId) => {
    if (!window.confirm('Are you sure you want to delete this class request?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/class-requests/${requestId}`,
        { headers: { 'x-auth-token': token } }
      );

      // Reload data
      await loadAdditionalData();
      alert('Class request deleted successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete class request');
    }
  };

  // Forgot Password Functions
  const handleForgotPassword = () => {
    setShowPasswordDialog(false);
    setForgotPasswordError('');

    // Check if email is stored in localStorage
    const storedEmail = localStorage.getItem('userEmail');

    if (storedEmail) {
      // If email is stored, use it directly and send OTP
      setForgotPasswordEmail(storedEmail);
      sendPasswordResetOTPDirectly(storedEmail);
    } else {
      // If no email stored, show email input dialog
      setForgotPasswordEmail('');
      setShowForgotPasswordDialog(true);
    }
  };

  const sendPasswordResetOTPDirectly = async (email) => {
    setForgotPasswordLoading(true);
    setForgotPasswordError('');

    try {
      await axios.post('https://ayanna-kiyanna-new-backend.onrender.com/api/students/forgot-password', {
        email: email
      });

      setShowOtpDialog(true);
      alert(`Password reset code sent to ${email}!`);
    } catch (error) {
      setForgotPasswordError(error.response?.data?.message || 'Failed to send reset code');
      // If there's an error, show the email input dialog
      setShowForgotPasswordDialog(true);
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const sendPasswordResetOTP = async () => {
    if (!forgotPasswordEmail) {
      setForgotPasswordError('Please enter your email address');
      return;
    }

    setForgotPasswordLoading(true);
    setForgotPasswordError('');

    try {
      await axios.post('https://ayanna-kiyanna-new-backend.onrender.com/api/students/forgot-password', {
        email: forgotPasswordEmail
      });

      setShowForgotPasswordDialog(false);
      setShowOtpDialog(true);
      alert('Password reset code sent to your email!');
    } catch (error) {
      setForgotPasswordError(error.response?.data?.message || 'Failed to send reset code');
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const verifyOTPAndProceed = async () => {
    if (!otpCode || otpCode.length !== 6) {
      setForgotPasswordError('Please enter a valid 6-digit OTP');
      return;
    }

    setForgotPasswordLoading(true);
    setForgotPasswordError('');

    try {
      await axios.post('https://ayanna-kiyanna-new-backend.onrender.com/api/students/verify-reset-otp', {
        email: forgotPasswordEmail,
        otp: otpCode
      });

      setShowOtpDialog(false);
      setShowNewPasswordDialog(true);
    } catch (error) {
      setForgotPasswordError(error.response?.data?.message || 'Invalid or expired OTP');
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const resetPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      setForgotPasswordError('Password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setForgotPasswordError('Passwords do not match');
      return;
    }

    setForgotPasswordLoading(true);
    setForgotPasswordError('');

    try {
      await axios.post('https://ayanna-kiyanna-new-backend.onrender.com/api/students/reset-password', {
        email: forgotPasswordEmail,
        otp: otpCode,
        newPassword: newPassword
      });

      // Reset all states
      setShowNewPasswordDialog(false);
      setShowPasswordDialog(true);
      setForgotPasswordEmail('');
      setOtpCode('');
      setNewPassword('');
      setConfirmPassword('');
      setForgotPasswordError('');

      alert('Password reset successfully! You can now login with your new password.');
    } catch (error) {
      setForgotPasswordError(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  // Grade Filter Functions
  const loadGrades = async () => {
    setLoadingGrades(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'https://ayanna-kiyanna-new-backend.onrender.com/api/students/grades',
        { headers: { 'x-auth-token': token } }
      );
      setAvailableGrades(response.data.grades || []);
    } catch (error) {
      console.error('Error loading grades:', error);
      setAvailableGrades([]);
    } finally {
      setLoadingGrades(false);
    }
  };

  const loadFilteredClasses = async (grade = '') => {
    try {
      const token = localStorage.getItem('token');
      const url = grade
        ? `https://ayanna-kiyanna-new-backend.onrender.com/api/students/available-classes?grade=${encodeURIComponent(grade)}`
        : 'https://ayanna-kiyanna-new-backend.onrender.com/api/students/available-classes';

      const response = await axios.get(url, {
        headers: { 'x-auth-token': token }
      });
      setAvailableClasses(response.data.classes || []);
    } catch (error) {
      console.error('Error loading filtered classes:', error);
      setAvailableClasses([]);
    }
  };

  const handleGradeFilterChange = (event) => {
    const grade = event.target.value;
    setSelectedGrade(grade);
    loadFilteredClasses(grade);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(student?.studentId || '');
    setTooltipText('Copied!');
    setTimeout(() => setTooltipText('Click to copy'), 2000); // Revert after 2 seconds
  };

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button onClick={() => navigate('/')}>
          Back to Home
        </Button>
      </Container>
    );
  }

  // Student Password Dialog
  if (showPasswordDialog) {
    return (
      <Box sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Floating Sinhala Letters Background */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          fontSize: '8rem',
          fontFamily: '"Noto Sans Sinhala", sans-serif',
          color: 'white',
          pointerEvents: 'none',
          overflow: 'hidden'
        }}>
          {['අ', 'ක', 'ග', 'ත', 'න', 'ප', 'ම', 'ය', 'ර', 'ල', 'ව', 'ස', 'හ'].map((letter, index) => (
            <Typography
              key={index}
              sx={{
                position: 'absolute',
                fontSize: 'inherit',
                fontFamily: 'inherit',
                animation: `float ${3 + index * 0.5}s ease-in-out infinite`,
                left: `${Math.random() * 90}%`,
                top: `${Math.random() * 90}%`,
                '@keyframes float': {
                  '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
                  '50%': { transform: 'translateY(-20px) rotate(5deg)' }
                }
              }}
            >
              {letter}
            </Typography>
          ))}
        </Box>

        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Dialog
            open={true}
            maxWidth="sm"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: 4,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                overflow: 'visible'
              }
            }}
          >
            <DialogTitle sx={{
              textAlign: 'center',
              pb: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: '16px 16px 0 0',
              position: 'relative'
            }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
              >
                <Avatar sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  mx: 'auto',
                  mb: 2,
                  width: 80,
                  height: 80,
                  border: '3px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                }}>
                  <Lock sx={{ fontSize: 40 }} />
                </Avatar>
              </motion.div>
              <Typography variant="h4" component="div" sx={{
                fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                fontWeight: 'bold',
                mb: 1,
                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                සිසු ප්‍රවේශ පුවරුව
              </Typography>
              <Typography variant="body1" sx={{
                mt: 1,
                fontFamily: '"Noto Sans Sinhala", sans-serif',
                opacity: 0.9
              }}>
                ඔබේ සිසු මුරපදය ඇතුළත් කර ප්‍රවේශ වන්න
              </Typography>
            </DialogTitle>

            <DialogContent sx={{ p: 4, pt: 3 }}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <TextField
                  fullWidth
                  label="සිසු මුරපදය"
                  type="password"
                  value={studentPassword}
                  onChange={(e) => setStudentPassword(e.target.value)}
                  error={!!passwordError}
                  helperText={passwordError}
                  sx={{
                    mt: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      backgroundColor: 'rgba(102, 126, 234, 0.05)',
                      '&:hover': {
                        backgroundColor: 'rgba(102, 126, 234, 0.08)',
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'rgba(102, 126, 234, 0.1)',
                      }
                    },
                    '& .MuiInputLabel-root': {
                      fontFamily: '"Noto Sans Sinhala", sans-serif'
                    }
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && handleStudentLogin()}
                />
              </motion.div>
            </DialogContent>

            <DialogActions sx={{ p: 4, pt: 2, flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: 2 }}>
                <Button
                  onClick={() => navigate('/')}
                  sx={{
                    borderRadius: 3,
                    px: 3,
                    py: 1.5,
                    fontFamily: '"Noto Sans Sinhala", sans-serif',
                    textTransform: 'none',
                    fontSize: '1rem'
                  }}
                >
                  අවලංගු කරන්න
                </Button>
                <Button
                  variant="contained"
                  onClick={handleStudentLogin}
                  disabled={authenticating}
                  startIcon={authenticating ? <CircularProgress size={20} /> : <Visibility />}
                  sx={{
                    borderRadius: 3,
                    px: 4,
                    py: 1.5,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    fontFamily: '"Noto Sans Sinhala", sans-serif',
                    textTransform: 'none',
                    fontSize: '1rem',
                    boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                      boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)',
                      transform: 'translateY(-2px)'
                    },
                    '&:disabled': {
                      background: 'rgba(102, 126, 234, 0.3)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  {authenticating ? 'සත්‍යාපනය කරමින්...' : 'ප්‍රවේශ වන්න'}
                </Button>
              </Box>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                style={{ width: '100%' }}
              >
                <Button
                  variant="text"
                  color="secondary"
                  onClick={handleForgotPassword}
                  sx={{
                    textTransform: 'none',
                    fontFamily: '"Noto Sans Sinhala", sans-serif',
                    fontSize: '0.95rem',
                    borderRadius: 3,
                    px: 3,
                    py: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(102, 126, 234, 0.08)'
                    }
                  }}
                >
                  මුරපදය අමතකද? නැවත සකසන්න
                </Button>
              </motion.div>
            </DialogActions>
          </Dialog>
        </motion.div>
      </Box>
    );
  }



  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      py: 4
    }}>
      <Container maxWidth="xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <Paper elevation={8} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item>
                <Avatar sx={{ bgcolor: 'primary.main', width: 80, height: 80 }}>
                  <School sx={{ fontSize: 40 }} />
                </Avatar>
              </Grid>
              <Grid item xs>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="h4" component="h1" gutterBottom sx={{
                    fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                    fontWeight: 'bold',
                    mb: 0
                  }}>
                    Student Dashboard
                  </Typography>
                    <IconButton
                      onClick={refreshPaymentStatuses}
                      color="primary"
                      title="Refresh Payment Status"
                      size="small"  // This makes the button smaller
                      sx={{
                        bgcolor: 'primary.light',
                        color: 'white',
                        '&:hover': { bgcolor: 'primary.main' },
                        p: 0.5,  // Reduced padding
                        '& svg': {
                          fontSize: '1rem'  // Smaller icon size
                        }
                      }}
                    >
                      <RefreshIcon fontSize="inherit" />
                    </IconButton>
                </Box>
                <Typography variant="h6" color="text.secondary">
                  Welcome back, {student?.firstName} {student?.lastName}
                </Typography>

                    <Tooltip 
                  title={tooltipText} 
                  arrow
                  placement="top"
                  componentsProps={{
                    tooltip: {
                      sx: {
                        bgcolor: tooltipText === 'Copied!' ? 'success.main' : undefined,
                      }
                    }
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      cursor: 'pointer',
                      '&:hover': { color: 'primary.main' }
                    }}
                    onClick={handleCopy}
                  >
                    Student ID: {student?.studentId}
                    <ContentCopyIcon 
                      fontSize="inherit" 
                      sx={{ 
                        opacity: 0.6, 
                        '&:hover': { opacity: 1 },
                        color: tooltipText === 'Copied!' ? 'success.main' : 'inherit'
                      }} 
                    />
                  </Typography>
                </Tooltip>

              </Grid>
              <Grid item>
                <Chip
                  label={student?.status}
                  color={student?.status === 'Approved' ? 'success' : student?.status === 'Pending' ? 'warning' : 'error'}
                  icon={student?.status === 'Approved' ? <CheckCircle /> : <Pending />}
                  sx={{ fontSize: '1rem', py: 2 }}
                />
              </Grid>
            </Grid>
          </Paper>

 {/* Main Content Grid - Side by Side Layout */}
<Grid container spacing={4} sx={{ 
  display: 'flex', 
  flexWrap: { xs: 'wrap', lg: 'nowrap' },
  flexDirection: { xs: 'column', lg: 'row' },
  width: '100%',
  margin: 0
}}>
  {/* Left Side - My Enrolled Classes (2/3 width) */}
  <Grid item xs={12} lg={8} sx={{ 
    flex: { lg: 2 }, 
    minWidth: 0,
    order: { xs: 1, lg: 0 },
    width: '100%',
    padding: { xs: 0, lg: 'inherit' },
    marginBottom: { xs: 3, lg: 0 }
  }}>
    <Paper elevation={8} sx={{
      p: 3,
      borderRadius: 4,
      mb: { xs: 0, lg: 4 },
      background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.95) 100%)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255,255,255,0.2)',
      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
      height: '100%',
      minHeight: '600px',
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      overflow: 'hidden'
    }}>
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%' }}
      >
        <Typography variant="h5" gutterBottom sx={{
          display: 'flex',
          alignItems: 'center',
          fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
          fontWeight: 'bold',
          color: 'primary.main',
          mb: 3
        }}>
          <ClassIcon sx={{ mr: 2, fontSize: 30 }} />
          මගේ ලියාපදිංචි පන්ති
        </Typography>
        <Divider sx={{ mb: 3, background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)', height: 2 }} />

        {student?.enrolledClasses?.length > 0 ? (
          <Grid container spacing={2} sx={{ flex: 1, width: '100%', margin: 0 }}>
            {student.enrolledClasses
              .filter(c => c.category !== 'Special Class')
              .map((classItem) => (
                <Grid item xs={12} key={classItem._id} sx={{ width: '100%' }}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Card sx={{
                      height: '100%',
                      borderRadius: 3,
                      background: student.status === 'Approved' ?
                        (paymentStatuses[classItem._id]?.isOverdue || paymentStatuses[classItem._id]?.isRejected ?
                          'linear-gradient(135deg,rgb(249, 216, 244) 0%, #ffcdd2 100%)' :
                          'linear-gradient(135deg,rgb(242, 232, 245) 0%,rgb(200, 230, 221) 100%)') :
                        'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
                      border: student.status === 'Approved' ?
                        (paymentStatuses[classItem._id]?.isOverdue || paymentStatuses[classItem._id]?.isRejected ?
                          '2px solid #f44336' : '2px solid #4caf50') :
                        '2px solid #ff9800',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                      '&:hover': {
                        boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                        transform: 'translateY(-2px)',
                        transition: 'all 0.3s ease'
                      },
                      width: '100%'
                    }}>
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Typography variant="h6" sx={{
                            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                            fontWeight: 'bold',
                            color: 'primary.main'
                          }}>
                            {classItem.grade}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Chip
                              label={classItem.category}
                              size="small"
                              sx={{
                                background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                                color: 'white',
                                fontWeight: 'bold'
                              }}
                            />
                            {paymentStatuses[classItem._id]?.isOverdue && (
                              <Chip
                                label="ගෙවීම ප්‍රමාද"
                                size="small"
                                color="error"
                                icon={<Warning />}
                                sx={{ fontFamily: '"Noto Sans Sinhala", sans-serif' }}
                              />
                            )}
                            {paymentStatuses[classItem._id]?.isRejected && (
                              <Chip
                                label="ගෙවීම ප්‍රතික්ෂේපයි"
                                size="small"
                                color="error"
                                icon={<Warning />}
                                sx={{ fontFamily: '"Noto Sans Sinhala", sans-serif' }}
                              />
                            )}
                          </Box>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Schedule sx={{ fontSize: 18, mr: 1, color: 'primary.main' }} />
                          <Typography color="text.secondary" sx={{ fontFamily: '"Noto Sans Sinhala", sans-serif' }}>
                            {classItem.date} • {classItem.startTime} - {classItem.endTime}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <LocationOn sx={{ fontSize: 18, mr: 1, color: 'primary.main' }} />
                          <Typography color="text.secondary" sx={{ fontFamily: '"Noto Sans Sinhala", sans-serif' }}>
                            {classItem.venue}
                          </Typography>
                        </Box>

                        <Typography color="text.secondary" gutterBottom sx={{ fontFamily: '"Noto Sans Sinhala", sans-serif' }}>
                          වේදිකාව: {classItem.platform}
                        </Typography>

                        {/* Payment Warning Notice */}
                        {(paymentStatuses[classItem._id]?.isOverdue || paymentStatuses[classItem._id]?.isRejected) && (
                          <Alert severity="warning" sx={{ mt: 2, mb: 2, borderRadius: 2 }}>
                            <Typography variant="body2" sx={{
                              fontWeight: 'bold',
                              mb: 1,
                              fontFamily: '"Noto Sans Sinhala", sans-serif'
                            }}>
                              {paymentStatuses[classItem._id]?.isOverdue ? 'ගෙවීම ප්‍රමාද වී ඇත!' : 'ගෙවීම ප්‍රතික්ෂේප කර ඇත!'}
                            </Typography>
                            <Typography variant="caption" sx={{ fontFamily: '"Noto Sans Sinhala", sans-serif' }}>
                              පන්තියට ප්‍රවේශ වීමට පෙර ගෙවීම සම්පූර්ණ කරන්න.
                            </Typography>
                          </Alert>
                        )}

                        <Box sx={{ display: 'flex', gap: 1, mt: 3 }}>
                          <Button
                            variant="contained"
                            fullWidth
                            disabled={
                              student.status !== 'Approved' ||
                              paymentStatuses[classItem._id]?.isOverdue ||
                              paymentStatuses[classItem._id]?.isRejected ||
                              accessingClass[classItem._id]
                            }
                            startIcon={
                              accessingClass[classItem._id] ? <CircularProgress size={16} color="inherit" /> :
                              student.status !== 'Approved' ? <Lock /> :
                              (paymentStatuses[classItem._id]?.isOverdue || paymentStatuses[classItem._id]?.isRejected) ? <Warning /> :
                              <Visibility />
                            }
                            sx={{
                              borderRadius: 3,
                              py: 1.5,
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              fontFamily: '"Noto Sans Sinhala", sans-serif',
                              fontWeight: 'bold',
                              '&:hover': {
                                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                                transform: 'translateY(-1px)',
                                boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)'
                              },
                              '&:disabled': {
                                background: 'rgba(0,0,0,0.12)'
                              }
                            }}
                            onClick={async () => {
                              if (student.status !== 'Approved') {
                                alert('ඔබේ සිසු ගිණුම තවම අනුමත කර නැත. කරුණාකර පරිපාලක අනුමැතිය සඳහා රැඳී සිටින්න.');
                                return;
                              }

                              // Validate payment status before allowing access
                              const canAccess = await validateClassAccess(classItem);
                              if (canAccess) {
                                navigate(`/class/${classItem._id}`);
                              }
                            }}
                          >
                            {accessingClass[classItem._id] ? 'පූරණය වෙමින්...' :
                             student.status !== 'Approved' ? 'අනුමැතිය බලාපොරොත්තුවෙන්' :
                             (paymentStatuses[classItem._id]?.isOverdue || paymentStatuses[classItem._id]?.isRejected) ? 'ගෙවීම අවශ්‍යයි' :
                             'පන්තියට ප්‍රවේශ වන්න'}
                          </Button>

                          {(paymentStatuses[classItem._id]?.isOverdue || paymentStatuses[classItem._id]?.isRejected) && (
                            <Button
                              variant="outlined"
                              color="error"
                              startIcon={<Payment />}
                              onClick={() => navigate(`/student-class-payments/${classItem._id}`)}
                              sx={{
                                minWidth: 'auto',
                                px: 2,
                                borderRadius: 3,
                                fontFamily: '"Noto Sans Sinhala", sans-serif',
                                fontWeight: 'bold'
                              }}
                            >
                              ගෙවන්න
                            </Button>
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
          </Grid>
        ) : (
          <Alert severity="info" sx={{
            borderRadius: 3,
            background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
            border: '1px solid #2196f3',
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%'
          }}>
            <Typography sx={{ fontFamily: '"Noto Sans Sinhala", sans-serif' }}>
              ඔබ තවම කිසිදු පන්තියකට ලියාපදිංචි වී නැත. ආරම්භ කිරීමට පහත ඇති පන්ති බලන්න.
            </Typography>
          </Alert>
        )}
      </motion.div>
    </Paper>
  </Grid>

  {/* Right Side - Student Notices (1/3 width) */}
  <Grid item xs={12} lg={4} sx={{ 
    flex: { lg: 1 }, 
    minWidth: 0,
    order: { xs: 2, lg: 0 },
    width: '100%',
    padding: { xs: 0, lg: 'inherit' }
  }}>
    <Paper elevation={8} sx={{
      p: 3,
      borderRadius: 4,
      mb: { xs: 0, lg: 4 },
      background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.95) 100%)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255,255,255,0.2)',
      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
      height: '100%',
      minHeight: '600px',
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      overflow: 'hidden'
    }}>
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%' }}
      >
        <Typography variant="h5" gutterBottom sx={{
          fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          color: 'primary.main',
          mb: 3
        }}>
          <AnnouncementIcon sx={{ mr: 2, fontSize: 30 }} />
          සිසුන් සඳහා විශේෂ නිවේදන
        </Typography>
        <Divider sx={{ mb: 3, background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)', height: 2 }} />

        {loadingNotices ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4, flex: 1, alignItems: 'center', width: '100%' }}>
            <CircularProgress sx={{ color: 'primary.main' }} />
          </Box>
        ) : studentNotices.length > 0 ? (
          <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', width: '100%' }}>
            <Box sx={{ flex: 1, overflowY: 'auto', pr: 1, width: '100%' }}>
              {studentNotices.slice(0, 5).map((notice, index) => {
                // Check if this is the latest notice (first in the sorted array)
                const isLatest = index === 0;
                const isNew = isLatest && new Date(notice.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // Within last 7 days

                return (
                  <motion.div
                    key={notice._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    style={{ width: '100%' }}
                  >
                    <Accordion sx={{
                      mb: 2,
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #f8f9ff 0%, #e8f0ff 100%)',
                      border: '1px solid rgba(102, 126, 234, 0.2)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                      '&:before': { display: 'none' },
                      '&:hover': {
                        boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                        transform: 'translateY(-2px)',
                        transition: 'all 0.3s ease'
                      },
                      width: '100%'
                    }}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon sx={{ color: 'primary.main' }} />}
                        sx={{
                          borderRadius: 3,
                          '&:hover': {
                            backgroundColor: 'rgba(102, 126, 234, 0.05)'
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 2 }}>
                          <Typography variant="subtitle1" sx={{
                            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                            fontWeight: 'bold',
                            flex: 1,
                            color: '#333'
                          }}>
                            {notice.title}
                          </Typography>
                          {isNew && (
                            <Chip
                              label="නව"
                              size="small"
                              sx={{
                                background: 'linear-gradient(45deg, #ff4444 30%, #cc0000 90%)',
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '0.7rem',
                                height: 24,
                                fontFamily: '"Noto Sans Sinhala", sans-serif',
                                animation: 'pulse 2s infinite',
                                '@keyframes pulse': {
                                  '0%': {
                                    transform: 'scale(1)',
                                    boxShadow: '0 0 0 0 rgba(255, 68, 68, 0.7)'
                                  },
                                  '70%': {
                                    transform: 'scale(1.05)',
                                    boxShadow: '0 0 0 10px rgba(255, 68, 68, 0)'
                                  },
                                  '100%': {
                                    transform: 'scale(1)',
                                    boxShadow: '0 0 0 0 rgba(255, 68, 68, 0)'
                                  }
                                }
                              }}
                            />
                          )}
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails sx={{ p: 3, pt: 1 }}>
                        <Typography variant="body2" sx={{
                          mb: 2,
                          fontFamily: '"Noto Sans Sinhala", sans-serif',
                          lineHeight: 1.6
                        }}>
                          {notice.content}
                        </Typography>

                        {notice.content2 && (
                          <Typography variant="body2" sx={{
                            mb: 2,
                            fontFamily: '"Noto Sans Sinhala", sans-serif',
                            lineHeight: 1.6
                          }}>
                            {notice.content2}
                          </Typography>
                        )}

                        {notice.attachments && notice.attachments.length > 0 && (
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" gutterBottom sx={{
                              fontFamily: '"Noto Sans Sinhala", sans-serif',
                              fontWeight: 'bold',
                              color: 'primary.main'
                            }}>
                              ගොනු:
                            </Typography>
                            {notice.attachments.map((attachment, index) => (
                              <Chip
                                key={index}
                                icon={<AttachFileIcon />}
                                label={attachment.originalName || 'ගොනුව'}
                                size="small"
                                sx={{
                                  mr: 1,
                                  mb: 1,
                                  backgroundColor: '#fff3e0',
                                  '&:hover': {
                                    backgroundColor: '#ffe0b2',
                                    transform: 'scale(1.05)'
                                  },
                                  fontFamily: '"Noto Sans Sinhala", sans-serif'
                                }}
                                onClick={() => window.open(attachment.url, '_blank')}
                              />
                            ))}
                          </Box>
                        )}

                        {notice.sourceLinks && notice.sourceLinks.length > 0 && (
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" gutterBottom sx={{
                              fontFamily: '"Noto Sans Sinhala", sans-serif',
                              fontWeight: 'bold',
                              color: 'primary.main'
                            }}>
                              මූලාශ්‍ර සබැඳි:
                            </Typography>
                            {notice.sourceLinks.map((link, index) => (
                              <Chip
                                key={index}
                                icon={<LinkIcon />}
                                label={`සබැඳිය ${index + 1}`}
                                size="small"
                                sx={{
                                  mr: 1,
                                  mb: 1,
                                  backgroundColor: '#f3e5f5',
                                  '&:hover': {
                                    backgroundColor: '#e1bee7',
                                    transform: 'scale(1.05)'
                                  },
                                  fontFamily: '"Noto Sans Sinhala", sans-serif'
                                }}
                                onClick={() => window.open(link, '_blank')}
                              />
                            ))}
                          </Box>
                        )}

                        <Typography variant="caption" color="text.secondary" sx={{
                          fontFamily: '"Noto Sans Sinhala", sans-serif'
                        }}>
                          නිර්මාණය: {new Date(notice.createdAt).toLocaleDateString('si-LK')}
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  </motion.div>
                );
              })}
            </Box>

            {studentNotices.length > 5 && (
              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Button
                  variant="outlined"
                  sx={{
                    borderRadius: 3,
                    px: 4,
                    py: 1.5,
                    borderColor: '#667eea',
                    color: '#667eea',
                    fontFamily: '"Noto Sans Sinhala", sans-serif',
                    fontWeight: 'bold',
                    '&:hover': {
                      borderColor: '#5a6fd8',
                      backgroundColor: 'rgba(102, 126, 234, 0.08)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.2)'
                    }
                  }}
                >
                  තවත් නිවේදන බලන්න
                </Button>
              </Box>
            )}
          </Box>
        ) : (
          <Alert severity="info" sx={{
            borderRadius: 3,
            background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
            border: '1px solid #2196f3',
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%'
          }}>
            <Typography variant="body2" color="text.secondary" sx={{
              textAlign: 'center',
              py: 2,
              fontFamily: '"Noto Sans Sinhala", sans-serif'
            }}>
              නිවේදන නොමැත
            </Typography>
          </Alert>
        )}
      </motion.div>
    </Paper>
  </Grid>
</Grid>

          {/* Second Section - Available Classes */}
          <Grid container spacing={4} sx={{ mt: 2 }}>
            <Grid item xs={12}>
              <Paper elevation={8} sx={{
                p: 4,
                borderRadius: 4,
                mb: 4,
                background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
                border: '2px solid #4caf50',
                boxShadow: '0 20px 40px rgba(76, 175, 80, 0.2)'
              }}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Typography variant="h5" gutterBottom sx={{
                    display: 'flex',
                    alignItems: 'center',
                    fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                    fontWeight: 'bold',
                    color: '#2e7d32',
                    mb: 3
                  }}>
                    <Add sx={{ mr: 2, fontSize: 32, color: '#4caf50' }} />
                    ලබා ගත හැකි අනෙකුත් පන්ති
                  </Typography>
                  <Divider sx={{ mb: 3, background: 'linear-gradient(90deg, #4caf50 0%, #2e7d32 100%)', height: 2 }} />

                  {/* Grade Filter */}
                  <Box sx={{ mb: 3 }}>
                    <FormControl sx={{ minWidth: 200 }}>
                      <InputLabel sx={{ fontFamily: '"Noto Sans Sinhala", sans-serif' }}>ශ්‍රේණිය අනුව පෙරහන</InputLabel>
                      <Select
                        value={selectedGrade}
                        label="ශ්‍රේණිය අනුව පෙරහන"
                        onChange={handleGradeFilterChange}
                        disabled={loadingGrades}
                        sx={{
                          borderRadius: 3,
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#4caf50'
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#2e7d32'
                          }
                        }}
                      >
                        <MenuItem value="" sx={{ fontFamily: '"Noto Sans Sinhala", sans-serif' }}>
                          <em>සියලුම ශ්‍රේණි</em>
                        </MenuItem>
                        {availableGrades.map((grade) => (
                          <MenuItem key={grade} value={grade} sx={{ fontFamily: '"Noto Sans Sinhala", sans-serif' }}>
                            {grade}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>

                  {availableClasses.length > 0 ? (
                    <Grid container spacing={3}>
                      {availableClasses.map((classItem) => (
                        <Grid item xs={12} md={6} lg={4} key={classItem._id}>
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            whileHover={{ scale: 1.03, y: -3 }}
                          >
                            <Card sx={{
                              borderRadius: 4,
                              width: '300px',
                              background: 'linear-gradient(135deg, #f1f8e9 0%, #dcedc8 100%)',
                              border: '1px solid #4caf50',
                              boxShadow: '0 8px 25px rgba(76, 175, 80, 0.2)',
                              '&:hover': {
                                boxShadow: '0 15px 35px rgba(76, 175, 80, 0.3)',
                                transform: 'translateY(-5px)',
                                transition: 'all 0.3s ease'
                              }
                            }}>
                              <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                  <Typography variant="h6" sx={{
                                    fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                                    fontWeight: 'bold',
                                    color: '#2e7d32'
                                  }}>
                                    {classItem.grade}
                                  </Typography>
                                  <Chip
                                    label={classItem.category}
                                    size="small"
                                    sx={{
                                      background: 'linear-gradient(45deg, #4caf50 30%, #2e7d32 90%)',
                                      color: 'white',
                                      fontWeight: 'bold',
                                      fontFamily: '"Noto Sans Sinhala", sans-serif'
                                    }}
                                  />
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                  <Schedule sx={{ fontSize: 18, mr: 1, color: '#4caf50' }} />
                                  <Typography color="text.secondary" sx={{ fontFamily: '"Noto Sans Sinhala", sans-serif' }}>
                                    {classItem.date} • {classItem.startTime} - {classItem.endTime}
                                  </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                  <LocationOn sx={{ fontSize: 18, mr: 1, color: '#4caf50' }} />
                                  <Typography color="text.secondary" sx={{ fontFamily: '"Noto Sans Sinhala", sans-serif' }}>
                                    {classItem.venue}
                                  </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                  <Group sx={{ fontSize: 18, mr: 1, color: '#4caf50' }} />
                                  <Typography color="text.secondary" sx={{ fontFamily: '"Noto Sans Sinhala", sans-serif' }}>
                                    ලබා ගත හැකි ස්ථාන {classItem.availableSpots}
                                  </Typography>
                                </Box>

                                <Button
                                  variant="contained"
                                  fullWidth
                                  sx={{
                                    mt: 2,
                                    borderRadius: 3,
                                    py: 1.5,
                                    background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
                                    fontFamily: '"Noto Sans Sinhala", sans-serif',
                                    fontWeight: 'bold',
                                    '&:hover': {
                                      background: 'linear-gradient(135deg, #43a047 0%, #1b5e20 100%)',
                                      transform: 'translateY(-2px)',
                                      boxShadow: '0 8px 25px rgba(76, 175, 80, 0.4)'
                                    },
                                    '&:disabled': {
                                      background: 'rgba(0,0,0,0.12)'
                                    }
                                  }}
                                  onClick={() => handleClassEnrollment(classItem)}
                                  disabled={student?.status !== 'Approved'}
                                  startIcon={student?.status !== 'Approved' ? <Lock /> : <Add />}
                                >
                                  {student?.status !== 'Approved' ? 'අනුමැතිය බලාපොරොත්තුවෙන්' : 'ලියාපදිංචි වීමට ඉල්ලීම'}
                                </Button>
                              </CardContent>
                            </Card>
                          </motion.div>
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Alert severity="info" sx={{
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
                      border: '1px solid #4caf50'
                    }}>
                      <Typography sx={{ fontFamily: '"Noto Sans Sinhala", sans-serif' }}>
                        මේ මොහොතේ ලියාපදිංචි වීම සඳහා අමතර පන්ති නොමැත.
                      </Typography>
                    </Alert>
                  )}
                </motion.div>
              </Paper>
            </Grid>
          </Grid>

          {/* Third Section - Side by Side Layout */}
          <Grid container spacing={4} sx={{ mt: 2 }}>
            {/* Left Side - Enrolled Special Classes Section (1/3 width) */}
            <Grid item xs={12} lg={4} sx={{ width: '100%' }}>
              <Paper elevation={8} sx={{
                p: 4,
                borderRadius: 4,
                mb: 4,
                background: 'linear-gradient(135deg, #fff8e1 0%, #ffecb3 100%)',
                border: '2px solid #ff9800',
                boxShadow: '0 20px 40px rgba(255, 152, 0, 0.2)',
                height: '100%',
                minHeight: { xs: 'auto', lg: '200px' }
              }}>
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Typography variant="h5" gutterBottom sx={{
                    display: 'flex',
                    alignItems: 'center',
                    fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                    fontWeight: 'bold',
                    color: '#e65100',
                    mb: 3
                  }}>
                    <School sx={{ mr: 2, fontSize: 30, color: '#ff9800' }} />
                    ලියාපදිංචි විශේෂ පන්ති
                  </Typography>
                  <Divider sx={{ mb: 3, background: 'linear-gradient(90deg, #ff9800 0%, #e65100 100%)', height: 2 }} />

                  {student?.enrolledClasses?.filter(c => c.category === 'Special Class').length > 0 ? (
                    <Grid container spacing={2}>
                      {student.enrolledClasses
                        .filter(c => c.category === 'Special Class')
                        .map((classItem) => (
                          <Grid item xs={12} key={classItem._id}>
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5 }}
                              whileHover={{ scale: 1.02 }}
                            >
                              <Card sx={{
                                borderRadius: 3,
                                background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
                                border: '2px solid',
                                borderColor: paymentStatuses[classItem._id]?.isOverdue || paymentStatuses[classItem._id]?.isRejected ?
                                  'error.main' : 'warning.main',
                                boxShadow: '0 8px 25px rgba(255, 152, 0, 0.2)',
                                '&:hover': {
                                  boxShadow: '0 12px 30px rgba(255, 152, 0, 0.3)',
                                  transform: 'translateY(-2px)',
                                  transition: 'all 0.3s ease'
                                }
                              }}>
                                <CardContent sx={{ p: 3 }}>
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="h6" sx={{
                                      color: '#e65100',
                                      fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                                      fontWeight: 'bold'
                                    }}>
                                      {classItem.grade}
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                      <Chip
                                        label="විශේෂ පන්තිය"
                                        size="small"
                                        sx={{
                                          background: 'linear-gradient(45deg, #ff9800 30%, #e65100 90%)',
                                          color: 'white',
                                          fontWeight: 'bold',
                                          fontFamily: '"Noto Sans Sinhala", sans-serif'
                                        }}
                                      />
                                      {paymentStatuses[classItem._id]?.isOverdue && (
                                        <Chip
                                          label="ගෙවීම ප්‍රමාද"
                                          size="small"
                                          color="error"
                                          icon={<Warning />}
                                          sx={{ fontFamily: '"Noto Sans Sinhala", sans-serif' }}
                                        />
                                      )}
                                      {paymentStatuses[classItem._id]?.isRejected && (
                                        <Chip
                                          label="ගෙවීම ප්‍රතික්ෂේපයි"
                                          size="small"
                                          color="error"
                                          icon={<Warning />}
                                          sx={{ fontFamily: '"Noto Sans Sinhala", sans-serif' }}
                                        />
                                      )}
                                    </Box>
                                  </Box>

                                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <Schedule sx={{ fontSize: 18, mr: 1, color: '#ff9800' }} />
                                    <Typography color="text.secondary" sx={{ fontFamily: '"Noto Sans Sinhala", sans-serif' }}>
                                      {classItem.date} • {classItem.startTime} - {classItem.endTime}
                                    </Typography>
                                  </Box>

                                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <LocationOn sx={{ fontSize: 18, mr: 1, color: '#ff9800' }} />
                                    <Typography color="text.secondary" sx={{ fontFamily: '"Noto Sans Sinhala", sans-serif' }}>
                                      {classItem.venue}
                                    </Typography>
                                  </Box>

                                  <Typography color="text.secondary" gutterBottom sx={{ fontFamily: '"Noto Sans Sinhala", sans-serif' }}>
                                    වේදිකාව: {classItem.platform}
                                  </Typography>

                                  {/* Payment Warning Notice */}
                                  {(paymentStatuses[classItem._id]?.isOverdue || paymentStatuses[classItem._id]?.isRejected) && (
                                    <Alert severity="warning" sx={{ mt: 2, mb: 2, borderRadius: 2 }}>
                                      <Typography variant="body2" sx={{
                                        fontWeight: 'bold',
                                        mb: 1,
                                        fontFamily: '"Noto Sans Sinhala", sans-serif'
                                      }}>
                                        {paymentStatuses[classItem._id]?.isOverdue ? 'ගෙවීම ප්‍රමාද වී ඇත!' : 'ගෙවීම ප්‍රතික්ෂේප කර ඇත!'}
                                      </Typography>
                                      <Typography variant="caption" sx={{ fontFamily: '"Noto Sans Sinhala", sans-serif' }}>
                                        පන්තියට ප්‍රවේශ වීමට පෙර ගෙවීම සම්පූර්ණ කරන්න.
                                      </Typography>
                                    </Alert>
                                  )}

                                  <Box sx={{ display: 'flex', gap: 1, mt: 3 }}>
                                    <Button
                                      variant="contained"
                                      fullWidth
                                      sx={{
                                        borderRadius: 3,
                                        py: 1.5,
                                        background: 'linear-gradient(135deg, #ff9800 0%, #e65100 100%)',
                                        fontFamily: '"Noto Sans Sinhala", sans-serif',
                                        fontWeight: 'bold',
                                        '&:hover': {
                                          background: 'linear-gradient(135deg, #f57c00 0%, #d84315 100%)',
                                          transform: 'translateY(-2px)',
                                          boxShadow: '0 8px 25px rgba(255, 152, 0, 0.4)'
                                        },
                                        '&:disabled': {
                                          background: 'rgba(0,0,0,0.12)'
                                        }
                                      }}
                                      disabled={
                                        student.status !== 'Approved' ||
                                        paymentStatuses[classItem._id]?.isOverdue ||
                                        paymentStatuses[classItem._id]?.isRejected ||
                                        accessingClass[classItem._id]
                                      }
                                      startIcon={
                                        accessingClass[classItem._id] ? <CircularProgress size={16} color="inherit" /> :
                                        student.status !== 'Approved' ? <Lock /> :
                                        (paymentStatuses[classItem._id]?.isOverdue || paymentStatuses[classItem._id]?.isRejected) ? <Warning /> :
                                        <Visibility />
                                      }
                                      onClick={async () => {
                                        if (student.status !== 'Approved') {
                                          alert('ඔබේ සිසු ගිණුම තවම අනුමත කර නැත. කරුණාකර පරිපාලක අනුමැතිය සඳහා රැඳී සිටින්න.');
                                          return;
                                        }

                                        // Validate payment status before allowing access
                                        const canAccess = await validateClassAccess(classItem);
                                        if (canAccess) {
                                          navigate(`/class/${classItem._id}`);
                                        }
                                      }}
                                    >
                                      {accessingClass[classItem._id] ? 'පූරණය වෙමින්...' :
                                      student.status !== 'Approved' ? 'අනුමැතිය බලාපොරොත්තුවෙන්' :
                                      (paymentStatuses[classItem._id]?.isOverdue || paymentStatuses[classItem._id]?.isRejected) ? 'ගෙවීම අවශ්‍යයි' :
                                      'විශේෂ පන්තියට ප්‍රවේශ වන්න'}
                                    </Button>

                                    {(paymentStatuses[classItem._id]?.isOverdue || paymentStatuses[classItem._id]?.isRejected) && (
                                      <Button
                                        variant="outlined"
                                        color="error"
                                        startIcon={<Payment />}
                                        onClick={() => navigate(`/student-class-payments/${classItem._id}`)}
                                        sx={{
                                          minWidth: 'auto',
                                          px: 2,
                                          borderRadius: 3,
                                          fontFamily: '"Noto Sans Sinhala", sans-serif',
                                          fontWeight: 'bold'
                                        }}
                                      >
                                        ගෙවන්න
                                      </Button>
                                    )}
                                  </Box>
                                </CardContent>
                              </Card>
                            </motion.div>
                          </Grid>
                        ))}
                    </Grid>
                  ) : (
                    <Alert severity="info" sx={{
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
                      border: '1px solid #ff9800'
                    }}>
                      <Typography sx={{ fontFamily: '"Noto Sans Sinhala", sans-serif' }}>
                        ඔබ තවම කිසිදු විශේෂ පන්තියකට ලියාපදිංචි වී නැත. මෙම පන්ති විශේෂ ඉගෙනුම් අවශ්‍යතා සඳහා නිර්මාණය කර ඇති අතර ගුරුතුමා විසින් අවශ්‍ය වූ විටදී ඇතුලත් කරණු ලබයි.
                      </Typography>
                    </Alert>
                  )}
                </motion.div>
              </Paper>
            </Grid>

            {/* Right Side - My Class Requests Section (2/3 width) */}
            <Grid item xs={12} lg={8} sx={{ width: '100%' }}>
              <Paper elevation={8} sx={{
                p: 4,
                borderRadius: 4,
                mb: 4,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.95) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                height: '100%',
                minHeight: { xs: 'auto', lg: '500px' }
              }}>
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Typography variant="h5" gutterBottom sx={{
                    display: 'flex',
                    alignItems: 'center',
                    fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                    fontWeight: 'bold',
                    color: 'primary.main',
                    mb: 3
                  }}>
                    <Badge badgeContent={classRequests.filter(r => r.status === 'Pending').length} color="warning">
                      <Pending sx={{ mr: 2, fontSize: 30 }} />
                    </Badge>
                    මගේ පන්ති ඉල්ලීම්
                  </Typography>
                  <Divider sx={{ mb: 3, background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)', height: 2 }} />

                  {classRequests.length > 0 ? (
                    <>
                      <List dense>
                        {classRequests.slice(0, showAllRequests ? classRequests.length : 5).map((request, index) => (
                          <motion.div
                            key={request._id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                          >
                            <ListItem
                              divider
                              sx={{
                                borderRadius: 2,
                                mb: 1,
                                background: request.status === 'Approved' ?
                                  'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)' :
                                  request.status === 'Rejected' ?
                                  'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)' :
                                  'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
                                border: '1px solid',
                                borderColor: request.status === 'Approved' ? '#4caf50' :
                                  request.status === 'Rejected' ? '#f44336' : '#ff9800',
                                '&:hover': {
                                  transform: 'translateX(5px)',
                                  transition: 'all 0.3s ease'
                                }
                              }}
                              secondaryAction={
                                request.status === 'Pending' && (
                                  <IconButton
                                    edge="end"
                                    aria-label="delete"
                                    onClick={() => deleteClassRequest(request._id)}
                                    size="small"
                                    sx={{
                                      color: 'error.main',
                                      '&:hover': {
                                        backgroundColor: 'rgba(244, 67, 54, 0.1)',
                                        transform: 'scale(1.1)'
                                      }
                                    }}
                                  >
                                    <Delete />
                                  </IconButton>
                                )
                              }
                            >
                              <ListItemIcon>
                                {request.status === 'Pending' && <Pending color="warning" />}
                                {request.status === 'Approved' && <CheckCircle color="success" />}
                                {request.status === 'Rejected' && <Notifications color="error" />}
                              </ListItemIcon>
                              <ListItemText
                                primary={
                                  <Typography sx={{
                                    fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                                    fontWeight: 'bold',
                                    color: 'primary.main'
                                  }}>
                                    {request.class?.grade} - {request.class?.category}
                                  </Typography>
                                }
                                secondary={
                                  <Box>
                                    <Typography variant="caption" display="block" sx={{
                                      fontFamily: '"Noto Sans Sinhala", sans-serif',
                                      fontWeight: 'bold',
                                      color: request.status === 'Approved' ? 'success.main' :
                                        request.status === 'Rejected' ? 'error.main' : 'warning.main'
                                    }}>
                                      තත්ත්වය: {request.status === 'Pending' ? 'බලාපොරොත්තුවෙන්' :
                                        request.status === 'Approved' ? 'අනුමත' : 'ප්‍රතික්ෂේප'}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" sx={{
                                      fontFamily: '"Noto Sans Sinhala", sans-serif'
                                    }}>
                                      {request.reason.substring(0, 50)}...
                                    </Typography>
                                  </Box>
                                }
                              />
                            </ListItem>
                          </motion.div>
                        ))}
                      </List>

                      {classRequests.length > 5 && (
                        <Box sx={{ textAlign: 'center', mt: 2 }}>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => {
                              // Add state to show more requests
                              setShowAllRequests(!showAllRequests);
                            }}
                            sx={{
                              borderRadius: 3,
                              px: 3,
                              borderColor: '#667eea',
                              color: '#667eea',
                              fontFamily: '"Noto Sans Sinhala", sans-serif',
                              '&:hover': {
                                borderColor: '#5a6fd8',
                                backgroundColor: 'rgba(102, 126, 234, 0.08)'
                              }
                            }}
                          >
                            {showAllRequests ? 'අඩුවෙන් පෙන්වන්න' : 'තවත් ඉල්ලීම් බලන්න'}
                          </Button>
                        </Box>
                      )}
                    </>
                  ) : (
                    <Alert severity="info" sx={{
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                      border: '1px solid #2196f3'
                    }}>
                      <Typography variant="body2" color="text.secondary" sx={{
                        fontFamily: '"Noto Sans Sinhala", sans-serif'
                      }}>
                        තවම පන්ති ඉල්ලීම් නොමැත
                      </Typography>
                    </Alert>
                  )}
                </motion.div>
              </Paper>
            </Grid>

            {/* Quick Actions Section */}
            <Grid item xs={12}>
              <Paper elevation={8} sx={{
                p: 4,
                borderRadius: 4,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.95) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
              }}>
                <Typography variant="h6" gutterBottom sx={{
                  fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                  fontWeight: 'bold',
                  color: 'primary.main',
                  mb: 3,
                  textAlign: 'center'
                }}>
                  ක්ෂණික ක්‍රියාමාර්ග
                </Typography>
                <Divider sx={{ mb: 3, background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)', height: 2 }} />

                <Grid container spacing={2}>
                  {/* Profile Action */}
                  <Grid item xs={12}>
                    <motion.div
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Paper
                        elevation={4}
                        sx={{
                          p: 3,
                          borderRadius: 3,
                          background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                          border: '1px solid #2196f3',
                          cursor: 'pointer',
                          '&:hover': {
                            boxShadow: '0 8px 25px rgba(33, 150, 243, 0.3)',
                            transform: 'translateY(-3px)',
                            transition: 'all 0.3s ease'
                          }
                        }}
                        onClick={() => navigate('/student-profile')}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, width: '400px' }}>
                          <Person sx={{ fontSize: 24, mr: 2, color: '#1976d2' }} />
                          <Typography variant="h6" sx={{
                            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                            fontWeight: 'bold',
                            color: '#1976d2'
                          }}>
                            ඔබගේ Profile එක බලන්න
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{
                          fontFamily: '"Noto Sans Sinhala", sans-serif',
                          ml: 4
                        }}>
                          ඔබේ පුද්ගලික තොරතුරු සහ ගිණුම් විස්තර බලන්න
                        </Typography>
                      </Paper>
                    </motion.div>
                  </Grid>

                  {/* Payment Requests Action */}
                  <Grid item xs={12}>
                    <motion.div
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Paper
                        elevation={4}
                        sx={{
                          p: 3,
                          borderRadius: 3,
                          background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
                          border: '1px solid #ff9800',
                          cursor: 'pointer',
                          '&:hover': {
                            boxShadow: '0 8px 25px rgba(255, 152, 0, 0.3)',
                            transform: 'translateY(-3px)',
                            transition: 'all 0.3s ease'
                          }
                        }}
                        onClick={() => navigate('/my-payment-requests')}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, width: '400px' }}>
                          <Payment sx={{ fontSize: 24, mr: 2, color: '#f57c00' }} />
                          <Typography variant="h6" sx={{
                            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                            fontWeight: 'bold',
                            color: '#f57c00'
                          }}>
                            මගේ පන්ති ගෙවීම්
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{
                          fontFamily: '"Noto Sans Sinhala", sans-serif',
                          ml: 4
                        }}>
                          පන්ති ගෙවීම් ඉල්ලීම් සහ ගෙවීම් ඉතිහාසය බලන්න
                        </Typography>
                      </Paper>
                    </motion.div>
                  </Grid>

                  {/* Send Message Action */}
                  <Grid item xs={12}>
                    <motion.div
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Paper
                        elevation={4}
                        sx={{
                          p: 3,
                          borderRadius: 3,
                          background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
                          border: '1px solid #9c27b0',
                          cursor: 'pointer',
                          '&:hover': {
                            boxShadow: '0 8px 25px rgba(156, 39, 176, 0.3)',
                            transform: 'translateY(-3px)',
                            transition: 'all 0.3s ease'
                          }
                        }}
                        onClick={handleOpenMessageDialog}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, width: '400px' }}>
                          <MessageIcon sx={{ fontSize: 24, mr: 2, color: '#7b1fa2' }} />
                          <Typography variant="h6" sx={{
                            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                            fontWeight: 'bold',
                            color: '#7b1fa2'
                          }}>
                            ගුරුවරයාට පණිවිඩයක්
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{
                          fontFamily: '"Noto Sans Sinhala", sans-serif',
                          ml: 4
                        }}>
                          ගුරුවරයාට පණිවිඩයක් හෝ ගැටලුවක් යවන්න
                        </Typography>
                      </Paper>
                    </motion.div>
                  </Grid>

                  {/* View Messages Action */}
                  <Grid item xs={12}>
                    <motion.div
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Paper
                        elevation={4}
                        sx={{
                          p: 3,
                          borderRadius: 3,
                          background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
                          border: '1px solid #4caf50',
                          cursor: 'pointer',
                          '&:hover': {
                            boxShadow: '0 8px 25px rgba(76, 175, 80, 0.3)',
                            transform: 'translateY(-3px)',
                            transition: 'all 0.3s ease'
                          }
                        }}
                        onClick={() => setShowMyMessagesDialog(true)}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, width: '400px' }}>
                          <Visibility sx={{ fontSize: 24, mr: 2, color: '#388e3c' }} />
                          <Typography variant="h6" sx={{
                            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                            fontWeight: 'bold',
                            color: '#388e3c'
                          }}>
                            මගේ පණිවිඩ බලන්න
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{
                          fontFamily: '"Noto Sans Sinhala", sans-serif',
                          ml: 4
                        }}>
                          යවන ලද පණිවිඩ සහ ලැබුණු පිළිතුරු බලන්න
                        </Typography>
                      </Paper>
                    </motion.div>
                  </Grid>

                  {/* Back to Home Action */}
                  <Grid item xs={12}>
                    <motion.div
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Paper
                        elevation={4}
                        sx={{
                          p: 3,
                          borderRadius: 3,
                          background: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd9 100%)',
                          border: '1px solid #e91e63',
                          cursor: 'pointer',
                          '&:hover': {
                            boxShadow: '0 8px 25px rgba(233, 30, 99, 0.3)',
                            transform: 'translateY(-3px)',
                            transition: 'all 0.3s ease'
                          }
                        }}
                        onClick={() => navigate('/')}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, width: '400px' }}>
                          <DashboardIcon sx={{ fontSize: 24, mr: 2, color: '#c2185b' }} />
                          <Typography variant="h6" sx={{
                            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                            fontWeight: 'bold',
                            color: '#c2185b'
                          }}>
                            මුල් පිටුවට
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{
                          fontFamily: '"Noto Sans Sinhala", sans-serif',
                          ml: 4
                        }}>
                          ප්‍රධාන වෙබ් අඩවියට ආපසු යන්න
                        </Typography>
                      </Paper>
                    </motion.div>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </motion.div>

        {/* Bottom Notice Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <Paper elevation={6} sx={{
            p: 3,
            mt: 4,
            borderRadius: 4,
            background: 'linear-gradient(135deg, #f8f9ff 0%, #e8f0ff 100%)',
            border: '1px solid rgba(102, 126, 234, 0.2)',
            textAlign: 'center'
          }}>
            <Typography variant="body2" sx={{
              fontFamily: '"Noto Sans Sinhala", sans-serif',
              color: 'text.secondary',
              lineHeight: 1.6
            }}>
              <strong>සටහන:</strong> ඔබට ඔබගේ ශිෂ්‍ය ගිණුමේ මුරපදය වෙනස් කිරීමට අවශ්‍යනම් ශිෂ්‍ය ගිණුමට ඇතුල්වීමේ දී මුරපදය ඉල්ලන අවස්ථාවේ පෙන්වන 'Forgot or Reset Password' Option එක භාවිතා කරන්න.
              තාක්ෂණික සහාය සඳහා Contact පිටුව ඔස්සේ අපව සම්බන්ධ කරන්න.
            </Typography>
          </Paper>
        </motion.div>
      </Container>

      {/* Class Request Dialog */}
      <Dialog open={showRequestDialog} onClose={() => setShowRequestDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Request to Enroll in Class
        </DialogTitle>
        <DialogContent>
          {selectedClass && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                {selectedClass.grade} - {selectedClass.category}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {selectedClass.date} • {selectedClass.startTime} - {selectedClass.endTime}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Venue: {selectedClass.venue}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Available Spots: {selectedClass.availableSpots}
              </Typography>
            </Box>
          )}
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Reason for Enrollment Request"
            placeholder="Please explain why you want to enroll in this class..."
            value={requestReason}
            onChange={(e) => setRequestReason(e.target.value)}
            helperText={`${requestReason.length}/500 characters (minimum 10 required)`}
            inputProps={{ maxLength: 500 }}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowRequestDialog(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={submitClassRequest}
            disabled={submittingRequest || requestReason.trim().length < 10}
            startIcon={submittingRequest ? <CircularProgress size={20} /> : null}
          >
            {submittingRequest ? 'Submitting...' : 'Submit Request'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Forgot Password Dialog */}
      <Dialog open={showForgotPasswordDialog} onClose={() => setShowForgotPasswordDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: 'center' }}>
          <Avatar sx={{ bgcolor: 'warning.main', mx: 'auto', mb: 2 }}>
            <Lock />
          </Avatar>
          <Typography variant="h5" component="div">
            Reset Student Password
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            We couldn't find your email in the system. Please enter your email address to receive a password reset code.
          </Typography>
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={forgotPasswordEmail}
            onChange={(e) => setForgotPasswordEmail(e.target.value)}
            error={!!forgotPasswordError}
            helperText={forgotPasswordError}
            sx={{ mt: 2 }}
            onKeyPress={(e) => e.key === 'Enter' && sendPasswordResetOTP()}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => {
            setShowForgotPasswordDialog(false);
            setShowPasswordDialog(true);
          }}>
            Back to Login
          </Button>
          <Button
            variant="contained"
            onClick={sendPasswordResetOTP}
            disabled={forgotPasswordLoading}
            startIcon={forgotPasswordLoading ? <CircularProgress size={20} /> : null}
          >
            {forgotPasswordLoading ? 'Sending...' : 'Send Reset Code'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* OTP Verification Dialog */}
      <Dialog open={showOtpDialog} onClose={() => setShowOtpDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: 'center' }}>
          <Avatar sx={{ bgcolor: 'info.main', mx: 'auto', mb: 2 }}>
            <Lock />
          </Avatar>
          <Typography variant="h5" component="div">
            Enter Verification Code
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            We sent a 6-digit code to {forgotPasswordEmail || 'your email'}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="6-Digit Code"
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value)}
            error={!!forgotPasswordError}
            helperText={forgotPasswordError}
            sx={{ mt: 2 }}
            inputProps={{ maxLength: 6 }}
            onKeyPress={(e) => e.key === 'Enter' && verifyOTPAndProceed()}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => {
            setShowOtpDialog(false);
            setShowForgotPasswordDialog(true);
          }}>
            Back
          </Button>
          <Button
            variant="contained"
            onClick={verifyOTPAndProceed}
            disabled={forgotPasswordLoading}
            startIcon={forgotPasswordLoading ? <CircularProgress size={20} /> : null}
          >
            {forgotPasswordLoading ? 'Verifying...' : 'Verify Code'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* New Password Dialog */}
      <Dialog open={showNewPasswordDialog} onClose={() => setShowNewPasswordDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: 'center' }}>
          <Avatar sx={{ bgcolor: 'success.main', mx: 'auto', mb: 2 }}>
            <Lock />
          </Avatar>
          <Typography variant="h5" component="div">
            Set New Password
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Enter your new student dashboard password
          </Typography>
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            sx={{ mt: 2, mb: 2 }}
            helperText="Password must be at least 6 characters long"
          />
          <TextField
            fullWidth
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={!!forgotPasswordError}
            helperText={forgotPasswordError}
            onKeyPress={(e) => e.key === 'Enter' && resetPassword()}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => {
            setShowNewPasswordDialog(false);
            setShowOtpDialog(true);
          }}>
            Back
          </Button>
          <Button
            variant="contained"
            onClick={resetPassword}
            disabled={forgotPasswordLoading}
            startIcon={forgotPasswordLoading ? <CircularProgress size={20} /> : null}
          >
            {forgotPasswordLoading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Loading Dialog for Auto OTP Send */}
      <Dialog open={forgotPasswordLoading && !showForgotPasswordDialog && !showOtpDialog} maxWidth="sm" fullWidth>
        <DialogContent sx={{ textAlign: 'center', py: 4 }}>
          <CircularProgress size={60} sx={{ mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Sending Reset Code
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please wait while we send a password reset code to your email...
          </Typography>
        </DialogContent>
      </Dialog>

      {/* Message Dialog */}
      <Dialog
        open={showMessageDialog}
        onClose={handleCloseMessageDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{
          background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
          color: 'white',
          fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
        }}>
          {selectedEditMessage ? 'පණිවිඩය සංස්කරණය කරන්න' : 'ගුරුවරයාට පණිවිඩයක් යවන්න'}
        </DialogTitle>

        <DialogContent sx={{ p: 3, mt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth sx={{ mb: 2, minWidth: 200 }}>
                <InputLabel>කුමක් ගැනද</InputLabel>
                <Select
                  value={messageData.about}
                  onChange={(e) => handleMessageInputChange('about', e.target.value)}
                  label="විෂය"
                >
                  <MenuItem value="පන්ති සම්බන්ධ">පන්ති සම්බන්ධ</MenuItem>
                  <MenuItem value="ගෙවීම් සම්බන්ධ">ගෙවීම් සම්බන්ධ</MenuItem>
                  <MenuItem value="පාඩම් සම්බන්ධ">පාඩම් සම්බන්ධ</MenuItem>
                  <MenuItem value="තාක්ෂණික ගැටළු">තාක්ෂණික ගැටළු</MenuItem>
                  <MenuItem value="වෙනත්">වෙනත්</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="ඔබේ පණිවිඩය"
                value={messageData.message}
                onChange={(e) => handleMessageInputChange('message', e.target.value)}
                multiline
                rows={4}
                required
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                ගොනු (විකල්ප - උපරිම 5)
              </Typography>
              <input
                type="file"
                multiple
                accept="image/*,.pdf"
                onChange={(e) => handleFileUpload(e.target.files)}
                style={{ marginBottom: 16 }}
              />

              {messageData.attachments.map((attachment, index) => (
                <Chip
                  key={index}
                  label={attachment.originalName || 'ගොනුව'}
                  onDelete={() => removeAttachment(index)}
                  sx={{ mr: 1, mb: 1 }}
                />
              ))}
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                මූලාශ්‍ර සබැඳි (විකල්ප)
              </Typography>
              {(messageData.sourceLinks || ['']).map((link, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TextField
                    fullWidth
                    label={`සබැඳිය ${index + 1}`}
                    value={link}
                    onChange={(e) => handleSourceLinkChange(index, e.target.value)}
                    placeholder="https://example.com"
                    sx={{ mr: 1 }}
                  />
                  {(messageData.sourceLinks || ['']).length > 1 && (
                    <IconButton onClick={() => removeSourceLink(index)}>
                      <CloseIcon />
                    </IconButton>
                  )}
                </Box>
              ))}
              <Button onClick={addSourceLink} startIcon={<AddIcon />} sx={{ mb: 2 }}>
                සබැඳියක් එක් කරන්න
              </Button>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseMessageDialog}>
            අවලංගු කරන්න
          </Button>
          <Button
            onClick={submitMessage}
            variant="contained"
            disabled={submittingMessage}
            startIcon={submittingMessage ? <CircularProgress size={20} /> : <SendIcon />}
            sx={{
              background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)'
              }
            }}
          >
            {submittingMessage ? (selectedEditMessage ? 'යාවත්කාලීන කරමින්...' : 'යවමින්...') : (selectedEditMessage ? 'යාවත්කාලීන කරන්න' : 'පණිවිඩය යවන්න')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* My Messages Dialog */}
      <Dialog
        open={showMyMessagesDialog}
        onClose={() => setShowMyMessagesDialog(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, maxHeight: '90vh' }
        }}
      >
        <DialogTitle sx={{
          background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
          color: 'white',
          fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
        }}>
          මගේ පණිවිඩ
          <IconButton
            onClick={() => setShowMyMessagesDialog(false)}
            sx={{ position: 'absolute', right: 8, top: 8, color: 'white' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          <Button
            variant="contained"
            onClick={loadMyMessages}
            sx={{
              mt: 1,
              mb: 3,
              background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)'
              }
            }}
          >
            පණිවිඩ නැවුම් කරන්න (Referesh)
          </Button>
          <Typography 
            gutterBottom 
            sx={{ 
              mb: 1,
              p: 2,
              backgroundColor: '#f5f5f5',
              borderLeft: '4px solid #3f51b5',
              borderRadius: '0 4px 4px 0',
              fontStyle: 'italic',
              color: '#555',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
              fontSize: '0.9rem'
            }}
          >
            <strong>Note:</strong> ඔබේ පණිවිඩ වෙන්වන්නේ නැතිනම් එක් වරක් ඉහත බොත්තම ඔබා පණිවිඩ නැවුම් කරන්න (Refresh).
          </Typography>

          {loadingMyMessages ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : myMessages.length > 0 ? (
            <Grid container spacing={3}>
              {myMessages.map((message) => (
                <Grid item xs={12} md={6} key={message._id} sx={{
                display: 'grid',
                alignItems: 'stretch', // This ensures all cards stretch to the same height
                }}>
                  <Card sx={{
                    borderRadius: 3,
                    width: '350px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                    border: message.reply ? '2px solid #4caf50' : '2px solid #ff9800'
                  }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" sx={{
                          fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                          color: 'primary.main'
                        }}>
                          {message.about}
                        </Typography>
                        <Chip
                          label={message.reply ? 'පිළිතුරු ලැබී ඇත' : 'පිළිතුරු බලාපොරොත්තුවෙන්'}
                          color={message.reply ? 'success' : 'warning'}
                          size="small"
                        />
                      </Box>

                      <Typography variant="body2" sx={{ mb: 2 }}>
                        {message.message}
                      </Typography>

                      {/* Source Links */}
                      {message.sourceLinks && message.sourceLinks.length > 0 && (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="caption" sx={{ display: 'block', mb: 1, fontWeight: 'bold', color: 'primary.main' }}>
                            මූලාශ්‍ර සබැඳි ({message.sourceLinks.length}):
                          </Typography>
                          {message.sourceLinks.map((link, index) => (
                            <Chip
                              key={index}
                              icon={<LinkIcon />}
                              label={`සබැඳිය ${index + 1}`}
                              size="small"
                              sx={{
                                mr: 1,
                                mb: 1,
                                backgroundColor: '#fff3e0',
                                '&:hover': {
                                  backgroundColor: '#ffe0b2'
                                }
                              }}
                              onClick={() => window.open(link, '_blank')}
                              clickable
                            />
                          ))}
                        </Box>
                      )}

                      {message.attachments && message.attachments.length > 0 && (
                        <Box sx={{ mb: 2 }}>
                          {message.attachments.map((attachment, index) => (
                            <Chip
                              key={index}
                              icon={<AttachFileIcon />}
                              label={attachment.originalName || 'ගොනුව'}
                              size="small"
                              sx={{ mr: 1, mb: 1 }}
                              onClick={() => window.open(attachment.url, '_blank')}
                            />
                          ))}
                        </Box>
                      )}

                      {message.reply && (
                        <Box sx={{
                          bgcolor: 'grey.100',
                          p: 2,
                          borderRadius: 2,
                          mt: 2
                        }}>
                          <Typography variant="subtitle2" gutterBottom sx={{
                            color: 'primary.main',
                            fontWeight: 'bold'
                          }}>
                            ගුරුවරයාගේ පිළිතුර:
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            {message.reply}
                          </Typography>

                          {message.replyAttachments && message.replyAttachments.length > 0 && (
                            <Box sx={{ mt: 2 }}>
                              <Typography variant="caption" sx={{ display: 'block', mb: 1, fontWeight: 'bold', color: 'primary.main' }}>
                                පිළිතුරු ගොනු ({message.replyAttachments.length}):
                              </Typography>
                              {message.replyAttachments.map((attachment, index) => (
                                <Chip
                                  key={index}
                                  icon={<AttachFileIcon />}
                                  label={attachment.originalName || `ගොනුව ${index + 1}`}
                                  size="small"
                                  sx={{
                                    mr: 1,
                                    mb: 1,
                                    backgroundColor: '#e3f2fd',
                                    '&:hover': {
                                      backgroundColor: '#bbdefb'
                                    }
                                  }}
                                  onClick={() => window.open(attachment.url, '_blank')}
                                  clickable
                                />
                              ))}
                            </Box>
                          )}

                          {/* Reply Source Links */}
                          {message.replySourceLinks && message.replySourceLinks.length > 0 && (
                            <Box sx={{ mt: 2 }}>
                              <Typography variant="caption" sx={{ display: 'block', mb: 1, fontWeight: 'bold', color: 'primary.main' }}>
                                පිළිතුරු මූලාශ්‍ර සබැඳි ({message.replySourceLinks.length}):
                              </Typography>
                              {message.replySourceLinks.map((link, index) => (
                                <Chip
                                  key={index}
                                  icon={<LinkIcon />}
                                  label={`සබැඳිය ${index + 1}`}
                                  size="small"
                                  sx={{
                                    mr: 1,
                                    mb: 1,
                                    backgroundColor: '#f3e5f5',
                                    '&:hover': {
                                      backgroundColor: '#e1bee7'
                                    }
                                  }}
                                  onClick={() => window.open(link, '_blank')}
                                  clickable
                                />
                              ))}
                            </Box>
                          )}

                          <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                            පිළිතුරු දුන් දිනය: {new Date(message.repliedAt).toLocaleDateString('si-LK')}
                          </Typography>
                        </Box>
                      )}

                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
                        යවන ලද දිනය: {new Date(message.createdAt).toLocaleDateString('si-LK')}
                      </Typography>
                    </CardContent>

                    {!message.reply && (
                      <CardActions>
                        <Button
                          size="small"
                          startIcon={<Edit />}
                          onClick={() => handleEditMessage(message)}
                          sx={{ color: 'primary.main' }}
                        >
                          සංස්කරණය
                        </Button>
                        <Button
                          size="small"
                          startIcon={<Delete />}
                          onClick={() => handleDeleteMessage(message._id)}
                          sx={{ color: 'error.main' }}
                        >
                          මකන්න
                        </Button>
                      </CardActions>
                    )}
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Paper elevation={2} sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
              <Typography variant="h6" color="text.secondary">
                පණිවිඩ නොමැත
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                ඔබ තවම කිසිදු පණිවිඩයක් යවා නැත
              </Typography>
            </Paper>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default StudentDashboard;
