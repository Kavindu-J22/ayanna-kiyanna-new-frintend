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
  Grid,
  Avatar
} from '@mui/material';
import {
  Close as CloseIcon,
  InsertDriveFile as FileIcon,
  Download as DownloadIcon,
  PictureAsPdf as PdfIcon,
  Image as ImageIcon,
  Person as PersonIcon,
  AccessTime as TimeIcon,
  Description as DescriptionIcon,
  Attachment as AttachmentIcon,
  OpenInNew as OpenInNewIcon,
  Link as LinkIcon,
  Launch as LaunchIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const LiteratureFileDetailsDialog = ({ open, onClose, file }) => {
  if (!file) return null;

  const handleDownload = (attachment) => {
    window.open(attachment.url, '_blank');
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
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
          <FileIcon sx={{ color: '#ff6b6b' }} />
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
                    bgcolor: '#ff6b6b',
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
                      <PersonIcon fontSize="small" sx={{ color: '#ff6b6b' }} />
                      <Typography variant="body2" color="text.secondary">
                        {file.createdBy?.fullName}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <TimeIcon fontSize="small" sx={{ color: '#ff6b6b' }} />
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
                <DescriptionIcon sx={{ color: '#ff6b6b' }} />
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
            <Card elevation={3} sx={{ mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <DescriptionIcon sx={{ color: '#ff6b6b' }} />
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

          {/* Attachments */}
          {file.attachments && file.attachments.length > 0 && (
            <Card elevation={3} sx={{ mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <AttachmentIcon sx={{ color: '#ff6b6b' }} />
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                      color: '#2C3E50'
                    }}
                  >
                    අමුණන ලද ගොනු ({file.attachments.length})
                  </Typography>
                </Box>

                <Grid container spacing={2}>
                  {file.attachments.map((attachment, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Card
                          elevation={2}
                          sx={{
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                            }
                          }}
                        >
                          <CardContent sx={{ p: 2 }}>
                            <Box display="flex" alignItems="center" gap={2} mb={2}>
                              {attachment.type === 'pdf' ? (
                                <PdfIcon sx={{ color: '#F44336', fontSize: 32 }} />
                              ) : (
                                <ImageIcon sx={{ color: '#4CAF50', fontSize: 32 }} />
                              )}
                              <Box flexGrow={1}>
                                <Typography
                                  variant="subtitle2"
                                  sx={{
                                    fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                                    fontWeight: 'bold',
                                    color: '#2C3E50'
                                  }}
                                >
                                  {attachment.title}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{
                                    fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif'
                                  }}
                                >
                                  {formatFileSize(attachment.size)}
                                </Typography>
                              </Box>
                            </Box>

                            {attachment.description && (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                  fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
                                  mb: 2,
                                  lineHeight: 1.4
                                }}
                              >
                                {attachment.description}
                              </Typography>
                            )}

                            <Box display="flex" gap={1}>
                              <Button
                                variant="contained"
                                size="small"
                                startIcon={<DownloadIcon />}
                                onClick={() => handleDownload(attachment)}
                                sx={{
                                  bgcolor: '#ff6b6b',
                                  fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                                  fontSize: '0.75rem',
                                  '&:hover': {
                                    bgcolor: '#ee5a24'
                                  }
                                }}
                              >
                                බාගන්න
                              </Button>
                              <Button
                                variant="outlined"
                                size="small"
                                startIcon={<OpenInNewIcon />}
                                onClick={() => window.open(attachment.url, '_blank')}
                                sx={{
                                  borderColor: '#ff6b6b',
                                  color: '#ff6b6b',
                                  fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                                  fontSize: '0.75rem',
                                  '&:hover': {
                                    borderColor: '#ee5a24',
                                    color: '#ee5a24'
                                  }
                                }}
                              >
                                විවෘත කරන්න
                              </Button>
                            </Box>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          )}

          {/* Source Links */}
          {file.sourceLinks && file.sourceLinks.length > 0 && (
            <Card elevation={3}>
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <LinkIcon sx={{ color: '#ff6b6b' }} />
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                      color: '#2C3E50'
                    }}
                  >
                    මූලාශ්‍ර සබැඳි ({file.sourceLinks.length})
                  </Typography>
                </Box>

                <Grid container spacing={2}>
                  {file.sourceLinks.map((link, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Card
                          elevation={2}
                          sx={{
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                            }
                          }}
                        >
                          <CardContent sx={{ p: 2 }}>
                            <Box display="flex" alignItems="center" gap={2} mb={2}>
                              <LinkIcon sx={{ color: '#ff6b6b', fontSize: 32 }} />
                              <Box flexGrow={1}>
                                <Typography
                                  variant="subtitle2"
                                  sx={{
                                    fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                                    fontWeight: 'bold',
                                    color: '#2C3E50'
                                  }}
                                >
                                  {link.title}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{
                                    fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
                                    wordBreak: 'break-all'
                                  }}
                                >
                                  {link.url}
                                </Typography>
                              </Box>
                            </Box>

                            {link.description && (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                  fontFamily: '"Noto Sans Sinhala", "Yaldevi", sans-serif',
                                  mb: 2,
                                  lineHeight: 1.4
                                }}
                              >
                                {link.description}
                              </Typography>
                            )}

                            <Button
                              variant="contained"
                              size="small"
                              fullWidth
                              startIcon={<LaunchIcon />}
                              onClick={() => window.open(link.url, '_blank')}
                              sx={{
                                bgcolor: '#ff6b6b',
                                fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                                fontSize: '0.75rem',
                                '&:hover': {
                                  bgcolor: '#ee5a24'
                                }
                              }}
                            >
                              සබැඳිය විවෘත කරන්න
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
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
            bgcolor: '#ff6b6b',
            fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
            fontWeight: 'bold',
            '&:hover': {
              bgcolor: '#ee5a24'
            }
          }}
        >
          හරි
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LiteratureFileDetailsDialog;
