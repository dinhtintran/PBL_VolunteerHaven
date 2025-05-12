import { Pool } from "pg";

const pool = new Pool({
  user: "root",
  host: "localhost",
  database: "charityHaven",
  password: "123456",
  port: 5432, // Cổng mặc định của PostgreSQL
});

const initializeDatabase = async () => {
  try {
    // Tạo bảng users
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password TEXT NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        fullName VARCHAR(100),
        userType VARCHAR(20) CHECK (userType IN ('admin', 'organization', 'donor')),
        bio TEXT,
        profileImage TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        isApproved BOOLEAN DEFAULT FALSE,
        isActive BOOLEAN DEFAULT TRUE
      );
    `);

    // Tạo bảng categories
    await pool.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL UNIQUE,
        description TEXT,
        imageUrl TEXT,
        campaignCount INT DEFAULT 0
      );
    `);

    // Tạo bảng campaigns
    await pool.query(`
      CREATE TABLE IF NOT EXISTS campaigns (
        id SERIAL PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        goalAmount NUMERIC(15, 2) NOT NULL,
        currentAmount NUMERIC(15, 2) DEFAULT 0,
        categoryId INT REFERENCES categories(id),
        organizationId INT REFERENCES users(id),
        imageUrl TEXT,
        startDate TIMESTAMP NOT NULL,
        endDate TIMESTAMP NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        isActive BOOLEAN DEFAULT TRUE,
        isApproved BOOLEAN DEFAULT FALSE
      );
    `);

    // Tạo bảng donations
    await pool.query(`
      CREATE TABLE IF NOT EXISTS donations (
        id SERIAL PRIMARY KEY,
        campaignId INT REFERENCES campaigns(id),
        donorId INT REFERENCES users(id),
        amount NUMERIC(15, 2) NOT NULL,
        message TEXT,
        isAnonymous BOOLEAN DEFAULT FALSE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    // Tạo bảng session
    await pool.query(`
      CREATE TABLE IF NOT EXISTS session (
        sid VARCHAR NOT NULL PRIMARY KEY,
        sess JSON NOT NULL,
        expire TIMESTAMP NOT NULL
      );
    `);

    console.log("Database initialized successfully!");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};

initializeDatabase();

export default pool;