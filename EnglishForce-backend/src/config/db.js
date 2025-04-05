import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

var db;

// Local db using localhost
if (process.env.NODE_ENV === "local") {
  db = new pg.Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });
}

// Deploy db 
else {
  db = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    statement_timeout: 0, // Tắt prepared statements
  });
}

export default db;