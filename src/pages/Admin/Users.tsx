import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { peopleApi } from '../../services/peopleApi';
import type { UserWithPerson } from '../../types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import StatusMessage from '../../components/ui/StatusMessage';

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<UserWithPerson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [connectionTest, setConnectionTest] = useState<{
    connected: boolean;
    latency?: number;
    error?: string;
    count?: number;
  } | null>(null);

  useEffect(() => {
    loadUsers();
    testConnection();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const data = await peopleApi.getAll();
      // Sort by created date, newest first
      const sortedData = data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setUsers(sortedData);
    } catch (error) {
      console.error('Failed to load users:', error);
      setError('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const testConnection = async () => {
    try {
      const result = await peopleApi.testConnection();
      setConnectionTest(result);
    } catch (error) {
      console.error('Connection test failed:', error);
      setConnectionTest({
        connected: false,
        error: 'Connection test failed'
      });
    }
  };

  const handleDelete = async (id: string) => {
    const user = users.find(u => u.id === id);
    if (!user) return;

    if (!window.confirm(`Are you sure you want to delete user "${user.person.firstName} ${user.person.lastName}"? This will permanently delete both the user and person records.`)) {
      return;
    }

    try {
      setDeleteId(id);
      await peopleApi.delete(id);
      setUsers(users.filter(user => user.id !== id));
    } catch (error) {
      console.error('Failed to delete user:', error);
      setError('Failed to delete user');
    } finally {
      setDeleteId(null);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600">Manage user accounts and personal information</p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={testConnection}
            >
              Test API
            </Button>
            <Link to="/admin/users/new">
              <Button>Create New User</Button>
            </Link>
          </div>
        </div>

        {/* Connection Status */}
        {connectionTest && (
          <Card>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${connectionTest.connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm font-medium">
                  API Connection: {connectionTest.connected ? 'Connected' : 'Disconnected'}
                </span>
                {connectionTest.latency && (
                  <span className="text-sm text-gray-500">({connectionTest.latency}ms)</span>
                )}
                {connectionTest.count !== undefined && (
                  <span className="text-sm text-gray-500">• {connectionTest.count} users</span>
                )}
              </div>
              {connectionTest.error && (
                <span className="text-sm text-red-600">{connectionTest.error}</span>
              )}
            </div>
          </Card>
        )}

        {error && (
          <StatusMessage
            type="error"
            message={error}
            onDismiss={() => setError('')}
          />
        )}

        {/* Users List */}
        <div className="space-y-4">
          {users.map((user) => (
            <Card key={user.id} className="hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {user.person.firstName} {user.person.lastName}
                    </h3>
                    <span className="text-sm text-gray-500">@{user.username}</span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <span>{user.person.email}</span>
                    {user.person.phone && (
                      <>
                        <span>•</span>
                        <span>{user.person.phone}</span>
                      </>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                    <span>Created: {formatDate(user.createdAt)}</span>
                    {user.lastLogin && (
                      <>
                        <span>•</span>
                        <span>Last login: {formatDateTime(user.lastLogin)}</span>
                      </>
                    )}
                  </div>
                  
                  {/* Show specializations if available */}
                  {user.person.specializations && user.person.specializations.length > 0 && (
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm font-medium text-gray-700">Specializations:</span>
                      <div className="flex flex-wrap gap-1">
                        {user.person.specializations.slice(0, 3).map((specialization, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {specialization}
                          </span>
                        ))}
                        {user.person.specializations.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{user.person.specializations.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col space-y-2 ml-4">
                  <div className="flex space-x-2">
                    <Link to={`/admin/users/${user.id}/edit`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(user.id)}
                      loading={deleteId === user.id}
                      className="text-red-600 hover:text-red-700 hover:border-red-300"
                      disabled={user.email === 'admin@m8team.com'} // Prevent deleting main admin
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {users.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-600 mb-4">Get started by creating your first user.</p>
            <Link to="/admin/users/new">
              <Button>Create New User</Button>
            </Link>
          </div>
        )}

        {/* Summary Stats */}
        {users.length > 0 && (
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{users.length}</div>
                <div className="text-sm text-gray-600">Total Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {users.filter(u => u.person.specializations && u.person.specializations.length > 0).length}
                </div>
                <div className="text-sm text-gray-600">With Specializations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {users.filter(u => u.lastLogin && new Date(u.lastLogin) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}
                </div>
                <div className="text-sm text-gray-600">Active (30 days)</div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;