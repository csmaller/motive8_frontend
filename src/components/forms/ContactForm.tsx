import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Input from '../ui/Input';
import TextArea from '../ui/Textarea';
import Button from '../ui/Button';
import StatusMessage from '../ui/StatusMessage';
import type { ContactFormData } from '../../types';
import { contactFormValidation, formatFormData } from '../../utils/validation';
import { handleError, simulateNetworkRequest, retryOperation, logErrorToService } from '../../utils/errorHandling';

interface ContactFormProps {
  onSubmit?: (data: ContactFormData) => Promise<void>;
}

const ContactForm: React.FC<ContactFormProps> = ({ onSubmit }) => {
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
      const formattedData = formatFormData(data);
      
      if (onSubmit) {
        await retryOperation(() => onSubmit(formattedData), 2);
      } else {
        // Default submission handler with error simulation for development
        await simulateNetworkRequest(formattedData, {
          delay: 1500,
          failureRate: 0 // Set to 0.3 for testing error handling
        });
        console.log('Contact form submitted:', formattedData);
      }

      setSubmitStatus('success');
      setSubmitMessage('Thank you for your message! We\'ll get back to you soon.');
      reset();
    } catch (error) {
      const appError = handleError(error);
      setSubmitStatus('error');
      setSubmitMessage(appError.message);
      
      // Log error for monitoring
      logErrorToService(error instanceof Error ? error : new Error(String(error)), {
        formType: 'contact',
        formData: data
      });
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
          {...register('name', contactFormValidation.name)}
          error={errors.name?.message}
        />
        
        <Input
          label="Email Address *"
          type="email"
          placeholder="Enter your email address"
          {...register('email', contactFormValidation.email)}
          error={errors.email?.message}
        />
      </div>

      <Input
        label="Phone Number"
        type="tel"
        placeholder="Enter your phone number (optional)"
        {...register('phone', contactFormValidation.phone)}
        error={errors.phone?.message}
        helperText="We'll only use this to contact you about your inquiry"
      />

      <TextArea
        label="Message *"
        placeholder="Tell us about your interest in triathlon training, questions about our programs, or how we can help you achieve your goals..."
        rows={6}
        {...register('message', contactFormValidation.message)}
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