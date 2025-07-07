import React, { useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Switch, Box, Container, Typography } from '@mui/material';
import Calendar from './components/Calendar';

// Define Notion-inspired themes
const getTheme = (mode: 'light' | 'dark') =>
  createTheme({
    palette: {
      mode,
      primary: { main: '#3f51b5' }, // Soft blue for buttons
      background: {
        default: mode === 'light' ? '#fafafa' : '#121212',
        paper: mode === 'light' ? '#fff' : '#1e1e1e',
      },
    },
    typography: {
      fontFamily: 'Roboto, sans-serif',
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: '8px',
          },
        },
      },
    },
  });

const App: React.FC = () => {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeProvider theme={getTheme(mode)}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1">
            Nahom's Event Calendar
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ mr: 1 }}>{mode === 'light' ? 'Light' : 'Dark'} Mode</Typography>
            <Switch checked={mode === 'dark'} onChange={toggleTheme} />
          </Box>
        </Box>
        <Calendar />
      </Container>
    </ThemeProvider>
  );
};

export default App;