import React, { useState, useEffect } from 'react';
import {
  Settings,
  User,
  Mail,
  Globe,
  Bell,
  Check,
  Save,
  Volume2,
  Calendar,
  Sparkles,
  Sliders,
  LogOut,
  RefreshCw
} from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { playCompletionChime } from '../utils/soundEffects';

const avatarPresets = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
];

export default function SettingsView() {
  const { user, updateUser, logout } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [timezone, setTimezone] = useState(user?.timezone || 'Asia/Kolkata');
  const [avatar, setAvatar] = useState(user?.avatar || avatarPresets[0]);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Preference Toggles (persisted locally)
  const [milestonesEnabled, setMilestonesEnabled] = useState(() => {
    return localStorage.getItem('pref_milestones') !== 'false';
  });
  const [soundEnabled, setSoundEnabled] = useState(() => {
    return localStorage.getItem('pref_sound') !== 'false';
  });
  const [weekStartMonday, setWeekStartMonday] = useState(() => {
    return localStorage.getItem('pref_week_monday') === 'true';
  });

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setTimezone(user.timezone || 'Asia/Kolkata');
      setAvatar(user.avatar || avatarPresets[0]);
    }
  }, [user]);

  const handleToggle = (key, currentVal, setter) => {
    const nextVal = !currentVal;
    setter(nextVal);
    localStorage.setItem(key, String(nextVal));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await api.put('/auth/me', {
        name: name.trim(),
        timezone,
        avatar,
      });

      if (res.data?.data) {
        updateUser(res.data.data);
      }

      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3500);
    } catch (err) {
      console.error('Update profile error:', err);
      setErrorMsg(err.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Settings Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 rounded-xl bg-blue-50 text-blue-600">
              <Settings className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Account & Preferences
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Settings
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Customize your personal profile, notifications, and tracking habits.
          </p>
        </div>

        {successMsg && (
          <span className="px-4 py-2 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-2xl border border-emerald-100 flex items-center gap-1.5 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-600" /> {successMsg}
          </span>
        )}
        {errorMsg && (
          <span className="px-4 py-2 bg-red-50 text-red-700 font-bold text-xs rounded-2xl border border-red-100 flex items-center gap-1.5 animate-in fade-in">
            {errorMsg}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Profile Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-900 text-base mb-5 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            <span>Profile Information</span>
          </h3>

          <form onSubmit={handleSaveProfile} className="space-y-5">
            {/* Avatar Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2.5 uppercase tracking-wider">
                Profile Avatar
              </label>
              <div className="flex items-center gap-3">
                {avatarPresets.map((imgUrl, i) => (
                  <button
                    type="button"
                    key={i}
                    onClick={() => setAvatar(imgUrl)}
                    className={`relative rounded-full transition-all duration-200 ${
                      avatar === imgUrl
                        ? 'ring-4 ring-blue-600 scale-110 shadow-md'
                        : 'opacity-70 hover:opacity-100 hover:scale-105'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt="Avatar preset"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={user?.email || 'alex@streakup.com'}
                  disabled
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 text-sm cursor-not-allowed font-medium"
                />
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Email is linked to your account and cannot be changed here.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">
                Timezone
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium"
                >
                  <option value="Asia/Kolkata">Asia/Kolkata (IST - UTC+05:30)</option>
                  <option value="America/New_York">America/New_York (EST - UTC-05:00)</option>
                  <option value="Europe/London">Europe/London (GMT - UTC+00:00)</option>
                  <option value="America/Los_Angeles">America/Los_Angeles (PST - UTC-08:00)</option>
                  <option value="UTC">UTC (Universal Coordinated Time)</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#1E40AF] hover:bg-blue-800 text-white rounded-xl text-sm font-semibold shadow-sm transition active:scale-95 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving changes...' : 'Save Profile'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Experience & Habit Preferences */}
        <div className="lg:col-span-5 space-y-6">
          {/* Notifications & Sound Effects */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-600" />
              <span>Notifications & Sounds</span>
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <div>
                  <h4 className="font-semibold text-slate-900 text-xs">Milestone Alerts</h4>
                  <p className="text-[11px] text-slate-400">Receive celebrations upon completing habits</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle('pref_milestones', milestonesEnabled, setMilestonesEnabled)}
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    milestonesEnabled ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                      milestonesEnabled ? 'left-6' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <div>
                  <h4 className="font-semibold text-slate-900 text-xs">Audio Chimes</h4>
                  <p className="text-[11px] text-slate-400">Play pleasant celebratory chime on habit completion</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => playCompletionChime()}
                    title="Preview Chime"
                    className="px-2.5 py-1 bg-white hover:bg-slate-200 text-blue-600 rounded-lg text-xs font-bold border border-slate-200 transition active:scale-95 flex items-center gap-1 shadow-xs"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Test</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggle('pref_sound', soundEnabled, setSoundEnabled)}
                    className={`w-11 h-6 rounded-full transition-colors relative ${
                      soundEnabled ? 'bg-blue-600' : 'bg-slate-300'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                        soundEnabled ? 'left-6' : 'left-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Calendar & Tracking Behavior */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              <span>Calendar Preferences</span>
            </h3>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-slate-900 text-xs">Week Starts on Monday</h4>
                <p className="text-[11px] text-slate-400">Set weekly calendar layout orientation</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('pref_week_monday', weekStartMonday, setWeekStartMonday)}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  weekStartMonday ? 'bg-indigo-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                    weekStartMonday ? 'left-6' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Account Actions */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Sliders className="w-5 h-5 text-slate-600" />
              <span>Account Actions</span>
            </h3>

            <div className="flex flex-col gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Do you want to reload the application cache?')) {
                    window.location.reload();
                  }
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload App Cache</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Are you sure you want to log out of StreakUp?')) {
                    logout();
                  }
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
