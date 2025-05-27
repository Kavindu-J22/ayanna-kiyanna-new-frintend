import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Avatar
} from '@mui/material';
import {
  School,
  Close,
  PersonAdd,
  Star,
  EmojiEvents,
  AutoStories
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const StudentRegistrationDialog = ({ open, onClose }) => {
  const handleClose = () => {
    onClose();
  };

  const handleRegisterNow = () => {
    // For now, just close the dialog as requested
    // In the future, this can navigate to registration
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
      PaperProps={{
        sx: {
          borderRadius: { xs: 2, sm: 3, md: 4 },
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          maxHeight: { xs: '98vh', sm: '95vh', md: '90vh' },
          height: { xs: 'auto', sm: 'auto', md: 'auto' },
          m: { xs: 0.5, sm: 1, md: 2 },
          width: { xs: '98%', sm: '95%', md: '100%' },
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }
      }}
      sx={{
        '& .MuiDialog-container': {
          alignItems: 'center',
          padding: { xs: 0.5, sm: 1, md: 2 },
          overflowX: 'hidden'
        },
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgba(0, 0, 0, 0.7)'
        },
        '& .MuiDialog-paper': {
          overflowX: 'hidden'
        }
      }}
    >
      <DialogTitle sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        pb: { xs: 1, sm: 1.5 },
        pt: { xs: 2, sm: 3 },
        px: { xs: 2, sm: 3 },
        position: 'relative',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 1, sm: 0 }
      }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: { xs: 1.5, sm: 2 },
          order: { xs: 2, sm: 1 }
        }}>
          <Avatar sx={{
            bgcolor: '#ffd700',
            color: '#333',
            width: { xs: 40, sm: 45, md: 50 },
            height: { xs: 40, sm: 45, md: 50 }
          }}>
            <School sx={{ fontSize: { xs: 24, sm: 27, md: 30 } }} />
          </Avatar>
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{
              fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
              fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.5rem' },
              textAlign: { xs: 'center', sm: 'left' }
            }}
          >
            සිසු ලියාපදිංචිය අවශ්‍යයි
          </Typography>
        </Box>
        <IconButton
          onClick={handleClose}
          sx={{
            color: 'white',
            order: { xs: 1, sm: 2 },
            alignSelf: { xs: 'flex-end', sm: 'center' },
            position: { xs: 'absolute', sm: 'relative' },
            top: { xs: 8, sm: 'auto' },
            right: { xs: 8, sm: 'auto' },
            zIndex: 10,
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              transform: 'scale(1.1)'
            },
            transition: 'all 0.2s ease'
          }}
        >
          <Close sx={{ fontSize: { xs: 20, sm: 24 } }} />
        </IconButton>

        {/* Decorative elements */}
        <Box sx={{
          position: 'absolute',
          top: -20,
          right: -20,
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,215,0,0.3) 0%, transparent 70%)',
          zIndex: 0
        }} />
      </DialogTitle>

      <DialogContent sx={{
        pt: { xs: 2, sm: 3 },
        pb: { xs: 1, sm: 2 },
        px: { xs: 2, sm: 3 },
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        '&::-webkit-scrollbar': {
          width: '6px'
        },
        '&::-webkit-scrollbar-track': {
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '3px'
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'rgba(255, 255, 255, 0.3)',
          borderRadius: '3px',
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.5)'
          }
        }
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Box sx={{
            textAlign: 'center',
            mb: { xs: 3, sm: 4 }
          }}>
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Typography variant="h1" sx={{
                fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
                mb: { xs: 1.5, sm: 2 }
              }}>
                🎓
              </Typography>
            </motion.div>

            <Typography variant="h6" sx={{
              mb: { xs: 2, sm: 3 },
              fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
              fontWeight: 600,
              lineHeight: 1.6,
              fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
              px: { xs: 1, sm: 0 }
            }}>
              පුද්ගලික උපකරණ පුවරුව භාවිතා කිරීමට ඔබ සිසුවකු ලෙස ලියාපදිංචි විය යුතුයි
            </Typography>

            <Typography variant="body1" sx={{
              mb: { xs: 3, sm: 4 },
              fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
              opacity: 0.9,
              lineHeight: 1.8,
              fontSize: { xs: '0.9rem', sm: '1rem' },
              px: { xs: 1, sm: 0 }
            }}>
              අපගේ විශේෂ සිසු ප්‍රජාවට සම්බන්ධ වී අසීමිත ඉගෙනුම් අත්දැකීම් ලබා ගන්න!
              ලියාපදිංචි වීමෙන් ඔබට ලැබෙන්නේ:
            </Typography>

            {/* Benefits */}
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: { xs: 2, sm: 2.5, md: 3 },
              mb: { xs: 3, sm: 4 },
              px: { xs: 0.5, sm: 0 },
              width: '100%',
              maxWidth: '100%',
              overflow: 'hidden'
            }}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
              >
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: { xs: 1.5, sm: 2 },
                  p: { xs: 1.5, sm: 2 },
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: { xs: 2, sm: 3 },
                  backdropFilter: 'blur(10px)'
                }}>
                  <Avatar sx={{
                    bgcolor: '#ff6b6b',
                    width: { xs: 35, sm: 40 },
                    height: { xs: 35, sm: 40 }
                  }}>
                    <AutoStories sx={{ fontSize: { xs: 18, sm: 20 } }} />
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      sx={{
                        fontSize: { xs: '0.8rem', sm: '0.875rem' },
                        lineHeight: 1.3
                      }}
                    >
                      පුද්ගලික පාඩම් ප්‍රගතිය
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        opacity: 0.8,
                        fontSize: { xs: '0.7rem', sm: '0.75rem' },
                        lineHeight: 1.2,
                        display: 'block'
                      }}
                    >
                      ඔබගේ ඉගෙනුම් ගමන නිරීක්ෂණය කරන්න
                    </Typography>
                  </Box>
                </Box>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
              >
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: { xs: 1.5, sm: 2 },
                  p: { xs: 1.5, sm: 2 },
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: { xs: 2, sm: 3 },
                  backdropFilter: 'blur(10px)'
                }}>
                  <Avatar sx={{
                    bgcolor: '#4ecdc4',
                    width: { xs: 35, sm: 40 },
                    height: { xs: 35, sm: 40 }
                  }}>
                    <EmojiEvents sx={{ fontSize: { xs: 18, sm: 20 } }} />
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      sx={{
                        fontSize: { xs: '0.8rem', sm: '0.875rem' },
                        lineHeight: 1.3
                      }}
                    >
                      සාධනයන් සහ සම්මාන
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        opacity: 0.8,
                        fontSize: { xs: '0.7rem', sm: '0.75rem' },
                        lineHeight: 1.2,
                        display: 'block'
                      }}
                    >
                      ඔබගේ ජයග්‍රහණ සමරන්න
                    </Typography>
                  </Box>
                </Box>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
              >
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: { xs: 1.5, sm: 2 },
                  p: { xs: 1.5, sm: 2 },
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: { xs: 2, sm: 3 },
                  backdropFilter: 'blur(10px)'
                }}>
                  <Avatar sx={{
                    bgcolor: '#45b7d1',
                    width: { xs: 35, sm: 40 },
                    height: { xs: 35, sm: 40 }
                  }}>
                    <School sx={{ fontSize: { xs: 18, sm: 20 } }} />
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      sx={{
                        fontSize: { xs: '0.8rem', sm: '0.875rem' },
                        lineHeight: 1.3
                      }}
                    >
                      පන්ති කාලසටහන්
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        opacity: 0.8,
                        fontSize: { xs: '0.7rem', sm: '0.75rem' },
                        lineHeight: 1.2,
                        display: 'block'
                      }}
                    >
                      ඔබගේ පන්ති සංවිධානය කරන්න
                    </Typography>
                  </Box>
                </Box>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
              >
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: { xs: 1.5, sm: 2 },
                  p: { xs: 1.5, sm: 2 },
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: { xs: 2, sm: 3 },
                  backdropFilter: 'blur(10px)'
                }}>
                  <Avatar sx={{
                    bgcolor: '#f7b731',
                    width: { xs: 35, sm: 40 },
                    height: { xs: 35, sm: 40 }
                  }}>
                    <Star sx={{ fontSize: { xs: 18, sm: 20 } }} />
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      sx={{
                        fontSize: { xs: '0.8rem', sm: '0.875rem' },
                        lineHeight: 1.3
                      }}
                    >
                      විශේෂ අන්තර්ගතයන්
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        opacity: 0.8,
                        fontSize: { xs: '0.7rem', sm: '0.75rem' },
                        lineHeight: 1.2,
                        display: 'block'
                      }}
                    >
                      සිසුන්ට පමණක් ලබා දෙන සම්පත්
                    </Typography>
                  </Box>
                </Box>
              </motion.div>
            </Box>

            <Box sx={{
              p: 3,
              bgcolor: 'rgba(255, 215, 0, 0.2)',
              borderRadius: 3,
              border: '2px dashed rgba(255, 215, 0, 0.5)'
            }}>
              <Typography variant="body2" sx={{
                fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
                fontWeight: 600,
                textAlign: 'center'
              }}>
                ✨ අද ම ලියාපදිංචි වී ඔබගේ ඉගෙනුම් ගමන ආරම්භ කරන්න! ✨
              </Typography>
            </Box>
          </Box>
        </motion.div>
      </DialogContent>

      <DialogActions sx={{
        p: { xs: 2, sm: 3 },
        pt: { xs: 1, sm: 2 },
        gap: { xs: 1.5, sm: 2 },
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: 'stretch',
        justifyContent: { xs: 'center', sm: 'flex-end' },
        flexShrink: 0,
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        mt: 'auto'
      }}>
        <Button
          onClick={handleClose}
          sx={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
            fontSize: { xs: '0.9rem', sm: '1rem' },
            py: { xs: 1, sm: 1.5 },
            px: { xs: 2, sm: 3 },
            order: { xs: 2, sm: 1 },
            minWidth: { xs: 'auto', sm: '120px' },
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          අවලංගු කරන්න
        </Button>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.1 }}
          style={{
            order: 1,
            width: '100%',
            maxWidth: '300px'
          }}
        >
          <Button
            onClick={handleRegisterNow}
            variant="contained"
            startIcon={<PersonAdd sx={{ fontSize: { xs: 18, sm: 20 } }} />}
            fullWidth
            sx={{
              bgcolor: '#ffd700',
              color: '#333',
              fontWeight: 'bold',
              fontSize: { xs: '0.9rem', sm: '1rem' },
              px: { xs: 3, sm: 4 },
              py: { xs: 1.2, sm: 1.5 },
              fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
              boxShadow: '0 4px 15px rgba(255, 215, 0, 0.4)',
              minHeight: { xs: '44px', sm: '48px' },
              '&:hover': {
                bgcolor: '#ffed4e',
                boxShadow: '0 6px 20px rgba(255, 215, 0, 0.6)'
              }
            }}
          >
            දැන් ම ලියාපදිංචි වන්න
          </Button>
        </motion.div>
      </DialogActions>
    </Dialog>
  );
};

export default StudentRegistrationDialog;
