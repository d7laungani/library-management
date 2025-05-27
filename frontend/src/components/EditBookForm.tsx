import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
} from '@mui/material';
import api from '../services/api';
import type { Book, UpdateBookDto } from '../services/api';
import ErrorAlert from './ErrorAlert';
import { AxiosError } from 'axios';

interface ErrorResponse {
  message: string | string[];
  error: string;
  statusCode: number;
}

const EditBookForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState<UpdateBookDto>({
    title: '',
    author: '',
    isbn: '',
    description: '',
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadBook(parseInt(id, 10));
    }
  }, [id]);

  const loadBook = async (bookId: number) => {
    try {
      const response = await api.getBook(bookId);
      const book = response.data;
      setFormData({
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        description: book.description,
      });
    } catch (error) {
      setError('Error loading book');
      console.error('Error loading book:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      await api.updateBook(parseInt(id, 10), formData);
      navigate(`/books/${id}`);
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data) {
        const errorData = error.response.data as ErrorResponse;
        if (Array.isArray(errorData.message)) {
          setError(errorData.message.join(', '));
        } else if (typeof errorData.message === 'string') {
          setError(errorData.message);
        } else {
          setError('An error occurred while updating the book');
        }
      } else {
        setError('An error occurred while updating the book');
      }
    }
  };

  return (
    <Box>
      <ErrorAlert error={error} onClose={() => setError(null)} />
      <Typography variant="h4" gutterBottom>
        Edit Book
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
          <TextField
            label="Author"
            name="author"
            value={formData.author}
            onChange={handleChange}
          />
          <TextField
            label="ISBN"
            name="isbn"
            value={formData.isbn}
            onChange={handleChange}
            helperText="Please enter a valid ISBN"
          />
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={4}
          />
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={() => navigate(`/books/${id}`)}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Save Changes
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default EditBookForm; 