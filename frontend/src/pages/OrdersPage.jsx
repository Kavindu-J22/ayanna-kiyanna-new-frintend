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
  Chip,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Pagination
} from '@mui/material';
import {
  ShoppingBag as OrderIcon,
  LocalShipping as DeliveryIcon,
  Store as PickupIcon,
  Payment as PaymentIcon,
  CheckCircle as ApprovedIcon,
  Cancel as RejectedIcon,
  Schedule as PendingIcon,
  GetApp as DownloadIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { downloadReceipt } from '../utils/receiptGenerator';

const OrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const statusFilters = ['all', 'pending', 'approved', 'rejected', 'completed'];
  const statusLabels = ['සියල්ල', 'අනුමත කිරීමට', 'අනුමත', 'ප්‍රතික්ෂේප', 'සම්පූර්ණ'];

  useEffect(() => {
    checkAuthentication();
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [selectedTab, currentPage]);

  const checkAuthentication = async () => {
    const userEmail = localStorage.getItem('userEmail');
    const token = localStorage.getItem('token');

    if (!userEmail || !token) {
      navigate('/login');
      return;
    }

    // Authentication passed, now fetch orders
    fetchOrders();
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const status = statusFilters[selectedTab];
      
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10
      });
      
      if (status !== 'all') {
        params.append('status', status);
      }

      const response = await axios.get(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/orders/my-orders?${params}`,
        { headers: { 'x-auth-token': token } }
      );

      setOrders(response.data.orders);
      setTotalPages(response.data.pagination.totalPages);
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

  const handleDownloadReceipt = (orderId) => {
    // Find the order by ID
    const order = orders.find(o => o.orderId === orderId);
    if (!order) {
      alert('Order not found');
      return;
    }

    downloadReceipt(order, getStatusLabel);
  };

  const handleDownloadReceiptOld = (orderId) => {
    // Find the order by ID
    const order = orders.find(o => o.orderId === orderId);
    if (!order) {
      alert('Order not found');
      return;
    }

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
            padding: 30px;
          }

          .order-info {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 20px;
            border-left: 5px solid #FF6B6B;
          }

          .section {
            margin-bottom: 25px;
          }

          .section h3 {
            color: #333;
            border-bottom: 2px solid #4ECDC4;
            padding-bottom: 10px;
            margin-bottom: 15px;
            font-size: 1.3em;
          }

          .item-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #eee;
          }

          .item-row:last-child {
            border-bottom: none;
          }

          .total-section {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 10px;
            margin-top: 20px;
          }

          .total-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
          }

          .total-row.final {
            font-size: 1.3em;
            font-weight: bold;
            border-top: 2px solid rgba(255,255,255,0.3);
            padding-top: 15px;
            margin-top: 15px;
          }

          .footer {
            text-align: center;
            padding: 20px;
            background: #f8f9fa;
            color: #666;
            font-style: italic;
          }

          .status-badge {
            display: inline-block;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 0.9em;
          }

          .status-approved { background: #d4edda; color: #155724; }
          .status-pending { background: #fff3cd; color: #856404; }
          .status-rejected { background: #f8d7da; color: #721c24; }
          .status-completed { background: #d1ecf1; color: #0c5460; }
          .status-cancelled { background: #e2e3e5; color: #383d41; }
        </style>
      </head>
      <body>
        <div class="receipt-container">
          <div class="header">
            <h1>AYANNA KIYANNA</h1>
            <h2>ඇණවුම් රිසිට්පත</h2>
          </div>

          <div class="content">
            <div class="order-info">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <strong style="font-size: 1.2em;">ඇණවුම් අංකය: ${order.orderId}</strong><br>
                  <span style="color: #666;">දිනය: ${new Date(order.createdAt).toLocaleDateString('si-LK')}</span>
                </div>
                <div class="status-badge status-${order.status}">
                  ${getStatusLabel(order.status)}
                </div>
              </div>
            </div>

            <div class="section">
              <h3>ඇණවුම් විස්තර</h3>
              ${order.items.map(item => `
                <div class="item-row">
                  <div>
                    <strong>${item.productName}</strong><br>
                    <small style="color: #666;">${item.quantity} × Rs. ${item.priceAtTime.toLocaleString()}</small>
                  </div>
                  <div style="font-weight: bold;">
                    Rs. ${(item.quantity * item.priceAtTime).toLocaleString()}
                  </div>
                </div>
              `).join('')}
            </div>

            ${order.deliveryType === 'delivery' ? `
            <div class="section">
              <h3>ගෙන්වා දීමේ ලිපිනය</h3>
              <div><strong>ලබන්නා:</strong> ${order.deliveryInfo?.recipientName}</div>
              <div><strong>ලිපිනය:</strong> ${order.deliveryInfo?.address}</div>
              <div><strong>දිස්ත්‍රික්කය:</strong> ${order.deliveryInfo?.district}</div>
              <div><strong>දුරකථන:</strong> ${order.deliveryInfo?.contactNumber}</div>
            </div>
            ` : ''}

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
                <span>මුළු මුදල:</span>
                <span>Rs. ${order.totalAmount.toLocaleString()}</span>
              </div>
            </div>

            <div class="section">
              <h3>ගෙවීම් තොරතුරු</h3>
              <div><strong>ගෙවීම් ක්‍රමය:</strong> ${order.paymentMethod === 'bank_transfer' ? 'බැංකු මාරුව' : 'ලබා ගන්නා විට ගෙවීම'}</div>
              <div><strong>ගෙන්වා දීමේ ක්‍රමය:</strong> ${order.deliveryType === 'delivery' ? 'ගෙන්වා දීම' : 'ලබා ගැනීම'}</div>
              ${order.paidInPerson ? '<div style="color: #28a745; font-weight: bold;">✓ පුද්ගලිකව ගෙවන ලදි</div>' : ''}
            </div>
          </div>

          <div class="footer">
            <p>ස්තූතියි! AYANNA KIYANNA සමඟ ව්‍යාපාර කිරීම සඳහා.</p>
            <p style="font-size: 0.9em; margin-top: 10px;">
              මෙම රිසිට්පත ${new Date().toLocaleDateString('si-LK')} දින ජනනය කරන ලදි.
            </p>
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('si-LK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && orders.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <Typography
          variant="h5"
          component="h1"
          gutterBottom
          sx={{
            fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
            fontWeight: 'bold',
            mb: 4
          }}
        >
          📦 මගේ ඇණවුම් (My Orders):
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Status Tabs */}
        <Paper elevation={3} sx={{ mb: 4 }}>
          <Tabs
            value={selectedTab}
            onChange={(e, newValue) => {
              setSelectedTab(newValue);
              setCurrentPage(1);
            }}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            {statusLabels.map((label, index) => (
              <Tab
                key={index}
                label={label}
                sx={{ fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif' }}
              />
            ))}
          </Tabs>
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
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              ඔබ තවම කිසිදු ඇණවුමක් කර නැත
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/books-products')}
              sx={{
                background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                px: 4,
                py: 1.5,
                '&:hover': {
                  background: 'linear-gradient(45deg, #FF5252, #26C6DA)',
                }
              }}
            >
              නිෂ්පාදන බලන්න
            </Button>
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
                              ඇණවුම් අංකය: {order.orderId}
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

                      {/* Order Items */}
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                          ඇණවුම් අයිතම ({order.totalItems})
                        </Typography>
                        <List dense sx={{ maxHeight: 150, overflow: 'auto' }}>
                          {order.items.slice(0, 3).map((item) => (
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
                                secondary={`ප්‍රමාණය: ${item.quantity} × Rs. ${item.priceAtTime.toLocaleString()}`}
                                primaryTypographyProps={{ fontSize: '0.9rem' }}
                                secondaryTypographyProps={{ fontSize: '0.8rem' }}
                              />
                            </ListItem>
                          ))}
                          {order.items.length > 3 && (
                            <ListItem sx={{ px: 0 }}>
                              <ListItemText
                                primary={`සහ තවත් ${order.items.length - 3} අයිතම...`}
                                primaryTypographyProps={{ fontSize: '0.9rem', color: 'text.secondary' }}
                              />
                            </ListItem>
                          )}
                        </List>
                      </Grid>

                      {/* Order Details */}
                      <Grid item xs={12} md={6}>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                            ඇණවුම් විස්තර
                          </Typography>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            {order.deliveryType === 'pickup' ? <PickupIcon sx={{ mr: 1, fontSize: 20 }} /> : <DeliveryIcon sx={{ mr: 1, fontSize: 20 }} />}
                            <Typography variant="body2">
                              {order.deliveryType === 'pickup' ? 'ආයතනයෙන් ලබා ගැනීම' : 'ගෙන්වා දීම'}
                            </Typography>
                          </Box>
                          
                          {order.deliveryType === 'delivery' && (
                            <Box sx={{ mb: 1 }}>
                              <Typography variant="body2" color="text.secondary">
                                {order.deliveryInfo?.district}
                              </Typography>
                              <Chip
                                label={getDeliveryStatusLabel(order.deliveryStatus)}
                                size="small"
                                color={order.deliveryStatus === 'delivered' ? 'success' : 'default'}
                                sx={{ mt: 0.5 }}
                              />
                            </Box>
                          )}
                          
                          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main', mt: 2 }}>
                            Rs. {order.totalAmount.toLocaleString()}
                          </Typography>
                          
                          {order.adminNote && (
                            <Alert severity="info" sx={{ mt: 2, fontSize: '0.8rem' }}>
                              <Typography variant="body2">
                                <strong>පරිපාලක සටහන:</strong> {order.adminNote}
                              </Typography>
                            </Alert>
                          )}
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
                            විස්තර බලන්න
                          </Button>
                          
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<DownloadIcon />}
                            onClick={() => handleDownloadReceipt(order.orderId)}
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
              {/* Order Status */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                {getStatusIcon(selectedOrder.status)}
                <Chip
                  label={getStatusLabel(selectedOrder.status)}
                  color={getStatusColor(selectedOrder.status)}
                  sx={{ ml: 1 }}
                />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                  {formatDate(selectedOrder.createdAt)}
                </Typography>
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

              {/* Payment Summary */}
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                ගෙවීම් සාරාංශය
              </Typography>
              <Box>
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
            startIcon={<DownloadIcon />}
            onClick={() => handleDownloadReceipt(selectedOrder?.orderId)}
          >
            රිසිට්පත බාගන්න
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default OrdersPage;
