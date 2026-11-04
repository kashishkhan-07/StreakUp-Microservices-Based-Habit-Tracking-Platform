import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['milestone', 'reminder', 'system', 'achievement', 'streak', 'quest'],
      default: 'milestone',
    },
    icon: {
      type: String,
      default: '🎯',
    },
    level: {
      type: String,
      default: null,
    },
    xpEarned: {
      type: Number,
      default: 20,
    },
    habitTitle: {
      type: String,
      default: null,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({ userId: 1, isRead: 1 });

export const Notification = mongoose.model('Notification', notificationSchema);