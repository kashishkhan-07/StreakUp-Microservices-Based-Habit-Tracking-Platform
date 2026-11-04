import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Check,
  X,
  Heart,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function AuthPage() {
  const { login, register } = useAuth();
  const { toast } = useToast();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Live password validation checks
  const checks = {
    length: password.length >= 8,
    capital: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    match: isRegister ? password.length > 0 && password === confirmPassword : true,
  };

  const isPasswordValid = checks.length && checks.capital && checks.number && checks.special;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isRegister) {
      if (!isPasswordValid) {
        setError('Please meet all password requirements.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
    }

    setLoading(true);
    try {
      if (isRegister) {
        await register(name, email, password);
        toast.success(`Welcome to StreakUp, ${name}! 🚀`);
      } else {
        await login(email, password);
        toast.success('Signed in successfully! 👋');
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0] ||
        'Authentication failed. Please check your credentials.';
      setError(msg);
      toast.error(msg, isRegister ? 'Registration Failed' : 'Sign In Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6FB] flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">

      {/* Background Soft Ambient Light Circles */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-100/60 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Main Floating Card Container */}
      <div className="w-full max-w-[460px] bg-white rounded-[32px] p-8 sm:p-10 shadow-xl shadow-slate-200/60 border border-slate-100/80 transition-all">

        {/* Brand Header */}
        <div className="text-center mb-7">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 shadow-sm mb-4">
            <Heart className="w-6 h-6 fill-blue-600 text-blue-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            StreakUp
          </h1>
          <p className="text-sm text-slate-500 mt-1.5 font-medium">
            {isRegister
              ? 'Start building lasting habits today.'
              : 'Sign in to access your habit dashboard.'}
          </p>
        </div>

        {/* Tab Switcher (Pill Slider) */}
        <div className="flex p-1 bg-slate-100/80 rounded-2xl mb-6 border border-slate-200/40">
          <button
            type="button"
            onClick={() => { setIsRegister(false); setError(''); }}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
              !isRegister
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsRegister(true); setError(''); }}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
              isRegister
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert Banner */}
        {error && (
          <div className="mb-5 p-3.5 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <X className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Full Name (Signup only) */}
          {isRegister && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Alex Morgan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50/70 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition"
                  required
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="alex@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50/70 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-11 py-3 bg-slate-50/70 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password (Signup only) */}
          {isRegister && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-11 py-3 bg-slate-50/70 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none p-1"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Live Compact Password Requirements (Signup only) */}
          {isRegister && (
            <div className="pt-1 space-y-2">
              <div className="grid grid-cols-2 gap-1.5 text-[11px] font-semibold">
                <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition-all ${
                  checks.length ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}>
                  <Check className={`w-3 h-3 ${checks.length ? 'stroke-[3]' : 'opacity-30'}`} />
                  <span>8+ characters</span>
                </div>

                <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition-all ${
                  checks.capital ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}>
                  <Check className={`w-3 h-3 ${checks.capital ? 'stroke-[3]' : 'opacity-30'}`} />
                  <span>1 Capital (A-Z)</span>
                </div>

                <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition-all ${
                  checks.number ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}>
                  <Check className={`w-3 h-3 ${checks.number ? 'stroke-[3]' : 'opacity-30'}`} />
                  <span>1 Number (0-9)</span>
                </div>

                <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition-all ${
                  checks.special ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}>
                  <Check className={`w-3 h-3 ${checks.special ? 'stroke-[3]' : 'opacity-30'}`} />
                  <span>1 Symbol (!@#$)</span>
                </div>
              </div>

              {confirmPassword && (
                <div className={`text-[11px] font-semibold flex items-center gap-1 px-1 ${
                  checks.match ? 'text-emerald-600' : 'text-red-500'
                }`}>
                  {checks.match ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                  <span>{checks.match ? 'Passwords match' : 'Passwords do not match'}</span>
                </div>
              )}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || (isRegister && (!isPasswordValid || !checks.match))}
            className="w-full py-3.5 bg-[#1E40AF] hover:bg-[#1A3699] text-white rounded-2xl text-sm font-bold shadow-md shadow-blue-900/15 transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{isRegister ? 'Create Account' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Note */}
        <div className="mt-7 pt-5 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400 font-medium">
            Protected by JWT & Distributed Microservices
          </p>
        </div>

      </div>
    </div>
  );
}