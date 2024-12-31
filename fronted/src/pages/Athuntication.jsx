import { useState, useContext } from 'react';
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Paper,
  Box,
  Grid,
  Snackbar,
  Typography,
  ThemeProvider,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme } from '@mui/material/styles';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';


const defaultTheme = createTheme();

export default function Authentication() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [formState, setFormState] = useState(0);
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const { handleRegister, handleLogin } = useContext(AuthContext);

  const handleCloseSnackbar = () => setOpen(false);
  const router = useNavigate();

  const handleAuth = async () => {
    setError('');
    setIsSubmitting(true);
    try {
      if (formState === 0) {
        // Login
      let result =   await handleLogin(username, password);
        setMessage(result  || 'Login successful!');
        router("/home")
      } else {
        // Register
        const result = await handleRegister(name, username, password);
        setMessage(result || 'Registration successful!');
        router("/home")
       
        // setFormState(0); // Switch to login after registration
      }
      setUsername('');
      setPassword('');
      setName('');
      setOpen(true);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'An unexpected error occurred.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchFormState = (state) => {
    setFormState(state);
    setError(''); // Clear error when switching forms
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        
        <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    sx={{
                        backgroundImage: 'url(/inho-son-OX02tXbM_Xw-unsplash.jpg)',
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: (t) =>
                            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              {formState === 0 ? 'Sign In' : 'Sign Up'}
            </Typography>
            <Box component="form" noValidate sx={{ mt: 1 }}>
              {formState === 1 && (
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="name"
                  label="Full Name"
                  name="name"
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              )}
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoFocus={formState === 0}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && <Typography color="error">{error}</Typography>}
              <Button
                type="button"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleAuth}
                disabled={isSubmitting}
              >
                {formState === 0 ? 'Login' : 'Register'}
              </Button>
            </Box>
            <Box mt={2}>
              <Button variant={formState === 0 ? 'contained' : 'outlined'} onClick={() => switchFormState(0)}>
                Sign In
              </Button>
              <Button variant={formState === 1 ? 'contained' : 'outlined'} onClick={() => switchFormState(1)} sx={{ ml: 2 }}>
                Sign Up
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        message={message}
      />
    </ThemeProvider>
  );
}
