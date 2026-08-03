import { BookOpen } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 font-serif text-lg font-bold text-brand-600 dark:text-brand-300">
            <BookOpen className="w-5 h-5" /> My Book Store
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Your cozy corner of the internet for discovering the next great read.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm">Quick Links</h4>
          <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
            <li><a href="/" className="hover:text-brand-500">Home</a></li>
            <li><a href="/books" className="hover:text-brand-500">Browse Books</a></li>
            <li><a href="/cart" className="hover:text-brand-500">Cart</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm">Contact</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">support@mybookstore.com</p>
        </div>
      </div>
      <div className="text-center text-xs text-gray-400 dark:text-gray-600 py-4 border-t border-gray-200 dark:border-gray-800">
        © {new Date().getFullYear()} My Book Store. All rights reserved.
      </div>
    </footer>
  );
}
