import React, { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { AuthContextType } from '../types/auth';
import type { UserProfile } from '../types';
import { AuthContext } from './auth';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on app load
    try {
      const token = localStorage.getItem('admin_token');
      const userData = localStorage.getItem('admin_user');
      
      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.removeItem('admin_token');
          localStorage.removeItem('admin_user');
        }
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Mock API call - replace with actual API endpoint
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const { token, user: userData } = data;
        
        localStorage.setItem('admin_token', token);
        localStorage.setItem('admin_user', JSON.stringify(userData));
        setUser(userData);
        return true;
      } else {
        // For demo purposes, allow login with demo credentials
        if (email === 'admin@m8team.com' && password === 'admin123') {
          const mockUser: UserProfile = {
            id: '1',
            personId: '1',
            username: 'admin',
            email: 'admin@m8team.com',
            createdAt: new Date(),
            updatedAt: new Date(),
            person: {
              id: '1',
              firstName: 'Admin',
              lastName: 'User',
              phone: '+1-555-0001',
              createdAt: new Date(),
              updatedAt: new Date(),
            }
          };
          
          localStorage.setItem('admin_token', 'mock_token_123');
          localStorage.setItem('admin_user', JSON.stringify(mockUser));
          setUser(mockUser);
          return true;
        }
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Fallback for demo - allow login with demo credentials
      if (email === 'admin@m8team.com' && password === 'admin123') {
        const mockUser: UserProfile = {
          id: '1',
          personId: '1',
          username: 'admin',
          email: 'admin@m8team.com',
          createdAt: new Date(),
          updatedAt: new Date(),
          person: {
            id: '1',
            firstName: 'Admin',
            lastName: 'User',
            phone: '+1-555-0001',
            createdAt: new Date(),
            updatedAt: new Date(),
          }
        };
        
        localStorage.setItem('admin_token', 'mock_token_123');
        localStorage.setItem('admin_user', JSON.stringify(mockUser));
        setUser(mockUser);
        return true;
      }
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user,
    isSuperAdmin: user?.email === 'admin@m8team.com', // Check if user is admin by email
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};