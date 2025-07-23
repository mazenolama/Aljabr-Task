import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Search, RefreshCw } from 'lucide-react';
import { Slot } from '../types';
import { apiService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import SlotCard from './slots/SlotCard';
import { format } from 'date-fns';

const AvailableSlots: React.FC = () => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<string | null>(null);
  const [searchDate, setSearchDate] = useState('');
  const [message, setMessage] = useState('');
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchAvailableSlots();
  }, [searchDate]);

  const fetchAvailableSlots = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAvailableSlots(searchDate || undefined);
      setSlots(data);
    } catch (error) {
      console.error('Failed to fetch available slots:', error);
      setMessage('Failed to load available slots. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBookSlot = async (slot: Slot) => {
    if (!isAuthenticated) {
      setMessage('Please login to book a slot');
      return;
    }

    try {
      setBooking(slot.id);
      await apiService.bookSlot(slot.id);
      setMessage('Slot booked successfully!');
      fetchAvailableSlots(); // Refresh the list
    } catch (error) {
      console.error('Failed to book slot:', error);
      setMessage(error instanceof Error ? error.message : 'Failed to book slot');
    } finally {
      setBooking(null);
      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleRefresh = () => {
    fetchAvailableSlots();
  };

  const todayString = format(new Date(), 'yyyy-MM-dd');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Available Slots</h1>
          <p className="text-xl text-gray-600">Book your preferred time slot</p>
          
        </div>

        {/* Search and Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Search className="h-5 w-5 text-gray-500" />
                <label htmlFor="search-date" className="text-sm font-medium text-gray-700">
                  Filter by date:
                </label>
              </div>
              <input
                type="date"
                id="search-date"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                min={todayString}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {searchDate && (
                <button
                  onClick={() => setSearchDate('')}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear
                </button>
              )}
            </div>
            
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Success/Error Messages */}
        {message && (
          <div className={`mb-6 p-4 rounded-md ${
            message.includes('successfully') 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : message.includes('login')
              ? 'bg-amber-50 text-amber-800 border border-amber-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message}
          </div>
        )}

        {/* Loading State */}
        {loading && slots.length === 0 && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading available slots...</p>
          </div>
        )}

        {/* No Slots Available */}
        {!loading && slots.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No Available Slots</h3>
            <p className="text-gray-600 mb-4">
              {searchDate 
                ? `No slots available for ${format(new Date(searchDate), 'MMM dd, yyyy')}`
                : 'No slots are currently available for booking'
              }
            </p>
            <button
              onClick={() => setSearchDate('')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              View all dates
            </button>
          </div>
        )}

        {/* Slots */}
        {slots.length > 0 && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-600">
                {slots.length} available slot{slots.length !== 1 ? 's' : ''} found
                {searchDate && ` for ${format(new Date(searchDate), 'MMM dd, yyyy')}`}
              </p>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                <span>Click to book</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {slots.map((slot) => (
                <div key={slot.id} className="relative">
                  <SlotCard
                    slot={slot}
                    onBook={handleBookSlot}
                    showActions={true}
                  />
                 
                </div>
              ))}
            </div>
          </>
        )}

       
      </div>
    </div>
  );
};

export default AvailableSlots;