import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  Box, 
  MenuItem, 
  Select, 
  InputLabel, 
  FormControl,
  Fade,
  Grow,
  Slide,
  Zoom,
  Divider,
  IconButton,
  InputAdornment
} from '@mui/material';
import { 
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  ArrowForward,
  HowToReg
} from '@mui/icons-material';
import { registerUser } from '../api/auth';
import { motion } from 'framer-motion';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [canteen, setCanteen] = useState('canteen 1');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await registerUser({ name, email, password, role, canteen });
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        p: 2
      }}
    >
      <Grow in={true} timeout={500}>
        <Paper elevation={10} sx={{ 
          padding: { xs: 3, sm: 4 },
          width: { xs: '100%', sm: 450 },
          borderRadius: 4,
          overflow: 'hidden',
          position: 'relative',
          '&:before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 8,
            background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
          }
        }}>
          <Box textAlign="center" mb={3}>
            <Zoom in={true} style={{ transitionDelay: '100ms' }}>
              <HowToReg color="primary" sx={{ fontSize: 60 }} />
            </Zoom>
            <Fade in={true} timeout={800}>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700,
                  mt: 1,
                  background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Create Account
              </Typography>
            </Fade>
          </Box>
          
          {error && (
            <Slide in={!!error} direction="down">
              <Typography 
                color="error" 
                align="center" 
                gutterBottom
                sx={{
                  backgroundColor: 'error.light',
                  py: 1,
                  borderRadius: 1,
                  mb: 2
                }}
              >
                {error}
              </Typography>
            </Slide>
          )}
          
          <form onSubmit={handleSubmit}>
            <TextField
              label="Full Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="primary" />
                  </InputAdornment>
                )
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />
            
            <TextField
              label="Email Address"
              variant="outlined"
              fullWidth
              margin="normal"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="primary" />
                  </InputAdornment>
                )
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />
            
            <TextField
              label="Password"
              variant="outlined"
              fullWidth
              margin="normal"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />
            
            <FormControl fullWidth margin="normal" sx={{ mb: 2 }}>
              <InputLabel id="canteen-label">Select Canteen</InputLabel>
              <Select
                labelId="canteen-label"
                value={canteen}
                label="Select Canteen"
                onChange={(e) => setCanteen(e.target.value)}
                required
              >
                <MenuItem value="canteen 1">Canteen 1</MenuItem>
                <MenuItem value="canteen 2">Canteen 2</MenuItem>
                <MenuItem value="canteen 3">Canteen 3</MenuItem>
                <MenuItem value="canteen 4">Canteen 4</MenuItem>
                <MenuItem value="canteen 5">Canteen 5</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth margin="normal">
              <InputLabel id="role-label">Account Type</InputLabel>
              <Select
                labelId="role-label"
                value={role}
                label="Account Type"
                onChange={(e) => setRole(e.target.value)}
                required
                sx={{
                  borderRadius: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              >
                <MenuItem value="user">Standard User</MenuItem>
                <MenuItem value="admin">Administrator</MenuItem>
                <MenuItem value="manager">Manager</MenuItem>
              </Select>
            </FormControl>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                sx={{ 
                  mt: 3,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  fontSize: 16
                }}
                endIcon={<ArrowForward />}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating Account...' : 'Register Now'}
              </Button>
            </motion.div>
          </form>
          
          <Divider sx={{ my: 3 }}>OR</Divider>
          
          <Box textAlign="center">
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Already have an account?
            </Typography>
            <Button
              component={Link}
              to="/"
              color="secondary"
              sx={{ 
                mt: 1,
                fontWeight: 600,
                textTransform: 'none',
                fontSize: 15
              }}
            >
              Sign In Here
            </Button>
          </Box>
        </Paper>
      </Grow>
    </Box>
  );
};

export default RegisterPage;