import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Image from '../../components/ui/Image';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { velocityClassesApi } from '../../services/adminApi';
import type { VelocityClass, ExperienceLevel } from '../../types';
import velocityImage from '../../assets/img/layout/velocity.png';

const REGISTRATION_URL = 'https://app.vqvelocity.com/join?a=4o1rcm';

const VelocityClasses: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState<ExperienceLevel | 'all'>('all');
  const [classes, setClasses] = useState<VelocityClass[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadClasses = async () => {
      try {
        setIsLoading(true);
        const data = await velocityClassesApi.getAll();
        setClasses(data);
      } catch (error) {
        console.error('Failed to load velocity classes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadClasses();
  }, []);
  
  const filteredClasses = selectedLevel === 'all' 
    ? classes 
    : classes.filter(cls => cls.level === selectedLevel);

  const handleRegisterClick = () => {
    window.open(REGISTRATION_URL, '_blank', 'noopener,noreferrer');
  };

  const getLevelColor = (level: ExperienceLevel) => {
    switch (level) {
      case 'beginner':
        return 'bg-athletic-green text-white';
      case 'intermediate':
        return 'bg-athletic-blue text-white';
      case 'advanced':
        return 'bg-athletic-orange text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getLevelIcon = (level: ExperienceLevel) => {
    switch (level) {
      case 'beginner':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      case 'intermediate':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        );
      case 'advanced':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
    }
  };

  const ClassCard: React.FC<{ velocityClass: VelocityClass }> = ({ velocityClass }) => {
    const spotsRemaining = velocityClass.maxParticipants - velocityClass.currentEnrollment;
    const isAlmostFull = spotsRemaining <= 3 && spotsRemaining > 0;
    const isFull = spotsRemaining <= 0;

    return (
      <Card hover={true} className="h-full">
        <div className="flex flex-col h-full">
          {/* Class Level Badge */}
          <div className="flex items-center justify-between mb-4">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(velocityClass.level)}`}>
              {getLevelIcon(velocityClass.level)}
              <span className="ml-2 capitalize">{velocityClass.level}</span>
            </span>
            {isFull ? (
              <span className="text-sm text-red-600 font-medium">Class Full</span>
            ) : isAlmostFull ? (
              <span className="text-sm text-orange-600 font-medium">Almost Full</span>
            ) : (
              <span className="text-sm text-green-600 font-medium">Available</span>
            )}
          </div>

          {/* Class Details */}
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{velocityClass.name}</h3>
            
            <p className="text-gray-600 text-sm leading-relaxed mb-4">{velocityClass.description}</p>

            <div className="space-y-3 mb-4">
              <div className="flex items-start text-gray-600">
                <svg className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div>
                  <span className="text-sm font-medium">Schedule:</span>
                  <p className="text-sm">{velocityClass.schedule}</p>
                </div>
              </div>
              
              <div className="flex items-center text-gray-600">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm"><span className="font-medium">Duration:</span> {velocityClass.duration}</span>
              </div>
              
              <div className="flex items-center text-gray-600">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm"><span className="font-medium">Location:</span> {velocityClass.location}</span>
              </div>

              <div className="flex items-center text-gray-600">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-sm"><span className="font-medium">Instructor:</span> {velocityClass.instructor}</span>
              </div>
            </div>

            {/* Class Stats */}
            <div className="space-y-2 mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Enrollment:</span>
                <span className="font-medium">
                  {velocityClass.currentEnrollment} / {velocityClass.maxParticipants}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Cost:</span>
                <span className="font-medium text-primary-600">${velocityClass.cost}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${isFull ? 'bg-red-500' : isAlmostFull ? 'bg-orange-500' : 'bg-green-500'}`}
                  style={{ width: `${(velocityClass.currentEnrollment / velocityClass.maxParticipants) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Equipment & Prerequisites */}
            {(velocityClass.equipment || velocityClass.prerequisites) && (
              <div className="space-y-3 mb-4">
                {velocityClass.equipment && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-1">Required Equipment:</h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {velocityClass.equipment.map((item, index) => (
                        <li key={index} className="flex items-center">
                          <svg className="w-3 h-3 text-gray-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {velocityClass.prerequisites && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-1">Prerequisites:</h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {velocityClass.prerequisites.map((prereq, index) => (
                        <li key={index} className="flex items-center">
                          <svg className="w-3 h-3 text-gray-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                          {prereq}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="mt-auto">
            <Button
              variant="primary"
              size="sm"
              className="w-full"
              onClick={handleRegisterClick}
            >
              Register for Class
            </Button>
          </div>
        </div>
      </Card>
    );
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
      {/* Header Section with Velocity Image */}
      <section className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">Velocity Cycling Classes</h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            Specialized cycling training for all levels
          </p>
        </div>
        
        {/* Image and Description Layout */}
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Left-aligned Velocity Image */}
          <div className="lg:w-1/2 flex-shrink-0">
            <Image 
              src={velocityImage} 
              alt="Velocity Cycling Training - Professional cycling classes and instruction"
              className="w-full h-auto rounded-lg shadow-lg object-cover"
              lazy={false}
            />
          </div>
          
          {/* Right-aligned Text Content */}
          <div className="lg:w-1/2 space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">
              Transform Your Cycling Performance
            </h2>
            <div className="space-y-4 text-lg text-gray-600 leading-relaxed">
              <p>
                Our Velocity cycling classes are designed to help cyclists of all levels 
                improve their performance through structured, science-based training programs.
              </p>
              <p>
                From beginner-friendly sessions focusing on technique and safety to advanced 
                training with power meters and performance analytics, we offer comprehensive 
                programs to help you reach your cycling goals.
              </p>
              <p>
                Whether you're preparing for your first triathlon or looking to improve your 
                competitive edge, our expert instructors will guide you every pedal stroke of the way.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg"
                onClick={() => {
                  document.getElementById('classes-section')?.scrollIntoView({ 
                    behavior: 'smooth' 
                  });
                }}
              >
                View All Classes
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={handleRegisterClick}
              >
                Register Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Level Filter */}
      <section id="classes-section">
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Button
            variant={selectedLevel === 'all' ? 'primary' : 'outline'}
            onClick={() => setSelectedLevel('all')}
            size="sm"
          >
            All Classes ({classes.length})
          </Button>
          <Button
            variant={selectedLevel === 'beginner' ? 'primary' : 'outline'}
            onClick={() => setSelectedLevel('beginner')}
            size="sm"
          >
            Beginner ({classes.filter(c => c.level === 'beginner').length})
          </Button>
          <Button
            variant={selectedLevel === 'intermediate' ? 'primary' : 'outline'}
            onClick={() => setSelectedLevel('intermediate')}
            size="sm"
          >
            Intermediate ({classes.filter(c => c.level === 'intermediate').length})
          </Button>
          <Button
            variant={selectedLevel === 'advanced' ? 'primary' : 'outline'}
            onClick={() => setSelectedLevel('advanced')}
            size="sm"
          >
            Advanced ({classes.filter(c => c.level === 'advanced').length})
          </Button>
        </div>

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredClasses.map((velocityClass) => (
            <ClassCard key={velocityClass.id} velocityClass={velocityClass} />
          ))}
        </div>

        {filteredClasses.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No classes found</h3>
            <p className="text-gray-600">No classes match the selected level.</p>
          </div>
        )}
      </section>

      {/* Why Choose Velocity Classes */}
      <section className="bg-gray-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-12 rounded-lg">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-8">
            Why Choose Velocity Classes?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-athletic-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Structured Progression</h3>
              <p className="text-gray-600">
                Our classes are designed with clear progression paths from beginner to advanced levels.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-athletic-green rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Performance Tracking</h3>
              <p className="text-gray-600">
                Monitor your progress with power meters and advanced cycling metrics.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-athletic-orange rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Small Group Training</h3>
              <p className="text-gray-600">
                Limited class sizes ensure personalized attention and optimal learning.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center space-y-6 bg-primary-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-12 rounded-lg">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Ready to Improve Your Cycling?</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Join our Velocity cycling classes and take your performance to the next level with expert instruction and proven training methods.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg"
            onClick={handleRegisterClick}
          >
            Register for a Class
          </Button>
          <Button variant="outline" size="lg" onClick={() => window.location.href = '/contact'}>
            Ask Questions
          </Button>
        </div>
      </section>
      </div>
    </div>
  );
};

export default VelocityClasses;