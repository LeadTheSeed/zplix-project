import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const GuestRoute: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const { t } = useTranslation();
  
  // إذا كان التطبيق ما زال يتحقق من حالة تسجيل الدخول
  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <CircularProgress size={50} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          {t('loading')}
        </Typography>
      </Box>
    );
  }
  
  // إعادة توجيه المستخدم المسجل إلى صفحة المهام
  return isAuthenticated ? <Navigate to="/tasks" replace /> : <Outlet />;
};

export default GuestRoute;
