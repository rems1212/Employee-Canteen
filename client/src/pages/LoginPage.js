import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  TextField, 
  Button, 
  Typography, 
  Box, 
  IconButton,
  InputAdornment,
  Fade,
  Divider,
  CircularProgress
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff,
  AlternateEmail,
  LockPerson,
  Login,
  ArrowRightAlt
} from '@mui/icons-material';
import { loginUser } from '../api/auth';
import { styled, keyframes } from '@mui/system';
import { motion } from 'framer-motion';
import ErrorBoundary from '../components/ErrorBoundary';

// Animation keyframes
const float = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(2deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(74, 108, 247, 0.4); }
  70% { box-shadow: 0 0 0 15px rgba(74, 108, 247, 0); }
  100% { box-shadow: 0 0 0 0 rgba(74, 108, 247, 0); }
`;

// Styled components
const GlassCard = styled(Box)(({ theme }) => ({
  backdropFilter: 'blur(16px) saturate(180%)',
  backgroundColor: 'rgba(255, 255, 255, 0.75)',
  borderRadius: '24px',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
  padding: '48px',
  width: '100%',
  maxWidth: '480px',
  position: 'relative',
  overflow: 'hidden',
  zIndex: 2,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: `linear-gradient(
      45deg,
      transparent 0%,
      rgba(74, 108, 247, 0.05) 50%,
      transparent 100%
    )`,
    animation: `${float} 15s linear infinite`,
    zIndex: -1,
  }
}));

const AnimatedTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    transition: 'all 0.3s ease',
    '& fieldset': {
      borderColor: 'rgba(0, 0, 0, 0.08)',
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.light,
      boxShadow: '0 0 0 4px rgba(74, 108, 247, 0.1)'
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
      boxShadow: `0 0 0 4px ${theme.palette.primary.light}`
    },
  },
  '& .MuiInputLabel-root': {
    color: theme.palette.text.secondary,
    transform: 'translate(14px, 16px) scale(1)',
  },
  '& .MuiInputLabel-shrink': {
    transform: 'translate(14px, -6px) scale(0.85)',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: '0 8px',
    borderRadius: '12px'
  },
}));

const AuthButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #4a6cf7 0%, #2541b2 100%)',
  color: 'white',
  borderRadius: '12px',
  padding: '16px 32px',
  fontWeight: 600,
  fontSize: '1rem',
  textTransform: 'none',
  letterSpacing: '0.5px',
  boxShadow: '0 4px 20px rgba(74, 108, 247, 0.3)',
  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(74, 108, 247, 0.4)',
    '&::before': {
      opacity: 1
    }
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 100%)',
    opacity: 0,
    transition: 'opacity 0.3s ease'
  },
  '&:active': {
    transform: 'translateY(0)'
  }
}));

const FloatingShape = styled(Box)(({ theme }) => ({
  position: 'absolute',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, rgba(74, 108, 247, 0.1) 0%, rgba(74, 108, 247, 0) 100%)',
  filter: 'blur(2px)',
  zIndex: 1
}));

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const response = await loginUser({ email, password });
      localStorage.setItem('token', response.token);
      // Redirect based on role
      if (response.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (response.user.role === 'manager') {
        navigate('/manager/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        sx={{
          background: 'linear-gradient(135deg, #f0f4ff 0%, #e6ebfa 100%)',
          position: 'relative',
          overflow: 'hidden',
          padding: '24px'
        }}
      >
        {/* Floating background shapes */}
        <FloatingShape sx={{ 
          width: '600px', 
          height: '600px', 
          top: '-300px', 
          right: '-300px',
          animation: `${pulse} 8s infinite`
        }} />
        
        <FloatingShape sx={{ 
          width: '400px', 
          height: '400px', 
          bottom: '-200px', 
          left: '-200px',
          animation: `${pulse} 10s infinite 2s`
        }} />
        
        <FloatingShape sx={{ 
          width: '300px', 
          height: '300px', 
          top: '20%', 
          left: '10%',
          animation: `${pulse} 12s infinite 1s`
        }} />
        
        <FloatingShape sx={{ 
          width: '200px', 
          height: '200px', 
          bottom: '15%', 
          right: '10%',
          animation: `${pulse} 9s infinite 1.5s`
        }} />

      <div
        style={{ opacity: 1, transform: 'translateY(0px)' }}
      >
        <GlassCard>
          <Box textAlign="center" mb={4}>
            <div
              style={{
                transform: 'translateY(0px) rotate(0deg)',
                animation: 'none'
              }}
            >
              <Login color="primary" sx={{ fontSize: 60 }} />
            </div>
            
            <Typography 
              variant="h3" 
              sx={{
                fontWeight: 800,
                background: 'linear-gradient(90deg, #4a6cf7 0%, #2541b2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1,
                mt: 2
              }}
            >
              Welcome Back
            </Typography>
            
            <Typography 
              variant="subtitle1" 
              color="textSecondary"
              sx={{ 
                letterSpacing: '0.5px',
                maxWidth: '320px',
                mx: 'auto'
              }}
            >
              Sign in to access your CanteenPro dashboard
            </Typography>
          </Box>
          
          <Fade in={!!error}>
            <Box sx={{ 
              backgroundColor: 'rgba(255, 0, 0, 0.05)',
              padding: '12px 16px',
              borderRadius: '12px',
              borderLeft: '4px solid #ff4444',
              mb: 3,
              display: 'flex',
              alignItems: 'center'
            }}>
              <Box sx={{ 
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 0, 0, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2
              }}>
                <Typography color="error" variant="body2">!</Typography>
              </Box>
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            </Box>
          </Fade>
          
          <form onSubmit={handleSubmit}>
            <AnimatedTextField
              label="Email Address"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AlternateEmail color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />
            
            <AnimatedTextField
              label="Password"
              variant="outlined"
              fullWidth
              margin="normal"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockPerson color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: 'text.secondary' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 1 }}
            />
            
            <Box textAlign="right" sx={{ mb: 3 }}>
              <Link 
                to="/forgot-password" 
                style={{ 
                  color: '#4a6cf7',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center'
                }}
              >
                Forgot password?
                <ArrowRightAlt sx={{ fontSize: '1rem', ml: 0.5 }} />
              </Link>
            </Box>
            
            <div
              style={{ display: 'inline-block', width: '100%' }}
            >
              <AuthButton
                type="submit"
                fullWidth
                disabled={isLoading}
                endIcon={!isLoading && <ArrowRightAlt />}
              >
                {isLoading ? (
                  <>
                    <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                    Authenticating...
                  </>
                ) : (
                  'Sign In'
                )}
              </AuthButton>
            </div>
          </form>
          
          <Divider sx={{ my: 4, color: 'text.secondary' }}>or continue with</Divider>
          
          <Box textAlign="center" sx={{ mt: 3 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
              Don't have an account?
            </Typography>
            <Link 
              to="/register" 
              style={{ 
                color: '#4a6cf7',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.95rem',
                display: 'inline-flex',
                alignItems: 'center'
              }}
            >
              Create new account
              <ArrowRightAlt sx={{ fontSize: '1rem', ml: 0.5 }} />
            </Link>
          </Box>
        </GlassCard>
      </div>
      </Box>
    </ErrorBoundary>
  );
};

export default LoginPage;
