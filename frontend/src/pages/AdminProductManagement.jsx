import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  Pagination,
  Fab,
  Tabs,
  Tab,
  Divider,
  LinearProgress,
  Paper
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Close as CloseIcon,
  Analytics as AnalyticsIcon,
  Inventory as InventoryIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CloudinaryUpload from '../components/CloudinaryUpload';

const AdminProductManagement = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Dialog states
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    part: '',
    publisherAuthor: '',
    price: '',
    discount: '',
    availableQuantity: '',
    images: [],
    isActive: true
  });

  // Search and filter
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Tab state
  const [activeTab, setActiveTab] = useState(0);

  // Analytics states
  const [analyticsData, setAnalyticsData] = useState(null);
  const [inventoryData, setInventoryData] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  const categories = ['Books', 'T-shirts', 'Caps', 'Magazines', 'Others'];
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole'));

  useEffect(() => {
    checkAuthentication();
  }, []);

  useEffect(() => {
    if (userRole === 'admin' || userRole === 'moderator') {
      if (activeTab === 0) {
        fetchProducts();
      } else if (activeTab === 1) {
        fetchAnalytics();
      }
    }
  }, [userRole, currentPage, searchTerm, selectedCategory, sortBy, sortOrder, activeTab]);

  const checkAuthentication = async () => {
    const userEmail = localStorage.getItem('userEmail');
    const token = localStorage.getItem('token');
    let storedRole = localStorage.getItem('userRole');

    if (!userEmail || !token) {
      return;
    }

    // If role is not in localStorage, fetch it from API
    if (!storedRole) {
      try {
        const response = await axios.get('https://ayanna-kiyanna-new-backend.onrender.com/api/auth/me', {
          headers: { 'x-auth-token': token }
        });

        storedRole = response.data.role;
        localStorage.setItem('userRole', storedRole);
        setUserRole(storedRole);
      } catch (err) {
        console.error('Authentication error:', err);
        return;
      }
    } else {
      setUserRole(storedRole);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        page: currentPage,
        limit: 12,
        sortBy,
        sortOrder
      });

      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory !== 'all') params.append('category', selectedCategory);

      const response = await axios.get(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/products?${params}`,
        { headers: { 'x-auth-token': token } }
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

  const fetchAnalytics = async () => {
    try {
      setAnalyticsLoading(true);
      const token = localStorage.getItem('token');
      
      const [analyticsResponse, inventoryResponse] = await Promise.all([
        axios.get('https://ayanna-kiyanna-new-backend.onrender.com/api/analytics/products', {
          headers: { 'x-auth-token': token }
        }),
        axios.get('https://ayanna-kiyanna-new-backend.onrender.com/api/analytics/inventory', {
          headers: { 'x-auth-token': token }
        })
      ]);

      setAnalyticsData(analyticsResponse.data);
      setInventoryData(inventoryResponse.data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('Error loading analytics data');
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      part: '',
      publisherAuthor: '',
      price: '',
      discount: '',
      availableQuantity: '',
      images: [],
      isActive: true
    });
  };

  const handleCreateProduct = async () => {
    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');
      
      await axios.post(
        'https://ayanna-kiyanna-new-backend.onrender.com/api/products',
        formData,
        { headers: { 'x-auth-token': token } }
      );

      setShowCreateDialog(false);
      resetForm();
      fetchProducts();
      setError('');
    } catch (err) {
      console.error('Error creating product:', err);
      setError(err.response?.data?.message || 'Error creating product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditProduct = async () => {
    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');
      
      await axios.put(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/products/${selectedProduct._id}`,
        formData,
        { headers: { 'x-auth-token': token } }
      );

      setShowEditDialog(false);
      setSelectedProduct(null);
      resetForm();
      fetchProducts();
      setError('');
    } catch (err) {
      console.error('Error updating product:', err);
      setError(err.response?.data?.message || 'Error updating product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async () => {
    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');
      
      await axios.delete(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/products/${selectedProduct._id}`,
        { headers: { 'x-auth-token': token } }
      );

      setShowDeleteDialog(false);
      setSelectedProduct(null);
      fetchProducts();
      setError('');
    } catch (err) {
      console.error('Error deleting product:', err);
      setError(err.response?.data?.message || 'Error deleting product');
    } finally {
      setSubmitting(false);
    }
  };

  const openEditDialog = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      category: product.category,
      part: product.part || '',
      publisherAuthor: product.publisherAuthor || '',
      price: product.price,
      discount: product.discount || 0,
      availableQuantity: product.availableQuantity,
      images: product.images || [],
      isActive: product.isActive
    });
    setShowEditDialog(true);
  };

  const openDeleteDialog = (product) => {
    setSelectedProduct(product);
    setShowDeleteDialog(true);
  };

  const handleViewMore = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (userRole !== 'admin' && userRole !== 'moderator') {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">
          Access denied. Admin privileges required.
        </Alert>
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
            නිෂ්පාදන කළමනාකරණය
          </Typography>

          {activeTab === 0 && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setShowCreateDialog(true)}
              sx={{
                background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #FF5252, #26C6DA)',
                }
              }}
            >
              නව නිෂ්පාදනයක්
            </Button>
          )}
        </Box>

        {/* Tabs */}
        <Paper elevation={3} sx={{ mb: 4, borderRadius: 2 }}>
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            sx={{
              '& .MuiTab-root': {
                fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                minHeight: 60
              }
            }}
          >
            <Tab
              icon={<ViewIcon />}
              label="නිෂ්පාදන කළමනාකරණය"
              iconPosition="start"
            />
            <Tab
              icon={<AnalyticsIcon />}
              label="විශ්ලේෂණ සහ ඉන්වෙන්ටරි"
              iconPosition="start"
            />
          </Tabs>
        </Paper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Tab Content */}
        {activeTab === 0 && (
          <>
            {/* Search and Filter Section */}
            <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="නිෂ්පාදන සොයන්න"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    slotProps={{
                      input: {
                        startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      }
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
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

                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>අනුපිළිවෙල</InputLabel>
                    <Select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      label="අනුපිළිවෙල"
                    >
                      <MenuItem value="createdAt">නිර්මාණ දිනය</MenuItem>
                      <MenuItem value="name">නම</MenuItem>
                      <MenuItem value="price">මිල</MenuItem>
                      <MenuItem value="availableQuantity">තොගය</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={2}>
                  <FormControl fullWidth>
                    <InputLabel>ක්‍රමය</InputLabel>
                    <Select
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                      label="ක්‍රමය"
                    >
                      <MenuItem value="desc">අවරෝහණ</MenuItem>
                      <MenuItem value="asc">ආරෝහණ</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Paper>

            {/* Products Grid */}
            {loading ? (
              <Box display="flex" justifyContent="center" my={4}>
                <CircularProgress size={60} />
              </Box>
            ) : (
              <>
                <Grid container spacing={3}>
                  {products.map((product) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card
                          elevation={4}
                          sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            borderRadius: 2,
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: 8
                            },
                            transition: 'all 0.3s ease'
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
                                fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
                                fontWeight: 'bold',
                                fontSize: '1rem',
                                lineHeight: 1.2,
                                height: '2.4em',
                                overflow: 'hidden',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical'
                              }}
                            >
                              {product.name}
                            </Typography>

                            <Box sx={{ mb: 2 }}>
                              <Chip
                                label={product.category}
                                size="small"
                                color="primary"
                                sx={{ mr: 1, mb: 1 }}
                              />
                              <Chip
                                label={product.isActive ? 'සක්‍රිය' : 'අක්‍රිය'}
                                size="small"
                                color={product.isActive ? 'success' : 'error'}
                                sx={{ mb: 1 }}
                              />
                            </Box>

                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
                              Rs. {product.price.toLocaleString()}
                              {product.discount > 0 && (
                                <Chip
                                  label={`${product.discount}% OFF`}
                                  size="small"
                                  color="error"
                                  sx={{ ml: 1 }}
                                />
                              )}
                            </Typography>

                            <Typography variant="body2" color="text.secondary">
                              තොගයේ ඇත: {product.availableQuantity}
                            </Typography>
                          </CardContent>

                          <CardActions sx={{ p: 2, pt: 0 }}>
                            <Button
                            size="small"
                            variant="outlined"
                            startIcon={<ViewIcon />}
                            onClick={() => handleViewMore(product._id)}
                            sx={{ mr: 1 }}
                            >
                            බලන්න
                            </Button>
                            <Button
                              size="small"
                              startIcon={<EditIcon />}
                              onClick={() => openEditDialog(product)}
                              sx={{ mr: 1 }}
                            >
                              සංස්කරණය
                            </Button>
                            <Button
                              size="small"
                              color="error"
                              startIcon={<DeleteIcon />}
                              onClick={() => openDeleteDialog(product)}
                            >
                              මකන්න
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
                      onChange={(_, value) => setCurrentPage(value)}
                      color="primary"
                      size="large"
                    />
                  </Box>
                )}
              </>
            )}
          </>
        )}

        {/* Analytics Tab */}
        {activeTab === 1 && (
          <>
            {analyticsLoading ? (
              <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                <CircularProgress size={60} />
              </Box>
            ) : (
              <>
                {/* Overview Cards */}
                {analyticsData && (
                  <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={3}>
                      <Card elevation={4} sx={{ p: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box>
                            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                              Rs. {analyticsData.overview.totalIncome.toLocaleString()}
                            </Typography>
                            <Typography variant="body1">
                              නිශ්පාදන වලින් ලද මුළු ආදායම
                            </Typography>
                          </Box>
                          <TrendingUpIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                        </Box>
                      </Card>
                    </Grid>

                    <Grid item xs={12} md={3}>
                      <Card elevation={4} sx={{ p: 3, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box>
                            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                              {analyticsData.overview.totalOrders}
                            </Typography>
                            <Typography variant="body1">
                              මුළු ඇණවුම්
                            </Typography>
                          </Box>
                          <AssessmentIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                        </Box>
                      </Card>
                    </Grid>

                    <Grid item xs={12} md={3}>
                      <Card elevation={4} sx={{ p: 3, background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box>
                            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                              {analyticsData.overview.totalProductsSold}
                            </Typography>
                            <Typography variant="body1">
                              විකුණු නිෂ්පාදන
                            </Typography>
                          </Box>
                          <InventoryIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                        </Box>
                      </Card>
                    </Grid>

                    <Grid item xs={12} md={3}>
                      <Card elevation={4} sx={{ p: 3, background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: 'white' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box>
                            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                              Rs. {Math.round(analyticsData.overview.averageOrderValue).toLocaleString()}
                            </Typography>
                            <Typography variant="body1">
                              සාමාන්‍ය ඇණවුම් වටිනාකම
                            </Typography>
                          </Box>
                          <AnalyticsIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                        </Box>
                      </Card>
                    </Grid>
                  </Grid>
                )}

                {/* Top Products */}
                {analyticsData && analyticsData.topProducts && (
                  <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
                    <Typography variant="h5" gutterBottom sx={{ fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif', fontWeight: 'bold', mb: 3 }}>
                      🏆 ප්‍රමුඛ නිෂ්පාදන (ආදායම අනුව)
                    </Typography>

                    <Grid container spacing={3}>
                      {analyticsData.topProducts.slice(0, 6).map((product, index) => (
                        <Grid item xs={12} md={6} lg={4} key={product.productId}>
                          <Card elevation={2} sx={{ p: 2, borderRadius: 2, '&:hover': { boxShadow: 6 } }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Box
                                sx={{
                                  width: 60,
                                  height: 60,
                                  borderRadius: '50%',
                                  background: `linear-gradient(135deg, ${['#667eea', '#f093fb', '#4facfe', '#fa709a', '#a8edea', '#fed6e3'][index % 6]} 0%, ${['#764ba2', '#f5576c', '#00f2fe', '#fee140', '#d299c2', '#d8a7ca'][index % 6]} 100%)`,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: 'white',
                                  fontWeight: 'bold',
                                  fontSize: '1.2rem'
                                }}
                              >
                                #{index + 1}
                              </Box>
                              <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '0.9rem', lineHeight: 1.2 }}>
                                  {product.productName}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {product.productCategory}
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                                    Total : Rs. {product.totalIncome.toLocaleString()}&nbsp;
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    |&nbsp;{product.quantitySold} ක් විකිණී ඇත
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Paper>
                )}

                {/* Inventory Status */}
                {inventoryData && (
                  <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
                    <Typography variant="h5" gutterBottom sx={{ fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif', fontWeight: 'bold', mb: 3 }}>
                      📦 ඉන්වෙන්ටරි තත්ත්වය
                    </Typography>

                    <Grid container spacing={3} sx={{ mb: 3 }}>
                      <Grid item xs={12} md={4}>
                        <Card elevation={2} sx={{ p: 2, borderLeft: 4, borderColor: 'error.main' }}>
                          <Typography variant="h6" color="error.main" sx={{ fontWeight: 'bold' }}>
                            තොගය අවසන් වූ නිෂ්පාදන ගණන
                          </Typography>
                          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                            {inventoryData.overview.outOfStockCount}
                          </Typography>
                        </Card>
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <Card elevation={2} sx={{ p: 2, borderLeft: 4, borderColor: 'warning.main' }}>
                          <Typography variant="h6" color="warning.main" sx={{ fontWeight: 'bold' }}>
                            තොගය අඩු නිෂ්පාදන ගණන
                          </Typography>
                          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                            {inventoryData.overview.lowStockCount}
                          </Typography>
                        </Card>
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <Card elevation={2} sx={{ p: 2, borderLeft: 4, borderColor: 'success.main' }}>
                          <Typography variant="h6" color="success.main" sx={{ fontWeight: 'bold' }}>
                            තොගය ඇති නිෂ්පාදන ගණන
                          </Typography>
                          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                            {inventoryData.overview.inStockCount}
                          </Typography>
                        </Card>
                      </Grid>
                    </Grid>

                    {/* Low Stock Alert */}
                    {inventoryData.outOfStock && inventoryData.outOfStock.length > 0 && (
                      <Alert severity="warning" sx={{ mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                          ‼️❌ තොගය අවසන් වූ නිෂ්පාදන සදහා අනතුරු ඇඟවීම
                        </Typography>
                        <Typography>
                          නිෂ්පාදන {inventoryData.lowStock.length} ක තොගය අවසන් වී ඇත. කරුණාකර එය කුමක්දැයි පරීක්ශා කර බලා ඉක්මනින් නැවත තොගය පිරවන්න.
                        </Typography>
                      </Alert>
                    )}
                    {inventoryData.lowStock && inventoryData.lowStock.length > 0 && (
                      <Alert severity="warning" sx={{ mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                          ⚠️ තොගය අඩු නිෂ්පාදන සදහා අනතුරු ඇඟවීම
                        </Typography>
                        <Typography>
                          නිෂ්පාදන {inventoryData.lowStock.length} ක තොගය 5ට වඩා අඩුයි. කරුණාකර එය කුමක්දැයි පරීක්ශා කර බලා ඉක්මනින් නැවත තොගය පිරවන්න.
                        </Typography>
                      </Alert>
                    )}
                  </Paper>
                )}
              </>
            )}
          </>
        )}

        {/* Create Product Dialog */}
        <Dialog open={showCreateDialog} maxWidth="md" fullWidth>
          <DialogTitle sx={{ fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif' }}>
            නව නිෂ්පාදනයක් එක් කරන්න
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="නිෂ්පාදන නම *"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>කාණ්ඩය *</InputLabel>
                  <Select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    label="කාණ්ඩය *"
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="විස්තරය"
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="කොටස"
                  value={formData.part}
                  onChange={(e) => setFormData({ ...formData, part: e.target.value })}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="ප්‍රකාශකයා/කතුවරයා"
                  value={formData.publisherAuthor}
                  onChange={(e) => setFormData({ ...formData, publisherAuthor: e.target.value })}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="මිල (Rs) *"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="වට්ටම (%)"
                  type="number"
                  value={formData.discount}
                  onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                  slotProps={{ htmlInput: { min: 0, max: 100 } }}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="තොගයේ ප්‍රමාණය *"
                  type="number"
                  value={formData.availableQuantity}
                  onChange={(e) => setFormData({ ...formData, availableQuantity: e.target.value })}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif' }}>
                  නිෂ්පාදන පින්තූර (උපරිම 5)
                </Typography>
                <CloudinaryUpload
                  onUploadSuccess={(uploadedFiles) => {
                    setFormData({ ...formData, images: uploadedFiles.slice(0, 5) });
                  }}
                  maxFiles={5}
                  acceptedTypes={['image/*']}
                  uploadPreset="ml_default"
                  cloudName="dl9k5qoae"
                />
                {formData.images.length > 0 && (
                  <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {formData.images.map((image, index) => (
                      <Box key={index} sx={{ position: 'relative' }}>
                        <img
                          src={image.url}
                          alt={`Product ${index + 1}`}
                          style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 4 }}
                        />
                        <IconButton
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: -8,
                            right: -8,
                            backgroundColor: 'error.main',
                            color: 'white',
                            '&:hover': { backgroundColor: 'error.dark' }
                          }}
                          onClick={() => {
                            const newImages = formData.images.filter((_, i) => i !== index);
                            setFormData({ ...formData, images: newImages });
                          }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                )}
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              setShowCreateDialog(false);
              resetForm();
            }}>
              අවලංගු කරන්න
            </Button>
            <Button
              variant="contained"
              onClick={handleCreateProduct}
              disabled={submitting || !formData.name || !formData.category || !formData.price || !formData.availableQuantity || formData.images.length === 0}
              sx={{
                background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #FF5252, #26C6DA)',
                }
              }}
            >
              {submitting ? <CircularProgress size={24} /> : 'එක් කරන්න'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Product Dialog */}
        <Dialog open={showEditDialog} maxWidth="md" fullWidth>
          <DialogTitle sx={{ fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif' }}>
            නිෂ්පාදනය සංස්කරණය කරන්න
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="නිෂ්පාදන නම *"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>කාණ්ඩය *</InputLabel>
                  <Select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    label="කාණ්ඩය *"
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="විස්තරය"
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="කොටස"
                  value={formData.part}
                  onChange={(e) => setFormData({ ...formData, part: e.target.value })}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="ප්‍රකාශකයා/කතුවරයා"
                  value={formData.publisherAuthor}
                  onChange={(e) => setFormData({ ...formData, publisherAuthor: e.target.value })}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="මිල (Rs) *"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="වට්ටම (%)"
                  type="number"
                  value={formData.discount}
                  onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                  slotProps={{ htmlInput: { min: 0, max: 100 } }}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="තොගයේ ප්‍රමාණය *"
                  type="number"
                  value={formData.availableQuantity}
                  onChange={(e) => setFormData({ ...formData, availableQuantity: e.target.value })}
                  required
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>තත්ත්වය</InputLabel>
                  <Select
                    value={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.value })}
                    label="තත්ත්වය"
                  >
                    <MenuItem value={true}>සක්‍රිය</MenuItem>
                    <MenuItem value={false}>අක්‍රිය</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif' }}>
                  නිෂ්පාදන පින්තූර (උපරිම 5)
                </Typography>
                <CloudinaryUpload
                  onUploadSuccess={(uploadedFiles) => {
                    setFormData({ ...formData, images: [...formData.images, ...uploadedFiles].slice(0, 5) });
                  }}
                  maxFiles={5 - formData.images.length}
                  acceptedTypes={['image/*']}
                  uploadPreset="ml_default"
                  cloudName="dl9k5qoae"
                />
                {formData.images.length > 0 && (
                  <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {formData.images.map((image, index) => (
                      <Box key={index} sx={{ position: 'relative' }}>
                        <img
                          src={image.url}
                          alt={`Product ${index + 1}`}
                          style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 4 }}
                        />
                        <IconButton
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: -8,
                            right: -8,
                            backgroundColor: 'error.main',
                            color: 'white',
                            '&:hover': { backgroundColor: 'error.dark' }
                          }}
                          onClick={() => {
                            const newImages = formData.images.filter((_, i) => i !== index);
                            setFormData({ ...formData, images: newImages });
                          }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                )}
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              setShowEditDialog(false);
              setSelectedProduct(null);
              resetForm();
            }}>
              අවලංගු කරන්න
            </Button>
            <Button
              variant="contained"
              onClick={handleEditProduct}
              disabled={submitting || !formData.name || !formData.category || !formData.price || !formData.availableQuantity}
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

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteDialog} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif' }}>
            නිෂ්පාදනය මකා දැමීම තහවුරු කරන්න
          </DialogTitle>
          <DialogContent>
            <Typography sx={{ fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif' }}>
              ඔබට "{selectedProduct?.name}" නිෂ්පාදනය මකා දැමීමට අවශ්‍යද? මෙම ක්‍රියාව අහෝසි කළ නොහැක.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              setShowDeleteDialog(false);
              setSelectedProduct(null);
            }}>
              අවලංගු කරන්න
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteProduct}
              disabled={submitting}
            >
              {submitting ? <CircularProgress size={24} /> : 'මකා දමන්න'}
            </Button>
          </DialogActions>
        </Dialog>
      </motion.div>
    </Container>
  );
};

export default AdminProductManagement;
