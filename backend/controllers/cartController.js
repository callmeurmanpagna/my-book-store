const pool = require('../config/db');

// GET /api/cart
exports.getCart = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT ci.id AS cart_item_id, ci.quantity, b.*
       FROM cart_items ci
       JOIN books b ON b.id = ci.book_id
       WHERE ci.user_id = ?
       ORDER BY ci.created_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch cart.' });
  }
};

// POST /api/cart  { book_id, quantity }
exports.addToCart = async (req, res) => {
  try {
    const { book_id, quantity } = req.body;
    if (!book_id) return res.status(400).json({ message: 'book_id is required.' });
    const qty = quantity && quantity > 0 ? quantity : 1;

    await pool.query(
      `INSERT INTO cart_items (user_id, book_id, quantity)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)`,
      [req.user.id, book_id, qty]
    );
    res.status(201).json({ message: 'Added to cart' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to add to cart.' });
  }
};

// PUT /api/cart/:cartItemId  { quantity }
exports.updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1.' });
    }
    const [result] = await pool.query(
      'UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?',
      [quantity, req.params.cartItemId, req.user.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Cart item not found.' });
    res.json({ message: 'Cart updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update cart item.' });
  }
};

// DELETE /api/cart/:cartItemId
exports.removeFromCart = async (req, res) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM cart_items WHERE id = ? AND user_id = ?',
      [req.params.cartItemId, req.user.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Cart item not found.' });
    res.json({ message: 'Removed from cart' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to remove cart item.' });
  }
};
