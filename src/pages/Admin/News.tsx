import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { newsApi } from '../../services/adminApi';
import type { NewsArticle, NewsCategory, NewsStatus } from '../../types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import StatusMessage from '../../components/ui/StatusMessage';

const AdminNews: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<NewsStatus | 'all'>('all');

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      setIsLoading(true);
      const data = await newsApi.getAll();
      // Sort by published date, newest first
      const sortedData = data.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
      setArticles(sortedData);
    } catch (error) {
      console.error('Failed to load articles:', error);
      setError('Failed to load articles');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this article?')) {
      return;
    }

    try {
      setDeleteId(id);
      await newsApi.delete(id);
      setArticles(articles.filter(article => article.id !== id));
    } catch (error) {
      console.error('Failed to delete article:', error);
      setError('Failed to delete article');
    } finally {
      setDeleteId(null);
    }
  };

  const handleStatusChange = async (id: string, newStatus: NewsStatus) => {
    try {
      let updatedArticle: NewsArticle;
      
      if (newStatus === 'published') {
        updatedArticle = await newsApi.publish(id);
      } else if (newStatus === 'archived') {
        updatedArticle = await newsApi.archive(id);
      } else {
        updatedArticle = await newsApi.update(id, { status: newStatus });
      }
      
      setArticles(articles.map(article => 
        article.id === id ? updatedArticle : article
      ));
    } catch (error) {
      console.error('Failed to update article status:', error);
      setError('Failed to update article status');
    }
  };

  const categories: (NewsCategory | 'all')[] = ['all', 'race-results', 'training-tips', 'team-news', 'events', 'general'];
  const statuses: (NewsStatus | 'all')[] = ['all', 'draft', 'published', 'archived'];

  const filteredArticles = articles.filter(article => {
    const categoryMatch = selectedCategory === 'all' || article.category === selectedCategory;
    const statusMatch = selectedStatus === 'all' || article.status === selectedStatus;
    return categoryMatch && statusMatch;
  });

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: NewsStatus) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">News Management</h1>
            <p className="text-gray-600">Manage articles, announcements, and team updates</p>
          </div>
          <Link to="/admin/news/new">
            <Button>Create New Article</Button>
          </Link>
        </div>

        {error && (
          <StatusMessage
            type="error"
            message={error}
            onDismiss={() => setError('')}
          />
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-700 self-center">Category:</span>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category === 'all' ? 'All' : category.split('-').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              </Button>
            ))}
          </div>
          
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-700 self-center">Status:</span>
            {statuses.map((status) => (
              <Button
                key={status}
                variant={selectedStatus === status ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSelectedStatus(status)}
              >
                {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Articles List */}
        <div className="space-y-4">
          {filteredArticles.map((article) => (
            <Card key={article.id} className="hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {article.title}
                    </h3>
                    {article.featured && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                        Featured
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {article.excerpt}
                  </p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>By {article.author}</span>
                    <span>•</span>
                    <span>{formatDate(article.publishedAt)}</span>
                    <span>•</span>
                    <span>{article.readTime} min read</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(article.status)}`}>
                      {article.status.charAt(0).toUpperCase() + article.status.slice(1)}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(article.category)}`}>
                      {article.category.split('-').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </span>
                    {article.tags.slice(0, 2).map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                    {article.tags.length > 2 && (
                      <span className="text-xs text-gray-500">
                        +{article.tags.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2 ml-4">
                  <div className="flex space-x-2">
                    <Link to={`/admin/news/${article.id}/edit`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(article.id)}
                      loading={deleteId === article.id}
                      className="text-red-600 hover:text-red-700 hover:border-red-300"
                    >
                      Delete
                    </Button>
                  </div>
                  
                  {article.status === 'draft' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleStatusChange(article.id, 'published')}
                    >
                      Publish
                    </Button>
                  )}
                  
                  {article.status === 'published' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusChange(article.id, 'archived')}
                    >
                      Archive
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredArticles.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-600 mb-4">
              {selectedCategory !== 'all' || selectedStatus !== 'all'
                ? 'Try adjusting your filters or create a new article.'
                : 'Get started by creating your first article.'
              }
            </p>
            <Link to="/admin/news/new">
              <Button>Create New Article</Button>
            </Link>
          </div>
        )}

        {/* Summary Stats */}
        {articles.length > 0 && (
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{articles.length}</div>
                <div className="text-sm text-gray-600">Total Articles</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {articles.filter(a => a.status === 'published').length}
                </div>
                <div className="text-sm text-gray-600">Published</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {articles.filter(a => a.status === 'draft').length}
                </div>
                <div className="text-sm text-gray-600">Drafts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {articles.filter(a => a.featured).length}
                </div>
                <div className="text-sm text-gray-600">Featured</div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminNews;