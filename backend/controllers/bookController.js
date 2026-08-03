const pool = require('../config/db');

// GET /api/books?search=&category=
exports.getBooks = async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = 'SELECT * FROM books WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND (title LIKE ? OR author LIKE ? OR category LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term, term);
    }
    if (category && category !== 'All') {
      query += ' AND category = ?';
      params.push(category);
    }
    query += ' ORDER BY created_at DESC';

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch books.' });
  }
};

// GET /api/books/categories
exports.getCategories = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT DISTINCT category FROM books ORDER BY category');
    res.json(rows.map((r) => r.category));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch categories.' });
  }
};

// GET /api/books/featured
exports.getFeatured = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM books ORDER BY created_at DESC LIMIT 8');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch featured books.' });
  }
};

// GET /api/books/:id
exports.getBookById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM books WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Book not found.' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch book.' });
  }
};

// POST /api/books (admin)
exports.createBook = async (req, res) => {
  try {
    const { title, author, description, price, category, image, stock } = req.body;
    if (!title || !author || !price || !category) {
      return res.status(400).json({ message: 'Title, author, price and category are required.' });
    }
    const [result] = await pool.query(
      'INSERT INTO books (title, author, description, price, category, image, stock) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, author, description || '', price, category, image || '', stock ?? 100]
    );
    res.status(201).json({ message: 'Book created', id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create book.' });
  }
};

// PUT /api/books/:id (admin)
exports.updateBook = async (req, res) => {
  try {
    const { title, author, description, price, category, image, stock } = req.body;
    const [existing] = await pool.query('SELECT * FROM books WHERE id = ?', [req.params.id]);
    if (existing.length === 0) return res.status(404).json({ message: 'Book not found.' });

    const book = existing[0];
    await pool.query(
      'UPDATE books SET title=?, author=?, description=?, price=?, category=?, image=?, stock=? WHERE id=?',
      [
        title ?? book.title,
        author ?? book.author,
        description ?? book.description,
        price ?? book.price,
        category ?? book.category,
        image ?? book.image,
        stock ?? book.stock,
        req.params.id,
      ]
    );
    res.json({ message: 'Book updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update book.' });
  }
};

// DELETE /api/books/:id (admin)
exports.deleteBook = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM books WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Book not found.' });
    res.json({ message: 'Book deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete book.' });
  }
};
