import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const ProtectedRoute: React.FC = () => {
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
  
  // إعادة توجيه المستخدم غير المسجل إلى صفحة تسجيل الدخول
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
