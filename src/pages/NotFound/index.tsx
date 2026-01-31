import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-lg w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-primary-200 mb-4">404</div>
          <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-12 h-12 text-primary-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 20c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8a7.962 7.962 0 01-2 5.291z"
              />
            </svg>
          </div>
        </div>

        {/* Content */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          Sorry, we couldn't find the page you're looking for. 
          The page may have been moved, deleted, or you may have entered an incorrect URL.
        </p>

        {/* Navigation Options */}
        <div className="space-y-4">
          <Link to="/">
            <Button size="lg" className="w-full sm:w-auto">
              Go to Home Page
            </Button>
          </Link>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/coaches">
              <Button variant="outline" size="md" className="w-full sm:w-auto">
                Meet Our Coaches
              </Button>
            </Link>
            
            <Link to="/velocity-classes">
              <Button variant="outline" size="md" className="w-full sm:w-auto">
                View Classes
              </Button>
            </Link>
            
            <Link to="/contact">
              <Button variant="outline" size="md" className="w-full sm:w-auto">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Popular Pages
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            <Link
              to="/events"
              className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 hover:border-primary-300"
            >
              <h3 className="font-medium text-gray-900 mb-1">Upcoming Events</h3>
              <p className="text-sm text-gray-600">
                View our races, training sessions, and team activities
              </p>
            </Link>
            
            <Link
              to="/velocity-classes"
              className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 hover:border-primary-300"
            >
              <h3 className="font-medium text-gray-900 mb-1">Velocity Classes</h3>
              <p className="text-sm text-gray-600">
                Register for specialized cycling training programs
              </p>
            </Link>
          </div>
        </div>

        {/* Search Suggestion */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>Looking for something specific?</strong> Try using our navigation menu 
            or <Link to="/contact" className="underline hover:no-underline">contact us</Link> for help.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;