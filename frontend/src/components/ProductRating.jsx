import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
  Avatar,
  Divider,
  Alert,
  CircularProgress,
  Pagination,
  Chip
} from '@mui/material';
import {
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';

const ProductRating = ({ productId }) => {
  const [ratings, setRatings] = useState([]);
  const [userRating, setUserRating] = useState(null);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Rating form states
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [newReview, setNewReview] = useState('');

  const userEmail = localStorage.getItem('userEmail');
  const token = localStorage.getItem('token');
  const isAuthenticated = userEmail && token;

  useEffect(() => {
    if (productId) {
      fetchRatings();
      if (isAuthenticated) {
        fetchUserRating();
      }
    }
  }, [productId, currentPage]);

  const fetchRatings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/ratings/${productId}?page=${currentPage}&limit=5`
      );
      
      setRatings(response.data.ratings);
      setAverageRating(response.data.averageRating);
      setTotalRatings(response.data.totalRatings);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error('Error fetching ratings:', err);
      setError('Error loading ratings');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRating = async () => {
    try {
      const response = await axios.get(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/ratings/${productId}/user`,
        { headers: { 'x-auth-token': token } }
      );
      setUserRating(response.data.userRating);
    } catch (err) {
      console.error('Error fetching user rating:', err);
    }
  };

  const handleSubmitRating = async () => {
    if (!newRating) {
      setError('Please select a rating');
      return;
    }

    try {
      setSubmitting(true);
      await axios.post(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/ratings/${productId}`,
        {
          rating: newRating,
          review: newReview
        },
        { headers: { 'x-auth-token': token } }
      );

      setSuccess(userRating ? 'Rating updated successfully!' : 'Rating added successfully!');
      setShowRatingDialog(false);
      setNewRating(0);
      setNewReview('');
      fetchRatings();
      fetchUserRating();
    } catch (err) {
      console.error('Error submitting rating:', err);
      setError(err.response?.data?.message || 'Error submitting rating');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRating = async () => {
    try {
      setSubmitting(true);
      await axios.delete(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/ratings/${productId}`,
        { headers: { 'x-auth-token': token } }
      );

      setSuccess('Rating deleted successfully!');
      setUserRating(null);
      fetchRatings();
    } catch (err) {
      console.error('Error deleting rating:', err);
      setError('Error deleting rating');
    } finally {
      setSubmitting(false);
    }
  };

  const openRatingDialog = () => {
    if (userRating) {
      setNewRating(userRating.rating);
      setNewReview(userRating.review || '');
    } else {
      setNewRating(0);
      setNewReview('');
    }
    setShowRatingDialog(true);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <StarIcon key={i} sx={{ color: '#FFD700', fontSize: '1.2rem' }} />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <StarIcon key={i} sx={{ color: '#FFD700', fontSize: '1.2rem', opacity: 0.5 }} />
        );
      } else {
        stars.push(
          <StarBorderIcon key={i} sx={{ color: '#FFD700', fontSize: '1.2rem' }} />
        );
      }
    }
    return stars;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('si-LK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: 2 }}>
      <Typography 
        variant="h5" 
        gutterBottom 
        sx={{ 
          fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
          fontWeight: 'bold',
          mb: 3
        }}
      >
        ⭐ නිෂ්පාදන ඇගයීම් සහ සමාලෝචන
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Rating Summary */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            {averageRating.toFixed(1)}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
            {renderStars(averageRating)}
          </Box>
          <Typography variant="body2" color="text.secondary">
            {totalRatings} ඇගයීම්
          </Typography>
        </Box>

        <Divider orientation="vertical" flexItem />

        <Box sx={{ flexGrow: 1 }}>
          {isAuthenticated ? (
            <Box>
              {userRating ? (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    ඔබේ ඇගයීම
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box sx={{ display: 'flex' }}>
                      {renderStars(userRating.rating)}
                    </Box>
                    <Typography variant="body1">
                      {userRating.rating}/5
                    </Typography>
                  </Box>
                  {userRating.review && (
                    <Typography variant="body2" sx={{ mb: 2, fontStyle: 'italic' }}>
                      "{userRating.review}"
                    </Typography>
                  )}
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={openRatingDialog}
                    >
                      සංස්කරණය
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<DeleteIcon />}
                      onClick={handleDeleteRating}
                      disabled={submitting}
                    >
                      මකන්න
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    මෙම නිෂ්පාදනය ඇගයීමට ලක් කරන්න
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={openRatingDialog}
                    sx={{
                      background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #FF5252, #26C6DA)',
                      }
                    }}
                  >
                    ඇගයීමක් ලබා දෙන්න
                  </Button>
                </Box>
              )}
            </Box>
          ) : (
            <Alert severity="info">
              නිෂ්පාදනය ඇගයීමට ලක් කිරීම සඳහා කරුණාකර ප්‍රවේශ වන්න
            </Alert>
          )}
        </Box>
      </Box>

      <Divider sx={{ mb: 4 }} />

      {/* Ratings List */}
      <Typography variant="h6" gutterBottom sx={{ fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif' }}>
        සියලුම ඇගයීම්
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : ratings.length === 0 ? (
        <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
          තවම ඇගයීම් නොමැත
        </Typography>
      ) : (
        <>
          {ratings.map((rating, index) => (
            <motion.div
              key={rating._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Box sx={{ mb: 3, p: 3, border: 1, borderColor: 'divider', borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    {rating.user?.fullName?.charAt(0) || 'U'}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {rating.user?.fullName || 'Anonymous'}
                      </Typography>
                      <Box sx={{ display: 'flex' }}>
                        {renderStars(rating.rating)}
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(rating.createdAt)}
                      </Typography>
                    </Box>
                    {rating.review && (
                      <Typography variant="body1" sx={{ mt: 1 }}>
                        {rating.review}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Box>
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

      {/* Rating Dialog */}
      <Dialog open={showRatingDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif' }}>
          {userRating ? 'ඇගයීම සංස්කරණය කරන්න' : 'නව ඇගයීමක් ලබා දෙන්න'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ py: 2 }}>
            <Typography variant="h6" gutterBottom>
              ඔබේ ඇගයීම
            </Typography>
            <Rating
              value={newRating}
              onChange={(event, newValue) => setNewRating(newValue)}
              size="large"
              sx={{ mb: 3 }}
            />
            
            <TextField
              fullWidth
              label="සමාලෝචනය (විකල්ප)"
              multiline
              rows={4}
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              placeholder="මෙම නිෂ්පාදනය ගැන ඔබේ අදහස් ලියන්න..."
              sx={{ mt: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowRatingDialog(false)}>
            අවලංගු කරන්න
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmitRating}
            disabled={submitting || !newRating}
            sx={{
              background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
              '&:hover': {
                background: 'linear-gradient(45deg, #FF5252, #26C6DA)',
              }
            }}
          >
            {submitting ? <CircularProgress size={24} /> : (userRating ? 'යාවත්කාලීන කරන්න' : 'ඇගයීම ලබා දෙන්න')}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ProductRating;
