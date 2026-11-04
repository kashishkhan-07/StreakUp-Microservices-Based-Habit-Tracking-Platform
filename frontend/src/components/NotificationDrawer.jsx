import React, { useState, useEffect } from 'react';
import {
  X,
  Bell,
  Check,
  Share2,
  Sparkles,
  Flame,
  CheckCheck,
  Calendar
} from 'lucide-react';
import api from '../api/client';

export default function NotificationDrawer({ isOpen, onClose, onNotificationUpdate }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

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

  const handleShare = (notification) => {
    const textToShare = `🎯 ${notification.title}\n"${notification.message}"\n\nTracked on StreakUp — Consistency is compounding! 🔥`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToShare);
      setCopiedId(notification._id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/30 backdrop-blur-sm flex justify-end animate-in fade-in">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-100 animate-in slide-in-from-right duration-200">

        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Notifications</h3>
              <p className="text-xs text-slate-400">Milestones & Streak alerts</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3.5">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <span className="text-xs text-slate-400 font-semibold">Loading alerts...</span>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 mx-auto mb-3">
                <Bell className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-700 text-sm">No notifications yet</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-[220px] mx-auto">
                Complete your daily habits to trigger real-time milestone achievements!
              </p>
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item._id}
                className={`p-4 rounded-2xl border transition-all ${
                  item.isRead
                    ? 'bg-white border-slate-100'
                    : 'bg-blue-50/40 border-blue-100 shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-900 text-xs sm:text-sm">
                        {item.title}
                      </h5>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {item.message}
                      </p>
                      <span className="text-[10px] text-slate-400 font-medium mt-2 block">
                        {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {!item.isRead && (
                    <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-1" />
                  )}
                </div>

                {/* Actions: Share & Mark Read */}
                <div className="flex items-center justify-end gap-2 mt-3 pt-2.5 border-t border-slate-100/70">
                  <button
                    onClick={() => handleShare(item)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-blue-700 hover:bg-blue-50 transition"
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
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 text-center">
          <p className="text-[11px] text-slate-400 font-medium">
            Powered by RabbitMQ Event-Driven Microservices
          </p>
        </div>

      </div>
    </div>
  );
}