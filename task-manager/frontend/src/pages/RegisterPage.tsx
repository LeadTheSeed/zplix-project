import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Link,
  Alert,
  CircularProgress
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { PersonAddAlt1Outlined } from '@mui/icons-material';

const RegisterPage: React.FC = () => {
  const { t } = useTranslation();
  const { register, error, loading, clearError } = useAuth();
  const navigate = useNavigate();
  
  // حالات النموذج
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formErrors, setFormErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // التحقق من صحة النموذج
  const validateForm = (): boolean => {
    let isValid = true;
    const errors = { username: '', email: '', password: '', confirmPassword: '' };

    if (!username) {
      errors.username = t('auth.username') + ' ' + t('validation.required');
      isValid = false;
    } else if (username.length < 3) {
      errors.username = t('validation.usernameLength');
      isValid = false;
    }

    if (!email) {
      errors.email = t('auth.email') + ' ' + t('validation.required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = t('validation.emailInvalid');
      isValid = false;
    }

    if (!password) {
      errors.password = t('auth.password') + ' ' + t('validation.required');
      isValid = false;
    } else if (password.length < 6) {
      errors.password = t('validation.passwordLength');
      isValid = false;
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = t('validation.passwordMatch');
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  // معالجة تقديم النموذج
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validateForm()) {
      return;
    }

    try {
      await register({ username, email, password });
      navigate('/tasks');
    } catch (err) {
      // تم التعامل مع الخطأ في سياق التوثيق
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth: 400,
        mx: 'auto'
      }}
    >
      <Paper elevation={3} sx={{ p: 4, width: '100%', borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <PersonAddAlt1Outlined sx={{ fontSize: 50, color: 'primary.main', mb: 1 }} />
          <Typography component="h1" variant="h5">
            {t('auth.register')}
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={clearError}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label={t('auth.username')}
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={!!formErrors.username}
            helperText={formErrors.username}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label={t('auth.email')}
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!formErrors.email}
            helperText={formErrors.email}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label={t('auth.password')}
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!formErrors.password}
            helperText={formErrors.password}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label={t('auth.confirmPassword')}
            type="password"
            id="confirmPassword"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={!!formErrors.confirmPassword}
            helperText={formErrors.confirmPassword}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, py: 1.2 }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              t('auth.register')
            )}
          </Button>
          
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography>
              {t('auth.haveAccount')}{' '}
              <Link component={RouterLink} to="/login" variant="body2">
                {t('auth.login')}
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default RegisterPage;
