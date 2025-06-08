import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Pagination,
  Badge,
  Divider
} from '@mui/material';
import {
  ShoppingBag as OrderIcon,
  LocalShipping as DeliveryIcon,
  Store as PickupIcon,
  CheckCircle as ApprovedIcon,
  Cancel as RejectedIcon,
  Schedule as PendingIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  GetApp as DownloadIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { downloadReceipt } from '../utils/receiptGenerator';

const AdminOrderManagement = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState('');
  const [pendingCount, setPendingCount] = useState(0);
  
  // Dialog states
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Status update form
  const [statusForm, setStatusForm] = useState({
    status: '',
    deliveryStatus: '',
    adminNote: ''
  });

  // Filter and search states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDeliveryType, setSelectedDeliveryType] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);

  const statusOptions = ['pending', 'approved', 'rejected', 'completed', 'cancelled'];
  const deliveryStatusOptions = ['not_delivered', 'delivered'];

  useEffect(() => {
    checkAuthentication();
  }, []);

  useEffect(() => {
    if (userRole === 'admin' || userRole === 'moderator') {
      fetchOrders();
    }
  }, [userRole, currentPage, searchTerm, selectedStatus, selectedDeliveryType, sortBy, sortOrder]);

  const checkAuthentication = async () => {
    const userEmail = localStorage.getItem('userEmail');
    const token = localStorage.getItem('token');

    if (!userEmail || !token) {
      navigate('/login');
      return;
    }

    try {
      const response = await axios.get('https://ayanna-kiyanna-new-backend.onrender.com/api/auth/me', {
        headers: { 'x-auth-token': token }
      });

      if (response.data.role !== 'admin' && response.data.role !== 'moderator') {
        navigate('/');
        return;
      }

      setUserRole(response.data.role);
    } catch (err) {
      console.error('Authentication error:', err);
      navigate('/login');
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        sortBy,
        sortOrder
      });

      if (searchTerm) params.append('search', searchTerm);
      if (selectedStatus !== 'all') params.append('status', selectedStatus);
      if (selectedDeliveryType !== 'all') params.append('deliveryType', selectedDeliveryType);

      const response = await axios.get(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/orders?${params}`,
        { headers: { 'x-auth-token': token } }
      );

      setOrders(response.data.orders);
      setPendingCount(response.data.pendingCount);
      setTotalPages(response.data.pagination.totalPages);
      setTotalOrders(response.data.pagination.totalOrders);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Error loading orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <PendingIcon sx={{ color: 'warning.main' }} />;
      case 'approved':
        return <ApprovedIcon sx={{ color: 'success.main' }} />;
      case 'rejected':
        return <RejectedIcon sx={{ color: 'error.main' }} />;
      case 'completed':
        return <ApprovedIcon sx={{ color: 'primary.main' }} />;
      case 'cancelled':
        return <RejectedIcon sx={{ color: 'grey.500' }} />;
      default:
        return <PendingIcon sx={{ color: 'grey.500' }} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      case 'completed':
        return 'primary';
      case 'cancelled':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending':
        return 'අනුමත කිරීමට';
      case 'approved':
        return 'අනුමත';
      case 'rejected':
        return 'ප්‍රතික්ෂේප';
      case 'completed':
        return 'සම්පූර්ණ';
      case 'cancelled':
        return 'අවලංගු';
      default:
        return status;
    }
  };

  const getDeliveryStatusLabel = (status) => {
    switch (status) {
      case 'not_delivered':
        return 'ගෙන්වා නොදී ඇත';
      case 'delivered':
        return 'ගෙන්වා දී ඇත';
      default:
        return status;
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderDialog(true);
  };

  const handleEditStatus = (order) => {
    setSelectedOrder(order);
    setStatusForm({
      status: order.status,
      deliveryStatus: order.deliveryStatus,
      adminNote: order.adminNote || ''
    });
    setShowStatusDialog(true);
  };

  const handleUpdateStatus = async () => {
    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');
      
      await axios.put(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/orders/${selectedOrder._id}/status`,
        statusForm,
        { headers: { 'x-auth-token': token } }
      );

      setShowStatusDialog(false);
      setSelectedOrder(null);
      setStatusForm({ status: '', deliveryStatus: '', adminNote: '' });
      fetchOrders();
      alert('Order status updated successfully!');
    } catch (err) {
      console.error('Error updating order status:', err);
      setError(err.response?.data?.message || 'Error updating order status');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('si-LK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDownloadReceipt = (order) => {
    downloadReceipt(order, getStatusLabel);
  };

  const handleDownloadReceiptOld = (order) => {
    // Create a professional HTML receipt with logo
    const receiptHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Receipt - ${order.orderId}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Sinhala:wght@300;400;600;700&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: 'Inter', 'Noto Sans Sinhala', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f8f9fa;
            padding: 20px;
          }

          .receipt-container {
            max-width: 700px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            overflow: hidden;
            border: 1px solid #e9ecef;
          }

          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
            position: relative;
          }

          .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/><circle cx="10" cy="60" r="0.5" fill="white" opacity="0.1"/><circle cx="90" cy="40" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
            opacity: 0.3;
          }

          .logo-section {
            position: relative;
            z-index: 2;
            margin-bottom: 20px;
          }

          .logo {
            width: 80px;
            height: 80px;
            background: white;
            border-radius: 50%;
            margin: 0 auto 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            font-size: 2em;
            font-weight: bold;
            color: #667eea;
          }

          .company-name {
            font-size: 2.2em;
            font-weight: 700;
            margin-bottom: 5px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            position: relative;
            z-index: 2;
          }

          .company-subtitle {
            font-size: 1.1em;
            opacity: 0.9;
            font-weight: 400;
            position: relative;
            z-index: 2;
          }

          .receipt-title {
            background: rgba(255,255,255,0.15);
            padding: 12px 24px;
            border-radius: 25px;
            font-size: 1.2em;
            font-weight: 600;
            margin-top: 20px;
            display: inline-block;
            position: relative;
            z-index: 2;
          }

          .content {
            padding: 40px;
          }

          .order-info {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            padding: 25px;
            border-radius: 12px;
            margin-bottom: 30px;
            border: 1px solid #dee2e6;
            position: relative;
          }

          .order-info::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 4px;
            height: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 2px;
          }

          .section {
            margin-bottom: 30px;
            background: #fafbfc;
            padding: 25px;
            border-radius: 10px;
            border: 1px solid #e9ecef;
          }

          .section h3 {
            color: #495057;
            font-size: 1.4em;
            font-weight: 600;
            margin-bottom: 20px;
            padding-bottom: 12px;
            border-bottom: 2px solid #667eea;
            position: relative;
          }

          .section h3::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 0;
            width: 40px;
            height: 2px;
            background: #764ba2;
          }

          .item-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 0;
            border-bottom: 1px solid #e9ecef;
            transition: background-color 0.2s;
          }

          .item-row:hover {
            background-color: rgba(102, 126, 234, 0.05);
            border-radius: 6px;
            margin: 0 -10px;
            padding: 15px 10px;
          }

          .item-row:last-child {
            border-bottom: none;
          }

          .item-name {
            font-weight: 600;
            color: #495057;
            margin-bottom: 4px;
          }

          .item-details {
            font-size: 0.9em;
            color: #6c757d;
          }

          .item-price {
            font-weight: 700;
            color: #495057;
            font-size: 1.1em;
          }

          .total-section {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 12px;
            margin-top: 30px;
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
          }

          .total-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
            font-size: 1.05em;
          }

          .total-row.final {
            font-size: 1.4em;
            font-weight: 700;
            border-top: 2px solid rgba(255,255,255,0.3);
            padding-top: 20px;
            margin-top: 20px;
            background: rgba(255,255,255,0.1);
            padding: 20px;
            border-radius: 8px;
            margin-left: -15px;
            margin-right: -15px;
          }

          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 20px;
          }

          .info-item {
            display: flex;
            flex-direction: column;
          }

          .info-label {
            font-weight: 600;
            color: #495057;
            margin-bottom: 4px;
            font-size: 0.9em;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .info-value {
            color: #212529;
            font-size: 1.05em;
          }

          .footer {
            text-align: center;
            padding: 30px;
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            color: #6c757d;
            border-top: 1px solid #dee2e6;
          }

          .footer-logo {
            width: 40px;
            height: 40px;
            background: #667eea;
            border-radius: 50%;
            margin: 0 auto 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
          }

          .status-badge {
            display: inline-block;
            padding: 10px 20px;
            border-radius: 25px;
            font-weight: 600;
            text-transform: uppercase;
            font-size: 0.85em;
            letter-spacing: 0.5px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }

          .status-approved { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
          .status-pending { background: #fff3cd; color: #856404; border: 1px solid #ffeaa7; }
          .status-rejected { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
          .status-completed { background: #d1ecf1; color: #0c5460; border: 1px solid #bee5eb; }
          .status-cancelled { background: #e2e3e5; color: #383d41; border: 1px solid #d6d8db; }

          @media print {
            body { background: white; padding: 0; }
            .receipt-container { box-shadow: none; border: none; }
          }
        </style>
      </head>
      <body>
        <div class="receipt-container">
          <div class="header">
            <div class="logo-section">
              <div class="logo">අ</div>
              <div class="company-name">අයන්න කියන්න</div>
              <div class="company-subtitle">AYANNA KIYANNA INSTITUTE</div>
              <div class="receipt-title">ඇණවුම් රිසිට්පත</div>
            </div>
          </div>

          <div class="content">
            <div class="order-info">
              <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px;">
                <div>
                  <div style="font-size: 1.3em; font-weight: 700; color: #495057; margin-bottom: 8px;">
                    ඇණවුම් අංකය: ${order.orderId}
                  </div>
                  <div style="color: #6c757d; font-size: 1.05em;">
                    ඇණවුම් දිනය: ${new Date(order.createdAt).toLocaleDateString('si-LK', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  <div style="color: #6c757d; font-size: 0.95em; margin-top: 4px;">
                    රිසිට්පත ජනනය: ${new Date().toLocaleDateString('si-LK', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
                <div class="status-badge status-${order.status}">
                  ${getStatusLabel(order.status)}
                </div>
              </div>
            </div>

            <div class="section">
              <h3>පාරිභෝගික තොරතුරු</h3>
              <div class="info-grid">
                <div class="info-item">
                  <div class="info-label">පාරිභෝගික නම</div>
                  <div class="info-value">${order.user?.fullName || 'N/A'}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">ඊමේල් ලිපිනය</div>
                  <div class="info-value">${order.userEmail}</div>
                </div>
              </div>
            </div>

            <div class="section">
              <h3>ඇණවුම් විස්තර</h3>
              ${order.items.map(item => `
                <div class="item-row">
                  <div>
                    <div class="item-name">${item.productName}</div>
                    <div class="item-details">${item.quantity} × Rs. ${item.priceAtTime.toLocaleString()}</div>
                  </div>
                  <div class="item-price">
                    Rs. ${(item.quantity * item.priceAtTime).toLocaleString()}
                  </div>
                </div>
              `).join('')}
            </div>

            ${order.deliveryType === 'delivery' ? `
            <div class="section">
              <h3>ගෙන්වා දීමේ ලිපිනය</h3>
              <div class="info-grid">
                <div class="info-item">
                  <div class="info-label">ලබන්නාගේ නම</div>
                  <div class="info-value">${order.deliveryInfo?.recipientName}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">දුරකථන අංකය</div>
                  <div class="info-value">${order.deliveryInfo?.contactNumber}</div>
                </div>
              </div>
              <div class="info-item" style="margin-top: 15px;">
                <div class="info-label">ලිපිනය</div>
                <div class="info-value">${order.deliveryInfo?.address}</div>
              </div>
              <div class="info-item" style="margin-top: 15px;">
                <div class="info-label">දිස්ත්‍රික්කය</div>
                <div class="info-value">${order.deliveryInfo?.district}</div>
              </div>
            </div>
            ` : ''}

            <div class="section">
              <h3>ගෙවීම් සහ ගෙන්වා දීමේ තොරතුරු</h3>
              <div class="info-grid">
                <div class="info-item">
                  <div class="info-label">ගෙවීම් ක්‍රමය</div>
                  <div class="info-value">${order.paymentMethod === 'bank_transfer' ? 'බැංකු මාරුව' : 'ලබා ගන්නා විට ගෙවීම'}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">ගෙන්වා දීමේ ක්‍රමය</div>
                  <div class="info-value">${order.deliveryType === 'delivery' ? 'ගෙන්වා දීම' : 'ආයතනයෙන් ලබා ගැනීම'}</div>
                </div>
              </div>
              ${order.paidInPerson ? '<div style="color: #28a745; font-weight: bold; margin-top: 15px; padding: 10px; background: #d4edda; border-radius: 6px; border: 1px solid #c3e6cb;">✓ පුද්ගලිකව ගෙවන ලදි</div>' : ''}
            </div>

            <div class="total-section">
              <div class="total-row">
                <span>උප එකතුව:</span>
                <span>Rs. ${order.subtotal.toLocaleString()}</span>
              </div>
              <div class="total-row">
                <span>වට්ටම්:</span>
                <span>- Rs. ${order.totalDiscount.toLocaleString()}</span>
              </div>
              <div class="total-row">
                <span>ගෙන්වා දීමේ ගාස්තුව:</span>
                <span>Rs. ${order.deliveryCharge.toLocaleString()}</span>
              </div>
              <div class="total-row final">
                <span>මුළු ගෙවිය යුතු මුදල:</span>
                <span>Rs. ${order.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div class="footer">
            <div class="footer-logo">අ</div>
            <div style="font-size: 1.1em; font-weight: 600; color: #495057; margin-bottom: 10px;">
              අයන්න කියන්න ආයතනය
            </div>
            <div style="margin-bottom: 15px; color: #6c757d;">
              ගුණාත්මක අධ්‍යාපනය සහ නිෂ්පාදන සේවාව
            </div>
            <div style="font-size: 0.9em; color: #6c757d; border-top: 1px solid #dee2e6; padding-top: 15px;">
              ඔබගේ ඇණවුම සඳහා ස්තූතියි! | www.ayannakiyanna.com
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Create a new window and print as PDF
    const printWindow = window.open('', '_blank');
    printWindow.document.write(receiptHTML);
    printWindow.document.close();

    // Wait for content to load then trigger print
    printWindow.onload = function() {
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    };
  };

  if (loading && orders.length === 0) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
              fontWeight: 'bold'
            }}
          >
            <Badge badgeContent={pendingCount} color="error" sx={{ mr: 2 }}>
              <OrderIcon sx={{ mr: 1 }} />
            </Badge>
            ඇණවුම් කළමනාකරණය
          </Typography>
          
          <Typography variant="h6" color="text.secondary">
            මුළු ඇණවුම්: {totalOrders}
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Search and Filter Section */}
        <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                placeholder="ඇණවුම් අංකය හෝ ඊමේල් සොයන්න..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
                sx={{ minWidth: 200 }}
              />
            </Grid>
            
            <Grid item xs={12} md={2}>
              <FormControl fullWidth sx={{ minWidth: 200 }}>
                <InputLabel>ඇණවුම් තත්ත්වය</InputLabel>
                <Select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  label="ඇණවුම් තත්ත්වය"
                >
                  <MenuItem value="all">සියල්ල</MenuItem>
                  {statusOptions.map((status) => (
                    <MenuItem key={status} value={status}>
                      {getStatusLabel(status)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={2}>
              <FormControl fullWidth sx={{ minWidth: 200 }}>
                <InputLabel>ලබා ගැනීමේ ක්‍රමය</InputLabel>
                <Select
                  value={selectedDeliveryType}
                  onChange={(e) => setSelectedDeliveryType(e.target.value)}
                  label="ලබා ගැනීමේ ක්‍රමය"
                >
                  <MenuItem value="all">සියල්ල</MenuItem>
                  <MenuItem value="pickup">ආයතනයෙන් ලබා ගැනීම</MenuItem>
                  <MenuItem value="delivery">ගෙන්වා දීම</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={5}>
              <FormControl fullWidth sx={{ minWidth: 200 }}>
                <InputLabel>පිළිවෙල</InputLabel>
                <Select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split('-');
                    setSortBy(field);
                    setSortOrder(order);
                  }}
                  label="පිළිවෙල"
                >
                  <MenuItem value="createdAt-desc">නවතම පළමුව</MenuItem>
                  <MenuItem value="createdAt-asc">පැරණිතම පළමුව</MenuItem>
                  <MenuItem value="totalAmount-desc">මිල වැඩිවෙන්</MenuItem>
                  <MenuItem value="totalAmount-asc">මිල අඩුවෙන්</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        {/* Orders List */}
        {orders.length === 0 ? (
          <Paper elevation={3} sx={{ p: 8, textAlign: 'center' }}>
            <OrderIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 3 }} />
            <Typography
              variant="h5"
              gutterBottom
              sx={{ fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif' }}
            >
              ඇණවුම් නොමැත
            </Typography>
            <Typography variant="body1" color="text.secondary">
              තෝරාගත් ෆිල්ටර සඳහා ඇණවුම් සොයා ගත නොහැකි විය
            </Typography>
          </Paper>
        ) : (
          <>
            {orders.map((order, index) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card
                  elevation={3}
                  sx={{
                    mb: 3,
                    borderRadius: 2,
                    '&:hover': { boxShadow: 6 }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Grid container spacing={3}>
                      {/* Order Header */}
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                              {order.orderId}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {order.user?.fullName} ({order.userEmail})
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {formatDate(order.createdAt)}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            {getStatusIcon(order.status)}
                            <Chip
                              label={getStatusLabel(order.status)}
                              color={getStatusColor(order.status)}
                              size="small"
                            />
                          </Box>
                        </Box>
                      </Grid>

                      {/* Order Details */}
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                          ඇණවුම් අයිතම ({order.totalItems})
                        </Typography>
                        <List dense sx={{ maxHeight: 120, overflow: 'auto' }}>
                          {order.items.slice(0, 2).map((item) => (
                            <ListItem key={item._id} sx={{ px: 0 }}>
                              <ListItemAvatar>
                                <Avatar
                                  src={item.product?.images?.[0]?.url}
                                  alt={item.productName}
                                  variant="rounded"
                                  sx={{ width: 40, height: 40 }}
                                />
                              </ListItemAvatar>
                              <ListItemText
                                primary={item.productName}
                                secondary={`${item.quantity} × Rs. ${item.priceAtTime.toLocaleString()}`}
                                primaryTypographyProps={{ fontSize: '0.9rem' }}
                                secondaryTypographyProps={{ fontSize: '0.8rem' }}
                              />
                            </ListItem>
                          ))}
                          {order.items.length > 2 && (
                            <ListItem sx={{ px: 0 }}>
                              <ListItemText
                                primary={`සහ තවත් ${order.items.length - 2} අයිතම...`}
                                primaryTypographyProps={{ fontSize: '0.9rem', color: 'text.secondary' }}
                              />
                            </ListItem>
                          )}
                        </List>
                      </Grid>

                      {/* Delivery & Payment Info */}
                      <Grid item xs={12} md={6}>
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            {order.deliveryType === 'pickup' ? <PickupIcon sx={{ mr: 1, fontSize: 20 }} /> : <DeliveryIcon sx={{ mr: 1, fontSize: 20 }} />}
                            <Typography variant="body2">
                              {order.deliveryType === 'pickup' ? 'ආයතනයෙන් ලබා ගැනීම' : `ගෙන්වා දීම - ${order.deliveryInfo?.district}`}
                            </Typography>
                          </Box>
                          
                          {order.deliveryType === 'delivery' && (
                            <Chip
                              label={getDeliveryStatusLabel(order.deliveryStatus)}
                              size="small"
                              color={order.deliveryStatus === 'delivered' ? 'success' : 'default'}
                              sx={{ mb: 1 }}
                            />
                          )}
                          
                          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
                            Rs. {order.totalAmount.toLocaleString()}
                          </Typography>
                          
                          <Typography variant="body2" color="text.secondary">
                            ගෙවීම්: {order.paidInPerson ? 'පුද්ගලිකව ගෙවන ලදි' : `රිසිට්පත් ${order.paymentReceipts?.length || 0}`}
                          </Typography>
                        </Box>
                      </Grid>

                      {/* Action Buttons */}
                      <Grid item xs={12}>
                        <Divider sx={{ mb: 2 }} />
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<ViewIcon />}
                            onClick={() => handleViewOrder(order)}
                          >
                            විස්තර සහ පරීක්ශා කරන්න
                          </Button>
                          
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<EditIcon />}
                            onClick={() => handleEditStatus(order)}
                          >
                            තත්ත්වය යාවත්කාලීන
                          </Button>
                          
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<DownloadIcon />}
                            onClick={() => handleDownloadReceipt(order)}
                          >
                            රිසිට්පත
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <Box display="flex" justifyContent="center" mt={4}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(event, value) => setCurrentPage(value)}
                  color="primary"
                  size="large"
                />
              </Box>
            )}
          </>
        )}
      </motion.div>

      {/* Order Details Dialog */}
      <Dialog open={showOrderDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif' }}>
          ඇණවුම් විස්තර - {selectedOrder?.orderId}
        </DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box>
              {/* Customer Info */}
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                පාරිභෝගික විස්තර
              </Typography>
              <Typography><strong>නම:</strong> {selectedOrder.user?.fullName}</Typography>
              <Typography><strong>ඊමේල්:</strong> {selectedOrder.userEmail}</Typography>
              <Typography><strong>ඇණවුම් දිනය:</strong> {formatDate(selectedOrder.createdAt)}</Typography>

              <Divider sx={{ my: 2 }} />

              {/* Order Status */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                {getStatusIcon(selectedOrder.status)}
                <Chip
                  label={getStatusLabel(selectedOrder.status)}
                  color={getStatusColor(selectedOrder.status)}
                  sx={{ ml: 1 }}
                />
              </Box>

              {/* Items */}
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                ඇණවුම් අයිතම
              </Typography>
              <List>
                {selectedOrder.items.map((item) => (
                  <ListItem key={item._id}>
                    <ListItemAvatar>
                      <Avatar
                        src={item.product?.images?.[0]?.url}
                        alt={item.productName}
                        variant="rounded"
                        sx={{ width: 50, height: 50 }}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={item.productName}
                      secondary={`ප්‍රමාණය: ${item.quantity} × Rs. ${item.priceAtTime.toLocaleString()} = Rs. ${item.itemTotal.toLocaleString()}`}
                    />
                  </ListItem>
                ))}
              </List>

              <Divider sx={{ my: 2 }} />

              {/* Delivery Info */}
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                ලබා ගැනීමේ විස්තර
              </Typography>
              {selectedOrder.deliveryType === 'pickup' ? (
                <Typography>ආයතනයෙන් සෘජුවම ලබා ගැනීම</Typography>
              ) : (
                <Box>
                  <Typography><strong>ලබන්නාගේ නම:</strong> {selectedOrder.deliveryInfo?.recipientName}</Typography>
                  <Typography><strong>සම්බන්ධතා අංකය:</strong> {selectedOrder.deliveryInfo?.contactNumber}</Typography>
                  <Typography><strong>ලිපිනය:</strong> {selectedOrder.deliveryInfo?.address}</Typography>
                  <Typography><strong>දිස්ත්‍රික්කය:</strong> {selectedOrder.deliveryInfo?.district}</Typography>
                  <Typography><strong>ගෙන්වා දීමේ තත්ත්වය:</strong> {getDeliveryStatusLabel(selectedOrder.deliveryStatus)}</Typography>
                </Box>
              )}

              <Divider sx={{ my: 2 }} />

              {/* Payment Info */}
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                ගෙවීම් විස්තර
              </Typography>
              <Typography><strong>ගෙවීම් ක්‍රමය:</strong> {selectedOrder.paymentMethod === 'bank_transfer' ? 'බැංකු මාරුව' : 'නිකුත් කිරීමේදී ගෙවීම'}</Typography>

              {selectedOrder.paidInPerson ? (
                <Box>
                  <Typography color="success.main" sx={{ mb: 2, fontWeight: 'bold' }}>✓ පුද්ගලිකව ගෙවන ලදි</Typography>

                  {selectedOrder.adminPaymentInfo && (
                    <Paper elevation={2} sx={{ p: 2, mt: 2, backgroundColor: 'success.light', color: 'success.contrastText' }}>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                        ගෙවීම් විස්තර
                      </Typography>

                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <Typography><strong>ලබන්නාගේ නම:</strong> {selectedOrder.adminPaymentInfo.recipientName}</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography><strong>සම්බන්ධතා අංකය:</strong> {selectedOrder.adminPaymentInfo.contactNumber}</Typography>
                        </Grid>
                        {selectedOrder.adminPaymentInfo.adminNote && (
                          <Grid item xs={12}>
                            <Typography><strong>පරිපාලක සටහන:</strong> {selectedOrder.adminPaymentInfo.adminNote}</Typography>
                          </Grid>
                        )}
                      </Grid>
                    </Paper>
                  )}
                </Box>
              ) : (
                <Box>
                  <Typography sx={{ mb: 2 }}>
                    <strong>අප්ලෝඩ් කරන ලද රිසිට්පත්:</strong> {selectedOrder.paymentReceipts?.length || 0}
                  </Typography>

                  {selectedOrder.paymentReceipts && selectedOrder.paymentReceipts.length > 0 && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                      {selectedOrder.paymentReceipts.map((receipt, index) => (
                        <Card key={index} sx={{ maxWidth: 200, cursor: 'pointer' }} onClick={() => window.open(receipt.url, '_blank')}>
                          <CardContent sx={{ p: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <DownloadIcon sx={{ mr: 1, fontSize: 20 }} />
                              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                රිසිට්පත {index + 1}
                              </Typography>
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                              {receipt.name}
                            </Typography>
                            <br />
                            <Typography variant="caption" color="text.secondary">
                              {new Date(receipt.uploadedAt).toLocaleDateString('si-LK')}
                            </Typography>
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  )}
                </Box>
              )}

              {/* Payment Summary */}
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>උප එකතුව:</Typography>
                  <Typography>Rs. {selectedOrder.subtotal.toLocaleString()}</Typography>
                </Box>
                {selectedOrder.totalDiscount > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>වට්ටම:</Typography>
                    <Typography color="error">-Rs. {selectedOrder.totalDiscount.toLocaleString()}</Typography>
                  </Box>
                )}
                {selectedOrder.deliveryCharge > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>ගෙන්වා දීමේ ගාස්තුව:</Typography>
                    <Typography>Rs. {selectedOrder.deliveryCharge.toLocaleString()}</Typography>
                  </Box>
                )}
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>මුළු එකතුව:</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    Rs. {selectedOrder.totalAmount.toLocaleString()}
                  </Typography>
                </Box>
              </Box>

              {selectedOrder.adminNote && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    <strong>පරිපාලක සටහන:</strong> {selectedOrder.adminNote}
                  </Typography>
                </Alert>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowOrderDialog(false)}>
            වසන්න
          </Button>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => {
              setShowOrderDialog(false);
              handleEditStatus(selectedOrder);
            }}
          >
            තත්ත්වය යාවත්කාලීන කරන්න
          </Button>
        </DialogActions>
      </Dialog>

      {/* Status Update Dialog */}
      <Dialog open={showStatusDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif' }}>
          ඇණවුම් තත්ත්වය යාවත්කාලීන කරන්න
        </DialogTitle>
        <DialogContent>
          {/* Smart Note */}
          <Alert
            severity="info"
            sx={{
              mb: 3,
              fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
              '& .MuiAlert-message': {
                fontSize: '0.95rem',
                lineHeight: 1.6
              }
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
              ⚠️ වැදගත් සටහන:
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>ගෙවීම පරීක්ෂා කර බලා එය තහවුරු කරගත්තේ නම් ඇණවුම් තත්වය මුලින්ම "අනුමත" ලෙස යාවත්කාලීන කරන්නට අමතක නොකරන්න.</strong>
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              මෙහි "සම්පූර්ණ" ලෙස තත්වයක් ලබා දී ඇත්තේ මුදල් ගෙවා ගෙන්වා ගැනීමට බලාපොරොත්තුවෙන් ගෙවීම් සිදු කල සිසුන් හට අදාල පොත් හෝ නිෂ්පාදන ඔවුන් වෙත යැවූ ලෙස සටහන් කිරීමට යි.
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>ඔබ එම සිසුන්ගේ ද ගෙවීම තහවුරු කරගත්තේ නම්, මුලින් ම "අනුමත" ලෙස සටහන් කරන්න.</strong>
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
              📝 සරලව කිවහොත්: සෑම විටකම ගෙවීම තහවුරු කරගත්තේ නම් මුලින්ම "අනුමත" ලෙස තත්වය සටහන් කරන්න.
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
              ✅ ඒ තුලින් පාරිභෝගිකයාට තම ගෙවීම තහවුරු වූ බව දැන්වෙන අතර ස්වයංක්‍රීයව නිෂ්පාදන තොග කළමනාකරණය ද සිදුවේ.
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
              📝 පසුව එය "සම්පූර්ණ" ළෙස අවශ්‍ය නම් හෝ සිසුවා හට නිශ්පාදනය තැපැල් කලේ නම් වෙනස් කරන්න.
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
              📝 ඔබ මුල් අවස්ථාවේදීම එය "සම්පූර්ණ" ලෙස සටහන් කලහොත් එය ස්වයංක්‍රීය තොග කලමණාකරණයර එකතු නොවන බව කරුණාකර සැලකිලිමත් වන්න.
            </Typography>
          </Alert>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>ඇණවුම් තත්ත්වය</InputLabel>
                <Select
                  value={statusForm.status}
                  onChange={(e) => setStatusForm({ ...statusForm, status: e.target.value })}
                  label="ඇණවුම් තත්ත්වය"
                >
                  {statusOptions.map((status) => (
                    <MenuItem key={status} value={status}>
                      {getStatusLabel(status)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {selectedOrder?.deliveryType === 'delivery' && (
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>ගෙන්වා දීමේ තත්ත්වය</InputLabel>
                  <Select
                    value={statusForm.deliveryStatus}
                    onChange={(e) => setStatusForm({ ...statusForm, deliveryStatus: e.target.value })}
                    label="ගෙන්වා දීමේ තත්ත්වය"
                  >
                    {deliveryStatusOptions.map((status) => (
                      <MenuItem key={status} value={status}>
                        {getDeliveryStatusLabel(status)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="පරිපාලක සටහන (විකල්ප)"
                multiline
                rows={3}
                value={statusForm.adminNote}
                onChange={(e) => setStatusForm({ ...statusForm, adminNote: e.target.value })}
                placeholder="ඇණවුම සම්බන්ධයෙන් අමතර සටහන්..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setShowStatusDialog(false);
            setSelectedOrder(null);
            setStatusForm({ status: '', deliveryStatus: '', adminNote: '' });
          }}>
            අවලංගු කරන්න
          </Button>
          <Button
            variant="contained"
            onClick={handleUpdateStatus}
            disabled={submitting || !statusForm.status}
            sx={{
              background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
              '&:hover': {
                background: 'linear-gradient(45deg, #FF5252, #26C6DA)',
              }
            }}
          >
            {submitting ? <CircularProgress size={24} /> : 'යාවත්කාලීන කරන්න'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminOrderManagement;
