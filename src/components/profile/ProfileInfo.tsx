import React from 'react';
import { Profile } from '../../types/database';
import { User, School, BookOpen, Shield } from 'lucide-react';

interface ProfileInfoProps {
  profile: Profile;
  onEdit: () => void;
}

export default function ProfileInfo({ profile, onEdit }: ProfileInfoProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Profile Information</h2>
        <button
          onClick={onEdit}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Edit Profile
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <User className="w-5 h-5 text-gray-500" />
          <div>
            <p className="text-sm text-gray-500">Full Name</p>
            <p className="text-lg font-medium text-gray-900">{profile.full_name}</p>
          </div>
        </div>

        {profile.student_id && (
          <div className="flex items-center space-x-3">
            <School className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Student ID</p>
              <p className="text-lg font-medium text-gray-900">{profile.student_id}</p>
            </div>
          </div>
        )}

        {profile.department && (
          <div className="flex items-center space-x-3">
            <BookOpen className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Department</p>
              <p className="text-lg font-medium text-gray-900">{profile.department}</p>
            </div>
          </div>
        )}

        <div className="flex items-center space-x-3">
          <Shield className="w-5 h-5 text-gray-500" />
          <div>
            <p className="text-sm text-gray-500">Role</p>
            <p className="text-lg font-medium text-gray-900 capitalize">{profile.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}