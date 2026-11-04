import React, { useState, useEffect, useRef } from 'react';
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
  RefreshCw,
  Upload,
  Camera,
  Image as ImageIcon,
} from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { playCompletionChime } from '../utils/soundEffects';
import UserAvatar from './UserAvatar';

const cartoonAvatarPresets = [
  {
    id: 'felix',
    label: 'Adventurer',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix&backgroundColor=ffd5dc',
  },
  {
    id: 'aneka',
    label: 'Hero',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka&backgroundColor=d1d4f9',
  },
  {
    id: 'milo',
    label: 'Scholar',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Milo&backgroundColor=c0aede',
  },
  {
    id: 'sparky',
    label: 'Robot',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Sparky&backgroundColor=ffdfbf',
  },
  {
    id: 'lucky',
    label: 'Cyber',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Lucky&backgroundColor=b6e3f4',
  },
  {
    id: 'happy',
    label: 'Emoji',
    url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Happy&backgroundColor=ffd5dc',
  },
];

export default function SettingsView() {
  const { user, updateUser, logout } = useAuth();
  const { toast, showConfirm } = useToast();
  const [name, setName] = useState(user?.name || '');
  const [timezone, setTimezone] = useState(user?.timezone || 'Asia/Kolkata');
  const [avatar, setAvatar] = useState(user?.avatar || 'initials');
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);

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
      setAvatar(user.avatar || 'initials');
    }
  }, [user]);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file (PNG, JPG, WEBP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size should be under 10MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // High quality client-side crop & resize to 256x256
        const canvas = document.createElement('canvas');
        const maxSize = 256;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
        setAvatar(dataUrl);
        toast.info('Photo selected! Click "Save Changes" to apply.');
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleToggle = (key, currentVal, setter) => {
    const nextVal = !currentVal;
    setter(nextVal);
    localStorage.setItem(key, String(nextVal));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);

    try {
      const res = await api.put('/auth/me', {
        name: name.trim(),
        timezone,
        avatar,
      });

      if (res.data?.data) {
        updateUser(res.data.data);
      }

      toast.success('Profile updated successfully!');
    } catch (err) {
      console.error('Update profile error:', err);
      toast.error(err.response?.data?.message || 'Failed to update profile.', 'Save Failed');
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
            {/* Avatar Management: Live Preview + Media Upload + Cartoon Presets + Initials */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2.5 uppercase tracking-wider">
                Profile Photo & Avatar
              </label>

              {/* Preview and Upload Action Card */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-4">
                <div className="relative inline-block self-start sm:self-auto group">
                  <UserAvatar
                    avatarUrl={avatar}
                    name={name}
                    size="xl"
                    showRing
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-md active:scale-95 transition"
                    title="Upload photo from device"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex-1 min-w-[200px]">
                  <h4 className="font-bold text-slate-900 text-sm">
                    {avatar === 'initials'
                      ? "Name's First Letter (Initial)"
                      : avatar?.startsWith('data:')
                      ? 'Custom Uploaded Photo'
                      : 'Cartoon Avatar Preset'}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    Upload an image from your device, pick a cartoon character, or use your name's initial letter.
                  </p>

                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:text-blue-600 hover:border-blue-300 shadow-xs transition"
                    >
                      <Upload className="w-3.5 h-3.5 text-blue-600" />
                      <span>Upload Photo</span>
                    </button>

                    {avatar !== 'initials' && (
                      <button
                        type="button"
                        onClick={() => setAvatar('initials')}
                        className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 transition"
                      >
                        Use First Letter
                      </button>
                    )}
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Cartoon Avatars & Initials Option Picker */}
              <div>
                <span className="block text-xs font-bold text-slate-500 mb-2.5 uppercase tracking-wide">
                  Or Choose A Cartoon / Initial Style:
                </span>
                <div className="flex flex-wrap items-center gap-3">
                  {/* Name Initial Option */}
                  <button
                    type="button"
                    onClick={() => setAvatar('initials')}
                    className={`flex flex-col items-center gap-1 p-1 rounded-2xl transition-all ${
                      avatar === 'initials'
                        ? 'ring-4 ring-blue-600 scale-105 shadow-md bg-blue-50/50'
                        : 'opacity-80 hover:opacity-100 hover:scale-105'
                    }`}
                    title="Use first letter of your name"
                  >
                    <UserAvatar
                      avatarUrl="initials"
                      name={name}
                      size="lg"
                    />
                    <span className="text-[10px] font-bold text-slate-600">Initial</span>
                  </button>

                  {/* Cartoon Character Presets */}
                  {cartoonAvatarPresets.map((preset) => (
                    <button
                      type="button"
                      key={preset.id}
                      onClick={() => setAvatar(preset.url)}
                      className={`flex flex-col items-center gap-1 p-1 rounded-2xl transition-all ${
                        avatar === preset.url
                          ? 'ring-4 ring-blue-600 scale-105 shadow-md bg-blue-50/50'
                          : 'opacity-80 hover:opacity-100 hover:scale-105'
                      }`}
                      title={preset.label}
                    >
                      <img
                        src={preset.url}
                        alt={preset.label}
                        className="w-12 h-12 rounded-full object-cover bg-slate-100 border border-slate-200/80 shadow-xs"
                      />
                      <span className="text-[10px] font-bold text-slate-600">{preset.label}</span>
                    </button>
                  ))}
                </div>
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
                  showConfirm({
                    title: 'Reload App Cache?',
                    message: 'This will refresh the page and clean up any temporary client session cache.',
                    confirmText: 'Reload Now',
                    cancelText: 'Cancel',
                    isDestructive: false,
                    onConfirm: () => window.location.reload(),
                  });
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition active:scale-95"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload App Cache</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  showConfirm({
                    title: 'Sign Out?',
                    message: 'Are you sure you want to log out of StreakUp? You will need to sign in again to access your habits.',
                    confirmText: 'Sign Out',
                    cancelText: 'Stay Signed In',
                    isDestructive: true,
                    onConfirm: () => logout(),
                  });
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition active:scale-95"
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
