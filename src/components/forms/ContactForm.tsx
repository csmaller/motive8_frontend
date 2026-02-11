import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { API_BASE_URL } from '../../config/api';
import Input from '../ui/Input';
import TextArea from '../ui/Textarea';
import Button from '../ui/Button';
import StatusMessage from '../ui/StatusMessage';
import type { ContactFormData } from '../../types';

const ContactForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ContactFormData>();

  const handleFormSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setSubmitMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone || null,
          subject: data.subject,
          message: data.message,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Contact form submitted successfully:', result);

      setSubmitStatus('success');
      setSubmitMessage('Thank you for your message! We\'ll get back to you soon.');
      reset();
    } catch (error) {
      console.error('Contact form submission error:', error);
      setSubmitStatus('error');
      setSubmitMessage(error instanceof Error ? error.message : 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Full Name *"
          placeholder="Enter your full name"
          {...register('name', { 
            required: 'Name is required',
            maxLength: { value: 255, message: 'Name must be less than 255 characters' }
          })}
          error={errors.name?.message}
        />
        
        <Input
          label="Email Address *"
          type="email"
          placeholder="Enter your email address"
          {...register('email', { 
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address'
            }
          })}
          error={errors.email?.message}
        />
      </div>

      <Input
        label="Phone Number"
        type="tel"
        placeholder="Enter your phone number (optional)"
        {...register('phone', {
          maxLength: { value: 20, message: 'Phone number must be less than 20 characters' }
        })}
        error={errors.phone?.message}
        helperText="We'll only use this to contact you about your inquiry"
      />

      <Input
        label="Subject *"
        placeholder="What is your inquiry about?"
        {...register('subject', { 
          required: 'Subject is required',
          maxLength: { value: 255, message: 'Subject must be less than 255 characters' }
        })}
        error={errors.subject?.message}
      />

      <TextArea
        label="Message *"
        placeholder="Tell us about your interest in triathlon training, questions about our programs, or how we can help you achieve your goals..."
        rows={6}
        {...register('message', { 
          required: 'Message is required',
          maxLength: { value: 5000, message: 'Message must be less than 5000 characters' }
        })}
        error={errors.message?.message}
        helperText="Please provide as much detail as possible so we can best assist you"
      />

      {/* Submit Status Messages */}
      <div className="transition-all duration-300 ease-in-out">
        {submitStatus === 'success' && (
          <StatusMessage
            type="success"
            title="Message Sent Successfully!"
            message={submitMessage}
            className="animate-fade-in"
          />
        )}

        {submitStatus === 'error' && (
          <StatusMessage
            type="error"
            title="Message Failed to Send"
            message={submitMessage}
            className="animate-fade-in"
          />
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          type="submit"
          loading={isSubmitting}
          disabled={isSubmitting}
          size="lg"
          className="flex-1"
        >
          {isSubmitting ? 'Sending Message...' : 'Send Message'}
        </Button>
        
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => reset()}
          disabled={isSubmitting}
          className="flex-1 sm:flex-none"
        >
          Clear Form
        </Button>
      </div>

      <div className="text-sm text-gray-500 text-center">
        <p>
          By submitting this form, you agree to our privacy policy. 
          We'll never share your information with third parties.
        </p>
      </div>
    </form>
  );
};

export default ContactForm;