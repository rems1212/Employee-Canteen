import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#4a6fa5', // Soft blue
    },
    secondary: {
      main: '#ff7e5f', // Coral
    },
    background: {
      default: '#f5f7fa', // Light gray
      paper: '#ffffff',
    },
    text: {
      primary: '#333333',
      secondary: '#555555',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});