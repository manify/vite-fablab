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

  const fields = [
    { id: 'full_name', label: 'Full Name', value: formData.full_name, required: true },
    { id: 'student_id', label: 'Student ID', value: formData.student_id, required: false },
    { id: 'department', label: 'Department', value: formData.department, required: false },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-lg">
        <div className="flex justify-between items-center mb-6 border-b-2 border-yellow-400 pb-2">
          <h2 className="text-2xl font-bold text-black">Edit Profile</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-yellow-400 transition-colors"
            disabled={submitting}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {fields.map((field) => (
            <div key={field.id} className="space-y-1">
              <label
                htmlFor={field.id}
                className="block text-sm font-semibold text-gray-700"
              >
                {field.label}
              </label>
              <input
                id={field.id}
                type="text"
                value={field.value || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    [field.id]: e.target.value,
                  }))
                }
                className="mt-1 block w-full rounded-md border border-gray-300 text-black shadow-sm focus:border-yellow-400 focus:ring-yellow-400 disabled:bg-gray-100"
                required={field.required}
                disabled={submitting}
              />
            </div>
          ))}

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50"
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
