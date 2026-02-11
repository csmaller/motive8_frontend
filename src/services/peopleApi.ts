import type { UserProfile, CreateUserData, UpdateUserData } from '../types';
import { API_BASE_URL } from '../config/api';

// API Response interfaces
interface ApiPersonResponse {
  id?: string;
  user_id?: string;
  person_id?: string;
  username?: string;
  user_type?:string;
  email?: string;
  created_at?: string;
  createdAt?: string;
  updated_at?: string;
  updatedAt?: string;
  last_login?: string;
  first_name?: string;
  firstName?: string;
  last_name?: string;
  lastName?: string;
  phone?: string;
  image?: string;
  image_url?: string;
  specializations?: string[];
}

// Export types for use in other files
export type { CreateUserData, UpdateUserData } from '../types';

export const peopleApi = {
  // Get all coaches (users with specializations)
  getCoaches: async (): Promise<UserProfile[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/coaches`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Transform the API response to match our interface
      return data.map((item: ApiPersonResponse) => ({
        id: item.id || item.user_id || '',
        personId: item.person_id || item.id || '',
        username: item.username || '',
        email: item.email || '',
         user_type: item.user_type ||"",
        createdAt: new Date(item.created_at || item.createdAt || Date.now()),
        updatedAt: new Date(item.updated_at || item.updatedAt || Date.now()),
        lastLogin: item.last_login ? new Date(item.last_login) : undefined,
        person: {
          id: item.person_id || item.id || '',
          firstName: item.first_name || item.firstName || '',
          lastName: item.last_name || item.lastName || '',
          phone: item.phone,
          image: item.image_url || item.image,
          specializations: item.specializations || [],
          createdAt: new Date(item.created_at || item.createdAt || Date.now()),
          updatedAt: new Date(item.updated_at || item.updatedAt || Date.now()),
        }
      }));
    } catch (error) {
      console.error('Failed to fetch coaches from API:', error);
      console.log('Falling back to mock data...');
      // Return mock coaches as fallback (filter mock users with specializations)
      return getMockUsers().filter(user => 
        user.person.specializations && user.person.specializations.length > 0
      );
    }
  },

  // Get all users with person data
  getAll: async (): Promise<UserProfile[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/people`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Transform the API response to match our interface
      return data.map((item: ApiPersonResponse) => ({
        id: item.id || item.user_id || '',
        personId: item.person_id || item.id || '',
        username: item.username || '',
        user_type: item.user_type ||"",
        email: item.email || '',
        createdAt: new Date(item.created_at || item.createdAt || Date.now()),
        updatedAt: new Date(item.updated_at || item.updatedAt || Date.now()),
        lastLogin: item.last_login ? new Date(item.last_login) : undefined,
        person: {
          id: item.person_id || item.id || '',
          firstName: item.first_name || item.firstName || '',
          lastName: item.last_name || item.lastName || '',
          phone: item.phone,
          image: item.image_url || item.image,
          specializations: item.specializations || [],
          createdAt: new Date(item.created_at || item.createdAt || Date.now()),
          updatedAt: new Date(item.updated_at || item.updatedAt || Date.now()),
        }
      }));
    } catch (error) {
      console.error('Failed to fetch people from API:', error);
      console.log('Falling back to mock data...');
      // Return mock data as fallback
      return getMockUsers();
    }
  },

  // Get user by ID with person data
  getById: async (id: string): Promise<UserProfile> => {
    try {
      const response = await fetch(`${API_BASE_URL}/people/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const item: ApiPersonResponse = await response.json();
      
      // Transform the API response to match our interface
      return {
        id: item.id || item.user_id || '',
        personId: item.person_id || item.id || '',
        username: item.username || '',
        email: item.email || '',
        user_type:item.user_type ||"",
        createdAt: new Date(item.created_at || item.createdAt || Date.now()),
        updatedAt: new Date(item.updated_at || item.updatedAt || Date.now()),
        lastLogin: item.last_login ? new Date(item.last_login) : undefined,
        person: {
          id: item.person_id || item.id || '',
          firstName: item.first_name || item.firstName || '',
          lastName: item.last_name || item.lastName || '',
          phone: item.phone,
          image: item.image_url || item.image,
          specializations: item.specializations || [],
          createdAt: new Date(item.created_at || item.createdAt || Date.now()),
          updatedAt: new Date(item.updated_at || item.updatedAt || Date.now()),
        }
      };
    } catch (error) {
      console.error('Failed to fetch person from API:', error);
      console.log('Falling back to mock data...');
      const mockUsers = getMockUsers();
      const user = mockUsers.find(u => u.id === id);
      if (!user) throw new Error('Person not found');
      return user;
    }
  },

  // Create new user (creates both person and user records)
  create: async (userData: CreateUserData): Promise<UserProfile> => {
    try {
      // Transform our interface to match API expectations
      // Backend expects nested structure with user and person data
      const apiData = {
        // User fields
        user: {
          username: userData.username,
          email: userData.email,
          password: userData.password,
          user_type: "coach",
        },
        // Person fields
        person: {
          first_name: userData.firstName,
          last_name: userData.lastName,
          phone: userData.phone,
          image_url: userData.image,
          specializations: userData.specializations || [],
        }
      };

      console.log('Creating person with data:', apiData);
      console.log('API URL:', `${API_BASE_URL}/people`);
      console.log('Auth token:', localStorage.getItem('admin_token') ? 'Present' : 'Missing');

      const response = await fetch(`${API_BASE_URL}/people`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        },
        body: JSON.stringify(apiData),
      });

      console.log('Response status:', response.status);
      console.log('Response URL:', response.url);
      console.log('Response redirected:', response.redirected);

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json().catch(() => ({}));
          errorMessage = `HTTP ${response.status}: ${errorData.message || response.statusText}`;
        } else {
          const textResponse = await response.text();
          console.error('Non-JSON response from API:', textResponse.substring(0, 200));
        }
        
        throw new Error(errorMessage);
      }

      const item: ApiPersonResponse = await response.json();
      
      // Transform the API response back to our interface
      return {
        id: item.id || item.user_id || '',
        personId: item.person_id || item.id || '',
        username: item.username || '',
        user_type:"coach",
        email: item.email || '',
        createdAt: new Date(item.created_at || item.createdAt || Date.now()),
        updatedAt: new Date(item.updated_at || item.updatedAt || Date.now()),
        lastLogin: item.last_login ? new Date(item.last_login) : undefined,
        person: {
          id: item.person_id || item.id || '',
          firstName: item.first_name || item.firstName || '',
          lastName: item.last_name || item.lastName || '',
          phone: item.phone,
          image: item.image_url || item.image,
          specializations: item.specializations || [],
          createdAt: new Date(item.created_at || item.createdAt || Date.now()),
          updatedAt: new Date(item.updated_at || item.updatedAt || Date.now()),
        }
      };
    } catch (error) {
      console.error('Failed to create person via API:', error);
      console.log('Falling back to mock creation...');
      // Mock creation for development
      const newUser: UserProfile = {
        id: Date.now().toString(),
        personId: (Date.now() + 1).toString(),
        username: userData.username,
        user_type:"coach",
        email: userData.email,
        createdAt: new Date(),
        updatedAt: new Date(),
        person: {
          id: (Date.now() + 1).toString(),
          firstName: userData.firstName,
          lastName: userData.lastName,
          phone: userData.phone,
          image: userData.image,
          specializations: userData.specializations || [],
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      };
      return newUser;
    }
  },

  // Update user (updates both person and user records)
  update: async (id: string, userData: UpdateUserData): Promise<UserProfile> => {
    try {
      // Transform our interface to match API expectations
      const apiData = {
        first_name: userData.firstName,
        last_name: userData.lastName,
        phone: userData.phone,
        image_url: userData.image, // Backend uses image_url
        specializations: userData.specializations,
        email: userData.email,
        ...(userData.password && { password: userData.password }),
      };

      console.log('Updating person with data:', apiData);
      console.log('API URL:', `${API_BASE_URL}/people/${id}`);

      const response = await fetch(`${API_BASE_URL}/people/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        },
        body: JSON.stringify(apiData),
      });

      console.log('Response status:', response.status);
      console.log('Response URL:', response.url);

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json().catch(() => ({}));
          errorMessage = `HTTP ${response.status}: ${errorData.message || response.statusText}`;
        } else {
          const textResponse = await response.text();
          console.error('Non-JSON response from API:', textResponse.substring(0, 200));
        }
        
        throw new Error(errorMessage);
      }

      const item: ApiPersonResponse = await response.json();
      
      // Transform the API response back to our interface
      return {
        id: item.id || item.user_id || '',
        personId: item.person_id || item.id || '',
        username: item.username || '',
        user_type: item.user_type ||"",
        email: item.email || '',
        createdAt: new Date(item.created_at || item.createdAt || Date.now()),
        updatedAt: new Date(item.updated_at || item.updatedAt || Date.now()),
        lastLogin: item.last_login ? new Date(item.last_login) : undefined,
        person: {
          id: item.person_id || item.id || '',
          firstName: item.first_name || item.firstName || '',
          lastName: item.last_name || item.lastName || '',
          phone: item.phone,
          image: item.image_url || item.image,
          specializations: item.specializations || [],
          createdAt: new Date(item.created_at || item.createdAt || Date.now()),
          updatedAt: new Date(item.updated_at || item.updatedAt || Date.now()),
        }
      };
    } catch (error) {
      console.error('Failed to update person via API:', error);
      console.log('Falling back to mock update...');
      // Mock update for development
      const mockUsers = getMockUsers();
      const existingUser = mockUsers.find(u => u.id === id);
      if (!existingUser) throw new Error('Person not found');
      
      return {
        ...existingUser,
        email: userData.email || existingUser.email,
        updatedAt: new Date(),
        person: {
          ...existingUser.person,
          firstName: userData.firstName || existingUser.person.firstName,
          lastName: userData.lastName || existingUser.person.lastName,
          phone: userData.phone || existingUser.person.phone,
          image: userData.image || existingUser.person.image,
          specializations: userData.specializations || existingUser.person.specializations,
          updatedAt: new Date(),
        }
      };
    }
  },

  // Delete user (deletes both user and person records)
  delete: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/people/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`HTTP ${response.status}: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error('Failed to delete person via API:', error);
      console.log('Falling back to mock deletion...');
      // Mock deletion for development - just log it
      console.log('Mock: Person deleted:', id);
    }
  },

  // Test connection to coaches endpoint
  testCoachesConnection: async (): Promise<{ connected: boolean; latency?: number; error?: string; count?: number }> => {
    const startTime = Date.now();
    
    try {
      const response = await fetch(`${API_BASE_URL}/coaches`, {
        method: 'HEAD',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        },
        signal: AbortSignal.timeout(3000),
      });

      const latency = Date.now() - startTime;

      if (response.ok) {
        // Try to get count from headers if available
        const countHeader = response.headers.get('X-Total-Count');
        return {
          connected: true,
          latency,
          count: countHeader ? parseInt(countHeader, 10) : undefined
        };
      } else {
        return {
          connected: false,
          latency,
          error: `HTTP ${response.status}`
        };
      }
    } catch (error) {
      const latency = Date.now() - startTime;
      return {
        connected: false,
        latency,
        error: error instanceof Error ? error.message : 'Connection failed'
      };
    }
  },

  // Test connection to people endpoint
  testConnection: async (): Promise<{ connected: boolean; latency?: number; error?: string; count?: number }> => {
    const startTime = Date.now();
    
    try {
      const response = await fetch(`${API_BASE_URL}/people`, {
        method: 'HEAD',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        },
        signal: AbortSignal.timeout(3000),
      });

      const latency = Date.now() - startTime;

      if (response.ok) {
        // Try to get count from headers if available
        const countHeader = response.headers.get('X-Total-Count');
        return {
          connected: true,
          latency,
          count: countHeader ? parseInt(countHeader, 10) : undefined
        };
      } else {
        return {
          connected: false,
          latency,
          error: `HTTP ${response.status}`
        };
      }
    } catch (error) {
      const latency = Date.now() - startTime;
      return {
        connected: false,
        latency,
        error: error instanceof Error ? error.message : 'Connection failed'
      };
    }
  }
};

// Mock data for development
function getMockUsers(): UserProfile[] {
  return [
    {
      id: '1',
      personId: '1',
      username: 'admin',
      email: 'admin@m8team.com',
      user_type:"admin",
      lastLogin: new Date('2026-01-30T10:30:00Z'),
      createdAt: new Date('2025-01-01T00:00:00Z'),
      updatedAt: new Date('2026-01-30T10:30:00Z'),
      person: {
        id: '1',
        firstName: 'Admin',
        lastName: 'User',
        phone: '+1-555-0001',
        image: '/src/assets/img/dummy/mark_headshot.png',
        specializations: [],
        createdAt: new Date('2025-01-01T00:00:00Z'),
        updatedAt: new Date('2026-01-30T10:30:00Z'),
      }
    },
    {
      id: '2',
      personId: '2',
      username: 'sarah.coach',
      email: 'sarah@m8team.com',
      user_type:"student",
      lastLogin: new Date('2026-01-29T14:15:00Z'),
      createdAt: new Date('2025-02-15T00:00:00Z'),
      updatedAt: new Date('2026-01-29T14:15:00Z'),
      person: {
        id: '2',
        firstName: 'Sarah',
        lastName: 'Johnson',
        phone: '+1-555-0002',
        image: '/src/assets/img/dummy/mark_headshot.png',
        specializations: ['Swimming', 'Triathlon Training'],
        createdAt: new Date('2025-02-15T00:00:00Z'),
        updatedAt: new Date('2026-01-29T14:15:00Z'),
      }
    },
    {
      id: '3',
      personId: '3',
      username: 'mike.coach',
      email: 'mike@m8team.com',
      user_type:"student",
      lastLogin: new Date('2026-01-28T09:45:00Z'),
      createdAt: new Date('2025-03-01T00:00:00Z'),
      updatedAt: new Date('2026-01-28T09:45:00Z'),
      person: {
        id: '3',
        firstName: 'Mike',
        lastName: 'Rodriguez',
        phone: '+1-555-0003',
        image: '/src/assets/img/dummy/mark_headshot.png',
        specializations: ['Cycling', 'Running'],
        createdAt: new Date('2025-03-01T00:00:00Z'),
        updatedAt: new Date('2026-01-28T09:45:00Z'),
      }
    },
    {
      id: '4',
      personId: '4',
      username: 'john.member',
      user_type:"student",
      email: 'john.doe@email.com',
      lastLogin: new Date('2026-01-25T18:20:00Z'),
      createdAt: new Date('2025-06-10T00:00:00Z'),
      updatedAt: new Date('2026-01-25T18:20:00Z'),
      person: {
        id: '4',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1-555-0004',
        image: '/src/assets/img/dummy/mark_headshot.png',
        specializations: [],
        createdAt: new Date('2025-06-10T00:00:00Z'),
        updatedAt: new Date('2026-01-25T18:20:00Z'),
      }
    },
    {
      id: '5',
      personId: '5',
      username: 'jane.admin',
      email: 'jane.admin@m8team.com',
      user_type:"student",
      lastLogin: new Date('2025-12-15T16:30:00Z'),
      createdAt: new Date('2025-04-20T00:00:00Z'),
      updatedAt: new Date('2025-12-15T16:30:00Z'),
      person: {
        id: '5',
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '+1-555-0005',
        image: '/src/assets/img/dummy/mark_headshot.png',
        specializations: [],
        createdAt: new Date('2025-04-20T00:00:00Z'),
        updatedAt: new Date('2025-12-15T16:30:00Z'),
      }
    }
  ];
}