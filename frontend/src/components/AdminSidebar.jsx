import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, BookOpen, ShoppingBag } from 'lucide-react';

const links = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/books', label: 'Books', icon: BookOpen },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
];

export default function AdminSidebar() {
  return (
    <aside className="lg:col-span-1">
      <nav className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-3 flex lg:flex-col gap-1 overflow-x-auto">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-brand-500 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`
            }
          >
            <link.icon className="w-4 h-4" /> {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
