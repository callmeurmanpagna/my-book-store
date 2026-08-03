import { useEffect, useState } from 'react';
import { User, Package, Save } from 'lucide-react';
import api from '../api/axios';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';

const statusColors = {
  Pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  Approved: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  Completed: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
};

export default function Profile() {
  const { user, updateStoredUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState(user?.name || '');
  const [password, setPassword] = useState('');
  const [saveMsg, setSaveMsg] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .get('/orders/mine')
      .then((res) => setOrders(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  async function handleSaveProfile(e) {
    e.preventDefault();
    setSaving(true);
    setSaveMsg('');
    try {
      await api.put('/users/profile', { name, password: password || undefined });
      updateStoredUser({ name });
      setPassword('');
      setSaveMsg('Profile updated successfully!');
    } catch (err) {
      setSaveMsg(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <h1 className="font-serif text-3xl font-bold mb-8">My Account</h1>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Account info */}
        <div className="md:col-span-1">
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-brand-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-3">
              <User className="w-8 h-8 text-brand-500" />
            </div>
            <h3 className="font-semibold">{user?.name}</h3>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <span className="inline-block mt-2 text-xs font-medium bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full capitalize">
              {user?.role}
            </span>
          </div>

          <form onSubmit={handleSaveProfile} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-6 mt-6 space-y-4">
            <h4 className="font-semibold text-sm">Edit Account</h4>
            <div>
              <label className="text-xs font-medium text-gray-500">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">New Password (optional)</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Leave blank to keep current"
                className="mt-1 w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
            </div>
            {saveMsg && <p className="text-xs text-brand-600">{saveMsg}</p>}
            <button
              type="submit"
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold py-2.5 rounded-lg disabled:opacity-60"
            >
              <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Order history */}
        <div className="md:col-span-2">
          <h2 className="font-semibold text-lg flex items-center gap-2 mb-4">
            <Package className="w-5 h-5" /> Order History
          </h2>

          {loading ? (
            <Loader />
          ) : orders.length === 0 ? (
            <p className="text-gray-500 text-sm">You haven't placed any orders yet.</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-sm">Order #{order.id}</span>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 text-sm">
                        <img src={item.image} alt={item.title} className="w-10 h-14 object-cover rounded" />
                        <div className="flex-1">
                          <p className="font-medium">{item.title}</p>
                          <p className="text-gray-500 text-xs">Qty: {item.quantity} × ${Number(item.price).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 text-sm">
                    <span className="text-gray-500">{new Date(order.created_at).toLocaleDateString()}</span>
                    <span className="font-bold">${Number(order.total_amount).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
