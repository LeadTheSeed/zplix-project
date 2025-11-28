import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useTranslation } from 'react-i18next';
import { AuthProvider } from './contexts/AuthContext';

// مكونات التخطيط
import Layout from './components/Layout/Layout';

// مكونات المسارات المحمية
import ProtectedRoute from './components/Auth/ProtectedRoute';
import GuestRoute from './components/Auth/GuestRoute';

// صفحات التطبيق
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TasksPage from './pages/TasksPage';
import NotFoundPage from './pages/NotFoundPage';

const App: React.FC = () => {
  const { i18n } = useTranslation();

  return (
    <AuthProvider>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Router>
          <Routes>
            {/* المسار الرئيسي مع تخطيط مشترك */}
            <Route path="/" element={<Layout />}>
              {/* الصفحة الرئيسية */}
              <Route index element={<HomePage />} />
              
              {/* مسارات للزوار فقط */}
              <Route element={<GuestRoute />}>
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
              </Route>
              
              {/* مسارات محمية للمستخدمين المسجلين فقط */}
              <Route element={<ProtectedRoute />}>
                <Route path="tasks" element={<TasksPage />} />
                {/* يمكن إضافة المزيد من المسارات المحمية هنا */}
              </Route>
              
              {/* صفحة غير موجودة */}
              <Route path="404" element={<NotFoundPage />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Route>
          </Routes>
        </Router>
      </LocalizationProvider>
    </AuthProvider>
  );
};

export default App;
