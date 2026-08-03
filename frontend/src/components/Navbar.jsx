import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, ShoppingCart, Sun, Moon, Menu, X, Search, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { totalItems } = useCart();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  function handleSearch(e) {
    e.preventDefault();
    navigate(`/books?search=${encodeURIComponent(search)}`);
    setMenuOpen(false);
  }

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  const linkClass = 'text-sm font-medium hover:text-brand-500 transition-colors';

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-gray-950/90 backdrop-blur border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-serif text-xl font-bold text-brand-600 dark:text-brand-300">
            <BookOpen className="w-6 h-6" />
            My Book Store
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className={linkClass}>Home</Link>
            <Link to="/books" className={linkClass}>Books</Link>
            {isAdmin && <Link to="/admin/dashboard" className={linkClass}>Admin</Link>}
          </nav>

          <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-xs mx-6">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search title, author, category..."
                className="w-full pl-9 pr-3 py-2 rounded-full text-sm bg-gray-100 dark:bg-gray-800 border border-transparent focus:border-brand-400 focus:outline-none"
              />
            </div>
          </form>

          <div className="hidden md:flex items-center gap-4">
            <button onClick={toggleTheme} aria-label="Toggle theme" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <Link to="/cart" className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link to="/profile" className="flex items-center gap-1.5 text-sm font-medium hover:text-brand-500">
                  <User className="w-4 h-4" /> {user.name.split(' ')[0]}
                </Link>
                <button onClick={handleLogout} className="text-sm font-medium text-gray-500 hover:text-red-500">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className={linkClass}>Login</Link>
                <Link to="/register" className="text-sm font-semibold bg-brand-500 text-white px-4 py-2 rounded-full hover:bg-brand-600 transition-colors">
                  Register
                </Link>
              </div>
            )}
          </div>

          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4 flex flex-col gap-3 animate-fade-in">
            <form onSubmit={handleSearch} className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search books..."
                className="w-full pl-9 pr-3 py-2 rounded-full text-sm bg-gray-100 dark:bg-gray-800"
              />
            </form>
            <Link to="/" onClick={() => setMenuOpen(false)} className={linkClass}>Home</Link>
            <Link to="/books" onClick={() => setMenuOpen(false)} className={linkClass}>Books</Link>
            <Link to="/cart" onClick={() => setMenuOpen(false)} className={linkClass}>Cart ({totalItems})</Link>
            {isAdmin && <Link to="/admin/dashboard" onClick={() => setMenuOpen(false)} className={linkClass}>Admin</Link>}
            {isAuthenticated ? (
              <>
                <Link to="/profile" onClick={() => setMenuOpen(false)} className={linkClass}>Profile</Link>
                <button onClick={handleLogout} className="text-left text-sm font-medium text-red-500">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className={linkClass}>Login</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className={linkClass}>Register</Link>
              </>
            )}
            <button onClick={toggleTheme} className="flex items-center gap-2 text-sm font-medium">
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />} Toggle theme
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
