import type { Coach, Event, Product, VelocityClass, NewsArticle } from '../types';
import { API_BASE_URL } from '../config/api';

// Coaches API
export const coachesApi = {
  getAll: async (): Promise<Coach[]> => {
    // For demo, return mock data - replace with actual API call
    const { mockCoaches } = await import('../data/mockData');
    return mockCoaches;
  },

  getById: async (id: string): Promise<Coach> => {
    const { mockCoaches } = await import('../data/mockData');
    const coach = mockCoaches.find(c => c.id === id);
    if (!coach) throw new Error('Coach not found');
    return coach;
  },

  create: async (coach: Omit<Coach, 'id'>): Promise<Coach> => {
    // Mock implementation - replace with actual API call
    const newCoach: Coach = {
      ...coach,
      id: Date.now().toString(),
    };
    console.log('Creating coach:', newCoach);
    return newCoach;
  },

  update: async (id: string, coach: Partial<Coach>): Promise<Coach> => {
    // Mock implementation - replace with actual API call
    console.log('Updating coach:', id, coach);
    const { mockCoaches } = await import('../data/mockData');
    const existingCoach = mockCoaches.find(c => c.id === id);
    if (!existingCoach) throw new Error('Coach not found');
    return { ...existingCoach, ...coach };
  },

  delete: async (id: string): Promise<void> => {
    // Mock implementation - replace with actual API call
    console.log('Deleting coach:', id);
  },
};

