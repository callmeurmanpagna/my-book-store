import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function BookCard({ book }) {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  async function handleAddToCart(e) {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      await addToCart(book.id, 1);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <Link
      to={`/books/${book.id}`}
      className="group flex flex-col bg-white dark:bg-gray-900 rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative aspect-[3/4] bg-gray-100 dark:bg-gray-800 overflow-hidden">
        <img
          src={book.image}
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <span className="absolute top-2 left-2 bg-brand-500 text-white text-[10px] font-semibold px-2 py-1 rounded-full">
          {book.category}
        </span>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-sm line-clamp-2">{book.title}</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{book.author}</p>
        <div className="flex items-center gap-1 mt-2 text-amber-400">
          {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
        </div>
        <div className="mt-auto pt-3 flex items-center justify-between">
          <span className="font-bold text-brand-600 dark:text-brand-300">${Number(book.price).toFixed(2)}</span>
          <button
            onClick={handleAddToCart}
            className="p-2 rounded-full bg-brand-50 dark:bg-gray-800 text-brand-600 dark:text-brand-300 hover:bg-brand-500 hover:text-white transition-colors"
            aria-label="Add to cart"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Link>
  );
}
