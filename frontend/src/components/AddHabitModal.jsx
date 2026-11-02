import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function AddHabitModal({ isOpen, onClose, onSave, defaultType = 'positive' }) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState(defaultType);
  const [icon, setIcon] = useState('water');
  const [category, setCategory] = useState('health');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({ title, type, icon, category });
    setTitle('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <h3 className="font-bold text-lg text-slate-900">Create New Habit</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Title</label>
            <input
              type="text"
              placeholder="e.g. Drink 2L Water, Read 20 mins"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none"
              >
                <option value="positive">Positive (Build)</option>
                <option value="negative">Negative (Avoid/Break)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Icon</label>
              <select
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none"
              >
                <option value="water">Water Cup</option>
                <option value="book">Book</option>
                <option value="workout">Workout</option>
                <option value="smoke">No Smoking</option>
                <option value="drink">No Alcohol</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 text-sm font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#1E40AF] hover:bg-blue-800 text-white rounded-xl text-sm font-semibold shadow-sm"
            >
              Save Habit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}