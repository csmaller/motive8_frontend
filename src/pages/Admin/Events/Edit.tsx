import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { eventsApi } from '../../../services/adminApi';
import { API_BASE_URL } from '../../../config/api';
import type { Event } from '../../../types';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Textarea from '../../../components/ui/Textarea';
import Select from '../../../components/ui/Select';
import ImageUploader from '../../../components/ui/ImageUploader';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import StatusMessage from '../../../components/ui/StatusMessage';

interface EventFormData {
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  type: Event['type'];
  registrationRequired: boolean;
  maxParticipants: number;
  registrationDeadline: string;
  cost: number;
  paymentUrl: string;
}

const AdminEventsEdit: React.FC = () => {
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
    watch,
    reset
  } = useForm<EventFormData>({
    defaultValues: {
      title: '',
      date: '',
      time: '',
      location: '',
      description: '',
      type: 'training',
      registrationRequired: false,
      maxParticipants: 20,
      registrationDeadline: '',
      cost: 0,
      paymentUrl: ''
    }
  });

  const watchRegistrationRequired = watch('registrationRequired');

  const loadEvent = useCallback(async (eventId: string) => {
    try {
      setIsLoading(true);
      const event = await eventsApi.getById(eventId);
      
      // Format dates for form inputs
      const eventDate = new Date(event.date);
      const formattedDate = eventDate.toISOString().split('T')[0];
      const formattedDeadline = event.registrationDeadline 
        ? new Date(event.registrationDeadline).toISOString().split('T')[0]
        : '';
      
      reset({
        title: event.title,
        date: formattedDate,
        time: event.time,
        location: event.location,
        description: event.description,
        type: event.type,
        registrationRequired: event.registrationRequired,
        maxParticipants: event.maxParticipants,
        registrationDeadline: formattedDeadline,
        cost: event.cost || 0,
        paymentUrl: event.paymentUrl || ''
      });
      
      // Set current image if available
      setCurrentImage(event.imageUrl || null);
    } catch (error) {
      console.error('Failed to load event:', error);
      setError('Failed to load event');
    } finally {
      setIsLoading(false);
    }
  }, [reset]);

  useEffect(() => {
    if (isEditing && id) {
      loadEvent(id);
    }
  }, [id, isEditing, loadEvent]);

  const onSubmit = async (data: EventFormData) => {
    try {
      setIsSaving(true);
      setError('');
      setSuccess('');
      
      // Use FormData if there's an image file to upload
      if (imageFile) {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('date', data.date);
        formData.append('time', data.time);
        formData.append('location', data.location);
        formData.append('description', data.description);
        formData.append('type', data.type);
        formData.append('registration_required', String(data.registrationRequired));
        formData.append('max_participants', String(data.maxParticipants));
        if (data.registrationDeadline) formData.append('registration_deadline', data.registrationDeadline);
        formData.append('cost', String(data.cost));
        if (data.paymentUrl) formData.append('payment_url', data.paymentUrl);
        formData.append('current_participants', '0');
        formData.append('image', imageFile);
        
        if (isEditing) {
          formData.append('_method', 'PUT');
        }

        const url = isEditing ? `${API_BASE_URL}/events/${id}` : `${API_BASE_URL}/events`;
        
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
            'Accept': 'application/json',
          },
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(`HTTP ${response.status}: ${errorData.message || response.statusText}`);
        }

        const result = await response.json();
        
        // Update the current image with the new image from the response
        if (result.image_url) {
          setCurrentImage(result.image_url);
        }
        
        // Clear the file object since it's been uploaded
        setImageFile(null);
        
        setSuccess(isEditing ? 'Event updated successfully!' : 'Event created successfully!');
      } else {
        // No image file, use JSON
        const eventData = {
          ...data,
          date: new Date(data.date),
          registrationDeadline: data.registrationDeadline ? new Date(data.registrationDeadline) : undefined,
          currentParticipants: 0,
          imageUrl: currentImage || undefined,
          paymentUrl: data.paymentUrl || undefined
        };

        if (isEditing && id) {
          await eventsApi.update(id, eventData);
          setSuccess('Event updated successfully!');
        } else {
          await eventsApi.create(eventData);
          setSuccess('Event created successfully!');
        }
      }
      
      setTimeout(() => navigate('/admin/events'), 1500);
    } catch (error) {
      console.error('Failed to save event:', error);
      setError(error instanceof Error ? error.message : 'Failed to save event. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const typeOptions = [
    { value: 'race', label: 'Race' },
    { value: 'training', label: 'Training' },
    { value: 'social', label: 'Social' }
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
              {isEditing ? 'Edit Event' : 'Create New Event'}
            </h1>
            <p className="text-gray-600">
              {isEditing ? 'Update event details and settings' : 'Create a new race, training session, or social event'}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate('/admin/events')}
          >
            Back to Events
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Details</h3>
            
            <div className="space-y-6">
              {/* Image Upload */}
              <ImageUploader
                label="Event Image"
                currentImage={currentImage ?? undefined}
                onImageChange={(url, file) => {
                  setCurrentImage(url);
                  setImageFile(file || null);
                }}
                helperText="Upload an event image (max 5MB). Best results with 16:9 aspect ratio (e.g., 1920x1080)"
                maxSize={5}
              />
              
              <Input
                label="Event Title"
                {...register('title', { required: 'Title is required' })}
                error={errors.title?.message}
                placeholder="Enter event title"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <Input
                label="Date"
                type="date"
                {...register('date', { required: 'Date is required' })}
                error={errors.date?.message}
              />
              
              <Input
                label="Time"
                type="time"
                {...register('time', { required: 'Time is required' })}
                error={errors.time?.message}
              />
              
              <div className="md:col-span-2">
                <Input
                  label="Location"
                  {...register('location', { required: 'Location is required' })}
                  error={errors.location?.message}
                  placeholder="Event location"
                />
              </div>
              
              <Select
                label="Event Type"
                {...register('type', { required: 'Type is required' })}
                error={errors.type?.message}
                options={typeOptions}
              />
              
              <Input
                label="Cost ($)"
                type="number"
                step="0.01"
                {...register('cost', { 
                  min: { value: 0, message: 'Cost cannot be negative' }
                })}
                error={errors.cost?.message}
                placeholder="0.00"
                helperText="Leave as 0 for free events"
              />
              
              <div className="md:col-span-2">
                <Textarea
                  label="Description"
                  {...register('description', { required: 'Description is required' })}
                  error={errors.description?.message}
                  placeholder="Describe the event, what to expect, requirements, etc."
                  rows={4}
                />
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Registration Settings</h3>
            
            <div className="space-y-6">
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    {...register('registrationRequired')}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Registration Required</span>
                </label>
                <p className="text-xs text-gray-500 mt-1">Check if participants need to register for this event</p>
              </div>
              
              {watchRegistrationRequired && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Maximum Participants"
                      type="number"
                      {...register('maxParticipants', { 
                        required: watchRegistrationRequired ? 'Maximum participants is required' : false,
                        min: { value: 1, message: 'Must allow at least 1 participant' }
                      })}
                      error={errors.maxParticipants?.message}
                      placeholder="20"
                    />
                    
                    <Input
                      label="Registration Deadline"
                      type="date"
                      {...register('registrationDeadline', {
                        required: watchRegistrationRequired ? 'Registration deadline is required' : false
                      })}
                      error={errors.registrationDeadline?.message}
                      helperText="Last day to register"
                    />
                  </div>
                  
                  <Input
                    label="Payment/Registration URL"
                    type="url"
                    {...register('paymentUrl')}
                    error={errors.paymentUrl?.message}
                    placeholder="https://example.com/register"
                    helperText="External link for event registration or payment"
                  />
                </div>
              )}
            </div>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/events')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isSaving}
            >
              {isEditing ? 'Update Event' : 'Create Event'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminEventsEdit;