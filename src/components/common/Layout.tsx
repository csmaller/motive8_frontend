import React from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import m8Logo from '../../assets/img/layout/m8logo.png';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      {/* Main content area */}
      <main className="flex-1" role="main">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white" role="contentinfo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand Section */}
            <div>
              <Link 
                to="/" 
                className="inline-block mb-4 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
                aria-label="M8 Team - Go to homepage"
              >
                <img 
                  src={m8Logo} 
                  alt="M8 Team Logo" 
                  className="h-8 w-auto filter brightness-0 invert hover:opacity-80 transition-opacity"
                />
              </Link>
              <p className="text-gray-300 leading-relaxed">
                Join our community of dedicated athletes training for excellence in swimming, cycling, and running.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <nav aria-label="Footer navigation">
                <ul className="space-y-2 text-gray-300">
                  <li>
                    <Link 
                      to="/" 
                      className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/coaches" 
                      className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
                    >
                      Coaches
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/news" 
                      className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
                    >
                      News
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/store" 
                      className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
                    >
                      Store
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/events" 
                      className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
                    >
                      Events
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/velocity-classes" 
                      className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
                    >
                      Velocity Classes
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/contact" 
                      className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
                    >
                      Contact Us
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
              <div className="text-gray-300 space-y-2">
                <p>
                  <a 
                    href="mailto:info@m8team.com" 
                    className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
                    aria-label="Send email to M8 Team"
                  >
                    Email: info@m8team.com
                  </a>
                </p>
                <p>
                  <a 
                    href="tel:+15551234567" 
                    className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
                    aria-label="Call M8 Team"
                  >
                    Phone: (555) 123-4567
                  </a>
                </p>
                <p className="text-sm">
                  123 Athletic Drive<br />
                  Sports City, SC 12345
                </p>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {currentYear} M8 Team. All rights reserved.</p>
            <p className="text-sm mt-2">
              Built with passion for triathlon excellence.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;