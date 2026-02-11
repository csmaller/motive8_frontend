import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { velocityClassesApi } from '../../services/adminApi';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Select from '../../components/ui/Select';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import StatusMessage from '../../components/ui/StatusMessage';

interface VelocityClassFormData {
  name: string;
  description: string;
  schedule: string;
  duration: string;
  maxParticipants: number;
  currentEnrollment: number;
  instructor: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  cost: number;
  location: string;
  equipment?: string;
  prerequisites?: string;
}

const AdminVelocityClassesEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = id !== undefined && id !== 'new';
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<VelocityClassFormData>({
    defaultValues: {
      name: '',
      description: '',
      schedule: '',
      duration: '',
      maxParticipants: 12,
      currentEnrollment: 0,
      instructor: '',
      level: 'beginner',
      cost: 0,
      location: '',
      equipment: '',
      prerequisites: '',
    }
  });

  const loadClass = useCallback(async (classId: string) => {
    try {
      setIsLoading(true);
      const velocityClass = await velocityClassesApi.getById(classId);
      
      reset({
        name: velocityClass.name,
        description: velocityClass.description,
        schedule: velocityClass.schedule,
        duration: velocityClass.duration,
        maxParticipants: velocityClass.maxParticipants,
        currentEnrollment: velocityClass.currentEnrollment,
        instructor: velocityClass.instructor,
        level: velocityClass.level,
        cost: velocityClass.cost,
        location: velocityClass.location,
        equipment: velocityClass.equipment?.join(', ') || '',
        prerequisites: velocityClass.prerequisites?.join(', ') || '',
      });
    } catch (error) {
      console.error('Failed to load class:', error);
      setError('Failed to load class');
    } finally {
      setIsLoading(false);
    }
  }, [reset]);

  useEffect(() => {
    if (isEditing && id) {
      loadClass(id);
    }
  }, [id, isEditing, loadClass]);

  const onSubmit = async (data: VelocityClassFormData) => {
    try {
      setIsSaving(true);
      setError('');
      setSuccess('');

      const classData = {
        name: data.name,
        description: data.description,
        schedule: data.schedule,
        duration: data.duration,
        maxParticipants: Number(data.maxParticipants),
        currentEnrollment: Number(data.currentEnrollment),
        instructor: data.instructor,
        level: data.level,
        cost: Number(data.cost),
        location: data.location,
        equipment: data.equipment ? data.equipment.split(',').map(e => e.trim()).filter(e => e) : undefined,
        prerequisites: data.prerequisites ? data.prerequisites.split(',').map(p => p.trim()).filter(p => p) : undefined,
      };

      if (isEditing && id) {
        await velocityClassesApi.update(id, classData);
        setSuccess('Class updated successfully!');
      } else {
        await velocityClassesApi.create(classData);
        setSuccess('Class created successfully!');
      }
      
      setTimeout(() => navigate('/admin/velocity-classes'), 1500);
    } catch (error) {
      console.error('Failed to save class:', error);
      setError(error instanceof Error ? error.message : 'Failed to save class. Please try again.');
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
              {isEditing ? 'Edit Velocity Class' : 'Add New Velocity Class'}
            </h1>
            <p className="text-gray-600">
              {isEditing ? 'Update class information' : 'Create a new velocity class'}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate('/admin/velocity-classes')}
          >
            Back to Classes
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
              <Input
                label="Class Name"
                {...register('name', { required: 'Class name is required' })}
                error={errors.name?.message}
                placeholder="e.g., Beginner Cycling Fundamentals"
              />
              
              <Textarea
                label="Description"
                {...register('description', { required: 'Description is required' })}
                error={errors.description?.message}
                placeholder="Describe the class objectives and what participants will learn"
                rows={4}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Instructor"
                  {...register('instructor', { required: 'Instructor is required' })}
                  error={errors.instructor?.message}
                  placeholder="e.g., Mike Rodriguez"
                />

                <Select
                  label="Level"
                  {...register('level', { required: 'Level is required' })}
                  error={errors.level?.message}
                  options={[
                    { value: 'beginner', label: 'Beginner' },
                    { value: 'intermediate', label: 'Intermediate' },
                    { value: 'advanced', label: 'Advanced' },
                  ]}
                />
              </div>
            </div>
          </Card>

          {/* Schedule & Location */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule & Location</h3>
            
            <div className="space-y-6">
              <Input
                label="Schedule"
                {...register('schedule', { required: 'Schedule is required' })}
                error={errors.schedule?.message}
                placeholder="e.g., Tuesdays & Thursdays, 6:00 PM - 7:30 PM"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Duration"
                  {...register('duration', { required: 'Duration is required' })}
                  error={errors.duration?.message}
                  placeholder="e.g., 6 weeks"
                />

                <Input
                  label="Location"
                  {...register('location', { required: 'Location is required' })}
                  error={errors.location?.message}
                  placeholder="e.g., Indoor Training Center"
                />
              </div>
            </div>
          </Card>

          {/* Enrollment & Pricing */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Enrollment & Pricing</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                label="Max Participants"
                type="number"
                {...register('maxParticipants', { 
                  required: 'Max participants is required',
                  min: { value: 1, message: 'Must be at least 1' }
                })}
                error={errors.maxParticipants?.message}
                placeholder="12"
              />

              <Input
                label="Current Enrollment"
                type="number"
                {...register('currentEnrollment', {
                  min: { value: 0, message: 'Must be 0 or greater' }
                })}
                error={errors.currentEnrollment?.message}
                placeholder="0"
              />

              <Input
                label="Cost ($)"
                type="number"
                step="0.01"
                {...register('cost', { 
                  required: 'Cost is required',
                  min: { value: 0, message: 'Cost must be positive' }
                })}
                error={errors.cost?.message}
                placeholder="180.00"
              />
            </div>
          </Card>

          {/* Requirements */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Requirements</h3>
            
            <div className="space-y-6">
              <Textarea
                label="Equipment (comma-separated)"
                {...register('equipment')}
                error={errors.equipment?.message}
                placeholder="Road bike or hybrid, Helmet, Water bottle"
                rows={3}
                helperText="List required equipment, separated by commas"
              />

              <Textarea
                label="Prerequisites (comma-separated)"
                {...register('prerequisites')}
                error={errors.prerequisites?.message}
                placeholder="Basic bike handling skills, Ability to ride for 30 minutes"
                rows={3}
                helperText="List prerequisites, separated by commas"
              />
            </div>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/velocity-classes')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isSaving}
            >
              {isEditing ? 'Update Class' : 'Create Class'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminVelocityClassesEdit;
