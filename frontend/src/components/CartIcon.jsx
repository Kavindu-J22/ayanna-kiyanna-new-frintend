import React, { useState, useEffect } from 'react';
import {
  IconButton,
  Badge,
  Drawer,
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Button,
  Divider,
  Card,
  CardContent,
  IconButton as MuiIconButton,
  Alert
} from '@mui/material';
import {
  ShoppingCart as ShoppingCartIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CartIcon = () => {
  const navigate = useNavigate();
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState({ items: [], totalItems: 0, totalAmount: 0 });
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCartCount();
  }, []);

  const fetchCartCount = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get(
        'https://ayanna-kiyanna-new-backend.onrender.com/api/cart/count',
        { headers: { 'x-auth-token': token } }
      );
      setCartCount(response.data.count);
    } catch (err) {
      console.error('Error fetching cart count:', err);
    }
  };

  const fetchCart = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get(
        'https://ayanna-kiyanna-new-backend.onrender.com/api/cart',
        { headers: { 'x-auth-token': token } }
      );
      setCart(response.data);
      setCartCount(response.data.totalItems);
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError('Error loading cart');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    try {
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
    }
  };

  const removeItem = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/cart/remove/${productId}`,
        { headers: { 'x-auth-token': token } }
      );
      fetchCart();
    } catch (err) {
      console.error('Error removing item:', err);
      setError('Error removing item');
    }
  };

  const handleCartOpen = () => {
    setCartOpen(true);
    fetchCart();
  };

  const handleCartClose = () => {
    setCartOpen(false);
    setError('');
  };

  const handlePayNow = () => {
    setCartOpen(false);
    navigate('/payment');
  };

  const formatPrice = (price, discount = 0) => {
    if (discount > 0) {
      const discountedPrice = price - (price * discount / 100);
      return `Rs. ${discountedPrice.toLocaleString()}`;
    }
    return `Rs. ${price.toLocaleString()}`;
  };

  return (
    <>
      <IconButton
        size="large"
        aria-label="shopping cart"
        color="inherit"
        onClick={handleCartOpen}
        sx={{
          '&:hover': {
            backgroundColor: 'rgba(179, 136, 255, 0.1)'
          }
        }}
      >
        <Badge badgeContent={cartCount} color="secondary">
          <ShoppingCartIcon />
        </Badge>
      </IconButton>

      <Drawer
        anchor="right"
        open={cartOpen}
        onClose={handleCartClose}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: 400 },
            maxWidth: '100vw'
          }
        }}
      >
        <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" sx={{ fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif' }}>
              මගේ කරත්තය
            </Typography>
            <MuiIconButton onClick={handleCartClose}>
              <CloseIcon />
            </MuiIconButton>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {/* Cart Items */}
          <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
            {loading ? (
              <Typography sx={{ textAlign: 'center', py: 4 }}>Loading...</Typography>
            ) : cart.items.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <ShoppingCartIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" sx={{ fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif' }}>
                  ඔබේ කරත්තය හිස්ය
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  නිෂ්පාදන එක් කර ගැනීමට පටන් ගන්න
                </Typography>
              </Box>
            ) : (
              <List sx={{ p: 0 }}>
                {cart.items.map((item) => (
                  <ListItem key={item._id} sx={{ px: 0, py: 1 }}>
                    <Card sx={{ width: '100%', mb: 1 }}>
                      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                          <Avatar
                            src={item.product?.images?.[0]?.url}
                            alt={item.product?.name}
                            variant="rounded"
                            sx={{ width: 60, height: 60 }}
                          />
                          
                          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                            <Typography
                              variant="subtitle2"
                              sx={{
                                fontWeight: 'bold',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                mb: 1
                              }}
                            >
                              {item.product?.name}
                            </Typography>
                            
                            <Typography variant="body2" color="primary" sx={{ fontWeight: 'bold', mb: 1 }}>
                              {formatPrice(item.priceAtTime, item.discountAtTime)}
                            </Typography>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <MuiIconButton
                                  size="small"
                                  onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                >
                                  <RemoveIcon fontSize="small" />
                                </MuiIconButton>
                                
                                <Typography variant="body2" sx={{ minWidth: 20, textAlign: 'center' }}>
                                  {item.quantity}
                                </Typography>
                                
                                <MuiIconButton
                                  size="small"
                                  onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                                  disabled={item.quantity >= item.product?.availableQuantity}
                                >
                                  <AddIcon fontSize="small" />
                                </MuiIconButton>
                              </Box>
                              
                              <MuiIconButton
                                size="small"
                                color="error"
                                onClick={() => removeItem(item.product._id)}
                              >
                                <DeleteIcon fontSize="small" />
                              </MuiIconButton>
                            </Box>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </ListItem>
                ))}
              </List>
            )}
          </Box>

          {/* Footer */}
          {cart.items.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">උප එකතුව:</Typography>
                  <Typography variant="body2">Rs. {cart.subtotal?.toLocaleString()}</Typography>
                </Box>
                
                {cart.totalDiscount > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="error">වට්ටම:</Typography>
                    <Typography variant="body2" color="error">
                      -Rs. {cart.totalDiscount?.toLocaleString()}
                    </Typography>
                  </Box>
                )}
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>මුළු එකතුව:</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    Rs. {cart.totalAmount?.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
              
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handlePayNow}
                sx={{
                  background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                  color: 'white',
                  py: 1.5,
                  fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #FF5252, #26C6DA)',
                  }
                }}
              >
                දැන් ගෙවන්න
              </Button>
            </Box>
          )}
        </Box>
      </Drawer>
    </>
  );
};

export default CartIcon;
