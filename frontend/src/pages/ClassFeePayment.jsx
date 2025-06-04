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
    attachments: [], // Array to store multiple attachments
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

        // Load existing attachments
        let existingAttachments = [];

        // Check if payment has multiple attachments (new format)
        if (monthData.payment.attachments && monthData.payment.attachments.length > 0) {
          existingAttachments = monthData.payment.attachments.map((attachment, index) => ({
            url: attachment.url,
            publicId: attachment.publicId,
            name: attachment.name || `Attachment ${index + 1}`,
            type: attachment.type || (attachment.url.includes('.pdf') ? 'pdf' : 'image')
          }));
        }
        // Fallback to single receipt (backward compatibility)
        else if (monthData.payment.receiptUrl) {
          existingAttachments.push({
            url: monthData.payment.receiptUrl,
            publicId: monthData.payment.receiptPublicId,
            name: 'Receipt/Evidence',
            type: monthData.payment.receiptUrl.includes('.pdf') ? 'pdf' : 'image'
          });
        }

        console.log('Loaded existing attachments:', existingAttachments);

        setFormData({
          attachments: existingAttachments,
          additionalNote: monthData.payment.additionalNote || ''
        });
      }
    } catch (error) {
      console.error('Error fetching existing payment:', error);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) return;

    // Check if maximum 2 attachments limit is reached
    if (formData.attachments.length >= 2) {
      setError('ඔබට උපරිම ගොනු 2ක් පමණක් අමුණා ගත හැක');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('upload_preset', 'ml_default');
      uploadFormData.append('cloud_name', 'dl9k5qoae');

      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dl9k5qoae/auto/upload',
        uploadFormData
      );

      const newAttachment = {
        url: response.data.secure_url,
        publicId: response.data.public_id,
        name: file.name,
        type: file.type.includes('pdf') ? 'pdf' : 'image',
        size: file.size
      };

      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, newAttachment]
      }));

      setSuccess('ගොනුව සාර්ථකව අමුණා ගන්නා ලදී!');
    } catch (error) {
      console.error('Error uploading file:', error);
      setError('ගොනුව අමුණා ගැනීමේදී දෝෂයක් ඇති විය. කරුණාකර නැවත උත්සාහ කරන්න.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveAttachment = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
    setSuccess('ගොනුව ඉවත් කරන ලදී');
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

    if (formData.attachments.length === 0) {
      setError('කරුණාකර ගෙවීම් රිසිට්පතක් හෝ සාක්ශියක් අමුණන්න');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      // Prepare attachments data for backend
      const attachmentsData = formData.attachments.map(att => ({
        url: att.url,
        publicId: att.publicId,
        name: att.name,
        type: att.type
      }));

      const submitData = {
        classId,
        year: parseInt(year),
        month: parseInt(month),
        amount: classData.monthlyFee,
        attachments: attachmentsData,
        // Keep backward compatibility with single receipt
        receiptUrl: attachmentsData[0]?.url || '',
        receiptPublicId: attachmentsData[0]?.publicId || '',
        additionalNote: formData.additionalNote
      };

      if (updatePaymentId) {
        // Update existing payment
        await axios.put(
          `https://ayanna-kiyanna-new-backend.onrender.com/api/payments/${updatePaymentId}`,
          {
            attachments: attachmentsData,
            receiptUrl: attachmentsData[0]?.url || '',
            receiptPublicId: attachmentsData[0]?.publicId || '',
            additionalNote: formData.additionalNote
          },
          { headers: { 'x-auth-token': token } }
        );
      } else {
        // Submit new payment
        await axios.post(
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
                      ගෙවීමේ අපහසුතාව හො වෙනත් හේතු
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ bgcolor: '#f9f9f9' }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                    <Description color="primary" sx={{ mt: 0.5 }} />
                    <Box>
                      <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
                        ගෙවීමට අපහසුතාවයක් හො වෙනත් හේතුවක් ඇත්නම්:
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
              {/* Attachments Upload */}
              <Grid item xs={12}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{
                    fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <CloudUpload />
                    ගෙවීම් රිසිට්පත හෝ අදාල සාක්ශි අමුණන්න (උපරිම 2ක්)
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    ඔබට රූප (JPG, PNG) හෝ PDF ගොනු අමුණා ගත හැක. උපරිම ගොනු 2ක් පමණි.
                  </Typography>
                </Box>

                {/* Display uploaded attachments */}
                {formData.attachments.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{
                      fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                      mb: 2,
                      fontWeight: 'bold'
                    }}>
                      අමුණා ගත් ගොනු:
                    </Typography>
                    <Grid container spacing={2}>
                      {formData.attachments.map((attachment, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                          <Card sx={{
                            p: 2,
                            bgcolor: 'success.50',
                            border: '2px solid',
                            borderColor: 'success.200',
                            position: 'relative'
                          }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                              <Chip
                                label={`ගොනුව ${index + 1}`}
                                color="success"
                                size="small"
                              />
                              <Typography variant="body2" color="text.secondary">
                                {attachment.type === 'pdf' ? 'PDF ගොනුව' : 'රූපය'}
                              </Typography>
                            </Box>

                            {/* Attachment Preview */}
                            <Box sx={{ mb: 2 }}>
                              {attachment.type === 'pdf' ? (
                                <Box sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 2,
                                  p: 2,
                                  bgcolor: '#e3f2fd',
                                  borderRadius: 1
                                }}>
                                  <GetApp color="primary" />
                                  <Typography variant="body2">{attachment.name}</Typography>
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    startIcon={<Visibility />}
                                    onClick={() => window.open(attachment.url, '_blank')}
                                  >
                                    බලන්න
                                  </Button>
                                </Box>
                              ) : (
                                <Box sx={{ textAlign: 'center' }}>
                                  <img
                                    src={attachment.url}
                                    alt={attachment.name}
                                    style={{
                                      maxWidth: '100%',
                                      maxHeight: '200px',
                                      borderRadius: '8px',
                                      border: '1px solid #ddd'
                                    }}
                                  />
                                </Box>
                              )}
                            </Box>

                            {/* Action Buttons */}
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                              <Button
                                variant="outlined"
                                color="error"
                                startIcon={<Delete />}
                                onClick={() => handleRemoveAttachment(index)}
                                size="small"
                              >
                                ඉවත් කරන්න
                              </Button>
                              <Button
                                variant="outlined"
                                color="primary"
                                startIcon={<Visibility />}
                                onClick={() => window.open(attachment.url, '_blank')}
                                size="small"
                              >
                                බලන්න
                              </Button>
                            </Box>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}

                {/* Upload Area */}
                {formData.attachments.length < 2 && (
                  <Box sx={{
                    border: '2px dashed #ccc',
                    borderRadius: 2,
                    p: 3,
                    textAlign: 'center',
                    cursor: 'pointer',
                    '&:hover': { borderColor: 'primary.main' },
                    bgcolor: formData.attachments.length === 0 ? 'grey.50' : 'info.50'
                  }}>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileUpload(e.target.files[0])}
                      style={{ display: 'none' }}
                      id="attachment-upload"
                    />
                    <label htmlFor="attachment-upload" style={{ cursor: 'pointer' }}>
                      <CloudUpload sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                      <Typography variant="body1" sx={{ fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif' }}>
                        {uploading ? 'ගොනුව අමුණමින්...' :
                         formData.attachments.length === 0 ?
                         'ගෙවීම් රිසිට්පත හෝ සාක්ශිය අමුණන්න (රූප හෝ PDF)' :
                         'අමතර ගොනුවක් අමුණන්න (විකල්ප)'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formData.attachments.length}/2 ගොනු අමුණා ගන්නා ලදී
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
                  disabled={loading || uploading || formData.attachments.length === 0}
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
