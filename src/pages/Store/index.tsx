import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { productsApi } from '../../services/adminApi';
import type { Product, ProductCategory } from '../../types';
import { PRODUCT_CATEGORIES } from '../../types';

const Store: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'rating'>('name');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const data = await productsApi.getAll();
        setProducts(data);
      } catch (error) {
        console.error('Failed to load products:', error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);
  
  const getProductsByCategory = (category: ProductCategory): Product[] => {
    return products.filter(p => p.category === category);
  };

  const getFeaturedProducts = (): Product[] => {
    return products.filter(p => p.rating >= 4.5).slice(0, 4);
  };

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : getProductsByCategory(selectedCategory);

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.price - b.price;
      case 'rating':
        return b.rating - a.rating;
      case 'name':
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const getCategoryColor = (category: ProductCategory) => {
    switch (category) {
      case 'apparel':
        return 'bg-athletic-blue text-white';
      case 'gear':
        return 'bg-athletic-orange text-white';
      case 'accessories':
        return 'bg-athletic-green text-white';
      case 'nutrition':
        return 'bg-primary-600 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };


  const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
    <Card hover={true} className="h-full">
      <div className="flex flex-col h-full">
        {/* Product Image */}
        <div className="relative mb-4">
          {product.images && product.images.length > 0 ? (
            <img 
              src={product.images[0]} 
              alt={product.name}
              className="w-full h-48 bg-gray-200 rounded-lg object-cover"
            />
          ) : (
            <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          
          {/* Category Badge */}
          <span className={`absolute top-2 left-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(product.category)}`}>
            {PRODUCT_CATEGORIES.find(cat => cat.value === product.category)?.label}
          </span>

          {/* Sale Badge */}
          {product.originalPrice && (
            <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Sale
            </span>
          )}

          {/* Stock Status */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
              <span className="text-white font-medium">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
          
          {product.brand && (
            <p className="text-sm text-gray-500 mb-2">{product.brand}</p>
          )}

          <p className="text-gray-600 text-sm leading-relaxed mb-3 line-clamp-2">
            {product.description}
          </p>

          {/* Rating - Hidden for now */}
          {/* <div className="flex items-center mb-3">
            <div className="flex items-center">
              {renderStars(product.rating)}
            </div>
            <span className="ml-2 text-sm text-gray-600">
              {product.rating} ({product.reviewCount} reviews)
            </span>
          </div> */}

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <div className="mb-3">
              <div className="flex flex-wrap gap-1">
                {product.features.slice(0, 2).map((feature, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                  >
                    {feature}
                  </span>
                ))}
                {product.features.length > 2 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    +{product.features.length - 2} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Size/Color Options */}
          <div className="space-y-2 mb-4">
            {product.sizes && (
              <div>
                <span className="text-xs text-gray-500">Sizes: </span>
                <span className="text-xs text-gray-700">{product.sizes.join(', ')}</span>
              </div>
            )}
            {product.colors && (
              <div>
                <span className="text-xs text-gray-500">Colors: </span>
                <span className="text-xs text-gray-700">{product.colors.join(', ')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Price and Actions */}
        <div className="mt-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            {product.stockQuantity <= 5 && product.inStock && (
              <span className="text-xs text-orange-600 font-medium">
                Only {product.stockQuantity} left
              </span>
            )}
          </div>

          <Button
            variant={product.inStock ? 'primary' : 'outline'}
            size="sm"
            className="w-full"
            disabled={!product.inStock}
          >
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </Button>
        </div>
      </div>
    </Card>
  );

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
      <div className="space-y-12">
        {/* Header Section */}
        <section className="text-center space-y-6">
          <div className="w-full h-64 rounded-lg overflow-hidden mb-8 bg-gradient-to-r from-athletic-orange to-primary-600 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">M8 Team Store</h1>
              <p className="text-xl md:text-2xl opacity-90">
                Gear up for your next triathlon
              </p>
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-600 leading-relaxed">
              Discover high-quality triathlon gear, apparel, and accessories. From professional racing suits 
              to training essentials, we have everything you need to perform at your best.
            </p>
          </div>
        </section>

        {/* Featured Products */}
        {getFeaturedProducts().length > 0 && (
          <section>
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Featured Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {getFeaturedProducts().map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* Filters and Sorting */}
        <section>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === 'all' ? 'primary' : 'outline'}
                onClick={() => setSelectedCategory('all')}
                size="sm"
              >
                All Products ({products.length})
              </Button>
              {PRODUCT_CATEGORIES.map((category) => (
                <Button
                  key={category.value}
                  variant={selectedCategory === category.value ? 'primary' : 'outline'}
                  onClick={() => setSelectedCategory(category.value)}
                  size="sm"
                >
                  {category.label} ({getProductsByCategory(category.value).length})
                </Button>
              ))}
            </div>

            {/* Sort Options */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <Button
                variant={sortBy === 'name' ? 'primary' : 'outline'}
                onClick={() => setSortBy('name')}
                size="sm"
              >
                Name
              </Button>
              <Button
                variant={sortBy === 'price' ? 'primary' : 'outline'}
                onClick={() => setSortBy('price')}
                size="sm"
              >
                Price
              </Button>
              <Button
                variant={sortBy === 'rating' ? 'primary' : 'outline'}
                onClick={() => setSortBy('rating')}
                size="sm"
              >
                Rating
              </Button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {sortedProducts.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600">No products match the selected category.</p>
            </div>
          )}
        </section>

        {/* Call to Action */}
        <section className="text-center space-y-6 bg-primary-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-12 rounded-lg">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Need Help Choosing?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our coaches can help you select the right gear for your training and racing needs. 
            Get personalized recommendations based on your goals and experience level.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" onClick={() => window.location.href = '/contact'}>
              Contact Our Team
            </Button>
            <Button variant="outline" size="lg" onClick={() => window.location.href = '/coaches'}>
              Meet Our Coaches
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Store;