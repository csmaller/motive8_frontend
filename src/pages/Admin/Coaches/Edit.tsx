import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { peopleApi, type CreateUserData, type UpdateUserData } from '../../../services/peopleApi';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import ImageUploader from '../../../components/ui/ImageUploader';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import StatusMessage from '../../../components/ui/StatusMessage';

interface CoachFormData {
  // Person fields
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specializations: string;
  // User fields (for new coaches only)
  password: string;
  confirmPassword: string;
}

const AdminCoachesEdit: React.FC = () => {
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
  } = useForm<CoachFormData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      specializations: '',
      password: '',
      confirmPassword: ''
    }
  });

  const watchPassword = watch('password');

  const loadCoach = useCallback(async (coachId: string) => {
    try {
      setIsLoading(true);
      const coach = await peopleApi.getById(coachId);
      
      console.log('Loaded coach data:', coach);
      console.log('Coach phone:', coach.person.phone);
      console.log('Coach specializations:', coach.person.specializations);
      
      reset({
        firstName: coach.person.firstName,
        lastName: coach.person.lastName,
        email: coach.email,
        phone: coach.person.phone || '',
        specializations: coach.person.specializations?.join(', ') || '',
        password: '',
        confirmPassword: ''
      });
      
      // Set current image
      setCurrentImage(coach.person.image || null);
      console.log('Set current image to:', coach.person.image);
    } catch (error) {
      console.error('Failed to load coach:', error);
      setError('Failed to load coach');
    } finally {
      setIsLoading(false);
    }
  }, [reset]);

  useEffect(() => {
    if (isEditing && id) {
      loadCoach(id);
    }
  }, [id, isEditing, loadCoach]);

  const onSubmit = async (data: CoachFormData) => {
    // Validate password confirmation for new coaches
    if (!isEditing && data.password !== data.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!isEditing && !data.password) {
      setError('Password is required for new coaches');
      return;
    }

    try {
      setIsSaving(true);
      setError('');
      setSuccess('');
      
      // Parse specializations from comma-separated string
      const specializationsArray = data.specializations
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      const userData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone || undefined,
        image: currentImage ?? undefined,
        imageFile: imageFile || undefined, // Pass the File object
        specializations: specializationsArray,
        ...(data.password && { password: data.password })
      };

      if (isEditing && id) {
        const updatedCoach = await peopleApi.update(id, userData as UpdateUserData);
        console.log('Updated coach response:', updatedCoach);
        
        // Update the current image with the new image from the response
        if (updatedCoach.person.image) {
          setCurrentImage(updatedCoach.person.image);
          console.log('Updated current image to:', updatedCoach.person.image);
        }
        
        // Clear the file object since it's been uploaded
        setImageFile(null);
        
        setSuccess('Coach updated successfully!');
        setTimeout(() => navigate('/admin/coaches'), 1500);
      } else {
        // For new coaches, we need to provide default values for required fields
        const createData = {
          ...userData,
          username: userData.email.split('@')[0] // Generate username from email
        };
        const createdCoach = await peopleApi.create(createData as CreateUserData);
        console.log('Created coach response:', createdCoach);
        setSuccess('Coach created successfully!');
        setTimeout(() => navigate('/admin/coaches'), 1500);
      }
    } catch (error) {
      console.error('Failed to save coach:', error);
      setError(error instanceof Error ? error.message : 'Failed to save coach. Please try again.');
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
              {isEditing ? 'Edit Coach' : 'Add New Coach'}
            </h1>
            <p className="text-gray-600">
              {isEditing ? 'Update coach information and specializations' : 'Create a new coach profile'}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate('/admin/coaches')}
          >
            Back to Coaches
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
          {/* Personal Information */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
            
            <div className="space-y-6">
              {/* Image Upload */}
              <ImageUploader
                label="Coach Photo"
                currentImage={currentImage ?? undefined}
                onImageChange={(url, file) => {
                  setCurrentImage(url);
                  setImageFile(file || null);
                }}
                helperText="Upload a professional photo of the coach (max 5MB)"
                maxSize={5}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="First Name"
                  {...register('firstName', { required: 'First name is required' })}
                  error={errors.firstName?.message}
                  placeholder="Enter first name"
                />
                
                <Input
                  label="Last Name"
                  {...register('lastName', { required: 'Last name is required' })}
                  error={errors.lastName?.message}
                  placeholder="Enter last name"
                />
                
                <Input
                  label="Email"
                  type="email"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  error={errors.email?.message}
                  placeholder="Enter email address"
                />
                
                <Input
                  label="Phone"
                  type="tel"
                  formatPhone
                  {...register('phone')}
                  error={errors.phone?.message}
                  placeholder="123-456-7890"
                />
              </div>
            </div>
          </Card>

          {/* Coach Information */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Coach Information</h3>
            
            <div className="space-y-6">
              <Input
                label="Specializations"
                {...register('specializations')}
                error={errors.specializations?.message}
                placeholder="Enter specializations separated by commas (e.g., Swimming, Cycling, Running)"
                helperText="Separate multiple specializations with commas"
              />
            </div>
          </Card>

          {/* Account Information (for new coaches only) */}
          {!isEditing && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Password"
                  type="password"
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: { value: 8, message: 'Password must be at least 8 characters' }
                  })}
                  error={errors.password?.message}
                  placeholder="Enter password"
                />
                
                <Input
                  label="Confirm Password"
                  type="password"
                  {...register('confirmPassword', { 
                    required: 'Please confirm password',
                    validate: value => value === watchPassword || 'Passwords do not match'
                  })}
                  error={errors.confirmPassword?.message}
                  placeholder="Confirm password"
                />
              </div>
            </Card>
          )}

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/coaches')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isSaving}
            >
              {isEditing ? 'Update Coach' : 'Create Coach'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminCoachesEdit;