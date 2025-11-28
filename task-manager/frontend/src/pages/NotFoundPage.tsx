import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Home as HomeIcon } from '@mui/icons-material';

const NotFoundPage: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '60vh',
        textAlign: 'center'
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 5,
          borderRadius: 2,
          maxWidth: 500,
          width: '100%'
        }}
      >
        <Typography variant="h1" component="h1" sx={{ mb: 2, fontWeight: 'bold' }}>
          404
        </Typography>
        
        <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
          {t('errors.pageNotFound')}
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          {t('errors.pageNotFoundDesc')}
        </Typography>
        
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/"
          startIcon={<HomeIcon />}
          size="large"
        >
          {t('navigation.home')}
        </Button>
      </Paper>
    </Box>
  );
};

export default NotFoundPage;
