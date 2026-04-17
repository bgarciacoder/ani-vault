import React from 'react';

export function Button({
  children,
  variant = 'primary',
  type = 'button',
  disabled,
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'watched' | 'pending' | 'onhold' | 'cancelled' | 'following';
  type?: 'button' | 'submit' | 'reset';
  className?: string,
  disabled?: boolean;
  onClick?: () => void;
}) {
  const base =
    'inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60';
  const styles =
    variant === 'primary'
      ? 'bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white'
      : variant === 'danger'
      ? 'bg-rose-600 text-white hover:bg-rose-700'
      : variant === 'watched' 
      ? 'bg-emerald-100 text-emerald-800 border-2 border-slate-500 font-semibold dark:bg-emerald-950 dark:text-emerald-200 dark:border-slate-700'
      : variant === 'pending'
      ? 'bg-slate-100 text-slate-800 border-2 border-slate-500 font-semibold dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700'
      : variant === 'onhold'
      ? 'bg-amber-100 text-amber-800 border-2 border-slate-500 font-semibold dark:bg-amber-950 dark:text-amber-200 dark:border-slate-700'
      : variant === 'cancelled'
      ? 'bg-rose-100 text-rose-800 border-2 border-slate-500 font-semibold dark:bg-rose-950 dark:text-rose-200 dark:border-slate-700'
      : variant === 'following'
      ? 'bg-sky-100 text-sky-800 border-2 border-slate-500 font-semibold dark:bg-sky-950 dark:text-sky-200 dark:border-slate-700'
      : 'border border-slate-300 bg-white text-slate-800 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800';
  
  return (
    <button type={type} disabled={disabled} onClick={onClick} className={[base, styles, className].join(' ')}>
      {children}
    </button>
  );
}

