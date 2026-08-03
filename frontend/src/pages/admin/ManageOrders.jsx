import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Loader from '../../components/Loader';
import AdminSidebar from '../../components/AdminSidebar';

const statusOptions = ['Pending', 'Approved', 'Completed'];
const statusColors = {
  Pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  Approved: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  Completed: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
};

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  function fetchOrders() {
    setLoading(true);
    api
      .get('/orders')
      .then((res) => setOrders(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }

  useEffect(fetchOrders, []);

  async function handleStatusChange(orderId, status) {
    await api.put(`/orders/${orderId}/status`, { status });
    setOrders((prev) => prev.map((o) => (o.order_id === orderId ? { ...o, status } : o)));
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <h1 className="font-serif text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid lg:grid-cols-4 gap-8">
        <AdminSidebar />

        <div className="lg:col-span-3">
          <h2 className="font-semibold text-lg mb-4">All Orders</h2>

          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
            {loading ? (
              <Loader />
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-100 dark:border-gray-800">
                    <th className="p-4">Order</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Books</th>
                    <th className="p-4">Total</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.order_id} className="border-b border-gray-50 dark:border-gray-800/50 align-top">
                      <td className="p-4 font-medium">#{o.order_id}</td>
                      <td className="p-4">
                        <p>{o.user_name}</p>
                        <p className="text-xs text-gray-400">{o.user_email}</p>
                      </td>
                      <td className="p-4 text-gray-500">
                        {o.items.map((it, idx) => (
                          <div key={idx}>{it.book_title} × {it.quantity}</div>
                        ))}
                      </td>
                      <td className="p-4 font-medium">${Number(o.total_amount).toFixed(2)}</td>
                      <td className="p-4 text-gray-500">{new Date(o.created_at).toLocaleDateString()}</td>
                      <td className="p-4">
                        <select
                          value={o.status}
                          onChange={(e) => handleStatusChange(o.order_id, e.target.value)}
                          className={`text-xs font-semibold px-2.5 py-1.5 rounded-full border-0 ${statusColors[o.status]}`}
                        >
                          {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr><td colSpan={6} className="p-6 text-center text-gray-400">No orders yet.</td></tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
