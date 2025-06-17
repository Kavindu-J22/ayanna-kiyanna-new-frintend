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
  Tooltip,
  Avatar,
  Badge,
  Tabs,
  Tab,
  Menu,
  MenuItem,
  Slide,
  Zoom,
  Fade,
  useScrollTrigger
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
  ArrowBack as ArrowBackIcon,
  FilterList as FilterIcon,
  MoreVert as MoreIcon,
  Close as CloseIcon,
  DoneAll as DoneAllIcon,
  NotificationsActive as NotificationsActiveIcon,
  NotificationsOff as NotificationsOffIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { styled } from '@mui/material/styles';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));

const NotificationAvatar = styled(Avatar)(({ theme, notificationtype }) => ({
  backgroundColor:
    notificationtype === 'student_registration_approved' || notificationtype === 'class_request_approved'
      ? theme.palette.success.light
      : notificationtype === 'student_registration_rejected' || notificationtype === 'class_request_rejected'
      ? theme.palette.error.light
      : notificationtype === 'class_enrollment'
      ? theme.palette.primary.light
      : notificationtype === 'admin_message'
      ? theme.palette.info.light
      : theme.palette.grey[500],
  color: theme.palette.getContrastText(
    notificationtype === 'student_registration_approved' || notificationtype === 'class_request_approved'
      ? theme.palette.success.light
      : notificationtype === 'student_registration_rejected' || notificationtype === 'class_request_rejected'
      ? theme.palette.error.light
      : notificationtype === 'class_enrollment'
      ? theme.palette.primary.light
      : notificationtype === 'admin_message'
      ? theme.palette.info.light
      : theme.palette.grey[500]
  ),
}));

