import React, { useEffect, useState } from 'react';
import { apiService } from '../../services/api';
import { User } from '../../types';

interface UserFilterProps {
  selectedUser: string;
  onChange: (userId: string) => void;
}

const UserFilter: React.FC<UserFilterProps> = ({ selectedUser, onChange }) => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    apiService.getUsers()
      .then(setUsers)
      .catch((error) => console.error('Error fetching users:', error));
  }, []);

  return (
    <div>
      <label htmlFor="user-filter" className="block text-sm font-medium text-gray-700 mb-1">
        User
      </label>
      <select
        id="user-filter"
        value={selectedUser}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
      >
        <option value="">All Users</option>
        {users.map(user => (
          <option key={user.userId} value={user.userId}>{user.name}</option>
        ))}
      </select>
    </div>
  );
};

export default UserFilter;
