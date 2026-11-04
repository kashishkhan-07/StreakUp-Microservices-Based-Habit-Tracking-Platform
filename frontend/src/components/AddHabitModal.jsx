import React, { useState } from 'react';
import { X, Sparkles, Smile } from 'lucide-react';
import HabitIcon, { ICON_REGISTRY, detectIconFromTitle, isEmoji } from './HabitIcon';

const popularEmojis = ['🧘', '🎸', '💻', '🥦', '🏃', '🚴', '🎨', '🐶', '💰', '☕', '📚', '💤', '🪴', '✍️', '🏊'];

export default function AddHabitModal({ isOpen, onClose, onSave, defaultType = 'positive' }) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState(defaultType);
  const [selectedIcon, setSelectedIcon] = useState('water');
  const [customEmoji, setCustomEmoji] = useState('');
  const [category, setCategory] = useState('health');
  const [useEmojiTab, setUseEmojiTab] = useState(false);

  if (!isOpen) return null;

  const handleTitleChange = (e) => {
    const val = e.target.value;
    setTitle(val);

    // Auto-detect icon if user hasn't typed a custom emoji
    if (!customEmoji) {
      const detected = detectIconFromTitle(val);
      if (detected) {
        setSelectedIcon(detected);
        if (ICON_REGISTRY[detected]?.category) {
          setCategory(ICON_REGISTRY[detected].category);
        }
      }
    }
  };

  const handleEmojiSelect = (emoji) => {
    setCustomEmoji(emoji);
    setSelectedIcon(emoji);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Use emoji if provided, otherwise selected icon key
    const finalIcon = customEmoji.trim() || selectedIcon || 'sparkles';

    onSave({
      title: title.trim(),
      type,
      icon: finalIcon,
      category,
    });

    setTitle('');
    setCustomEmoji('');
    setSelectedIcon('water');
    onClose();
  };

  const currentIconToRender = customEmoji.trim() || selectedIcon;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-blue-50 text-blue-600">
              <Sparkles className="w-5 h-5" />
            </span>
            <h3 className="font-bold text-lg text-slate-900">Create New Habit</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title with Live Preview Badge */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">
              Habit Title
            </label>
            <div className="flex items-center gap-2.5">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100/80 shadow-sm">
                <HabitIcon icon={currentIconToRender} title={title || 'New Habit'} type={type} />
              </div>
              <input
                type="text"
                placeholder="e.g. Guitar Practice, Learn Python, 10k Steps"
                value={title}
                onChange={handleTitleChange}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                required
              />
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              💡 As you type, StreakUp will intelligently auto-match the best icon!
            </span>
          </div>

          {/* Type & Category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="positive">Positive (Build Routine)</option>
                <option value="negative">Negative (Avoid / Quit)</option>
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

          {/* Icon Selection Modes: Icon Library vs Custom Emoji */}
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
              /* Grid of 25+ Built-in Icons */
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
              /* Custom Emoji Picker & Input */
              <div className="space-y-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">Quick Emojis:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {popularEmojis.map((em) => (
                      <button
                        type="button"
                        key={em}
                        onClick={() => handleEmojiSelect(em)}
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

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
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
              Save Habit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
