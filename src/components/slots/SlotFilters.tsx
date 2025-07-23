import React, { useState } from 'react';
import { Filter } from 'lucide-react';
import { apiService } from '../../services/api';

interface User {
  id: string;
  name: string;
}

interface SlotFiltersProps {
  filters: {
    date: string;
    status: string;
    userId: string;
  };
  onFilterChange: (filters: { date: string; status: string; userId: string }) => void;
}

const SlotFilters: React.FC<SlotFiltersProps> = ({ filters, onFilterChange }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoaded, setUsersLoaded] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);


  const handleFilterChange = (key: string, value: string) => {
      console.log(`Filter changed: ${key} = ${value}`); // add this line

    onFilterChange({ ...filters, [key]: value });
  };

  // Called when user dropdown opens
  const handleUserDropdownFocus = async () => {
    if (!usersLoaded) {
      setLoadingUsers(true);
      try {
        const usersData = await apiService.getUsers();
        setUsers(usersData);
        setUsersLoaded(true);
      } catch (error) {
        console.error('Failed to load users:', error);
      } finally {
        setLoadingUsers(false);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex items-center space-x-2 mb-4">
        <Filter className="h-5 w-5 text-gray-500" />
        <span className="font-medium text-gray-900">Filters</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="date-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            id="date-filter"
            value={filters.date}
            onChange={(e) => handleFilterChange('date', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>

        <div>
          <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status-filter"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="">All Status</option>
            <option value="available">Available</option>
            <option value="booked">Booked</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div>
          <label htmlFor="user-filter" className="block text-sm font-medium text-gray-700 mb-1">
            User
          </label>
          <select
            id="user-filter"
            value={filters.userId}
            onChange={(e) => handleFilterChange('userId', e.target.value)}
            onFocus={handleUserDropdownFocus}  // <-- call API when dropdown focused
            disabled={loadingUsers} // disable while loading
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="">All Users</option>
           {users.map(user => (
              <option key={user.userId} value={user.userId.toString()}>{user.name}</option>
            ))}
          </select>
          {loadingUsers && <div className="text-xs text-gray-500 mt-1">Loading users...</div>}
        </div>
      </div>

      {(filters.date || filters.status || filters.userId) && (
        <div className="mt-4">
          <button
            onClick={() => onFilterChange({ date: '', status: '', userId: '' })}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
};

export default SlotFilters;
