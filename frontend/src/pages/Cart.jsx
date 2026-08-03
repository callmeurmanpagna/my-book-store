import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import api from '../api/axios';
import Loader from '../components/Loader';

export default function Cart() {
  const { items, loading, updateQuantity, removeFromCart, totalPrice, refreshCart } = useCart();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');

  async function handlePlaceOrder() {
    setError('');
    setPlacing(true);
    try {
      await api.post('/orders');
      await refreshCart();
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order.');
    } finally {
      setPlacing(false);
    }
  }

  if (loading) return <Loader />;

  if (items.length === 0) {
    return (
      <div className="text-center py-24 animate-fade-in">
        <ShoppingBag className="w-14 h-14 mx-auto text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold">Your cart is empty</h2>
        <p className="text-gray-500 mt-1">Browse our catalog and add some books!</p>
        <Link to="/books" className="inline-block mt-6 bg-brand-500 hover:bg-brand-600 text-white font-semibold px-6 py-2.5 rounded-full">
          Browse Books
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <h1 className="font-serif text-3xl font-bold mb-6">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.cart_item_id} className="flex gap-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4">
              <img src={item.image} alt={item.title} className="w-20 h-28 object-cover rounded-lg shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.author}</p>
                <p className="font-bold text-brand-600 dark:text-brand-300 mt-1">${Number(item.price).toFixed(2)}</p>

                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-full">
                    <button
                      onClick={() => updateQuantity(item.cart_item_id, Math.max(1, item.quantity - 1))}
                      className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.cart_item_id, item.quantity + 1)}
                      className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.cart_item_id)}
                    className="text-red-500 hover:text-red-600 p-1.5"
                    aria-label="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-6 h-fit">
          <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Subtotal</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-500 mb-4">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="h-px bg-gray-200 dark:bg-gray-800 my-3" />
          <div className="flex justify-between font-bold text-lg mb-6">
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>

          {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

          <button
            onClick={handlePlaceOrder}
            disabled={placing}
            className="w-full bg-brand-500 hover:bg-brand-600 text-white font-semibold py-3 rounded-full transition-colors disabled:opacity-60"
          >
            {placing ? 'Placing order...' : 'Place Order'}
          </button>
          <p className="text-xs text-gray-400 text-center mt-3">No payment gateway — order status will be "Pending".</p>
        </div>
      </div>
    </div>
  );
}
