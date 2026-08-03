const bcrypt = require('bcryptjs');
const pool = require('../config/db');

// GET /api/users/profile
exports.getProfile = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, role, avatar_url, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'User not found.' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch profile.' });
  }
};

// PUT /api/users/profile  { name, password }
exports.updateProfile = async (req, res) => {
  try {
    const { name, password } = req.body;
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
    const user = rows[0];

    let hashedPassword = user.password;
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters.' });
      }
      hashedPassword = await bcrypt.hash(password, 10);
    }

    await pool.query('UPDATE users SET name = ?, password = ? WHERE id = ?', [
      name || user.name,
      hashedPassword,
      req.user.id,
    ]);

    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update profile.' });
  }
};

// ---------- ADMIN ----------

// GET /api/users (admin) ?search=
exports.getAllUsers = async (req, res) => {
  try {
    const { search } = req.query;
    let query = "SELECT id, name, email, role, created_at FROM users WHERE role = 'user'";
    const params = [];
    if (search) {
      query += ' AND (name LIKE ? OR email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    query += ' ORDER BY created_at DESC';
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch users.' });
  }
};

// DELETE /api/users/:id (admin)
exports.deleteUser = async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM users WHERE id = ? AND role = 'user'", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found.' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete user.' });
  }
};