// Events API
export const eventsApi = {
  getAll: async (): Promise<Event[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/events`, {
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
      
      // Transform API response to match our interface
      return data.map((item: Record<string, unknown>) => ({
        id: item.id || item.event_id,
        title: item.title,
        description: item.description,
        date: new Date(item.date as string),
        time: item.time,
        location: item.location,
        type: item.type,
        cost: item.cost,
        registrationRequired: item.registration_required ?? item.registrationRequired,
        maxParticipants: item.max_participants ?? item.maxParticipants,
        currentParticipants: item.current_participants ?? item.currentParticipants,
        registrationDeadline: item.registration_deadline ? new Date(item.registration_deadline as string) : undefined,
        imageUrl: item.image_url ?? item.imageUrl,
      }));
    } catch (error) {
      console.error('Failed to fetch events from API:', error);
      console.log('Falling back to mock data...');
      const { mockEvents } = await import('../data/mockData');
      return mockEvents;
    }
  },

  getById: async (id: string): Promise<Event> => {
    try {
      const response = await fetch(`${API_BASE_URL}/events/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const item = await response.json();
      
      return {
        id: item.id || item.event_id,
        title: item.title,
        description: item.description,
        date: new Date(item.date),
        time: item.time,
        location: item.location,
        type: item.type,
        cost: item.cost,
        registrationRequired: item.registration_required ?? item.registrationRequired,
        maxParticipants: item.max_participants ?? item.maxParticipants,
        currentParticipants: item.current_participants ?? item.currentParticipants,
        registrationDeadline: item.registration_deadline ? new Date(item.registration_deadline) : undefined,
        imageUrl: item.image_url ?? item.imageUrl,
      };
    } catch (error) {
      console.error('Failed to fetch event from API:', error);
      console.log('Falling back to mock data...');
      const { mockEvents } = await import('../data/mockData');
      const event = mockEvents.find(e => e.id === id);
      if (!event) throw new Error('Event not found');
      return event;
    }
  },

  create: async (event: Omit<Event, 'id'>): Promise<Event> => {
    try {
      // Transform to API format
      const apiData = {
        title: event.title,
        description: event.description,
        date: event.date instanceof Date ? event.date.toISOString().split('T')[0] : event.date,
        time: event.time,
        location: event.location,
        type: event.type,
        cost: event.cost,
        registration_required: event.registrationRequired,
        max_participants: event.maxParticipants,
        current_participants: event.currentParticipants || 0,
        registration_deadline: event.registrationDeadline instanceof Date ? event.registrationDeadline.toISOString().split('T')[0] : event.registrationDeadline,
        image_url: event.imageUrl,
      };

      const response = await fetch(`${API_BASE_URL}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`HTTP ${response.status}: ${errorData.message || response.statusText}`);
      }

      const item = await response.json();
      
      return {
        id: item.id || item.event_id,
        title: item.title,
        description: item.description,
        date: new Date(item.date),
        time: item.time,
        location: item.location,
        type: item.type,
        cost: item.cost,
        registrationRequired: item.registration_required ?? item.registrationRequired,
        maxParticipants: item.max_participants ?? item.maxParticipants,
        currentParticipants: item.current_participants ?? item.currentParticipants,
        registrationDeadline: item.registration_deadline ? new Date(item.registration_deadline) : undefined,
        imageUrl: item.image_url ?? item.imageUrl,
      };
    } catch (error) {
      console.error('Failed to create event via API:', error);
      console.log('Falling back to mock creation...');
      const newEvent: Event = {
        ...event,
        id: Date.now().toString(),
        date: event.date instanceof Date ? event.date : new Date(event.date),
      };
      return newEvent;
    }
  },

  update: async (id: string, event: Partial<Event>): Promise<Event> => {
    try {
      // Transform to API format
      const apiData: Record<string, unknown> = {};
      if (event.title !== undefined) apiData.title = event.title;
      if (event.description !== undefined) apiData.description = event.description;
      if (event.date !== undefined) {
        apiData.date = event.date instanceof Date ? event.date.toISOString().split('T')[0] : event.date;
      }
      if (event.time !== undefined) apiData.time = event.time;
      if (event.location !== undefined) apiData.location = event.location;
      if (event.type !== undefined) apiData.type = event.type;
      if (event.cost !== undefined) apiData.cost = event.cost;
      if (event.registrationRequired !== undefined) apiData.registration_required = event.registrationRequired;
      if (event.maxParticipants !== undefined) apiData.max_participants = event.maxParticipants;
      if (event.currentParticipants !== undefined) apiData.current_participants = event.currentParticipants;
      if (event.registrationDeadline !== undefined) {
        apiData.registration_deadline = event.registrationDeadline instanceof Date ? event.registrationDeadline.toISOString().split('T')[0] : event.registrationDeadline;
      }
      if (event.imageUrl !== undefined) apiData.image_url = event.imageUrl;

      const response = await fetch(`${API_BASE_URL}/events/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`HTTP ${response.status}: ${errorData.message || response.statusText}`);
      }

      const item = await response.json();
      
      return {
        id: item.id || item.event_id,
        title: item.title,
        description: item.description,
        date: new Date(item.date),
        time: item.time,
        location: item.location,
        type: item.type,
        cost: item.cost,
        registrationRequired: item.registration_required ?? item.registrationRequired,
        maxParticipants: item.max_participants ?? item.maxParticipants,
        currentParticipants: item.current_participants ?? item.currentParticipants,
        registrationDeadline: item.registration_deadline ? new Date(item.registration_deadline) : undefined,
        imageUrl: item.image_url ?? item.imageUrl,
      };
    } catch (error) {
      console.error('Failed to update event via API:', error);
      console.log('Falling back to mock update...');
      const { mockEvents } = await import('../data/mockData');
      const existingEvent = mockEvents.find(e => e.id === id);
      if (!existingEvent) throw new Error('Event not found');
      return { 
        ...existingEvent, 
        ...event,
        date: event.date instanceof Date ? event.date : (event.date ? new Date(event.date) : existingEvent.date),
      };
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/events/${id}`, {
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
      console.error('Failed to delete event via API:', error);
      console.log('Falling back to mock deletion...');
      console.log('Mock: Event deleted:', id);
    }
  },
};

// Products API
export const productsApi = {
  getAll: async (): Promise<Product[]> => {
    const { mockProducts } = await import('../data/mockData');
    return mockProducts;
  },

  getById: async (id: string): Promise<Product> => {
    const { mockProducts } = await import('../data/mockData');
    const product = mockProducts.find(p => p.id === id);
    if (!product) throw new Error('Product not found');
    return product;
  },

  create: async (product: Omit<Product, 'id'>): Promise<Product> => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
    };
    console.log('Creating product:', newProduct);
    return newProduct;
  },

  update: async (id: string, product: Partial<Product>): Promise<Product> => {
    console.log('Updating product:', id, product);
    const { mockProducts } = await import('../data/mockData');
    const existingProduct = mockProducts.find(p => p.id === id);
    if (!existingProduct) throw new Error('Product not found');
    return { ...existingProduct, ...product };
  },

  delete: async (id: string): Promise<void> => {
    console.log('Deleting product:', id);
  },
};

// Velocity Classes API
export const velocityClassesApi = {
  getAll: async (): Promise<VelocityClass[]> => {
    const { mockVelocityClasses } = await import('../data/mockData');
    return mockVelocityClasses;
  },

  getById: async (id: string): Promise<VelocityClass> => {
    const { mockVelocityClasses } = await import('../data/mockData');
    const velocityClass = mockVelocityClasses.find(v => v.id === id);
    if (!velocityClass) throw new Error('Velocity class not found');
    return velocityClass;
  },

  create: async (velocityClass: Omit<VelocityClass, 'id'>): Promise<VelocityClass> => {
    const newVelocityClass: VelocityClass = {
      ...velocityClass,
      id: Date.now().toString(),
    };
    console.log('Creating velocity class:', newVelocityClass);
    return newVelocityClass;
  },

  update: async (id: string, velocityClass: Partial<VelocityClass>): Promise<VelocityClass> => {
    console.log('Updating velocity class:', id, velocityClass);
    const { mockVelocityClasses } = await import('../data/mockData');
    const existingClass = mockVelocityClasses.find(v => v.id === id);
    if (!existingClass) throw new Error('Velocity class not found');
    return { ...existingClass, ...velocityClass };
  },

  delete: async (id: string): Promise<void> => {
    console.log('Deleting velocity class:', id);
  },
};

// News API
export const newsApi = {
  getAll: async (): Promise<NewsArticle[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/news`, {
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
      
      return data.map((item: Record<string, unknown>) => ({
        id: item.id || item.article_id,
        title: item.title,
        slug: item.slug,
        excerpt: item.excerpt,
        content: item.content,
        author: item.author,
        publishedAt: new Date(item.published_at as string || item.publishedAt as string),
        updatedAt: new Date(item.updated_at as string || item.updatedAt as string),
        status: item.status,
        category: item.category,
        featuredImage: item.featured_image || item.featuredImage,
        tags: item.tags || [],
        featured: item.featured || false,
        readTime: item.read_time || item.readTime || 5,
      }));
    } catch (error) {
      console.error('Failed to fetch news from API:', error);
      console.log('Falling back to mock data...');
      const { mockNewsArticles } = await import('../data/mockData');
      return mockNewsArticles;
    }
  },

  getById: async (id: string): Promise<NewsArticle> => {
    try {
      const response = await fetch(`${API_BASE_URL}/news/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const item = await response.json();
      
      return {
        id: item.id || item.article_id,
        title: item.title,
        slug: item.slug,
        excerpt: item.excerpt,
        content: item.content,
        author: item.author,
        publishedAt: new Date(item.published_at || item.publishedAt),
        updatedAt: new Date(item.updated_at || item.updatedAt),
        status: item.status,
        category: item.category,
        featuredImage: item.featured_image || item.featuredImage,
        tags: item.tags || [],
        featured: item.featured || false,
        readTime: item.read_time || item.readTime || 5,
      };
    } catch (error) {
      console.error('Failed to fetch article from API:', error);
      console.log('Falling back to mock data...');
      const { mockNewsArticles } = await import('../data/mockData');
      const article = mockNewsArticles.find(a => a.id === id);
      if (!article) throw new Error('Article not found');
      return article;
    }
  },

  create: async (article: Omit<NewsArticle, 'id' | 'publishedAt' | 'updatedAt'>): Promise<NewsArticle> => {
    try {
      const apiData = {
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        content: article.content,
        author: article.author,
        status: article.status,
        category: article.category,
        featured_image: article.featuredImage,
        tags: article.tags,
        featured: article.featured,
        read_time: article.readTime,
      };

      const response = await fetch(`${API_BASE_URL}/news`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        // Check if response is JSON before trying to parse
        const contentType = response.headers.get('content-type');
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json().catch(() => ({}));
          errorMessage = `HTTP ${response.status}: ${errorData.message || response.statusText}`;
        }
        
        throw new Error(errorMessage);
      }

      const item = await response.json();
      
      return {
        id: item.id || item.article_id,
        title: item.title,
        slug: item.slug,
        excerpt: item.excerpt,
        content: item.content,
        author: item.author,
        publishedAt: new Date(item.published_at || item.publishedAt),
        updatedAt: new Date(item.updated_at || item.updatedAt),
        status: item.status,
        category: item.category,
        featuredImage: item.featured_image || item.featuredImage,
        tags: item.tags || [],
        featured: item.featured || false,
        readTime: item.read_time || item.readTime || 5,
      };
    } catch (error) {
      console.error('Failed to create article via API:', error);
      console.log('Falling back to mock creation...');
      const newArticle: NewsArticle = {
        ...article,
        id: Date.now().toString(),
        publishedAt: new Date(),
        updatedAt: new Date(),
      };
      return newArticle;
    }
  },

  update: async (id: string, article: Partial<NewsArticle>): Promise<NewsArticle> => {
    try {
      const apiData: Record<string, unknown> = {};
      if (article.title !== undefined) apiData.title = article.title;
      if (article.slug !== undefined) apiData.slug = article.slug;
      if (article.excerpt !== undefined) apiData.excerpt = article.excerpt;
      if (article.content !== undefined) apiData.content = article.content;
      if (article.author !== undefined) apiData.author = article.author;
      if (article.status !== undefined) apiData.status = article.status;
      if (article.category !== undefined) apiData.category = article.category;
      if (article.featuredImage !== undefined) apiData.featured_image = article.featuredImage;
      if (article.tags !== undefined) apiData.tags = article.tags;
      if (article.featured !== undefined) apiData.featured = article.featured;
      if (article.readTime !== undefined) apiData.read_time = article.readTime;

      const response = await fetch(`${API_BASE_URL}/news/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json().catch(() => ({}));
          errorMessage = `HTTP ${response.status}: ${errorData.message || response.statusText}`;
        }
        
        throw new Error(errorMessage);
      }

      const item = await response.json();
      
      return {
        id: item.id || item.article_id,
        title: item.title,
        slug: item.slug,
        excerpt: item.excerpt,
        content: item.content,
        author: item.author,
        publishedAt: new Date(item.published_at || item.publishedAt),
        updatedAt: new Date(item.updated_at || item.updatedAt),
        status: item.status,
        category: item.category,
        featuredImage: item.featured_image || item.featuredImage,
        tags: item.tags || [],
        featured: item.featured || false,
        readTime: item.read_time || item.readTime || 5,
      };
    } catch (error) {
      console.error('Failed to update article via API:', error);
      console.log('Falling back to mock update...');
      const { mockNewsArticles } = await import('../data/mockData');
      const existingArticle = mockNewsArticles.find(a => a.id === id);
      if (!existingArticle) throw new Error('Article not found');
      return { 
        ...existingArticle, 
        ...article, 
        updatedAt: new Date() 
      };
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/news/${id}`, {
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
      console.error('Failed to delete article via API:', error);
      console.log('Falling back to mock deletion...');
      console.log('Mock: Article deleted:', id);
    }
  },

  publish: async (id: string): Promise<NewsArticle> => {
    try {
      const response = await fetch(`${API_BASE_URL}/news/${id}/publish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`HTTP ${response.status}: ${errorData.message || response.statusText}`);
      }

      const item = await response.json();
      
      return {
        id: item.id || item.article_id,
        title: item.title,
        slug: item.slug,
        excerpt: item.excerpt,
        content: item.content,
        author: item.author,
        publishedAt: new Date(item.published_at || item.publishedAt),
        updatedAt: new Date(item.updated_at || item.updatedAt),
        status: item.status,
        category: item.category,
        featuredImage: item.featured_image || item.featuredImage,
        tags: item.tags || [],
        featured: item.featured || false,
        readTime: item.read_time || item.readTime || 5,
      };
    } catch (error) {
      console.error('Failed to publish article via API:', error);
      console.log('Falling back to mock publish...');
      const { mockNewsArticles } = await import('../data/mockData');
      const existingArticle = mockNewsArticles.find(a => a.id === id);
      if (!existingArticle) throw new Error('Article not found');
      return { 
        ...existingArticle, 
        status: 'published',
        publishedAt: new Date(),
        updatedAt: new Date() 
      };
    }
  },

  archive: async (id: string): Promise<NewsArticle> => {
    try {
      const response = await fetch(`${API_BASE_URL}/news/${id}/archive`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`HTTP ${response.status}: ${errorData.message || response.statusText}`);
      }

      const item = await response.json();
      
      return {
        id: item.id || item.article_id,
        title: item.title,
        slug: item.slug,
        excerpt: item.excerpt,
        content: item.content,
        author: item.author,
        publishedAt: new Date(item.published_at || item.publishedAt),
        updatedAt: new Date(item.updated_at || item.updatedAt),
        status: item.status,
        category: item.category,
        featuredImage: item.featured_image || item.featuredImage,
        tags: item.tags || [],
        featured: item.featured || false,
        readTime: item.read_time || item.readTime || 5,
      };
    } catch (error) {
      console.error('Failed to archive article via API:', error);
      console.log('Falling back to mock archive...');
      const { mockNewsArticles } = await import('../data/mockData');
      const existingArticle = mockNewsArticles.find(a => a.id === id);
      if (!existingArticle) throw new Error('Article not found');
      return { 
        ...existingArticle, 
        status: 'archived',
        updatedAt: new Date() 
      };
    }
  },
};