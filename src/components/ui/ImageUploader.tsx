import React, { useState, useRef } from 'react';
import Button from './Button';
import StatusMessage from './StatusMessage';

interface ImageUploaderProps {
  label?: string;
  currentImage?: string;
  onImageChange: (imageUrl: string | null, file?: File | null) => void;
  error?: string;
  helperText?: string;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  label = 'Upload Image',
  currentImage,
  onImageChange,
  error,
  helperText,
  accept = 'image/*',
  maxSize = 5, // 5MB default
  className = ''
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file');
      return;
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setUploadError(`File size must be less than ${maxSize}MB`);
      return;
    }

    setUploadError('');
    setIsUploading(true);

    try {
      // Create preview URL
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      // In a real application, you would upload to a server or cloud storage
      // For now, we'll simulate an upload and use the object URL
      await simulateUpload(file);
      
      // Pass both the preview URL and the actual File object
      const uploadedUrl = `/uploads/images/${Date.now()}-${file.name}`;
      onImageChange(uploadedUrl, file);
      
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadError('Failed to upload image. Please try again.');
      setPreviewUrl(currentImage || null);
    } finally {
      setIsUploading(false);
    }
  };

  const simulateUpload = (file: File): Promise<void> => {
    return new Promise((resolve) => {
      // Simulate upload delay
      setTimeout(() => {
        console.log('Simulated upload of:', file.name);
        resolve();
      }, 1000);
    });
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    onImageChange(null, null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <div className="space-y-3">
        {/* Preview */}
        {previewUrl && (
          <div className="relative inline-block">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-lg border border-gray-300"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
              title="Remove image"
            >
              ×
            </button>
          </div>
        )}

        {/* Upload Button */}
        <div className="flex items-center space-x-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleButtonClick}
            loading={isUploading}
            disabled={isUploading}
          >
            {isUploading ? 'Uploading...' : previewUrl ? 'Change Image' : 'Select Image'}
          </Button>
          
          {previewUrl && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRemoveImage}
              className="text-red-600 hover:text-red-700 hover:border-red-300"
            >
              Remove
            </Button>
          )}
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Helper text */}
        {helperText && (
          <p className="text-sm text-gray-500">{helperText}</p>
        )}

        {/* Error messages */}
        {(error || uploadError) && (
          <StatusMessage
            type="error"
            message={error || uploadError}
            onDismiss={() => setUploadError('')}
          />
        )}
      </div>
    </div>
  );
};

export default ImageUploader;