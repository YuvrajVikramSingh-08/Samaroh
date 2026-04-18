import React from 'react';
import { useApp } from '../context/AppContext';

export const Banner = () => {
  const { notifications } = useApp();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-0 left-0 w-full z-50 pointer-events-none flex flex-col items-center gap-2 pt-4">
      {notifications.map(n => (
        <div key={n.id} className="bg-primary/90 text-white px-6 py-3 rounded-full shadow-lg font-body flex items-center gap-3 animate-slide-down">
          <span>{n.message}</span>
        </div>
      ))}
    </div>
  );
};

export const Card = ({ children, className = '' }) => (
  <div className={`bg-background-lighter p-4 glow-border ${className}`}>
    {children}
  </div>
);

export const Button = ({ children, onClick, variant = 'primary', className = '' }) => {
  const baseClass = "px-4 py-2 rounded font-body font-semibold transition-colors duration-200";
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-hover",
    secondary: "bg-gray-700 text-white hover:bg-gray-600",
    outline: "border border-primary text-primary hover:bg-primary/10",
    danger: "bg-warning text-white hover:bg-orange-600"
  };
  return (
    <button onClick={onClick} className={`${baseClass} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

export const Input = ({ ...props }) => (
  <input 
    className="w-full bg-background border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-primary transition-colors"
    {...props}
  />
);

export const Badge = ({ children, type = 'default' }) => {
  const colors = {
    default: 'bg-gray-700 text-gray-200',
    success: 'bg-green-500/20 text-green-400',
    warning: 'bg-orange-500/20 text-orange-400',
    danger: 'bg-red-500/20 text-red-400',
    primary: 'bg-primary/20 text-primary-light'
  };
  return (
    <span className={`text-xs px-2 py-1 rounded-full ${colors[type]}`}>
      {children}
    </span>
  );
};
