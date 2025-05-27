import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Library Management System
        </Typography>
        <Box>
          <Button color="inherit" component={RouterLink} to="/">
            Books
          </Button>
          <Button color="inherit" component={RouterLink} to="/books/new">
            Add Book
          </Button>
          <Button color="inherit" component={RouterLink} to="/books/report">
            Book Report
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 