import React, { useState, useEffect } from 'react';
import {
  History,
  Search,
  CheckCircle2,
  Calendar,
  Sparkles,
  Filter,
  Check
} from 'lucide-react';
import HabitIcon from './HabitIcon';
import api from '../api/client';

export default function HistoryView({ habits = [] }) {
  const [completions, setCompletions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/habits/completions');
        if (res.data?.data) {
          setCompletions(res.data.data);
        }
      } catch (err) {
        console.warn('Failed to fetch completion history:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const habitMap = {};
  habits.forEach((h) => {
    habitMap[h._id || h.id] = h;
  });

  const enrichedCompletions = completions.map((c) => {
    const habit = habitMap[c.habitId] || {};
    return {
      ...c,
      title: habit.title || 'Completed Habit',
      type: habit.type || 'positive',
      icon: habit.icon || 'water',
      category: habit.category || 'health',
    };
  });

  const filtered = enrichedCompletions.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* History Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 rounded-xl bg-blue-50 text-blue-600">
              <History className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Activity Timeline
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Completion History
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Chronological audit log of all your logged milestones and daily executions.
          </p>
        </div>

        <div className="flex items-center gap-3 self-stretch md:self-auto">
          <span className="px-4 py-2 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-2xl border border-emerald-100">
            {completions.length} Total Logs Recorded
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search history by habit name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-100 placeholder:text-slate-400 shadow-sm transition"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Type:
          </span>
          <div className="flex p-1 bg-slate-100 rounded-2xl">
            {['all', 'positive', 'negative'].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                  filterType === t
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* History Timeline Cards */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
          <Sparkles className="w-8 h-8 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700">No completion records found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {searchTerm
              ? 'No activity matches your search filter.'
              : 'Complete your first habit on the dashboard to build your permanent history log.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm divide-y divide-slate-100">
          {filtered.map((item) => (
            <div
              key={item._id || item.id}
              className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 -mx-3 px-3 rounded-2xl transition"
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    item.type === 'negative'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  <HabitIcon icon={item.icon} title={item.title} type={item.type} className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                    <span className="capitalize text-[10px] px-2 py-0.5 bg-slate-100 rounded-full text-slate-600 font-semibold">
                      {item.category}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Logged for {item.date}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-100">
                  <Check className="w-3.5 h-3.5 stroke-[3]" /> Completed
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
