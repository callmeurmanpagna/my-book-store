import { useEffect, useState } from 'react';
import { Search, Trash2 } from 'lucide-react';
import api from '../../api/axios';
import Loader from '../../components/Loader';
import AdminSidebar from '../../components/AdminSidebar';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  function fetchUsers(query = '') {
    setLoading(true);
    api
      .get('/users', { params: { search: query } })
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => fetchUsers(search), 300);
    return () => clearTimeout(timeout);
  }, [search]);

  async function handleDelete(id) {
    if (!window.confirm('Delete this user? This cannot be undone.')) return;
    await api.delete(`/users/${id}`);
    fetchUsers(search);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <h1 className="font-serif text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid lg:grid-cols-4 gap-8">
        <AdminSidebar />

        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">Registered Users</h2>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search users..."
                className="pl-9 pr-3 py-2 rounded-full text-sm bg-gray-100 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
            {loading ? (
              <Loader />
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-100 dark:border-gray-800">
                    <th className="p-4">Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Registered</th>
                    <th className="p-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-gray-50 dark:border-gray-800/50">
                      <td className="p-4 font-medium">{u.name}</td>
                      <td className="p-4 text-gray-500">{u.email}</td>
                      <td className="p-4 text-gray-500">{new Date(u.created_at).toLocaleDateString()}</td>
                      <td className="p-4 text-right">
                        <button onClick={() => handleDelete(u.id)} className="text-red-500 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-6 text-center text-gray-400">No users found.</td>
                    </tr>
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
