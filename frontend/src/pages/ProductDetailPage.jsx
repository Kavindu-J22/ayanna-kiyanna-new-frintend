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
  Button,
  Chip,
  IconButton,
  Breadcrumbs,
  Link,
  Rating,
  TextField,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  ShoppingCart as ShoppingCartIcon,
  Share as ShareIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import ProductRating from '../components/ProductRating';

const ProductDetailPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    fetchProduct();
    fetchRelatedProducts();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/products/${productId}`
      );
      setProduct(response.data);
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Product not found (සමහර විට මෙම නිශ්පාදනයේ තත්වය "අක්‍රීය" තත්වයට දමා ඇත. කරුනාකර එය මුලින් පරීක්ශා කර "සක්‍රීය" මට්ටමට දමන්න (පරිපාලකට පමණක් අවසර ඇත))');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      const response = await axios.get(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/products/${productId}/related`
      );
      setRelatedProducts(response.data);
    } catch (err) {
      console.error('Error fetching related products:', err);
    }
  };

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      await axios.post(
        'https://ayanna-kiyanna-new-backend.onrender.com/api/cart/add',
        { productId, quantity },
        { headers: { 'x-auth-token': token } }
      );
      
      alert('Product added to cart successfully!');
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert(err.response?.data?.message || 'Error adding product to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const formatPrice = (price, discount = 0) => {
    if (discount > 0) {
      const discountedPrice = price - (price * discount / 100);
      return {
        original: price,
        discounted: discountedPrice,
        savings: price - discountedPrice
      };
    }
    return {
      original: price,
      discounted: price,
      savings: 0
    };
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

  if (error || !product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          {error || 'Product not found'}
        </Alert>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/books-products')}
        >
          Back to Products
        </Button>
      </Container>
    );
  }

  const priceInfo = formatPrice(product.price, product.discount);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link
          component="button"
          variant="body1"
          onClick={() => navigate('/books-products')}
          sx={{
            textDecoration: 'none',
            color: 'primary.main',
            '&:hover': { textDecoration: 'underline' }
          }}
        >
          නිෂ්පාදන
        </Link>
        <Link
          component="button"
          variant="body1"
          onClick={() => navigate(`/books-products?category=${product.category}`)}
          sx={{
            textDecoration: 'none',
            color: 'primary.main',
            '&:hover': { textDecoration: 'underline' }
          }}
        >
          {product.category}
        </Link>
        <Typography color="text.primary">{product.name}</Typography>
      </Breadcrumbs>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
          <Grid container spacing={4}>
            {/* Product Images */}
            <Grid item xs={12} md={6}>
              <Box>
                {/* Main Image */}
                <Card elevation={2} sx={{ mb: 2, borderRadius: 2 }}>
                  <CardMedia
                    component="img"
                    height="400"
                    image={product.images[selectedImageIndex]?.url || '/placeholder-image.jpg'}
                    alt={product.name}
                    sx={{ objectFit: 'cover' }}
                  />
                </Card>

                {/* Thumbnail Images */}
                {product.images.length > 1 && (
                  <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto' }}>
                    {product.images.map((image, index) => (
                      <Card
                        key={index}
                        elevation={selectedImageIndex === index ? 4 : 1}
                        sx={{
                          minWidth: 80,
                          cursor: 'pointer',
                          border: selectedImageIndex === index ? 2 : 0,
                          borderColor: 'primary.main',
                          borderRadius: 1
                        }}
                        onClick={() => setSelectedImageIndex(index)}
                      >
                        <CardMedia
                          component="img"
                          height="80"
                          image={image.url}
                          alt={`${product.name} ${index + 1}`}
                          sx={{ objectFit: 'cover' }}
                        />
                      </Card>
                    ))}
                  </Box>
                )}
              </Box>
            </Grid>

            {/* Product Details */}
            <Grid item xs={12} md={6}>
              <Box>
                <Typography
                  variant="h5"
                  component="h1"
                  gutterBottom
                  sx={{
                    fontWeight: 'bold',
                    fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
                    lineHeight: 1.3
                  }}
                >
                  {product.name}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Chip label={product.category} color="primary" />
                  {product.availableQuantity > 0 ? (
                    <Chip label="තොගයේ ඇත" color="success" />
                  ) : (
                    <Chip label="තොගයේ නැත" color="error" />
                  )}
                </Box>

                {product.publisherAuthor && (
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                    {product.publisherAuthor}
                  </Typography>
                )}

                {product.part && (
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    <strong>කොටස:</strong> {product.part}
                  </Typography>
                )}

                {/* Price */}
                <Box sx={{ mb: 3 }}>
                  {product.discount > 0 ? (
                    <Box>
                      <Typography
                        variant="h4"
                        sx={{ color: 'error.main', fontWeight: 'bold', mb: 1 }}
                      >
                        Rs. {priceInfo.discounted.toLocaleString()}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography
                          variant="h6"
                          sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
                        >
                          Rs. {priceInfo.original.toLocaleString()}
                        </Typography>
                        <Chip
                          label={`${product.discount}% වට්ටම`}
                          color="error"
                          sx={{ fontWeight: 'bold' }}
                        />
                      </Box>
                      <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                        ඔබ Rs. {priceInfo.savings.toLocaleString()} ක් ඉතිරි කරගන්න!
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                      Rs. {product.price.toLocaleString()}
                    </Typography>
                  )}
                </Box>

                {/* Description */}
                {product.description && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      විස්තරය
                    </Typography>
                    <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                      {product.description}
                    </Typography>
                  </Box>
                )}

                {/* Quantity and Add to Cart */}
                {product.availableQuantity > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      ප්‍රමාණය
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <IconButton
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                      >
                        <RemoveIcon />
                      </IconButton>
                      <TextField
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, Math.min(product.availableQuantity, parseInt(e.target.value) || 1)))}
                        inputProps={{ min: 1, max: product.availableQuantity }}
                        sx={{ width: 80 }}
                      />
                      <IconButton
                        onClick={() => setQuantity(Math.min(product.availableQuantity, quantity + 1))}
                        disabled={quantity >= product.availableQuantity}
                      >
                        <AddIcon />
                      </IconButton>
                      <Typography variant="body2" color="text.secondary">
                        (උපරිම: {product.availableQuantity})
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                      <Button
                        variant="contained"
                        size="large"
                        startIcon={<ShoppingCartIcon />}
                        onClick={handleAddToCart}
                        disabled={addingToCart}
                        sx={{
                          background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                          px: 4,
                          py: 1.5,
                          '&:hover': {
                            background: 'linear-gradient(45deg, #FF5252, #26C6DA)',
                          }
                        }}
                      >
                        {addingToCart ? 'Adding...' : 'කරත්තයට එක් කරන්න'}
                      </Button>

                      <IconButton
                        size="large"
                        onClick={handleShare}
                        sx={{
                          border: 1,
                          borderColor: 'primary.main',
                          '&:hover': { backgroundColor: 'primary.light' }
                        }}
                      >
                        <ShareIcon />
                      </IconButton>
                    </Box>
                  </Box>
                )}

                <Typography variant="body2" color="text.secondary">
                  <strong>තොගයේ ඇති ප්‍රමාණය:</strong> {product.availableQuantity}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Product Rating Component */}
        <ProductRating productId={product._id} />
      </motion.div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <Box sx={{ mt: 6 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
              mb: 3
            }}
          >
            සම්බන්ධිත නිෂ්පාදන
          </Typography>
          
          <Grid container spacing={3}>
            {relatedProducts.map((relatedProduct) => (
              <Grid item xs={12} sm={6} md={3} key={relatedProduct._id}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card
                    elevation={3}
                    sx={{
                      height: '100%',
                      width: '368px',
                      cursor: 'pointer',
                      '&:hover': { boxShadow: 6 }
                    }}
                    onClick={() => navigate(`/product/${relatedProduct._id}`)}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={relatedProduct.images[0]?.url || '/placeholder-image.jpg'}
                      alt={relatedProduct.name}
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardContent>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 'bold',
                          fontSize: '1rem',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          mb: 1
                        }}
                      >
                        {relatedProduct.name}
                      </Typography>
                      <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                        Rs. {relatedProduct.discountedPrice?.toLocaleString() || relatedProduct.price.toLocaleString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
};

export default ProductDetailPage;
