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
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  List,
  ListItem,
  ListItemText,
  Chip
} from '@mui/material';
import {
  LocalShipping as DeliveryIcon,
  Store as PickupIcon,
  Payment as PaymentIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import CloudinaryUpload from '../components/CloudinaryUpload';

const PaymentPage = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [userRole, setUserRole] = useState('');
  
  // Delivery options
  const [deliveryType, setDeliveryType] = useState('');
  const [deliveryInfo, setDeliveryInfo] = useState({
    recipientName: '',
    contactNumber: '',
    address: '',
    district: ''
  });
  const [districts, setDistricts] = useState([]);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  
  // Payment options
  const [paymentReceipts, setPaymentReceipts] = useState([]);
  const [paidInPerson, setPaidInPerson] = useState(false);

  // Admin cash payment fields
  const [adminPaymentInfo, setAdminPaymentInfo] = useState({
    recipientName: '',
    contactNumber: '',
    adminNote: ''
  });

  // Success dialog
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  const steps = ['ලබා ගැනීමේ ක්‍රමය', 'ගෙවීම් විස්තර', 'තහවුරු කිරීම'];

  useEffect(() => {
    fetchCart();
    fetchDistricts();
  }, []);

  useEffect(() => {
    if (deliveryType === 'delivery' && deliveryInfo.district) {
      fetchDeliveryCharge();
    } else {
      setDeliveryCharge(0);
    }
  }, [deliveryInfo.district]);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // Check user role
      const userResponse = await axios.get('https://ayanna-kiyanna-new-backend.onrender.com/api/auth/me', {
        headers: { 'x-auth-token': token }
      });
      setUserRole(userResponse.data.role);

      const response = await axios.get(
        'https://ayanna-kiyanna-new-backend.onrender.com/api/cart',
        { headers: { 'x-auth-token': token } }
      );

      if (response.data.items.length === 0) {
        navigate('/books-products');
        return;
      }

      setCart(response.data);
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError('Error loading cart');
    } finally {
      setLoading(false);
    }
  };

  const fetchDistricts = async () => {
    try {
      const response = await axios.get(
        'https://ayanna-kiyanna-new-backend.onrender.com/api/delivery-charges/districts'
      );
      setDistricts(response.data);
    } catch (err) {
      console.error('Error fetching districts:', err);
    }
  };

  const fetchDeliveryCharge = async () => {
    try {
      const response = await axios.get(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/delivery-charges/district/${deliveryInfo.district}`
      );
      setDeliveryCharge(response.data.charge);
    } catch (err) {
      console.error('Error fetching delivery charge:', err);
      setDeliveryCharge(0);
    }
  };

  const handleNext = () => {
    if (activeStep === 0) {
      if (!deliveryType) {
        setError('කරුණාකර ලබා ගැනීමේ ක්‍රමයක් තෝරන්න');
        return;
      }
      if (deliveryType === 'delivery') {
        if (!deliveryInfo.recipientName || !deliveryInfo.contactNumber || !deliveryInfo.address || !deliveryInfo.district) {
          setError('කරුණාකර සියලුම ක්ෂේත්‍ර පුරවන්න');
          return;
        }
      }
    }
    
    if (activeStep === 1) {
      // Validate admin payment fields if paid in person
      if (paidInPerson) {
        if (!adminPaymentInfo.recipientName || !adminPaymentInfo.contactNumber) {
          setError('කරුණාකර ලබන්නාගේ නම සහ සම්බන්ධතා අංකය ඇතුළත් කරන්න');
          return;
        }
      } else if (deliveryType === 'delivery' && paymentReceipts.length === 0) {
        // Only require payment receipts if not paid in person and payment method is bank transfer
        setError('කරුණාකර ගෙවීම් රිසිට්පතක් අප්ලෝඩ් කරන්න');
        return;
      }
    }
    
    setError('');
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmitOrder = async () => {
    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');

      // Determine payment method based on delivery type and admin option
      let finalPaymentMethod = 'bank_transfer';
      if (deliveryType === 'pickup' && !paidInPerson) {
        finalPaymentMethod = 'cash_on_pickup';
      }

      const orderData = {
        deliveryType,
        deliveryInfo: deliveryType === 'delivery' ? deliveryInfo : undefined,
        paymentMethod: finalPaymentMethod,
        paymentReceipts: paidInPerson ? [] : paymentReceipts,
        paidInPerson,
        adminPaymentInfo: paidInPerson ? adminPaymentInfo : undefined
      };

      console.log('Order data being sent:', orderData); // Debug log

      const response = await axios.post(
        'https://ayanna-kiyanna-new-backend.onrender.com/api/orders',
        orderData,
        { headers: { 'x-auth-token': token } }
      );

      setOrderDetails(response.data);
      setShowSuccessDialog(true);
    } catch (err) {
      console.error('Error creating order:', err);
      console.error('Error response:', err.response?.data); // Debug log
      setError(err.response?.data?.message || 'Error creating order');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessDialog(false);
    navigate('/orders');
  };

  const totalAmount = cart.totalAmount + deliveryCharge;

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  return (
    <>
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.7; }
            100% { opacity: 1; }
          }
        `}
      </style>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
        <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
              fontWeight: 'bold',
              textAlign: 'center',
              mb: 4
            }}
          >
            ගෙවීම් සම්පූර්ණ කිරීම
          </Typography>

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {/* Step 0: Delivery Method */}
          {activeStep === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom sx={{ fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif', mb: 3 }}>
                මෙම අයිතම ඔබ අතට ලබා ගැනීමට බලාපොරොත්තු වන්නේ කෙසේද?
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card
                    elevation={deliveryType === 'pickup' ? 4 : 1}
                    sx={{
                      cursor: 'pointer',
                      border: deliveryType === 'pickup' ? 2 : 1,
                      borderColor: deliveryType === 'pickup' ? 'primary.main' : 'grey.300',
                      '&:hover': { elevation: 3 }
                    }}
                    onClick={() => setDeliveryType('pickup')}
                  >
                    <CardContent sx={{ textAlign: 'center', py: 4 }}>
                      <PickupIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                      <Typography variant="h6" sx={{ fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif', mb: 1 }}>
                        මම ආයතනයෙන් මගේ අතට ලබාගනිමි
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ආයතනයෙන් සෘජුවම ලබා ගන්න
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card
                    elevation={deliveryType === 'delivery' ? 4 : 1}
                    sx={{
                      cursor: 'pointer',
                      border: deliveryType === 'delivery' ? 2 : 1,
                      borderColor: deliveryType === 'delivery' ? 'primary.main' : 'grey.300',
                      '&:hover': { elevation: 3 }
                    }}
                    onClick={() => setDeliveryType('delivery')}
                  >
                    <CardContent sx={{ textAlign: 'center', py: 4 }}>
                      <DeliveryIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                      <Typography variant="h6" sx={{ fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif', mb: 1 }}>
                        Delivery කර ගැනීමට අවශ්‍ය යි
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ඔබේ ලිපිනයට ගෙන්වා දෙන්න
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {deliveryType === 'delivery' && (
                <Box sx={{ mt: 4 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif' }}>
                    ලබන්නාගේ විස්තර
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="ලබන්නාගේ නම"
                        value={deliveryInfo.recipientName}
                        onChange={(e) => setDeliveryInfo({ ...deliveryInfo, recipientName: e.target.value })}
                        required
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="සම්බන්ධතා අංකය"
                        value={deliveryInfo.contactNumber}
                        onChange={(e) => setDeliveryInfo({ ...deliveryInfo, contactNumber: e.target.value })}
                        required
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="ලිපිනය"
                        multiline
                        rows={3}
                        value={deliveryInfo.address}
                        onChange={(e) => setDeliveryInfo({ ...deliveryInfo, address: e.target.value })}
                        required
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth required>
                        <InputLabel>දිස්ත්‍රික්කය</InputLabel>
                        <Select
                          value={deliveryInfo.district}
                          onChange={(e) => setDeliveryInfo({ ...deliveryInfo, district: e.target.value })}
                          label="දිස්ත්‍රික්කය"
                        >
                          {districts.map((district) => (
                            <MenuItem key={district} value={district}>
                              {district}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    
                    {deliveryCharge > 0 && (
                      <Grid item xs={12}>
                        <Alert severity="info">
                          {deliveryInfo.district} දිස්ත්‍රික්කය සඳහා ගෙන්වා දීමේ ගාස්තුව: Rs. {deliveryCharge.toLocaleString()}
                        </Alert>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              )}
            </Box>
          )}

          {/* Step 1: Payment Details */}
          {activeStep === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom sx={{ fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif', mb: 3 }}>
                ගෙවීම් විස්තර
              </Typography>

              {/* Order Summary */}
              <Paper elevation={2} sx={{ p: 3, mb: 4, backgroundColor: 'grey.50' }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  ඇණවුම් සාරාංශය
                </Typography>
                
                <List dense>
                  {cart.items.map((item) => (
                    <ListItem key={item._id} sx={{ px: 0 }}>
                      <ListItemText
                        primary={item.product.name}
                        secondary={`ප්‍රමාණය: ${item.quantity} × Rs. ${item.priceAtTime.toLocaleString()}`}
                      />
                      <Typography variant="body2">
                        Rs. {item.itemTotal.toLocaleString()}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>උප එකතුව:</Typography>
                  <Typography>Rs. {cart.subtotal?.toLocaleString()}</Typography>
                </Box>
                
                {cart.totalDiscount > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography color="error">වට්ටම:</Typography>
                    <Typography color="error">-Rs. {cart.totalDiscount?.toLocaleString()}</Typography>
                  </Box>
                )}
                
                {deliveryCharge > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>ගෙන්වා දීමේ ගාස්තුව:</Typography>
                    <Typography>Rs. {deliveryCharge.toLocaleString()}</Typography>
                  </Box>
                )}
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>මුළු එකතුව:</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    Rs. {totalAmount.toLocaleString()}
                  </Typography>
                </Box>
              </Paper>

              {/* Bank Details */}
              <Paper elevation={2} sx={{ p: 3, mb: 4, backgroundColor: 'primary.light', color: 'primary.contrastText' }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  බැංකු විස්තර
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>බැංකුව:</strong> Commercial Bank
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>ශාඛාව:</strong> Colombo
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>ගිණුම් අංකය:</strong> 8001234567
                </Typography>
                <Typography variant="body1">
                  <strong>ගිණුම් හිමිකරු:</strong> Ayanna Kiyanna Institute
                </Typography>
              </Paper>

              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography sx={{ fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif' }}>
                  කරුණාකර ඉහත ගිණුමට මුළු මුදල Rs. {totalAmount.toLocaleString()} ක් ගෙවා, 
                  ගෙවීම් රිසිට්පතේ ස්ක්‍රීන්ෂොට් එකක් හෝ PDF එකක් අප්ලෝඩ් කරන්න.
                </Typography>
              </Alert>

              {/* Admin Option - Only show for admin/moderator */}
              {(userRole === 'admin' || userRole === 'moderator') && (
                <Box sx={{ mb: 3 }}>
                  <Paper
                    elevation={paidInPerson ? 3 : 1}
                    sx={{
                      p: 3,
                      border: paidInPerson ? 2 : 1,
                      borderColor: paidInPerson ? 'success.main' : 'grey.300',
                      backgroundColor: paidInPerson ? 'success.light' : 'background.paper',
                      transition: 'all 0.3s ease',
                      borderRadius: 2,
                      '&:hover': {
                        elevation: 3,
                        borderColor: 'success.main',
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Switch
                          checked={paidInPerson}
                          onChange={(e) => {
                            setPaidInPerson(e.target.checked);
                            if (!e.target.checked) {
                              setAdminPaymentInfo({
                                recipientName: '',
                                contactNumber: '',
                                adminNote: ''
                              });
                            }
                          }}
                          color="success"
                          size="medium"
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: 'success.main',
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                              backgroundColor: 'success.main',
                            },
                          }}
                        />
                      }
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                          <Typography
                            variant="h6"
                            sx={{
                              fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
                              fontWeight: paidInPerson ? 'bold' : 'normal',
                              color: paidInPerson ? 'success.contrastText' : 'text.primary',
                              mr: 2
                            }}
                          >
                            👈 සිසුවා විසින් මගේ අතට මුදල් ලබා දෙන ලදි
                          </Typography>
                          {paidInPerson && (
                            <Chip
                              label="ස්වයංක්‍රීය අනුමතිය"
                              color="success"
                              size="small"
                              variant="filled"
                              sx={{
                                fontWeight: 'bold',
                                animation: 'pulse 2s infinite'
                              }}
                            />
                          )}
                        </Box>
                      }
                      sx={{
                        width: '100%',
                        margin: 0,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    />

                    {/* Admin Payment Fields - Show when paid in person is selected */}
                    {paidInPerson && (
                      <Box sx={{ mt: 3 }}>
                        <Divider sx={{ mb: 3, borderColor: 'success.main' }} />

                        <Typography
                          variant="h6"
                          gutterBottom
                          sx={{
                            fontWeight: 'bold',
                            mb: 3,
                            color: 'success.contrastText',
                            fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
                          }}
                        >
                          📝 ගෙවීම් විස්තර
                        </Typography>

                        <Grid container spacing={3}>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="ලබන්නාගේ නම"
                              value={adminPaymentInfo.recipientName}
                              onChange={(e) => setAdminPaymentInfo({ ...adminPaymentInfo, recipientName: e.target.value })}
                              required
                              error={paidInPerson && !adminPaymentInfo.recipientName}
                              helperText={paidInPerson && !adminPaymentInfo.recipientName ? 'මෙම ක්ෂේත්‍රය අවශ්‍ය වේ' : ''}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                }
                              }}
                            />
                          </Grid>

                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="සම්බන්ධතා අංකය"
                              value={adminPaymentInfo.contactNumber}
                              onChange={(e) => setAdminPaymentInfo({ ...adminPaymentInfo, contactNumber: e.target.value })}
                              required
                              error={paidInPerson && !adminPaymentInfo.contactNumber}
                              helperText={paidInPerson && !adminPaymentInfo.contactNumber ? 'මෙම ක්ෂේත්‍රය අවශ්‍ය වේ' : ''}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                }
                              }}
                            />
                          </Grid>

                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="පරිපාලක සටහන (විකල්ප)"
                              multiline
                              rows={3}
                              value={adminPaymentInfo.adminNote}
                              onChange={(e) => setAdminPaymentInfo({ ...adminPaymentInfo, adminNote: e.target.value })}
                              placeholder="ගෙවීම සම්බන්ධයෙන් අමතර සටහන්..."
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                }
                              }}
                            />
                          </Grid>
                        </Grid>

                        <Alert severity="success" sx={{ mt: 3, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
                          <Typography sx={{ fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif', color: 'success.main' }}>
                            ✅ මෙම ඇණවුම ස්වයංක්‍රීයව අනුමත කරනු ලැබේ
                          </Typography>
                        </Alert>
                      </Box>
                    )}
                  </Paper>
                </Box>
              )}

              {!paidInPerson && (
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif' }}>
                    ගෙවීම් රිසිට්පත අප්ලෝඩ් කරන්න (උපරිම 3)
                  </Typography>
                  
                  <CloudinaryUpload
                    onUploadSuccess={(uploadedFiles) => {
                      setPaymentReceipts(uploadedFiles.slice(0, 3));
                    }}
                    maxFiles={3}
                    acceptedTypes={['image/*', 'application/pdf']}
                    uploadPreset="ml_default"
                    cloudName="dl9k5qoae"
                  />
                  
                  {paymentReceipts.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" gutterBottom>
                        අප්ලෝඩ් කරන ලද ගොනු:
                      </Typography>
                      {paymentReceipts.map((receipt, index) => (
                        <Chip
                          key={index}
                          label={receipt.name}
                          onDelete={() => {
                            setPaymentReceipts(paymentReceipts.filter((_, i) => i !== index));
                          }}
                          sx={{ mr: 1, mb: 1 }}
                        />
                      ))}
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          )}

          {/* Step 2: Confirmation */}
          {activeStep === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom sx={{ fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif', mb: 3 }}>
                ඇණවුම තහවුරු කිරීම
              </Typography>

              <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  ලබා ගැනීමේ විස්තර
                </Typography>
                
                {deliveryType === 'pickup' ? (
                  <Typography>ආයතනයෙන් සෘජුවම ලබා ගැනීම</Typography>
                ) : (
                  <Box>
                    <Typography><strong>ලබන්නාගේ නම:</strong> {deliveryInfo.recipientName}</Typography>
                    <Typography><strong>සම්බන්ධතා අංකය:</strong> {deliveryInfo.contactNumber}</Typography>
                    <Typography><strong>ලිපිනය:</strong> {deliveryInfo.address}</Typography>
                    <Typography><strong>දිස්ත්‍රික්කය:</strong> {deliveryInfo.district}</Typography>
                  </Box>
                )}
              </Paper>

              <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  ගෙවීම් විස්තර
                </Typography>
                
                <Typography>
                  <strong>ගෙවීම් ක්‍රමය:</strong> {
                    paidInPerson ? 'පුද්ගලිකව ගෙවන ලදි' :
                    deliveryType === 'pickup' ? 'ලබා ගන්නා විට ගෙවීම' : 'බැංකු මාරුව'
                  }
                </Typography>
                <Typography><strong>මුළු මුදල:</strong> Rs. {totalAmount.toLocaleString()}</Typography>

                {paidInPerson ? (
                  <Box>
                    <Alert severity="success" sx={{ mb: 3 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                        ✅ පුද්ගලිකව ගෙවන ලදි
                      </Typography>
                      <Typography sx={{ fontStyle: 'italic', color: 'success.dark' }}>
                        මෙම ඇණවුම ස්වයංක්‍රීයව අනුමත කරනු ලැබේ
                      </Typography>
                    </Alert>

                    <Paper elevation={2} sx={{ p: 3, backgroundColor: 'success.light', borderRadius: 2 }}>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'success.contrastText' }}>
                        📝 ගෙවීම් විස්තර
                      </Typography>

                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'success.dark' }}>
                              ලබන්නාගේ නම:
                            </Typography>
                            <Typography variant="body1" sx={{ color: 'success.contrastText' }}>
                              {adminPaymentInfo.recipientName}
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'success.dark' }}>
                              සම්බන්ධතා අංකය:
                            </Typography>
                            <Typography variant="body1" sx={{ color: 'success.contrastText' }}>
                              {adminPaymentInfo.contactNumber}
                            </Typography>
                          </Box>
                        </Grid>

                        {adminPaymentInfo.adminNote && (
                          <Grid item xs={12}>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'success.dark' }}>
                                පරිපාලක සටහන:
                              </Typography>
                              <Typography variant="body1" sx={{ color: 'success.contrastText', fontStyle: 'italic' }}>
                                {adminPaymentInfo.adminNote}
                              </Typography>
                            </Box>
                          </Grid>
                        )}
                      </Grid>
                    </Paper>
                  </Box>
                ) : deliveryType === 'delivery' ? (
                  <Typography>
                    <strong>අප්ලෝඩ් කරන ලද රිසිට්පත්:</strong> {paymentReceipts.length}
                  </Typography>
                ) : (
                  <Typography color="info.main">ලබා ගන්නා විට ගෙවීම</Typography>
                )}
              </Paper>

              <Alert severity="warning" sx={{ mb: 3 }}>
                <Typography sx={{ fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif' }}>
                  ඇණවුම ස්ථිර කිරීමෙන් පසු, එය වෙනස් කිරීමට නොහැකි වේ. 
                  කරුණාකර සියලුම විස්තර නිවැරදි බව තහවුරු කර ගන්න.
                </Typography>
              </Alert>
            </Box>
          )}

          {/* Navigation Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              onClick={handleBack}
              disabled={activeStep === 0}
              variant="outlined"
            >
              පෙර
            </Button>
            
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleSubmitOrder}
                disabled={submitting}
                sx={{
                  background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #FF5252, #26C6DA)',
                  }
                }}
              >
                {submitting ? <CircularProgress size={24} /> : 'ඇණවුම ස්ථිර කරන්න'}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                sx={{
                  background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #FF5252, #26C6DA)',
                  }
                }}
              >
                ඊළඟ
              </Button>
            )}
          </Box>
        </Paper>
      </motion.div>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: 'center', color: 'success.main' }}>
          <CheckIcon sx={{ fontSize: 48, mb: 2 }} />
          <Typography variant="h5" sx={{ fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif' }}>
            ඇණවුම සාර්ථකව ස්ථිර කරන ලදී!
          </Typography>
        </DialogTitle>
        
        <DialogContent sx={{ textAlign: 'center' }}>
          {orderDetails && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>
                ඇණවුම් අංකය: {orderDetails.orderId}
              </Typography>
              <Typography variant="body1" sx={{ fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif' }}>
                ඔබේ ඇණවුම සාර්ථකව ලැබී ඇත. අපි ඔබේ ගෙවීම සත්‍යාපනය කර ඇණවුම අනුමත කරන තුරු රැඳී සිටින්න.
              </Typography>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button
            variant="contained"
            onClick={handleSuccessClose}
            sx={{
              background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
              '&:hover': {
                background: 'linear-gradient(45deg, #FF5252, #26C6DA)',
              }
            }}
          >
            මගේ ඇණවුම් බලන්න
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
    </>
  );
};

export default PaymentPage;
