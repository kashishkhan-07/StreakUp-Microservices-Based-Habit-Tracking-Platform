import mongoose from 'mongoose';

const habitSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Habit title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    // Matches screenshot: 'positive' (build) vs 'negative' (quit/avoid)
    type: {
      type: String,
      enum: ['positive', 'negative'],
      default: 'positive',
      required: true,
    },
    category: {
      type: String,
      enum: ['health', 'fitness', 'productivity', 'learning', 'mindfulness', 'other'],
      default: 'health',
    },
    // Icon tag matching UI design (e.g. 'water', 'book', 'workout', 'smoke', 'drink')
    icon: {
      type: String,
      default: 'check',
    },
    color: {
      type: String,
      default: '#2563EB', // Blue
    },
    frequency: {
      type: {
        type: String,
        enum: ['daily', 'weekly', 'custom'],
        default: 'daily',
      },
      // Target completions per week (e.g., 3 for "3x per week" or 7 for "Daily")
      targetDaysPerWeek: {
        type: Number,
        default: 7,
      },
      // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
      daysOfWeek: {
        type: [Number],
        default: [0, 1, 2, 3, 4, 5, 6],
      },
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Fast compound lookup for active habits of a user
habitSchema.index({ userId: 1, isArchived: 1 });

export const Habit = mongoose.model('Habit', habitSchema);