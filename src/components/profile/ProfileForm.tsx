// ProfileForm.tsx
import React, { useState } from 'react';
import { Profile } from '../../types/database';
import { X } from 'lucide-react';

interface ProfileFormProps {
  profile: Profile;
  onSubmit: (data: Partial<Profile>) => Promise<void>;
  onClose: () => void;
}

export default function ProfileForm({ profile, onSubmit, onClose }: ProfileFormProps) {
  const [formData, setFormData] = useState<Partial<Profile>>({
    full_name: profile.full_name || '',
    student_id: profile.student_id || '',
    department: profile.department || '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await onSubmit(formData);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Edit Profile</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={submitting}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              id="full_name"
              type="text"
              value={formData.full_name || ''}
              onChange={e => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
              disabled={submitting}
            />
          </div>

          <div>
            <label htmlFor="student_id" className="block text-sm font-medium text-gray-700">
              Student ID
            </label>
            <input
              id="student_id"
              type="text"
              value={formData.student_id || ''}
              onChange={e => setFormData(prev => ({ ...prev, student_id: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              disabled={submitting}
            />
          </div>

          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700">
              Department
            </label>
            <input
              id="department"
              type="text"
              value={formData.department || ''}
              onChange={e => setFormData(prev => ({ ...prev, department: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              disabled={submitting}
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={submitting}
            >
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}