// src/i18n/config.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enCommon from './locales/en/common.json';
// import enCourse from './locales/en/course.json';
// import enExam from './locales/en/exam.json';
// import enProgram from './locales/en/program.json';

import viCommon from './locales/vi/common.json';
// import viCourse from './locales/vi/course.json';
// import viExam from './locales/vi/exam.json';
// import viProgram from './locales/vi/program.json';

// Gộp tất cả translations
const resources = {
  en: {
    common: enCommon,
    // course: enCourse,
    // exam: enExam,
    // program: enProgram,
  },
  vi: {
    common: viCommon,
    // course: viCourse,
    // exam: viExam,
    // program: viProgram,
  },
};

i18n
  // Tự động detect ngôn ngữ
  .use(LanguageDetector)
  // Kết nối với React
  .use(initReactI18next)
  // Khởi tạo i18next
  .init({
    resources,
    lng: 'en',
    // Ngôn ngữ mặc định nếu không detect được
    fallbackLng: 'en',
    
    // Namespace mặc định
    defaultNS: 'common',
    
    // Tất cả namespace có sẵn
    // ns: ['common', 'course', 'exam', 'program'],
    ns: ['common'],
    
    // Cấu hình language detection
    detection: {
      // Thứ tự ưu tiên detect ngôn ngữ
      order: ['localStorage', 'navigator', 'htmlTag'],
      
      // Lưu ngôn ngữ vào localStorage
      caches: ['localStorage'],
      
      // Key trong localStorage
      lookupLocalStorage: 'i18nextLng',
    },

    // React đã tự động escape HTML
    interpolation: {
      escapeValue: false,
    },

    // Bật debug mode trong development
    debug: process.env.NODE_ENV === 'development',

    // React-specific options
    react: {
      // Enable Suspense
      useSuspense: true,
    },
  });

export default i18n;