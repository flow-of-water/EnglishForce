// src/i18n/config.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enCommon from './locales/en/common.json';
import enCourse from './locales/en/course.json';
import enExam from './locales/en/exam.json';
import enProgram from './locales/en/program.json';
import enUser from './locales/en/user.json';
import enUnimportant from './locales/en/unimportant.json';

import viCommon from './locales/vi/common.json';
import viCourse from './locales/vi/course.json';
import viExam from './locales/vi/exam.json';
import viProgram from './locales/vi/program.json';
import viUser from './locales/vi/user.json';
import viUnimportant from './locales/vi/unimportant.json';

// Gộp tất cả translations
const resources = {
	en: {
		common: enCommon,
		course: enCourse,
		exam: enExam,
		program: enProgram,
		user: enUser,
		unimportant: enUnimportant,
	},
	vi: {
		common: viCommon,
		course: viCourse,
		exam: viExam,
		program: viProgram,
		user: viUser,
		unimportant: viUnimportant,
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
		// Ngôn ngữ mặc định nếu không detect được
		fallbackLng: 'en',

		// Namespace mặc định
		defaultNS: 'common',

		// Tất cả namespace có sẵn
		ns: ['common', 'course', 'exam', 'program', 'user', 'unimportant'],

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
