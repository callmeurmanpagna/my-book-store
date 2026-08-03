import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Truck, ShieldCheck, Sparkles } from 'lucide-react';
import api from '../api/axios';
import BookCard from '../components/BookCard';
import Loader from '../components/Loader';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/books/featured')
      .then((res) => setFeatured(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-50 via-white to-brand-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 dark:text-brand-300 bg-brand-100 dark:bg-gray-800 px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5" /> New arrivals every week
            </span>
            <h1 className="mt-5 font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              Find your next
              <span className="text-brand-500"> favorite story</span>
            </h1>
            <p className="mt-5 text-lg text-gray-600 dark:text-gray-400 max-w-lg">
              Thousands of titles across every genre — fiction, tech, fantasy, and more.
              Delivered to your door, or your inbox.
            </p>
            <div className="mt-8 flex gap-4">
              <Link to="/books" className="bg-brand-500 hover:bg-brand-600 text-white font-semibold px-6 py-3 rounded-full transition-colors">
                Browse Books
              </Link>
              <Link to="/register" className="border border-gray-300 dark:border-gray-700 font-semibold px-6 py-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                Create Account
              </Link>
            </div>
          </div>
          <div className="hidden lg:flex justify-center">
            <div className="relative w-72 h-96 rounded-2xl bg-brand-400/20 rotate-3 shadow-2xl flex items-center justify-center">
              <BookOpen className="w-28 h-28 text-brand-500" />
            </div>
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { icon: Truck, title: 'Fast Delivery', desc: 'Orders processed and shipped quickly.' },
          { icon: ShieldCheck, title: 'Secure Checkout', desc: 'Your data is protected with JWT & encryption.' },
          { icon: BookOpen, title: 'Huge Catalog', desc: 'Every genre, from classics to new releases.' },
        ].map((item) => (
          <div key={item.title} className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-900">
            <item.icon className="w-8 h-8 text-brand-500 shrink-0" />
            <div>
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Featured books */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold">Featured Books</h2>
          <Link to="/books" className="text-sm font-semibold text-brand-500 hover:text-brand-600">View all →</Link>
        </div>

        {loading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {featured.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
