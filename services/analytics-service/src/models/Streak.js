import mongoose from 'mongoose';

const streakSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    habitId: {
      type: String,
      required: true,
      index: true,
    },
    currentStreak: {
      type: Number,
      default: 0,
    },
    longestStreak: {
      type: Number,
      default: 0,
    },
    totalCompletions: {
      type: Number,
      default: 0,
    },
    lastCompletedDate: {
      type: String, // 'YYYY-MM-DD'
    },
  },
  {
    timestamps: true,
  }
);

streakSchema.index({ userId: 1, habitId: 1 }, { unique: true });

export const Streak = mongoose.model('Streak', streakSchema);