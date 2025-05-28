import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Box,
  Alert,
  CircularProgress,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fab,
  Tooltip
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Delete as DeleteIcon,
  MarkEmailRead as MarkReadIcon,
  MarkEmailUnread as MarkUnreadIcon,
  School as SchoolIcon,
  AdminPanelSettings as AdminIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Message as MessageIcon,
  DeleteSweep as DeleteAllIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'https://ayanna-kiyanna-new-backend.onrender.com/api/notifications',
        { headers: { 'x-auth-token': token } }
      );
      setNotifications(response.data.notifications || []);
    } catch (error) {
      setError('Failed to load notifications');
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/notifications/${notificationId}/read`,
        {},
        { headers: { 'x-auth-token': token } }
      );
      await loadNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      setProcessing(true);
      const token = localStorage.getItem('token');
      await axios.delete(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/notifications/${notificationId}`,
        { headers: { 'x-auth-token': token } }
      );
      await loadNotifications();
    } catch (error) {
      console.error('Error deleting notification:', error);
    } finally {
      setProcessing(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      setProcessing(true);
      const token = localStorage.getItem('token');
      await axios.put(
        'https://ayanna-kiyanna-new-backend.onrender.com/api/notifications/mark-all-read',
        {},
        { headers: { 'x-auth-token': token } }
      );
      await loadNotifications();
    } catch (error) {
      console.error('Error marking all as read:', error);
    } finally {
      setProcessing(false);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'student_registration_approved':
        return <CheckCircleIcon color="success" />;
      case 'student_registration_rejected':
        return <CancelIcon color="error" />;
      case 'class_enrollment':
        return <SchoolIcon color="primary" />;
      case 'class_request_approved':
        return <CheckCircleIcon color="success" />;
      case 'class_request_rejected':
        return <CancelIcon color="error" />;
      case 'admin_message':
        return <MessageIcon color="info" />;
      default:
        return <InfoIcon color="action" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'student_registration_approved':
      case 'class_request_approved':
        return 'success';
      case 'student_registration_rejected':
      case 'class_request_rejected':
        return 'error';
      case 'class_enrollment':
        return 'primary';
      case 'admin_message':
        return 'info';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    setShowDetails(true);
    if (!notification.read) {
      markAsRead(notification._id);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <NotificationsIcon sx={{ mr: 2, fontSize: 32, color: '#b388ff' }} />
        <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
          Notifications
        </Typography>
        {notifications.some(n => !n.read) && (
          <Button
            variant="outlined"
            startIcon={<MarkReadIcon />}
            onClick={markAllAsRead}
            disabled={processing}
            sx={{ mr: 1 }}
          >
            Mark All Read
          </Button>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={6} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        {notifications.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <NotificationsIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No notifications yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              You'll see notifications here when there are updates
            </Typography>
          </Box>
        ) : (
          <List>
            {notifications.map((notification, index) => (
              <React.Fragment key={notification._id}>
                <ListItem
                  button
                  onClick={() => handleNotificationClick(notification)}
                  sx={{
                    backgroundColor: notification.read ? 'transparent' : 'rgba(179, 136, 255, 0.05)',
                    '&:hover': {
                      backgroundColor: notification.read ? 'rgba(0, 0, 0, 0.04)' : 'rgba(179, 136, 255, 0.1)'
                    },
                    py: 2
                  }}
                >
                  <ListItemIcon>
                    {getNotificationIcon(notification.type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: notification.read ? 'normal' : 'bold',
                            color: notification.read ? 'text.primary' : 'primary.main'
                          }}
                        >
                          {notification.title}
                        </Typography>
                        <Chip
                          label={notification.type.replace(/_/g, ' ').toUpperCase()}
                          size="small"
                          color={getNotificationColor(notification.type)}
                          variant="outlined"
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {notification.message}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(notification.createdAt)}
                        </Typography>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title={notification.read ? "Mark as unread" : "Mark as read"}>
                        <IconButton
                          edge="end"
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notification._id);
                          }}
                          size="small"
                        >
                          {notification.read ? <MarkUnreadIcon /> : <MarkReadIcon />}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete notification">
                        <IconButton
                          edge="end"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification._id);
                          }}
                          size="small"
                          color="error"
                          disabled={processing}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </ListItemSecondaryAction>
                </ListItem>
                {index < notifications.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>

      {/* Notification Details Dialog */}
      <Dialog
        open={showDetails}
        onClose={() => setShowDetails(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {selectedNotification && getNotificationIcon(selectedNotification.type)}
          {selectedNotification?.title}
        </DialogTitle>
        <DialogContent>
          {selectedNotification && (
            <Box>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {selectedNotification.message}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Received: {formatDate(selectedNotification.createdAt)}
              </Typography>
              {selectedNotification.data?.adminNote && (
                <Box sx={{ mt: 2, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Admin Note:
                  </Typography>
                  <Typography variant="body2">
                    {selectedNotification.data.adminNote}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDetails(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default NotificationsPage;
