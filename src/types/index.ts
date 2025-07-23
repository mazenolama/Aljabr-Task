export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  created_on?: string;
  modified_on?: string;
}

export interface Slot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  deleted: boolean;
  status: 'available' | 'booked' | 'cancelled';
  createdBy: string;
  isAvailable: boolean;
  createdOn: string;
  modifiedOn: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface SlotFormData {
  date: string;
  StartTime: string;
  EndTime: string;
  recurring_days?: string[];
}