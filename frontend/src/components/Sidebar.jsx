import React from 'react';
import {
  CheckSquare,
  Target,
  BarChart2,
  History,
  Lightbulb,
  Bell,
  Settings,
  LogOut,
  Heart,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ activeTab, setActiveTab, isOpen, onClose, unreadCount = 0 }) {
  const { logout, user } = useAuth();

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

  const handleNavClick = (id) => {
    setActiveTab(id);
    if (onClose) onClose(); // Auto-close drawer on mobile selection
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Main Sidebar Container (Fixed drawer on mobile, static rail on desktop) */}
      <aside
        className={`fixed lg:static top-0 left-0 bottom-0 z-50 w-64 bg-white border-r border-slate-100 flex flex-col justify-between py-6 px-4 shrink-0 min-h-screen transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Logo & Mobile Close Button */}
          <div className="flex items-center justify-between px-3 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm">
                <Heart className="w-5 h-5 fill-blue-600 text-blue-600" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900">StreakUp</span>
            </div>

            {/* Close button on mobile */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-150 active:scale-[0.98] ${
                    isActive
                      ? 'bg-[#1E40AF] text-white shadow-md shadow-blue-900/15'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== null && item.badge !== undefined && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
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
            onClick={() => handleNavClick('settings')}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-semibold text-sm transition-colors"
          >
            <Settings className="w-5 h-5 text-slate-400" />
            <span>Settings</span>
          </button>
          {user && (
            <button
              onClick={() => { logout(); if (onClose) onClose(); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-600 hover:text-red-600 hover:bg-red-50 font-semibold text-sm transition-colors"
            >
              <LogOut className="w-5 h-5 text-slate-400" />
              <span>Logout</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
}