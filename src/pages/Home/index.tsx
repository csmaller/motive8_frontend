import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Carousel from '../../components/ui/Carousel';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { newsApi } from '../../services/adminApi';
import type { NewsArticle } from '../../types';

// Import carousel images
import image1 from '../../assets/img/carousel/image1.jpg';
import image2 from '../../assets/img/carousel/image2.jpg';
import image3 from '../../assets/img/carousel/image3.jpg';
import image4 from '../../assets/img/carousel/image4.jpg';
import image5 from '../../assets/img/carousel/image5.jpg';
import image6 from '../../assets/img/carousel/image6.jpg';
import image7 from '../../assets/img/carousel/image7.jpg';

const Home: React.FC = () => {
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);

  useEffect(() => {
    const loadNews = async () => {
      try {
        const articles = await newsApi.getAll();
        setNewsArticles(articles);
      } catch (err) {
        console.error('Failed to load news from API:', err);
        setNewsArticles([]);
      }
    };

    loadNews();
  }, []);

  // Get news from the last 30 days using useMemo to avoid effect warnings
  const recentNews = useMemo(() => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return newsArticles
      .filter(article => 
        article.status === 'published' && 
        new Date(article.publishedAt) >= thirtyDaysAgo
      )
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, 3); // Show only the 3 most recent
  }, [newsArticles]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
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
  const carouselImages = [
    {
      src: image1,
      alt: 'Triathlon swimming training - Athletes practicing swimming technique in pool',
      title: 'Excellence in Every Stroke',
      description: 'Master the art of swimming with our expert coaching and training programs'
    },
    {
      src: image2,
      alt: 'Triathlon cycling training - Cyclists on professional training bikes',
      title: 'Power Through Every Mile',
      description: 'Build endurance and speed with our comprehensive cycling training'
    },
    {
      src: image3,
      alt: 'Triathlon running training - Athletes running on outdoor track',
      title: 'Run Towards Your Goals',
      description: 'Develop your running technique and stamina with personalized training plans'
    },
    {
      src: image4,
      alt: 'Team triathlon training session - Group of athletes training together',
      title: 'Train Together, Succeed Together',
      description: 'Join our supportive community of dedicated athletes'
    },
    {
      src: image5,
      alt: 'Triathlon competition race day - Athletes competing in triathlon event',
      title: 'Race Day Excellence',
      description: 'Compete at your highest level with confidence and preparation'
    },
    {
      src: image6,
      alt: 'Personal triathlon coaching session - Coach working with individual athlete',
      title: 'Expert Guidance',
      description: 'Learn from experienced coaches who are committed to your success'
    },
    {
      src: image7,
      alt: 'Triathlon team celebration - Athletes celebrating achievements together',
      title: 'Celebrate Your Achievements',
      description: 'Every milestone matters in your triathlon journey'
    }
  ];

  return (
    <div>
      {/* Hero Carousel Section - Full Width */}
      <section className="w-full">
        <Carousel 
          images={carouselImages}
          autoPlay={true}
          autoPlayInterval={6000}
          showDots={true}
          showArrows={true}
          className="shadow-xl"
        />
      </section>

      {/* Content Container for remaining sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">

      {/* Recent News Section - Only show if there's news from last 30 days */}
      {recentNews.length > 0 && (
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Latest News</h2>
            <p className="text-gray-600">Stay updated with our recent achievements and announcements</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentNews.map((article) => (
              <Card key={article.id} hover={true} className="h-full">
                <div className="space-y-4">
                  {/* Article Header */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
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
                    
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {article.title}
                    </h3>
                  </div>

                  {/* Article Content */}
                  <div className="space-y-3">
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {article.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>By {article.author}</span>
                      <span>{formatDate(article.publishedAt)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {article.readTime} min read
                      </span>
                      <Button variant="outline" size="sm">
                        Read More
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          {/* View All News Link */}
          <div className="text-center">
            <Link to="/news">
              <Button variant="outline">
                View All News
              </Button>
            </Link>
          </div>
        </section>
      )}

      {/* Welcome Section */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
          Welcome to Our M8 Team
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
          Join our community of dedicated athletes training for excellence in swimming, cycling, and running. 
          Whether you're a beginner or seasoned competitor, we're here to help you achieve your triathlon goals.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
          <Link to="/velocity-classes">
            <Button size="lg" className="w-full sm:w-auto">
              Join Velocity Classes
            </Button>
          </Link>
          <Link to="/contact">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Contact Us
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card hover={true} className="text-center">
          <div className="w-16 h-16 bg-athletic-blue rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Coaching</h3>
          <p className="text-gray-600">
            Train with experienced coaches who understand the demands of triathlon competition and will guide you to success.
          </p>
        </Card>

        <Card hover={true} className="text-center">
          <div className="w-16 h-16 bg-athletic-green rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Supportive Community</h3>
          <p className="text-gray-600">
            Join a welcoming community of athletes who support each other through training and competition.
          </p>
        </Card>

        <Card hover={true} className="text-center">
          <div className="w-16 h-16 bg-athletic-orange rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Proven Results</h3>
          <p className="text-gray-600">
            Our training programs have helped athletes achieve personal bests and compete successfully at all levels.
          </p>
        </Card>
      </section>

      {/* About Section */}
      <section className="bg-gray-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-12 rounded-lg">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">About Our Team</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Our M8 team is committed to helping athletes of all levels achieve their goals. 
            Whether you're a beginner looking to complete your first triathlon or an experienced 
            athlete aiming for personal records, we provide the training, support, and community 
            you need to succeed.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            We offer comprehensive training programs covering all three disciplines: swimming, 
            cycling, and running. Our experienced coaches work with you to develop personalized 
            training plans that fit your schedule, fitness level, and competitive goals.
          </p>
          <div className="pt-6">
            <Link to="/coaches">
              <Button variant="secondary" size="lg">
                Meet Our Coaches
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="text-center space-y-6 bg-primary-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-12 rounded-lg">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Ready to Start Your Journey?</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Take the first step towards your triathlon goals. Join our team and discover what you're capable of achieving.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/events">
            <Button size="lg" className="w-full sm:w-auto">
              View Upcoming Events
            </Button>
          </Link>
          <Link to="/velocity-classes">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Explore Training Classes
            </Button>
          </Link>
        </div>
      </section>
      </div>
    </div>
  );
};

export default Home;