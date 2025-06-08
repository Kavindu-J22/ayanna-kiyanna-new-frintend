import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  IconButton,
  TextField,
  Divider,
  Alert,
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  ShoppingCart as ShoppingCartIcon,
  Payment as PaymentIcon,
  ArrowBack as ArrowBackIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const CartPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState({ items: [], totalItems: 0, totalAmount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState({});
  const [showClearDialog, setShowClearDialog] = useState(false);

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    const userEmail = localStorage.getItem('userEmail');
    const token = localStorage.getItem('token');

    if (!userEmail || !token) {
      navigate('/login');
      return;
    }

    fetchCart();
  };

  const fetchCart = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'https://ayanna-kiyanna-new-backend.onrender.com/api/cart',
        { headers: { 'x-auth-token': token } }
      );
      setCart(response.data);
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError('Error loading cart');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      setUpdating({ ...updating, [productId]: true });
      const token = localStorage.getItem('token');
      await axios.put(
        'https://ayanna-kiyanna-new-backend.onrender.com/api/cart/update',
        { productId, quantity: newQuantity },
        { headers: { 'x-auth-token': token } }
      );
      fetchCart();
    } catch (err) {
      console.error('Error updating quantity:', err);
      setError(err.response?.data?.message || 'Error updating quantity');
    } finally {
      setUpdating({ ...updating, [productId]: false });
    }
  };

  const removeItem = async (productId) => {
    try {
      setUpdating({ ...updating, [productId]: true });
      const token = localStorage.getItem('token');
      await axios.delete(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/cart/remove/${productId}`,
        { headers: { 'x-auth-token': token } }
      );
      fetchCart();
    } catch (err) {
      console.error('Error removing item:', err);
      setError('Error removing item');
    } finally {
      setUpdating({ ...updating, [productId]: false });
    }
  };

  const clearCart = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        'https://ayanna-kiyanna-new-backend.onrender.com/api/cart/clear',
        { headers: { 'x-auth-token': token } }
      );
      setCart({ items: [], totalItems: 0, totalAmount: 0 });
      setShowClearDialog(false);
    } catch (err) {
      console.error('Error clearing cart:', err);
      setError('Error clearing cart');
    }
  };

  const handleProceedToPayment = () => {
    navigate('/payment');
  };

  const formatPrice = (price, discount = 0) => {
    if (discount > 0) {
      const discountedPrice = price - (price * discount / 100);
      return `Rs. ${discountedPrice.toLocaleString()}`;
    }
    return `Rs. ${price.toLocaleString()}`;
  };

  if (loading) {
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
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <IconButton
            onClick={() => navigate('/books-products')}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
              fontWeight: 'bold',
              flexGrow: 1
            }}
          >
            මගේ කරත්තය
          </Typography>
          {cart.items.length > 0 && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<ClearIcon />}
              onClick={() => setShowClearDialog(true)}
            >
              කරත්තය හිස් කරන්න
            </Button>
          )}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {cart.items.length === 0 ? (
          <Paper elevation={3} sx={{ p: 8, textAlign: 'center' }}>
            <ShoppingCartIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 3 }} />
            <Typography
              variant="h5"
              gutterBottom
              sx={{ fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif' }}
            >
              ඔබේ කරත්තය හිස්ය
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              නිෂ්පාදන එක් කර ගැනීමට පටන් ගන්න
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
          <Grid container spacing={4}>
            {/* Cart Items */}
            <Grid item xs={12} md={8}>
              <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif', mb: 3 }}
                >
                  කරත්තයේ අයිතම ({cart.totalItems})
                </Typography>

                {cart.items.map((item, index) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card
                      elevation={2}
                      sx={{
                        mb: 3,
                        borderRadius: 2,
                        '&:hover': { boxShadow: 4 }
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Grid container spacing={3} alignItems="center">
                          {/* Product Image */}
                          <Grid item xs={12} sm={3}>
                            <CardMedia
                              component="img"
                              height="120"
                              image={item.product?.images?.[0]?.url || '/placeholder-image.jpg'}
                              alt={item.product?.name}
                              sx={{
                                objectFit: 'cover',
                                borderRadius: 1,
                                cursor: 'pointer'
                              }}
                              onClick={() => navigate(`/product/${item.product._id}`)}
                            />
                          </Grid>

                          {/* Product Details */}
                          <Grid item xs={12} sm={5}>
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: 'bold',
                                mb: 1,
                                cursor: 'pointer',
                                '&:hover': { color: 'primary.main' }
                              }}
                              onClick={() => navigate(`/product/${item.product._id}`)}
                            >
                              {item.product?.name}
                            </Typography>

                            <Chip
                              label={item.product?.category}
                              size="small"
                              color="primary"
                              sx={{ mb: 1 }}
                            />

                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                              {item.product?.description?.substring(0, 100)}...
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                                {formatPrice(item.priceAtTime, item.discountAtTime)}
                              </Typography>
                              
                              {item.discountAtTime > 0 && (
                                <Typography
                                  variant="body2"
                                  sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
                                >
                                  Rs. {item.priceAtTime.toLocaleString()}
                                </Typography>
                              )}
                            </Box>

                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                              තොගයේ ඇත: {item.product?.availableQuantity}
                            </Typography>
                          </Grid>

                          {/* Quantity Controls */}
                          <Grid item xs={12} sm={2}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                ප්‍රමාණය
                              </Typography>
                              
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <IconButton
                                  size="small"
                                  onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                                  disabled={item.quantity <= 1 || updating[item.product._id]}
                                >
                                  <RemoveIcon />
                                </IconButton>
                                
                                <TextField
                                  type="number"
                                  value={item.quantity}
                                  onChange={(e) => {
                                    const newQuantity = parseInt(e.target.value) || 1;
                                    if (newQuantity >= 1 && newQuantity <= item.product?.availableQuantity) {
                                      updateQuantity(item.product._id, newQuantity);
                                    }
                                  }}
                                  inputProps={{
                                    min: 1,
                                    max: item.product?.availableQuantity,
                                    style: { textAlign: 'center' }
                                  }}
                                  sx={{ width: 60 }}
                                  size="small"
                                />
                                
                                <IconButton
                                  size="small"
                                  onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                                  disabled={item.quantity >= item.product?.availableQuantity || updating[item.product._id]}
                                >
                                  <AddIcon />
                                </IconButton>
                              </Box>
                            </Box>
                          </Grid>

                          {/* Item Total & Remove */}
                          <Grid item xs={12} sm={2}>
                            <Box sx={{ textAlign: 'center' }}>
                              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                                Rs. {item.itemTotal?.toLocaleString()}
                              </Typography>
                              
                              <IconButton
                                color="error"
                                onClick={() => removeItem(item.product._id)}
                                disabled={updating[item.product._id]}
                                sx={{
                                  '&:hover': { backgroundColor: 'error.light' }
                                }}
                              >
                                {updating[item.product._id] ? (
                                  <CircularProgress size={24} />
                                ) : (
                                  <DeleteIcon />
                                )}
                              </IconButton>
                            </Box>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </Paper>
            </Grid>

            {/* Order Summary */}
            <Grid item xs={12} md={4}>
              <Paper
                elevation={4}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  position: 'sticky',
                  top: 20,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white'
                }}
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif', fontWeight: 'bold' }}
                >
                  ඇණවුම් සාරාංශය
                </Typography>

                <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.3)' }} />

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>අයිතම ({cart.totalItems}):</Typography>
                    <Typography>Rs. {cart.subtotal?.toLocaleString()}</Typography>
                  </Box>

                  {cart.totalDiscount > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography>වට්ටම:</Typography>
                      <Typography sx={{ color: '#4CAF50' }}>
                        -Rs. {cart.totalDiscount?.toLocaleString()}
                      </Typography>
                    </Box>
                  )}

                  <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.3)' }} />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      මුළු එකතුව:
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      Rs. {cart.totalAmount?.toLocaleString()}
                    </Typography>
                  </Box>
                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={<PaymentIcon />}
                  onClick={handleProceedToPayment}
                  sx={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: 'white',
                    py: 1.5,
                    fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.3)',
                    }
                  }}
                >
                  ගෙවීමට යන්න
                </Button>

                <Typography
                  variant="body2"
                  sx={{
                    mt: 2,
                    textAlign: 'center',
                    opacity: 0.8,
                    fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
                  }}
                >
                  ගෙන්වා දීමේ ගාස්තුව ගෙවීම් පිටුවේදී ගණනය කරනු ලැබේ
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        )}
      </motion.div>

      {/* Clear Cart Confirmation Dialog */}
      <Dialog open={showClearDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif' }}>
          කරත්තය හිස් කිරීම තහවුරු කරන්න
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif' }}>
            ඔබට සියලුම අයිතම කරත්තයෙන් ඉවත් කිරීමට අවශ්‍යද? මෙම ක්‍රියාව අහෝසි කළ නොහැක.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowClearDialog(false)}>
            අවලංගු කරන්න
          </Button>
          <Button
            onClick={clearCart}
            color="error"
            variant="contained"
          >
            හිස් කරන්න
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CartPage;
