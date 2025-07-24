import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Slot, SlotFormData } from '../../types';
import { format } from 'date-fns';

interface SlotFormProps {
  slot?: Slot;
  onSubmit: (data: SlotFormData) => Promise<void>;
  onClose: () => void;
  loading?: boolean;
}

const SlotForm: React.FC<SlotFormProps> = ({ slot, onSubmit, onClose, loading = false }) => {
  const [formData, setFormData] = useState<SlotFormData>({
    date: slot ? slot.date : format(new Date(), 'yyyy-MM-dd'),
    StartTime: slot ? slot.StartTime : '09:00',
    EndTime: slot ? slot.EndTime : '10:00',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.StartTime >= formData.EndTime) {
      setError('End time must be after start time');
      return;
    }

    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to save slot');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {slot ? 'Edit Slot' : 'Create New Slot'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input
              type="date"
              id="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="StartTime" className="block text-sm font-medium text-gray-700 mb-2">
              Start Time
            </label>
            <input
              type="time"
              id="StartTime"
              value={formData.StartTime}
              onChange={(e) => setFormData({ ...formData, StartTime: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="EndTime" className="block text-sm font-medium text-gray-700 mb-2">
              End Time
            </label>
            <input
              type="time"
              id="EndTime"
              value={formData.EndTime}
              onChange={(e) => setFormData({ ...formData, EndTime: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium disabled:opacity-50 transition-colors"
            >
              {loading ? 'Saving...' : slot ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SlotForm;