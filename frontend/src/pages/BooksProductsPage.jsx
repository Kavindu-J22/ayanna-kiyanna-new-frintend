import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Pagination,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Add as AddIcon,
  ShoppingCart as ShoppingCartIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Receipt as OrdersIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const BooksProductsPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  // Filter and search states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const categories = ['Books', 'T-shirts', 'Caps', 'Magazines', 'Others'];

  useEffect(() => {
    checkAuthentication();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
    }
  }, [isAuthenticated, currentPage, searchTerm, selectedCategory, minPrice, maxPrice, sortBy, sortOrder]);

  const checkAuthentication = async () => {
    const userEmail = localStorage.getItem('userEmail');
    const token = localStorage.getItem('token');

    if (!userEmail || !token) {
      setShowLoginDialog(true);
      setLoading(false);
      return;
    }

    try {
      // Check user role from database
      const response = await axios.get('https://ayanna-kiyanna-new-backend.onrender.com/api/auth/me', {
        headers: { 'x-auth-token': token }
      });

      setUserRole(response.data.role);
      setIsAuthenticated(true);
    } catch (err) {
      console.error('Authentication error:', err);
      setShowLoginDialog(true);
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 12,
        sortBy,
        sortOrder
      });

      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);

      const response = await axios.get(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/products?${params}`
      );

      setProducts(response.data.products);
      setTotalPages(response.data.pagination.totalPages);
      setTotalProducts(response.data.pagination.totalProducts);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Error loading products');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  const handleAddToCart = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'https://ayanna-kiyanna-new-backend.onrender.com/api/cart/add',
        { productId, quantity: 1 },
        { headers: { 'x-auth-token': token } }
      );
      
      // Show success message or update cart count
      alert('Product added to cart successfully!');
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert(err.response?.data?.message || 'Error adding product to cart');
    }
  };

  const handleViewMore = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleCreateProduct = () => {
    navigate('/admin-product-management');
  };

  const formatPrice = (price, discount = 0) => {
    if (discount > 0) {
      const discountedPrice = price - (price * discount / 100);
      return (
        <Box>
          <Typography variant="body2" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
            Rs. {price.toLocaleString()}
          </Typography>
          <Typography variant="h6" sx={{ color: 'error.main', fontWeight: 'bold' }}>
            Rs. {discountedPrice.toLocaleString()}
          </Typography>
          <Chip
            label={`${discount}% OFF`}
            color="error"
            size="small"
            sx={{ mt: 0.5 }}
          />
        </Box>
      );
    }
    return (
      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
        Rs. {price.toLocaleString()}
      </Typography>
    );
  };

  const renderStars = (rating, totalRatings) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <StarIcon key={i} sx={{ color: '#FFD700', fontSize: '1rem' }} />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <StarIcon key={i} sx={{ color: '#FFD700', fontSize: '1rem', opacity: 0.5 }} />
        );
      } else {
        stars.push(
          <StarBorderIcon key={i} sx={{ color: '#FFD700', fontSize: '1rem' }} />
        );
      }
    }

    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
        <Box sx={{ display: 'flex' }}>
          {stars}
        </Box>
        <Typography variant="body2" sx={{ color: 'text.secondary', ml: 0.5 }}>
          {rating > 0 ? `${rating} (${totalRatings})` : 'No ratings'}
        </Typography>
      </Box>
    );
  };

  if (showLoginDialog) {
    return (
      <Dialog open={showLoginDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ 
          textAlign: 'center',
          fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
          background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
          color: 'white'
        }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            අයන්න කියන්න : Books & Products
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" sx={{ 
            mb: 2,
            fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
          }}>
            මෙම පිටුව භාවිතා කිරීමට පළමුව ඔබ ලොගින් වීම හෝ ලියාපදිංචි වීම අවශ්‍ය වේ
          </Typography>
          <Typography variant="body1" sx={{ 
            color: 'text.secondary',
            fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
          }}>
            කරුණාකර පහත බොත්තම ක්ලික් කර ලොගින් පිටුවට යන්න
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button
            variant="contained"
            onClick={handleLoginRedirect}
            sx={{
              background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
              color: 'white',
              px: 4,
              py: 1.5,
              borderRadius: 3,
              fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
              '&:hover': {
                background: 'linear-gradient(45deg, #FF5252, #26C6DA)',
              }
            }}
          >
            ලොගින් වන්න
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Paper
          elevation={8}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            p: 4,
            mb: 4,
            borderRadius: 3,
            textAlign: 'center'
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
              fontWeight: 'bold',
              fontSize: { xs: '2rem', md: '3rem' }
            }}
          >
            අයන්න කියන්න : Books & Products
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
              opacity: 0.9,
              maxWidth: '800px',
              mx: 'auto',
              lineHeight: 1.6,
              mb: 3
            }}
          >
            අයන්න කියන්න ආයතනයේ විශේෂ පොත්, ටී-ෂර්ට්, කැප්, සඟරා සහ වෙනත් නිෂ්පාදන මෙහිදී ලබා ගත හැකිය.
            ගුණාත්මක නිෂ්පාදන සාධාරණ මිලට ඔබේ අතට ගන්න.
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            {/* My Orders Button - Always visible for authenticated users */}
            <Button
              variant="contained"
              startIcon={<OrdersIcon />}
              onClick={() => navigate('/orders')}
              sx={{
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
                px: 3,
                py: 1,
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.3)',
                }
              }}
            >
              මගේ ඇණවුම්
            </Button>

            {/* Admin Product Management Button */}
            {userRole === 'admin' || userRole === 'moderator' ? (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreateProduct}
                sx={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
                  px: 3,
                  py: 1,
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.3)',
                  }
                }}
              >
                නව නිෂ්පාදනයක් එක් කරන්න
              </Button>
            ) : null}
          </Box>
        </Paper>
      </motion.div>

      {/* Search and Filter Section */}
      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="නිෂ්පාදන සොයන්න..."
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
              <InputLabel>කාණ්ඩය</InputLabel>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                label="කාණ්ඩය"
              >
                <MenuItem value="all">සියල්ල</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6} md={1.5}>
            <TextField
              fullWidth
              type="number"
              placeholder="අවම මිල"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              sx={{ minWidth: 200 }}
            />
          </Grid>

          <Grid item xs={6} md={1.5}>
            <TextField
              fullWidth
              type="number"
              placeholder="උපරිම මිල"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              sx={{ minWidth: 200 }}
            />
          </Grid>

          <Grid item xs={12} md={3}>
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
                <MenuItem value="price-asc">මිල අඩුවෙන්</MenuItem>
                <MenuItem value="price-desc">මිල වැඩිවෙන්</MenuItem>
                <MenuItem value="name-asc">නම අකාරාදී</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Products Grid */}
      {loading ? (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress size={60} />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      ) : products.length === 0 ? (
        <Paper elevation={3} sx={{ p: 8, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            කිසිදු නිෂ්පාදනයක් සොයා ගත නොහැකි විය
          </Typography>
        </Paper>
      ) : (
        <>
          <Typography variant="h6" sx={{ mb: 3, fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif' }}>
            නිෂ්පාදන {totalProducts}ක් සොයා ගන්නා ලදී
          </Typography>
          
          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card
                    elevation={4}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 2,
                      overflow: 'hidden',
                      '&:hover': {
                        boxShadow: 8
                      }
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={product.images[0]?.url || '/placeholder-image.jpg'}
                      alt={product.name}
                      sx={{ objectFit: 'cover' }}
                    />
                    
                    <CardContent sx={{ flexGrow: 1, p: 2 }}>
                      <Typography
                        variant="h6"
                        component="h3"
                        gutterBottom
                        sx={{
                          fontWeight: 'bold',
                          fontSize: '1.1rem',
                          lineHeight: 1.3,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {product.name}
                      </Typography>
                      
                      <Chip
                        label={product.category}
                        size="small"
                        color="primary"
                        sx={{ mb: 1 }}
                      />
                      
                      {product.publisherAuthor && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {product.publisherAuthor}
                        </Typography>
                      )}
                      
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          mb: 2
                        }}
                      >
                        {product.description}
                      </Typography>
                      
                      {formatPrice(product.price, product.discount)}

                      {/* Rating Display */}
                      {renderStars(product.averageRating || 0, product.totalRatings || 0)}

                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        තොගයේ ඇත: {product.availableQuantity}
                      </Typography>
                    </CardContent>
                    
                    <CardActions sx={{ p: 2, pt: 0 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<VisibilityIcon />}
                        onClick={() => handleViewMore(product._id)}
                        sx={{ mr: 1 }}
                      >
                        වැඩි විස්තර
                      </Button>
                      
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<ShoppingCartIcon />}
                        onClick={() => handleAddToCart(product._id)}
                        disabled={product.availableQuantity === 0}
                        sx={{
                          background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #FF5252, #26C6DA)',
                          }
                        }}
                      >
                        කරත්තයට
                      </Button>
                    </CardActions>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>

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
    </Container>
  );
};

export default BooksProductsPage;
