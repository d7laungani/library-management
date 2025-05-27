import { Alert, Snackbar } from '@mui/material';

interface ErrorAlertProps {
  error: string | null;
  onClose: () => void;
}

const ErrorAlert = ({ error, onClose }: ErrorAlertProps) => {
  return (
    <Snackbar
      open={!!error}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
        {error}
      </Alert>
    </Snackbar>
  );
};

export default ErrorAlert; 