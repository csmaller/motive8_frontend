import type { Coach, Event, Product, VelocityClass, NewsArticle } from '../types';

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
    const { mockEvents } = await import('../data/mockData');
    return mockEvents;
  },

  getById: async (id: string): Promise<Event> => {
    const { mockEvents } = await import('../data/mockData');
    const event = mockEvents.find(e => e.id === id);
    if (!event) throw new Error('Event not found');
    return event;
  },

  create: async (event: Omit<Event, 'id'>): Promise<Event> => {
    const newEvent: Event = {
      ...event,
      id: Date.now().toString(),
    };
    console.log('Creating event:', newEvent);
    return newEvent;
  },

  update: async (id: string, event: Partial<Event>): Promise<Event> => {
    console.log('Updating event:', id, event);
    const { mockEvents } = await import('../data/mockData');
    const existingEvent = mockEvents.find(e => e.id === id);
    if (!existingEvent) throw new Error('Event not found');
    return { ...existingEvent, ...event };
  },

  delete: async (id: string): Promise<void> => {
    console.log('Deleting event:', id);
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
    const { mockNewsArticles } = await import('../data/mockData');
    return mockNewsArticles;
  },

  getById: async (id: string): Promise<NewsArticle> => {
    const { mockNewsArticles } = await import('../data/mockData');
    const article = mockNewsArticles.find(a => a.id === id);
    if (!article) throw new Error('Article not found');
    return article;
  },

  create: async (article: Omit<NewsArticle, 'id' | 'publishedAt' | 'updatedAt'>): Promise<NewsArticle> => {
    const newArticle: NewsArticle = {
      ...article,
      id: Date.now().toString(),
      publishedAt: new Date(),
      updatedAt: new Date(),
    };
    console.log('Creating article:', newArticle);
    return newArticle;
  },

  update: async (id: string, article: Partial<NewsArticle>): Promise<NewsArticle> => {
    console.log('Updating article:', id, article);
    const { mockNewsArticles } = await import('../data/mockData');
    const existingArticle = mockNewsArticles.find(a => a.id === id);
    if (!existingArticle) throw new Error('Article not found');
    return { 
      ...existingArticle, 
      ...article, 
      updatedAt: new Date() 
    };
  },

  delete: async (id: string): Promise<void> => {
    console.log('Deleting article:', id);
  },

  publish: async (id: string): Promise<NewsArticle> => {
    console.log('Publishing article:', id);
    const { mockNewsArticles } = await import('../data/mockData');
    const existingArticle = mockNewsArticles.find(a => a.id === id);
    if (!existingArticle) throw new Error('Article not found');
    return { 
      ...existingArticle, 
      status: 'published',
      publishedAt: new Date(),
      updatedAt: new Date() 
    };
  },

  archive: async (id: string): Promise<NewsArticle> => {
    console.log('Archiving article:', id);
    const { mockNewsArticles } = await import('../data/mockData');
    const existingArticle = mockNewsArticles.find(a => a.id === id);
    if (!existingArticle) throw new Error('Article not found');
    return { 
      ...existingArticle, 
      status: 'archived',
      updatedAt: new Date() 
    };
  },
};