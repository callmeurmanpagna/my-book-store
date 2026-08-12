import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Check, X, Minus, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function BookCard({ book }) {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const [adding, setAdding] = useState(false);

  function openModal(e) {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setQuantity(1);
    setShowModal(true);
  }

  function closeModal(e) {
    if (e) e.preventDefault();
    setShowModal(false);
  }

  async function handleConfirmAdd(e) {
    e.preventDefault();
    setAdding(true);
    try {
      await addToCart(book.id, quantity);
      setShowModal(false);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1800);
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  }

  return (
    <>
      {justAdded && (
        <div className="fixed top-20 right-6 z-50 bg-green-500 text-white px-5 py-3 rounded-xl shadow-lg animate-fade-in flex items-center gap-2">
          <Check className="w-4 h-4" /> Added "{book.title}" to cart!
        </div>
      )}

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-sm w-full p-6 relative animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex gap-4">
              <img src={book.image} alt={book.title} className="w-20 h-28 object-cover rounded-lg shrink-0" />
              <div className="min-w-0">
                <h3 className="font-semibold text-base leading-snug">{book.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{book.author}</p>
                <p className="font-bold text-brand-600 dark:text-brand-300 mt-2">
                  ${Number(book.price).toFixed(2)} <span className="text-xs text-gray-400 font-normal">/ each</span>
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Quantity</span>
              <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-full">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-sm border-t border-gray-100 dark:border-gray-800 pt-4">
              <span className="text-gray-500">Total</span>
              <span className="font-bold text-lg text-brand-600 dark:text-brand-300">
                ${(Number(book.price) * quantity).toFixed(2)}
              </span>
            </div>

            <button
              onClick={handleConfirmAdd}
              disabled={adding}
              className="mt-5 w-full flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold py-3 rounded-full transition-colors disabled:opacity-60"
            >
              <ShoppingCart className="w-4 h-4" /> {adding ? 'Adding...' : 'Add to Cart'}
            </button>
          </div>
        </div>
      )}

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
              onClick={openModal}
              className="p-2 rounded-full bg-brand-50 dark:bg-gray-800 text-brand-600 dark:text-brand-300 hover:bg-brand-500 hover:text-white transition-colors"
              aria-label="Add to cart"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Link>
    </>
  );
}