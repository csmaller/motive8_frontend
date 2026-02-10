import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { newsApi } from '../../services/adminApi';
import type { NewsCategory, NewsStatus } from '../../types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Select from '../../components/ui/Select';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import StatusMessage from '../../components/ui/StatusMessage';

interface NewsFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: NewsCategory;
  status: NewsStatus;
  featured: boolean;
  tags: string;
  readTime: number;
}

const AdminNewsEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = id !== undefined && id !== 'new';
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<NewsFormData>({
    defaultValues: {
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      author: '',
      category: 'general',
      status: 'draft',
      featured: false,
      tags: '',
      readTime: 1
    }
  });

  const watchTitle = watch('title');

  const loadArticle = useCallback(async (articleId: string) => {
    try {
      setIsLoading(true);
      const article = await newsApi.getById(articleId);
      
      reset({
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        content: article.content,
        author: article.author,
        category: article.category,
        status: article.status,
        featured: article.featured,
        tags: article.tags.join(', '),
        readTime: article.readTime
      });
    } catch (error) {
      console.error('Failed to load article:', error);
      setError('Failed to load article');
    } finally {
      setIsLoading(false);
    }
  }, [reset]);

  // Auto-generate slug from title
  useEffect(() => {
    if (watchTitle && !isEditing) {
      const slug = watchTitle
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setValue('slug', slug);
    }
  }, [watchTitle, setValue, isEditing]);

  useEffect(() => {
    if (isEditing && id) {
      loadArticle(id);
    }
  }, [id, isEditing, loadArticle]);

  const onSubmit = async (data: NewsFormData) => {
    try {
      setIsSaving(true);
      setError('');
      setSuccess('');
      
      const articleData = {
        ...data,
        tags: data.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
      };

      if (isEditing && id) {
        await newsApi.update(id, articleData);
        setSuccess('Article updated successfully!');
        setTimeout(() => navigate('/admin/news'), 1500);
      } else {
        await newsApi.create(articleData);
        setSuccess('Article created successfully!');
        setTimeout(() => navigate('/admin/news'), 1500);
      }
    } catch (error) {
      console.error('Failed to save article:', error);
      setError(error instanceof Error ? error.message : 'Failed to save article. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const categoryOptions = [
    { value: 'race-results', label: 'Race Results' },
    { value: 'training-tips', label: 'Training Tips' },
    { value: 'team-news', label: 'Team News' },
    { value: 'events', label: 'Events' },
    { value: 'general', label: 'General' }
  ];

  const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' },
    { value: 'archived', label: 'Archived' }
  ];

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Edit Article' : 'Create New Article'}
            </h1>
            <p className="text-gray-600">
              {isEditing ? 'Update article content and settings' : 'Write and publish a new article'}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate('/admin/news')}
          >
            Back to News
          </Button>
        </div>

        {error && (
          <StatusMessage
            type="error"
            message={error}
            onDismiss={() => setError('')}
          />
        )}

        {success && (
          <StatusMessage
            type="success"
            message={success}
            onDismiss={() => setSuccess('')}
          />
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Article Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Input
                  label="Title"
                  {...register('title', { required: 'Title is required' })}
                  error={errors.title?.message}
                  placeholder="Enter article title"
                />
              </div>
              
              <Input
                label="Slug"
                {...register('slug', { required: 'Slug is required' })}
                error={errors.slug?.message}
                placeholder="article-url-slug"
                helperText="URL-friendly version of the title"
              />
              
              <Input
                label="Author"
                {...register('author', { required: 'Author is required' })}
                error={errors.author?.message}
                placeholder="Author name"
              />
              
              <Select
                label="Category"
                {...register('category', { required: 'Category is required' })}
                error={errors.category?.message}
                options={categoryOptions}
              />
              
              <Select
                label="Status"
                {...register('status', { required: 'Status is required' })}
                error={errors.status?.message}
                options={statusOptions}
              />
              
              <div className="md:col-span-2">
                <Textarea
                  label="Excerpt"
                  {...register('excerpt', { required: 'Excerpt is required' })}
                  error={errors.excerpt?.message}
                  placeholder="Brief summary of the article"
                  rows={3}
                />
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Content</h3>
            
            <Textarea
              label="Article Content"
              {...register('content', { required: 'Content is required' })}
              error={errors.content?.message}
              placeholder="Write your article content here..."
              rows={15}
              helperText="You can use Markdown formatting"
            />
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Tags"
                {...register('tags')}
                placeholder="tag1, tag2, tag3"
                helperText="Separate tags with commas"
              />
              
              <Input
                label="Read Time (minutes)"
                type="number"
                {...register('readTime', { 
                  required: 'Read time is required',
                  min: { value: 1, message: 'Read time must be at least 1 minute' }
                })}
                error={errors.readTime?.message}
                placeholder="5"
              />
              
              <div className="md:col-span-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    {...register('featured')}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Featured Article</span>
                </label>
                <p className="text-xs text-gray-500 mt-1">Featured articles appear prominently on the site</p>
              </div>
            </div>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/news')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isSaving}
            >
              {isEditing ? 'Update Article' : 'Create Article'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminNewsEdit;