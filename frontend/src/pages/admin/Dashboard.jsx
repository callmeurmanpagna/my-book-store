import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, BookOpen, ShoppingBag, DollarSign } from 'lucide-react';
import api from '../../api/axios';
import Loader from '../../components/Loader';
import AdminSidebar from '../../components/AdminSidebar';

const statusColors = {
  Pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  Approved: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  Completed: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/admin/stats')
      .then((res) => setStats(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const cards = stats
    ? [
        { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' },
        { label: 'Total Books', value: stats.totalBooks, icon: BookOpen, color: 'text-brand-500 bg-brand-50 dark:bg-brand-900/20' },
        { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20' },
        { label: 'Revenue', value: `$${Number(stats.totalRevenue).toFixed(2)}`, icon: DollarSign, color: 'text-green-500 bg-green-50 dark:bg-green-900/20' },
      ]
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <h1 className="font-serif text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid lg:grid-cols-4 gap-8">
        <AdminSidebar />

        <div className="lg:col-span-3">
          {loading ? (
            <Loader />
          ) : (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                {cards.map((c) => (
                  <div key={c.label} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-5">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${c.color}`}>
                      <c.icon className="w-5 h-5" />
                    </div>
                    <p className="text-2xl font-bold mt-3">{c.value}</p>
                    <p className="text-sm text-gray-500">{c.label}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-lg">Recent Orders</h2>
                  <Link to="/admin/orders" className="text-sm text-brand-500 hover:text-brand-600 font-medium">View all →</Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-500 border-b border-gray-100 dark:border-gray-800">
                        <th className="pb-2 pr-4">Order</th>
                        <th className="pb-2 pr-4">Customer</th>
                        <th className="pb-2 pr-4">Total</th>
                        <th className="pb-2 pr-4">Status</th>
                        <th className="pb-2">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentOrders.map((o) => (
                        <tr key={o.id} className="border-b border-gray-50 dark:border-gray-800/50">
                          <td className="py-3 pr-4 font-medium">#{o.id}</td>
                          <td className="py-3 pr-4">
                            <p>{o.user_name}</p>
                            <p className="text-xs text-gray-400">{o.user_email}</p>
                          </td>
                          <td className="py-3 pr-4">${Number(o.total_amount).toFixed(2)}</td>
                          <td className="py-3 pr-4">
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[o.status]}`}>{o.status}</span>
                          </td>
                          <td className="py-3 text-gray-500">{new Date(o.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
