import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  useTheme,
  useMediaQuery,
  Container,
  Divider,
  Badge,
  CircularProgress,
} from '@mui/material';
import {
  Dashboard,
  People,
  School,
  Assignment,
  Settings,
  ExitToApp,
  Notifications,
  TrendingUp,
  PersonAdd,
  Edit,
  Delete,
  Visibility,
  BarChart,
  PieChart,
  Timeline,
  Payment,
  NotificationsActive,
  ContactSupport,
  ShoppingBag,
  ShoppingCart,
  LocalShipping
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [userInfo, setUserInfo] = useState({});
  const [pendingCount, setPendingCount] = useState(0);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const [unansweredQuestionsCount, setUnansweredQuestionsCount] = useState(0);
  const [unrepliedFeedbacksCount, setUnrepliedFeedbacksCount] = useState(0);
  const [unrepliedStudentMessagesCount, setUnrepliedStudentMessagesCount] = useState(0);
  const [pendingEnrollmentRequestsCount, setPendingEnrollmentRequestsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  useEffect(() => {
    // Get user info from localStorage
    const email = localStorage.getItem('userEmail');
    const fullName = localStorage.getItem('fullName');
    setUserInfo({ email, fullName });

    // Load pending student count, pending orders count, unanswered questions count, and unreplied feedbacks count
    loadPendingCount();
    loadPendingOrdersCount();
    loadUnansweredQuestionsCount();
    loadUnrepliedFeedbacksCount();
    loadUnrepliedStudentMessagesCount();
    loadPendingEnrollmentRequestsCount();
  }, []);

  const loadPendingCount = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://ayanna-kiyanna-new-backend.onrender.com/api/admin/students/stats', {
        headers: { 'x-auth-token': token }
      });
      const data = await response.json();
      setPendingCount(data.pending || 0);
    } catch (error) {
      console.error('Error loading pending count:', error);
      setPendingCount(0);
    } finally {
      setLoading(false);
    }
  };

  const loadPendingOrdersCount = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Loading pending orders count...');
      const response = await fetch('https://ayanna-kiyanna-new-backend.onrender.com/api/orders?status=pending&limit=1', {
        headers: { 'x-auth-token': token }
      });
      const data = await response.json();
      console.log('Pending orders response:', data);
      const count = data.pagination?.totalOrders || 0;
      console.log('Setting pending orders count to:', count);
      setPendingOrdersCount(count);
    } catch (error) {
      console.error('Error loading pending orders count:', error);
      setPendingOrdersCount(0);
    }
  };

  const loadUnansweredQuestionsCount = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://ayanna-kiyanna-new-backend.onrender.com/api/special-notices/unanswered-count', {
        headers: { 'x-auth-token': token }
      });
      const data = await response.json();
      if (data.success) {
        setUnansweredQuestionsCount(data.data.count || 0);
      }
    } catch (error) {
      console.error('Error loading unanswered questions count:', error);
      setUnansweredQuestionsCount(0);
    }
  };

  const loadUnrepliedFeedbacksCount = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://ayanna-kiyanna-new-backend.onrender.com/api/feedback/admin/unreplied-count', {
        headers: { 'x-auth-token': token }
      });
      const data = await response.json();
      if (data.success) {
        setUnrepliedFeedbacksCount(data.data.count || 0);
      }
    } catch (error) {
      console.error('Error loading unreplied feedbacks count:', error);
      setUnrepliedFeedbacksCount(0);
    }
  };

  const loadUnrepliedStudentMessagesCount = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://ayanna-kiyanna-new-backend.onrender.com/api/student-messages/unreplied-count', {
        headers: { 'x-auth-token': token }
      });
      const data = await response.json();
      if (data.success) {
        setUnrepliedStudentMessagesCount(data.count || 0);
      }
    } catch (error) {
      console.error('Error loading unreplied student messages count:', error);
      setUnrepliedStudentMessagesCount(0);
    }
  };

  const loadPendingEnrollmentRequestsCount = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://ayanna-kiyanna-new-backend.onrender.com/api/class-requests/pending-count', {
        headers: { 'x-auth-token': token }
      });
      const data = await response.json();
      if (data.success) {
        setPendingEnrollmentRequestsCount(data.count || 0);
      }
    } catch (error) {
      console.error('Error loading pending enrollment requests count:', error);
      setPendingEnrollmentRequestsCount(0);
    }
  };

