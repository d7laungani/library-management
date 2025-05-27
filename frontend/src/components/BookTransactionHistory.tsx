import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import type { BookTransaction } from '../services/api';
import api from '../services/api';
import { format } from 'date-fns';

interface BookTransactionHistoryProps {
  bookId: number;
}

export const BookTransactionHistory: React.FC<BookTransactionHistoryProps> = ({ bookId }) => {
  const [transactions, setTransactions] = useState<BookTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await api.getBookTransactions(bookId);
        setTransactions(response.data);
        setError(null);
      } catch (err) {
        setError('Unable to load transaction history');
        console.error('Error fetching transactions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [bookId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={2}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Transaction History
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Notes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{format(new Date(transaction.timestamp), 'PPpp')}</TableCell>
                <TableCell>
                  {transaction.transactionType === 'check_out' ? 'Checked Out' : 'Checked In'}
                </TableCell>
                <TableCell>{transaction.userId || '-'}</TableCell>
                <TableCell>
                  {transaction.dueDate
                    ? format(new Date(transaction.dueDate), 'PP')
                    : '-'}
                </TableCell>
                <TableCell>{transaction.notes || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}; 