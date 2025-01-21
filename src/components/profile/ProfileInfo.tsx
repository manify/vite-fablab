// ProfileInfo.tsx
import React, { useRef } from 'react';
import { Profile } from '../../types/database';
import { User, School, BookOpen, Shield, Camera } from 'lucide-react';
import toast from 'react-hot-toast';

interface ProfileInfoProps {
  profile: Profile;
  onEdit: () => void;
  onUpload: (file: File) => void;
  uploading: boolean;
}

export default function ProfileInfo({ profile, onEdit, onUpload, uploading }: ProfileInfoProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('Selected file:', {
        name: file.name,
        type: file.type,
        size: file.size
      });
      
      // Additional client-side validation
      if (!file.type.match(/^image\/(jpeg|png|gif|webp)$/)) {
        toast.error('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }
  
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }
  
      onUpload(file);
      // Reset input value to allow uploading the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Profile Information</h2>
        <button
          onClick={onEdit}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          disabled={uploading}
        >
          Edit Profile
        </button>
      </div>

      <div className="flex items-center space-x-4 mb-6">
        <div className="relative w-20 h-20">
          <img
            src={profile.avatar_url || '/default-avatar.png'}
            alt="Profile Avatar"
            className="w-20 h-20 rounded-full object-cover"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.src = '/default-avatar.png';
            }}
          />
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            </div>
          )}
        </div>
        <label
          htmlFor="upload-avatar"
          className={`flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md cursor-pointer hover:bg-blue-600 transition-colors ${
            uploading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <div className="flex items-center space-x-2">
            <Camera className="w-5 h-5" />
            <span>{uploading ? 'Uploading...' : 'Change Picture'}</span>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            id="upload-avatar"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <User className="w-5 h-5 text-gray-500 flex-shrink-0" />
          <div>
            <p className="text-sm text-gray-500">Full Name</p>
            <p className="text-lg font-medium text-gray-900">{profile.full_name || 'Not set'}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <School className="w-5 h-5 text-gray-500 flex-shrink-0" />
          <div>
            <p className="text-sm text-gray-500">Student ID</p>
            <p className="text-lg font-medium text-gray-900">{profile.student_id || 'Not set'}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <BookOpen className="w-5 h-5 text-gray-500 flex-shrink-0" />
          <div>
            <p className="text-sm text-gray-500">Department</p>
            <p className="text-lg font-medium text-gray-900">{profile.department || 'Not set'}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Shield className="w-5 h-5 text-gray-500 flex-shrink-0" />
          <div>
            <p className="text-sm text-gray-500">Role</p>
            <p className="text-lg font-medium text-gray-900 capitalize">{profile.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}