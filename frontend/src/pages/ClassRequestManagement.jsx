import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  School,
  CheckCircle,
  Cancel,
  Visibility,
  Refresh,
  FilterList,
  ArrowBack,
  Pending,
  Assignment,
  Person
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const ClassRequestManagement = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showActionDialog, setShowActionDialog] = useState(false);
  const [actionType, setActionType] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [processing, setProcessing] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');

  useEffect(() => {
    loadRequests();
  }, [statusFilter, gradeFilter]);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const params = new URLSearchParams({
        ...(statusFilter && { status: statusFilter }),
        ...(gradeFilter && { grade: gradeFilter })
      });

      const response = await axios.get(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/class-requests?${params}`,
        { headers: { 'x-auth-token': token } }
      );
      setRequests(response.data.requests || []);

    } catch (error) {
      setError(error.response?.data?.message || 'Failed to load class requests');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAction = async (request, action) => {
    setSelectedRequest(request);
    setActionType(action);
    setShowActionDialog(true);
    setAdminNote('');
  };

  const confirmAction = async () => {
    if (!selectedRequest || !actionType) return;

    setProcessing(true);
    try {
      const token = localStorage.getItem('token');
      const endpoint = actionType === 'approve' ? 'approve' : 'reject';

      await axios.put(
        `https://ayanna-kiyanna-new-backend.onrender.com/api/class-requests/${selectedRequest._id}/${endpoint}`,
        { adminNote },
        { headers: { 'x-auth-token': token } }
      );

      setSuccess(`Class request ${actionType}d successfully`);
      setShowActionDialog(false);
      loadRequests();
    } catch (error) {
      setError(error.response?.data?.message || `Failed to ${actionType} request`);
    } finally {
      setProcessing(false);
    }
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setShowDetailsDialog(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'success';
      case 'Pending': return 'warning';
      case 'Rejected': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved': return <CheckCircle />;
      case 'Pending': return <Pending />;
      case 'Rejected': return <Cancel />;
      default: return null;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  const pendingCount = requests.filter(r => r.status === 'Pending').length;
  const approvedCount = requests.filter(r => r.status === 'Approved').length;
  const rejectedCount = requests.filter(r => r.status === 'Rejected').length;

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      py: 4
    }}>
      <Container maxWidth="xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <Paper elevation={8} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h4" component="h1" sx={{
                fontFamily: '"Gemunu Libre", "Noto Sans Sinhala", sans-serif',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center'
              }}>
                <Assignment sx={{ mr: 2, fontSize: 40 }} />
                Special Class Requests
              </Typography>
              <Button
                variant="outlined"
                startIcon={<ArrowBack />}
                onClick={() => navigate('/admin-dashboard')}
              >
                Back to Dashboard
              </Button>
            </Box>

            {/* Statistics Cards */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Assignment sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h4" fontWeight="bold">{requests.length}</Typography>
                    <Typography variant="body2">Total Requests</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Pending sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h4" fontWeight="bold">{pendingCount}</Typography>
                    <Typography variant="body2">Pending Requests</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', color: '#333' }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <CheckCircle sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h4" fontWeight="bold">{approvedCount}</Typography>
                    <Typography variant="body2">Approved Requests</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', color: '#333' }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Cancel sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h4" fontWeight="bold">{rejectedCount}</Typography>
                    <Typography variant="body2">Rejected Requests</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={loadRequests}
                disabled={processing}
              >
                Refresh
              </Button>
            </Box>
          </Paper>

          {/* Alerts */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
              {success}
            </Alert>
          )}

          {/* Filters */}
          <Paper elevation={6} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <FilterList sx={{ mr: 1 }} />
              Filters
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    label="Status"
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Approved">Approved</MenuItem>
                    <MenuItem value="Rejected">Rejected</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Grade</InputLabel>
                  <Select
                    value={gradeFilter}
                    onChange={(e) => setGradeFilter(e.target.value)}
                    label="Grade"
                  >
                    <MenuItem value="">All Grades</MenuItem>
                    <MenuItem value="Grade 9">Grade 9</MenuItem>
                    <MenuItem value="Grade 10">Grade 10</MenuItem>
                    <MenuItem value="Grade 11">Grade 11</MenuItem>
                    <MenuItem value="A/L">A/L</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>

          {/* Requests Table */}
          <Paper elevation={6} sx={{ borderRadius: 3 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'primary.main' }}>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Student</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Class</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Reason</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {requests.map((request) => (
                    <TableRow key={request._id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Person sx={{ mr: 1, color: 'primary.main' }} />
                          <Box>
                            <Typography variant="body2" fontWeight="bold">
                              {`${request.student?.firstName || ''} ${request.student?.lastName || ''}`.trim()}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {request.student?.studentId}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {request.class?.grade} - {request.class?.category}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {request.class?.date} • {request.class?.startTime}-{request.class?.endTime}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ maxWidth: 200 }}>
                          {request.reason.length > 50 ? `${request.reason.substring(0, 50)}...` : request.reason}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={request.status}
                          color={getStatusColor(request.status)}
                          icon={getStatusIcon(request.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(request.createdAt)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              onClick={() => handleViewDetails(request)}
                              color="primary"
                            >
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                          {request.status === 'Pending' && (
                            <>
                              <Tooltip title="Approve">
                                <IconButton
                                  size="small"
                                  onClick={() => handleRequestAction(request, 'approve')}
                                  color="success"
                                >
                                  <CheckCircle />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Reject">
                                <IconButton
                                  size="small"
                                  onClick={() => handleRequestAction(request, 'reject')}
                                  color="error"
                                >
                                  <Cancel />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {/* Request Details Dialog */}
          <Dialog open={showDetailsDialog} onClose={() => setShowDetailsDialog(false)} maxWidth="md" fullWidth>
            <DialogTitle>
              Class Request Details
            </DialogTitle>
            <DialogContent>
              {selectedRequest && (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>Student Information</Typography>
                    <Typography><strong>Name:</strong> {`${selectedRequest.student?.firstName || ''} ${selectedRequest.student?.lastName || ''}`.trim()}</Typography>
                    <Typography><strong>Student ID:</strong> {selectedRequest.student?.studentId}</Typography>
                    <Typography><strong>Grade:</strong> {selectedRequest.student?.selectedGrade}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>Class Information</Typography>
                    <Typography><strong>Class:</strong> {selectedRequest.class?.grade} - {selectedRequest.class?.category}</Typography>
                    <Typography><strong>Schedule:</strong> {selectedRequest.class?.date} • {selectedRequest.class?.startTime}-{selectedRequest.class?.endTime}</Typography>
                    <Typography><strong>Venue:</strong> {selectedRequest.class?.venue}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>Request Details</Typography>
                    <Typography><strong>Reason:</strong></Typography>
                    <Typography sx={{ mt: 1, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
                      {selectedRequest.reason}
                    </Typography>
                    <Typography sx={{ mt: 2 }}><strong>Status:</strong></Typography>
                    <Chip
                      label={selectedRequest.status}
                      color={getStatusColor(selectedRequest.status)}
                      icon={getStatusIcon(selectedRequest.status)}
                      sx={{ mt: 1 }}
                    />
                    <Typography sx={{ mt: 2 }}><strong>Submitted:</strong> {formatDate(selectedRequest.createdAt)}</Typography>
                    {selectedRequest.adminResponse?.actionNote && (
                      <>
                        <Typography sx={{ mt: 2 }}><strong>Admin Response:</strong></Typography>
                        <Typography sx={{ mt: 1, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
                          {selectedRequest.adminResponse.actionNote}
                        </Typography>
                      </>
                    )}
                  </Grid>
                </Grid>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowDetailsDialog(false)}>Close</Button>
            </DialogActions>
          </Dialog>

          {/* Action Confirmation Dialog */}
          <Dialog open={showActionDialog} onClose={() => setShowActionDialog(false)} maxWidth="sm" fullWidth>
            <DialogTitle>
              {actionType === 'approve' ? 'Approve' : 'Reject'} Class Request
            </DialogTitle>
            <DialogContent>
              <Typography gutterBottom>
                Are you sure you want to {actionType} this class enrollment request?
              </Typography>
              {selectedRequest && (
                <Box sx={{ mt: 2, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="body2">
                    <strong>Student:</strong> {`${selectedRequest.student?.firstName || ''} ${selectedRequest.student?.lastName || ''}`.trim()} ({selectedRequest.student?.studentId})
                  </Typography>
                  <Typography variant="body2">
                    <strong>Class:</strong> {selectedRequest.class?.grade} - {selectedRequest.class?.category}
                  </Typography>
                </Box>
              )}
              <TextField
                fullWidth
                label="Admin Note (Optional)"
                multiline
                rows={3}
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                sx={{ mt: 2 }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowActionDialog(false)} disabled={processing}>
                Cancel
              </Button>
              <Button
                onClick={confirmAction}
                variant="contained"
                color={actionType === 'approve' ? 'success' : 'error'}
                disabled={processing}
                startIcon={processing ? <CircularProgress size={20} /> : null}
              >
                {processing ? 'Processing...' : actionType === 'approve' ? 'Approve' : 'Reject'}
              </Button>
            </DialogActions>
          </Dialog>
        </motion.div>
      </Container>
    </Box>
  );
};

export default ClassRequestManagement;
