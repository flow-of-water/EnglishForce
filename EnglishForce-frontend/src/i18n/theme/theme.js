import { createTheme } from '@mui/material/styles';
import { getFontFamily } from './fonts';

export const createAppTheme = (language = 'vi') => {
  const fontFamily = getFontFamily(language);

  return createTheme({
    typography: {
      fontFamily
    }
  });
};