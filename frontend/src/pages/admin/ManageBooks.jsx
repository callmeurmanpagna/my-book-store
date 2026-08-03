import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import api from '../../api/axios';
import Loader from '../../components/Loader';
import AdminSidebar from '../../components/AdminSidebar';

const emptyForm = { title: '', author: '', description: '', price: '', category: '', image: '', stock: 100 };

export default function ManageBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  function fetchBooks() {
    setLoading(true);
    api
      .get('/books')
      .then((res) => setBooks(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }

  useEffect(fetchBooks, []);

  function openAddModal() {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEditModal(book) {
    setEditingId(book.id);
    setForm({
      title: book.title,
      author: book.author,
      description: book.description,
      price: book.price,
      category: book.category,
      image: book.image,
      stock: book.stock,
    });
    setModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/books/${editingId}`, form);
      } else {
        await api.post('/books', form);
      }
      setModalOpen(false);
      fetchBooks();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save book.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this book?')) return;
    await api.delete(`/books/${id}`);
    fetchBooks();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <h1 className="font-serif text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid lg:grid-cols-4 gap-8">
        <AdminSidebar />

        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">Manage Books</h2>
            <button
              onClick={openAddModal}
              className="flex items-center gap-1.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-4 py-2 rounded-full"
            >
              <Plus className="w-4 h-4" /> Add Book
            </button>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
            {loading ? (
              <Loader />
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-100 dark:border-gray-800">
                    <th className="p-4">Book</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {books.map((b) => (
                    <tr key={b.id} className="border-b border-gray-50 dark:border-gray-800/50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={b.image} alt={b.title} className="w-8 h-11 object-cover rounded" />
                          <div>
                            <p className="font-medium">{b.title}</p>
                            <p className="text-xs text-gray-400">{b.author}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-gray-500">{b.category}</td>
                      <td className="p-4">${Number(b.price).toFixed(2)}</td>
                      <td className="p-4">
                        <div className="flex justify-end gap-3">
                          <button onClick={() => openEditModal(b)} className="text-blue-500 hover:text-blue-600">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(b.id)} className="text-red-500 hover:text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">{editingId ? 'Edit Book' : 'Add New Book'}</h3>
              <button onClick={() => setModalOpen(false)}><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm" />
              <input required placeholder="Author" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm" />
              <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3} className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm" />
              <div className="grid grid-cols-2 gap-3">
                <input required type="number" step="0.01" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm" />
                <input required placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm" />
              </div>
              <input placeholder="Cover Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm" />
              <input type="number" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm" />

              <button type="submit" disabled={saving}
                className="w-full bg-brand-500 hover:bg-brand-600 text-white font-semibold py-2.5 rounded-lg disabled:opacity-60">
                {saving ? 'Saving...' : editingId ? 'Update Book' : 'Add Book'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
