import { useMemo, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useTranslation } from 'react-i18next';
import { createAppTheme } from './theme/theme';
import { GOOGLE_FONTS_URLS } from './theme/fonts';

/**
 * Load Google Fonts dynamically
 */
export const loadGoogleFonts = (language) => {
  const fontUrl = GOOGLE_FONTS_URLS[language] || GOOGLE_FONTS_URLS.vi;
  
  const existingLink = document.querySelector(`link[data-lang="${language}"]`);
  if (existingLink) return;
  

  // Preconnect
  const preconnect1 = document.createElement('link');
  preconnect1.rel = 'preconnect';
  preconnect1.href = 'https://fonts.googleapis.com';
  
  const preconnect2 = document.createElement('link');
  preconnect2.rel = 'preconnect';
  preconnect2.href = 'https://fonts.gstatic.com';
  preconnect2.crossOrigin = 'anonymous';

  // Font link
  const fontLink = document.createElement('link');
  fontLink.rel = 'stylesheet';
  fontLink.href = fontUrl;
  fontLink.setAttribute('data-lang', language);

  document.head.appendChild(preconnect1);
  document.head.appendChild(preconnect2);
  document.head.appendChild(fontLink);
  
  console.log('📝 Loaded fonts for:', language);
};

/**
 * Custom ThemeProvider tự động đổi theme theo ngôn ngữ
 */
export const AppThemeProvider = ({ children }) => {
  const { i18n } = useTranslation();
  
  useEffect(() => {
    loadGoogleFonts(i18n.language);
  }, [i18n.language]);
  
  // Tạo theme mới khi ngôn ngữ thay đổi
  const theme = useMemo(() => {
    console.log('🎨 Creating theme for language:', i18n.language);
    return createAppTheme(i18n.language);
  }, [i18n.language]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};