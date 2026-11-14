import './src/config/config.js';

import app from './src/app.js';
// Sequelize
import db from './src/sequelize/models/index.js';
import { deleteExpiredRefreshTokens } from './src/services/auth/refreshToken.service.js';
const { sequelize } = db;

const port = process.env.PORT || 5000;
const isDevelopment = process.env.NODE_ENV == 'development';

// Kết nối Sequelize và khởi động server
const startServer = async () => {
	try {
		await sequelize.authenticate();
		console.log('✅ Database connected successfully.');

		// Schema is managed by migrations (npx sequelize-cli db:migrate).
		// sync() here only creates missing tables on a fresh DB — it never alters existing ones.
		await sequelize.sync();
		console.log('📦 Models synchronized with DB');

		// Clean up expired refresh tokens: upon startup and every 24 hours
		const cleanupRefreshTokens = () =>
			deleteExpiredRefreshTokens().catch(err => console.error('⚠️ Failed to clean up refresh tokens:', err));
		cleanupRefreshTokens();
		setInterval(cleanupRefreshTokens, 24 * 60 * 60 * 1000).unref();

		app.listen(port, () => {
			console.log(`🚀 Server is running on port ${port}`);
		});
	} catch (err) {
		console.error('❌ Unable to connect to the database:', err);
	}
};
startServer();
