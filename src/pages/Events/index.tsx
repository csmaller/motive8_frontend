import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { eventsApi } from '../../services/adminApi';
import type { Event, EventType } from '../../types';
import defaultEventImage from '../../assets/img/carousel/image3.jpg';

const Events: React.FC = () => {
  const [selectedType, setSelectedType] = useState<EventType | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'type'>('date');
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setIsLoading(true);
        const data = await eventsApi.getAll();
        setEvents(data);
      } catch (error) {
        console.error('Failed to load events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadEvents();
  }, []);
  
  // Sort events chronologically by date (earliest first)
  const sortedEvents = [...events].sort((a, b) => a.date.getTime() - b.date.getTime());
  
  const filteredEvents = selectedType === 'all' 
    ? sortedEvents 
    : sortedEvents.filter(event => event.type === selectedType);

  // Group events by month for better organization
  const groupEventsByMonth = (events: Event[]) => {
    const grouped: { [key: string]: Event[] } = {};
    
    events.forEach(event => {
      const monthKey = event.date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long' 
      });
      
      if (!grouped[monthKey]) {
        grouped[monthKey] = [];
      }
      grouped[monthKey].push(event);
    });
    
    return grouped;
  };

  // Group events by type for type-based organization
  const groupEventsByType = (events: Event[]) => {
    const grouped: { [key in EventType]: Event[] } = {
      race: [],
      training: [],
      social: []
    };
    
    events.forEach(event => {
      grouped[event.type].push(event);
    });
    
    return grouped;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getEventTypeColor = (type: EventType) => {
    switch (type) {
      case 'race':
        return 'bg-athletic-orange text-white';
      case 'training':
        return 'bg-athletic-blue text-white';
      case 'social':
        return 'bg-athletic-green text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getEventTypeIcon = (type: EventType) => {
    switch (type) {
      case 'race':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'training':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        );
      case 'social':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
    }
  };

  const EventCard: React.FC<{ event: Event }> = ({ event }) => {
    const isUpcoming = event.date > new Date();
    const isPastDeadline = event.registrationDeadline && event.registrationDeadline < new Date();
    const isFull = event.maxParticipants && event.currentParticipants && event.currentParticipants >= event.maxParticipants;

    return (
      <Card hover={true} className="h-full">
        <div className="flex flex-col h-full">
          {/* Event Image - 16:9 ratio */}
          <div className="w-full aspect-video mb-4 rounded-lg overflow-hidden bg-gray-200">
            <img 
              src={event.imageUrl || defaultEventImage} 
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Event Type Badge */}
          <div className="flex items-center justify-between mb-4">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getEventTypeColor(event.type)}`}>
              {getEventTypeIcon(event.type)}
              <span className="ml-2 capitalize">{event.type}</span>
            </span>
            {!isUpcoming && (
              <span className="text-sm text-gray-500 font-medium">Past Event</span>
            )}
          </div>

          {/* Event Details */}
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-gray-600">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm">{formatDate(event.date)}</span>
              </div>
              
              <div className="flex items-center text-gray-600">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm">{event.time}</span>
              </div>
              
              <div className="flex items-center text-gray-600">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm">{event.location}</span>
              </div>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed mb-4">{event.description}</p>

            {/* Event Stats */}
            {(event.maxParticipants || event.cost) && (
              <div className="space-y-2 mb-4 p-3 bg-gray-50 rounded-lg">
                {event.maxParticipants && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Participants:</span>
                    <span className="font-medium">
                      {event.currentParticipants || 0} / {event.maxParticipants}
                    </span>
                  </div>
                )}
                {event.cost && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Cost:</span>
                    <span className="font-medium text-primary-600">${event.cost}</span>
                  </div>
                )}
                {event.registrationDeadline && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Registration Deadline:</span>
                    <span className={`font-medium ${isPastDeadline ? 'text-red-600' : 'text-gray-900'}`}>
                      {event.registrationDeadline.toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="mt-auto">
            {event.registrationRequired && isUpcoming ? (
              <Button
                variant={isFull || isPastDeadline ? 'outline' : 'primary'}
                size="sm"
                className="w-full"
                disabled={isFull || isPastDeadline}
                onClick={() => {
                  if (event.paymentUrl && !isFull && !isPastDeadline) {
                    window.open(event.paymentUrl, '_blank', 'noopener,noreferrer');
                  }
                }}
              >
                {isFull ? 'Event Full' : isPastDeadline ? 'Registration Closed' : 'Register Now'}
              </Button>
            ) : isUpcoming ? (
              <Button variant="outline" size="sm" className="w-full">
                Learn More
              </Button>
            ) : (
              <Button variant="outline" size="sm" className="w-full" disabled>
                Event Completed
              </Button>
            )}
          </div>
        </div>
      </Card>
    );
  };

  const renderEventsByDate = () => {
    const groupedEvents = groupEventsByMonth(filteredEvents);
    
    return Object.entries(groupedEvents).map(([month, events]) => (
      <div key={month} className="space-y-6">
        <h3 className="text-2xl font-bold text-gray-900 border-b-2 border-primary-200 pb-2">
          {month}
        </h3>
        <div className="space-y-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    ));
  };

  const renderEventsByType = () => {
    const groupedEvents = groupEventsByType(filteredEvents);
    const typeLabels = {
      race: 'Races',
      training: 'Training Sessions',
      social: 'Social Events'
    };
    
    return Object.entries(groupedEvents).map(([type, events]) => {
      if (events.length === 0) return null;
      
      return (
        <div key={type} className="space-y-6">
          <div className="flex items-center space-x-3">
            <span className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-semibold ${getEventTypeColor(type as EventType)}`}>
              {getEventTypeIcon(type as EventType)}
              <span className="ml-2">{typeLabels[type as EventType]}</span>
            </span>
            <span className="text-gray-500">({events.length} events)</span>
          </div>
          <div className="space-y-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      );
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
      <div className="space-y-12">
      {/* Header Section */}
      <section className="text-center space-y-6">
        <div className="relative">
          {/* Hero image */}
          <div className="w-full h-64 rounded-lg overflow-hidden mb-8">
            
            <div className="absolute inset-0 bg-gradient-to-r from-athletic-orange/80 to-primary-600/80 flex items-center justify-center">
              <div className="text-center text-white">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">Upcoming Events</h1>
                <p className="text-xl md:text-2xl opacity-90">
                  Races, training sessions, and team activities
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <p className="text-lg text-gray-600 leading-relaxed">
            Stay informed about our upcoming races, training sessions, and team events. 
            Mark your calendar and join us for these exciting opportunities to train, 
            compete, and connect with fellow athletes.
          </p>
        </div>
      </section>

      {/* Filters and Sorting */}
      <section>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          {/* Event Type Filter */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedType === 'all' ? 'primary' : 'outline'}
              onClick={() => setSelectedType('all')}
              size="sm"
            >
              All Events ({sortedEvents.length})
            </Button>
            <Button
              variant={selectedType === 'race' ? 'primary' : 'outline'}
              onClick={() => setSelectedType('race')}
              size="sm"
            >
              Races ({sortedEvents.filter(e => e.type === 'race').length})
            </Button>
            <Button
              variant={selectedType === 'training' ? 'primary' : 'outline'}
              onClick={() => setSelectedType('training')}
              size="sm"
            >
              Training ({sortedEvents.filter(e => e.type === 'training').length})
            </Button>
            <Button
              variant={selectedType === 'social' ? 'primary' : 'outline'}
              onClick={() => setSelectedType('social')}
              size="sm"
            >
              Social ({sortedEvents.filter(e => e.type === 'social').length})
            </Button>
          </div>

          {/* Sort Options */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <Button
              variant={sortBy === 'date' ? 'primary' : 'outline'}
              onClick={() => setSortBy('date')}
              size="sm"
            >
              Date
            </Button>
            <Button
              variant={sortBy === 'type' ? 'primary' : 'outline'}
              onClick={() => setSortBy('type')}
              size="sm"
            >
              Type
            </Button>
          </div>
        </div>

        {/* Events Display */}
        <div className="space-y-12">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
              <p className="text-gray-600">No events match the selected filter.</p>
            </div>
          ) : sortBy === 'date' ? (
            renderEventsByDate()
          ) : (
            renderEventsByType()
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center space-y-6 bg-primary-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-12 rounded-lg">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Don't Miss Out!</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Stay updated on all our events and be the first to know about new training opportunities and races.
        </p>
        <div className="flex justify-center">
          <Button variant="outline" size="lg" onClick={() => window.location.href = '/contact'}>
            Contact Us for More Info
          </Button>
        </div>
      </section>
      </div>
    </div>
  );
};

export default Events;