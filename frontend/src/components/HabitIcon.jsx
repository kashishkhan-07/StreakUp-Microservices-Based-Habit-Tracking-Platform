import React from 'react';
import {
  GlassWater,
  BookOpen,
  Dumbbell,
  Ban,
  WineOff,
  Laptop,
  Code,
  Moon,
  Sun,
  Flame,
  Music,
  Apple,
  Utensils,
  Coins,
  Coffee,
  Heart,
  Smile,
  Footprints,
  Pencil,
  Brain,
  Target,
  Sparkles,
  Clock,
  Bike,
  Gamepad2,
  Tv,
  CheckCircle2,
  Zap,
  Shield,
  Star
} from 'lucide-react';

export const ICON_REGISTRY = {
  // Health & Wellness
  water: { label: 'Water Cup', icon: GlassWater, category: 'health', emoji: '💧' },
  workout: { label: 'Workout / Gym', icon: Dumbbell, category: 'fitness', emoji: '🏋️' },
  run: { label: 'Running / Jogging', icon: Flame, category: 'fitness', emoji: '🏃' },
  walk: { label: 'Walking / Steps', icon: Footprints, category: 'fitness', emoji: '🚶' },
  bike: { label: 'Cycling', icon: Bike, category: 'fitness', emoji: '🚴' },
  sleep: { label: 'Sleep / Rest', icon: Moon, category: 'health', emoji: '😴' },
  morning: { label: 'Early Morning', icon: Sun, category: 'productivity', emoji: '🌅' },
  food: { label: 'Healthy Diet', icon: Apple, category: 'health', emoji: '🥗' },
  cooking: { label: 'Cooking', icon: Utensils, category: 'health', emoji: '🍳' },
  coffee: { label: 'Coffee / Tea', icon: Coffee, category: 'health', emoji: '☕' },
  heart: { label: 'Self-Care', icon: Heart, category: 'health', emoji: '❤️' },

  // Learning & Productivity
  book: { label: 'Reading Books', icon: BookOpen, category: 'learning', emoji: '📚' },
  code: { label: 'Coding / Programming', icon: Code, category: 'learning', emoji: '💻' },
  laptop: { label: 'Deep Work', icon: Laptop, category: 'productivity', emoji: '💼' },
  brain: { label: 'Meditation / Focus', icon: Brain, category: 'mindfulness', emoji: '🧘' },
  pencil: { label: 'Journaling / Writing', icon: Pencil, category: 'productivity', emoji: '✍️' },
  clock: { label: 'Time Management', icon: Clock, category: 'productivity', emoji: '⏱️' },
  target: { label: 'Goal Milestone', icon: Target, category: 'productivity', emoji: '🎯' },

  // Lifestyle & Hobbies
  music: { label: 'Music / Instruments', icon: Music, category: 'other', emoji: '🎸' },
  coins: { label: 'Saving Money', icon: Coins, category: 'productivity', emoji: '💰' },
  smile: { label: 'Gratitude / Positivity', icon: Smile, category: 'mindfulness', emoji: '😊' },
  sparkles: { label: 'Clean Space / Chores', icon: Sparkles, category: 'productivity', emoji: '✨' },
  star: { label: 'Special Routine', icon: Star, category: 'other', emoji: '⭐' },
  zap: { label: 'High Energy', icon: Zap, category: 'productivity', emoji: '⚡' },

  // Negative / Avoid Habits
  smoke: { label: 'Quit Smoking', icon: Ban, category: 'health', emoji: '🚭' },
  drink: { label: 'Quit Alcohol', icon: WineOff, category: 'health', emoji: '🍺' },
  gaming: { label: 'Limit Gaming', icon: Gamepad2, category: 'productivity', emoji: '🎮' },
  screen: { label: 'Limit Screen / TV', icon: Tv, category: 'productivity', emoji: '📺' },
};

// Smart title-to-icon matcher
export const detectIconFromTitle = (title = '') => {
  const t = title.toLowerCase();
  if (t.includes('water') || t.includes('drink') || t.includes('hydrate') || t.includes('pani')) return 'water';
  if (t.includes('read') || t.includes('book') || t.includes('study') || t.includes('padhna')) return 'book';
  if (t.includes('gym') || t.includes('workout') || t.includes('exercise') || t.includes('pushup')) return 'workout';
  if (t.includes('run') || t.includes('jog')) return 'run';
  if (t.includes('walk') || t.includes('step') || t.includes('tahlna')) return 'walk';
  if (t.includes('cycle') || t.includes('bike')) return 'bike';
  if (t.includes('code') || t.includes('programming') || t.includes('developer') || t.includes('git')) return 'code';
  if (t.includes('sleep') || t.includes('soye') || t.includes('rest') || t.includes('bed')) return 'sleep';
  if (t.includes('meditat') || t.includes('dhyan') || t.includes('yoga') || t.includes('mindful')) return 'brain';
  if (t.includes('journal') || t.includes('write') || t.includes('dairy') || t.includes('diary')) return 'pencil';
  if (t.includes('diet') || t.includes('fruit') || t.includes('salad') || t.includes('eat') || t.includes('food')) return 'food';
  if (t.includes('music') || t.includes('guitar') || t.includes('piano') || t.includes('sing')) return 'music';
  if (t.includes('smoke') || t.includes('cigarette') || t.includes('sutta') || t.includes('bidi')) return 'smoke';
  if (t.includes('alcohol') || t.includes('beer') || t.includes('wine') || t.includes('sharab')) return 'drink';
  if (t.includes('money') || t.includes('save') || t.includes('budget') || t.includes('invest') || t.includes('paisa')) return 'coins';
  if (t.includes('game') || t.includes('playstation') || t.includes('pubg')) return 'gaming';
  if (t.includes('clean') || t.includes('wash') || t.includes('room')) return 'sparkles';
  return null;
};

// Check if string contains an emoji
export const isEmoji = (str) => {
  if (!str) return false;
  // Common emoji unicode ranges
  return /\p{Extended_Pictographic}/u.test(str);
};

export default function HabitIcon({ icon, title = '', type = 'positive', className = 'w-5 h-5' }) {
  // 1. Direct Emoji support
  if (isEmoji(icon)) {
    return <span className="text-xl select-none leading-none flex items-center justify-center">{icon}</span>;
  }

  // 2. Icon Registry Match
  const entry = ICON_REGISTRY[icon];
  if (entry) {
    const Component = entry.icon;
    return <Component className={className} />;
  }

  // 3. Negative habit default fallback
  if (type === 'negative') {
    return <Ban className={className} />;
  }

  // 4. Stylish Initial Badge Fallback (First Letter of Habit Title)
  if (title && title.trim().length > 0) {
    const initial = title.trim().charAt(0).toUpperCase();
    return (
      <span className="font-extrabold text-sm sm:text-base leading-none select-none tracking-tight">
        {initial}
      </span>
    );
  }

  // 5. Ultimate Fallback
  return <Sparkles className={className} />;
}
