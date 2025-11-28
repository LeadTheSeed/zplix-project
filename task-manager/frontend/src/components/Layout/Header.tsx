import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem, Box, Avatar } from '@mui/material';
import { Language as LanguageIcon, AccountCircle, Brightness4, Brightness7 } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ darkMode, toggleDarkMode }) => {
  const { t, i18n } = useTranslation();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  
  // حالات للقوائم المنبثقة
  const [langAnchor, setLangAnchor] = useState<null | HTMLElement>(null);
  const [userAnchor, setUserAnchor] = useState<null | HTMLElement>(null);
  
  // تغيير اللغة
  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setLangAnchor(null);
  };

  // تسجيل الخروج
  const handleLogout = () => {
    logout();
    navigate('/login');
    setUserAnchor(null);
  };

  return (
    <AppBar position="static" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ textDecoration: 'none', color: 'inherit', flexGrow: 1 }}
        >
          {t('app.title')}
        </Typography>

        {/* أزرار التنقل */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          {/* زر تبديل الوضع المظلم/الفاتح */}
          <IconButton color="inherit" onClick={toggleDarkMode}>
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
          
          {/* قائمة اللغات */}
          <IconButton
            color="inherit"
            onClick={(e) => setLangAnchor(e.currentTarget)}
          >
            <LanguageIcon />
          </IconButton>
          <Menu
            anchorEl={langAnchor}
            open={Boolean(langAnchor)}
            onClose={() => setLangAnchor(null)}
          >
            <MenuItem onClick={() => changeLanguage('en')}>
              {t('language.english')}
            </MenuItem>
            <MenuItem onClick={() => changeLanguage('ar')}>
              {t('language.arabic')}
            </MenuItem>
          </Menu>
          
          {/* روابط تسجيل الدخول/التسجيل أو قائمة المستخدم */}
          {isAuthenticated ? (
            <>
              <Button
                color="inherit"
                component={Link}
                to="/tasks"
              >
                {t('navigation.tasks')}
              </Button>
              
              <IconButton
                color="inherit"
                onClick={(e) => setUserAnchor(e.currentTarget)}
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                  {user?.username.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
              
              <Menu
                anchorEl={userAnchor}
                open={Boolean(userAnchor)}
                onClose={() => setUserAnchor(null)}
              >
                <MenuItem
                  component={Link}
                  to="/profile"
                  onClick={() => setUserAnchor(null)}
                >
                  {t('navigation.profile')}
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  {t('auth.logout')}
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button
                color="inherit"
                component={Link}
                to="/login"
              >
                {t('auth.login')}
              </Button>
              <Button
                color="inherit"
                component={Link}
                to="/register"
              >
                {t('auth.register')}
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
