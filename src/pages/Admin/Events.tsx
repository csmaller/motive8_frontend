import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventsApi } from '../../services/adminApi';
import type { Event } from '../../types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import StatusMessage from '../../components/ui/StatusMessage';

const AdminEvents: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<Event['type'] | 'all'>('all');

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setIsLoading(true);
      const data = await eventsApi.getAll();
      // Sort by date, newest first
      const sortedData = data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setEvents(sortedData);
    } catch (error) {
      console.error('Failed to load events:', error);
      setError('Failed to load events');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      setDeleteId(id);
      await eventsApi.delete(id);
      setEvents(events.filter(event => event.id !== id));
    } catch (error) {
      console.error('Failed to delete event:', error);
      setError('Failed to delete event');
    } finally {
      setDeleteId(null);
    }
  };

  const eventTypes: (Event['type'] | 'all')[] = ['all', 'race', 'training', 'social'];

  const filteredEvents = events.filter(event => {
    return selectedType === 'all' || event.type === selectedType;
  });

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTypeColor = (type: Event['type']) => {
    switch (type) {
      case 'race':
        return 'bg-red-100 text-red-800';
      case 'training':
        return 'bg-blue-100 text-blue-800';
      case 'social':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRegistrationStatus = (event: Event) => {
    if (!event.registrationRequired) {
      return { text: 'No Registration Required', color: 'bg-gray-100 text-gray-800' };
    }
    
    const maxParticipants = event.maxParticipants || 0;
    const currentParticipants = event.currentParticipants || 0;
    const spotsLeft = maxParticipants - currentParticipants;
    
    if (spotsLeft <= 0) {
      return { text: 'Full', color: 'bg-red-100 text-red-800' };
    } else if (spotsLeft <= 5) {
      return { text: `${spotsLeft} spots left`, color: 'bg-yellow-100 text-yellow-800' };
    } else {
      return { text: `${spotsLeft} spots available`, color: 'bg-green-100 text-green-800' };
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
            <h1 className="text-2xl font-bold text-gray-900">Events Management</h1>
            <p className="text-gray-600">Manage races, training sessions, and social events</p>
          </div>
          <Link to="/admin/events/new">
            <Button>Create New Event</Button>
          </Link>
        </div>

        {error && (
          <StatusMessage
            type="error"
            message={error}
            onDismiss={() => setError('')}
          />
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-gray-700 self-center">Type:</span>
          {eventTypes.map((type) => (
            <Button
              key={type}
              variant={selectedType === type ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedType(type)}
            >
              {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
            </Button>
          ))}
        </div>

        {/* Events List */}
        <div className="space-y-4">
          {filteredEvents.map((event) => {
            const registrationStatus = getRegistrationStatus(event);
            const isUpcoming = new Date(event.date) > new Date();
            
            return (
              <Card key={event.id} className="hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {event.title}
                      </h3>
                      {!isUpcoming && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          Past Event
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {event.description}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                      <span>{formatDate(event.date)} at {event.time}</span>
                      <span>•</span>
                      <span>{event.location}</span>
                      {event.cost && (
                        <>
                          <span>•</span>
                          <span>${event.cost}</span>
                        </>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(event.type)}`}>
                        {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${registrationStatus.color}`}>
                        {registrationStatus.text}
                      </span>
                      {event.registrationRequired && (
                        <span className="text-xs text-gray-500">
                          {event.currentParticipants || 0}/{event.maxParticipants || 0} registered
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2 ml-4">
                    <div className="flex space-x-2">
                      <Link to={`/admin/events/${event.id}/edit`}>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(event.id)}
                        loading={deleteId === event.id}
                        className="text-red-600 hover:text-red-700 hover:border-red-300"
                      >
                        Delete
                      </Button>
                    </div>
                    
                    {event.registrationRequired && isUpcoming && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Mock registration management
                          console.log('Manage registrations for event:', event.id);
                        }}
                      >
                        Registrations
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {filteredEvents.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600 mb-4">
              {selectedType !== 'all'
                ? 'Try adjusting your filters or create a new event.'
                : 'Get started by creating your first event.'
              }
            </p>
            <Link to="/admin/events/new">
              <Button>Create New Event</Button>
            </Link>
          </div>
        )}

        {/* Summary Stats */}
        {events.length > 0 && (
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Events Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{events.length}</div>
                <div className="text-sm text-gray-600">Total Events</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {events.filter(e => new Date(e.date) > new Date()).length}
                </div>
                <div className="text-sm text-gray-600">Upcoming</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {events.filter(e => e.type === 'race').length}
                </div>
                <div className="text-sm text-gray-600">Races</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {events.reduce((sum, e) => sum + (e.currentParticipants || 0), 0)}
                </div>
                <div className="text-sm text-gray-600">Total Registrations</div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminEvents;