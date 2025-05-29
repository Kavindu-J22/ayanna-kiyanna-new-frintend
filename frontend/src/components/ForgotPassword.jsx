import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Slide,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock, CheckCircle } from '@mui/icons-material';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ForgotPassword = ({ open, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [activeStep, setActiveStep] = useState(0);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const steps = ['Enter Email', 'Verify OTP', 'Reset Password'];

  // Auto-fill email from localStorage if available
  useEffect(() => {
    if (open) {
      const storedEmail = localStorage.getItem('userEmail');
      if (storedEmail && !email) {
        setEmail(storedEmail);
      }
    }
  }, [open, email]);

  const handleClose = () => {
    setActiveStep(0);
    setEmail('');
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess('');
    setLoading(false);
    onClose();
  };

  const handleSendOTP = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('https://ayanna-kiyanna-new-backend.onrender.com/api/auth/forgot-password', {
        email
      });

      setSuccess(response.data.message);
      setActiveStep(1);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('https://ayanna-kiyanna-new-backend.onrender.com/api/auth/verify-reset-otp', {
        email,
        otp
      });

      setSuccess(response.data.message);
      setActiveStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('https://ayanna-kiyanna-new-backend.onrender.com/api/auth/reset-password', {
        email,
        otp,
        newPassword
      });

      setSuccess(response.data.message);
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box sx={{ mt: { xs: 1, sm: 2 } }}>
            <Typography
              variant="body2"
              sx={{
                mb: { xs: 2, sm: 3 },
                color: '#666',
                fontSize: { xs: '0.875rem', sm: '0.875rem' },
                lineHeight: { xs: 1.4, sm: 1.5 }
              }}
            >
              Enter your email address and we'll send you a verification code to reset your password.
            </Typography>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={email || ''}
              onChange={(e) => setEmail(e.target.value || '')}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{
                      color: '#9c27b0',
                      fontSize: { xs: '1.2rem', sm: '1.5rem' }
                    }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  '& fieldset': {
                    borderColor: 'rgba(0, 0, 0, 0.23)',
                  },
                  '&:hover fieldset': {
                    borderColor: '#9c27b0',
                  },
                },
                '& .MuiInputLabel-root': {
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  '&.Mui-focused': {
                    color: '#9c27b0',
                  }
                }
              }}
            />
          </Box>
        );

      case 1:
        return (
          <Box sx={{ mt: { xs: 1, sm: 2 } }}>
            <Typography
              variant="body2"
              sx={{
                mb: { xs: 2, sm: 3 },
                color: '#666',
                fontSize: { xs: '0.875rem', sm: '0.875rem' },
                lineHeight: { xs: 1.4, sm: 1.5 }
              }}
            >
              We've sent a 6-digit verification code to <strong>{email || 'your email'}</strong>. Please enter it below.
            </Typography>
            <TextField
              fullWidth
              label="Verification Code"
              value={otp || ''}
              onChange={(e) => setOtp((e.target.value || '').replace(/\D/g, '').slice(0, 6))}
              variant="outlined"
              inputProps={{
                maxLength: 6,
                style: {
                  textAlign: 'center',
                  fontSize: '1rem',
                  letterSpacing: '0.3rem',
                  padding: '12px'
                }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '& fieldset': {
                    borderColor: 'rgba(0, 0, 0, 0.23)',
                  },
                  '&:hover fieldset': {
                    borderColor: '#9c27b0',
                  },
                  '& input': {
                    fontSize: { xs: '1rem', sm: '1.2rem' },
                    letterSpacing: { xs: '0.3rem', sm: '0.5rem' },
                    padding: { xs: '12px', sm: '16px' }
                  }
                },
                '& .MuiInputLabel-root': {
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  '&.Mui-focused': {
                    color: '#9c27b0',
                  }
                }
              }}
            />
          </Box>
        );

      case 2:
        return (
          <Box sx={{ mt: { xs: 1, sm: 2 } }}>
            <Typography
              variant="body2"
              sx={{
                mb: { xs: 2, sm: 3 },
                color: '#666',
                fontSize: { xs: '0.875rem', sm: '0.875rem' },
                lineHeight: { xs: 1.4, sm: 1.5 }
              }}
            >
              Enter your new password below.
            </Typography>
            <TextField
              fullWidth
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              value={newPassword || ''}
              onChange={(e) => setNewPassword(e.target.value || '')}
              variant="outlined"
              sx={{
                mb: { xs: 1.5, sm: 2 },
                '& .MuiOutlinedInput-root': {
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                },
                '& .MuiInputLabel-root': {
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{
                      color: '#9c27b0',
                      fontSize: { xs: '1.2rem', sm: '1.5rem' }
                    }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{
                        color: '#9c27b0',
                        padding: { xs: '6px', sm: '8px' }
                      }}
                    >
                      {showPassword ?
                        <VisibilityOff sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} /> :
                        <Visibility sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
                      }
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Confirm New Password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword || ''}
              onChange={(e) => setConfirmPassword(e.target.value || '')}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                },
                '& .MuiInputLabel-root': {
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{
                      color: '#9c27b0',
                      fontSize: { xs: '1.2rem', sm: '1.5rem' }
                    }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                      sx={{
                        color: '#9c27b0',
                        padding: { xs: '6px', sm: '8px' }
                      }}
                    >
                      {showConfirmPassword ?
                        <VisibilityOff sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} /> :
                        <Visibility sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
                      }
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        );

      default:
        return null;
    }
  };

  const getActionButton = () => {
    switch (activeStep) {
      case 0:
        return (
          <Button
            onClick={handleSendOTP}
            disabled={loading || !email}
            variant="contained"
            startIcon={loading ?
              <CircularProgress size={isMobile ? 16 : 20} color="inherit" /> :
              <Email sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />
            }
            sx={{
              background: 'linear-gradient(45deg, #9c27b0, #673ab7)',
              fontSize: { xs: '0.8rem', sm: '0.875rem' },
              padding: { xs: '8px 16px', sm: '10px 20px' },
              minWidth: { xs: '140px', sm: '180px' },
              '&:hover': {
                background: 'linear-gradient(45deg, #673ab7, #9c27b0)',
              },
              '&:disabled': {
                background: 'linear-gradient(45deg, rgba(156, 39, 176, 0.6), rgba(103, 58, 183, 0.6))',
              }
            }}
          >
            {loading ? 'Sending...' : (isMobile ? 'Send Code' : 'Send Verification Code')}
          </Button>
        );

      case 1:
        return (
          <Button
            onClick={handleVerifyOTP}
            disabled={loading || otp.length !== 6}
            variant="contained"
            startIcon={loading ?
              <CircularProgress size={isMobile ? 16 : 20} color="inherit" /> :
              <CheckCircle sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />
            }
            sx={{
              background: 'linear-gradient(45deg, #9c27b0, #673ab7)',
              fontSize: { xs: '0.8rem', sm: '0.875rem' },
              padding: { xs: '8px 16px', sm: '10px 20px' },
              minWidth: { xs: '120px', sm: '150px' },
              '&:hover': {
                background: 'linear-gradient(45deg, #673ab7, #9c27b0)',
              },
              '&:disabled': {
                background: 'linear-gradient(45deg, rgba(156, 39, 176, 0.6), rgba(103, 58, 183, 0.6))',
              }
            }}
          >
            {loading ? 'Verifying...' : 'Verify Code'}
          </Button>
        );

      case 2:
        return (
          <Button
            onClick={handleResetPassword}
            disabled={loading || !newPassword || !confirmPassword || newPassword !== confirmPassword}
            variant="contained"
            startIcon={loading ?
              <CircularProgress size={isMobile ? 16 : 20} color="inherit" /> :
              <Lock sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />
            }
            sx={{
              background: 'linear-gradient(45deg, #9c27b0, #673ab7)',
              fontSize: { xs: '0.8rem', sm: '0.875rem' },
              padding: { xs: '8px 16px', sm: '10px 20px' },
              minWidth: { xs: '130px', sm: '160px' },
              '&:hover': {
                background: 'linear-gradient(45deg, #673ab7, #9c27b0)',
              },
              '&:disabled': {
                background: 'linear-gradient(45deg, rgba(156, 39, 176, 0.6), rgba(103, 58, 183, 0.6))',
              }
            }}
          >
            {loading ? 'Resetting...' : (isMobile ? 'Reset' : 'Reset Password')}
          </Button>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
      maxWidth="sm"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: { xs: 0, sm: 3 },
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          padding: { xs: '16px', sm: '20px' },
          margin: { xs: '16px', sm: '32px' },
          maxHeight: { xs: 'calc(100vh - 32px)', sm: 'calc(100vh - 64px)' },
          width: { xs: 'calc(100vw - 32px)', sm: 'auto' },
        }
      }}
    >
      <DialogTitle sx={{
        textAlign: 'center',
        pb: { xs: 0.5, sm: 1 },
        px: { xs: 1, sm: 3 }
      }}>
        <Typography
          variant="h5"
          component="div"
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(45deg, #9c27b0, #673ab7)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: { xs: '1.3rem', sm: '1.5rem' }
          }}
        >
          Reset Password
        </Typography>
      </DialogTitle>

      <DialogContent sx={{
        px: { xs: 1, sm: 3 },
        py: { xs: 1, sm: 2 }
      }}>
        <Stepper
          activeStep={activeStep}
          orientation={isMobile ? 'vertical' : 'horizontal'}
          sx={{
            mb: { xs: 2, sm: 3 },
            '& .MuiStepLabel-label': {
              fontSize: { xs: '0.75rem', sm: '0.875rem' }
            },
            '& .MuiStepConnector-line': {
              display: { xs: 'none', sm: 'block' }
            }
          }}
        >
          {steps.map((label, index) => (
            <Step key={label || `step-${index}`}>
              <StepLabel
                sx={{
                  '& .MuiStepLabel-labelContainer': {
                    maxWidth: { xs: '120px', sm: 'none' }
                  }
                }}
              >
                {label || ''}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: { xs: 1.5, sm: 2 },
              fontSize: { xs: '0.8rem', sm: '0.875rem' },
              '& .MuiAlert-message': {
                fontSize: { xs: '0.8rem', sm: '0.875rem' }
              }
            }}
          >
            {error || ''}
          </Alert>
        )}

        {success && (
          <Alert
            severity="success"
            sx={{
              mb: { xs: 1.5, sm: 2 },
              fontSize: { xs: '0.8rem', sm: '0.875rem' },
              '& .MuiAlert-message': {
                fontSize: { xs: '0.8rem', sm: '0.875rem' }
              }
            }}
          >
            {success || ''}
          </Alert>
        )}

        {renderStepContent()}
      </DialogContent>

      <DialogActions sx={{
        justifyContent: 'space-between',
        px: { xs: 1, sm: 3 },
        pb: { xs: 2, sm: 3 },
        pt: { xs: 1, sm: 2 },
        flexDirection: { xs: 'column-reverse', sm: 'row' },
        gap: { xs: 1, sm: 0 }
      }}>
        <Button
          onClick={handleClose}
          sx={{
            color: '#666',
            fontSize: { xs: '0.8rem', sm: '0.875rem' },
            padding: { xs: '6px 12px', sm: '8px 16px' },
            minWidth: { xs: '80px', sm: '100px' },
            order: { xs: 2, sm: 1 }
          }}
        >
          Cancel
        </Button>
        <Box sx={{ order: { xs: 1, sm: 2 } }}>
          {getActionButton()}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default ForgotPassword;
