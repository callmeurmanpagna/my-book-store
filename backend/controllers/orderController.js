const pool = require('../config/db');

// POST /api/orders  -- Place order from current cart
exports.placeOrder = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [cartRows] = await connection.query(
      `SELECT ci.book_id, ci.quantity, b.price, b.title, b.stock
       FROM cart_items ci JOIN books b ON b.id = ci.book_id
       WHERE ci.user_id = ?`,
      [req.user.id]
    );

    if (cartRows.length === 0) {
      await connection.rollback();
      return res.status(400).json({ message: 'Your cart is empty.' });
    }

    const totalAmount = cartRows.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

    const [orderResult] = await connection.query(
      'INSERT INTO orders (user_id, total_amount, status) VALUES (?, ?, ?)',
      [req.user.id, totalAmount, 'Pending']
    );
    const orderId = orderResult.insertId;

    for (const item of cartRows) {
      await connection.query(
        'INSERT INTO order_items (order_id, book_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.book_id, item.quantity, item.price]
      );
    }

    await connection.query('DELETE FROM cart_items WHERE user_id = ?', [req.user.id]);

    await connection.commit();
    res.status(201).json({ message: 'Order placed successfully', orderId, totalAmount, status: 'Pending' });
  } catch (err) {
    await connection.rollback();
    console.error(err);
    res.status(500).json({ message: 'Failed to place order.' });
  } finally {
    connection.release();
  }
};

// GET /api/orders/mine -- current user's order history
exports.getMyOrders = async (req, res) => {
  try {
    const [orders] = await pool.query(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );

    for (const order of orders) {
      const [items] = await pool.query(
        `SELECT oi.*, b.title, b.author, b.image
         FROM order_items oi JOIN books b ON b.id = oi.book_id
         WHERE oi.order_id = ?`,
        [order.id]
      );
      order.items = items;
    }

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch orders.' });
  }
};

// ---------- ADMIN ----------

// GET /api/orders (admin) -- all orders with user + book info
exports.getAllOrders = async (req, res) => {
  try {
    const [orders] = await pool.query(
      `SELECT o.id AS order_id, o.total_amount, o.status, o.created_at,
              u.id AS user_id, u.name AS user_name, u.email AS user_email
       FROM orders o
       JOIN users u ON u.id = o.user_id
       ORDER BY o.created_at DESC`
    );

    for (const order of orders) {
      const [items] = await pool.query(
        `SELECT oi.quantity, oi.price, b.title AS book_title
         FROM order_items oi JOIN books b ON b.id = oi.book_id
         WHERE oi.order_id = ?`,
        [order.order_id]
      );
      order.items = items;
    }

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch orders.' });
  }
};

// PUT /api/orders/:id/status (admin)  { status: 'Pending'|'Approved'|'Completed' }
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Pending', 'Approved', 'Completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }
    const [result] = await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Order not found.' });
    res.json({ message: 'Order status updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update order status.' });
  }
};
