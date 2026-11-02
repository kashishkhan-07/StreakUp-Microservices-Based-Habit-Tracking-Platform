import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import Sidebar from './Sidebar';
import MetricCards from './MetricCards';
import HabitSection from './HabitSection';
import CalendarWidget from './CalendarWidget';
import ProgressChart from './ProgressChart';
import AddHabitModal from './AddHabitModal';
import AuthModal from './AuthModal';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('habits');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('positive');
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const [habitsData, setHabitsData] = useState({
    positiveHabits: [
      { id: '1', title: 'Drink Glass Of Water', frequency: { type: 'daily' }, streak: 7, isCompletedToday: false, icon: 'water' },
      { id: '2', title: 'Read Books', frequency: { type: 'daily' }, streak: 7, isCompletedToday: true, icon: 'book' },
      { id: '3', title: 'Workout', frequency: { type: 'weekly' }, streak: 13, isCompletedToday: true, icon: 'workout' },
    ],
    negativeHabits: [
      { id: '4', title: 'Stop Smoking', frequency: { type: 'daily' }, streak: 25, isCompletedToday: false, icon: 'smoke' },
      { id: '5', title: 'Stop Drinking', frequency: { type: 'daily' }, streak: 7, isCompletedToday: false, icon: 'drink' },
    ],
    metrics: {
      todayProgress: 40,
      activeHabits: 5,
      completedToday: 2,
      leftToday: 3,
    },
  });

  const [analytics, setAnalytics] = useState({
    currentStreak: 25,
    longestStreak: 62,
    totalCompletions: 15,
  });

  const loadData = async () => {
    try {
      const [habitsRes, analyticsRes] = await Promise.all([
        api.get('/habits'),
        api.get('/analytics/summary'),
      ]);

      if (habitsRes.data?.data) {
        setHabitsData((prev) => ({
          ...prev,
          positiveHabits: habitsRes.data.data.positiveHabits || prev.positiveHabits,
          negativeHabits: habitsRes.data.data.negativeHabits || prev.negativeHabits,
          metrics: habitsRes.data.data.metrics || prev.metrics,
        }));
      }

      if (analyticsRes.data?.data) {
        setAnalytics(analyticsRes.data.data);
      }
    } catch (err) {
      console.warn('Backend not logged in or offline; displaying local data preview.');
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleToggleHabit = async (habitId) => {
    try {
      await api.post(`/habits/${habitId}/toggle`, {});
      loadData();
    } catch (err) {
      // Local optimistic toggle
      setHabitsData((prev) => {
        const toggleList = (list) =>
          list.map((h) => (h.id === habitId || h._id === habitId ? { ...h, isCompletedToday: !h.isCompletedToday } : h));
        return {
          ...prev,
          positiveHabits: toggleList(prev.positiveHabits),
          negativeHabits: toggleList(prev.negativeHabits),
        };
      });
    }
  };

  const handleCreateHabit = async (newHabit) => {
    try {
      await api.post('/habits', newHabit);
      loadData();
    } catch (err) {
      setHabitsData((prev) => {
        const item = { ...newHabit, id: Date.now().toString(), streak: 1, isCompletedToday: false };
        if (newHabit.type === 'negative') {
          return { ...prev, negativeHabits: [...prev.negativeHabits, item] };
        }
        return { ...prev, positiveHabits: [...prev.positiveHabits, item] };
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F4F6FB]">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto overflow-y-auto">
        {/* Top Header */}
        <header className="flex items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-100 placeholder:text-slate-400 shadow-sm"
            />
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <img
                src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border-2 border-yellow-300 ring-2 ring-white shadow-sm"
              />
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm"
              >
                Sign In
              </button>
            )}
          </div>
        </header>

        {/* 4 KPI Metric Cards */}
        <MetricCards metrics={habitsData.metrics} />

        {/* Split 2-Column Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <HabitSection
              title="Positive Habits"
              type="positive"
              habits={habitsData.positiveHabits}
              onToggle={handleToggleHabit}
              onAddNew={(t) => {
                setModalType(t);
                setModalOpen(true);
              }}
            />

            <HabitSection
              title="Negative Habits"
              type="negative"
              habits={habitsData.negativeHabits}
              onToggle={handleToggleHabit}
              onAddNew={(t) => {
                setModalType(t);
                setModalOpen(true);
              }}
            />
          </div>

          <div className="lg:col-span-5">
            <CalendarWidget />
            <ProgressChart analytics={analytics} />
          </div>
        </div>

        {/* Add Habit Modal */}
        <AddHabitModal
          isOpen={modalOpen}
          defaultType={modalType}
          onClose={() => setModalOpen(false)}
          onSave={handleCreateHabit}
        />

        {/* Auth Modal */}
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
        />
      </main>
    </div>
  );
}