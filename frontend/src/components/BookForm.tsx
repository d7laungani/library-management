import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
} from '@mui/material';
import api from '../services/api';
import type { CreateBookDto } from '../services/api';
import ErrorAlert from './ErrorAlert';
import { AxiosError } from 'axios';

interface ErrorResponse {
  message: string | string[];
  error: string;
  statusCode: number;
}

const BookForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CreateBookDto>({
    title: '',
    author: '',
    isbn: '',
    description: '',
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createBook(formData);
      navigate('/');
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data) {
        // Handle validation errors
        const errorData = error.response.data as ErrorResponse;
        if (Array.isArray(errorData.message)) {
          setError(errorData.message.join(', '));
        } else if (typeof errorData.message === 'string') {
          setError(errorData.message);
        } else {
          setError('An error occurred while creating the book');
        }
      } else {
        setError('An error occurred while creating the book');
      }
    }
  };

  return (
    <Box>
      <ErrorAlert error={error} onClose={() => setError(null)} />
      <Typography variant="h4" gutterBottom>
        Add New Book
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            required
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
          <TextField
            required
            label="Author"
            name="author"
            value={formData.author}
            onChange={handleChange}
          />
          <TextField
            required
            label="ISBN"
            name="isbn"
            value={formData.isbn}
            onChange={handleChange}
            helperText="Please enter a valid ISBN"
          />
          <TextField
            required
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={4}
          />
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={() => navigate('/')}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Add Book
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default BookForm; 