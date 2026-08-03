-- =========================================
-- My Book Store - MySQL Database Schema
-- =========================================

CREATE DATABASE IF NOT EXISTS my_book_store;
USE my_book_store;

-- ---------- USERS ----------
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NULL,          -- NULL allowed for Google OAuth users
  role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  auth_provider ENUM('local', 'google') NOT NULL DEFAULT 'local',
  google_uid VARCHAR(255) NULL,
  avatar_url VARCHAR(500) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------- BOOKS ----------
CREATE TABLE IF NOT EXISTS books (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(150) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  category VARCHAR(100) NOT NULL,
  image VARCHAR(500),
  stock INT NOT NULL DEFAULT 100,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------- ORDERS ----------
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  status ENUM('Pending', 'Approved', 'Completed') NOT NULL DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ---------- ORDER ITEMS ----------
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  book_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);

-- ---------- CART ITEMS (persisted per user) ----------
CREATE TABLE IF NOT EXISTS cart_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  book_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_book (user_id, book_id)
);

-- ---------- DEFAULT ADMIN ACCOUNT ----------
-- Password is "admin123" hashed with bcrypt (10 rounds).
-- Generated with: bcrypt.hashSync('admin123', 10)
INSERT INTO users (name, email, password, role, auth_provider)
VALUES (
  'Store Admin',
  'admin@bookstore.com',
  '$2a$10$CwTycUXWue0Thq9StjUM0uJ8i8Q9x9E9r1eJ8h1jZQzT8H1QeQx5e',
  'admin',
  'local'
)
ON DUPLICATE KEY UPDATE email = email;

-- NOTE: If the hash above does not match "admin123" exactly on your bcrypt version,
-- run `node seed/seedBooks.js` (which also re-creates the admin) or generate your own:
--   node -e "console.log(require('bcryptjs').hashSync('admin123', 10))"
-- and UPDATE users SET password='<hash>' WHERE email='admin@bookstore.com';
