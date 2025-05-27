import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  TextField,
  CircularProgress,
} from '@mui/material';
import api from '../services/api';
import type { Book } from '../services/api';
import { BookTransactionHistory } from './BookTransactionHistory';
import { format, addDays } from 'date-fns';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [checkOutDialogOpen, setCheckOutDialogOpen] = useState(false);
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadBook(parseInt(id, 10));
    }
  }, [id]);

  const loadBook = async (bookId: number) => {
    try {
      const response = await api.getBook(bookId);
      setBook(response.data);
    } catch (error) {
      console.error('Error loading book:', error);
      navigate('/');
    }
  };

  const handleCheckOut = async () => {
    if (!book) return;
    try {
      setLoading(true);
      const dueDate = format(addDays(new Date(), 14), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
      await api.checkOutBook(book.id, userId, dueDate);
      setCheckOutDialogOpen(false);
      loadBook(book.id);
    } catch (error) {
      console.error('Error checking out book:', error);
      setError('Failed to check out book');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (!book) return;
    try {
      setLoading(true);
      await api.checkInBook(book.id);
      loadBook(book.id);
    } catch (error) {
      console.error('Error checking in book:', error);
      setError('Failed to check in book');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!book) return;
    try {
      await api.deleteBook(book.id);
      navigate('/');
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  if (!book) {
    return (
      <Box display="flex" justifyContent="center" p={2}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Book Details</Typography>
        <Box>
          <Button variant="outlined" onClick={() => navigate('/')} sx={{ mr: 1 }}>
            Back to List
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => navigate(`/books/${id}/edit`)}
            sx={{ mr: 1 }}
          >
            Edit
          </Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={() => setDeleteDialogOpen(true)}
          >
            Delete
          </Button>
        </Box>
      </Box>
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom>
              {book.title}
            </Typography>
            <Chip
              label={book.status}
              color={book.status === 'available' ? 'success' : 'warning'}
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Author</Typography>
            <Typography variant="body1" gutterBottom>
              {book.author}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">ISBN</Typography>
            <Typography variant="body1" gutterBottom>
              {book.isbn}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1">Description</Typography>
            <Typography variant="body1" paragraph>
              {book.description}
            </Typography>
          </Grid>
          {book.status === 'checked_out' && (
            <>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Checked Out By</Typography>
                <Typography variant="body1">{book.checkedOutBy}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Due Date</Typography>
                <Typography variant="body1">
                  {book.dueDate ? new Date(book.dueDate).toLocaleDateString() : 'N/A'}
                </Typography>
              </Grid>
            </>
          )}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              {book.status === 'available' ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setCheckOutDialogOpen(true)}
                >
                  Check Out
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleCheckIn}
                  disabled={loading}
                >
                  Check In
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <BookTransactionHistory bookId={book.id} />

      {/* Check Out Dialog */}
      <Dialog open={checkOutDialogOpen} onClose={() => setCheckOutDialogOpen(false)}>
        <DialogTitle>Check Out Book</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="userId"
            label="User ID"
            type="text"
            fullWidth
            variant="outlined"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCheckOutDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleCheckOut}
            disabled={!userId || loading}
            variant="contained"
            color="primary"
          >
            Check Out
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Book</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{book.title}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BookDetails; 