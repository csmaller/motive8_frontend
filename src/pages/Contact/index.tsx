import React from 'react';
import Card from '../../components/ui/Card';
import ContactForm from '../../components/forms/ContactForm';

const Contact: React.FC = () => {
  const contactInfo = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Email',
      details: 'info@triathlonteam.com',
      action: 'mailto:info@triathlonteam.com'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      title: 'Phone',
      details: '(555) 123-4567',
      action: 'tel:+15551234567'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: 'Location',
      details: '123 Athletic Drive, Sports City, SC 12345',
      action: 'https://maps.google.com/?q=123+Athletic+Drive+Sports+City+SC'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-12">
      {/* Header Section */}
      <section className="text-center space-y-6">
        <div className="relative">
          {/* Hero section with gradient background */}
          <div className="w-full h-64 rounded-lg overflow-hidden mb-8 bg-gradient-to-r from-athletic-green to-athletic-blue flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">Contact Us</h1>
              <p className="text-xl md:text-2xl opacity-90">
                Get in touch with our team
              </p>
            </div>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <p className="text-lg text-gray-600 leading-relaxed">
            We'd love to hear from you! Whether you're interested in joining our team, 
            have questions about our training programs, or need more information about 
            upcoming events, don't hesitate to reach out.
          </p>
        </div>
      </section>

      {/* Contact Information Grid */}
      <section>
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Get In Touch</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contactInfo.map((info, index) => (
            <Card key={index} hover={true} className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-600">
                {info.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{info.title}</h3>
              {info.action ? (
                <a
                  href={info.action}
                  className="text-gray-600 hover:text-primary-600 transition-colors whitespace-pre-line"
                  target={info.action.startsWith('http') ? '_blank' : undefined}
                  rel={info.action.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  {info.details}
                </a>
              ) : (
                <p className="text-gray-600 whitespace-pre-line">{info.details}</p>
              )}
            </Card>
          ))}
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="bg-gray-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-12 rounded-lg">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Send Us a Message</h2>
            <p className="text-gray-600">
              Fill out the form below and we'll get back to you as soon as possible.
            </p>
          </div>
          
          <Card>
            <ContactForm />
          </Card>
        </div>
      </section>

      {/* Additional Information */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Training Facility</h3>
          <p className="text-gray-600 mb-4">
            Our state-of-the-art training facility features indoor cycling studios, 
            swimming pools, and comprehensive fitness equipment. We also have access 
            to outdoor training routes for cycling and running.
          </p>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-center">
              <svg className="w-4 h-4 text-athletic-green mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Indoor cycling studio with power meters
            </li>
            <li className="flex items-center">
              <svg className="w-4 h-4 text-athletic-green mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              25-meter swimming pool
            </li>
            <li className="flex items-center">
              <svg className="w-4 h-4 text-athletic-green mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Strength and conditioning area
            </li>
            <li className="flex items-center">
              <svg className="w-4 h-4 text-athletic-green mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Locker rooms and showers
            </li>
          </ul>
        </Card>

        <Card>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Frequently Asked Questions</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Do I need experience to join?</h4>
              <p className="text-gray-600 text-sm">
                Not at all! We welcome athletes of all levels, from complete beginners to experienced competitors.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">What equipment do I need?</h4>
              <p className="text-gray-600 text-sm">
                Basic equipment varies by program. We'll provide a detailed equipment list when you sign up.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Can I try a class before committing?</h4>
              <p className="text-gray-600 text-sm">
                Yes! We offer trial sessions for most of our programs. Contact us to schedule your trial.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Do you offer personal coaching?</h4>
              <p className="text-gray-600 text-sm">
                Absolutely! Our coaches are available for one-on-one training sessions and personalized programs.
              </p>
            </div>
          </div>
        </Card>
      </section>
      </div>
    </div>
  );
};

export default Contact;