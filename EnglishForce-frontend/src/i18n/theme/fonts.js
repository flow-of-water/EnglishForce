export const FONT_CONFIG = {
  vi: {
    primary: 'Inter',
    fallbacks: [
      'Be Vietnam Pro',
      'Noto Sans',
      '-apple-system',
      'BlinkMacSystemFont',
      'sans-serif',
    ],
  },
  en: {
    primary: 'Roboto',
    fallbacks: [
      '"Helvetica Neue"',
      'Arial',
      '-apple-system',
      'BlinkMacSystemFont',
      'sans-serif',
    ],
  },
};

export const getFontFamily = (language = 'vi') => {
  const config = FONT_CONFIG[language] || FONT_CONFIG.vi;
  return [config.primary, ...config.fallbacks].join(',');
};

/**
 * Google Fonts URLs
 */
export const GOOGLE_FONTS_URLS = {
  vi: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Be+Vietnam+Pro:wght@300;400;500;600;700&family=Noto+Sans:wght@300;400;500;600;700&display=swap',
  en: 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap',
};