const quickActions = [
    {
      title: 'පරිශීලක කළමනාකරණය',
      icon: <People />,
      color: '#795548',
      gradient: 'linear-gradient(135deg, #795548 0%, #5d4037 100%)',
      path: '/admin-user-management',
      description: [
        'පරිශීලකයින් පරීක්ශා කිරීම ට.',
        'පරිශීලකයින් තහවුරු කර ගැනීම ට.',
        'මුළු පරිශීලකයින් ගනණ ඔවුන්ගේ තත්වය සමග හදුනා ගැනීම ට.',
        'පරිශීලකයින් වෙන වෙනම සම්බන්ධ වූ දින සමග බැලීම ට.',
        'අනවශ්‍ය පරිශීලකයින් ඉවත් කිරීම ට.',
        'ආදී සියළුම පරිශීලක කළමනාකරණය අදාල බලතල.'
      ]
    },
    {
      title: 'සිසු කළමනාකරණය',
      icon: <School />,
      color: '#667eea',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      path: '/student-management',
      description: [
        'සිසුන්ගේ ලැයිස්තුව පරීක්ශා කිරීමට හා වෙන වෙනම සිසුන්ගේ ප්‍රගතිය බැලීම ට.',
        'සිසුන්ට වෙනවෙනම පණිවිඩ යැවීමට, ඔවුන්ගේ පන්ති තහවුරු කිරීමට, පන්ති මාරු කිරීමට, ඉවත් කිරීමට.',
        'සිසුන්ගේ ගිණුම් පරීක්ශා කිරීමට, ඔවුන්ට නොමිලේ පන්ති අවස්ථා ලබා දීමට.',
        'සිසුන්ගේ හැසිරීම් සහ විනය පිසිබද සටහන් තබා ගැනීමට, ඔව්න්ගේ ගිනුම් අවහිර කිරීමට.',
        'ආදී සියළුම ශිෂ්‍ය කලමණාකරණයට අදාල බලතල.'
      ]
    },
    {
      title: 'පන්ති කළමනාකරණය',
      icon: <Assignment />,
      color: '#f093fb',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      path: '/class-management',
      description: [
        'නව පන්ති නිර්මාණය කිරීම සහ පවතින පන්ති සංස්කරණය කිරීම.',
        'පන්ති කාලසටහන්, ස්ථාන සහ ධාරිතාව කළමනාකරණය කිරීම.',
        'පන්ති වර්ග, ශ්‍රේණි සහ විෂය අනුව සංවිධානය කිරීම.',
        'ඔන්ලයින් සහ භෞතික පන්ති සඳහා වෙනම සැකසුම්.',
        'පන්ති සම්පත් සහ අධ්‍යයන ද්‍රව්‍ය කළමනාකරණය කිරීම.',
        'ආදී සියළුම පන්ති කළමනාකරණයට අදාල බලතල.'
      ]
    },
    {
      title: 'පන්ති ඉල්ලීම් කළමනාකරණය',
      icon: <NotificationsActive />,
      color: '#ff5722',
      gradient: 'linear-gradient(135deg, #ff5722 0%, #e64a19 100%)',
      path: '/class-requests',
      description: [
        'සිසුන්ගේ පන්ති ඇතුළත් වීමේ ඉල්ලීම් පරීක්ශා කිරීම.',
        'ඉල්ලීම් අනුමත කිරීම හෝ ප්‍රතික්ෂේප කිරීම.',
        'සිසුන්ට ඉල්ලීම් තත්වය පිළිබඳ දැනුම් දීම.',
        'පන්ති ධාරිතාව අනුව ඉල්ලීම් කළමනාකරණය කිරීම.',
        'ප්‍රමාද වූ ඉල්ලීම් සහ ප්‍රමුඛතා ලබා දීම.',
        'ආදී සියළුම පන්ති ඉල්ලීම් කළමනාකරණයට අදාල බලතල.'
      ]
    },
    {
      title: 'පැමිණීම් විශ්ලේෂණ',
      icon: <BarChart />,
      color: '#4caf50',
      gradient: 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)',
      path: '/attendance-analytics',
      description: [
        'සිසුන්ගේ පන්ති පැමිණීම් වාර්තා සහ විශ්ලේෂණ.',
        'දිනපතා, සතිපතා සහ මාසික පැමිණීම් සංඛ්‍යාලේඛන.',
        'අඩු පැමිණීම් ඇති සිසුන් හඳුනා ගැනීම.',
        'පන්ති අනුව පැමිණීම් ප්‍රතිශත සංසන්දනය.',
        'පැමිණීම් ප්‍රවණතා සහ අනාවැකි විශ්ලේෂණ.',
        'ආදී සියළුම පැමිණීම් විශ්ලේෂණයට අදාල බලතල.'
      ]
    },
    {
      title: 'සියලුම පන්ති ගෙවීම් සහ ආදායම් විශ්ලේෂණ',
      icon: <Payment />,
      color: '#ff9a9e',
      gradient: 'linear-gradient(135deg, #ff9a9e 0%,rgb(235, 134, 161) 100%)',
      path: '/all-class-payment-requests',
      description: [
        'සිසුන්ගේ පන්ති ගෙවීම් ඉල්ලීම් කළමනාකරණය.',
        'ගෙවීම් තත්වය සහ ඉතිරි මුදල් පරීක්ශා කිරීම.',
        'මාසික සහ වාර්ෂික ආදායම් වාර්තා.',
        'ගෙවීම් ප්‍රමාද වූ සිසුන් හඳුනා ගැනීම.',
        'ගෙවීම් ක්‍රම සහ ගනුදෙනු ඉතිහාසය.',
        'ආදී සියළුම ගෙවීම් කළමනාකරණයට අදාල බලතල.'
      ]
    },
    {
      title: 'සිසුන් සඳහා විශේෂ නිවේදන කළමනාකරණය',
      icon: <NotificationsActive />,
      color: '#2196F3',
      gradient: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
      path: '/admin-student-notice-management',
      description: [
        'සිසුන් සඳහා විශේෂ නිවේදන නිර්මාණය සහ ප්‍රකාශනය.',
        'නිවේදන වර්ගීකරණය සහ ප්‍රමුඛතා ලබා දීම.',
        'ශ්‍රේණි අනුව හෝ විෂය අනුව නිවේදන යැවීම.',
        'නිවේදන කියවීමේ තත්වය සහ ප්‍රතිචාර පරීක්ශා කිරීම.',
        'ස්වයංක්‍රීය නිවේදන සහ කාලසටහන් සැකසීම.',
        'ආදී සියළුම සිසු නිවේදන කළමනාකරණයට අදාල බලතල.'
      ]
    },
    {
      title: 'සිසුන්ගේ පණිවිඩ සහ ප්‍රශ්න කළමනාකරණය',
      icon: <ContactSupport />,
      color: '#9C27B0',
      gradient: 'linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)',
      path: '/admin-student-message-management',
      description: [
        'සිසුන්ගේ පණිවිඩ සහ ප්‍රශ්න පරීක්ශා කිරීම.',
        'ප්‍රශ්නවලට ඉක්මන් සහ සවිස්තරාත්මක පිළිතුරු ලබා දීම.',
        'පණිවිඩ වර්ගීකරණය සහ ප්‍රමුඛතා ලබා දීම.',
        'සිසුන්ගේ ගැටළු සහ යෝජනා කළමනාකරණය.',
        'පණිවිඩ ඉතිහාසය සහ ප්‍රතිචාර වාර්තා.',
        'ආදී සියළුම සිසු සන්නිවේදන කළමනාකරණයට අදාල බලතල.'
      ]
    },
    {
      title: 'නිෂ්පාදන කළමනාකරණය',
      icon: <ShoppingBag />,
      color: '#FF6B6B',
      gradient: 'linear-gradient(135deg, #FF6B6B 0%, #EE5A52 100%)',
      path: '/admin-product-management',
      description: [
        'පොත් සහ අධ්‍යයන ද්‍රව්‍ය නිෂ්පාදන කළමනාකරණය.',
        'නිෂ්පාදන තොග, මිල සහ ලබා ගත හැකි ප්‍රමාණය.',
        'නව නිෂ්පාදන එකතු කිරීම සහ පවතින ඒවා සංස්කරණය.',
        'නිෂ්පාදන වර්ගීකරණය සහ සෙවුම් ප්‍රශස්තකරණය.',
        'විකුණුම් වාර්තා සහ ජනප්‍රිය නිෂ්පාදන විශ්ලේෂණ.',
        'ආදී සියළුම නිෂ්පාදන කළමනාකරණයට අදාල බලතල.'
      ]
    },
    {
      title: 'ඇණවුම් කළමනාකරණය',
      icon: <ShoppingCart />,
      color: '#4ECDC4',
      gradient: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)',
      path: '/admin-order-management',
      description: [
        'පරිශීලක ඇණවුම් පරීක්ශා සහ කළමනාකරණය.',
        'ඇණවුම් තත්වය යාවත්කාලීන කිරීම සහ ගෙන්වා දීම.',
        'ගෙවීම් තහවුරු කිරීම සහ ඇණවුම් අනුමත කිරීම.',
        'ඇණවුම් ඉතිහාසය සහ ගනුදෙනු වාර්තා.',
        'ප්‍රමාද වූ ඇණවුම් සහ ගැටළු විසඳීම.',
        'ආදී සියළුම ඇණවුම් කළමනාකරණයට අදාල බලතල.'
      ]
    },
    {
      title: 'ගෙන්වා දීමේ ගාස්තු කළමනාකරණය',
      icon: <LocalShipping />,
      color: '#9C27B0',
      gradient: 'linear-gradient(135deg,rgb(105, 69, 203) 0%, #7B1FA2 100%)',
      path: '/admin-delivery-charge-management',
      description: [
        'ප්‍රදේශ අනුව ගෙන්වා දීමේ ගාස්තු සැකසීම.',
        'විශේෂ ගෙන්වා දීමේ සේවා සහ මිල ගණන්.',
        'ගෙන්වා දීමේ කාලසීමා සහ ප්‍රදේශ ආවරණය.',
        'නොමිලේ ගෙන්වා දීමේ කොන්දේසි සැකසීම.',
        'ගෙන්වා දීමේ සේවා සපයන්නන් කළමනාකරණය.',
        'ආදී සියළුම ගෙන්වා දීමේ කළමනාකරණයට අදාල බලතල.'
      ]
    },
    {
      title: 'සියළුම පරිශීලකයින් සදහා විශේෂ නිවේදන කළමනාකරණය',
      icon: <NotificationsActive />,
      color: '#E91E63',
      gradient: 'linear-gradient(135deg, #E91E63 0%, #C2185B 100%)',
      path: '/admin-special-notice-management',
      description: [
        'සියළුම පරිශීලකයින් සඳහා සාමාන්‍ය නිවේදන.',
        'හදිසි නිවේදන සහ වැදගත් දැනුම්දීම්.',
        'පද්ධති නඩත්තු සහ සේවා බාධා නිවේදන.',
        'නිවේදන කියවීමේ සංඛ්‍යාලේඛන සහ ප්‍රතිචාර.',
        'නිවේදන සැකසුම් සහ ප්‍රදර්ශන කාලසීමා.',
        'ආදී සියළුම සාමාන්‍ය නිවේදන කළමනාකරණයට අදාල බලතල.'
      ]
    },
    {
      title: 'පරිශීලක ගැටළු සහ ප්‍රත්පෝශණ කළමනාකරණය',
      icon: <ContactSupport />,
      color: '#FF9800',
      gradient: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
      path: '/admin-feedback-management',
      description: [
        'පරිශීලක ගැටළු සහ ප්‍රතිපෝෂණ පරීක්ශා කිරීම.',
        'ගැටළුවලට ඉක්මන් සහ ඵලදායී විසඳුම් ලබා දීම.',
        'ප්‍රතිපෝෂණ වර්ගීකරණය සහ ප්‍රමුඛතා ලබා දීම.',
        'පරිශීලක සතුට සහ සේවා ගුණත්වය මැනීම.',
        'ප්‍රතිපෝෂණ ප්‍රවණතා සහ වැඩිදියුණු කිරීම් හඳුනා ගැනීම.',
        'ආදී සියළුම ප්‍රතිපෝෂණ කළමනාකරණයට අදාල බලතල.'
      ]
    }
  ];

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
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{
                width: 60,
                height: 60,
                bgcolor: 'error.main',
                fontSize: '1.5rem'
              }}>
                <Dashboard />
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight="bold" sx={{
                  fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                }}>
                  පරිපාලක උපකරණ පුවරුව
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {userInfo.fullName || 'පරිපාලක'} - {userInfo.email}
                </Typography>
                <Chip
                  label="පරිපාලක"
                  color="error"
                  size="small"
                  sx={{ mt: 0.5 }}
                />
              </Box>
            </Box>          
          </Box>
        </Paper>

        <Grid container spacing={3}>

          <Grid item xs={12}>
            <Paper elevation={3} sx={{ 
              p: 3, 
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)'
            }}>
              <Typography variant="h5" fontWeight="bold" sx={{
                mb: 2,
                fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                color: theme.palette.primary.dark,
                textAlign: 'center',
                fontSize: '1.8rem',
                textShadow: '1px 1px 3px rgba(0,0,0,0.1)'
              }}>
                ඉක්මන් ක්‍රියාමාර්ග
              </Typography>

              <Typography variant="body1" sx={{
                textAlign: 'center',
                color: 'text.secondary',
                mb: 3,
                fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
                maxWidth: '900px',
                margin: '0 auto 24px auto',
                fontSize: '1rem',
                lineHeight: 1.6
              }}>
                පරිපාලන කාර්යයන් ඉක්මනින් සහ කාර්යක්ෂමව සිදු කිරීම සඳහා අවශ්‍ය සියලුම මෙවලම්.
                එක් ක්ලික් කිරීමකින් ඔබට අවශ්‍ය ඕනෑම කළමනාකරණ පිටුවකට ප්‍රවේශ වන්න.
              </Typography>

              {/* Pending Actions Summary */}
              {(pendingCount > 0 || pendingOrdersCount > 0 || unansweredQuestionsCount > 0 ||
                unrepliedFeedbacksCount > 0 || unrepliedStudentMessagesCount > 0 ||
                pendingEnrollmentRequestsCount > 0) && (
                <Paper elevation={2} sx={{
                  p: 3,
                  mb: 4,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
                  border: '2px solid #ffb74d',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(45deg, rgba(255, 183, 77, 0.1) 25%, transparent 25%, transparent 75%, rgba(255, 183, 77, 0.1) 75%)',
                    backgroundSize: '20px 20px',
                    pointerEvents: 'none'
                  }
                }}>
                  <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Typography variant="h6" fontWeight="bold" sx={{
                      mb: 2,
                      textAlign: 'center',
                      color: '#e65100',
                      fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1
                    }}>
                      ⚠️ අවධානය අවශ්‍ය ක්‍රියාමාර්ග
                    </Typography>

                    <Box sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 2,
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                      {pendingCount > 0 && (
                        <Chip
                          label={`සිසු කළමනාකරණය ${pendingCount}`}
                          sx={{
                            bgcolor: '#ff5722',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '0.9rem',
                            fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
                            '&:hover': { bgcolor: '#d84315' },
                            cursor: 'pointer',
                            animation: 'pulse 2s infinite'
                          }}
                          onClick={() => navigate('/student-management')}
                        />
                      )}
                      {pendingEnrollmentRequestsCount > 0 && (
                        <Chip
                          label={`පන්ති ඉල්ලීම් කළමනාකරණය ${pendingEnrollmentRequestsCount}`}
                          sx={{
                            bgcolor: '#ff5722',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '0.9rem',
                            fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
                            '&:hover': { bgcolor: '#d84315' },
                            cursor: 'pointer',
                            animation: 'pulse 2s infinite'
                          }}
                          onClick={() => navigate('/class-requests')}
                        />
                      )}
                      {pendingOrdersCount > 0 && (
                        <Chip
                          label={`ඇණවුම් කළමනාකරණය ${pendingOrdersCount}`}
                          sx={{
                            bgcolor: '#ff5722',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '0.9rem',
                            fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
                            '&:hover': { bgcolor: '#d84315' },
                            cursor: 'pointer',
                            animation: 'pulse 2s infinite'
                          }}
                          onClick={() => navigate('/admin-order-management')}
                        />
                      )}
                      {unansweredQuestionsCount > 0 && (
                        <Chip
                          label={`විශේෂ නිවේදන ${unansweredQuestionsCount}`}
                          sx={{
                            bgcolor: '#ff5722',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '0.9rem',
                            fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
                            '&:hover': { bgcolor: '#d84315' },
                            cursor: 'pointer',
                            animation: 'pulse 2s infinite'
                          }}
                          onClick={() => navigate('/admin-special-notice-management')}
                        />
                      )}
                      {unrepliedFeedbacksCount > 0 && (
                        <Chip
                          label={`ප්‍රතිපෝෂණ කළමනාකරණය ${unrepliedFeedbacksCount}`}
                          sx={{
                            bgcolor: '#ff5722',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '0.9rem',
                            fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
                            '&:hover': { bgcolor: '#d84315' },
                            cursor: 'pointer',
                            animation: 'pulse 2s infinite'
                          }}
                          onClick={() => navigate('/admin-feedback-management')}
                        />
                      )}
                      {unrepliedStudentMessagesCount > 0 && (
                        <Chip
                          label={`සිසු පණිවිඩ ${unrepliedStudentMessagesCount}`}
                          sx={{
                            bgcolor: '#ff5722',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '0.9rem',
                            fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
                            '&:hover': { bgcolor: '#d84315' },
                            cursor: 'pointer',
                            animation: 'pulse 2s infinite'
                          }}
                          onClick={() => navigate('/admin-student-message-management')}
                        />
                      )}
                    </Box>

                    <Typography variant="body2" sx={{
                      textAlign: 'center',
                      color: '#bf360c',
                      mt: 2,
                      fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
                      fontStyle: 'italic'
                    }}>
                      👆 ක්ලික් කර ඉක්මනින් ක්‍රියාමාර්ග ගන්න
                    </Typography>
                  </Box>
                </Paper>
              )}
              
              <Grid container spacing={3} sx={{
                justifyContent: 'center',
                alignItems: 'stretch'
              }}>
                {quickActions.map((action, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index} sx={{
                    display: 'flex',
                    minHeight: '400px' // Ensure consistent height
                  }}>
                    <motion.div 
                      whileHover={{ scale: 1.03, boxShadow: theme.shadows[6] }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card sx={{
                        width: '400px',
                        height: '400px', // Fixed height for all cards

                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: '12px',
                        boxShadow: theme.shadows[3],
                        background: action.gradient || action.color,
                        color: 'white',
                        position: 'relative',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: theme.shadows[8]
                        },
                        '&:before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: '4px',
                          background: 'rgba(255,255,255,0.3)'
                        }
                      }}
                      onClick={() => navigate(action.path)}>
                        <CardContent sx={{
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          position: 'relative',
                          zIndex: 1,
                          p: 3
                        }}>
                          <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            mb: 2
                          }}>
                            <Avatar sx={{
                              bgcolor: 'rgba(255,255,255,0.2)',
                              width: 50,
                              height: 50,
                              mr: 2,
                              backdropFilter: 'blur(5px)',
                              border: '1px solid rgba(255,255,255,0.3)'
                            }}>
                              {React.cloneElement(action.icon, { sx: { fontSize: '1.5rem' } })}
                            </Avatar>
                            <Typography variant="h6" sx={{
                              fontWeight: 'bold',
                              fontFamily: '"Noto Sans Sinhala", sans-serif',
                              fontSize: '1.1rem',
                              flexGrow: 1
                            }}>
                              {action.title}
                            </Typography>
                          </Box>
                          
                          <Box sx={{
                            background: 'rgba(0,0,0,0.1)',
                            p: 2,
                            borderRadius: '8px',
                            mb: 2,
                            flex: 1, // Take remaining space
                            height: '180px', // Fixed height for consistency
                            overflowY: 'auto',
                            '&::-webkit-scrollbar': {
                              width: '6px'
                            },
                            '&::-webkit-scrollbar-thumb': {
                              backgroundColor: 'rgba(255,255,255,0.3)',
                              borderRadius: '3px'
                            }
                          }}>
                            <ul style={{ 
                              margin: 0, 
                              paddingLeft: '20px',
                              listStyleType: 'none'
                            }}>
                              {action.description.map((item, i) => (
                                <li key={i} style={{ 
                                  marginBottom: '8px',
                                  position: 'relative',
                                  paddingLeft: '20px',
                                  fontSize: '0.85rem',
                                  lineHeight: '1.4'
                                }}>
                                  <span style={{
                                    position: 'absolute',
                                    left: 0,
                                    top: '6px',
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    background: 'white'
                                  }}></span>
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </Box>
                          
                          <Button
                            variant="contained"
                            fullWidth
                            sx={{
                              bgcolor: 'rgba(255,255,255,0.2)',
                              color: 'white',
                              fontWeight: 'bold',
                              borderRadius: '8px',
                              py: 1.5,
                              backdropFilter: 'blur(10px)',
                              border: '1px solid rgba(255,255,255,0.3)',
                              fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
                              textTransform: 'none',
                              fontSize: '1rem',
                              boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                              '&:hover': {
                                bgcolor: 'rgba(255,255,255,0.3)',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 6px 20px rgba(0,0,0,0.15)'
                              },
                              transition: 'all 0.3s ease',
                              mt: 'auto' // Push to bottom
                            }}
                          >
                            🚀 දැන් ප්‍රවේශ වන්න
                          </Button>
                          
                          {/* Badge for pending items */}
                          {(action.title === 'සිසු කළමනාකරණය' && pendingCount > 0) ||
                          (action.title === 'ඇණවුම් කළමනාකරණය' && pendingOrdersCount > 0) ||
                          (action.title === 'සියළුම පරිශීලකයින් සදහා විශේෂ නිවේදන කළමනාකරණය' && unansweredQuestionsCount > 0) ||
                          (action.title === 'පරිශීලක ගැටළු සහ ප්‍රත්පෝශණ කළමනාකරණය' && unrepliedFeedbacksCount > 0) ||
                          (action.title === 'සිසුන්ගේ පණිවිඩ සහ ප්‍රශ්න කළමනාකරණය' && unrepliedStudentMessagesCount > 0) ||
                          (action.title === 'පන්ති ඉල්ලීම් කළමනාකරණය' && pendingEnrollmentRequestsCount > 0) ? (
                            <Box sx={{
                              position: 'absolute',
                              top: 12,
                              right: 12,
                              background: 'rgba(255,255,255,0.9)',
                              color: '#d32f2f',
                              borderRadius: '50%',
                              width: '28px',
                              height: '28px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 'bold',
                              fontSize: '0.8rem',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                              animation: 'pulse 1.5s infinite',
                              '@keyframes pulse': {
                                '0%': { transform: 'scale(1)' },
                                '50%': { transform: 'scale(1.03)' },
                                '100%': { transform: 'scale(1)' }
                              }
                            }}>
                              {loading ? (
                                <CircularProgress size={16} color="error" />
                              ) : (
                                action.title === 'සිසු කළමනාකරණය' ? pendingCount :
                                action.title === 'ඇණවුම් කළමනාකරණය' ? pendingOrdersCount :
                                action.title === 'සියළුම පරිශීලකයින් සදහා විශේෂ නිවේදන කළමනාකරණය' ? unansweredQuestionsCount :
                                action.title === 'සිසුන්ගේ පණිවිඩ සහ ප්‍රශ්න කළමනාකරණය' ? unrepliedStudentMessagesCount :
                                action.title === 'පන්ති ඉල්ලීම් කළමනාකරණය' ? pendingEnrollmentRequestsCount :
                                unrepliedFeedbacksCount
                              )}
                            </Box>
                          ) : null}
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AdminDashboard;
