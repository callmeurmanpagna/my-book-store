import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import api from '../api/axios';
import BookCard from '../components/BookCard';
import Loader from '../components/Loader';

export default function Books() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || 'All';

  useEffect(() => {
    api.get('/books/categories').then((res) => setCategories(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    api
      .get('/books', { params: { search, category } })
      .then((res) => setBooks(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [search, category]);

  function handleSearchChange(e) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('search', e.target.value);
      return next;
    });
  }

  function handleCategoryClick(cat) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('category', cat);
      return next;
    });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <h1 className="font-serif text-3xl font-bold mb-6">Browse Books</h1>

      <div className="relative max-w-md mb-6">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search by title, author, or category..."
          className="w-full pl-9 pr-3 py-2.5 rounded-full text-sm bg-gray-100 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-400"
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {['All', ...categories].map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryClick(cat)}
            className={`text-sm px-4 py-1.5 rounded-full border transition-colors ${
              category === cat
                ? 'bg-brand-500 text-white border-brand-500'
                : 'border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <Loader />
      ) : books.length === 0 ? (
        <p className="text-center text-gray-500 py-16">No books found. Try a different search or category.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}
