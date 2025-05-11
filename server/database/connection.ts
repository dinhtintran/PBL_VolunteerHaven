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
        full_name VARCHAR(100),
        user_type VARCHAR(20) CHECK (user_type IN ('admin', 'organization', 'donor')),
        bio TEXT,
        profile_image TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_approved BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE
      );
    `);

    // Tạo bảng categories
    await pool.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL UNIQUE,
        description TEXT,
        image_url TEXT,
        campaign_count INT DEFAULT 0
      );
    `);

    // Tạo bảng campaigns
    await pool.query(`
      CREATE TABLE IF NOT EXISTS campaigns (
        id SERIAL PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        goal_amount NUMERIC(15, 2) NOT NULL,
        current_amount NUMERIC(15, 2) DEFAULT 0,
        category_id INT REFERENCES categories(id),
        organization_id INT REFERENCES users(id),
        image_url TEXT,
        start_date TIMESTAMP NOT NULL,
        end_date TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT TRUE,
        is_approved BOOLEAN DEFAULT FALSE
      );
    `);

    // Tạo bảng donations
    await pool.query(`
      CREATE TABLE IF NOT EXISTS donations (
        id SERIAL PRIMARY KEY,
        campaign_id INT REFERENCES campaigns(id),
        donor_id INT REFERENCES users(id),
        amount NUMERIC(15, 2) NOT NULL,
        message TEXT,
        is_anonymous BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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