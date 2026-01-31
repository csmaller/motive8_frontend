import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import HealthCheck from '../../components/admin/HealthCheck';

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();

  const adminSections = [
    {
      title: 'User Management',
      description: 'Manage user accounts and personal information',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      link: '/admin/users',
      color: 'bg-indigo-500'
    },
    {
      title: 'Coaches Management',
      description: 'Add, edit, and remove coaching staff',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      link: '/admin/coaches',
      color: 'bg-blue-500'
    },
    {
      title: 'News Management',
      description: 'Create and manage articles, announcements, and updates',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      ),
      link: '/admin/news',
      color: 'bg-indigo-500'
    },
    {
      title: 'Events Management',
      description: 'Manage races, training sessions, and team events',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      link: '/admin/events',
      color: 'bg-green-500'
    },
    {
      title: 'Store Management',
      description: 'Manage products, inventory, and pricing',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      link: '/admin/products',
      color: 'bg-purple-500'
    },
    {
      title: 'Velocity Classes',
      description: 'Manage cycling classes and schedules',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      link: '/admin/velocity-classes',
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Welcome back, {user?.person?.firstName || user?.username}! Manage your triathlon team website content.
            </p>
          </div>
          <Button variant="outline" onClick={logout}>
            Logout
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
          <Card className="text-center">
            <div className="text-2xl font-bold text-indigo-600">5</div>
            <div className="text-sm text-gray-600">Total Users</div>
          </Card>
          <Card className="text-center">
            <div className="text-2xl font-bold text-blue-600">4</div>
            <div className="text-sm text-gray-600">Active Coaches</div>
          </Card>
          <Card className="text-center">
            <div className="text-2xl font-bold text-purple-600">5</div>
            <div className="text-sm text-gray-600">News Articles</div>
          </Card>
          <Card className="text-center">
            <div className="text-2xl font-bold text-green-600">5</div>
            <div className="text-sm text-gray-600">Upcoming Events</div>
          </Card>
          <Card className="text-center">
            <div className="text-2xl font-bold text-orange-600">8</div>
            <div className="text-sm text-gray-600">Store Products</div>
          </Card>
          <Card className="text-center">
            <div className="text-2xl font-bold text-red-600">4</div>
            <div className="text-sm text-gray-600">Velocity Classes</div>
          </Card>
        </div>

        {/* Admin Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {adminSections.map((section, index) => (
            <Link key={index} to={section.link}>
              <Card hover={true} className="h-full transition-all duration-200 hover:shadow-lg">
                <div className="flex items-start space-x-4">
                  <div className={`${section.color} text-white p-3 rounded-lg`}>
                    {section.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {section.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {section.description}
                    </p>
                    <div className="mt-3">
                      <span className="text-primary-600 text-sm font-medium hover:text-primary-700">
                        Manage →
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Recent Activity and Health Check */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">New event "Spring Triathlon" created</span>
                </div>
                <span className="text-xs text-gray-500">2 hours ago</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Coach profile updated</span>
                </div>
                <span className="text-xs text-gray-500">1 day ago</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">New product added to store</span>
                </div>
                <span className="text-xs text-gray-500">3 days ago</span>
              </div>
            </div>
          </Card>

          {/* API Health Check */}
          <HealthCheck />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;