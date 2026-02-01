import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { peopleApi, type CreateUserData, type UpdateUserData } from '../../services/peopleApi';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import StatusMessage from '../../components/ui/StatusMessage';

interface UserFormData {
  // Person fields
  firstName: string;
  lastName: string;
  phone: string;
  // User fields
  email: string;
  password: string;
  confirmPassword: string;
}

const AdminUsersEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = id !== 'new';
  
  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset
  } = useForm<UserFormData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const watchPassword = watch('password');

  const loadUser = useCallback(async (userId: string) => {
    try {
      setIsLoading(true);
      const user = await peopleApi.getById(userId);
      
      reset({
        firstName: user.person.firstName,
        lastName: user.person.lastName,
        phone: user.person.phone || '',
        email: user.email,
        password: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Failed to load user:', error);
      setError('Failed to load user');
    } finally {
      setIsLoading(false);
    }
  }, [reset]);

  useEffect(() => {
    if (isEditing && id) {
      loadUser(id);
    }
  }, [id, isEditing, loadUser]);

  const onSubmit = async (data: UserFormData) => {
    // Validate password confirmation
    if (!isEditing && data.password !== data.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!isEditing && !data.password) {
      setError('Password is required for new users');
      return;
    }

    try {
      setIsSaving(true);
      setError('');
      
      const userData = {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone || undefined,
        email: data.email,
        ...(data.password && { password: data.password })
      };

      if (isEditing && id) {
        await peopleApi.update(id, userData as UpdateUserData);
        setSuccess('User updated successfully!');
      } else {
        // For new users, we need to provide default values for required fields
        const createData = {
          ...userData,
          username: userData.email.split('@')[0], // Generate username from email
          role: 'member' as const,
          status: 'active' as const
        };
        await peopleApi.create(createData as CreateUserData);
        setSuccess('User created successfully!');
        setTimeout(() => navigate('/admin/users'), 2000);
      }
    } catch (error) {
      console.error('Failed to save user:', error);
      setError('Failed to save user');
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
              {isEditing ? 'Edit User' : 'Create New User'}
            </h1>
            <p className="text-gray-600">
              {isEditing ? 'Update user account and personal information' : 'Create a new user account with personal information'}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate('/admin/users')}
          >
            Back to Users
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
                label="Phone"
                type="tel"
                {...register('phone')}
                error={errors.phone?.message}
                placeholder="Enter phone number"
              />
            </div>
          </Card>

          {/* Account Information */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              
              {!isEditing && (
                <>
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
                </>
              )}
              
              {isEditing && (
                <div className="md:col-span-2">
                  <Input
                    label="New Password (leave blank to keep current)"
                    type="password"
                    {...register('password', {
                      minLength: { value: 8, message: 'Password must be at least 8 characters' }
                    })}
                    error={errors.password?.message}
                    placeholder="Enter new password"
                    helperText="Leave blank to keep current password"
                  />
                </div>
              )}
            </div>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/users')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isSaving}
            >
              {isEditing ? 'Update User' : 'Create User'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminUsersEdit;