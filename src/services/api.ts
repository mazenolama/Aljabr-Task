import { Slot, SlotFormData } from '../types';

const API_BASE_URL = 'https://localhost:7131/api';

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async getSlots(filters?: { date?: string; status?: string; user_id?: string }): Promise<Slot[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    
    const response = await fetch(`${API_BASE_URL}/Slots?${params}`, {
      headers: this.getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch slots');
    }
    
    return response.json();
  }

  async getAvailableSlots(date?: string): Promise<Slot[]> {
    const params = new URLSearchParams();
    if (date) params.append('date', date);
    
    const response = await fetch(`${API_BASE_URL}/Slots?${params}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch available slots');
    }
    
    return response.json();
  }

  async createSlot(slotData: SlotFormData): Promise<Slot> {
    const response = await fetch(`${API_BASE_URL}/slots`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(slotData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create slot');
    }
    
    return response.json();
  }

  async updateSlot(id: string, updates: Partial<SlotFormData & { status: string }>): Promise<Slot> {
    const response = await fetch(`${API_BASE_URL}/slots/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(updates),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update slot');
    }
    
    return response.json();
  }

  async deleteSlot(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/slots/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete slot');
    }
  }

  async bookSlot(id: string): Promise<Slot> {
    const response = await fetch(`${API_BASE_URL}/Slots/${id}/book`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to book slot');
    }
    
    return response.json();
  }
}

export const apiService = new ApiService();