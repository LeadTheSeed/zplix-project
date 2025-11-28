import React from 'react';
import { Box, Container, Typography, Link } from '@mui/material';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
  const { i18n } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.grey[100],
        color: (theme) => theme.palette.text.secondary,
        borderTop: '1px solid',
        borderColor: 'divider',
        textAlign: 'center',
        direction: i18n.language === 'ar' ? 'rtl' : 'ltr'
      }}
    >
      <Container maxWidth="sm">
        <Typography variant="body2">
          {i18n.language === 'ar' ? (
            <>
              © {currentYear} مدير المهام | تم إنشاؤه بواسطة{' '}
              <Link color="inherit" href="https://zplix.com" target="_blank" rel="noopener">
                Zplix
              </Link>
            </>
          ) : (
            <>
              © {currentYear} Task Manager | Created by{' '}
              <Link color="inherit" href="https://zplix.com" target="_blank" rel="noopener">
                Zplix
              </Link>
            </>
          )}
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
