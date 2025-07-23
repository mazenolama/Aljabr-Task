import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import LoginForm from './components/auth/LoginForm';
import Dashboard from './components/Dashboard';
import AvailableSlots from './components/AvailableSlots';

function AppContent() {
  const [currentView, setCurrentView] = useState('slots');
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (isAuthenticated && (currentView === 'login')) {
      setCurrentView('dashboard');
    }
  }, [isAuthenticated, currentView]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }


  if (currentView === 'login') return <LoginForm />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentView={currentView} onViewChange={setCurrentView} />
      
      <main>
        {currentView === 'dashboard' && isAuthenticated && <Dashboard />}
        {currentView === 'slots' && <AvailableSlots />}
        {currentView === 'manage' && isAuthenticated && <Dashboard />}
        
        {!isAuthenticated && (currentView === 'dashboard' || currentView === 'manage') && (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
              <p className="text-gray-600 mb-6">Please login to access this page.</p>
              <button
                onClick={() => setCurrentView('login')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium"
              >
                Login
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;