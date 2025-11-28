import React, { useState } from 'react';
import { Box, Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { useTranslation } from 'react-i18next';
import rtlPlugin from 'stylis-plugin-rtl';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';

// إنشاء خبيئة للغة العربية
const rtlCache = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

// إنشاء خبيئة للغة الإنجليزية
const ltrCache = createCache({
  key: 'muiltr',
  stylisPlugins: [prefixer],
});

const Layout: React.FC = () => {
  const { i18n } = useTranslation();
  const [darkMode, setDarkMode] = useState(false);

  // تبديل الوضع المظلم/الفاتح
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // إنشاء السمة استنادًا إلى الوضع المظلم واللغة
  const theme = createTheme({
    direction: i18n.language === 'ar' ? 'rtl' : 'ltr',
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#2196f3', // أزرق
      },
      secondary: {
        main: '#f50057', // وردي
      },
    },
    typography: {
      fontFamily: i18n.language === 'ar' 
        ? '"Tajawal", "Roboto", "Helvetica", "Arial", sans-serif'
        : '"Roboto", "Helvetica", "Arial", sans-serif',
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
    },
  });

  return (
    <CacheProvider value={i18n.language === 'ar' ? rtlCache : ltrCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
          }}
        >
          <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          <Container
            component="main"
            sx={{
              mt: 4,
              mb: 4,
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Outlet />
          </Container>
          <Footer />
        </Box>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default Layout;
