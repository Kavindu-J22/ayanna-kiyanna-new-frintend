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
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery
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
  StarBorder as StarBorderIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { styled } from '@mui/material/styles';
import axios from 'axios';

// Styled Components
const ProductsContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: theme.spacing(3),
  maxWidth: '1400px',
  margin: '0 auto',
  padding: theme.spacing(0, 2),
  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: 'repeat(3, 1fr)',
  },
  [theme.breakpoints.up('lg')]: {
    gridTemplateColumns: 'repeat(4, 1fr)',
  },
}));

const StyledProductCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '20px',
  overflow: 'hidden',
  background: 'linear-gradient(145deg, #ffffff 0%, #fef7ff 100%)',
  border: '1px solid rgba(156, 39, 176, 0.1)',
  boxShadow: '0 8px 32px rgba(156, 39, 176, 0.15)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #FF6B6B, #4ECDC4, #45B7D1, #96CEB4)',
    backgroundSize: '300% 300%',
    animation: 'gradientShift 3s ease infinite',
  },
  '&:hover': {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: '0 20px 40px rgba(156, 39, 176, 0.25)',
    '&::before': {
      height: '6px',
    }
  },
  '@keyframes gradientShift': {
    '0%': { backgroundPosition: '0% 50%' },
    '50%': { backgroundPosition: '100% 50%' },
    '100%': { backgroundPosition: '0% 50%' },
  }
}));

const ShowMoreButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 50%, #45B7D1 100%)',
  color: 'white',
  padding: theme.spacing(2, 6),
  borderRadius: '50px',
  fontSize: '1.1rem',
  fontWeight: 'bold',
  fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
  textTransform: 'none',
  boxShadow: '0 8px 25px rgba(255, 107, 107, 0.3)',
  border: 'none',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
    transition: 'left 0.6s',
  },
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 35px rgba(255, 107, 107, 0.4)',
    '&::before': {
      left: '100%',
    }
  },
  '&:active': {
    transform: 'translateY(0px)',
  }
}));

const BooksProductsPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [allProducts, setAllProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
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

  // Show More functionality
  const [itemsToShow, setItemsToShow] = useState(12);
  const [totalProducts, setTotalProducts] = useState(0);
  const [hasMoreItems, setHasMoreItems] = useState(false);

  const categories = ['Books', 'T-shirts', 'Caps', 'Magazines', 'Others'];

  useEffect(() => {
    checkAuthentication();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
    }
  }, [isAuthenticated, searchTerm, selectedCategory, minPrice, maxPrice, sortBy, sortOrder]);

  useEffect(() => {
    // Update displayed products when itemsToShow changes
    if (allProducts.length > 0) {
      const newDisplayedProducts = allProducts.slice(0, itemsToShow);
      setDisplayedProducts(newDisplayedProducts);
      setHasMoreItems(itemsToShow < allProducts.length);
    }
  }, [allProducts, itemsToShow]);

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
      setError('');

      // Reset items to show when filters change
      setItemsToShow(12);

      const params = new URLSearchParams({
        page: 1,
        limit: 1000, // Fetch all products to handle client-side pagination
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

      const fetchedProducts = response.data.products || [];
      setAllProducts(fetchedProducts);
      setTotalProducts(fetchedProducts.length);

      // Set initial displayed products (first 12)
      const initialProducts = fetchedProducts.slice(0, 12);
      setDisplayedProducts(initialProducts);
      setHasMoreItems(fetchedProducts.length > 12);

    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Error loading products');
      setAllProducts([]);
      setDisplayedProducts([]);
      setTotalProducts(0);
    } finally {
      setLoading(false);
    }
  };

  const handleShowMore = () => {
    setLoadingMore(true);

    // Simulate loading delay for better UX
    setTimeout(() => {
      const newItemsToShow = itemsToShow + 12;
      setItemsToShow(newItemsToShow);
      setLoadingMore(false);
    }, 500);
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
            background: 'linear-gradient(135deg, #FF6B6B 0%,rgb(175, 78, 205) 50%, #45B7D1 100%)',
            color: 'white',
            p: { xs: 3, md: 5 },
            mb: 4,
            borderRadius: '25px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.2) 0%, transparent 50%)',
              pointerEvents: 'none'
            }
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
              මගේ ඇණවුම් බලන්න
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Paper
          elevation={6}
          sx={{
            p: { xs: 2, md: 4 },
            mb: 4,
            borderRadius: '20px',
            background: 'linear-gradient(145deg, #ffffff 0%, #fef7ff 100%)',
            border: '1px solid rgba(156, 39, 176, 0.1)',
            boxShadow: '0 10px 30px rgba(156, 39, 176, 0.1)'
          }}
        >
          <Typography
            variant="h6"
            sx={{
              mb: 3,
              textAlign: 'center',
              fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
              background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontWeight: 'bold'
            }}
          >
            නිෂ්පාදන සොයන්න සහ පෙරහන් කරන්න
          </Typography>
          <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="නිෂ්පාදන සොයන්න..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: '#FF6B6B' }} />
              }}
              sx={{
                minWidth: 200,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '15px',
                  '& fieldset': {
                    borderColor: 'rgba(156, 39, 176, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: '#FF6B6B',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#4ECDC4',
                  },
                }
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={2}>
            <FormControl fullWidth sx={{
              minWidth: 200,
              '& .MuiOutlinedInput-root': {
                borderRadius: '15px',
                '& fieldset': {
                  borderColor: 'rgba(156, 39, 176, 0.3)',
                },
                '&:hover fieldset': {
                  borderColor: '#FF6B6B',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#4ECDC4',
                },
              }
            }}>
              <InputLabel sx={{ color: '#FF6B6B' }}>කාණ්ඩය</InputLabel>
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
              sx={{
                minWidth: 200,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '15px',
                  '& fieldset': {
                    borderColor: 'rgba(156, 39, 176, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: '#FF6B6B',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#4ECDC4',
                  },
                }
              }}
            />
          </Grid>

          <Grid item xs={6} md={1.5}>
            <TextField
              fullWidth
              type="number"
              placeholder="උපරිම මිල"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              sx={{
                minWidth: 200,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '15px',
                  '& fieldset': {
                    borderColor: 'rgba(156, 39, 176, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: '#FF6B6B',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#4ECDC4',
                  },
                }
              }}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <FormControl fullWidth sx={{
              minWidth: 200,
              '& .MuiOutlinedInput-root': {
                borderRadius: '15px',
                '& fieldset': {
                  borderColor: 'rgba(156, 39, 176, 0.3)',
                },
                '&:hover fieldset': {
                  borderColor: '#FF6B6B',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#4ECDC4',
                },
              }
            }}>
              <InputLabel sx={{ color: '#FF6B6B' }}>පිළිවෙල</InputLabel>
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
      </motion.div>

      {/* Products Grid */}
      {loading ? (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress
            size={60}
            sx={{
              color: '#FF6B6B',
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round',
              }
            }}
          />
        </Box>
      ) : error ? (
        <Alert
          severity="error"
          sx={{
            mb: 4,
            borderRadius: '15px',
            '& .MuiAlert-icon': {
              color: '#FF6B6B'
            }
          }}
        >
          {error}
        </Alert>
      ) : displayedProducts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 8,
              textAlign: 'center',
              borderRadius: '20px',
              background: 'linear-gradient(145deg, #ffffff 0%, #fef7ff 100%)',
              border: '1px solid rgba(156, 39, 176, 0.1)'
            }}
          >
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif' }}
            >
              කිසිදු නිෂ්පාදනයක් සොයා ගත නොහැකි විය
            </Typography>
          </Paper>
        </motion.div>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography
              variant="h6"
              sx={{
                mb: 4,
                textAlign: 'center',
                fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
                background: 'linear-gradient(45deg, #FF6B6B,rgb(28, 90, 86))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontWeight: 'bold',
                fontSize: '1rem'
              }}
            >
              නිෂ්පාදන {totalProducts}ක් සොයා ගන්නා ලදී
            </Typography>
          </motion.div>

          <ProductsContainer>
            <AnimatePresence>
              {displayedProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, scale: 0.8, y: 50 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -50 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{
                    scale: 1.02,
                    transition: { duration: 0.2 }
                  }}
                >
                  <StyledProductCard elevation={4}>
                    <CardMedia
                      component="img"
                      height="220"
                      image={product.images[0]?.url || '/placeholder-image.jpg'}
                      alt={product.name}
                      sx={{
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.05)'
                        }
                      }}
                    />

                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Typography
                        variant="h6"
                        component="h3"
                        gutterBottom
                        sx={{
                          fontWeight: 'bold',
                          fontSize: '1.2rem',
                          lineHeight: 1.3,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          color: '#2c3e50',
                          mb: 2
                        }}
                      >
                        {product.name}
                      </Typography>

                      <Chip
                        label={product.category}
                        size="small"
                        sx={{
                          mb: 2,
                          background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />

                      {product.publisherAuthor && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mb: 1,
                            fontStyle: 'italic'
                          }}
                        >
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
                          mb: 2,
                          lineHeight: 1.4
                        }}
                      >
                        {product.description}
                      </Typography>

                      <Box sx={{ mb: 2 }}>
                        {formatPrice(product.price, product.discount)}
                      </Box>

                      {/* Rating Display */}
                      {renderStars(product.averageRating || 0, product.totalRatings || 0)}

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mt: 1,
                          fontWeight: 'medium'
                        }}
                      >
                        තොගයේ ඇත: {product.availableQuantity}
                      </Typography>
                    </CardContent>

                    <CardActions sx={{ p: 3, pt: 0, gap: 1 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<VisibilityIcon />}
                        onClick={() => handleViewMore(product._id)}
                        sx={{
                          flex: 1,
                          borderColor: '#FF6B6B',
                          color: '#FF6B6B',
                          '&:hover': {
                            borderColor: '#FF5252',
                            backgroundColor: 'rgba(255, 107, 107, 0.1)'
                          }
                        }}
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
                          flex: 1,
                          background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #FF5252, #26C6DA)',
                          },
                          '&:disabled': {
                            background: '#ccc'
                          }
                        }}
                      >
                        කරත්තයට
                      </Button>
                    </CardActions>
                  </StyledProductCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </ProductsContainer>

          {/* Show More Button */}
          {hasMoreItems && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Box
                display="flex"
                justifyContent="center"
                mt={6}
                mb={4}
              >
                <ShowMoreButton
                  onClick={handleShowMore}
                  disabled={loadingMore}
                  startIcon={loadingMore ? <CircularProgress size={20} color="inherit" /> : <ExpandMoreIcon />}
                  sx={{
                    minWidth: '200px',
                    opacity: loadingMore ? 0.7 : 1
                  }}
                >
                  {loadingMore ? 'Loading...' : 'තවත් නිෂ්පාදන පෙන්වන්න'}
                </ShowMoreButton>
              </Box>
            </motion.div>
          )}

          {/* Products Summary */}
          {!hasMoreItems && displayedProducts.length > 12 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Box
                display="flex"
                justifyContent="center"
                mt={4}
                mb={2}
              >
                <Typography
                  variant="body1"
                  sx={{
                    color: 'text.secondary',
                    fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
                    textAlign: 'center',
                    background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    fontWeight: 'medium'
                  }}
                >
                  සියලුම නිෂ්පාදන පෙන්වා ඇත ({totalProducts} නිෂ්පාදන)
                </Typography>
              </Box>
            </motion.div>
          )}
        </>
      )}
    </Container>
  );
};

export default BooksProductsPage;
