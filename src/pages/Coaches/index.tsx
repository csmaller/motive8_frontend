import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { peopleApi } from '../../services/peopleApi';
import type { UserProfile } from '../../types';
import markHeadshot from '../../assets/img/dummy/mark_headshot.png';

const Coaches: React.FC = () => {
  const [coaches, setCoaches] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCoaches = async () => {
      try {
        const coaches = await peopleApi.getCoaches();
        setCoaches(coaches);
      } catch (error) {
        console.error('Failed to load coaches:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCoaches();
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  const CoachCard: React.FC<{ coach: UserProfile }> = ({ coach }) => (
    <Card hover={true} className="h-full">
      <div className="text-center mb-6">
        {/* Coach headshot image */}
        <div className="w-48 h-48 max-w-[200px] max-h-[200px] mx-auto mb-4 overflow-hidden rounded-full">
          <img
            src={coach.person.image || markHeadshot}
            alt={`${coach.person.firstName} ${coach.person.lastName} - Triathlon Coach`}
            className="w-full h-full object-cover rounded-full"
            onError={(e) => {
              // Fallback to default headshot if uploaded image fails to load
              const target = e.target as HTMLImageElement;
              target.src = markHeadshot;
            }}
          />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-1">
          {coach.person.firstName} {coach.person.lastName}
        </h3>
        <p className="text-primary-600 font-medium mb-2">Coach</p>
        {coach.person.phone && (
          <p className="text-sm text-gray-500">{coach.person.phone}</p>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Contact</h4>
          <p className="text-gray-600 text-sm">{coach.email}</p>
          {coach.person.phone && (
            <p className="text-gray-600 text-sm">{coach.person.phone}</p>
          )}
        </div>

        {coach.person.specializations && coach.person.specializations.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Specialties</h4>
            <div className="flex flex-wrap gap-2">
              {coach.person.specializations.map((specialty, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-athletic-blue bg-opacity-10 text-athletic-blue text-xs font-medium rounded-full"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.href = `mailto:${coach.email}`}
            className="w-full"
          >
            Contact Coach
          </Button>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Coaches</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Our experienced coaching team is dedicated to helping you achieve your triathlon goals. 
          Each coach brings unique expertise and passion to guide you through your training journey.
        </p>
      </div>

      {coaches.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No coaches available</h3>
          <p className="text-gray-600">
            Our coaching team information will be available soon.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {coaches.map((coach) => (
            <CoachCard key={coach.id} coach={coach} />
          ))}
        </div>
      )}

      <div className="text-center mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Start Training?</h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Contact any of our coaches to discuss your goals and find the perfect training program for you.
        </p>
        <Button
          onClick={() => window.location.href = '/contact'}
          size="lg"
        >
          Get Started Today
        </Button>
      </div>
    </div>
  );
};

export default Coaches;