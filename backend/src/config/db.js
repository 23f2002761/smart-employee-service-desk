const sql = require("mssql");

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

let pool;

const connectDB = async () => {
  try {
    pool = await sql.connect(dbConfig);
    console.log("SQL Server connected");
    return pool;
  } catch (error) {
    console.error("Database connection failed:", error);
    throw error;
  }
};

const getPool = () => {
  if (!pool) {
    throw new Error("Database connection has not been initialized");
  }

  return pool;
};

module.exports = {
  sql,
  connectDB,
  getPool
};