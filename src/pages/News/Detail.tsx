import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { newsApi } from '../../services/adminApi';
import type { NewsArticle } from '../../types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const NewsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadArticle = async () => {
      if (!id) {
        setError('Article ID is missing');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const data = await newsApi.getById(id);
        
        // Only show published articles to public
        if (data.status !== 'published') {
          setError('Article not found or not published');
          setArticle(null);
        } else {
          setArticle(data);
        }
      } catch (err) {
        console.error('Failed to load article:', err);
        setError('Failed to load article');
      } finally {
        setIsLoading(false);
      }
    };

    loadArticle();
  }, [id]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card>
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Article Not Found</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link to="/news">
              <Button>Back to News</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        {/* Back Button */}
        <div>
          <Button variant="outline" size="sm" onClick={() => navigate('/news')}>
            ← Back to News
          </Button>
        </div>

        {/* Article Header */}
        <Card>
          <div className="space-y-6">
            {/* Category and Featured Badge */}
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 text-sm rounded-full ${getCategoryColor(article.category)}`}>
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

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              {article.title}
            </h1>

            {/* Meta Information */}
            <div className="flex items-center space-x-4 text-sm text-gray-500 pb-6 border-b border-gray-200">
              <span>By {article.author}</span>
              <span>•</span>
              <span>{formatDate(article.publishedAt)}</span>
              <span>•</span>
              <span>{article.readTime} min read</span>
            </div>

            {/* Featured Image */}
            {article.featuredImage && (
              <div className="w-full aspect-video rounded-lg overflow-hidden bg-gray-200">
                <img 
                  src={article.featuredImage} 
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Article Content */}
            <div className="prose prose-lg max-w-none">
              <div 
                className="text-gray-700 leading-relaxed whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </div>

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="pt-6 border-t border-gray-200">
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm font-medium text-gray-700">Tags:</span>
                  {article.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Back to News Button */}
        <div className="text-center">
          <Link to="/news">
            <Button variant="outline">
              View All News Articles
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;
