import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import m8Logo from '../../assets/img/layout/m8logo.png';
import m8LogoSmall from '../../assets/img/layout/m8e.png';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const prevLocationRef = useRef(location.pathname);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Coaches', href: '/coaches' },
    { name: 'Store', href: '/store' },
    { name: 'Contact', href: '/contact' },
    { name: 'Events', href: '/events' },
    { name: 'Velocity Classes', href: '/velocity-classes' },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Handle scroll detection
  useEffect(() => {
    const handleScroll = () => {
      try {
        const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
        
        // Use hysteresis to prevent jumping between states
        // When scrolling down, switch at 50px
        // When scrolling up, switch back at 30px
        if (!isScrolled && scrollTop > 50) {
          setIsScrolled(true);
        } else if (isScrolled && scrollTop < 30) {
          setIsScrolled(false);
        }
      } catch (error) {
        console.warn('Scroll handler error:', error);
      }
    };

    // Initial check
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrolled]); // Add isScrolled to dependencies

  // Handle page changes - scroll to top and reset nav state
  useEffect(() => {
    if (prevLocationRef.current !== location.pathname) {
      // Only scroll if the page has loaded and we're not on initial load
      if (prevLocationRef.current !== '') {
        // Use a safer scroll method that doesn't break on refresh
        try {
          window.scrollTo({ top: 0, behavior: 'auto' });
        } catch {
          // Fallback for older browsers or edge cases
          window.scrollTo(0, 0);
        }
      }
      
      prevLocationRef.current = location.pathname;
      
      // Use requestAnimationFrame to avoid synchronous state updates
      requestAnimationFrame(() => {
        setIsScrolled(false);
        setIsMenuOpen(false);
      });
    }
  }, [location.pathname]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMenuOpen) {
        closeMenu();
        menuButtonRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        !menuButtonRef.current?.contains(event.target as Node)
      ) {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  // Focus management for mobile menu
  useEffect(() => {
    if (isMenuOpen) {
      // Focus first menu item when menu opens
      const firstMenuItem = mobileMenuRef.current?.querySelector('a');
      firstMenuItem?.focus();
    }
  }, [isMenuOpen]);

  return (
    <header 
      className={`bg-white shadow-sm sticky top-0 z-50 transition-all duration-300 ease-in-out ${
        isScrolled ? 'h-[50px]' : 'h-32'
      }`} 
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-center h-full gap-12">
          {/* Left Navigation */}
          <nav 
            className={`hidden md:flex space-x-6 transition-all duration-300 ease-in-out ${
              isScrolled ? 'space-x-4' : 'space-x-6'
            }`} 
            role="navigation" 
            aria-label="Main navigation left"
          >
            {navigation.slice(0, 3).map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`font-medium transition-all duration-300 ease-in-out focus:outline-none ${
                  isScrolled ? 'text-xs' : 'text-sm'
                } ${
                  isActive(item.href)
                    ? 'text-[#ecca51]'
                    : 'text-gray-700 hover:text-[#ecca51]'
                }`}
                aria-current={isActive(item.href) ? 'page' : undefined}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button (left side on mobile) */}
          <div className="md:hidden absolute left-4">
            <button
              ref={menuButtonRef}
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-100 focus:outline-none"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMenuOpen ? 'Close main menu' : 'Open main menu'}
            >
              {/* Hamburger icon */}
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} transition-all duration-300 ease-in-out ${
                  isScrolled ? 'h-4 w-4' : 'h-6 w-6'
                }`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Close icon */}
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} transition-all duration-300 ease-in-out ${
                  isScrolled ? 'h-4 w-4' : 'h-6 w-6'
                }`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Centered Logo */}
          <div className="flex-shrink-0">
            <Link 
              to="/" 
              className="flex items-center focus:outline-none rounded-md"
              aria-label="M8 Triathlon Team - Go to homepage"
            >
              <img 
                src={isScrolled ? m8LogoSmall : m8Logo}
                alt="M8 Triathlon Team Logo" 
                className={`w-auto hover:opacity-80 transition-all duration-300 ease-in-out ${
                  isScrolled ? 'h-8' : 'h-36'
                }`}
              />
            </Link>
          </div>

          {/* Right Navigation */}
          <nav 
            className={`hidden md:flex space-x-6 transition-all duration-300 ease-in-out ${
              isScrolled ? 'space-x-4' : 'space-x-6'
            }`} 
            role="navigation" 
            aria-label="Main navigation right"
          >
            {navigation.slice(3).map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`font-medium transition-all duration-300 ease-in-out focus:outline-none ${
                  isScrolled ? 'text-xs' : 'text-sm'
                } ${
                  isActive(item.href)
                    ? 'text-[#ecca51]'
                    : 'text-gray-700 hover:text-[#ecca51]'
                }`}
                aria-current={isActive(item.href) ? 'page' : undefined}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right spacer for mobile to balance layout */}
          <div className="md:hidden w-10 absolute right-4"></div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div 
        id="mobile-menu"
        ref={mobileMenuRef}
        className={`md:hidden transition-all duration-200 ease-in-out ${
          isMenuOpen ? 'block opacity-100' : 'hidden opacity-0'
        }`}
        role="navigation"
        aria-label="Mobile navigation"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200 shadow-lg">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              onClick={closeMenu}
              className={`block px-3 py-2 text-base font-medium transition-colors focus:outline-none ${
                isActive(item.href)
                  ? 'text-[#ecca51]'
                  : 'text-gray-700 hover:text-[#ecca51]'
              }`}
              aria-current={isActive(item.href) ? 'page' : undefined}
              tabIndex={isMenuOpen ? 0 : -1}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;