import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  Target,
  BarChart2,
  History,
  Lightbulb,
  Bell,
  Settings,
  LogOut,
  Heart
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';

export default function Sidebar({ activeTab, setActiveTab }) {
  const { logout, user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch live unread notifications count from Notification Service
  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await api.get('/notifications/unread-count');
        if (res.data?.data?.unreadCount !== undefined) {
          setUnreadCount(res.data.data.unreadCount);
        }
      } catch (err) {
        // Fallback if not logged in
        setUnreadCount(0);
      }
    };

    fetchUnread();
    const interval = setInterval(fetchUnread, 10000); // Polling every 10s for new events
    return () => clearInterval(interval);
  }, [user]);

  const navItems = [
    { id: 'habits', label: 'Habits', icon: CheckSquare },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'history', label: 'History', icon: History },
    { id: 'tips', label: 'Tips', icon: Lightbulb },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      badge: unreadCount > 0 ? unreadCount : null
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-100 flex flex-col justify-between py-6 px-4 shrink-0 min-h-screen">
      <div>
        {/* Brand Logo */}
        <div className="flex items-center gap-3 px-3 mb-8">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-brand-primary flex items-center justify-center shadow-sm">
            <Heart className="w-5 h-5 fill-brand-primary text-brand-primary" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900">Habits</span>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium text-sm transition-all duration-150 ${
                  isActive
                    ? 'bg-[#1E40AF] text-white shadow-md shadow-blue-900/10'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== null && item.badge !== undefined && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="pt-6 border-t border-slate-100 space-y-1">
        <button
          onClick={() => setActiveTab('settings')}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium text-sm transition-colors"
        >
          <Settings className="w-5 h-5 text-slate-400" />
          <span>Settings</span>
        </button>
        {user && (
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-600 hover:text-red-600 hover:bg-red-50 font-medium text-sm transition-colors"
          >
            <LogOut className="w-5 h-5 text-slate-400" />
            <span>Logout</span>
          </button>
        )}
      </div>
    </aside>
  );
}