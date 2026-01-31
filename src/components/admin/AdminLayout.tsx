import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Button from '../ui/Button';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: '🏠' },
    { name: 'Users', href: '/admin/users', icon: '👤' },
    { name: 'Coaches', href: '/admin/coaches', icon: '👥' },
    { name: 'News', href: '/admin/news', icon: '📰' },
    { name: 'Events', href: '/admin/events', icon: '📅' },
    { name: 'Products', href: '/admin/products', icon: '🛍️' },
    { name: 'Velocity Classes', href: '/admin/velocity-classes', icon: '🚴' },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link to="/admin" className="text-xl font-bold text-gray-900">
                M8 Admin
              </Link>
              
              <div className="hidden md:flex space-x-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`px-3 py-2 text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? 'text-[#ecca51] border-b-2 border-[#ecca51]'
                        : 'text-gray-700 hover:text-[#ecca51]'
                    }`}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {user?.person?.firstName || user?.username}
              </span>
              <Link to="/" className="text-sm text-gray-600 hover:text-gray-900">
                View Site
              </Link>
              <Button variant="outline" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-white border-b border-gray-200">
        <div className="px-4 py-2 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`block px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive(item.href)
                  ? 'text-[#ecca51] bg-yellow-50'
                  : 'text-gray-700 hover:text-[#ecca51] hover:bg-gray-50'
              }`}
            >
              <span className="mr-2">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="py-6">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;