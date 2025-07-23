import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Clock, User, BarChart3 } from 'lucide-react';
import { Slot } from '../types';
import { apiService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import SlotCard from './slots/SlotCard';
import SlotForm from './slots/SlotForm';
import SlotFilters from './slots/SlotFilters';
import { SlotFormData } from '../types';


const Dashboard: React.FC = () => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSlot, setEditingSlot] = useState<Slot | undefined>();
  const [filters, setFilters] = useState({ date: '', status: '' });
  const { user } = useAuth();

  useEffect(() => {
    fetchSlots();
  }, [filters]);

  const fetchSlots = async () => {
    try {
      setLoading(true);
      const data = await apiService.getSlots({
        ...(filters.date && { date: filters.date }),
        ...(filters.status && { status: filters.status }),
      });
      setSlots(data);
    } catch (error) {
      console.error('Failed to fetch slots:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSlot = async (formData: SlotFormData) => {
    const now = new Date().toISOString();
    console.log('Creating slot with data:', formData, 'at', now);
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;


    const newSlot = {
      date: formData.date,
      StartTime: `${formData.date}T${formData.StartTime}`,
      EndTime: `${formData.date}T${formData.EndTime}`,
      status: 'available',
      createdBy: user?.userId || null, // Use parsed userId
      isAvailable: true,
    };

    try {
      await apiService.createSlot(newSlot);
      fetchSlots();
    } catch (error) {
      console.error('Failed to create slot:', error);
    }
  };


const handleUpdateSlot = async (formData: any) => {
  if (editingSlot) {
    const now = new Date().toISOString();

    // Construct Date objects
    const start = new Date(`${formData.date}T${formData.StartTime}:00`);
    const end = new Date(`${formData.date}T${formData.EndTime}:00`);

    // Format with timezone offset (+03:00)
    const formatWithOffset = (date: Date) =>
      date.toLocaleString('sv-SE', { timeZone: 'Asia/Riyadh' }).replace(' ', 'T') + '+03';

    const newSlot = {
      startTime: formatWithOffset(start),
      endTime: formatWithOffset(end),
      modifiedOn: now,
    };

    console.log('Updating slot with data:', newSlot);

    try {
      await apiService.updateSlot(editingSlot.id, newSlot);
      fetchSlots();
    } catch (error) {
      console.error('Failed to update slot:', error);
    }
  }
};


  const handleBookSlot = async (slot: Slot) => {
    try {
      await apiService.bookSlot(slot.id);
    
      fetchSlots();
    } catch (error) {
      console.error('Failed to book slot:', error);
    }
  };

  const handleDeleteSlot = async (slot: Slot) => {
    if (window.confirm('Are you sure you want to delete this slot?')) {
      try {
        await apiService.deleteSlot(slot.id);
        fetchSlots();
      } catch (error) {
        console.error('Failed to delete slot:', error);
      }
    }
  };

  const handleUpdateStatus = async (slot: Slot, status: string) => {
    try {
      await apiService.updateSlot(slot.id, { status });
      fetchSlots();
    } catch (error) {
      console.error('Failed to update slot status:', error);
    }
  };

  const stats = {
    total: slots.length,
    available: slots.filter(s => s.status === 'available').length,
    booked: slots.filter(s => s.status === 'booked').length,
    cancelled: slots.filter(s => s.status === 'cancelled').length,
  };

  if (loading && slots.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          </div>
          {user?.role === 'admin' && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Create Slot</span>
            </button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Slots</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Available</p>
                <p className="text-2xl font-bold text-gray-900">{stats.available}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Booked</p>
                <p className="text-2xl font-bold text-gray-900">{stats.booked}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <User className="h-8 w-8 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Cancelled</p>
                <p className="text-2xl font-bold text-gray-900">{stats.cancelled}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <SlotFilters filters={filters} onFilterChange={setFilters} />

        {/* Slots Grid */}
        {slots.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No slots found</p>
            {user?.role === 'admin' && (
              <button
                onClick={() => setShowForm(true)}
                className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
              >
                Create your first slot
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {slots.map((slot) => (
              <SlotCard
                key={slot.id}
                slot={slot}
                onBook={handleBookSlot}
                onEdit={(slot) => {
                  setEditingSlot(slot);
                  setShowForm(true);
                }}
                onDelete={handleDeleteSlot}
                onUpdateStatus={handleUpdateStatus}
                showActions={user?.role !== 'admin'}
                showAdminActions={user?.role === 'admin'}
              />
            ))}
          </div>
        )}

        {/* Slot Form Modal */}
        {showForm && (
          <SlotForm
            slot={editingSlot}
            onSubmit={editingSlot ? handleUpdateSlot : handleCreateSlot}
            onClose={() => {
              setShowForm(false);
              setEditingSlot(undefined);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;