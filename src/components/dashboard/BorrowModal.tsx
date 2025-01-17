import React, { useState } from 'react';
import { X } from 'lucide-react';
import { addDays, format } from 'date-fns';

interface BorrowModalProps {
  onClose: () => void;
  onSubmit: (data: {
    expected_return_date: string;
    project_name?: string;
    course_details?: string;
  }) => Promise<void>;
}

export default function BorrowModal({ onClose, onSubmit }: BorrowModalProps) {
  const [formData, setFormData] = useState({
    expected_return_date: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
    project_name: '',
    course_details: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Borrow Item</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Return Date
            </label>
            <input
              type="date"
              required
              min={format(new Date(), 'yyyy-MM-dd')}
              value={formData.expected_return_date}
              onChange={e => setFormData(prev => ({ 
                ...prev, 
                expected_return_date: e.target.value 
              }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Project Name (Optional)
            </label>
            <input
              type="text"
              value={formData.project_name}
              onChange={e => setFormData(prev => ({ 
                ...prev, 
                project_name: e.target.value 
              }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Course Details (Optional)
            </label>
            <input
              type="text"
              value={formData.course_details}
              onChange={e => setFormData(prev => ({ 
                ...prev, 
                course_details: e.target.value 
              }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Borrow
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}