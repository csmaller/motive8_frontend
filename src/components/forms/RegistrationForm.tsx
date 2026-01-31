import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Input from '../ui/Input';
import TextArea from '../ui/Textarea';
import Select from '../ui/Select';
import Button from '../ui/Button';
import StatusMessage from '../ui/StatusMessage';
import type { RegistrationFormData } from '../../types';
import { registrationFormValidation, formatFormData } from '../../utils/validation';
import { EXPERIENCE_LEVELS } from '../../types';
import { handleError, simulateNetworkRequest, retryOperation, logErrorToService } from '../../utils/errorHandling';

interface RegistrationFormProps {
  classId?: string;
  className?: string;
  onSubmit?: (data: RegistrationFormData) => Promise<void>;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ 
  classId: _classId, // Currently unused but may be needed for future functionality
  className = '', 
  onSubmit 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<RegistrationFormData>();

  const watchedExperience = watch('experience');

  const handleFormSubmit = async (data: RegistrationFormData) => {
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
          delay: 2000,
          failureRate: 0 // Set to 0.2 for testing error handling
        });
        console.log('Registration form submitted:', formattedData);
      }

      setSubmitStatus('success');
      setSubmitMessage('Registration successful! We\'ll contact you soon with class details and next steps.');
      reset();
    } catch (error) {
      const appError = handleError(error);
      setSubmitStatus('error');
      setSubmitMessage(appError.message);
      
      // Log error for monitoring
      logErrorToService(error instanceof Error ? error : new Error(String(error)), {
        formType: 'registration',
        classId: _classId,
        formData: data
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const classOptions = [
    { value: 'beginner-fundamentals', label: 'Beginner Cycling Fundamentals' },
    { value: 'intermediate-power', label: 'Intermediate Power Training' },
    { value: 'advanced-race-prep', label: 'Advanced Race Preparation' },
    { value: 'youth-development', label: 'Youth Cycling Development' },
  ];

  return (
    <div className={`max-w-2xl mx-auto ${className}`}>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Register for Velocity Classes</h2>
        <p className="text-gray-600">
          Complete the form below to register for our cycling classes. We'll review your application and contact you with next steps.
        </p>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Personal Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="First Name *"
              placeholder="Enter your first name"
              {...register('firstName', registrationFormValidation.firstName)}
              error={errors.firstName?.message}
            />
            
            <Input
              label="Last Name *"
              placeholder="Enter your last name"
              {...register('lastName', registrationFormValidation.lastName)}
              error={errors.lastName?.message}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Input
              label="Email Address *"
              type="email"
              placeholder="Enter your email address"
              {...register('email', registrationFormValidation.email)}
              error={errors.email?.message}
            />
            
            <Input
              label="Phone Number *"
              type="tel"
              placeholder="Enter your phone number"
              {...register('phone', registrationFormValidation.phone)}
              error={errors.phone?.message}
            />
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Emergency Contact Name *"
              placeholder="Full name of emergency contact"
              {...register('emergencyContact', registrationFormValidation.emergencyContact)}
              error={errors.emergencyContact?.message}
            />
            
            <Input
              label="Emergency Contact Phone *"
              type="tel"
              placeholder="Emergency contact phone number"
              {...register('emergencyPhone', registrationFormValidation.emergencyPhone)}
              error={errors.emergencyPhone?.message}
            />
          </div>
        </div>

        {/* Class Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Class Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Experience Level *"
              placeholder="Select your cycling experience"
              options={EXPERIENCE_LEVELS}
              {...register('experience', registrationFormValidation.experience)}
              error={errors.experience?.message}
            />
            
            <Select
              label="Class Preference *"
              placeholder="Select preferred class"
              options={classOptions}
              {...register('classPreference', registrationFormValidation.classPreference)}
              error={errors.classPreference?.message}
            />
          </div>

          {watchedExperience && (
            <div className="mt-6">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                <h4 className="text-sm font-medium text-blue-900 mb-2">
                  {watchedExperience === 'beginner' && 'Beginner Level Information'}
                  {watchedExperience === 'intermediate' && 'Intermediate Level Information'}
                  {watchedExperience === 'advanced' && 'Advanced Level Information'}
                </h4>
                <p className="text-sm text-blue-800">
                  {watchedExperience === 'beginner' && 'Perfect for those new to cycling or looking to build foundational skills. No prior experience required.'}
                  {watchedExperience === 'intermediate' && 'Ideal for cyclists with 6+ months of experience who want to improve performance and technique.'}
                  {watchedExperience === 'advanced' && 'Designed for experienced cyclists focused on competitive performance and advanced training methods.'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Medical Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical Information</h3>
          
          <TextArea
            label="Medical Conditions or Concerns"
            placeholder="Please list any medical conditions, injuries, or concerns we should be aware of (optional)"
            rows={4}
            {...register('medicalConditions')}
            error={errors.medicalConditions?.message}
            helperText="This information helps us provide safe and appropriate training"
          />
        </div>

        {/* Terms and Conditions */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Terms and Conditions</h3>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <input
                type="checkbox"
                id="agreeToTerms"
                {...register('agreeToTerms', registrationFormValidation.agreeToTerms)}
                className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="agreeToTerms" className="ml-3 text-sm text-gray-700">
                I agree to the terms and conditions, waiver of liability, and understand that cycling training involves inherent risks. I confirm that I am physically capable of participating in cycling activities. *
              </label>
            </div>
            {errors.agreeToTerms && (
              <p className="text-sm text-red-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.agreeToTerms.message}
              </p>
            )}
          </div>
        </div>

        {/* Submit Status Messages */}
        <div className="transition-all duration-300 ease-in-out">
          {submitStatus === 'success' && (
            <StatusMessage
              type="success"
              title="Registration Successful!"
              message={submitMessage}
              className="animate-fade-in"
            />
          )}

          {submitStatus === 'error' && (
            <StatusMessage
              type="error"
              title="Registration Failed"
              message={submitMessage}
              className="animate-fade-in"
            />
          )}
        </div>

        {/* Submit Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            type="submit"
            loading={isSubmitting}
            disabled={isSubmitting}
            size="lg"
            className="flex-1"
          >
            {isSubmitting ? 'Processing Registration...' : 'Submit Registration'}
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
            By submitting this form, you agree to our privacy policy and terms of service. 
            We'll contact you within 24-48 hours to confirm your registration and provide class details.
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;