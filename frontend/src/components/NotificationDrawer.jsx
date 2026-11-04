import React, { useState, useEffect } from 'react';
import {
  X,
  Bell,
  Check,
  Share2,
  Sparkles,
  Flame,
  CheckCheck,
  Trash2,
  Zap,
  Award,
} from 'lucide-react';
import api from '../api/client';
import { useToast } from '../context/ToastContext';

export default function NotificationDrawer({ isOpen, onClose, onNotificationUpdate }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const toast = useToast();

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.get('/notifications');
      if (res.data?.data) {
        setNotifications(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`, {});
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      if (onNotificationUpdate) onNotificationUpdate();
    } catch (err) {
      console.error('Failed to mark read:', err.message);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all', {});
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      toast.success('All notifications marked as read');
      if (onNotificationUpdate) onNotificationUpdate();
    } catch (err) {
      console.error('Failed to mark all as read:', err.message);
      // Fallback: mark in UI
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    }
  };

  const handleClearAll = () => {
    toast.showConfirm({
      title: 'Clear Notifications',
      message: 'Are you sure you want to clear all notifications from your log?',
      confirmText: 'Clear All',
      confirmVariant: 'danger',
      onConfirm: async () => {
        try {
          await api.delete('/notifications/clear');
          setNotifications([]);
          toast.success('Notifications cleared');
          if (onNotificationUpdate) onNotificationUpdate();
        } catch (err) {
          console.error('Failed to clear notifications:', err.message);
          setNotifications([]);
        }
      },
    });
  };

  const handleShare = (notification) => {
    const safeIcon = notification.icon === '🌱' ? '🎯' : (notification.icon || '🎯');
    const safeTitle = (notification.title || '').replace(/🌱/g, '🎯').trim();
    const textToShare = `${safeIcon} ${safeTitle}\n"${notification.message}"\n\nTracked on StreakUp — 1% better every day! 🔥`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToShare);
      setCopiedId(notification._id);
      toast.info('Notification copied to clipboard! 📋');
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-sm flex justify-end animate-in fade-in">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-100 animate-in slide-in-from-right duration-200">

        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50/80 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shadow-xs">
              <Bell className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-base">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[11px] font-bold">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">Milestones & habit activity</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Bar (Mark all read & Clear) */}
        {notifications.length > 0 && (
          <div className="px-6 py-2.5 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between text-xs">
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-1.5 font-semibold text-blue-600 hover:text-blue-800 transition"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all as read</span>
            </button>
            <button
              onClick={handleClearAll}
              className="flex items-center gap-1 font-semibold text-slate-400 hover:text-rose-600 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3.5">
          {loading ? (
            <div className="text-center py-16">
              <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <span className="text-xs text-slate-400 font-semibold">Loading notifications...</span>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-3">
                <Bell className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-800 text-base">No notifications yet</h4>
              <p className="text-xs text-slate-500 mt-1.5 max-w-[260px] mx-auto leading-relaxed">
                Complete your daily habits to trigger real-time milestone achievements and streak rewards!
              </p>
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item._id}
                className={`p-4 rounded-2xl border transition-all ${
                  item.isRead
                    ? 'bg-white border-slate-100 hover:border-slate-200'
                    : 'bg-blue-50/30 border-blue-100 shadow-xs'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Emoji / Icon Box */}
                  <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-center shrink-0 text-xl shadow-xs">
                    {item.icon === '🌱' ? '🎯' : (item.icon || '🎯')}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Badge row: Level / Milestone */}
                    {item.level && (
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-[10px] font-bold">
                          {item.level}
                        </span>
                      </div>
                    )}

                    <h5 className="font-bold text-slate-900 text-xs sm:text-sm leading-snug">
                      {(item.title || '').replace(/🌱/g, '🎯').trim()}
                    </h5>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {item.message}
                    </p>
                    <span className="text-[10px] text-slate-400 font-medium mt-2 block">
                      {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Actions: Share & Mark Read */}
                <div className="flex items-center justify-end gap-2 mt-3 pt-2.5 border-t border-slate-100/70">
                  <button
                    onClick={() => handleShare(item)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition"
                  >
                    {copiedId === item._id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Share</span>
                      </>
                    )}
                  </button>

                  {!item.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(item._id)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>Mark read</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70 text-center">
          <p className="text-[11px] text-slate-500 font-medium flex items-center justify-center gap-1.5">
            <span>⚡ Driven by RabbitMQ Event-Bus</span>
            <span>•</span>
            <span>StreakUp 2026</span>
          </p>
        </div>

      </div>
    </div>
  );
}
