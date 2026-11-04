import React, { useState } from 'react';
import {
  Lightbulb,
  Sparkles,
  Zap,
  Layers,
  Clock,
  Compass,
  CheckCircle2,
  Copy,
  Check,
  ShieldCheck,
  Heart
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function TipsView() {
  const { toast } = useToast();
  const [currentTrigger, setCurrentTrigger] = useState('Pouring my morning coffee');
  const [currentAction, setCurrentAction] = useState('Drink a tall glass of water');
  const [copied, setCopied] = useState(false);

  const tipsList = [
    {
      id: 'tip-1',
      title: 'The 2-Minute Rule',
      category: 'Starting Friction',
      icon: Clock,
      color: 'bg-blue-50 text-blue-600',
      summary: 'When you start a new habit, it should take less than two minutes to do.',
      detail:
        'Make the initial action so effortless that you cannot say no. "Read before bed" becomes "Read one page." "Do 30 mins yoga" becomes "Unroll my yoga mat." Once you begin, continuation is natural.',
    },
    {
      id: 'tip-2',
      title: 'Habit Stacking',
      category: 'Cue Identification',
      icon: Layers,
      color: 'bg-indigo-50 text-indigo-600',
      summary: 'Tie a new desired habit directly to a routine you already do without thinking.',
      detail:
        'Formula: "After [CURRENT HABIT], I will [NEW HABIT]." For example: After I brush my teeth, I will write down my 3 top daily priorities.',
    },
    {
      id: 'tip-3',
      title: 'Never Miss Twice',
      category: 'Resilience Strategy',
      icon: ShieldCheck,
      color: 'bg-emerald-50 text-emerald-600',
      summary: 'Missing one day is an accident. Missing two days is the start of a new bad habit.',
      detail:
        'Life happens and bad days occur. The difference between champions and average performers is recovering immediately on Day 2, even if you only do 20% of your routine.',
    },
    {
      id: 'tip-4',
      title: 'Environment Architecture',
      category: 'Willpower Defense',
      icon: Compass,
      color: 'bg-amber-50 text-amber-600',
      summary: 'Do not rely on willpower. Design your surroundings to make cues obvious.',
      detail:
        'Want to drink more water? Place filled bottles on your desk and kitchen counter. Want to stop checking social media first thing in the morning? Charge your phone in another room.',
    },
    {
      id: 'tip-5',
      title: 'Temptation Bundling',
      category: 'Dopamine Alignment',
      icon: Zap,
      color: 'bg-purple-50 text-purple-600',
      summary: 'Pair an action you need to do with an action you love to do.',
      detail:
        'Only listen to your favorite thrilling podcast while running on the treadmill. Only drink your favorite iced matcha while reviewing your weekly budget.',
    },
    {
      id: 'tip-6',
      title: 'Identity-Shift Thinking',
      category: 'Long-term Psychology',
      icon: Heart,
      color: 'bg-rose-50 text-rose-600',
      summary: 'Focus on WHO you wish to become, rather than WHAT you want to achieve.',
      detail:
        'Every action is a vote for the type of person you want to be. Instead of saying "I am trying to run a 5K", tell yourself "I am a runner who never skips training."',
    },
  ];

  const handleCopy = () => {
    const text = `Habit Stack: After I [${currentTrigger}], I will [${currentAction}].`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Habit Stack formula copied to clipboard! 📋');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Tips Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-slate-900/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-xl bg-white/10 backdrop-blur-md">
              <Lightbulb className="w-5 h-5 text-yellow-300" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
              Science of Behavior
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Habit Mastery & Atomic Principles
          </h1>
          <p className="text-slate-300 text-sm mt-1 max-w-xl">
            Proven behavioral psychology frameworks to eliminate friction, sustain automatic streaks, and overcome procrastination.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/15 p-4 rounded-2xl max-w-xs text-xs text-indigo-100/90 leading-relaxed shrink-0">
          <p className="font-bold text-white mb-1 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-yellow-300" /> Golden Rule:
          </p>
          "You do not rise to the level of your goals. You fall to the level of your systems."
        </div>
      </div>

      {/* Interactive Habit Stacking Equation Builder */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600" />
              <span>Interactive Habit Stack Builder</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Anchor your new habit to an automatic existing behavioral trigger.
            </p>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs transition active:scale-95"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Equation!' : 'Copy Formula'}</span>
          </button>
        </div>

        <div className="bg-slate-50 rounded-2xl p-4 sm:p-6 border border-slate-100 mb-4">
          <div className="flex flex-col md:flex-row items-center gap-3 text-sm font-semibold text-slate-700">
            <span className="text-slate-400 font-extrabold uppercase text-xs">AFTER I:</span>
            <input
              type="text"
              value={currentTrigger}
              onChange={(e) => setCurrentTrigger(e.target.value)}
              className="flex-1 px-4 py-2 bg-white rounded-xl border border-slate-200 text-blue-700 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="e.g. Turn off my morning alarm"
            />
            <span className="text-slate-400 font-extrabold uppercase text-xs">I WILL:</span>
            <input
              type="text"
              value={currentAction}
              onChange={(e) => setCurrentAction(e.target.value)}
              className="flex-1 px-4 py-2 bg-white rounded-xl border border-slate-200 text-emerald-700 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              placeholder="e.g. Do 10 bodyweight squats"
            />
          </div>
        </div>
      </div>

      {/* Grid of Core Behavioral Principles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {tipsList.map((tip) => {
          const Icon = tip.icon;
          return (
            <div
              key={tip.id}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${tip.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                    {tip.category}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base mb-1.5">{tip.title}</h3>
                <p className="text-xs font-semibold text-slate-600 mb-3">{tip.summary}</p>
                <p className="text-xs text-slate-400 leading-relaxed">{tip.detail}</p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100/80 flex items-center justify-between text-[11px] text-blue-600 font-bold">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" /> Actionable Habit Hack
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
