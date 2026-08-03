require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('../config/db');

const books = [
  {
    title: 'The Silent Ocean',
    author: 'Maria Chen',
    description: 'A gripping tale of survival and self-discovery aboard a ship lost at sea during a violent storm.',
    price: 14.99,
    category: 'Fiction',
    image: 'https://covers.openlibrary.org/b/id/8231856-L.jpg',
  },
  {
    title: 'Atomic Habits',
    author: 'James Clear',
    description: 'A proven framework for improving every day through the compounding power of tiny habits.',
    price: 19.99,
    category: 'Self-Help',
    image: 'https://covers.openlibrary.org/b/id/10527843-L.jpg',
  },
  {
    title: 'Clean Code',
    author: 'Robert C. Martin',
    description: 'A handbook of agile software craftsmanship for writing readable, maintainable code.',
    price: 34.99,
    category: 'Technology',
    image: 'https://covers.openlibrary.org/b/id/8235116-L.jpg',
  },
  {
    title: 'The Vanishing Kingdom',
    author: 'Elena Rourke',
    description: 'An epic fantasy adventure where a young mapmaker must find a kingdom that disappeared centuries ago.',
    price: 16.5,
    category: 'Fantasy',
    image: 'https://covers.openlibrary.org/b/id/8236155-L.jpg',
  },
  {
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    description: 'A sweeping narrative of how Homo sapiens came to dominate the world.',
    price: 22.0,
    category: 'History',
    image: 'https://covers.openlibrary.org/b/id/8323742-L.jpg',
  },
  {
    title: 'Midnight in the Garden',
    author: 'Sophie Lawrence',
    description: 'A slow-burning mystery-romance set in a crumbling English manor house.',
    price: 13.25,
    category: 'Romance',
    image: 'https://covers.openlibrary.org/b/id/8232872-L.jpg',
  },
  {
    title: 'Quantum Physics for Beginners',
    author: 'Dr. Alan Whitfield',
    description: 'An approachable introduction to the strange and fascinating world of quantum mechanics.',
    price: 27.99,
    category: 'Science',
    image: 'https://covers.openlibrary.org/b/id/8234116-L.jpg',
  },
  {
    title: 'The Last Detective',
    author: 'Marcus Hale',
    description: 'A hardboiled crime thriller following a detective on the trail of a serial killer in 1940s Chicago.',
    price: 15.75,
    category: 'Mystery',
    image: 'https://covers.openlibrary.org/b/id/8235523-L.jpg',
  },
  {
    title: 'Whispers of the Forest',
    author: 'Naomi Ito',
    description: 'A poetic children\u2019s story about a girl who learns to speak with the trees in her backyard.',
    price: 11.99,
    category: 'Children',
    image: 'https://covers.openlibrary.org/b/id/8236645-L.jpg',
  },
  {
    title: 'Deep Learning Fundamentals',
    author: 'Priya Raman',
    description: 'A practical, math-light introduction to neural networks and modern deep learning techniques.',
    price: 39.99,
    category: 'Technology',
    image: 'https://covers.openlibrary.org/b/id/8237134-L.jpg',
  },
  {
    title: 'The Stoic Path',
    author: 'Marcus Bellweather',
    description: 'A modern guide to applying ancient Stoic philosophy to everyday challenges.',
    price: 17.49,
    category: 'Philosophy',
    image: 'https://covers.openlibrary.org/b/id/8231987-L.jpg',
  },
  {
    title: 'Beyond the Red Horizon',
    author: 'Katarina Novak',
    description: 'A science fiction epic about the first human colony on Mars and the secrets buried beneath its soil.',
    price: 18.99,
    category: 'Science Fiction',
    image: 'https://covers.openlibrary.org/b/id/8236729-L.jpg',
  },
];

async function seed() {
  try {
    console.log('🌱 Seeding database...');

    // Create/update the default admin account
    const adminPasswordHash = await bcrypt.hash('admin123', 10);
    const [existingAdmin] = await pool.query('SELECT id FROM users WHERE email = ?', ['admin@bookstore.com']);
    if (existingAdmin.length === 0) {
      await pool.query(
        'INSERT INTO users (name, email, password, role, auth_provider) VALUES (?, ?, ?, ?, ?)',
        ['Store Admin', 'admin@bookstore.com', adminPasswordHash, 'admin', 'local']
      );
      console.log('✅ Admin account created (admin@bookstore.com / admin123)');
    } else {
      await pool.query('UPDATE users SET password = ? WHERE email = ?', [adminPasswordHash, 'admin@bookstore.com']);
      console.log('ℹ️  Admin account already existed — password reset to admin123');
    }

    // Clear existing demo books to avoid duplicates on re-run
    await pool.query('DELETE FROM books');

    for (const book of books) {
      await pool.query(
        'INSERT INTO books (title, author, description, price, category, image, stock) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [book.title, book.author, book.description, book.price, book.category, book.image, 100]
      );
    }

    console.log(`✅ Inserted ${books.length} demo books`);
    console.log('🎉 Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

seed();
