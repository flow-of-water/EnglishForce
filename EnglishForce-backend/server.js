import './src/config/config.js';

import app from "./src/app.js";
// Sequelize 
import db from "./src/sequelize/models/index.js";
const { sequelize } = db;


const port = process.env.PORT || 5000;


// Kết nối Sequelize và khởi động server
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully.');

    await sequelize.sync({ alter: true }); // hoặc { alter: true }
    console.log('📦 Models synchronized with DB');

    app.listen(port, () => {
      console.log(`🚀 Server is running on port ${port}`);
    });
  } catch (err) {
    console.error('❌ Unable to connect to the database:', err);
  }
};
startServer();

