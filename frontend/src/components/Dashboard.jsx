import React, { useState, useEffect } from 'react';
import { Search, Menu, Bell, Heart } from 'lucide-react';
import Sidebar from './Sidebar';
import MetricCards from './MetricCards';
import HabitSection from './HabitSection';
import CalendarWidget from './CalendarWidget';
import ProgressChart from './ProgressChart';
import AddHabitModal from './AddHabitModal';
import EditHabitModal from './EditHabitModal';
import NotificationDrawer from './NotificationDrawer';
import { playCompletionChime, playUndoSound } from '../utils/soundEffects';

// Dynamic Sub-views
import GoalsView from './GoalsView';
import AnalyticsView from './AnalyticsView';
import HistoryView from './HistoryView';
import TipsView from './TipsView';
import SettingsView from './SettingsView';

import api from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('habits');
  const [search, setSearch] = useState('');
  
  // Modals state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('positive');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);

  const [notificationOpen, setNotificationOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [completionDates, setCompletionDates] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const [habitsData, setHabitsData] = useState({
    all: [],
    positiveHabits: [],
    negativeHabits: [],
    metrics: {
      todayProgress: 0,
      activeHabits: 0,
      completedToday: 0,
      leftToday: 0,
    },
  });

  const [analytics, setAnalytics] = useState({
    currentStreak: 0,
    longestStreak: 0,
    totalCompletions: 0,
  });

  const loadData = async (date = selectedDate) => {
    try {
      const [habitsRes, analyticsRes, completionsRes, notifyRes] = await Promise.all([
        api.get(`/habits?date=${date}`),
        api.get(`/analytics/summary?date=${date}`).catch(() => ({ data: { data: {} } })),
        api.get('/habits/completions').catch(() => ({ data: { data: [] } })),
        api.get('/notifications/unread-count').catch(() => ({ data: { data: { unreadCount: 0 } } })),
      ]);

      if (habitsRes.data?.data) {
        setHabitsData({
          all: habitsRes.data.data.all || [],
          positiveHabits: habitsRes.data.data.positiveHabits || [],
          negativeHabits: habitsRes.data.data.negativeHabits || [],
          metrics: habitsRes.data.data.metrics || {
            todayProgress: 0,
            activeHabits: 0,
            completedToday: 0,
            leftToday: 0,
          },
        });
      }

      if (analyticsRes.data?.data) {
        setAnalytics(analyticsRes.data.data);
      }

      if (completionsRes.data?.data) {
        const dates = Array.from(new Set(completionsRes.data.data.map((c) => c.date)));
        setCompletionDates(dates);
      }

      if (notifyRes.data?.data?.unreadCount !== undefined) {
        setUnreadCount(notifyRes.data.data.unreadCount);
      }
    } catch (err) {
      console.warn('Dashboard load sync issue:', err.message);
    }
  };

  useEffect(() => {
    if (user) {
      loadData(selectedDate);
    }
  }, [user, selectedDate]);

  const handleDateSelect = (dateStr) => {
    setSelectedDate(dateStr);
  };

  const handleToggleHabit = async (habitId) => {
    try {
      const res = await api.post(`/habits/${habitId}/toggle`, { date: selectedDate });
      if (res.data?.data?.completed) {
        playCompletionChime();
      } else {
        playUndoSound();
      }
      loadData(selectedDate);
    } catch (err) {
      console.error('Failed to toggle habit:', err.message);
    }
  };

  const handleCreateHabit = async (newHabit) => {
    try {
      const res = await api.post('/habits', newHabit);
      console.log('Habit created successfully in MongoDB:', res.data);
      await loadData(selectedDate);
    } catch (err) {
      console.error('Failed to create habit:', err);
      alert('Habit Save Error: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleStartEdit = (habit) => {
    setEditingHabit(habit);
    setEditModalOpen(true);
  };

  const handleUpdateHabit = async (habitId, updatedData) => {
    try {
      await api.put(`/habits/${habitId}`, updatedData);
      console.log('Habit updated successfully:', habitId);
      await loadData(selectedDate);
    } catch (err) {
      console.error('Failed to update habit:', err);
      alert('Update Error: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteHabit = async (habitId) => {
    try {
      await api.delete(`/habits/${habitId}`);
      console.log('Habit deleted successfully:', habitId);
      await loadData(selectedDate);
    } catch (err) {
      console.error('Failed to delete habit:', err);
      alert('Delete Error: ' + (err.response?.data?.message || err.message));
    }
  };

  const filterHabits = (list) => {
    if (!search.trim()) return list;
    return list.filter((h) => h.title.toLowerCase().includes(search.toLowerCase()));
  };

  return (
    <div className="flex min-h-screen bg-[#F4F6FB] overflow-x-hidden">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'notifications') {
            setNotificationOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        unreadCount={unreadCount}
      />

      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto overflow-y-auto">
        {/* Mobile Top Navigation */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200/60 lg:hidden">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 shadow-sm active:scale-95"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-1.5 font-extrabold text-slate-900 text-lg">
              <Heart className="w-5 h-5 fill-blue-600 text-blue-600" />
              <span>StreakUp</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setNotificationOpen(true)}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 shadow-sm relative active:scale-95"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            <img
              src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
              alt="Profile"
              className="w-9 h-9 rounded-full object-cover border-2 border-yellow-300 shadow-sm"
            />
          </div>
        </div>

        {/* Desktop Header */}
        <header className="flex items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search habits & routines..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-100 placeholder:text-slate-400 shadow-sm transition"
            />
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <span className="text-sm font-bold text-slate-700">
              {user?.name}
            </span>
            <img
              src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover border-2 border-yellow-300 ring-2 ring-white shadow-sm"
            />
          </div>
        </header>

        {/* ==================== DYNAMIC TAB ROUTING ==================== */}

        {/* 1. Habits Tab (Core Tracker) */}
        {activeTab === 'habits' && (
          <>
            {/* Selected Date Indicator Banner */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Viewing records for: <span className="text-blue-700 font-extrabold">{selectedDate === todayStr ? 'Today (' + selectedDate + ')' : selectedDate}</span>
              </span>
              {selectedDate !== todayStr && (
                <button
                  onClick={() => setSelectedDate(todayStr)}
                  className="text-xs text-blue-600 hover:underline font-bold"
                >
                  Back to Today
                </button>
              )}
            </div>

            {/* 4 KPI Metric Cards */}
            <MetricCards metrics={habitsData.metrics} />

            {/* Responsive Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Habits Lists with Date Locks */}
              <div className="lg:col-span-7 space-y-6">
                <HabitSection
                  title="Positive Habits"
                  type="positive"
                  habits={filterHabits(habitsData.positiveHabits)}
                  onToggle={handleToggleHabit}
                  onAddNew={(t) => {
                    setModalType(t);
                    setModalOpen(true);
                  }}
                  onEdit={handleStartEdit}
                  onDelete={handleDeleteHabit}
                  selectedDate={selectedDate}
                  todayStr={todayStr}
                />

                <HabitSection
                  title="Negative Habits"
                  type="negative"
                  habits={filterHabits(habitsData.negativeHabits)}
                  onToggle={handleToggleHabit}
                  onAddNew={(t) => {
                    setModalType(t);
                    setModalOpen(true);
                  }}
                  onEdit={handleStartEdit}
                  onDelete={handleDeleteHabit}
                  selectedDate={selectedDate}
                  todayStr={todayStr}
                />
              </div>

              {/* Right Column: Calendar & Trend Wave Chart */}
              <div className="lg:col-span-5 space-y-6">
                <CalendarWidget
                  selectedDate={selectedDate}
                  onDateSelect={handleDateSelect}
                  completionDates={completionDates}
                />

                <ProgressChart analytics={analytics} />
              </div>
            </div>
          </>
        )}

        {/* 2. Goals Tab */}
        {activeTab === 'goals' && (
          <GoalsView habits={habitsData.all} analytics={analytics} />
        )}

        {/* 3. Analytics Tab */}
        {activeTab === 'analytics' && (
          <AnalyticsView analytics={analytics} habits={habitsData.all} />
        )}

        {/* 4. History Tab */}
        {activeTab === 'history' && (
          <HistoryView habits={habitsData.all} />
        )}

        {/* 5. Tips Tab */}
        {activeTab === 'tips' && (
          <TipsView />
        )}

        {/* 6. Settings Tab */}
        {activeTab === 'settings' && (
          <SettingsView />
        )}

        {/* ============================================================= */}

        {/* Add Habit Modal */}
        <AddHabitModal
          isOpen={modalOpen}
          defaultType={modalType}
          onClose={() => setModalOpen(false)}
          onSave={handleCreateHabit}
        />

        {/* Edit Habit Modal */}
        <EditHabitModal
          isOpen={editModalOpen}
          habit={editingHabit}
          onClose={() => {
            setEditModalOpen(false);
            setEditingHabit(null);
          }}
          onUpdate={handleUpdateHabit}
        />

        {/* Notification Slide-out Drawer */}
        <NotificationDrawer
          isOpen={notificationOpen}
          onClose={() => setNotificationOpen(false)}
          onNotificationUpdate={() => loadData(selectedDate)}
        />
      </main>
    </div>
  );
}
