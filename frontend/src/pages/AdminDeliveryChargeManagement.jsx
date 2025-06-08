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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Chip,
  IconButton
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Add as AddIcon,
  LocalShipping as DeliveryIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const AdminDeliveryChargeManagement = () => {
  const navigate = useNavigate();
  const [deliveryCharges, setDeliveryCharges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  // Dialog states
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedCharge, setSelectedCharge] = useState(null);
  const [editForm, setEditForm] = useState({ charge: '' });

  useEffect(() => {
    checkAuthentication();
  }, []);

  useEffect(() => {
    if (userRole === 'admin' || userRole === 'moderator') {
      fetchDeliveryCharges();
    }
  }, [userRole]);

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

  const fetchDeliveryCharges = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        'https://ayanna-kiyanna-new-backend.onrender.com/api/delivery-charges'
      );
      setDeliveryCharges(response.data);
    } catch (err) {
      console.error('Error fetching delivery charges:', err);
      setError('Error loading delivery charges');
    } finally {
      setLoading(false);
    }
  };

  const initializeDeliveryCharges = async () => {
    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');
      
      await axios.post(
        'https://ayanna-kiyanna-new-backend.onrender.com/api/delivery-charges/initialize',
        {},
        { headers: { 'x-auth-token': token } }
      );

      fetchDeliveryCharges();
      alert('Delivery charges initialized successfully!');
    } catch (err) {
      console.error('Error initializing delivery charges:', err);
      setError(err.response?.data?.message || 'Error initializing delivery charges');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditCharge = (charge) => {
    setSelectedCharge(charge);
    setEditForm({ charge: charge.charge.toString() });
    setShowEditDialog(true);
  };

  const handleUpdateCharge = async () => {
    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');
      
      await axios.put(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/delivery-charges/${selectedCharge._id}`,
        { charge: parseFloat(editForm.charge) },
        { headers: { 'x-auth-token': token } }
      );

      setShowEditDialog(false);
      setSelectedCharge(null);
      setEditForm({ charge: '' });
      fetchDeliveryCharges();
      alert('Delivery charge updated successfully!');
    } catch (err) {
      console.error('Error updating delivery charge:', err);
      setError(err.response?.data?.message || 'Error updating delivery charge');
    } finally {
      setSubmitting(false);
    }
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
              fontWeight: 'bold'
            }}
          >
            <DeliveryIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
            ගෙන්වා දීමේ ගාස්තු කළමනාකරණය
          </Typography>
          
          {deliveryCharges.length === 0 && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={initializeDeliveryCharges}
              disabled={submitting}
              sx={{
                background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #FF5252, #26C6DA)',
                }
              }}
            >
              {submitting ? <CircularProgress size={24} /> : 'ගාස්තු ආරම්භ කරන්න'}
            </Button>
          )}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Info Card */}
        <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2, backgroundColor: 'primary.light', color: 'white' }}>
          <Typography variant="h6" gutterBottom sx={{ fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif' }}>
            ගෙන්වා දීමේ ගාස්තු සම්බන්ධයෙන්
          </Typography>
          <Typography variant="body1" sx={{ fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif' }}>
            ශ්‍රී ලංකාවේ සියලුම දිස්ත්‍රික්ක 25 සඳහා ගෙන්වා දීමේ ගාස්තු සකසන්න. 
            පාරිභෝගිකයන් ඇණවුම් කරන විට ඔවුන්ගේ දිස්ත්‍රික්කය අනුව ගාස්තුව ස්වයංක්‍රීයව ගණනය වේ.
          </Typography>
        </Paper>

        {/* Delivery Charges Grid */}
        {deliveryCharges.length === 0 ? (
          <Paper elevation={3} sx={{ p: 8, textAlign: 'center' }}>
            <DeliveryIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 3 }} />
            <Typography
              variant="h5"
              gutterBottom
              sx={{ fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif' }}
            >
              ගෙන්වා දීමේ ගාස්තු සකසා නැත
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              සියලුම දිස්ත්‍රික්ක සඳහා ගාස්තු ආරම්භ කිරීමට ඉහත බොත්තම ක්ලික් කරන්න
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {deliveryCharges.map((charge, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={charge._id}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card
                    elevation={4}
                    sx={{
                      height: '100%',
                      borderRadius: 2,
                      '&:hover': { boxShadow: 8 }
                    }}
                  >
                    <CardContent sx={{ p: 3, textAlign: 'center' }}>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{
                          fontWeight: 'bold',
                          fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
                          mb: 2
                        }}
                      >
                        {charge.district}
                      </Typography>
                      
                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: 'bold',
                          color: 'primary.main',
                          mb: 2
                        }}
                      >
                        Rs. {charge.charge.toLocaleString()}
                      </Typography>
                      
                      <Chip
                        label={charge.isActive ? 'සක්‍රිය' : 'අක්‍රිය'}
                        color={charge.isActive ? 'success' : 'error'}
                        size="small"
                        sx={{ mb: 2 }}
                      />
                      
                      <Box>
                        <IconButton
                          color="primary"
                          onClick={() => handleEditCharge(charge)}
                          sx={{
                            '&:hover': { backgroundColor: 'primary.light' }
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}
      </motion.div>

      {/* Edit Charge Dialog */}
      <Dialog open={showEditDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif' }}>
          {selectedCharge?.district} දිස්ත්‍රික්කයේ ගාස්තුව සංස්කරණය
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="ගෙන්වා දීමේ ගාස්තුව (Rs)"
            type="number"
            value={editForm.charge}
            onChange={(e) => setEditForm({ charge: e.target.value })}
            inputProps={{ min: 0 }}
            sx={{ mt: 2 }}
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            දැනට: Rs. {selectedCharge?.charge.toLocaleString()}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setShowEditDialog(false);
            setSelectedCharge(null);
            setEditForm({ charge: '' });
          }}>
            අවලංගු කරන්න
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleUpdateCharge}
            disabled={submitting || !editForm.charge}
            sx={{
              background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
              '&:hover': {
                background: 'linear-gradient(45deg, #FF5252, #26C6DA)',
              }
            }}
          >
            {submitting ? <CircularProgress size={24} /> : 'සුරකින්න'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminDeliveryChargeManagement;
