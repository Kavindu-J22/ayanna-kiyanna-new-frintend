import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  IconButton,
  LinearProgress,
  Alert,
  Grid,
  TextField
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  PictureAsPdf as PictureAsPdfIcon,
  Image as ImageIcon
} from '@mui/icons-material';

const CloudinaryUpload = ({ 
  onUploadSuccess, 
  onUploadError, 
  maxFiles = 5, 
  acceptedTypes = ['image/*', 'application/pdf'],
  existingFiles = [],
  onRemoveFile
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');

  const cloudName = 'dl9k5qoae';
  const uploadPreset = 'ml_default';

  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return;

    const totalFiles = existingFiles.length + files.length;
    if (totalFiles > maxFiles) {
      setError(`උපරිම ගොනු සංඛ්‍යාව ${maxFiles} ක් පමණි`);
      return;
    }

    setUploading(true);
    setError('');
    setUploadProgress(0);

    const uploadedFiles = [...existingFiles]; // Start with existing files
    let successfulUploads = 0;

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Validate file type
        const isValidType = acceptedTypes.some(type => {
          if (type === 'image/*') {
            return file.type.startsWith('image/');
          } else if (type === 'application/pdf') {
            return file.type === 'application/pdf';
          }
          return file.type === type;
        });

        if (!isValidType) {
          setError(`අවලංගු ගොනු වර්ගය: ${file.name}`);
          continue;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          setError(`ගොනුව ඉතා විශාලයි: ${file.name} (උපරිම 10MB)`);
          continue;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);
        formData.append('cloud_name', cloudName);

        // Determine resource type
        const resourceType = file.type.startsWith('image/') ? 'image' : 'raw';
        formData.append('resource_type', resourceType);

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
          {
            method: 'POST',
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error(`Upload failed for ${file.name}`);
        }

        const data = await response.json();

        const uploadedFile = {
          title: file.name.split('.')[0],
          description: '',
          url: data.secure_url,
          publicId: data.public_id,
          type: file.type.startsWith('image/') ? 'image' : 'pdf',
          size: file.size,
          name: file.name // This is the required field in the schema
        };

        uploadedFiles.push(uploadedFile);
        successfulUploads++;
        setUploadProgress(((i + 1) / files.length) * 100);
      }

      if (successfulUploads > 0) {
        onUploadSuccess(uploadedFiles); // Pass all files including existing ones
      }
    } catch (error) {
      console.error('Upload error:', error);
      setError('ගොනු උඩුගත කිරීමේදී දෝෂයක් ඇති විය');
      onUploadError && onUploadError(error);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    handleFileUpload(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFileUpload(files);
  };

  const updateFileDetails = (index, field, value) => {
    const updatedFiles = [...existingFiles];
    if (updatedFiles[index]) {
      updatedFiles[index][field] = value;
      onUploadSuccess(updatedFiles);
    }
  };

  return (
    <Box>
      {/* Upload Area */}
      <Card
        sx={{
          border: '2px dashed #e91e63',
          borderRadius: 2,
          p: 3,
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: '#c2185b',
            bgcolor: '#fce4ec'
          }
        }}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => document.getElementById('file-upload').click()}
      >
        <CloudUploadIcon sx={{ fontSize: 48, color: '#e91e63', mb: 2 }} />
        <Typography variant="h6" sx={{ mb: 1, color: '#e91e63', fontWeight: 'bold' }}>
          ගොනු උඩුගත කරන්න
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          ගොනු මෙහි ඇද දමන්න හෝ ක්ලික් කරන්න
        </Typography>
        <Typography variant="caption" color="text.secondary">
          සහාය වන ගොනු: පින්තූර (JPG, PNG) සහ PDF | උපරිම ප්‍රමාණය: 10MB | උපරිම ගොනු: {maxFiles}
        </Typography>
        
        <input
          id="file-upload"
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
      </Card>

      {/* Upload Progress */}
      {uploading && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            උඩුගත කරමින්... {Math.round(uploadProgress)}%
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={uploadProgress} 
            sx={{ 
              height: 8, 
              borderRadius: 4,
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#e91e63'
              }
            }} 
          />
        </Box>
      )}

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Uploaded Files */}
      {existingFiles.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, color: '#e91e63', fontWeight: 'bold' }}>
            උඩුගත කරන ලද ගොනු ({existingFiles.length}/{maxFiles})
          </Typography>
          
          <Grid container spacing={2}>
            {existingFiles.map((file, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ 
                  border: '1px solid #e0e0e0',
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': { boxShadow: '0 4px 8px rgba(233, 30, 99, 0.2)' }
                }}>
                  <CardContent sx={{ p: 2 }}>
                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                      <Box display="flex" alignItems="center">
                        {file.type === 'pdf' ? (
                          <PictureAsPdfIcon sx={{ color: '#f44336', mr: 1 }} />
                        ) : (
                          <ImageIcon sx={{ color: '#4caf50', mr: 1 }} />
                        )}
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          {file.type === 'pdf' ? 'PDF' : 'පින්තූරය'}
                        </Typography>
                      </Box>
                      
                      <IconButton
                        size="small"
                        onClick={() => onRemoveFile(index)}
                        sx={{ color: '#f44336' }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>

                    {/* Preview for images */}
                    {file.type === 'image' && (
                      <Box sx={{ mb: 2 }}>
                        <img 
                          src={file.url} 
                          alt={file.title}
                          style={{ 
                            width: '100%', 
                            height: '120px', 
                            objectFit: 'cover', 
                            borderRadius: '8px' 
                          }}
                        />
                      </Box>
                    )}

                    {/* File Details */}
                    <TextField
                      fullWidth
                      label="ගොනු නම"
                      value={file.title}
                      onChange={(e) => updateFileDetails(index, 'title', e.target.value)}
                      margin="normal"
                      size="small"
                    />
                    
                    <TextField
                      fullWidth
                      label="විස්තරය (විකල්ප)"
                      value={file.description}
                      onChange={(e) => updateFileDetails(index, 'description', e.target.value)}
                      margin="normal"
                      size="small"
                      multiline
                      rows={2}
                    />

                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      ප්‍රමාණය: {(file.size / 1024 / 1024).toFixed(2)} MB
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Upload Button */}
      {!uploading && existingFiles.length < maxFiles && (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<CloudUploadIcon />}
            onClick={() => document.getElementById('file-upload').click()}
            sx={{
              borderColor: '#e91e63',
              color: '#e91e63',
              '&:hover': {
                borderColor: '#c2185b',
                bgcolor: '#fce4ec'
              }
            }}
          >
            තවත් ගොනු එක් කරන්න
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default CloudinaryUpload;
