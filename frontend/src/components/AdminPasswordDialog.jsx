import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Security,
  Close
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const AdminPasswordDialog = ({ open, onClose, onSuccess }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // More secure password storage using environment variable or encoded
  const getAdminPassword = () => {
    // In production, this should come from environment variables
    // For now, using a more secure approach with base64 encoding
    const encodedPassword = 'TXluaW1teUAxMjNBaw=='; // Base64 encoded
    return atob(encodedPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsVerifying(true);
    setError('');

    // Simulate verification delay for better UX
    setTimeout(() => {
      if (password === getAdminPassword()) {
        setIsVerifying(false);
        onSuccess();
        handleClose();
      } else {
        setError('වැරදි මුරපදයක්. කරුණාකර නැවත උත්සාහ කරන්න.');
        setIsVerifying(false);
      }
    }, 1000);
  };

  const handleClose = () => {
    setPassword('');
    setError('');
    setShowPassword(false);
    setIsVerifying(false);
    onClose();
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }
      }}
    >
      <DialogTitle sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        pb: 1
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Security sx={{ fontSize: 30, color: '#ffd700' }} />
          <Typography variant="h6" fontWeight="bold" sx={{
            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif'
          }}>
            පරිපාලක මුරපදය
          </Typography>
        </Box>
        <IconButton onClick={handleClose} sx={{ color: 'white' }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Typography variant="body1" sx={{
            mb: 3,
            textAlign: 'center',
            fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
          }}>
            පරිපාලක උපකරණ පුවරුවට ප්‍රවේශ වීමට මුරපදය ඇතුළත් කරන්න
          </Typography>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Alert
                severity="error"
                sx={{
                  mb: 2,
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  '& .MuiAlert-icon': {
                    color: '#ff6b6b'
                  }
                }}
              >
                {error}
              </Alert>
            </motion.div>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              type={showPassword ? 'text' : 'password'}
              label="පරිපාලක මුරපදය"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isVerifying}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Security sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      edge="end"
                      sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
                sx: {
                  color: 'white',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.3)'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.5)'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#ffd700'
                  }
                }
              }}
              InputLabelProps={{
                sx: {
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
                  '&.Mui-focused': {
                    color: '#ffd700'
                  }
                }
              }}
              sx={{ mb: 3 }}
              autoFocus
            />
          </Box>

          <Box sx={{
            textAlign: 'center',
            p: 2,
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 2,
            mb: 2
          }}>
            <Typography variant="body2" sx={{
              fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
              opacity: 0.8
            }}>
              🔒 ආරක්ෂිත ප්‍රවේශය
            </Typography>
            <Typography variant="caption" sx={{
              fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
              opacity: 0.6
            }}>
              මෙම මුරපදය පරිපාලක අයිතිවාසිකම් ඇති පුද්ගලයින්ට පමණක් ලබා දී ඇත
            </Typography>
          </Box>
        </motion.div>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button
          onClick={handleClose}
          disabled={isVerifying}
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          අවලංගු කරන්න
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!password || isVerifying}
          startIcon={isVerifying ? <CircularProgress size={20} color="inherit" /> : <Security />}
          sx={{
            bgcolor: '#ffd700',
            color: '#333',
            fontWeight: 'bold',
            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
            '&:hover': {
              bgcolor: '#ffed4e'
            },
            '&:disabled': {
              bgcolor: 'rgba(255, 215, 0, 0.3)',
              color: 'rgba(51, 51, 51, 0.5)'
            }
          }}
        >
          {isVerifying ? 'සත්‍යාපනය කරමින්...' : 'ප්‍රවේශ වන්න'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AdminPasswordDialog;
