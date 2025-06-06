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
  Card,
  CardContent,
  Avatar
} from '@mui/material';
import {
  Close as CloseIcon,
  InsertDriveFile as FileIcon,
  Person as PersonIcon,
  AccessTime as TimeIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const GradeFileDetailsDialog = ({ open, onClose, file, gradeCategory }) => {
  if (!file) return null;

  // Grade category configurations
  const gradeConfigs = {
    'grade-9': { color: '#3498db' },
    'grade-10': { color: '#e74c3c' },
    'grade-11': { color: '#f39c12' },
    'a-level': { color: '#9b59b6' },
    'sinhala-literature': { color: '#1abc9c' }
  };

  const currentConfig = gradeConfigs[gradeCategory] || gradeConfigs['grade-9'];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: `linear-gradient(135deg, ${currentConfig.color}20 0%, ${currentConfig.color}10 100%)`,
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
        color: '#2C3E50'
      }}>
        <Box display="flex" alignItems="center" gap={2}>
          <FileIcon sx={{ color: currentConfig.color }} />
          ගොනු විස්තර
        </Box>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* File Header */}
          <Card elevation={3} sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Avatar
                  sx={{
                    bgcolor: currentConfig.color,
                    width: 56,
                    height: 56
                  }}
                >
                  <FileIcon sx={{ fontSize: 32 }} />
                </Avatar>
                <Box flexGrow={1}>
                  <Typography
                    variant="h5"
                    component="h2"
                    sx={{
                      fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                      fontWeight: 'bold',
                      color: '#2C3E50',
                      mb: 1
                    }}
                  >
                    {file.title}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
                    <Box display="flex" alignItems="center" gap={1}>
                      <PersonIcon fontSize="small" sx={{ color: currentConfig.color }} />
                      <Typography variant="body2" color="text.secondary">
                        {file.createdBy?.fullName}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <TimeIcon fontSize="small" sx={{ color: currentConfig.color }} />
                      <Typography variant="body2" color="text.secondary">
                        {new Date(file.createdAt).toLocaleDateString('si-LK')}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Description */}
          <Card elevation={3} sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <DescriptionIcon sx={{ color: currentConfig.color }} />
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                    color: '#2C3E50'
                  }}
                >
                  විස්තරය
                </Typography>
              </Box>
              <Typography
                variant="body1"
                sx={{
                  fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
                  lineHeight: 1.6,
                  color: '#555'
                }}
              >
                {file.description}
              </Typography>
            </CardContent>
          </Card>

          {/* Content */}
          {file.content && (
            <Card elevation={3}>
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <DescriptionIcon sx={{ color: currentConfig.color }} />
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                      color: '#2C3E50'
                    }}
                  >
                    අන්තර්ගතය
                  </Typography>
                </Box>
                <Typography
                  variant="body1"
                  sx={{
                    fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
                    lineHeight: 1.6,
                    color: '#555',
                    whiteSpace: 'pre-wrap'
                  }}
                >
                  {file.content}
                </Typography>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button
          variant="contained"
          onClick={onClose}
          fullWidth
          sx={{
            bgcolor: currentConfig.color,
            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
            fontWeight: 'bold',
            '&:hover': {
              bgcolor: currentConfig.color,
              filter: 'brightness(0.9)'
            }
          }}
        >
          හරි
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GradeFileDetailsDialog;
