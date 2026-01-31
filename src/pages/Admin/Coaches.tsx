import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { peopleApi } from '../../services/peopleApi';
import type { UserWithPerson } from '../../types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import StatusMessage from '../../components/ui/StatusMessage';

const AdminCoaches: React.FC = () => {
  const [coaches, setCoaches] = useState<UserWithPerson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    loadCoaches();
  }, []);

  const loadCoaches = async () => {
    try {
      setIsLoading(true);
      const data = await peopleApi.getAll();
      setCoaches(data);
    } catch (error) {
      console.error('Failed to load coaches:', error);
      setError('Failed to load coaches');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const coach = coaches.find(c => c.id === id);
    if (!coach) return;

    if (!window.confirm(`Are you sure you want to delete coach "${coach.person.firstName} ${coach.person.lastName}"?`)) {
      return;
    }

    try {
      setDeleteId(id);
      await peopleApi.delete(id);
      setCoaches(coaches.filter(coach => coach.id !== id));
    } catch (error) {
      console.error('Failed to delete coach:', error);
      setError('Failed to delete coach');
    } finally {
      setDeleteId(null);
    }
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
            <h1 className="text-2xl font-bold text-gray-900">Coaches Management</h1>
            <p className="text-gray-600">Manage your coaching staff</p>
          </div>
          <Link to="/admin/coaches/new">
            <Button>Add New Coach</Button>
          </Link>
        </div>

        {error && (
          <StatusMessage
            type="error"
            message={error}
            onDismiss={() => setError('')}
          />
        )}

        {/* Coaches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coaches.map((coach) => (
            <Card key={coach.id} className="h-full">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <span className="text-xl font-bold text-white">
                      {coach.person.firstName[0]}{coach.person.lastName[0]}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {coach.person.firstName} {coach.person.lastName}
                  </h3>
                  <p className="text-primary-600 font-medium">Coach</p>
                  <p className="text-sm text-gray-500">{coach.person.email}</p>
                  {coach.person.phone && (
                    <p className="text-sm text-gray-500">{coach.person.phone}</p>
                  )}
                </div>

                {coach.person.specializations && coach.person.specializations.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Specializations</h4>
                    <div className="flex flex-wrap gap-1">
                      {coach.person.specializations.slice(0, 3).map((specialization, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {specialization}
                        </span>
                      ))}
                      {coach.person.specializations.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{coach.person.specializations.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex space-x-2">
                  <Link to={`/admin/coaches/${coach.id}/edit`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(coach.id)}
                    loading={deleteId === coach.id}
                    className="text-red-600 hover:text-red-700 hover:border-red-300"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {coaches.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No coaches found</h3>
            <p className="text-gray-600 mb-4">Get started by adding your first coach.</p>
            <Link to="/admin/coaches/new">
              <Button>Add New Coach</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCoaches;