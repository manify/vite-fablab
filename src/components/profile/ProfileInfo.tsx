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
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="flex justify-between items-start mb-6 border-b-2 border-yellow-400 pb-4">
        <h2 className="text-3xl font-extrabold text-black">Profile Information</h2>
        <button
          onClick={onEdit}
          className="px-5 py-2 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50"
          disabled={uploading}
        >
          Edit Profile
        </button>
      </div>

      <div className="flex items-center space-x-6 mb-8">
        <div className="relative w-28 h-28 border-4 border-yellow-400 rounded-full bg-white">
          <img
            src={profile.avatar_url || '/default-avatar.png'}
            alt="Profile Avatar"
            className="w-full h-full rounded-full object-cover"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.src = '/default-avatar.png';
            }}
          />
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
            </div>
          )}
        </div>
        <label
          htmlFor="upload-avatar"
          className={`flex items-center px-4 py-2 text-sm font-bold text-white bg-black rounded-md cursor-pointer hover:bg-yellow-400 transition-colors ${
            uploading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <Camera className="w-5 h-5 mr-2" />
          {uploading ? 'Uploading...' : 'Change Picture'}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-yellow-400 p-4 rounded-lg shadow">
          <div className="flex items-center space-x-3">
            <User className="w-5 h-5 text-yellow-400 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-600">Full Name</p>
              <p className="text-lg font-medium text-black">{profile.full_name || 'Not set'}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-yellow-400 p-4 rounded-lg shadow">
          <div className="flex items-center space-x-3">
            <School className="w-5 h-5 text-yellow-400 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-600">Student ID</p>
              <p className="text-lg font-medium text-black">{profile.student_id || 'Not set'}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-yellow-400 p-4 rounded-lg shadow">
          <div className="flex items-center space-x-3">
            <BookOpen className="w-5 h-5 text-yellow-400 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-600">Department</p>
              <p className="text-lg font-medium text-black">{profile.department || 'Not set'}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-yellow-400 p-4 rounded-lg shadow">
          <div className="flex items-center space-x-3">
            <Shield className="w-5 h-5 text-yellow-400 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-600">Role</p>
              <p className="text-lg font-medium text-black capitalize">{profile.role}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
