import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Star, Minus, Plus } from 'lucide-react';
import api from '../api/axios';
import Loader from '../components/Loader';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setLoading(true);
    api
      .get(`/books/${id}`)
      .then((res) => setBook(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleAddToCart() {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    await addToCart(book.id, quantity);
    setMessage('Added to cart!');
    setTimeout(() => setMessage(''), 2000);
  }

  if (loading) return <Loader />;
  if (!book) return <p className="text-center py-20 text-gray-500">Book not found.</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-brand-500 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 aspect-[3/4] max-h-[520px] mx-auto w-full">
          <img src={book.image} alt={book.title} className="w-full h-full object-cover" />
        </div>

        <div>
          <span className="inline-block bg-brand-100 dark:bg-gray-800 text-brand-600 dark:text-brand-300 text-xs font-semibold px-3 py-1 rounded-full mb-3">
            {book.category}
          </span>
          <h1 className="font-serif text-3xl font-bold">{book.title}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">by {book.author}</p>

          <div className="flex items-center gap-1 mt-3 text-amber-400">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
          </div>

          <p className="mt-5 text-gray-600 dark:text-gray-300 leading-relaxed">{book.description}</p>

          <div className="mt-6 text-3xl font-bold text-brand-600 dark:text-brand-300">
            ${Number(book.price).toFixed(2)}
          </div>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-full">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center">{quantity}</span>
              <button onClick={() => setQuantity((q) => q + 1)} className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold px-6 py-3 rounded-full transition-colors"
            >
              <ShoppingCart className="w-4 h-4" /> Add to Cart
            </button>
          </div>

          {message && <p className="mt-3 text-sm text-green-600">{message}</p>}
        </div>
      </div>
    </div>
  );
}
