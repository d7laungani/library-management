import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import api from '../services/api';

interface LibraryStats {
  available: number;
  checkedOut: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<LibraryStats>({
    available: 0,
    checkedOut: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await api.getBookStatus();
      setStats(response.data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Library Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Available Books
              </Typography>
              <Typography variant="h3" color="primary">
                {stats.available}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Checked Out Books
              </Typography>
              <Typography variant="h3" color="secondary">
                {stats.checkedOut}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 