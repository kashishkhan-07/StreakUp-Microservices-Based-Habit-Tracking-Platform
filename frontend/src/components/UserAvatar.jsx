import React, { useState, useEffect } from 'react';

/**
 * UserAvatar - Renders user profile picture, cartoon avatar preset, or fallback
 * to a stylish name initial badge (e.g. "A" for Alex).
 */
export default function UserAvatar({
  user,
  avatarUrl,
  name: nameProp,
  size = 'md',
  className = '',
  showRing = false,
}) {
  const [imageError, setImageError] = useState(false);

  const displayName = nameProp || user?.name || 'User';
  const firstLetter = displayName.trim().charAt(0).toUpperCase() || 'U';
  const effectiveAvatar = avatarUrl !== undefined ? avatarUrl : user?.avatar;

  // Reset error state when avatar changes
  useEffect(() => {
    setImageError(false);
  }, [effectiveAvatar]);

  const sizeClasses = {
    xs: 'w-7 h-7 text-xs',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base font-bold',
    xl: 'w-16 h-16 sm:w-20 sm:h-20 text-2xl font-bold',
    '2xl': 'w-24 h-24 text-3xl font-extrabold',
  }[size] || 'w-10 h-10 text-sm';

  // Deterministic pleasant gradient colors based on initial letter
  const gradients = [
    'from-blue-600 to-indigo-600',
    'from-indigo-600 to-purple-600',
    'from-emerald-500 to-teal-700',
    'from-rose-500 to-pink-600',
    'from-amber-500 to-orange-600',
    'from-cyan-600 to-blue-700',
    'from-violet-600 to-fuchsia-700',
  ];
  const charCode = firstLetter.charCodeAt(0) || 0;
  const gradient = gradients[charCode % gradients.length];

  const isInitials =
    !effectiveAvatar ||
    effectiveAvatar === 'initials' ||
    imageError;

  if (isInitials) {
    return (
      <div
        className={`${sizeClasses} rounded-full bg-gradient-to-br ${gradient} text-white font-black flex items-center justify-center shadow-xs select-none shrink-0 ${
          showRing ? 'ring-4 ring-blue-500/30' : ''
        } ${className}`}
        title={displayName}
      >
        <span>{firstLetter}</span>
      </div>
    );
  }

  return (
    <img
      src={effectiveAvatar}
      alt={displayName}
      onError={() => setImageError(true)}
      className={`${sizeClasses} rounded-full object-cover border border-slate-200/80 shadow-xs shrink-0 bg-slate-50 ${
        showRing ? 'ring-4 ring-blue-500/30' : ''
      } ${className}`}
    />
  );
}
