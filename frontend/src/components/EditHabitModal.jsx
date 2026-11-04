import React, { useState, useEffect } from 'react';
import { X, Edit2, Sparkles } from 'lucide-react';
import HabitIcon, { ICON_REGISTRY, isEmoji } from './HabitIcon';

const popularEmojis = ['🧘', '🎸', '💻', '🥦', '🏃', '🚴', '🎨', '🐶', '💰', '☕', '📚', '💤', '🪴', '✍️', '🏊'];

export default function EditHabitModal({ isOpen, habit, onClose, onUpdate }) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('positive');
  const [selectedIcon, setSelectedIcon] = useState('water');
  const [customEmoji, setCustomEmoji] = useState('');
  const [category, setCategory] = useState('health');
  const [useEmojiTab, setUseEmojiTab] = useState(false);

  useEffect(() => {
    if (habit) {
      setTitle(habit.title || '');
      setType(habit.type || 'positive');
      setCategory(habit.category || 'health');

      if (isEmoji(habit.icon)) {
        setCustomEmoji(habit.icon);
        setSelectedIcon(habit.icon);
        setUseEmojiTab(true);
      } else {
        setSelectedIcon(habit.icon || 'water');
        setCustomEmoji('');
        setUseEmojiTab(false);
      }
    }
  }, [habit]);

  if (!isOpen || !habit) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const finalIcon = customEmoji.trim() || selectedIcon || 'sparkles';

    onUpdate(habit._id || habit.id, {
      title: title.trim(),
      type,
      icon: finalIcon,
      category,
    });
    onClose();
  };

  const currentIconToRender = customEmoji.trim() || selectedIcon;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-2">
            <Edit2 className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-lg text-slate-900">Edit Habit</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">
              Habit Title
            </label>
            <div className="flex items-center gap-2.5">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100/80 shadow-sm">
                <HabitIcon icon={currentIconToRender} title={title || 'Habit'} type={type} />
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="positive">Positive (Build Routine)</option>
                <option value="negative">Negative (Avoid / Break)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="health">Health</option>
                <option value="fitness">Fitness</option>
                <option value="productivity">Productivity</option>
                <option value="learning">Learning</option>
                <option value="mindfulness">Mindfulness</option>
                <option value="other">Other / Custom</option>
              </select>
            </div>
          </div>

          {/* Icon Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-700 uppercase">
                Choose Icon or Any Emoji
              </label>
              <div className="flex p-0.5 bg-slate-100 rounded-lg text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setUseEmojiTab(false)}
                  className={`px-2.5 py-1 rounded-md transition ${
                    !useEmojiTab ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  Icon Library
                </button>
                <button
                  type="button"
                  onClick={() => setUseEmojiTab(true)}
                  className={`px-2.5 py-1 rounded-md transition ${
                    useEmojiTab ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  Custom Emoji
                </button>
              </div>
            </div>

            {!useEmojiTab ? (
              <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 p-3 bg-slate-50 rounded-2xl max-h-44 overflow-y-auto border border-slate-100">
                {Object.entries(ICON_REGISTRY).map(([key, item]) => {
                  const IconComp = item.icon;
                  const isSelected = selectedIcon === key && !customEmoji;
                  return (
                    <button
                      type="button"
                      key={key}
                      onClick={() => {
                        setSelectedIcon(key);
                        setCustomEmoji('');
                      }}
                      title={item.label}
                      className={`p-2 rounded-xl flex items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-md scale-105'
                          : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-100'
                      }`}
                    >
                      <IconComp className="w-5 h-5" />
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">Quick Emojis:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {popularEmojis.map((em) => (
                      <button
                        type="button"
                        key={em}
                        onClick={() => {
                          setCustomEmoji(em);
                          setSelectedIcon(em);
                        }}
                        className={`w-8 h-8 rounded-xl flex items-center justify-center text-lg transition ${
                          customEmoji === em
                            ? 'bg-blue-600 shadow-sm scale-110 ring-2 ring-blue-400'
                            : 'bg-white hover:bg-slate-200'
                        }`}
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center gap-2">
                  <input
                    type="text"
                    maxLength={2}
                    value={customEmoji}
                    onChange={(e) => {
                      setCustomEmoji(e.target.value);
                      setSelectedIcon(e.target.value);
                    }}
                    placeholder="Type or paste any emoji (e.g. 🧘, 🎸, 🚀)"
                    className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {customEmoji && (
                    <button
                      type="button"
                      onClick={() => {
                        setCustomEmoji('');
                        setSelectedIcon('water');
                      }}
                      className="text-xs text-slate-400 hover:text-slate-600 font-semibold px-2"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 text-sm font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#1E40AF] hover:bg-blue-800 text-white rounded-xl text-sm font-semibold shadow-sm transition active:scale-95"
            >
              Update Habit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
