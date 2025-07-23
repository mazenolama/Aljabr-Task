import React from 'react';
import { Clock, User, Calendar, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Slot } from '../../types';
import { format } from 'date-fns';

interface SlotCardProps {
  slot: Slot;
  onBook?: (slot: Slot) => void;
  onEdit?: (slot: Slot) => void;
  onDelete?: (slot: Slot) => void;
  onUpdateStatus?: (slot: Slot, status: string) => void;
  showActions?: boolean;
  showAdminActions?: boolean;
}

const SlotCard: React.FC<SlotCardProps> = ({
  slot,
  onBook,
  onEdit,
  onDelete,
  onUpdateStatus,
  showActions = true,
  showAdminActions = true,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'booked':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="h-4 w-4" />;
      case 'booked':
        return <AlertCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-gray-500" />
          <span className="font-medium text-gray-900">{formatDate(slot.created_on)}</span>
        </div>
        <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(slot.status)}`}>
          {getStatusIcon(slot.status)}
          <span className="capitalize">{slot.status}</span>
        </div>
      </div>

      <div className="flex items-center space-x-2 mb-4">
        <Clock className="h-5 w-5 text-gray-500" />
        <span className="text-gray-900">
          {slot.StartTime} - {slot.EndTime}
        </span>
      </div>

      {slot.created_by_user && (
        <div className="flex items-center space-x-2 mb-4">
          <User className="h-5 w-5 text-gray-500" />
          <span className="text-sm text-gray-600">
            Created by {slot.created_by_user.name}
          </span>
        </div>
      )}

      {(showActions || showAdminActions) && (
        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
          {showActions && slot.status === 'available' && onBook && (
            <button
              onClick={() => onBook(slot)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Book Slot
            </button>
          )}
          
          {showAdminActions && onEdit && (
            <button
              onClick={() => onEdit(slot)}
              className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Edit
            </button>
          )}
          
          {showAdminActions && onUpdateStatus && slot.status === 'booked' && (
            <button
              onClick={() => onUpdateStatus(slot, 'cancelled')}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Cancel
            </button>
          )}
          
          {showAdminActions && onDelete && slot.status !== 'booked' && (
            <button
              onClick={() => onDelete(slot)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SlotCard;