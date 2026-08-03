const pool = require('../config/db');

// GET /api/admin/stats
exports.getStats = async (req, res) => {
  try {
    const [[{ totalUsers }]] = await pool.query("SELECT COUNT(*) AS totalUsers FROM users WHERE role = 'user'");
    const [[{ totalBooks }]] = await pool.query('SELECT COUNT(*) AS totalBooks FROM books');
    const [[{ totalOrders }]] = await pool.query('SELECT COUNT(*) AS totalOrders FROM orders');
    const [[{ totalRevenue }]] = await pool.query(
      "SELECT COALESCE(SUM(total_amount),0) AS totalRevenue FROM orders WHERE status != 'Pending'"
    );

    const [recentOrders] = await pool.query(
      `SELECT o.id, o.total_amount, o.status, o.created_at, u.name AS user_name, u.email AS user_email
       FROM orders o JOIN users u ON u.id = o.user_id
       ORDER BY o.created_at DESC LIMIT 5`
    );

    res.json({ totalUsers, totalBooks, totalOrders, totalRevenue, recentOrders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch dashboard stats.' });
  }
};