const NotificationItem = styled(ListItem)(({ theme, unread }) => ({
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateX(5px)',
    boxShadow: theme.shadows[2],
  },
  backgroundColor: unread ? theme.palette.action.selected : 'transparent',
  borderLeft: unread ? `4px solid ${theme.palette.primary.main}` : '4px solid transparent',
}));

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [anchorEl, setAnchorEl] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    loadNotifications();
  }, []);

  useEffect(() => {
    const count = notifications.filter(n => !n.read).length;
    setUnreadCount(count);
  }, [notifications]);

  useEffect(() => {
    filterNotifications();
  }, [notifications, activeTab]);

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
      setError('Failed to load notifications. Please try again later.');
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterNotifications = () => {
    switch (activeTab) {
      case 'unread':
        setFilteredNotifications(notifications.filter(n => !n.read));
        break;
      case 'read':
        setFilteredNotifications(notifications.filter(n => n.read));
        break;
      default:
        setFilteredNotifications([...notifications]);
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

  const deleteAllNotifications = async () => {
    try {
      setProcessing(true);
      const token = localStorage.getItem('token');
      await axios.delete(
        'https://ayanna-kiyanna-new-backend.onrender.com/api/notifications',
        { headers: { 'x-auth-token': token } }
      );
      await loadNotifications();
    } catch (error) {
      console.error('Error deleting all notifications:', error);
    } finally {
      setProcessing(false);
      handleMenuClose();
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'student_registration_approved':
        return <CheckCircleIcon />;
      case 'student_registration_rejected':
        return <CancelIcon />;
      case 'class_enrollment':
        return <SchoolIcon />;
      case 'class_request_approved':
        return <CheckCircleIcon />;
      case 'class_request_rejected':
        return <CancelIcon />;
      case 'admin_message':
        return <MessageIcon />;
      default:
        return <InfoIcon />;
    }
  };

  const getNotificationTypeLabel = (type) => {
    switch (type) {
      case 'student_registration_approved':
        return 'Approval';
      case 'student_registration_rejected':
        return 'Rejection';
      case 'class_enrollment':
        return 'Enrollment';
      case 'class_request_approved':
        return 'Class Approved';
      case 'class_request_rejected':
        return 'Class Rejected';
      case 'admin_message':
        return 'Admin Message';
      default:
        return 'Notification';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const minutes = Math.floor(diffInHours * 60);
      return minutes < 1 ? 'Just now' : `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
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

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const trigger = useScrollTrigger();

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <Fade in={true} style={{ transitionDelay: '200ms' }}>
          <Box textAlign="center">
            <CircularProgress size={60} thickness={4} sx={{ mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Loading your notifications...
            </Typography>
          </Box>
        </Fade>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4, position: 'relative' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <StyledBadge badgeContent={unreadCount} color="primary" max={99}>
          <NotificationsIcon sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
        </StyledBadge>
        <Typography variant="h4" component="h1" sx={{ flexGrow: 1, fontWeight: 600 }}>
          Notifications
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Filter notifications">
            <IconButton onClick={handleMenuOpen}>
              <FilterIcon />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => { setActiveTab('all'); handleMenuClose(); }}>
              <ListItemIcon>
                <NotificationsIcon fontSize="small" />
              </ListItemIcon>
              All Notifications
            </MenuItem>
            <MenuItem onClick={() => { setActiveTab('unread'); handleMenuClose(); }}>
              <ListItemIcon>
                <NotificationsActiveIcon fontSize="small" color="primary" />
              </ListItemIcon>
              Unread Only
            </MenuItem>
            <MenuItem onClick={() => { setActiveTab('read'); handleMenuClose(); }}>
              <ListItemIcon>
                <NotificationsOffIcon fontSize="small" color="action" />
              </ListItemIcon>
              Read Only
            </MenuItem>
            <Divider />
            <MenuItem onClick={markAllAsRead} disabled={unreadCount === 0 || processing}>
              <ListItemIcon>
                <DoneAllIcon fontSize="small" color="primary" />
              </ListItemIcon>
              Mark All as Read
            </MenuItem>
            <MenuItem onClick={deleteAllNotifications} disabled={notifications.length === 0 || processing}>
              <ListItemIcon>
                <DeleteAllIcon fontSize="small" color="error" />
              </ListItemIcon>
              Clear All Notifications
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{ mb: 3 }}
      >
        <Tab label="All" value="all" />
        <Tab label={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            Unread
            {unreadCount > 0 && (
              <Chip label={unreadCount} size="small" color="primary" sx={{ ml: 1 }} />
            )}
          </Box>
        } value="unread" />
        <Tab label="Read" value="read" />
      </Tabs>

      {error && (
        <Slide direction="down" in={!!error}>
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        </Slide>
      )}

      <Paper elevation={2} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        {filteredNotifications.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <NotificationsIcon sx={{ 
              fontSize: 64, 
              color: 'text.secondary', 
              mb: 2,
              opacity: 0.5
            }} />
            <Typography variant="h5" color="text.secondary" gutterBottom>
              No notifications found
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              {activeTab === 'all' 
                ? "You don't have any notifications yet." 
                : activeTab === 'unread' 
                ? "You've read all your notifications." 
                : "No read notifications to display."}
            </Typography>
            {activeTab !== 'all' && (
              <Button 
                variant="outlined" 
                onClick={() => setActiveTab('all')}
                startIcon={<NotificationsIcon />}
              >
                View All Notifications
              </Button>
            )}
          </Box>
        ) : (
          <List disablePadding>
            {filteredNotifications.map((notification, index) => (
              <React.Fragment key={notification._id}>
                <Slide direction="up" in={true} mountOnEnter unmountOnExit>
                  <NotificationItem
                    button
                    onClick={() => handleNotificationClick(notification)}
                    unread={!notification.read}
                    sx={{
                      py: 2,
                      px: 3,
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 48, mr: 2 }}>
                      <NotificationAvatar notificationtype={notification.type}>
                        {getNotificationIcon(notification.type)}
                      </NotificationAvatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontWeight: notification.read ? 'normal' : 'bold',
                              color: notification.read ? 'text.primary' : 'text.primary'
                            }}
                          >
                            {notification.title}
                          </Typography>
                          <Chip
                            label={getNotificationTypeLabel(notification.type)}
                            size="small"
                            color={notification.read ? 'default' : 'primary'}
                            variant={notification.read ? 'outlined' : 'filled'}
                            sx={{ 
                              height: 20,
                              fontSize: '0.65rem',
                              fontWeight: 500
                            }}
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography 
                          variant="body2" 
                          color="text.secondary" 
                          sx={{ 
                            mb: 1,
                            display: '-webkit-box',
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}
                        >
                          {notification.message.substring(0, 15)}...<strong style={{ fontSize: '0.8rem' }}>Click here.</strong>
                        </Typography>
                          <Typography 
                            variant="caption" 
                            color={notification.read ? 'text.secondary' : 'primary.main'}
                            sx={{ 
                              display: 'flex',
                              alignItems: 'center',
                              fontWeight: notification.read ? 'normal' : 'medium'
                            }}
                          >
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
                            color={notification.read ? 'default' : 'primary'}
                          >
                            {notification.read ? <MarkUnreadIcon fontSize="small" /> : <MarkReadIcon fontSize="small" />}
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
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </ListItemSecondaryAction>
                  </NotificationItem>
                </Slide>
                {index < filteredNotifications.length - 1 && <Divider variant="middle" />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>

      {/* Floating Action Buttons */}
      <Zoom in={!trigger}>
        <Box sx={{ position: 'fixed', bottom: 32, right: 32, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {unreadCount > 0 && (
            <Tooltip title="Mark all as read">
              <Fab
                color="primary"
                onClick={markAllAsRead}
                disabled={processing}
                sx={{ boxShadow: 3 }}
              >
                <DoneAllIcon />
              </Fab>
            </Tooltip>
          )}
          {filteredNotifications.length > 0 && (
            <Tooltip title="Clear all notifications">
              <Fab
                color="secondary"
                onClick={deleteAllNotifications}
                disabled={processing}
                sx={{ boxShadow: 3 }}
              >
                <DeleteAllIcon />
              </Fab>
            </Tooltip>
          )}
        </Box>
      </Zoom>

      {/* Notification Details Dialog */}
      <Dialog
        open={showDetails}
        onClose={() => setShowDetails(false)}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Slide}
        transitionDuration={300}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          backgroundColor: 'primary.main',
          color: 'primary.contrastText',
          py: 2
        }}>
          <NotificationAvatar notificationtype={selectedNotification?.type}>
            {selectedNotification && getNotificationIcon(selectedNotification.type)}
          </NotificationAvatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6">{selectedNotification?.title}</Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              {selectedNotification && getNotificationTypeLabel(selectedNotification.type)}
            </Typography>
          </Box>
          <IconButton 
            edge="end" 
            onClick={() => setShowDetails(false)}
            sx={{ color: 'primary.contrastText' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          {selectedNotification && (
            <Box>
              <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
                {selectedNotification.message}
              </Typography>
              
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                mb: 3,
                p: 2,
                backgroundColor: 'grey.50',
                borderRadius: 1
              }}>
                <Typography variant="caption" sx={{ fontWeight: 'medium' }}>
                  Received:
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatDate(selectedNotification.createdAt)}
                </Typography>
              </Box>
              
              {selectedNotification.data?.adminNote && (
                <Box sx={{ 
                  mt: 2, 
                  p: 2, 
                  backgroundColor: 'grey.50', 
                  borderRadius: 1,
                  borderLeft: '3px solid',
                  borderLeftColor: 'primary.main'
                }}>
                  <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AdminIcon fontSize="small" color="primary" />
                    Admin Note:
                  </Typography>
                  <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                    {selectedNotification.data.adminNote}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button 
            onClick={() => setShowDetails(false)}
            variant="contained"
            color="primary"
            fullWidth
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default NotificationsPage;