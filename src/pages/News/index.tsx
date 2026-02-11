import React, { useMemo, useState, useEffect } from 'react';
import { mockNewsArticles } from '../../data/mockData';
import { newsApi } from '../../services/adminApi';
import type { NewsCategory, NewsArticle } from '../../types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const News: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory | 'all'>('all');
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadNews = async () => {
      try {
        setIsLoading(true);
        const articles = await newsApi.getAll();
        setNewsArticles(articles);
        setError(null);
      } catch (err) {
        console.error('Failed to load news from API, using mock data:', err);
        setNewsArticles(mockNewsArticles);
        setError('Using sample data - API unavailable');
      } finally {
        setIsLoading(false);
      }
    };

    loadNews();
  }, []);

  // Only show published articles, sorted by date (newest first) using useMemo
  const articles = useMemo(() => {
    return newsArticles
      .filter(article => article.status === 'published')
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }, [newsArticles]);

  const categories: (NewsCategory | 'all')[] = ['all', 'race-results', 'training-tips', 'team-news', 'events', 'general'];

  const filteredArticles = selectedCategory === 'all' 
    ? articles 
    : articles.filter(article => article.category === selectedCategory);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category: NewsCategory) => {
    switch (category) {
      case 'race-results':
        return 'bg-blue-100 text-blue-800';
      case 'training-tips':
        return 'bg-purple-100 text-purple-800';
      case 'team-news':
        return 'bg-green-100 text-green-800';
      case 'events':
        return 'bg-orange-100 text-orange-800';
      case 'general':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        {/* Header */}
        <section className="text-center space-y-6">
          <div className="relative">
            <div className="w-full h-64 rounded-lg overflow-hidden mb-8 bg-gradient-to-r from-primary-500 to-athletic-blue flex items-center justify-center">
              <div className="text-center text-white">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">Team News</h1>
                <p className="text-xl md:text-2xl opacity-90">
                  Stay updated with our latest achievements and announcements
                </p>
                {error && (
                  <p className="text-sm mt-2 opacity-75">
                    {error}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category === 'all' ? 'All News' : category.split('-').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ')}
              {category !== 'all' && (
                <span className="ml-2 text-xs">
                  ({articles.filter(a => a.category === category).length})
                </span>
              )}
            </Button>
          ))}
        </div>

        {/* Featured Articles */}
        {selectedCategory === 'all' && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Stories</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {articles.filter(article => article.featured).slice(0, 2).map((article) => (
                <Card key={article.id} hover={true} className="h-full">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 text-sm rounded-full ${getCategoryColor(article.category)}`}>
                        {article.category.split('-').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')}
                      </span>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                        Featured
                      </span>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900">
                      {article.title}
                    </h3>
                    
                    <p className="text-gray-600 leading-relaxed">
                      {article.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span>By {article.author}</span>
                        <span>•</span>
                        <span>{formatDate(article.publishedAt)}</span>
                        <span>•</span>
                        <span>{article.readTime} min read</span>
                      </div>
                    </div>
                    
                    <Button variant="primary" size="sm">
                      Read Full Article
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* All Articles */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {selectedCategory === 'all' ? 'All Articles' : 
             selectedCategory.split('-').map(word => 
               word.charAt(0).toUpperCase() + word.slice(1)
             ).join(' ')
            }
          </h2>
          
          <div className="space-y-6">
            {filteredArticles.map((article) => (
              <Card key={article.id} hover={true}>
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(article.category)}`}>
                        {article.category.split('-').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')}
                      </span>
                      {article.featured && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                          Featured
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {article.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-3 line-clamp-2">
                      {article.excerpt}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>By {article.author}</span>
                      <span>•</span>
                      <span>{formatDate(article.publishedAt)}</span>
                      <span>•</span>
                      <span>{article.readTime} min read</span>
                    </div>
                  </div>
                  
                  <div className="ml-6">
                    <Button variant="outline" size="sm">
                      Read More
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-600">
              {selectedCategory === 'all' 
                ? 'No articles have been published yet.' 
                : `No articles found in the ${selectedCategory.split('-').join(' ')} category.`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default News;