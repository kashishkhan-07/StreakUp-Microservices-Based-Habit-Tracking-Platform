import mongoose from 'mongoose';

const completionSchema = new mongoose.Schema(
  {
    habitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Habit',
      required: [true, 'Habit ID is required'],
      index: true,
    },
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      index: true,
    },
    // Stored as 'YYYY-MM-DD' representing the user's local date
    date: {
      type: String,
      required: [true, 'Date (YYYY-MM-DD) is required'],
      match: [/^\d{4}-\d{2}-\d{2}$/, 'Date must be in format YYYY-MM-DD'],
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// CRITICAL: Guarantees no duplicate completions for the same habit on the same date!
completionSchema.index({ habitId: 1, date: 1 }, { unique: true });
// Compound index for user query by date range
completionSchema.index({ userId: 1, date: 1 });

export const Completion = mongoose.model('Completion', completionSchema);