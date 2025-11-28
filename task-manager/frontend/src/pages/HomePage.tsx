import React from 'react';
import { Box, Typography, Button, Paper, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { TaskAlt, Assignment, Language } from '@mui/icons-material';

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const { isAuthenticated, user } = useAuth();

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          mb: 4, 
          borderRadius: 2,
          backgroundImage: 'linear-gradient(120deg, #e0f7fa 0%, #bbdefb 100%)'
        }}
      >
        <Typography variant="h3" component="h1" gutterBottom>
          {t('app.welcome')}
        </Typography>
        
        {isAuthenticated ? (
          <Typography variant="h5" gutterBottom>
            {t('messages.welcome', { username: user?.username })}
          </Typography>
        ) : (
          <Typography variant="subtitle1" sx={{ mb: 3 }}>
            {t('app.description')}
          </Typography>
        )}

        {!isAuthenticated && (
          <Box sx={{ mt: 4 }}>
            <Button
              component={Link}
              to="/login"
              variant="contained"
              size="large"
              sx={{ mx: 1 }}
            >
              {t('auth.login')}
            </Button>
            <Button
              component={Link}
              to="/register"
              variant="outlined"
              size="large"
              sx={{ mx: 1 }}
            >
              {t('auth.register')}
            </Button>
          </Box>
        )}

        {isAuthenticated && (
          <Button
            component={Link}
            to="/tasks"
            variant="contained"
            size="large"
            sx={{ mt: 2 }}
          >
            {t('navigation.tasks')}
          </Button>
        )}
      </Paper>

      <Grid container spacing={4} justifyContent="center" sx={{ mt: 4 }}>
        <Grid item xs={12} sm={4}>
          <Paper elevation={2} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <TaskAlt fontSize="large" color="primary" sx={{ mb: 2, fontSize: 60 }} />
            <Typography variant="h6" gutterBottom>
              {t('tasks.title')}
            </Typography>
            <Typography>
              {t('tasks.addNew')} • {t('tasks.markComplete')}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <Paper elevation={2} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Assignment fontSize="large" color="primary" sx={{ mb: 2, fontSize: 60 }} />
            <Typography variant="h6" gutterBottom>
              {t('task.priority')}
            </Typography>
            <Typography>
              {t('priority.high')} • {t('priority.medium')} • {t('priority.low')}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <Paper elevation={2} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Language fontSize="large" color="primary" sx={{ mb: 2, fontSize: 60 }} />
            <Typography variant="h6" gutterBottom>
              {t('language.title')}
            </Typography>
            <Typography>
              {t('language.english')} • {t('language.arabic')}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HomePage;
