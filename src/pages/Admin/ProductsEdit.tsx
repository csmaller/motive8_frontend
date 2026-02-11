import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { productsApi } from '../../services/adminApi';
import { API_BASE_URL } from '../../config/api';
import type { ProductCategory } from '../../types';
import { PRODUCT_CATEGORIES } from '../../types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Select from '../../components/ui/Select';
import ImageUploader from '../../components/ui/ImageUploader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import StatusMessage from '../../components/ui/StatusMessage';

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: ProductCategory;
  stockQuantity: number;
  inStock: boolean;
  sizes?: string;
  colors?: string;
  features?: string;
  brand?: string;
  rating: number;
  reviewCount: number;
  paymentLink?: string;
}

const AdminProductsEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = id !== undefined && id !== 'new';
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ProductFormData>({
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      originalPrice: undefined,
      category: 'gear',
      stockQuantity: 0,
      inStock: true,
      sizes: '',
      colors: '',
      features: '',
      brand: '',
      rating: 0,
      reviewCount: 0,
      paymentLink: '',
    }
  });

  const loadProduct = useCallback(async (productId: string) => {
    try {
      setIsLoading(true);
      const product = await productsApi.getById(productId);
      
      reset({
        name: product.name,
        description: product.description,
        price: product.price,
        originalPrice: product.originalPrice,
        category: product.category,
        stockQuantity: product.stockQuantity,
        inStock: product.inStock,
        sizes: product.sizes?.join(', ') || '',
        colors: product.colors?.join(', ') || '',
        features: product.features?.join(', ') || '',
        brand: product.brand || '',
        rating: product.rating,
        reviewCount: product.reviewCount,
        paymentLink: product.paymentLink || '',
      });
      
      // Set current image (use first image if available)
      setCurrentImage(product.images?.[0] || null);
    } catch (error) {
      console.error('Failed to load product:', error);
      setError('Failed to load product');
    } finally {
      setIsLoading(false);
    }
  }, [reset]);

  useEffect(() => {
    if (isEditing && id) {
      loadProduct(id);
    }
  }, [id, isEditing, loadProduct]);

  const onSubmit = async (data: ProductFormData) => {
    try {
      setIsSaving(true);
      setError('');
      setSuccess('');

      // Use FormData if there's an image file to upload
      if (imageFile) {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('price', String(data.price));
        if (data.originalPrice) formData.append('original_price', String(data.originalPrice));
        formData.append('category', data.category);
        formData.append('in_stock', String(data.inStock));
        formData.append('stock_quantity', String(data.stockQuantity));
        if (data.sizes) formData.append('sizes', JSON.stringify(data.sizes.split(',').map(s => s.trim()).filter(s => s)));
        if (data.colors) formData.append('colors', JSON.stringify(data.colors.split(',').map(c => c.trim()).filter(c => c)));
        formData.append('rating', String(data.rating));
        formData.append('review_count', String(data.reviewCount));
        if (data.features) formData.append('features', JSON.stringify(data.features.split(',').map(f => f.trim()).filter(f => f)));
        if (data.brand) formData.append('brand', data.brand);
        if (data.paymentLink) formData.append('payment_link', data.paymentLink);
        formData.append('image', imageFile);
        
        if (isEditing) {
          formData.append('_method', 'PUT');
        }

        const response = await fetch(`${isEditing ? `${API_BASE_URL}/products/${id}` : `${API_BASE_URL}/products`}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
          },
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(`HTTP ${response.status}: ${errorData.message || response.statusText}`);
        }

        const result = await response.json();
        
        // Update the current image with the new image from the response
        if (result.images && result.images.length > 0) {
          setCurrentImage(result.images[0]);
        }
        
        // Clear the file object since it's been uploaded
        setImageFile(null);
        
        setSuccess(isEditing ? 'Product updated successfully!' : 'Product created successfully!');
      } else {
        // No image file, use JSON
        const productData = {
          name: data.name,
          description: data.description,
          price: Number(data.price),
          originalPrice: data.originalPrice ? Number(data.originalPrice) : undefined,
          category: data.category,
          images: currentImage ? [currentImage] : [],
          inStock: data.inStock,
          stockQuantity: Number(data.stockQuantity),
          sizes: data.sizes ? data.sizes.split(',').map(s => s.trim()).filter(s => s) : undefined,
          colors: data.colors ? data.colors.split(',').map(c => c.trim()).filter(c => c) : undefined,
          rating: Number(data.rating),
          reviewCount: Number(data.reviewCount),
          features: data.features ? data.features.split(',').map(f => f.trim()).filter(f => f) : undefined,
          brand: data.brand || undefined,
          paymentLink: data.paymentLink || undefined,
        };

        if (isEditing && id) {
          const updatedProduct = await productsApi.update(id, productData);
          
          // Update the current image with the new image from the response
          if (updatedProduct.images && updatedProduct.images.length > 0) {
            setCurrentImage(updatedProduct.images[0]);
          }
          
          setSuccess('Product updated successfully!');
        } else {
          await productsApi.create(productData);
          setSuccess('Product created successfully!');
        }
      }
      
      setTimeout(() => navigate('/admin/products'), 1500);
    } catch (error) {
      console.error('Failed to save product:', error);
      setError(error instanceof Error ? error.message : 'Failed to save product. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

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
              {isEditing ? 'Edit Product' : 'Add New Product'}
            </h1>
            <p className="text-gray-600">
              {isEditing ? 'Update product information' : 'Create a new product'}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate('/admin/products')}
          >
            Back to Products
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
          {/* Basic Information */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            
            <div className="space-y-6">
              {/* Image Upload */}
              <ImageUploader
                label="Product Image"
                currentImage={currentImage ?? undefined}
                onImageChange={(url, file) => {
                  setCurrentImage(url);
                  setImageFile(file || null);
                }}
                helperText="Upload a product image (max 5MB)"
                maxSize={5}
              />
              
              <Input
                label="Product Name"
                {...register('name', { required: 'Product name is required' })}
                error={errors.name?.message}
                placeholder="Enter product name"
              />
              
              <Textarea
                label="Description"
                {...register('description', { required: 'Description is required' })}
                error={errors.description?.message}
                placeholder="Enter product description"
                rows={4}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Brand"
                  {...register('brand')}
                  error={errors.brand?.message}
                  placeholder="Enter brand name"
                />

                <Select
                  label="Category"
                  {...register('category', { required: 'Category is required' })}
                  error={errors.category?.message}
                  options={PRODUCT_CATEGORIES}
                />
              </div>
            </div>
          </Card>

          {/* Pricing */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Price"
                type="number"
                step="0.01"
                {...register('price', { 
                  required: 'Price is required',
                  min: { value: 0, message: 'Price must be positive' }
                })}
                error={errors.price?.message}
                placeholder="0.00"
              />
              
              <Input
                label="Original Price (Optional)"
                type="number"
                step="0.01"
                {...register('originalPrice', {
                  min: { value: 0, message: 'Price must be positive' }
                })}
                error={errors.originalPrice?.message}
                placeholder="0.00"
                helperText="For sale items"
              />
            </div>
          </Card>

          {/* Inventory */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventory</h3>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Stock Quantity"
                  type="number"
                  {...register('stockQuantity', { 
                    required: 'Stock quantity is required',
                    min: { value: 0, message: 'Quantity must be positive' }
                  })}
                  error={errors.stockQuantity?.message}
                  placeholder="0"
                />

                <div className="flex items-center space-x-2 pt-8">
                  <input
                    type="checkbox"
                    {...register('inStock')}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    In Stock
                  </label>
                </div>
              </div>
            </div>
          </Card>

          {/* Product Details */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Details</h3>
            
            <div className="space-y-6">
              <Input
                label="Sizes (comma-separated)"
                {...register('sizes')}
                error={errors.sizes?.message}
                placeholder="XS, S, M, L, XL, XXL"
                helperText="Separate sizes with commas"
              />

              <Input
                label="Colors (comma-separated)"
                {...register('colors')}
                error={errors.colors?.message}
                placeholder="Red, Blue, Black"
                helperText="Separate colors with commas"
              />

              <Textarea
                label="Features (comma-separated)"
                {...register('features')}
                error={errors.features?.message}
                placeholder="Moisture-wicking, Quick-dry, Aerodynamic"
                rows={3}
                helperText="Separate features with commas"
              />
            </div>
          </Card>

          {/* Rating & Payment */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating & Payment</h3>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Rating"
                  type="number"
                  step="0.1"
                  {...register('rating', {
                    min: { value: 0, message: 'Rating must be between 0 and 5' },
                    max: { value: 5, message: 'Rating must be between 0 and 5' }
                  })}
                  error={errors.rating?.message}
                  placeholder="0.0"
                  helperText="Rating out of 5"
                />

                <Input
                  label="Review Count"
                  type="number"
                  {...register('reviewCount', {
                    min: { value: 0, message: 'Review count must be positive' }
                  })}
                  error={errors.reviewCount?.message}
                  placeholder="0"
                />
              </div>
              
              <Input
                label="Payment Link"
                type="url"
                {...register('paymentLink')}
                error={errors.paymentLink?.message}
                placeholder="https://square.com/payment-link"
                helperText="External payment link (e.g., Square, PayPal)"
              />
            </div>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/products')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isSaving}
            >
              {isEditing ? 'Update Product' : 'Create Product'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProductsEdit;
