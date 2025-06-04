import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Alert,
  CircularProgress,
  IconButton,
  Divider,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  ArrowBack,
  CloudUpload,
  AccountBalance,
  Info,
  Payment,
  Delete,
  Visibility,
  GetApp,
  ExpandMore,
  MonetizationOn,
  Warning,
  CameraAlt,
  Description,
  HelpOutline
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';

const ClassFeePayment = () => {
  const { classId, year, month } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const updatePaymentId = searchParams.get('update');
  
  const [loading, setLoading] = useState(false);
  const [classData, setClassData] = useState(null);
  const [existingPayment, setExistingPayment] = useState(null);
  const [formData, setFormData] = useState({
    receiptFile: null,
    receiptUrl: '',
    receiptPublicId: '',
    additionalNote: ''
  });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const monthNames = [
    'ජනවාරි', 'පෙබරවාරි', 'මාර්තු', 'අප්‍රේල්', 'මැයි', 'ජූනි',
    'ජූලි', 'අගෝස්තු', 'සැප්තැම්බර්', 'ඔක්තෝබර්', 'නොවැම්බර්', 'දෙසැම්බර්'
  ];

  useEffect(() => {
    fetchClassData();
    if (updatePaymentId) {
      fetchExistingPayment();
    }
  }, [classId, updatePaymentId]);

  const fetchClassData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/classes/${classId}`,
        { headers: { 'x-auth-token': token } }
      );
      setClassData(response.data);
    } catch (error) {
      console.error('Error fetching class data:', error);
      setError('Error loading class data');
    }
  };

  const fetchExistingPayment = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/payments/student/${classId}/${year}`,
        { headers: { 'x-auth-token': token } }
      );
      
      const monthData = response.data.monthlyStatus.find(m => m.month === parseInt(month));
      if (monthData && monthData.payment) {
        setExistingPayment(monthData.payment);
        setFormData({
          receiptFile: null,
          receiptUrl: monthData.payment.receiptUrl,
          receiptPublicId: monthData.payment.receiptPublicId,
          additionalNote: monthData.payment.additionalNote || ''
        });
      }
    } catch (error) {
      console.error('Error fetching existing payment:', error);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'ml_default');
      formData.append('cloud_name', 'dl9k5qoae');

      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dl9k5qoae/auto/upload',
        formData
      );

      setFormData(prev => ({
        ...prev,
        receiptUrl: response.data.secure_url,
        receiptPublicId: response.data.public_id,
        receiptFile: file
      }));

      setSuccess('Receipt/Evidence uploaded successfully!');
    } catch (error) {
      console.error('Error uploading file:', error);
      setError('Error uploading receipt. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveReceipt = async () => {
    try {
      // If there's a public ID, try to delete from Cloudinary
      if (formData.receiptPublicId) {
        // Note: For security, receipt deletion from Cloudinary should be handled by backend
        console.log('Receipt removed from form, but file remains in Cloudinary for admin review');
      }

      setFormData(prev => ({
        ...prev,
        receiptUrl: '',
        receiptPublicId: '',
        receiptFile: null
      }));

      setSuccess('Receipt/Evidence removed successfully!');
    } catch (error) {
      console.error('Error removing receipt:', error);
      setError('Error removing receipt. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.receiptUrl) {
      setError('Please upload a receipt/evidence');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const submitData = {
        classId,
        year: parseInt(year),
        month: parseInt(month),
        amount: classData.monthlyFee,
        receiptUrl: formData.receiptUrl,
        receiptPublicId: formData.receiptPublicId,
        additionalNote: formData.additionalNote
      };

      let response;
      if (updatePaymentId) {
        // Update existing payment
        response = await axios.put(
          `https://ayanna-kiyanna-new-backend.onrender.com/api/payments/${updatePaymentId}`,
          {
            receiptUrl: formData.receiptUrl,
            receiptPublicId: formData.receiptPublicId,
            additionalNote: formData.additionalNote
          },
          { headers: { 'x-auth-token': token } }
        );
      } else {
        // Submit new payment
        response = await axios.post(
          'https://ayanna-kiyanna-new-backend.onrender.com/api/payments/submit',
          submitData,
          { headers: { 'x-auth-token': token } }
        );
      }

      setSuccess(updatePaymentId ? 'Payment request updated successfully!' : 'Payment request submitted successfully!');
      
      // Navigate back after 2 seconds
      setTimeout(() => {
        navigate(`/student-class-payments/${classId}`);
      }, 2000);
      
    } catch (error) {
      console.error('Error submitting payment:', error);
      setError(error.response?.data?.message || 'Error submitting payment request');
    } finally {
      setLoading(false);
    }
  };

  if (!classData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      py: 3
    }}>
      <Container maxWidth="md">
        {/* Header */}
        <Paper elevation={3} sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <IconButton onClick={() => navigate(-1)} color="primary">
              <ArrowBack />
            </IconButton>
            <Typography variant="h4" fontWeight="bold" sx={{
              fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
            }}>
              {updatePaymentId ? 'ගෙවීම් ඉල්ලීම යාවත්කාලීන කරන්න' : 'පන්ති ගාස්තු ගෙවීම'}
            </Typography>
          </Box>
          
          <Typography variant="h6" sx={{
            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
          }}>
            {monthNames[parseInt(month) - 1]} {year} - {classData.grade}
          </Typography>
        </Paper>

        {/* Payment Instructions */}
        <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Info color="primary" />
            <Typography variant="h6" fontWeight="bold" sx={{
              fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
            }}>
              ගෙවීම් උපදෙස්
            </Typography>
          </Box>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <AccountBalance fontSize="small" />
                  <strong>බැංකුව:</strong> Bank of Ceylon
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>ශාඛාව:</strong> Ruwanwella
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>ගිණුම් අංකය:</strong> 12345678901
                </Typography>
                <Typography variant="body1">
                  <strong>ගිණුම් නම:</strong> Ayanna Kiyanna Institute
                </Typography>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 2, bgcolor: '#e3f2fd' }}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>පන්තිය:</strong> {classData.grade} - {classData.category}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>මාසික ගාස්තුව:</strong> Rs. {classData.monthlyFee}/=
                </Typography>
                <Typography variant="body1">
                  <strong>ගෙවීම් මාසය:</strong> {monthNames[parseInt(month) - 1]} {year}
                </Typography>
              </Card>
            </Grid>
          </Grid>

          <Alert severity="info" sx={{ mt: 2 }}>
            ඔබේ මාසික පන්ති ගාස්තුව ඉහත බැංකු ගිණුමට ගෙවා, ගෙවීම් රිසිට්පත (රූපයක් හෝ PDF) අමුණන්න.
          </Alert>
        </Paper>

        {/* Smart Notes Section */}
        <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <HelpOutline color="primary" />
            <Typography variant="h6" fontWeight="bold" sx={{
              fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
            }}>
              ගෙවීම් උපදෙස් සහ විශේෂ අවස්ථා
            </Typography>
          </Box>

          <Grid container spacing={2}>
            {/* Cash Payment Scenario */}
            <Grid item xs={12} md={6}>
              <Accordion sx={{ borderRadius: 2, '&:before': { display: 'none' } }}>
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  sx={{
                    bgcolor: '#e8f5e8',
                    borderRadius: '8px 8px 0 0',
                    '&.Mui-expanded': { borderRadius: '8px 8px 0 0' }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <MonetizationOn color="success" />
                    <Typography variant="subtitle1" fontWeight="bold" sx={{
                      fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                    }}>
                      මුදල් අතින් ගෙවීම
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ bgcolor: '#f9f9f9' }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                    <CameraAlt color="primary" sx={{ mt: 0.5 }} />
                    <Box>
                      <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
                        මුදල් අතින් ගෙවන්නේ නම්:
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        • ඔබේ පැහැදිලි ඡායාරූපයක් හෝ ගෙවන්නාගේ ඡායාරූපයක් අමුණන්න
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        • අමතර සටහනේ "මුදල් අතින් ගෙවීම" ලෙස සඳහන් කරන්න
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        • ගෙවන්නාගේ නම සහ සම්බන්ධතාව සඳහන් කරන්න
                      </Typography>
                    </Box>
                  </Box>
                  <Alert severity="success" sx={{ fontSize: '0.875rem' }}>
                    <strong>උදාහරණය:</strong> "මුදල් අතින් ගෙවීම - මගේ මව විසින් ගෙවන ලදී (නම: සිරිමාලි පෙරේරා)"
                  </Alert>
                </AccordionDetails>
              </Accordion>
            </Grid>

            {/* Payment Difficulty Scenario */}
            <Grid item xs={12} md={6}>
              <Accordion sx={{ borderRadius: 2, '&:before': { display: 'none' } }}>
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  sx={{
                    bgcolor: '#fff3e0',
                    borderRadius: '8px 8px 0 0',
                    '&.Mui-expanded': { borderRadius: '8px 8px 0 0' }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Warning color="warning" />
                    <Typography variant="subtitle1" fontWeight="bold" sx={{
                      fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                    }}>
                      ගෙවීමේ අපහසුතාව
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ bgcolor: '#f9f9f9' }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                    <Description color="primary" sx={{ mt: 0.5 }} />
                    <Box>
                      <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
                        ගෙවීමට අපහසුතාවයක් ඇත්නම්:
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        •  ඔබේ පැහැදිලි ඡායාරූපයක් හෝ හේතුවට අදාල ඡායාරූපයක් හෝ ලේඛනයක් අමුණන්න
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        • අමතර සටහනේ හේතුව පැහැදිලිව සඳහන් කරන්න
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        • අපගේ පරිපාලන කණ්ඩායම ඔබට උපකාර කරනු ඇත
                      </Typography>
                    </Box>
                  </Box>
                  <Alert severity="warning" sx={{ fontSize: '0.875rem' }}>
                    <strong>උදාහරණය:</strong> "මෙම මාසයේ ගෙවීමට අපහසුතාවයක් ඇත - පවුලේ රෝගී තත්ත්වයක් හේතුවෙන්"
                  </Alert>
                </AccordionDetails>
              </Accordion>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Alert severity="info" sx={{ bgcolor: '#e3f2fd' }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
              වැදගත් සටහන:
            </Typography>
            <Typography variant="body2">
              • සියලුම ගෙවීම් ඉල්ලීම් පරිපාලන කණ්ඩායම විසින් සමාලෝචනය කරනු ලැබේ
              <br />
              • ගෙවීම් තහවුරු කිරීමට දින 2-3ක් ගත විය හැක
              <br />
              • ගෙවීම් සම්බන්ධයෙන් ගැටළුවක් ඇත්නම් අපගේ කාර්යාලයට සම්බන්ධ වන්න
            </Typography>
          </Alert>
        </Paper>

        {/* Payment Form */}
        <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Receipt Upload */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{
                  fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
                }}>
                  ගෙවීම් රිසිට්පත හෝ අදාල සාක්ශිය අමුණන්න
                </Typography>
                
                {/* Display uploaded receipt or upload area */}
                {formData.receiptUrl ? (
                  <Card sx={{ p: 2, bgcolor: '#f8f9fa', border: '2px solid #28a745' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Chip label="Receipt Uploaded" color="success" />
                      <Typography variant="body2" color="text.secondary">
                        Receipt/Evidence successfully uploaded
                      </Typography>
                    </Box>

                    {/* Receipt Preview */}
                    <Box sx={{ mb: 2 }}>
                      {formData.receiptUrl.toLowerCase().includes('.pdf') ? (
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          p: 2,
                          bgcolor: '#e3f2fd',
                          borderRadius: 1
                        }}>
                          <GetApp color="primary" />
                          <Typography variant="body2">PDF Receipt/Evidence</Typography>
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<Visibility />}
                            onClick={() => window.open(formData.receiptUrl, '_blank')}
                          >
                            View PDF
                          </Button>
                        </Box>
                      ) : (
                        <Box sx={{ textAlign: 'center' }}>
                          <img
                            src={formData.receiptUrl}
                            alt="Receipt"
                            style={{
                              maxWidth: '100%',
                              maxHeight: '300px',
                              borderRadius: '8px',
                              border: '1px solid #ddd'
                            }}
                          />
                        </Box>
                      )}
                    </Box>

                    {/* Action Buttons */}
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<Delete />}
                        onClick={handleRemoveReceipt}
                        size="small"
                      >
                        Remove
                      </Button>
                      <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<CloudUpload />}
                        onClick={() => document.getElementById('receipt-upload').click()}
                        size="small"
                      >
                        Upload New
                      </Button>
                    </Box>

                    {/* Hidden file input for re-upload */}
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileUpload(e.target.files[0])}
                      style={{ display: 'none' }}
                      id="receipt-upload"
                    />
                  </Card>
                ) : (
                  <Box sx={{
                    border: '2px dashed #ccc',
                    borderRadius: 2,
                    p: 3,
                    textAlign: 'center',
                    cursor: 'pointer',
                    '&:hover': { borderColor: 'primary.main' }
                  }}>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileUpload(e.target.files[0])}
                      style={{ display: 'none' }}
                      id="receipt-upload"
                    />
                    <label htmlFor="receipt-upload" style={{ cursor: 'pointer' }}>
                      <CloudUpload sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                      <Typography variant="body1">
                        {uploading ? 'Uploading...' : 'Click to upload receipt or Evidence (Image or PDF)'}
                      </Typography>
                    </label>
                  </Box>
                )}
              </Grid>

              {/* Additional Note */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="අමතර සටහන (විකල්ප)"
                  value={formData.additionalNote}
                  onChange={(e) => setFormData(prev => ({ ...prev, additionalNote: e.target.value }))}
                  placeholder="ගෙවීම සම්බන්ධයෙන් අමතර තොරතුරු..."
                />
              </Grid>

              {/* Error/Success Messages */}
              {error && (
                <Grid item xs={12}>
                  <Alert severity="error">{error}</Alert>
                </Grid>
              )}
              
              {success && (
                <Grid item xs={12}>
                  <Alert severity="success">{success}</Alert>
                </Grid>
              )}

              {/* Submit Button */}
              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading || uploading || !formData.receiptUrl}
                  sx={{
                    py: 2,
                    fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                    fontSize: '1.1rem',
                    fontWeight: 'bold'
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    updatePaymentId ? 'ගෙවීම් ඉල්ලීම යාවත්කාලීන කරන්න' : 'ගෙවීම් ඉල්ලීම ඉදිරිපත් කරන්න'
                  )}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default ClassFeePayment;
