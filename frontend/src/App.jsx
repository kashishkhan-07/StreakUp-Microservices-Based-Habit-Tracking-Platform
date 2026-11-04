import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Dashboard from './components/Dashboard';
import AuthPage from './components/AuthPage';

function AppContent() {
  const { user, loading } = useAuth();

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F6FB] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Loading StreakUp...
          </span>
        </div>
      </div>
    );
  }

  // 1. Agar login nahi hai -> Attractive AuthPage (Login/Signup) dikhao
  if (!user) {
    return <AuthPage />;
  }

  // 2. Agar login ho chuka hai -> Pura Working Dashboard dikhao
  return <Dashboard />;
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  );
}
